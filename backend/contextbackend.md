# Integrated Farm Management System - Backend Architecture & Context Log

**Document Name**: `contextbackend.md`  
**Location**: `backend/contextbackend.md`  
**Last Updated**: 2026-08-21  

---

## 1. Executive Overview

This document provides a comprehensive technical reference for the backend structure built for the **Integrated Farm Management System (PRJ_533)**.

The backend is engineered as a separate Node.js / Express.js REST API service connected to MongoDB Atlas via Mongoose.

---

## 2. Completed Milestones History

### Milestone 1: Backend Authentication & Authorization Foundation (2026-08-21)
- **Directory Isolation**: Created an isolated `backend/` root directory.
- **Dependencies**: Installed `express`, `mongoose`, `jsonwebtoken`, `bcryptjs`, `cookie-parser`, `cors`, and `dotenv`.
- **Database Connection**: Built `src/config/db.js` with fail-fast process exit logic. Connected to MongoDB Atlas cluster (`ac-zgl8wai-shard-00-00.n7zxp5q.mongodb.net`).
- **User Schema**: Built `src/models/User.js` supporting lowercase unique emails, `bcryptjs` password hashing pre-save hook, role-based access (`Admin`, `Farm Manager`, `Worker`), `isActive` status flag, timestamps, and safe object serialization.
- **JWT System**: Built `src/utils/jwt.js` for token signing and verification using env variables (`JWT_SECRET`, `JWT_EXPIRES_IN`).
- **Services & Controllers**: Built `src/services/authService.js` and `src/controllers/authController.js` for `/register`, `/login`, `/logout`, and `/me`.
- **Middleware Security**: Built `src/middleware/authMiddleware.js` (HTTP-only cookie & Bearer token parsing), `src/middleware/roleMiddleware.js` (Role-Based Access Control), and `src/middleware/errorMiddleware.js` (sanitized global error handler).
- **Verification**: Ran `npm install` and verified all module imports and JWT signing/verification unit tests with zero errors.

### Milestone 2: Frontend-Backend Integration & CORS Resolution (2026-08-21)
- **User Profile Route**: Added `src/routes/userRoutes.js` and mounted `GET /api/users/profile` in `src/server.js` protected by `authMiddleware`.
- **CORS & Port Alignment**: Updated CORS configuration in `server.js` and `CLIENT_URL=http://localhost:3000` in `.env` to dynamically allow requests from Vite development server port 3000 (`http://localhost:3000`, `http://localhost:5173`) with `credentials: true`.
- **Frontend Alignment**: Connected React `AuthContext` and `authService.ts` to execute real API requests against `/api/auth/register`, `/api/auth/login`, `/api/users/profile`, and `/api/auth/logout`.
- **Session Restoration**: Enforced backend token validation via `GET /api/users/profile` on application load and page reloads.

### Milestone 3: Google Maps GIS Integration & MongoDB Field Persistence (2026-08-21)
- **Field Sector Model**: Created `src/models/Field.js` with user relationship, field sector details, area units, soil type, crop, irrigation, coordinates, address, and telemetry.
- **Field Sector Controller & Routes**: Created `src/controllers/fieldController.js` and `src/routes/fieldRoutes.js` mounted at `/api/fields` and `/api/field-sectors` protected by `authMiddleware`.
- **MongoDB Atlas Persistence**: Enabled full CRUD persistence (`GET`, `POST`, `PUT`, `DELETE`) for user field sectors in MongoDB Atlas.

---

## 3. Directory Structure

