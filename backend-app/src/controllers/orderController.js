import Order from "../models/Order.js";
import Book from "../models/Book.js";
import { getIO } from "../config/socket.js";
import {
  createRazorpayOrder,
  isRazorpayConfigured,
  verifyRazorpaySignature,
} from "../services/razorpayService.js";
import { sendOrderEmails } from "../services/orderEmailService.js";

const USER_CONTACT_FIELDS = "fullName email phone mobile";

const emitToRoom = (room, event, payload) => {
  try {
    getIO().to(room).emit(event, payload);
  } catch (error) {
    console.error(`Socket emit failed (${event}):`, error.message);
  }
};

const getOrderAmount = (book, orderType) => {
  if (orderType === "Rent" && book.rentPrice) {
    return Number(book.rentPrice);
  }

  return Number(book.price);
};

const reserveBook = async (bookId, orderType) => {
  const book = await Book.findById(bookId);

  if (!book) {
    return;
  }

  book.status = orderType === "Rent" ? "Rented" : "Pending";
  await book.save();
};

const notifyOrderParties = async (orderId) => {
  const order = await Order.findById(orderId)
    .populate("buyerId", USER_CONTACT_FIELDS)
    .populate("sellerId", USER_CONTACT_FIELDS)
    .populate("bookId", "title");

  if (!order) {
    return;
  }

  await sendOrderEmails({
    order,
    buyer: order.buyerId,
    seller: order.sellerId,
    book: order.bookId,
  });
};

export const createOrder = async (req, res) => {
  let order = null;

  try {
    const { bookId, orderType, paymentMethod, shippingAddress, couponCode } =
      req.body;

    if (!bookId || !orderType || !paymentMethod) {
      return res.status(400).json({
        success: false,
        message: "bookId, orderType and paymentMethod are required",
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

    const finalAmount = getOrderAmount(book, orderType);

    if (!Number.isFinite(finalAmount) || finalAmount < 0) {
      return res.status(400).json({
        success: false,
        message: "Book price is invalid",
        data: null,
      });
    }

    if (paymentMethod === "Razorpay" && finalAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Online payment is not possible for a free book",
        data: null,
      });
    }

    order = await Order.create({
      buyerId: req.user._id,
      sellerId: book.sellerId,
      bookId,
      orderType,
      amount: finalAmount,
      paymentMethod,
      shippingAddress,
      couponCode,
    });

    let razorpayOrder = null;

    if (paymentMethod === "Razorpay") {
      razorpayOrder = await createRazorpayOrder({
        amount: finalAmount,
        receipt: order._id.toString(),
      });

      order.razorpayOrderId = razorpayOrder.id;
      await order.save();
    } else {
      await reserveBook(bookId, orderType);
      notifyOrderParties(order._id).catch((error) =>
        console.error("Order notification error:", error)
      );
    }

    emitToRoom(`user:${book.sellerId.toString()}`, "newOrder", { order });

    return res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: {
        order,
        razorpayOrder,
        razorpayKeyId:
          paymentMethod === "Razorpay" && isRazorpayConfigured()
            ? process.env.RAZORPAY_KEY_ID
            : null,
      },
    });
  } catch (error) {
    console.error("Create order error:", error);

    if (order && order.paymentMethod === "Razorpay" && !order.razorpayOrderId) {
      await Order.findByIdAndDelete(order._id).catch(() => null);
    }

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create order",
      data: null,
    });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Payment verification data is incomplete",
        data: null,
      });
    }

    if (isRazorpayConfigured()) {
      const isValid = verifyRazorpaySignature({
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
        signature: razorpay_signature,
      });

      if (!isValid) {
        return res.status(400).json({
          success: false,
          message: "Payment verification failed",
          data: null,
        });
      }
    } else if (process.env.NODE_ENV === "production") {
      return res.status(500).json({
        success: false,
        message: "Payment gateway is not configured",
        data: null,
      });
    }

    const order = await Order.findOneAndUpdate(
      {
        razorpayOrderId: razorpay_order_id,
        buyerId: req.user._id,
        paymentStatus: { $ne: "Completed" },
      },
      {
        $set: {
          razorpayPaymentId: razorpay_payment_id,
          paymentStatus: "Completed",
          status: "Processing",
          paidAt: new Date(),
        },
      },
      { new: true }
    );

    if (!order) {
      const existingOrder = await Order.findOne({
        razorpayOrderId: razorpay_order_id,
        buyerId: req.user._id,
      });

      if (!existingOrder) {
        return res.status(404).json({
          success: false,
          message: "Order not found",
          data: null,
        });
      }

      return res.status(200).json({
        success: true,
        message: "Payment already verified",
        data: existingOrder,
      });
    }

    await reserveBook(order.bookId, order.orderType);

    emitToRoom(`user:${order.buyerId.toString()}`, "paymentSuccess", { order });
    emitToRoom(`user:${order.sellerId.toString()}`, "paymentSuccess", { order });

    notifyOrderParties(order._id).catch((error) =>
      console.error("Order notification error:", error)
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
    const orders = await Order.find({ buyerId: req.user._id })
      .populate("bookId")
      .populate("sellerId", USER_CONTACT_FIELDS)
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
    const orders = await Order.find({ sellerId: req.user._id })
      .populate("bookId")
      .populate("buyerId", USER_CONTACT_FIELDS)
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
    const isSeller = order.sellerId.toString() === userId;
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

    emitToRoom(`order:${order._id.toString()}`, "orderStatusUpdated", order);
    emitToRoom(`user:${order.buyerId.toString()}`, "orderStatusUpdated", order);
    emitToRoom(`user:${order.sellerId.toString()}`, "orderStatusUpdated", order);

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