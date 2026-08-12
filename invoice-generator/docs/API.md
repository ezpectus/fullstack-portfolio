# API Documentation — Invoice Generator

## Base URL

```
http://localhost:4000/api
```

## Authentication

The API uses JWT access and refresh tokens. Access tokens are short-lived (15 minutes). Refresh tokens are stored in httpOnly cookies and can also be provided in the request body.

All protected endpoints require a Bearer token in the `Authorization` header:

```
Authorization: Bearer <accessToken>
```

## Endpoints

### Auth

| Method | Path | Description | Auth | Rate Limited |
|---|---|---|---|---|
| POST | `/auth/register` | Register a new user (Owner/Accountant/Viewer) | No | Yes (5/15min) |
| POST | `/auth/login` | Login and get tokens | No | Yes (5/15min) |
| POST | `/auth/refresh` | Refresh access token (cookie or body) | No | Yes (5/15min) |
| POST | `/auth/logout` | Logout and revoke refresh token | Yes | Yes (5/15min) |
| GET | `/auth/me` | Get current user | Yes | No |

### Users

| Method | Path | Description | Roles |
|---|---|---|---|
| GET | `/users` | List users (paginated) | Owner |
| GET | `/users/:id` | Get user by ID | Owner, self |
| PATCH | `/users/:id` | Update user | Owner, self |
| DELETE | `/users/:id` | Delete user | Owner |

### Company Profile

| Method | Path | Description | Roles |
|---|---|---|---|
| GET | `/company` | Get company profile | All auth |
| PATCH | `/company` | Update company profile | Owner |
| POST | `/company/logo` | Upload company logo | Owner |

### Clients

| Method | Path | Description | Roles |
|---|---|---|---|
| GET | `/clients` | List clients (paginated, searchable) | All auth |
| GET | `/clients/:id` | Get client by ID with invoice history | All auth |
| GET | `/clients/:id/balance` | Get client billing balance | All auth |
| POST | `/clients` | Create client | Owner, Accountant |
| PATCH | `/clients/:id` | Update client | Owner, Accountant |
| DELETE | `/clients/:id` | Delete client | Owner |

### Invoices

| Method | Path | Description | Roles |
|---|---|---|---|
| GET | `/invoices` | List invoices (paginated, filterable) | All auth |
| GET | `/invoices/:id` | Get invoice by ID | All auth |
| POST | `/invoices` | Create invoice (draft) | Owner, Accountant |
| PATCH | `/invoices/:id` | Update invoice (draft only) | Owner, Accountant |
| PATCH | `/invoices/:id/status` | Update invoice status | Owner, Accountant |
| DELETE | `/invoices/:id` | Delete invoice (draft only) | Owner, Accountant |
| GET | `/invoices/:id/pdf` | Download invoice as PDF | All auth |
| POST | `/invoices/:id/email` | Send invoice via email | Owner, Accountant |

### Templates

| Method | Path | Description | Roles |
|---|---|---|---|
| GET | `/templates` | List templates | All auth |
| GET | `/templates/:id` | Get template by ID | All auth |
| POST | `/templates` | Create template | Owner, Accountant |
| PATCH | `/templates/:id` | Update template | Owner, Accountant |
| DELETE | `/templates/:id` | Delete template | Owner, Accountant |

### Reports

| Method | Path | Description | Roles |
|---|---|---|---|
| GET | `/reports/revenue` | Revenue report with date range | Owner, Accountant |
| GET | `/reports/overdue` | Overdue invoices | Owner, Accountant |
| GET | `/reports/top-clients` | Top clients by revenue | Owner, Accountant |
| GET | `/reports/export` | Export reports to CSV | Owner, Accountant |

### Dashboard

| Method | Path | Description | Roles |
|---|---|---|---|
| GET | `/dashboard` | Dashboard statistics | All auth |

## Query Parameters

### Pagination

All list endpoints support:

- `page` (number, default: 1)
- `limit` (number, default: 20, max: 100)
- `search` (string, optional)
- `sortBy` (string, optional)
- `sortOrder` (string, `asc` or `desc`, default: `desc`)

### Invoice Filters

- `status` — `DRAFT`, `SENT`, `PAID`, `OVERDUE`, `CANCELLED`
- `clientId` — UUID
- `startDate`, `endDate` — ISO date range
- `sortBy` — `number`, `issueDate`, `dueDate`, `total`, `createdAt`

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
| `NOT_FOUND` | 404 | Resource not found |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |
| `INTERNAL_SERVER_ERROR` | 500 | Unexpected server error |

## Rate Limiting

- Auth endpoints: 5 requests per 15 minutes per IP
- General API: 100 requests per 15 minutes per IP
- Rate limited responses return `429 Too Many Requests`

## Swagger

Interactive API docs available at: `http://localhost:4000/api-docs`
