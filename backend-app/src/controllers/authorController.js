import Book from "../models/Book.js";
import Coupon from "../models/Coupon.js";
import Order from "../models/Order.js";

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

export const getAnalytics = async (req, res) => {
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
    return res.status(500).json({ success: false, message: error.message, data: null });
  }
};
