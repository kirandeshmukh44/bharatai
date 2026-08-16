"""
AI Risk Analysis routes
"""
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from marshmallow import Schema, fields, validate, ValidationError
from sqlalchemy import desc

from app import db
from app.models import User, Supplier, Component, Document, RiskAssessment, RiskFactor, AuditLog
from app.services.risk_engine import get_risk_engine

risk_bp = Blueprint('risk_analysis', __name__)


# Schemas
class RiskAnalysisRequestSchema(Schema):
    supplier_id = fields.Integer()
    component_id = fields.Integer()


risk_request_schema = RiskAnalysisRequestSchema()


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


@risk_bp.route('', methods=['POST'])
@jwt_required()
def run_risk_analysis():
    """Run AI risk analysis on supplier or component"""
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    json_data = request.get_json()
    if not json_data:
        return jsonify({'message': 'No input data provided'}), 400
    
    try:
        data = risk_request_schema.load(json_data)
    except ValidationError as err:
        return jsonify({'message': 'Validation error', 'errors': err.messages}), 400
    
    supplier_id = data.get('supplier_id')
    component_id = data.get('component_id')
    
    if not supplier_id and not component_id:
        return jsonify({'message': 'Either supplier_id or component_id is required'}), 400
    
    # Gather data for analysis
    analysis_data = {}
    target_supplier = None
    target_component = None
    
    if supplier_id:
        target_supplier = Supplier.query.get(supplier_id)
        if not target_supplier:
            return jsonify({'message': 'Supplier not found'}), 404
        
        # Check authorization
        if user.role != 'admin' and target_supplier.organization_id != user.organization_id:
            return jsonify({'message': 'Access denied'}), 403
        
        analysis_data['supplier'] = target_supplier.to_dict()
    
    if component_id:
        target_component = Component.query.get(component_id)
        if not target_component:
            return jsonify({'message': 'Component not found'}), 404
        
        # Check authorization
        if target_component.supplier and user.role != 'admin':
            if target_component.supplier.organization_id != user.organization_id:
                return jsonify({'message': 'Access denied'}), 403
        
        analysis_data['component'] = target_component.to_dict()
        
        # If component has supplier, include it
        if target_component.supplier:
            analysis_data['supplier'] = target_component.supplier.to_dict()
            target_supplier = target_component.supplier
    
    # Get documents
    documents_query = Document.query
    if supplier_id:
        documents_query = documents_query.filter_by(supplier_id=supplier_id)
    elif component_id:
        documents_query = documents_query.filter_by(component_id=component_id)
    
    documents = [d.to_dict() for d in documents_query.all()]
    analysis_data['documents'] = documents
    
    # Run AI risk analysis
    risk_engine = get_risk_engine()
    result = risk_engine.analyze(analysis_data)
    
    # Save assessment to database
    assessment = RiskAssessment(
        supplier_id=supplier_id,
        component_id=component_id,
        risk_score=result['risk_score'],
        risk_level=result['risk_level'].lower(),
        confidence_score=result['confidence_score'],
        assessment_summary=result['assessment_summary'],
        model_version=result['model_version'],
        created_by=user_id
    )
    
    db.session.add(assessment)
    db.session.flush()  # Get assessment ID
    
    # Save risk factors
    for factor_data in result['factors']:
        factor = RiskFactor(
            risk_assessment_id=assessment.id,
            factor_name=factor_data['name'],
            factor_value=factor_data['value'],
            contribution=factor_data['contribution'],
            explanation=factor_data['explanation']
        )
        db.session.add(factor)
    
    # Update supplier/component with risk info
    if target_supplier:
        target_supplier.risk_level = result['risk_level'].lower()
        target_supplier.risk_score = result['risk_score']
    
    if target_component:
        target_component.risk_level = result['risk_level'].lower()
        target_component.risk_score = result['risk_score']
    
    db.session.commit()
    
    # Log assessment
    log_audit('risk_assessment_created', 'risk_assessment', assessment.id, None, {
        'supplier_id': supplier_id,
        'component_id': component_id,
        'risk_score': result['risk_score'],
        'risk_level': result['risk_level']
    })
    
    # Return full assessment with factors
    response = assessment.to_dict()
    response['factors'] = [f.to_dict() for f in assessment.factors]
    response['features_used'] = result['features_used']
    
    return jsonify({
        'message': 'Risk analysis completed successfully',
        'assessment': response
    }), 200


