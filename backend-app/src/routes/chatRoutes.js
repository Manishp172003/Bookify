import express from "express";
import {
  getConversationHistory,
  getUserConversations,
  sendMessage,
  markAsRead,
} from "../controllers/chatController.js";

const router = express.Router();

router.get("/history/:conversationId", getConversationHistory);
router.get("/conversations", getUserConversations);
router.post("/messages", sendMessage);
router.put("/read/:conversationId", markAsRead);

export default router;
