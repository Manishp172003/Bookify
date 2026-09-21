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
    const { fullName, location, bio, avatar } = req.body;

    const updated = await User.findByIdAndUpdate(
      req.user._id,
      { $set: pick({ fullName, location, bio, avatar }, ["fullName", "location", "bio", "avatar"]) },
      { new: true, runValidators: true }
    ).select("-password -otp -resetToken");

    if (!updated) return fail(res, 404, "User not found");

    return ok(res, "Profile updated successfully", updated);
  } catch (error) {
    console.error("Update author profile error:", error);
    return fail(res, 400, error.message);
  }
};
