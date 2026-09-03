# 📚 Bookify — Campus-to-Community Book Marketplace

Welcome to the **Bookify** monorepo repository! Bookify is India's ultimate campus-to-community marketplace enabling students and readers to buy, sell, rent, swap pre-owned semester textbooks, and support independent authors.

---

## 🏗️ Repository Architecture

This repository contains both the client and server applications in dedicated workspaces:

```
Bookify/
├── 📁 frontend-app/    # React 19 + Vite + Tailwind CSS v4 UI
└── 📁 backend-app/     # Node.js + Express + PostgreSQL/Prisma + Socket.io API
```

---

## 🚀 Quick Start Guide

### 1. Frontend Development (`frontend-app`)
To run the client application locally:

```bash
# Navigate to frontend directory
cd frontend-app

# Install dependencies
npm install

# Start Vite development server
npm run dev
```
* The frontend server will start at: `http://localhost:5173/`

---

### 2. Backend Development (`backend-app`)
To run the server and APIs locally:

```bash
# Navigate to backend directory
cd backend-app

# Install dependencies
npm install

# Copy environment variables template
cp .env.example .env

# Run development server
npm run dev
```
* The backend API server will start at: `http://localhost:5000/`

---

## 🌿 Branching & Contribution Guidelines
* **`main`**: Production-ready, stable releases.
* **`develop`**: Default development branch where feature branches are integrated.
* **Feature Branches**: Branch from `develop` (`feature/<feature-name>`), build and test, then open a PR back into `develop`.
