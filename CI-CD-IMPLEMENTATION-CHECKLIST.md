# Sheltra CI/CD - IMPLEMENTATION CHECKLIST

## Phase 1: GitHub Actions CI Setup (Week 1)

### 1.1 GitHub Secrets Configuration

- [ ] Go to: Repository → Settings → Secrets and variables → Actions

**Frontend Secrets**:
- [ ] Add secret: `VITE_API_URL`
  - Value: `https://api.example.com` (your production API)

- [ ] Add secret: `VITE_STRIPE_PUBLIC_KEY`
  - Value: Your Stripe public key (test or live)

**Backend Secrets**:
- [ ] Add secret: `APP_KEY_FOR_CI`
  - Generate: `php artisan key:generate --show` (copy the value after "base64:")
  - Value: `base64:xxxxxxxxxxxxx...`

### 1.2 Workflow Files

- [ ] Create `.github/workflows/ci.yml`
  - Copy from: [CI-ARCHITECTURE.md - Section 8.1](CI-CD-ARCHITECTURE.md)
  - Validates both frontend and backend on every push/PR

- [ ] OR Create separate workflow files (optional):
  - [ ] `.github/workflows/frontend-ci.yml` (frontend only with path filters)
  - [ ] `.github/workflows/backend-ci.yml` (backend only with path filters)

### 1.3 Test Workflow Files

- [ ] Push a small commit to a feature branch
  - [ ] Verify GitHub Actions tab shows workflow running
  - [ ] Wait for completion (should take 3-5 minutes)
  - [ ] Check logs for any errors

- [ ] Create a test pull request
  - [ ] Verify "Checks" section shows both frontend & backend CI passing
  - [ ] Verify status appears as ✅ (green checkmark)

---

## Phase 2: GitHub Repository Protection (Week 1-2)

### 2.1 Branch Protection Rules

- [ ] Go to: Repository → Settings → Branches → Add rule

**For `main` branch**:
- [ ] Branch name pattern: `main`

- [ ] Require pull request reviews:
  - [ ] Enable: "Require pull request reviews before merging"
  - [ ] Required approvals: `1`
  - [ ] Dismiss stale pull request approvals: `✓ (enabled)`

- [ ] Require status checks to pass:
  - [ ] Enable: "Require status checks to pass before merging"
  - [ ] Require branches to be up to date: `✓ (enabled)`
  - [ ] Add required checks:
    - [ ] `frontend-ci` (or `CI - Frontend Only`)
    - [ ] `backend-ci` (or `CI - Backend Only`)

- [ ] Other restrictions:
  - [ ] Include administrators: `✓ (enabled)`
  - [ ] Restrict who can push: `✓ (enabled)` - select team/maintainers only
  - [ ] Require code reviews from CODEOWNERS: `✓ (optional but recommended)`

**For `develop` branch** (optional):
- [ ] Branch name pattern: `develop`
- [ ] Require CI status checks: `✓`
- [ ] Allow auto-merge: `✓` (optional, for faster integration)

### 2.2 CODEOWNERS Setup (Optional)

- [ ] Create file: `.github/CODEOWNERS`

```
# Copy this template:
/client/**  @frontend-team
/server/**  @backend-team
/.github/workflows/**  @maintainer
/render.yaml  @maintainer
```

- [ ] Commit and push
- [ ] PR will now require team review for specific paths

---

## Phase 3: Vercel Frontend Deployment (Week 2)

### 3.1 Create Vercel Account & Connect Git

- [ ] Create account: https://vercel.com (sign up with GitHub)
- [ ] Authorize Vercel to access GitHub
- [ ] Import repository:
  - [ ] Click "New Project"
  - [ ] Select "Sheltra" repository from GitHub
  - [ ] Click "Import"

### 3.2 Configure Project Settings

**Step 1: Framework & Build**
- [ ] Select Framework: "React"
- [ ] Click "Continue"

**Step 2: Project Settings**
- [ ] Root Directory: Set to `client`
  - [ ] Should show: "Auto-detected: client/"
  
- [ ] Build Command: `npm run build`
  - [ ] Pre-set (verify): "npm run build"

- [ ] Output Directory: `dist`
  - [ ] Pre-set (verify): "dist"

- [ ] Install Command: `npm ci`
  - [ ] Pre-set or auto-detected

### 3.3 Environment Variables

- [ ] Click "Environment Variables"

- [ ] Add variable: `VITE_API_URL`
  - [ ] Value: `https://api.example.com`
  - [ ] Environments: Production ✓ Preview ✓

