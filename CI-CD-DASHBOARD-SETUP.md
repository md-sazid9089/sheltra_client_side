# Sheltra CI/CD - DASHBOARD CONFIGURATION GUIDE

## Quick Dashboard Setup Reference

This guide helps you configure the Vercel and Render dashboards after creating accounts.

---

## VERCEL DASHBOARD SETUP

### Login & Project Import

1. Go to https://vercel.com/dashboard
2. Click **"Add New..."** → **"Project"**
3. Click **"Import Git Repository"**
4. Find and select **"sheltra_client_side"** from GitHub
5. Click **"Import"**

### Step 1: Framework Selection

```
Framework: React ✓
```

Click **"Continue"**

### Step 2: Configure Project

| Setting | Value |
|---------|-------|
| **Project Name** | sheltra (or sheltra-frontend) |
| **Root Directory** | `client/` |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |
| **Install Command** | `npm ci` |

Click **"Continue"**

### Step 3: Environment Variables

Add these in the **Environment Variables** section:

| Variable | Production | Preview | Notes |
|----------|-----------|---------|-------|
| `VITE_API_URL` | `https://api.sheltra.app` | `https://api.sheltra.app` | Use prod API for preview |
| `VITE_BACKEND_ENDPOINT` | `https://api.sheltra.app` | `https://api.sheltra.app` | Same as VITE_API_URL |
| `VITE_STRIPE_PUBLIC_KEY` | `pk_live_xxxxx` | `pk_test_xxxxx` | Use test keys for preview |
| `VITE_APP_ENV` | `production` | `preview` | Identifies environment in code |

**To add each variable**:
1. Click **"Add"** (in Environment Variables section)
2. Enter **Key** (e.g., `VITE_API_URL`)
3. Enter **Value**
4. Select **Environments**: Production ✓ Preview ✓
5. Click **"Save"**

### Step 4: Confirm & Deploy

1. Review settings match above
2. Click **"Deploy"**
3. Wait 3-5 minutes for build
4. Confirm: Green checkmark + "Deployment Successful"
5. Visit production URL (shown in dashboard)

---

## VERCEL POST-DEPLOYMENT SETUP

### Configure Production Branch

1. Go to **Project Settings** → **Git**
2. Set **Production Branch** to `main`
3. Enable **Automatic Deployments** ✓
4. Enable **Preview Deployments** ✓ (for all PRs)
5. Save changes

### Add Custom Domain (Optional)

1. Go to **Settings** → **Domains**
2. Enter custom domain: `sheltra.app` (or subdomain)
3. Follow DNS instructions
4. Verify domain is connected (should show green ✓)
5. HTTPS is auto-enabled by Vercel

### Configure Preview Deployments

1. Go to **Settings** → **Preview Deployments**
2. Set to **Automatic** (default)
3. Comments: **Automated** ✓
4. Assign to: All teams (or specific teams)

### Monitor Deployments

1. **Deployments** tab: See history of all deployments
2. **Logs** tab: View build logs
3. **Analytics** tab: Performance metrics (AVG CLS, FID, etc.)

### Test Preview URL

1. Create a test PR with frontend changes
2. Vercel bot should comment with preview URL
3. Click URL to verify preview works
4. Close PR and verify preview is deleted

---

## RENDER DASHBOARD SETUP

### Login & Create Web Service

1. Go to https://dashboard.render.com
2. Click **"New +"** → **"Web Service"**
3. **Connect GitHub** (if not already connected)
4. Authorize Render to access your repos
5. Select **"sheltra_client_side"** repository
6. Click **"Connect"**

### Step 1: Configure Service

| Setting | Value |
|---------|-------|
| **Name** | `sheltra-api` |
| **Environment** | `Docker` |
| **Region** | Select closest to your users (e.g., `us-east-1`) |
| **Branch** | `main` |

### Step 2: Build & Run

**Render should auto-detect**:
- Root Directory: `/server` ✓ (should show)
- Dockerfile: Detected ✓

If not auto-detecting:
- Build Command: `docker build -t sheltra-api .`
- Start Command: Use Dockerfile entrypoint

### Step 3: Plan & Scaling

| Setting | Value |
|--------|-------|
| **Plan** | Starter ($7/month) |
| **Num Instances** | 1 |
| **Auto-scale** | Off (for now) |

### Step 4: Environment Variables

Click **"Advanced"** → **"Add Environment Variable"**

**Plain Variables** (visible):
```
APP_NAME=Sheltra
APP_ENV=production
APP_DEBUG=false
APP_URL=https://api.sheltra.app
FRONTEND_URL=https://sheltra.app
LOG_LEVEL=error
LOG_CHANNEL=stderr
DB_CONNECTION=mysql
QUEUE_CONNECTION=redis
CACHE_DRIVER=redis
SESSION_DRIVER=redis
```

