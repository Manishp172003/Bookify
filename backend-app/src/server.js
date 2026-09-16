import http from "http";
import dotenv from "dotenv";

import app from "./app.js";
import connectDB from "./config/db.js";
import { initSocket } from "./config/socket.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

initSocket(server);

const startServer = async () => {
  try {
    await connectDB();

    server.listen(PORT, () => {
      console.log("=========================================");
      console.log(`🚀 Bookify API running on port: ${PORT}`);
      console.log(`📡 Socket server initialized`);
      console.log(
        `🌍 Environment: ${process.env.NODE_ENV || "development"}`
      );
      console.log("=========================================");
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();