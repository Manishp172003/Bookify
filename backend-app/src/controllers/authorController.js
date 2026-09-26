import mongoose from "mongoose";
import Book from "../models/Book.js";
import Coupon from "../models/Coupon.js";
import Order from "../models/Order.js";
import Campaign from "../models/Campaign.js";
import Payout from "../models/Payout.js";

const ok = (res, message, data = null, status = 200) => {
  return res.status(status).json({
    success: true,
    message,
    data,
  });
};

const fail = (res, status, message) => {
  return res.status(status).json({
    success: false,
    message,
    data: null,
  });
};

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

const BOOK_FIELDS = [
  "title",
  "author",
  "description",
  "price",
  "condition",
  "category",
  "isbn",
  "images",
  "language",
  "publisher",
  "publicationYear",
  "quantity",
];

const pick = (obj, fields) => {
  return fields.reduce((result, field) => {
    if (obj[field] !== undefined) {
      result[field] = obj[field];
    }

    return result;
  }, {});
};

export const getAuthorProfile = async (req, res) => {
  try {
    return ok(
      res,
      "Author profile fetched",
      req.user
    );
  } catch (error) {
    console.error("Get author profile error:", error);
    return fail(res, 500, error.message);
  }
};

export const updateAuthorProfile = async (req, res) => {
  try {
    const user = req.user;

    const allowedFields = [
      "fullName",
      "email",
      "phone",
      "bio",
      "profileImage",
      "avatar",
      "address",
      "city",
      "state",
      "pincode",
      "payment",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        user[field] = req.body[field];
      }
    });

    if (req.file) {
      user.avatar = req.file.path || req.file.secure_url;
    }

    await user.save();

    return ok(
      res,
      "Author profile updated successfully",
      user
    );
  } catch (error) {
    console.error("Update author profile error:", error);
    return fail(res, 400, error.message);
  }
};

export const submitAuthorVerification = async (req, res) => {
  try {
    const user = req.user;

    const verificationFields = [
      "verificationDocument",
      "documentType",
      "documentNumber",
    ];

    verificationFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        user[field] = req.body[field];
      }
    });

    if (req.files) {
      if (req.files.idDoc?.[0]) {
        user.verificationDocument =
          req.files.idDoc[0].path ||
          req.files.idDoc[0].secure_url;
      }

      if (req.files.degreeDoc?.[0]) {
        user.degreeDocument =
          req.files.degreeDoc[0].path ||
          req.files.degreeDoc[0].secure_url;
      }
    }

    user.verificationStatus = "pending";

    await user.save();

    return ok(
      res,
      "Author verification submitted successfully",
      user
    );
  } catch (error) {
    console.error(
      "Submit author verification error:",
      error
    );

    return fail(res, 400, error.message);
  }
};

export const getMyBooks = async (req, res) => {
  try {
    const page = Math.max(
      1,
      Number(req.query.page) || 1
    );

    const limit = Math.min(
      50,
      Math.max(
        1,
        Number(req.query.limit) || 20
      )
    );

    const filter = {
      sellerId: req.user._id,
    };

    if (req.query.status) {
      filter.status = req.query.status;
    }

    if (req.query.search) {
      filter.$text = {
        $search: req.query.search,
      };
    }

    const [books, total] = await Promise.all([
      Book.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),

      Book.countDocuments(filter),
    ]);

    return ok(res, "Author books fetched", {
      books,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error(
      "Get author books error:",
      error
    );

    return fail(res, 500, error.message);
  }
};

export const submitBook = async (req, res) => {
  try {
    const bookData = {
      ...req.body,
      sellerId: req.user._id,
      status: "Active",
    };

    if (req.file) {
      const image =
        req.file.path ||
        req.file.secure_url;

      bookData.images = [image];
    }

    const book = await Book.create(bookData);

    return ok(
      res,
      "Book submitted successfully",
      book,
      201
    );
  } catch (error) {
    console.error(
      "Submit author book error:",
      error
    );

    return fail(
      res,
      error.name === "ValidationError"
        ? 400
        : 500,
      error.message
    );
  }
};

export const updateBook = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return fail(
        res,
        400,
        "Invalid book id"
      );
    }

    const book = await Book.findOne({
      _id: id,
      sellerId: req.user._id,
    });

    if (!book) {
      return fail(
        res,
        404,
        "Book not found in your listings"
      );
    }

    Object.assign(
      book,
      pick(req.body, BOOK_FIELDS)
    );

    if (
      req.body.status &&
      ["Active", "Inactive"].includes(
        req.body.status
      )
    ) {
      book.status = req.body.status;
    }

    await book.save();

    return ok(
      res,
      "Book updated successfully",
      book
    );
  } catch (error) {
    console.error(
      "Update book error:",
      error
    );

    return fail(
      res,
      400,
      error.message
    );
  }
};

