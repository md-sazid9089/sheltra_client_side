# Sheltra

**Beyond Shelter: Mapping Skills to Sustainable Livelihoods**

---

## Team Members

| Name | ID | Email | Role |
|------|-------|-------|------|
| Syed Mohammed Sazid Ullah | 20230104062 | sazid.cse.20230104062@aust.edu | Lead and Full Stack |
| Abrar Ahmed Cy | 20230104063 | abrar.cse.20230104063@aust.edu | Frontend Developer |
| Irfan Zahir | 20230104064 | irfan.cse.20230104064@aust.edu | Backend Developer |
| Md Tawsif Bin Mannan | 20230104066 | towsif.cse.20230104066@aust.edu | Backend Developer |

---

## Project Overview

### Objective

The objective of **Sheltra** is to develop an impact-first digital platform that enables refugees and displaced people to create portable, NGO-verified digital skill and identity profiles without relying on official documents. The system connects verified refugees to ethical jobs, training, and apprenticeships using AI-powered skill matching, while ensuring privacy, dignity, and measurable social impact aligned with **SDG 8** (Decent Work) and **SDG 10** (Reduced Inequalities).

### Target Audience

- **Refugees & displaced people** seeking dignified employment and skill recognition
- **NGOs & case workers** managing verification, training, and placements
- **Employers** interested in ethical hiring of verified refugee talent
- **Donors & government agencies** monitoring impact and inclusion outcomes

---

## Tech Stack

### 1. Frontend
- **ReactJS**
- **TailwindCSS / MUI**
- **Client-Side Rendering (CSR)**

### 2. Backend
- **PHP Laravel**
- **RESTful API** architecture

### 3. Database
- **MySQL**
  - Stores refugee profiles, skills, verifications, placements, audit logs, and impact data.

### 4. AI Integration
- **Gemini AI Flash** – skill-based job and training matching
- **face-api.js** – optional face identity verification (privacy-first)

### 5. Supporting Tools
- **JWT Authentication**
- **Docker** (containerization)
- **Role-Based Access Control (RBAC)**
- **Vercel / Netlify** (hosting)

---

**[View Figma Design](https://theory-mood-00077277.figma.site)**

---

## Project Features

### 1. Main Features
- Refugee skill profile creation without official documents
- NGO verification workflow for trust and accountability
- Role-based dashboards (Refugee, NGO, Employer, Admin)
- Ethical employer access with safeguards

### 2. AI-Integrated Features
- Skill-based matching using **Gemini AI Flash**
- Smart recommendations for jobs, training, and apprenticeships
- Impact analytics and visualization using React Charts

> **Note:** AI features support matching and analysis only and do not make legal or employment decisions.

### 3. CRUD Operations
- **Refugees:** Create/update skill profiles and availability
- **NGOs:** Verify skills, manage cases, track placements
- **Employers:** Post jobs, view verified talent, submit feedback
- **Admins:** Manage users, NGOs, audit logs

---

## Key API Endpoints (Approx.)

```
POST   /auth/login
POST   /refugees/profile
GET    /refugees/opportunities
POST   /ngo/verify/{refugee_id}
GET    /employer/talent
POST   /employer/jobs
GET    /admin/impact-metrics
```

---

## Project Phases

### Phase 1: Frontend Development
- UI/UX design in Figma
- React-based dashboards and workflows
- Role-based routing and layouts

### Phase 2: Backend & Database
- Laravel development
- MySQL schema implementation
- AI integration and authentication

### Phase 3: Deployment & Testing
- Vercel/Netlify deployment
- Security and privacy testing
- Final system integration

---

## Milestones

### Milestone 1: Core System Setup
- User roles and authentication
- Refugee profile and NGO verification system
- Basic dashboards

### Milestone 2: Matching & Placement
- AI-powered skill matching
- Employer onboarding and job posting
- Placement tracking

### Milestone 3: Impact & Finalization
- Analytics dashboards
- SDG-aligned reporting
- Testing, optimization, and deployment

---

## Future Goals

### Phase 1: Platform Enhancement
- **Mobile Application Development**
  - Native iOS and Android apps for better accessibility
  - Offline mode for refugees in low-connectivity areas
  - Push notifications for job matches and opportunities

- **Advanced AI Features**
  - Natural language processing for skill extraction from user descriptions
  - Predictive analytics for employment success rates
  - Multilingual chatbot for refugee support and guidance

### Phase 2: Ecosystem Expansion
- **Blockchain Integration**
  - Immutable skill verification records
  - Portable digital credentials across borders
  - Transparent impact tracking

- **Training Platform**
  - Integrated e-learning modules
  - Skill development courses
  - Certification programs with industry partners

- **Community Features**
  - Peer-to-peer mentorship network
  - Success stories and testimonials
  - Community forums and support groups

### Phase 3: Global Scale
- **International Partnerships**
  - Collaboration with UNHCR and international NGOs
  - Integration with government employment systems
  - Corporate social responsibility partnerships

- **Regional Customization**
  - Multi-country support with localized regulations
  - Regional language support (Arabic, French, Spanish, etc.)
  - Cultural adaptation for different refugee contexts

- **Impact Measurement**
  - Real-time SDG impact dashboard
  - Longitudinal studies on employment outcomes
  - Third-party audit and verification system
  - Annual impact reports for stakeholders

### Phase 4: Innovation & Research
- **Research Initiatives**
  - Partnership with academic institutions
  - Data-driven policy recommendations
  - Best practices documentation

- **Technology Innovation**
  - AI bias detection and mitigation
  - Enhanced privacy-preserving technologies
  - Decentralized identity solutions

---

## Conclusion

**Sheltra** transforms undocumented refugee skills into verified opportunities, enabling dignified employment, reduced aid dependency, and measurable social impact. By combining ethical design, AI-powered matching, and NGO-driven trust, the platform demonstrates how technology can support sustainable livelihoods beyond humanitarian shelter.

---
