# Sheltra Backend Authentication Architecture - Comprehensive Analysis

**Date:** March 8, 2026  
**Backend Framework:** Laravel 8+  
**Authentication Type:** Hybrid Session + Sanctum Token-based  
**Status:** Session-based primary, Sanctum configured for future enhancement

---

## Table of Contents
1. [Authentication Mechanism Overview](#authentication-mechanism-overview)
2. [User Model & Database](#user-model--database)
3. [Authentication Controllers](#authentication-controllers)
4. [Route Structure](#route-structure)
5. [Middleware Stack](#middleware-stack)
6. [Login Endpoint Flow](#login-endpoint-flow)
7. [Signup Endpoint Flow](#signup-endpoint-flow)
8. [Validation Rules](#validation-rules)
9. [Rate Limiting](#rate-limiting)
10. [Password Reset Flow](#password-reset-flow)
11. [Email Verification Flow](#email-verification-flow)
12. [Role-Based Access Control](#role-based-access-control)
13. [Session Management](#session-management)
14. [API Response Format](#api-response-format)

---

## Authentication Mechanism Overview

### Architecture Type
The Sheltra platform uses a **hybrid authentication system**:
- **Primary:** Laravel Session-based authentication (file driver)
- **Alternative:** Laravel Sanctum tokens (configured but not actively used)
- **Guards:** 
  - `web` - Session guard for browser/SPA requests
  - `sanctum` - Stateless token-based guard (future enhancement)

### Key Configuration
- **Config File:** `server/config/auth.php`
- **Default Guard:** `web` (session-based)
- **User Provider:** Eloquent ORM using single User model
- **Session Driver:** `file` (configurable via env)
- **Session Lifetime:** 120 minutes (default, configurable)

---

## User Model & Database

### User Model Location
`server/app/Models/User.php`

### User Properties
```php
@property int $id                          // Primary key
@property string $name                     // User's full name
@property string $email                    // Unique email address
@property string|null $role                // Role: refugee, ngo, employer, admin
@property string $password                 // Bcrypt hashed password
@property Carbon|null $email_verified_at   // Email verification timestamp
@property string|null $remember_token      // Remember token for persistent login
@property Carbon $created_at               // Account creation timestamp
@property Carbon $updated_at               // Last update timestamp
```

### Mass Assignable Fields
```php
protected $fillable = [
    'name',
    'email',
    'password',
    'role',
];
```

### Hidden Attributes (Never serialized in responses)
```php
protected $hidden = [
    'password',
    'remember_token',
];
```

### Type Casts
```php
protected $casts = [
    'email_verified_at' => 'datetime',
    'password' => 'hashed',  // Auto-hashes on set, auto-verifies on check
];
```

### Role-Based Helper Methods
```php
public function getRole(): string           // Get role, defaults to 'refugee'
public function isRefugee(): bool           // Check if refugee
public function isNGO(): bool               // Check if NGO partner
public function isEmployer(): bool          // Check if employer
public function isAdmin(): bool             // Check if admin
```

### Database Relationships
- Uses single `users` table with `role` column for differentiation
- No separate user type tables (all roles in one table)
- Supported roles: `refugee`, `ngo`, `employer`, `admin`

---

## Authentication Controllers

### Location
`server/app/Http/Controllers/Auth/`

### Controller: RegisteredUserController

**File:** `RegisteredUserController.php`  
**Method:** `POST /api/auth/register`  
**Middleware:** `guest`

#### Request Structure
```json
{
  "name": "string (required, max 255)",
  "email": "string (required, unique, valid email)",
  "password": "string (required, confirmed, meets security rules)",
  "password_confirmation": "string (must match password)",
  "role": "string (required, one of: refugee|ngo|employer)"
}
```

#### Response (Success - 201)
```json
{
  "success": true,
  "message": "Registration successful. Welcome to Sheltra!",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "refugee"
  }
}
```

#### Response (Failure - 422 Validation Error)
```json
{
  "message": "The given data was invalid.",
  "errors": {
    "email": ["This email is already registered. Please log in or use a different email."],
    "password": ["Passwords do not match."],
    "role": ["Invalid role selected."]
  }
}
```

#### Post-Registration Actions
1. Validates input using custom validation rules
2. Creates new User with bcrypt-hashed password
3. Fires `Registered` event (triggers email verification notification)
4. Auto-logs in user (creates session)
5. Returns user data with 201 status

#### Validation Rules
| Field | Rules | Custom Message |
|-------|-------|---|
| name | required, string, max:255 | Full name is required. |
| email | required, string, email, max:255, unique:users | Email must be valid and unique |
| password | required, confirmed, Password::defaults() | Must match confirmation |
| role | required, string, in:refugee,ngo,employer | Must select valid role |

---

### Controller: AuthenticatedSessionController

**File:** `AuthenticatedSessionController.php`

#### Endpoint 1: Login
**Route:** `POST /api/auth/login`  
**Middleware:** `guest`

##### Request Structure
```json
{
  "email": "string (required, valid email)",
  "password": "string (required)",
  "remember": "boolean (optional, default false)"
}
```

##### Response (Success - 200)
```json
{
  "success": true,
  "message": "Login successful.",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "refugee"
  }
}
```

##### Response (Failure - 422 Validation Error)
```json
{
  "message": "The given data was invalid.",
  "errors": {
    "email": ["Invalid email or password. Please try again."]
  }
}
```

##### Login Flow
1. Validates email and password format
2. Calls `LoginRequest::authenticate()` with rate limiting check
3. Attempts authentication with `Auth::attempt($credentials, $remember)`
4. On success: regenerates session ID (prevents session fixation attacks)
5. Returns authenticated user with role

##### Authentication Method
- Uses Laravel's built-in `Auth::attempt()` method
- Compares provided password with bcrypt-hashed stored password
- Automatically creates session cookie on success

#### Endpoint 2: Logout
**Route:** `POST /api/auth/logout`  
**Middleware:** `auth`  
**Status:** 200

##### Response
```json
{
  "success": true,
  "message": "Logged out successfully."
}
```

##### Logout Actions
1. Logs user out from 'web' guard
2. Invalidates current session
3. Regenerates CSRF token for next request

---

### Controller: SessionController

**File:** `SessionController.php`

#### Method 1: Get Current User
**Route:** `GET /api/auth/me`  
**Middleware:** None (public)

##### Response (Authenticated - 200)
```json
{
  "success": true,
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "refugee",
    "email_verified_at": "2026-03-08T10:30:00.000000Z",
    "created_at": "2026-03-07T14:22:15.000000Z"
  }
}
```

##### Response (Not Authenticated - 401)
```json
{
  "success": false,
  "message": "Not authenticated."
}
```

#### Method 2: Validate Session
**Route:** `POST /api/auth/validate`  
**Middleware:** None (public)

##### Response (Valid - 200)
```json
{
  "success": true,
  "message": "Session valid."
}
```

##### Response (Expired/Invalid - 401)
```json
{
  "success": false,
  "message": "Session expired. Please log in again."
}
```

---

### Controller: PasswordResetLinkController

**File:** `PasswordResetLinkController.php`  
**Route:** `POST /api/auth/forgot-password`  
**Middleware:** `guest`

#### Request
```json
{
  "email": "string (required, valid email)"
}
```

#### Response (Success)
```json
{
  "status": "passwords.sent"
}
```

#### Process
1. Validates email existence
2. Generates unique password reset token
3. Stores token in `password_resets` table with expiration (60 minutes)
4. Sends reset link via email to user
5. Reset link format: `{FRONTEND_URL}/password-reset/{TOKEN}?email={EMAIL}`

---

### Controller: NewPasswordController

**File:** `NewPasswordController.php`  
**Route:** `POST /api/auth/reset-password`  
**Middleware:** `guest`

#### Request
```json
{
  "token": "string (required, from email link)",
  "email": "string (required, must match token email)",
  "password": "string (required, confirmed, meets security rules)",
  "password_confirmation": "string (must match password)"
}
```

#### Response (Success)
```json
{
  "status": "passwords.reset"
}
```

#### Process
1. Validates password meets security requirements
2. Verifies token exists and hasn't expired (60 minute TTL)
3. Updates user password with bcrypt hash
4. Invalidates all password reset tokens for that user
5. Fires `PasswordReset` event
6. User can now login with new password

---

### Controller: VerifyEmailController

**File:** `VerifyEmailController.php`  
**Route:** `GET /api/verify-email/{id}/{hash}`  
**Middleware:** `auth`, `signed`, `throttle:6,1`

#### Process
1. Validates request signature (prevents URL tampering)
2. Checks if email already verified (idempotent)
3. If not verified: marks email as verified with timestamp
4. Fires `Verified` event
5. Redirects to frontend with `?verified=1` query parameter

#### Response
Redirect to: `{FRONTEND_URL}/?verified=1`

---

### Controller: EmailVerificationNotificationController

**File:** `EmailVerificationNotificationController.php`  
**Route:** `POST /api/email/verification-notification`  
**Middleware:** `auth`, `throttle:6,1`

#### Process
1. Checks if email already verified
2. If not verified: sends verification email notification
3. Email contains link to `verify-email` endpoint with signed parameters

#### Response (Success)
```json
{
  "status": "verification-link-sent"
}
```

---

## Route Structure

### Auth Routes
**File:** `server/routes/auth.php`

```
POST   /api/auth/register                      → RegisteredUserController@store
POST   /api/auth/login                         → AuthenticatedSessionController@store
POST   /api/auth/logout                        → AuthenticatedSessionController@destroy
POST   /api/auth/forgot-password               → PasswordResetLinkController@store
POST   /api/auth/reset-password                → NewPasswordController@store
GET    /api/verify-email/{id}/{hash}           → VerifyEmailController
POST   /api/email/verification-notification    → EmailVerificationNotificationController@store
```

### Public Session Endpoints
**File:** `server/routes/api.php`

```
GET    /api/auth/me                            → SessionController@currentUser
POST   /api/auth/validate                      → SessionController@validate
```

### Role-Protected Routes
```
GET    /api/user                               → Returns current user (Sanctum guard)

// Refugee routes (role:refugee)
GET    /api/refugee/profile
POST   /api/refugee/profile
PUT    /api/refugee/profile
GET    /api/refugee/opportunities
GET    /api/refugee/verification-status
POST   /api/refugee/skills
GET    /api/refugee/applications

// NGO routes (role:ngo)
GET    /api/ngo/cases
GET    /api/ngo/cases/{caseId}
POST   /api/ngo/cases/{caseId}/verify/{refugeeId}
POST   /api/ngo/cases/{caseId}/notes
GET    /api/ngo/cases/{caseId}/notes
GET    /api/ngo/metrics

// Employer routes (role:employer)
GET    /api/employer/profile
POST   /api/employer/profile
PUT    /api/employer/profile
GET    /api/employer/jobs
POST   /api/employer/jobs
GET    /api/employer/talent
POST   /api/employer/feedback/{refugeeId}
GET    /api/employer/applications
GET    /api/employer/metrics

// Admin routes (check.admin)
GET    /api/admin/impact-metrics
GET    /api/admin/users
GET    /api/admin/ngos
GET    /api/admin/audit-logs
POST   /api/admin/users/{userId}/suspend
POST   /api/admin/users/{userId}/reactivate
GET    /api/admin/analytics
```

---

## Middleware Stack

### Global Middleware (Applied to all requests)
**File:** `server/app/Http/Kernel.php`

```php
TrustProxies::class                              // Trust X-Forwarded headers
HandleCors::class                                // CORS handling
PreventRequestsDuringMaintenance::class          // Maintenance mode
ValidatePostSize::class                          // Check POST size
TrimStrings::class                               // Trim string inputs
ConvertEmptyStringsToNull::class                 // Empty strings to null
```

### Middleware Groups

#### Web Group (for web requests)
```php
EncryptCookies::class                            // Encrypt/decrypt cookies
AddQueuedCookiesToResponse::class                // Add queued cookies
StartSession::class                              // Initialize session
ShareErrorsFromSession::class                    // Share errors with views
VerifyCsrfToken::class                           // CSRF protection
SubstituteBindings::class                        // Route model binding
```

#### API Group (for API requests)
```php
EnsureFrontendRequestsAreStateful::class        // Sanctum frontend check
throttle:api                                     // API rate limiting (60 requests/min)
SubstituteBindings::class                        // Route model binding
```

### Route Middleware (Individual assignment)

| Middleware | Class | Purpose |
|-----------|-------|---------|
| `auth` | `Authenticate` | Requires authentication, JSON-aware |
| `guest` | `RedirectIfAuthenticated` | Redirect if already authenticated |
| `role:X` | `CheckRole` | Verify user has specified role(s) |
| `check.admin` | `CheckAdminCredentials` | Verify admin role (strict) |
| `verified` | `EnsureEmailIsVerified` | Require email verification |
| `signed` | `ValidateSignature` | Validate URL signatures (email links) |
| `throttle:X,Y` | `ThrottleRequests` | Rate limit X requests per Y minutes |

---

### Authentication Middleware

**File:** `server/app/Http/Middleware/Authenticate.php`

```php
// Behavior:
// 1. Redirects unauthenticated requests to login
// 2. For JSON requests (API): returns null (404 endpoint)
// 3. For web requests: redirects to 'login' route

protected function redirectTo($request)
{
    if (!$request->expectsJson()) {
        return route('login');
    }
}
```

---

### CheckRole Middleware

**File:** `server/app/Http/Middleware/CheckRole.php`

```php
// Usage: middleware('role:refugee,ngo')
// Validates user has one of the specified roles

public function handle(Request $request, Closure $next, ...$roles)
{
    // Check authenticated first
    if (!Auth::check()) {
        return JSON response 401 (if JSON request)
        return redirect to login (if web request)
    }
    
    // Check role
    $userRole = Auth::user()->role;
    if (!in_array($userRole, $roles)) {
        return JSON response 403 (if JSON request)
        return redirect to /unauthorized (if web request)
    }
    
    return $next($request);
}
```

---

### CheckAdminCredentials Middleware

**File:** `server/app/Http/Middleware/CheckAdminCredentials.php`

```php
// Strict admin check (no parameterized roles)
// Usage: middleware('check.admin')

public function handle(Request $request, Closure $next)
{
    if (!Auth::check()) {
        return JSON 401
        return redirect to login
    }
    
    if (Auth::user()->role !== 'admin') {
        return JSON 403
        return redirect to /unauthorized
    }
    
    return $next($request);
}
```

---

## Login Endpoint Flow

### Request Path: `POST /api/auth/login`

```
Step 1: HTTP Request arrives
├─ Middleware: guest (redirect if already logged in)
├─ Middleware: web group (session, csrf, cookies)
└─ Route Handler: AuthenticatedSessionController@store

Step 2: Input Validation (LoginRequest)
├─ Email: required, string, email format
├─ Password: required, string
├─ Remember: optional boolean
└─ Rate Limiting Key: email|ip (max 5 attempts)

Step 3: Rate Limiting Check
├─ Get throttle key: Str::lower($email)|$ip
├─ Check if already rate limited
├─ If limited (5+ attempts in window):
│  ├─ Fire Lockout event
│  ├─ Calculate retry seconds
│  └─ Throw ValidationException with retry time
└─ If not limited: continue

Step 4: Authentication Attempt
├─ Call Auth::attempt($credentials, $remember)
├─ Database lookup: SELECT * FROM users WHERE email = ?
├─ Password verification: Hash::check($password, user.password)
├─ If password matches:
│  ├─ On success: Load user into session
│  ├─ Set session guard state
│  ├─ Create session cookie
│  ├─ Regenerate session ID (prevents fixation)
│  └─ Clear rate limit attempts
└─ If password fails:
   ├─ Hit rate limiter (increment failed attempts)
   ├─ Throw ValidationException
   └─ Return 422 error

Step 5: Success Response (200 OK)
├─ Return JSON with:
│  ├─ success: true
│  ├─ message: "Login successful."
│  └─ user: {id, name, email, role}
└─ Session cookie automatically set in response headers
```

### Session Cookie Flow
```
Login Success
├─ Session created in storage/framework/sessions/
├─ Session ID: random_hash
├─ Session data: 
│  ├─ user ID
│  ├─ login guard info
│  ├─ IP hash (verification)
│  └─ user agent hash (verification)
├─ Cookie set: LARAVEL_SESSION=session_hash
├─ Cookie attributes:
│  ├─ HttpOnly: true (JS cannot access)
│  ├─ Secure: false (non-HTTPS, can be set to true in production)
│  ├─ SameSite: lax
│  ├─ Path: /
│  └─ Expires: +120 minutes
└─ Browser stores cookie and sends with every request
```

### Subsequent Requests
```
Any authenticated request:
├─ Browser sends LARAVEL_SESSION cookie
├─ StartSession middleware loads session from file
├─ auth middleware checks session state
├─ Auth::user() retrieves authenticated user
└─ Guard verifies user hasn't changed (IP/Agent)
```

---

## Signup Endpoint Flow

### Request Path: `POST /api/auth/register`

```
Step 1: HTTP Request arrives
├─ Middleware: guest (redirect if already logged in)
├─ Middleware: web group
└─ Route Handler: RegisteredUserController@store

Step 2: Input Validation
├─ name: required, string, max:255
├─ email: required, string, email, max:255, unique:users
├─ password: required, confirmed, Password::defaults()
│  └─ Password::defaults() requires:
│     ├─ Minimum 8 characters
│     ├─ At least one uppercase letter
│     ├─ At least one lowercase letter
│     ├─ At least one number
│     └─ At least one special character
├─ role: required, string, in:refugee,ngo,employer
│  └─ Note: 'admin' cannot be registered via public endpoint
└─ Custom messages for all validation errors

Step 3: User Creation
├─ Hash password: Hash::make($password)
│  └─ Uses bcrypt algorithm (cost factor: 12)
└─ Create user record:
   {
     name: validated_name,
     email: validated_email,
     password: bcrypt_hash,
     role: validated_role,
     email_verified_at: null,
     remember_token: null,
     created_at: now,
     updated_at: now
   }

Step 4: Post-Registration Events
├─ Fire Registered event
├─ EventServiceProvider catches Registered event
├─ SendEmailVerificationNotification listener triggered
├─ Email sent with:
│  ├─ Verification link with:
│  │  ├─ User ID
│  │  ├─ Email hash (SHA256)
│  │  └─ Signature (HMAC to prevent tampering)
│  └─ Link format: /api/verify-email/{id}/{hash}?signature=...&expires=...

Step 5: Auto-Login
├─ Call Auth::login($user)
├─ Create session for new user
├─ Regenerate session ID
└─ User is immediately authenticated

Step 6: Success Response (201 Created)
├─ Return JSON with:
│  ├─ success: true
│  ├─ message: "Registration successful. Welcome to Sheltra!"
│  └─ user: {id, name, email, role}
└─ Session cookie set automatically

Step 7: Email Verification Required
└─ User receives verification email
   ├─ Must click link within default time
   ├─ Link validates signature (prevents tampering)
   ├─ On verification: email_verified_at timestamp set
   └─ User can then access email-verified-only features
```

---

## Validation Rules

### Registration Validation

| Field | Rules | Messages |
|-------|-------|----------|
| `name` | required, string, max:255 | Full name is required. |
| `email` | required, string, email, max:255, unique:users | Email must be valid and unique |
| `password` | required, confirmed, Password::defaults() | Passwords must match; minimum 8 chars with uppercase, lowercase, number, special char |
| `password_confirmation` | (implicit in confirmed rule) | Passwords do not match. |
| `role` | required, string, in:refugee,ngo,employer | Invalid role selected. |

### Login Validation

| Field | Rules | Messages |
|-------|-------|----------|
| `email` | required, string, email | Email address is required; must be valid |
| `password` | required, string | Password is required. |

### Password Reset Validation

| Field | Rules | Messages |
|-------|-------|----------|
| `token` | required | Token is required |
| `email` | required, email | Email address is required |
| `password` | required, confirmed, Password::defaults() | Password must meet security requirements |
| `password_confirmation` | (implicit) | Passwords must match |

### Password::defaults() Security Rules
```php
// Built-in Laravel password validator
// Enforces:
✓ Minimum 8 characters
✓ At least 1 uppercase letter
✓ At least 1 lowercase letter
✓ At least 1 number
✓ At least 1 special character (!@#$%^&*...)

// Example valid passwords:
- MyPassword123!
- Sheltra@2026
- Admin#ForceReset

// Example invalid passwords:
- password123 (no uppercase, no special)
- Password! (no number)
- pass1! (too short, no uppercase)
```

---

## Rate Limiting

### Login Rate Limiting
**Location:** `server/app/Http/Requests/Auth/LoginRequest.php`

#### Configuration
- **Max Attempts:** 5 failed login attempts
- **Time Window:** 1 minute (auto-resets after specified time)
- **Throttle Key:** `Str::lower(email)|ip`
  - Combination of email (lowercase) and IP address
  - Prevents attacks on single account or from single IP

#### Rate Limiting Logic
```
Each login attempt:
1. Check throttle key: email@example.com|192.168.1.1
2. If already too many attempts:
   ├─ Fire Lockout event
   ├─ Calculate seconds until retry available
   ├─ Throw ValidationException
   └─ Response: "Too many login attempts. Please try again in X minute(s)."
3. Attempt authentication
4. On failure:
   ├─ Record failed attempt: RateLimiter::hit(throttleKey)
   └─ Throw ValidationException
5. On success:
   ├─ Clear all failed attempts: RateLimiter::clear(throttleKey)
   └─ Proceed with login
```

#### Available Time Calculation
```php
$seconds = RateLimiter::availableIn($this->throttleKey());
$minutes = ceil($seconds / 60);
// Shows: "Please try again in X minute(s)."
```

### Email Verification Rate Limiting
**Route:** `/api/email/verification-notification` and `/api/verify-email/{id}/{hash}`
- **Limit:** 6 requests per 1 minute
- **Applied:** Throttle middleware

### API General Rate Limiting
**Applied to:** All `/api/*` routes (API middleware group)
- **Limit:** 60 requests per minute (default)
- **Throttle:** `throttle:api` middleware

---

## Password Reset Flow

### Step 1: Request Reset Link
**Endpoint:** `POST /api/auth/forgot-password`

```
Client submits email:
├─ Validate email exists in database
├─ Generate unique reset token
├─ Store in password_resets table:
│  {
│    email: user_email,
│    token: hashed_token,
│    created_at: now
│  }
├─ Email expires in 60 minutes (config/auth.php)
└─ Send reset email with link containing plain token
```

### Step 2: User Receives Email
```
Email template includes:
├─ User name
├─ Reset link:
│  {FRONTEND_URL}/password-reset/{TOKEN}?email={EMAIL}
└─ Note: Token NOT hashed in URL (user must receive exact token)
```

### Step 3: Submit New Password
**Endpoint:** `POST /api/auth/reset-password`

```
Request body:
{
  "token": "string (from email link)",
  "email": "string (user email)",
  "password": "string (new password)",
  "password_confirmation": "string (confirmation)"
}

Server-side process:
├─ Lookup password_reset record by email
├─ Compare submitted token with stored hash
├─ Verify not expired (must be within 60 minutes)
├─ Hash new password with bcrypt
├─ Update user.password = bcrypt(new_password)
├─ Delete password_reset record (consumed)
├─ Fire PasswordReset event
└─ Return success response
```

---

## Email Verification Flow

### Automatic Flow (After Registration)

```
Registration Complete:
├─ Registered event fired
├─ SendEmailVerificationNotification listener triggered
└─ Email sent to user with verification link

Email Contains:
├─ User ID
├─ Email hash (SHA256 of user email)
├─ Signature (HMAC-SHA256 with app key)
├─ Expiration time
└─ URL: /api/verify-email/{id}/{hash}?signature=...&expires=...
```

### Manual Verification Flow

**Endpoint:** `POST /api/email/verification-notification`  
**Middleware:** `auth`, `throttle:6,1`

```
User requests new verification email:
├─ Check if already verified
├─ If verified: redirect to home
├─ If not verified: send verification email again
└─ Response: {status: "verification-link-sent"}

Rate limited: 6 requests per 1 minute
```

### Verification Link Click

**Endpoint:** `GET /api/verify-email/{id}/{hash}`  
**Middleware:** `auth`, `signed`, `throttle:6,1`

```
User clicks verification link:
├─ Validate signature (prevents URL tampering)
├─ Check if already verified (idempotent)
├─ If verified: redirect with ?verified=1
├─ If not verified:
│  ├─ Set email_verified_at = now
│  ├─ Save user record
│  ├─ Fire Verified event
│  └─ Redirect with ?verified=1
└─ Redirect to: {FRONTEND_URL}/?verified=1
```

---

## Role-Based Access Control

### Supported Roles

| Role | Description | Special Features |
|------|-------------|------------------|
| `refugee` | Job seekers / skill learners | Default assigned at registration |
| `ngo` | NGO/verification partners | Can verify refugees |
| `employer` | Employers hiring refugees | Can post jobs, provide feedback |
| `admin` | System administrators | Full platform access, user management |

### Role Assignment

#### At Registration
- User selects role: refugee, ngo, or employer
- Cannot select admin (admin must be manually created/assigned)
- Defaults to refugee if blank

#### Admin Creation
- Cannot register via public `/api/auth/register`
- Must be created directly in database
- Can be assigned by other admins (in admin controller)

### Role Checking Implementation

#### Method 1: Middleware Protection
```php
// Single role
middleware('role:refugee')

// Multiple roles (OR logic)
middleware('role:refugee,ngo')

// Admin-specific
middleware('check.admin')

// In routes:
Route::middleware(['auth', 'role:refugee'])
     ->get('/refugee/profile', [RefugeeController::class, 'getProfile']);
```

#### Method 2: Model Helper Methods
```php
if ($user->isRefugee()) { /* ... */ }
if ($user->isNGO()) { /* ... */ }
if ($user->isEmployer()) { /* ... */ }
if ($user->isAdmin()) { /* ... */ }
```

### Role Validation
```php
public function handle(Request $request, Closure $next, ...$roles)
{
    // Only authenticated users can access role-protected routes
    if (!Auth::check()) {
        return 401 Unauthorized;
    }
    
    // Check if user's role is in allowed roles
    $userRole = Auth::user()->role;
    if (!in_array($userRole, $roles)) {
        return 403 Forbidden;
    }
    
    return $next($request);
}
```

### Response on Unauthorized Access
**For JSON requests:**
```json
{
  "success": false,
  "message": "Access denied. Required role: refugee or ngo. Your role: employer"
}
```

**For web requests:**
```
Redirect to: /unauthorized
```

---

## Session Management

### Session Configuration
**File:** `server/config/session.php`

```php
'driver' => env('SESSION_DRIVER', 'file'),
           // Options: file, cookie, database, redis, memcached

'lifetime' => env('SESSION_LIFETIME', 120),
             // Minutes: default 120 minutes (2 hours)

'expire_on_close' => false,
                      // Sessions don't expire when browser closes

'encrypt' => false,
             // Don't encrypt session data (stateless API better approach)
```

### Session Storage

**Default Driver:** `file`
**Location:** `server/storage/framework/sessions/`
**Format:** Serialized PHP object

#### Session File Structure
```
File: storage/framework/sessions/xxxxx
Contents (serialized):
{
  'login_web_xxx': user_id,
  'login_web_hash': hash_for_validation,
  'user_id': user_id,
  'email': user_email,
  /* ... other session data ... */
}
```

### Session ID Regeneration
```
During Login:
├─ Old session destroyed
├─ New session created with new ID
├─ Session ID changed in cookie
└─ Prevents session fixation attacks

Middleware: StartSession
├─ Loads session from storage
├─ Checks IP and user agent haven't changed
└─ Invalidates if mismatch detected
```

### Session Lifetime

**Default:** 120 minutes (2 hours)  
**Configurable:** Via `SESSION_LIFETIME` environment variable  
**Inactivity:** Session expires after 120 minutes of inactivity  
**Persistence:** Set `remember` flag in login for "remember me" (14 days)

### CSRF Token
**Middleware:** `VerifyCsrfToken`
```php
// Protects against Cross-Site Request Forgery
// Token stored in session and validated on state-changing requests
// Automatically regenerated on logout
```

---

## API Response Format

### Standard Success Response
```json
{
  "success": true,
  "message": "Operation successful.",
  "data": {
    /* operation-specific data */
  }
}
```

### Standard Error Response (Validation)
```json
{
  "message": "The given data was invalid.",
  "errors": {
    "field_name": ["Error message 1", "Error message 2"]
  }
}
```

### Standard Error Response (Unauthorized)
```json
{
  "success": false,
  "message": "Authentication required.",
}
```
**Status Code:** 401

### Standard Error Response (Forbidden)
```json
{
  "success": false,
  "message": "Access denied. Required role: admin. Your role: refugee"
}
```
**Status Code:** 403

### Authentication Controller Responses

#### Login Success
```json
{
  "success": true,
  "message": "Login successful.",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "refugee"
  }
}
```
**Status:** 200

#### Registration Success
```json
{
  "success": true,
  "message": "Registration successful. Welcome to Sheltra!",
  "user": {
    "id": 1,
    "name": "Jane Smith",
    "email": "jane@example.com",
    "role": "ngo"
  }
}
```
**Status:** 201

#### Logout Success
```json
{
  "success": true,
  "message": "Logged out successfully."
}
```
**Status:** 200

#### Current User
```json
{
  "success": true,
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "refugee",
    "email_verified_at": "2026-03-08T10:30:00.000000Z",
    "created_at": "2026-03-07T14:22:15.000000Z"
  }
}
```
**Status:** 200

#### Password Reset Link Sent
```json
{
  "status": "passwords.sent"
}
```
**Status:** 200

#### Password Reset Successful
```json
{
  "status": "passwords.reset"
}
```
**Status:** 200

#### Email Verification Sent
```json
{
  "status": "verification-link-sent"
}
```
**Status:** 200

---

## Security Features Implemented

### Password Security
- ✅ Bcrypt hashing with cost factor 12
- ✅ Password confirmation required on registration/reset
- ✅ Strong password requirements enforced
- ✅ Passwords never returned in API responses

### Session Security
- ✅ Session ID regeneration after login
- ✅ IP/User-Agent validation on each request
- ✅ CSRF token protection
- ✅ HttpOnly cookies (JS cannot access)
- ✅ Secure cookie flag (configurable for HTTPS)

### Rate Limiting
- ✅ 5 failed login attempts per email+IP
- ✅ 6 email verification attempts per minute
- ✅ 60 API requests per minute per user

### Email Verification
- ✅ HMAC signature on verification links
- ✅ Timestamp-based expiration
- ✅ Email hash prevents URL guessing
- ✅ Throttled to 6 per minute

### Password Reset
- ✅ Token stored hashed in database
- ✅ 60-minute expiration
- ✅ Tokens consumed after use
- ✅ Email validation prevents account takeover

### Role-Based Access
- ✅ Middleware enforces role checks
- ✅ Multiple role support in middleware
- ✅ Admin role protected from public registration
- ✅ User ID isolation (can't access other users' data)

### Data Protection
- ✅ Password/token fields hidden from serialization
- ✅ Email verification required for sensitive operations
- ✅ Role-based endpoint access
- ✅ User ownership validation

---

## Known Discrepancies & Notes

### Client-Side JWT Configuration
**Observation:** Frontend API client (`client/src/lib/api.js`) is configured to send JWT Bearer tokens:
```javascript
config.headers.Authorization = `Bearer ${token}`;
```

**Current Backend State:** Backend uses session-based authentication primarily. This suggests either:
1. **Migration in Progress:** Frontend may be ahead of backend refactoring
2. **Sanctum Token Support:** Backend has Sanctum configured but not enforced
3. **Compatibility Layer Needed:** Frontend should use cookies instead or backend should enable Sanctum tokens

**Recommendation:** Align frontend and backend authentication:
- Option A: Use Sanctum tokens on both sides
- Option B: Use Laravel session cookies on frontend
- Option C: Set up Sanctum token guard as default

### Database Schema Status
**Observation:** `database/migrations/001_init_tables.sql` contains only:
```sql
-- Sheltra Database Schema
-- Tables will be added here as the project develops
```

**Implication:** Database schema migrations incomplete. User table and related tables must exist but are managed elsewhere (running Docker container, manual database setup, or Laravel migrations in `server/database/migrations/`).

### Session vs. Stateless Design
**Current:** Session-based (stores server-side state)  
**Best Practice for SPAs:** Stateless tokens (Sanctum or JWT)  
**Recommendation:** Migrate to Sanctum tokens for true stateless API design

---

## Summary

The Sheltra backend implements a **hybrid Laravel session + Sanctum hybrid authentication system** with:

- ✅ **Session-based authentication** as primary mechanism
- ✅ **Role-based access control** (refugee, ngo, employer, admin)
- ✅ **Comprehensive validation** (emails, passwords, roles)
- ✅ **Rate limiting** (login attempts, email verification)
- ✅ **Email verification** with signed links
- ✅ **Password reset** with expiring tokens
- ✅ **Security best practices** (bcrypt, session regeneration, CSRF)
- ✅ **JSON API responses** throughout
- ⚠️ **Client-server mismatch** (frontend JWT vs backend sessions)

**Key Implementation Details:**
- Single User model with role column (no polymorphism)
- Middleware-driven authorization (role checking)
- Laravel 8+ built-in authentication features
- Session-based with file driver
- Email-triggered verification flow
- Rate-limited login (5 attempts)

This architecture provides a solid foundation but would benefit from:
1. **Token-based authentication** (Sanctum) for true API design
2. **Database schema migration** to explicit Laravel migrations
3. **Frontend-backend alignment** (JWT or session-based consistently)
