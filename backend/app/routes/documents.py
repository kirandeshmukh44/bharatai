"""
Document management routes with file upload
"""
import os
import uuid
import magic
from flask import Blueprint, request, jsonify, send_from_directory, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.utils import secure_filename
from marshmallow import Schema, fields, validate, ValidationError

from app import db
from app.models import User, Supplier, Component, Document, AuditLog

documents_bp = Blueprint('documents', __name__)


# Configuration
ALLOWED_EXTENSIONS = {'pdf', 'png', 'jpg', 'jpeg'}
ALLOWED_MIME_TYPES = {
    'application/pdf',
    'image/png',
    'image/jpeg',
    'image/jpg'
}
MAX_FILE_SIZE = 16 * 1024 * 1024  # 16MB


# Schemas
class DocumentUploadSchema(Schema):
    document_type = fields.String(required=True, validate=validate.OneOf([
        'Company Registration', 'Product Certificate', 'Manufacturing Certificate',
        'Quality Certificate', 'Compliance Certificate', 'Origin Documentation', 'Other'
    ]))
    supplier_id = fields.Integer()
    component_id = fields.Integer()


class DocumentUpdateSchema(Schema):
    document_type = fields.String(validate=validate.OneOf([
        'Company Registration', 'Product Certificate', 'Manufacturing Certificate',
        'Quality Certificate', 'Compliance Certificate', 'Origin Documentation', 'Other'
    ]))
    verification_status = fields.String(validate=validate.OneOf(['pending', 'verified', 'rejected']))


document_upload_schema = DocumentUploadSchema()
document_update_schema = DocumentUpdateSchema()


def allowed_file(filename):
    """Check if file extension is allowed"""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


def secure_filename_uuid(filename):
    """Generate secure filename with UUID"""
    ext = filename.rsplit('.', 1)[1].lower() if '.' in filename else ''
    return f"{uuid.uuid4().hex}.{ext}"


def log_audit(action, entity_type=None, entity_id=None, old_values=None, new_values=None):
    """Helper to create audit log entry"""
    try:
        user_id = get_jwt_identity()
        log = AuditLog(
            user_id=user_id,
            action=action,
            entity_type=entity_type,
            entity_id=entity_id,
            old_values=old_values,
            new_values=new_values,
            ip_address=request.headers.get('X-Forwarded-For', request.remote_addr),
            user_agent=request.headers.get('User-Agent')
        )
        db.session.add(log)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        print(f"Audit logging error: {e}")


@documents_bp.route('', methods=['GET'])
@jwt_required()
def get_documents():
    """Get all documents with filtering"""
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    # Get query parameters
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)
    supplier_id = request.args.get('supplier_id', type=int)
    component_id = request.args.get('component_id', type=int)
    document_type = request.args.get('document_type')
    verification_status = request.args.get('verification_status')
    
    # Base query
    query = Document.query
    
    # Filter by organization through supplier for non-admin users
    if user.role != 'admin':
        query = query.join(Supplier).filter(Supplier.organization_id == user.organization_id)
    
    # Apply filters
    if supplier_id:
        query = query.filter_by(supplier_id=supplier_id)
    if component_id:
        query = query.filter_by(component_id=component_id)
    if document_type:
        query = query.filter_by(document_type=document_type)
    if verification_status:
        query = query.filter_by(verification_status=verification_status)
    
    # Order by upload date
    query = query.order_by(Document.uploaded_at.desc())
    
    # Paginate
    pagination = query.paginate(page=page, per_page=min(per_page, 100), error_out=False)
    
    # Build response with related entity names
    results = []
    for doc in pagination.items:
        data = doc.to_dict()
        if doc.supplier:
            data['supplier_name'] = doc.supplier.supplier_name
        if doc.component:
            data['component_name'] = doc.component.component_name
        results.append(data)
    
    return jsonify({
        'documents': results,
        'pagination': {
            'page': page,
            'per_page': per_page,
            'total': pagination.total,
            'pages': pagination.pages,
            'has_next': pagination.has_next,
            'has_prev': pagination.has_prev
        }
    }), 200


@documents_bp.route('/<int:document_id>', methods=['GET'])
@jwt_required()
def get_document(document_id):
    """Get document details"""
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    document = Document.query.get_or_404(document_id)
    
    # Check authorization
    if document.supplier and user.role != 'admin':
        if document.supplier.organization_id != user.organization_id:
            return jsonify({'message': 'Access denied'}), 403
    
    result = document.to_dict()
    if document.supplier:
        result['supplier_name'] = document.supplier.supplier_name
    if document.component:
        result['component_name'] = document.component.component_name
    
    return jsonify({'document': result}), 200


