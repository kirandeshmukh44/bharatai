// Demo data for BharatAI Secure Supply Chain Platform
// This data is used for demonstration purposes

export const demoSuppliers = [
  {
    id: 1,
    name: 'Bharat Semiconductor Systems',
    registration_id: 'REG-IND-2021-001',
    country: 'India',
    state: 'Karnataka',
    city: 'Bangalore',
    manufacturing_location: 'Electronics City, Bangalore',
    industry: 'Semiconductors',
    website: 'www.bharatsemi.co.in',
    contact_email: 'contact@bharatsemi.co.in',
    contact_phone: '+91-80-XXXX-XXXX',
    years_in_operation: 8,
    quality_score: 88,
    delivery_score: 85,
    compliance_score: 92,
    financial_stability: 85,
    previous_incidents: 0,
    indigenous_claim: true,
    verification_status: 'verified',
    risk_level: 'LOW',
    trust_score: 86,
    components_count: 45
  },
  {
    id: 2,
    name: 'India Embedded Technologies',
    registration_id: 'REG-IND-2019-042',
    country: 'India',
    state: 'Telangana',
    city: 'Hyderabad',
    manufacturing_location: 'HITEC City, Hyderabad',
    industry: 'Microcontrollers',
    website: 'www.indiaembedded.tech',
    contact_email: 'info@indiaembedded.tech',
    contact_phone: '+91-40-XXXX-XXXX',
    years_in_operation: 12,
    quality_score: 82,
    delivery_score: 78,
    compliance_score: 88,
    financial_stability: 80,
    previous_incidents: 1,
    indigenous_claim: true,
    verification_status: 'verified',
    risk_level: 'LOW',
    trust_score: 82,
    components_count: 38
  },
  {
    id: 3,
    name: 'Deccan Micro Devices',
    registration_id: 'REG-IND-2020-015',
    country: 'India',
    state: 'Maharashtra',
    city: 'Pune',
    manufacturing_location: 'Chakan Industrial Area, Pune',
    industry: 'Sensors',
    website: 'www.deccanmicro.com',
    contact_email: 'business@deccanmicro.com',
    contact_phone: '+91-20-XXXX-XXXX',
    years_in_operation: 6,
    quality_score: 75,
    delivery_score: 72,
    compliance_score: 78,
    financial_stability: 70,
    previous_incidents: 0,
    indigenous_claim: true,
    verification_status: 'partially_verified',
    risk_level: 'MEDIUM',
    trust_score: 74,
    components_count: 24
  },
  {
    id: 4,
    name: 'Nova Power Electronics',
    registration_id: 'REG-IND-2018-089',
    country: 'India',
    state: 'Tamil Nadu',
    city: 'Chennai',
    manufacturing_location: 'Sriperumbudur, Chennai',
    industry: 'Power Electronics',
    website: 'www.novapower.in',
    contact_email: 'sales@novapower.in',
    contact_phone: '+91-44-XXXX-XXXX',
    years_in_operation: 15,
    quality_score: 90,
    delivery_score: 88,
    compliance_score: 94,
    financial_stability: 88,
    previous_incidents: 0,
    indigenous_claim: true,
    verification_status: 'verified',
    risk_level: 'LOW',
    trust_score: 90,
    components_count: 52
  },
  {
    id: 5,
    name: 'Western Sensor Technologies',
    registration_id: 'REG-INT-2017-033',
    country: 'Singapore',
    state: null,
    city: 'Singapore',
    manufacturing_location: 'Jurong Industrial Estate',
    industry: 'Sensors',
    website: 'www.westernsensortech.sg',
    contact_email: 'contact@westernsensortech.sg',
    contact_phone: '+65-XXXX-XXXX',
    years_in_operation: 20,
    quality_score: 85,
    delivery_score: 82,
    compliance_score: 90,
    financial_stability: 92,
    previous_incidents: 2,
    indigenous_claim: false,
    verification_status: 'verified',
    risk_level: 'MEDIUM',
    trust_score: 82,
    components_count: 41
  },
  {
    id: 6,
    name: 'Himalaya Circuits Pvt Ltd',
    registration_id: 'REG-IND-2022-007',
    country: 'India',
    state: 'Uttarakhand',
    city: 'Dehradun',
    manufacturing_location: 'SIDCUL Industrial Area',
    industry: 'PCB Manufacturing',
    website: 'www.himalayacircuits.in',
    contact_email: 'info@himalayacircuits.in',
    contact_phone: '+91-135-XXXX-XXX',
    years_in_operation: 3,
    quality_score: 68,
    delivery_score: 65,
    compliance_score: 72,
    financial_stability: 60,
    previous_incidents: 1,
    indigenous_claim: true,
    verification_status: 'unverified',
    risk_level: 'HIGH',
    trust_score: 66,
    components_count: 18
  }
];

