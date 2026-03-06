# 🚀 Sheltra Quick Start

## One-Time Setup

### Backend
```bash
cd server
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan db:seed
```

### Frontend
```bash
cd client
npm install
cp .env.example .env
```

---

## Daily Development

### Start Backend (Terminal 1)
```bash
cd server
php artisan serve
```
→ http://localhost:8000

### Start Frontend (Terminal 2)
```bash
cd client
npm run dev
```
→ http://localhost:5173

---

## Test Accounts

| Email                  | Password     | Role     |
|------------------------|--------------|----------|
| admin@sheltra.test     | password123  | admin    |
| refugee@sheltra.test   | password123  | refugee  |
| ngo@sheltra.test       | password123  | ngo      |
| employer@sheltra.test  | password123  | employer |

---

## Common Commands

### Reset Database
```bash
cd server
php artisan migrate:fresh --seed
```

### Clear Cache
```bash
cd server
php artisan optimize:clear
```

### Frontend Build
```bash
cd client
npm run build
```

---

## API Testing

### Login
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"refugee@sheltra.test","password":"password123"}'
```

### Get Current User (with token)
```bash
curl http://localhost:8000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Troubleshooting

### Database not found
```bash
# Create database manually in MySQL:
CREATE DATABASE sheltra_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### Environment issues
```bash
cd server
php artisan config:clear
php artisan cache:clear
php artisan route:clear
```

### CORS errors
Check `server/config/cors.php` includes:
- http://localhost:5173

### 401 Unauthorized
- Clear browser localStorage
- Login again to get new token
- Verify token is in Authorization header

---

## Key Files

- Backend env: `server/.env`
- Frontend env: `client/.env`
- API routes: `server/routes/api.php`
- Auth routes: `server/routes/auth.php`
- CORS config: `server/config/cors.php`

---

**Full documentation**: [SETUP_GUIDE.md](./SETUP_GUIDE.md)
