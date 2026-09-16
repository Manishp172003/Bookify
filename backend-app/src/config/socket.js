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

      if (!token) {
        return next(new Error("Authentication error: no token"));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await User.findById(decoded.id).select("-password");

      if (!user) {
        return next(new Error("Authentication error: user not found"));
      }

      socket.user = user;

      next();
    } catch (error) {
      next(new Error("Authentication error: invalid token"));
    }
  });

  io.on("connection", (socket) => {
    const userId = socket.user._id.toString();

    socket.join(`user:${userId}`);

    if (socket.user.role === "admin") {
      socket.join("admins");
    }

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