export const demoComponents = [
  {
    id: 1,
    supplier_id: 1,
    name: 'BharatChip X1 Microcontroller',
    component_number: 'BC-X1-2024',
    category: 'Microcontroller',
    manufacturer: 'Bharat Semiconductor Systems',
    country_of_origin: 'India',
    manufacturing_location: 'Bangalore, India',
    indigenous_status: 'indigenous',
    description: 'High-performance 32-bit ARM-based microcontroller for industrial applications',
    specifications: { cores: '4', clock: '1.2GHz', memory: '512KB' },
    certification: 'ISO 9001, ISI Mark',
    verification_status: 'verified',
    risk_level: 'LOW',
    trust_score: 88
  },
  {
    id: 2,
    supplier_id: 1,
    name: 'IndiSense Temperature Sensor',
    component_number: 'IST-400',
    category: 'Sensor',
    manufacturer: 'Bharat Semiconductor Systems',
    country_of_origin: 'India',
    manufacturing_location: 'Bangalore, India',
    indigenous_status: 'indigenous',
    description: 'Precision temperature sensor with digital output',
    specifications: { range: '-40 to 125C', accuracy: '±0.5°C', interface: 'I2C' },
    certification: 'CE, RoHS',
    verification_status: 'verified',
    risk_level: 'LOW',
    trust_score: 85
  },
  {
    id: 3,
    supplier_id: 2,
    name: 'EmbedCore Pro MCU',
    component_number: 'ECP-256',
    category: 'Microcontroller',
    manufacturer: 'India Embedded Technologies',
    country_of_origin: 'India',
    manufacturing_location: 'Hyderabad, India',
    indigenous_status: 'indigenous',
    description: 'Low-power microcontroller for IoT devices',
    specifications: { cores: '2', clock: '480MHz', memory: '256KB' },
    certification: 'ISO 9001',
    verification_status: 'verified',
    risk_level: 'LOW',
    trust_score: 82
  },
  {
    id: 4,
    supplier_id: 3,
    name: 'DeccanPressure DP-100',
    component_number: 'DP-100-HD',
    category: 'Sensor',
    manufacturer: 'Deccan Micro Devices',
    country_of_origin: 'India',
    manufacturing_location: 'Pune, India',
    indigenous_status: 'indigenous',
    description: 'High-precision pressure sensor for industrial use',
    specifications: { range: '0-100 bar', accuracy: '±0.1% FS', output: '4-20mA' },
    certification: 'CE',
    verification_status: 'partially_verified',
    risk_level: 'MEDIUM',
    trust_score: 74
  },
  {
    id: 5,
    supplier_id: 4,
    name: 'NovaPower DC-DC Converter',
    component_number: 'NP-DC50',
    category: 'Power IC',
    manufacturer: 'Nova Power Electronics',
    country_of_origin: 'India',
    manufacturing_location: 'Chennai, India',
    indigenous_status: 'indigenous',
    description: 'High-efficiency DC-DC converter module',
    specifications: { input: '12-48V', output: '5V/10A', efficiency: '95%' },
    certification: 'ISO 9001, UL',
    verification_status: 'verified',
    risk_level: 'LOW',
    trust_score: 90
  },
  {
    id: 6,
    supplier_id: 5,
    name: 'WST Accelerometer Module',
    component_number: 'WST-ACC-3D',
    category: 'Sensor',
    manufacturer: 'Western Sensor Technologies',
    country_of_origin: 'Singapore',
    manufacturing_location: 'Singapore',
    indigenous_status: 'imported',
    description: '3-axis MEMS accelerometer',
    specifications: { range: '±16g', resolution: '16-bit', interface: 'SPI/I2C' },
    certification: 'CE, FCC',
    verification_status: 'verified',
    risk_level: 'MEDIUM',
    trust_score: 82
  },
  {
    id: 7,
    supplier_id: 6,
    name: 'HimaBoard 4-Layer PCB',
    component_number: 'HB-4L-STD',
    category: 'PCB',
    manufacturer: 'Himalaya Circuits Pvt Ltd',
    country_of_origin: 'India',
    manufacturing_location: 'Dehradun, India',
    indigenous_status: 'indigenous',
    description: 'Standard 4-layer PCB for consumer electronics',
    specifications: { layers: '4', thickness: '1.6mm', material: 'FR-4' },
    certification: 'UL',
    verification_status: 'unverified',
    risk_level: 'HIGH',
    trust_score: 66
  }
];

