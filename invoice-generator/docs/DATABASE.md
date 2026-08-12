# Database Schema — Invoice Generator

## Table of Contents

- [Overview](#overview)
- [Models](#models)
  - [User](#user)
  - [Company](#company)
  - [Client](#client)
  - [Invoice](#invoice)
  - [InvoiceItem](#invoiceitem)
  - [Template](#template)
- [Relationships](#relationships)
- [Migrations](#migrations)

## Overview

PostgreSQL 16 with Prisma ORM.

## Models

### User
| Field | Type | Description |
|-------|------|-------------|
| id | UUID (PK) | Unique identifier |
| email | String (unique) | User email |
| password | String | Bcrypt hashed password |
| name | String | Display name |
| role | Enum | OWNER, ACCOUNTANT, VIEWER |
| isActive | Boolean | Account active flag (default: true) |
| createdAt | DateTime | Creation timestamp |
| updatedAt | DateTime | Last update timestamp |

### Company
| Field | Type | Description |
|-------|------|-------------|
| id | UUID (PK) | Unique identifier |
| userId | UUID (unique, FK) | One-to-one with User |
| name | String | Company name |
| address, city, country, postalCode | String? | Address fields |
| email, phone | String? | Contact info |
| logo | String? | Logo URL |
| taxId | String? | Tax identifier |
| bankName, bankAccount, bankSwift | String? | Banking details |
| invoicePrefix | String | Invoice number prefix (default: INV) |
| invoiceStart | Int | Next invoice number |
| emailSubject | String | Default email subject |
| emailBody | String | Default email body |

### Client
| Field | Type | Description |
|-------|------|-------------|
| id | UUID (PK) | Unique identifier |
| userId | UUID (FK) | Owner user |
| name | String | Client name |
| company | String? | Company name |
| email | String | Client email |
| address, city, country, postalCode | String? | Address fields |
| taxId, phone | String? | Tax ID and phone |
| createdAt, updatedAt | DateTime | Timestamps |

### Invoice
| Field | Type | Description |
|-------|------|-------------|
| id | UUID (PK) | Unique identifier |
| number | String (unique) | Auto-generated invoice number |
| userId | UUID (FK) | Owner user |
| clientId | UUID (FK) | Related client |
| status | Enum | DRAFT, SENT, PAID, OVERDUE, CANCELLED |
| issueDate | DateTime | Issue date |
| dueDate | DateTime | Due date |
| currency | String | 3-letter currency code |
| notes | String? | Optional notes |
| subtotal | Float | Sum before tax/discount |
| taxTotal | Float | Total tax amount |
| discountTotal | Float | Total discount amount |
| total | Float | Final total |
| paidAt | DateTime? | When marked paid |
| sentAt | DateTime? | When marked sent |
| createdAt, updatedAt | DateTime | Timestamps |

### InvoiceItem
| Field | Type | Description |
|-------|------|-------------|
| id | UUID (PK) | Unique identifier |
| invoiceId | UUID (FK) | Related invoice |
| description | String | Item description |
| quantity | Float | Quantity |
| unit | String | Unit of measurement |
| unitPrice | Float | Price per unit |
| taxRate | Float | Tax percentage |
| discount | Float | Discount amount |
| total | Float | Calculated line total |

### Template
| Field | Type | Description |
|-------|------|-------------|
| id | UUID (PK) | Unique identifier |
| userId | UUID (FK) | Owner user |
| name | String | Template name |
| description | String | Template description |
| quantity | Float | Default quantity |
| unit | String | Default unit |
| unitPrice | Float | Default price |
| taxRate | Float | Default tax rate |
| discount | Float | Default discount |
| createdAt, updatedAt | DateTime | Timestamps |

## Relationships

- User 1:1 Company
- User 1:N Clients
- User 1:N Invoices
- User 1:N Templates
- Client 1:N Invoices
- Invoice 1:N InvoiceItems

## Migrations

```bash
cd backend
npx prisma migrate dev --name init
npx prisma db seed
```
