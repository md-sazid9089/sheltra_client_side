# 📍 Sheltra Project Code Structure Reference

## Complete Project Layout

```
sheltra_client_side/
│
├── 🔧 CI/CD PIPELINE (newly added)
│   └── .github/
│       └── workflows/
│           ├── ci.yml                 ← Main CI pipeline
│           ├── frontend-ci.yml        ← Frontend specific
│           ├── backend-ci.yml         ← Backend specific
│           ├── docker-build.yml       ← Docker builds
│           └── deploy.yml             ← Production deployment
│
├── 💻 FRONTEND (React + Vite)
│   └── client/
│       ├── src/
│       │   ├── components/
│       │   │   ├── layout/
│       │   │   │   ├── AdminLayout.jsx           ← Admin page layout
│       │   │   │   ├── EmployerLayout.jsx       ← Employer layout
│       │   │   │   ├── NGOLayout.jsx            ← NGO layout
│       │   │   │   ├── RefugeeLayout.jsx        ← Refugee layout
│       │   │   │   ├── PublicLayout.jsx         ← Public layout
│       │   │   │   ├── Navbar.jsx               ← Navigation bar
│       │   │   │   ├── Sidebar.jsx              ← Sidebar menu
│       │   │   │   ├── Topbar.jsx               ← Top bar
│       │   │   │   └── Footer.jsx               ← Footer
│       │   │   ├── nid/
│       │   │   │   ├── NIDDocument.jsx          ← NID document display
│       │   │   │   ├── NIDGenerationForm.jsx    ← NID creation form
│       │   │   │   └── NIDVerificationStatus.jsx ← Verification status
│       │   │   ├── routing/
│       │   │   │   └── ProtectedRoute.jsx       ← Route auth guard
│       │   │   └── ui/
│       │   │       ├── ActionButton.jsx         ← Action buttons
│       │   │       ├── AnimatedButton.jsx       ← Animated buttons
│       │   │       ├── Badge.jsx                ← Badge components
│       │   │       ├── Button.jsx               ← Button component
│       │   │       ├── Card.jsx                 ← Card component
│       │   │       ├── EmptyState.jsx           ← Empty state UI
│       │   │       ├── Input.jsx                ← Input field
│       │   │       ├── Loader.jsx               ← Loading spinner
│       │   │       ├── Modal.jsx                ← Modal dialog
│       │   │       ├── Select.jsx               ← Select dropdown
│       │   │       ├── Skeleton.jsx             ← Loading skeleton
│       │   │       ├── StatCard.jsx             ← Stat card
│       │   │       ├── Stepper.jsx              ← Step indicator
│       │   │       ├── Table.jsx                ← Table component
│       │   │       ├── Textarea.jsx             ← Textarea field
│       │   │       ├── Toast.jsx                ← Toast notifications
│       │   │       └── SectionHeading.jsx       ← Section heading
│       │   │
│       │   ├── pages/
│       │   │   ├── admin/
│       │   │   │   ├── Dashboard.jsx            ← Admin dashboard
│       │   │   │   ├── Users.jsx                ← Manage users
│       │   │   │   ├── NGOs.jsx                 ← Manage NGOs
│       │   │   │   └── AuditLogs.jsx            ← View audit logs
│       │   │   ├── employer/
│       │   │   │   ├── Dashboard.jsx            ← Employer dashboard
│       │   │   │   ├── Jobs.jsx                 ← Job postings
│       │   │   │   ├── Talent.jsx               ← View talents/refugees
│       │   │   │   └── Profile.jsx              ← Employer profile
│       │   │   ├── ngo/
│       │   │   │   ├── Dashboard.jsx            ← NGO dashboard
│       │   │   │   ├── Cases.jsx                ← Refugee cases
│       │   │   │   └── CaseDetail.jsx           ← Case details
│       │   │   ├── refugee/
│       │   │   │   ├── Dashboard.jsx            ← Refugee dashboard
│       │   │   │   ├── ProfileForm.jsx          ← Edit profile
│       │   │   │   ├── CVRating.jsx             ← CV rating
│       │   │   │   ├── VirtualNIDCheck.jsx      ← NID verification
│       │   │   │   ├── Blogs.jsx                ← Blog/resources
│       │   │   │   └── Opportunities.jsx        ← Job opportunities
│       │   │   ├── public/
│       │   │   │   ├── Home.jsx                 ← Landing page
│       │   │   │   ├── About.jsx                ← About page
│       │   │   │   ├── Contact.jsx              ← Contact page
│       │   │   │   ├── Login.jsx                ← Login page
│       │   │   │   ├── Register.jsx             ← Registration page
│       │   │   │   └── Unauthorized.jsx         ← 401 page
│       │   │   └── shared/
│       │   │       └── Settings.jsx             ← User settings
│       │   │
│       │   ├── hooks/
│       │   │   └── useNIDVerification.js        ← NID verification hook
│       │   │
│       │   ├── lib/
│       │   │   ├── api.js                       ← API client (axios)
│       │   │   ├── cn.js                        ← Class name utilities
│       │   │   └── storage.js                   ← Local storage helpers
│       │   │
│       │   ├── providers/
│       │   │   └── AuthProvider.jsx             ← Auth context provider
│       │   │
│       │   ├── routes/
│       │   │   └── AppRoutes.jsx                ← Route definitions
│       │   │
│       │   ├── main.jsx                         ← React app entry
│       │   └── index.css                        ← Global styles
│       │
│       ├── public/                              ← Public assets
│       ├── Dockerfile                           ← Frontend Docker config
│       ├── nginx.conf                           ← Nginx server config
│       ├── vite.config.js                       ← Vite build config
│       ├── tailwind.config.js                   ← Tailwind CSS config
│       ├── postcss.config.js                    ← PostCSS config
│       ├── package.json                         ← Dependencies
│       └── README.md                            ← Frontend docs
│
├── 🗄️ DATABASE
│   ├── DATABASE_SETUP.sql                       ← Complete SQL schema + seed
│   ├── DATABASE_SETUP_GUIDE.md                  ← Setup instructions
│   ├── FINAL_DATABASE_SUMMARY.md                ← Database summary
│   ├── migrations/
│   └── seeders/
│
├── 🔌 BACKEND (Laravel 8 + PHP)
│   └── server/
│       ├── app/
│       │   ├── Http/
│       │   │   ├── Controllers/
│       │   │   │   ├── AuthController.php        ← Authentication logic
│       │   │   │   ├── UserController.php        ← User management
│       │   │   │   ├── SkillController.php       ← Skill management
│       │   │   │   ├── JobController.php         ← Job management
│       │   │   │   ├── RefugeeController.php     ← Refugee profiles
│       │   │   │   ├── NGOController.php         ← NGO management
│       │   │   │   ├── EmployerController.php    ← Employer management
│       │   │   │   ├── VerificationController.php ← Verification process
│       │   │   │   ├── PlacementController.php   ← Job placements
│       │   │   │   └── AuditLogController.php    ← Audit logs
│       │   │   ├── Middleware/
│       │   │   │   ├── Authenticate.php          ← Auth middleware
│       │   │   │   ├── RoleAuthorization.php     ← Role-based auth
│       │   │   │   └── CheckRole.php             ← Role checker
│       │   │   ├── Requests/
│       │   │   │   ├── LoginRequest.php          ← Login validation
│       │   │   │   ├── RegisterRequest.php       ← Registration validation
│       │   │   │   └── ... other validations
│       │   │   └── Kernel.php                    ← HTTP kernel config
│       │   │
│       │   ├── Models/
│       │   │   ├── User.php                      ← User model
│       │   │   ├── RefugeeProfile.php            ← Refugee profile model
│       │   │   ├── NGOProfile.php                ← NGO profile model
│       │   │   ├── EmployerProfile.php           ← Employer profile model
│       │   │   ├── Skill.php                     ← Skill model
│       │   │   ├── RefugeeSkill.php              ← Refugee skill pivot
│       │   │   ├── Job.php                       ← Job posting model
│       │   │   ├── Verification.php              ← Verification model
│       │   │   ├── CaseNote.php                  ← Case notes model
│       │   │   ├── Placement.php                 ← Job placement model
│       │   │   └── AuditLog.php                  ← Audit log model
│       │   │
│       │   ├── Services/
│       │   │   ├── AuthService.php               ← Auth business logic
│       │   │   ├── SkillMatchingService.php      ← Skill matching logic
│       │   │   ├── VerificationService.php       ← Verification logic
│       │   │   └── PlacementService.php          ← Placement logic
│       │   │
│       │   ├── Providers/
│       │   │   ├── AppServiceProvider.php        ← App services
│       │   │   ├── AuthServiceProvider.php       ← Auth services
│       │   │   └── RouteServiceProvider.php      ← Route services
│       │   │
│       │   ├── Exceptions/
│       │   │   └── Handler.php                   ← Exception handling
│       │   │
│       │   └── Console/
│       │       └── Kernel.php                    ← Console commands
│       │
│       ├── routes/
│       │   ├── api.php                           ← API routes
│       │   │   ├── POST /api/auth/login          ← User login
│       │   │   ├── POST /api/auth/register       ← User registration
│       │   │   ├── GET /api/auth/me              ← Current user
│       │   │   ├── GET /api/skills               ← List skills
│       │   │   ├── GET /api/refugees             ← List refugees
│       │   │   ├── POST /api/jobs                ← Create job
│       │   │   ├── GET /api/jobs/:id             ← Get job
│       │   │   ├── POST /api/placements          ← Create placement
│       │   │   ├── POST /api/verifications       ← Start verification
│       │   │   ├── GET /api/verifications        ← Get verifications
│       │   │   └── ... more routes
│       │   ├── auth.php                          ← Auth routes (Sanctum)
│       │   ├── web.php                           ← Web routes
│       │   ├── console.php                       ← Console routes
│       │   └── channels.php                      ← Broadcasting channels
│       │
│       ├── database/
│       │   ├── migrations/
│       │   │   ├── 2024_01_01_000000_create_users_table.php
│       │   │   ├── 2024_01_01_000100_create_refugee_profiles_table.php
│       │   │   ├── 2024_01_01_000200_create_ngo_profiles_table.php
│       │   │   ├── 2024_01_01_000300_create_employer_profiles_table.php
│       │   │   ├── 2024_01_01_000400_create_skills_table.php
│       │   │   ├── 2024_01_01_000500_create_refugee_skills_table.php
│       │   │   ├── 2024_01_01_000600_create_jobs_table.php
│       │   │   ├── 2024_01_01_000700_create_verifications_table.php
│       │   │   ├── 2024_01_01_000800_create_case_notes_table.php
│       │   │   ├── 2024_01_01_000900_create_placements_table.php
│       │   │   └── 2024_01_01_001000_create_audit_logs_table.php
│       │   └── seeders/
│       │       ├── DatabaseSeeder.php            ← Master seeder
│       │       ├── UserSeeder.php                ← Users seed data
│       │       ├── SkillSeeder.php               ← Skills seed data
│       │       ├── RefugeeProfileSeeder.php      ← Refugee data
│       │       ├── NGOProfileSeeder.php          ← NGO data
│       │       ├── EmployerProfileSeeder.php     ← Employer data
│       │       ├── RefugeeSkillSeeder.php        ← Skills assignment
│       │       ├── JobSeeder.php                 ← Job postings
│       │       ├── VerificationSeeder.php        ← Verifications
│       │       └── PlacementSeeder.php           ← Placements
│       │
│       ├── tests/
│       │   ├── Feature/
│       │   │   ├── AuthenticationTest.php        ← Auth tests
│       │   │   ├── SkillMatchingTest.php         ← Skill matching tests
│       │   │   └── JobPlacementTest.php          ← Placement tests
│       │   ├── Unit/
│       │   │   ├── UserModelTest.php             ← User model tests
│       │   │   └── SkillServiceTest.php          ← Skill service tests
│       │   ├── TestCase.php                      ← Base test class
│       │   └── CreatesApplication.php            ← App factory
│       │
│       ├── config/
│       │   ├── app.php                           ← App config
│       │   ├── auth.php                          ← Auth config
│       │   ├── cache.php                         ← Cache config
│       │   ├── database.php                      ← Database config
│       │   ├── filesystems.php                   ← File storage config
│       │   ├── mail.php                          ← Mail config
│       │   ├── queue.php                         ← Queue config
│       │   ├── sanctum.php                       ← Sanctum (API auth)
│       │   ├── services.php                      ← Third-party services
│       │   └── session.php                       ← Session config
│       │
│       ├── bootstrap/
│       │   ├── app.php                           ← App bootstrap
│       │   └── cache/                            ← Cache files
│       │
│       ├── storage/
│       │   ├── app/                              ← User uploaded files
│       │   ├── logs/                             ← Application logs
│       │   └── framework/                        ← Framework cache
│       │
│       ├── public/
│       │   ├── index.php                         ← Entry point
│       │   ├── robots.txt                        ← SEO robots config
│       │   └── assets/                           ← Static assets
│       │
│       ├── resources/
│       │   ├── views/                            ← Blade templates (if needed)
│       │   └── lang/                             ← Localization files
│       │
│       ├── composer.json                         ← PHP dependencies
│       ├── composer.lock                         ← Locked versions
│       ├── .env.example                          ← Environment template
│       ├── phpunit.xml                           ← PHPUnit config
│       ├── Dockerfile                            ← Backend Docker config
│       ├── artisan                               ← Laravel CLI
│       ├── server.php                            ← Dev server
│       ├── webpack.mix.js                        ← Build config
│       └── README.md                             ← Backend docs
│
├── 📦 PROJECT CONFIGURATION
│   ├── docker-compose.yml                        ← Docker services config
│   ├── Dockerfile                                ← Root Dockerfile
│   ├── package.json                              ← Root dependencies
│   ├── .gitignore                                ← Git ignore rules
│   ├── .gitattributes                            ← Git attributes
│   ├── .prettierrc                               ← Prettier config
│   ├── .nvmrc                                    ← Node version spec
│   ├── DATABASE_SETUP.sql                        ← SQL schema
│   └── seed_data.sql                             ← Seed data script
│
└── 📚 DOCUMENTATION
    ├── README.md                                 ← Main project readme
    ├── QUICK_START.md                            ← Quick start guide
    ├── QUICK_REFERENCE.md                        ← Quick reference
    ├── SETUP_GUIDE.md                            ← Setup instructions
    ├── DATABASE_SETUP_GUIDE.md                   ← Database guide
    ├── FINAL_DATABASE_SUMMARY.md                 ← Database summary
    ├── AUTHENTICATION_ARCHITECTURE.md            ← Auth details
    ├── BACKEND_DEPLOYMENT_GUIDE.md               ← Deployment guide
    ├── NID_SETUP.md                              ← NID implementation
    ├── NID_IMPLEMENTATION_GUIDE.md               ← NID guide
    ├── PROJECT_READY.md                          ← Project status
    ├── LICENSE                                   ← MIT License
    └── sheltra_presentation_slide.pdf            ← Presentation
```

