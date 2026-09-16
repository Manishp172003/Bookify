import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:5173",
      methods: ["GET", "POST"],
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

    socket.on("sendChatMessage", (payload) => {
      const { conversationId, text, senderName, senderEmail, senderId, book, recipientId, time } = payload || {};
      if (!conversationId || !text) return;

      const messageData = {
        id: payload.id || `msg_live_${Date.now()}`,
        conversationId,
        senderId: senderId || userId,
        senderName: senderName || socket.user.fullName,
        senderEmail: senderEmail || socket.user.email,
        text,
        time: time || new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
        book: book || null,
        status: "sent",
        sentAt: new Date(),
      };

      // Broadcast to all connected clients and rooms
      io.emit("newChatMessage", messageData);

      // Also send notification directly to recipient's personal user room if recipientId is known
      if (recipientId) {
        io.to(`user:${recipientId}`).emit("chatNotification", {
          conversationId,
          senderName: socket.user.fullName,
          snippet: text,
        });
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