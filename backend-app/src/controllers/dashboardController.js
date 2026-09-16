import Book from "../models/Book.js";
import Order from "../models/Order.js";

export const getStats = async (req, res) => {
  try {
    const userId = req.user._id;

    const [activeListings, totalOrders, salesOrders] = await Promise.all([
      Book.countDocuments({ sellerId: userId, status: "Active" }),
      Order.countDocuments({ buyerId: userId }),
      Order.find({ sellerId: userId, paymentStatus: "Completed" }),
    ]);

    const totalEarnings = salesOrders.reduce((sum, order) => sum + (order.amount || 0), 0);

    return res.status(200).json({
      success: true,
      message: "Dashboard statistics fetched successfully",
      data: {
        activeListings,
        totalOrders,
        totalSales: salesOrders.length,
        totalEarnings,
      },
    });
  } catch (error) {
    console.error("Get dashboard stats error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch dashboard statistics",
      data: null,
    });
  }
};
