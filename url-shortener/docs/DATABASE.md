# Database Schema — URL Shortener

## Table of Contents

- [ER Diagram](#er-diagram)
- [Tables](#tables)
  - [User](#user)
  - [ShortLink](#shortlink)
  - [Click](#click)
  - [ApiKey](#apikey)
  - [Settings](#settings)
- [Redis Cache](#redis-cache)
- [Seed Data](#seed-data)

## ER Diagram

```
User 1───* ShortLink 1───* Click
  │
  ├───* ApiKey
  │
  └───* Settings (1:1)
```

## Tables

### User

| Column | Type | Constraints | Description |
|---|---|---|---|
| id | String (UUID) | PK, default uuid() | Unique identifier |
| email | String | UNIQUE, NOT NULL | User email |
| password | String | NOT NULL | bcrypt hashed password |
| name | String | NOT NULL | Display name |
| role | String | DEFAULT "user" | "admin" or "user" |
| createdAt | DateTime | DEFAULT now() | Creation timestamp |
| updatedAt | DateTime | @updatedAt | Last update timestamp |

**Relations:**
- `ShortLink[]` — User's short links
- `ApiKey[]` — User's API keys
- `Settings?` — User's settings (1:1)

### ShortLink

| Column | Type | Constraints | Description |
|---|---|---|---|
| id | String (UUID) | PK, default uuid() | Unique identifier |
| originalUrl | String | NOT NULL | Original long URL |
| shortCode | String | UNIQUE, NOT NULL | Generated short code |
| alias | String? | UNIQUE | Custom alias (optional) |
| userId | String | FK → User.id, NOT NULL | Owner |
| expiresAt | DateTime? | | Optional expiry date |
| password | String? | | Optional password protection |
| status | String | DEFAULT "active" | "active", "expired", "disabled", "archived" |
| createdAt | DateTime | DEFAULT now() | Creation timestamp |
| updatedAt | DateTime | @updatedAt | Last update timestamp |

**Indexes:**
- `@@index([userId])` — Query links by user
- `@@index([shortCode])` — Fast redirect lookup
- `@@index([status])` — Filter by status

### Click

| Column | Type | Constraints | Description |
|---|---|---|---|
| id | String (UUID) | PK, default uuid() | Unique identifier |
| shortLinkId | String | FK → ShortLink.id, NOT NULL | Associated link |
| ip | String? | | Visitor IP address |
| userAgent | String? | | Browser user-agent |
| referer | String? | | Referer URL |
| country | String? | | Geo country |
| city | String? | | Geo city |
| device | String? | | "desktop", "mobile", "tablet" |
| browser | String? | | "Chrome", "Firefox", "Safari", "Edge", "other" |
| isUnique | Boolean | DEFAULT true | Unique visitor flag |
| createdAt | DateTime | DEFAULT now() | Click timestamp |

**Indexes:**
- `@@index([shortLinkId])` — Query clicks by link
- `@@index([createdAt])` — Time-based queries

### ApiKey

| Column | Type | Constraints | Description |
|---|---|---|---|
| id | String (UUID) | PK, default uuid() | Unique identifier |
| userId | String | FK → User.id, NOT NULL | Owner |
| key | String | UNIQUE, NOT NULL | API key string |
| name | String | NOT NULL | Descriptive name |
| lastUsedAt | DateTime? | | Last usage timestamp |
| createdAt | DateTime | DEFAULT now() | Creation timestamp |

**Indexes:**
- `@@index([userId])` — Query keys by user

### Settings

| Column | Type | Constraints | Description |
|---|---|---|---|
| id | String (UUID) | PK, default uuid() | Unique identifier |
| userId | String | UNIQUE, FK → User.id, NOT NULL | Owner (1:1) |
| domain | String | DEFAULT "localhost" | Custom domain for short links |
| codeLength | Int | DEFAULT 6 | Short code length (4-12) |
| blacklist | String[] | DEFAULT [] | Blacklisted domains |
| createdAt | DateTime | DEFAULT now() | Creation timestamp |
| updatedAt | DateTime | @updatedAt | Last update timestamp |

## Redis Cache

| Key Pattern | Value | TTL | Description |
|---|---|---|---|
| `redirect:{shortCode}` | Original URL string | 24h (86400s) | Redirect cache for O(1) lookup |
| `clicks:{shortCode}` | Counter (integer) | None | Real-time click counter |

## Seed Data

The seed script (`prisma/seed.ts`) creates:
- **Admin user**: `admin@urlshortener.com` / `admin1234`
- **Demo user**: `demo@urlshortener.com` / `demo1234`
- **5 sample short links** for the demo user
- **Random clicks** (10-50 per link) with varied metadata over the last 30 days
