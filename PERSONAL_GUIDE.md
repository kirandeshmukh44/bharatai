# 🎯 BharatAI Hackathon Project - Complete Personal Guide

**Project Name:** BharatAI Secure Supply Chain Platform  
**Objective:** AI-Powered Indigenous Component Verification & Supply Chain Intelligence  
**Date Created:** 2026-08-16  
**Status:** ✅ Development Active | Backend Running | Frontend Running

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Initial Project Investigation](#initial-project-investigation)
3. [Architecture & Technology Stack](#architecture--technology-stack)
4. [Database Setup & Configuration](#database-setup--configuration)
5. [Backend Setup & API](#backend-setup--api)
6. [Frontend Setup & Configuration](#frontend-setup--configuration)
7. [Running the Project](#running-the-project)
8. [Development Workflow](#development-workflow)
9. [Deployment Guide](#deployment-guide)
10. [Maintenance & Troubleshooting](#maintenance--troubleshooting)

---

## 1. Project Overview

### 🎓 Project Idea

**BharatAI** is a **secure supply chain management platform** designed to:
- Verify indigenous component integration in technology systems
- Assess supplier quality and compliance using AI
- Analyze supply chain risk factors
- Track and audit component movements
- Provide real-time dashboard insights

### 🎯 Key Features

| Feature | Purpose |
|---------|---------|
| **Supplier Management** | Register, verify, and track supplier information |
| **Component Tracking** | Monitor component origins, specifications, and risk levels |
| **Risk Analysis** | AI-powered risk assessment for supply chain nodes |
| **Verification System** | Automated and manual verification workflows |
| **Audit Logging** | Complete audit trail for compliance |
| **Dashboard Analytics** | Real-time metrics and insights |
| **User Management** | Role-based access control (Admin, Auditor, Viewer) |

### 👥 Target Users

- **Supply Chain Managers** - Monitor and manage suppliers
- **Compliance Officers** - Verify and audit suppliers
- **Risk Analysts** - Assess and mitigate risks
- **Administrators** - System configuration and user management

---

## 2. Initial Project Investigation

### 📊 Discovery Phase

**What was discovered:**
- Existing PostgreSQL database (`bharatai`) with 12 tables and live data
- Pre-built Next.js frontend (React + TypeScript)
- Pre-built Flask backend (Python + SQLAlchemy)
- Production-ready architecture with JWT authentication

**Database Tables Identified:**
```
1. users              - User accounts and authentication
2. suppliers          - Supplier information and scores
3. components         - Component catalog and specifications
4. products           - Product definitions
5. manufacturers      - Manufacturer details
6. qr_records         - QR code tracking
7. risk_reports       - Risk assessment reports
8. security_events    - Security incident logs
9. supply_chain_nodes - Supply chain network
10. verification_logs - Verification audit trail
11. ai_predictions    - ML model predictions
12. (Custom tables)   - Additional tracking tables
```

**Initial Challenges:**
- ❌ Database URL mismatch (app expected `app_db`, actual database was `bharatai`)
- ❌ PostgreSQL authentication not configured for TCP connections
- ❌ Python dependency version conflicts (pandas 2.1.4 incompatible with Python 3.14)
- ❌ Schema field name mismatches between app models and live database

---

## 3. Architecture & Technology Stack

### 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    USER BROWSER                             │
│                   (localhost:3000)                           │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTP/HTTPS
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              NEXT.JS FRONTEND (React)                        │
│  - Dashboard                                                 │
│  - Supplier Management                                       │
│  - Component Tracking                                        │
│  - Risk Analysis UI                                          │
│  - Authentication Flow                                       │
│  - Real-time Charts & Metrics                                │
└────────────────────────┬────────────────────────────────────┘
                         │ REST API Calls (Port 5000)
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              FLASK BACKEND API                               │
│  - Authentication & JWT                                      │
│  - RESTful Endpoints                                         │
│  - Business Logic                                            │
│  - Data Validation                                           │
│  - Risk Engine & ML                                          │
│  - File Upload/Download                                      │
└────────────────────────┬────────────────────────────────────┘
                         │
        ┌────────────────┼────────────────┐
        ▼                ▼                ▼
┌──────────────┐  ┌────────────┐  ┌─────────────┐
│  PostgreSQL  │  │  ML Models │  │   Storage   │
│  Database    │  │   Engine   │  │  (Uploads)  │
│  (bharatai)  │  │            │  │             │
└──────────────┘  └────────────┘  └─────────────┘
```

### 📦 Frontend Stack

**Core Libraries:**
```
Framework:      Next.js 16.2.6
UI Library:     React 19.2.6
Language:       TypeScript 5.9.3
Styling:        Tailwind CSS 4.1.17
Database ORM:   Drizzle ORM 0.45.2
Database Driver:PostgreSQL (pg 8.20.0)
```

**UI Components:**
- Radix UI (Dialog, Dropdown, Tabs, Toast)
- Lucide React (Icons)
- Recharts (Data Visualization)
- Framer Motion (Animations)

**Key Frontend Features:**
- Server-side rendering with Next.js App Router
- Type-safe database queries with Drizzle
- Component-based architecture
- Real-time dashboard with charts
- Responsive design

### 🐍 Backend Stack

**Core Framework:**
```
Framework:      Flask 3.0.0
Database ORM:   Flask-SQLAlchemy 3.1.1
Database Driver:psycopg2-binary 2.9.9
Authentication: Flask-JWT-Extended 4.6.0
API Docs:       Flask-CORS 4.0.0
```

**Supporting Libraries:**
- **Data Validation:** Marshmallow 3.20.1
- **Security:** Bcrypt 4.1.2
- **Migration:** Flask-Migrate 4.0.5
- **ML/Data:** Pandas 2.0.3, Scikit-learn 1.3.2
- **File Processing:** PyPDF2 3.0.1, Pillow 10.1.0

**Backend API Routes:**
```
/api/auth/          - Authentication endpoints
/api/suppliers/     - Supplier management
/api/components/    - Component operations
/api/documents/     - Document handling
/api/risk-analysis/ - Risk assessment
/api/verification/  - Verification workflows
/api/dashboard/     - Dashboard data
/api/audit/         - Audit logging
/api/health/        - Health check
```

---

## 4. Database Setup & Configuration

### 🗄️ PostgreSQL Configuration

**Database Name:** `bharatai`  
**Host:** localhost  
**Port:** 5432  
**Version:** 18.4+

**User Credentials:**
```
User 1: postgres
Password: postgres
Role: Superuser

User 2: bharatai (Application User)
Password: bharatai
Permissions: All on database bharatai
```

### 📋 Database Schema Overview

**users Table:**
```sql
- id (uuid, PK)
- name (varchar)
- email (varchar, unique)
- password (varchar, hashed)
- role (varchar: admin, auditor, viewer)
- organization (varchar)
- created_at (timestamp)
```

**suppliers Table:**
```sql
- id (uuid, PK)
- name (varchar)
- contact_email (varchar)
- contact_phone (varchar)
- country (varchar, default: 'India')
- verified (boolean, default: false)
- trust_score (numeric 5,2, default: 50)
- risk_level (varchar: low, medium, high)
- created_at (timestamp)
```

**components Table:**
```sql
- id (uuid, PK)
- product_id (uuid, FK)
- name (varchar)
- part_number (varchar)
- origin_country (varchar, default: 'India')
- is_indigenous (boolean, default: false)
- supplier_id (uuid, FK)
- cost_percentage (numeric)
```

**Other Key Tables:**
- `products` - Product definitions and specifications
- `manufacturers` - Manufacturer information
- `qr_records` - QR code tracking system
- `risk_reports` - AI risk assessments
- `security_events` - Incident logging
- `supply_chain_nodes` - Network topology
- `verification_logs` - Audit trail
- `ai_predictions` - ML model outputs

### 🔌 Connection String

```
PostgreSQL Connection String:
postgresql://bharatai:bharatai@localhost:5432/bharatai
```

**Used in:**
- Backend: `.env` file → `DATABASE_URL`
- Frontend: `drizzle.config.json` → database URL

### ✅ Database Verification

**Check Connection:**
```bash
psql -h localhost -U bharatai -d bharatai
```

**List Tables:**
```bash
\dt
```

**Check Table Structure:**
```bash
\d table_name
```

---

## 5. Backend Setup & API

### 🚀 Backend Installation & Setup

**Step 1: Navigate to Backend Directory**
```bash
cd /media/deshmukh-kiran/Kiran/Hackthon/new/backend
```

**Step 2: Create Virtual Environment (if not already done)**
```bash
python3.8 -m venv .venv
source .venv/bin/activate
```

**Step 3: Install Dependencies**
```bash
pip install -r requirements.txt
```

**Step 4: Create Environment File**
```bash
# Create .env file with:
DATABASE_URL=postgresql://bharatai:bharatai@localhost:5432/bharatai
SECRET_KEY=your-secret-key-here
JWT_SECRET_KEY=your-jwt-secret-here
FLASK_ENV=development
CORS_ORIGINS=http://localhost:3000,http://localhost:5173
UPLOAD_FOLDER=./uploads
ML_MODELS_PATH=./ml/models
```

### 📁 Backend Project Structure

```
backend/
├── app/
│   ├── __init__.py           # Flask app factory
│   ├── models/
│   │   └── __init__.py       # SQLAlchemy models
│   └── routes/
│       ├── auth.py           # Authentication endpoints
│       ├── suppliers.py       # Supplier management
│       ├── components.py      # Component operations
│       ├── documents.py       # Document handling
│       ├── risk_analysis.py   # Risk assessment
│       ├── verification.py    # Verification workflows
│       ├── dashboard.py       # Dashboard data
│       └── audit.py           # Audit logging
├── services/
│   └── risk_engine.py         # ML/Risk calculation
├── run.py                      # Flask server entry point
├── requirements.txt            # Python dependencies
├── .env                        # Environment variables
└── .venv/                      # Virtual environment
```

### 🔐 Flask App Configuration

**File:** `backend/app/__init__.py`

Key configurations:
```python
# SQLAlchemy Setup
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get(
    'DATABASE_URL',
    'postgresql://bharatai:bharatai@localhost:5432/bharatai'
)

# JWT Configuration
app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY')
jwt = JWTManager(app)

# CORS Setup
CORS(app, resources={
    r"/api/*": {
        "origins": ["http://localhost:3000", "http://localhost:5173"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})

# Blueprint Registration
app.register_blueprint(auth_bp)
app.register_blueprint(suppliers_bp)
app.register_blueprint(components_bp)
# ... other blueprints
```

### 🔌 Key API Endpoints

**Authentication:**
```
POST   /api/auth/register      - Create new user
POST   /api/auth/login         - User login (returns JWT)
POST   /api/auth/refresh       - Refresh token
POST   /api/auth/logout        - User logout
```

**Suppliers:**
```
GET    /api/suppliers/         - List all suppliers
POST   /api/suppliers/         - Create supplier
GET    /api/suppliers/<id>     - Get supplier details
PUT    /api/suppliers/<id>     - Update supplier
DELETE /api/suppliers/<id>     - Delete supplier
```

**Components:**
```
GET    /api/components/        - List components
POST   /api/components/        - Add component
GET    /api/components/<id>    - Get component
PUT    /api/components/<id>    - Update component
```

**Risk Analysis:**
```
POST   /api/risk-analysis/assess  - Run risk assessment
GET    /api/risk-analysis/<id>    - Get risk report
```

**Verification:**
```
POST   /api/verification/start    - Start verification
GET    /api/verification/status   - Check status
```

**Dashboard:**
```
GET    /api/dashboard/metrics     - Key metrics
GET    /api/dashboard/charts      - Chart data
```

**Health Check:**
```
GET    /api/health/               - Server health status
```

---

## 6. Frontend Setup & Configuration

### 🎨 Frontend Installation & Setup

**Step 1: Navigate to Project Root**
```bash
cd /media/deshmukh-kiran/Kiran/Hackthon/new
```

**Step 2: Install Dependencies**
```bash
npm install
```

**Step 3: Create Environment File**
```bash
# Create .env.local with:
NEXT_PUBLIC_API_URL=http://localhost:5000
DATABASE_URL=postgresql://bharatai:bharatai@localhost:5432/bharatai
```

### 📁 Frontend Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Home page
│   ├── globals.css             # Global styles
│   ├── api/
│   │   └── health/
│   │       └── route.ts        # Health check
│   ├── login/
│   │   └── page.tsx            # Login page
│   ├── register/
│   │   └── page.tsx            # Registration page
│   ├── dashboard/
│   │   └── page.tsx            # Main dashboard
│   ├── suppliers/
│   │   └── page.tsx            # Supplier management
│   ├── components/
│   │   └── page.tsx            # Component tracking
│   ├── documents/
│   │   └── page.tsx            # Document management
│   ├── risk-analysis/
│   │   └── page.tsx            # Risk analysis page
│   ├── verification/
│   │   └── page.tsx            # Verification page
│   ├── analytics/
│   │   └── page.tsx            # Analytics page
│   └── profile/
│       └── page.tsx            # User profile
├── components/
│   └── layout/
│       └── DashboardLayout.tsx  # Layout wrapper
├── db/
│   ├── index.ts                # Database connection
│   └── schema.ts               # Drizzle schema definitions
├── lib/
│   ├── utils.ts                # Utility functions
│   └── demo-data.ts            # Demo/seed data
└── types/                      # TypeScript types
```

### ⚙️ Frontend Configuration Files

**drizzle.config.json:**
```json
{
  "schema": "./src/db/schema.ts",
  "out": "./drizzle",
  "driver": "pg",
  "dbCredentials": {
    "connectionString": "postgresql://bharatai:bharatai@localhost:5432/bharatai"
  }
}
```

**next.config.ts:**
```typescript
export default {
  // Next.js configuration
  turbopack: {
    // Turbopack bundler config
  }
}
```

**tsconfig.json:**
- TypeScript 5.9.3 configuration
- Strict mode enabled
- Path aliases configured

### 🎯 Frontend Key Pages

| Page | Path | Purpose |
|------|------|---------|
| Home | `/` | Landing/home page |
| Login | `/login` | User authentication |
| Register | `/register` | New user signup |
| Dashboard | `/dashboard` | Main dashboard with metrics |
| Suppliers | `/suppliers` | Supplier management |
| Components | `/components` | Component tracking |
| Documents | `/documents` | Document management |
| Risk Analysis | `/risk-analysis` | Risk assessment UI |
| Verification | `/verification` | Verification workflows |
| Analytics | `/analytics` | Advanced analytics |
| Profile | `/profile` | User profile/settings |

---

## 7. Running the Project

### 🟢 Start Backend Server

```bash
cd /media/deshmukh-kiran/Kiran/Hackthon/new/backend

# Activate virtual environment
source .venv/bin/activate

# Run Flask development server
python run.py
```

**Expected Output:**
```
 * Serving Flask app 'app'
 * Debug mode: on
 * Running on http://0.0.0.0:5000
 * Running on http://127.0.0.1:5000
Press CTRL+C to quit
```

**Backend URL:** `http://localhost:5000`

### 🔵 Start Frontend Server

```bash
cd /media/deshmukh-kiran/Kiran/Hackthon/new

# Install dependencies (if needed)
npm install

# Run development server
npm run dev
```

**Expected Output:**
```
▲ Next.js 16.2.6 (Turbopack)
- Local:         http://localhost:3000
- Network:       http://192.168.1.17:3000
✓ Ready in 5.3s
```

**Frontend URL:** `http://localhost:3000`

### 📋 Verify Both Services Running

**Check Backend Health:**
```bash
curl http://localhost:5000/api/health
```

**Expected Response:**
```json
{
  "status": "healthy",
  "database": "connected",
  "timestamp": "2026-08-16T10:30:00Z"
}
```

**Check Frontend:**
Open `http://localhost:3000` in your browser - should load the home page

### 🛑 Stop Services

**Backend:** Press `CTRL+C` in backend terminal  
**Frontend:** Press `CTRL+C` in frontend terminal

---

## 8. Development Workflow

### 📝 Making Code Changes

**Backend API Changes:**
1. Edit Python files in `backend/app/`
2. Flask auto-reloads on file changes (debug mode)
3. Test with curl or Postman at `http://localhost:5000`

**Frontend Changes:**
1. Edit React files in `src/app/` or `src/components/`
2. Next.js auto-refreshes (HMR - Hot Module Replacement)
3. Changes visible in browser at `http://localhost:3000`

**Database Schema Changes:**
1. Modify backend SQLAlchemy models in `backend/app/models/__init__.py`
2. Create migration: `flask db migrate -m "description"`
3. Apply migration: `flask db upgrade`
4. Update frontend Drizzle schema in `src/db/schema.ts`

### 🧪 Testing API Endpoints

**Using curl:**
```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password"}'

# Get suppliers (with JWT token)
curl -X GET http://localhost:5000/api/suppliers/ \
  -H "Authorization: Bearer <jwt_token>"
```

**Using Postman:**
1. Import API collection (if available)
2. Set base URL to `http://localhost:5000`
3. Use JWT token in Authorization header

### 📊 Database Queries

**Connect to database:**
```bash
psql -h localhost -U bharatai -d bharatai
```

**Common queries:**
```sql
-- List all users
SELECT * FROM users;

-- Check supplier count
SELECT COUNT(*) FROM suppliers;

-- View risk assessments
SELECT * FROM risk_reports ORDER BY created_at DESC LIMIT 10;

-- Check verification status
SELECT * FROM verification_logs ORDER BY created_at DESC;
```

### 🐛 Debugging

**Backend Debugging:**
- Flask logs appear in terminal where you ran `python run.py`
- Check `.env` file for configuration
- Use Python debugger: Add `import pdb; pdb.set_trace()` in code

**Frontend Debugging:**
- Browser DevTools (F12) for React component inspection
- Check Console tab for JavaScript errors
- Use React DevTools browser extension

**Database Debugging:**
- Check pgAdmin or `psql` to inspect data
- Verify connection string in `.env` files
- Check PostgreSQL logs: `/var/log/postgresql/`

---

## 9. Deployment Guide

### 🚀 Pre-Deployment Checklist

- [ ] All tests passing
- [ ] No console errors or warnings
- [ ] Environment variables configured
- [ ] Database backups created
- [ ] SSL certificates obtained (for HTTPS)
- [ ] API documentation updated
- [ ] Security audit completed

### 📦 Production Build

**Frontend Build:**
```bash
cd /media/deshmukh-kiran/Kiran/Hackthon/new

# Create optimized build
npm run build

# Test production build locally
npm start
```

**Backend Deployment:**
```bash
cd /media/deshmukh-kiran/Kiran/Hackthon/new/backend

# Use Gunicorn for production
gunicorn -w 4 -b 0.0.0.0:5000 run:app
```

### ☁️ Deployment Options

**Option 1: Vercel (Recommended for Frontend)**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

**Option 2: Heroku (Backend)**
```bash
# Install Heroku CLI
heroku login

# Create app
heroku create bharatai-api

# Deploy
git push heroku main
```

**Option 3: AWS/Azure (Full Stack)**
- Use EC2/App Service for backend
- Use S3/Azure Storage for files
- Use RDS for PostgreSQL
- Use CloudFront/CDN for frontend

### 🔐 Security Configuration for Production

**Environment Variables (Production):**
```bash
DATABASE_URL=postgresql://user:pass@prod-db-host:5432/bharatai
SECRET_KEY=<strong-random-key>
JWT_SECRET_KEY=<strong-random-jwt-key>
FLASK_ENV=production
DEBUG=False
CORS_ORIGINS=https://yourdomain.com
```

**Enable HTTPS:**
- Obtain SSL certificate (Let's Encrypt)
- Configure reverse proxy (Nginx)
- Set secure cookie flags

**Database Security:**
- Enable PostgreSQL SSL
- Use strong passwords
- Restrict network access
- Regular backups

### 📈 Performance Optimization

**Frontend:**
```bash
npm run lint        # Code quality check
npm run typecheck   # TypeScript validation
```

**Backend:**
- Use connection pooling
- Add caching layer
- Optimize database queries
- Use CDN for static files

---

## 10. Maintenance & Troubleshooting

### 🔧 Common Issues & Solutions

#### Issue 1: "Database connection refused"
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

**Solutions:**
1. Check PostgreSQL is running: `sudo systemctl status postgresql`
2. Verify connection string in `.env`
3. Test connection: `psql -h localhost -U bharatai -d bharatai`
4. Check PostgreSQL credentials and permissions

#### Issue 2: "JWT token expired"
```
Error: Signature has expired
```

**Solutions:**
1. Clear browser cookies/localStorage
2. Log in again to get new token
3. Check JWT expiry time in backend config
4. Verify system clock is synchronized

#### Issue 3: "Port already in use"
```
Error: Address already in use :::3000
```

**Solutions:**
1. Find process: `lsof -i :3000`
2. Kill process: `kill -9 <PID>`
3. Or use different port: `PORT=3001 npm run dev`

#### Issue 4: "Schema mismatch errors"
```
Error: column "user_id" does not exist
```

**Solutions:**
1. Check database table schema: `\d table_name` in psql
2. Update SQLAlchemy models to match database
3. Update Drizzle schema to match database
4. Run database migrations if needed

#### Issue 5: "CORS errors in browser"
```
Access to XMLHttpRequest blocked by CORS policy
```

**Solutions:**
1. Check CORS_ORIGINS in backend `.env`
2. Ensure frontend URL is in whitelist
3. Verify requests include proper headers
4. Check Flask-CORS configuration

### 📊 Database Maintenance

**Regular Backups:**
```bash
# Backup database
pg_dump -h localhost -U bharatai bharatai > backup.sql

# Restore from backup
psql -h localhost -U bharatai bharatai < backup.sql
```

**Check Database Health:**
```sql
-- Connection count
SELECT count(*) FROM pg_stat_activity;

-- Database size
SELECT pg_size_pretty(pg_database_size('bharatai'));

-- Table sizes
SELECT schemaname, tablename, pg_size_pretty(pg_total_relation_size('"'||schemaname||'"."'||tablename||'"')) 
FROM pg_tables 
WHERE schemaname != 'pg_catalog' 
ORDER BY pg_total_relation_size('"'||schemaname||'"."'||tablename||'"') DESC;
```

**Optimize Database:**
```sql
-- Vacuum and analyze
VACUUM ANALYZE;

-- Reindex
REINDEX DATABASE bharatai;
```

### 📝 Logging & Monitoring

**View Backend Logs:**
```bash
# Real-time logs (if running in foreground)
# Logs appear in terminal

# Save logs to file
python run.py > backend.log 2>&1
```

**View Frontend Logs:**
- Browser Console (F12)
- Network tab for API calls
- Application tab for storage

**Monitor Performance:**
```bash
# CPU/Memory usage
top

# Disk usage
df -h

# Network connections
netstat -an
```

### 🔄 Restarting Services

**Full Stack Restart:**
```bash
# Kill all Node and Python processes
pkill -f "python run.py"
pkill -f "node"
pkill -f "npm"

# Restart backend
cd /media/deshmukh-kiran/Kiran/Hackthon/new/backend
source .venv/bin/activate
python run.py &

# Restart frontend
cd /media/deshmukh-kiran/Kiran/Hackthon/new
npm run dev &
```

### 🎯 Version Management

**Update Dependencies:**
```bash
# Frontend
npm update
npm audit fix

# Backend
pip install --upgrade -r requirements.txt
```

**Check Versions:**
```bash
# Frontend
npm list next
npm list react

# Backend
pip list | grep -E "Flask|SQLAlchemy|psycopg2"
```

### 📋 Maintenance Checklist

**Weekly:**
- [ ] Check error logs
- [ ] Verify both services running
- [ ] Test critical API endpoints
- [ ] Monitor database size

**Monthly:**
- [ ] Backup database
- [ ] Update dependencies
- [ ] Review security logs
- [ ] Performance analysis

**Quarterly:**
- [ ] Full security audit
- [ ] Database optimization
- [ ] Update documentation
- [ ] Review and update architecture

---

## 📞 Quick Reference

### Common Commands

```bash
# Backend - Start
cd backend && source .venv/bin/activate && python run.py

# Frontend - Start
npm run dev

# Database - Connect
psql -h localhost -U bharatai -d bharatai

# Backend - Install dependencies
pip install -r requirements.txt

# Frontend - Install dependencies
npm install

# Backend - Run tests
pytest

# Frontend - Run linter
npm run lint
```

### Important URLs

```
Frontend:  http://localhost:3000
Backend:   http://localhost:5000
Database:  localhost:5432
API Docs:  http://localhost:5000/api/docs (if configured)
```

### Key Files to Remember

```
Configuration:
- backend/.env              (Backend environment)
- .env.local               (Frontend environment)
- drizzle.config.json      (Database ORM)
- next.config.ts           (Frontend build)

Database:
- backend/app/models/__init__.py    (SQLAlchemy models)
- src/db/schema.ts                  (Drizzle schema)

API Routes:
- backend/app/routes/              (All endpoints)
```

---

## 🎉 Conclusion

Your **BharatAI** hackathon project is now fully configured and running! 

**What you have:**
✅ Full-stack web application  
✅ PostgreSQL database with live data  
✅ Flask REST API with 8 modules  
✅ React/Next.js frontend with dashboard  
✅ JWT authentication  
✅ AI risk analysis engine  
✅ Complete audit logging  

**Next steps:**
1. Access the application at `http://localhost:3000`
2. Test all features with sample data
3. Customize pages and components as needed
4. Deploy to production when ready
5. Monitor and maintain regularly

**Good luck with your hackathon! 🚀**

---

*Last Updated: 2026-08-16*  
*Version: 1.0.0 - Complete Setup & Running*