**Secret Variables** (hidden):
```
APP_KEY=base64:xxxxxxxxxxxxx
DB_HOST=database.example.com
DB_PORT=3306
DB_DATABASE=sheltra_prod
DB_USERNAME=sheltra_user
DB_PASSWORD=xxxxxxxxx
STRIPE_PUBLIC_KEY=pk_live_xxxxx
STRIPE_SECRET_KEY=sk_live_xxxxx
GEMINI_API_KEY=xxxxxxxxxxxxx
REDIS_HOST=redis.example.com
REDIS_PASSWORD=xxxxxxxxx
MAIL_HOST=smtp.example.com
MAIL_USERNAME=xxx
MAIL_PASSWORD=xxx
MAIL_FROM_ADDRESS=noreply@sheltra.app
```

**To Add Each**:
1. Click **"Add Environment Variable"**
2. Enter **Key** (e.g., `APP_KEY`)
3. Enter **Value**
4. For secrets, click "🔒 Add Secret" instead
5. Repeat for all variables

### Step 5: Health Checks

1. Click **"Advanced"** (if not visible)
2. Scroll to **"Health Check"**
3. Set:
   - **Health Check Path**: `/api/health`
   - **Check Interval**: 30 seconds
   - **Health Check Type**: HTTP
4. Save

### Step 6: Deploy Events

1. Click **"Advanced"** → **"Deploy Events"** (optional)
2. Add Slack/email notifications if desired

### Step 7: Auto-Deploy Settings

1. Scroll to **"Build Settings"**
2. Set **Auto-deploy** to **Yes**
3. Branch: `main`
4. Save

### Step 8: Create Service

1. Click **"Create Web Service"**
2. Render starts building Docker image
3. Wait 5-10 minutes for build to complete
4. Should show: **"Live ✓"** (green indicator)

### Render Post-Deployment: Database Setup

1. Get database credentials:
   - Connection string from your DB provider
   - Extract: host, port, database, username, password

2. Add to Render environment (from Step 4):
   - `DB_HOST`, `DB_PORT`, `DB_DATABASE`
   - `DB_USERNAME`, `DB_PASSWORD` (as secrets)

3. Test connection:
   - View Render logs
   - Should see: "Database connected successfully" (or similar)

4. Run migrations:
   - Option 1: Automatic (Render pre-start commands)
   - Option 2: Manual via SSH:
     ```bash
     # In Render Shell (available on service page)
     php artisan migrate --force
     ```

### Test Render Deployment

1. Get service URL (shown in Render dashboard)
2. Test health endpoint:
   ```
   https://sheltra-api.onrender.com/api/health
   ```
   Should return: `{"status":"ok","...":"..."}`

3. Test API endpoint:
   ```
   https://sheltra-api.onrender.com/api/users
   ```
   (or another route specific to your API)

### Monitor Render Service

1. **Logs** tab: Real-time application logs
2. **Metrics** tab: CPU, Memory, Network usage
3. **Events** tab: Deployment history

### Add Custom Domain (Optional)

1. Service Settings → **Custom Domains**
2. Enter domain: `api.sheltra.app`
3. Add DNS records as instructed
4. Verify: Should show green ✓

---

## GITHUB REPOSITORY SETUP

### Enable Branch Protection

1. Go to Repository → **Settings** → **Branches**
2. Click **"Add Rule"**
3. Enter **Branch name pattern**: `main`
4. Check:
   - ✓ Require pull request reviews (1 required)
   - ✓ Require status checks to pass:
     - Select: `frontend-ci` or `CI - Frontend Only`
     - Select: `backend-ci` or `CI - Backend Only`
   - ✓ Require up-to-date branches
   - ✓ Dismiss stale reviews
   - ✓ Include administrators
   - ✓ Restrict who can push (admins only)
5. Click **"Create"**

### Add GitHub Secrets (for CI)

1. Repository → **Settings** → **Secrets and variables** → **Actions**
2. Click **"New repository secret"**
3. Add:
   - **Name**: `VITE_API_URL`
   - **Value**: `https://api.sheltra.app`
   - Click **"Add secret"**

4. Repeat for:
   - `VITE_STRIPE_PUBLIC_KEY` = Your Stripe public key
   - `APP_KEY_FOR_CI` = PHP base64 key

---

## ENVIRONMENT VARIABLES SUMMARY TABLE

