# 🚀 Sheltra CI/CD Pipeline Documentation

## Overview

This document explains the complete CI/CD setup for the Sheltra project. The CI/CD pipeline is implemented using **GitHub Actions** and provides automated testing, building, and deployment.

---

## 📁 CI/CD Files Location

All CI/CD configuration files are located in:
```
.github/workflows/
├── ci.yml                 # Main CI pipeline (linting, testing, building)
├── frontend-ci.yml        # Frontend-specific tests and builds
├── backend-ci.yml         # Backend-specific tests and builds
├── docker-build.yml       # Docker image building and registry push
└── deploy.yml             # Production deployment pipeline
```

---

## 📊 Pipeline Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    GitHub Actions CI/CD                      │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1️⃣ CODE QUALITY CHECK                                      │
│     ├─ Security Scan (Trivy)                               │
│     ├─ Dependency Audit                                    │
│     └─ Code Standards                                      │
│                         ↓                                   │
│  2️⃣ FRONTEND PIPELINE                                      │
│     ├─ Lint (ESLint)                                       │
│     ├─ Format Check (Prettier)                            │
│     ├─ Build Production                                   │
│     └─ Run Tests                                           │
│                         ↓                                   │
│  3️⃣ BACKEND PIPELINE                                       │
│     ├─ Code Analysis (PHPStan)                            │
│     ├─ Database Migrations                                │
│     ├─ Run PHPUnit Tests                                  │
│     └─ Coverage Report                                    │
│                         ↓                                   │
│  4️⃣ DOCKER BUILD                                           │
│     ├─ Build Backend Image                                │
│     ├─ Build Frontend Image                               │
│     └─ Push to Registry                                   │
│                         ↓                                   │
│  5️⃣ DEPLOYMENT                                             │
│     ├─ Create Release                                     │
│     ├─ Generate Artifacts                                 │
│     └─ Send Notifications                                 │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔄 Workflows Explained

### 1. **CI Pipeline** (`ci.yml`)
**Triggers**: Push to `main` or `develop`, Pull Requests

**Jobs**:
- **Code Quality**: Security scanning, vulnerability checks
- **Frontend Lint**: ESLint, Prettier, format validation
- **Backend Lint**: PHPStan, PHP code standards
- **Frontend Build**: Production build with optimizations
- **Backend Test**: PHPUnit tests with database
- **PR Check**: Validates all checks pass before merge

**What It Does**:
✅ Scans for security vulnerabilities
✅ Validates code formatting and style
✅ Runs automated tests
✅ Builds production artifacts
✅ Generates coverage reports

---

### 2. **Frontend CI** (`frontend-ci.yml`)
**Triggers**: Changes in `/client` directory

**Tools**:
- Node.js 16.x & 18.x (matrix testing)
- NPM for package management
- ESLint for code quality
- Vite for building

**Steps**:
1. Setup Node.js environment
2. Install dependencies: `npm ci`
3. Code quality check: `npx eslint`
4. Build production: `npm run build`
5. Upload artifacts to GitHub

**Artifacts**:
- Frontend build in `/dist/`
- Available for 5 days

---

### 3. **Backend CI** (`backend-ci.yml`)
**Triggers**: Changes in `/server` directory

**Services**:
- MySQL 8.0 (for testing database)

**Tools**:
- PHP 8.0
- Composer for dependencies
- PHPUnit for testing
- PHP CodeSniffer for standards

**Steps**:
1. Setup PHP with all extensions
2. Install dependencies: `composer install`
3. Copy `.env.example` to `.env`
4. Generate APP_KEY
5. Run migrations: `php artisan migrate`
6. Seed database: `php artisan db:seed`
7. Run tests: `php artisan test`
8. Generate coverage reports

**Coverage**:
- Uploaded as artifact
- Available in Actions tab

---

### 4. **Docker Build** (`docker-build.yml`)
**Triggers**: 
- Push to `main` branch
- Tags (version releases)
- After successful CI workflows

