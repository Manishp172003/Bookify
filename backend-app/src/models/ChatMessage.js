import mongoose from "mongoose";

const chatMessageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: String,
      required: true,
      index: true,
    },
    senderId: {
      type: String,
      required: true,
      index: true,
    },
    senderName: {
      type: String,
      required: true,
      default: "Student User",
    },
    senderEmail: {
      type: String,
      default: "",
    },
    senderAvatar: {
      type: String,
      default: null,
    },
    recipientId: {
      type: String,
      default: null,
      index: true,
    },
    recipientName: {
      type: String,
      default: "Peer User",
    },
    recipientEmail: {
      type: String,
      default: "",
    },
    text: {
      type: String,
      required: true,
      trim: true,
    },
    time: {
      type: String,
      default: () => new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
    },
    book: {
      id: { type: mongoose.Schema.Types.Mixed },
      title: { type: String },
      author: { type: String },
      price: { type: Number },
      originalPrice: { type: Number },
      condition: { type: String },
      image: { type: String },
    },
    status: {
      type: String,
      enum: ["sent", "delivered", "read"],
      default: "sent",
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for fast conversation lookups sorted by creation date
chatMessageSchema.index({ conversationId: 1, createdAt: 1 });

const ChatMessage = mongoose.model("ChatMessage", chatMessageSchema);

export default ChatMessage;
