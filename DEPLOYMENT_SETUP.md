# Sheltra Deployment Setup Guide

## Overview

This guide walks through configuring Sheltra for production deployment on **Render** (backend) and **Vercel** (frontend).

---

## PART 1: Render Backend Deployment

### Prerequisites
- Active Render account at https://render.com
- GitHub repository connected (md-sazid9089/sheltra_client_side)
- MySQL database (self-hosted or Aiven)
- Redis instance (optional for production features)

### Step 1: Fix Render Configuration (DONE ✅)
The `render.yaml` file has been updated with:
- ✅ Correct GitHub repository URL
- ✅ Proper Docker build configuration
- ✅ Fixed startup commands
- ✅ Simplified cache/queue settings (file-based instead of Redis)

### Step 2: Create MySQL Database

**Option A: Use Aiven (Recommended for Production)**
1. Go to https://aiven.io
2. Create MySQL 8.0 instance
3. Note the connection details:
   - Host
   - Port (usually 3306)
   - Database name
   - Username
   - Password

**Option B: Use Render PostgreSQL Add-on**  
1. In Render dashboard, create a PostgreSQL database
2. Connection string provided automatically

### Step 3: Configure Environment Variables in Render Dashboard

When creating the web service in Render:

1. Click **Environment** tab
2. Add these SECRET variables (marked with 🔒):

```
🔒 APP_KEY=base64:YOUR_GENERATED_KEY_HERE
🔒 DB_HOST=your-db-host.ai-prod.aiven-db-com
🔒 DB_PORT=3306
🔒 DB_DATABASE=defaultdb
🔒 DB_USERNAME=avnadmin
🔒 DB_PASSWORD=your-db-password
🔒 STRIPE_PUBLIC_KEY=pk_live_xxxxxxxxxxxx
🔒 STRIPE_SECRET_KEY=sk_live_xxxxxxxxxxxx
🔒 GEMINI_API_KEY=your-google-api-key
🔒 REDIS_HOST=your-redis-host (optional)
🔒 REDIS_PASSWORD=your-redis-password (optional)
🔒 MAIL_HOST=smtp.mailtrap.io
🔒 MAIL_PORT=2525
🔒 MAIL_USERNAME=your-mailtrap-user
🔒 MAIL_PASSWORD=your-mailtrap-password
🔒 MAIL_FROM_ADDRESS=noreply@sheltra.app
```

3. These environment variables are already public (no 🔒 needed):
```
APP_NAME=Sheltra
APP_ENV=production
APP_DEBUG=false
LOG_LEVEL=error
LOG_CHANNEL=stderr
APP_URL=https://api.sheltra.app
FRONTEND_URL=https://sheltra.app
DB_CONNECTION=mysql
CACHE_DRIVER=file
QUEUE_CONNECTION=sync
SESSION_DRIVER=cookie
```

### Step 4: Deploy to Render

**Using render.yaml (Recommended):**

```bash
# Render will automatically detect render.yaml from GitHub
# Simply push to main branch and Render will deploy automatically
git push origin main
```

**Manual Deployment:**
1. Go to https://dashboard.render.com
2. Click **New +** → **Web Service**
3. Select your GitHub repository
4. Name: `sheltra-api`
5. Environment: Docker
6. Build command: `docker build -f server/Dockerfile -t sheltra-api server/`
7. Start command: `/usr/local/bin/start.sh`
8. Plan: Starter ($7/month)
9. Click **Create Web Service**

### Step 5: Verify Deployment

```bash
# After deployment completes, test the API:
curl https://api.sheltra.app/api/health

# Should return HTTP 200
# Or check Logs in Render dashboard
```

### Step 6: Database Migrations

After first successful deployment:

```bash
# Connect to Render shell (from dashboard)
# OR use render shell from CLI

# Run migrations:
php artisan migrate --force

# Run seeders (optional):
php artisan db:seed --force
```

---

## PART 2: Vercel Frontend Deployment

### Prerequisites
- Active Vercel account at https://vercel.com
- GitHub connected to Vercel
- Vercel for GitHub app installed

### Step 1: Fix Vercel Configuration (DONE ✅)
The `vercel.json` file has been updated with:
- ✅ Proper root directory (client/)
- ✅ Correct build output (dist/)
- ✅ Framework detection (React/Vite)
- ✅ Environment variable setup

### Step 2: Create Vercel Project

