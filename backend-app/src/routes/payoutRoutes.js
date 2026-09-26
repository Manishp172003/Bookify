import express from "express";
import { protect, authorize } from "../middleware/authMiddleware.js";
import {
  requestPayout,
  getMyPayouts,
  getWalletBalance,
  getAdminPayouts,
  processPayout,
} from "../controllers/payoutController.js";

const router = express.Router();

router.use(protect);

// Student & Author withdrawal endpoints
router.get("/balance", getWalletBalance);
router.get("/history", getMyPayouts);
router.get("/my-payouts", getMyPayouts);
router.post("/request", requestPayout);

// Admin payout processing endpoints
router.get("/admin/all", authorize("admin"), getAdminPayouts);
router.patch("/admin/:id/process", authorize("admin"), processPayout);

export default router;