```text
backend/
├── src/
│   ├── config/
│   │   └── db.js                 # MongoDB Atlas connection setup
│   ├── controllers/
│   │   ├── authController.js     # Route handlers for register, login, logout, getMe
│   │   └── fieldController.js    # Route handlers for field sector CRUD
│   ├── middleware/
│   │   ├── authMiddleware.js     # JWT verification & req.user protection
│   │   ├── roleMiddleware.js     # Role-Based Access Control (RBAC)
│   │   └── errorMiddleware.js    # Global error response & secret sanitization
│   ├── models/
│   │   ├── User.js               # Mongoose User schema
│   │   └── Field.js              # Mongoose Field Sector schema
│   ├── routes/
│   │   ├── authRoutes.js         # Express router for /api/auth endpoints
│   │   ├── userRoutes.js         # Express router for /api/users endpoints (/profile)
│   │   └── fieldRoutes.js        # Express router for /api/fields & /api/field-sectors
│   ├── services/
│   │   └── authService.js        # Business logic (register, login, get profile)
│   ├── utils/
│   │   └── jwt.js                # JWT signing & verification helpers
│   └── server.js                 # Express app initialization, CORS, cookie-parser, listener
├── .env                          # Local environment variables
├── .env.example                  # Reference environment template
├── .gitignore                    # Git ignore file for node_modules and secrets
├── contextbackend.md             # Backend architecture context log (this file)
├── package.json                  # Node dependencies and execution scripts
└── README.md                     # Comprehensive backend documentation and API testing guide
```

---

## 4. Technology Stack & Framework Rules

- **Runtime**: Node.js
- **Web Framework**: Express.js
- **Database / ODM**: MongoDB Atlas via Mongoose
- **Token Security**: `jsonwebtoken` (JWT)
- **Password Hashing**: `bcryptjs` (salt rounds = 10)
- **Cookie Parser**: `cookie-parser`
- **CORS**: `cors` (configured with `credentials: true` for `http://localhost:3000`)
- **Environment Management**: `dotenv`

---

## 5. File Responsibilities

1. **[`package.json`](file:///c:/Users/Rohith%20S%20D/OneDrive/Documents/Farm%20Management/backend/package.json)**: Declares dependencies (`express`, `mongoose`, `jsonwebtoken`, `bcryptjs`, `cookie-parser`, `cors`, `dotenv`) and execution scripts (`npm start`, `npm run dev`).
2. **[`src/config/db.js`](file:///c:/Users/Rohith%20S%20D/OneDrive/Documents/Farm%20Management/backend/src/config/db.js)**: Connects to MongoDB Atlas using `process.env.MONGODB_URI`.
3. **[`src/models/User.js`](file:///c:/Users/Rohith%20S%20D/OneDrive/Documents/Farm%20Management/backend/src/models/User.js)**: Mongoose User schema with `bcryptjs` hashing.
4. **[`src/models/Field.js`](file:///c:/Users/Rohith%20S%20D/OneDrive/Documents/Farm%20Management/backend/src/models/Field.js)**: Mongoose Field Sector schema with user relationship, coordinates, geocoded address, area units, soil, crop, and telemetry details.
5. **[`src/controllers/fieldController.js`](file:///c:/Users/Rohith%20S%20D/OneDrive/Documents/Farm%20Management/backend/src/controllers/fieldController.js)**: Route handlers for field sector listing, creation, modification, and deletion.
6. **[`src/routes/fieldRoutes.js`](file:///c:/Users/Rohith%20S%20D/OneDrive/Documents/Farm%20Management/backend/src/routes/fieldRoutes.js)**: Mounts `/api/fields` and `/api/field-sectors` endpoints protected by `authMiddleware`.
7. **[`src/server.js`](file:///c:/Users/Rohith%20S%20D/OneDrive/Documents/Farm%20Management/backend/src/server.js)**: Configures Express app, CORS, parsers, MongoDB connection, auth/user/field routes, health check, and error middleware.

---

## 6. API Endpoint Testing Reference

| Method | Endpoint | Protection | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Validates input, hashes password, creates user, sets HTTP-only JWT cookie. |
| `POST` | `/api/auth/login` | Public | Validates credentials, checks `isActive`, compares password, sets HTTP-only JWT cookie. |
| `POST` | `/api/auth/logout` | Protected | Clears `token` HTTP-only cookie. |
| `GET` | `/api/users/profile` | Protected (`authMiddleware`) | Returns authenticated user safe profile. |
| `GET` | `/api/fields` | Protected (`authMiddleware`) | Returns authenticated user's field sectors. |
| `POST` | `/api/fields` | Protected (`authMiddleware`) | Saves new field sector to MongoDB Atlas. |
| `PUT` | `/api/fields/:id` | Protected (`authMiddleware`) | Updates field sector in MongoDB Atlas. |
| `DELETE` | `/api/fields/:id` | Protected (`authMiddleware`) | Deletes field sector from MongoDB Atlas. |
