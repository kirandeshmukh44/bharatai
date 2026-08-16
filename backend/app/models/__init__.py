"""
Database models for BharatAI
"""
from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Index, CheckConstraint
from werkzeug.security import generate_password_hash, check_password_hash

# Import db from app
from app import db

class Organization(db.Model):
    """Organization model"""
    __tablename__ = 'organizations'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    registration_id = db.Column(db.String(100), unique=True)
    industry = db.Column(db.String(100))
    country = db.Column(db.String(100))
    state = db.Column(db.String(100))
    city = db.Column(db.String(100))
    address = db.Column(db.Text)
    website = db.Column(db.String(255))
    contact_email = db.Column(db.String(255))
    contact_phone = db.Column(db.String(50))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    suppliers = db.relationship('Supplier', back_populates='organization', lazy='dynamic')
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'registration_id': self.registration_id,
            'industry': self.industry,
            'country': self.country,
            'state': self.state,
            'city': self.city,
            'address': self.address,
            'website': self.website,
            'contact_email': self.contact_email,
            'contact_phone': self.contact_phone,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }


class User(db.Model):
    """User model with authentication - aligned to live database schema"""
    __tablename__ = 'users'
    
    id = db.Column(db.String(36), primary_key=True)  # UUID string
    name = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False, index=True)
    password = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(50), nullable=False, default='user')
    organization_id = db.Column(db.String(255), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    password_hash = db.Column(db.String(255), nullable=True)

    # Compatibility alias for older code paths that still use `organization`
    organization = db.synonym('organization_id')
    
    def set_password(self, password):
        """Hash and set password"""
        self.password = generate_password_hash(password)
        self.password_hash = self.password
    
    def check_password(self, password):
        """Check password against hash"""
        return check_password_hash(self.password, password)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'role': self.role,
            'organization_id': self.organization_id,
            'organization': self.organization_id,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }


class Supplier(db.Model):
    """Supplier model"""
    __tablename__ = 'suppliers'
    
    id = db.Column(db.Integer, primary_key=True)
    organization_id = db.Column(db.Integer, db.ForeignKey('organizations.id'), nullable=True, index=True)
    supplier_name = db.Column(db.String(255), nullable=False)
    registration_id = db.Column(db.String(100))
    country = db.Column(db.String(100), nullable=False)
    state = db.Column(db.String(100))
    city = db.Column(db.String(100))
    manufacturing_location = db.Column(db.Text)
    industry = db.Column(db.String(100))
    website = db.Column(db.String(255))
    contact_email = db.Column(db.String(255))
    contact_phone = db.Column(db.String(50))
    years_in_operation = db.Column(db.Integer)
    
    # Scores (0-100)
    quality_score = db.Column(db.Numeric(5, 2))
    delivery_score = db.Column(db.Numeric(5, 2))
    compliance_score = db.Column(db.Numeric(5, 2))
    financial_stability_score = db.Column(db.Numeric(5, 2))
    previous_incidents = db.Column(db.Integer, default=0)
    indigenous_claim = db.Column(db.Boolean, default=False)
    
    # Status
    verification_status = db.Column(db.String(50), default='unverified')  # pending, verified, partially_verified, unverified, requires_review
    risk_level = db.Column(db.String(50), default='medium')  # low, medium, high
    risk_score = db.Column(db.Numeric(5, 2))
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    organization = db.relationship('Organization', back_populates='suppliers')
    components = db.relationship('Component', back_populates='supplier', lazy='dynamic', cascade='all, delete-orphan')
    documents = db.relationship('Document', back_populates='supplier', lazy='dynamic')
    risk_assessments = db.relationship('RiskAssessment', back_populates='supplier', lazy='dynamic')
    
    # Constraints
    __table_args__ = (
        CheckConstraint(verification_status.in_(['pending', 'verified', 'partially_verified', 'unverified', 'requires_review']), name='check_verification_status'),
        CheckConstraint(risk_level.in_(['low', 'medium', 'high']), name='check_risk_level'),
        Index('idx_supplier_org', 'organization_id'),
        Index('idx_supplier_status', 'verification_status'),
        Index('idx_supplier_risk', 'risk_level'),
    )
    
    def to_dict(self):
        return {
            'id': self.id,
            'organization_id': self.organization_id,
            'supplier_name': self.supplier_name,
            'registration_id': self.registration_id,
            'country': self.country,
            'state': self.state,
            'city': self.city,
            'manufacturing_location': self.manufacturing_location,
            'industry': self.industry,
            'website': self.website,
            'contact_email': self.contact_email,
            'contact_phone': self.contact_phone,
            'years_in_operation': self.years_in_operation,
            'quality_score': float(self.quality_score) if self.quality_score else None,
            'delivery_score': float(self.delivery_score) if self.delivery_score else None,
            'compliance_score': float(self.compliance_score) if self.compliance_score else None,
            'financial_stability_score': float(self.financial_stability_score) if self.financial_stability_score else None,
            'previous_incidents': self.previous_incidents,
            'indigenous_claim': self.indigenous_claim,
            'verification_status': self.verification_status,
            'risk_level': self.risk_level,
            'risk_score': float(self.risk_score) if self.risk_score else None,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }


