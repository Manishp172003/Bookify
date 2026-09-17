import Book from "../models/Book.js";
import Coupon from "../models/Coupon.js";
import Order from "../models/Order.js";
import User from "../models/User.js";
import Campaign from "../models/Campaign.js";
import Payout from "../models/Payout.js";

// ==========================================
// 1. Author Profile & Verification
// ==========================================

export const getAuthorProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password -otp -resetToken");
    if (!user) {
      return res.status(404).json({ success: false, message: "Author not found", data: null });
    }
    return res.status(200).json({ success: true, message: "Author profile fetched", data: user });
  } catch (error) {
    console.error("Get author profile error:", error);
    return res.status(500).json({ success: false, message: error.message, data: null });
  }
};

export const updateAuthorProfile = async (req, res) => {
  try {
    const {
      fullName,
      penName,
      authorBio,
      website,
      socialLinks,
      publisherImprint,
      authorAvatar,
      location,
      payment,
    } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: "Author not found", data: null });
    }

    if (fullName) user.fullName = fullName;
    if (penName !== undefined) user.penName = penName;
    if (authorBio !== undefined) user.authorBio = authorBio;
    if (website !== undefined) user.website = website;
    if (socialLinks) user.socialLinks = { ...user.socialLinks, ...socialLinks };
    if (publisherImprint !== undefined) user.publisherImprint = publisherImprint;
    if (authorAvatar !== undefined) {
      user.authorAvatar = authorAvatar;
      if (!user.avatar || user.avatar === "/images/profile-avatar.png") {
        user.avatar = authorAvatar;
      }
    }
    if (location !== undefined) user.location = location;
    if (payment) user.payment = { ...user.payment, ...payment };

    // Ensure user is recognized as an author
    if (!user.isAuthor && user.role !== "admin") {
      user.isAuthor = true;
    }

    await user.save();

    const sanitized = await User.findById(user._id).select("-password -otp -resetToken");
    return res.status(200).json({ success: true, message: "Profile updated successfully", data: sanitized });
  } catch (error) {
    console.error("Update author profile error:", error);
    return res.status(500).json({ success: false, message: error.message, data: null });
  }
};

export const submitAuthorVerification = async (req, res) => {
  try {
    const { documentTitle, documentUrl, documentFile, fileName, fileType } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: "Author not found", data: null });
    }

    user.authorVerificationStatus = "pending";
    const filePayload = documentUrl || documentFile;
    if (documentTitle && filePayload) {
      user.authorVerificationDocuments.push({
        title: documentTitle,
        url: filePayload,
        fileName: fileName || "verification_doc",
        fileType: fileType || (filePayload.startsWith("data:application/pdf") ? "pdf" : "image"),
        uploadedAt: new Date(),
      });
    }

    if (!user.isAuthor && user.role !== "admin") {
      user.isAuthor = true;
    }

    await user.save();
    return res.status(200).json({
      success: true,
      message: "Author verification documents submitted for admin review",
      data: {
        verificationStatus: user.authorVerificationStatus,
        documents: user.authorVerificationDocuments,
      },
    });
  } catch (error) {
    console.error("Submit author verification error:", error);
    return res.status(500).json({ success: false, message: error.message, data: null });
  }
};

// ==========================================
// 2. Books Management & Publishing
// ==========================================

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
    const {
      title,
      subtitle,
      author,
      isbn,
      category,
      subCategory,
      language,
      tags,
      description,
      bookType,
      manuscriptUrl,
      sampleChapterUrl,
      images,
      price,
      originalPrice,
      rentalPrice,
      allowExchanges,
      status,
    } = req.body;

    const book = await Book.create({
      sellerId: req.user._id,
      title,
      subtitle: subtitle || "",
      author: author || req.user.penName || req.user.fullName || "Author",
      isbn: isbn || "",
      category: category || "Self Help",
      subCategory: subCategory || "",
      language: language || "English",
      tags: Array.isArray(tags) ? tags : [],
      description: description || "",
      bookType: bookType || "eBook",
      condition: "New",
      transactionMode: rentalPrice ? "Rent" : "Sell",
      price: Number(price) || 0,
      originalPrice: Number(originalPrice) || Number(price) || 0,
      rentalPrice: Number(rentalPrice) || 0,
      allowExchanges: allowExchanges !== undefined ? allowExchanges : true,
      images: Array.isArray(images) && images.length > 0 ? images : ["https://covers.openlibrary.org/b/isbn/9780132350884-L.jpg"],
      manuscriptUrl: manuscriptUrl || "",
      sampleChapterUrl: sampleChapterUrl || "",
      isAuthorOriginal: true,
      isPublisherListing: true,
      status: status || "Active",
    });

    return res.status(201).json({ success: true, message: "Book published successfully", data: book });
  } catch (error) {
    console.error("Submit author book error:", error);
    return res.status(500).json({ success: false, message: error.message, data: null });
  }
};

