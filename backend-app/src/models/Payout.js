import mongoose from "mongoose";

const payoutSchema = new mongoose.Schema(
  {
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    amount: { type: Number, required: true, min: 1 },

    method: {
      type: String,
      enum: ["UPI", "Bank Account"],
      required: true,
    },

    destination: { type: String, required: true },

    status: {
      type: String,
      enum: ["Requested", "Processing", "Paid", "Rejected"],
      default: "Requested",
      index: true,
    },

    reference: { type: String },
    note: { type: String },
    processedAt: { type: Date },
  },
  { timestamps: true }
);

const Payout = mongoose.model("Payout", payoutSchema);

export default Payout;