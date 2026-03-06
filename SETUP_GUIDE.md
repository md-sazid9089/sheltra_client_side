# Sheltra Full-Stack Setup Guide

## 🚀 Prerequisites

- PHP >= 7.3 or 8.0
- Composer
- MySQL 5.7+
- Node.js >= 16.x
- npm or yarn

## 📁 Project Structure

```
sheltra_client_side/
├── client/          # React frontend (Vite)
├── server/          # Laravel backend
└── database/        # Database migrations reference
```

---

## ⚙️ Backend Setup (Laravel)

### 1. Navigate to Server Directory

```bash
cd server
```

### 2. Install Dependencies

```bash
composer install
```

### 3. Configure Environment

```bash
cp .env.example .env
```

The `.env.example` already includes correct configuration:
- **APP_URL**: http://localhost
- **FRONTEND_URL**: http://localhost:5173
- **DB_DATABASE**: sheltra_db
- **DB_USERNAME**: root
- **DB_PASSWORD**: (leave empty for default XAMPP/WAMP)

### 4. Generate Application Key

```bash
php artisan key:generate
```

### 5. Create Database

Create the MySQL database manually:

```sql
CREATE DATABASE sheltra_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Or use phpMyAdmin/MySQL Workbench to create `sheltra_db`.

### 6. Run Migrations

```bash
php artisan migrate
```

This creates all required tables:
- users
- refugee_profiles
- ngo_profiles
- employer_profiles
- skills
- refugee_skills
- jobs
- verifications
- case_notes
- placements
- audit_logs
- personal_access_tokens (Sanctum)

### 7. Seed Test Data

```bash
php artisan db:seed
```

This creates test users:

| Email                   | Password     | Role     |
|-------------------------|--------------|----------|
| admin@sheltra.test      | password123  | admin    |
| refugee@sheltra.test    | password123  | refugee  |
| ngo@sheltra.test        | password123  | ngo      |
| employer@sheltra.test   | password123  | employer |

### 8. Clear Laravel Cache (Optional)

```bash
php artisan config:clear
php artisan cache:clear
php artisan route:clear
```

### 9. Start Backend Server

```bash
php artisan serve
```

Backend runs at: **http://localhost:8000**

---

## 🎨 Frontend Setup (React + Vite)

### 1. Navigate to Client Directory

```bash
cd client
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

Create `.env` file:

```bash
cp .env.example .env
```

The `.env` should contain:

```env
VITE_API_URL=http://localhost:8000/api
VITE_APP_ENV=development
```

### 4. Start Development Server

```bash
npm run dev
```

Frontend runs at: **http://localhost:5173**

---

## 🔐 Authentication Flow (Sanctum Token-Based)

### 1. Register User

**Endpoint**: `POST /api/auth/register`

