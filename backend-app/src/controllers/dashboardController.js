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

    // 7-day daily income analytics
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const now = new Date();
    const weeklyAnalytics = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      const dayStart = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
      const dayEnd = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);
      const dayLabel = i === 0 ? "Today" : dayNames[d.getDay()];

      const dayOrders = salesOrders.filter((o) => {
        const od = new Date(o.createdAt);
        return od >= dayStart && od <= dayEnd;
      });

      const dayGross = dayOrders.reduce((sum, o) => sum + (o.amount || 0), 0);
      const dayNet = Math.round(dayGross * 0.95);

      weeklyAnalytics.push({
        label: dayLabel,
        amount: dayNet,
        isToday: i === 0,
        ordersCount: dayOrders.length,
      });
    }

    // Weekly growth calculation
    const currentWeekSales = weeklyAnalytics.reduce((sum, d) => sum + d.amount, 0);
    const prevWeekStart = new Date(now);
    prevWeekStart.setDate(now.getDate() - 14);
    prevWeekStart.setHours(0, 0, 0, 0);
    const prevWeekEnd = new Date(now);
    prevWeekEnd.setDate(now.getDate() - 7);
    prevWeekEnd.setHours(23, 59, 59, 999);

    const prevWeekOrders = salesOrders.filter((o) => {
      const od = new Date(o.createdAt);
      return od >= prevWeekStart && od <= prevWeekEnd;
    });
    const prevWeekSales = prevWeekOrders.reduce((sum, o) => sum + Math.round((o.amount || 0) * 0.95), 0);

    let weeklyGrowth = 0;
    if (prevWeekSales > 0) {
      weeklyGrowth = Math.round(((currentWeekSales - prevWeekSales) / prevWeekSales) * 100);
    } else if (currentWeekSales > 0) {
      weeklyGrowth = 100;
    }

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
          weeklyAnalytics,
          weeklyGrowth,
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
