# ⚡ BharatAI - Quick Deployment Cheat Sheet

## Pre-Deployment Checklist

- [ ] Update `.env.production` with SECRET_KEY and JWT_SECRET_KEY
- [ ] Code pushed to GitHub repository
- [ ] Database schema initialized
- [ ] All tests passing locally
- [ ] No console errors or warnings
- [ ] Netlify and Render accounts created

---

## 🚀 Backend Deployment (Render)

### 1. Create Web Service
```
Render Dashboard → New → Web Service
- Name: bharatai-api
- Runtime: Python 3
- Build Command: pip install -r backend/requirements.txt
- Start Command: cd backend && gunicorn -w 4 -b 0.0.0.0:$PORT run:app
```

### 2. Add Environment Variables
```
FLASK_ENV = production
DEBUG = False
PORT = 5000
PYTHON_VERSION = 3.8
SECRET_KEY = <generated-secret>
JWT_SECRET_KEY = <generated-secret>
CORS_ORIGINS = https://your-netlify.netlify.app
DATABASE_URL = <from PostgreSQL service>
```

### 3. Create PostgreSQL Database
```
Render Dashboard → New → PostgreSQL
- Name: bharatai-db
- User: bharatai
- Region: Same as web service
- Plan: Free
```

### 4. Connect Database
```
Copy External Database URL from PostgreSQL service
Add to Web Service Environment: DATABASE_URL = <url>
```

### 5. Test Backend
```bash
curl https://your-render-api.onrender.com/api/health
# Should return: {"status": "healthy", "database": "connected"}
```

**Save:** Backend URL for frontend configuration

---

## 🎨 Frontend Deployment (Netlify)

### 1. Connect GitHub Repository
```
Netlify Dashboard → Add new site → Import existing project
- Select GitHub repository: bharatai
- Authorize Netlify
```

### 2. Configure Build Settings
```
- Base directory: (leave empty)
- Build command: npm run build
- Publish directory: .next
```

### 3. Add Environment Variables
```
NEXT_PUBLIC_API_URL = https://your-render-api.onrender.com
NEXT_PUBLIC_ENABLE_DEMO = false
NODE_ENV = production
NEXT_TELEMETRY_DISABLED = 1
```

### 4. Deploy
```
Click "Deploy" - Netlify builds and deploys automatically
Wait for build to complete and deployment URL to be generated
```

**Save:** Frontend URL (e.g., https://your-site.netlify.app)

---

## ✅ Post-Deployment Verification

### Test User Registration
```bash
curl -X POST https://your-render-api.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "organization": "Test Org"
  }'
```

### Test User Login
```bash
curl -X POST https://your-render-api.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
# Copy the token from response
```

### Test API Endpoint
```bash
curl -X GET https://your-render-api.onrender.com/api/suppliers \
  -H "Authorization: Bearer <your-token-from-above>"
```

### Test Frontend
1. Visit: https://your-site.netlify.app
2. Register with test account
3. Login
4. Check dashboard loads
5. Verify no CORS errors in browser console

---

## 🔧 Generate Secure Keys

```bash
# Generate SECRET_KEY
python -c "import secrets; print(secrets.token_hex(32))"

# Generate JWT_SECRET_KEY
python -c "import secrets; print(secrets.token_hex(32))"
```

---

## 📝 Final Configuration

### Update Backend CORS (after Netlify URL is ready)
```
Render Dashboard → Services → bharatai-api → Environment
CORS_ORIGINS = https://your-deployed-site.netlify.app
Click "Save" to redeploy
```

### Verify All Services Running
```bash
# Backend health
curl https://your-render-api.onrender.com/api/health

# Frontend
Open browser: https://your-site.netlify.app

# Database
Check Render PostgreSQL service status dashboard
```

---

## 🆘 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| Build fails on Netlify | Ensure `.next` is in `.gitignore` and push again |
| CORS errors | Check `CORS_ORIGINS` in Render environment matches Netlify URL |
| Database connection fails | Verify `DATABASE_URL` in Render environment is correct |
| Login not working | Verify database is initialized with users table |
| API returning 500 | Check Render service logs for detailed error |

---

## 📊 Monitor Deployments

**Render:**
```
Services → Select service → Logs tab
Shows real-time deployment and runtime logs
```

**Netlify:**
```
Site settings → Deploys tab
Shows build logs and deployment history
```

---

## 🎯 URLs to Track

```
Backend API:     https://your-render-api.onrender.com
Frontend:        https://your-site.netlify.app
Health Check:    https://your-render-api.onrender.com/api/health
Login:           https://your-site.netlify.app/login
Dashboard:       https://your-site.netlify.app/dashboard
API Docs:        https://your-render-api.onrender.com/docs (if configured)
```

---

## ⏱️ Typical Deployment Timeline

| Step | Time |
|------|------|
| Create Render Web Service | 2-5 min |
| Deploy to Render | 5-10 min |
| Create PostgreSQL | 1-2 min |
| Initialize Database | 2-5 min |
| Connect GitHub to Netlify | 2-3 min |
| First build on Netlify | 5-10 min |
| Configure environment vars | 1-2 min |
| Test and verify | 5-10 min |
| **Total** | **25-50 min** |

---

## 🔐 Security Reminders

✅ Change default SECRET_KEY and JWT_SECRET_KEY  
✅ Enable HTTPS (automatic on Render & Netlify)  
✅ Configure CORS_ORIGINS correctly  
✅ Don't commit .env files to GitHub  
✅ Use strong database passwords  
✅ Enable database backups on Render  
✅ Monitor logs for suspicious activity  
✅ Keep dependencies updated  

---

## 📞 Getting Help

1. **Check logs first** - Most issues visible in service logs
2. **Review DEPLOYMENT_GUIDE.md** - Comprehensive guide with troubleshooting
3. **Check GitHub repo** - Ensure code is up to date
4. **Test locally first** - Verify setup works locally before deploying

---

**Deployment Ready? Let's Go! 🚀**

For detailed instructions, see: [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
