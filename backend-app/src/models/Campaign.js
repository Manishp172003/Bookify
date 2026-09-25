import mongoose from "mongoose";

const campaignSchema = new mongoose.Schema(
  {
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    bookId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      default: null,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    campaignType: {
      type: String,
      enum: ["home_banner", "category_boost", "flash_sale", "campus_spotlight"],
      default: "home_banner",
    },
    targetCategory: {
      type: String,
      default: "All",
    },
    discountPercentage: {
      type: Number,
      default: 0,
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: {
      type: Date,
      required: true,
    },
    budget: {
      type: Number,
      default: 0,
    },
    dailyRate: {
      type: Number,
      default: 299,
    },
    totalCost: {
      type: Number,
      default: 0,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "refunded"],
      default: "paid",
      index: true,
    },
    paymentMethod: {
      type: String,
      enum: ["wallet", "razorpay", "free_trial"],
      default: "wallet",
    },
    paymentId: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: ["scheduled", "active", "paused", "completed", "ended"],
      default: "active",
      index: true,
    },
    impressions: {
      type: Number,
      default: 0,
    },
    clicks: {
      type: Number,
      default: 0,
    },
    conversions: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Campaign = mongoose.model("Campaign", campaignSchema);
export default Campaign;
