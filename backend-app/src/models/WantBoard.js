import mongoose from "mongoose";

const wantBoardSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  userName: {
    type: String,
  },

  bookTitle: {
    type: String,
    required: true,
  },

  author: {
    type: String,
  },

  category: {
    type: String,
  },

  budget: {
    type: Number,
  },

  urgency: {
    type: String,
    enum: ["High", "Medium", "Low"],
    default: "Medium",
  },

  status: {
    type: String,
    enum: ["Open", "Fulfilled", "Expired"],
    default: "Open",
  },

  notes: {
    type: String,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const WantBoard = mongoose.model("WantBoard", wantBoardSchema);

export default WantBoard;