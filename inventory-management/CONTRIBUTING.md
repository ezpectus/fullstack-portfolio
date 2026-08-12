# Contributing to Inventory Management System

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/your-username/portfolio-series.git`
3. Navigate to the project: `cd portfolio-series/inventory-management`
4. Install dependencies: `npm run install:all`
5. Copy environment: `cp .env.example .env`
6. Run migrations: `cd backend && npx prisma migrate dev && cd ..`
7. Seed database: `cd backend && npx prisma db seed && cd ..`
8. Start dev servers: `npm run dev`

## Development Workflow

### Branch Naming

- `feat/` — new features (e.g., `feat/barcode-generation`)
- `fix/` — bug fixes (e.g., `fix/stock-calculation`)
- `docs/` — documentation changes
- `refactor/` — code refactoring
- `test/` — adding tests

### Commit Format

Follow conventional commits:

```
<type>(<scope>): <subject>

<body>

<footer>
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

Example: `feat(products): add barcode generation endpoint`

### Pull Requests

1. Create a branch from `main`
2. Make your changes
3. Ensure tests pass: `npm test`
4. Ensure linting passes: `npm run lint`
5. Create a PR with a clear description

### Code Style

- **TypeScript**: strict mode, no `any` types
- **Backend**: feature-based modules (controller → service → repository)
- **Frontend**: feature-based components, React Query for server state
- **Validation**: Zod schemas for all inputs
- **Testing**: Vitest + Supertest for backend, Vitest for frontend

### Project Structure

```
inventory-management/
├── backend/              ← Node.js + Express + TypeScript
├── frontend/             ← React + Vite + TailwindCSS
├── docs/                 ← Architecture, API, Database docs
├── docker-compose.yml    ← Full stack: app + db + redis
└── start.bat / start.sh  ← Launch scripts
```

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