- [ ] Add variable: `VITE_BACKEND_ENDPOINT`
  - [ ] Value: `https://api.example.com`
  - [ ] Environments: Production ✓ Preview ✓

- [ ] Add variable: `VITE_STRIPE_PUBLIC_KEY`
  - [ ] Value: Your Stripe public key
  - [ ] Environments: Production ✓ Preview ✓

- [ ] Add variable: `VITE_APP_ENV`
  - [ ] Environments - Production: `production`
  - [ ] Environments - Preview: `preview`

### 3.4 Deploy Settings

- [ ] Production Branch: Select `main`
- [ ] Auto-deploy: `✓ Deploy on every push to main`
- [ ] Preview Deployments: `✓ Automatic for all Pull Requests`
- [ ] Ignored Build Step: (leave blank or leave default)

### 3.5 Deploy

- [ ] Click "Deploy"
- [ ] Wait for build (2-5 minutes)
- [ ] Verify deployment succeeds
  - [ ] Shows green checkmark
  - [ ] Displays production URL (e.g., sheltra.vercel.app)

### 3.6 Test Vercel Deployment

- [ ] Visit deployed URL: https://sheltra.vercel.app (or your domain)
- [ ] Verify frontend loads
- [ ] Check browser console for errors
- [ ] Test API connectivity (should connect to prod backend)

### 3.7 Create Feature Branch Test

- [ ] Create new branch: `git checkout -b test/vercel-preview`
- [ ] Make a small frontend change
- [ ] Push: `git push origin test/vercel-preview`
- [ ] Create Pull Request on GitHub
- [ ] Check Vercel bot comment for preview URL
  - [ ] Vercel should post: "Preview: https://sheltra-test-xxxxx.vercel.app"
- [ ] Click preview URL and verify it works
- [ ] Merge PR (or close it)
  - [ ] Verify preview is deleted after PR closes

---

## Phase 4: Render Backend Deployment (Week 2-3)

### 4.1 Create Render Account & Connect Git

- [ ] Create account: https://render.com
- [ ] Click "New +" → "Web Service"
- [ ] Connect GitHub account
- [ ] Authorize Render
- [ ] Select "Sheltra" repository
- [ ] Click "Next"

### 4.2 Basic Configuration

**Name & Environment**:
- [ ] Service Name: `sheltra-api`
- [ ] Environment: `Docker`
- [ ] Region: Select closest to your users (e.g., US)
- [ ] Branch: `main`
- [ ] Repo URL: Auto-populated

### 4.3 Build & Start Commands

**Option 1: Auto-detect Dockerfile** (Recommended)
- [ ] Render should auto-detect `/server/Dockerfile`
- [ ] Build Command: (use Dockerfile)
- [ ] Start Command: (use Dockerfile entrypoint)

**Option 2: Manual** (if auto-detect fails)
- [ ] Root Directory: `server`
- [ ] Build Command: `docker build -t sheltra-api .`
- [ ] Start Command: `php artisan serve --host=0.0.0.0`

### 4.4 Environment Variables

**Render Dashboard - Environment Variables**:

- [ ] Click "Advanced" or "Environment"

**Plain Variables**:
- [ ] `APP_NAME` = `Sheltra`
- [ ] `APP_ENV` = `production`
- [ ] `APP_DEBUG` = `false`
- [ ] `APP_URL` = `https://api.example.com`
- [ ] `FRONTEND_URL` = `https://example.com`
- [ ] `LOG_LEVEL` = `error`
- [ ] `LOG_CHANNEL` = `stderr`
- [ ] `DB_CONNECTION` = `mysql`
- [ ] `QUEUE_CONNECTION` = `redis`
- [ ] `CACHE_DRIVER` = `redis`
- [ ] `SESSION_DRIVER` = `redis`

**Secret Variables**:
- [ ] `APP_KEY` = (Use "Secrets" section, not plain)
- [ ] `DB_HOST` = Database hostname
- [ ] `DB_PORT` = `3306`
- [ ] `DB_DATABASE` = `sheltra_prod`
- [ ] `DB_USERNAME` = Database username
- [ ] `DB_PASSWORD` = Database password
- [ ] `REDIS_HOST` = Redis hostname
- [ ] `REDIS_PASSWORD` = Redis password
- [ ] `STRIPE_PUBLIC_KEY` = Your Stripe public key
- [ ] `STRIPE_SECRET_KEY` = Your Stripe secret key (SECRETS!)
- [ ] `GEMINI_API_KEY` = Your Gemini API key (SECRETS!)
- [ ] `MAIL_HOST` = SMTP host (if applicable)
- [ ] `MAIL_USERNAME` = SMTP username
- [ ] `MAIL_PASSWORD` = SMTP password

