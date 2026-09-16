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
} from "../controllers/bookController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/categories/list", getCategories);

router.get("/my", protect, getMyListings);

router.get("/", getBooks);

router.get("/:id", getBookById);

router.post("/", protect, createBook);

router.put("/:id", protect, updateBook);

router.patch("/:id", protect, updateBook);

router.patch("/:id/status", protect, updateBookStatus);

router.delete("/:id", protect, deleteBook);

export default router;