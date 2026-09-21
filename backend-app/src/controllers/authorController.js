import mongoose from "mongoose";
import Book from "../models/Book.js";
import Coupon from "../models/Coupon.js";
import Order from "../models/Order.js";
import Payout from "../models/Payout.js";
import User from "../models/User.js";

const ok = (res, message, data = null, status = 200) =>
  res.status(status).json({ success: true, message, data });

const fail = (res, status, message) =>
  res.status(status).json({ success: false, message, data: null });

const BOOK_FIELDS = [
  "title",
  "author",
  "isbn",
  "category",
  "condition",
  "transactionMode",
  "price",
  "originalPrice",
  "rentalDurationWeeks",
  "description",
  "images",
  "location",
];

const pick = (source, fields) =>
  fields.reduce((acc, key) => {
    if (source[key] !== undefined) acc[key] = source[key];
    return acc;
  }, {});

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

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
    const payload = pick(req.body, BOOK_FIELDS);

    const book = await Book.create({
      ...payload,
      sellerId: req.user._id,
      status: "Active",
      isPublisherListing: req.user.isVerified === true,
    });

    return ok(res, "Book submitted successfully", book, 201);
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

export const getAnalytics = async (req, res) => {
  try {
    const authorId = req.user._id;
    const days = Math.min(365, Math.max(7, Number(req.query.days) || 30));
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const [bookStats] = await Book.aggregate([
      { $match: { sellerId: authorId } },
      {
        $group: {
          _id: null,
          totalBooks: { $sum: 1 },
          activeBooks: { $sum: { $cond: [{ $eq: ["$status", "Active"] }, 1, 0] } },
          soldBooks: { $sum: { $cond: [{ $eq: ["$status", "Sold"] }, 1, 0] } },
        },
      },
    ]);

    const [totals] = await Order.aggregate([
      { $match: { sellerId: authorId, paymentStatus: "Completed" } },
      {
        $group: {
          _id: null,
          totalSales: { $sum: 1 },
          totalRevenue: { $sum: "$amount" },
          averageOrderValue: { $avg: "$amount" },
        },
      },
    ]);

    const daily = await Order.aggregate([
      {
        $match: {
          sellerId: authorId,
          paymentStatus: "Completed",
          createdAt: { $gte: since },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          revenue: { $sum: "$amount" },
          orders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      { $project: { _id: 0, date: "$_id", revenue: 1, orders: 1 } },
    ]);

    const topBooks = await Order.aggregate([
      { $match: { sellerId: authorId, paymentStatus: "Completed" } },
      {
        $group: {
          _id: "$bookId",
          revenue: { $sum: "$amount" },
          sales: { $sum: 1 },
        },
      },
      { $sort: { revenue: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "books",
          localField: "_id",
          foreignField: "_id",
          as: "book",
        },
      },
      { $unwind: { path: "$book", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 0,
          bookId: "$_id",
          title: "$book.title",
          revenue: 1,
          sales: 1,
        },
      },
    ]);

    return ok(res, "Author analytics fetched", {
      totalBooks: bookStats?.totalBooks || 0,
      activeBooks: bookStats?.activeBooks || 0,
      soldBooks: bookStats?.soldBooks || 0,
      totalSales: totals?.totalSales || 0,
      totalRevenue: totals?.totalRevenue || 0,
      averageOrderValue: Math.round((totals?.averageOrderValue || 0) * 100) / 100,
      daily,
      topBooks,
      range: { days, since },
    });
  } catch (error) {
    console.error("Get analytics error:", error);
    return fail(res, 500, error.message);
  }
};

export const getEarnings = async (req, res) => {
  try {
    const authorId = req.user._id;
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 20));

    const [earned] = await Order.aggregate([
      { $match: { sellerId: authorId, paymentStatus: "Completed" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const [withdrawn] = await Payout.aggregate([
      { $match: { authorId, status: { $in: ["Requested", "Processing", "Paid"] } } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const totalEarnings = earned?.total || 0;
    const totalWithdrawn = withdrawn?.total || 0;

    const orders = await Order.find({ sellerId: authorId, paymentStatus: "Completed" })
      .populate("bookId", "title images price")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return ok(res, "Earnings fetched", {
      totalEarnings,
      totalWithdrawn,
      availableBalance: Math.max(0, totalEarnings - totalWithdrawn),
      orders,
      pagination: { page, limit },
    });
  } catch (error) {
    console.error("Get earnings error:", error);
    return fail(res, 500, error.message);
  }
};

export const requestPayout = async (req, res) => {
  try {
    const authorId = req.user._id;
    const amount = Number(req.body.amount);

    if (!amount || amount <= 0) return fail(res, 400, "Enter a payout amount above zero");

    const user = await User.findById(authorId).select("payment");
    const method = user?.payment?.mode || "UPI";
    const destination =
      method === "UPI" ? user?.payment?.upiId : user?.payment?.accountNumber;

    if (!destination) {
      return fail(res, 400, "Add your payout details in settings before requesting a payout");
    }

    const [earned] = await Order.aggregate([
      { $match: { sellerId: authorId, paymentStatus: "Completed" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const [withdrawn] = await Payout.aggregate([
      { $match: { authorId, status: { $in: ["Requested", "Processing", "Paid"] } } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const available = (earned?.total || 0) - (withdrawn?.total || 0);

    if (amount > available) {
      return fail(res, 400, `You can withdraw up to ${available} right now`);
    }

    const payout = await Payout.create({ authorId, amount, method, destination });

    return ok(res, "Payout requested successfully", payout, 201);
  } catch (error) {
    console.error("Request payout error:", error);
    return fail(res, 500, error.message);
  }
};

export const getPayouts = async (req, res) => {
  try {
    const payouts = await Payout.find({ authorId: req.user._id }).sort({ createdAt: -1 });
    return ok(res, "Payouts fetched", payouts);
  } catch (error) {
    console.error("Get payouts error:", error);
    return fail(res, 500, error.message);
  }
};

export const createCoupon = async (req, res) => {
  try {
    const {
      code,
      discountType,
      discountValue,
      expiresAt,
      maxUses,
      appliesTo,
      bookIds,
      minOrderAmount,
      maxDiscountAmount,
    } = req.body;

    if (!code || !discountType || !discountValue) {
      return fail(res, 400, "Code, discount type and discount value are required");
    }

    const normalized = String(code).toUpperCase().trim();

    const exists = await Coupon.findOne({ authorId: req.user._id, code: normalized });
    if (exists) return fail(res, 409, "You already have a coupon with this code");

    let scopedBooks = [];
    if (appliesTo === "selected") {
      const owned = await Book.find({
        _id: { $in: (bookIds || []).filter(isValidId) },
        sellerId: req.user._id,
      }).select("_id");

      if (owned.length === 0) {
        return fail(res, 400, "Select at least one of your own books for this coupon");
      }
      scopedBooks = owned.map((b) => b._id);
    }

    const coupon = await Coupon.create({
      authorId: req.user._id,
      code: normalized,
      discountType,
      discountValue: Number(discountValue),
      appliesTo: appliesTo === "selected" ? "selected" : "all",
      bookIds: scopedBooks,
      minOrderAmount: Number(minOrderAmount) || 0,
      maxDiscountAmount: Number(maxDiscountAmount) || 0,
      expiresAt: expiresAt || undefined,
      maxUses: Number(maxUses) || 0,
    });

    return ok(res, "Coupon created", coupon, 201);
  } catch (error) {
    console.error("Create coupon error:", error);
    if (error.code === 11000) return fail(res, 409, "You already have a coupon with this code");
    return fail(res, 400, error.message);
  }
};

export const getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find({ authorId: req.user._id })
      .populate("bookIds", "title")
      .sort({ createdAt: -1 });
    return ok(res, "Coupons fetched", coupons);
  } catch (error) {
    console.error("Get coupons error:", error);
    return fail(res, 500, error.message);
  }
};

export const toggleCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) return fail(res, 400, "Invalid coupon id");

    const coupon = await Coupon.findOne({ _id: id, authorId: req.user._id });
    if (!coupon) return fail(res, 404, "Coupon not found");

    coupon.isActive = !coupon.isActive;
    await coupon.save();

    return ok(res, coupon.isActive ? "Coupon activated" : "Coupon deactivated", coupon);
  } catch (error) {
    console.error("Toggle coupon error:", error);
    return fail(res, 500, error.message);
  }
};

export const deleteCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) return fail(res, 400, "Invalid coupon id");

    const coupon = await Coupon.findOneAndDelete({ _id: id, authorId: req.user._id });
    if (!coupon) return fail(res, 404, "Coupon not found");

    return ok(res, "Coupon deleted");
  } catch (error) {
    console.error("Delete coupon error:", error);
    return fail(res, 500, error.message);
  }
};

export const validateCoupon = async (req, res) => {
  try {
    const { code, bookId, amount } = req.body;

    if (!code || !bookId) return fail(res, 400, "Coupon code and book are required");
    if (!isValidId(bookId)) return fail(res, 400, "Invalid book id");

    const book = await Book.findById(bookId).select("sellerId price title");
    if (!book) return fail(res, 404, "Book not found");

    const coupon = await Coupon.findOne({
      code: String(code).toUpperCase().trim(),
      authorId: book.sellerId,
    });

    if (!coupon) return fail(res, 404, "This code is not valid for this book");

    const problem = coupon.checkUsable();
    if (problem) return fail(res, 400, problem);

    if (coupon.appliesTo === "selected" && !coupon.bookIds.some((id) => id.equals(book._id))) {
      return fail(res, 400, "This code does not apply to this book");
    }

    const orderAmount = Number(amount) || book.price || 0;

    if (coupon.minOrderAmount > 0 && orderAmount < coupon.minOrderAmount) {
      return fail(res, 400, `This code needs an order of at least ${coupon.minOrderAmount}`);
    }

    const discount = coupon.discountFor(orderAmount);

    return ok(res, "Coupon applied", {
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      discount,
      payable: Math.round((orderAmount - discount) * 100) / 100,
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