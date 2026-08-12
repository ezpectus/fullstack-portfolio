# API Reference — HR Portal

## Base URL

```
http://localhost:4000/api
```

## Authentication

All protected endpoints require a Bearer token:

```
Authorization: Bearer <accessToken>
```

## Endpoints

### Auth

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| POST | `/auth/register` | Register new user (returns tokens) | No |
| POST | `/auth/login` | Login | No |
| POST | `/auth/refresh` | Refresh access token | No |
| POST | `/auth/logout` | Logout (rate-limited) | Yes |
| GET | `/auth/me` | Get current user | Yes |
| POST | `/auth/invite` | Invite user with role (HR_ADMIN only) | Yes (HR_ADMIN) |

### Users

| Method | Path | Description | Roles |
|--------|------|-------------|-------|
| GET | `/users` | List users (paginated) | HR_ADMIN |
| GET | `/users/:id` | Get user by ID | HR_ADMIN, self |
| PATCH | `/users/:id` | Update user | HR_ADMIN, self |
| DELETE | `/users/:id` | Delete user | HR_ADMIN |

### Employees

| Method | Path | Description | Roles |
|--------|------|-------------|-------|
| GET | `/employees` | List employees (paginated, search, filter) | HR_ADMIN, MANAGER |
| GET | `/employees/:id` | Get employee detail | HR_ADMIN, MANAGER, self |
| POST | `/employees` | Create employee | HR_ADMIN |
| PATCH | `/employees/:id` | Update employee | HR_ADMIN |
| DELETE | `/employees/:id` | Delete employee | HR_ADMIN |
| GET | `/employees/org-tree` | Get org structure tree | HR_ADMIN, MANAGER |
| GET | `/employees/:id/history` | Get position/department history | HR_ADMIN |

### Departments

| Method | Path | Description | Roles |
|--------|------|-------------|-------|
| GET | `/departments` | List departments | All |
| GET | `/departments/:id` | Get department detail | All |
| POST | `/departments` | Create department | HR_ADMIN |
| PATCH | `/departments/:id` | Update department | HR_ADMIN |
| DELETE | `/departments/:id` | Delete department | HR_ADMIN |

### Leave

| Method | Path | Description | Roles |
|--------|------|-------------|-------|
| GET | `/leave` | List leave requests (paginated) | All |
| GET | `/leave/:id` | Get leave request detail | All |
| POST | `/leave` | Create leave request | EMPLOYEE, MANAGER |
| PATCH | `/leave/:id/approve` | Approve leave request | MANAGER, HR_ADMIN |
| PATCH | `/leave/:id/reject` | Reject leave request | MANAGER, HR_ADMIN |
| GET | `/leave/balance/:employeeId` | Get leave balance | All (self or HR) |
| GET | `/leave/types` | List leave types | All |
| GET | `/leave/calendar` | Get leave calendar (by department) | All |

### Payroll

| Method | Path | Description | Roles |
|--------|------|-------------|-------|
| GET | `/payroll` | List payslips (paginated) | HR_ADMIN, self |
| GET | `/payroll/:id` | Get payslip detail | HR_ADMIN, self |
| POST | `/payroll` | Create payslip | HR_ADMIN |
| PATCH | `/payroll/:id/approve` | Approve payslip | HR_ADMIN |
| PATCH | `/payroll/:id/pay` | Mark as paid | HR_ADMIN |
| GET | `/payroll/:id/pdf` | Download payslip PDF | HR_ADMIN, self |
| GET | `/payroll/fund` | Salary fund by department | HR_ADMIN |

### Documents

| Method | Path | Description | Roles |
|--------|------|-------------|-------|
| GET | `/documents` | List documents (paginated, filter by employee) | HR_ADMIN, self |
| GET | `/documents/:id` | Get document detail | HR_ADMIN, self |
| POST | `/documents` | Upload document | HR_ADMIN |
| POST | `/documents/generate` | Generate document from template | HR_ADMIN |
| GET | `/documents/:id/download` | Download document PDF | HR_ADMIN, self |
| DELETE | `/documents/:id` | Delete document | HR_ADMIN |
| GET | `/documents/types` | List document types | All |

### Notifications

| Method | Path | Description | Roles |
|--------|------|-------------|-------|
| GET | `/notifications` | List notifications | All |
| PATCH | `/notifications/:id/read` | Mark as read | All |

### Dashboard

| Method | Path | Description | Roles |
|--------|------|-------------|-------|
| GET | `/dashboard` | Overview stats | All |

### Reports

| Method | Path | Description | Roles |
|--------|------|-------------|-------|
| GET | `/reports/turnover` | Turnover rate | HR_ADMIN |
| GET | `/reports/salary-by-department` | Average salary by department | HR_ADMIN |
| GET | `/reports/leave-usage` | Leave usage report | HR_ADMIN |
| GET | `/reports/export` | Export CSV | HR_ADMIN |

## Pagination

All list endpoints support:

```
?page=1&limit=10&search=keyword
```

Response:

```json
{
  "data": [...],
  "total": 100,
  "page": 1,
  "limit": 10,
  "totalPages": 10
}
```

## Error Format

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Error description",
    "details": [{ "field": "email", "message": "Invalid email" }]
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

Interactive API docs available at: `http://localhost:4000/api/docs`
