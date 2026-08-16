"""
Authentication routes - Production Ready
"""
from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from marshmallow import Schema, fields, validate, ValidationError
from datetime import datetime
import uuid

from app import db
from app.models import User

auth_bp = Blueprint('auth', __name__)


def log_audit(action, entity_type=None, entity_id=None, old_values=None, new_values=None):
    """Placeholder audit logger for auth routes."""
    return None


# Schemas
class RegisterSchema(Schema):
    name = fields.String(required=True, validate=validate.Length(min=2, max=255))
    email = fields.Email(required=True)
    password = fields.String(required=True, validate=validate.Length(min=8))
    organization = fields.String(validate=validate.Length(max=255), load_default=None)
    organization_id = fields.String(validate=validate.Length(max=255), load_default=None)
    role = fields.String(validate=validate.OneOf(['admin', 'user', 'auditor', 'viewer']), load_default='user')


class LoginSchema(Schema):
    email = fields.Email(required=True)
    password = fields.String(required=True)


register_schema = RegisterSchema()
login_schema = LoginSchema()


@auth_bp.route('/register', methods=['POST'])
def register():
    """Register a new user - Production Ready"""
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
    
    try:
        organization_value = data.get('organization_id') or data.get('organization') or 'Default Organization'
        # Create user with UUID
        new_user = User(
            id=str(uuid.uuid4()),
            name=data['name'],
            email=data['email'].lower(),
            role=data.get('role', 'user'),
            organization_id=organization_value,
            created_at=datetime.utcnow()
        )
        new_user.set_password(data['password'])
        
        db.session.add(new_user)
        db.session.commit()
        
        # Generate token
        access_token = create_access_token(identity=new_user.id)
        
        return jsonify({
            'message': 'User registered successfully',
            'token': access_token,
            'user': new_user.to_dict()
        }), 201
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Registration failed', 'error': str(e)}), 500


@auth_bp.route('/login', methods=['POST'])
def login():
    """User login - Production Ready"""
    json_data = request.get_json()
    if not json_data:
        return jsonify({'message': 'No input data provided'}), 400
    
    try:
        data = login_schema.load(json_data)
    except ValidationError as err:
        return jsonify({'message': 'Validation error', 'errors': err.messages}), 400
    
    try:
        # Find user
        user = User.query.filter_by(email=data['email'].lower()).first()
        
        if not user or not user.check_password(data['password']):
            return jsonify({'message': 'Invalid email or password'}), 401
        
        # Generate token
        access_token = create_access_token(identity=user.id)
        
        return jsonify({
            'message': 'Login successful',
            'token': access_token,
            'user': user.to_dict()
        }), 200
    
    except Exception as e:
        return jsonify({'message': 'Login failed', 'error': str(e)}), 500


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
