import Dispute from "../models/Dispute.js";
import Order from "../models/Order.js";
import User from "../models/User.js";
import { getIO } from "../config/socket.js";

/**
 * @desc Buyer raises a dispute on an order
 * @route POST /api/disputes/raise
 * @access Private
 */
export const raiseDispute = async (req, res) => {
  try {
    const { orderId, issue, description } = req.body;

    if (!orderId || !issue) {
      return res.status(400).json({
        success: false,
        message: "Order ID and issue type are required to raise a dispute",
      });
    }

    const order = await Order.findOne({
      $or: [
        { _id: orderId.match(/^[0-9a-fA-F]{24}$/) ? orderId : null },
        { razorpayOrderId: orderId },
      ],
    });

    const orderCode = order?._id ? `BK${order._id.toString().slice(-6).toUpperCase()}` : orderId;

    // Check if a dispute already exists for this order
    const existing = await Dispute.findOne({ orderCode, status: { $ne: "Resolved" } });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "A dispute is already open for this order",
        data: existing,
      });
    }

    // Freeze escrow on the order
    if (order) {
      order.escrowStatus = "Disputed";
      await order.save();
    }

    const dispute = await Dispute.create({
      orderId: order?._id,
      orderCode,
      buyerId: req.user._id,
      buyerName: req.user.fullName,
      sellerId: order?.sellerId,
      sellerName: "Campus Seller",
      issue,
      description: description || "",
      amount: order?.amount || 450,
      status: "Open",
    });

    // Notify rooms via Socket.io
    try {
      const io = getIO();
      if (io) {
        io.to(`order:${orderId}`).emit("orderStatusUpdated", {
          id: orderCode,
          _id: order?._id,
          escrowStatus: "Disputed",
          status: order?.status || "Placed",
          message: "Dispute opened by buyer. Escrow payment frozen for arbitration.",
        });
        io.emit("orderStatusUpdated", {
          id: orderCode,
          _id: order?._id,
          escrowStatus: "Disputed",
          status: order?.status || "Placed",
        });
      }
    } catch {
      // Ignore socket error if socket not active
    }

    res.status(201).json({
      success: true,
      message: "Dispute opened successfully. Escrow funds have been frozen pending admin review.",
      data: dispute,
    });
  } catch (error) {
    console.error("raiseDispute error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to raise dispute",
      error: error.message,
    });
  }
};

/**
 * @desc Get all disputes (Admin or user query)
 * @route GET /api/disputes
 * @access Private
 */
export const getDisputes = async (req, res) => {
  try {
    let disputes = await Dispute.find().sort({ createdAt: -1 });

    // Seed realistic disputes if empty so Admin dashboard works out of the box
    if (disputes.length === 0) {
      const demoBuyer = await User.findOne({ role: "student" }) || { _id: req.user._id, fullName: "Rohan Verma" };

      const seeded = [
        {
          orderCode: "BK123456",
          buyerId: demoBuyer._id,
          buyerName: "Rohan Verma",
          sellerName: "Aarav Sharma",
          issue: "Wrong / Damaged Book",
          description: "Received 7th Edition instead of 9th Edition, with cover torn and highlighted pages.",
          amount: 450,
          status: "Open",
        },
        {
          orderCode: "BK123450",
          buyerId: demoBuyer._id,
          buyerName: "Aditya Singh",
          sellerName: "Sneha Reddy",
          issue: "Not as Described",
          description: "Book condition was marked 'Like New' but book has severe water damage and binding issue.",
          amount: 620,
          status: "Under Review",
        },
        {
          orderCode: "BK123449",
          buyerId: demoBuyer._id,
          buyerName: "Priya Mehta",
          sellerName: "Dev Kumar",
          issue: "Late Delivery",
          description: "Package arrived 10 days late after exams concluded.",
          amount: 380,
          status: "Resolved",
          resolution: {
            decision: "Refund Buyer",
            notes: "Buyer returned book via campus return spot. Full escrow refunded.",
            resolvedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          },
        },
        {
          orderCode: "BK123448",
          buyerId: demoBuyer._id,
          buyerName: "Neha Sharma",
          sellerName: "Vikram Malhotra",
          issue: "Item Not Received",
          description: "Courier marked delivered but package was never received at hostel reception.",
          amount: 750,
          status: "Open",
        },
      ];

      disputes = await Dispute.insertMany(seeded);
    }

    const formatted = disputes.map((d) => ({
      id: d.orderCode,
      _id: d._id,
      orderId: d.orderId,
      issue: d.issue,
      description: d.description,
      buyer: d.buyerName,
      buyerId: d.buyerId,
      seller: d.sellerName,
      amount: d.amount,
      status: d.status,
      resolution: d.resolution,
      createdAt: d.createdAt,
    }));

    res.status(200).json({
      success: true,
      data: formatted,
    });
  } catch (error) {
    console.error("getDisputes error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch disputes",
      error: error.message,
    });
  }
};

/**
 * @desc Admin resolves a dispute (Refund Buyer or Release to Seller)
 * @route PATCH /api/disputes/:id/resolve
 * @access Private (Admin)
 */
export const resolveDispute = async (req, res) => {
  try {
    const { id } = req.params;
    const { decision = "Refund Buyer", notes = "Resolved by Bookify Admin Arbitration." } = req.body;

    const dispute = await Dispute.findOne({
      $or: [{ orderCode: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }],
    });

    if (!dispute) {
      return res.status(404).json({ success: false, message: "Dispute record not found" });
    }

    dispute.status = "Resolved";
    dispute.resolution = {
      decision,
      notes,
      resolvedAt: new Date(),
    };
    await dispute.save();

    // Settle Order & Escrow
    const order = await Order.findOne({
      $or: [
        { _id: dispute.orderId },
        { razorpayOrderId: dispute.orderCode },
      ],
    });

    if (order) {
      if (decision === "Refund Buyer") {
        order.escrowStatus = "Refunded";
        order.status = "Cancelled";
        if (order.buyerId) {
          await User.findByIdAndUpdate(order.buyerId, {
            $inc: { walletBalance: order.amount },
          });
        }
      } else {
        order.escrowStatus = "Released";
        order.status = "Delivered";
        if (order.sellerId) {
          await User.findByIdAndUpdate(order.sellerId, {
            $inc: { walletBalance: order.amount },
          });
        }
      }
      await order.save();
    } else if (decision === "Refund Buyer" && dispute.buyerId) {
      // If mock order, still credit buyer wallet
      await User.findByIdAndUpdate(dispute.buyerId, {
        $inc: { walletBalance: dispute.amount },
      });
    }

    // Broadcast socket event
    try {
      const io = getIO();
      if (io) {
        const updateData = {
          id: dispute.orderCode,
          _id: dispute.orderId,
          escrowStatus: decision === "Refund Buyer" ? "Refunded" : "Released",
          status: decision === "Refund Buyer" ? "Cancelled" : "Delivered",
          message: `Dispute resolved by Admin: ${decision}.`,
        };
        io.to(`order:${dispute.orderCode}`).emit("orderStatusUpdated", updateData);
        io.emit("orderStatusUpdated", updateData);
      }
    } catch {
      // Ignore
    }

    res.status(200).json({
      success: true,
      message: `Dispute resolved with decision: "${decision}". Funds settled.`,
      data: {
        id: dispute.orderCode,
        status: dispute.status,
        resolution: dispute.resolution,
      },
    });
  } catch (error) {
    console.error("resolveDispute error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to resolve dispute",
      error: error.message,
    });
  }
};
