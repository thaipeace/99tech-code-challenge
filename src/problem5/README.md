# Problem 5: ExpressJS CRUD Backend with TypeScript

A robust, production-grade RESTful CRUD backend service built with **ExpressJS**, **TypeScript**, and **SQLite** for persistent data storage.

---

## Features

- **TypeScript Strict Mode**: Fully typed end-to-end (models, controllers, repositories, middlewares).
- **CRUD Functionalities**:
  1. **Create** a resource with validation.
  2. **List** resources with advanced basic filtering (category, status, min/max price, search keyword, sorting, pagination).
  3. **Get details** of a specific resource.
  4. **Update** resource details (supports both `PUT` and `PATCH`).
  5. **Delete** a resource.
- **Data Persistence**: Built-in SQLite database engine (`data/app.db`) ensuring data persists across server restarts without needing external database servers (Postgres, Docker, etc.).
- **Request Validation**: Schema validation using **Zod** for request bodies, query parameters, and route parameters.
- **Clean Layered Architecture**:
  - `models/`: Domain interfaces & DTOs
  - `schemas/`: Zod validation schemas
  - `repositories/`: Data access layer with SQL prepared statements (SQL injection safe)
  - `services/`: Business logic & domain error handling
  - `controllers/`: HTTP request/response orchestration
  - `routes/`: Route definitions and middleware bindings
  - `middlewares/`: Centralized error handler and validation middleware

---

## Tech Stack

- **Runtime**: Node.js (v18+)
- **Framework**: Express.js
- **Language**: TypeScript 5
- **Database**: SQLite (`node:sqlite` persistent file database)
- **Validation**: Zod
- **Development Tool**: `tsx` (TypeScript Execute with Watch mode)

---

## Project Structure

```
src/problem5/
├── .env.example              # Sample environment configuration
├── .env                      # Local environment variables
├── .gitignore                # Git ignore for node_modules, build & db files
├── package.json              # Project dependencies and npm scripts
├── tsconfig.json             # TypeScript compiler configuration
├── test-api.mjs              # Automated end-to-end CRUD verification script
├── README.md                 # Documentation
├── data/
│   └── app.db                # SQLite persistent database file (auto-generated)
└── src/
    ├── config/
    │   └── env.ts            # Environment variables configuration
    ├── database/
    │   ├── connection.ts     # Database connection and schema initializer
    │   └── seed.ts           # Seeder script for initial sample data
    ├── models/
    │   └── resource.model.ts # TypeScript interfaces and types
    ├── schemas/
    │   └── resource.schema.ts# Zod validation schemas
    ├── repositories/
    │   └── resource.repository.ts # SQLite queries with prepared statements
    ├── services/
    │   └── resource.service.ts    # Business logic & error handling
    ├── controllers/
    │   └── resource.controller.ts # Route handler functions
    ├── routes/
    │   └── resource.routes.ts     # Express routes
    ├── middlewares/
    │   ├── error.middleware.ts    # Global error & 404 handlers
    │   └── validate.middleware.ts # Zod request validation middleware
    ├── app.ts                # Express application setup
    └── server.ts             # Server entry point
```

---

## Prerequisites

- **Node.js**: v18.0.0 or later (recommended Node.js v20 or v22)
- **npm**: v9.0.0 or later

---

## Installation & Configuration

1. Navigate to the `src/problem5` directory:
   ```bash
   cd src/problem5
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   Copy `.env.example` to `.env` (already provided with defaults):
   ```bash
   cp .env.example .env
   ```

   **Environment Variables**:
   | Variable | Default | Description |
   | :--- | :--- | :--- |
   | `PORT` | `3000` | Port for the Express server |
   | `NODE_ENV` | `development` | Environment (`development` or `production`) |
   | `DATABASE_URL` | `./data/app.db` | Path to SQLite database file |

4. Seed the database with sample data (optional):
   ```bash
   npm run seed
   ```

---

## Running the Application

### Development Mode (with Hot Reloading)
```bash
npm run dev
```

### Production Build & Run
Compile TypeScript to JavaScript and run the production server:
```bash
npm run build
npm start
```

### Automated End-to-End Test
While the server is running on port 3000, verify all CRUD operations:
```bash
npm test
```

---

## API Documentation & Examples

Base URL: `http://localhost:3000`

### 1. Health Check
- **Endpoint**: `GET /health`
- **Response** `200 OK`:
  ```json
  {
    "status": "ok",
    "timestamp": "2026-09-07T10:10:39.423Z",
    "uptime": 9.64
  }
  ```

---

### 2. Create a Resource
- **Endpoint**: `POST /api/resources`
- **Headers**: `Content-Type: application/json`
- **Request Body**:
  | Field | Type | Required | Description |
  | :--- | :--- | :--- | :--- |
  | `title` | string | Yes | Resource name (1-200 chars) |
  | `description` | string | No | Optional details |
  | `category` | string | Yes | Category classification |
  | `price` | number | Yes | Non-negative price |
  | `status` | string | No | `'active'`, `'draft'`, or `'archived'` (default: `'active'`) |

