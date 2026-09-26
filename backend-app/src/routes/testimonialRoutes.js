import express from "express";
import {
  getFeaturedTestimonials,
  submitTestimonial,
  getAdminTestimonials,
  updateTestimonialStatus,
  toggleFeaturedTestimonial,
  deleteTestimonial,
} from "../controllers/testimonialController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// ==========================================
// Public Routes
// ==========================================
router.get("/", getFeaturedTestimonials);
router.get("/featured", getFeaturedTestimonials);

// ==========================================
// Authenticated Student / Author Routes
// ==========================================
router.post("/", protect, submitTestimonial);

// ==========================================
// Admin Moderation Routes
// ==========================================
router.get("/admin", protect, authorize("admin"), getAdminTestimonials);
router.patch("/admin/:id/status", protect, authorize("admin"), updateTestimonialStatus);
router.patch("/admin/:id/toggle-featured", protect, authorize("admin"), toggleFeaturedTestimonial);
router.delete("/admin/:id", protect, authorize("admin"), deleteTestimonial);

export default router;
