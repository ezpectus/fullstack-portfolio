# API Documentation

## Base URL

```
http://localhost:4000/api
```

## Authentication

All protected endpoints require a Bearer token:
```
Authorization: Bearer <accessToken>
```

### Auth Endpoints

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| POST | `/auth/register` | Register new user (PATIENT role only) | No |
| POST | `/auth/login` | Login | No |
| POST | `/auth/refresh` | Refresh access token (rate-limited) | No |
| POST | `/auth/logout` | Logout (revoke refresh token) | Yes |
| GET | `/auth/me` | Get current user | Yes |
| POST | `/auth/invite` | Invite user with specific role | ADMIN |

### Users

| Method | Path | Description | Roles |
|--------|------|-------------|-------|
| GET | `/users` | List users (paginated) | ADMIN |
| GET | `/users/:id` | Get user by ID | ADMIN, self |
| PATCH | `/users/:id` | Update user | ADMIN, self |
| DELETE | `/users/:id` | Delete user | ADMIN |

### Departments

| Method | Path | Description | Roles |
|--------|------|-------------|-------|
| GET | `/departments` | List departments | All auth |
| GET | `/departments/:id` | Get department | All auth |
| POST | `/departments` | Create department | ADMIN |
| PATCH | `/departments/:id` | Update department | ADMIN |
| DELETE | `/departments/:id` | Delete department | ADMIN |

### Doctors

| Method | Path | Description | Roles |
|--------|------|-------------|-------|
| GET | `/doctors` | List doctors (paginated, searchable) | All auth |
| GET | `/doctors/:id` | Get doctor detail | All auth |
| POST | `/doctors` | Create doctor profile | ADMIN |
| PATCH | `/doctors/:id` | Update doctor | ADMIN, DOCTOR (self) |
| DELETE | `/doctors/:id` | Delete doctor | ADMIN |

### Patients

| Method | Path | Description | Roles |
|--------|------|-------------|-------|
| GET | `/patients` | List patients (paginated, searchable) | ADMIN, DOCTOR, RECEPTIONIST |
| GET | `/patients/:id` | Get patient detail | ADMIN, DOCTOR, RECEPTIONIST, PATIENT (self) |
| POST | `/patients` | Create patient | ADMIN, RECEPTIONIST |
| PATCH | `/patients/:id` | Update patient | ADMIN, RECEPTIONIST, PATIENT (self) |
| DELETE | `/patients/:id` | Delete patient | ADMIN |

### Schedule

| Method | Path | Description | Roles |
|--------|------|-------------|-------|
| GET | `/schedule/:doctorId/working-hours` | Get doctor's working hours | All auth |
| POST | `/schedule/:doctorId/working-hours` | Add working hours | ADMIN, DOCTOR |
| PATCH | `/schedule/working-hours/:id` | Update working hours | ADMIN, DOCTOR |
| DELETE | `/schedule/working-hours/:id` | Delete working hours | ADMIN, DOCTOR |
| GET | `/schedule/:doctorId/time-off` | Get doctor's time off | All auth |
| POST | `/schedule/:doctorId/time-off` | Add time off | ADMIN, DOCTOR |
| DELETE | `/schedule/time-off/:id` | Delete time off | ADMIN, DOCTOR |
| GET | `/schedule/:doctorId/services` | Get doctor's services | All auth |
| POST | `/schedule/:doctorId/services` | Add service | ADMIN, DOCTOR |
| PATCH | `/schedule/services/:id` | Update service | ADMIN, DOCTOR |
| DELETE | `/schedule/services/:id` | Delete service | ADMIN, DOCTOR |

### Appointments

| Method | Path | Description | Roles |
|--------|------|-------------|-------|
| GET | `/appointments` | List appointments (filterable) | All auth |
| GET | `/appointments/:id` | Get appointment detail | All auth |
| POST | `/appointments` | Book appointment | ADMIN, RECEPTIONIST, PATIENT |
| PATCH | `/appointments/:id/status` | Update appointment status | ADMIN, DOCTOR, RECEPTIONIST |
| DELETE | `/appointments/:id` | Cancel appointment | ADMIN, RECEPTIONIST |

### Medical Records

| Method | Path | Description | Roles |
|--------|------|-------------|-------|
| GET | `/medical-records` | List medical records | ADMIN, DOCTOR |
| GET | `/medical-records/:id` | Get medical record | ADMIN, DOCTOR |
| GET | `/medical-records/appointment/:appointmentId` | Get by appointment | ADMIN, DOCTOR |
| POST | `/medical-records` | Create medical record | ADMIN, DOCTOR |
| PATCH | `/medical-records/:id` | Update medical record | ADMIN, DOCTOR |
| DELETE | `/medical-records/:id` | Delete medical record | ADMIN |

### Notifications

| Method | Path | Description | Roles |
|--------|------|-------------|-------|
| GET | `/notifications` | List user notifications | All auth |
| GET | `/notifications/unread-count` | Get unread count | All auth |
| PATCH | `/notifications/:id/read` | Mark as read | All auth |
| PATCH | `/notifications/mark-all-read` | Mark all as read | All auth |
| DELETE | `/notifications/:id` | Delete notification | All auth |

### Dashboard

| Method | Path | Description | Roles |
|--------|------|-------------|-------|
| GET | `/dashboard` | Get dashboard overview | All auth |

### Reports

| Method | Path | Description | Roles |
|--------|------|-------------|-------|
| GET | `/reports/appointments` | Appointment report | ADMIN, DOCTOR |
| GET | `/reports/patients` | Patient report | ADMIN |
| GET | `/reports/doctors` | Doctor report | ADMIN |
| GET | `/reports/revenue` | Revenue report | ADMIN |

## Error Format

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable message",
    "details": []
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
| `CONFLICT` | 409 | Resource conflict (e.g., slot already booked) |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |
| `INTERNAL_SERVER_ERROR` | 500 | Unexpected server error |

## Rate Limiting

- Auth endpoints: 5 requests per 15 minutes per IP
- General API: 100 requests per 15 minutes per IP
- Rate limited responses return `429 Too Many Requests`

## Swagger

Interactive API docs available at: `http://localhost:4000/api/docs`
