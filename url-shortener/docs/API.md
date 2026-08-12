# API Documentation — URL Shortener

## Base URL

```
http://localhost:4000/api
```

## Authentication

The API uses JWT access and refresh tokens. Access tokens are short-lived (15 minutes). Refresh tokens are stored in httpOnly cookies.

All protected endpoints require a Bearer token in the `Authorization` header:

```
Authorization: Bearer <accessToken>
```

## Endpoints

### Auth

| Method | Path | Description | Auth | Rate Limited |
|---|---|---|---|---|
| POST | `/auth/register` | Register new user | No | Yes (5/15min) |
| POST | `/auth/login` | Login | No | Yes (5/15min) |
| POST | `/auth/refresh` | Refresh access token | No | Yes (5/15min) |
| POST | `/auth/logout` | Logout and revoke refresh token | Yes | Yes (5/15min) |
| GET | `/auth/me` | Get current user (rate-limited) | Yes | Yes |

### Users

| Method | Path | Description | Auth |
|---|---|---|---|
| GET | `/users` | List users (admin only) | Yes (Admin) |
| GET | `/users/:id` | Get user by ID | Yes |
| PUT | `/users/:id` | Update user | Yes |
| DELETE | `/users/:id` | Delete user (admin only) | Yes (Admin) |

### Links

| Method | Path | Description | Auth |
|---|---|---|---|
| GET | `/links` | List user's links (paginated, search, filter) | Yes |
| POST | `/links` | Create short link | Yes |
| POST | `/links/bulk` | Bulk create from URL array | Yes |
| GET | `/links/:id` | Get link detail | Yes |
| PUT | `/links/:id` | Update link | Yes |
| DELETE | `/links/:id` | Delete link | Yes |

### Redirect

| Method | Path | Description | Auth |
|---|---|---|---|
| GET | `/:code` | 301 redirect to original URL | No |

### QR Codes

| Method | Path | Description | Auth |
|---|---|---|---|
| GET | `/qr/:id` | Get QR code as data URL | Yes |
| GET | `/qr/:id/png` | Download QR as PNG | Yes |
| GET | `/qr/:id/svg` | Download QR as SVG | Yes |

### Analytics

| Method | Path | Description | Auth |
|---|---|---|---|
| GET | `/analytics` | Overall analytics | Yes |
| GET | `/analytics/:id` | Per-link analytics | Yes |

### API Keys

| Method | Path | Description | Auth |
|---|---|---|---|
| GET | `/api-keys` | List API keys | Yes |
| POST | `/api-keys` | Create API key | Yes |
| DELETE | `/api-keys/:id` | Revoke API key | Yes |

### Dashboard

| Method | Path | Description | Auth |
|---|---|---|---|
| GET | `/dashboard` | Dashboard stats | Yes |

### Settings

| Method | Path | Description | Auth |
|---|---|---|---|
| GET | `/settings` | Get user settings | Yes |
| PUT | `/settings` | Update settings | Yes |

## Query Parameters

### List Links

| Param | Type | Default | Description |
|---|---|---|---|
| `page` | number | 1 | Page number |
| `limit` | number | 20 | Items per page |
| `search` | string | — | Search by URL or short code |
| `status` | string | — | Filter by status (active/expired/disabled/archived) |
| `sort` | string | createdAt | Sort field |
| `order` | string | desc | Sort order (asc/desc) |

### Analytics

- `period` — `24h`, `7d`, `30d`, `90d`
- `groupBy` — `day`, `week`, `month`

### Redirect

The redirect endpoint does not require authentication. It checks Redis cache first, then falls back to the database. Click metadata (IP, user-agent, referer, country) is recorded asynchronously.

## Response Format

All successful responses follow the format:

```json
{
  "data": {},
  "message": "Success"
}
```

Paginated responses include:

```json
{
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

## Error Format

All errors follow this format:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable message",
    "details": {}
  }
}
```

### Common Error Codes

| Code | Status | Description |
|---|---|---|
| `VALIDATION_ERROR` | 400 | Invalid input data |
| `UNAUTHORIZED` | 401 | Authentication required or invalid |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Short link not found |
| `ALIAS_TAKEN` | 409 | Custom alias already in use |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |
| `INTERNAL_SERVER_ERROR` | 500 | Unexpected server error |

## Rate Limiting

- Auth endpoints: 5 requests per 15 minutes per IP
- General API: 100 requests per 15 minutes per IP
- Redirect endpoint has its own limit to prevent abuse
- Rate limited responses return `429 Too Many Requests`

## Swagger

Interactive API docs available at: `http://localhost:4000/api-docs`
