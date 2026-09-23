import mongoose from "mongoose";

const disputeSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },
    orderCode: {
      type: String,
      required: true,
    },
    buyerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    buyerName: {
      type: String,
      required: true,
    },
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    sellerName: {
      type: String,
      default: "Student Seller",
    },
    issue: {
      type: String,
      required: true,
      enum: [
        "Wrong / Damaged Book",
        "Not as Described",
        "Missing Pages or Severe Markings",
        "Item Not Received",
        "Late Delivery",
        "Other",
      ],
    },
    description: {
      type: String,
      default: "",
    },
    amount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["Open", "Under Review", "Resolved"],
      default: "Open",
    },
    resolution: {
      decision: {
        type: String,
        enum: ["Refund Buyer", "Release to Seller", "None"],
        default: "None",
      },
      notes: {
        type: String,
        default: "",
      },
      resolvedAt: {
        type: Date,
      },
    },
  },
  { timestamps: true }
);

const Dispute = mongoose.model("Dispute", disputeSchema);
export default Dispute;
