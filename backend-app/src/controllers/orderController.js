import crypto from "crypto";
import Razorpay from "razorpay";

import Order from "../models/Order.js";
import Book from "../models/Book.js";
import { getIO } from "../config/socket.js";

const getRazorpay = () => {
  if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
    return new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }
  return null;
};

export const createOrder = async (req, res) => {
  try {
    const {
      bookId,
      orderType,
      amount,
      paymentMethod,
      shippingAddress,
      couponCode,
    } = req.body;

    if (!bookId || !orderType || !amount || !paymentMethod) {
      return res.status(400).json({
        success: false,
        message: "bookId, orderType, amount and paymentMethod are required",
        data: null,
      });
    }

    const book = await Book.findById(bookId);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
        data: null,
      });
    }

    if (book.status !== "Active") {
      return res.status(400).json({
        success: false,
        message: "Book is not available",
        data: null,
      });
    }

    if (book.sellerId.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "You cannot order your own book",
        data: null,
      });
    }

    const order = await Order.create({
      buyerId: req.user._id,
      sellerId: book.sellerId,
      bookId,
      orderType,
      amount,
      paymentMethod,
      shippingAddress,
      couponCode,
    });

    let razorpayOrder = null;

    if (paymentMethod === "Razorpay") {
      const razorpayInstance = getRazorpay();
      if (razorpayInstance) {
        razorpayOrder = await razorpayInstance.orders.create({
          amount: Math.round(Number(amount) * 100),
          currency: "INR",
          receipt: order._id.toString(),
        });
        order.razorpayOrderId = razorpayOrder.id;
      } else {
        order.razorpayOrderId = `order_mock_${Date.now()}`;
        razorpayOrder = { id: order.razorpayOrderId, amount: Math.round(Number(amount) * 100), currency: "INR" };
      }
      await order.save();
    }

    book.status = orderType === "Rent" ? "Rented" : "Pending";

    await book.save();

    const io = getIO();

    io.to(`user:${book.sellerId.toString()}`).emit("newOrder", {
      order,
    });

    return res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: {
        order,
        razorpayOrder,
        razorpayKeyId:
          paymentMethod === "Razorpay"
            ? process.env.RAZORPAY_KEY_ID
            : null,
      },
    });
  } catch (error) {
    console.error("Create order error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create order",
      data: null,
    });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      return res.status(400).json({
        success: false,
        message: "Payment verification data is incomplete",
        data: null,
      });
    }

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(
        `${razorpay_order_id}|${razorpay_payment_id}`
      )
      .digest("hex");

    if (
      !crypto.timingSafeEqual(
        Buffer.from(expectedSignature),
        Buffer.from(razorpay_signature)
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed",
        data: null,
      });
    }

    const order = await Order.findOne({
      razorpayOrderId: razorpay_order_id,
      buyerId: req.user._id,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
        data: null,
      });
    }

    order.razorpayPaymentId = razorpay_payment_id;
    order.paymentStatus = "Completed";
    order.status = "Processing";

    await order.save();

    const io = getIO();

    io.to(`user:${order.buyerId.toString()}`).emit(
      "paymentSuccess",
      {
        order,
      }
    );

    io.to(`user:${order.sellerId.toString()}`).emit(
      "paymentSuccess",
      {
        order,
      }
    );

    return res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      data: order,
    });
  } catch (error) {
    console.error("Payment verification error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Payment verification failed",
      data: null,
    });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      buyerId: req.user._id,
    })
      .populate("bookId")
      .populate("sellerId", "fullName email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "My orders fetched successfully",
      data: orders,
    });
  } catch (error) {
    console.error("Get my orders error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch orders",
      data: null,
    });
  }
};

export const getMySales = async (req, res) => {
  try {
    const orders = await Order.find({
      sellerId: req.user._id,
    })
      .populate("bookId")
      .populate("buyerId", "fullName email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "My sales fetched successfully",
      data: orders,
    });
  } catch (error) {
    console.error("Get my sales error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch sales",
      data: null,
    });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "Placed",
      "Processing",
      "Shipped",
      "Delivered",
      "Cancelled",
      "Returned",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status",
        data: null,
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
        data: null,
      });
    }

    const userId = req.user._id.toString();

    const isSeller =
      order.sellerId.toString() === userId;

    const isAdmin = req.user.role === "admin";

    if (!isSeller && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this order",
        data: null,
      });
    }

    order.status = status;

    await order.save();

    if (status === "Delivered") {
      const book = await Book.findById(order.bookId);

      if (book && order.orderType !== "Rent") {
        book.status = "Sold";
        await book.save();
      }
    }

    const io = getIO();

    io.to(`order:${order._id.toString()}`).emit(
      "orderStatusUpdated",
      order
    );

    io.to(`user:${order.buyerId.toString()}`).emit(
      "orderStatusUpdated",
      order
    );

    io.to(`user:${order.sellerId.toString()}`).emit(
      "orderStatusUpdated",
      order
    );

    return res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      data: order,
    });
  } catch (error) {
    console.error("Update order status error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update order status",
      data: null,
    });
  }
};