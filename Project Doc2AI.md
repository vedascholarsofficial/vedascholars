Veda Scholars: Master System Architecture & Strategic Plan
Version: 1.0
Date: 2026-02-17
Prepared For: Veda Scholars Leadership
Prepared By: Chief Technology Officer (AI)

1. Executive Summary
Veda Scholars is positioned to become a premier EdTech platform serving students in India, UK, and UAE. The goal is to transition from a basic website to a scalable, high-performance SaaS ecosystem capable of handling 100,000+ users.

Key Strategy:

Phase 1 (Foundation): Solidify the Next.js frontend, deploy a dedicated Node.js/Express backend, and establish a managed MySQL database.
Phase 2 (Functionality): Implement comprehensive Quiz Engine, User Profiles, and Teacher Dashboards.
Phase 3 (Expansion): Launch Flutter Mobile App and expand infrastructure for multi-region support.
Critical Recommendation: Adopt a "Modular Monolith" architecture initially. This provides the development speed of a monolith while keeping code decoupled (by domain: Auth, Quiz, Users) to allow easy splitting into microservices when user load demands it.

2. Current Architecture Overview
Component	Current Status	Notes
Frontend	Next.js 16 (React 19)	Hosted on Netlify. Uses Tailwind CSS. Modern stack.
Backend	Serverless / None	Currently relies on Next.js API routes (e.g., mailer).
Database	None	No persistent data storage yet.
DNS	Namecheap BasicDNS	Direct A records to Netlify load balancers.
Email	cPanel (Shared Hosting)	Standard SMTP/IMAP. Not scalable for transactional marketing.
Auth	None	Public access only.
Risk Assessment:

Email: cPanel email is liable to be blacklisted if used for marketing/transactional volume.
Data: Lack of database prevents any user retention or personalized features.
Scalability: Current setup is static; cannot support dynamic user content.
3. Target Architecture (Scalable SaaS)
We will move to a Tiered Service-Oriented Architecture.

High-Level Diagram Description
Client Layer:
Web: Next.js Application (Netlify).
Mobile: Flutter App (Android/iOS).
CDN & Security Layer:
Cloudflare: Sits in front of EVERYTHING. Handles DDoS protection, caching, and SSL.
API Layer (The "Brain"):
Node.js + Express Cluster: Running on a PaaS (Railway/Render) or VPS (DigitalOcean).
Load Balancer: Distributes traffic across Node.js instances.
Data Layer:
Primary DB: MySQL 8.0 (Managed, e.g., PlanetScale or AWS RDS).
Cache: Redis (for session storage, leaderboards, and frequent quiz data).
Storage: Amazon S3 or Cloudflare R2 (for user avatars, study materials).
4. System Diagram & Data Flow
⚠️ Failed to render Mermaid diagram: Parse error on line 5
graph TD
    UserWeb[Web User] -->|HTTPS| CF[Cloudflare CDN]
    UserMob[Mobile User] -->|HTTPS| CF
    
    CF -->|Static Assets| Netlify[Netlify (Next.js Frontend)]
    CF -->|API Requests| API[Node.js Express Backend Cluster]
    
    API -->|Auth Check| Firebase[Firebase Auth / Auth0]
    API -->|Read/Write| DB[(MySQL Database)]
    API -->|Cache Hot Data| Redis[(Redis Cache)]
    API -->|Store Files| Blob[S3 Object Storage]
    
    EmailService[Email Service (SES/Postmark)] -->|SMTP/API| UserWeb
5. Folder Structures
A) Frontend (Next.js - d:\VedaNew\src)
Restructure for scale. Move away from flat lists.

text
src/
├── app/                  # Next.js App Router
│   ├── (auth)/           # Route group for auth pages
│   ├── (dashboard)/      # Route group for protected user pages
│   └── (marketing)/      # Public facing pages
├── components/
│   ├── ui/               # Generic UI atoms (Buttons, Inputs)
│   ├── forms/            # Complex form components
│   └── domain/           # Feature-specific components (QuizCard, UserProfile)
├── lib/
│   ├── api.ts            # Centralized API client (Axios/Fetch)
│   ├── utils.ts          # Helper functions
│   └── validations.ts    # Zod schemas for form validation
├── styles/               # Global styles
├── types/                # TypeScript interfaces
└── hooks/                # Custom React hooks
B) Backend (Node.js + Express - Recommend New Repo)
Structure by Feature/Module, not technical layer.

