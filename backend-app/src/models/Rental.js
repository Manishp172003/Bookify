import mongoose from "mongoose";

const rentalSchema = new mongoose.Schema(
  {
    rentalCode: {
      type: String,
      unique: true,
      sparse: true,
    },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },
    bookId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
    },
    title: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      default: "",
    },
    coverImage: {
      type: String,
      default: "",
    },
    coverClass: {
      type: String,
      default: "from-[#0F172A] to-[#1E293B]",
    },
    renterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    renterName: {
      type: String,
      default: "Student Renter",
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    ownerName: {
      type: String,
      default: "Student Lender",
    },
    durationDays: {
      type: Number,
      default: 30,
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    actualReturnDate: {
      type: Date,
    },
    depositAmount: {
      type: Number,
      default: 300,
    },
    rentalFee: {
      type: Number,
      default: 150,
    },
    status: {
      type: String,
      enum: ["active", "return_initiated", "completed", "overdue"],
      default: "active",
    },
    notes: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

// Auto-generate rental code before saving if not present
rentalSchema.pre("save", function () {
  if (!this.rentalCode) {
    this.rentalCode = `RNT-${Math.floor(10000 + Math.random() * 90000)}`;
  }
});

const Rental = mongoose.model("Rental", rentalSchema);
export default Rental;
