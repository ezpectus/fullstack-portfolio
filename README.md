# Portfolio Series - Monorepo

A comprehensive collection of 9 production-ready full-stack applications demonstrating modern web development practices with TypeScript, React, Node.js, Express, Prisma, and PostgreSQL.

## 📋 Table of Contents

- [Overview](#overview)
- [Projects](#projects)
- [Common Technology Stack](#common-technology-stack)
- [Architecture Patterns](#architecture-patterns)
- [Security Standards](#security-standards)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Testing](#testing)
- [Deployment](#deployment)
- [Project Structure](#project-structure)
- [Documentation](#documentation)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

This monorepo contains 9 full-stack applications covering various business domains (CRM, Booking, Hospital Management, HR Portal, E-commerce, Invoice Generator, Library Management, Inventory Management, URL Shortener). Each project is production-ready, follows consistent architecture patterns, security best practices, and coding standards.

**Key Highlights:**
- **Consistent Architecture:** All projects share the same layered architecture (Controller → Service → Repository)
- **Security First:** JWT-based authentication with httpOnly cookies, bcrypt password hashing, rate limiting
- **Type Safety:** TypeScript strict mode across all projects
- **Modern UI:** React 18 with Vite, TailwindCSS, shadcn/ui components
- **Database:** PostgreSQL with Prisma ORM for type-safe database access
- **Caching:** Redis for distributed locks and caching where needed
- **API Documentation:** Swagger/OpenAPI 3.0 for all backend APIs
- **Docker Ready:** Full Docker Compose setup for local development and production

## 📦 Projects

### 1. CRM System
**Purpose:** Customer Relationship Management for sales teams and small businesses

**Key Features:**
- Customer management with search, filtering, and interaction timeline
- Kanban-style deal pipeline (New → Contacted → Qualified → Proposal → Won/Lost)
- Rich-text notes with markdown support
- Dashboard analytics with charts (deals by stage, customer growth)
- Role-based access control (Admin, Manager, Sales Rep)
- CSV export for customers and deals

**Tech Stack:** React + Vite, Express.js, Prisma, PostgreSQL, Redis, Recharts

**Folder:** `crm-system/`

---

### 2. Inventory Management
**Purpose:** Stock and warehouse management system

**Key Features:**
- Product catalog with categories and suppliers
- Real-time stock tracking and low stock alerts
- Barcode generation for products
- Purchase order management
- Stock movement history (in/out/transfer)
- Supplier management with contact information

**Tech Stack:** React + Vite, Express.js, Prisma, PostgreSQL, bwip-js (barcodes)

**Folder:** `inventory-management/`

---

### 3. Booking System
**Purpose:** Universal appointment and reservation management

**Key Features:**
- Service management with duration and pricing
- Provider management with working hours and availability
- Multi-step booking flow (service → provider → date → slot)
- Calendar view with drag-and-drop rescheduling
- Redis distributed locks to prevent double-booking
- Email notifications (confirmation, reminders, cancellations)
- Dashboard with revenue and utilization analytics

**Tech Stack:** React + Vite, Express.js, Prisma, PostgreSQL, Redis, FullCalendar, Nodemailer

**Folder:** `booking-system/`

---

### 4. Invoice Generator
**Purpose:** Professional invoice creation and management

**Key Features:**
- Invoice creation with line items and calculations
- PDF generation with custom templates
- Email sending of invoices
- Client management with billing information
- Payment tracking and status
- Invoice history and reporting

**Tech Stack:** React + Vite, Express.js, Prisma, PostgreSQL, PDFKit, Nodemailer

**Folder:** `invoice-generator/`

---

### 5. Library Management
**Purpose:** Library catalog and lending system

**Key Features:**
- Book catalog with ISBN, author, genre
- Member management with membership cards
- Borrowing and returning with due dates
- Fine calculation for overdue items
- Book reservations and holds
- Email reminders for due dates
- Analytics dashboard (circulation, popular books)

**Tech Stack:** React + Vite, Express.js, Prisma, PostgreSQL, Redis, Nodemailer

**Folder:** `library-management/`

---

### 6. Hospital Management
**Purpose:** Hospital administration and patient care system

**Key Features:**
- Patient registration and medical records
- Doctor management with specializations
- Appointment scheduling with conflict detection
- Medical records with diagnoses and prescriptions
- Department management
- Dashboard with hospital statistics
- Notification system for appointments

**Tech Stack:** React + Vite, Express.js, Prisma, PostgreSQL, Redis

**Folder:** `hospital-management/`

---

### 7. E-commerce Admin
**Purpose:** E-commerce store administration panel

**Key Features:**
- Product management with images and variants
- Order processing and status tracking
- Customer management
- Analytics dashboard (sales, revenue, popular products)
- Promo code management
- Image upload and processing with Sharp
- Redis caching for performance

**Tech Stack:** React + Vite, Express.js, Prisma, PostgreSQL, Redis, Sharp (image processing)

**Folder:** `ecommerce-admin/`

---

### 8. HR Portal
**Purpose:** Human resources management system

**Key Features:**
- Employee management with profiles
- Leave request workflow (request → approve/reject)
- Attendance tracking
- Payroll management
- Document generation (contracts, payslips)
- Employee directory
- Reports and analytics

**Tech Stack:** React + Vite, Express.js, Prisma, PostgreSQL, PDFKit, Nodemailer

**Folder:** `hr-portal/`

---

### 9. URL Shortener
**Purpose:** URL shortening service with analytics

**Key Features:**
- URL shortening with custom aliases
- Redirect tracking and analytics
- QR code generation for shortened URLs
- Dashboard with click statistics
- Expiration dates for links
- User authentication for link management

**Tech Stack:** React + Vite, Express.js, Prisma, PostgreSQL, Redis, QRCode

**Folder:** `url-shortener/`

## 🛠 Common Technology Stack

### Frontend
- **Framework:** React 18 with TypeScript
- **Build Tool:** Vite 5 (fast HMR, optimized builds)
- **Styling:** TailwindCSS 3 + shadcn/ui components
- **State Management:**
  - Server state: TanStack React Query 5 (caching, refetching)
  - Client state: Zustand 4 (lightweight, no persistence for auth)
- **Routing:** React Router 6
- **Forms:** React Hook Form + Zod validation
- **Charts:** Recharts
- **Animations:** Framer Motion
- **HTTP Client:** Axios with interceptors for auth

### Backend
- **Runtime:** Node.js 20+
- **Framework:** Express 4 with TypeScript 5
- **ORM:** Prisma 5 (type-safe database access)
- **Database:** PostgreSQL 16
- **Cache/Locks:** Redis 7 (where needed)
- **Authentication:** JWT (access + refresh tokens)
- **Password Hashing:** bcrypt
- **Validation:** Zod (runtime type validation)
- **API Documentation:** Swagger/OpenAPI 3.0
- **Testing:** Vitest + Supertest
- **Code Quality:** ESLint 8, Prettier 3

### DevOps
- **Containerization:** Docker + Docker Compose
- **Process Management:** PM2 (production)
- **CI/CD:** GitHub Actions (optional, can be configured)

## 🏗 Architecture Patterns

### Backend Architecture (Layered)
```
Controller Layer (HTTP handlers)
    ↓
Service Layer (Business logic)
    ↓
Repository Layer (Data access)
    ↓
Database (Prisma ORM)
```

**Benefits:**
- Separation of concerns
- Easy testing (mock services)
- Reusable business logic
- Clear data flow

### Frontend Architecture
```
Components (UI)
    ↓
Custom Hooks (logic extraction)
    ↓
API Hooks (React Query)
    ↓
Axios Client (HTTP)
```

**Benefits:**
- Reusable logic across components
- Automatic caching and refetching
- Optimistic updates
- Type-safe API calls

## 🔒 Security Standards

All projects implement consistent security practices:

### Authentication
- **Access Tokens:** JWT with 15-minute expiry, stored in Zustand memory only (never localStorage)
- **Refresh Tokens:** Opaque tokens (crypto.randomBytes) with 7-day expiry, stored in httpOnly cookies
- **Token Rotation:** New refresh token issued on each refresh, old token revoked
- **Password Hashing:** bcrypt with 10 salt rounds

### API Security
- **Rate Limiting:** Auth endpoints (5 req/15min), API endpoints (100 req/15min)
- **CORS:** Whitelisted origins only
- **Helmet:** Security headers (HSTS, X-Frame-Options, etc.)
- **Input Validation:** Zod schemas on all endpoints
- **SQL Injection Prevention:** Prisma ORM (parameterized queries)

### Data Protection
- **Environment Variables:** No fallbacks for secrets in production
- **Sensitive Data:** Never logged or exposed in error messages
- **Session Management:** Proper logout clears both tokens

## 🚀 Getting Started

### Prerequisites
- **Node.js:** 20+ (recommended: use nvm for version management)
- **PostgreSQL:** 14+ (running locally or via Docker)
- **Redis:** 7+ (for projects that use it)
- **Docker:** (optional, for containerized setup)
- **Git:** for cloning the repository

### Quick Start for Any Project

Each project is self-contained. Navigate to any project folder:

```bash
# 1. Navigate to project
cd <project-folder>  # e.g., cd crm-system

# 2. Install all dependencies (root + backend + frontend)
npm run install:all

# 3. Setup environment variables
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# 4. Edit .env files with your configuration
# - DATABASE_URL: PostgreSQL connection string
# - JWT_ACCESS_SECRET: Random secret for access tokens
# - JWT_REFRESH_SECRET: Random secret for refresh tokens
# - REDIS_URL: Redis connection (if needed)

# 5. Run database migrations
cd backend
npx prisma migrate dev

# 6. Seed the database (optional, for demo data)
npx prisma db seed

# 7. Start development servers (both backend and frontend)
cd ..
npm run dev
```

### Access Points
- **Frontend:** http://localhost:3000 (or 5173 for Vite)
- **Backend API:** http://localhost:4000
- **Swagger Docs:** http://localhost:4000/api-docs
- **Prisma Studio:** http://localhost:5555 (run `npm run db:studio`)

## 💻 Development Workflow

### Running Tests
```bash
# Backend tests
cd backend
npm test

# Frontend tests (if configured)
cd frontend
npm test
```

### Code Quality
```bash
# Lint all code
npm run lint

# Format all code
npm run format
```

### Database Operations
```bash
# Run migrations
npm run db:migrate

# Open Prisma Studio (GUI)
npm run db:studio

# Seed database
npm run db:seed
```

### Docker Development
```bash
# Start all services with Docker Compose
docker-compose up --build

# Stop services
docker-compose down

# View logs
docker-compose logs -f
```

## 🧪 Testing

### Backend Testing
- **Framework:** Vitest + Supertest
- **Coverage:** API endpoints, services, repositories
- **Test Location:** `backend/src/**/*.test.ts`

### Frontend Testing
- **Framework:** Vitest + React Testing Library (if configured)
- **Coverage:** Components, hooks, utilities
- **Test Location:** `frontend/src/**/*.test.tsx`

### E2E Testing
- **Framework:** Playwright (optional, can be added)
- **Test Location:** `e2e/` (if configured)
- **Ignored:** `parallel-playwright-executor/` in .gitignore

## 🚢 Deployment

### Environment Setup
Each project requires the following environment variables:

**Backend (.env):**
```env
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
JWT_ACCESS_SECRET=your-random-secret-here
JWT_REFRESH_SECRET=your-random-secret-here
REDIS_URL=redis://localhost:6379  # if needed
NODE_ENV=production
PORT=4000
```

**Frontend (.env):**
```env
VITE_API_URL=https://your-api-domain.com
```

### Docker Deployment
Each project includes:
- `Dockerfile.backend` - Backend container
- `Dockerfile.frontend` - Frontend container
- `docker-compose.yml` - Full stack orchestration

### Production Checklist
- [ ] Set strong JWT secrets (no fallbacks)
- [ ] Configure CORS for production domain
- [ ] Enable HTTPS (SSL/TLS)
- [ ] Set up PostgreSQL backups
- [ ] Configure Redis persistence
- [ ] Enable rate limiting
- [ ] Set up monitoring (PM2, logs)
- [ ] Configure email service (Nodemailer)
- [ ] Run database migrations
- [ ] Seed production data (if needed)

## 📁 Project Structure

Each project follows this structure:

```
<project-name>/
├── backend/                    # Node.js + Express + TypeScript
│   ├── src/
│   │   ├── config/            # Environment, database, Redis, Swagger
│   │   ├── middleware/       # Auth, RBAC, validation, rate limiting
│   │   ├── modules/          # Feature modules (auth, users, etc.)
│   │   │   ├── controller/   # HTTP handlers
│   │   │   ├── service/      # Business logic
│   │   │   ├── repository/   # Data access
│   │   │   ├── routes/       # Route definitions
│   │   │   └── schemas/      # Zod validation schemas
│   │   ├── types/            # TypeScript types
│   │   └── app.ts            # Express app entry
│   ├── prisma/
│   │   ├── schema.prisma     # Database schema
│   │   └── seed.ts           # Seed data
│   ├── tests/                # Backend tests
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
├── frontend/                   # React + Vite + TypeScript
│   ├── src/
│   │   ├── api/              # Axios client + API hooks
│   │   ├── components/       # Shared UI components
│   │   ├── features/         # Feature-specific components
│   │   ├── hooks/            # Custom React hooks
│   │   ├── store/            # Zustand stores
│   │   ├── types/            # TypeScript types
│   │   ├── utils/            # Utility functions
│   │   └── main.tsx          # React entry
│   ├── public/               # Static assets
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── .env.example
├── docs/                      # Documentation
│   ├── ARCHITECTURE.md       # Technical architecture
│   ├── API.md                # API endpoints
│   ├── DATABASE.md           # Database schema
│   ├── DEPLOYMENT.md         # Deployment guide
│   └── CHANGELOG.md          # Version history
├── docker-compose.yml         # Docker orchestration
├── Dockerfile.backend         # Backend container
├── Dockerfile.frontend        # Frontend container
├── start.bat                  # Windows launch script
├── start.sh                   # Linux/macOS launch script
├── package.json               # Root package.json
├── requirements.txt           # Dependency reference
├── README.md                  # Project documentation
└── .gitignore                 # Git ignore patterns
```

## 📚 Documentation

Each project includes comprehensive documentation:

- **README.md** - Project overview, features, setup instructions
- **docs/ARCHITECTURE.md** - Technical architecture, design decisions, patterns
- **docs/API.md** - Complete API reference with examples
- **docs/DATABASE.md** - Database schema, ER diagrams, relationships
- **docs/DEPLOYMENT.md** - Deployment guide, environment setup, production checklist
- **docs/CHANGELOG.md** - Version history and changes

## 🤝 Contributing

This is a portfolio project demonstrating full-stack development skills. While contributions are welcome, the primary purpose is to showcase:

- **Full-Stack Development:** Frontend and backend integration
- **Type Safety:** TypeScript across the stack
- **Security Best Practices:** Authentication, authorization, data protection
- **Scalable Architecture:** Layered design, separation of concerns
- **Modern Tooling:** Vite, Prisma, Docker, etc.

## 📄 License

MIT License - See [LICENSE](LICENSE) file for details.

---

**Built with ❤️ using modern web technologies**
