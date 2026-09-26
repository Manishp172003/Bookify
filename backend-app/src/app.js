import express from "express";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import bookRoutes from "./routes/bookRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import wantBoardRoutes from "./routes/wantBoardRoutes.js";
import authorRoutes from "./routes/authorRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import rentalRoutes from "./routes/rentalRoutes.js";
import exchangeRoutes from "./routes/exchangeRoutes.js";
import disputeRoutes from "./routes/disputeRoutes.js";
import payoutRoutes from "./routes/payoutRoutes.js";
import testimonialRoutes from "./routes/testimonialRoutes.js";
import newsletterRoutes from "./routes/newsletterRoutes.js";
import { getPublicSettings } from "./controllers/adminController.js";

const app = express();

// ==========================================
// Global Middlewares
// ==========================================

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (
        allowedOrigins.includes(origin) ||
        process.env.NODE_ENV !== "production" ||
        origin.includes("vercel.app") ||
        origin.includes("onrender.com") ||
        origin.includes("netlify.app")
      ) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({
    name: "Bookify Backend API",
    version: "1.0.0",
    status: "online",
    timestamp: new Date().toISOString(),
  });
});

app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/listings", bookRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/want-board", wantBoardRoutes);
app.use("/api/author", authorRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/chat", chatRoutes);

// ==========================================
// 404 Handler
// ==========================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found on Bookify API`,
    data: null,
  });
});

app.use((err, req, res, next) => {
  console.error("[Error]", err);

  res.status(err.statusCode || err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    data: null,
  });
});

export default app;