@risk_bp.route('', methods=['GET'])
@jwt_required()
def get_risk_assessments():
    """Get risk assessment history"""
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    # Get query parameters
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)
    supplier_id = request.args.get('supplier_id', type=int)
    component_id = request.args.get('component_id', type=int)
    
    # Base query
    query = RiskAssessment.query
    
    # Filter by organization for non-admin users
    if user.role != 'admin':
        query = query.join(Supplier).filter(Supplier.organization_id == user.organization_id)
    
    if supplier_id:
        query = query.filter_by(supplier_id=supplier_id)
    if component_id:
        query = query.filter_by(component_id=component_id)
    
    # Order by creation date
    query = query.order_by(desc(RiskAssessment.created_at))
    
    # Paginate
    pagination = query.paginate(page=page, per_page=min(per_page, 100), error_out=False)
    
    # Build response with entity names
    results = []
    for assessment in pagination.items:
        data = assessment.to_dict()
        if assessment.supplier:
            data['supplier_name'] = assessment.supplier.supplier_name
        if assessment.component:
            data['component_name'] = assessment.component.component_name
        data['factor_count'] = assessment.factors.count()
        results.append(data)
    
    return jsonify({
        'assessments': results,
        'pagination': {
            'page': page,
            'per_page': per_page,
            'total': pagination.total,
            'pages': pagination.pages,
            'has_next': pagination.has_next,
            'has_prev': pagination.has_prev
        }
    }), 200


@risk_bp.route('/<int:assessment_id>', methods=['GET'])
@jwt_required()
def get_risk_assessment(assessment_id):
    """Get detailed risk assessment"""
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    assessment = RiskAssessment.query.get_or_404(assessment_id)
    
    # Check authorization
    if assessment.supplier and user.role != 'admin':
        if assessment.supplier.organization_id != user.organization_id:
            return jsonify({'message': 'Access denied'}), 403
    
    result = assessment.to_dict()
    result['factors'] = [f.to_dict() for f in assessment.factors]
    
    if assessment.supplier:
        result['supplier_name'] = assessment.supplier.supplier_name
    if assessment.component:
        result['component_name'] = assessment.component.component_name
    
    return jsonify({'assessment': result}), 200


@risk_bp.route('/stats', methods=['GET'])
@jwt_required()
def get_risk_stats():
    """Get risk distribution statistics"""
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    # Base queries
    supplier_query = Supplier.query
    component_query = Component.query
    
    # Filter by organization for non-admin users
    if user.role != 'admin':
        supplier_query = supplier_query.filter_by(organization_id=user.organization_id)
        component_query = component_query.join(Supplier).filter(Supplier.organization_id == user.organization_id)
    
    # Risk distribution
    risk_dist = {}
    for level in ['low', 'medium', 'high']:
        risk_dist[level] = {
            'suppliers': supplier_query.filter_by(risk_level=level).count(),
            'components': component_query.filter_by(risk_level=level).count()
        }
    
    # Indigenous status distribution
    indigenous_dist = {}
    for status in ['indigenous', 'imported', 'unknown']:
        indigenous_dist[status] = component_query.filter_by(indigenous_status=status).count()
    
    # Category distribution
    from sqlalchemy import func
    category_dist = db.session.query(
        Component.category,
        func.count(Component.id)
    ).join(Supplier)
    
    if user.role != 'admin':
        category_dist = category_dist.filter(Supplier.organization_id == user.organization_id)
    
    category_dist = category_dist.group_by(Component.category).all()
    
    return jsonify({
        'risk_distribution': risk_dist,
        'indigenous_distribution': indigenous_dist,
        'category_distribution': {cat: count for cat, count in category_dist}
    }), 200
