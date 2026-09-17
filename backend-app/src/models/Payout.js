import mongoose from "mongoose";

const payoutSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    userRole: {
      type: String,
      enum: ["author", "student"],
      default: "author",
    },
    amount: {
      type: Number,
      required: true,
      min: 1,
    },
    payoutMethod: {
      type: String,
      enum: ["UPI", "Bank Account"],
      required: true,
    },
    payoutDetails: {
      upiId: { type: String, default: "" },
      accountName: { type: String, default: "" },
      accountNumber: { type: String, default: "" },
      ifscCode: { type: String, default: "" },
    },
    status: {
      type: String,
      enum: ["pending", "processing", "completed", "rejected"],
      default: "pending",
      index: true,
    },
    transactionRef: {
      type: String,
      default: "",
    },
    adminNotes: {
      type: String,
      default: "",
    },
    processedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

const Payout = mongoose.model("Payout", payoutSchema);
export default Payout;
