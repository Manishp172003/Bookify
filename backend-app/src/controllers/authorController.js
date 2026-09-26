import mongoose from "mongoose";
import Book from "../models/Book.js";
import Coupon from "../models/Coupon.js";
import Order from "../models/Order.js";

export const getMyBooks = async (req, res) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 20));
    const filter = { sellerId: req.user._id };

    if (req.query.status) filter.status = req.query.status;
    if (req.query.search) filter.$text = { $search: req.query.search };

    const [books, total] = await Promise.all([
      Book.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      Book.countDocuments(filter),
    ]);

    return ok(res, "Author books fetched", {
      books,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("Get author books error:", error);
    return fail(res, 500, error.message);
  }
};

export const submitBook = async (req, res) => {
  try {
    const bookData = { ...req.body, sellerId: req.user._id, status: "Active" };
    const book = await Book.create(bookData);
    return res.status(201).json({ success: true, message: "Book submitted successfully", data: book });
  } catch (error) {
    console.error("Submit author book error:", error);
    const status = error.name === "ValidationError" || error.message ? 400 : 500;
    return fail(res, status, error.message);
  }
};

export const updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) return fail(res, 400, "Invalid book id");

    const book = await Book.findOne({ _id: id, sellerId: req.user._id });
    if (!book) return fail(res, 404, "Book not found in your listings");

    Object.assign(book, pick(req.body, BOOK_FIELDS));

    if (req.body.status && ["Active", "Inactive"].includes(req.body.status)) {
      book.status = req.body.status;
    }

    await book.save();
    return ok(res, "Book updated successfully", book);
  } catch (error) {
    console.error("Update book error:", error);
    return fail(res, 400, error.message);
  }
};

export const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) return fail(res, 400, "Invalid book id");

    const book = await Book.findOne({ _id: id, sellerId: req.user._id });
    if (!book) return fail(res, 404, "Book not found in your listings");

    const hasOrders = await Order.exists({ bookId: book._id });
    if (hasOrders) {
      book.status = "Inactive";
      await book.save();
      return ok(res, "Book has existing orders, so it was archived instead of deleted", book);
    }

    await book.deleteOne();
    return ok(res, "Book deleted successfully");
  } catch (error) {
    console.error("Delete book error:", error);
    return fail(res, 500, error.message);
  }
};

export const updateBook = async (req, res) => {
  try {
    const myBooks = await Book.find({ sellerId: req.user._id });
    const bookIds = myBooks.map((b) => b._id);
    const orders = await Order.find({ bookId: { $in: bookIds }, paymentStatus: "Completed" });

    const totalSales = orders.length;
    const totalRevenue = orders.reduce((sum, o) => sum + (o.amount || 0), 0);

    return res.status(200).json({
      success: true,
      message: "Author analytics fetched",
      data: {
        totalBooks: myBooks.length,
        totalSales,
        totalRevenue,
      },
    });
  } catch (error) {
    console.error("Get analytics error:", error);
    return res.status(500).json({ success: false, message: error.message, data: null });
  }
};

export const deleteBook = async (req, res) => {
  try {
    const orders = await Order.find({ sellerId: req.user._id, paymentStatus: "Completed" }).populate("bookId");
    const totalEarnings = orders.reduce((sum, o) => sum + (o.amount || 0), 0);

    return res.status(200).json({
      success: true,
      message: "Earnings fetched",
      data: {
        totalEarnings,
        orders,
      },
    });
  } catch (error) {
    console.error("Get earnings error:", error);
    return res.status(500).json({ success: false, message: error.message, data: null });
  }
};

export const createCoupon = async (req, res) => {
  try {
    const { code, discountType, discountValue, expiresAt, maxUses } = req.body;
    const coupon = await Coupon.create({
      authorId: req.user._id,
      code: code.toUpperCase(),
      discountType,
      discountValue: Number(discountValue),
      expiresAt,
      maxUses: Number(maxUses) || 0,
    });
    return res.status(201).json({ success: true, message: "Coupon created", data: coupon });
  } catch (error) {
    console.error("Create coupon error:", error);
    if (error.code === 11000) return fail(res, 409, "You already have a coupon with this code");
    return fail(res, 400, error.message);
  }
};

export const toggleCouponStatus = async (req, res) => {
  try {
    const coupons = await Coupon.find({ authorId: req.user._id }).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, message: "Coupons fetched", data: coupons });
  } catch (error) {
    console.error("Get coupons error:", error);
    return res.status(500).json({ success: false, message: error.message, data: null });
  }
};

