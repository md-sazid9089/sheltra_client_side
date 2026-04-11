# Sheltra CI/CD - QUICK REFERENCE GUIDE

## Quick Command Reference

### Git Branching

```bash
# Start a new feature
git checkout develop
git pull origin develop
git checkout -b feature/feature-name

# Push feature branch
git push origin feature/feature-name
# → Create PR in GitHub UI

# After approved, merge to develop
git checkout develop && git pull
git merge --no-ff feature/feature-name
git push origin develop

# After tested, merge to main (production)
git checkout main && git pull
git merge --no-ff develop
git tag -a v1.2.0 -m "Release v1.2.0"
git push origin main --tags
# → Vercel & Render auto-deploy
```

### Local Development

**Frontend**:
```bash
cd client
npm install          # First time
npm run dev          # Start dev server (http://localhost:5173)
npm run build        # Build for production
npm run preview      # Preview production build locally
```

**Backend**:
```bash
cd server
composer install     # First time
php artisan serve    # Start web server (http://localhost:8000)
php artisan test     # Run tests
php artisan migrate  # Run migrations
php artisan tinker   # Debug shell
```

### Testing Locally

```bash
# Frontend - build verification
cd client && npm run build && npm run preview

# Backend - run tests
cd server && php artisan test

# Backend - check code style
vendor/bin/pint --test

# Backend - static analysis
vendor/bin/phpstan analyse app --level=4
```

### Viewing Logs

**GitHub Actions**:
1. Go to Repository → **Actions** tab
2. Click on workflow run
3. Click on job (e.g., "frontend-ci")
4. Expand steps to see logs

**Vercel**:
1. Dashboard → project → **Deployments**
2. Click deployment
3. Click **"Logs"** tab

**Render**:
1. Dashboard → service → **Logs** tab
2. See real-time output

### Troubleshooting Common Issues

**Frontend build fails locally**:
```bash
cd client
rm -rf node_modules package-lock.json
npm ci                    # Clean install
npm run build             # Build again
```

**Backend tests fail**:
```bash
cd server
php artisan key:generate --env=testing
php artisan migrate --database=sqlite --env=testing
vendor/bin/phpunit --testdox
```

**Composer lock conflicts**:
```bash
cd server
composer install --prefer-dist
git add composer.lock
git commit -m "Update composer.lock"
```

---

## CI/CD Status Checks

### Check GitHub Actions Status

```bash
# In terminal:
curl -s https://api.github.com/repos/YOUR-ORG/sheltra_client_side/actions/runs \
  -H "Authorization: token YOUR_GITHUB_TOKEN" | grep -E '"status"|"conclusion"'
```

### Check Vercel Deployment

```bash
# Latest deployment status
curl https://api.vercel.com/v6/deployments?limit=1 \
  -H "Authorization: Bearer YOUR_VERCEL_TOKEN"
```

### Check Render Service

```bash
# Health endpoint
curl https://sheltra-api.onrender.com/api/health
```

---

## Environment Variables Defaults

### .env Local Development

```bash
# Quick copy for local development:
APP_ENV=local
APP_DEBUG=true
APP_KEY=base64:YOUR_APP_KEY_HERE
DB_DATABASE=sheltra_dev
DB_USERNAME=root
DB_PASSWORD=
CACHE_DRIVER=array
QUEUE_CONNECTION=sync
MAIL_DRIVER=log
```

### .env.testing (CI Auto-generated)

```bash
APP_ENV=testing
APP_DEBUG=true
DB_CONNECTION=sqlite
DB_DATABASE=:memory:
CACHE_DRIVER=array
QUEUE_CONNECTION=sync
```

---

## Deployment Checklist

### Before Deploying to Production

```bash
# 1. Verify local build works
npm run build      # Frontend
vendor/bin/phpunit # Backend

# 2. All tests pass on CI
# (Check GitHub Actions tab)

# 3. Code review approved
# (Check PR status)

# 4. Create release branch
git checkout -b release/v1.2.0
```

### After Production Deployment

```bash
# 1. Check deployments live
curl https://api.sheltra.app/api/health
curl https://sheltra.app

# 2. Monitor logs (first 5 minutes)
# Vercel: Dashboard → Logs
# Render: Dashboard → Logs

# 3. Run smoke tests
# - Login as test user
# - Create a record
# - Verify payment works
# - Check email sending

# 4. Announce to team
# (Slack/Teams message)
```

---

## Critical Commands (Use with Caution)

### Delete Branch

```bash
# Local
git branch -d feature/name

# Remote
git push origin --delete feature/name
```

### Force Push (NEVER on main!)

```bash
# ONLY if you made mistake on feature branch
git push -f origin feature/name
# NEVER DO: git push -f origin main
```

### Revert Deployment

```bash
# Render: Click "Previous Deployment" → Accept
# Vercel: Deployments tab → select old → "Redeploy"
# Or: Manual: git revert COMMIT_HASH && git push
```

### Clean Database (DEVELOPMENT ONLY)

```bash
# Warning: Deletes all data!
php artisan migrate:fresh --seed  # Local only
```

---

## Environment-Specific URLs

| Environment | Frontend | Backend | API |
|-----------|----------|---------|-----|
| **Local** | http://localhost:5173 | http://localhost:8000 | http://localhost:8000/api |
| **Preview** | https://sheltra-pr-xxx.vercel.app | Production API | https://api.sheltra.app/api |
| **Staging** | (not set up yet) | (not set up yet) | (not set up yet) |
| **Production** | https://sheltra.app | https://api.sheltra.app | https://api.sheltra.app/api |

---

## Essential Files

