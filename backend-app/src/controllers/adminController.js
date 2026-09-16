import Book from "../models/Book.js";
import Order from "../models/Order.js";
import User from "../models/User.js";

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

export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
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

export const verifyAuthor = async (req, res) => {
  try {
    const { isVerified } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { isVerified, role: "author" }, { new: true });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found", data: null });
    }
    return res.status(200).json({ success: true, message: "Author verification updated", data: user });
  } catch (error) {
    console.error("Verify author error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to verify author",
      data: null,
    });
  }
};

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
