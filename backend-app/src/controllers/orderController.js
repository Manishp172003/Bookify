import crypto from "crypto";
import Order from "../models/Order.js";
import Book from "../models/Book.js";
import User from "../models/User.js";
import { getIO } from "../config/socket.js";
import { sendOrderReceiptEmail } from "../services/emailService.js";
import { createRazorpayOrder, verifyRazorpaySignature, isRazorpayConfigured } from "../services/razorpayService.js";
import { sendOrderEmails } from "../services/orderEmailService.js";

export const createOrder = async (req, res) => {
  try {
    const {
      bookId,
      items,
      orderType = "Buy",
      amount,
      subtotal,
      deliveryFee = 0,
      platformFee = 0,
      discount = 0,
      paymentMethod,
      shippingAddress,
      courier,
      couponCode,
      expectedDeliveryDate,
    } = req.body;

    const targetBookId = bookId || items?.[0]?.bookId;

    if (!targetBookId || !amount || !paymentMethod) {
      return res.status(400).json({
        success: false,
        message: "Book ID (or items), amount and paymentMethod are required",
        data: null,
      });
    }

    const book = await Book.findById(targetBookId);

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

    // Build items array
    let orderItems = [];
    if (Array.isArray(items) && items.length > 0) {
      orderItems = items.map((item) => ({
        bookId: item.bookId || book._id,
        title: item.title || book.title,
        author: item.author || book.author || "",
        price: Number(item.price || book.price || 0),
        condition: item.condition || book.condition || "Good",
        image: item.image || (book.images?.[0] || ""),
        quantity: Number(item.quantity || 1),
      }));
    } else {
      orderItems = [
        {
          bookId: book._id,
          title: book.title,
          author: book.author || "",
          price: Number(book.price || amount),
          condition: book.condition || "Good",
          image: book.images?.[0] || "",
          quantity: 1,
        },
      ];
    }

    // Default expected delivery date: 5 days from today
    const deliveryDate = expectedDeliveryDate
      ? new Date(expectedDeliveryDate)
      : new Date(Date.now() + 5 * 24 * 60 * 60 * 1000);

    const initialTimeline = [
      {
        stage: "Placed",
        title: "Order Placed",
        date: new Date(),
        description: "Your order has been placed successfully.",
        completed: true,
        active: false,
      },
      {
        stage: "Processing",
        title: "Processing",
        date: null,
        description: "Seller is preparing your package.",
        completed: false,
        active: true,
      },
      {
        stage: "Shipped",
        title: "Shipped",
        date: null,
        description: "Your package is on the way.",
        completed: false,
        active: false,
      },
      {
        stage: "Delivered",
        title: "Delivered",
        date: null,
        description: "Package delivered to your shipping address.",
        completed: false,
        active: false,
      },
    ];

    const order = await Order.create({
      buyerId: req.user._id,
      sellerId: book.sellerId,
      bookId: book._id,
      items: orderItems,
      orderType,
      subtotal: subtotal !== undefined ? Number(subtotal) : Number(amount),
      deliveryFee: Number(deliveryFee),
      platformFee: Number(platformFee),
      discount: Number(discount),
      amount: Number(amount),
      paymentMethod,
      shippingAddress,
      courier: courier || { name: "", trackingNumber: "" },
      couponCode,
      expectedDeliveryDate: deliveryDate,
      timeline: initialTimeline,
    });

    let razorpayOrder = null;

    if (paymentMethod === "Razorpay") {
      if (isRazorpayConfigured()) {
        try {
          razorpayOrder = await createRazorpayOrder({
            amount: Number(amount),
            receipt: order._id.toString(),
          });
          order.razorpayOrderId = razorpayOrder.id;
        } catch (rErr) {
          console.warn("[Razorpay] API fallback:", rErr.message);
          order.razorpayOrderId = `order_mock_${Date.now()}`;
          razorpayOrder = { id: order.razorpayOrderId, amount: Math.round(Number(amount) * 100), currency: "INR" };
        }
      } else {
        order.razorpayOrderId = `order_mock_${Date.now()}`;
        razorpayOrder = { id: order.razorpayOrderId, amount: Math.round(Number(amount) * 100), currency: "INR" };
      }
      await order.save();
    }

    book.status = orderType === "Rent" ? "Rented" : "Pending";
    await book.save();

    const io = getIO();
    io.to(`user:${book.sellerId.toString()}`).emit("newOrder", { order });

    // Send transactional order notification emails to buyer and seller
    User.findById(book.sellerId)
      .then((seller) => {
        sendOrderEmails({ order, buyer: req.user, seller, book }).catch((err) =>
          console.error("Order notification email dispatch error:", err.message)
        );
      })
      .catch((err) => console.error("Seller lookup for email failed:", err.message));

    return res.status(201).json({
      success: true,
      message: "Order placed successfully",
      data: {
        order,
        razorpayOrder,
        razorpayKeyId: paymentMethod === "Razorpay" ? process.env.RAZORPAY_KEY_ID : null,
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
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      orderId,
    } = req.body;

    const rOrderId = razorpay_order_id || razorpayOrderId;
    const rPaymentId = razorpay_payment_id || razorpayPaymentId;
    const rSignature = razorpay_signature || razorpaySignature;

    let order = null;

    if (orderId) {
      order = await Order.findById(orderId);
    } else if (rOrderId) {
      order = await Order.findOne({ razorpayOrderId: rOrderId });
    }

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
        data: null,
      });
    }

    if (isRazorpayConfigured() && rSignature && rOrderId && rPaymentId) {
      const isValid = verifyRazorpaySignature({
        orderId: rOrderId,
        paymentId: rPaymentId,
        signature: rSignature,
      });

      if (!isValid) {
        order.paymentStatus = "Failed";
        await order.save();
        return res.status(400).json({
          success: false,
          message: "Payment verification failed. Invalid signature.",
          data: null,
        });
      }
    }

    order.paymentStatus = "Completed";
    order.razorpayPaymentId = razorpayPaymentId || `pay_mock_${Date.now()}`;
    order.escrowStatus = "Held";
    order.status = "Processing";

    // Update timeline stages
    if (order.timeline && order.timeline.length > 0) {
      order.timeline.forEach((t) => {
        if (t.stage === "Placed") {
          t.completed = true;
          t.active = false;
        } else if (t.stage === "Processing") {
          t.completed = true;
          t.active = true;
          t.date = new Date();
        }
      });
    }

    await order.save();

    const io = getIO();
    io.to(`user:${order.buyerId.toString()}`).emit("paymentSuccess", { order });
    io.to(`user:${order.sellerId.toString()}`).emit("paymentSuccess", { order });

    // Send transactional order receipt email to buyer
    User.findById(order.buyerId)
      .then((buyer) => {
        if (buyer && buyer.email) {
          sendOrderReceiptEmail(buyer.email, order, buyer.fullName).catch((err) =>
            console.error("Order receipt email dispatch error:", err.message)
          );
        }
      })
      .catch((err) => console.error("Error looking up buyer for email:", err.message));

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
      .populate("sellerId", "fullName email phone")
      .populate("items.bookId")
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
      .populate("buyerId", "fullName email phone")
      .populate("items.bookId")
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

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("bookId")
      .populate("buyerId", "fullName email phone")
      .populate("sellerId", "fullName email phone")
      .populate("items.bookId");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
        data: null,
      });
    }

    const userId = req.user._id.toString();
    const isBuyer = order.buyerId?._id?.toString() === userId;
    const isSeller = order.sellerId?._id?.toString() === userId;
    const isAdmin = req.user.role === "admin";

    if (!isBuyer && !isSeller && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view this order",
        data: null,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Order details fetched successfully",
      data: order,
    });
  } catch (error) {
    console.error("Get order by ID error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch order",
      data: null,
    });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { status, courier } = req.body;

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

    if (courier) {
      order.courier = {
        name: courier.name || order.courier?.name || "",
        trackingNumber: courier.trackingNumber || order.courier?.trackingNumber || "",
      };
    }

    // Update timeline stages
    const stageOrder = ["Placed", "Processing", "Shipped", "Delivered"];
    const currentIdx = stageOrder.indexOf(status);

    if (order.timeline && order.timeline.length > 0 && currentIdx !== -1) {
      order.timeline.forEach((t) => {
        const stageIdx = stageOrder.indexOf(t.stage);
        if (stageIdx !== -1) {
          if (stageIdx < currentIdx) {
            t.completed = true;
            t.active = false;
          } else if (stageIdx === currentIdx) {
            t.completed = true;
            t.active = true;
            t.date = new Date();
          } else {
            t.completed = false;
            t.active = false;
          }
        }
      });
    }

    if (status === "Delivered") {
      order.deliveredAt = new Date();

      const targetBookId = order.bookId || order.items?.[0]?.bookId;
      if (targetBookId) {
        const book = await Book.findById(targetBookId);
        if (book && order.orderType !== "Rent") {
          book.status = "Sold";
          await book.save();
        }
      }
    }

    await order.save();

    const io = getIO();
    io.to(`order:${order._id.toString()}`).emit("orderStatusUpdated", order);
    io.to(`user:${order.buyerId.toString()}`).emit("orderStatusUpdated", order);
    io.to(`user:${order.sellerId.toString()}`).emit("orderStatusUpdated", order);

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