**Registries Supported**:
- GitHub Container Registry (ghcr.io)

**Images Built**:
```
ghcr.io/yourusername/sheltra/backend:tag
ghcr.io/yourusername/sheltra/frontend:tag
```

**Tagging Strategy**:
- `latest` - Latest main branch
- `main` - Current main branch
- `develop` - Development branch
- `vX.Y.Z` - Version tags
- `sha-xxxxx` - Git commit hash

---

### 5. **Deployment** (`deploy.yml`)
**Triggers**: 
- Push to `main` branch
- Version tags (`v*`)
- Manual dispatch

**Steps**:
1. Build frontend for production
2. Optimize backend dependencies
3. Create deployment package
4. Generate release notes
5. Send notifications

**Outputs**:
- GitHub Release created
- Deployment artifacts available
- Slack notification (optional)

---

## 📍 Project Code Locations

### Frontend (React + Vite)
```
client/
├── src/
│   ├── components/           # React components
│   │   ├── layout/          # Layout components (AdminLayout, Navbar, etc.)
│   │   ├── nid/             # NID verification components
│   │   ├── routing/         # Protected routes
│   │   └── ui/              # Reusable UI components
│   ├── pages/               # Page components by role
│   │   ├── admin/           # Admin dashboard & pages
│   │   ├── employer/        # Employer pages
│   │   ├── ngo/             # NGO case management
│   │   ├── refugee/         # Refugee dashboard
│   │   ├── public/          # Public pages (Login, Home, etc.)
│   │   └── shared/          # Shared pages (Settings)
│   ├── hooks/               # Custom React hooks (useNIDVerification)
│   ├── lib/                 # Utilities
│   │   ├── api.js           # API client configuration
│   │   ├── cn.js            # Class name utilities
│   │   └── storage.js       # Local storage helpers
│   ├── providers/           # Context providers (AuthProvider)
│   ├── routes/              # Route configuration
│   ├── main.jsx             # Entry point
│   └── index.css             # Global styles
├── package.json             # Dependencies
├── vite.config.js           # Vite configuration
├── tailwind.config.js       # Tailwind CSS config
├── Dockerfile               # Docker configuration
└── nginx.conf               # Nginx web server config
```

### Backend (Laravel 8)
```
server/
├── app/
│   ├── Http/
│   │   ├── Controllers/     # API controllers (UserController, etc.)
│   │   ├── Middleware/      # Authentication & authorization
│   │   ├── Requests/        # Request validation
│   │   └── Kernel.php       # HTTP kernel
│   ├── Models/              # Database models
│   │   ├── User.php
│   │   ├── RefugeeProfile.php
│   │   ├── NGOProfile.php
│   │   ├── EmployerProfile.php
│   │   ├── Skill.php
│   │   ├── Job.php
│   │   └── ... (more models)
│   ├── Services/            # Business logic
│   ├── Providers/           # Service providers
│   └── Exceptions/          # Custom exceptions
├── routes/
│   ├── api.php              # API routes
│   ├── auth.php             # Authentication routes
│   ├── web.php              # Web routes
│   └── console.php          # Console commands
├── database/
│   ├── migrations/          # Database schema files
│   └── seeders/             # Test data seeders
├── tests/
│   ├── Feature/             # Feature tests
│   ├── Unit/                # Unit tests
│   └── TestCase.php         # Base test class
├── config/
│   ├── app.php              # App configuration
│   ├── database.php         # Database config
│   ├── auth.php             # Auth config
│   └── ... (more configs)
├── storage/
│   ├── app/                 # Application files
│   ├── logs/                # Log files
│   └── framework/           # Framework cache
├── composer.json            # PHP dependencies
├── artisan                  # Laravel CLI
├── Dockerfile               # Docker configuration
└── .env.example             # Environment template
```

### Database
```
database/
├── migrations/              # Database migration files
├── seeders/                 # Data seeders
└── / (root files)
├── DATABASE_SETUP.sql       # Complete SQL schema + seed data
└── DATABASE_SETUP_GUIDE.md  # Database setup instructions
```