---

## 🔑 Key Files by Purpose

### Authentication & Authorization
- **Frontend**: `client/src/providers/AuthProvider.jsx`
- **Backend**: `server/app/Http/Controllers/AuthController.php`
- **Middleware**: `server/app/Http/Middleware/CheckRole.php`

### Database Models & Schema
- **Models**: `server/app/Models/*.php`
- **Migrations**: `server/database/migrations/*.php`
- **Seeders**: `server/database/seeders/*.php`

### API Routes & Endpoints
- **Routes**: `server/routes/api.php`
- **Controllers**: `server/app/Http/Controllers/*Controller.php`
- **Requests**: `server/app/Http/Requests/*.php`

### Frontend UI Components
- **Layouts**: `client/src/components/layout/`
- **Pages**: `client/src/pages/`
- **UI Kit**: `client/src/components/ui/`

### Skill Matching & Verification
- **Service**: `server/app/Services/SkillMatchingService.php`
- **Verification**: `server/app/Http/Controllers/VerificationController.php`
- **Component**: `client/src/components/nid/`

### Testing
- **Frontend Tests**: `client/` (via npm test)
- **Backend Tests**: `server/tests/`
- **Commands**: See CI/CD workflows

---

## 📊 Code Statistics

- **Frontend Components**: ~25 React components
- **Backend Models**: 10 Eloquent models
- **API Endpoints**: 30+ RESTful endpoints
- **Database Tables**: 13 tables
- **Test Coverage**: PHPUnit + Jest capable

---

## 🚀 Loading a File

To view any specific file, use these paths:

### Frontend Example:
```
c:\Sheltra\sheltra_client_side\client\src\pages\refugee\Dashboard.jsx
```

### Backend Example:
```
c:\Sheltra\sheltra_client_side\server\app\Http\Controllers\JobController.php
```

### Database Example:
```
c:\Sheltra\sheltra_client_side\server\database\migrations\2024_01_01_000000_create_users_table.php
```

---

**Last Updated**: April 4, 2026
