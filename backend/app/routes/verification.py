"""
Verification workflow routes
"""
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from marshmallow import Schema, fields, validate, ValidationError
from datetime import datetime
from sqlalchemy import desc

from app import db
from app.models import User, Supplier, Component, Document, VerificationRecord, AuditLog

verification_bp = Blueprint('verification', __name__)


# Schemas
class VerificationCreateSchema(Schema):
    supplier_id = fields.Integer()
    component_id = fields.Integer()
    verification_notes = fields.String()


class VerificationUpdateSchema(Schema):
    verification_status = fields.String(required=True, validate=validate.OneOf([
        'pending', 'verified', 'partially_verified', 'unverified', 'requires_review'
    ]))
    verification_notes = fields.String()


verification_create_schema = VerificationCreateSchema()
verification_update_schema = VerificationUpdateSchema()


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


def run_verification_checks(supplier=None, component=None):
    """Run automated verification checks"""
    checked_fields = []
    missing_fields = []
    documents_reviewed = []
    
    if supplier:
        # Check supplier fields
        supplier_checks = [
            ('supplier_name', supplier.supplier_name),
            ('country', supplier.country),
            ('industry', supplier.industry),
            ('registration_id', supplier.registration_id),
            ('contact_email', supplier.contact_email),
        ]
        
        for field_name, value in supplier_checks:
            if value:
                checked_fields.append(f'supplier.{field_name}')
            else:
                missing_fields.append(f'supplier.{field_name}')
        
        # Check supplier documents
        docs = Document.query.filter_by(supplier_id=supplier.id).all()
        required_docs = ['Company Registration']
        doc_types = [d.document_type for d in docs]
        
        for doc_type in required_docs:
            if doc_type in doc_types:
                checked_fields.append(f'document.{doc_type}')
                doc = next(d for d in docs if d.document_type == doc_type)
                documents_reviewed.append(doc.id)
            else:
                missing_fields.append(f'document.{doc_type}')
    
    if component:
        # Check component fields
        component_checks = [
            ('component_name', component.component_name),
            ('category', component.category),
            ('manufacturer', component.manufacturer),
            ('country_of_origin', component.country_of_origin),
            ('description', component.description),
        ]
        
        for field_name, value in component_checks:
            if value:
                checked_fields.append(f'component.{field_name}')
            else:
                missing_fields.append(f'component.{field_name}')
        
        # Check component documents
        docs = Document.query.filter_by(component_id=component.id).all()
        required_docs = ['Product Certificate']
        doc_types = [d.document_type for d in docs]
        
        for doc_type in required_docs:
            if doc_type in doc_types:
                checked_fields.append(f'document.{doc_type}')
                doc = next(d for d in docs if d.document_type == doc_type)
                documents_reviewed.append(doc.id)
            else:
                missing_fields.append(f'document.{doc_type}')
    
    return checked_fields, missing_fields, documents_reviewed


@verification_bp.route('', methods=['POST'])
@jwt_required()
def create_verification():
    """Create a new verification request"""
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    json_data = request.get_json()
    if not json_data:
        return jsonify({'message': 'No input data provided'}), 400
    
    try:
        data = verification_create_schema.load(json_data)
    except ValidationError as err:
        return jsonify({'message': 'Validation error', 'errors': err.messages}), 400
    
    supplier_id = data.get('supplier_id')
    component_id = data.get('component_id')
    
    if not supplier_id and not component_id:
        return jsonify({'message': 'Either supplier_id or component_id is required'}), 400
    
    # Verify access
    supplier = None
    component = None
    
    if supplier_id:
        supplier = Supplier.query.get(supplier_id)
        if not supplier:
            return jsonify({'message': 'Supplier not found'}), 404
        if user.role != 'admin' and supplier.organization_id != user.organization_id:
            return jsonify({'message': 'Access denied'}), 403
    
    if component_id:
        component = Component.query.get(component_id)
        if not component:
            return jsonify({'message': 'Component not found'}), 404
        if component.supplier and user.role != 'admin':
            if component.supplier.organization_id != user.organization_id:
                return jsonify({'message': 'Access denied'}), 403
    
    # Run verification checks
    checked_fields, missing_fields, documents_reviewed = run_verification_checks(supplier, component)
    
    # Determine initial status based on checks
    if not missing_fields:
        initial_status = 'verified'
    elif len(missing_fields) <= 2:
        initial_status = 'partially_verified'
    else:
        initial_status = 'requires_review'
    
    # Create verification record
    verification = VerificationRecord(
        supplier_id=supplier_id,
        component_id=component_id,
        verification_status=initial_status,
        verification_notes=data.get('verification_notes', ''),
        checked_fields=checked_fields,
        missing_fields=missing_fields,
        documents_reviewed=documents_reviewed,
        reviewed_by=user_id,
        reviewed_at=datetime.utcnow()
    )
    
    db.session.add(verification)
    
    # Update entity verification status
    if supplier:
        supplier.verification_status = initial_status
    if component:
        component.verification_status = initial_status
    
    db.session.commit()
    
    # Log verification
    log_audit('verification_created', 'verification', verification.id, None, {
        'status': initial_status,
        'checked_fields': len(checked_fields),
        'missing_fields': len(missing_fields)
    })
    
    return jsonify({
        'message': 'Verification completed',
        'verification': verification.to_dict()
    }), 201


