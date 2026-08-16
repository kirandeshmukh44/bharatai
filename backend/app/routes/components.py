"""
Component management routes
"""
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from marshmallow import Schema, fields, validate, ValidationError
from sqlalchemy import desc, asc

from app import db
from app.models import User, Supplier, Component, AuditLog

components_bp = Blueprint('components', __name__)


# Schemas
class ComponentSchema(Schema):
    supplier_id = fields.Integer(required=True)
    component_name = fields.String(required=True, validate=validate.Length(min=2, max=255))
    component_number = fields.String(validate=validate.Length(max=100))
    category = fields.String(required=True, validate=validate.OneOf([
        'Semiconductor', 'Microcontroller', 'Sensor', 'PCB', 
        'Power IC', 'Memory', 'Communication Module', 'Power Electronics', 'Other'
    ]))
    manufacturer = fields.String(validate=validate.Length(max=255))
    country_of_origin = fields.String(validate=validate.Length(max=100))
    manufacturing_location = fields.String()
    indigenous_status = fields.String(validate=validate.OneOf(['indigenous', 'imported', 'unknown']), load_default='unknown')
    description = fields.String()
    specifications = fields.Dict()
    certification = fields.String(validate=validate.Length(max=255))


class ComponentUpdateSchema(Schema):
    supplier_id = fields.Integer()
    component_name = fields.String(validate=validate.Length(min=2, max=255))
    component_number = fields.String(validate=validate.Length(max=100))
    category = fields.String(validate=validate.OneOf([
        'Semiconductor', 'Microcontroller', 'Sensor', 'PCB', 
        'Power IC', 'Memory', 'Communication Module', 'Power Electronics', 'Other'
    ]))
    manufacturer = fields.String(validate=validate.Length(max=255))
    country_of_origin = fields.String(validate=validate.Length(max=100))
    manufacturing_location = fields.String()
    indigenous_status = fields.String(validate=validate.OneOf(['indigenous', 'imported', 'unknown']))
    description = fields.String()
    specifications = fields.Dict()
    certification = fields.String(validate=validate.Length(max=255))


component_schema = ComponentSchema()
component_update_schema = ComponentUpdateSchema()


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


@components_bp.route('', methods=['GET'])
@jwt_required()
def get_components():
    """Get all components with filtering and pagination"""
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    # Get query parameters
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)
    search = request.args.get('search', '')
    supplier_id = request.args.get('supplier_id', type=int)
    category = request.args.get('category')
    indigenous_status = request.args.get('indigenous_status')
    verification_status = request.args.get('verification_status')
    risk_level = request.args.get('risk_level')
    sort_by = request.args.get('sort_by', 'created_at')
    sort_order = request.args.get('sort_order', 'desc')
    
    # Base query with supplier join for authorization
    query = Component.query.join(Supplier)
    
    # Filter by organization for non-admin users
    if user.role != 'admin':
        query = query.filter(Supplier.organization_id == user.organization_id)
    
    # Apply filters
    if search:
        query = query.filter(Component.component_name.ilike(f'%{search}%'))
    if supplier_id:
        query = query.filter(Component.supplier_id == supplier_id)
    if category:
        query = query.filter_by(category=category)
    if indigenous_status:
        query = query.filter_by(indigenous_status=indigenous_status)
    if verification_status:
        query = query.filter_by(verification_status=verification_status)
    if risk_level:
        query = query.filter_by(risk_level=risk_level)
    
    # Apply sorting
    sort_column = getattr(Component, sort_by, Component.created_at)
    if sort_order == 'desc':
        query = query.order_by(desc(sort_column))
    else:
        query = query.order_by(asc(sort_column))
    
    # Paginate
    pagination = query.paginate(page=page, per_page=min(per_page, 100), error_out=False)
    
    # Include supplier name in response
    results = []
    for component in pagination.items:
        data = component.to_dict()
        data['supplier_name'] = component.supplier.supplier_name if component.supplier else None
        results.append(data)
    
    return jsonify({
        'components': results,
        'pagination': {
            'page': page,
            'per_page': per_page,
            'total': pagination.total,
            'pages': pagination.pages,
            'has_next': pagination.has_next,
            'has_prev': pagination.has_prev
        }
    }), 200


