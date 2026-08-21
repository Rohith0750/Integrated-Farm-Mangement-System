# Farm Management Backend Authentication & Authorization Structure

This repository contains the official Node.js / Express.js REST API backend structure for the **Integrated Farm Management System (PRJ_533)**.

---

## 📁 Created Project Structure

```text
backend/
├── src/
│   ├── config/
│   │   └── db.js                 # MongoDB Atlas connection setup
│   ├── controllers/
│   │   └── authController.js     # Route handlers for register, login, logout, getMe
│   ├── middleware/
│   │   ├── authMiddleware.js     # JWT verification & req.user protection
│   │   ├── roleMiddleware.js     # Role-Based Access Control (RBAC)
│   │   └── errorMiddleware.js    # Global error response & secret sanitization
│   ├── models/
│   │   └── User.js               # Mongoose schema, bcrypt password hash, safe object transformer
│   ├── routes/
│   │   └── authRoutes.js         # /api/auth router endpoints
│   ├── services/
│   │   └── authService.js        # Auth business logic (register, login, get profile)
│   ├── utils/
│   │   └── jwt.js                # JWT signing & verification helpers
│   └── server.js                 # Express app initialization, CORS, cookie-parser, listener
├── .env                          # Local environment variables
├── .env.example                  # Reference environment template
├── .gitignore                    # Git ignore file for dependencies and environment secrets
├── package.json                  # Node dependencies and execution scripts
└── README.md                     # Backend documentation and testing guide
```

---

## 🛠️ Tech Stack & Key Libraries

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB Atlas (via Mongoose ODM)
- **Token Security**: `jsonwebtoken` (JWT)
- **Password Hashing**: `bcryptjs` (salt factor 10)
- **Cookie Handler**: `cookie-parser`
- **CORS**: `cors` (with credentials support for `http://localhost:5173`)
- **Environment**: `dotenv`

---

## 🔐 How Security, Authentication, & Authorization Work

### 1. Password Hashing (`bcryptjs`)
- Plaintext passwords are **never** stored in MongoDB.
- `User.js` utilizes a Mongoose `pre('save')` hook that automatically hashes candidate passwords using `bcrypt.genSalt(10)` and `bcrypt.hash()` whenever the password field is modified.
- Passwords are set with `select: false` by default in Mongoose schemas so database queries omit hashes unless explicitly queried for authentication checks.

### 2. JWT Generation & Storage (`jwt.js` & HTTP-Only Cookies)
- Upon successful registration or login, `jwt.js` signs a JSON Web Token payload containing:
  ```json
  {
    "userId": "66c5d1...",
    "role": "Farm Manager"
  }
  ```
- The token is signed using `process.env.JWT_SECRET` with an expiration configured via `process.env.JWT_EXPIRES_IN` (e.g., `7d`).
- The token is transmitted to the client and stored inside an **HTTP-only cookie** (`token`) with security options:
  - `httpOnly: true` (prevents XSS attacks from reading token via JavaScript `document.cookie`).
  - `secure: true` in production (enforces HTTPS).
  - `sameSite: 'lax'` in development / `'strict'` in production (mitigates CSRF).

### 3. Authentication Middleware (`authMiddleware.js`)
- Intercepts requests to protected endpoints (`/api/auth/me`).
- Extracts token from `req.cookies.token` (or `Authorization: Bearer <token>` header).
- Verifies token signature using `verifyToken()`.
- Queries database to ensure user exists and `isActive === true`.
- Attaches clean user object to `req.user`.
- Rejects invalid requests with `401 Unauthorized`.

### 4. Role-Based Access Control / Authorization (`roleMiddleware.js`)
- Kept separate from token authentication.
- Accepts allowed roles, e.g. `authorizeRoles("Admin")` or `authorizeRoles("Admin", "Farm Manager")`.
- Checks `req.user.role`. If the user's role is not authorized, returns `403 Forbidden`.

---

## ⚙️ Environment Configuration (`.env`)

Create or update `backend/.env`:

```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/farm_management?retryWrites=true&w=majority
JWT_SECRET=farm_management_super_secret_jwt_key_2026_safe_dev
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

---

## 🚀 Running the Backend Server

Navigate into the `backend` directory and run:

```bash
# 1. Install dependencies
cd backend
npm install

# 2. Run in development mode (with node --watch)
npm run dev

# 3. Run in production mode
npm start
```

Expected output:
```text
[Database] MongoDB Connected: cluster0-shard-00-00.mongodb.net
[Server] Express server running in development mode on port 5000
```

---

## 🧪 Testing Authentication Endpoints

You can test all endpoints using **Postman**, **Thunder Client**, or `cURL`.

### 1. Register User (`POST /api/auth/register`)

**Request**:
```http
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "Jane Manager",
  "email": "jane@farm.agri",
  "password": "SecurePassword123",
  "role": "Farm Manager"
}
```

**Response (`201 Created`)**:
```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "_id": "66c5d1a8e2b123456789abcd",
    "name": "Jane Manager",
    "email": "jane@farm.agri",
    "role": "Farm Manager",
    "isActive": true,
    "createdAt": "2026-08-21T21:49:00.000Z",
    "updatedAt": "2026-08-21T21:49:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```
*Note: Set-Cookie header contains `token=...; HttpOnly`.*

---

### 2. User Login (`POST /api/auth/login`)

**Request**:
```http
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "jane@farm.agri",
  "password": "SecurePassword123"
}
```

**Response (`200 OK`)**:
```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "_id": "66c5d1a8e2b123456789abcd",
    "name": "Jane Manager",
    "email": "jane@farm.agri",
    "role": "Farm Manager",
    "isActive": true,
    "createdAt": "2026-08-21T21:49:00.000Z",
    "updatedAt": "2026-08-21T21:49:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### 3. Get Authenticated User Profile (`GET /api/auth/me`)

**Request**:
```http
GET http://localhost:5000/api/auth/me
Cookie: token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```
*(Or header: `Authorization: Bearer eyJhbGci...`)*

**Response (`200 OK`)**:
```json
{
  "success": true,
  "user": {
    "_id": "66c5d1a8e2b123456789abcd",
    "name": "Jane Manager",
    "email": "jane@farm.agri",
    "role": "Farm Manager",
    "isActive": true,
    "createdAt": "2026-08-21T21:49:00.000Z",
    "updatedAt": "2026-08-21T21:49:00.000Z"
  }
}
```

---

### 4. User Logout (`POST /api/auth/logout`)

**Request**:
```http
POST http://localhost:5000/api/auth/logout
```

**Response (`200 OK`)**:
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```
*Note: Clears the `token` cookie.*

---

## 🔮 Next Steps

Following this authentication foundation, the next backend components to implement are:

1. **Farm & Field Management APIs**: `/api/farms` and `/api/fields` (CRUD routes protected by `authMiddleware` and `roleMiddleware`).
2. **Crop & Soil Operations APIs**: `/api/crops` and `/api/soil`.
3. **Inventory, Worker, & Financial Modules**: `/api/inventory`, `/api/workers`, `/api/expenses`, `/api/income`, and `/api/harvests`.
4. **AI Decision Support Proxy Endpoints**: `/api/predictions` connecting to Python FastAPI ML microservice.
5. **Frontend Integration**: Connecting existing React frontend services (`authService.ts`, `api.ts`) to backend endpoints.
