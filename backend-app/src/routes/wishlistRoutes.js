import express from "express";
import {
  getWishlist,
  toggleWishlist,
  syncWishlist,
  removeFromWishlist,
  toggleAlert,
} from "../controllers/wishlistController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// All wishlist routes require an authenticated user session
router.use(verifyToken);

router.get("/", getWishlist);
router.post("/toggle", toggleWishlist);
router.post("/sync", syncWishlist);
router.delete("/:id", removeFromWishlist);
router.patch("/:id/alert", toggleAlert);

export default router;
