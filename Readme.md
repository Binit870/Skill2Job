# Skill2Career

**Turn your skills into your next job.** Skill2Career is a skill-first hiring platform: job seekers build an ATS-ready resume, practice with AI-powered mock interviews and skill assessments, and get matched to jobs based on what they can actually do — while recruiters get a clean pipeline to post roles, review applicants, and track hiring performance.

This document is the single reference for the whole project: architecture, local setup, every feature that's been built, the design system, and the security model. It reflects the state of the codebase after a full audit-and-rebuild pass (bug fixes → security hardening → UI redesign → SEO → professional features), not just the original scaffold.

---

## Table of contents

1. [Architecture](#architecture)
2. [Tech stack](#tech-stack)
3. [Project structure](#project-structure)
4. [Getting started](#getting-started)
5. [Environment variables](#environment-variables)
6. [Features](#features)
7. [Design system](#design-system)
8. [Security](#security)
9. [SEO](#seo)
10. [API reference](#api-reference)
11. [Known limitations & next steps](#known-limitations--next-steps)

---

## Architecture

Three independently deployable services:

```
┌─────────────────┐        ┌──────────────────┐        ┌─────────────────────┐
│   mp-frontend    │ HTTPS  │    mp-backend      │ HTTPS  │     ml-service        │
│  React + Vite    │───────▶│  Express + Mongo   │───────▶│  FastAPI (Python)    │
│  (Vercel)        │◀───────│  (Render/Railway)  │◀───────│  (Render/HF Spaces)  │
└─────────────────┘        └──────────────────┘        └─────────────────────┘
                                     │
                                     ▼
                            ┌─────────────────┐
                            │   MongoDB Atlas  │
                            └─────────────────┘
```

- **mp-frontend** — the whole user-facing app (student portal, recruiter portal, public marketing site). Talks only to `mp-backend`, never directly to the ML service.
- **mp-backend** — the API of record. Owns auth, all data (Mongo), file storage (Cloudinary), email, and proxies ML-backed features to `ml-service` using a shared internal secret so the ML service can't be called directly by the outside world.
- **ml-service** — stateless FastAPI service doing the actual ML work: resume parsing/scoring, mock interview question generation & scoring, mock assessment generation & scoring. Only accepts requests carrying the internal API key.

Both `mp-backend → ml-service` calls and every write from the browser go through the same request pipeline: rate limiting → auth → validation → controller → centralized error handler.

---

## Tech stack

| Layer | Stack |
|---|---|
| Frontend | React 19, Vite, Tailwind CSS, React Router 7, Framer Motion, Recharts, react-hot-toast, lucide-react |
| Backend | Node.js, Express 5, Mongoose (MongoDB), JWT auth, Cloudinary (file storage), Nodemailer |
| ML service | Python, FastAPI, sentence-transformers, scikit-learn, pdfplumber |
| Infra / hardening | helmet, express-rate-limit, express-validator, slowapi (Python rate limiting), compression |

---

## Project structure

```
Skill2Career/
├── mp-frontend/
│   ├── public/                  robots.txt, sitemap.xml, favicon, OG image
│   ├── src/
│   │   ├── auth/                 Login, Signup, Forgot/Reset Password
│   │   ├── public/                Landing, About, Features, How It Works, FAQ, Contact
│   │   ├── student/
│   │   │   ├── dashboard/         Home dashboard + stat widgets
│   │   │   ├── jobs/               Find Jobs, Job Details, Apply flow, Saved Jobs
│   │   │   ├── applications/       My Applications tracker
│   │   │   ├── resume/             Resume Builder, Resume Analyzer, Resume Viewer
│   │   │   ├── mock-interview/     AI mock interview (voice + text)
│   │   │   ├── mock-assessment/    Timed MCQ/True-False skill assessments
│   │   │   ├── profiles/           Profile view + edit
│   │   │   └── analytics/          Personal ATS score & readiness analytics
│   │   ├── recruiter/
│   │   │   ├── components/         Dashboard, sidebar, navbar
│   │   │   ├── jobs/                Post Job (wizard), Edit Job, My Jobs
│   │   │   ├── applications/        Candidate review + status pipeline
│   │   │   ├── profiles/            Company profile view + edit
│   │   │   └── analytics/           Hiring funnel, time-to-hire, top jobs
│   │   ├── components/             Shared: Seo, NotificationBell, auth/ primitives
│   │   ├── layouts/                 PublicLayout, StudentLayout, RecruiterLayout
│   │   ├── context/                 AuthContext
│   │   └── utils/                   api.js (axios instance)
│   └── index.html                   Meta tags, OG/Twitter cards, JSON-LD
│
├── mp-backend/
│   ├── controllers/                One file per resource (auth, job, application, profile, resume, notification, recruiterAnalytics, mockInterview, mockAssessment)
│   ├── models/                      User, Job, Application, Resume, ResumeAnalysis, Notification, AssessmentResult, MockInterview
│   ├── routes/                      REST routes, one file per resource
│   ├── middlewares/                 authMiddleware, errorHandler, rateLimiter, uploadMiddleware, validate
│   ├── validators/                   express-validator rule sets
│   ├── utils/                        asyncHandler, AppError, sendEmail (branded templates), uploadToCloudinary
│   ├── config/                       Db.js, cloudinary.js, env.js
│   └── server.js
│
└── ml-service/
    ├── main.py                       FastAPI app, all routes, internal-key auth
    ├── analysis_service.py           Resume parsing & ATS scoring
    └── services/
        ├── question_selector.py       Mock interview question bank
        ├── answer_scorer.py           Mock interview scoring
        ├── assessment_generator.py    Mock assessment question bank
        └── assessment_scorer.py       Mock assessment scoring
```

---

## Getting started

### Prerequisites
- Node.js 18+
- Python 3.11+
- A MongoDB instance (Atlas free tier works)
- A Cloudinary account (file uploads)
- A Gmail account with an [app password](https://myaccount.google.com/apppasswords) (transactional email)

### 1. Backend

```bash
cd mp-backend
npm install
cp .env.example .env   # fill in the values — see Environment Variables below
npm run dev             # nodemon, http://localhost:5000
```

### 2. ML service

```bash
cd ml-service
python -m venv venv && source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
uvicorn main:app --reload --port 8000
```

The first request that needs the sentence-transformer model will download it from Hugging Face — expect a slower first call.

### 3. Frontend

```bash
cd mp-frontend
npm install
cp .env.example .env
npm run dev              # http://localhost:5173
```

### 4. Generate the two secrets

```bash
# JWT_SECRET (backend)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# ML_INTERNAL_API_KEY / INTERNAL_API_KEY — must be identical on both
# mp-backend and ml-service
python -c "import secrets; print(secrets.token_hex(32))"
```

With all three running locally, visit `http://localhost:5173`, sign up as a student or recruiter, and go.

---

## Environment variables

Each service has a `.env.example` documenting every variable it needs. Summary:

**mp-backend**
| Variable | Purpose |
|---|---|
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Signs auth tokens |
| `CLIENT_URL` | Frontend origin — used for CORS + email links |
| `ML_SERVICE_URL` | Base URL of the ML service |
| `ML_INTERNAL_API_KEY` | Shared secret sent to the ML service on every call |
| `CLOUDINARY_*` | File upload storage |
| `EMAIL_USER` / `EMAIL_PASS` | Gmail + app password for transactional email |

**ml-service**
| Variable | Purpose |
|---|---|
| `BACKEND_URL` | Used for CORS allow-list |
| `INTERNAL_API_KEY` | Must match `ML_INTERNAL_API_KEY` on the backend |

**mp-frontend**
| Variable | Purpose |
|---|---|
| `VITE_API_URL` | Base URL of the backend API |

---

## Features

### For job seekers (students)
- **Auth** — signup/login with role selection, forgot/reset password
- **Resume Builder** — guided multi-section editor (education, experience, projects, certifications), exports to PDF
- **Resume Analyzer** — upload an existing resume for an ATS compatibility score, skill-gap detection, and improvement tips; missing skills link straight to a course search
- **Job search** — full-text search, job-type filters, **salary range filter**, **skill-match % scoring and sorting** (computed against the student's own profile skills), save/bookmark jobs
- **Applications** — apply with cover letter + resume choice (profile resume or a fresh upload), track status (Pending → Reviewed → Shortlisted → Rejected/Hired) with a dedicated tracker page and status tabs
- **Mock Interview** — role + difficulty selection, AI-generated questions, voice (Web Speech API) or text answers, animated avatar reacts to interview state, scored feedback report per question
- **Mock Assessment** — topic + difficulty + question-mix configuration, timed MCQ/True-False test, graded results with per-question explanations, full history
- **Notifications** — in-app bell (polls every 60s) + email, fired on application status changes
- **Analytics** — personal ATS score trend and readiness overview

### For recruiters
- **Job posting** — multi-step wizard (details → requirements → review) with live validation
- **Job management** — edit, close/reopen, delete; posted-jobs list with status badges
- **Candidate review** — filterable/searchable applicant list, full candidate detail panel (resume, cover letter, profile snapshot), one-click status changes with recruiter notes
- **Notifications** — in-app + email the moment someone applies
- **Hiring analytics** — application funnel by status, hire rate, average time-to-hire, top-performing jobs by application volume, 30-day application trend — all server-computed via MongoDB aggregation, charted with Recharts

### Platform-wide
- Fully responsive, keyboard-accessible (visible focus rings everywhere)
- One consistent design system across every page (see below)
- Privacy Policy and Terms of Service pages, linked from the footer and the contact form
- SEO: per-page meta tags, Open Graph/Twitter cards, sitemap, robots.txt, structured data
- Route-based code-splitting — the public homepage ships ~440KB of JS, not the ~2.6MB it used to

---

## Design system

A from-scratch visual identity built around the product's actual differentiator — turning skills into measurable career progress — rather than a generic SaaS template.

**Palette**
| Token | Hex | Use |
|---|---|---|
| `ink` | `#0D1512` | Primary text, dark surfaces |
| `pine` | `#0E6B52` | Primary brand — buttons, links, active states |
| `moss` | `#143D30` | Secondary green — gradients, hover states |
| `gold` | `#C99A3B` | Accent — scores, achievement, "current step" markers |
| `paper` | `#F7F5EF` | Page background |
| `mist` | `#E7E4DA` | Borders, dividers |

**Typography** — Inter Tight (`font-display`, headings/UI labels) + Inter (`font-sans`, body text).

**Shape language** — generous rounding (`rounded-xl`/`2xl`/`3xl`, pill buttons), soft layered shadows (`shadow-card` / `shadow-card-hover`), opacity-based hover states (`hover:bg-pine/8` etc.) rather than swapping to a different hue.

All tokens live in `mp-frontend/tailwind.config.js`.

---

## Security

- **Auth**: bcrypt-hashed passwords, JWT (1-day expiry), role-based route guards (`protect` + `authorize` middleware)
- **Rate limiting**: tiered — strict on auth endpoints (brute-force protection), per-user on ML-backed endpoints (abuse protection), a generous baseline across the whole API
- **Input validation**: express-validator on every write endpoint (jobs, applications, profiles); manual validation on auth (email format, 8-char password minimum)
- **Mass-assignment protection**: job updates whitelist exactly the fields a client is allowed to change
- **Security headers**: helmet, with CORS locked to the known frontend origin(s)
- **Service-to-service auth**: the ML service only accepts requests carrying `ML_INTERNAL_API_KEY` — it cannot be called directly by anyone who finds its URL
- **Error handling**: centralized handler ensures raw error messages/stack traces never reach the client in production; everything is still logged server-side
- **File uploads**: type/size validated before upload, stored in Cloudinary (never on local disk)

---

## SEO

- Per-page `<title>`/meta description/canonical URL via a lightweight custom `<Seo>` component (no added dependency)
- Open Graph + Twitter Card tags, backed by a real generated 1200×630 branded share image
- `robots.txt` + `sitemap.xml` covering all public routes
- JSON-LD `Organization` structured data
- Route-based code-splitting for faster first paint (a real Core Web Vitals / ranking factor)

**Honest limitation**: this is a client-rendered SPA. Meta tags update correctly for users and JS-executing crawlers (Google), but there's no server-side rendering — if that becomes a priority, it's a framework-level change (e.g. migrating to Next.js), not something bolted on top.

---

## API reference

All routes are prefixed `/api`. 🔒 = requires `Authorization: Bearer <token>`.

| Resource | Routes |
|---|---|
| Auth | `POST /auth/signup`, `POST /auth/login`, `POST /auth/forgot-password`, `POST /auth/reset-password/:token`, `GET /auth/me` 🔒 |
| Jobs | `GET /jobs`, `GET /jobs/:id`, `POST /jobs` 🔒(recruiter), `PUT /jobs/:id` 🔒, `DELETE /jobs/:id` 🔒, `PATCH /jobs/:id/close` 🔒, `PATCH /jobs/:id/reopen` 🔒, `GET /jobs/recruiter/my-jobs` 🔒, `GET /jobs/saved` 🔒(student), `PATCH /jobs/:id/save` 🔒(student) |
| Applications | `POST /applications` 🔒(student), `GET /applications/my` 🔒, `GET /applications/check/:jobId` 🔒, `DELETE /applications/:id` 🔒, `GET /applications/recruiter` 🔒, `GET /applications/job/:jobId` 🔒, `PATCH /applications/:id/status` 🔒(recruiter) |
| Profile | `GET /profile` 🔒, `PUT /profile/student` 🔒, `PUT /profile/recruiter` 🔒, `GET /profile/resume` 🔒 |
| Resume | `POST /resume/analyze` 🔒, `GET /resume` 🔒, `POST /resume` 🔒, `DELETE /resume` 🔒, `GET /resume/history` 🔒 |
| Mock interview | `POST /mock/generate` 🔒, `POST /mock/evaluate` 🔒 |
| Mock assessment | `POST /assessment/generate` 🔒, `POST /assessment/submit` 🔒, `GET /assessment/history` 🔒, `GET /assessment/history/:id` 🔒 |
| Notifications | `GET /notifications` 🔒, `PATCH /notifications/:id/read` 🔒, `PATCH /notifications/read-all` 🔒 |
| Recruiter analytics | `GET /recruiter/analytics/overview` 🔒(recruiter) |

ML service (`ml-service`, called only by `mp-backend` with the internal key): `POST /analyze`, `POST /generate`, `POST /evaluate`, `POST /assessment/generate`, `POST /assessment/evaluate`.

---

## Known limitations & next steps

- **No SSR/pre-rendering** — see [SEO](#seo) above.
- **No refresh-token rotation** — JWTs expire after 1 day with no silent renewal; users just have to log in again.
- **Two remaining large JS chunks**: `ResumeView` (~990KB, PDF export libraries) and `StudentEditProfile` (~450KB, image cropper) only load when a user actually visits those specific pages, so they don't affect the public site's performance — but they'd be worth trimming if those pages' load time becomes a complaint.
- **Course recommendations are a search link**, not a curated catalog — upgrading to real course-platform integrations (Coursera/Udemy APIs) is a natural next step.
- **No automated tests** — everything in this codebase was verified manually (production builds, live endpoint testing, syntax checks) rather than via a test suite. Adding Jest/Vitest + Playwright coverage is the highest-leverage next investment for long-term maintainability.
