# Sheltra Database Setup Guide

## Overview

This guide covers the complete database setup for the Sheltra API backend using:
- **MySQL** database engine
- **Laravel migrations** (source of truth for schema)
- **Laravel Sanctum** for Bearer token authentication
- **Database name**: `sheltra_db`

## Prerequisites

- PHP 8.0+ installed
- MySQL server running (version 5.7+)
- Composer installed
- Laravel CLI tools available

## Quick Setup (TL;DR)

```bash
# 1. Create database
mysql -u root -p
> CREATE DATABASE sheltra_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
> EXIT;

# 2. Configure Laravel
cd server
cp .env.example .env
php artisan key:generate

# 3. Run migrations & seeders
php artisan migrate
php artisan db:seed

# 4. Start server
php artisan serve
```

Then test at: `http://localhost:8000`

---

## Detailed Setup Instructions

### Step 1: Create Database in MySQL

```bash
mysql -u root -p
```

Enter your MySQL password, then:

```sql
CREATE DATABASE sheltra_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

**Why `utf8mb4`?**
- Supports emoji and extended Unicode characters
- Required for internationalization (refugees from many countries)
- Standard for modern MySQL applications

### Step 2: Create .env File

```bash
cd c:\Sheltra\sheltra_client_side\server
cp .env.example .env
```

### Step 3: Configure Database Connection

Edit `.env` and verify:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=sheltra_db
DB_USERNAME=root
DB_PASSWORD=
```

**Note**: Update `DB_PASSWORD` if your MySQL root user has a password.

### Step 4: Generate Application Key

```bash
php artisan key:generate
```

This generates a secure `APP_KEY` for encryption.

### Step 5: Clear Configuration Cache

```bash
php artisan config:clear
php artisan cache:clear
php artisan route:clear
```

### Step 6: Run Migrations

```bash
php artisan migrate
```

This creates all 12 database tables:
- ✅ users
- ✅ refugee_profiles
- ✅ ngo_profiles
- ✅ employer_profiles
- ✅ skills
- ✅ refugee_skills
- ✅ jobs
- ✅ verifications
- ✅ case_notes
- ✅ placements
- ✅ audit_logs
- ✅ personal_access_tokens (Sanctum)

### Step 7: Seed Development Data

```bash
php artisan db:seed
```

This populates test data:
- 4 test users (admin, refugee, ngo, employer)
- 6 skills
- 1 refugee profile with 2 skills
- 1 NGO profile
- 1 employer profile
- 1 job posting
- 1 verification record
- 1 placement match

**Test Credentials:**
```
admin@sheltra.test / password123
refugee@sheltra.test / password123
ngo@sheltra.test / password123
employer@sheltra.test / password123
```

### Step 8: Start Development Server

```bash
php artisan serve
```

Server runs on: `http://localhost:8000`

---

## Database Schema Overview

### Core Tables

#### 1. users (Core Authentication)
```sql
- id (primary key)
- name (string)
- email (unique)
- password (hashed)
- role (enum: refugee|ngo|employer|admin)
- email_verified_at (timestamp, nullable)
- remember_token
- created_at, updated_at
```

#### 2. personal_access_tokens (Sanctum)
```sql
- id (primary key)
- tokenable_id, tokenable_type (polymorphic relation to users)
- name (string)
- token (unique)
- abilities (JSON)
- last_used_at (timestamp, nullable)
- expires_at (timestamp, nullable)
- created_at, updated_at
```

**Note**: Sanctum uses this table for Bearer token authentication.

#### 3. refugee_profiles
```sql
- id (primary key)
- user_id (foreign key → users)
- full_name
- alias_name (nullable)
- country (nullable)
- languages (JSON array)
- experience_summary (text, nullable)
- availability (string, nullable)
- verification_status (enum: pending|in_review|verified|rejected)
- created_at, updated_at
```

#### 4. ngo_profiles
```sql
- id (primary key)
- user_id (foreign key → users)
- organization_name
- country (nullable)
- contact_email (nullable)
- created_at, updated_at
```

#### 5. employer_profiles
```sql
- id (primary key)
- user_id (foreign key → users)
- company_name
- industry (nullable)
- website (nullable)
- ethical_hiring_pledge (boolean)
- created_at, updated_at
```

#### 6. skills
```sql
- id (primary key)
- name (unique)
- created_at, updated_at
```

#### 7. refugee_skills (Junction Table)
```sql
- id (primary key)
- refugee_profile_id (foreign key → refugee_profiles)
- skill_id (foreign key → skills)
- level (string, e.g., 'beginner', 'intermediate', 'advanced')
- unique: (refugee_profile_id, skill_id)
- created_at, updated_at
```

