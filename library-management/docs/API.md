# Library Management System — API Documentation

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
| POST | `/auth/register` | Register new user (MEMBER role) | No | Yes (5/15min) |
| POST | `/auth/login` | Login | No | Yes (5/15min) |
| POST | `/auth/refresh` | Refresh access token | Cookie | Yes (5/15min) |
| POST | `/auth/logout` | Logout (revoke refresh token) | Yes | Yes (5/15min) |
| GET | `/auth/me` | Get current user | Yes | No |
| POST | `/auth/invite` | Invite a new user (ADMIN only) | Yes (ADMIN) | No |

### Books

| Method | Path | Description | Auth |
|---|---|---|---|
| GET | `/books` | List books (paginated, search) | Yes |
| GET | `/books/:id` | Get book by ID | Yes |
| POST | `/books` | Create book | Admin/Librarian |
| PATCH | `/books/:id` | Update book | Admin/Librarian |
| DELETE | `/books/:id` | Delete book | Admin/Librarian |

### Book Copies

| Method | Path | Description | Auth |
|---|---|---|---|
| GET | `/book-copies` | List copies (paginated, filter) | Yes |
| GET | `/book-copies/:id` | Get copy by ID | Yes |
| POST | `/book-copies` | Create copy | Admin/Librarian |
| PATCH | `/book-copies/:id` | Update copy | Admin/Librarian |

### Members

| Method | Path | Description | Auth |
|---|---|---|---|
| GET | `/members` | List members (paginated) | Admin/Librarian |
| GET | `/members/:id` | Get member by ID | Admin/Librarian |
| PATCH | `/members/:id` | Update member | Admin/Librarian |
| GET | `/members/:id/loans` | Get member loans | Admin/Librarian |
| GET | `/members/:id/fines` | Get member fines | Admin/Librarian |

### Loans

| Method | Path | Description | Auth |
|---|---|---|---|
| GET | `/loans/my` | List current member's loans | Yes (Member) |
| GET | `/loans` | List loans (paginated, filter) | Admin/Librarian |
| GET | `/loans/:id` | Get loan by ID | Admin/Librarian |
| POST | `/loans` | Create loan (issue book) | Admin/Librarian |
| PATCH | `/loans/:id/return` | Return book | Admin/Librarian |
| PATCH | `/loans/:id/renew` | Renew loan | Admin/Librarian |

### Reservations

| Method | Path | Description | Auth |
|---|---|---|---|
| GET | `/reservations` | List reservations | Yes |
| GET | `/reservations/:id` | Get reservation | Yes |
| POST | `/reservations` | Create reservation | Yes |
| PATCH | `/reservations/:id/cancel` | Cancel reservation | Yes |
| PATCH | `/reservations/:id/fulfill` | Fulfill reservation | Admin/Librarian |

### Fines

| Method | Path | Description | Auth |
|---|---|---|---|
| GET | `/fines` | List fines (paginated) | Yes |
| GET | `/fines/:id` | Get fine by ID | Yes |
| PATCH | `/fines/:id/pay` | Mark fine as paid | Admin/Librarian |
| PATCH | `/fines/:id/waive` | Waive fine | Admin/Librarian |

### Dashboard

| Method | Path | Description | Auth |
|---|---|---|---|
| GET | `/dashboard` | Get dashboard stats | Yes |

### Reports

| Method | Path | Description | Auth |
|---|---|---|---|
| GET | `/reports/member-activity` | Member activity report | Admin/Librarian |
| GET | `/reports/popular-genres` | Popular genres report | Admin/Librarian |
| GET | `/reports/lost-damaged` | Lost/damaged books | Admin/Librarian |
| GET | `/reports/export` | Export CSV | Admin/Librarian |

## Query Parameters

### Pagination

All list endpoints support:

- `page` — page number (default: 1)
- `limit` — items per page (default: 20)
- `search` — search term
- `sortBy` — sort field
- `sortOrder` — `asc` or `desc`

### Book Filters

- `categoryId` — filter by category
- `isAvailable` — `true` or `false`

### Loan Filters

- `memberId` — UUID
- `status` — `active`, `returned`, `overdue`

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
  "items": [...],
  "total": 100,
  "page": 1,
  "limit": 20,
  "totalPages": 5
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
| `NOT_FOUND` | 404 | Resource not found |
| `BOOK_UNAVAILABLE` | 409 | Book copy not available |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |
| `INTERNAL_SERVER_ERROR` | 500 | Unexpected server error |

## Rate Limiting

- Auth endpoints: 5 requests per 15 minutes per IP
- General API: 100 requests per 15 minutes per IP
- Rate limited responses return `429 Too Many Requests`

## Swagger

Interactive API docs available at: `http://localhost:4000/api-docs`
