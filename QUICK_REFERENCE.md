# Sheltra Database Setup - Quick Reference Card

## One-Minute Setup

```bash
# 1. Create database
mysql -u root -p
CREATE DATABASE sheltra_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT

# 2. Setup Laravel
cd server && cp .env.example .env && php artisan key:generate

# 3. Migrate & seed
php artisan migrate && php artisan db:seed

# 4. Run
php artisan serve
```

**URL**: http://localhost:8000/api

---

## Test Credentials

```
Email                  | Password    | Role
-----------------------|-------------|----------
admin@sheltra.test     | password123 | admin
refugee@sheltra.test   | password123 | refugee
ngo@sheltra.test       | password123 | ngo
employer@sheltra.test  | password123 | employer
```

---

## Files Created

### Migrations (12)
| File | Table |
|------|-------|
| 2024_01_01_000000 | users |
| 2024_01_01_000100 | refugee_profiles |
| 2024_01_01_000200 | ngo_profiles |
| 2024_01_01_000300 | employer_profiles |
| 2024_01_01_000400 | skills |
| 2024_01_01_000500 | refugee_skills |
| 2024_01_01_000600 | jobs |
| 2024_01_01_000700 | verifications |
| 2024_01_01_000800 | case_notes |
| 2024_01_01_000900 | placements |
| 2024_01_01_001000 | audit_logs |
| 2024_01_01_001100 | personal_access_tokens |

### Seeders (9)
1. SkillSeeder (6 skills)
2. UserSeeder (4 users)
3. RefugeeProfileSeeder
4. NGOProfileSeeder
5. EmployerProfileSeeder
6. RefugeeSkillSeeder (2 links)
7. JobSeeder (1 job)
8. VerificationSeeder (1 verification)
9. PlacementSeeder (1 placement)

---

## Quick Test

```bash
# Login
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"refugee@sheltra.test","password":"password123"}'

# Copy token, then:

# Get user info
curl -H "Authorization: Bearer 1|xxxxx" \
  http://localhost:8000/api/auth/me

# Get refugee profile
curl -H "Authorization: Bearer 1|xxxxx" \
  http://localhost:8000/api/refugee/profile
```

---

## .env Values (Critical)

| Key | Value |
|-----|-------|
| APP_NAME | Sheltra |
| APP_ENV | local |
| DB_CONNECTION | mysql |
| DB_DATABASE | **sheltra_db** |
| DB_HOST | 127.0.0.1 |
| FRONTEND_URL | http://localhost:5173 |

---

## Database Schema (Quick View)

```
users (4 test records)
  ├─ refugee_profiles (1)
  │   └─ refugee_skills (2 links to skills)
  ├─ ngo_profiles (1)
  │   ├─ case_notes
  │   └─ verifications
  ├─ employer_profiles (1)
  │   └─ jobs (1)
  │       └─ placements (1)
  └─ personal_access_tokens (Sanctum tokens)

skills (6 records)
  └─ Teaching, Carpentry, Welding, Plumbing, Nursing, Customer Service

audit_logs (empty, populated on actions)
```

---

## Key Features Implemented

✅ MySQL database (sheltra_db)  
✅ 12 Laravel migrations  
✅ 9 Laravel seeders with test data  
✅ Sanctum Bearer token authentication  
✅ All 4 roles (refugee, ngo, employer, admin)  
✅ Foreign key constraints with cascades  
✅ Unique constraints on email & skill pairs  
✅ Full referential integrity  
✅ JSON fields for flexible data  
✅ Timestamps on all tables  

---

## Sanctum Auth Flow

```
1. POST /api/auth/login
   Request:  { email, password }
   Response: { token: "1|xxxxx" }
   ↓
2. Sanctum creates personal_access_tokens entry
   ↓
3. POST/GET /api/protected-route
   Header: Authorization: Bearer 1|xxxxx
   ↓
4. Middleware validates token
   ↓
5. Route executes with authenticated user
```

---

## Common Issues & Fixes

| Issue | Fix |
|-------|-----|
| "SQLSTATE [HY000]..." | Start MySQL: `mysql -u root -p` |
| "No query results..." | Run: `php artisan db:seed` |
| "Class not found..." | Run: `composer install` |
| "Token not working..." | Check Bearer format: `Authorization: Bearer 1\|xxxxx` |

---

## Documentation Files

1. **DATABASE_SETUP_GUIDE.md** (comprehensive)
   - Full schema documentation
   - All migration/seeder details
   - Troubleshooting & advanced topics

2. **DATABASE_SETUP_IMPLEMENTATION.md** (practical)
   - Setup checklist
   - Copy-paste commands
   - Smoke test scenarios
   - Validation checklist

3. **FINAL_DATABASE_SUMMARY.md** (executive)
   - What was done
   - Complete diagram
   - All decisions documented

---

## Status: ✅ READY

Database setup complete. All migrations and seeders created.  
Use `php artisan migrate && php artisan serve` to start.

---

**Date**: March 7, 2026  
**Project**: Sheltra  
**Component**: Database (MySQL + Sanctum)  
**Status**: COMPLETE ✅
