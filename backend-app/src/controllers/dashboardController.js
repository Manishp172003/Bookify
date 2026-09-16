import Book from "../models/Book.js";
import Order from "../models/Order.js";

/**
 * GET /api/dashboard/stats
 * Returns a comprehensive stats snapshot for the logged-in user's dashboard.
 */
export const getStats = async (req, res) => {
  try {
    const userId = req.user._id;

    const [
      activeListings,
      totalListings,
      totalOrders,
      pendingOrders,
      salesOrders,
      recentListings,
    ] = await Promise.all([
      // Books seller has actively listed
      Book.countDocuments({ sellerId: userId, status: "Active" }),

      // Total books ever listed by this seller
      Book.countDocuments({ sellerId: userId }),

      // Total orders placed as a buyer
      Order.countDocuments({ buyerId: userId }),

      // Orders as buyer that are still pending/processing
      Order.countDocuments({
        buyerId: userId,
        status: { $in: ["Placed", "Processing"] },
      }),

      // Completed sales as seller
      Order.find({ sellerId: userId, paymentStatus: "Completed" }).lean(),

      // Last 5 listings by this user for activity feed
      Book.find({ sellerId: userId })
        .sort({ createdAt: -1 })
        .limit(5)
        .select("title price status transactionMode createdAt images")
        .lean(),
    ]);

    const totalEarnings = salesOrders.reduce((sum, order) => sum + (order.amount || 0), 0);

    // Platform fee deducted (5% — matching docs)
    const netEarnings = Math.round(totalEarnings * 0.95);

    return res.status(200).json({
      success: true,
      message: "Dashboard statistics fetched successfully",
      data: {
        listings: {
          active: activeListings,
          total: totalListings,
          sold: totalListings - activeListings,
        },
        orders: {
          total: totalOrders,
          pending: pendingOrders,
        },
        earnings: {
          gross: totalEarnings,
          net: netEarnings,
          totalSales: salesOrders.length,
        },
        recentListings,
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
