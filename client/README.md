# Sheltra Frontend

> **From Displacement to Dignified Employment**
>
> A complete React SPA for Sheltra — connecting displaced individuals with verified opportunities through skill‑based matching, NGO verification, and ethical AI.

---

## Tech Stack

| Layer          | Technology                              |
| -------------- | --------------------------------------- |
| Framework      | React 18 + Vite 5                       |
| Routing        | React Router v6                         |
| State / Data   | @tanstack/react-query                   |
| Forms          | React Hook Form + Zod                   |
| HTTP           | Axios (JWT interceptors)                |
| Styling        | TailwindCSS 3 (`darkMode: 'class'`)     |
| Design Tokens  | Semantic tokens (brand, surface, text…) |

---

## Quick Start

```bash
# 1  Clone / enter the folder
cd sheltra-frontend

# 2  Install dependencies
npm install

# 3  Set the API base URL
#    Edit .env or export:
echo "VITE_API_URL=http://localhost:8000/api" > .env

# 4  Start dev server
npm run dev
#    → opens http://localhost:3000
```

---

## Environment Variables

| Variable       | Default                        | Description            |
| -------------- | ------------------------------ | ---------------------- |
| `VITE_API_URL` | `http://localhost:8000/api`    | Backend REST API base  |

---

## Project Structure

```
sheltra-frontend/
├── public/
│   └── sheltra-icon.svg
├── src/
│   ├── components/
│   │   ├── layout/          # PublicLayout, RefugeeLayout, NGOLayout, EmployerLayout, AdminLayout,
│   │   │                    # Navbar, Sidebar, Topbar, Footer
│   │   ├── routing/         # ProtectedRoute (RBAC)
│   │   └── ui/              # Button, Card, Badge, Input, Select, Textarea, Modal, Table,
│   │                        # StatCard, SectionHeading, Stepper, Toast, EmptyState, Skeleton
│   ├── lib/
│   │   ├── api.js           # Axios instance + interceptors
│   │   ├── cn.js            # clsx + tailwind-merge helper
│   │   └── storage.js       # localStorage helpers (token, theme)
│   ├── pages/
│   │   ├── public/          # Home, Login, Register, Unauthorized
│   │   ├── shared/          # Settings
│   │   ├── refugee/         # Dashboard, ProfileForm, Opportunities
│   │   ├── ngo/             # Dashboard, Cases, CaseDetail
│   │   ├── employer/        # Dashboard, Profile, Jobs, Talent
│   │   └── admin/           # Dashboard, Users, NGOs, AuditLogs
│   ├── providers/
│   │   └── AuthProvider.jsx # JWT auth context (login/register/logout/me)
│   ├── routes/
│   │   └── AppRoutes.jsx    # All route definitions
│   ├── index.css            # Tailwind directives + utilities
│   └── main.jsx             # App entry (Router + QueryClient + Auth + Toast)
├── .env
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
└── vite.config.js
```

---

## Routing

| Path                     | Access | Description                  |
| ------------------------ | ------ | ---------------------------- |
| `/`                      | Public | Impact-first homepage        |
| `/login`                 | Public | Sign in                      |
| `/register`              | Public | Create account               |
| `/unauthorized`          | Public | Access denied page           |
| `/settings`              | Public | Theme toggle + language      |
| `/refugee/dashboard`     | Refugee | Refugee overview            |
| `/refugee/profile`       | Refugee | Skill profile form          |
| `/refugee/opportunities` | Refugee | AI-matched opportunities    |
| `/ngo/dashboard`         | NGO    | NGO overview                 |
| `/ngo/cases`             | NGO    | Cases list                   |
| `/ngo/cases/:id`         | NGO    | Case detail + verify + notes |
| `/employer/dashboard`    | Employer | Employer overview          |
| `/employer/profile`      | Employer | Company profile form       |
| `/employer/jobs`         | Employer | Job CRUD                   |
| `/employer/talent`       | Employer | Browse verified talent     |
| `/admin/dashboard`       | Admin  | Platform stats & metrics     |
| `/admin/users`           | Admin  | User management table        |
| `/admin/ngos`            | Admin  | NGO partners table           |
| `/admin/audit-logs`      | Admin  | Immutable audit log table    |

---

## Auth Flow

1. **Login / Register** → backend returns JWT `token`.
2. Token stored in `localStorage` via `storage.setToken()`.
3. Axios request interceptor attaches `Authorization: Bearer <token>`.
4. `AuthProvider` calls `GET /auth/me` on mount to hydrate user + role.
5. `ProtectedRoute` checks auth state + role → redirects to `/login` or `/unauthorized`.
6. Axios response interceptor clears token and redirects on `401`.

---

## Design Tokens

All semantic tokens are defined in `tailwind.config.js`:

- **brand**: `primary` (trust blue), `accent` (teal), `amber` (warm highlight)
- **surface**: `base`, `card`, `darkBase`, `darkCard`
- **border**: `light`, `dark`
- **text**: `primary`, `secondary`, `muted` (+ dark variants)
- **semantic**: `success`, `warning`, `error`, `info` (+ light variants)

---

## Ethical AI Disclaimer

Wherever AI recommendations appear (Opportunities, Talent Browse):

> **AI supports matching and recommendations only; it does not make legal or employment decisions.**

---

## Accessibility

- Single `<h1>` on homepage; `<h2>` per section
- All inputs have associated `<label>` elements
- `aria-invalid` on form errors
- Visible focus rings (`focus-ring` utility)
- `aria-label` on icon-only buttons
- `prefers-reduced-motion` respected for all animations

---

## Dark Mode

Toggle via navbar icon or Settings page. Preference persisted in `localStorage`.
All components use `dark:` class variants for full parity.

---

## Build for Production

```bash
npm run build
npm run preview    # preview the production build locally
```

---

## License

Proprietary — Sheltra Platform
