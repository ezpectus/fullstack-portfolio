# API Documentation — E-commerce Admin Panel

## Base URL

- Development: `http://localhost:4000/api`
- Production: `https://api.example.com/api`

## Authentication

The API uses JWT access and refresh tokens. Access tokens are short-lived (15 minutes). Refresh tokens are stored in httpOnly cookies.

All protected endpoints require a Bearer token in the `Authorization` header:

```
Authorization: Bearer <accessToken>
```

### Auth Endpoints

| Method | Path | Description | Auth | Rate Limited |
|---|---|---|---|---|
| POST | `/auth/register` | Register a new user (STAFF role) | No | Yes (5/15min) |
| POST | `/auth/login` | Login and receive tokens | No | Yes (5/15min) |
| POST | `/auth/refresh` | Refresh access token | Cookie | Yes (5/15min) |
| POST | `/auth/logout` | Logout and revoke refresh token | Yes | Yes (5/15min) |
| GET | `/auth/me` | Get current user profile | Yes | No |

### Users

| Method | Path | Description | Roles |
|---|---|---|---|
| GET | `/users` | List users (paginated) | super_admin |
| GET | `/users/:id` | Get user by ID | super_admin, self |
| POST | `/users` | Create user | super_admin |
| PATCH | `/users/:id` | Update user | super_admin, self |
| DELETE | `/users/:id` | Delete user | super_admin |

### Products

| Method | Path | Description | Roles |
|---|---|---|---|
| GET | `/products` | List products (paginated, search, filter) | All auth |
| GET | `/products/:id` | Get product by ID with variants | All auth |
| POST | `/products` | Create product with variants | super_admin, manager |
| PATCH | `/products/:id` | Update product | super_admin, manager |
| DELETE | `/products/:id` | Delete product | super_admin, manager |
| POST | `/products/bulk-import` | Bulk CSV import | super_admin, manager |
| GET | `/products/export` | Export products to CSV | super_admin, manager |

### Categories

| Method | Path | Description | Roles |
|---|---|---|---|
| GET | `/categories` | List categories (nested tree) | All auth |
| GET | `/categories/:id` | Get category detail | All auth |
| POST | `/categories` | Create category | super_admin, manager |
| PATCH | `/categories/:id` | Update category | super_admin, manager |
| DELETE | `/categories/:id` | Delete category | super_admin, manager |

### Orders

| Method | Path | Description | Roles |
|---|---|---|---|
| GET | `/orders` | List orders (paginated, filter by status) | All auth |
| GET | `/orders/:id` | Get order by ID with items | All auth |
| PATCH | `/orders/:id/status` | Update order status | super_admin, manager, staff |
| PATCH | `/orders/:id/cancel` | Cancel order | super_admin, manager |

### Customers

| Method | Path | Description | Roles |
|---|---|---|---|
| GET | `/customers` | List customers (paginated, search) | All auth |
| GET | `/customers/:id` | Get customer by ID with order history | All auth |
| POST | `/customers` | Create customer | super_admin, manager |
| PATCH | `/customers/:id` | Update customer | super_admin, manager |
| DELETE | `/customers/:id` | Delete customer | super_admin, manager |

### Promo Codes

| Method | Path | Description | Roles |
|---|---|---|---|
| GET | `/promo-codes` | List promo codes | All auth |
| GET | `/promo-codes/:id` | Get promo code detail | All auth |
| POST | `/promo-codes` | Create promo code | super_admin, manager |
| PATCH | `/promo-codes/:id` | Update promo code | super_admin, manager |
| PATCH | `/promo-codes/:id/toggle` | Toggle active state | super_admin, manager |
| DELETE | `/promo-codes/:id` | Delete promo code | super_admin, manager |

### Analytics

| Method | Path | Description | Roles |
|---|---|---|---|
| GET | `/analytics/summary` | Get analytics summary | super_admin, manager |
| GET | `/analytics/revenue` | Get revenue chart data | super_admin, manager |
| GET | `/analytics/top-products` | Get top selling products | super_admin, manager |
| GET | `/analytics/top-categories` | Get top categories | super_admin, manager |

### Dashboard

| Method | Path | Description | Roles |
|---|---|---|---|
| GET | `/dashboard/overview` | Get dashboard overview stats | All auth |

### Settings

| Method | Path | Description | Roles |
|---|---|---|---|
| GET | `/settings` | Get all settings | super_admin, manager |
| PATCH | `/settings/:key` | Update setting by key | super_admin |

## Query Parameters

### Pagination

All list endpoints support:

- `page` (number, default: 1)
- `limit` (number, default: 20, max: 100)
- `search` (string, optional)
- `sortBy` (string, optional)
- `sortOrder` (string, `asc` or `desc`, default: `desc`)

### Product Filters

- `categoryId` — filter by category
- `minPrice`, `maxPrice` — price range
- `isActive` — `true` or `false`

### Order Filters

- `status` — `pending`, `processing`, `shipped`, `delivered`, `cancelled`, `refunded`
- `customerId` — UUID
- `startDate`, `endDate` — date range

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
