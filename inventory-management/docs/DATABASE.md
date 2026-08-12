# Database Schema — Inventory Management System

## Table of Contents

- [Overview](#overview)
- [Enums](#enums)
- [Tables](#tables)
  - [User](#user)
  - [RefreshToken](#refreshtoken)
  - [Category](#category)
  - [Product](#product)
  - [Warehouse](#warehouse)
  - [StockLevel](#stocklevel)
  - [StockMovement](#stockmovement)
  - [Supplier](#supplier)
  - [PurchaseOrder](#purchaseorder)
  - [PurchaseOrderItem](#purchaseorderitem)
- [Relationships](#relationships)
- [Indexes](#indexes)

## Overview

PostgreSQL 16 with Prisma ORM 5. All tables use UUID primary keys.

## Enums

| Enum | Values |
|---|---|
| Role | ADMIN, MANAGER, STAFF |
| MovementType | IN, OUT, TRANSFER, ADJUSTMENT |
| PurchaseOrderStatus | DRAFT, SENT, RECEIVED, CANCELLED |
| UnitOfMeasure | PIECE, KG, LITER, METER, BOX, PACK |

## Tables

### User
| Column | Type | Constraints |
|---|---|---|
| id | String (UUID) | PK |
| email | String | Unique |
| password | String | bcrypt hashed |
| name | String | |
| role | Role | Default: STAFF |
| isActive | Boolean | Default: true |
| createdAt | DateTime | Default: now() |
| updatedAt | DateTime | Auto-updated |

### RefreshToken
| Column | Type | Constraints |
|---|---|---|
| id | String (UUID) | PK |
| token | String | Unique |
| userId | String | FK → User |
| expiresAt | DateTime | |
| revokedAt | DateTime? | |

### Category
| Column | Type | Constraints |
|---|---|---|
| id | String (UUID) | PK |
| name | String | |
| parentId | String? | FK → Category (self-relation) |
| createdAt | DateTime | Default: now() |

### Product
| Column | Type | Constraints |
|---|---|---|
| id | String (UUID) | PK |
| sku | String | Unique |
| name | String | Indexed |
| description | String? | |
| categoryId | String? | FK → Category |
| unit | UnitOfMeasure | Default: PIECE |
| minStock | Int | Default: 0 |
| costPrice | Float | Default: 0 |
| sellPrice | Float | Default: 0 |
| barcode | String? | |
| imageUrl | String? | |
| createdAt | DateTime | Default: now() |
| updatedAt | DateTime | Auto-updated |

### Warehouse
| Column | Type | Constraints |
|---|---|---|
| id | String (UUID) | PK |
| name | String | |
| address | String? | |
| managerId | String? | FK → User |
| createdAt | DateTime | Default: now() |

### StockLevel
| Column | Type | Constraints |
|---|---|---|
| id | String (UUID) | PK |
| productId | String | FK → Product |
| warehouseId | String | FK → Warehouse |
| quantity | Int | Default: 0 |
| updatedAt | DateTime | Auto-updated |

### StockMovement
| Column | Type | Constraints |
|---|---|---|
| id | String (UUID) | PK |
| productId | String | FK → Product |
| warehouseId | String | FK → Warehouse |
| toWarehouseId | String? | FK → Warehouse (for transfers) |
| type | MovementType | |
| quantity | Int | |
| comment | String? | |
| userId | String | FK → User |
| createdAt | DateTime | Default: now() |

### Supplier
| Column | Type | Constraints |
|---|---|---|
| id | String (UUID) | PK |
| name | String | |
| contactName | String? | |
| email | String? | |
| phone | String? | |
| address | String? | |
| createdAt | DateTime | Default: now() |

### PurchaseOrder
| Column | Type | Constraints |
|---|---|---|
| id | String (UUID) | PK |
| poNumber | String | Unique |
| supplierId | String | FK → Supplier |
| warehouseId | String | FK → Warehouse |
| status | PurchaseOrderStatus | Default: DRAFT |
| totalAmount | Float | Default: 0 |
| orderedAt | DateTime? | |
| receivedAt | DateTime? | |
| createdById | String | FK → User |
| createdAt | DateTime | Default: now() |
| updatedAt | DateTime | Auto-updated |

### PurchaseOrderItem
| Column | Type | Constraints |
|---|---|---|
| id | String (UUID) | PK |
| purchaseOrderId | String | FK → PurchaseOrder |
| productId | String | FK → Product |
| quantity | Int | |
| unitCost | Float | |
| total | Float | |

## Relationships

```
User ──── Product ──── Category
  │          │
  │     StockMovement ──── Warehouse
  │          │                │
  │     StockLevel       Supplier
  │                           │
  └─── PurchaseOrder ──── PurchaseOrderItem
```

## Indexes

- `Product.sku` — unique lookup
- `Product.name` — search performance
- `Product.categoryId` — filter by category
- `StockLevel.productId` — join queries
- `StockLevel.warehouseId` — join queries
- `StockMovement.productId` — product history
- `StockMovement.warehouseId` — warehouse history
- `StockMovement.type` — filter by type
- `PurchaseOrder.supplierId` — supplier orders
- `PurchaseOrder.status` — status filtering
- `Category.parentId` — tree traversal
