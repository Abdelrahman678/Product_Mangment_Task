# Product Management API

A RESTful API service for managing products with **role-based access control**, **pagination**, **statistics**, **validation**, and **caching**.

---

## 🛠️ Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB
- **ODM:** Mongoose
- **Validation:** Joi
- **Caching:** node-cache
- **Other:** TypeScript, express-rate-limit

---

## Features

- Role-Based Access Control (RBAC)
- CRUD operations for products
- Product statistics with caching
- Pagination, search, filtering, and sorting
- Comprehensive input validation with Joi
- Unified response format
- Error handling with proper HTTP status codes
- Rate limiting
- Caching for statistics endpoint (5 minutes)

---

## 🧰 Project Structure

src/
├── DB/ # Database connection and models
│ ├── Models/ # Mongoose models
│ └── connection.ts # Database connection
├── Middlewares/ # Custom middlewares
├── Modules/ # Feature modules
│ └── Product/ # Product module
│ ├── controllers/ # Request handlers
│ ├── services/ # Business logic
│ ├── dto/ # Data transfer objects
│ └── schemas/ # Validation schemas
├── Types/ # TypeScript types
├── Utils/ # Utility functions
└── index.ts # Application entry point

---

## 🚀 Installation

1. Clone the repository:

```bash
git clone <https://github.com/Abdelrahman678/Product_Management_Task.git>
cd Product_Management_Task
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

---

## Environment Variables

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/Product_Management_App
```

- `PORT` — Port for Express server
- `MONGO_URI` — MongoDB connection string

---

## ⚡Running the Project

```bash
# Development mode with hot-reload
npm run start:dev
# Production build and start
npm run build
npm run start:prod
```

The API will be available at `http://localhost:3000`.

---

## 🗂️ API Routes

### 1. Create Product (Admin only)

```
POST /api/products
Headers: X-User-Role: admin
Body: { sku, name, description?, category, type?, price, discountPrice?, quantity }
Response: 201 Created
```

### 2. Get All Products (Pagination + Search + Filter)

```
GET /api/products?page=1&limit=10&category=&type=&search=&sort=&order=&minPrice=&maxPrice=
Headers: X-User-Role: admin | user
Response: 200 OK with pagination
```

### 3. Get Single Product

```
GET /api/products/:id
Headers: X-User-Role: admin | user
Response: 200 OK
```

### 4. Update Product (Admin only)

```
PUT /api/products/:id
Headers: X-User-Role: admin
Body: Partial update (cannot update SKU)
Response: 200 OK
```

### 5. Delete Product (Admin only)

```
DELETE /api/products/:id
Headers: X-User-Role: admin
Response: 200 OK
```

### 6. Get Product Statistics (Admin only)

```
GET /api/products/stats
Headers: X-User-Role: admin
Response: 200 OK with statistics
```

---

## Validation Rules

- **SKU:** Required, unique, alphanumeric, 3-50 chars
- **Name:** Required, 3-200 chars
- **Description:** Optional, max 1000 chars
- **Category:** Required, 2-100 chars
- **Type:** Enum: "public" | "private", default "public"
- **Price:** Required, >0, max 2 decimals
- **Discount Price:** Optional, ≥0 and < price
- **Quantity:** Required, integer ≥0

---

## Caching

- Statistics endpoint (`/api/products/stats`) is cached for **5 minutes** using `node-cache`.
- Cache is invalidated automatically on product create, update, or delete.

---

## Pagination

- Default: `page=1`, `limit=10`
- Response includes `pagination` object:

```json
"pagination": {
  "currentPage": 1,
  "totalPages": 5,
  "totalItems": 48,
  "itemsPerPage": 10,
  "hasNextPage": true,
  "hasPreviousPage": false
}
```

---

## Error Handling

Unified error response format:

```json
{
  "success": false,
  "message": "Validation failed",
  "error": {
    "code": "VALIDATION_ERROR",
    "details": { ... }
  }
}

```

## Rate Limiting

The API implements rate limiting using `express-rate-limit` to prevent abuse and ensure fair usage:

- **Rate Limit**: 100 requests per 15 minutes per IP address
- **Response**: 429 Too Many Requests when limit is exceeded
- **Headers**:
  - `X-RateLimit-Limit`: Maximum requests allowed in the window
  - `X-RateLimit-Remaining`: Remaining requests in the current window
  - `X-RateLimit-Reset`: Time when the rate limit resets (in UTC epoch seconds)

Example rate limit exceeded response:

```json
{
  "message": "Too many requests, please try again later"
}
```

---

## Common HTTP status codes used:

- `200 OK` — GET, PUT, DELETE success
- `201 Created` — POST success
- `400 Bad Request` — Validation errors
- `401 Unauthorized` — Missing/invalid role
- `403 Forbidden` — Insufficient permissions
- `404 Not Found` — Resource not found
- `409 Conflict` — Duplicate SKU
- `500 Internal Server Error` — Unexpected errors

---
