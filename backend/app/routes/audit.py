"""
Audit log routes
"""
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy import desc

from app import db
from app.models import User, AuditLog

audit_bp = Blueprint('audit', __name__)


@audit_bp.route('', methods=['GET'])
@jwt_required()
def get_audit_logs():
    """Get audit logs (admin only)"""
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    # Only admins can view audit logs
    if user.role != 'admin':
        return jsonify({'message': 'Admin access required'}), 403
    
    # Get query parameters
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 50, type=int)
    action = request.args.get('action')
    entity_type = request.args.get('entity_type')
    user_filter = request.args.get('user_id', type=int)
    
    # Base query
    query = AuditLog.query
    
    if action:
        query = query.filter_by(action=action)
    if entity_type:
        query = query.filter_by(entity_type=entity_type)
    if user_filter:
        query = query.filter_by(user_id=user_filter)
    
    # Order by creation date (newest first)
    query = query.order_by(desc(AuditLog.created_at))
    
    # Paginate
    pagination = query.paginate(page=page, per_page=min(per_page, 100), error_out=False)
    
    # Build response with user names
    results = []
    for log in pagination.items:
        data = log.to_dict()
        if log.user:
            data['user_name'] = log.user.name
            data['user_email'] = log.user.email
        results.append(data)
    
    return jsonify({
        'audit_logs': results,
        'pagination': {
            'page': page,
            'per_page': per_page,
            'total': pagination.total,
            'pages': pagination.pages,
            'has_next': pagination.has_next,
            'has_prev': pagination.has_prev
        }
    }), 200


@audit_bp.route('/actions', methods=['GET'])
@jwt_required()
def get_action_types():
    """Get distinct action types for filtering"""
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if user.role != 'admin':
        return jsonify({'message': 'Admin access required'}), 403
    
    actions = db.session.query(AuditLog.action).distinct().all()
    return jsonify({'actions': [a[0] for a in actions if a[0]]}), 200
