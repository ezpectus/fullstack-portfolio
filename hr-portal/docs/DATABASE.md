# Database Schema — HR Portal

## Table of Contents

- [Overview](#overview)
- [Models](#models)
  - [User](#user)
  - [RefreshToken](#refreshtoken)
  - [Department](#department)
  - [Employee](#employee)
  - [PositionHistory](#positionhistory)
  - [LeaveType](#leavetype)
  - [LeaveRequest](#leaverequest)
  - [Payslip](#payslip)
  - [DocumentType](#documenttype)
  - [Document](#document)
  - [Notification](#notification)
- [Indexes](#indexes)
- [Seed Data](#seed-data)

## Overview

PostgreSQL 16 database managed via Prisma ORM 5.

## Models

### User

| Field | Type | Description |
|-------|------|-------------|
| id | String (UUID) | Primary key |
| email | String | Unique email |
| password | String | bcrypt hashed |
| name | String | Full name |
| role | Enum | HR_ADMIN, MANAGER, EMPLOYEE |
| phone | String? | Phone number |
| avatar | String? | Avatar URL |
| isActive | Boolean | Account status |
| createdAt | DateTime | Creation timestamp |
| updatedAt | DateTime | Update timestamp |

### RefreshToken

| Field | Type | Description |
|-------|------|-------------|
| id | String (UUID) | Primary key |
| token | String | Unique token |
| userId | String | FK → User |
| expiresAt | DateTime | Expiry date |
| createdAt | DateTime | Creation timestamp |

### Department

| Field | Type | Description |
|-------|------|-------------|
| id | String (UUID) | Primary key |
| name | String | Department name |
| description | String? | Description |
| headId | String? | FK → Employee (department head) |
| createdAt | DateTime | Creation timestamp |
| updatedAt | DateTime | Update timestamp |

### Employee

| Field | Type | Description |
|-------|------|-------------|
| id | String (UUID) | Primary key |
| userId | String | FK → User (unique) |
| firstName | String | First name |
| lastName | String | Last name |
| dateOfBirth | DateTime | Birth date |
| phone | String? | Phone |
| avatar | String? | Photo URL |
| position | String | Job title |
| departmentId | String? | FK → Department |
| hireDate | DateTime | Employment start |
| managerId | String? | FK → Employee (supervisor) |
| status | Enum | ACTIVE, ON_LEAVE, TERMINATED |
| education | String? | Education info |
| experience | String? | Work experience |
| skills | String[] | Skill tags |
| createdAt | DateTime | Creation timestamp |
| updatedAt | DateTime | Update timestamp |

### PositionHistory

| Field | Type | Description |
|-------|------|-------------|
| id | String (UUID) | Primary key |
| employeeId | String | FK → Employee |
| position | String | Previous/new position |
| departmentId | String? | FK → Department |
| changedAt | DateTime | Change date |
| note | String? | Change reason |

### LeaveType

| Field | Type | Description |
|-------|------|-------------|
| id | String (UUID) | Primary key |
| name | String | Type name (Annual, Sick, Unpaid, Maternity) |
| defaultDays | Int | Default annual allowance |
| isPaid | Boolean | Paid or unpaid |
| color | String | Calendar color code |

### LeaveRequest

| Field | Type | Description |
|-------|------|-------------|
| id | String (UUID) | Primary key |
| employeeId | String | FK → Employee |
| leaveTypeId | String | FK → LeaveType |
| startDate | DateTime | Leave start |
| endDate | DateTime | Leave end |
| days | Int | Calculated days |
| comment | String? | Employee comment |
| status | Enum | PENDING, APPROVED, REJECTED |
| reviewedBy | String? | FK → Employee (reviewer) |
| reviewedAt | DateTime? | Review timestamp |
| reviewNote | String? | Reviewer note |
| createdAt | DateTime | Creation timestamp |
| updatedAt | DateTime | Update timestamp |

### Payslip

| Field | Type | Description |
|-------|------|-------------|
| id | String (UUID) | Primary key |
| employeeId | String | FK → Employee |
| periodMonth | Int | Month (1-12) |
| periodYear | Int | Year |
| baseSalary | Float | Base salary |
| bonus | Float | Bonus amount |
| allowances | Float | Allowances |
| deductions | Float | Deductions |
| total | Float | Net total |
| status | Enum | DRAFT, APPROVED, PAID |
| createdAt | DateTime | Creation timestamp |
| updatedAt | DateTime | Update timestamp |

### DocumentType

| Field | Type | Description |
|-------|------|-------------|
| id | String (UUID) | Primary key |
| name | String | Type name (Contract, Hire Order, Leave Order, Certificate) |
| template | String? | Template content for generation |

### Document

| Field | Type | Description |
|-------|------|-------------|
| id | String (UUID) | Primary key |
| employeeId | String | FK → Employee |
| documentTypeId | String | FK → DocumentType |
| title | String | Document title |
| filePath | String? | Uploaded file path |
| generatedContent | String? | Generated content |
| createdAt | DateTime | Creation timestamp |
| updatedAt | DateTime | Update timestamp |

### Notification

| Field | Type | Description |
|-------|------|-------------|
| id | String (UUID) | Primary key |
| userId | String | FK → User |
| type | Enum | LEAVE_REQUEST, LEAVE_APPROVED, LEAVE_REJECTED, PAYSLIP_READY, DOCUMENT_GENERATED |
| title | String | Notification title |
| message | String | Notification body |
| isRead | Boolean | Read status |
| createdAt | DateTime | Creation timestamp |

## Indexes

- User: `email` (unique), `role`
- Employee: `userId` (unique), `departmentId`, `managerId`, `status`
- LeaveRequest: `employeeId`, `leaveTypeId`, `status`, `startDate`
- Payslip: `employeeId`, `status`, `periodMonth`, `periodYear`
- Document: `employeeId`, `documentTypeId`
- Notification: `userId`, `isRead`
- RefreshToken: `userId`, `token` (unique)

## Seed Data

The seed script creates:
- 1 HR Admin user (demo@hrportal.com / demo1234)
- 1 Manager user
- 3 Employee users
- 3 Departments (Engineering, Sales, HR)
- 5 Employees with org structure
- 4 Leave Types (Annual, Sick, Unpaid, Maternity)
- Sample leave requests
- Sample payslips
- Sample documents
