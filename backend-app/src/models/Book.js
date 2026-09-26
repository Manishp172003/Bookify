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
  },

  location: {
    type: String,
  },

  isPublisherListing: {
    type: Boolean,
    default: false,
  },

  // ---- Author Specific Publishing Fields ----
  isAuthorOriginal: {
    type: Boolean,
    default: false,
  },
  subtitle: {
    type: String,
    default: "",
  },
  subCategory: {
    type: String,
    default: "",
  },
  language: {
    type: String,
    default: "English",
  },
  tags: [
    {
      type: String,
    },
  ],
  bookType: {
    type: String,
    enum: ["eBook", "Paperback", "Hardcover"],
    default: "eBook",
  },
  manuscriptUrl: {
    type: String,
    default: "",
  },
  sampleChapterUrl: {
    type: String,
    default: "",
  },
  rentalPrice: {
    type: Number,
    default: 0,
  },
  allowExchanges: {
    type: Boolean,
    default: true,
  },
  salesCount: {
    type: Number,
    default: 0,
  },
  totalEarnings: {
    type: Number,
    default: 0,
  },
  adminReviewNotes: {
    type: String,
    default: "",
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Book = mongoose.model("Book", bookSchema);

export default Book;