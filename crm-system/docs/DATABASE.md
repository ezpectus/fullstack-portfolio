# Database Schema — CRM System

## Table of Contents

- [ER Diagram](#er-diagram)
- [Tables](#tables)
  - [User](#user)
  - [RefreshToken](#refreshtoken)
  - [Customer](#customer)
  - [Deal](#deal)
  - [Note](#note)
- [Indexes](#indexes)

## ER Diagram

```
User 1───* Customer *───* Deal
  │              │         │
  │              *         *
  │           Note       Note
  │
  └───* RefreshToken
```

## Tables

### User

| Column | Type | Constraints | Description |
|---|---|---|---|
| id | UUID | PK, default gen_random_uuid() | Unique identifier |
| email | VARCHAR(255) | UNIQUE, NOT NULL | User email |
| password | VARCHAR(255) | NOT NULL | Bcrypt hashed password |
| name | VARCHAR(255) | NOT NULL | Display name |
| role | ENUM | NOT NULL, default 'sales_rep' | admin / manager / sales_rep |
| avatar | TEXT | nullable | Avatar URL |
| isActive | BOOLEAN | default true | Account active flag |
| createdAt | TIMESTAMP | default now() | Creation timestamp |
| updatedAt | TIMESTAMP | auto-updated | Last update timestamp |

### RefreshToken

| Column | Type | Constraints | Description |
|---|---|---|---|
| id | UUID | PK | Unique identifier |
| token | VARCHAR(500) | UNIQUE, NOT NULL | Refresh token value |
| userId | UUID | FK → User.id, NOT NULL | Owner |
| expiresAt | TIMESTAMP | NOT NULL | Expiration date |
| createdAt | TIMESTAMP | default now() | Creation timestamp |
| revokedAt | TIMESTAMP | nullable | Revocation timestamp |

### Customer

| Column | Type | Constraints | Description |
|---|---|---|---|
| id | UUID | PK | Unique identifier |
| name | VARCHAR(255) | NOT NULL | Customer name |
| company | VARCHAR(255) | nullable | Company name |
| email | VARCHAR(255) | nullable | Email |
| phone | VARCHAR(50) | nullable | Phone |
| status | ENUM | NOT NULL, default 'lead' | lead / active / inactive |
| tags | TEXT[] | default '{}' | Array of tags |
| avatar | TEXT | nullable | Avatar URL |
| assignedToId | UUID | FK → User.id, nullable, onDelete: SetNull | Assigned sales rep |
| createdAt | TIMESTAMP | default now() | Creation timestamp |
| updatedAt | TIMESTAMP | auto-updated | Last update timestamp |

### Deal

| Column | Type | Constraints | Description |
|---|---|---|---|
| id | UUID | PK | Unique identifier |
| title | VARCHAR(255) | NOT NULL | Deal title |
| amount | DECIMAL(12,2) | NOT NULL, default 0 | Deal value |
| currency | VARCHAR(3) | NOT NULL, default 'USD' | Currency code |
| stage | ENUM | NOT NULL, default 'new' | new / contacted / qualified / proposal / won / lost |
| probability | INTEGER | default 0 | Win probability (0-100) |
| expectedCloseDate | DATE | nullable | Expected close date |
| customerId | UUID | FK → Customer.id, NOT NULL | Linked customer |
| assignedToId | UUID | FK → User.id, nullable, onDelete: SetNull | Assigned sales rep |
| createdAt | TIMESTAMP | default now() | Creation timestamp |
| updatedAt | TIMESTAMP | auto-updated | Last update timestamp |

### Note

| Column | Type | Constraints | Description |
|---|---|---|---|
| id | UUID | PK | Unique identifier |
| content | TEXT | NOT NULL | Note content (markdown) |
| isPinned | BOOLEAN | default false | Pinned flag |
| customerId | UUID | FK → Customer.id, nullable | Linked customer |
| dealId | UUID | FK → Deal.id, nullable | Linked deal |
| createdById | UUID | FK → User.id, NOT NULL | Author |
| createdAt | TIMESTAMP | default now() | Creation timestamp |
| updatedAt | TIMESTAMP | auto-updated | Last update timestamp |

## Indexes

- `User.email` — UNIQUE index
- `RefreshToken.token` — UNIQUE index
- `RefreshToken.userId` — B-tree index
- `Customer.status` — B-tree index
- `Customer.assignedToId` — B-tree index
- `Deal.stage` — B-tree index
- `Deal.customerId` — B-tree index
- `Deal.assignedToId` — B-tree index
- `Note.customerId` — B-tree index
- `Note.dealId` — B-tree index
