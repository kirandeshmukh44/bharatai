"""
AI Risk Analysis Engine using Scikit-learn
"""
import os
import pickle
import json
import numpy as np
from datetime import datetime

class RiskAnalysisEngine:
    """
    Risk Analysis Engine for Supplier and Component Assessment
    Uses trained ML models for risk prediction
    """
    
    def __init__(self, model_path=None):
        self.model_path = model_path or os.environ.get('MODEL_PATH', './ml/models')
        self.model = None
        self.scaler = None
        self.feature_names = [
            'quality_score',
            'delivery_score',
            'compliance_score',
            'financial_stability_score',
            'years_in_operation',
            'previous_incidents',
            'indigenous_claim',
            'has_manufacturing_location',
            'has_certification',
            'documentation_completeness'
        ]
        self.model_version = 'v1.0-baseline'
        self._load_model()
    
    def _load_model(self):
        """Load trained model and scaler from disk"""
        model_file = os.path.join(self.model_path, 'risk_model.pkl')
        scaler_file = os.path.join(self.model_path, 'risk_scaler.pkl')
        
        try:
            if os.path.exists(model_file):
                with open(model_file, 'rb') as f:
                    self.model = pickle.load(f)
            if os.path.exists(scaler_file):
                with open(scaler_file, 'rb') as f:
                    self.scaler = pickle.load(f)
            print(f"Model loaded successfully from {self.model_path}")
        except Exception as e:
            print(f"Warning: Could not load model: {e}")
            print("Using baseline heuristic model")
            self.model = None
    
    def _extract_features(self, data):
        """Extract features from supplier/component data"""
        supplier = data.get('supplier', {})
        component = data.get('component', {})
        documents = data.get('documents', [])
        
        features = {}
        
        # Supplier scores (0-100)
        features['quality_score'] = supplier.get('quality_score', 50) or 50
        features['delivery_score'] = supplier.get('delivery_score', 50) or 50
        features['compliance_score'] = supplier.get('compliance_score', 50) or 50
        features['financial_stability_score'] = supplier.get('financial_stability_score', 50) or 50
        
        # Operational history
        features['years_in_operation'] = supplier.get('years_in_operation', 0) or 0
        features['previous_incidents'] = supplier.get('previous_incidents', 0) or 0
        
        # Binary features
        features['indigenous_claim'] = 1 if supplier.get('indigenous_claim', False) else 0
        features['has_manufacturing_location'] = 1 if supplier.get('manufacturing_location') else 0
        features['has_certification'] = 1 if component.get('certification') else 0
        
        # Documentation completeness
        required_docs = ['Company Registration', 'Quality Certificate']
        doc_types = [d.get('document_type') for d in documents]
        features['documentation_completeness'] = sum(1 for doc in required_docs if doc in doc_types) / len(required_docs) * 100
        
        return features
    
    def _calculate_baseline_risk(self, features):
        """Calculate risk using baseline heuristic when ML model unavailable"""
        # Weights for different factors
        weights = {
            'quality_score': 0.15,
            'delivery_score': 0.10,
            'compliance_score': 0.20,
            'financial_stability_score': 0.15,
            'years_in_operation': 0.10,
            'previous_incidents': -0.15,  # Negative weight - incidents reduce score
            'indigenous_claim': 0.05,
            'has_manufacturing_location': 0.05,
            'has_certification': 0.05,
            'documentation_completeness': 0.10
        }
        
        # Normalize years in operation (cap at 20 years)
        years_normalized = min(features['years_in_operation'] / 20 * 100, 100)
        
        # Calculate weighted score
        score = 0
        score += features['quality_score'] * weights['quality_score']
        score += features['delivery_score'] * weights['delivery_score']
        score += features['compliance_score'] * weights['compliance_score']
        score += features['financial_stability_score'] * weights['financial_stability_score']
        score += years_normalized * weights['years_in_operation']
        score += max(0, 100 - features['previous_incidents'] * 20) * abs(weights['previous_incidents'])
        score += features['indigenous_claim'] * 100 * weights['indigenous_claim']
        score += features['has_manufacturing_location'] * 100 * weights['has_manufacturing_location']
        score += features['has_certification'] * 100 * weights['has_certification']
        score += features['documentation_completeness'] * weights['documentation_completeness']
        
        # Normalize to 0-100
        trust_score = max(0, min(100, score))
        
        return trust_score
    
    def _generate_factors(self, features, trust_score):
        """Generate risk factor analysis"""
        factors = []
        
        # Quality
        if features['quality_score'] >= 80:
            factors.append({'name': 'Quality Score', 'value': features['quality_score'], 'contribution': 'positive', 'explanation': 'Strong quality metrics'})
        elif features['quality_score'] < 60:
            factors.append({'name': 'Quality Score', 'value': features['quality_score'], 'contribution': 'negative', 'explanation': 'Quality concerns identified'})
        
        # Compliance
        if features['compliance_score'] >= 80:
            factors.append({'name': 'Compliance', 'value': features['compliance_score'], 'contribution': 'positive', 'explanation': 'Excellent regulatory compliance'})
        elif features['compliance_score'] < 60:
            factors.append({'name': 'Compliance', 'value': features['compliance_score'], 'contribution': 'negative', 'explanation': 'Compliance gaps identified'})
        
        # Incidents
        if features['previous_incidents'] == 0:
            factors.append({'name': 'Incident History', 'value': 100, 'contribution': 'positive', 'explanation': 'No previous incidents recorded'})
        else:
            factors.append({'name': 'Incident History', 'value': max(0, 100 - features['previous_incidents'] * 20), 'contribution': 'negative', 'explanation': f"{features['previous_incidents']} previous incident(s) on record"})
        
        # Documentation
        if features['documentation_completeness'] >= 80:
            factors.append({'name': 'Documentation', 'value': features['documentation_completeness'], 'contribution': 'positive', 'explanation': 'Complete documentation provided'})
        elif features['documentation_completeness'] < 50:
            factors.append({'name': 'Documentation', 'value': features['documentation_completeness'], 'contribution': 'negative', 'explanation': 'Incomplete documentation'})
        
        # Financial Stability
        if features['financial_stability_score'] >= 70:
            factors.append({'name': 'Financial Stability', 'value': features['financial_stability_score'], 'contribution': 'positive', 'explanation': 'Strong financial position'})
        elif features['financial_stability_score'] < 50:
            factors.append({'name': 'Financial Stability', 'value': features['financial_stability_score'], 'contribution': 'negative', 'explanation': 'Financial stability concerns'})
        
        # Experience
        if features['years_in_operation'] >= 10:
            factors.append({'name': 'Operational History', 'value': min(features['years_in_operation'] * 10, 100), 'contribution': 'positive', 'explanation': f"{features['years_in_operation']} years in operation"})
        elif features['years_in_operation'] < 3:
            factors.append({'name': 'Operational History', 'value': features['years_in_operation'] * 10, 'contribution': 'negative', 'explanation': 'Limited operational history'})
        
        return factors
    
    def _generate_summary(self, trust_score, risk_level, features, factors):
        """Generate human-readable assessment summary"""
        positive_count = sum(1 for f in factors if f['contribution'] == 'positive')
        negative_count = sum(1 for f in factors if f['contribution'] == 'negative')
        
        if risk_level == 'LOW':
            return f"Supplier demonstrates strong operational reliability with comprehensive documentation and compliance. {positive_count} positive factors identified. Trust Score: {trust_score:.0f}/100"
        elif risk_level == 'MEDIUM':
            return f"Supplier shows acceptable operational reliability, but {negative_count} factors require additional review. Trust Score: {trust_score:.0f}/100"
        else:
            return f"Multiple risk factors identified ({negative_count} concerns). Recommend thorough due diligence before engagement. Trust Score: {trust_score:.0f}/100"
    
    def analyze(self, data):
        """
        Analyze supplier/component data and return risk assessment
        
        Returns:
            dict: Risk assessment with score, level, confidence, factors, and summary
        """
        # Extract features
        features = self._extract_features(data)
        
        # Calculate risk score
        if self.model is not None and self.scaler is not None:
            # Use ML model
            try:
                feature_vector = np.array([[features.get(f, 0) for f in self.feature_names]])
                scaled_features = self.scaler.transform(feature_vector)
                prediction = self.model.predict(scaled_features)[0]
                probabilities = self.model.predict_proba(scaled_features)[0]
                confidence = max(probabilities)
                
                # Convert prediction to score (assuming model outputs 0=high risk, 2=low risk)
                trust_score = 100 - (prediction * 50)  # Map to 0-100 scale
            except Exception as e:
                print(f"ML prediction failed: {e}, using baseline")
                trust_score = self._calculate_baseline_risk(features)
                confidence = 0.75
        else:
            # Use baseline heuristic
            trust_score = self._calculate_baseline_risk(features)
            confidence = 0.75  # Baseline confidence
        
        # Determine risk level
        if trust_score >= 80:
            risk_level = 'LOW'
        elif trust_score >= 60:
            risk_level = 'MEDIUM'
        else:
            risk_level = 'HIGH'
        
        # Generate factors
        factors = self._generate_factors(features, trust_score)
        
        # Generate summary
        summary = self._generate_summary(trust_score, risk_level, features, factors)
        
        return {
            'risk_score': round(trust_score, 2),
            'risk_level': risk_level,
            'confidence_score': round(confidence * 100, 2),
            'assessment_summary': summary,
            'factors': factors,
            'model_version': self.model_version if self.model is None else 'v1.0-ml',
            'features_used': features,
            'created_at': datetime.utcnow().isoformat()
        }
    
    def train(self, training_data, labels):
        """
        Train the risk assessment model
        
        Args:
            training_data: Feature matrix
            labels: Risk labels (0=high, 1=medium, 2=low)
        """
        from sklearn.ensemble import RandomForestClassifier
        from sklearn.preprocessing import StandardScaler
        from sklearn.model_selection import train_test_split
        from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(
            training_data, labels, test_size=0.2, random_state=42, stratify=labels
        )
        
        # Scale features
        scaler = StandardScaler()
        X_train_scaled = scaler.fit_transform(X_train)
        X_test_scaled = scaler.transform(X_test)
        
        # Train model
        model = RandomForestClassifier(
            n_estimators=100,
            max_depth=10,
            random_state=42,
            class_weight='balanced'
        )
        model.fit(X_train_scaled, y_train)
        
        # Evaluate
        y_pred = model.predict(X_test_scaled)
        metrics = {
            'accuracy': accuracy_score(y_test, y_pred),
            'precision': precision_score(y_test, y_pred, average='weighted'),
            'recall': recall_score(y_test, y_pred, average='weighted'),
            'f1_score': f1_score(y_test, y_pred, average='weighted')
        }
        
        # Save model
        os.makedirs(self.model_path, exist_ok=True)
        with open(os.path.join(self.model_path, 'risk_model.pkl'), 'wb') as f:
            pickle.dump(model, f)
        with open(os.path.join(self.model_path, 'risk_scaler.pkl'), 'wb') as f:
            pickle.dump(scaler, f)
        with open(os.path.join(self.model_path, 'model_metrics.json'), 'w') as f:
            json.dump(metrics, f, indent=2)
        
        # Update instance
        self.model = model
        self.scaler = scaler
        self.model_version = 'v1.0-ml-trained'
        
        return metrics


# Singleton instance
_risk_engine = None

def get_risk_engine():
    """Get or create risk engine singleton"""
    global _risk_engine
    if _risk_engine is None:
        _risk_engine = RiskAnalysisEngine()
    return _risk_engine