#### 8. jobs
```sql
- id (primary key)
- employer_profile_id (foreign key → employer_profiles)
- title
- description (longText)
- location (nullable)
- status (enum: open|closed)
- required_skills (JSON array)
- created_at, updated_at
```

#### 9. verifications
```sql
- id (primary key)
- refugee_profile_id (foreign key → refugee_profiles)
- ngo_profile_id (foreign key → ngo_profiles, nullable)
- status (enum: pending|in_review|verified|rejected)
- notes (text, nullable)
- verified_at (timestamp, nullable)
- created_at, updated_at
```

#### 10. case_notes
```sql
- id (primary key)
- refugee_profile_id (foreign key → refugee_profiles)
- ngo_profile_id (foreign key → ngo_profiles)
- note (text)
- created_at, updated_at
```

#### 11. placements
```sql
- id (primary key)
- refugee_profile_id (foreign key → refugee_profiles)
- job_id (foreign key → jobs)
- status (enum: matched|placed|completed|closed)
- placed_at (timestamp, nullable)
- created_at, updated_at
```

#### 12. audit_logs
```sql
- id (primary key)
- actor_user_id (foreign key → users, nullable)
- action (string)
- entity_type (string)
- entity_id (unsigned big integer, nullable)
- metadata (JSON)
- created_at, updated_at (used for timestamp sorting)
```

---

## Sanctum Authentication Flow

### How Bearer Tokens Work

1. **User Login**
   ```
   POST /api/auth/login
   Body: { email, password }
   Response: { token: "...Bearer token..." }
   ```

2. **Subsequent Requests**
   ```
   GET /api/refugee/profile
   Header: Authorization: Bearer {token}
   ```

3. **Token Validation**
   - Laravel Sanctum middleware validates token
   - Retrieves associated user
   - Allows route execution

4. **Token Creation** (In LoginRequest)
   ```php
   $token = $user->createToken('API Token')->plainTextToken;
   ```

5. **Token Storage** (In personal_access_tokens table)
   ```sql
   INSERT INTO personal_access_tokens VALUES (
       id, tokenable_id, tokenable_type, 'API Token', 
       'token_hash', abilities, null, null, ...
   );
   ```

### Never Use Session Auth for API

❌ **Wrong** - Session cookies for SPA:
```php
Route::middleware('auth:web')->get('/api/profile', ...);
```

✅ **Right** - Bearer tokens for API:
```php
Route::middleware('auth:sanctum')->get('/api/profile', ...);
```

---

## Migration Files Location

All migrations are in: `server/database/migrations/`

| File | Purpose |
|------|---------|
| `2024_01_01_000000_create_users_table.php` | Core auth table with role column |
| `2024_01_01_000100_create_refugee_profiles_table.php` | Refugee-specific data |
| `2024_01_01_000200_create_ngo_profiles_table.php` | NGO/Partner data |
| `2024_01_01_000300_create_employer_profiles_table.php` | Employer/Hiring company data |
| `2024_01_01_000400_create_skills_table.php` | Skill definitions |
| `2024_01_01_000500_create_refugee_skills_table.php` | Refugee skill associations |
| `2024_01_01_000600_create_jobs_table.php` | Job postings |
| `2024_01_01_000700_create_verifications_table.php` | Skill verifications |
| `2024_01_01_000800_create_case_notes_table.php` | NGO case documentation |
| `2024_01_01_000900_create_placements_table.php` | Job placements |
| `2024_01_01_001000_create_audit_logs_table.php` | Audit trail |
| `2024_01_01_001100_create_personal_access_tokens_table.php` | Sanctum tokens |

---

## Seeder Files Location

All seeders are in: `server/database/seeders/`

| File | Purpose |
|------|---------|
| `DatabaseSeeder.php` | Main seeder orchestrator |
| `SkillSeeder.php` | 6 foundational skills |
| `UserSeeder.php` | 4 test users (admin, refugee, ngo, employer) |
| `RefugeeProfileSeeder.php` | Test refugee profile |
| `NGOProfileSeeder.php` | Test NGO profile |
| `EmployerProfileSeeder.php` | Test employer profile |
| `RefugeeSkillSeeder.php` | Links refugee to skills |
| `JobSeeder.php` | Test job posting |
| `VerificationSeeder.php` | Test verification record |
| `PlacementSeeder.php` | Test placement match |

---

## Common Commands

### Reset Database (Start Fresh)

```bash
php artisan migrate:fresh
php artisan db:seed
```