text
server/
├── src/
│   ├── config/           # Envs, Database connection, Logger config
│   ├── modules/          # THE CORE
│   │   ├── auth/         # AuthController, AuthService, AuthRoutes
│   │   ├── users/        # UserController, UserService, UserRoutes
│   │   ├── quizzes/      # QuizController, QuizService, QuizRoutes
│   │   └── analytics/    # Analytics logic
│   ├── middleware/       # AuthGuard, ErrorHandler, Validation
│   ├── shared/           # Shared utils, constants
│   └── app.ts            # Express app entry point
├── tests/
└── docker-compose.yml
C) Android/Mobile (Flutter)
text
lib/
├── core/                 # App-wide configs, themes, constants
├── features/
│   ├── auth/
│   │   ├── data/         # Repositories, API sources
│   │   ├── domain/       # Entities, Use Cases
│   │   └── presentation/ # BLoC/Provider, Widgets, Screens
│   ├── quiz/
│   └── content/
├── shared/               # Common widgets
└── main.dart
6. Database Schema Design (MySQL)
Core Tables:

Users

id (UUID, PK)
email (VARCHAR, Unique)
password_hash (VARCHAR)
role (ENUM: 'student', 'teacher', 'admin')
created_at (TIMESTAMP)
Profiles

user_id (FK)
full_name, avatar_url, bio, country, target_exam
Quizzes

id (PK)
title, description, difficulty, subject, is_published
Questions

id (PK), quiz_id (FK)
question_text, question_type (MCQ, Text)
options (JSON), correct_answer
Attempts (Critical for Analytics)

id (PK), user_id (FK), quiz_id (FK)
score, time_taken, completed_at
Leaderboard (Materialized View or Redis Sorted Set recommended for scale)

7. Authentication Architecture
Provider: Firebase Authentication or Supabase Auth.

Why? It handles SMS, Google, Email/Pass securely. It provides a token (JWT) that your Backend verifies. It works identically on Web and Android.
Flow:

Frontend/Mobile: User logs in via Firebase SDK → Receives id_token.
API Call: Frontend sends Authorization: Bearer <id_token> to your Backend.
Backend: Uses Firebase Admin SDK to fast-verify signature. No DB checking needed (extremely fast).
Role Check: Backend checks custom claims or database for role="teacher".
8. Development Roadmap
Phase 1: Construction (Month 1)
 Set up Node.js Express repo.
 Initialize MySQL (local or PlanetScale dev branch).
 Build Auth API (Login/Register/Me).
 Integrate Login on Next.js frontend.
Phase 2: Core Features (Month 2)
 Build Quiz Create/Read APIs.
 Build Student "Take Quiz" flow.
 Implement basic Teacher Dashboard (View Students, Create Quiz).
Phase 3: Scaling & Mobile (Month 3)
 Optimize DB queries.
 Start Flutter App development (reuse existing Auth/Quiz APIs).
 Deploy Leaderboards.
9. Infrastructure & Deployment Architecture
Plan A: Startup (Cost Efficient & Fast)

Frontend: Netlify (Keep current).
Backend: Railway.app or Render.com.
Automated CI/CD from GitHub.
Zero config SSL.
Database: PlanetScale (Serverless MySQL) or Railway Managed MySQL.
Plan B: Scale (100k Users)

Frontend: Vercel Pro or AWS Amplify.
Backend: AWS ECS (Fargate) - Docker containers auto-scaling.
Database: AWS RDS Aurora (Serverless v2).
10. Email & DNS Architecture
DNS (Namecheap)
Keep Namecheap as Registrar. Migrate Nameservers to Cloudflare (Free Plan).

Reason: Cloudflare provides free DDOS protection, faster DNS resolution globally, and free SSL rules.
Email (Critical Change Needed)
DO NOT use cPanel for transactional emails (Password Reset, Welcome structure). You will get blocked.

Transactional: Use Postmark or AWS SES (Simple Email Service).
High deliverability.
Required: DKIM, SPF, DMARC records setup on Cloudflare.
Business Email (Human): Keep cPanel Roundcube OR migrate to Google Workspace / Zoho Mail (Professional).
11. Security Best Practices
Rate Limiting: Implement express-rate-limit on backend to prevent brute force.
CORS: Strict allowlist (vedascholars.com, vedascholars.netlify.app).
Helmet: Use helmet.js in Express to set secure HTTP headers.
Sanitization: Use zod for input validation to prevent SQL Injection/XSS.
Environment Variables: NEVER commit .env files. Use secret managers in Netlify/Railway.
12. Final Recommendations (CTO's Note)
Start the Backend Now: You cannot build "Student Profiles" or "Leaderboards" with just React. You need the Node.js API immediately.
Mobile First API: Design your API responses to be generic (JSON). Do not return HTML. This ensures the exact same API powers your Website and your future Android App.
Don't Over-Engineer: Do not start with Microservices or Kubernetes. Start with a refined Modular Monolith on Railway. It will take you to 50k users comfortably for <$50/mo.

Comment
Ctrl+Alt+M


We are building Veda Scholars based on the following Master System Architecture.

[Paste full document here]

We are now starting Phase 1: Backend Construction.
Guide me step-by-step.
Assume I am a beginner but want production-grade architecture.