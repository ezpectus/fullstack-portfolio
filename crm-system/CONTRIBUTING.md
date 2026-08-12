# Contributing to CRM System

Thank you for your interest in contributing! This project is part of a portfolio series.

## Development Setup

1. Clone the repository
2. Copy `.env.example` to `.env` and fill in your values
3. Run `npm install` in the root directory
4. Run `npm run db:migrate` to set up the database
5. Run `npm run db:seed` to seed initial data
6. Run `npm run dev` to start both backend and frontend

## Code Style

- **TypeScript:** strict mode, no `any` types
- **ESLint:** `eslint . --max-warnings 0` must pass
- **Prettier:** `npm run format` before committing
- **Naming:** camelCase for variables/functions, PascalCase for classes/types/interfaces

## Architecture

- **Feature-based modules:** each feature is a self-contained folder in `modules/`
- **3-layer pattern:** Controller → Service → Repository
- **Validation:** Zod schemas in DTO files, validated at controller boundary
- **Error handling:** centralized error middleware, typed error classes

## Commit Convention

```
type(scope): message
```

Types: `feat`, `fix`, `refactor`, `test`, `docs`, `chore`, `style`

Example: `feat(customers): add search and filter functionality`

## Pull Requests

1. Create a feature branch: `feat/crm-<feature>`
2. Make your changes
3. Ensure tests pass: `npm test`
4. Ensure lint passes: `npm run lint`
5. Create a PR with a clear description

## Testing

- **Unit tests:** Vitest — test individual functions/services
- **Integration tests:** Supertest — test API endpoints
- **Coverage:** minimum 70% backend, 50% frontend
