import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    title: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },
    isbn: { type: String, trim: true },
    category: { type: String, required: true, trim: true },

    condition: {
      type: String,
      enum: ["New", "Like New", "Good", "Fair"],
      required: true,
    },

    transactionMode: {
      type: String,
      enum: ["Sell", "Rent", "Exchange", "Donate"],
      required: true,
    },

    price: { type: Number, default: 0, min: 0 },
    originalPrice: { type: Number, min: 0 },
    rentalDurationWeeks: { type: Number, min: 1 },

    description: { type: String, trim: true },
    images: [{ type: String }],

    status: {
      type: String,
      enum: ["Active", "Pending", "Sold", "Rented", "Inactive"],
      default: "Active",
      index: true,
    },

    location: { type: String, trim: true },
    isPublisherListing: { type: Boolean, default: false },
  },
  { timestamps: true }
);

bookSchema.index({ sellerId: 1, status: 1 });
bookSchema.index({ title: "text", author: "text", description: "text" });

bookSchema.pre("validate", function (next) {
  if (this.transactionMode === "Sell" && (!this.price || this.price <= 0)) {
    return next(new Error("A book listed for sale needs a price above zero"));
  }
  if (this.transactionMode === "Rent" && !this.rentalDurationWeeks) {
    return next(new Error("A rental listing needs a rental duration"));
  }
  if (this.transactionMode === "Donate") {
    this.price = 0;
  }
  next();
});

const Book = mongoose.model("Book", bookSchema);

export default Book;