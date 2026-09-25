import Payout from "../models/Payout.js";
import User from "../models/User.js";
import Order from "../models/Order.js";

/**
 * @desc User (student or author) requests a payout from their wallet balance
 * @route POST /api/payouts/request
 * @access Private
 */
export const requestPayout = async (req, res) => {
  try {
    const { amount, payoutMethod = "UPI", payoutDetails = {} } = req.body;
    const numAmount = Number(amount);

    if (!numAmount || numAmount < 100) {
      return res.status(400).json({
        success: false,
        message: "Minimum withdrawal amount is ₹100",
      });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Check available wallet balance
    const currentBalance = user.walletBalance || 0;
    if (numAmount > currentBalance) {
      return res.status(400).json({
        success: false,
        message: `Requested amount (₹${numAmount}) exceeds available balance (₹${currentBalance})`,
      });
    }

    // Validate details
    if (payoutMethod === "UPI" && !payoutDetails.upiId) {
      return res.status(400).json({
        success: false,
        message: "A valid UPI ID (e.g. name@upi) is required for UPI transfer",
      });
    }

    if (payoutMethod === "Bank Account" && (!payoutDetails.accountNumber || !payoutDetails.ifscCode)) {
      return res.status(400).json({
        success: false,
        message: "Account number and IFSC code are required for Bank transfer",
      });
    }

    // Deduct amount from user wallet balance immediately
    user.walletBalance = Math.max(0, currentBalance - numAmount);
    await user.save();

    const transactionRef = `PAY-${Math.floor(100000 + Math.random() * 900000)}`;

    const payout = await Payout.create({
      userId: user._id,
      userRole: user.role === "author" ? "author" : "student",
      amount: numAmount,
      payoutMethod: payoutMethod === "Bank Account" ? "Bank Account" : "UPI",
      payoutDetails: {
        upiId: payoutDetails.upiId || user.payment?.upiId || "",
        accountName: payoutDetails.accountName || user.fullName,
        accountNumber: payoutDetails.accountNumber || user.payment?.accountNumber || "",
        ifscCode: payoutDetails.ifscCode || user.payment?.ifscCode || "",
      },
      status: "pending",
      transactionRef,
    });

    res.status(201).json({
      success: true,
      message: `Payout of ₹${numAmount} requested successfully! Reference: ${transactionRef}. Dispatched in 24 hours.`,
      data: payout,
      remainingBalance: user.walletBalance,
    });
  } catch (error) {
    console.error("requestPayout error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to process payout request",
      error: error.message,
    });
  }
};

/**
 * @desc Get available and held wallet balance
 * @route GET /api/payouts/balance
 * @access Private
 */
export const getWalletBalance = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    const pendingSales = await Order.find({
      sellerId: user._id,
      escrowStatus: "Held",
    });
    const escrowPending = pendingSales.reduce((sum, o) => sum + (o.amount || 0), 0);
    return res.status(200).json({
      success: true,
      data: {
        availableBalance: user.walletBalance || 0,
        escrowPending,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc Get payout history and wallet summary for logged in user
 * @route GET /api/payouts/my-payouts
 * @access Private
 */
export const getMyPayouts = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const payouts = await Payout.find({ userId: req.user._id }).sort({ createdAt: -1 });

    const totalWithdrawn = payouts
      .filter((p) => p.status === "completed")
      .reduce((sum, p) => sum + (p.amount || 0), 0);

    const pendingPayout = payouts
      .filter((p) => p.status === "pending" || p.status === "processing")
      .reduce((sum, p) => sum + (p.amount || 0), 0);

    // Calculate escrow pending from orders sold by this user
    const pendingSales = await Order.find({
      sellerId: req.user._id,
      escrowStatus: "Held",
    });
    const escrowPending = pendingSales.reduce((sum, o) => sum + (o.amount || 0), 0);

    const availableBalance = user.walletBalance || 0;

    res.status(200).json({
      success: true,
      data: {
        availableBalance,
        totalWithdrawn,
        pendingPayout,
        escrowPending,
        payouts: payouts.map((p) => ({
          id: p.transactionRef || `PAY-${p._id.toString().slice(-6)}`,
          _id: p._id,
          amount: p.amount,
          payoutMethod: p.payoutMethod,
          payoutDetails: p.payoutDetails,
          status: p.status,
          date: new Date(p.createdAt).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }),
          adminNotes: p.adminNotes,
        })),
      },
    });
  } catch (error) {
    console.error("getMyPayouts error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch payout history",
      error: error.message,
    });
  }
};

/**
 * @desc Admin gets all platform payout requests
 * @route GET /api/payouts/admin/all
 * @access Private (Admin)
 */
export const getAdminPayouts = async (req, res) => {
  try {
    const payouts = await Payout.find()
      .populate("userId", "fullName email role phone")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: payouts,
    });
  } catch (error) {
    console.error("getAdminPayouts error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch admin payouts",
      error: error.message,
    });
  }
};

/**
 * @desc Admin processes a payout (approve or reject)
 * @route PATCH /api/payouts/admin/:id/process
 * @access Private (Admin)
 */
export const processPayout = async (req, res) => {
  try {
    const { id } = req.params;
    const { action = "approve", transactionRef, adminNotes = "" } = req.body;

    const payout = await Payout.findOne({
      $or: [{ transactionRef: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }],
    });

    if (!payout) {
      return res.status(404).json({ success: false, message: "Payout request not found" });
    }

    if (action === "approve") {
      payout.status = "completed";
      payout.transactionRef = transactionRef || payout.transactionRef;
      payout.adminNotes = adminNotes || "Bank transfer successfully executed via Razorpay Payouts.";
      payout.processedAt = new Date();
      await payout.save();

      return res.status(200).json({
        success: true,
        message: `Payout of ₹${payout.amount} approved and marked completed.`,
        data: payout,
      });
    } else {
      // Reject: refund amount back to user's wallet
      payout.status = "rejected";
      payout.adminNotes = adminNotes || "Payout rejected. Funds refunded to wallet.";
      payout.processedAt = new Date();
      await payout.save();

      await User.findByIdAndUpdate(payout.userId, {
        $inc: { walletBalance: payout.amount },
      });

      return res.status(200).json({
        success: true,
        message: `Payout of ₹${payout.amount} rejected. Funds returned to user wallet.`,
        data: payout,
      });
    }
  } catch (error) {
    console.error("processPayout error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to process payout",
      error: error.message,
    });
  }
};