class Component(db.Model):
    """Component model"""
    __tablename__ = 'components'
    
    id = db.Column(db.Integer, primary_key=True)
    supplier_id = db.Column(db.Integer, db.ForeignKey('suppliers.id'), nullable=True, index=True)
    component_name = db.Column(db.String(255), nullable=False)
    component_number = db.Column(db.String(100))
    category = db.Column(db.String(100), nullable=False)
    manufacturer = db.Column(db.String(255))
    country_of_origin = db.Column(db.String(100))
    manufacturing_location = db.Column(db.Text)
    indigenous_status = db.Column(db.String(50), default='unknown')  # indigenous, imported, unknown
    description = db.Column(db.Text)
    specifications = db.Column(db.JSON)
    certification = db.Column(db.String(255))
    
    # Status
    verification_status = db.Column(db.String(50), default='unverified')
    risk_level = db.Column(db.String(50), default='medium')
    risk_score = db.Column(db.Numeric(5, 2))
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    supplier = db.relationship('Supplier', back_populates='components')
    documents = db.relationship('Document', back_populates='component', lazy='dynamic')
    risk_assessments = db.relationship('RiskAssessment', back_populates='component', lazy='dynamic')
    
    # Constraints
    __table_args__ = (
        CheckConstraint(category.in_(['Semiconductor', 'Microcontroller', 'Sensor', 'PCB', 'Power IC', 'Memory', 'Communication Module', 'Power Electronics', 'Other']), name='check_component_category'),
        CheckConstraint(indigenous_status.in_(['indigenous', 'imported', 'unknown']), name='check_indigenous_status'),
        CheckConstraint(verification_status.in_(['pending', 'verified', 'partially_verified', 'unverified', 'requires_review']), name='check_component_verification'),
        CheckConstraint(risk_level.in_(['low', 'medium', 'high']), name='check_component_risk'),
        Index('idx_component_supplier', 'supplier_id'),
        Index('idx_component_category', 'category'),
        Index('idx_component_indigenous', 'indigenous_status'),
    )
    
    def to_dict(self):
        return {
            'id': self.id,
            'supplier_id': self.supplier_id,
            'component_name': self.component_name,
            'component_number': self.component_number,
            'category': self.category,
            'manufacturer': self.manufacturer,
            'country_of_origin': self.country_of_origin,
            'manufacturing_location': self.manufacturing_location,
            'indigenous_status': self.indigenous_status,
            'description': self.description,
            'specifications': self.specifications,
            'certification': self.certification,
            'verification_status': self.verification_status,
            'risk_level': self.risk_level,
            'risk_score': float(self.risk_score) if self.risk_score else None,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }


class Document(db.Model):
    """Document model for file uploads"""
    __tablename__ = 'documents'
    
    id = db.Column(db.Integer, primary_key=True)
    supplier_id = db.Column(db.Integer, db.ForeignKey('suppliers.id'), nullable=True, index=True)
    component_id = db.Column(db.Integer, db.ForeignKey('components.id'), nullable=True, index=True)
    document_type = db.Column(db.String(100), nullable=False)
    original_filename = db.Column(db.String(255), nullable=False)
    stored_filename = db.Column(db.String(255), nullable=False)
    storage_path = db.Column(db.String(500), nullable=False)
    mime_type = db.Column(db.String(100))
    file_size = db.Column(db.Integer)
    verification_status = db.Column(db.String(50), default='pending')  # pending, verified, rejected
    extracted_text = db.Column(db.Text)
    uploaded_by = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    uploaded_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    supplier = db.relationship('Supplier', back_populates='documents')
    component = db.relationship('Component', back_populates='documents')
    uploader = db.relationship('User')
    
    # Constraints
    __table_args__ = (
        CheckConstraint(document_type.in_(['Company Registration', 'Product Certificate', 'Manufacturing Certificate', 'Quality Certificate', 'Compliance Certificate', 'Origin Documentation', 'Other']), name='check_document_type'),
        CheckConstraint(verification_status.in_(['pending', 'verified', 'rejected']), name='check_document_verification'),
    )
    
    def to_dict(self):
        return {
            'id': self.id,
            'supplier_id': self.supplier_id,
            'component_id': self.component_id,
            'document_type': self.document_type,
            'original_filename': self.original_filename,
            'stored_filename': self.stored_filename,
            'mime_type': self.mime_type,
            'file_size': self.file_size,
            'verification_status': self.verification_status,
            'uploaded_by': self.uploaded_by,
            'uploaded_at': self.uploaded_at.isoformat() if self.uploaded_at else None
        }