export const validateCoupon = async (req, res) => {
  try {
    const { code } = req.body;
    const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });

    if (!coupon) {
      return res.status(404).json({ success: false, message: "Invalid coupon code", data: null });
    }

    if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
      return res.status(400).json({ success: false, message: "Coupon has expired", data: null });
    }

    if (coupon.maxUses > 0 && coupon.usedCount >= coupon.maxUses) {
      return res.status(400).json({ success: false, message: "Coupon usage limit reached", data: null });
    }

    return res.status(200).json({
      success: true,
      message: "Coupon is valid",
      data: {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
      },
    });
  } catch (error) {
    console.error("Validate coupon error:", error);
    return fail(res, 500, error.message);
  }
};

export const updateAuthorProfile = async (req, res) => {
  try {
    const { title, campaignType, targetCategory, discountPercentage, startDate, endDate, budget, bookId } = req.body;

    const campaign = await Campaign.create({
      authorId: req.user._id,
      bookId: bookId || null,
      title,
      campaignType: campaignType || "home_banner",
      targetCategory: targetCategory || "All",
      discountPercentage: Number(discountPercentage) || 0,
      startDate: startDate ? new Date(startDate) : new Date(),
      endDate: endDate ? new Date(endDate) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      budget: Number(budget) || 0,
      status: "active",
      impressions: 0,
      clicks: 0,
      conversions: 0,
    });

    return res.status(201).json({ success: true, message: "Campaign created successfully", data: campaign });
  } catch (error) {
    console.error("Create campaign error:", error);
    return res.status(500).json({ success: false, message: error.message, data: null });
  }
};

export const updateCampaignStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const campaign = await Campaign.findOne({ _id: id, authorId: req.user._id });
    if (!campaign) {
      return res.status(404).json({ success: false, message: "Campaign not found", data: null });
    }

    if (status) campaign.status = status;
    await campaign.save();

    return res.status(200).json({ success: true, message: `Campaign status updated to ${status}`, data: campaign });
  } catch (error) {
    console.error("Update campaign status error:", error);
    return res.status(500).json({ success: false, message: error.message, data: null });
  }
};

export const deleteCampaign = async (req, res) => {
  try {
    const { id } = req.params;
    const campaign = await Campaign.findOneAndDelete({ _id: id, authorId: req.user._id });
    if (!campaign) {
      return res.status(404).json({ success: false, message: "Campaign not found", data: null });
    }
    return res.status(200).json({ success: true, message: "Campaign deleted", data: { id } });
  } catch (error) {
    console.error("Delete campaign error:", error);
    return res.status(500).json({ success: false, message: error.message, data: null });
  }
};

// ==========================================
// 5. Royalties, Earnings & Payout Requests
// ==========================================

export const getEarnings = async (req, res) => {
  try {
    const myBooks = await Book.find({ sellerId: req.user._id });
    const bookIds = myBooks.map((b) => b._id);

    const orders = await Order.find({
      $or: [
        { sellerId: req.user._id },
        { bookId: { $in: bookIds } },
        { "items.bookId": { $in: bookIds } },
      ],
      paymentStatus: "Completed",
    }).populate("bookId").populate("buyerId", "fullName email");

    const payouts = await Payout.find({ userId: req.user._id }).sort({ createdAt: -1 });

    const totalRevenue = orders.reduce((sum, o) => sum + (o.amount || 0), 0);
    const paidOut = payouts.filter((p) => p.status === "completed").reduce((sum, p) => sum + (p.amount || 0), 0);
    const pendingPayout = payouts.filter((p) => p.status === "pending" || p.status === "processing").reduce((sum, p) => sum + (p.amount || 0), 0);

    const netAvailable = Math.max(0, totalRevenue - paidOut - pendingPayout);

    return res.status(200).json({
      success: true,
      message: "Author earnings fetched",
      data: {
        totalRevenue,
        availableBalance: netAvailable,
        pendingPayout,
        lifetimePaidOut: paidOut,
        orders,
        payouts,
      },
    });
  } catch (error) {
    console.error("Get earnings error:", error);
    return res.status(500).json({ success: false, message: error.message, data: null });
  }
};

export const requestPayout = async (req, res) => {
  try {
    const { amount, payoutMethod, payoutDetails } = req.body;
    const numAmount = Number(amount);

    if (!numAmount || numAmount < 100) {
      return res.status(400).json({ success: false, message: "Minimum payout amount is ₹100", data: null });
    }

    const payout = await Payout.create({
      userId: req.user._id,
      userRole: "author",
      amount: numAmount,
      payoutMethod: payoutMethod || "UPI",
      payoutDetails: payoutDetails || req.user.payment || {},
      status: "pending",
      transactionRef: `PO-AUTH-${Date.now()}`,
    });

    return res.status(201).json({
      success: true,
      message: "Payout request submitted successfully. Processing in 24-48 hours.",
      data: payout,
    });
  } catch (error) {
    console.error("Request payout error:", error);
    return res.status(500).json({ success: false, message: error.message, data: null });
  }
};