export const demoRiskAssessments = [
  {
    id: 1,
    supplier_id: 1,
    component_id: 1,
    risk_score: 86,
    risk_level: 'LOW',
    confidence: 0.87,
    assessment_summary: 'Supplier demonstrates strong operational reliability with comprehensive documentation and compliance. Trust Score: 86/100',
    factors: {
      documentation: 90,
      compliance: 92,
      supplier_reliability: 86,
      origin_confidence: 95,
      quality_score: 88,
      financial_stability: 85
    },
    positive_factors: [
      'Strong regulatory compliance',
      'High quality standards',
      'Complete documentation',
      'Established company history',
      'Good delivery performance'
    ],
    negative_factors: [],
    created_at: '2024-01-15T10:30:00Z'
  },
  {
    id: 2,
    supplier_id: 5,
    component_id: 6,
    risk_score: 82,
    risk_level: 'MEDIUM',
    confidence: 0.84,
    assessment_summary: 'Supplier shows acceptable operational reliability, but some factors require additional review. Trust Score: 82/100',
    factors: {
      documentation: 85,
      compliance: 90,
      supplier_reliability: 78,
      origin_confidence: 85,
      quality_score: 85,
      financial_stability: 92
    },
    positive_factors: [
      'Strong regulatory compliance',
      'High quality standards',
      'Good delivery performance'
    ],
    negative_factors: [
      '2 previous incident(s) recorded'
    ],
    created_at: '2024-01-14T14:20:00Z'
  },
  {
    id: 3,
    supplier_id: 6,
    component_id: 7,
    risk_score: 66,
    risk_level: 'HIGH',
    confidence: 0.79,
    assessment_summary: 'Multiple risk factors identified. Recommend thorough due diligence before engagement. Trust Score: 66/100',
    factors: {
      documentation: 55,
      compliance: 72,
      supplier_reliability: 58,
      origin_confidence: 80,
      quality_score: 68,
      financial_stability: 60
    },
    positive_factors: [
      'Indigenous manufacturing'
    ],
    negative_factors: [
      'Incomplete documentation',
      '1 previous incident(s) recorded',
      'Financial stability concerns',
      'Compliance gaps identified'
    ],
    created_at: '2024-01-13T09:15:00Z'
  }
];

export const demoDocuments = [
  {
    id: 1,
    supplier_id: 1,
    component_id: null,
    document_type: 'Company Registration',
    file_name: 'bharat_semi_registration.pdf',
    file_size: 2457600,
    mime_type: 'application/pdf',
    verification_status: 'verified',
    uploaded_at: '2024-01-10T08:00:00Z'
  },
  {
    id: 2,
    supplier_id: 1,
    component_id: 1,
    document_type: 'Product Certificate',
    file_name: 'bc_x1_certification.pdf',
    file_size: 1843200,
    mime_type: 'application/pdf',
    verification_status: 'verified',
    uploaded_at: '2024-01-10T08:30:00Z'
  },
  {
    id: 3,
    supplier_id: 2,
    component_id: null,
    document_type: 'Quality Certificate',
    file_name: 'iet_iso_cert.pdf',
    file_size: 1536000,
    mime_type: 'application/pdf',
    verification_status: 'verified',
    uploaded_at: '2024-01-08T11:20:00Z'
  },
  {
    id: 4,
    supplier_id: 3,
    component_id: null,
    document_type: 'Company Registration',
    file_name: 'deccan_reg_partial.pdf',
    file_size: 1024000,
    mime_type: 'application/pdf',
    verification_status: 'pending',
    uploaded_at: '2024-01-05T14:00:00Z'
  }
];

export const demoVerificationRequests = [
  {
    id: 1,
    entity_name: 'Bharat Semiconductor Systems',
    request_type: 'supplier_verification',
    status: 'verified',
    priority: 'high',
    notes: 'Complete verification requested for government tender',
    review_notes: 'All documentation verified. Company meets all requirements.',
    created_at: '2024-01-10T08:00:00Z',
    reviewed_at: '2024-01-12T16:30:00Z'
  },
  {
    id: 2,
    entity_name: 'Himalaya Circuits Pvt Ltd',
    request_type: 'supplier_verification',
    status: 'requires_review',
    priority: 'normal',
    notes: 'New supplier onboarding request',
    review_notes: 'Additional documentation required for financial stability verification.',
    created_at: '2024-01-08T10:15:00Z',
    reviewed_at: '2024-01-11T09:45:00Z'
  },
  {
    id: 3,
    entity_name: 'BharatChip X1 Microcontroller',
    request_type: 'component_verification',
    status: 'pending',
    priority: 'high',
    notes: 'Critical component for defense project',
    review_notes: null,
    created_at: '2024-01-15T11:00:00Z',
    reviewed_at: null
  }
];

export const dashboardStats = {
  kpi: {
    total_suppliers: 128,
    verified_suppliers: 94,
    total_components: 356,
    high_risk_count: 18,
    indigenous_components: 217,
    pending_verification: 27
  },
  risk_distribution: {
    'LOW': 210,
    'MEDIUM': 128,
    'HIGH': 18
  },
  indigenous_distribution: {
    'indigenous': 217,
    'imported': 98,
    'unknown': 41
  },
  category_distribution: {
    'Semiconductor': 45,
    'Microcontroller': 62,
    'Sensor': 78,
    'PCB': 52,
    'Power IC': 38,
    'Memory': 42,
    'Communication Module': 29,
    'Other': 10
  }
};

export const trendData = Array.from({ length: 30 }, (_, i) => ({
  date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  avg_risk_score: 65 + Math.random() * 15,
  high_risk_count: 15 + Math.floor(Math.random() * 10),
  verified_count: 80 + Math.floor(Math.random() * 20)
}));
