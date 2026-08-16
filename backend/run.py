#!/usr/bin/env python3
"""
BharatAI Secure Supply Chain Platform - Flask Application Entry Point
"""
import os
from dotenv import load_dotenv
from app import create_app, db
from app.models import User, Organization, Supplier, Component, Document, RiskAssessment, VerificationRecord, AuditLog

# Load environment variables
load_dotenv()

# Create Flask application
app = create_app()

# Make models available in Flask shell
@app.shell_context_processor
def make_shell_context():
    return {
        'db': db,
        'User': User,
        'Organization': Organization,
        'Supplier': Supplier,
        'Component': Component,
        'Document': Document,
        'RiskAssessment': RiskAssessment,
        'VerificationRecord': VerificationRecord,
        'AuditLog': AuditLog
    }

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    debug = os.environ.get('FLASK_ENV') == 'development'
    app.run(host='0.0.0.0', port=port, debug=debug)