@documents_bp.route('/upload', methods=['POST'])
@jwt_required()
def upload_document():
    """Upload a new document"""
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    # Check if file is present
    if 'file' not in request.files:
        return jsonify({'message': 'No file provided'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'message': 'No file selected'}), 400
    
    # Validate form data
    form_data = {
        'document_type': request.form.get('document_type'),
        'supplier_id': request.form.get('supplier_id', type=int),
        'component_id': request.form.get('component_id', type=int)
    }
    
    try:
        data = document_upload_schema.load(form_data)
    except ValidationError as err:
        return jsonify({'message': 'Validation error', 'errors': err.messages}), 400
    
    # Validate file type
    if not allowed_file(file.filename):
        return jsonify({'message': 'File type not allowed. Allowed: PDF, PNG, JPG, JPEG'}), 400
    
    # Check file size
    file.seek(0, os.SEEK_END)
    file_size = file.tell()
    file.seek(0)
    
    if file_size > MAX_FILE_SIZE:
        return jsonify({'message': f'File too large. Maximum size: 16MB'}), 400
    
    # Verify supplier/component access if provided
    if data.get('supplier_id'):
        supplier = Supplier.query.get(data['supplier_id'])
        if not supplier:
            return jsonify({'message': 'Supplier not found'}), 404
        if user.role != 'admin' and supplier.organization_id != user.organization_id:
            return jsonify({'message': 'Access denied to this supplier'}), 403
    
    if data.get('component_id'):
        component = Component.query.get(data['component_id'])
        if not component:
            return jsonify({'message': 'Component not found'}), 404
        if user.role != 'admin' and component.supplier.organization_id != user.organization_id:
            return jsonify({'message': 'Access denied to this component'}), 403
    
    # Detect MIME type
    mime_type = magic.from_buffer(file.read(2048), mime=True)
    file.seek(0)
    
    if mime_type not in ALLOWED_MIME_TYPES:
        return jsonify({'message': 'Invalid file content type'}), 400
    
    # Generate secure filename
    original_filename = secure_filename(file.filename)
    stored_filename = secure_filename_uuid(original_filename)
    
    # Determine storage path
    storage_path = os.path.join(current_app.config['FILE_STORAGE_PATH'], stored_filename)
    
    try:
        # Save file
        file.save(storage_path)
        
        # Create database record
        document = Document(
            supplier_id=data.get('supplier_id'),
            component_id=data.get('component_id'),
            document_type=data['document_type'],
            original_filename=original_filename,
            stored_filename=stored_filename,
            storage_path=storage_path,
            mime_type=mime_type,
            file_size=file_size,
            uploaded_by=user_id
        )
        
        db.session.add(document)
        db.session.commit()
        
        # Log upload
        log_audit('document_uploaded', 'document', document.id, None, {
            'original_filename': original_filename,
            'document_type': data['document_type'],
            'file_size': file_size
        })
        
        return jsonify({
            'message': 'Document uploaded successfully',
            'document': document.to_dict()
        }), 201
        
    except Exception as e:
        # Clean up file if database operation fails
        if os.path.exists(storage_path):
            os.remove(storage_path)
        db.session.rollback()
        return jsonify({'message': 'Error uploading document', 'error': str(e)}), 500


@documents_bp.route('/<int:document_id>/download', methods=['GET'])
@jwt_required()
def download_document(document_id):
    """Download a document"""
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    document = Document.query.get_or_404(document_id)
    
    # Check authorization
    if document.supplier and user.role != 'admin':
        if document.supplier.organization_id != user.organization_id:
            return jsonify({'message': 'Access denied'}), 403
    
    # Check file exists
    if not os.path.exists(document.storage_path):
        return jsonify({'message': 'File not found on server'}), 404
    
    # Log download
    log_audit('document_downloaded', 'document', document_id)
    
    directory = os.path.dirname(document.storage_path)
    filename = os.path.basename(document.storage_path)
    
    return send_from_directory(
        directory,
        filename,
        as_attachment=True,
        download_name=document.original_filename
    )


@documents_bp.route('/<int:document_id>', methods=['PUT'])
@jwt_required()
def update_document(document_id):
    """Update document metadata"""
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    document = Document.query.get_or_404(document_id)
    
    # Check authorization
    if document.supplier and user.role != 'admin':
        if document.supplier.organization_id != user.organization_id:
            return jsonify({'message': 'Access denied'}), 403
    
    json_data = request.get_json()
    if not json_data:
        return jsonify({'message': 'No input data provided'}), 400
    
    try:
        data = document_update_schema.load(json_data)
    except ValidationError as err:
        return jsonify({'message': 'Validation error', 'errors': err.messages}), 400
    
    # Store old values for audit
    old_values = document.to_dict()
    
    # Update fields
    for key, value in data.items():
        setattr(document, key, value)
    
    db.session.commit()
    
    # Log update
    log_audit('document_updated', 'document', document.id, old_values, document.to_dict())
    
    return jsonify({
        'message': 'Document updated successfully',
        'document': document.to_dict()
    }), 200


@documents_bp.route('/<int:document_id>', methods=['DELETE'])
@jwt_required()
def delete_document(document_id):
    """Delete a document"""
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    document = Document.query.get_or_404(document_id)
    
    # Check authorization
    if document.supplier and user.role != 'admin':
        if document.supplier.organization_id != user.organization_id:
            return jsonify({'message': 'Access denied'}), 403
    
    # Store values for audit
    old_values = document.to_dict()
    storage_path = document.storage_path
    
    try:
        # Delete from database
        db.session.delete(document)
        db.session.commit()
        
        # Delete file from storage
        if os.path.exists(storage_path):
            os.remove(storage_path)
        
        # Log deletion
        log_audit('document_deleted', 'document', document_id, old_values, None)
        
        return jsonify({'message': 'Document deleted successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Error deleting document', 'error': str(e)}), 500


@documents_bp.route('/types', methods=['GET'])
@jwt_required()
def get_document_types():
    """Get all document types"""
    types = [
        'Company Registration', 'Product Certificate', 'Manufacturing Certificate',
        'Quality Certificate', 'Compliance Certificate', 'Origin Documentation', 'Other'
    ]
    return jsonify({'document_types': types}), 200
