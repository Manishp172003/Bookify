import express from "express";

import {
  getWantBoard,
  createWantBoardPost,
  deleteWantBoardPost,
} from "../controllers/wantBoardController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getWantBoard);

router.post("/", protect, createWantBoardPost);

router.delete("/:id", protect, deleteWantBoardPost);

export default router;