"""
BharatAI Flask Application Factory
"""
from flask import Flask, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv
import os

# Initialize extensions
db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()

def create_app(config_name=None):
    """Application factory pattern"""
    app = Flask(__name__)
    
    # Load configuration from environment
    load_dotenv()
    
    # Configuration
    app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-secret-key-change-in-production')
    app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'postgresql://postgres:postgres@localhost:5432/bharatai')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['MAX_CONTENT_LENGTH'] = int(os.environ.get('MAX_CONTENT_LENGTH', 16 * 1024 * 1024))  # 16MB default
    app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY', 'jwt-secret-key-change-in-production')
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = int(os.environ.get('JWT_ACCESS_TOKEN_EXPIRES', 86400))  # 24 hours default
    
    # File storage configuration
    app.config['FILE_STORAGE_PATH'] = os.environ.get('FILE_STORAGE_PATH', './uploads')
    app.config['MODEL_PATH'] = os.environ.get('MODEL_PATH', './ml/models')
    
    # Ensure upload directory exists
    os.makedirs(app.config['FILE_STORAGE_PATH'], exist_ok=True)
    os.makedirs(app.config['MODEL_PATH'], exist_ok=True)
    
    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    
    # Configure CORS
    cors_origins = os.environ.get('CORS_ORIGINS', 'http://localhost:5173,http://localhost:3000').split(',')
    CORS(app, resources={
        r"/api/*": {
            "origins": cors_origins,
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"]
        }
    })
    
    # JWT error handlers
    @jwt.expired_token_loader
    def expired_token_callback(jwt_header, jwt_payload):
        return jsonify({'message': 'Token has expired', 'error': 'token_expired'}), 401
    
    @jwt.invalid_token_loader
    def invalid_token_callback(error):
        return jsonify({'message': 'Invalid token', 'error': 'invalid_token'}), 401
    
    @jwt.unauthorized_loader
    def missing_token_callback(error):
        return jsonify({'message': 'Authorization token required', 'error': 'authorization_required'}), 401
    
    # Register blueprints
    from app.routes.auth import auth_bp
    from app.routes.suppliers import suppliers_bp
    from app.routes.components import components_bp
    from app.routes.documents import documents_bp
    from app.routes.risk_analysis import risk_bp
    from app.routes.verification import verification_bp
    from app.routes.dashboard import dashboard_bp
    from app.routes.audit import audit_bp
    
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(suppliers_bp, url_prefix='/api/suppliers')
    app.register_blueprint(components_bp, url_prefix='/api/components')
    app.register_blueprint(documents_bp, url_prefix='/api/documents')
    app.register_blueprint(risk_bp, url_prefix='/api/risk-analysis')
    app.register_blueprint(verification_bp, url_prefix='/api/verification')
    app.register_blueprint(dashboard_bp, url_prefix='/api/dashboard')
    app.register_blueprint(audit_bp, url_prefix='/api/audit')
    
    # Health check endpoint
    @app.route('/api/health')
    def health_check():
        try:
            # Test database connection
            db.session.execute(db.text('SELECT 1'))
            return jsonify({
                'status': 'healthy',
                'service': 'BharatAI API',
                'database': 'connected'
            }), 200
        except Exception as e:
            return jsonify({
                'status': 'unhealthy',
                'service': 'BharatAI API',
                'database': 'disconnected',
                'error': str(e)
            }), 503
    
    # Error handlers
    @app.errorhandler(400)
    def bad_request(error):
        return jsonify({'message': 'Bad request', 'error': str(error.description)}), 400
    
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({'message': 'Resource not found', 'error': 'not_found'}), 404
    
    @app.errorhandler(500)
    def internal_error(error):
        db.session.rollback()
        return jsonify({'message': 'Internal server error', 'error': 'internal_error'}), 500
    
    return app
