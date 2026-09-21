import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  buyerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Book",
    required: true,
  },

  orderType: {
    type: String,
    enum: ["Buy", "Rent", "Exchange", "Donate"],
    required: true,
  },

  amount: {
    type: Number,
    required: true,
  },

  status: {
    type: String,
    enum: [
      "Placed",
      "Processing",
      "Shipped",
      "Delivered",
      "Cancelled",
      "Returned",
    ],
    default: "Placed",
  },

  paymentMethod: {
    type: String,
    enum: ["Razorpay", "COD", "Wallet"],
    required: true,
  },

  paymentStatus: {
    type: String,
    enum: ["Pending", "Completed", "Failed", "Refunded"],
    default: "Pending",
  },

  razorpayOrderId: {
    type: String,
    index: true,
  },

  razorpayPaymentId: {
    type: String,
  },

  paidAt: {
    type: Date,
  },

  escrowStatus: {
    type: String,
    enum: ["Held", "Released", "Refunded"],
    default: "Held",
  },

  shippingAddress: {
    fullName: String,
    phone: String,
    address: String,
    city: String,
    pincode: String,
  },

  couponCode: {
    type: String,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Order = mongoose.model("Order", orderSchema);

export default Order;