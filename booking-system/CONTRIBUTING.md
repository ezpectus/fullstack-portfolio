# Contributing to Booking System

Thank you for your interest in contributing! Please follow these guidelines.

## Getting Started

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd booking-system
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```

3. **Set up environment**
   ```bash
   cp .env.example .env
   # Edit .env with your database and Redis credentials
   ```

4. **Run database migrations**
   ```bash
   npm run db:migrate
   ```

5. **Seed the database**
   ```bash
   npm run db:seed
   ```

6. **Start development servers**
   ```bash
   npm run dev
   ```

## Project Structure

```
booking-system/
├── backend/          # Node.js + Express API
│   ├── prisma/       # Database schema and seed
│   ├── src/
│   │   ├── config/   # Environment, DB, Redis, Swagger
│   │   ├── middleware/ # Auth, RBAC, validation, error handling
│   │   ├── modules/  # Feature-based modules
│   │   └── shared/   # Types, errors, utils, constants
│   └── tests/
├── frontend/         # React + Vite SPA
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── store/
│       ├── lib/
│       └── types/
├── docs/             # Architecture, API, Database docs
└── docker-compose.yml
```

## Code Style

- **TypeScript** strict mode everywhere
- **ESLint** + **Prettier** for formatting
- Feature-based modules: controller → service → repository
- Zod validation on all inputs
- Repository pattern over Prisma

## Commit Convention

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add booking conflict check
fix: prevent double booking with Redis lock
docs: update API documentation
refactor: extract schedule logic
test: add integration tests for bookings
```

## Testing

```bash
# Backend tests
cd backend && npm test

# Frontend tests
cd frontend && npm test
```

- Unit tests for services and repositories
- Integration tests for API routes
- All new features must include tests

## Pull Requests

1. Create a feature branch: `git checkout -b feat/your-feature`
2. Commit changes following conventional commits
3. Ensure tests pass: `npm test`
4. Ensure linting passes: `npm run lint`
5. Open a PR with a clear description of changes
