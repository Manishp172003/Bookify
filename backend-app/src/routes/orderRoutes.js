import express from "express";

import {
  createOrder,
  verifyPayment,
  getMyOrders,
  getMySales,
  getOrderById,
  updateOrderStatus,
  razorpayWebhook,
} from "../controllers/orderController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Live Razorpay Webhook (public with cryptographic signature verification)
router.post("/razorpay-webhook", razorpayWebhook);

router.post("/create", protect, createOrder);

router.post("/verify-payment", protect, verifyPayment);

router.get("/my-orders", protect, getMyOrders);

router.get("/my-sales", protect, getMySales);

router.get("/:id", protect, getOrderById);

router.patch("/:id/status", protect, updateOrderStatus);

export default router;