export const updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Book.findOne({ _id: id, sellerId: req.user._id });
    if (!book) {
      return res.status(404).json({ success: false, message: "Book not found or unauthorized", data: null });
    }

    const updates = req.body;
    Object.assign(book, updates);
    await book.save();

    return res.status(200).json({ success: true, message: "Book updated successfully", data: book });
  } catch (error) {
    console.error("Update author book error:", error);
    return res.status(500).json({ success: false, message: error.message, data: null });
  }
};

export const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Book.findOneAndDelete({ _id: id, sellerId: req.user._id });
    if (!book) {
      return res.status(404).json({ success: false, message: "Book not found or unauthorized", data: null });
    }
    return res.status(200).json({ success: true, message: "Book removed successfully", data: { id } });
  } catch (error) {
    console.error("Delete author book error:", error);
    return res.status(500).json({ success: false, message: error.message, data: null });
  }
};

// ==========================================
// 3. Coupons Management
// ==========================================

export const getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find({ authorId: req.user._id }).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, message: "Coupons fetched", data: coupons });
  } catch (error) {
    console.error("Get coupons error:", error);
    return res.status(500).json({ success: false, message: error.message, data: null });
  }
};

export const createCoupon = async (req, res) => {
  try {
    const { code, discountType, discountValue, applicableBooks, expiresAt, maxUses } = req.body;

    const existing = await Coupon.findOne({ code: code.toUpperCase() });
    if (existing) {
      return res.status(400).json({ success: false, message: "Coupon code already exists", data: null });
    }

    const coupon = await Coupon.create({
      authorId: req.user._id,
      code: code.toUpperCase(),
      discountType: discountType || "Percentage",
      discountValue: Number(discountValue),
      applicableBooks: Array.isArray(applicableBooks) ? applicableBooks : [],
      expiresAt: expiresAt ? new Date(expiresAt) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      maxUses: Number(maxUses) || 100,
      usedCount: 0,
      isActive: true,
    });

    return res.status(201).json({ success: true, message: "Coupon created successfully", data: coupon });
  } catch (error) {
    console.error("Create coupon error:", error);
    return res.status(500).json({ success: false, message: error.message, data: null });
  }
};

export const toggleCouponStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const coupon = await Coupon.findOne({ _id: id, authorId: req.user._id });
    if (!coupon) {
      return res.status(404).json({ success: false, message: "Coupon not found", data: null });
    }

    coupon.isActive = !coupon.isActive;
    await coupon.save();

    return res.status(200).json({ success: true, message: `Coupon ${coupon.isActive ? "activated" : "paused"}`, data: coupon });
  } catch (error) {
    console.error("Toggle coupon status error:", error);
    return res.status(500).json({ success: false, message: error.message, data: null });
  }
};

export const deleteCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const coupon = await Coupon.findOneAndDelete({ _id: id, authorId: req.user._id });
    if (!coupon) {
      return res.status(404).json({ success: false, message: "Coupon not found", data: null });
    }
    return res.status(200).json({ success: true, message: "Coupon deleted successfully", data: { id } });
  } catch (error) {
    console.error("Delete coupon error:", error);
    return res.status(500).json({ success: false, message: error.message, data: null });
  }
};

export const validateCoupon = async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) {
      return res.status(400).json({ success: false, message: "Coupon code is required", data: null });
    }

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
        applicableBooks: coupon.applicableBooks,
      },
    });
  } catch (error) {
    console.error("Validate coupon error:", error);
    return res.status(500).json({ success: false, message: error.message, data: null });
  }
};

// ==========================================
// 4. Campaigns & Marketing
// ==========================================

export const getCampaigns = async (req, res) => {
  try {
    const campaigns = await Campaign.find({ authorId: req.user._id }).populate("bookId").sort({ createdAt: -1 });
    return res.status(200).json({ success: true, message: "Campaigns fetched", data: campaigns });
  } catch (error) {
    console.error("Get campaigns error:", error);
    return res.status(500).json({ success: false, message: error.message, data: null });
  }
};

export const createCampaign = async (req, res) => {
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

    const orders = await Order.find({ bookId: { $in: bookIds } }).populate("bookId").populate("buyerId", "fullName email");
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

    const orders = await Order.find({ bookId: { $in: bookIds } }).populate("bookId").sort({ createdAt: -1 });
    const activeCampaigns = await Campaign.countDocuments({ authorId: req.user._id, status: "active" });

    const totalSales = orders.length;
    const totalRevenue = orders.reduce((sum, o) => sum + (o.amount || 0), 0);
    const totalReaders = new Set(orders.map((o) => o.buyerId?.toString())).size;

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
    const orders = await Order.find({ bookId: { $in: bookIds } });

    const totalSales = orders.length;
    const totalRevenue = orders.reduce((sum, o) => sum + (o.amount || 0), 0);

    return res.status(200).json({
      success: true,
      message: "Author analytics fetched",
      data: {
        totalBooks: myBooks.length,
        totalSales,
        totalRevenue,
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
