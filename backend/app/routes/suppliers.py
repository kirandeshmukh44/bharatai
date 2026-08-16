"""
Supplier management routes
"""
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from marshmallow import Schema, fields, validate, ValidationError
from sqlalchemy import desc, asc

from app import db
from app.models import User, Supplier, Organization, AuditLog, Component

suppliers_bp = Blueprint('suppliers', __name__)


# Schemas
class SupplierSchema(Schema):
    supplier_name = fields.String(required=True, validate=validate.Length(min=2, max=255))
    registration_id = fields.String(validate=validate.Length(max=100))
    country = fields.String(required=True, validate=validate.Length(max=100))
    state = fields.String(validate=validate.Length(max=100))
    city = fields.String(validate=validate.Length(max=100))
    manufacturing_location = fields.String()
    industry = fields.String(validate=validate.Length(max=100))
    website = fields.String(validate=validate.Length(max=255))
    contact_email = fields.Email()
    contact_phone = fields.String(validate=validate.Length(max=50))
    years_in_operation = fields.Integer(validate=validate.Range(min=0, max=200))
    quality_score = fields.Float(validate=validate.Range(min=0, max=100))
    delivery_score = fields.Float(validate=validate.Range(min=0, max=100))
    compliance_score = fields.Float(validate=validate.Range(min=0, max=100))
    financial_stability_score = fields.Float(validate=validate.Range(min=0, max=100))
    previous_incidents = fields.Integer(validate=validate.Range(min=0), load_default=0)
    indigenous_claim = fields.Boolean(load_default=False)


class SupplierUpdateSchema(Schema):
    supplier_name = fields.String(validate=validate.Length(min=2, max=255))
    registration_id = fields.String(validate=validate.Length(max=100))
    country = fields.String(validate=validate.Length(max=100))
    state = fields.String(validate=validate.Length(max=100))
    city = fields.String(validate=validate.Length(max=100))
    manufacturing_location = fields.String()
    industry = fields.String(validate=validate.Length(max=100))
    website = fields.String(validate=validate.Length(max=255))
    contact_email = fields.Email()
    contact_phone = fields.String(validate=validate.Length(max=50))
    years_in_operation = fields.Integer(validate=validate.Range(min=0, max=200))
    quality_score = fields.Float(validate=validate.Range(min=0, max=100))
    delivery_score = fields.Float(validate=validate.Range(min=0, max=100))
    compliance_score = fields.Float(validate=validate.Range(min=0, max=100))
    financial_stability_score = fields.Float(validate=validate.Range(min=0, max=100))
    previous_incidents = fields.Integer(validate=validate.Range(min=0))
    indigenous_claim = fields.Boolean()


supplier_schema = SupplierSchema()
supplier_update_schema = SupplierUpdateSchema()


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


@suppliers_bp.route('', methods=['GET'])
@jwt_required()
def get_suppliers():
    """Get all suppliers with filtering and pagination"""
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    # Get query parameters
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)
    search = request.args.get('search', '')
    country = request.args.get('country')
    industry = request.args.get('industry')
    verification_status = request.args.get('verification_status')
    risk_level = request.args.get('risk_level')
    indigenous_claim = request.args.get('indigenous_claim')
    sort_by = request.args.get('sort_by', 'created_at')
    sort_order = request.args.get('sort_order', 'desc')
    
    # Base query
    query = Supplier.query
    
    # Filter by organization for non-admin users
    if user.role != 'admin':
        query = query.filter_by(organization_id=user.organization_id)
    
    # Apply filters
    if search:
        query = query.filter(Supplier.supplier_name.ilike(f'%{search}%'))
    if country:
        query = query.filter_by(country=country)
    if industry:
        query = query.filter_by(industry=industry)
    if verification_status:
        query = query.filter_by(verification_status=verification_status)
    if risk_level:
        query = query.filter_by(risk_level=risk_level)
    if indigenous_claim is not None:
        query = query.filter_by(indigenous_claim=indigenous_claim.lower() == 'true')
    
    # Apply sorting
    sort_column = getattr(Supplier, sort_by, Supplier.created_at)
    if sort_order == 'desc':
        query = query.order_by(desc(sort_column))
    else:
        query = query.order_by(asc(sort_column))
    
    # Paginate
    pagination = query.paginate(page=page, per_page=min(per_page, 100), error_out=False)
    
    return jsonify({
        'suppliers': [s.to_dict() for s in pagination.items],
        'pagination': {
            'page': page,
            'per_page': per_page,
            'total': pagination.total,
            'pages': pagination.pages,
            'has_next': pagination.has_next,
            'has_prev': pagination.has_prev
        }
    }), 200


