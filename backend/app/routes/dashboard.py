"""
Dashboard statistics routes
"""
from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy import func, desc
from datetime import datetime, timedelta

from app import db
from app.models import User, Supplier, Component, RiskAssessment, VerificationRecord

dashboard_bp = Blueprint('dashboard', __name__)


@dashboard_bp.route('/summary', methods=['GET'])
@jwt_required()
def get_dashboard_summary():
    """Get dashboard summary statistics"""
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    # Base queries
    supplier_query = Supplier.query
    component_query = Component.query
    
    # Filter by organization for non-admin users
    if user.role != 'admin':
        supplier_query = supplier_query.filter_by(organization_id=user.organization_id)
        component_query = component_query.join(Supplier).filter(Supplier.organization_id == user.organization_id)
    
    # Count statistics
    total_suppliers = supplier_query.count()
    verified_suppliers = supplier_query.filter(
        Supplier.verification_status.in_(['verified', 'partially_verified'])
    ).count()
    
    total_components = component_query.count()
    
    # Risk counts
    high_risk_suppliers = supplier_query.filter_by(risk_level='high').count()
    high_risk_components = component_query.filter_by(risk_level='high').count()
    
    # Indigenous components
    indigenous_components = component_query.filter(
        Component.indigenous_status.in_(['indigenous'])
    ).count()
    
    # Pending verification
    pending_verification = supplier_query.filter(
        Supplier.verification_status.in_(['pending', 'unverified', 'requires_review'])
    ).count()
    
    # Recent activity (last 30 days)
    thirty_days_ago = datetime.utcnow() - timedelta(days=30)
    
    recent_assessments = RiskAssessment.query.filter(
        RiskAssessment.created_at >= thirty_days_ago
    ).order_by(desc(RiskAssessment.created_at)).limit(5).all()
    
    recent_activity = []
    for assessment in recent_assessments:
        entity_name = None
        entity_type = None
        
        if assessment.supplier_id:
            supplier = Supplier.query.get(assessment.supplier_id)
            entity_name = supplier.supplier_name if supplier else 'Unknown'
            entity_type = 'supplier'
        elif assessment.component_id:
            component = Component.query.get(assessment.component_id)
            entity_name = component.component_name if component else 'Unknown'
            entity_type = 'component'
        
        recent_activity.append({
            'id': assessment.id,
            'type': 'risk_assessment',
            'entity_name': entity_name,
            'entity_type': entity_type,
            'risk_score': float(assessment.risk_score),
            'risk_level': assessment.risk_level,
            'created_at': assessment.created_at.isoformat() if assessment.created_at else None
        })
    
    return jsonify({
        'kpi': {
            'total_suppliers': total_suppliers,
            'verified_suppliers': verified_suppliers,
            'total_components': total_components,
            'high_risk_suppliers': high_risk_suppliers,
            'high_risk_components': high_risk_components,
            'indigenous_components': indigenous_components,
            'pending_verification': pending_verification
        },
        'recent_activity': recent_activity
    }), 200


@dashboard_bp.route('/risk-distribution', methods=['GET'])
@jwt_required()
def get_risk_distribution():
    """Get risk distribution for charts"""
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    # Base queries
    supplier_query = Supplier.query
    component_query = Component.query
    
    # Filter by organization for non-admin users
    if user.role != 'admin':
        supplier_query = supplier_query.filter_by(organization_id=user.organization_id)
        component_query = component_query.join(Supplier).filter(Supplier.organization_id == user.organization_id)
    
    # Risk distribution for suppliers
    supplier_risk = db.session.query(
        Supplier.risk_level,
        func.count(Supplier.id)
    )
    if user.role != 'admin':
        supplier_risk = supplier_risk.filter(Supplier.organization_id == user.organization_id)
    supplier_risk = supplier_risk.group_by(Supplier.risk_level).all()
    
    # Risk distribution for components
    component_risk = db.session.query(
        Component.risk_level,
        func.count(Component.id)
    ).join(Supplier)
    if user.role != 'admin':
        component_risk = component_risk.filter(Supplier.organization_id == user.organization_id)
    component_risk = component_risk.group_by(Component.risk_level).all()
    
    return jsonify({
        'supplier_risk': {level: count for level, count in supplier_risk},
        'component_risk': {level: count for level, count in component_risk}
    }), 200


@dashboard_bp.route('/verification-status', methods=['GET'])
@jwt_required()
def get_verification_status():
    """Get verification status distribution"""
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    # Base query
    query = db.session.query(
        Supplier.verification_status,
        func.count(Supplier.id)
    )
    
    if user.role != 'admin':
        query = query.filter(Supplier.organization_id == user.organization_id)
    
    query = query.group_by(Supplier.verification_status).all()
    
    return jsonify({
        'verification_status': {status: count for status, count in query}
    }), 200


@dashboard_bp.route('/trends', methods=['GET'])
@jwt_required()
def get_trends():
    """Get trend data for charts"""
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    days = request.args.get('days', 30, type=int)
    
    # Calculate date range
    end_date = datetime.utcnow()
    start_date = end_date - timedelta(days=days)
    
    # Get daily risk assessment counts
    trends = []
    current_date = start_date
    
    while current_date <= end_date:
        next_date = current_date + timedelta(days=1)
        
        # Count assessments for this day
        base_query = RiskAssessment.query.filter(
            RiskAssessment.created_at >= current_date,
            RiskAssessment.created_at < next_date
        )
        
        # Filter by organization for non-admin users
        if user.role != 'admin':
            base_query = base_query.join(Supplier).filter(Supplier.organization_id == user.organization_id)
        
        count = base_query.count()
        
        # Calculate average risk score
        avg_score = db.session.query(func.avg(RiskAssessment.risk_score))
        avg_score = avg_score.filter(
            RiskAssessment.created_at >= current_date,
            RiskAssessment.created_at < next_date
        )
        if user.role != 'admin':
            avg_score = avg_score.join(Supplier).filter(Supplier.organization_id == user.organization_id)
        avg_score = avg_score.scalar()
        
        trends.append({
            'date': current_date.strftime('%Y-%m-%d'),
            'assessment_count': count,
            'average_risk_score': float(avg_score) if avg_score else None
        })
        
        current_date = next_date
    
    return jsonify({'trends': trends}), 200


@dashboard_bp.route('/indigenous-stats', methods=['GET'])
@jwt_required()
def get_indigenous_stats():
    """Get indigenous vs imported component statistics"""
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    # Base query
    query = db.session.query(
        Component.indigenous_status,
        func.count(Component.id)
    ).join(Supplier)
    
    if user.role != 'admin':
        query = query.filter(Supplier.organization_id == user.organization_id)
    
    query = query.group_by(Component.indigenous_status).all()
    
    return jsonify({
        'indigenous_stats': {status: count for status, count in query}
    }), 200
