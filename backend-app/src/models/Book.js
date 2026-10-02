import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  title: {
    type: String,
    required: true,
  },

  author: {
    type: String,
    required: true,
  },

  isbn: {
    type: String,
  },

  category: {
    type: String,
    required: true,
  },

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

  price: {
    type: Number,
    default: 0,
  },

  originalPrice: {
    type: Number,
  },

  rentalDurationWeeks: {
    type: Number,
  },

  description: {
    type: String,
  },

  images: [
    {
      type: String,
    },
  ],

  status: {
    type: String,
    enum: ["Active", "Pending", "Approved", "Rejected", "Sold", "Rented", "Inactive"],
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
    enum: ["eBook", "Paperback", "Hardcover", "Physical Book"],
    default: "Paperback",
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
  views: {
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

// Performance Indexes for marketplace search, categories, and seller listings
bookSchema.index({ sellerId: 1, status: 1 });
bookSchema.index({ category: 1, status: 1 });
bookSchema.index({ status: 1, createdAt: -1 });
bookSchema.index({ title: "text", author: "text" });
bookSchema.index({ price: 1 });

const Book = mongoose.model("Book", bookSchema);

export default Book;