@suppliers_bp.route('/<int:supplier_id>', methods=['GET'])
@jwt_required()
def get_supplier(supplier_id):
    """Get supplier details"""
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    supplier = Supplier.query.get_or_404(supplier_id)
    
    # Check authorization
    if user.role != 'admin' and supplier.organization_id != user.organization_id:
        return jsonify({'message': 'Access denied'}), 403
    
    # Get components count
    components_count = Component.query.filter_by(supplier_id=supplier_id).count()
    
    result = supplier.to_dict()
    result['components_count'] = components_count
    
    return jsonify({'supplier': result}), 200


@suppliers_bp.route('', methods=['POST'])
@jwt_required()
def create_supplier():
    """Create a new supplier"""
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    json_data = request.get_json()
    if not json_data:
        return jsonify({'message': 'No input data provided'}), 400
    
    try:
        data = supplier_schema.load(json_data)
    except ValidationError as err:
        return jsonify({'message': 'Validation error', 'errors': err.messages}), 400
    
    # Create supplier
    supplier = Supplier(
        organization_id=user.organization_id,
        **data
    )
    
    db.session.add(supplier)
    db.session.commit()
    
    # Log creation
    log_audit('supplier_created', 'supplier', supplier.id, None, supplier.to_dict())
    
    return jsonify({
        'message': 'Supplier created successfully',
        'supplier': supplier.to_dict()
    }), 201


@suppliers_bp.route('/<int:supplier_id>', methods=['PUT'])
@jwt_required()
def update_supplier(supplier_id):
    """Update supplier"""
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    supplier = Supplier.query.get_or_404(supplier_id)
    
    # Check authorization
    if user.role != 'admin' and supplier.organization_id != user.organization_id:
        return jsonify({'message': 'Access denied'}), 403
    
    json_data = request.get_json()
    if not json_data:
        return jsonify({'message': 'No input data provided'}), 400
    
    try:
        data = supplier_update_schema.load(json_data)
    except ValidationError as err:
        return jsonify({'message': 'Validation error', 'errors': err.messages}), 400
    
    # Store old values for audit
    old_values = supplier.to_dict()
    
    # Update fields
    for key, value in data.items():
        setattr(supplier, key, value)
    
    db.session.commit()
    
    # Log update
    log_audit('supplier_updated', 'supplier', supplier.id, old_values, supplier.to_dict())
    
    return jsonify({
        'message': 'Supplier updated successfully',
        'supplier': supplier.to_dict()
    }), 200


@suppliers_bp.route('/<int:supplier_id>', methods=['DELETE'])
@jwt_required()
def delete_supplier(supplier_id):
    """Delete supplier"""
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    supplier = Supplier.query.get_or_404(supplier_id)
    
    # Check authorization
    if user.role != 'admin' and supplier.organization_id != user.organization_id:
        return jsonify({'message': 'Access denied'}), 403
    
    # Store values for audit
    old_values = supplier.to_dict()
    
    db.session.delete(supplier)
    db.session.commit()
    
    # Log deletion
    log_audit('supplier_deleted', 'supplier', supplier_id, old_values, None)
    
    return jsonify({'message': 'Supplier deleted successfully'}), 200


@suppliers_bp.route('/filters', methods=['GET'])
@jwt_required()
def get_filter_options():
    """Get filter options for suppliers"""
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    # Base query
    query = Supplier.query
    if user.role != 'admin':
        query = query.filter_by(organization_id=user.organization_id)
    
    # Get unique values
    countries = [c[0] for c in query.with_entities(Supplier.country).distinct().all() if c[0]]
    industries = [i[0] for i in query.with_entities(Supplier.industry).distinct().all() if i[0]]
    
    return jsonify({
        'countries': sorted(countries),
        'industries': sorted(industries),
        'verification_statuses': ['pending', 'verified', 'partially_verified', 'unverified', 'requires_review'],
        'risk_levels': ['low', 'medium', 'high']
    }), 200
