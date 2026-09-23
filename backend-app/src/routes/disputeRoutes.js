import express from "express";
import { protect, authorize } from "../middleware/authMiddleware.js";
import {
  raiseDispute,
  getDisputes,
  resolveDispute,
} from "../controllers/disputeController.js";

const router = express.Router();

router.use(protect);

// Buyer raises dispute
router.post("/raise", raiseDispute);

// Admin / platform view of disputes
router.get("/", getDisputes);

// Admin resolves dispute
router.patch("/:id/resolve", authorize("admin"), resolveDispute);

export default router;
