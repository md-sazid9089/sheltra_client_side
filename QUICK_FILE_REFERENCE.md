# 🗂️ Quick File Reference - Where is Everything?

## 📌 Find Code By Feature

### 🔐 **Authentication & Login**
| Component | Location | File |
|-----------|----------|------|
| Login Page | Frontend | `client/src/pages/public/Login.jsx` |
| Register Page | Frontend | `client/src/pages/public/Register.jsx` |
| Auth Context | Frontend | `client/src/providers/AuthProvider.jsx` |
| Auth Hook | Frontend | `client/src/hooks/useAuth.js` (if exists) |
| Auth Controller | Backend | `server/app/Http/Controllers/AuthController.php` |
| Auth Middleware | Backend | `server/app/Http/Middleware/Authenticate.php` |
| Auth Config | Backend | `server/config/auth.php` |
| User Model | Backend | `server/app/Models/User.php` |
| Auth Tests | Backend | `server/tests/Feature/AuthenticationTest.php` |

---

### 👨‍💼 **Refugee Dashboard & Profile**
| Component | Location | File |
|-----------|----------|------|
| Dashboard | Frontend | `client/src/pages/refugee/Dashboard.jsx` |
| Profile Form | Frontend | `client/src/pages/refugee/ProfileForm.jsx` |
| Opportunities | Frontend | `client/src/pages/refugee/Opportunities.jsx` |
| CV Rating | Frontend | `client/src/pages/refugee/CVRating.jsx` |
| NID Check | Frontend | `client/src/pages/refugee/VirtualNIDCheck.jsx` |
| Refugee Model | Backend | `server/app/Models/RefugeeProfile.php` |
| Refugee Controller | Backend | `server/app/Http/Controllers/RefugeeController.php` |
| Migration | Backend | `server/database/migrations/2024_01_01_000100_create_refugee_profiles_table.php` |
| Seeder | Backend | `server/database/seeders/RefugeeProfileSeeder.php` |

---

### 💼 **Employer Dashboard & Jobs**
| Component | Location | File |
|-----------|----------|------|
| Dashboard | Frontend | `client/src/pages/employer/Dashboard.jsx` |
| Jobs List | Frontend | `client/src/pages/employer/Jobs.jsx` |
| Talent View | Frontend | `client/src/pages/employer/Talent.jsx` |
| Profile | Frontend | `client/src/pages/employer/Profile.jsx` |
| Job Model | Backend | `server/app/Models/Job.php` |
| Job Controller | Backend | `server/app/Http/Controllers/JobController.php` |
| Job Migration | Backend | `server/database/migrations/2024_01_01_000600_create_jobs_table.php` |
| Job Seeder | Backend | `server/database/seeders/JobSeeder.php` |

---

### 🏢 **NGO Dashboard & Cases**
| Component | Location | File |
|-----------|----------|------|
| Dashboard | Frontend | `client/src/pages/ngo/Dashboard.jsx` |
| Cases List | Frontend | `client/src/pages/ngo/Cases.jsx` |
| Case Details | Frontend | `client/src/pages/ngo/CaseDetail.jsx` |
| NGO Model | Backend | `server/app/Models/NGOProfile.php` |
| NGO Controller | Backend | `server/app/Http/Controllers/NGOController.php` |
| Migration | Backend | `server/database/migrations/2024_01_01_000200_create_ngo_profiles_table.php` |
| Seeder | Backend | `server/database/seeders/NGOProfileSeeder.php` |

---

### 🤝 **Skill Matching & Jobs**
| Component | Location | File |
|-----------|----------|------|
| Skill Service | Backend | `server/app/Services/SkillMatchingService.php` |
| Skill Model | Backend | `server/app/Models/Skill.php` |
| Skill Controller | Backend | `server/app/Http/Controllers/SkillController.php` |
| Refugee Skills | Backend | `server/app/Models/RefugeeSkill.php` |
| Skill Migration | Backend | `server/database/migrations/2024_01_01_000400_create_skills_table.php` |
| Skill Seeder | Backend | `server/database/seeders/SkillSeeder.php` |

---

### ✅ **Verification & Placements**
| Component | Location | File |
|-----------|----------|------|
| Verification Model | Backend | `server/app/Models/Verification.php` |
| Verification Controller | Backend | `server/app/Http/Controllers/VerificationController.php` |
| Verification Service | Backend | `server/app/Services/VerificationService.php` |
| Verification Migration | Backend | `server/database/migrations/2024_01_01_000700_create_verifications_table.php` |
| Placement Model | Backend | `server/app/Models/Placement.php` |
| Placement Controller | Backend | `server/app/Http/Controllers/PlacementController.php` |
| Placement Migration | Backend | `server/database/migrations/2024_01_01_000900_create_placements_table.php` |

