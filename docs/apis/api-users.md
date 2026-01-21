# User API Documentation

## Overview

RESTful API for managing users with full CRUD operations, soft delete support, search, and filtering capabilities.

**Base URL:** `/api/users`

---

## Data Model

### User Entity

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | Integer | Auto | Primary key, auto-incrementing |
| `fullName` | String | Yes | User's full name |
| `email` | String | Yes | Email address (unique) |
| `contactNumber` | String | No | Phone number |
| `gender` | String | No | Gender: `male`, `female` |
| `isDeleted` | Boolean | Auto | Soft delete flag (default: false) |
| `createdAt` | DateTime | Auto | Record creation timestamp |
| `updatedAt` | DateTime | Auto | Last update timestamp |

---

## Endpoints

### 1. List Users

**GET** `/api/users`

Retrieves a paginated list of users with optional search and filter parameters.

#### Query Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | Integer | 1 | Page number |
| `limit` | Integer | 10 | Items per page (max: 100) |
| `search` | String | - | Search by fullName or email |
| `gender` | String | - | Filter by gender: `male`, `female` |
| `includeDeleted` | Boolean | false | Include soft-deleted records |
| `sortBy` | String | `createdAt` | Sort field: `fullName`, `email`, `createdAt`, `updatedAt` |
| `sortOrder` | String | `desc` | Sort order: `asc`, `desc` |

#### Response

```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": 1,
        "fullName": "Juan Dela Cruz",
        "email": "juan.delacruz@email.com",
        "contactNumber": "+63 917 123 4567",
        "gender": "male",
        "isDeleted": false,
        "createdAt": "2026-01-21T10:00:00.000Z",
        "updatedAt": "2026-01-21T10:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 50,
      "totalPages": 5
    }
  }
}
```

#### Example Requests

```bash
# List all users
GET /api/users

# Search users by name or email
GET /api/users?search=juan

# Filter by gender
GET /api/users?gender=female

# Combined search and filter with pagination
GET /api/users?search=santos&gender=female&page=1&limit=20

# Include soft-deleted users
GET /api/users?includeDeleted=true

# Sort by name ascending
GET /api/users?sortBy=fullName&sortOrder=asc
```

---

### 2. Get User by ID

**GET** `/api/users/:id`

Retrieves a single user by ID.

#### Path Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | Integer | User ID |

#### Query Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `includeDeleted` | Boolean | false | Allow fetching soft-deleted records |

#### Response

**Success (200)**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "fullName": "Juan Dela Cruz",
    "email": "juan.delacruz@email.com",
    "contactNumber": "+63 917 123 4567",
    "gender": "male",
    "isDeleted": false,
    "createdAt": "2026-01-21T10:00:00.000Z",
    "updatedAt": "2026-01-21T10:00:00.000Z"
  }
}
```

**Not Found (404)**
```json
{
  "success": false,
  "error": {
    "code": "USER_NOT_FOUND",
    "message": "User with ID 999 not found"
  }
}
```

---

### 3. Create User

**POST** `/api/users`

Creates a new user.

#### Request Body

```json
{
  "fullName": "Maria Santos",
  "email": "maria.santos@email.com",
  "contactNumber": "+63 918 234 5678",
  "gender": "female"
}
```

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `fullName` | String | Yes | Min 1 char, max 255 chars |
| `email` | String | Yes | Valid email format, unique |
| `contactNumber` | String | No | Max 50 chars |
| `gender` | String | No | One of: `male`, `female` |

#### Response

**Success (201)**
```json
{
  "success": true,
  "data": {
    "id": 6,
    "fullName": "Maria Santos",
    "email": "maria.santos@email.com",
    "contactNumber": "+63 918 234 5678",
    "gender": "female",
    "isDeleted": false,
    "createdAt": "2026-01-21T12:00:00.000Z",
    "updatedAt": "2026-01-21T12:00:00.000Z"
  }
}
```

**Validation Error (400)**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      { "field": "email", "message": "Email is required" },
      { "field": "fullName", "message": "Full name is required" }
    ]
  }
}
```

**Duplicate Email (409)**
```json
{
  "success": false,
  "error": {
    "code": "EMAIL_EXISTS",
    "message": "A user with this email already exists"
  }
}
```

---

### 4. Update User

**PUT** `/api/users/:id`

Updates an existing user. Supports partial updates.

#### Path Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | Integer | User ID |

#### Request Body

```json
{
  "fullName": "Maria Santos-Reyes",
  "contactNumber": "+63 918 999 8888"
}
```

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `fullName` | String | No | Min 1 char, max 255 chars |
| `email` | String | No | Valid email format, unique |
| `contactNumber` | String | No | Max 50 chars |
| `gender` | String | No | One of: `male`, `female` |