**Option A: Auto-imported (Recommended)**
1. Go to https://vercel.com/import
2. Select GitHub repository: `sheltra_client_side`
3. Vercel auto-detects `vercel.json` configuration
4. Framework: React
5. Build: `npm run build`
6. Output: `dist/`
7. Click **Deploy**

**Option B: Manual Setup**
1. Go to https://dashboard.vercel.com
2. Click **Add New...** → **Project**
3. Select `sheltra_client_side` repository
4. Framework: **React**
5. Root Director: **./client**
6. Build command: **npm run build**
7. Output Directory: **dist**
8. Click **Deploy**

### Step 3: Configure Environment Variables in Vercel

1. Go to project **Settings** → **Environment Variables**
2. Add these variables (visible at build time):

```
Name: VITE_API_URL
Value: https://api.sheltra.app
Environments: Production, Preview, Development
Type: Plaintext

Name: VITE_BACKEND_ENDPOINT
Value: https://api.sheltra.app
Environments: Production, Preview, Development
Type: Plaintext

Name: VITE_STRIPE_PUBLIC_KEY
Value: pk_live_xxxxxxxxxxxx
Environments: Production
Type: Plaintext

Name: VITE_STRIPE_PUBLIC_KEY
Value: pk_test_xxxxxxxxxxxx
Environments: Preview, Development
Type: Plaintext
```

### Step 4: Configure Custom Domain (Optional)

1. Go to project **Settings** → **Domains**
2. Add your domain: `sheltra.app`
3. Configure DNS records:
   - Type: CNAME
   - Name: @
   - Value: `cname.vercel.com`
4. Add domain and verify

### Step 5: Verify Deployment

1. Deployment complete → Visit `https://sheltra.app`
2. Check browser console (F12) for environment variable errors
3. Verify API connectivity to backend

---

## Troubleshooting

### Render Deployment Errors

| Error | Cause | Solution |
|-------|-------|----------|
| `Build failed` | Missing Dockerfile | Ensure `server/Dockerfile` exists with valid syntax |
| `Failed to connect to database` | DB credentials wrong | Verify `DB_HOST`, `DB_USERNAME`, `DB_PASSWORD` in dashboard |
| `Application crashed` | APP_KEY not set | Generate with `php artisan key:generate --show` and set in Render variables |
| `502 Bad Gateway` | Container won't start | Check Render logs: `docker-entrypoint.sh` and startup errors |
| `Migrations failed` | Database unreachable | Run migrations manually via Render shell after fixing DB connection |

### Vercel Deployment Errors

| Error | Cause | Solution |
|-------|-------|----------|
| `Build failed` | Missing dependencies | Run `npm install` locally and commit package-lock.json |
| `Cannot find module` | Wrong build command | Ensure `vite.config.js` exists and build output is `dist/` |
| `Blank page` | Wrong API URL | Check `VITE_API_URL` environment variable in project settings |
| `API calls 404` | Backend not accessible | Verify `https://api.sheltra.app` in `VITE_BACKEND_ENDPOINT` |
| `Stripe errors` | Wrong public key | Use `pk_live_` for production, `pk_test_` for staging |

---

## Post-Deployment Checklist

### Backend (Render)
- [ ] API responds to `/api/health`
- [ ] Database migrations ran successfully
- [ ] Logs show no errors
- [ ] Can connect to database from Render shell
- [ ] Environment variables all validated

### Frontend (Vercel)
- [ ] Site loads without errors
- [ ] Console shows no undefined environment variables
- [ ] API calls successfully reach backend
- [ ] Stripe integration works (if applicable)
- [ ] Custom domain resolves correctly

---

## Continuous Deployment

### Automatic Updates
- **Main branch**: Automatically deploys to production
- **Dev branch**: Can deploy to staging (configure in Vercel/Render)
- **Pull requests**: Preview deployments on Vercel

### GitHub Actions

Push to any branch triggers CI/CD:
- Frontend linting and build
- Backend tests and migrations
- All checks must pass before merge to `main`

See `.github/workflows/` for workflow definitions.

---

## Security Notes

🔒 **Never commit `.env` files to Git**
🔒 **Use Render/Vercel dashboard** for all secrets
🔒 **Rotate secrets** regularly (especially STRIPE_SECRET_KEY)
🔒 **Monitor logs** for unauthorized access attempts
🔒 **Use HTTPS only** for all production deployments

---

## Support

For issues:
1. Check Render/Vercel logs in dashboard
2. Review `.github/workflows/` for CI/CD status
3. Verify all environment variables are set
4. Test locally with Docker first
5. Check this guide's Troubleshooting section

Last updated: April 12, 2026
