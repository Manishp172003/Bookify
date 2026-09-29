import express from "express";

import {
  createOrder,
  verifyPayment,
  getMyOrders,
  getMySales,
  getOrderById,
  updateOrderStatus,
  confirmReceiptAndReleaseEscrow,
  razorpayWebhook,
} from "../controllers/orderController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Live Razorpay Webhook (public with cryptographic signature verification)
router.post("/razorpay-webhook", razorpayWebhook);

router.post("/", protect, createOrder);
router.post("/create", protect, createOrder);

router.post("/verify-payment", protect, verifyPayment);

router.get("/my-orders", protect, getMyOrders);

router.get("/my-sales", protect, getMySales);

router.get("/:id", protect, getOrderById);

router.patch("/:id/status", protect, updateOrderStatus);

// Buyer confirmation & escrow release endpoint
router.post("/:id/confirm-receipt", protect, confirmReceiptAndReleaseEscrow);
router.patch("/:id/confirm-receipt", protect, confirmReceiptAndReleaseEscrow);

export default router;