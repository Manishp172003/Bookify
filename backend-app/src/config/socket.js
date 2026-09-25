import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import ChatMessage from "../models/ChatMessage.js";

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: (origin, callback) => callback(null, true),
      methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
      credentials: true,
    },
  });

  io.use(async (socket, next) => {
    try {
      const token =
        socket.handshake.auth?.token ||
        socket.handshake.headers?.authorization?.split(" ")[1];

      if (token) {
        try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
          const user = await User.findById(decoded.id).select("-password");
          if (user) {
            socket.user = user;
            return next();
          }
        } catch (jwtErr) {
          console.warn("[Socket Auth] Token verification warning:", jwtErr.message);
        }
      }

      // Safe fallback for dev testing / user state
      const fallbackUser = socket.handshake.auth?.user;
      if (fallbackUser) {
        socket.user = {
          _id: fallbackUser.id || fallbackUser._id || "guest_user",
          fullName: fallbackUser.fullName || fallbackUser.name || "Student User",
          email: fallbackUser.email || "student@bookify.com",
          role: fallbackUser.role || "student"
        };
        return next();
      }

      // Anonymous guest fallback
      socket.user = {
        _id: `guest_${socket.id.substring(0, 6)}`,
        fullName: "Student Guest",
        email: "guest@bookify.com",
        role: "student"
      };
      next();
    } catch (error) {
      next();
    }
  });

  io.on("connection", (socket) => {
    const userId = socket.user._id?.toString() || socket.user.id || socket.id;

    socket.join(`user:${userId}`);

    if (socket.user.role === "admin") {
      socket.join("admins");
    }

    // Direct Conversation Chat Rooms
    socket.on("joinChat", (conversationId) => {
      if (conversationId) {
        socket.join(`chat:${conversationId}`);
        console.log(`[Socket] User ${socket.user.fullName} joined room: chat:${conversationId}`);
      }
    });

    socket.on("leaveChat", (conversationId) => {
      if (conversationId) {
        socket.leave(`chat:${conversationId}`);
      }
    });

    socket.on("sendChatMessage", async (payload) => {
      const { conversationId, text, senderName, senderEmail, senderId, senderAvatar, book, recipientId, recipientName, recipientEmail, time } = payload || {};
      if (!conversationId || !text) return;

      const formattedTime = time || new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

      try {
        const savedMsg = await ChatMessage.create({
          conversationId,
          senderId: senderId || userId,
          senderName: senderName || socket.user.fullName || "Student User",
          senderEmail: senderEmail || socket.user.email || "",
          senderAvatar: senderAvatar || null,
          recipientId: recipientId || null,
          recipientName: recipientName || "Peer User",
          recipientEmail: recipientEmail || "",
          text,
          time: formattedTime,
          book: book || null,
          status: "sent",
        });

        const messageData = {
          id: savedMsg._id.toString(),
          conversationId,
          senderId: savedMsg.senderId,
          senderName: savedMsg.senderName,
          senderEmail: savedMsg.senderEmail,
          senderAvatar: savedMsg.senderAvatar,
          recipientId: savedMsg.recipientId,
          recipientName: savedMsg.recipientName,
          text: savedMsg.text,
          time: savedMsg.time,
          book: savedMsg.book,
          status: savedMsg.status,
          createdAt: savedMsg.createdAt,
        };

        // Broadcast to all connected clients
        io.emit("newChatMessage", messageData);

        // Also send notification directly to recipient's personal user room if recipientId is known
        if (recipientId) {
          io.to(`user:${recipientId}`).emit("chatNotification", {
            conversationId,
            senderName: messageData.senderName,
            snippet: text,
          });
        }
      } catch (dbErr) {
        console.error("[Socket] Failed to persist message to MongoDB:", dbErr);
        // Fallback live broadcast if DB transiently fails
        const messageData = {
          id: payload.id || `msg_live_${Date.now()}`,
          conversationId,
          senderId: senderId || userId,
          senderName: senderName || socket.user.fullName,
          senderEmail: senderEmail || socket.user.email,
          text,
          time: formattedTime,
          book: book || null,
          status: "sent",
          sentAt: new Date(),
        };
        io.emit("newChatMessage", messageData);
      }
    });

    // Order/Escrow Rooms
    socket.on("joinOrderRoom", (orderId) => {
      socket.join(`order:${orderId}`);
    });

    socket.on("leaveOrderRoom", (orderId) => {
      socket.leave(`order:${orderId}`);
    });

    socket.on("sendMessage", ({ orderId, message }) => {
      if (!orderId || !message) {
        return;
      }

      io.to(`order:${orderId}`).emit("newMessage", {
        senderId: userId,
        senderName: socket.user.fullName,
        message,
        sentAt: new Date(),
      });
    });

    socket.on("disconnect", () => {
      console.log(`[Socket] User disconnected: ${socket.id}`);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }

  return io;
};