---

## 🔐 Required GitHub Secrets

Add these secrets to your GitHub repository Settings → Secrets:

```
VITE_API_URL              # Frontend API URL for production
PRODUCTION_API_URL        # Backend URL for production
SLACK_WEBHOOK             # Slack notification webhook (optional)
```

**Note**: Docker Registry authentication uses `GITHUB_TOKEN` automatically.

---

## 📝 Running Workflows Locally

### Test Frontend CI Locally
```bash
cd client
npm ci
npm run build
npx eslint src
```

### Test Backend CI Locally
```bash
cd server
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan db:seed
php artisan test
```

### Test Docker Build Locally
```bash
docker build -t sheltra-backend -f server/Dockerfile ./server
docker build -t sheltra-frontend -f client/Dockerfile ./client
```

---

## 🎯 Workflow Status Badges

Add these to your README.md:

```markdown
[![CI Pipeline](https://github.com/YOUR-USERNAME/sheltra_client_side/actions/workflows/ci.yml/badge.svg)](https://github.com/YOUR-USERNAME/sheltra_client_side/actions/workflows/ci.yml)
[![Frontend CI](https://github.com/YOUR-USERNAME/sheltra_client_side/actions/workflows/frontend-ci.yml/badge.svg)](https://github.com/YOUR-USERNAME/sheltra_client_side/actions/workflows/frontend-ci.yml)
[![Backend CI](https://github.com/YOUR-USERNAME/sheltra_client_side/actions/workflows/backend-ci.yml/badge.svg)](https://github.com/YOUR-USERNAME/sheltra_client_side/actions/workflows/backend-ci.yml)
[![Docker Build](https://github.com/YOUR-USERNAME/sheltra_client_side/actions/workflows/docker-build.yml/badge.svg)](https://github.com/YOUR-USERNAME/sheltra_client_side/actions/workflows/docker-build.yml)
```

---

## 📊 Monitoring Workflows

### View Workflow Runs
1. Go to GitHub repository → **Actions** tab
2. Select workflow from left sidebar
3. Click on a run to see details
4. View logs for each job

### Check Coverage Reports
1. Frontend coverage: Download from `frontend-coverage` artifact
2. Backend coverage: Download from `backend-coverage` artifact

### View Test Results
- PHPUnit results in GitHub Actions logs
- Detailed output in backend-ci workflow

---

## 🚀 Best Practices

### For Developers:
1. **Write tests** for new features
2. **Follow code standards** (ESLint, PHPStan)
3. **Keep commits small** and descriptive
4. **Review CI/CD logs** before merging

### For Admins:
1. **Monitor workflow runs** regularly
2. **Update dependencies** when needed
3. **Review security scans** and fix vulnerabilities
4. **Manage secrets** securely

### Gitflow Strategy:
```
main (production)
  ↑
  └─ Pull Requests (all CI/CD checks required)
       ↑
       └─ develop (staging)
             ↑
             └─ feature/xxx (development)
```

---

## 🐛 Troubleshooting

### Workflow Fails at Dependency Install
```bash
# Clear npm cache locally
npm cache clean --force
# Rebuild composer cache
composer install --no-cache
```

### Database Migration Fails in CI
- Check `.env.example` has correct test database settings
- Verify migrations are in correct order

### Docker Building Takes Too Long
- Docker images are cached automatically
- First build is slower, subsequent builds use cache

### Tests Pass Locally but Fail in CI
- Check PHP/Node version in GH Actions vs locally
- Ensure database state is clean between tests

---

## 📚 Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Laravel Testing Guide](https://laravel.com/docs/8.x/testing)
- [Vite Build Guide](https://vitejs.dev/guide/)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)

---

## 📞 Support

For CI/CD issues, check:
1. GitHub Actions logs
2. Workflow status badges
3. Test coverage reports
4. Error messages in build logs

**Last Updated**: April 2026
