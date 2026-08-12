# Contributing to Invoice Generator

Thank you for your interest in contributing! Please follow these guidelines:

## Development Setup

1. Fork and clone the repository
2. Run `cp .env.example .env` and configure environment variables
3. Run `npm install` in root, `backend/`, and `frontend/`
4. Run `cd backend && npx prisma migrate dev && npx prisma db seed`
5. Start dev servers: `npm run dev`

## Code Style

- TypeScript strict mode
- Feature-based module structure (controller → service → repository)
- Zod validation in DTOs, before service layer
- ESLint + Prettier — zero warnings allowed
- Conventional commits: `feat(scope): message`

## Testing

- Unit tests for DTOs, services, repositories (Vitest)
- Integration tests for routes (Supertest)
- Minimum 70% backend coverage, 50% frontend

## Pull Requests

1. Create a feature branch: `feat/invoice-<feature>`
2. Ensure tests pass: `npm test`
3. Ensure lint passes: `npm run lint`
4. Submit PR with description and checklist
