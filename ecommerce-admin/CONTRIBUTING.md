# Contributing to E-commerce Admin Panel

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/yourusername/ecommerce-admin.git`
3. Install dependencies: `npm run install:all`
4. Copy `.env.example` to `.env` and configure
5. Run database migrations: `npm run db:migrate`
6. Seed the database: `npm run db:seed`
7. Start dev server: `npm run dev`

## Development

### Project Structure

- `backend/` — Express + TypeScript API (standalone)
- `frontend/` — React + Vite SPA (standalone)
- Each module has: controller → service → repository → routes → dto

### Code Style

- TypeScript strict mode
- ESLint + Prettier enforced
- Feature-based module organization
- Zod validation on all endpoints
- Repository pattern over Prisma

### Commit Convention

```
type(scope): message

feat(products): add variant image upload
fix(orders): correct status transition validation
refactor(auth): simplify token refresh logic
```

### Testing

- Backend: `cd backend && npm test`
- Frontend: `cd frontend && npm test`
- All tests must pass before merging

### Pull Requests

1. Create a feature branch: `git checkout -b feat/your-feature`
2. Make your changes
3. Ensure tests pass: `npm test`
4. Ensure lint passes: `npm run lint`
5. Submit a PR with a clear description
