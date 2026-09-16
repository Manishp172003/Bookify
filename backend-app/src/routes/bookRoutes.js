import express from "express";

import {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  updateBookStatus,
  deleteBook,
  getCategories,
  getMyListings,
  lookupISBN,
} from "../controllers/bookController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// ─── Static / named routes first (must come before /:id) ─────────────────────
router.get("/categories/list", getCategories);

router.get("/my", protect, getMyListings);

// ─── ISBN Auto-Fill Proxy (public — no auth required) ────────────────────────
// GET /api/books/isbn/:isbn
router.get("/isbn/:isbn", lookupISBN);

// ─── General CRUD ─────────────────────────────────────────────────────────────
router.get("/", getBooks);

router.get("/:id", getBookById);

router.post("/", protect, createBook);

router.put("/:id", protect, updateBook);

router.patch("/:id", protect, updateBook);

router.patch("/:id/status", protect, updateBookStatus);

router.delete("/:id", protect, deleteBook);

export default router;