import Book from "../models/Book.js";
import Coupon from "../models/Coupon.js";
import Order from "../models/Order.js";
import User from "../models/User.js";

// ─── Author Books ────────────────────────────────────────────────────────────

export const getMyBooks = async (req, res) => {
  try {
    const books = await Book.find({ sellerId: req.user._id }).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, message: "Author books fetched", data: books });
  } catch (error) {
    console.error("Get author books error:", error);
    return res.status(500).json({ success: false, message: error.message, data: null });
  }
};

export const submitBook = async (req, res) => {
  try {
    const bookData = { ...req.body, sellerId: req.user._id, status: "Active" };
    const book = await Book.create(bookData);
    return res.status(201).json({ success: true, message: "Book submitted successfully", data: book });
  } catch (error) {
    console.error("Submit author book error:", error);
    return res.status(500).json({ success: false, message: error.message, data: null });
  }
};

// ─── Author Analytics & Earnings ─────────────────────────────────────────────

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
      },
    });
  } catch (error) {
    console.error("Get analytics error:", error);
    return res.status(500).json({ success: false, message: error.message, data: null });
  }
};

export const getEarnings = async (req, res) => {
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

// ─── Author Profile & Verification ────────────────────────────────────────────

export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found", data: null });
    }

    const { bio, avatar, penName, website, socialLinks, fullName } = req.body;
    if (fullName) user.fullName = fullName;
    if (!user.authorProfile) user.authorProfile = {};
    if (bio !== undefined) user.authorProfile.bio = bio;
    if (avatar !== undefined) user.authorProfile.avatar = avatar;
    if (penName !== undefined) user.authorProfile.penName = penName;
    if (website !== undefined) user.authorProfile.website = website;
    if (socialLinks !== undefined) {
      user.authorProfile.socialLinks = {
        ...user.authorProfile.socialLinks,
        ...socialLinks,
      };
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Author profile updated successfully",
      data: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        authorProfile: user.authorProfile,
      },
    });
  } catch (error) {
    console.error("Update author profile error:", error);
    return res.status(500).json({ success: false, message: error.message, data: null });
  }
};

export const submitVerification = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found", data: null });
    }

    const { fullName, idDocUrl, degreeDocUrl } = req.body;
    if (!user.authorProfile) user.authorProfile = {};
    user.authorProfile.verificationDocs = {
      fullName: fullName || user.fullName,
      idDocUrl: idDocUrl || user.authorProfile.verificationDocs?.idDocUrl || null,
      degreeDocUrl: degreeDocUrl || user.authorProfile.verificationDocs?.degreeDocUrl || null,
      submittedAt: new Date(),
      reviewNote: "",
    };
    user.authorProfile.verificationStatus = "pending";

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Author verification documents submitted successfully",
      data: user.authorProfile,
    });
  } catch (error) {
    console.error("Submit verification error:", error);
    return res.status(500).json({ success: false, message: error.message, data: null });
  }
};

// ─── Author Coupons ──────────────────────────────────────────────────────────

export const createCoupon = async (req, res) => {
  try {
    const { code, discountType, discountValue, expiresAt, maxUses, minPurchase, applicableBooks } = req.body;
    const coupon = await Coupon.create({
      authorId: req.user._id,
      code: code.toUpperCase(),
      discountType: discountType || "percentage",
      discountValue: Number(discountValue),
      expiresAt: expiresAt || null,
      maxUses: Number(maxUses) || 0,
      minPurchase: Number(minPurchase) || 0,
      applicableBooks: Array.isArray(applicableBooks) ? applicableBooks : [],
    });
    return res.status(201).json({ success: true, message: "Coupon created", data: coupon });
  } catch (error) {
    console.error("Create coupon error:", error);
    return res.status(500).json({ success: false, message: error.message, data: null });
  }
};

export const getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find({ authorId: req.user._id }).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, message: "Coupons fetched", data: coupons });
  } catch (error) {
    console.error("Get coupons error:", error);
    return res.status(500).json({ success: false, message: error.message, data: null });
  }
};

export const toggleCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) {
      return res.status(404).json({ success: false, message: "Coupon not found", data: null });
    }
    if (coupon.authorId.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Not authorized to modify this coupon", data: null });
    }

    coupon.isActive = req.body.isActive !== undefined ? req.body.isActive : !coupon.isActive;
    await coupon.save();

    return res.status(200).json({ success: true, message: "Coupon status updated", data: coupon });
  } catch (error) {
    console.error("Toggle coupon error:", error);
    return res.status(500).json({ success: false, message: error.message, data: null });
  }
};

export const deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) {
      return res.status(404).json({ success: false, message: "Coupon not found", data: null });
    }
    if (coupon.authorId.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Not authorized to delete this coupon", data: null });
    }

    await Coupon.findByIdAndDelete(req.params.id);
    return res.status(200).json({ success: true, message: "Coupon deleted successfully", data: null });
  } catch (error) {
    console.error("Delete coupon error:", error);
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
        minPurchase: coupon.minPurchase || 0,
      },
    });
  } catch (error) {
    console.error("Validate coupon error:", error);
    return res.status(500).json({ success: false, message: error.message, data: null });
  }
};
