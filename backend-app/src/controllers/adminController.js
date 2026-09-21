import Book from "../models/Book.js";
import Order from "../models/Order.js";
import User from "../models/User.js";
import Coupon from "../models/Coupon.js";
import { sendVerificationStatusEmail } from "../services/emailService.js";

// ─── Platform Metrics ─────────────────────────────────────────────────────────

export const getMetrics = async (req, res) => {
  try {
    const [totalUsers, totalBooks, totalOrders, totalEarnings] = await Promise.all([
      User.countDocuments(),
      Book.countDocuments(),
      Order.countDocuments(),
      Order.aggregate([
        { $match: { paymentStatus: "Completed" } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
    ]);

    return res.status(200).json({
      success: true,
      message: "Admin metrics fetched successfully",
      data: {
        totalUsers,
        totalBooks,
        totalOrders,
        platformRevenue: totalEarnings[0]?.total || 0,
      },
    });
  } catch (error) {
    console.error("Get admin metrics error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch admin metrics",
      data: null,
    });
  }
};

// ─── Listing Moderation ───────────────────────────────────────────────────────

export const getListings = async (req, res) => {
  try {
    const books = await Book.find().populate("sellerId", "fullName email").sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      message: "Listings fetched successfully",
      data: books,
    });
  } catch (error) {
    console.error("Get listings error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch listings",
      data: null,
    });
  }
};

export const moderateListing = async (req, res) => {
  try {
    const { status } = req.body;
    const book = await Book.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!book) {
      return res.status(404).json({ success: false, message: "Book not found", data: null });
    }
    return res.status(200).json({ success: true, message: "Listing status updated", data: book });
  } catch (error) {
    console.error("Moderate listing error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to moderate listing",
      data: null,
    });
  }
};

// ─── Escrow Management ────────────────────────────────────────────────────────

export const getOrdersEscrow = async (req, res) => {
  try {
    const orders = await Order.find().populate("bookId").populate("buyerId sellerId", "fullName email");
    return res.status(200).json({
      success: true,
      message: "Escrow orders fetched successfully",
      data: orders,
    });
  } catch (error) {
    console.error("Get escrow error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch escrow orders",
      data: null,
    });
  }
};

export const updateEscrow = async (req, res) => {
  try {
    const { escrowStatus } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { escrowStatus }, { new: true });
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found", data: null });
    }
    return res.status(200).json({ success: true, message: "Escrow updated", data: order });
  } catch (error) {
    console.error("Update escrow error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update escrow",
      data: null,
    });
  }
};

// ─── User Management ──────────────────────────────────────────────────────────

export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password -otp -resetToken").sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      data: users,
    });
  } catch (error) {
    console.error("Get users error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch users",
      data: null,
    });
  }
};

export const getAuthorsForVerification = async (req, res) => {
  try {
    const authors = await User.find({
      $or: [
        { role: "author" },
        { isAuthor: true },
        { authorVerificationStatus: { $in: ["pending", "verified", "rejected"] } },
        { "authorVerificationDocuments.0": { $exists: true } },
      ],
    })
      .select("-password -otp -resetToken")
      .sort({ updatedAt: -1 });

    const authorIds = authors.map((a) => a._id);
    const booksCount = await Book.aggregate([
      { $match: { sellerId: { $in: authorIds } } },
      { $group: { _id: "$sellerId", count: { $sum: 1 } } },
    ]);
    const bookCountMap = {};
    booksCount.forEach((b) => {
      bookCountMap[b._id.toString()] = b.count;
    });

    const enriched = authors.map((a) => {
      const plain = a.toObject();
      return {
        ...plain,
        booksCount: bookCountMap[a._id.toString()] || 0,
      };
    });

    return res.status(200).json({
      success: true,
      message: "Authors for verification fetched successfully",
      data: enriched,
    });
  } catch (error) {
    console.error("Get authors for verification error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch authors for verification",
      data: null,
    });
  }
};

