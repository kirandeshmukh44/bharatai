# ✅ BharatAI Production Deployment - Action Checklist

Use this checklist to track your deployment progress. Check off each item as you complete it.

---

## 📋 Pre-Deployment Preparation

- [ ] Read PRODUCTION_SETUP_SUMMARY.md
- [ ] Read DEPLOYMENT_GUIDE.md (at least the overview)
- [ ] Generate production SECRET_KEY
- [ ] Generate production JWT_SECRET_KEY
- [ ] Have Render account created
- [ ] Have Netlify account created
- [ ] Have GitHub account with repository ready

---

## 🚀 Backend Deployment (Render)

### Create Web Service
- [ ] Log in to Render.com
- [ ] Click "New +" → "Web Service"
- [ ] Connect GitHub repository `bharatai`
- [ ] Configure build settings:
  - [ ] Build Command: `pip install -r backend/requirements.txt`
  - [ ] Start Command: `cd backend && gunicorn -w 4 -b 0.0.0.0:$PORT run:app`
  - [ ] Runtime: Python 3
- [ ] Click "Create Web Service"
- [ ] Wait for first deployment (5-10 minutes)
- [ ] **Note Backend URL:** `https://_____.onrender.com`

### Configure Environment Variables
- [ ] In Render service → "Environment" tab
- [ ] Add `FLASK_ENV` = `production`
- [ ] Add `DEBUG` = `False`
- [ ] Add `PORT` = `5000`
- [ ] Add `PYTHON_VERSION` = `3.8`
- [ ] Add `SECRET_KEY` = <your-generated-key>
- [ ] Add `JWT_SECRET_KEY` = <your-generated-key>
- [ ] Add `CORS_ORIGINS` = `https://your-netlify.netlify.app` (update later)
- [ ] Click "Save" (backend will redeploy)

### Create PostgreSQL Database
- [ ] In Render Dashboard, click "New +" → "PostgreSQL"
- [ ] Configure:
  - [ ] Name: `bharatai-db`
  - [ ] Database: `bharatai`
  - [ ] User: `bharatai`
  - [ ] Region: Same as web service
  - [ ] Plan: Free
- [ ] Click "Create Database"
- [ ] Wait for database creation (1-2 minutes)
- [ ] Copy "External Database URL"

### Connect Database to Backend
- [ ] Go back to `bharatai-api` service
- [ ] Go to "Environment" tab
- [ ] Add `DATABASE_URL` = <paste-external-url>
- [ ] Click "Save" (backend will redeploy)
- [ ] Wait for redeployment

### Test Backend
- [ ] Test health endpoint:
  ```bash
  curl https://your-render-api.onrender.com/api/health
  ```
- [ ] Should return: `{"status": "healthy", "database": "connected"}`
- [ ] If working, move to frontend deployment

---

## 🎨 Frontend Deployment (Netlify)

### Connect GitHub Repository
- [ ] Log in to Netlify.com
- [ ] Click "Add new site" → "Import an existing project"
- [ ] Select GitHub (authorize if needed)
- [ ] Find and select `bharatai` repository
- [ ] Click "Import"

### Configure Build Settings
- [ ] Base directory: (leave empty)
- [ ] Build command: `npm run build`
- [ ] Publish directory: `.next`
- [ ] Click "Save"

### Add Environment Variables
- [ ] In Netlify → Site settings → "Build & deploy" → "Environment"
- [ ] Add `NEXT_PUBLIC_API_URL` = `https://your-render-api.onrender.com`
- [ ] Add `NEXT_PUBLIC_ENABLE_DEMO` = `false`
- [ ] Add `NODE_ENV` = `production`
- [ ] Add `NEXT_TELEMETRY_DISABLED` = `1`
- [ ] Save variables
- [ ] Manual redeploy if needed

### Initial Deployment
- [ ] Netlify will automatically build and deploy
- [ ] Wait for build completion (5-10 minutes)
- [ ] Check build logs for any errors
- [ ] **Note Frontend URL:** `https://_____.netlify.app`

---

## 🔄 Post-Deployment Configuration

### Update Backend CORS
- [ ] Copy your Netlify frontend URL
- [ ] Go to Render → `bharatai-api` → Environment
- [ ] Update `CORS_ORIGINS` = `https://your-netlify-url.netlify.app`
- [ ] Save (backend will redeploy)

### Update Frontend API URL (if different)
- [ ] Verify `NEXT_PUBLIC_API_URL` matches your Render URL
- [ ] Redeploy frontend if needed

---

## 🧪 Testing & Verification

### Test Backend Health
- [ ] `curl https://your-render-api.onrender.com/api/health`
- [ ] Response should show `"database": "connected"`

