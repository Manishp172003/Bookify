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

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Book = mongoose.model("Book", bookSchema);

export default Book;