/**
 * POST /api/orders/razorpay-webhook
 * Live Razorpay Webhook endpoint for asynchronous payment verification.
 */
export const razorpayWebhook = async (req, res) => {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const signature = req.headers["x-razorpay-signature"];

    if (webhookSecret && signature) {
      const expectedSignature = crypto
        .createHmac("sha256", webhookSecret)
        .update(JSON.stringify(req.body))
        .digest("hex");

      if (expectedSignature !== signature) {
        return res.status(400).json({ success: false, message: "Invalid webhook signature" });
      }
    }

    const { event, payload } = req.body;

    if (event === "payment.captured" || event === "order.paid") {
      const paymentEntity = payload?.payment?.entity;
      const razorpayOrderId = paymentEntity?.order_id;

      if (razorpayOrderId) {
        const order = await Order.findOne({ razorpayOrderId });
        if (order && order.paymentStatus !== "Completed") {
          order.paymentStatus = "Completed";
          order.escrowStatus = "Held";
          order.status = "Processing";
          order.razorpayPaymentId = paymentEntity.id;

          if (order.timeline && order.timeline.length > 0) {
            order.timeline.forEach((t) => {
              if (t.stage === "Placed") t.completed = true;
              if (t.stage === "Processing") {
                t.completed = true;
                t.active = true;
                t.date = new Date();
              }
            });
          }

          await order.save();

          const io = getIO();
          io.to(`user:${order.buyerId.toString()}`).emit("paymentSuccess", { order });
          io.to(`user:${order.sellerId.toString()}`).emit("paymentSuccess", { order });

          User.findById(order.buyerId).then((buyer) => {
            if (buyer && buyer.email) {
              sendOrderReceiptEmail(buyer.email, order, buyer.fullName).catch(() => {});
            }
          });
        }
      }
    }

    return res.status(200).json({ status: "ok" });
  } catch (error) {
    console.error("Razorpay webhook error:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
};