@components_bp.route('/<int:component_id>', methods=['GET'])
@jwt_required()
def get_component(component_id):
    """Get component details"""
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    component = Component.query.get_or_404(component_id)
    
    # Check authorization
    if component.supplier and user.role != 'admin':
        if component.supplier.organization_id != user.organization_id:
            return jsonify({'message': 'Access denied'}), 403
    
    result = component.to_dict()
    if component.supplier:
        result['supplier_name'] = component.supplier.supplier_name
        result['supplier_country'] = component.supplier.country
    
    return jsonify({'component': result}), 200


@components_bp.route('', methods=['POST'])
@jwt_required()
def create_component():
    """Create a new component"""
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    json_data = request.get_json()
    if not json_data:
        return jsonify({'message': 'No input data provided'}), 400
    
    try:
        data = component_schema.load(json_data)
    except ValidationError as err:
        return jsonify({'message': 'Validation error', 'errors': err.messages}), 400
    
    # Verify supplier exists and user has access
    supplier = Supplier.query.get(data['supplier_id'])
    if not supplier:
        return jsonify({'message': 'Supplier not found'}), 404
    
    if user.role != 'admin' and supplier.organization_id != user.organization_id:
        return jsonify({'message': 'Access denied to this supplier'}), 403
    
    # Create component
    component = Component(**data)
    
    db.session.add(component)
    db.session.commit()
    
    # Log creation
    log_audit('component_created', 'component', component.id, None, component.to_dict())
    
    return jsonify({
        'message': 'Component created successfully',
        'component': component.to_dict()
    }), 201


@components_bp.route('/<int:component_id>', methods=['PUT'])
@jwt_required()
def update_component(component_id):
    """Update component"""
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    component = Component.query.get_or_404(component_id)
    
    # Check authorization
    if component.supplier and user.role != 'admin':
        if component.supplier.organization_id != user.organization_id:
            return jsonify({'message': 'Access denied'}), 403
    
    json_data = request.get_json()
    if not json_data:
        return jsonify({'message': 'No input data provided'}), 400
    
    try:
        data = component_update_schema.load(json_data)
    except ValidationError as err:
        return jsonify({'message': 'Validation error', 'errors': err.messages}), 400
    
    # If changing supplier, verify access
    if 'supplier_id' in data and data['supplier_id'] != component.supplier_id:
        new_supplier = Supplier.query.get(data['supplier_id'])
        if not new_supplier:
            return jsonify({'message': 'New supplier not found'}), 404
        if user.role != 'admin' and new_supplier.organization_id != user.organization_id:
            return jsonify({'message': 'Access denied to new supplier'}), 403
    
    # Store old values for audit
    old_values = component.to_dict()
    
    # Update fields
    for key, value in data.items():
        setattr(component, key, value)
    
    db.session.commit()
    
    # Log update
    log_audit('component_updated', 'component', component.id, old_values, component.to_dict())
    
    return jsonify({
        'message': 'Component updated successfully',
        'component': component.to_dict()
    }), 200


@components_bp.route('/<int:component_id>', methods=['DELETE'])
@jwt_required()
def delete_component(component_id):
    """Delete component"""
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    component = Component.query.get_or_404(component_id)
    
    # Check authorization
    if component.supplier and user.role != 'admin':
        if component.supplier.organization_id != user.organization_id:
            return jsonify({'message': 'Access denied'}), 403
    
    # Store values for audit
    old_values = component.to_dict()
    
    db.session.delete(component)
    db.session.commit()
    
    # Log deletion
    log_audit('component_deleted', 'component', component_id, old_values, None)
    
    return jsonify({'message': 'Component deleted successfully'}), 200


@components_bp.route('/categories', methods=['GET'])
@jwt_required()
def get_categories():
    """Get all component categories"""
    categories = [
        'Semiconductor', 'Microcontroller', 'Sensor', 'PCB', 
        'Power IC', 'Memory', 'Communication Module', 'Power Electronics', 'Other'
    ]
    return jsonify({'categories': categories}), 200
