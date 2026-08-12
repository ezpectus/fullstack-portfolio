# Database Schema — Hospital Management

## Table of Contents

- [Overview](#overview)
- [Models](#models)
  - [User](#user)
  - [RefreshToken](#refreshtoken)
  - [Department](#department)
  - [Doctor](#doctor)
  - [Patient](#patient)
  - [Appointment](#appointment)
  - [MedicalRecord](#medicalrecord)
  - [WorkingHours](#workinghours)
  - [TimeOff](#timeoff)
  - [DoctorService](#doctorservice)
  - [Notification](#notification)
- [Relationships](#relationships)
- [Redis Usage](#redis-usage)

## Overview

PostgreSQL 16 database managed by Prisma ORM. Redis 7 for caching and distributed locks.

## Models

### User
| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| email | String | Unique email |
| password | String | Bcrypt hashed |
| name | String | Full name |
| role | Enum | ADMIN, DOCTOR, RECEPTIONIST, PATIENT |
| phone | String? | Phone number |
| avatar | String? | Avatar URL |
| isActive | Boolean | Account status |
| createdAt | DateTime | Creation timestamp |
| updatedAt | DateTime | Update timestamp |

### RefreshToken
| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| token | String | Unique token |
| userId | UUID | FK → User |
| expiresAt | DateTime | Expiry date |
| revokedAt | DateTime? | Revocation timestamp (null = active) |
| createdAt | DateTime | Creation timestamp |

### Department
| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| name | String | Department name |
| description | String? | Description |
| headDoctorId | UUID? | FK → Doctor |
| phone | String? | Contact phone |
| location | String? | Physical location |
| createdAt | DateTime | Creation timestamp |
| updatedAt | DateTime | Update timestamp |

### Doctor
| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| userId | UUID | FK → User |
| departmentId | UUID? | FK → Department |
| specialization | String | Medical specialization |
| bio | String? | Biography |
| consultationFee | Decimal | Fee per consultation |
| isActive | Boolean | Active status |
| createdAt | DateTime | Creation timestamp |
| updatedAt | DateTime | Update timestamp |

### Patient
| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| userId | UUID | FK → User |
| dateOfBirth | DateTime | Birth date |
| gender | Enum | MALE, FEMALE, OTHER |
| address | String? | Address |
| bloodType | Enum | A_POSITIVE, A_NEGATIVE, B_POSITIVE, B_NEGATIVE, AB_POSITIVE, AB_NEGATIVE, O_POSITIVE, O_NEGATIVE, UNKNOWN |
| allergies | String? | Known allergies |
| chronicConditions | String? | Chronic conditions |
| insuranceNumber | String? | Insurance number |
| emergencyContact | String? | Emergency contact |
| primaryDoctorId | UUID? | FK → Doctor |
| createdAt | DateTime | Creation timestamp |
| updatedAt | DateTime | Update timestamp |

### Appointment
| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| doctorId | UUID | FK → Doctor |
| patientId | UUID | FK → Patient |
| startTime | DateTime | Appointment start |
| endTime | DateTime | Appointment end |
| status | Enum | SCHEDULED, IN_PROGRESS, COMPLETED, CANCELLED, NO_SHOW |
| reason | String? | Visit reason |
| notes | String? | Additional notes |
| createdAt | DateTime | Creation timestamp |
| updatedAt | DateTime | Update timestamp |

### MedicalRecord
| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| appointmentId | UUID | Unique FK → Appointment |
| doctorId | UUID | FK → Doctor |
| patientId | UUID | FK → Patient |
| complaints | String? | Patient complaints |
| examination | String? | Examination findings |
| diagnosis | String? | Diagnosis |
| prescriptions | String? | Prescribed medications |
| epicrisis | String? | Epicrisis summary |
| attachments | String[] | File attachments |
| createdAt | DateTime | Creation timestamp |
| updatedAt | DateTime | Update timestamp |

### WorkingHours
| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| doctorId | UUID | FK → Doctor |
| dayOfWeek | Int | 0-6 (Sunday-Saturday) |
| startTime | String | HH:MM format |
| endTime | String | HH:MM format |
| isBreak | Boolean | Break period flag |

### TimeOff
| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| doctorId | UUID | FK → Doctor |
| startDate | DateTime | Time off start |
| endDate | DateTime | Time off end |
| reason | String? | Reason for time off |

### DoctorService
| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| doctorId | UUID | FK → Doctor |
| name | String | Service name |
| description | String? | Service description |
| duration | Int | Duration in minutes |
| price | Decimal | Service price |

### Notification
| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| userId | UUID | FK → User |
| type | Enum | APPOINTMENT_REMINDER, APPOINTMENT_CONFIRMED, APPOINTMENT_CANCELLED, MEDICAL_RECORD_UPDATED, WELCOME |
| title | String | Notification title |
| message | String | Notification message |
| isRead | Boolean | Read status |
| appointmentId | UUID? | FK → Appointment |
| createdAt | DateTime | Creation timestamp |

## Relationships

```
User 1───* RefreshToken
User 1───1 Doctor (role=DOCTOR)
User 1───1 Patient (role=PATIENT)
Department 1───* Doctor
Doctor 1───* WorkingHours
Doctor 1───* TimeOff
Doctor 1───* DoctorService
Doctor 1───* Appointment
Patient 1───* Appointment
Appointment 1───1 MedicalRecord
User 1───* Notification
Appointment 1───* Notification
```

## Redis Usage

- **Distributed lock** for appointment slot booking (`appointment:lock:{doctorId}:{date}`)
- **Rate limiting** storage
- **Token blacklist** for revoked refresh tokens
