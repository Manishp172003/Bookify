import express from "express";
import {
  getConversationHistory,
  getUserConversations,
  sendMessage,
  markAsRead,
  acceptChatRequest,
  declineChatRequest,
} from "../controllers/chatController.js";

const router = express.Router();

router.get("/history/:conversationId", getConversationHistory);
router.get("/conversations", getUserConversations);
router.post("/messages", sendMessage);
router.put("/read/:conversationId", markAsRead);
router.put("/request/:conversationId/accept", acceptChatRequest);
router.put("/request/:conversationId/decline", declineChatRequest);

export default router;
