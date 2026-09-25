import WantBoard from "../models/WantBoard.js";

export const getWantBoard = async (req, res) => {
  try {
    const { category, urgency, search } = req.query;
    const filter = { status: "Open" };

    if (category) filter.category = category;
    if (urgency) filter.urgency = urgency;
    if (search) {
      filter.$or = [
        { bookTitle: { $regex: search, $options: "i" } },
        { author: { $regex: search, $options: "i" } },
      ];
    }

    const requests = await WantBoard.find(filter)
      .populate("userId", "fullName email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Want board requests fetched successfully",
      data: requests,
    });
  } catch (error) {
    console.error("Get want board error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch want board requests",
      data: null,
    });
  }
};

export const createWantBoardPost = async (req, res) => {
  try {
    const bookTitle = req.body.bookTitle || req.body.title;
    const author = req.body.author || "";
    const category = req.body.category || "General";
    const budget = Number(req.body.budget || req.body.maxBudget) || 0;
    const urgency = req.body.urgency || "Medium";
    const notes = req.body.notes || req.body.location || "";

    if (!bookTitle) {
      return res.status(400).json({
        success: false,
        message: "Book title is required",
        data: null,
      });
    }

    const post = await WantBoard.create({
      userId: req.user._id,
      userName: req.user.fullName || "Anonymous Student",
      bookTitle,
      author,
      category,
      budget,
      urgency,
      notes,
    });

    return res.status(201).json({
      success: true,
      message: "Want board post created successfully",
      data: post,
    });
  } catch (error) {
    console.error("Create want board error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create want board post",
      data: null,
    });
  }
};

export const deleteWantBoardPost = async (req, res) => {
  try {
    const post = await WantBoard.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Want board post not found",
        data: null,
      });
    }

    const isOwner = post.userId.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this post",
        data: null,
      });
    }

    await WantBoard.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Want board post deleted successfully",
      data: null,
    });
  } catch (error) {
    console.error("Delete want board error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to delete want board post",
      data: null,
    });
  }
};