export const verifyAuthor = async (req, res) => {
  try {
    const { isVerified, status, reviewNote } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "Author not found", data: null });
    }

    const verifiedFlag = isVerified !== undefined ? isVerified : status === "verified";
    const verificationStatus = status || (verifiedFlag ? "verified" : "rejected");

    user.isVerified = verificationStatus === "verified";
    user.authorVerificationStatus = verificationStatus;
    user.isAuthor = true;

    if (!user.authorProfile) user.authorProfile = {};
    user.authorProfile.verificationStatus = verificationStatus;

    if (reviewNote !== undefined) {
      if (!user.authorProfile.verificationDocs) user.authorProfile.verificationDocs = {};
      user.authorProfile.verificationDocs.reviewNote = reviewNote;
    }

    await user.save();

    // Send transactional status email to author
    if (user.email) {
      sendVerificationStatusEmail(user.email, verificationStatus, user.fullName, reviewNote).catch((err) =>
        console.error("Verification email dispatch error:", err.message)
      );
    }

    const cleanUser = user.toObject();
    delete cleanUser.password;
    delete cleanUser.otp;
    delete cleanUser.resetToken;

    return res.status(200).json({
      success: true,
      message: `Author verification status set to ${verificationStatus}`,
      data: cleanUser,
    });
  } catch (error) {
    console.error("Verify author error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to verify author",
      data: null,
    });
  }
};

// ─── Dispute Handling ─────────────────────────────────────────────────────────

export const getDisputes = async (req, res) => {
  try {
    const disputedOrders = await Order.find({ status: { $in: ["Cancelled", "Returned"] } })
      .populate("bookId")
      .populate("buyerId sellerId", "fullName email");
    return res.status(200).json({
      success: true,
      message: "Disputes fetched successfully",
      data: disputedOrders,
    });
  } catch (error) {
    console.error("Get disputes error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch disputes",
      data: null,
    });
  }
};

// ─── Admin Coupon Management ──────────────────────────────────────────────────

/**
 * GET /api/admin/coupons
 * Returns all coupons across the platform (admin view).
 */
export const getAdminCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find()
      .populate("authorId", "fullName email role")
      .sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      message: "All coupons fetched successfully",
      data: coupons,
    });
  } catch (error) {
    console.error("Get admin coupons error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch coupons",
      data: null,
    });
  }
};

/**
 * POST /api/admin/coupons
 * Admin creates a platform-wide coupon (not tied to a specific author's books).
 */
export const createAdminCoupon = async (req, res) => {
  try {
    const { code, discountType, discountValue, expiresAt, maxUses, applicableBooks } = req.body;

    if (!code || !discountType || discountValue === undefined) {
      return res.status(400).json({
        success: false,
        message: "code, discountType and discountValue are required",
        data: null,
      });
    }

    const existing = await Coupon.findOne({ code: code.toUpperCase() });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "A coupon with this code already exists",
        data: null,
      });
    }

    const coupon = await Coupon.create({
      authorId: req.user._id, // admin acts as creator
      code: code.toUpperCase(),
      discountType,
      discountValue: Number(discountValue),
      expiresAt: expiresAt || null,
      maxUses: Number(maxUses) || 0,
      applicableBooks: Array.isArray(applicableBooks) ? applicableBooks : [],
      isActive: true,
    });

    return res.status(201).json({
      success: true,
      message: "Platform coupon created successfully",
      data: coupon,
    });
  } catch (error) {
    console.error("Create admin coupon error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create coupon",
      data: null,
    });
  }
};

/**
 * PATCH /api/admin/coupons/:id
 * Admin toggles or updates a coupon's fields (isActive, discountValue, expiresAt, maxUses).
 */
export const updateCouponStatus = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) {
      return res.status(404).json({ success: false, message: "Coupon not found", data: null });
    }

    const { isActive, discountValue, expiresAt, maxUses } = req.body;

    if (isActive !== undefined) coupon.isActive = Boolean(isActive);
    if (discountValue !== undefined) coupon.discountValue = Number(discountValue);
    if (expiresAt !== undefined) coupon.expiresAt = expiresAt;
    if (maxUses !== undefined) coupon.maxUses = Number(maxUses);

    await coupon.save();

    return res.status(200).json({
      success: true,
      message: `Coupon ${coupon.isActive ? "activated" : "deactivated"} successfully`,
      data: coupon,
    });
  } catch (error) {
    console.error("Update coupon status error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update coupon",
      data: null,
    });
  }
};

/**
 * DELETE /api/admin/coupons/:id
 * Admin permanently deletes any coupon from the platform.
 */
export const deleteAdminCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    if (!coupon) {
      return res.status(404).json({ success: false, message: "Coupon not found", data: null });
    }
    return res.status(200).json({
      success: true,
      message: "Coupon deleted successfully",
      data: null,
    });
  } catch (error) {
    console.error("Delete admin coupon error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to delete coupon",
      data: null,
    });
  }
};
