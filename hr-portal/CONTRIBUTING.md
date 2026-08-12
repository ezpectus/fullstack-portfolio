# Contributing to HR Portal

## Development Setup

1. Fork and clone the repository
2. Follow setup instructions in [README.md](README.md)
3. Create a feature branch: `git checkout -b feat/your-feature`

## Code Style

- **TypeScript**: Strict mode, no implicit any
- **ESLint**: `npm run lint` — zero warnings
- **Prettier**: `npm run format` — consistent formatting
- **Commits**: Conventional format — `type(scope): message`
  - Types: `feat`, `fix`, `refactor`, `test`, `docs`, `chore`, `style`
  - Example: `feat(leave): add leave balance auto-calculation`

## Testing

- Backend: `cd backend && npm test`
- Frontend: `cd frontend && npm test`
- Maintain at least 70% coverage for backend, 50% for frontend

## Pull Request Checklist

- [ ] Tests pass
- [ ] Lint passes
- [ ] Build succeeds
- [ ] Documentation updated (if needed)
- [ ] No new dependencies without justification

## Project Structure

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for architecture details.

## License

MIT — see [LICENSE](LICENSE)