export const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return fail(
        res,
        400,
        "Invalid book id"
      );
    }

    const book = await Book.findOne({
      _id: id,
      sellerId: req.user._id,
    });

    if (!book) {
      return fail(
        res,
        404,
        "Book not found in your listings"
      );
    }

    const hasOrders = await Order.exists({
      bookId: book._id,
    });

    if (hasOrders) {
      book.status = "Inactive";

      await book.save();

      return ok(
        res,
        "Book has existing orders, so it was archived instead of deleted",
        book
      );
    }

    await book.deleteOne();

    return ok(
      res,
      "Book deleted successfully"
    );
  } catch (error) {
    console.error(
      "Delete book error:",
      error
    );

    return fail(
      res,
      500,
      error.message
    );
  }
};

export const getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find({
      authorId: req.user._id,
    }).sort({
      createdAt: -1,
    });

    return ok(
      res,
      "Coupons fetched",
      coupons
    );
  } catch (error) {
    console.error(
      "Get coupons error:",
      error
    );

    return fail(
      res,
      500,
      error.message
    );
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
    } = req.body;

    if (!code) {
      return fail(
        res,
        400,
        "Coupon code is required"
      );
    }

    const coupon = await Coupon.create({
      authorId: req.user._id,
      code: code.toUpperCase(),
      discountType,
      discountValue: Number(discountValue),
      expiresAt,
      maxUses: Number(maxUses) || 0,
    });

    return ok(
      res,
      "Coupon created",
      coupon,
      201
    );
  } catch (error) {
    console.error(
      "Create coupon error:",
      error
    );

    if (error.code === 11000) {
      return fail(
        res,
        409,
        "You already have a coupon with this code"
      );
    }

    return fail(
      res,
      400,
      error.message
    );
  }
};

export const toggleCouponStatus = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return fail(
        res,
        400,
        "Invalid coupon id"
      );
    }

    const coupon = await Coupon.findOne({
      _id: id,
      authorId: req.user._id,
    });

    if (!coupon) {
      return fail(
        res,
        404,
        "Coupon not found"
      );
    }

    coupon.isActive = !coupon.isActive;

    await coupon.save();

    return ok(
      res,
      `Coupon ${
        coupon.isActive
          ? "activated"
          : "deactivated"
      }`,
      coupon
    );
  } catch (error) {
    console.error(
      "Toggle coupon status error:",
      error
    );

    return fail(
      res,
      500,
      error.message
    );
  }
};

export const deleteCoupon = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return fail(
        res,
        400,
        "Invalid coupon id"
      );
    }

    const coupon =
      await Coupon.findOneAndDelete({
        _id: id,
        authorId: req.user._id,
      });

    if (!coupon) {
      return fail(
        res,
        404,
        "Coupon not found"
      );
    }

    return ok(
      res,
      "Coupon deleted successfully",
      {
        id: coupon._id,
      }
    );
  } catch (error) {
    console.error(
      "Delete coupon error:",
      error
    );

    return fail(
      res,
      500,
      error.message
    );
  }
};

export const validateCoupon = async (
  req,
  res
) => {
  try {
    const { code } = req.body;

    if (!code) {
      return fail(
        res,
        400,
        "Coupon code is required"
      );
    }

    const coupon = await Coupon.findOne({
      code: code.toUpperCase(),
      isActive: true,
    });

    if (!coupon) {
      return fail(
        res,
        404,
        "Invalid coupon code"
      );
    }

    if (
      coupon.expiresAt &&
      new Date(coupon.expiresAt) <
        new Date()
    ) {
      return fail(
        res,
        400,
        "Coupon has expired"
      );
    }

    if (
      coupon.maxUses > 0 &&
      coupon.usedCount >= coupon.maxUses
    ) {
      return fail(
        res,
        400,
        "Coupon usage limit reached"
      );
    }

    return ok(
      res,
      "Coupon is valid",
      {
        code: coupon.code,
        discountType:
          coupon.discountType,
        discountValue:
          coupon.discountValue,
      }
    );
  } catch (error) {
    console.error(
      "Validate coupon error:",
      error
    );

    return fail(
      res,
      500,
      error.message
    );
  }
};

