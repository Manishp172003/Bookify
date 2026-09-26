import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getMyRentals,
  createRental,
  extendRental,
  requestReturn,
  confirmReturn,
} from "../controllers/rentalController.js";

const router = express.Router();

router.use(protect);

router.get("/my-rentals", getMyRentals);
router.post("/", createRental);
router.post("/create", createRental);
router.patch("/:id/extend", extendRental);
router.patch("/:id/return-request", requestReturn);
router.patch("/:id/confirm-return", confirmReturn);

export default router;