@verification_bp.route('', methods=['GET'])
@jwt_required()
def get_verifications():
    """Get verification records"""
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    # Get query parameters
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)
    supplier_id = request.args.get('supplier_id', type=int)
    component_id = request.args.get('component_id', type=int)
    status = request.args.get('status')
    
    # Base query
    query = VerificationRecord.query
    
    # Filter by organization for non-admin users
    if user.role != 'admin':
        query = query.join(Supplier).filter(Supplier.organization_id == user.organization_id)
    
    if supplier_id:
        query = query.filter_by(supplier_id=supplier_id)
    if component_id:
        query = query.filter_by(component_id=component_id)
    if status:
        query = query.filter_by(verification_status=status)
    
    # Order by creation date
    query = query.order_by(desc(VerificationRecord.created_at))
    
    # Paginate
    pagination = query.paginate(page=page, per_page=min(per_page, 100), error_out=False)
    
    # Build response with entity names
    results = []
    for record in pagination.items:
        data = record.to_dict()
        if record.supplier:
            data['supplier_name'] = record.supplier.supplier_name
        if record.component:
            data['component_name'] = record.component.component_name
        if record.reviewer:
            data['reviewer_name'] = record.reviewer.name
        results.append(data)
    
    return jsonify({
        'verifications': results,
        'pagination': {
            'page': page,
            'per_page': per_page,
            'total': pagination.total,
            'pages': pagination.pages,
            'has_next': pagination.has_next,
            'has_prev': pagination.has_prev
        }
    }), 200


@verification_bp.route('/<int:verification_id>', methods=['GET'])
@jwt_required()
def get_verification(verification_id):
    """Get verification record details"""
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    verification = VerificationRecord.query.get_or_404(verification_id)
    
    # Check authorization
    if verification.supplier and user.role != 'admin':
        if verification.supplier.organization_id != user.organization_id:
            return jsonify({'message': 'Access denied'}), 403
    
    result = verification.to_dict()
    if verification.supplier:
        result['supplier_name'] = verification.supplier.supplier_name
    if verification.component:
        result['component_name'] = verification.component.component_name
    if verification.reviewer:
        result['reviewer_name'] = verification.reviewer.name
    
    return jsonify({'verification': result}), 200


@verification_bp.route('/<int:verification_id>', methods=['PUT'])
@jwt_required()
def update_verification(verification_id):
    """Update verification record"""
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    verification = VerificationRecord.query.get_or_404(verification_id)
    
    # Check authorization
    if verification.supplier and user.role != 'admin':
        if verification.supplier.organization_id != user.organization_id:
            return jsonify({'message': 'Access denied'}), 403
    
    json_data = request.get_json()
    if not json_data:
        return jsonify({'message': 'No input data provided'}), 400
    
    try:
        data = verification_update_schema.load(json_data)
    except ValidationError as err:
        return jsonify({'message': 'Validation error', 'errors': err.messages}), 400
    
    # Store old values for audit
    old_values = verification.to_dict()
    
    # Update status
    new_status = data['verification_status']
    verification.verification_status = new_status
    verification.verification_notes = data.get('verification_notes', verification.verification_notes)
    verification.reviewed_by = user_id
    verification.reviewed_at = datetime.utcnow()
    
    # Update entity verification status
    if verification.supplier:
        verification.supplier.verification_status = new_status
    if verification.component:
        verification.component.verification_status = new_status
    
    db.session.commit()
    
    # Log update
    log_audit('verification_updated', 'verification', verification.id, old_values, verification.to_dict())
    
    return jsonify({
        'message': 'Verification updated successfully',
        'verification': verification.to_dict()
    }), 200
