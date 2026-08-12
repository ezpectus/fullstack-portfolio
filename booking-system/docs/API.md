# API Documentation — Booking System

## Base URL

```
http://localhost:4000/api
```

## Authentication

All protected endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer <accessToken>
```

Refresh tokens are stored in httpOnly cookies.

## Endpoints

### Auth

| Method | Path | Description | Auth |
|---|---|---|---|
| POST | `/auth/register` | Register new user | No |
| POST | `/auth/login` | Login user | No |
| POST | `/auth/refresh` | Refresh access token (rate-limited) | No |
| POST | `/auth/logout` | Logout user | Yes |
| GET | `/auth/me` | Get current user | Yes |
| POST | `/auth/invite` | Invite user with role (admin only) | Yes (ADMIN) |

### Users (Admin only)

| Method | Path | Description | Auth |
|---|---|---|---|
| GET | `/users` | List users (paginated) | Admin |
| GET | `/users/:id` | Get user by ID | Admin |
| PATCH | `/users/:id` | Update user | Admin |
| DELETE | `/users/:id` | Delete user | Admin |

### Services

| Method | Path | Description | Auth |
|---|---|---|---|
| GET | `/services` | List services (paginated, searchable) | Yes |
| GET | `/services/:id` | Get service detail | Yes |
| POST | `/services` | Create service | Admin |
| PATCH | `/services/:id` | Update service | Admin |
| DELETE | `/services/:id` | Delete service | Admin |

### Providers

| Method | Path | Description | Auth |
|---|---|---|---|
| GET | `/providers` | List providers (paginated, filterable) | Yes |
| GET | `/providers/:id` | Get provider detail | Yes |
| POST | `/providers` | Create provider | Admin |
| PATCH | `/providers/:id` | Update provider (services, working hours) | Admin |
| DELETE | `/providers/:id` | Delete provider | Admin |

### Bookings

| Method | Path | Description | Auth |
|---|---|---|---|
| GET | `/bookings` | List bookings (filterable by status, provider, service, customer, date range) | Yes |
| GET | `/bookings/:id` | Get booking detail | Yes |
| POST | `/bookings` | Create booking (Redis lock + conflict check) | Yes |
| PATCH | `/bookings/:id/status` | Update booking status | Yes |
| DELETE | `/bookings/:id` | Delete booking | Yes |

### Schedule

| Method | Path | Description | Auth |
|---|---|---|---|
| GET | `/schedule/:providerId` | Get provider schedule (working hours, time offs, bookings) | Yes |
| GET | `/schedule/:providerId/slots` | Get available slots for date + service | Yes |
| POST | `/schedule/block` | Block time slots | Yes |
| DELETE | `/schedule/block/:id` | Unblock time slots | Yes |

### Customers

| Method | Path | Description | Auth |
|---|---|---|---|
| GET | `/customers` | List customers (paginated, searchable) | Yes |
| GET | `/customers/:id` | Get customer with booking history | Yes |
| POST | `/customers` | Create customer | Yes |
| PATCH | `/customers/:id` | Update customer | Yes |
| DELETE | `/customers/:id` | Delete customer | Yes |

### Notifications

| Method | Path | Description | Auth |
|---|---|---|---|
| GET | `/notifications` | List notifications (filterable by status) | Yes |
| POST | `/notifications/send` | Send notification email | Yes |

### Dashboard

| Method | Path | Description | Auth |
|---|---|---|---|
| GET | `/dashboard/overview` | Dashboard stats (counts, revenue, no-show rate) | Yes |
| GET | `/dashboard/bookings-by-day` | Bookings grouped by day (last 30 days) | Yes |
| GET | `/dashboard/top-services` | Top 5 services by booking count | Yes |
| GET | `/dashboard/top-providers` | Top 5 providers by booking count | Yes |
| GET | `/dashboard/upcoming` | Upcoming bookings | Yes |

### Settings

| Method | Path | Description | Auth |
|---|---|---|---|
| GET | `/settings` | Get all business settings | Yes |
| GET | `/settings/:key` | Get setting by key | Yes |
| PATCH | `/settings` | Update single setting | Admin |
| PATCH | `/settings/bulk` | Bulk update settings | Admin |
| DELETE | `/settings/:key` | Delete setting | Admin |

### Health

| Method | Path | Description | Auth |
|---|---|---|---|
| GET | `/health` | Health check | No |

## Error Responses

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

### Error Codes

| Code | Status | Description |
|---|---|---|
| `VALIDATION_ERROR` | 400 | Invalid input data |
| `BAD_REQUEST` | 400 | Bad request |
| `UNAUTHORIZED` | 401 | Authentication required or invalid |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `CONFLICT` | 409 | Resource conflict (e.g., double booking) |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |
| `INTERNAL_SERVER_ERROR` | 500 | Unexpected server error |

## Rate Limiting

- Auth endpoints: 5 requests per 15 minutes per IP
- General API: 100 requests per 15 minutes per IP
- Rate limited responses return `429 Too Many Requests`

## Swagger

Interactive API docs available at: `http://localhost:4000/api-docs`

## Pagination

List endpoints support pagination via query parameters:

- `page` — Page number (default: 1)
- `limit` — Items per page (default: 20, max: 100)
- `search` — Search term
- `sortBy` — Sort field
- `sortOrder` — `asc` or `desc`

Response includes pagination metadata:

```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```
