 import http from 'http';
import dotenv from 'dotenv';
import mongoose from 'mongoose'; // 1. Import mongoose
import { Server as SocketIOServer } from 'socket.io';
import app from './app.js';

dotenv.config();

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

// Initialize Socket.io
const io = new SocketIOServer(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Socket connection lifecycle
io.on('connection', (socket) => {
  console.log(`[Socket] User connected: ${socket.id}`);

  socket.on('disconnect', () => {
    console.log(`[Socket] User disconnected: ${socket.id}`);
  });
});

// 2. Connect to MongoDB and then start the server
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log(`📦 Connected to MongoDB successfully`);
    
    // Start listening only after DB connection succeeds
    server.listen(PORT, () => {
      console.log(`=========================================`);
      console.log(`🚀 Bookify API running on port: ${PORT}`);
      console.log(`📡 Socket server initialized`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`=========================================`);
    });
  })
  .catch((err) => {
    console.error(`❌ MongoDB connection error: ${err.message}`);
    process.exit(1);
  });