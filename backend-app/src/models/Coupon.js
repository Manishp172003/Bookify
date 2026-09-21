import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    code: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
    },

  discountType: {
    type: String,
    enum: ["Flat", "Percentage"],
    required: true,
  },

  discountValue: {
    type: Number,
    required: true,
  },

    appliesTo: {
      type: String,
      enum: ["all", "selected"],
      default: "all",
    },

    bookIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Book" }],

    minOrderAmount: { type: Number, default: 0, min: 0 },
    maxDiscountAmount: { type: Number, default: 0, min: 0 },

    expiresAt: { type: Date },
    maxUses: { type: Number, default: 0, min: 0 },
    usedCount: { type: Number, default: 0, min: 0 },

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

couponSchema.index({ authorId: 1, code: 1 }, { unique: true });

couponSchema.pre("validate", function (next) {
  if (this.discountType === "percentage" && this.discountValue > 100) {
    return next(new Error("A percentage discount cannot exceed 100"));
  }
  if (this.expiresAt && new Date(this.expiresAt) <= new Date()) {
    return next(new Error("The expiry date must be in the future"));
  }
  if (this.appliesTo === "selected" && this.bookIds.length === 0) {
    return next(new Error("Select at least one book for this coupon"));
  }
  next();
});

couponSchema.methods.checkUsable = function () {
  if (!this.isActive) return "This coupon is no longer active";
  if (this.expiresAt && new Date(this.expiresAt) < new Date()) return "This coupon has expired";
  if (this.maxUses > 0 && this.usedCount >= this.maxUses) return "This coupon has reached its usage limit";
  return null;
};

couponSchema.methods.discountFor = function (amount) {
  const raw =
    this.discountType === "percentage"
      ? (amount * this.discountValue) / 100
      : this.discountValue;

  const capped = this.maxDiscountAmount > 0 ? Math.min(raw, this.maxDiscountAmount) : raw;
  return Math.min(Math.round(capped * 100) / 100, amount);
};

const Coupon = mongoose.model("Coupon", couponSchema);

export default Coupon;