export const getPayouts = async (req, res) => {
  try {
    const payouts = await Payout.find({ userId: req.user._id }).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, message: "Payout history fetched", data: payouts });
  } catch (error) {
    console.error("Get payouts error:", error);
    return res.status(500).json({ success: false, message: error.message, data: null });
  }
};

// ==========================================
// 6. Analytics & Main Dashboard Aggregation
// ==========================================

export const getDashboardStats = async (req, res) => {
  try {
    const myBooks = await Book.find({ sellerId: req.user._id });
    const bookIds = myBooks.map((b) => b._id);

    const orders = await Order.find({
      $or: [
        { sellerId: req.user._id },
        { bookId: { $in: bookIds } },
        { "items.bookId": { $in: bookIds } },
      ],
      paymentStatus: "Completed",
    }).populate("bookId").sort({ createdAt: -1 });

    const activeCampaigns = await Campaign.countDocuments({ authorId: req.user._id, status: "active" });

    const totalSales = orders.length;
    const totalRevenue = orders.reduce((sum, o) => sum + (o.amount || 0), 0);
    const totalReaders = new Set(orders.map((o) => (o.buyerId ? o.buyerId.toString() : "anon"))).size;

    return res.status(200).json({
      success: true,
      message: "Author dashboard stats fetched",
      data: {
        totalBooks: myBooks.length,
        totalReaders: totalReaders || 0,
        totalSales,
        totalRevenue,
        activeCampaigns,
        recentOrders: orders.slice(0, 5),
      },
    });
  } catch (error) {
    console.error("Get dashboard stats error:", error);
    return res.status(500).json({ success: false, message: error.message, data: null });
  }
};

export const getAnalytics = async (req, res) => {
  try {
    const myBooks = await Book.find({ sellerId: req.user._id });
    const bookIds = myBooks.map((b) => b._id);

    const orderMatch = {
      $or: [
        { sellerId: req.user._id },
        { bookId: { $in: bookIds } },
        { "items.bookId": { $in: bookIds } },
      ],
      paymentStatus: "Completed",
    };

    const orders = await Order.find(orderMatch).sort({ createdAt: -1 });
    const totalSales = orders.length;
    const totalRevenue = orders.reduce((sum, o) => sum + (o.amount || 0), 0);

    // 30-day daily revenue time-series aggregation
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const dailyRevenue = await Order.aggregate([
      {
        $match: {
          ...orderMatch,
          createdAt: { $gte: thirtyDaysAgo },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          revenue: { $sum: "$amount" },
          salesCount: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          _id: 0,
          date: "$_id",
          revenue: 1,
          salesCount: 1,
        },
      },
    ]);

    // Calculate sales per book
    const bookSalesMap = {};
    orders.forEach((o) => {
      const bId = o.bookId ? o.bookId.toString() : (o.items?.[0]?.bookId?.toString() || "unknown");
      if (!bookSalesMap[bId]) {
        bookSalesMap[bId] = { sales: 0, revenue: 0 };
      }
      bookSalesMap[bId].sales += 1;
      bookSalesMap[bId].revenue += o.amount || 0;
    });

    const topBooks = myBooks
      .map((book) => ({
        id: book._id,
        title: book.title,
        coverImage: book.images?.[0] || "",
        views: book.views || 0,
        sales: bookSalesMap[book._id.toString()]?.sales || 0,
        revenue: bookSalesMap[book._id.toString()]?.revenue || 0,
      }))
      .sort((a, b) => b.sales - a.sales);

    return res.status(200).json({
      success: true,
      message: "Author analytics fetched",
      data: {
        totalBooks: myBooks.length,
        totalSales,
        totalRevenue,
        dailyRevenue,
        topBooks,
        demographics: [
          { college: "IIT Bombay", readers: 48 },
          { college: "BITS Pilani", readers: 36 },
          { college: "Delhi University", readers: 29 },
          { college: "VNIT Nagpur", readers: 18 },
        ],
      },
    });
  } catch (error) {
    console.error("Get analytics error:", error);
    return res.status(500).json({ success: false, message: error.message, data: null });
  }
};

// Aliases for compatibility
export const updateProfile = updateAuthorProfile;
export const submitVerification = submitAuthorVerification;
export const toggleCoupon = toggleCouponStatus;