- **Example curl**:
  ```bash
  curl -X POST http://localhost:3000/api/resources \
    -H "Content-Type: application/json" \
    -d '{
      "title": "Smart Watch Pro",
      "description": "Fitness tracking with AMOLED display",
      "category": "Electronics",
      "price": 149.99,
      "status": "active"
    }'
  ```

- **Response** `201 Created`:
  ```json
  {
    "success": true,
    "data": {
      "id": 1,
      "title": "Smart Watch Pro",
      "description": "Fitness tracking with AMOLED display",
      "category": "Electronics",
      "price": 149.99,
      "status": "active",
      "createdAt": "2026-09-07T10:13:01.548Z",
      "updatedAt": "2026-09-07T10:13:01.548Z"
    },
    "message": "Resource created successfully"
  }
  ```

---

### 3. List Resources (with Filters & Pagination)
- **Endpoint**: `GET /api/resources`
- **Supported Query Parameters**:
  | Parameter | Type | Example | Description |
  | :--- | :--- | :--- | :--- |
  | `search` | string | `?search=watch` | Keyword search in title & description |
  | `category` | string | `?category=Electronics` | Filter by exact category |
  | `status` | string | `?status=active` | Filter by status (`active`, `draft`, `archived`) |
  | `minPrice` | number | `?minPrice=50` | Filter items with price >= minPrice |
  | `maxPrice` | number | `?maxPrice=200` | Filter items with price <= maxPrice |
  | `sortBy` | string | `?sortBy=price` | Sort field (`price`, `createdAt`, `title`) |
  | `sortOrder`| string | `?sortOrder=asc` | Sort direction (`asc` or `desc`, default `desc`) |
  | `page` | number | `?page=1` | Page number (default: `1`) |
  | `limit` | number | `?limit=10` | Number of items per page (default: `10`, max: `100`) |

- **Example curl**:
  ```bash
  curl "http://localhost:3000/api/resources?category=Electronics&status=active&minPrice=50&maxPrice=200"
  ```

- **Response** `200 OK`:
  ```json
  {
    "success": true,
    "data": [
      {
        "id": 1,
        "title": "Smart Watch Pro",
        "description": "Fitness tracking with AMOLED display",
        "category": "Electronics",
        "price": 149.99,
        "status": "active",
        "createdAt": "2026-09-07T10:13:01.548Z",
        "updatedAt": "2026-09-07T10:13:01.548Z"
      }
    ],
    "pagination": {
      "total": 1,
      "page": 1,
      "limit": 10,
      "totalPages": 1
    }
  }
  ```

---

### 4. Get Details of a Resource
- **Endpoint**: `GET /api/resources/:id`
- **Example curl**:
  ```bash
  curl http://localhost:3000/api/resources/1
  ```
- **Response** `200 OK`:
  ```json
  {
    "success": true,
    "data": {
      "id": 1,
      "title": "Smart Watch Pro",
      "description": "Fitness tracking with AMOLED display",
      "category": "Electronics",
      "price": 149.99,
      "status": "active",
      "createdAt": "2026-09-07T10:13:01.548Z",
      "updatedAt": "2026-09-07T10:13:01.548Z"
    }
  }
  ```
- **Response** `404 Not Found`:
  ```json
  {
    "success": false,
    "message": "Resource with ID 999 not found"
  }
  ```

---

### 5. Update Resource Details
- **Endpoint**: `PUT /api/resources/:id` or `PATCH /api/resources/:id`
- **Headers**: `Content-Type: application/json`
- **Request Body** (provide any fields to update):
  ```json
  {
    "price": 129.99,
    "description": "Updated price on seasonal sale!"
  }
  ```
- **Example curl**:
  ```bash
  curl -X PUT http://localhost:3000/api/resources/1 \
    -H "Content-Type: application/json" \
    -d '{
      "price": 129.99,
      "description": "Updated price on seasonal sale!"
    }'
  ```
- **Response** `200 OK`:
  ```json
  {
    "success": true,
    "data": {
      "id": 1,
      "title": "Smart Watch Pro",
      "description": "Updated price on seasonal sale!",
      "category": "Electronics",
      "price": 129.99,
      "status": "active",
      "createdAt": "2026-09-07T10:13:01.548Z",
      "updatedAt": "2026-09-07T10:15:20.120Z"
    },
    "message": "Resource updated successfully"
  }
  ```

---

### 6. Delete a Resource
- **Endpoint**: `DELETE /api/resources/:id`
- **Example curl**:
  ```bash
  curl -X DELETE http://localhost:3000/api/resources/1
  ```
- **Response** `200 OK`:
  ```json
  {
    "success": true,
    "message": "Resource deleted successfully"
  }
  ```