#### Response

**Success (200)**
```json
{
  "success": true,
  "data": {
    "id": 2,
    "fullName": "Maria Santos-Reyes",
    "email": "maria.santos@email.com",
    "contactNumber": "+63 918 999 8888",
    "gender": "female",
    "isDeleted": false,
    "createdAt": "2026-01-21T10:00:00.000Z",
    "updatedAt": "2026-01-21T14:30:00.000Z"
  }
}
```

**Not Found (404)**
```json
{
  "success": false,
  "error": {
    "code": "USER_NOT_FOUND",
    "message": "User with ID 999 not found"
  }
}
```

---

### 5. Soft Delete User

**DELETE** `/api/users/:id`

Soft deletes a user by setting `isDeleted` to `true`. The record remains in the database but is excluded from normal queries.

#### Path Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | Integer | User ID |

#### Response

**Success (200)**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "fullName": "Juan Dela Cruz",
    "email": "juan.delacruz@email.com",
    "isDeleted": true,
    "deletedAt": "2026-01-21T15:00:00.000Z"
  },
  "message": "User soft deleted successfully"
}
```

**Not Found (404)**
```json
{
  "success": false,
  "error": {
    "code": "USER_NOT_FOUND",
    "message": "User with ID 999 not found"
  }
}
```

---

### 6. Restore User

**POST** `/api/users/:id/restore`

Restores a soft-deleted user by setting `isDeleted` to `false`.

#### Path Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | Integer | User ID |

#### Response

**Success (200)**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "fullName": "Juan Dela Cruz",
    "email": "juan.delacruz@email.com",
    "isDeleted": false,
    "updatedAt": "2026-01-21T16:00:00.000Z"
  },
  "message": "User restored successfully"
}
```

**Not Deleted (400)**
```json
{
  "success": false,
  "error": {
    "code": "USER_NOT_DELETED",
    "message": "User is not deleted"
  }
}
```

---

### 7. Hard Delete User

**DELETE** `/api/users/:id/permanent`

Permanently deletes a user from the database. This action is irreversible.

#### Path Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | Integer | User ID |

#### Response

**Success (200)**
```json
{
  "success": true,
  "message": "User permanently deleted"
}
```

**Not Found (404)**
```json
{
  "success": false,
  "error": {
    "code": "USER_NOT_FOUND",
    "message": "User with ID 999 not found"
  }
}
```

---

## Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `VALIDATION_ERROR` | 400 | Request body validation failed |
| `USER_NOT_DELETED` | 400 | Attempted to restore a non-deleted user |
| `USER_NOT_FOUND` | 404 | User with specified ID does not exist |
| `EMAIL_EXISTS` | 409 | Email address already in use |
| `INTERNAL_ERROR` | 500 | Unexpected server error |

---

## Response Format

All responses follow a consistent JSON structure:

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional success message"
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": []  // Optional: validation errors or additional info
  }
}
```

---

## Implementation Notes

### Soft Delete Strategy
- Users are not physically deleted by default
- `isDeleted` field marks records as deleted
- Deleted records are excluded from list/get queries unless `includeDeleted=true`
- Soft-deleted emails remain unique (cannot create new user with same email)

### Search Behavior
- Search is case-insensitive
- Searches across `fullName` and `email` fields
- Uses partial matching (contains)

### Filter Behavior
- Gender filter accepts: `male`, `female`
- Multiple filters are combined with AND logic

### Pagination
- Default page size: 10
- Maximum page size: 100
- Returns total count and total pages for UI pagination

---

## File Structure (Implementation)

```
packages/backend/src/
├── controllers/
│   └── user.controller.ts        # Request handlers
├── services/
│   └── user.service.ts           # Business logic
├── repositories/
│   └── user.repository.ts        # Database operations
├── routes/
│   └── user.routes.ts            # Route definitions
├── middlewares/
│   ├── validation.middleware.ts  # Input validation
│   └── error.middleware.ts       # Global error handling
├── types/
│   ├── user/
│   │   ├── user.enums.ts         # Gender, SortByField, SortOrder
│   │   ├── user.interfaces.ts    # Request/Response interfaces
│   │   ├── user.constants.ts     # Pagination defaults, valid values
│   │   └── index.ts              # Barrel file (re-exports)
│   ├── common/
│   │   └── api.types.ts          # Shared API response types
│   └── user.dto.ts               # Data Transfer Objects
└── lib/
    └── prisma.ts                 # Prisma client instance
```

## Note: I created this documentation with the help of AI (My strategy is to plan things ahead using AI before engaging in to the development)