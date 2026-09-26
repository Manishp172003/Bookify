import express from "express";
import {
  subscribe,
  unsubscribe,
  getSubscribers,
  deleteSubscriber,
  exportSubscribers,
} from "../controllers/newsletterController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.post("/subscribe", subscribe);
router.get("/unsubscribe/:token", unsubscribe);

// Admin-only routes
router.get("/admin/subscribers", protect, authorize("admin"), getSubscribers);
router.delete("/admin/subscribers/:id", protect, authorize("admin"), deleteSubscriber);
router.get("/admin/export", protect, authorize("admin"), exportSubscribers);

export default router;