**Request**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "password_confirmation": "password123",
  "role": "refugee"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Registration successful. Welcome to Sheltra!",
  "token": "1|abcdef123456...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "refugee"
  }
}
```

### 2. Login

**Endpoint**: `POST /api/auth/login`

**Request**:
```json
{
  "email": "refugee@sheltra.test",
  "password": "password123"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Login successful",
  "token": "2|xyz789...",
  "user": {
    "id": 2,
    "name": "Ahmed Hassan",
    "email": "refugee@sheltra.test",
    "role": "refugee"
  }
}
```

### 3. Access Protected Routes

Include the token in the Authorization header:

```
Authorization: Bearer 2|xyz789...
```

### 4. Get Current User

**Endpoint**: `GET /api/auth/me`

**Headers**: 
```
Authorization: Bearer {token}
```

**Response**:
```json
{
  "success": true,
  "user": {
    "id": 2,
    "name": "Ahmed Hassan",
    "email": "refugee@sheltra.test",
    "role": "refugee"
  }
}
```

### 5. Logout

**Endpoint**: `POST /api/auth/logout`

**Headers**: 
```
Authorization: Bearer {token}
```

**Response**:
```json
{
  "success": true,
  "message": "Logged out successfully."
}
```

---

## 📡 API Routes Reference

### Authentication Routes
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and get token
- `POST /api/auth/logout` - Logout (requires auth)
- `GET /api/auth/me` - Get current user (requires auth)

### Refugee Routes (requires `refugee` role)
- `GET /api/refugee/profile` - Get refugee profile
- `POST /api/refugee/profile` - Create/update profile
- `PUT /api/refugee/profile` - Update profile
- `GET /api/refugee/opportunities` - Get matched jobs
- `GET /api/refugee/verification-status` - Check verification status
- `POST /api/refugee/skills` - Update skills

### NGO Routes (requires `ngo` role)
- `GET /api/ngo/cases` - Get all cases
- `GET /api/ngo/cases/{caseId}` - Get case details
- `POST /api/ngo/cases/{caseId}/verify/{refugeeId}` - Verify refugee
- `POST /api/ngo/cases/{caseId}/notes` - Add case note
- `GET /api/ngo/cases/{caseId}/notes` - Get case notes
- `GET /api/ngo/metrics` - Get NGO metrics

### Employer Routes (requires `employer` role)
- `GET /api/employer/profile` - Get employer profile
- `POST /api/employer/profile` - Create/update profile
- `PUT /api/employer/profile` - Update profile
- `GET /api/employer/jobs` - Get posted jobs
- `POST /api/employer/jobs` - Create new job
- `GET /api/employer/talent` - Browse verified refugees
- `POST /api/employer/feedback/{refugeeId}` - Submit feedback
- `GET /api/employer/applications` - Get job applications
- `GET /api/employer/metrics` - Get employer metrics

### Admin Routes (requires `admin` role)
- `GET /api/admin/users` - Get all users
- `GET /api/admin/ngos` - Get all NGOs
- `GET /api/admin/audit-logs` - Get audit logs
- `GET /api/admin/impact-metrics` - Get platform metrics
- `POST /api/admin/users/{userId}/suspend` - Suspend user
- `POST /api/admin/users/{userId}/reactivate` - Reactivate user
- `GET /api/admin/analytics` - Get analytics

---

## ✅ Verification Checklist

### Backend ✓
- [x] .env.example configured with correct settings
- [x] Database migrations exist for all tables
- [x] Sanctum authentication configured
- [x] User model uses `HasApiTokens` trait
- [x] Auth controllers return tokens (not sessions)
- [x] All routes protected with `auth:sanctum` middleware
- [x] Role-based access control implemented
- [x] CORS allows http://localhost:5173
- [x] Test users seeded with password: `password123`
- [x] JSON error responses configured

### Frontend ✓
- [x] .env.example created with VITE_API_URL
- [x] Axios configured with Bearer token auth
- [x] API calls use http://localhost:8000/api
- [x] Token stored and attached to requests
- [x] 401 errors redirect to login

### Database ✓
- [x] sheltra_db database
- [x] All migrations valid
- [x] Foreign keys properly configured
- [x] Seeders create test data
- [x] personal_access_tokens table for Sanctum

---

## 🧪 Testing the Full Flow

### Test Sequence

1. **Start Backend**
   ```bash
   cd server
   php artisan serve
   ```

2. **Start Frontend** (in new terminal)
   ```bash
   cd client
   npm run dev
   ```

3. **Open Browser**: http://localhost:5173

4. **Login** with test credentials:
   - Email: `refugee@sheltra.test`
   - Password: `password123`

5. **Verify Token** is stored in localStorage

6. **Access Protected Routes**:
   - Refugee: `/refugee/profile`
   - NGO: `/ngo/cases`
   - Employer: `/employer/jobs`
   - Admin: `/admin/dashboard`

---

## 🐛 Troubleshooting

### Backend Issues

**Database Connection Error**:
```bash
# Check MySQL is running
# Verify DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD in .env
php artisan config:clear
```

**Migration Errors**:
```bash
# Drop all tables and re-migrate
php artisan migrate:fresh --seed
```

**Token Not Working**:
```bash
# Clear caches
php artisan cache:clear
php artisan config:clear
php artisan route:clear
```

### Frontend Issues

**CORS Error**:
- Ensure backend CORS allows `http://localhost:5173`
- Check `server/config/cors.php`

**401 Unauthorized**:
- Verify token is saved in localStorage
- Check Authorization header includes `Bearer {token}`
- Token might be expired or invalid - login again

**API Not Found (404)**:
- Check VITE_API_URL is `http://localhost:8000/api`
- Verify backend is running on port 8000

---

## 📚 Database Schema Summary

### Core Tables
- **users**: All platform users (refugee, ngo, employer, admin)
- **refugee_profiles**: Refugee information and verification status
- **ngo_profiles**: NGO organization details
- **employer_profiles**: Employer company information
- **skills**: Master skills list
- **refugee_skills**: Skills assigned to refugees
- **jobs**: Job postings by employers
- **verifications**: NGO verification records
- **case_notes**: NGO case management notes
- **placements**: Job placement records
- **audit_logs**: System activity tracking
- **personal_access_tokens**: Sanctum API tokens

---

## 🎉 Success Criteria

Your setup is complete when:

✅ Backend runs on http://localhost:8000  
✅ Frontend runs on http://localhost:5173  
✅ Can register new user and receive token  
✅ Can login with test user and receive token  
✅ Can access `/api/auth/me` with token  
✅ Can create refugee profile  
✅ NGO can verify refugee  
✅ Employer can create jobs  
✅ Refugee can see opportunities  
✅ Admin can view metrics  

---

## 🔗 Quick Command Reference

### Backend Commands
```bash
# Full setup from scratch
cd server
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan db:seed
php artisan serve

# Reset database
php artisan migrate:fresh --seed

# Clear all caches
php artisan optimize:clear
```

### Frontend Commands
```bash
# Setup
cd client
npm install
cp .env.example .env
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 📝 Notes

- **Authentication**: Token-based using Laravel Sanctum
- **API Format**: All responses are JSON
- **Ports**: Backend (8000), Frontend (5173)
- **Database**: MySQL (sheltra_db)
- **Test Password**: All test users use `password123`
- **Token Storage**: Frontend stores token in localStorage
- **Token Header**: `Authorization: Bearer {token}`

---

**System now ready for end-to-end testing! 🚀**
