# Database Documentation — Booking System

## Table of Contents

- [Overview](#overview)
- [Connection](#connection)
- [Schema](#schema)
  - [Enums](#enums)
  - [Models](#models)
    - [User](#user)
    - [RefreshToken](#refreshtoken)
    - [ServiceCategory](#servicecategory)
    - [Service](#service)
    - [Provider](#provider)
    - [ServiceProvider](#serviceprovider)
    - [WorkingHours](#workinghours)
    - [TimeOff](#timeoff)
    - [Customer](#customer)
    - [Booking](#booking)
    - [Notification](#notification)
    - [BusinessSettings](#businesssettings)
- [Migrations](#migrations)
- [Redis Usage](#redis-usage)

## Overview

PostgreSQL 16 database managed by Prisma ORM 5.

## Connection

```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/booking_system?schema=public
```

## Schema

### Enums

| Enum | Values |
|---|---|
| `Role` | `ADMIN`, `PROVIDER` |
| `BookingStatus` | `PENDING`, `CONFIRMED`, `COMPLETED`, `CANCELLED`, `NO_SHOW` |
| `NotificationType` | `CONFIRMATION`, `REMINDER`, `CANCELLATION` |
| `NotificationStatus` | `PENDING`, `SENT`, `FAILED` |

### Models

#### User
| Field | Type | Constraints |
|---|---|---|
| id | String (UUID) | PK, default uuid() |
| email | String | Unique |
| password | String | bcrypt hashed |
| name | String | |
| role | Role | Default PROVIDER |
| createdAt | DateTime | Default now() |
| updatedAt | DateTime | @updatedAt |

**Relations**: refreshTokens, provider (1:1), bookings (1:N)

#### RefreshToken
| Field | Type | Constraints |
|---|---|---|
| id | String (UUID) | PK |
| token | String | Unique |
| userId | String | FK → User |
| expiresAt | DateTime | |
| revokedAt | DateTime? | |
| createdAt | DateTime | Default now() |

**Indexes**: userId

#### ServiceCategory
| Field | Type | Constraints |
|---|---|---|
| id | String (UUID) | PK |
| name | String | |
| slug | String | Unique |
| createdAt | DateTime | Default now() |

**Relations**: services (1:N)

#### Service
| Field | Type | Constraints |
|---|---|---|
| id | String (UUID) | PK |
| name | String | |
| description | String? | |
| duration | Int | Minutes (15/30/60/90) |
| price | Float | Default 0 |
| isActive | Boolean | Default true |
| categoryId | String? | FK → ServiceCategory |
| createdAt | DateTime | Default now() |
| updatedAt | DateTime | @updatedAt |

**Indexes**: categoryId, isActive

**Relations**: category, providers (M:N via ServiceProvider), bookings (1:N)

#### Provider
| Field | Type | Constraints |
|---|---|---|
| id | String (UUID) | PK |
| userId | String | Unique, FK → User |
| bio | String? | |
| isActive | Boolean | Default true |
| createdAt | DateTime | Default now() |
| updatedAt | DateTime | @updatedAt |

**Indexes**: isActive

**Relations**: user (1:1), services (M:N), workingHours (1:N), timeOffs (1:N), bookings (1:N)

#### ServiceProvider (Join Table)
| Field | Type | Constraints |
|---|---|---|
| id | String (UUID) | PK |
| serviceId | String | FK → Service |
| providerId | String | FK → Provider |

**Unique**: [serviceId, providerId]

#### WorkingHours
| Field | Type | Constraints |
|---|---|---|
| id | String (UUID) | PK |
| providerId | String | FK → Provider |
| dayOfWeek | Int | 0-6 (Sun-Sat) |
| startTime | String | HH:mm format |
| endTime | String | HH:mm format |
| isBreak | Boolean | Default false |

**Indexes**: providerId

#### TimeOff
| Field | Type | Constraints |
|---|---|---|
| id | String (UUID) | PK |
| providerId | String | FK → Provider |
| startDate | DateTime | |
| endDate | DateTime | |
| reason | String? | |

**Indexes**: providerId

#### Customer
| Field | Type | Constraints |
|---|---|---|
| id | String (UUID) | PK |
| name | String | |
| email | String | |
| phone | String? | |
| notes | String? | |
| createdAt | DateTime | Default now() |
| updatedAt | DateTime | @updatedAt |

**Indexes**: email

**Relations**: bookings (1:N)

#### Booking
| Field | Type | Constraints |
|---|---|---|
| id | String (UUID) | PK |
| bookingNumber | String | Unique (BK-XXXXXX) |
| serviceId | String | FK → Service |
| providerId | String | FK → Provider |
| customerId | String | FK → Customer |
| status | BookingStatus | Default PENDING |
| startTime | DateTime | |
| endTime | DateTime | |
| price | Float | Default 0 |
| notes | String? | |
| cancelReason | String? | |
| createdAt | DateTime | Default now() |
| updatedAt | DateTime | @updatedAt |

**Indexes**: serviceId, providerId, customerId, status, startTime

**Relations**: service, provider, customer, notifications (1:N)

#### Notification
| Field | Type | Constraints |
|---|---|---|
| id | String (UUID) | PK |
| bookingId | String | FK → Booking |
| type | NotificationType | |
| status | NotificationStatus | Default PENDING |
| sentAt | DateTime? | |
| createdAt | DateTime | Default now() |

**Indexes**: bookingId

#### BusinessSettings
| Field | Type | Constraints |
|---|---|---|
| id | String (UUID) | PK |
| key | String | Unique |
| value | String | |
| createdAt | DateTime | Default now() |
| updatedAt | DateTime | @updatedAt |

## Migrations

```bash
# Create migration
npx prisma migrate dev --name <description>

# Apply migrations
npx prisma migrate deploy

# Reset database
npx prisma migrate reset

# Seed
npm run prisma:seed
```

## Redis Usage

Redis is used for:
- **Distributed lock** during booking creation to prevent race conditions
  - Key: `booking:lock:{providerId}:{startTimeISO}`
  - TTL: 10 seconds
  - Pattern: SET NX EX, then Lua script for safe deletion
