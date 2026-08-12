# Database Schema — E-commerce Admin Panel

## Table of Contents

- [Overview](#overview)
- [Models](#models)
  - [User](#user)
  - [Product](#product)
  - [Category](#category)
  - [Order](#order)
  - [Customer](#customer)
  - [PromoCode](#promocode)
- [Relationships](#relationships)
- [Migrations](#migrations)

## Overview

The ecommerce-admin project uses PostgreSQL 16 with Prisma ORM.

## Models

### User

| Field | Type | Description |
|-------|------|-------------|
| id | String (UUID) | Primary key |
| email | String | Unique email |
| name | String | User name |
| password | String | Bcrypt hashed password |
| role | Enum | SUPER_ADMIN, MANAGER, STAFF |
| createdAt | DateTime | Creation timestamp |
| updatedAt | DateTime | Update timestamp |

### Product

| Field | Type | Description |
|-------|------|-------------|
| id | String (UUID) | Primary key |
| sku | String | Unique SKU |
| name | String | Product name |
| description | String? | Description |
| status | Enum | ACTIVE, DRAFT, ARCHIVED |
| price | Decimal | Price |
| discountPrice | Decimal? | Discount price |
| stock | Int | Stock quantity |
| tags | String[] | Tags |
| slug | String | URL slug |
| categoryId | String? | FK to Category |
| createdAt | DateTime | Creation timestamp |
| updatedAt | DateTime | Update timestamp |

### Category

| Field | Type | Description |
|-------|------|-------------|
| id | String (UUID) | Primary key |
| name | String | Category name |
| slug | String | URL slug |
| image | String? | Image URL |
| parentId | String? | FK to Category (self-relation) |

### Order

| Field | Type | Description |
|-------|------|-------------|
| id | String (UUID) | Primary key |
| orderNumber | String | Unique order number |
| customerId | String | FK to Customer |
| status | Enum | PENDING, PROCESSING, SHIPPED, DELIVERED, CANCELLED, REFUNDED |
| paymentStatus | Enum | PENDING, PAID, REFUNDED, FAILED |
| subtotal | Decimal | Subtotal |
| taxTotal | Decimal | Tax |
| shippingTotal | Decimal | Shipping cost |
| discountTotal | Decimal | Discount amount |
| total | Decimal | Total |
| promoCodeId | String? | FK to PromoCode |

### Customer

| Field | Type | Description |
|-------|------|-------------|
| id | String (UUID) | Primary key |
| name | String | Customer name |
| email | String | Unique email |
| phone | String? | Phone |
| status | Enum | ACTIVE, BLOCKED |
| segment | Enum | VIP, REGULAR, NEW |
| totalSpend | Decimal | Total spend |

### PromoCode

| Field | Type | Description |
|-------|------|-------------|
| id | String (UUID) | Primary key |
| code | String | Unique code |
| type | Enum | PERCENTAGE, FIXED |
| value | Decimal | Discount value |
| minOrderValue | Decimal | Minimum order value |
| usageLimit | Int? | Usage limit |
| usedCount | Int | Times used |
| expiresAt | DateTime? | Expiry date |
| isActive | Boolean | Active state |

## Relationships

- `User` → manages `Product`, `Category`, `Order`, `Customer`, `PromoCode`
- `Category` has a self-relation for nested subcategories
- `Product` belongs to a `Category`
- `Order` belongs to a `Customer` and optionally a `PromoCode`
- Order line items are typically stored in a related `OrderItem` table

## Migrations

```bash
npx prisma migrate dev --name init
npx prisma generate
npx prisma migrate deploy
```
