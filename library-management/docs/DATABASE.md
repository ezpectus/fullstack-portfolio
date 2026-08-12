# Database Schema — Library Management System

## Table of Contents

- [Overview](#overview)
- [Enums](#enums)
- [Tables](#tables)
  - [User](#user)
  - [Category](#category)
  - [Book](#book)
  - [BookCopy](#bookcopy)
  - [Member](#member)
  - [Loan](#loan)
  - [Reservation](#reservation)
  - [Fine](#fine)
- [Relationships](#relationships)
- [Indexes](#indexes)

## Overview

PostgreSQL 16 with Prisma ORM 5. All tables use UUID primary keys.

## Enums

| Enum | Values |
|---|---|
| Role | ADMIN, LIBRARIAN, MEMBER |
| BookCopyStatus | AVAILABLE, BORROWED, RESERVED, LOST, DAMAGED |
| LoanStatus | ACTIVE, RETURNED, OVERDUE |
| ReservationStatus | PENDING, FULFILLED, CANCELLED, EXPIRED |
| FineStatus | PENDING, PAID, WAIVED |
| MemberStatus | ACTIVE, SUSPENDED, EXPIRED |

## Tables

### User
| Column | Type | Constraints |
|---|---|---|
| id | String (UUID) | PK |
| email | String | Unique |
| password | String | bcrypt hashed |
| name | String | |
| role | Role | Default: MEMBER |
| createdAt | DateTime | Default: now() |
| updatedAt | DateTime | Auto-updated |

### Category
| Column | Type | Constraints |
|---|---|---|
| id | String (UUID) | PK |
| name | String | |
| parentId | String? | FK → Category (self-relation) |

### Book
| Column | Type | Constraints |
|---|---|---|
| id | String (UUID) | PK |
| isbn | String | Unique |
| title | String | Indexed |
| authors | String | |
| publisher | String? | |
| publishYear | Int? | |
| genre | String? | |
| description | String? | |
| coverUrl | String? | |
| categoryId | String? | FK → Category, Indexed |

### BookCopy
| Column | Type | Constraints |
|---|---|---|
| id | String (UUID) | PK |
| bookId | String | FK → Book, Indexed |
| code | String | Unique |
| status | BookCopyStatus | Default: AVAILABLE, Indexed |
| condition | String | Default: "good" |
| acquiredAt | DateTime | Default: now() |

### Member
| Column | Type | Constraints |
|---|---|---|
| id | String (UUID) | PK |
| userId | String | FK → User, Unique |
| cardNumber | String | Unique |
| phone | String? | |
| address | String? | |
| status | MemberStatus | Default: ACTIVE |
| joinedAt | DateTime | Default: now() |

### Loan
| Column | Type | Constraints |
|---|---|---|
| id | String (UUID) | PK |
| bookCopyId | String | FK → BookCopy, Indexed |
| memberId | String | FK → Member, Indexed |
| librarianId | String? | FK → User, onDelete: SetNull |
| borrowedAt | DateTime | Default: now() |
| dueDate | DateTime | |
| returnedAt | DateTime? | |
| status | LoanStatus | Default: ACTIVE, Indexed |
| renewals | Int | Default: 0 |

### Reservation
| Column | Type | Constraints |
|---|---|---|
| id | String (UUID) | PK |
| memberId | String | FK → Member, Indexed |
| bookId | String | FK → Book, Indexed |
| bookCopyId | String? | FK → BookCopy |
| status | ReservationStatus | Default: PENDING, Indexed |
| reservedAt | DateTime | Default: now() |
| fulfilledAt | DateTime? | |
| expiresAt | DateTime? | |

### Fine
| Column | Type | Constraints |
|---|---|---|
| id | String (UUID) | PK |
| loanId | String | FK → Loan, Unique |
| memberId | String | FK → Member, Indexed |
| amount | Float | |
| status | FineStatus | Default: PENDING, Indexed |
| reason | String | |
| paidAt | DateTime? | |

## Relationships

```
User ──── Member ──── Loan ──── BookCopy ──── Book
  │                     │                        │
  │                Reservation              Category
  │                     │
  └─── Librarian    Fine
```

## Indexes

- `Book.title` — search performance
- `Book.categoryId` — filter by category
- `BookCopy.bookId` — join queries
- `BookCopy.status` — availability checks
- `Loan.memberId` — member history
- `Loan.bookCopyId` — copy history
- `Loan.status` — active/overdue filtering
- `Reservation.memberId` — member reservations
- `Reservation.bookId` — book reservations
- `Reservation.status` — pending filtering
- `Fine.memberId` — member fines
- `Fine.status` — outstanding fines
- `Category.parentId` — tree traversal