### Test User Registration
- [ ] `curl -X POST https://your-render-api.onrender.com/api/auth/register \`
  `-H "Content-Type: application/json" \`
  `-d '{"name":"Test","email":"test@test.com","password":"password123","organization":"Test"}'`
- [ ] Should return user object with token

### Test User Login
- [ ] `curl -X POST https://your-render-api.onrender.com/api/auth/login \`
  `-H "Content-Type: application/json" \`
  `-d '{"email":"test@test.com","password":"password123"}'`
- [ ] Should return token
- [ ] Copy token for next test

### Test Frontend Registration
- [ ] Open `https://your-netlify-url.netlify.app` in browser
- [ ] Go to Register page
- [ ] Create test account
- [ ] Check no CORS errors in browser console (F12)

### Test Frontend Login
- [ ] Go to Login page
- [ ] Login with test credentials
- [ ] Should redirect to dashboard
- [ ] Dashboard should load without errors
- [ ] Check browser network tab - API calls should return 200

### Test API Integration
- [ ] From frontend, try to fetch suppliers
- [ ] Should get response (even if empty)
- [ ] No CORS or network errors

---

## 📊 Monitoring & Maintenance

### Setup Monitoring
- [ ] Bookmark Render service dashboard
- [ ] Bookmark Netlify site dashboard
- [ ] Enable Render deployment notifications (optional)
- [ ] Enable Netlify build notifications (optional)

### Check Logs
- [ ] Render → `bharatai-api` → "Logs" tab
- [ ] Check for any warnings or errors
- [ ] Netlify → "Deploys" tab → Latest deploy
- [ ] Check build log for warnings

### Database Verification
- [ ] Render → PostgreSQL service
- [ ] Verify "Available" status
- [ ] Check available connections
- [ ] Note backup settings (should be daily)

---

## 📝 Documentation Review

- [ ] Familiarize with DEPLOYMENT_GUIDE.md
- [ ] Bookmark DEPLOYMENT_CHEATSHEET.md
- [ ] Save PERSONAL_GUIDE.md for reference
- [ ] Share README_PRODUCTION.md with team (if applicable)

---

## 🔐 Security Verification

- [ ] ✅ Database URL not in GitHub (in .env files)
- [ ] ✅ SECRET_KEY and JWT_SECRET_KEY generated
- [ ] ✅ CORS configured for only your domain
- [ ] ✅ DEBUG mode is False in production
- [ ] ✅ HTTPS enabled (automatic on Render & Netlify)
- [ ] ✅ Database backups configured (Render does automatic daily)

---

## 🎯 Final Checks

- [ ] Backend URL saved: `https://_____.onrender.com`
- [ ] Frontend URL saved: `https://_____.netlify.app`
- [ ] Both services are "running" status
- [ ] Database shows "available" status
- [ ] Health check passes
- [ ] User registration works
- [ ] User login works
- [ ] Frontend communicates with backend
- [ ] No console errors or CORS issues
- [ ] Can navigate to dashboard
- [ ] Documentation reviewed and understood

---

## 📞 If Something Goes Wrong

- [ ] Check Render service logs for backend errors
- [ ] Check Netlify build logs for frontend errors
- [ ] Verify environment variables are set correctly
- [ ] Test backend health endpoint
- [ ] Verify CORS_ORIGINS configuration
- [ ] Check DATABASE_URL is correct
- [ ] Restart/redeploy service if needed
- [ ] Review DEPLOYMENT_GUIDE.md troubleshooting section

---

## 🎉 Deployment Complete!

Once all checkboxes are ✅:

✅ **You have successfully deployed BharatAI to production!**

**Your application is now live at:**
- 🌐 Frontend: https://your-site.netlify.app
- ⚙️ Backend: https://your-render-api.onrender.com
- 🗄️ Database: Render PostgreSQL (automatic backups)

---

## 📚 Important URLs to Save

| Resource | URL |
|----------|-----|
| Frontend | https://_____.netlify.app |
| Backend API | https://_____.onrender.com |
| API Health | https://_____.onrender.com/api/health |
| Render Dashboard | https://dashboard.render.com |
| Netlify Dashboard | https://app.netlify.com |
| GitHub Repository | https://github.com/USERNAME/bharatai |

---

## 🚀 Next Steps After Deployment

1. Share application URL with team/users
2. Set up monitoring alerts (optional)
3. Configure custom domain (optional)
4. Set up CI/CD webhooks (optional)
5. Plan regular maintenance schedule
6. Document any customizations made

---

## 📝 Notes & Customizations

Use this space to note any customizations or deviations from standard setup:

```
__________________________________________
__________________________________________
__________________________________________
__________________________________________
```

---

**Deployment Date:** _______________  
**Deployed By:** _______________  
**Notes:** _______________________________________________

---

**Congratulations! 🎉 Your BharatAI application is now in production!**

For ongoing support, refer to the documentation files or Render/Netlify official docs.