class RiskAssessment(db.Model):
    """Risk assessment model"""
    __tablename__ = 'risk_assessments'
    
    id = db.Column(db.Integer, primary_key=True)
    supplier_id = db.Column(db.Integer, db.ForeignKey('suppliers.id'), nullable=True, index=True)
    component_id = db.Column(db.Integer, db.ForeignKey('components.id'), nullable=True, index=True)
    risk_score = db.Column(db.Numeric(5, 2), nullable=False)
    risk_level = db.Column(db.String(50), nullable=False)
    confidence_score = db.Column(db.Numeric(4, 3))
    assessment_summary = db.Column(db.Text)
    model_version = db.Column(db.String(50), nullable=False)
    created_by = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    supplier = db.relationship('Supplier', back_populates='risk_assessments')
    component = db.relationship('Component', back_populates='risk_assessments')
    creator = db.relationship('User')
    factors = db.relationship('RiskFactor', back_populates='risk_assessment', lazy='dynamic', cascade='all, delete-orphan')
    
    # Constraints
    __table_args__ = (
        CheckConstraint(risk_level.in_(['low', 'medium', 'high']), name='check_assessment_risk_level'),
        CheckConstraint('supplier_id IS NOT NULL OR component_id IS NOT NULL', name='check_assessment_target'),
    )
    
    def to_dict(self):
        return {
            'id': self.id,
            'supplier_id': self.supplier_id,
            'component_id': self.component_id,
            'risk_score': float(self.risk_score),
            'risk_level': self.risk_level,
            'confidence_score': float(self.confidence_score) if self.confidence_score else None,
            'assessment_summary': self.assessment_summary,
            'model_version': self.model_version,
            'created_by': self.created_by,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }


class RiskFactor(db.Model):
    """Individual risk factors for an assessment"""
    __tablename__ = 'risk_factors'
    
    id = db.Column(db.Integer, primary_key=True)
    risk_assessment_id = db.Column(db.Integer, db.ForeignKey('risk_assessments.id'), nullable=False)
    factor_name = db.Column(db.String(100), nullable=False)
    factor_value = db.Column(db.Numeric(5, 2), nullable=False)
    contribution = db.Column(db.String(20))  # positive, negative, neutral
    explanation = db.Column(db.Text)
    
    # Relationships
    risk_assessment = db.relationship('RiskAssessment', back_populates='factors')
    
    # Constraints
    __table_args__ = (
        CheckConstraint(contribution.in_(['positive', 'negative', 'neutral']), name='check_contribution'),
    )
    
    def to_dict(self):
        return {
            'id': self.id,
            'factor_name': self.factor_name,
            'factor_value': float(self.factor_value),
            'contribution': self.contribution,
            'explanation': self.explanation
        }


class VerificationRecord(db.Model):
    """Verification workflow records"""
    __tablename__ = 'verification_records'
    
    id = db.Column(db.Integer, primary_key=True)
    supplier_id = db.Column(db.Integer, db.ForeignKey('suppliers.id'), nullable=True)
    component_id = db.Column(db.Integer, db.ForeignKey('components.id'), nullable=True)
    verification_status = db.Column(db.String(50), default='pending')
    verification_notes = db.Column(db.Text)
    checked_fields = db.Column(db.JSON)  # Store which fields were checked
    missing_fields = db.Column(db.JSON)  # Store missing required fields
    documents_reviewed = db.Column(db.JSON)  # Store document IDs reviewed
    reviewed_by = db.Column(db.Integer, db.ForeignKey('users.id'))
    reviewed_at = db.Column(db.DateTime)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    reviewer = db.relationship('User')
    
    # Constraints
    __table_args__ = (
        CheckConstraint(verification_status.in_(['pending', 'verified', 'partially_verified', 'unverified', 'requires_review']), name='check_record_status'),
        CheckConstraint('supplier_id IS NOT NULL OR component_id IS NOT NULL', name='check_record_target'),
    )
    
    def to_dict(self):
        return {
            'id': self.id,
            'supplier_id': self.supplier_id,
            'component_id': self.component_id,
            'verification_status': self.verification_status,
            'verification_notes': self.verification_notes,
            'checked_fields': self.checked_fields,
            'missing_fields': self.missing_fields,
            'documents_reviewed': self.documents_reviewed,
            'reviewed_by': self.reviewed_by,
            'reviewed_at': self.reviewed_at.isoformat() if self.reviewed_at else None,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }


class AuditLog(db.Model):
    """Audit logging for all system activities"""
    __tablename__ = 'audit_logs'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    action = db.Column(db.String(100), nullable=False)  # login, logout, create, update, delete, etc.
    entity_type = db.Column(db.String(50))  # user, supplier, component, document, etc.
    entity_id = db.Column(db.Integer)
    old_values = db.Column(db.JSON)
    new_values = db.Column(db.JSON)
    ip_address = db.Column(db.String(45))
    user_agent = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    user = db.relationship('User')
    
    # Indexes
    __table_args__ = (
        Index('idx_audit_user', 'user_id'),
        Index('idx_audit_action', 'action'),
        Index('idx_audit_entity', 'entity_type', 'entity_id'),
        Index('idx_audit_created', 'created_at'),
    )
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'action': self.action,
            'entity_type': self.entity_type,
            'entity_id': self.entity_id,
            'old_values': self.old_values,
            'new_values': self.new_values,
            'ip_address': self.ip_address,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
