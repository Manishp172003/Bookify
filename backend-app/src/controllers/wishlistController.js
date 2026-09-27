import User from "../models/User.js";

/**
 * GET /api/wishlist
 * Retrieve all items in the user's saved wishlist.
 */
export const getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("wishlist");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    return res.status(200).json({
      success: true,
      data: user.wishlist || [],
    });
  } catch (error) {
    console.error("Get wishlist error:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * POST /api/wishlist/toggle
 * Add or remove an item from the user's saved wishlist.
 */
export const toggleWishlist = async (req, res) => {
  try {
    const { id, title, author, price, condition, coverImage, mode, alertActive } = req.body;

    if (!id) {
      return res.status(400).json({ success: false, message: "Book ID is required" });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (!user.wishlist) {
      user.wishlist = [];
    }

    const existingIndex = user.wishlist.findIndex((item) => String(item.id) === String(id));

    let isWishlisted = false;
    if (existingIndex > -1) {
      // Remove item
      user.wishlist.splice(existingIndex, 1);
      isWishlisted = false;
    } else {
      // Add item
      user.wishlist.push({
        id: String(id),
        title: title || "Untitled Book",
        author: author || "Unknown Author",
        price: price || "₹0",
        condition: condition || "Good",
        coverImage: coverImage || "",
        mode: mode || "buy",
        alertActive: Boolean(alertActive),
        addedAt: new Date(),
      });
      isWishlisted = true;
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: isWishlisted ? "Item added to wishlist" : "Item removed from wishlist",
      isWishlisted,
      data: user.wishlist,
    });
  } catch (error) {
    console.error("Toggle wishlist error:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * POST /api/wishlist/sync
 * Sync / merge guest localStorage wishlist items into user's DB wishlist upon login.
 */
export const syncWishlist = async (req, res) => {
  try {
    const { items } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (!user.wishlist) {
      user.wishlist = [];
    }

    if (Array.isArray(items) && items.length > 0) {
      let modified = false;
      for (const item of items) {
        if (!item || !item.id) continue;
        const exists = user.wishlist.some((existing) => String(existing.id) === String(item.id));
        if (!exists) {
          user.wishlist.push({
            id: String(item.id),
            title: item.title || "Untitled Book",
            author: item.author || "Unknown Author",
            price: item.price || "₹0",
            condition: item.condition || "Good",
            coverImage: item.coverImage || "",
            mode: item.mode || "buy",
            alertActive: Boolean(item.alertActive),
            addedAt: item.addedAt ? new Date(item.addedAt) : new Date(),
          });
          modified = true;
        }
      }
      if (modified) {
        await user.save();
      }
    }

    return res.status(200).json({
      success: true,
      message: "Wishlist synced successfully",
      data: user.wishlist,
    });
  } catch (error) {
    console.error("Sync wishlist error:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * DELETE /api/wishlist/:id
 * Remove a specific item from wishlist by ID.
 */
export const removeFromWishlist = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    user.wishlist = (user.wishlist || []).filter((item) => String(item.id) !== String(id));
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Item removed from wishlist",
      data: user.wishlist,
    });
  } catch (error) {
    console.error("Remove from wishlist error:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * PATCH /api/wishlist/:id/alert
 * Toggle price drop alert preference for a wishlisted item.
 */
export const toggleAlert = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const item = (user.wishlist || []).find((item) => String(item.id) === String(id));
    if (item) {
      item.alertActive = !item.alertActive;
      await user.save();
    }

    return res.status(200).json({
      success: true,
      data: user.wishlist,
    });
  } catch (error) {
    console.error("Toggle alert error:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
};
