# Sheltra CI/CD Architecture & Implementation Guide

**Project**: Sheltra (React + Vite frontend, Laravel 8 backend)  
**Target Platforms**: Vercel (frontend) + Render (backend)  
**CI Tool**: GitHub Actions  
**Date**: April 2026

---

## 1. RECOMMENDED CI/CD ARCHITECTURE

### 1.1 High-Level Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    Developer Workflow                        │
├─────────────────────────────────────────────────────────────┤
│
│  1. Developer pushes code to feature/* or develop branch
│                    ↓
│  2. GitHub Actions CI runs (parallel):
│     - Frontend CI (lint, build, type-check)
│     - Backend CI (tests, static analysis)
│                    ↓
│  3. [If Pull Request]:
│     - Status checks block merge until passing
│     - Vercel preview deployment for frontend
│     - Display preview URLs in PR
│                    ↓
│  4. Code review + approval
│                    ↓
│  5. Merge to develop/main
│                    ↓
│  6. GitHub Actions runs post-merge CI
│                    ↓
│  7. [If main branch]:
│     - Vercel auto-deploys to production
│     - Render auto-deploys to production
│                    ↓
│  8. [If develop branch]:
│     - Optional: Deploy to staging environment
│                    ↓
│  9. Health checks & smoke tests
│                    ↓
│  10. Notification to team (success/failure)

└─────────────────────────────────────────────────────────────┘
```

### 1.2 Why This Architecture?

**GitHub Actions for CI (not CD)**
- ✅ Free for public/private repos
- ✅ Native GitHub integration (no external orchestration)
- ✅ Built-in secret management
- ✅ Easy to debug (logs visible in GitHub UI)
- ✅ Can run tests, linting, security checks
- ✅ Platform-agnostic (doesn't care where code deploys)

**Vercel for Frontend CD**
- ✅ Git-native deployment (no extra config needed)
- ✅ Automatic preview deployments for PRs
- ✅ Built-in edge caching & CDN
- ✅ Environment variable management in UI
- ✅ Simple to configure for monorepo (just set root: client/)
- ✅ Zero-downtime deployments by default

**Render for Backend CD**
- ✅ Git-native deployment (GitHub integration)
- ✅ Zero-downtime blue-green deployments
- ✅ Environment variables + secrets UI
- ✅ Optional render.yaml for Infrastructure as Code
- ✅ Native support for background jobs (queue, scheduler)
- ✅ Health checks built-in

### 1.3 Coordinating Frontend + Backend Deployments

**Key Challenge**: Frontend and backend deploy independently.  
**Solution**: Use staging/preview URLs with environment variables.

**Flow**:
```
Preview Deployment (PR)
├── Frontend: Builds in Vercel with VITE_API_URL=staging-backend
├── Backend: May use production API (safer) or staging backend
└── Result: Preview frontend hits staging/production backend

Production Deployment
├── Frontend: Builds in Vercel with VITE_API_URL=production-backend
├── Backend: Deploys independently to production  
└── Result: Both point to same production environment
```

**Best Practice for Your Stage**:
- Preview frontend should call **production backend** (safer, less confusion)
- Main production deployment: Frontend + Backend both go live
- Use backend semantic versioning + API stability for smooth rollouts

---

## 2. RECOMMENDED GIT BRANCHING STRATEGY

### 2.1 Branch Model (Modified Git Flow)

```
┌─ main (production)
│  └──[tags: v1.0.0, v1.0.1, ...]
│
├─ develop (staging/integration)
│
└─ feature/* (development)
   └─ hotfix/* (emergency fixes)
```

### 2.2 Branch Rules & Triggers

| Branch | Purpose | CI Trigger | CD Trigger | Preview Deploy | Protected |
|--------|---------|-----------|-----------|-----------------|-----------|
| `main` | Production-ready | Yes (all) | Yes → Vercel + Render prod | N/A | ✅ **YES** |
| `develop` | Integration/Staging | Yes (all) | No (manual or optional) | N/A | ⚠️ Optional |
| `feature/*` | Feature development | Yes (all) | No | Yes (Vercel only) | No |
| `hotfix/*` | Emergency prod fixes | Yes (all) | Yes → immediate prod | N/A | No |
| `release/*` | Release prep | Yes (all) | No | No | No |

### 2.3 Branching Workflow (Step-by-Step)

**Creating a Feature**:
```bash
git checkout develop
git pull origin develop
git checkout -b feature/user-authentication
# ... make changes ...
git push origin feature/user-authentication
# → Creates PR against develop
# → CI runs automatically
# → Vercel creates preview deployment
```

**Feature Complete → Develop**:
```bash
# PR approved, merge to develop
git checkout develop && git pull
git merge --no-ff feature/user-authentication
git push origin develop
# → Optional: Deploy to staging
# → Team tests in staging
```

**Release to Production (Main)**:
```bash
git checkout main
git pull origin main
git merge --no-ff develop
git tag -a v1.2.0 -m "Release v1.2.0"
git push origin main --tags
# → CI runs
# → Vercel deploys frontend to production
# → Render deploys backend to production
```

**Hotfix for Production**:
```bash
git checkout main
git checkout -b hotfix/critical-security-fix
# ... make minimal fix ...
git push origin hotfix/critical-security-fix
# PR against main + develop
# After merge to main → immediate production deploy
# Then merge to develop to keep in sync
```

### 2.4 Why This Model?

- **Simple**: Three main branches + feature branches
- **Safe**: Production always stable, develop is integration point
- **Trackable**: Tags on main for production versions
- **Quick hotfixes**: hotfix/* can go straight to main if needed
- **Team-friendly**: Clear naming conventions

---

## 3. GITHUB ACTIONS CI DESIGN

### 3.1 CI Workflow Strategy

**Objectives**:
1. Run linting + build checks on every push/PR
2. Validate backend tests on every push  
3. Catch bugs early (don't merge broken code to main)
4. Fast feedback (< 5-10 minutes)
5. Cache dependencies to reduce install time

### 3.2 Frontend CI Jobs

**Trigger**: Changes to `/client/**` files  
**Cache**: npm dependencies  
**Steps**:

```
1. Checkout code
2. Setup Node.js (LTS v20 or v22)
3. Cache npm dependencies (~2-3 min saved per run)
4. Install dependencies
   └─ npm ci (clean install, npm ci is better than npm install for CI)
5. Lint code
   └─ Run Prettier check or custom linter
6. Build frontend
   └─ VITE_API_URL=https://api.example.com npm run build
7. Verify build output exists
   └─ Check dist/ folder has index.html + JS bundles
8. [Optional] Bundle analysis
   └─ Check bundle size doesn't exceed threshold
9. [Optional] Lighthouse audit for preview
   └─ Run on Vercel preview URL (can be post-deploy)
```

### 3.3 Backend CI Jobs

**Trigger**: Changes to `/server/**` files  
**Cache**: Composer dependencies  
**Steps**:

```
1. Checkout code
2. Setup PHP 8.0 (Laravel 8 compatible)
3. Setup MySQL 5.7 service (for tests)
4. Cache Composer dependencies (~1 minute saved)
5. Install dependencies
   └─ composer install --no-interaction
6. Copy .env.testing
   └─ Set APP_KEY, DB connection to SQLite
7. Generate Laravel app key (if not in .env)
   └─ php artisan key:generate
8. Run migrations (SQLite test DB)
   └─ php artisan migrate --database=sqlite_testing
9. Seed test data
   └─ php artisan db:seed --database=sqlite_testing
10. Run PHPUnit tests
    └─ vendor/bin/phpunit --testdox
11. [Optional] Run Laravel Pint (formatting check)
    └─ ./vendor/bin/pint --test
12. [Optional] Run PHPStan (static analysis)
    └─ vendor/bin/phpstan analyse app --level=5
```

### 3.4 Monorepo Path Filtering (Optional but Recommended)

**Problem**: Running all jobs for every file change is waste.  
**Solution**: Use path filters to run only relevant jobs.

```yaml
on:
  pull_request:
    paths:
      - 'client/**'        # Frontend only
      - '.github/workflows/ci.yml'  # Always run if CI changes
  push:
    branches: [main, develop]
```

**Trade-offs**:
- ✅ **Pro**: Faster feedback, lower CI cost
- ❌ **Con**: Must maintain multiple workflow files
- ✅ **Recommendation**: Use for this project (clear separation)

### 3.5 Failure Strategies

**Frontend**:
- Fail-fast: If build fails, don't run bundle analysis
- If linting fails → Don't build

**Backend**:
- Fail-fast: If tests fail → Stop (don't run static analysis)
- All test jobs: Run migrations, seed, run tests
- Static analysis: Can run in parallel

---

## 4. DEPLOYMENT SETUP FOR VERCEL (Frontend)

### 4.1 Vercel Configuration for Monorepo

**Step 1: Connect to GitHub**
- Go to Vercel dashboard → Projects → Import
- Select Sheltra repository
- Select "React" as Project Framework

**Step 2: Configure Root Directory**
```
Root Directory: client/
```
This tells Vercel to look for package.json in /client instead of root.

**Step 3: Build & Output Settings**
```
Build Command:    npm run build
Output Directory: dist
```

**Step 4: Environment Variables**

| Variable | Value | Type |
|----------|-------|------|
| `VITE_API_URL` | Production: `https://api.example.com` | Plain |
| `VITE_BACKEND_ENDPOINT` | Production: `https://api.example.com` | Plain |
| `VITE_APP_ENV` | `production` | Plain |

### 4.5 Production Branch Setup
- **Main production branch**: `main`
- **Vercel will auto-deploy** when you push to main
- No need to configure anything else

### 4.6 Preview Deployments
- **Automatic**: Vercel creates preview URL for every PR
- **Shows in PR**: Comment with preview URL
- **Settings**: Vercel → Project Settings → Preview Deployments
- **Recommendation**: Allow preview deployments for feature/* and develop

### 4.7 API URL Strategy (Frontend → Backend)

**Challenge**: Preview frontend needs to hit correct backend API.

**Solution 1: Point to Production Backend** (Recommended for now)
```javascript
// .env.example
VITE_API_URL=https://api.prod.com

// Preview still hits production API
// Safe because backend is stable, frontend is preview
```

**Solution 2: Conditional URLs** (Later optimization)
```javascript
// Detect preview vs production
const API_URL = 
  process.env.VERCEL_ENV === 'production' 
    ? 'https://api.prod.com'
    : 'https://api-staging.prod.com'

// Use environment conditions
```

### 4.8 Production Deployment Workflow

```
1. Developer pushes code to main
2. GitHub Action validates (CI passes)
3. Vercel receives GitHub webhook
4. Vercel builds: npm run build
5. Output pushed to Vercel CDN
6. Old deployment archived (can rollback)
7. New deployment live
8. Vercel sends success notification
```

---

## 5. DEPLOYMENT SETUP FOR RENDER (Backend)

### 5.1 Render Configuration for Laravel

**Step 1: Connect to GitHub**
- Go to Render dashboard → Create new → Web Service
- Connect GitHub account
- Select Sheltra repository

**Step 2: Basic Settings**
```
Name:                sheltra-api
Environment:         Docker
Region:              US (or closest to your DB)
Branch:              main
```

**Step 3: Build & Start Commands**

**Option A: Using render.yaml (Recommended)**
```yaml
# render.yaml (at project root)
services:
  - type: web
    name: sheltra-api
    env: docker
    rootDir: server
    buildCommand: docker build -t sheltra-api .
    startCommand: php artisan serve --host=0.0.0.0
    envVars:
      - key: APP_ENV
        value: production
      - key: APP_DEBUG
        value: false
```

**Option B: Manual Configuration**
- Build Command: `docker build -t sheltra-api .`
- Start Command: Already in Dockerfile
- Dockerfile: Use the existing `/server/Dockerfile`

**Step 4: Environment Variables**

Store these in Render dashboard:

| Variable | Value | Example |
|----------|-------|---------|
| `APP_ENV` | `production` | Render UI |
| `APP_DEBUG` | `false` | Render UI |
| `APP_KEY` | `base64:xxxxx...` | Render Secrets |
| `APP_URL` | `https://api.example.com` | Render UI |
| `DB_HOST` | From Render database | Render UI |
| `DB_PORT` | `3306` | Render UI |
| `DB_DATABASE` | Database name | Render UI |
| `DB_USERNAME` | Database user | Render Secrets |
| `DB_PASSWORD` | Database password | Render Secrets |
| `STRIPE_KEY` | Public key | Render UI |
| `STRIPE_SECRET` | Secret key | Render Secrets |
| `GEMINI_API_KEY` | API key | Render Secrets |
| `QUEUE_CONNECTION` | `redis` | Render UI |
| `CACHE_DRIVER` | `redis` | Render UI |
| `REDIS_HOST` | Render Redis host | Render UI |
| `REDIS_PASSWORD` | Redis password | Render Secrets |

### 5.2 Database Setup

**Option 1: Render Managed PostgreSQL**
```
1. Create Render PostgreSQL instance
2. Copy connection string
3. Set DB_* environment variables
4. Run migrations after first deploy
```

**Option 2: External MySQL (Recommended for compatibility)**
```
1. Use existing MySQL provider (AWS RDS, etc.)
2. Set DB_HOST, DB_USERNAME, DB_PASSWORD
3. Ensure Render IP is whitelisted in firewall
```

**Option 3: Render Private PostgreSQL**
```
1. Create private PostgreSQL service
2. Link to web service
3. PostgreSQL becomes available inside Docker
```

### 5.3 Auto-Deploy Setup

**Render Auto-Deploy**:
```
Render dashboard → Sheltra-api → Settings → Auto-Deploy
→ Choose "Yes" for branch main
```

**Result**: Every push to main automatically triggers build & deploy.

**With CI/CD**: Render only deploys if GitHub Actions CI passes (configure webhooks).

### 5.4 Deploy Hooks (Optional)

Render can wait for CI to pass before deploying:

```
Render dashboard → Settings → Deploy Hooks
→ Add GitHub Actions webhook
```

This ensures Render only deploys after GitHub Actions CI succeeds.

### 5.5 Production Deployment Workflow

```
1. Developer pushes to main
2. GitHub Actions runs CI (tests pass)
3. Render receives webhook (optional)
4. Render builds Docker image
5. Runs migrations: php artisan migrate --force
6. Stops old container gracefully
7. Starts new container
8. Health check passes
9. Old container removed
10. New version live (zero-downtime)
```

### 5.6 Advanced: Separate Queue & Scheduler Services

**Recommended for production**:

Create 3 separate Render services:

**Service 1: Web API**
```
Name: sheltra-api
Command: php artisan serve --host=0.0.0.0
```

**Service 2: Background Queue Worker**
```
Name: sheltra-queue-worker
Command: php artisan queue:work --queue=default --timeout=60
Scaling: Manual or Auto (1 instance)
```

**Service 3: Scheduler**
```
Name: sheltra-scheduler
Command: while true; do php artisan schedule:run; sleep 60; done
Scaling: Manual (1 instance always)
```

**All share**: Same environment variables, same repo, same branch, same code

---

## 6. SECRETS AND ENVIRONMENT VARIABLE STRATEGY

### 6.1 Secret Management Rules

**NEVER commit to Git**:
- ❌ Database passwords
- ❌ API keys (Stripe, Gemini)
- ❌ APP_KEY
- ❌ Redis passwords
- ❌ Webhook tokens

**Store in Service UIs Instead**:
- ✅ GitHub Secrets (for CI/CD workflows)
- ✅ Vercel UI (for frontend builds)
- ✅ Render UI (for backend runtime + deployments)

**Plain text OK to commit**:
- ✅ API endpoints (non-secret)
- ✅ Public keys
- ✅ Feature flags
- ✅ App name, version

### 6.2 Environment Variable Categories

**Frontend Variables** (Vite)
```
VITE_API_URL=https://api.example.com
VITE_BACKEND_ENDPOINT=https://api.example.com
VITE_APP_ENV=production
VITE_STRIPE_PUBLIC_KEY=pk_live_xxx
```

**Backend Variables** (Laravel)
```
# Core
APP_NAME=Sheltra
APP_ENV=production
APP_DEBUG=false
APP_KEY=base64:xxxxx
APP_URL=https://api.example.com

# Database
DB_CONNECTION=mysql
DB_HOST=database.example.com
DB_PORT=3306
DB_DATABASE=sheltra_prod
DB_USERNAME=sheltra_user
DB_PASSWORD=xxxxx

# Cache & Queue
QUEUE_CONNECTION=redis
CACHE_DRIVER=redis
SESSION_DRIVER=redis
REDIS_HOST=redis.example.com
REDIS_PORT=6379
REDIS_PASSWORD=xxxxx

# Third-party
STRIPE_PUBLIC_KEY=pk_live_xxx
STRIPE_SECRET_KEY=sk_live_xxx
GEMINI_API_KEY=xxxxx
MAIL_DRIVER=smtp
MAIL_HOST=smtp.example.com
MAIL_USERNAME=xxx
MAIL_PASSWORD=xxx
```

### 6.3 Environment Separation

| Environment | Where | Deployed By | DB | Notes |
|-------------|-------|-------------|-----|-------|
| **Local** | Your machine | You (npm run dev / php artisan serve) | SQLite/Local MySQL | Use .env (gitignored) |
| **Preview** | Vercel preview URLs | Vercel (PR trigger) | Production DB | Frontend only, calls prod backend |
| **Staging** | Optional Render URL | Manual deploy | Staging DB | Test full stack before prod |
| **Production** | vercel.app + api.com | Vercel + Render (main branch) | Production DB | Real users, real transactions |

### 6.4 Environment Files Strategy

**Committed to Git** (`.env.example`):
```bash
# SHELTRA PROJECT - ENVIRONMENT TEMPLATE
# Copy to .env and update values

APP_NAME=Sheltra
APP_ENV=local
APP_DEBUG=true
LOG_LEVEL=debug

# Database
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=sheltra_dev
DB_USERNAME=root
DB_PASSWORD=

# Frontend API
VITE_API_URL=http://localhost:8000/api
VITE_BACKEND_ENDPOINT=http://localhost:8000
VITE_APP_ENV=development

# Services (use test keys)
STRIPE_PUBLIC_KEY=pk_test_xxx
STRIPE_SECRET_KEY=sk_test_xxx
GEMINI_API_KEY=test_key
```

**NOT committed** (`.env` or via service UI):
- Production values only
- Secrets only
- Never commit to Git

### 6.5 Secrets Storage Location Table

| Variable | Frontend | Backend | Store in | CI Only? |
|----------|----------|---------|----------|----------|
| `VITE_API_URL` | ✅ | ❌ | GitHub Secrets → Vercel Env | No |
| `VITE_STRIPE_PUB_KEY` | ✅ | ❌ | GitHub Secrets → Vercel Env | No |
| `DB_PASSWORD` | ❌ | ✅ | Render Secrets | No |
| `APP_KEY` | ❌ | ✅ | Render Secrets | No |
| `STRIPE_SECRET_KEY` | ❌ | ✅ | Render Secrets | No |
| `GEMINI_API_KEY` | ❌ | ✅ | Render Secrets | No |
| `REDIS_PASSWORD` | ❌ | ✅ | Render Secrets | No |

### 6.6 CI/CD Secret Access

**GitHub Actions Workflow**:
```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Frontend build with API URL
        working-directory: client
        run: npm run build
        env:
          VITE_API_URL: ${{ secrets.VITE_API_URL }}
      
      - name: Backend test
        working-directory: server
        run: php artisan test
        env:
          DB_DATABASE: :memory:
          APP_KEY: ${{ secrets.APP_KEY_FOR_CI }}
```

**GitHub Secrets Setup** (CI only):
- `VITE_API_URL` = https://api.example.com
- `APP_KEY_FOR_CI` = Base64 encoded key for tests if needed

---

## 7. QUALITY GATES AND PROTECTION RULES

### 7.1 Branch Protection Rules

**Apply to branch**: `main`

**Rules**:
```
✅ Require pull request reviews before merging
   - Required approvals: 1

✅ Require status checks to pass before merging
   - frontend-ci (required)
   - backend-ci (required)
   - codeql (recommended if enabled)

✅ Require branches to be up to date before merging
   - Ensures no conflicts, latest CI runs

✅ Require code reviews from code owners
   - Optional: Setup CODEOWNERS file
   - Can assign reviewers by file/team

✅ Dismiss stale pull request approvals
   - When new commits pushed, re-review needed

✅ Restrict who can push to matching branches
   - Only allow admins or specific team members
```

### 7.2 Branch Protection for `develop` (Optional)

**Rules**:
```
✅ Require CI status checks to pass
✅ Allow auto-merge (optional)
✅ Don't require reviews (faster integration)
✅ Don't restrict pushes (developers need flexibility)
```

### 7.3 Recommended CI Status Checks

**Must pass before merge**:
- `frontend-ci` - Any frontend build failure blocks merge
- `backend-ci` - Any backend test failure blocks merge

**Should run but not required** (optional):
- `security-scan` - Dependency vulnerability scan
- `code-quality` - Code coverage threshold

### 7.4 CODEOWNERS File (Optional)

**Create**: `.github/CODEOWNERS`

```
# Frontend code
/client/**  @frontend-team

# Backend code
/server/**  @backend-team

# Database migrations
/database/migrations/**  @backend-team

# GitHub workflows (require careful review)
/.github/workflows/**  @maintainer1 @maintainer2

# Config files (require careful review)
/render.yaml  @maintainer1
/vercel.json  @maintainer1
```

**Effect**: GitHub requires reviews from specified people before merge.

### 7.5 Enforce Rules Without Exceptions

**Settings** (GitHub):
```
Repository Settings → Rules
→ Create ruleset "main-protection"
→ Enforcement: Active
→ Target branches: main
→ Rules:
  - Require status checks
  - Require code review
  - Block force push
  - Block delete
```

---

## 8. WORKFLOW YAML FILES

Generated separately in following sections...

---

## 9. BEST TESTING STRATEGY FOR CI

### 9.1 Minimum Test Suite (Now)

**Frontend**:
- ✅ Build verification (npm run build succeeds)
- ✅ Lint checks (Prettier, ESLint if exists)
- ⚠️ Unit tests: Optional (add after MVP)
- ⚠️ E2E tests: Defer to later phase

**Backend**:
- ✅ PHPUnit tests (feature + unit tests)
- ✅ Database migrations succeed
- ✅ Routes/API endpoints accessible
- ✅ Pint formatting check (if exists)
- ⚠️ PHPStan static analysis: Optional (add later)
- ⚠️ Mutation testing: Defer

### 9.2 Why This Approach?

**Prioritize**:
1. Build succeeds (catches syntax errors)
2. Tests pass (catches logic errors)
3. Linting (catches style issues)
4. Static analysis (catches potential bugs)

**Defer**:
- Full code coverage until team grows
- Complex E2E tests until app is stable
- Performance testing until scaling needed

### 9.3 Testing Database for Laravel CI

**Recommended**: SQLite in-memory for speed

```php
// tests/TestCase.php
protected function setUp(): void
{
    parent::setUp();
    
    // Use SQLite for testing
    $this->artisan('migrate', [
        '--database' => 'sqlite_testing',
    ]);
    
    $this->seed();
}
```

**.env.testing**:
```
DB_CONNECTION=sqlite
DB_DATABASE=:memory:
```

**Result**: Tests run in < 1 minute, no external DB needed.

### 9.4 Frontend Testing (Optional Phase 2)

**When to add**:
- After MVP is stable
- When team grows to 3+ developers
- When feature complexity increases

**What to test**:
```
- Component rendering
- Form validation
- Error handling
- API integration mocking
```

**Tool**: Vitest (Vite-native) or Jest

### 9.5 Avoiding Flaky CI

**Common Issues**:

1. **Database race conditions**
   - Use fresh DB for each test
   - Use transactions + rollback
   - Don't share state between tests

2. **Timing issues**
   - Set proper timeouts
   - Avoid arbitrary sleep()
   - Use queues deterministically in tests

3. **External service flakiness**
   - Mock API calls (don't hit real Stripe/Gemini in CI)
   - Use test API keys
   - Fallback gracefully

---

## 10. PREVIEW AND STAGING STRATEGY

### 10.1 Frontend Preview Deployments (Vercel)

**Automatic** (no setup needed):
- Every PR to any branch → Vercel creates preview URL
- Comment appears on PR: "Preview: https://sheltra-feature.vercel.app"
- Different URL per PR
- Updated on new pushes
- Deleted when PR closed

**What frontend preview includes**:
```
✅ Latest code from feature branch
✅ Production-like build
✅ Environment variables from Vercel (VITE_API_URL=production)
✅ All assets/images/fonts deployed
```

**What it calls**:
```
→ Production backend API (safer, avoids backend coordination)
```

### 10.2 Backend Staging Environment (Render - Optional)

**Now**: Skip (not needed yet)  
**Later** (when needed):

Create second Render service:
```
sheltra-api-staging
├── Branch: develop
├── DB: Staging database instance
├── Environment: staging
└── Auto-deploy: On develop branch
```

**Use case**: Test full backend before production merge.

### 10.3 Practical Recommendation (Your Stage)

**Now (MVP)**:
```
Feature branches → Frontend preview (calls prod API)
         ↓
Develop branch → Manual testing locally
         ↓
Main branch → Production (both frontend + backend)
```

**Later (scaling)**:
```
Feature branches → Frontend preview (calls staging API)
         ↓
Develop branch → Deploy to staging-api (Render)
                → Test full stack
         ↓
Main branch → Production (deployed)
```

### 10.4 Environment Variables for Preview

**Vercel Preview Environment Variables**:
```
VITE_API_URL=https://api.prod.com  (override for preview)
VITE_STRIPE_PUBLIC_KEY=pk_test_xxx (test key for preview)
```

**Result**: Preview frontend works safely with staging data/API.

---

## 11. DATABASE MIGRATION STRATEGY IN CI/CD

### 11.1 Migration Workflow

**Development**:
```
1. Developer creates migration: php artisan make:migration add_column
2. Migration runs locally: php artisan migrate
3. Tested locally
4. Pushed to Git with code change
```

**CI Pipeline**:
```
1. GitHub Actions runs tests
2. Migrations applied to test DB (SQLite)
3. Tests run against migrated DB
4. If tests pass, migration is safe
```

**Production Deploy** (Render Blue-Green):
```
1. Render receives deploy signal
2. Starts new container (blue)
3. Runs migrations in blue container (pre-warming)
4. Runs health checks
5. If all OK, traffic switches to blue
6. Old container (green) stops
```

### 11.2 Auto vs. Manual Migrations

**Render Default**: Auto-run migrations on deploy

**Recommendation**: Add explicit pre-start script

```yaml
# render.yaml
web:
  commands:
    - php artisan migrate --force
    - php artisan serve --host=0.0.0.0
```

**Why `--force`**: In production, doesn't prompt for confirmation.

### 11.3 Risky Schema Changes

**Problem**: Removing column while code still references it = crash.

**Safe Strategy**:

**Step 1: Deploy code that stops using column** (backward compatible)
```
// Old code uses column
$user->phone_number;

// New code ignores it
// (but doesn't crash if it's there)
```

**Step 2: Deploy migration to drop column**
```
// Migration runs, removes column
// Code doesn't care
```

**Alternative**: Add feature flags
```php
if (config('features.new_api')) {
    // Use new schema
} else {
    // Use old schema
}
```

### 11.4 Zero-Downtime Guidelines

**✅ Safe Migrations**:
- ADD COLUMN (always safe)
- ADD INDEX (safe, background indexed)
- RENAME COLUMN (if handled in code)

**⚠️ Risky Migrations**:
- DROP COLUMN (must remove from code first)
- RENAME TABLE (must update references first)
- Change NOT NULL (must have default first)

**Blue-Green Deployment Handles Most**:
Render's blue-green deployment means:
1. New code deployment
2. DB migrations run against new DB state
3. Old code stops instantly
4. No overlap = no conflicts

---

## 12. QUEUE AND SCHEDULER DEPLOYMENT STRATEGY

### 12.1 Architecture Options

**Option 1: Single Container** (Recommended Now)
```
1 Render Web Service
├── Web API (port 8000)
├── Queue worker (background process within container)
└── Scheduler (background process within container)
```

**Pros**: Simple, one deployment, one config  
**Cons**: If web crashes, jobs aren't processed  
**When**: MVP/small scale

**Option 2: Separate Services** (Recommended Later)
```
3 Render Services
├── sheltra-api (web)
├── sheltra-queue-worker (background jobs)
└── sheltra-scheduler (cron-like tasks)
```

**Pros**: Independent scaling, resilience, monitoring  
**Cons**: More complex, more cost  
**When**: Production with jobs critical to business

### 12.2 Single Container Setup (Now)

**Dockerfile** (updated):
```dockerfile
FROM php:8.0-fpm

# ... setup ...

RUN mkdir -p /var/log/laravel

CMD ["/bin/bash", "-c", "php artisan queue:work --queue=default &\
  php artisan schedule:run &\
  php artisan serve --host=0.0.0.0"]
```

**Or using start script**:
```bash
#!/bin/bash
set -e

# Start queue worker in background
php artisan queue:work --queue=default > /var/log/laravel/queue.log 2>&1 &

# Start scheduler in background
while true; do
  php artisan schedule:run
  sleep 60
done &

# Start web server
php artisan serve --host=0.0.0.0
```

### 12.3 Separate Services (Later)

**Service 1: Web API**
```yaml
type: web
name: sheltra-api
buildCommand: docker build -t sheltra-api .
startCommand: php artisan serve --host=0.0.0.0
```

**Service 2: Queue Worker**
```yaml
type: background_worker
name: sheltra-queue
buildCommand: docker build -t sheltra-api .
startCommand: php artisan queue:work --queue=default
```

**Service 3: Scheduler**
```yaml
type: background_worker
name: sheltra-scheduler
buildCommand: docker build -t sheltra-api .
startCommand: /start-scheduler.sh
```

All share:
- Same Docker image
- Same code (same branch)
- Same environment variables
- Same database

### 12.4 Queue Configuration

**Queue Driver** (Render Compatible):
```
// .env
QUEUE_CONNECTION=redis  (recommended)
// or
QUEUE_CONNECTION=database  (fallback)
```

**Why Redis?**
- Fast job processing
- Distributed across services
- Render managed Redis available
- Can pause/resume jobs

**Fallback: Database**
```
// No Redis needed
QUEUE_CONNECTION=database
```

**Result**: Uses DB table as job queue (slower but works).

### 12.5 Scheduler Tasks

Example Laravel scheduler:
```php
// app/Console/Kernel.php
protected function schedule(Schedule $schedule)
{
    $schedule->command('inspiration:quote')
        ->daily();
    
    $schedule->command('insights:generate')
        ->hourly();
    
    $schedule->call(function() {
        Job::cleanOldRecords();
    })->dailyAt('2:00');
}
```

These automatically run if `php artisan schedule:run` runs every minute.

---

## 13. OBSERVABILITY AND DEPLOYMENT HEALTH

### 13.1 Health Checks

**Frontend Health** (Vercel):
- Automatic: Vercel checks deployment status
- Manual: Add Vercel Analytics for monitoring

**Backend Health** (Render):
- Create endpoint: `/api/health`

```php
// routes/api.php
Route::get('/health', function() {
    return response()->json([
        'status' => 'ok',
        'timestamp' => now(),
        'version' => config('app.version'),
        'db' => DB::connection()->getDatabaseName(),
    ]);
});
```

**Render Setup**:
```
Settings → Health Check
URL: /api/health
Interval: 30s
Timeout: 5s
Failure threshold: 3
```

### 13.2 Logging Strategy

**Frontend** (Vercel):
- Browser console (development)
- Error reporting (Sentry, LogRocket)

**Backend** (Render):
```
// config/logging.php
'default' => env('LOG_CHANNEL', 'stack'),

'channels' => [
    'stack' => [
        'driver' => 'stack',
        'channels' => ['single', 'stderr'],
    ],
    'stderr' => [
        'driver' => 'monolog',
        'handler' => StreamHandler::class,
        'with' => ['stream' => 'php://stderr'],
    ],
]
```

**View Logs**:
```
Render Dashboard → Logs tab
→ View real-time application logs
```

### 13.3 Error Reporting

**Frontend**:
```javascript
// Sentry setup
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.VITE_APP_ENV,
});
```

**Backend**:
```php
// config/services.php
'sentry' => [
    'dsn' => env('SENTRY_DSN'),
],

// Set in .env for Render
SENTRY_DSN=https://xxx@sentry.io/xxx
```

### 13.4 Deployment Notifications

**Render Hooks**:
```
Settings → Event Notifications
→ Slack: Deploy started/succeeded/failed
```

**GitHub Actions**:
```yaml
- name: Notify on deployment
  if: failure()
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    text: 'Backend build failed'
    webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

### 13.5 Quick Deployment Checklist

After each production deployment:
```
☐ 1. Check Render health endpoint responds
☐ 2. Check Vercel deployment preview
☐ 3. Verify API returns data
☐ 4. Check database connection working
☐ 5. Monitor logs for errors (5 min)
☐ 6. Run smoke test (login user, access page)
☐ 7. Verify no pending migrations
☐ 8. Check queue worker is processing
☐ 9. Verify third-party integrations (Stripe, Gemini)
☐ 10. Announce deployment to team
```

---

## 14. SECURITY IN CI/CD

### 14.1 Secret Scanning

**GitHub Secret Scanning** (built-in):
- Automatically scans for secrets in code
- Warns if private key pattern detected
- Blocks push if detected

**Enable**:
```
Settings → Security & Analysis → Secret scanning
→ Enable
```

### 14.2 Dependency Vulnerability Scanning

**GitHub Dependabot**:
```
Settings → Code security & analysis
→ Dependabot alerts: Enable
→ Dependabot security updates: Enable
```

**Auto-creates PR** when vulnerable deps found.

**Frontend** (npm audit):
```yaml
- run: npm audit --audit-level=moderate
```

**Backend** (Composer audit):
```yaml
- run: composer audit --locked
```

### 14.3 Least-Privilege Token Usage

**GitHub Token**:
- Default: Automatically provided in `${{ secrets.GITHUB_TOKEN }}`
- Scope: Only current repository
- Duration: Single job only
- Cannot access other repos

**Render Deployment Token** (if using):
- Create in Render dashboard
- Use only for deployment
- Scope-limited to specific service
- Rotate quarterly

**Third-party Actions**:
- Only use official/verified actions
- Pin version: `actions/checkout@v4` (not `@main`)
- Review permissions needed

### 14.4 Avoiding Secret Leakage in Logs

**Never print secrets**:
```yaml
# ❌ BAD
- run: echo ${{ secrets.DB_PASSWORD }}

# ✅ GOOD
- run: echo "Database initialized"
```

**GitHub Actions masking** (automatic):
- Any secret used in step is automatically masked
- Shows as `***` in logs
- Still used by commands

### 14.5 Action Version Pinning

**Recommended**:
```yaml
# ✅ Good: Specific version
- uses: actions/checkout@v4
- uses: actions/setup-node@v4

# ⚠️ Avoid: Latest (unpredictable)
- uses: actions/checkout@latest

# ⚠️ Avoid: Branch (can change)
- uses: actions/checkout@main
```

**Why**: Prevents supply chain attacks, ensures reproducibility.

### 14.6 Repository Secrets Audit

**Recommended**:
```
Settings → Secrets and variables → Actions
→ Review all secrets
→ Rotate old secrets quarterly
→ Delete unused secrets
```

### 14.7 Require Signed Commits (Optional)

**Enable**:
```
Settings → Repository rules → Require commits to be signed
```

**Use**:
```bash
git commit -S -m "Fix auth bug"  # Signs commit with GPG key
```

---

## 15. FINAL RECOMMENDATIONS

### 15.1 Best CI/CD Setup Summary

**Frontend**:
- ✅ GitHub Actions CI (build + lint)
- ✅ Vercel auto-deploy on main branch
- ✅ Vercel preview for every PR
- ✅ Environment variables in Vercel UI

**Backend**:
- ✅ GitHub Actions CI (tests + linting)
- ✅ Render auto-deploy on main branch
- ✅ Render auto-runs migrations
- ✅ Environment variables in Render UI

**Coordination**:
- ✅ Both deploy from Git (no orchestration needed)
- ✅ Preview frontend calls production backend (safe)
- ✅ Production: Frontend + Backend both live simultaneously
- ✅ Rollback: Each platform independent (click button)

### 15.2 Minimum Viable Version (Start Here)

**Week 1**: Setup GitHub Actions CI
```
☑ Checkout code
☑ Test backend (PHPUnit)
☑ Build frontend (npm run build)
☑ Cache dependencies
☑ Require CI to pass on PRs
```

**Week 2**: Setup Vercel Deployment
```
☑ Connect GitHub to Vercel
☑ Configure root: client/
☑ Set VITE_API_URL env var
☑ Deploy main branch
☑ Get preview URLs for PRs
```

**Week 3**: Setup Render Deployment
```
☑ Connect GitHub to Render
☑ Configure root: server/
☑ Set APP_Key, DB variables
☑ Deploy main branch
☑ Run migrations after deploy
☑ Verify health check endpoint
```

**Week 4**: Protect Main Branch
```
☑ Require PR reviews
☑ Require CI tests pass
☑ Block force push
☑ Require up-to-date code
```

### 15.3 Improved Version (Add Later)

**Month 2**:
- ✅ Add frontend linting (Prettier/ESLint)
- ✅ Add backend linting (Pint)
- ✅ Add PHPStan static analysis
- ✅ Add code coverage reporting
- ✅ Add Dependabot security scanning

**Month 3**:
- ✅ Setup separate queue worker service
- ✅ Setup separate scheduler service
- ✅ Add E2E tests (Playwright/Cypress)
- ✅ Add frontend unit tests (Vitest)
- ✅ Add error reporting (Sentry)

**Month 4+**:
- ✅ Setup staging backend environment
- ✅ Add DNS/SSL certificate automation
- ✅ Add marketing website deployment
- ✅ Add monitoring dashboard
- ✅ Add performance testing

### 15.4 Top Mistakes to Avoid

| ❌ Mistake | ⚠️ Impact | ✅ Fix |
|-----------|---------|--------|
| Running full test suite on every trivial PR | Slow feedback | Use path filters |
| Committing .env or secrets | Security breach | Use .env.example + service UIs |
| No branch protection | Broken main | Require CI + reviews |
| Manual deployment steps | Human error | Use Git-native deployment |
| No health checks | Deploy broken code | Add /api/health endpoint |
| Separate frontend/backend deploys manually | Coordination issues | Use Git hooks |
| Single container for web+queue+scheduler | Crashes cascade | Separate services for prod |
| No database migration strategy | Data corruption | Blue-green + pre-run migrations |
| Mixing production/staging secrets | Accidental prod issues | Separate env vars per platform |
| Pinning node/PHP to old versions | Security risks | Update regularly, test first |

---

## Next Steps

1. **Read Section 8** (Workflow YAML files) for exact GitHub Actions code
2. **Read Section 8.4** (render.yaml example) for Render setup
3. **Follow implementation checklist** at end of this document
4. **Commit** all `.github/workflows/` files to Git
5. **Configure** Vercel & Render dashboards (2-3 hours)
6. **Test** with first PR (feature branch)
7. **Merge** to main and verify production deploy

---