| Variable | Where Used | Store In | Example Value | Required |
|----------|-----------|----------|----------------|----------|
| `VITE_API_URL` | Frontend | Vercel + GitHub | `https://api.sheltra.app` | ✅ Yes |
| `VITE_BACKEND_ENDPOINT` | Frontend | Vercel | `https://api.sheltra.app` | ✅ Yes |
| `VITE_STRIPE_PUBLIC_KEY` | Frontend | Vercel | `pk_live_xxxxx` | ✅ Yes |
| `VITE_APP_ENV` | Frontend | Vercel | `production` (or `preview`) | ✅ Yes |
| `APP_KEY` | Backend | Render Secrets | `base64:xxxxx...` | ✅ Yes |
| `APP_ENV` | Backend | Render | `production` | ✅ Yes |
| `APP_DEBUG` | Backend | Render | `false` | ✅ Yes |
| `APP_URL` | Backend | Render | `https://api.sheltra.app` | ✅ Yes |
| `DB_HOST` | Backend | Render Secrets | `database.example.com` | ✅ Yes |
| `DB_DATABASE` | Backend | Render | `sheltra_prod` | ✅ Yes |
| `DB_USERNAME` | Backend | Render Secrets | Database user | ✅ Yes |
| `DB_PASSWORD` | Backend | Render Secrets | Database password | ✅ Yes |
| `STRIPE_SECRET_KEY` | Backend | Render Secrets | `sk_live_xxxxx` | ✅ Yes |
| `GEMINI_API_KEY` | Backend | Render Secrets | API key | ✅ Yes |
| `REDIS_HOST` | Backend | Render Secrets | `redis.example.com` | ✅ Yes (if using Redis) |
| `REDIS_PASSWORD` | Backend | Render Secrets | Redis password | ✅ Yes (if using Redis) |
| `MAIL_HOST` | Backend | Render | `smtp.example.com` | ⚠️ No (optional) |
| `MAIL_USERNAME` | Backend | Render Secrets | SMTP user | ⚠️ No (optional) |
| `MAIL_PASSWORD` | Backend | Render Secrets | SMTP password | ⚠️ No (optional) |

---

## SECRETS MIGRATION CHECKLIST

### 1. Save Current Values
- [ ] Save all API keys somewhere safe
- [ ] Save database credentials
- [ ] Keep a secure list (password manager preferred)

### 2. Add to Vercel
- [ ] Login to Vercel
- [ ] Project Settings → Environment Variables
- [ ] Add all VITE_* variables
- [ ] Trigger redeploy on main branch

### 3. Add to Render
- [ ] Login to Render
- [ ] Service Settings → Environment
- [ ] Add all plain variables (non-secrets)
- [ ] Add all secrets (marked as "🔒 Secret")
- [ ] Trigger redeploy on main branch

### 4. Add to GitHub (for CI)
- [ ] Repository Settings → Secrets
- [ ] Add only CI-needed secrets:
  - [ ] `VITE_API_URL`
  - [ ] `VITE_STRIPE_PUBLIC_KEY`
  - [ ] `APP_KEY_FOR_CI`

### 5. Remove from Git
- [ ] Verify `.env` is in `.gitignore` ✓
- [ ] Never commit `STRIPE_SECRET_KEY` or `APP_KEY` ✓
- [ ] Clean history: `git filter-branch` (if already committed)

### 6. Test All Environments
- [ ] Local: `php artisan serve` works with local `.env`
- [ ] CI: GitHub Actions passes with secrets
- [ ] Preview: Vercel preview URL loads
- [ ] Production: Vercel production URL loads
- [ ] API: Render API responds

---

## TROUBLESHOOTING DASHBOARD ISSUES

### Vercel Deployment Fails

**Check**:
1. Project Settings → Root Directory = `client/`
2. Project Settings → Build Command = `npm run build`
3. Environment Variables all set
4. GitHub branch (should be `main`)

**Fix**:
- Clear cache: Settings → Advanced → clear build cache
- Redeploy: Deployments tab → click latest → "Redeploy"

### Render Build Fails

**Check**:
1. Render should auto-detect `/server/Dockerfile`
2. Build logs: Service → Logs tab
3. All environment variables set
4. Database credentials correct

**Fix**:
- View full logs: Render dashboard → Logs
- Restart service: Service → Restart
- Check database connectivity: Can connect with credentials?

### CI Tests Fail

**Check**:
1. GitHub Actions logs: Actions tab → workflow → job
2. Frontend: Is npm ci working? package-lock.json exists?
3. Backend: Is composer install working? composer.lock exists?

**Fix**:
- Re-run workflow: Actions → select workflow → "Re-run jobs"
- Check for environment-specific issues in logs

---

## QUICK LINKS

- **Vercel Dashboard**: https://vercel.com/dashboard
- **Render Dashboard**: https://dashboard.render.com
- **GitHub Repository**: https://github.com/your-org/sheltra_client_side
- **Stripe Dashboard**: https://dashboard.stripe.com
- **Google Gemini API**: https://aistudio.google.com/app

---

## SUPPORT

If you encounter issues:
1. Check logs in respective dashboard (Vercel/Render/GitHub)
2. Refer to main CI-CD-ARCHITECTURE.md for detailed explanations
3. Check troubleshooting sections in CI-CD-IMPLEMENTATION-CHECKLIST.md
4. Review error messages carefully for specific guidance