| File | Purpose | Location |
|------|---------|----------|
| **ci.yml** | Main CI workflow | `.github/workflows/ci.yml` |
| **frontend-ci.yml** | Frontend CI (alternative) | `.github/workflows/frontend-ci.yml` |
| **backend-ci.yml** | Backend CI (alternative) | `.github/workflows/backend-ci.yml` |
| **render.yaml** | Render deployment config | `render.yaml` (root) |
| **vercel.json** | Vercel config (optional) | `vercel.json` (root) |
| **.env.example** | Environment template | `.env.example` |
| **.gitignore** | Files not tracked | `.gitignore` |

---

## Important Secrets (Never Log!)

```
❌ DO NOT:
- Print APP_KEY to console
- Log STRIPE_SECRET_KEY
- Echo database passwords
- Display GEMINI_API_KEY in code
- Store in version control

✅ DO:
- Use environment variables
- Store in service dashboards (Vercel/Render)
- Rotate quarterly
- Use different keys for test/prod
- Audit access regularly
```

---

## Monitoring & Alerting

### Health Checks

```bash
# Test backend health
curl -X GET https://api.sheltra.app/api/health

# Response should be:
# {"status":"ok","timestamp":"2026-04-12T...","db":"sheltra_prod","version":"1.0.0"}
```

### Error Tracking

- **Frontend errors**: Check browser DevTools Console or Sentry dashboard
- **Backend errors**: View Render logs or Laravel error log
- **Database errors**: Check database logs or Render metrics

### Performance Monitoring

- **Frontend**: Vercel Analytics tab (Core Web Vitals)
- **Backend**: Render Metrics tab (CPU, Memory, Network)
- **Database**: Database provider dashboard

---

## Rollback Scenarios

### Frontend Issues

1. **Identify problem**: Check Vercel logs or browser console
2. **Find last good deployment**: Deployments tab
3. **Revert**: Click past deployment → "Redeploy"
4. **Alternative**: `git revert COMMIT` and push

### Backend Issues

1. **Identify problem**: Check Render logs
2. **Find last good deployment**: Events tab
3. **Rollback**: Click "Rollback to..." button (if available)
4. **Alternative**: `git revert COMMIT` and push

### Database Issues

1. **Check migrations**: `php artisan migrate:status`
2. **Rollback migration**: `php artisan migrate:rollback --step=1`
3. **Re-run**: `php artisan migrate`

---

## GitFlow Visualization

```
          feature/user-auth
         /
main ----o-----o-----o---- (production)
          \           \
           o-----------o---- develop (staging)
            \
             feature/payments
```

**When to use each branch:**
- `feature/*` → Work in progress, merge to develop
- `develop` → Integration, merge to main for release
- `main` → Production-ready, auto-deploys

---

## Common Error Messages

### "CI failed" in PR

**Check**:
1. Frontend build error? See "Build failed" log
2. Backend test failure? See "Test failed" output
3. Syntax error? Check file that changed

**Fix**:
1. Make fix locally
2. Test locally first
3. Commit and push
4. CI runs again automatically

### "Merge blocked: status checks failed"

**Reason**: CI tests didn't pass

**Fix**:
1. Go to PR Details
2. See which checks failed
3. Click "Details" on failed check
4. Fix issue and commit
5. CI retries automatically

### Vercel "Build Error"

Check `vercel.json` or build command. Common causes:
- Missing `VITE_*` env var
- npm ci failure (lock file issue)
- Build directory wrong

### Render "Deployment Failed"

Check logs. Common causes:
- Database connection failed
- Migration syntax error
- Environment variable missing
- Dockerfile not found

---

## Quick Debug Tips

### Frontend Issues

```javascript
// Check API connection
fetch('https://api.sheltra.app/api/health')
  .then(r => r.json())
  .then(console.log)
  .catch(console.error)
```

### Backend Issues

```php
// Tinker shell
php artisan tinker

# Check database
>>> DB::connection()->getPdo()
>>> User::count()
>>> Cache::get('key-name')
```

### Check GitHub Secrets

```bash
# List secrets (names only, not values)
curl -s https://api.github.com/repos/ORG/REPO/actions/secrets \
  -H "Authorization: token TOKEN" | grep '"name"'
```

---

## Useful Services & Tools

| Tool | Purpose | URL |
|------|---------|-----|
| GitHub | Source control | github.com/sheltra_client_side |
| Vercel | Frontend deploy | vercel.com/dashboard |
| Render | Backend deploy | dashboard.render.com |
| Stripe | Payments | dashboard.stripe.com |
| Gemini | AI | aistudio.google.com |
| SendGrid/Mailtrap | Email | mailtrap.io |
| Sentry | Error tracking | sentry.io |
| DataDog | Monitoring | datadoghq.com |

---

## Team Communication

### Deployment Notifications

```
✅ Deployment Successful
- Frontend: Vercel v1.2.0
- Backend: Render v1.2.0
- Database: Migrations applied
- Health: All checks passing
- Status: Live (2026-04-12 14:30 UTC)
  Deployed by: @developer-name
```

### Incident Response

```
🚨 Production Issue
- Issue: API returning 500 errors
- Time: 2026-04-12 14:35 UTC
- Impact: Affecting all users
- Status: Investigating
- Action: Rolling back deployment
```

---

## Additional Resources

- [CI/CD Architecture Guide](CI-CD-ARCHITECTURE.md) - Detailed explanations
- [Implementation Checklist](CI-CD-IMPLEMENTATION-CHECKLIST.md) - Step-by-step setup
- [Dashboard Configuration](CI-CD-DASHBOARD-SETUP.md) - Platform setup
- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [Vercel Docs](https://vercel.com/docs)
- [Render Docs](https://render.com/docs)

---

## Last Updated

April 12, 2026

## Questions?

Refer to the main documentation files or ask the DevOps team.

