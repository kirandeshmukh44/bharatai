"""
Authentication routes
"""
from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from marshmallow import Schema, fields, validate, ValidationError
from datetime import datetime

from app import db
from app.models import User, Organization, AuditLog

auth_bp = Blueprint('auth', __name__)


# Schemas
class RegisterSchema(Schema):
    name = fields.String(required=True, validate=validate.Length(min=2, max=255))
    email = fields.Email(required=True)
    password = fields.String(required=True, validate=validate.Length(min=8))
    organization_name = fields.String(validate=validate.Length(max=255))
    role = fields.String(validate=validate.OneOf(['admin', 'user']), load_default='user')


class LoginSchema(Schema):
    email = fields.Email(required=True)
    password = fields.String(required=True)


register_schema = RegisterSchema()
login_schema = LoginSchema()


def log_audit(action, entity_type=None, entity_id=None, old_values=None, new_values=None):
    """Helper to create audit log entry"""
    try:
        # Get IP and user agent
        ip_address = request.headers.get('X-Forwarded-For', request.remote_addr)
        user_agent = request.headers.get('User-Agent')
        
        # Try to get current user from JWT if available
        user_id = None
        try:
            user_id = get_jwt_identity()
        except:
            pass
        
        log = AuditLog(
            user_id=user_id,
            action=action,
            entity_type=entity_type,
            entity_id=entity_id,
            old_values=old_values,
            new_values=new_values,
            ip_address=ip_address,
            user_agent=user_agent
        )
        db.session.add(log)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        # Don't fail the main operation if audit logging fails
        print(f"Audit logging error: {e}")


@auth_bp.route('/register', methods=['POST'])
def register():
    """Register a new user"""
    json_data = request.get_json()
    if not json_data:
        return jsonify({'message': 'No input data provided'}), 400
    
    try:
        data = register_schema.load(json_data)
    except ValidationError as err:
        return jsonify({'message': 'Validation error', 'errors': err.messages}), 400
    
    # Check if user already exists
    if User.query.filter_by(email=data['email'].lower()).first():
        return jsonify({'message': 'Email already registered'}), 409
    
    # Create organization if provided
    organization_id = None
    if data.get('organization_name'):
        org = Organization(
            name=data['organization_name'],
            country='India'  # Default country
        )
        db.session.add(org)
        db.session.flush()
        organization_id = org.id
    
    # Create user
    new_user = User(
        name=data['name'],
        email=data['email'].lower(),
        role=data['role'],
        organization_id=organization_id
    )
    new_user.set_password(data['password'])
    
    db.session.add(new_user)
    db.session.commit()
    
    # Create audit log
    log_audit('user_registered', 'user', new_user.id, None, {
        'name': new_user.name,
        'email': new_user.email,
        'role': new_user.role
    })
    
    # Generate token
    access_token = create_access_token(identity=new_user.id)
    
    return jsonify({
        'message': 'User registered successfully',
        'token': access_token,
        'user': new_user.to_dict()
    }), 201


@auth_bp.route('/login', methods=['POST'])
def login():
    """User login"""
    json_data = request.get_json()
    if not json_data:
        return jsonify({'message': 'No input data provided'}), 400
    
    try:
        data = login_schema.load(json_data)
    except ValidationError as err:
        return jsonify({'message': 'Validation error', 'errors': err.messages}), 400
    
    # Find user
    user = User.query.filter_by(email=data['email'].lower()).first()
    
    if not user or not user.check_password(data['password']):
        # Log failed login attempt
        log_audit('login_failed', None, None, None, {'email': data['email']})
        return jsonify({'message': 'Invalid email or password'}), 401
    
    if not user.is_active:
        return jsonify({'message': 'Account is deactivated'}), 403
    
    # Update last login
    user.last_login = datetime.utcnow()
    db.session.commit()
    
    # Generate token
    access_token = create_access_token(identity=user.id)
    
    # Log successful login
    log_audit('login_success', 'user', user.id)
    
    return jsonify({
        'message': 'Login successful',
        'token': access_token,
        'user': user.to_dict()
    }), 200


@auth_bp.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    """User logout - JWT tokens are stateless, so this just logs the action"""
    user_id = get_jwt_identity()
    log_audit('logout', 'user', user_id)
    return jsonify({'message': 'Logout successful'}), 200


@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_current_user():
    """Get current authenticated user"""
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if not user:
        return jsonify({'message': 'User not found'}), 404
    
    return jsonify({'user': user.to_dict()}), 200


@auth_bp.route('/me', methods=['PUT'])
@jwt_required()
def update_current_user():
    """Update current user profile"""
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if not user:
        return jsonify({'message': 'User not found'}), 404
    
    json_data = request.get_json()
    if not json_data:
        return jsonify({'message': 'No input data provided'}), 400
    
    # Store old values for audit
    old_values = user.to_dict()
    
    # Update allowed fields
    allowed_fields = ['name']
    for field in allowed_fields:
        if field in json_data:
            setattr(user, field, json_data[field])
    
    db.session.commit()
    
    # Log update
    log_audit('user_updated', 'user', user.id, old_values, user.to_dict())
    
    return jsonify({
        'message': 'Profile updated successfully',
        'user': user.to_dict()
    }), 200


@auth_bp.route('/change-password', methods=['POST'])
@jwt_required()
def change_password():
    """Change user password"""
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if not user:
        return jsonify({'message': 'User not found'}), 404
    
    json_data = request.get_json()
    if not json_data:
        return jsonify({'message': 'No input data provided'}), 400
    
    current_password = json_data.get('current_password')
    new_password = json_data.get('new_password')
    
    if not current_password or not new_password:
        return jsonify({'message': 'Current password and new password are required'}), 400
    
    if len(new_password) < 8:
        return jsonify({'message': 'New password must be at least 8 characters'}), 400
    
    if not user.check_password(current_password):
        return jsonify({'message': 'Current password is incorrect'}), 401
    
    user.set_password(new_password)
    db.session.commit()
    
    log_audit('password_changed', 'user', user.id)
    
    return jsonify({'message': 'Password changed successfully'}), 200
