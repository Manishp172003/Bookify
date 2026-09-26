import crypto from "crypto";
import NewsletterSubscriber from "../models/NewsletterSubscriber.js";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Public: Subscribe to Bookify newsletter
 * POST /api/newsletter/subscribe
 */
export const subscribe = async (req, res) => {
  try {
    const { email, source = "explore_page" } = req.body;

    if (!email || typeof email !== "string" || !EMAIL_REGEX.test(email.trim())) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address.",
        data: null,
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check if subscriber exists
    let subscriber = await NewsletterSubscriber.findOne({ email: cleanEmail });

    if (subscriber) {
      if (subscriber.status === "active") {
        return res.status(200).json({
          success: true,
          message: "You're already subscribed to Bookify updates!",
          data: {
            status: "already_subscribed",
            email: cleanEmail,
          },
        });
      }

      // Reactivate
      subscriber.status = "active";
      subscriber.unsubscribedAt = null;
      subscriber.subscribedAt = new Date();
      subscriber.source = source || subscriber.source;
      await subscriber.save();

      return res.status(200).json({
        success: true,
        message: "Welcome back! Your subscription has been reactivated.",
        data: {
          status: "reactivated",
          email: cleanEmail,
        },
      });
    }

    // Create fresh subscriber
    const unsubscribeToken = crypto.randomUUID();
    subscriber = await NewsletterSubscriber.create({
      email: cleanEmail,
      source,
      status: "active",
      unsubscribeToken,
      subscribedAt: new Date(),
    });

    return res.status(201).json({
      success: true,
      message: "🎉 You're subscribed! We'll send you curated book drops & campus deals.",
      data: {
        id: subscriber._id,
        email: subscriber.email,
        subscribedAt: subscriber.subscribedAt,
      },
    });
  } catch (error) {
    console.error("Newsletter subscribe error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to process subscription. Please try again.",
      data: null,
    });
  }
};

/**
 * Public: Unsubscribe via token
 * GET /api/newsletter/unsubscribe/:token
 */
export const unsubscribe = async (req, res) => {
  try {
    const { token } = req.params;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Unsubscribe token is required.",
      });
    }

    const subscriber = await NewsletterSubscriber.findOne({ unsubscribeToken: token });

    if (!subscriber) {
      return res.status(404).json({
        success: false,
        message: "Subscription record not found or already removed.",
      });
    }

    subscriber.status = "unsubscribed";
    subscriber.unsubscribedAt = new Date();
    await subscriber.save();

    return res.status(200).json({
      success: true,
      message: "You have been successfully unsubscribed from Bookify newsletters.",
      data: {
        email: subscriber.email,
        status: subscriber.status,
      },
    });
  } catch (error) {
    console.error("Newsletter unsubscribe error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to process unsubscribe request.",
    });
  }
};

/**
 * Admin: Get paginated subscribers with filters & metrics
 * GET /api/newsletter/admin/subscribers
 */
export const getSubscribers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      search = "",
      status = "all",
    } = req.query;

    const query = {};

    if (search.trim()) {
      query.email = { $regex: search.trim(), $options: "i" };
    }

    if (status && status !== "all") {
      query.status = status;
    }

    const currentPage = Math.max(1, parseInt(page, 10));
    const perPage = Math.min(100, Math.max(1, parseInt(limit, 10)));
    const skip = (currentPage - 1) * perPage;

    const [subscribers, total, activeCount, unsubscribedCount] = await Promise.all([
      NewsletterSubscriber.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(perPage)
        .lean(),
      NewsletterSubscriber.countDocuments(query),
      NewsletterSubscriber.countDocuments({ status: "active" }),
      NewsletterSubscriber.countDocuments({ status: "unsubscribed" }),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        subscribers,
        total,
        page: currentPage,
        pages: Math.ceil(total / perPage) || 1,
        counts: {
          total: activeCount + unsubscribedCount,
          active: activeCount,
          unsubscribed: unsubscribedCount,
        },
      },
    });
  } catch (error) {
    console.error("Get subscribers error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch newsletter subscribers.",
      data: null,
    });
  }
};

/**
 * Admin: Delete subscriber
 * DELETE /api/newsletter/admin/subscribers/:id
 */
export const deleteSubscriber = async (req, res) => {
  try {
    const { id } = req.params;

    const subscriber = await NewsletterSubscriber.findByIdAndDelete(id);

    if (!subscriber) {
      return res.status(404).json({
        success: false,
        message: "Subscriber not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: `Subscriber ${subscriber.email} removed successfully.`,
    });
  } catch (error) {
    console.error("Delete subscriber error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete subscriber.",
    });
  }
};

/**
 * Admin: Export all active subscribers for CSV download
 * GET /api/newsletter/admin/export
 */
export const exportSubscribers = async (req, res) => {
  try {
    const subscribers = await NewsletterSubscriber.find({ status: "active" })
      .select("email source subscribedAt")
      .sort({ subscribedAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      data: subscribers,
    });
  } catch (error) {
    console.error("Export subscribers error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to export subscriber list.",
    });
  }
};
