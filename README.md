# Product Management API

A **RESTful API** for managing products with **role-based access control**, **pagination**, **statistics**, **validation**, **rate limiting**, and **caching**.

---

## 🛠️ Tech Stack

* **Runtime:** Node.js
* **Framework:** Express.js
* **Language:** TypeScript
* **Database:** MongoDB
* **ODM:** Mongoose
* **Validation:** Joi
* **Caching:** node-cache
* **Security & Performance:** express-rate-limit

---

## ✨ Features

* Role-Based Access Control (RBAC)
* Full CRUD operations for products
* Product statistics with caching
* Pagination, search, filtering, and sorting
* Comprehensive request validation with Joi
* Unified API response format
* Centralized error handling with proper HTTP status codes
* Rate limiting to prevent abuse
* Cached statistics endpoint (TTL: 5 minutes)

---

## 🧰 Project Structure

```text
src/
├── DB/                         # Database connection and models
│   ├── Models/                 # Mongoose models
│   └── connection.ts           # MongoDB connection
├── Middlewares/                # Custom middlewares (RBAC, error handling, rate limiting)
├── Modules/                    # Feature-based modules
│   └── Product/                # Product module
│       ├── controllers/        # Request handlers (HTTP layer)
│       ├── services/           # Business logic
│       ├── dto/                # Data Transfer Objects
│       └── schemas/            # Joi validation schemas
├── Types/                      # Global TypeScript types & enums
├── Utils/                      # Shared utility functions
└── index.ts                    # Application entry point
```

---

## 🚀 Installation

1. **Clone the repository**

```bash
git clone https://github.com/Abdelrahman678/Product_Management_Task.git
cd Product_Management_Task
```

2. **Install dependencies**

```bash
npm install
```

3. **Create environment variables**

Create a `.env` file in the project root:

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/Product_Management_App
```

* `PORT` — Port on which the Express server runs
* `MONGO_URI` — MongoDB connection string

---

## ⚡ Running the Project

```bash
# Development mode (hot-reload)
npm run start:dev

# Production build
npm run build

# Start production server
npm run start:prod
```

The API will be available at:

```
http://localhost:3000
```

---

## 🗂️ API Routes

### 1. Create Product (Admin only)

```http
POST /api/products
Headers:
  X-User-Role: admin
Body:
  { sku, name, description?, category, type?, price, discountPrice?, quantity }
Response:
  201 Created
```

---

### 2. Get All Products (Pagination + Search + Filter)

```http
GET /api/products?page=1&limit=10&category=&type=&search=&sort=&order=&minPrice=&maxPrice=
Headers:
  X-User-Role: admin | user
Response:
  200 OK (paginated result)
```

---

### 3. Get Single Product

```http
GET /api/products/:id
Headers:
  X-User-Role: admin | user
Response:
  200 OK
```

---

### 4. Update Product (Admin only)

```http
PUT /api/products/:id
Headers:
  X-User-Role: admin
Body:
  Partial update (SKU cannot be updated)
Response:
  200 OK
```

---

### 5. Delete Product (Admin only)

```http
DELETE /api/products/:id
Headers:
  X-User-Role: admin
Response:
  200 OK
```

---

### 6. Get Product Statistics (Admin only)

```http
GET /api/products/stats
Headers:
  X-User-Role: admin
Response:
  200 OK (statistics data)
```

---

## ✅ Validation Rules

* **SKU:** Required, unique, alphanumeric, 3–50 characters
* **Name:** Required, 3–200 characters
* **Description:** Optional, max 1000 characters
* **Category:** Required, 2–100 characters
* **Type:** Enum: `public | private`, default: `public`
* **Price:** Required, greater than 0, up to 2 decimal places
* **Discount Price:** Optional, ≥ 0 and less than `price`
* **Quantity:** Required, integer ≥ 0

---

## 🧠 Caching

* The statistics endpoint (`/api/products/stats`) is cached for **5 minutes** using `node-cache`.
* Cache is automatically invalidated on **create**, **update**, or **delete** operations.

---

## 📄 Pagination

* Default values:

  * `page = 1`
  * `limit = 10`

* Pagination metadata example:

```json
{
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 48,
    "itemsPerPage": 10,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```

---

## ❌ Error Handling

Unified error response format:

```json
{
  "success": false,
  "message": "Validation failed",
  "error": {
    "code": "VALIDATION_ERROR",
    "details": {}
  }
}
```

---

## 🚦 Rate Limiting

The API uses `express-rate-limit` to ensure fair usage:

* **Limit:** 100 requests per 15 minutes per IP
* **Status Code:** `429 Too Many Requests`
* **Response Headers:**

  * `X-RateLimit-Limit`
  * `X-RateLimit-Remaining`
  * `X-RateLimit-Reset`

Example response when the limit is exceeded:

```json
{
  "message": "Too many requests, please try again later"
}
```

---

## 📌 Common HTTP Status Codes

* `200 OK` — Successful GET, PUT, DELETE
* `201 Created` — Successful POST
* `400 Bad Request` — Validation errors
* `401 Unauthorized` — Missing or invalid role
* `403 Forbidden` — Insufficient permissions
* `404 Not Found` — Resource not found
* `409 Conflict` — Duplicate SKU
* `500 Internal Server Error` — Unexpected server error

---

