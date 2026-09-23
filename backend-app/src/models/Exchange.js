import mongoose from "mongoose";

const exchangeSchema = new mongoose.Schema(
  {
    exchangeCode: {
      type: String,
      unique: true,
      sparse: true,
    },
    proposerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    proposerName: {
      type: String,
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverName: {
      type: String,
      required: true,
    },
    requestedBook: {
      bookId: { type: mongoose.Schema.Types.ObjectId, ref: "Book" },
      title: { type: String, required: true },
      author: { type: String, default: "" },
      condition: { type: String, default: "Good" },
      coverClass: { type: String, default: "from-[#111827] to-[#374151]" },
      coverImage: { type: String, default: "" },
    },
    offeredBook: {
      bookId: { type: mongoose.Schema.Types.ObjectId, ref: "Book" },
      title: { type: String, required: true },
      author: { type: String, default: "" },
      condition: { type: String, default: "Good" },
      coverClass: { type: String, default: "from-[#065F46] to-[#047857]" },
      coverImage: { type: String, default: "" },
    },
    meetupLocation: {
      type: String,
      default: "Campus Central Library / Student Center",
    },
    note: {
      type: String,
      default: "Let's meet up on campus to exchange textbooks!",
    },
    status: {
      type: String,
      enum: ["Pending Decision", "Accepted - Meetup Pending", "Completed", "Declined"],
      default: "Pending Decision",
    },
    chatId: {
      type: String,
      default: "",
    },
    completedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

// Auto-generate exchange code before saving if not present
exchangeSchema.pre("save", function () {
  if (!this.exchangeCode) {
    this.exchangeCode = `SWP-${Math.floor(1000 + Math.random() * 9000)}`;
  }
});

const Exchange = mongoose.model("Exchange", exchangeSchema);
export default Exchange;