### 4.5 Health Checks

- [ ] Click "Advanced" → "Health Check"
- [ ] Health Check Path: `/api/health`
- [ ] Check Interval: `30` seconds
- [ ] Health Check Type: `HTTP`

### 4.6 Auto-Deploy Settings

- [ ] Click "Advanced"
- [ ] Auto-deploy: `Yes` (from main branch)
- [ ] Paid Plan (optional): Select "Manual" if want manual deploys

### 4.7 Create Service

- [ ] Click "Create Web Service"
- [ ] Wait for build (5-10 minutes)
- [ ] Check logs for any errors
- [ ] Verify deployment succeeds (green "Live")

### 4.8 Test Render Deployment

- [ ] Get service URL from Render dashboard (e.g., sheltra-api.onrender.com)
- [ ] Visit `/api/health` endpoint: `https://sheltra-api.onrender.com/api/health`
  - [ ] Should return JSON with status: `ok`
- [ ] Test another API endpoint (e.g., `/api/users`)
  - [ ] Should return data (or 401 if auth required)
- [ ] Check Render logs for errors or warnings

### 4.9 Database Setup

- [ ] Create MySQL database (external)
  - Options:
    - [ ] AWS RDS
    - [ ] DigitalOcean Managed MySQL
    - [ ] Render Managed PostgreSQL
    - [ ] Other managed service

- [ ] Get connection details:
  - [ ] Host: xxxxx.rds.amazonaws.com
  - [ ] Port: 3306
  - [ ] Database: sheltra_prod
  - [ ] Username: sheltra_user
  - [ ] Password: xxxxxxxxx

- [ ] Add to Render environment variables (see 4.4)

- [ ] Test database connection:
  - [ ] Run migrations: SSH into Render service, then:
    ```
    php artisan migrate --force
    ```

### 4.10 Create Feature Branch Test

- [ ] Create new branch: `git checkout -b test/render-deploy`
- [ ] Make a small backend change (e.g., add comment to route)
- [ ] Push: `git push origin test/render-deploy`
- [ ] Create Pull Request
- [ ] Verify GitHub Actions CI passes
  - [ ] Wait for CI to complete (should pass)
- [ ] Merge PR
  - [ ] GitHub automatically deploys to main
  - [ ] Render receives webhook, triggers deploy
- [ ] Monitor Render logs:
  - [ ] Render dashboard → Logs tab
  - [ ] Should see: "Build started" → "Build finished" → "Service started"
- [ ] Verify API still works after deploy

---

## Phase 5: Domain & HTTPS Setup (Week 3)

### 5.1 Frontend Domain (Vercel)

- [ ] Choose domain:
  - [ ] Option 1: Use Vercel free domain (sheltra.vercel.app)
  - [ ] Option 2: Use custom domain (e.g., sheltra.app)

**If using custom domain**:
- [ ] Register domain (GoDaddy, NameCheap, etc.)
- [ ] In Vercel:
  - [ ] Project Settings → Domains
  - [ ] Add domain: `sheltra.app`
  - [ ] Add DNS records as instructed
- [ ] HTTPS: Auto-managed by Vercel

### 5.2 Backend Domain (Render)

- [ ] Choose domain:
  - [ ] Option 1: Use Render subdomain (sheltra-api.onrender.com) - free
  - [ ] Option 2: Use custom domain (e.g., api.sheltra.app)

**If using custom subdomain**:
- [ ] In Render:
  - [ ] Service Settings → Custom Domains
  - [ ] Add domain: `api.sheltra.app`
  - [ ] Add DNS records as instructed
- [ ] HTTPS: Auto-managed by Render

### 5.3 Update Frontend Environment Variables

**Update Vercel**:
- [ ] Vercel → Project Settings → Environment Variables
- [ ] Update `VITE_API_URL` to final domain:
  - [ ] Production: `https://api.sheltra.app`
- [ ] Update `VITE_APP_ENV` to `production`
- [ ] Redeploy frontend to apply (push to main)

---

## Phase 6: Configure CORS & Security Headers (Week 3)

### 6.1 Backend CORS Configuration

- [ ] Update `/server/config/cors.php`:

```php
'allowed_origins' => ['https://sheltra.app', 'https://*.vercel.app'],
'allowed_methods' => ['*'],
'allowed_headers' => ['*'],
'exposed_headers' => ['Content-Length', 'Authorization'],
'max_age' => 86400,
'supports_credentials' => true,
```

