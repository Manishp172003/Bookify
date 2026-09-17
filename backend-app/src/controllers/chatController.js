import ChatMessage from "../models/ChatMessage.js";
import { getIO } from "../config/socket.js";

/**
 * @desc Get all historical messages for a specific conversation
 * @route GET /api/chat/history/:conversationId
 */
export const getConversationHistory = async (req, res) => {
  try {
    const { conversationId } = req.params;
    if (!conversationId) {
      return res.status(400).json({ success: false, message: "conversationId is required" });
    }

    const messages = await ChatMessage.find({ conversationId })
      .sort({ createdAt: 1 })
      .lean();

    res.status(200).json({
      success: true,
      count: messages.length,
      data: messages,
    });
  } catch (error) {
    console.error("[Chat Controller] getConversationHistory error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc Get all active conversations summary
 * @route GET /api/chat/conversations
 */
export const getUserConversations = async (req, res) => {
  try {
    const userId = req.user?._id?.toString() || req.query.userId || "usr_me";
    const userEmail = req.user?.email || req.query.email || "";

    // Find all distinct conversation IDs where user participated or all conversations
    const conversationIds = await ChatMessage.distinct("conversationId");

    const conversations = [];

    for (const convId of conversationIds) {
      const lastMessage = await ChatMessage.findOne({ conversationId: convId })
        .sort({ createdAt: -1 })
        .lean();

      if (lastMessage) {
        const unreadCount = await ChatMessage.countDocuments({
          conversationId: convId,
          status: { $ne: "read" },
          senderId: { $ne: userId },
        });

        conversations.push({
          conversationId: convId,
          lastMessage: lastMessage.text,
          lastMessageTimestamp: lastMessage.time,
          book: lastMessage.book,
          senderName: lastMessage.senderName,
          recipientName: lastMessage.recipientName,
          unreadCount,
          requestStatus: lastMessage.requestStatus || "accepted",
          requesterId: lastMessage.requesterId || null,
          updatedAt: lastMessage.createdAt,
        });
      }
    }

    // Sort conversations by most recent message
    conversations.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

    res.status(200).json({
      success: true,
      data: conversations,
    });
  } catch (error) {
    console.error("[Chat Controller] getUserConversations error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc Send and persist a new chat message
 * @route POST /api/chat/messages
 */
export const sendMessage = async (req, res) => {
  try {
    const {
      conversationId,
      text,
      senderId,
      senderName,
      senderEmail,
      senderAvatar,
      recipientId,
      recipientName,
      recipientEmail,
      book,
      time,
      requestStatus,
      requesterId,
    } = req.body;

    if (!conversationId || !text) {
      return res.status(400).json({
        success: false,
        message: "conversationId and text are required",
      });
    }

    const formattedTime = time || new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

    const message = await ChatMessage.create({
      conversationId,
      senderId: senderId || req.user?._id?.toString() || "usr_me",
      senderName: senderName || req.user?.fullName || "Student User",
      senderEmail: senderEmail || req.user?.email || "",
      senderAvatar: senderAvatar || req.user?.avatar || null,
      recipientId: recipientId || null,
      recipientName: recipientName || "Peer User",
      recipientEmail: recipientEmail || "",
      text,
      time: formattedTime,
      book: book || null,
      status: "sent",
      requestStatus: requestStatus || "accepted",
      requesterId: requesterId || senderId || null,
    });

    const payload = {
      id: message._id.toString(),
      conversationId: message.conversationId,
      senderId: message.senderId,
      senderName: message.senderName,
      senderEmail: message.senderEmail,
      senderAvatar: message.senderAvatar,
      recipientId: message.recipientId,
      recipientName: message.recipientName,
      text: message.text,
      time: message.time,
      book: message.book,
      status: message.status,
      requestStatus: message.requestStatus,
      requesterId: message.requesterId,
      createdAt: message.createdAt,
    };

    // Broadcast via Socket.io if initialized
    try {
      const io = getIO();
      io.emit("newChatMessage", payload);
      if (recipientId) {
        io.to(`user:${recipientId}`).emit("chatNotification", {
          conversationId,
          senderName: message.senderName,
          snippet: text,
          requestStatus: message.requestStatus,
        });
      }
    } catch (socketErr) {
      console.warn("[Chat Controller] Socket broadcast notice:", socketErr.message);
    }

    res.status(201).json({
      success: true,
      data: payload,
    });
  } catch (error) {
    console.error("[Chat Controller] sendMessage error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc Accept a chat request
 * @route PUT /api/chat/request/:conversationId/accept
 */
export const acceptChatRequest = async (req, res) => {
  try {
    const { conversationId } = req.params;
    if (!conversationId) {
      return res.status(400).json({ success: false, message: "conversationId is required" });
    }

    await ChatMessage.updateMany(
      { conversationId },
      { $set: { requestStatus: "accepted" } }
    );

    try {
      const io = getIO();
      io.emit("chatRequestAccepted", { conversationId, requestStatus: "accepted" });
    } catch (socketErr) {
      console.warn("[Chat Controller] Socket emit error:", socketErr.message);
    }

    res.status(200).json({
      success: true,
      message: "Chat request accepted",
      conversationId,
      requestStatus: "accepted",
    });
  } catch (error) {
    console.error("[Chat Controller] acceptChatRequest error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc Decline a chat request
 * @route PUT /api/chat/request/:conversationId/decline
 */
export const declineChatRequest = async (req, res) => {
  try {
    const { conversationId } = req.params;
    if (!conversationId) {
      return res.status(400).json({ success: false, message: "conversationId is required" });
    }

    await ChatMessage.updateMany(
      { conversationId },
      { $set: { requestStatus: "rejected" } }
    );

    try {
      const io = getIO();
      io.emit("chatRequestDeclined", { conversationId, requestStatus: "rejected" });
    } catch (socketErr) {
      console.warn("[Chat Controller] Socket emit error:", socketErr.message);
    }

    res.status(200).json({
      success: true,
      message: "Chat request declined",
      conversationId,
      requestStatus: "rejected",
    });
  } catch (error) {
    console.error("[Chat Controller] declineChatRequest error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc Mark all messages in a conversation as read
 * @route PUT /api/chat/read/:conversationId
 */
export const markAsRead = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user?._id?.toString() || req.body.userId || "usr_me";

    await ChatMessage.updateMany(
      { conversationId, senderId: { $ne: userId }, status: { $ne: "read" } },
      { $set: { status: "read" } }
    );

    res.status(200).json({
      success: true,
      message: "Messages marked as read",
    });
  } catch (error) {
    console.error("[Chat Controller] markAsRead error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
