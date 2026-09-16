import express from "express";

import {
  createOrder,
  verifyPayment,
  getMyOrders,
  getMySales,
  updateOrderStatus,
} from "../controllers/orderController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create", protect, createOrder);

router.post("/verify-payment", protect, verifyPayment);

router.get("/my-orders", protect, getMyOrders);

router.get("/my-sales", protect, getMySales);

router.patch("/:id/status", protect, updateOrderStatus);

export default router;