- [ ] Deploy changes to Render (push to main)

### 6.2 Add Security Headers

- [ ] In Laravel, add middleware in `/server/app/Http/Kernel.php`:
```php
protected $middleware = [
    ...
    \App\Http\Middleware\AddSecurityHeaders::class,
];
```

- [ ] Or in `/server/config/app.php` or `.htaccess`:
```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000; includeSubDomains
```

---

## Phase 7: Testing End-to-End Workflow (Week 4)

### 7.1 Create Complete Test Feature

- [ ] Create new branch: `git checkout -b test/e2e-deployment`

- [ ] Make changes to both frontend and backend:
  - [ ] Frontend: Update component or add log message
  - [ ] Backend: Update API response or add test endpoint

- [ ] Push: `git push origin test/e2e-deployment`

- [ ] Create Pull Request on GitHub

### 7.2 Verify PR Status Checks

- [ ] GitHub PR page shows:
  - [ ] ✅ CI - Frontend Only (or ci.yml)
  - [ ] ✅ CI - Backend Only (or ci.yml)
  - [ ] ✅ Vercel preview deployment
  - [ ] All green ✅

- [ ] Click Vercel preview URL:
  - [ ] Frontend loads
  - [ ] Calls production API
  - [ ] No errors in console

### 7.3 Test Approval & Merge

- [ ] Request review (if branch protection requires it)
- [ ] Reviewer approves PR
- [ ] Merge PR
  - [ ] Should deploy automatically

- [ ] Verify Vercel deployment:
  - [ ] Production URL loads new code
  - [ ] Change is visible

- [ ] Verify Render deployment:
  - [ ] Render shows "Live" status
  - [ ] Logs show successful build & deploy
  - [ ] API responds with changes

### 7.4 Monitor Deployment Health

- [ ] Check Vercel project → Deployments tab
  - [ ] Latest deployment shows green status

- [ ] Check Render service → Logs tab
  - [ ] No error messages
  - [ ] Health check passing (green indicator)

- [ ] Test production API:
  - [ ] Visit `/api/health`
  - [ ] Returns status: `ok`
  - [ ] Verify database connected

---

## Phase 8: Protection Rules & Final Lock-down (Week 4)

### 8.1 Enable All Branch Protection Rules

- [ ] GitHub → Repository → Settings → Branches → main

**Verify all enabled**:
- [ ] ✅ Require pull request reviews (1 approval)
- [ ] ✅ Require status checks (frontend-ci, backend-ci)
- [ ] ✅ Require up-to-date before merge
- [ ] ✅ Dismiss stale reviews
- [ ] ✅ Include administrators in restrictions
- [ ] ✅ Restrict pusher to admins/maintainers

### 8.2 Optional: Develop Branch Protection

- [ ] Create branch rule for `develop`
- [ ] Require: CI status checks ✅
- [ ] Require: PR reviews (optional)
- [ ] Allow auto-merge (optional, for faster integration)

### 8.3 Test Protection

- [ ] Try to force-push to main:
  ```bash
  git push -f origin main
  ```
  - [ ] Should be rejected with error

- [ ] Try to merge without CI passing:
  - [ ] Create PR with intentionally failing code
  - [ ] Verify merge button is disabled 🔒
  - [ ] Fix code and push
  - [ ] Verify merge button is now enabled ✅

---

## Phase 9: Setup Monitoring & Alerts (Week 4)

### 9.1 Render Health Checks

- [ ] Render dashboard → Service → Settings
- [ ] Verify Health Check is configured:
  - [ ] Path: `/api/health` ✅
  - [ ] Interval: 30s ✅
  - [ ] Status shows: 🟢 Healthy

### 9.2 Setup Slack Notifications (Optional)

**Render Notifications**:
- [ ] Render → Account Settings → Notifications
- [ ] Add Slack integration
- [ ] Subscribe to: Deploy events

**GitHub Actions Notifications**:
- [ ] Create Slack webhook
- [ ] Add to GitHub workflow (optional, for detailed alerts)

### 9.3 Vercel Analytics

- [ ] Vercel → Project → Analytics
- [ ] Enable: Web Vitals
- [ ] Monitor: Performance, Core Web Vitals

---

## Phase 10: Security & Secrets Rotation (Month 1-2)

### 10.1 Secret Scanning

- [ ] GitHub → Repository → Settings → Security & analysis
- [ ] Enable: Secret scanning
- [ ] Enable: Dependabot alerts
- [ ] Enable: Dependabot security updates

### 10.2 Review Secrets

