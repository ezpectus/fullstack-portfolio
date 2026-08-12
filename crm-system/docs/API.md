# API Documentation — CRM System

Base URL: `http://localhost:4000`

Swagger UI available at: `http://localhost:4000/api-docs`

## Authentication

All protected endpoints require a Bearer token:

```
Authorization: Bearer <access_token>
```

## Endpoints

### Auth

| Method | Path | Description | Auth | Rate Limited |
|---|---|---|---|---|
| POST | `/auth/register` | Register a new user | ❌ | ✅ 5/15min |
| POST | `/auth/login` | Login and get tokens | ❌ | ✅ 5/15min |
| POST | `/auth/refresh` | Refresh access token | Cookie | ✅ 5/15min |
| POST | `/auth/logout` | Logout (invalidate refresh) | ✅ | ✅ 5/15min |
| GET | `/auth/me` | Get current user | ✅ | ❌ |
| POST | `/auth/invite` | Invite a new user (Admin only) | ✅ Admin | ❌ |

### Users

| Method | Path | Description | Auth |
|---|---|---|---|
| GET | `/users` | List users (paginated) | ✅ Admin |
| GET | `/users/:id` | Get user by ID | ✅ |
| PUT | `/users/:id` | Update user | ✅ |
| DELETE | `/users/:id` | Delete user | ✅ Admin |

### Customers

| Method | Path | Description | Auth |
|---|---|---|---|
| GET | `/customers` | List customers (search, filter, paginate) | ✅ |
| GET | `/customers/:id` | Get customer by ID | ✅ |
| POST | `/customers` | Create customer | ✅ |
| PUT | `/customers/:id` | Update customer | ✅ |
| DELETE | `/customers/:id` | Delete customer | ✅ |
| GET | `/customers/:id/timeline` | Customer interaction timeline | ✅ |

### Deals

| Method | Path | Description | Auth |
|---|---|---|---|
| GET | `/deals` | List deals (filter by stage) | ✅ |
| GET | `/deals/:id` | Get deal by ID | ✅ |
| POST | `/deals` | Create deal | ✅ |
| PUT | `/deals/:id` | Update deal (including stage change) | ✅ |
| DELETE | `/deals/:id` | Delete deal | ✅ |
| GET | `/deals/kanban` | Get deals grouped by stage | ✅ |

### Notes

| Method | Path | Description | Auth |
|---|---|---|---|
| GET | `/notes` | List notes (filter by customer/deal) | ✅ |
| GET | `/notes/:id` | Get note by ID | ✅ |
| POST | `/notes` | Create note | ✅ |
| PUT | `/notes/:id` | Update note | ✅ |
| DELETE | `/notes/:id` | Delete note | ✅ |
| PATCH | `/notes/:id/pin` | Toggle pin status | ✅ |

### Dashboard

| Method | Path | Description | Auth |
|---|---|---|---|
| GET | `/dashboard/stats` | Overview metrics | ✅ |
| GET | `/dashboard/deals-by-stage` | Deals grouped by stage (chart data) | ✅ |
| GET | `/dashboard/new-customers` | New customers over time (chart data) | ✅ |
| GET | `/dashboard/recent-activity` | Recent activity feed | ✅ |

### Export

| Method | Path | Description | Auth |
|---|---|---|---|
| GET | `/export/customers` | Export customers to CSV | ✅ |
| GET | `/export/deals` | Export deals to CSV | ✅ |

## Pagination

List endpoints support pagination via query params:

```
GET /customers?page=1&limit=20&search=acme&status=active&tags=vip,enterprise
```

Response includes pagination metadata:

```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

## Error Format

```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Customer not found",
    "details": {}
  }
}
```

### Common Error Codes

| Code | Status | Description |
|---|---|---|
| `VALIDATION_ERROR` | 400 | Invalid input data |
| `BAD_REQUEST` | 400 | Bad request |
| `UNAUTHORIZED` | 401 | Authentication required or invalid |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `CONFLICT` | 409 | Resource conflict |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |
| `INTERNAL_SERVER_ERROR` | 500 | Unexpected server error |

## Rate Limiting

- Auth endpoints: 5 requests per 15 minutes per IP
- General API: 100 requests per 15 minutes per IP
- Rate limited responses return `429 Too Many Requests`

## Swagger

Interactive API docs available at: `http://localhost:4000/api-docs`
