# BharatAI Secure Supply Chain Platform

**AI-Powered Indigenous Component Verification & Supply Chain Intelligence**

A production-ready full-stack web application for managing, verifying, and analyzing technology supply chains with a focus on indigenous innovation and technology sovereignty.

## Architecture

```
                    USER
                     │
                     ▼
              React Frontend
                     │
                  HTTPS
                     │
                     ▼
               Flask REST API
                     │
          ┌──────────┼──────────┐
          ▼          ▼          ▼
      PostgreSQL   ML Engine   File Storage
          │          │          │
          └──────────┼──────────┘
                     ▼
              Risk Assessment
                     │
                     ▼
                Dashboard
```

## Technology Stack

### Frontend
- React 18 + TypeScript
- Vite (Build tool)
- Tailwind CSS
- React Router DOM
- TanStack Query (React Query)
- React Hook Form
- Zod (Validation)
- Recharts (Charts)
- Lucide React (Icons)

### Backend
- Python 3.10+
- Flask
- Flask-SQLAlchemy
- Flask-Migrate (Alembic)
- Flask-JWT-Extended
- Marshmallow (Validation)
- PostgreSQL

### AI/ML
- Scikit-learn
- Pandas
- NumPy
- Joblib

## Project Structure

```
bharatai/
├── backend/              # Flask Backend
│   ├── app/
│   │   ├── models/       # Database models
│   │   ├── routes/       # API routes
│   │   ├── services/     # Business logic
│   │   └── utils/        # Utilities
│   ├── migrations/       # Database migrations
│   ├── requirements.txt
│   └── run.py           # Entry point
│
├── frontend/             # React Frontend
│   ├── src/
│   │   ├── components/   # UI components
│   │   ├── pages/        # Page components
│   │   ├── hooks/        # Custom hooks
│   │   ├── services/     # API services
│   │   ├── types/        # TypeScript types
│   │   └── utils/        # Utilities
│   ├── package.json
│   └── vite.config.ts
│
├── ml/                   # Machine Learning
│   ├── data/            # Training data
│   ├── training/        # Training scripts
│   └── models/          # Saved models
│
└── README.md
```

## Local Development Setup

### Prerequisites
- Python 3.10+
- Node.js 18+
- PostgreSQL 14+

### 1. Database Setup

```bash
# Create PostgreSQL database
createdb bharatai

# Or using psql
psql -U postgres -c "CREATE DATABASE bharatai;"
```

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Set environment variables
cp .env.example .env
# Edit .env with your configuration

# Run database migrations
flask db upgrade

# Start backend server
python run.py
```

Backend will be available at `http://localhost:5000`

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will be available at `http://localhost:5173`

## Environment Variables

### Backend (.env)
```
DATABASE_URL=postgresql://username:password@localhost:5432/bharatai
SECRET_KEY=your-super-secret-key
JWT_SECRET_KEY=your-jwt-secret-key
FLASK_ENV=development
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
FILE_STORAGE_PATH=./uploads
MAX_CONTENT_LENGTH=16777216
```

### Frontend (.env)
```
VITE_API_BASE_URL=http://localhost:5000/api
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/me` - Update profile

### Suppliers
- `GET /api/suppliers` - List suppliers
- `POST /api/suppliers` - Create supplier
- `GET /api/suppliers/:id` - Get supplier details
- `PUT /api/suppliers/:id` - Update supplier
- `DELETE /api/suppliers/:id` - Delete supplier

### Components
- `GET /api/components` - List components
- `POST /api/components` - Create component
- `GET /api/components/:id` - Get component details
- `PUT /api/components/:id` - Update component
- `DELETE /api/components/:id` - Delete component

### Documents
- `GET /api/documents` - List documents
- `POST /api/documents/upload` - Upload document
- `GET /api/documents/:id/download` - Download document
- `DELETE /api/documents/:id` - Delete document

### Risk Analysis
- `POST /api/risk-analysis` - Run risk analysis
- `GET /api/risk-analysis` - Get assessment history
- `GET /api/risk-analysis/stats` - Get risk statistics

### Verification
- `POST /api/verification` - Create verification
- `GET /api/verification` - List verifications
- `PUT /api/verification/:id` - Update verification

### Dashboard
- `GET /api/dashboard/summary` - Dashboard summary
- `GET /api/dashboard/risk-distribution` - Risk distribution
- `GET /api/dashboard/trends` - Risk trends

## Deployment

### Backend Deployment (Render/Railway)

1. Create a new Web Service
2. Connect your GitHub repository
3. Set build command: `pip install -r requirements.txt`
4. Set start command: `gunicorn run:app`
5. Add environment variables
6. Deploy

### Frontend Deployment (Vercel)

1. Connect your GitHub repository
2. Set framework preset to Vite
3. Set build command: `npm run build`
4. Set output directory: `dist`
5. Add environment variables
6. Deploy

### Database (Managed PostgreSQL)

Use services like:
- AWS RDS
- Google Cloud SQL
- Azure Database
- ElephantSQL
- Supabase

## Security Features

- Password hashing with bcrypt
- JWT-based authentication
- Role-based access control (Admin/User)
- Input validation with Marshmallow
- SQL injection protection via SQLAlchemy ORM
- File type and size validation
- Audit logging
- CORS configuration

## AI Risk Assessment

The platform uses a hybrid approach for risk assessment:

1. **Baseline Heuristic Model**: Rule-based scoring using weighted factors
2. **ML Model**: Scikit-learn Random Forest classifier (when trained)

Risk factors include:
- Quality scores
- Compliance scores
- Financial stability
- Previous incidents
- Documentation completeness
- Operational history

## Features

### Core Features
- User registration and authentication
- Supplier management (CRUD)
- Component management (CRUD)
- Document upload and storage
- Verification workflow
- AI-powered risk assessment
- Dashboard with analytics
- Audit logging

### User Roles
- **Admin**: Full access to all features and data
- **Organization User**: Access to own organization's data only

## License

MIT License

## Contributing

Contributions are welcome! Please read the contributing guidelines first.

## Support

For support, email support@bharatai.example.com or open an issue on GitHub.

---

**Built for India's Technology Sovereignty**