- [ ] GitHub → Settings → Secrets and variables
  - [ ] Verify all secrets are necessary
  - [ ] Remove any unused secrets
  - [ ] Note creation date for rotation schedule

### 10.3 Dependencies Update

- [ ] Frontend: `npm audit`
  - [ ] Fix high/critical vulnerabilities
  - [ ] Update regularly

- [ ] Backend: `composer audit`
  - [ ] Fix high/critical vulnerabilities
  - [ ] Test thoroughly before deploying

---

## Phase 11: Optimization & Advanced Features (Month 2+)

### 11.1 Add Backend Staging Environment (Optional)

- [ ] Create second Render service for `develop` branch
- [ ] Setup separate database for staging
- [ ] Test full-stack changes before production

### 11.2 Add Separate Queue & Scheduler Services

- [ ] Create `sheltra-queue-worker` service on Render
- [ ] Create `sheltra-scheduler` service on Render
- [ ] Update render.yaml with all 3 services

### 11.3 Add Error Tracking (Sentry)

- [ ] Frontend: Setup Sentry for JavaScript errors
- [ ] Backend: Setup Sentry for PHP errors
- [ ] Monitor error rates in production

### 11.4 Add Monitoring Dashboard

- [ ] Setup Datadog or New Relic
- [ ] Monitor API response times
- [ ] Monitor database query performance
- [ ] Setup alerting

---

## Troubleshooting

### Frontend CI Fails

**Issue**: `npm ci` or `npm run build` fails
- [ ] Check Node.js version: Should be 20.x (LTS)
- [ ] Clear npm cache: `npm cache clean --force`
- [ ] Check for `node_modules` conflicts
- [ ] Verify `package-lock.json` is committed

### Backend CI Fails

**Issue**: `composer install` fails
- [ ] Check PHP version: Should be 8.0+
- [ ] Check Composer cache issues
- [ ] Verify `composer.lock` is up-to-date
- [ ] Check for missing PHP extensions

**Issue**: `php artisan test` fails
- [ ] Verify migrations run successfully
- [ ] Check test database is accessible
- [ ] Review test output logs

### Vercel Deployment Fails

**Issue**: Build succeeds locally but fails on Vercel
- [ ] Check environment variables are set in Vercel UI
- [ ] Check root directory is set to `client/`
- [ ] Check npm version compatibility
- [ ] Check for ignored files in `.gitignore` or `.vercelignore`

### Render Deployment Fails

**Issue**: Docker build fails
- [ ] Verify `server/Dockerfile` exists and is correct
- [ ] Check for missing dependencies in Dockerfile
- [ ] Verify environment variables are set in Render UI
- [ ] Check Render build logs for specific error

**Issue**: Migration fails on deploy
- [ ] Verify database credentials are correct
- [ ] Check migrations have no errors (can't be rolled back)
- [ ] Manually run: `php artisan migrate --dry-run`
- [ ] Check database schema for conflicts

---

## Final Checklist

### Before Going Live

- [ ] All CI workflows pass on main branch
- [ ] All branch protection rules enabled
- [ ] Frontend accessible at custom domain
- [ ] Backend API accessible at custom domain
- [ ] Vercel health check passing
- [ ] Render health check passing
- [ ] Database connected and migrated
- [ ] Environment variables configured
- [ ] CORS properly configured
- [ ] Secrets stored securely (not in code)
- [ ] Error tracking enabled (if using Sentry)
- [ ] Monitoring setup (if using New Relic/Datadog)
- [ ] Team notified of deployment
- [ ] Rollback plan documented

### Post-Launch Monitoring

- [ ] [ ] Monitor Vercel deployments (daily first week)
- [ ] [ ] Monitor Render via health checks
- [ ] [ ] Check error tracking dashboard
- [ ] [ ] Review database performance
- [ ] [ ] Monitor API response times
- [ ] [ ] Check for security alerts
- [ ] [ ] Verify automatic scaling (if enabled)

---

## Success Indicators

✅ **CI Pipeline Working**:
- Every push runs GitHub Actions
- CI passes before allowing merge to main
- Status checks show in PR

✅ **Continuous Deployment Working**:
- Push to main → Vercel deploys automatically
- Push to main → Render deploys automatically
- No manual steps needed

✅ **Preview Deployments Working**:
- PR created → Vercel preview URL ready
- Frontend preview connects to backend API
- Preview deleted when PR closes

✅ **Production Safe**:
- Main branch always stable
- Rollback available 1-click
- Health checks monitoring live
- Secrets secure and managed

---

**Questions?** Refer back to sections in CI-CD-ARCHITECTURE.md for detailed explanations.
