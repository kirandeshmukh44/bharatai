# 🚀 BharatAI Deployment Guide - Netlify (Frontend) + Render (Backend)

## Overview

This guide walks you through deploying **BharatAI** to production:
- **Frontend**: Netlify (Next.js application)
- **Backend**: Render (Flask API + PostgreSQL database)

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Backend Deployment (Render)](#backend-deployment-render)
3. [Database Setup (Render PostgreSQL)](#database-setup-render-postgresql)
4. [Frontend Deployment (Netlify)](#frontend-deployment-netlify)
5. [Post-Deployment Configuration](#post-deployment-configuration)
6. [Testing & Verification](#testing--verification)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

**Accounts Required:**
- ✅ GitHub account (to host your code)
- ✅ Render.com account (free tier available)
- ✅ Netlify account (free tier available)

**Local Setup:**
- ✅ Git installed
- ✅ Code pushed to GitHub repository

---

## Backend Deployment (Render)

### Step 1: Push Code to GitHub

```bash
cd /media/deshmukh-kiran/Kiran/Hackthon/new

git init
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

git add .
git commit -m "Production ready: Deploy to Render and Netlify"
git remote add origin https://github.com/YOUR_USERNAME/bharatai.git
git branch -M main
git push -u origin main
```

### Step 2: Create Render Account & Service

1. Go to [Render.com](https://render.com)
2. Sign up/Login with GitHub
3. Click **New +** → **Web Service**
4. Connect your GitHub repository `bharatai`
5. Fill in these settings:

**Service Configuration:**
- **Name:** `bharatai-api`
- **Environment:** `Python 3`
- **Build Command:** `pip install -r backend/requirements.txt`
- **Start Command:** `cd backend && gunicorn -w 4 -b 0.0.0.0:$PORT run:app`
- **Plan:** `Free` or `Starter Pro`

6. Click **Create Web Service**

### Step 3: Add Environment Variables to Render

In Render Dashboard → Services → `bharatai-api` → **Environment**:

```
FLASK_ENV = production
DEBUG = False
PORT = 5000
PYTHON_VERSION = 3.8
```

Generate secure keys:
```bash
python -c "import secrets; print('SECRET_KEY=' + secrets.token_hex(32))"
python -c "import secrets; print('JWT_SECRET_KEY=' + secrets.token_hex(32))"
```

Add to Render:
```
SECRET_KEY = <generated-key-from-above>
JWT_SECRET_KEY = <generated-key-from-above>
CORS_ORIGINS = https://your-netlify-domain.netlify.app
```

### Step 4: Create PostgreSQL Database on Render

1. In Render Dashboard, click **New +** → **PostgreSQL**
2. Fill in:
   - **Name:** `bharatai-db`
   - **Database:** `bharatai`
   - **User:** `bharatai`
   - **Password:** (auto-generated, copy it)
   - **Region:** Same as web service
   - **Plan:** `Free`

3. Click **Create Database**

### Step 5: Connect Database to Backend Service

1. After PostgreSQL is created, copy the **External Database URL**
2. Go to `bharatai-api` service → **Environment**
3. Add:
```
DATABASE_URL = <paste-external-url-here>
```

4. Click **Save** to redeploy

### Step 6: Verify Backend Deployment

```bash
# Test health endpoint
curl https://your-render-service.onrender.com/api/health

# Should return:
# {"status": "healthy", "database": "connected"}
```

**Save your backend URL:** `https://your-render-service.onrender.com`

---

## Database Setup (Render PostgreSQL)

### Initialize Database Schema

After PostgreSQL is running on Render:

```bash
# Connect from your local machine using the External Database URL
PGPASSWORD=<your-password> psql -h <host> -U bharatai -d bharatai -c "
  CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user',
    organization VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS suppliers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    contact_email VARCHAR(255),
    contact_phone VARCHAR(50),
    country VARCHAR(100) DEFAULT 'India',
    verified BOOLEAN DEFAULT FALSE,
    trust_score NUMERIC(5,2) DEFAULT 50,
    risk_level VARCHAR(50) DEFAULT 'medium',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS components (
    id SERIAL PRIMARY KEY,
    product_id VARCHAR(36),
    name VARCHAR(255) NOT NULL,
    part_number VARCHAR(100),
    origin_country VARCHAR(100) DEFAULT 'India',
    is_indigenous BOOLEAN DEFAULT FALSE,
    supplier_id SERIAL,
    cost_percentage NUMERIC(5,2)
  );

  CREATE INDEX idx_users_email ON users(email);
  CREATE INDEX idx_suppliers_country ON suppliers(country);
  CREATE INDEX idx_components_supplier ON components(supplier_id);
"
```

---

## Frontend Deployment (Netlify)

### Step 1: Update Frontend Configuration

Update `.env.production` in your project root:

```bash
NEXT_PUBLIC_API_URL=https://your-render-api.onrender.com
NEXT_PUBLIC_API_BASE_PATH=/api
NEXT_PUBLIC_ENABLE_DEMO=false
```

### Step 2: Connect Netlify to GitHub

1. Go to [Netlify.com](https://netlify.com)
2. Sign up/Login with GitHub
3. Click **Add new site** → **Import an existing project**
4. Select GitHub → authorize → select `bharatai` repository
5. Click **Import**

### Step 3: Configure Build Settings

**Build Configuration:**
- **Base directory:** (leave empty)
- **Build command:** `npm run build`
- **Publish directory:** `.next`

### Step 4: Set Environment Variables

In Netlify Dashboard → Site settings → **Build & deploy** → **Environment**:

```
NEXT_PUBLIC_API_URL = https://your-render-api.onrender.com
NEXT_PUBLIC_ENABLE_DEMO = false
NODE_ENV = production
NEXT_TELEMETRY_DISABLED = 1
```

### Step 5: Deploy

Click **Deploy** - Netlify will automatically build and deploy

**Save your frontend URL:** `https://your-site-name.netlify.app`

---

## Post-Deployment Configuration

### Step 1: Update CORS on Backend

After you have your Netlify URL, update backend:

1. Go to Render Dashboard → `bharatai-api` → **Environment**
2. Update `CORS_ORIGINS`:
```
CORS_ORIGINS = https://your-site-name.netlify.app
```
3. Save (this will redeploy automatically)

### Step 2: Test API Connectivity

```bash
# From your frontend, test API call
curl -X POST https://your-render-api.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "organization": "Test Org"
  }'
```

### Step 3: Test Login

```bash
# Get JWT token
curl -X POST https://your-render-api.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

---

## Testing & Verification

### Frontend Tests

1. Visit `https://your-site-name.netlify.app`
2. Try **Register** with a new account
3. Try **Login** with the credentials
4. Verify dashboard loads
5. Check browser console for no CORS errors

### Backend Tests

```bash
# Health check
curl https://your-render-api.onrender.com/api/health

# Database test
curl -X GET https://your-render-api.onrender.com/api/suppliers \
  -H "Authorization: Bearer <your-jwt-token>"
```

### Database Tests

```bash
# Connect and verify data
PGPASSWORD=<password> psql -h <host> -U bharatai -d bharatai
\dt  # List tables
SELECT COUNT(*) FROM users;  # Check users
```

---

## Troubleshooting

### Issue 1: "Build failed on Netlify"

**Solution:**
```bash
# Ensure .next directory is in .gitignore
echo ".next" >> .gitignore
git add .gitignore
git commit -m "Fix: Add .next to gitignore"
git push origin main
```

### Issue 2: "CORS errors in browser console"

**Solution:**
1. Check `CORS_ORIGINS` environment variable in Render
2. Ensure it matches your Netlify URL exactly
3. Include `https://` prefix
4. Redeploy backend after updating

### Issue 3: "Database connection refused"

**Solution:**
1. Check `DATABASE_URL` in Render environment
2. Verify PostgreSQL service is running
3. Test connection from Render shell:
```bash
psql $DATABASE_URL -c "SELECT 1;"
```

### Issue 4: "Page not found" on frontend routes

**Solution:**
1. Netlify redirects are in `netlify.toml`
2. Verify file exists in project root
3. Redeploy site

### Issue 5: "JWT token invalid"

**Solution:**
1. Regenerate `JWT_SECRET_KEY` in Render
2. Users need to login again
3. Redeploy backend

---

## Monitoring & Maintenance

### View Logs

**Render Backend Logs:**
```
Render Dashboard → Services → bharatai-api → Logs
```

**Netlify Frontend Logs:**
```
Netlify Dashboard → yoursite.netlify.app → Deploys
```

### Database Backups (Render)

Render PostgreSQL has automatic daily backups:
```
Render Dashboard → Databases → bharatai-db → Backups
```

### Performance Monitoring

**Frontend:**
- Use Netlify Analytics
- Monitor Core Web Vitals

**Backend:**
- Monitor response times
- Check error rates in Render logs

---

## Production Checklist

- [ ] All environment variables set
- [ ] Database initialized with schema
- [ ] CORS configured correctly
- [ ] Tested registration flow
- [ ] Tested login flow
- [ ] Verified API responses
- [ ] Confirmed HTTPS working
- [ ] Setup monitoring/logging
- [ ] Database backups enabled
- [ ] Security headers configured
- [ ] Rate limiting enabled
- [ ] Error logging configured

---

## URLs to Remember

```
Frontend:   https://your-site-name.netlify.app
Backend:    https://your-render-api.onrender.com
Database:   Managed by Render PostgreSQL service
API Docs:   https://your-render-api.onrender.com/api (if configured)
Health:     https://your-render-api.onrender.com/api/health
```

---

## Additional Resources

- [Render Documentation](https://render.com/docs)
- [Netlify Documentation](https://docs.netlify.com)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Flask Deployment](https://flask.palletsprojects.com/en/2.3.x/deploying/)

---

## Support

For deployment issues:
1. Check service logs first
2. Verify environment variables
3. Ensure database is running
4. Test with curl commands
5. Check GitHub repository for recent commits

**Good luck with your production deployment! 🚀**

*Last Updated: 2026-08-16*
