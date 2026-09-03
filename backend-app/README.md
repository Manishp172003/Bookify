# 🚀 Bookify Backend Service

Welcome to the backend API & Realtime Socket service for **Bookify**.

---

## 🛠️ Tech Stack
* **Runtime**: Node.js
* **Framework**: Express.js
* **Authentication**: JSON Web Tokens (JWT) + bcrypt
* **Realtime Engine**: Socket.io (for direct campus buyer-seller chat)
* **Database**: PostgreSQL (with Prisma ORM) / Redis

---

## 📂 Architecture Overview
```
backend-app/
├── src/
│   ├── config/        # Database & external service configurations
│   ├── controllers/   # Request handler functions
│   ├── middleware/    # Auth, validation, error handler middlewares
│   ├── models/        # Database schemas / Prisma models
│   ├── routes/        # Express route definitions
│   ├── sockets/       # Socket.io connection & event handlers
│   ├── app.js         # Express app initialization & middleware registration
│   └── server.js      # Server entry point & HTTP/Socket listener
├── .env.example       # Template for environment variables
└── package.json       # Project dependencies & scripts
```

---

## 🏃 Running Locally

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment:
   ```bash
   cp .env.example .env
   ```

3. Start development server with live reload:
   ```bash
   npm run dev
   ```
