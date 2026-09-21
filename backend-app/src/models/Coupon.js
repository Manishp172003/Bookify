import mongoose from "mongoose";

const couponSchema = new mongoose.Schema({
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  code: {
    type: String,
    required: true,
    unique: true,
  },

  discountType: {
    type: String,
    enum: ["Flat", "Percentage", "fixed", "percentage", "flat"],
    required: true,
  },

  discountValue: {
    type: Number,
    required: true,
  },

  minPurchase: {
    type: Number,
    default: 0,
  },

  applicableBooks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
    },
  ],

  maxUses: {
    type: Number,
    default: 0,
  },

  usedCount: {
    type: Number,
    default: 0,
  },

  expiresAt: {
    type: Date,
  },

  isActive: {
    type: Boolean,
    default: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Coupon = mongoose.model("Coupon", couponSchema);

export default Coupon;