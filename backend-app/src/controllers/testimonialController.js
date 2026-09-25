import Testimonial from "../models/Testimonial.js";
import User from "../models/User.js";
import PlatformSetting from "../models/PlatformSetting.js";

// ==========================================
// Public: Get Featured Testimonials for Home Page
// ==========================================
export const getFeaturedTestimonials = async (req, res) => {
  try {
    // 1. First fetch approved testimonials specifically flagged as featured
    let testimonials = await Testimonial.find({
      status: "approved",
      isFeatured: true,
    })
      .sort({ createdAt: -1 })
      .limit(6);

    // 2. If fewer than 3 featured, fill up with latest approved reviews
    if (testimonials.length < 3) {
      const remainingLimit = 6 - testimonials.length;
      const additional = await Testimonial.find({
        status: "approved",
        _id: { $nin: testimonials.map((t) => t._id) },
      })
        .sort({ rating: -1, createdAt: -1 })
        .limit(remainingLimit);

      testimonials = [...testimonials, ...additional];
    }

    return res.status(200).json({
      success: true,
      data: testimonials,
    });
  } catch (error) {
    console.error("Get featured testimonials error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch featured testimonials",
      data: [],
    });
  }
};

// ==========================================
// Authenticated: Submit or Update User Testimonial
// ==========================================
export const submitTestimonial = async (req, res) => {
  try {
    const { rating, role } = req.body;
    const comment = req.body.comment || req.body.content || "";
    const userId = req.user._id || req.user.id;

    if (!rating || !comment || comment.trim().length < 10) {
      return res.status(400).json({
        success: false,
        message: "Rating (1-5) and a review of at least 10 characters are required.",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User account not found.",
      });
    }

    // Determine sensible default role if not provided
    const userRole =
      role?.trim() ||
      (user.college ? `Student, ${user.college}` : user.role === "author" ? "Author" : "Student");

    // Check if user already submitted a review
    let testimonial = await Testimonial.findOne({ user: userId });

    const displayName = user.fullName || user.name || "Bookify Reader";
    const displayAvatar = user.avatar || user.authorProfile?.avatar || user.profileImage || null;

    // Check platform moderation setting for auto-approve vs manual
    const platformSettings = await PlatformSetting.findOne();
    const initialStatus = platformSettings?.autoApproveTestimonials ? "approved" : "pending";

    if (testimonial) {
      testimonial.name = displayName;
      testimonial.avatar = displayAvatar;
      testimonial.role = userRole;
      testimonial.rating = Number(rating);
      testimonial.comment = comment.trim();
      testimonial.status = initialStatus;
      await testimonial.save();
    } else {
      testimonial = await Testimonial.create({
        user: userId,
        name: displayName,
        avatar: displayAvatar,
        role: userRole,
        rating: Number(rating),
        comment: comment.trim(),
        status: initialStatus,
        isFeatured: false,
      });
    }

    return res.status(200).json({
      success: true,
      message:
        initialStatus === "approved"
          ? "Thank you! Your review has been published."
          : "Your review has been submitted and is awaiting admin approval.",
      data: testimonial,
    });
  } catch (error) {
    console.error("Submit testimonial error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to submit testimonial",
    });
  }
};

// ==========================================
// Admin: Get All Testimonials with Stats
// ==========================================
export const getAdminTestimonials = async (req, res) => {
  try {
    const { status } = req.query;

    const query = {};
    if (status && status !== "all") {
      query.status = status;
    }

    const testimonials = await Testimonial.find(query)
      .sort({ createdAt: -1 })
      .populate("user", "email name role college");

    const counts = {
      total: await Testimonial.countDocuments(),
      pending: await Testimonial.countDocuments({ status: "pending" }),
      approved: await Testimonial.countDocuments({ status: "approved" }),
      rejected: await Testimonial.countDocuments({ status: "rejected" }),
    };

    return res.status(200).json({
      success: true,
      data: testimonials,
      counts,
    });
  } catch (error) {
    console.error("Get admin testimonials error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch testimonials for admin",
      data: [],
    });
  }
};

// ==========================================
// Admin: Update Status (Approve / Reject)
// ==========================================
export const updateTestimonialStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["pending", "approved", "rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    const update = { status };
    // If rejecting, remove from featured
    if (status === "rejected") {
      update.isFeatured = false;
    }

    const testimonial = await Testimonial.findByIdAndUpdate(id, update, { new: true });
    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: "Testimonial not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: `Testimonial ${status} successfully.`,
      data: testimonial,
    });
  } catch (error) {
    console.error("Update testimonial status error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update testimonial status",
    });
  }
};

// ==========================================
// Admin: Toggle Featured on Home Page
// ==========================================
export const toggleFeaturedTestimonial = async (req, res) => {
  try {
    const { id } = req.params;

    const testimonial = await Testimonial.findById(id);
    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: "Testimonial not found",
      });
    }

    testimonial.isFeatured = !testimonial.isFeatured;
    // Auto-approve if featured
    if (testimonial.isFeatured && testimonial.status !== "approved") {
      testimonial.status = "approved";
    }

    await testimonial.save();

    return res.status(200).json({
      success: true,
      message: testimonial.isFeatured
        ? "Review featured on Home Page."
        : "Review removed from Home Page featured list.",
      data: testimonial,
    });
  } catch (error) {
    console.error("Toggle featured testimonial error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to toggle featured status",
    });
  }
};

// ==========================================
// Admin: Delete Testimonial
// ==========================================
export const deleteTestimonial = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Testimonial.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Testimonial not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Testimonial deleted successfully.",
    });
  } catch (error) {
    console.error("Delete testimonial error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete testimonial",
    });
  }
};
