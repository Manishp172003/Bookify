import mongoose from "mongoose";

const orderTimelineSchema = new mongoose.Schema({
  stage: {
    type: String,
    enum: ["Placed", "Processing", "Shipped", "Delivered", "Cancelled", "Returned"],
    required: true,
  },
  title: { type: String, required: true },
  date: { type: Date, default: Date.now },
  description: { type: String, default: "" },
  completed: { type: Boolean, default: false },
  active: { type: Boolean, default: false },
});

const orderItemSchema = new mongoose.Schema({
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Book",
  },
  title: { type: String, required: true },
  author: { type: String, default: "" },
  price: { type: Number, required: true },
  condition: { type: String, default: "Good" },
  image: { type: String, default: "" },
  quantity: { type: Number, default: 1 },
});

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
  },

  items: [orderItemSchema],

  orderType: {
    type: String,
    enum: ["Buy", "Rent", "Exchange", "Donate"],
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

  courier: {
    name: { type: String, default: "" },
    trackingNumber: { type: String, default: "" },
  },

  couponCode: {
    type: String,
  },

  expectedDeliveryDate: {
    type: Date,
  },

  deliveredAt: {
    type: Date,
  },

  timeline: [orderTimelineSchema],

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Order = mongoose.model("Order", orderSchema);

export default Order;