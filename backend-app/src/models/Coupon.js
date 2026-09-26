import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
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
      min: 0,
    },

    minPurchase: {
      type: Number,
      default: 0,
      min: 0,
    },

    // If empty, coupon applies to all books
    applicableBooks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Book",
      },
    ],

    maxUses: {
      type: Number,
      default: 0,
      min: 0,
    },

    usedCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    maxDiscountAmount: {
      type: Number,
      default: 0,
      min: 0,
    },

    expiresAt: {
      type: Date,
      default: null,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Same coupon code can exist for different authors,
// but the same author cannot create the same code twice.
couponSchema.index(
  { authorId: 1, code: 1 },
  { unique: true }
);

// Validation
couponSchema.pre("validate", function (next) {
  // Percentage validation
  if (
    this.discountType === "Percentage" &&
    this.discountValue > 100
  ) {
    return next(
      new Error("A percentage discount cannot exceed 100%")
    );
  }

  // Expiry validation
  if (
    this.expiresAt &&
    new Date(this.expiresAt) <= new Date()
  ) {
    return next(
      new Error("The expiry date must be in the future")
    );
  }

  // Flat discount should not be greater than 0
  if (this.discountValue < 0) {
    return next(
      new Error("Discount value cannot be negative")
    );
  }

  // Used count cannot exceed max uses
  if (
    this.maxUses > 0 &&
    this.usedCount > this.maxUses
  ) {
    return next(
      new Error("Used count cannot exceed maximum uses")
    );
  }

  next();
});

// Check whether coupon can currently be used
couponSchema.methods.checkUsable = function () {
  if (!this.isActive) {
    return "This coupon is no longer active";
  }

  if (
    this.expiresAt &&
    new Date(this.expiresAt) <= new Date()
  ) {
    return "This coupon has expired";
  }

  if (
    this.maxUses > 0 &&
    this.usedCount >= this.maxUses
  ) {
    return "This coupon has reached its usage limit";
  }

  return null;
};

// Calculate discount
couponSchema.methods.discountFor = function (amount) {
  if (amount <= 0) {
    return 0;
  }

  let rawDiscount;

  if (this.discountType === "Percentage") {
    rawDiscount =
      (amount * this.discountValue) / 100;
  } else {
    rawDiscount = this.discountValue;
  }

  // Apply maximum discount limit
  const cappedDiscount =
    this.maxDiscountAmount > 0
      ? Math.min(rawDiscount, this.maxDiscountAmount)
      : rawDiscount;

  // Discount cannot be greater than purchase amount
  const finalDiscount = Math.min(
    cappedDiscount,
    amount
  );

  return Math.round(finalDiscount * 100) / 100;
};

const Coupon = mongoose.model("Coupon", couponSchema);

export default Coupon;