export const getCampaigns = async (
  req,
  res
) => {
  try {
    const campaigns =
      await Campaign.find({
        authorId: req.user._id,
      }).sort({
        createdAt: -1,
      });

    return ok(
      res,
      "Campaigns fetched",
      campaigns
    );
  } catch (error) {
    console.error(
      "Get campaigns error:",
      error
    );

    return fail(
      res,
      500,
      error.message
    );
  }
};

export const createCampaign = async (
  req,
  res
) => {
  try {
    const {
      title,
      campaignType,
      targetCategory,
      discountPercentage,
      startDate,
      endDate,
      budget,
      bookId,
    } = req.body;

    if (!title) {
      return fail(
        res,
        400,
        "Campaign title is required"
      );
    }

    if (
      bookId &&
      !isValidId(bookId)
    ) {
      return fail(
        res,
        400,
        "Invalid book id"
      );
    }

    if (bookId) {
      const book =
        await Book.findOne({
          _id: bookId,
          sellerId: req.user._id,
        });

      if (!book) {
        return fail(
          res,
          404,
          "Book not found in your listings"
        );
      }
    }

    const campaign =
      await Campaign.create({
        authorId: req.user._id,
        bookId: bookId || null,
        title,
        campaignType:
          campaignType ||
          "home_banner",
        targetCategory:
          targetCategory || "All",
        discountPercentage:
          Number(discountPercentage) ||
          0,
        startDate: startDate
          ? new Date(startDate)
          : new Date(),
        endDate: endDate
          ? new Date(endDate)
          : new Date(
              Date.now() +
                7 *
                  24 *
                  60 *
                  60 *
                  1000
            ),
        budget: Number(budget) || 0,
        status: "active",
        impressions: 0,
        clicks: 0,
        conversions: 0,
      });

    return ok(
      res,
      "Campaign created successfully",
      campaign,
      201
    );
  } catch (error) {
    console.error(
      "Create campaign error:",
      error
    );

    return fail(
      res,
      500,
      error.message
    );
  }
};

export const updateCampaignStatus =
  async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!isValidId(id)) {
        return fail(
          res,
          400,
          "Invalid campaign id"
        );
      }

      const campaign =
        await Campaign.findOne({
          _id: id,
          authorId: req.user._id,
        });

      if (!campaign) {
        return fail(
          res,
          404,
          "Campaign not found"
        );
      }

      if (status) {
        campaign.status = status;
      }

      await campaign.save();

      return ok(
        res,
        `Campaign status updated to ${campaign.status}`,
        campaign
      );
    } catch (error) {
      console.error(
        "Update campaign status error:",
        error
      );

      return fail(
        res,
        500,
        error.message
      );
    }
  };

export const deleteCampaign = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return fail(
        res,
        400,
        "Invalid campaign id"
      );
    }

    const campaign =
      await Campaign.findOneAndDelete({
        _id: id,
        authorId: req.user._id,
      });

    if (!campaign) {
      return fail(
        res,
        404,
        "Campaign not found"
      );
    }

    return ok(
      res,
      "Campaign deleted",
      { id }
    );
  } catch (error) {
    console.error(
      "Delete campaign error:",
      error
    );

    return fail(
      res,
      500,
      error.message
    );
  }
};

export const getActiveFeaturedCampaigns =
  async (req, res) => {
    try {
      const campaigns =
        await Campaign.find({
          status: "active",
          campaignType: "home_banner",
          startDate: {
            $lte: new Date(),
          },
          endDate: {
            $gte: new Date(),
          },
        })
          .populate("bookId")
          .sort({
            createdAt: -1,
          });

      return ok(
        res,
        "Active featured campaigns fetched",
        campaigns
      );
    } catch (error) {
      console.error(
        "Get active featured campaigns error:",
        error
      );

      return fail(
        res,
        500,
        error.message
      );
    }
  };

