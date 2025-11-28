# Auth App - JWT Authentication API

## Overview
This is a Node.js/Express authentication API with JWT token-based authentication. The application provides user registration, login, token refresh, and logout functionality using MongoDB for data persistence.

**Project Status:** Fully functional and running in Replit environment  
**Last Updated:** November 28, 2025

## Project Architecture

### Technology Stack
- **Runtime:** Node.js (CommonJS)
- **Framework:** Express.js v5.1.0
- **Database:** MongoDB v7.0.16 (local instance)
- **Authentication:** JWT (jsonwebtoken)
- **Password Hashing:** bcrypt
- **Security:** helmet, cors, express-rate-limit
- **Dev Tools:** nodemon

### Directory Structure
```
/
├── src/
│   ├── config/
│   │   └── db.js              # MongoDB connection setup
│   ├── controllers/
│   │   └── auth.controller.js # Authentication logic
│   ├── middlewares/
│   │   ├── auth.middleware.js # JWT verification & authorization
│   │   └── rateLimit.middleware.js # Rate limiting configs
│   ├── models/
│   │   └── user.model.js      # User schema with password hashing
│   ├── routes/
│   │   └── auth.routes.js     # Authentication endpoints
│   ├── utils/
│   │   └── tokens.js          # JWT signing & verification
│   └── app.js                 # Express app configuration
├── server.js                  # Server entry point
├── start.sh                   # Startup script (MongoDB + Node)
└── package.json
```

## API Endpoints

All endpoints are prefixed with `/api/auth`:

- **POST /api/auth/register** - Register new user (rate limited: 5/15min)
- **POST /api/auth/login** - Login user (rate limited: 5/15min)
- **POST /api/auth/refresh** - Refresh access token
- **POST /api/auth/logout** - Logout user (requires authentication)
- **GET /api/auth/me** - Get current user info (requires authentication)
- **GET /health** - Health check endpoint

## Environment Variables

### Required Secrets (Set via Replit Secrets)
These must be set by the user for security:
- `JWT_ACCESS_SECRET` - Secret key for access tokens
- `JWT_REFRESH_SECRET` - Secret key for refresh tokens

### Already Configured
The following are already set in the shared environment:
- `PORT=5000` - Server port
- `MONGO_URI=mongodb://localhost:27017/auth-app` - MongoDB connection
- `ACCESS_TOKEN_TTL=15m` - Access token expiration
- `REFRESH_TOKEN_TTL=7d` - Refresh token expiration
- `COOKIE_SECURE=false` - Cookie security (false for dev)
- `COOKIE_SAME_SITE=lax` - Cookie SameSite policy

## Setup Notes

### MongoDB
- Local MongoDB instance runs on startup via `start.sh`
- Data stored in `/tmp/mongodb/data` (ephemeral in Replit)
- Logs stored in `/tmp/mongodb/logs/mongod.log`

### Security Features
- Passwords hashed with bcrypt (10 rounds)
- JWT-based authentication with separate access/refresh tokens
- Refresh token rotation: new refresh token issued on each refresh request
- Rate limiting on auth endpoints (5 requests per 15 minutes)
- CORS configured to accept all origins with credentials (suitable for Replit proxy)
- Helmet.js for security headers
- HTTP-only cookies for token storage

### CORS Configuration
The app is configured with `origin: true` to work with Replit's proxy system, where the user sees the app in an iframe. This allows requests from any origin with credentials enabled.

### Server Binding
The server binds to `0.0.0.0:5000` to work properly in the Replit environment and allow external access through the webview.

## Deployment

Deployment is configured for Replit's VM deployment type:
- **Target:** VM (maintains state for MongoDB)
- **Command:** `bash start.sh`
- MongoDB starts first, then Node.js server
- Suitable for maintaining database state

## Known Limitations

1. **MongoDB Data Persistence:** Data stored in `/tmp` is ephemeral and will be lost on container restarts. For production, use a hosted MongoDB service (MongoDB Atlas, etc.)
2. **JWT Secrets:** Default secrets are placeholders and MUST be replaced with secure random strings for production use
3. **Refresh Token Security:** While refresh tokens are rotated on each refresh request, there is no server-side token revocation mechanism. For production, implement token storage in the database with versioning to detect and reject reused tokens
4. **Single Instance:** Not configured for horizontal scaling due to local MongoDB

## Recent Changes

### November 28, 2025 - Initial Replit Setup
- Implemented all missing backend files (db.js, models, controllers, routes, middlewares, utilities)
- Configured MongoDB to run locally via startup script
- Updated CORS to work with Replit proxy (origin: true)
- Configured server to bind to 0.0.0.0:5000
- Set up workflow for automatic startup
- Configured VM deployment
- Added proper .gitignore for Node.js projects
- Implemented refresh token rotation for improved security

## User Preferences
None recorded yet.