---

### 🪪 **NID (National ID) Verification**
| Component | Location | File |
|-----------|----------|------|
| NID Component | Frontend | `client/src/components/nid/NIDDocument.jsx` |
| NID Form | Frontend | `client/src/components/nid/NIDGenerationForm.jsx` |
| NID Status | Frontend | `client/src/components/nid/NIDVerificationStatus.jsx` |
| NID Hook | Frontend | `client/src/hooks/useNIDVerification.js` |
| NID Setup Guide | Docs | `NID_SETUP.md` |
| NID Implementation | Docs | `NID_IMPLEMENTATION_GUIDE.md` |

---

### 👨‍💻 **Admin Dashboard**
| Component | Location | File |
|-----------|----------|------|
| Dashboard | Frontend | `client/src/pages/admin/Dashboard.jsx` |
| Users Management | Frontend | `client/src/pages/admin/Users.jsx` |
| NGOs Management | Frontend | `client/src/pages/admin/NGOs.jsx` |
| Audit Logs | Frontend | `client/src/pages/admin/AuditLogs.jsx` |
| Admin Controller | Backend | `server/app/Http/Controllers/AdminController.php` (if exists) |
| Audit Model | Backend | `server/app/Models/AuditLog.php` |

---

### 🎨 **UI Components**
| Component | Location | File |
|-----------|----------|------|
| Button | Frontend | `client/src/components/ui/Button.jsx` |
| Input | Frontend | `client/src/components/ui/Input.jsx` |
| Card | Frontend | `client/src/components/ui/Card.jsx` |
| Modal | Frontend | `client/src/components/ui/Modal.jsx` |
| Select | Frontend | `client/src/components/ui/Select.jsx` |
| Table | Frontend | `client/src/components/ui/Table.jsx` |
| Toast | Frontend | `client/src/components/ui/Toast.jsx` |
| Loader | Frontend | `client/src/components/ui/Loader.jsx` |
| Badge | Frontend | `client/src/components/ui/Badge.jsx` |
| Skeleton | Frontend | `client/src/components/ui/Skeleton.jsx` |

---

### 🗂️ **Layout & Navigation**
| Component | Location | File |
|-----------|----------|------|
| Navbar | Frontend | `client/src/components/layout/Navbar.jsx` |
| Sidebar | Frontend | `client/src/components/layout/Sidebar.jsx` |
| Topbar | Frontend | `client/src/components/layout/Topbar.jsx` |
| Footer | Frontend | `client/src/components/layout/Footer.jsx` |
| Admin Layout | Frontend | `client/src/components/layout/AdminLayout.jsx` |
| Refugee Layout | Frontend | `client/src/components/layout/RefugeeLayout.jsx` |
| NGO Layout | Frontend | `client/src/components/layout/NGOLayout.jsx` |
| Employer Layout | Frontend | `client/src/components/layout/EmployerLayout.jsx` |
| Public Layout | Frontend | `client/src/components/layout/PublicLayout.jsx` |

---

## 🗄️ **Database Files**

### Migrations (Schema Definitions)
```
server/database/migrations/

2024_01_01_000000_create_users_table.php                    ← Users
2024_01_01_000100_create_refugee_profiles_table.php         ← Refuge profiles
2024_01_01_000200_create_ngo_profiles_table.php             ← NGO profiles
2024_01_01_000300_create_employer_profiles_table.php        ← Employer profiles
2024_01_01_000400_create_skills_table.php                   ← Skills
2024_01_01_000500_create_refugee_skills_table.php           ← Refugee-Skill junction
2024_01_01_000600_create_jobs_table.php                     ← Job postings
2024_01_01_000700_create_verifications_table.php            ← Verifications
2024_01_01_000800_create_case_notes_table.php               ← Case notes
2024_01_01_000900_create_placements_table.php               ← Job placements
2024_01_01_001000_create_audit_logs_table.php               ← Audit logs
```

### Seeders (Test Data)
```
server/database/seeders/

DatabaseSeeder.php              ← Master seeder (runs all)
UserSeeder.php                  ← Admin, refugee, ngo, employer users
SkillSeeder.php                 ← 6 sample skills
RefugeeProfileSeeder.php        ← Sample refugee with skills
NGOProfileSeeder.php            ← Sample NGO
EmployerProfileSeeder.php       ← Sample employer
RefugeeSkillSeeder.php          ← Assign skills to refugee
JobSeeder.php                   ← Sample job posting
VerificationSeeder.php          ← Sample verification
PlacementSeeder.php             ← Sample job placement
```