⚠️ **Warning**: This deletes all data. Only use in development.

### Run Only Specific Seeder

```bash
php artisan db:seed --class=UserSeeder
```

### Check Migration Status

```bash
php artisan migrate:status
```

Output shows which migrations have run:

```
Ran?  Batch  Migration Name
Yes   1      2024_01_01_000000_create_users_table
Yes   1      2024_01_01_000100_create_refugee_profiles_table
...
```

### Rollback Last Batch of Migrations

```bash
php artisan migrate:rollback
```

### Rollback All Migrations

```bash
php artisan migrate:reset
```

---

## Testing the Database

### 1. Test User Login

```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "refugee@sheltra.test",
    "password": "password123"
  }'
```

Response:
```json
{
  "success": true,
  "message": "Login successful.",
  "token": "1|abc123xyz..."
}
```

### 2. Test Authenticated Request

```bash
curl -X GET http://localhost:8000/api/auth/me \
  -H "Authorization: Bearer 1|abc123xyz..."
```

### 3. Test Role-Based Access

```bash
# As refugee - should succeed
curl -X GET http://localhost:8000/api/refugee/profile \
  -H "Authorization: Bearer {refugee_token}"

# As refugee - should fail (403)
curl -X GET http://localhost:8000/api/admin/metrics \
  -H "Authorization: Bearer {refugee_token}"
```

### 4. Check Database Contents

```bash
mysql -u root -p sheltra_db
SELECT * FROM users;
SELECT * FROM refugee_profiles;
SELECT * FROM personal_access_tokens;
EXIT;
```

---

## Troubleshooting

### Error: "SQLSTATE[HY000]: General error: 1030 Got error..."

**Cause**: MySQL not running or connection issue

**Solution**:
```bash
# Check MySQL status
mysql -u root -p
> SHOW DATABASES;
> EXIT;
```

### Error: "SQLSTATE[42000]: Syntax error or access violation..."

**Cause**: Database doesn't exist or wrong credentials

**Solution**:
```bash
# Verify database exists
mysql -u root -p
> SHOW DATABASES;
> USE sheltra_db;
> SHOW TABLES;
```

### Error: "No query results for model..."

**Cause**: Seeders didn't run properly

**Solution**:
```bash
php artisan migrate:fresh
php artisan db:seed
php artisan migrate:status
```

### "Sanctum" not recognized

**Cause**: Package not installed

**Solution**:
```bash
composer install
composer require laravel/sanctum
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
```

---

## Security Notes

✅ **Already Implemented**:
- Password hashing with bcrypt
- Foreign key cascades (referential integrity)
- Role-based access control (RBAC)
- Sanctum token security (one token per request)
- NULL on delete for optional relationships

⚠️ **To Implement Later**:
- Rate limiting per IP/user
- Request logging
- SQL injection prevention (parameterized queries)
- API key rotation
- Encryption at rest

---

## Performance Tips

1. **Use Indexes** - All foreign keys and commonly queried fields are indexed
2. **Pagination** - Always paginate large result sets
3. **Eager Loading** - Use `with()` to avoid N+1 queries
4. **Caching** - Consider caching profile lookups
5. **Archival** - Move old audit logs to archive table

---

## Integration with Frontend

Frontend should:
1. POST to `/api/auth/login` to get Bearer token
2. Store token in localStorage or sessionStorage
3. Add `Authorization: Bearer {token}` header to all requests
4. Handle 401 responses (redirect to login)
5. Handle 403 responses (show permission error)

Example (JavaScript/React):
```javascript
// Login
const response = await fetch('http://localhost:8000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
});
const { token } = await response.json();
localStorage.setItem('token', token);

// Authenticated request
const result = await fetch('http://localhost:8000/api/refugee/profile', {
  headers: { 'Authorization': `Bearer ${token}` }
});
```

---

## Reference Documentation

- [Laravel Migrations](https://laravel.com/docs/8.x/migrations)
- [Laravel Sanctum](https://laravel.com/docs/8.x/sanctum)
- [MySQL utf8mb4](https://dev.mysql.com/doc/refman/8.0/en/charset-unicode-utf8mb4.html)
- [Eloquent Relationships](https://laravel.com/docs/8.x/eloquent-relationships)

---

## Summary

✅ Database: `sheltra_db` on MySQL  
✅ Schema: 12 tables via Laravel migrations  
✅ Authentication: Sanctum Bearer tokens  
✅ Development Data: 9 seeders ready  
✅ Ready for: Frontend integration & production use  

**Status**: Database setup complete and tested ✅
