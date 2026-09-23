import express from "express";
import { protect, authorize } from "../middleware/authMiddleware.js";
import {
  requestPayout,
  getMyPayouts,
  getAdminPayouts,
  processPayout,
} from "../controllers/payoutController.js";

const router = express.Router();

router.use(protect);

// Student & Author withdrawal endpoints
router.post("/request", requestPayout);
router.get("/my-payouts", getMyPayouts);

// Admin payout processing endpoints
router.get("/admin/all", authorize("admin"), getAdminPayouts);
router.patch("/admin/:id/process", authorize("admin"), processPayout);

export default router;