export const trackCampaignEngagement =
  async (req, res) => {
    try {
      const { id } = req.params;
      const { type } = req.body;

      if (!isValidId(id)) {
        return fail(
          res,
          400,
          "Invalid campaign id"
        );
      }

      const campaign =
        await Campaign.findById(id);

      if (!campaign) {
        return fail(
          res,
          404,
          "Campaign not found"
        );
      }

      if (type === "impression") {
        campaign.impressions =
          Number(
            campaign.impressions || 0
          ) + 1;
      } else if (type === "click") {
        campaign.clicks =
          Number(
            campaign.clicks || 0
          ) + 1;
      } else if (type === "conversion") {
        campaign.conversions =
          Number(
            campaign.conversions || 0
          ) + 1;
      } else {
        return fail(
          res,
          400,
          "Invalid engagement type"
        );
      }

      await campaign.save();

      return ok(
        res,
        "Campaign engagement tracked",
        campaign
      );
    } catch (error) {
      console.error(
        "Track campaign engagement error:",
        error
      );

      return fail(
        res,
        500,
        error.message
      );
    }
  };

export const getEarnings = async (
  req,
  res
) => {
  try {
    const myBooks =
      await Book.find({
        sellerId: req.user._id,
      });

    const bookIds = myBooks.map(
      (book) => book._id
    );

    const orders =
      await Order.find({
        $or: [
          {
            sellerId: req.user._id,
          },
          {
            bookId: {
              $in: bookIds,
            },
          },
          {
            "items.bookId": {
              $in: bookIds,
            },
          },
        ],
        paymentStatus: "Completed",
      })
        .populate("bookId")
        .populate(
          "buyerId",
          "fullName email"
        )
        .sort({
          createdAt: -1,
        });

    const payouts =
      await Payout.find({
        userId: req.user._id,
      }).sort({
        createdAt: -1,
      });

    const totalRevenue =
      orders.reduce(
        (sum, order) =>
          sum +
          Number(order.amount || 0),
        0
      );

    const paidOut =
      payouts
        .filter(
          (payout) =>
            payout.status ===
            "completed"
        )
        .reduce(
          (sum, payout) =>
            sum +
            Number(
              payout.amount || 0
            ),
          0
        );

    const pendingPayout =
      payouts
        .filter(
          (payout) =>
            payout.status ===
              "pending" ||
            payout.status ===
              "processing"
        )
        .reduce(
          (sum, payout) =>
            sum +
            Number(
              payout.amount || 0
            ),
          0
        );

    const availableBalance =
      Math.max(
        0,
        totalRevenue -
          paidOut -
          pendingPayout
      );

    return ok(
      res,
      "Author earnings fetched",
      {
        totalRevenue,
        availableBalance,
        pendingPayout,
        lifetimePaidOut: paidOut,
        orders,
        payouts,
      }
    );
  } catch (error) {
    console.error(
      "Get earnings error:",
      error
    );

    return fail(
      res,
      500,
      error.message
    );
  }
};

export const requestPayout = async (
  req,
  res
) => {
  try {
    const {
      amount,
      payoutMethod,
      payoutDetails,
    } = req.body;

    const numAmount = Number(amount);

    if (
      !numAmount ||
      numAmount < 100
    ) {
      return fail(
        res,
        400,
        "Minimum payout amount is ₹100"
      );
    }

    const payout =
      await Payout.create({
        userId: req.user._id,
        userRole: "author",
        amount: numAmount,
        payoutMethod:
          payoutMethod || "UPI",
        payoutDetails:
          payoutDetails ||
          req.user.payment ||
          {},
        status: "pending",
        transactionRef: `PO-AUTH-${Date.now()}`,
      });

    return ok(
      res,
      "Payout request submitted successfully. Processing in 24-48 hours.",
      payout,
      201
    );
  } catch (error) {
    console.error(
      "Request payout error:",
      error
    );

    return fail(
      res,
      500,
      error.message
    );
  }
};

export const getPayouts = async (
  req,
  res
) => {
  try {
    const payouts =
      await Payout.find({
        userId: req.user._id,
      }).sort({
        createdAt: -1,
      });

    return ok(
      res,
      "Payout history fetched",
      payouts
    );
  } catch (error) {
    console.error(
      "Get payouts error:",
      error
    );

    return fail(
      res,
      500,
      error.message
    );
  }
};