---

## 🔌 **API Routes**

**Location**: `server/routes/api.php`

### Common Endpoints:
```
POST   /api/auth/login              ← User login
POST   /api/auth/register           ← User registration
GET    /api/auth/me                 ← Get current user
GET    /api/skills                  ← List all skills
GET    /api/refugees                ← List refugees
GET    /api/jobs                    ← List jobs
POST   /api/jobs                    ← Create job (employer)
GET    /api/jobs/:id                ← Get job details
POST   /api/placements              ← Create placement
GET    /api/verifications           ← List verifications
POST   /api/verifications           ← Start verification
```

---

## ⚙️ **Configuration Files**

### Frontend
```
client/
├── vite.config.js                  ← Vite build config
├── tailwind.config.js              ← Tailwind CSS config
├── postcss.config.js               ← PostCSS config
├── .env.example                    ← Environment template
├── package.json                    ← Dependencies
└── Dockerfile                      ← Docker config
```

### Backend
```
server/
├── config/
│   ├── app.php                     ← App configuration
│   ├── auth.php                    ← Auth configuration
│   ├── database.php                ← Database configuration
│   ├── sanctum.php                 ← API auth (Sanctum)
│   ├── cors.php                    ← CORS configuration
│   └── ... (more configs)
├── .env.example                    ← Environment template
├── composer.json                   ← PHP dependencies
├── phpunit.xml                     ← Test configuration
├── artisan                         ← Laravel CLI
└── Dockerfile                      ← Docker config
```

### Root
```
docker-compose.yml                  ← Docker services
Dockerfile                          ← Root Docker image
package.json                        ← Root dependencies
.gitignore                          ← Git ignore
```

---

## 📚 **Documentation Files**

### CI/CD Documentation
```
.github/CI-CD-DOCUMENTATION.md      ← Full CI/CD guide
.github/workflows/                  ← All workflow files
```

### Project Documentation
```
PROJECT_CODE_STRUCTURE.md           ← Complete code layout
CI-CD_IMPLEMENTATION_SUMMARY.md     ← CI/CD summary
PROJECT_READY.md                    ← Project status
QUICK_START.md                      ← Quick start guide
QUICK_REFERENCE.md                  ← Quick reference
SETUP_GUIDE.md                      ← Setup instructions
README.md                           ← Main documentation
```

### Database Documentation
```
DATABASE_SETUP.sql                  ← Complete SQL schema
DATABASE_SETUP_GUIDE.md             ← Database setup guide
FINAL_DATABASE_SUMMARY.md           ← Database summary
seed_data.sql                       ← Additional seed data
```

### Feature Documentation
```
AUTHENTICATION_ARCHITECTURE.md      ← Auth details
BACKEND_DEPLOYMENT_GUIDE.md         ← Deployment guide
NID_SETUP.md                        ← NID setup
NID_IMPLEMENTATION_GUIDE.md         ← NID implementation
```

---

## 🔍 **How to Search for Code**

### Option 1: Using VS Code Find
Press `Ctrl+F` and search for:
- Component name (e.g., "Dashboard")
- Function name (e.g., "createJob")
- Feature name (e.g., "verification")

### Option 2: Using File Go To
Press `Ctrl+P` and type path:
```
client/src/pages/refugee/Dashboard.jsx
server/app/Models/Job.php
```

### Option 3: Using Grep
```bash
grep -r "skillMatching" server/
grep -r "RefugeeProfile" client/
```

---

## 📊 **Code Organization Summary**

```
Frontend (React)       Backend (Laravel)      Database (MySQL)
├── /pages            ├── /Controllers        ├── migrations/
├── /components       ├── /Models             ├── seeders/
├── /hooks            ├── /Services           └── /config
├── /lib              ├── /Middleware
├── /providers        ├── /Requests
└── /routes           ├── /tests
                      └── /config
```

---

## ✨ **Quick Access**

### New to Project?
1. Start: `QUICK_START.md`
2. Structure: `PROJECT_CODE_STRUCTURE.md`
3. Auth: `AUTHENTICATION_ARCHITECTURE.md`
4. Database: `DATABASE_SETUP_GUIDE.md`

### Need CI/CD Help?
1. Overview: `CI-CD_IMPLEMENTATION_SUMMARY.md`
2. Full Guide: `.github/CI-CD-DOCUMENTATION.md`
3. Workflows: `.github/workflows/`

### Looking for Feature Code?
1. Check this file (Quick File Reference)
2. Go to the location listed
3. Read the code

---

**All files are in**:
```
c:\Sheltra\sheltra_client_side\
```

**Use this reference sheet to find anything!** 🎯

