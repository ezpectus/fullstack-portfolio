# API Documentation — Inventory Management System

## Base URL

```
http://localhost:4000
```

## Authentication

The API uses JWT access and refresh tokens. Access tokens are short-lived (15 minutes). Refresh tokens are stored in httpOnly cookies.

All protected endpoints require a Bearer token in the `Authorization` header:

```
Authorization: Bearer <access_token>
```

## Endpoints

### Auth

| Method | Endpoint | Description | Auth | Rate Limited |
|---|---|---|---|---|---|
| POST | `/auth/register` | Register a new user (STAFF role) | Public | Yes (5/15min) |
| POST | `/auth/login` | Login and receive tokens | Public | Yes (5/15min) |
| POST | `/auth/refresh` | Refresh access token (httpOnly cookie) | Refresh token | Yes (5/15min) |
| POST | `/auth/logout` | Logout (revoke refresh token) | Required | Yes (5/15min) |
| GET | `/auth/me` | Get current user info | Required | No |

### Users

| Method | Endpoint | Description | Roles |
|---|---|---|---|
| GET | `/users` | List users (paginated) | ADMIN |
| GET | `/users/:id` | Get user by ID | ADMIN |
| POST | `/users` | Create user | ADMIN |
| PATCH | `/users/:id` | Update user | ADMIN |
| DELETE | `/users/:id` | Delete user | ADMIN |

### Products

| Method | Endpoint | Description | Roles |
|---|---|---|---|
| GET | `/products` | List products (search, filter, paginate) | All |
| GET | `/products/:id` | Get product detail with movements | All |
| POST | `/products` | Create product | ADMIN, MANAGER |
| PATCH | `/products/:id` | Update product | ADMIN, MANAGER |
| DELETE | `/products/:id` | Delete product | ADMIN |
| GET | `/products/:id/barcode` | Get barcode image | All |

### Categories

| Method | Endpoint | Description | Roles |
|---|---|---|---|
| GET | `/categories` | List categories (tree) | All |
| GET | `/categories/:id` | Get category detail | All |
| POST | `/categories` | Create category | ADMIN, MANAGER |
| PATCH | `/categories/:id` | Update category | ADMIN, MANAGER |
| DELETE | `/categories/:id` | Delete category | ADMIN |

### Warehouses

| Method | Endpoint | Description | Roles |
|---|---|---|---|
| GET | `/warehouses` | List warehouses | All |
| GET | `/warehouses/:id` | Get warehouse with stock levels | All |
| POST | `/warehouses` | Create warehouse | ADMIN |
| PATCH | `/warehouses/:id` | Update warehouse | ADMIN |
| DELETE | `/warehouses/:id` | Delete warehouse | ADMIN |

### Stock Movements

| Method | Endpoint | Description | Roles |
|---|---|---|---|
| GET | `/stock-movements` | List movements (filter by product, warehouse, type) | All |
| GET | `/stock-movements/:id` | Get movement detail | All |
| POST | `/stock-movements` | Create movement (in/out/transfer/adjustment) | All |

### Suppliers

| Method | Endpoint | Description | Roles |
|---|---|---|---|
| GET | `/suppliers` | List suppliers | All |
| GET | `/suppliers/:id` | Get supplier detail | All |
| POST | `/suppliers` | Create supplier | ADMIN, MANAGER |
| PATCH | `/suppliers/:id` | Update supplier | ADMIN, MANAGER |
| DELETE | `/suppliers/:id` | Delete supplier | ADMIN |

### Purchase Orders

| Method | Endpoint | Description | Roles |
|---|---|---|---|
| GET | `/purchase-orders` | List POs (filter by status) | ADMIN, MANAGER |
| GET | `/purchase-orders/:id` | Get PO detail with items | ADMIN, MANAGER |
| POST | `/purchase-orders` | Create PO (draft) | ADMIN, MANAGER |
| PATCH | `/purchase-orders/:id` | Update PO | ADMIN, MANAGER |
| PATCH | `/purchase-orders/:id/send` | Send PO to supplier | ADMIN, MANAGER |
| PATCH | `/purchase-orders/:id/receive` | Receive PO → auto stock movement | ADMIN, MANAGER |
| DELETE | `/purchase-orders/:id` | Delete PO (draft only) | ADMIN, MANAGER |

### Dashboard

| Method | Endpoint | Description | Roles |
|---|---|---|---|
| GET | `/dashboard/stats` | Aggregate inventory statistics | ADMIN, MANAGER |
| GET | `/dashboard/low-stock` | Low-stock alert items | ADMIN, MANAGER |
| GET | `/dashboard/movements-chart` | Movements over time | ADMIN, MANAGER |

### Export

| Method | Endpoint | Description | Roles |
|---|---|---|---|
| GET | `/export/products` | Export products CSV | ADMIN, MANAGER |
| GET | `/export/stock` | Export stock levels CSV | ADMIN, MANAGER |
| GET | `/export/movements` | Export movements CSV | ADMIN, MANAGER |
| GET | `/export/barcodes` | Export barcode labels PDF | ADMIN, MANAGER |

## Query Parameters

### Pagination

All list endpoints accept `page` (default 1), `limit` (default 20, max 100), `search`, `sortBy`, and `sortOrder` query parameters.

### Product Filters

- `categoryId` — filter by category
- `warehouseId` — filter by warehouse
- `isLowStock` — `true` or `false`

### Stock Movement Filters

- `productId` — UUID
- `warehouseId` — UUID
- `type` — `in`, `out`, `transfer`, `adjustment`

### Purchase Order Filters

- `status` — `draft`, `sent`, `received`, `cancelled`
- `supplierId` — UUID

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
  "data": [...],
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
| `INSUFFICIENT_STOCK` | 409 | Not enough stock for movement |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |
| `INTERNAL_SERVER_ERROR` | 500 | Unexpected server error |

## Rate Limiting

- Auth endpoints: 5 requests per 15 minutes per IP
- General API: 100 requests per 15 minutes per IP
- Rate limited responses return `429 Too Many Requests`

## Swagger

Interactive API docs available at: `http://localhost:4000/api-docs`
