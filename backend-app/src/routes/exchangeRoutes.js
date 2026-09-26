import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getMyExchanges,
  proposeExchange,
  respondExchange,
  completeExchange,
} from "../controllers/exchangeController.js";

const router = express.Router();

router.use(protect);

router.get("/my-exchanges", getMyExchanges);
router.post("/", proposeExchange);
router.post("/propose", proposeExchange);
router.patch("/:id/respond", respondExchange);
router.patch("/:id/complete", completeExchange);

export default router;
