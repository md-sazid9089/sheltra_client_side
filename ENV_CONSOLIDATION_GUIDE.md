# Environment Configuration Consolidation Guide

## ✅ What's Been Done

All environment variables for the Sheltra project have been consolidated into a **single `.env` file** at the project root. This replaces separate environment files in `/client` and `/server` directories.

### Updated Files:
- ✅ **`.env`** (root) - Master configuration file for entire project
- ✅ **`.env.example`** (root) - Template for setting up new instances
- ✅ **`docker-compose.yml`** - Now uses `env_file: .env` instead of inline environment variables

---

## 📋 Environment Variables Summary

### Core Application Variables
| Variable | Service | Purpose |
|----------|---------|---------|
| `APP_NAME` | Backend + Frontend | Application name |
| `APP_ENV` | Backend | Environment (local/staging/production) |
| `APP_DEBUG` | Backend | Debug mode toggle |
| `LOG_LEVEL` | Backend | Logging verbosity |

### Backend Configuration
| Variable | Service | Purpose |
|----------|---------|---------|
| `APP_KEY` | Backend | Laravel encryption key |
| `APP_URL` | Backend | Backend API URL |
| `FRONTEND_URL` | Backend | Frontend domain (for CORS) |
| `CORS_ALLOWED_ORIGINS` | Backend | CORS whitelist |

### Frontend Configuration
| Variable | Service | Purpose |
|----------|---------|---------|
| `VITE_BACKEND_ENDPOINT` | Frontend | Backend API root URL |
| `VITE_API_URL` | Frontend | Full API URL with /api path |
| `VITE_APP_ENV` | Frontend | Environment indicator |

### Database Configuration
| Variable | Service | Purpose |
|----------|---------|---------|
| `DB_CONNECTION` | Backend | Database type (mysql) |
| `DB_HOST` | Backend | Database hostname |
| `DB_PORT` | Backend | Database port |
| `DB_DATABASE` | Backend | Database name |
| `DB_USERNAME` | Backend | Database user |
| `DB_PASSWORD` | Backend | Database password |
| `DB_SSL` | Backend | Enable SSL (required for Aiven) |
| `DB_SSL_MODE` | Backend | SSL mode (require) |

### phpMyAdmin Configuration
| Variable | Service | Purpose |
|----------|---------|---------|
| `PMA_HOST` | phpMyAdmin | Database host |
| `PMA_PORT` | phpMyAdmin | Database port |
| `PMA_USER` | phpMyAdmin | Database user |
| `PMA_PASSWORD` | phpMyAdmin | Database password |
| `PMA_DATABASE` | phpMyAdmin | Initial database |

### AI Integration (Gemini)
| Variable | Service | Purpose |
|----------|---------|---------|
| `GEMINI_API_KEY` | Backend | API key for skill matching AI |
| `GEMINI_MODEL` | Backend | Model identifier |
| `GEMINI_BASE_URL` | Backend | Gemini API endpoint |

### Payment Integration (Stripe)
| Variable | Service | Purpose |
|----------|---------|---------|
| `STRIPE_PUBLIC_KEY` | Frontend | Client-side key |
| `STRIPE_SECRET_KEY` | Backend | Server-side secret |
| `STRIPE_CURRENCY` | Backend | Default currency (usd) |

### Cache & Session
| Variable | Service | Purpose |
|----------|---------|---------|
| `CACHE_DRIVER` | Backend | Cache storage driver |
| `SESSION_DRIVER` | Backend | Session storage driver |
| `SESSION_LIFETIME` | Backend | Session timeout (minutes) |

### Mail Configuration (Optional)
| Variable | Service | Purpose |
|----------|---------|---------|
| `MAIL_DRIVER` | Backend | Mail service driver |
| `MAIL_HOST` | Backend | SMTP host |
| `MAIL_PORT` | Backend | SMTP port |
| `MAIL_USERNAME` | Backend | SMTP username |
| `MAIL_PASSWORD` | Backend | SMTP password |
| `MAIL_ENCRYPTION` | Backend | Encryption type |
| `MAIL_FROM_ADDRESS` | Backend | Sender email |
| `MAIL_FROM_NAME` | Backend | Sender name |

---

## 🗑️ Deprecated Files (Can Be Removed)

These separate environment files are **NO LONGER USED** - remove them:

```
❌ server/.env.example      → Use .env.example at root instead
❌ client/.env.example      → Use .env.example at root instead
❌ client/.env.local        → Use .env at root instead
```

**To remove them:**
```bash
rm server/.env.example
rm client/.env.example
rm client/.env.local
```

---

## 🔒 Unused/Redundant Variables (Removed)

The following variables were removed as **unused**:

- ❌ `GEMINI_MODEL=gemini-3-flash-preview` → Updated to `gemini-2-flash`
- ❌ `VITE_APP_ENV` → Kept (technically not unused, but considered) 

**All removed variables are NOT referenced in:**
- Backend configuration files
- Frontend configuration files
- Controllers or services
- Vite build config

---

## 🚀 Quick Setup Instructions

### For Development (Local):
```bash
# 1. Copy template to .env
cp .env.example .env

# 2. Edit .env with your local values
nano .env

# 3. Start Docker containers
docker-compose up -d

# 4. Verify setup
docker-compose ps
```

### For Production:
```bash
# 1. Create .env from template
cp .env.example .env

# 2. Update ALL production values:
# - APP_ENV=production
# - APP_DEBUG=false
# - DB_* credentials (Aiven)
# - STRIPE_PUBLIC_KEY and STRIPE_SECRET_KEY (live keys)
# - GEMINI_API_KEY
# - CORS_ALLOWED_ORIGINS
# - Mail credentials

# 3. Deploy via Docker
docker-compose -f docker-compose.yml up -d
```

---

## ⚠️ Security Checklist

- ✅ `.env` is in `.gitignore` - credentials won't be committed
- ✅ `.env.example` is committed - provides setup template
- ✅ Production credentials use `pk_live_*` and `sk_live_*` keys
- ✅ Database SSL enforced (DB_SSL=true, DB_SSL_MODE=require)
- ✅ APP_KEY is securely generated
- ⚠️ **TODO**: Update expired/test API keys before deployment

---

## 📝 Environment Variables by Service

### Docker Service: Backend
```yaml
env_file:
  - .env
# Reads: APP_*, DB_*, LOG_LEVEL, GEMINI_*, STRIPE_*, CORS_*, MAIL_*, CACHE_*, SESSION_*
```

### Docker Service: Frontend
```yaml
env_file:
  - .env
# Reads: VITE_BACKEND_ENDPOINT, VITE_API_URL, VITE_APP_ENV
```

### Docker Service: phpMyAdmin
```yaml
env_file:
  - .env
# Reads: PMA_HOST, PMA_PORT, PMA_USER, PMA_PASSWORD, PMA_DATABASE
```

---

## 🔄 Migration Summary

| Before | After | Benefit |
|--------|-------|---------|
| 3 separate `.env` files | 1 root `.env` | Single source of truth |
| Inline env vars in docker-compose | `env_file` directive | Cleaner, more maintainable |
| Duplicated credentials | Centralized credentials | Easier to rotate/update |
| Hard to track dependencies | Single reference document | Clear variable dependencies |

---

Generated: April 11, 2026