export const getDashboardStats =
  async (req, res) => {
    try {
      const myBooks =
        await Book.find({
          sellerId: req.user._id,
        });

      const bookIds = myBooks.map(
        (book) => book._id
      );

      const orders =
        await Order.find({
          $or: [
            {
              sellerId: req.user._id,
            },
            {
              bookId: {
                $in: bookIds,
              },
            },
            {
              "items.bookId": {
                $in: bookIds,
              },
            },
          ],
          paymentStatus: "Completed",
        })
          .populate("bookId")
          .sort({
            createdAt: -1,
          });

      const activeCampaigns =
        await Campaign.countDocuments({
          authorId: req.user._id,
          status: "active",
        });

      const totalSales =
        orders.length;

      const totalRevenue =
        orders.reduce(
          (sum, order) =>
            sum +
            Number(
              order.amount || 0
            ),
          0
        );

      const totalReaders =
        new Set(
          orders.map((order) =>
            order.buyerId
              ? order.buyerId.toString()
              : "anon"
          )
        ).size;

      return ok(
        res,
        "Author dashboard stats fetched",
        {
          totalBooks:
            myBooks.length,
          totalReaders,
          totalSales,
          totalRevenue,
          activeCampaigns,
          recentOrders:
            orders.slice(0, 5),
        }
      );
    } catch (error) {
      console.error(
        "Get dashboard stats error:",
        error
      );

      return fail(
        res,
        500,
        error.message
      );
    }
  };

export const getAnalytics = async (
  req,
  res
) => {
  try {
    const myBooks =
      await Book.find({
        sellerId: req.user._id,
      });

    const bookIds = myBooks.map(
      (book) => book._id
    );

    const orderMatch = {
      $or: [
        {
          sellerId: req.user._id,
        },
        {
          bookId: {
            $in: bookIds,
          },
        },
        {
          "items.bookId": {
            $in: bookIds,
          },
        },
      ],
      paymentStatus: "Completed",
    };

    const orders =
      await Order.find(
        orderMatch
      ).sort({
        createdAt: -1,
      });

    const totalSales =
      orders.length;

    const totalRevenue =
      orders.reduce(
        (sum, order) =>
          sum +
          Number(
            order.amount || 0
          ),
        0
      );

    const thirtyDaysAgo =
      new Date();

    thirtyDaysAgo.setDate(
      thirtyDaysAgo.getDate() - 30
    );

    const dailyRevenue =
      await Order.aggregate([
        {
          $match: {
            ...orderMatch,
            createdAt: {
              $gte: thirtyDaysAgo,
            },
          },
        },
        {
          $group: {
            _id: {
              $dateToString: {
                format:
                  "%Y-%m-%d",
                date: "$createdAt",
              },
            },
            revenue: {
              $sum: "$amount",
            },
            salesCount: {
              $sum: 1,
            },
          },
        },
        {
          $sort: {
            _id: 1,
          },
        },
        {
          $project: {
            _id: 0,
            date: "$_id",
            revenue: 1,
            salesCount: 1,
          },
        },
      ]);

    const bookSalesMap = {};

    orders.forEach((order) => {
      const bookId =
        order.bookId
          ? order.bookId.toString()
          : order.items?.[0]?.bookId
            ? order.items[0].bookId.toString()
            : "unknown";

      if (!bookSalesMap[bookId]) {
        bookSalesMap[bookId] = {
          sales: 0,
          revenue: 0,
        };
      }

      bookSalesMap[bookId].sales += 1;

      bookSalesMap[bookId].revenue +=
        Number(
          order.amount || 0
        );
    });

    const topBooks =
      myBooks
        .map((book) => ({
          id: book._id,
          title: book.title,
          coverImage:
            book.images?.[0] || "",
          views: book.views || 0,
          sales:
            bookSalesMap[
              book._id.toString()
            ]?.sales || 0,
          revenue:
            bookSalesMap[
              book._id.toString()
            ]?.revenue || 0,
        }))
        .sort(
          (a, b) =>
            b.sales - a.sales
        );

    return ok(
      res,
      "Author analytics fetched",
      {
        totalBooks:
          myBooks.length,
        totalSales,
        totalRevenue,
        dailyRevenue,
        topBooks,
        demographics: [
          {
            college: "IIT Bombay",
            readers: 48,
          },
          {
            college: "BITS Pilani",
            readers: 36,
          },
          {
            college:
              "Delhi University",
            readers: 29,
          },
          {
            college: "VNIT Nagpur",
            readers: 18,
          },
        ],
      }
    );
  } catch (error) {
    console.error(
      "Get analytics error:",
      error
    );

    return fail(
      res,
      500,
      error.message
    );
  }
};