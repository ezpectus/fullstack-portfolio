# Contributing to URL Shortener

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/your-username/url-shortener.git`
3. Install dependencies: `npm install && cd backend && npm install && cd ../frontend && npm install`
4. Copy `.env.example` to `.env` and configure your environment
5. Run migrations: `cd backend && npx prisma migrate dev`
6. Start dev servers: `npm run dev`

## Development

### Code Style

- Follow existing TypeScript conventions
- Use Prettier for formatting: `npm run format`
- Use ESLint for linting: `npm run lint`
- No `any` types — use proper TypeScript types
- Feature-based modules: each feature gets its own folder in `modules/`

### Commit Format

```
type(scope): message

Types: feat, fix, refactor, test, docs, chore, style
Example: feat(links): add custom alias support
```

### Testing

- Write unit tests for service/repository layers
- Write integration tests for API endpoints
- Run tests: `npm test`

### Pull Requests

1. Create a feature branch: `git checkout -b feat/your-feature`
2. Make your changes
3. Ensure tests pass: `npm test`
4. Ensure linting passes: `npm run lint`
5. Submit a pull request with a clear description

## Project Structure

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for detailed architecture information.
