# Todo API

Production-grade RESTful CRUD API built with **Node.js**, **Express**, **MySQL**, and **Docker**.

---

## Project Structure

```
todo-api/
├── src/
│   ├── config/
│   │   └── db.js                # MySQL connection pool
│   ├── controllers/
│   │   ├── todo.controller.js   # Todo route handlers
│   │   └── user.controller.js   # User route handlers
│   ├── middlewares/
│   │   ├── auth.middleware.js   # JWT auth verification
│   │   ├── errorHandler.js      # Global error + 404 handler
│   │   └── validate.js          # express-validator rules
│   ├── models/
│   │   ├── todo.model.js        # All SQL queries for todos
│   │   └── user.model.js        # All SQL queries for users
│   ├── routes/
│   │   ├── todo.routes.js       # Todo route definitions
│   │   └── user.routes.js       # User route definitions
│   ├── utils/
│   │   ├── generateToken.js     # JWT token generator
│   │   ├── logger.js            # Winston logger
│   │   └── response.js          # Consistent JSON responses
│   ├── app.js                   # Express app setup
│   └── server.js                # Entry point
├── .env.example
├── .dockerignore
├── .gitignore
├── docker-compose.yml
├── Dockerfile
└── package.json
```

---

## Getting Started

### 1. Clone & configure

```bash
cp .env.example .env
# Edit .env with your values
```

### 2. Run with Docker (Production)

```bash
docker compose up --build
```

API will be available at `http://localhost:3000`

### 3. Run locally (Development)

```bash
# Start only MySQL in Docker
docker compose up mysql

# Update DB_HOST=localhost in .env, then:
npm install
npm run dev
```

---

## API Reference

Base URL: `http://localhost:3000/api/v1`

---

### Health Check

| Method | Endpoint  | Description         |
|--------|-----------|---------------------|
| GET    | /health   | Server health check |

---

### Users (Auth)

| Method | Endpoint          | Description   | Auth Required |
|--------|-------------------|---------------|---------------|
| POST   | /users/register   | Register user | ❌            |
| POST   | /users/login      | Login user    | ❌            |
| POST   | /users/logout     | Logout user   | ✅            |

**POST /users/register**
```json
{
  "name": "John Doe",
  "email": "johndoe@gmail.com",
  "password": "12345678"
}
```

**POST /users/login**
```json
{
  "email": "johndoe@gmail.com",
  "password": "12345678"
}
```

---

### Todos

> All todo endpoints require a valid JWT token in the `Authorization` header:
> `Authorization: Bearer <token>`

| Method | Endpoint           | Description       |
|--------|--------------------|-------------------|
| GET    | /todos             | Get all todos     |
| POST   | /todos             | Create a todo     |
| GET    | /todos/:id         | Get a single todo |
| PATCH  | /todos/:id         | Update a todo     |
| DELETE | /todos/:id         | Delete a todo     |
| PATCH  | /todos/:id/toggle  | Toggle completed  |

---

### Query Parameters (GET /todos)

| Param     | Type    | Default | Description                         |
|-----------|---------|---------|-------------------------------------|
| page      | number  | 1       | Page number                         |
| limit     | number  | 10      | Items per page (max: 100)           |
| completed | boolean | -       | Filter by completed status          |
| priority  | string  | -       | Filter: `low` / `medium` / `high`   |
| search    | string  | -       | Search in title or description      |

---

### Request Bodies

**POST /todos**
```json
{
  "title": "Buy groceries",
  "description": "Milk, eggs, bread",
  "priority": "high"
}
```

**PATCH /todos/:id**
```json
{
  "title": "Updated title",
  "completed": true,
  "priority": "low"
}
```

---

### Response Format

All responses follow a consistent shape:

```json
{
  "status": "success | error",
  "message": "Human-readable message",
  "data": { ... }
}
```

Paginated list example:
```json
{
  "status": "success",
  "message": "Success",
  "data": {
    "todos": [ ... ],
    "pagination": {
      "total": 50,
      "page": 1,
      "limit": 10,
      "totalPages": 5
    }
  }
}
```

---

## Production Features

- **Helmet** — sets secure HTTP headers
- **CORS** — cross-origin resource sharing
- **Rate Limiting** — 100 req / 15 min per IP
- **JWT Auth** — protected routes with token verification
- **Bcrypt** — passwords are hashed before storing
- **Input Validation** — via `express-validator`
- **Winston Logger** — structured JSON logging
- **MySQL Connection Pool** — efficient DB connections
- **Graceful Shutdown** — SIGTERM/SIGINT handling
- **Multi-stage Dockerfile** — smaller, non-root image
- **Docker Healthchecks** — API waits for MySQL to be ready

---

## Example cURL Commands

```bash
# Register a user
curl -X POST http://localhost:3000/api/v1/users/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@gmail.com","password":"12345678"}'

# Login (returns a token)
curl -X POST http://localhost:3000/api/v1/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@gmail.com","password":"12345678"}'

# Create a todo (use token from login)
curl -X POST http://localhost:3000/api/v1/todos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"title":"Learn Docker","priority":"high"}'

# Get all todos
curl http://localhost:3000/api/v1/todos \
  -H "Authorization: Bearer <token>"

# Get with filters
curl "http://localhost:3000/api/v1/todos?priority=high&completed=false&page=1&limit=5" \
  -H "Authorization: Bearer <token>"

# Update a todo
curl -X PATCH http://localhost:3000/api/v1/todos/<id> \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"completed":true}'

# Toggle completed
curl -X PATCH http://localhost:3000/api/v1/todos/<id>/toggle \
  -H "Authorization: Bearer <token>"

# Delete a todo
curl -X DELETE http://localhost:3000/api/v1/todos/<id> \
  -H "Authorization: Bearer <token>"
```

---

## Environment Variables

```env
NODE_ENV=production
PORT=3000

DB_HOST=mysql
DB_PORT=3306
DB_USER=todo_user
DB_PASSWORD=todo_secure_pass
DB_NAME=todo_db

JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=7d

RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
```

---

## Docker Commands

```bash
# Start in background
docker compose up --build -d

# Watch logs
docker compose logs -f

# Watch only API logs
docker compose logs -f api

# Stop containers
docker compose down

# Stop and delete database (fresh start)
docker compose down -v

# Rebuild after code changes
docker compose up --build
```
