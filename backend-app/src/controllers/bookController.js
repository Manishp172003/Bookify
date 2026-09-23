import mongoose from "mongoose";
import Book from "../models/Book.js";

const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

// ─── ISBN Lookup (Google Books + Open Library fallback) ─────────────────────

/**
 * Maps a Google Books volume item to Bookify's metadata shape.
 */
const mapGoogleVolume = (item) => {
  const info = item?.volumeInfo || {};
  return {
    title: info.title || "",
    author: (info.authors || []).join(", "),
    publisher: info.publisher || "",
    publishedDate: info.publishedDate || "",
    description: info.description || "",
    category: (info.categories || [])[0] || "General",
    coverImage:
      info.imageLinks?.thumbnail?.replace("http://", "https://") ||
      info.imageLinks?.smallThumbnail?.replace("http://", "https://") ||
      "",
    pageCount: info.pageCount || null,
    language: info.language || "en",
    isbn: (info.industryIdentifiers || [])
      .find((x) => x.type === "ISBN_13" || x.type === "ISBN_10")?.identifier || "",
  };
};

export const lookupISBN = async (req, res) => {
  const { isbn } = req.params;

  if (!isbn || !/^[0-9Xx-]{10,17}$/.test(isbn.replace(/-/g, ""))) {
    return res.status(400).json({
      success: false,
      message: "Invalid ISBN format",
      data: null,
    });
  }

  const cleanIsbn = isbn.replace(/-/g, "");

  try {
    // ── Primary: Google Books API ────────────────────────────────────────────
    const googleUrl = `https://www.googleapis.com/books/v1/volumes?q=isbn:${cleanIsbn}&maxResults=1${
      process.env.GOOGLE_BOOKS_API_KEY ? `&key=${process.env.GOOGLE_BOOKS_API_KEY}` : ""
    }`;

    let googleData = null;
    try {
      const googleRes = await fetch(googleUrl, { signal: AbortSignal.timeout(8000) });
      const rawText = await googleRes.text();
      googleData = rawText ? JSON.parse(rawText) : null;
    } catch (gErr) {
      console.warn("[ISBN] Google Books unavailable:", gErr.message);
    }

    if (googleData?.totalItems > 0 && googleData.items?.length > 0) {
      return res.status(200).json({
        success: true,
        message: "Book metadata fetched from Google Books",
        source: "google_books",
        data: mapGoogleVolume(googleData.items[0]),
      });
    }

    // ── Fallback: Open Library API ───────────────────────────────────────────
    let olData = null;
    try {
      const olRes = await fetch(
        `https://openlibrary.org/api/books?bibkeys=ISBN:${cleanIsbn}&format=json&jscmd=data`,
        { signal: AbortSignal.timeout(8000) }
      );
      const rawText = await olRes.text();
      olData = rawText ? JSON.parse(rawText) : null;
    } catch (olErr) {
      console.warn("[ISBN] Open Library unavailable:", olErr.message);
    }

    const olKey = `ISBN:${cleanIsbn}`;
    if (olData && olData[olKey]) {
      const book = olData[olKey];
      const coverImage = book.cover?.large || book.cover?.medium || book.cover?.small || "";
      return res.status(200).json({
        success: true,
        message: "Book metadata fetched from Open Library",
        source: "open_library",
        data: {
          title: book.title || "",
          author: (book.authors || []).map((a) => a.name).join(", "),
          publisher: (book.publishers || []).map((p) => p.name).join(", "),
          publishedDate: book.publish_date || "",
          description: book.excerpts?.[0]?.text || "",
          category: (book.subjects || [])[0]?.name || "General",
          coverImage,
          pageCount: book.number_of_pages || null,
          language: book.languages?.[0]?.key?.replace("/languages/", "") || "en",
          isbn: cleanIsbn,
        },
      });
    }

    // ── Not found in either source ────────────────────────────────────────────
    return res.status(404).json({
      success: false,
      message: "No book found for this ISBN. Please enter details manually.",
      data: null,
    });
  } catch (error) {
    console.error("ISBN lookup error:", error);
    return res.status(500).json({
      success: false,
      message: "ISBN lookup service temporarily unavailable",
      data: null,
    });
  }
};

export const getBooks = async (req, res) => {
  try {
    const {
      search,
      category,
      mode,
      condition,
      minPrice,
      maxPrice,
      page = 1,
      limit = 12,
    } = req.query;

    const currentPage = Math.max(Number(page) || 1, 1);
    const perPage = Math.min(Math.max(Number(limit) || 12, 1), 100);

    const filter = {
      status: "Active",
    };

    if (search?.trim()) {
      const searchText = search.trim();

      filter.$or = [
        {
          title: {
            $regex: searchText,
            $options: "i",
          },
        },
        {
          author: {
            $regex: searchText,
            $options: "i",
          },
        },
      ];
    }

    if (category?.trim()) {
      filter.category = category.trim();
    }

    if (mode?.trim()) {
      filter.transactionMode = mode.trim();
    }

    if (condition?.trim()) {
      filter.condition = condition.trim();
    }

    const minimumPrice = Number(minPrice);
    const maximumPrice = Number(maxPrice);

    if (!Number.isNaN(minimumPrice) || !Number.isNaN(maximumPrice)) {
      filter.price = {};

      if (!Number.isNaN(minimumPrice)) {
        filter.price.$gte = Math.max(minimumPrice, 0);
      }

      if (!Number.isNaN(maximumPrice)) {
        filter.price.$lte = Math.max(maximumPrice, 0);
      }
    }

    if (
      filter.price?.$gte !== undefined &&
      filter.price?.$lte !== undefined &&
      filter.price.$gte > filter.price.$lte
    ) {
      return res.status(400).json({
        success: false,
        message: "Minimum price cannot be greater than maximum price",
        data: null,
      });
    }

    const skip = (currentPage - 1) * perPage;

    const [books, total] = await Promise.all([
      Book.find(filter)
        .populate("sellerId", "fullName email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(perPage)
        .lean(),

      Book.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      message: "Books fetched successfully",
      data: {
        books,
        total,
        page: currentPage,
        limit: perPage,
        pages: Math.ceil(total / perPage),
      },
    });
  } catch (error) {
    console.error("Get books error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch books",
      data: null,
    });
  }
};

export const getBookById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid book ID",
        data: null,
      });
    }

    const book = await Book.findById(id)
      .populate("sellerId", "fullName email phone isAuthor authorProfile isVerified authorVerificationStatus authorBio authorAvatar address")
      .lean();

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
        data: null,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Book fetched successfully",
      data: book,
    });
  } catch (error) {
    console.error("Get book error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch book",
      data: null,
    });
  }
};

export const createBook = async (req, res) => {
  try {
    const {
      title,
      author,
      isbn,
      category,
      condition,
      transactionMode,
      price,
      originalPrice,
      rentalDurationWeeks,
      description,
      images,
      location,
      isPublisherListing,
    } = req.body;

    if (
      !title?.trim() ||
      !author?.trim() ||
      !category?.trim() ||
      !condition ||
      !transactionMode
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Title, author, category, condition and transaction mode are required",
        data: null,
      });
    }

    const bookPrice = Number(price ?? 0);

    if (Number.isNaN(bookPrice) || bookPrice < 0) {
      return res.status(400).json({
        success: false,
        message: "Price must be a valid non-negative number",
        data: null,
      });
    }

    const book = await Book.create({
      sellerId: req.user._id,
      title: title.trim(),
      author: author.trim(),
      isbn: isbn?.trim(),
      category: category.trim(),
      condition,
      transactionMode,
      price: bookPrice,
      originalPrice:
        originalPrice !== undefined
          ? Number(originalPrice)
          : undefined,
      rentalDurationWeeks:
        rentalDurationWeeks !== undefined
          ? Number(rentalDurationWeeks)
          : undefined,
      description: description?.trim(),
      images: Array.isArray(images) ? images : [],
      location: location?.trim(),
      isPublisherListing: Boolean(isPublisherListing),
      status: "Active",
    });

    const populatedBook = await Book.findById(book._id)
      .populate("sellerId", "fullName email");

    return res.status(201).json({
      success: true,
      message: "Listing created successfully",
      data: populatedBook,
    });
  } catch (error) {
    console.error("Create book error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create listing",
      data: null,
    });
  }
};

export const updateBook = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid book ID",
        data: null,
      });
    }

    const book = await Book.findById(id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
        data: null,
      });
    }

    const userId = req.user._id.toString();

    const isOwner = book.sellerId.toString() === userId;
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this listing",
        data: null,
      });
    }

    const allowedFields = [
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
      "isPublisherListing",
    ];

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        book[field] = req.body[field];
      }
    }

    if (book.price !== undefined) {
      const updatedPrice = Number(book.price);

      if (Number.isNaN(updatedPrice) || updatedPrice < 0) {
        return res.status(400).json({
          success: false,
          message: "Price must be a valid non-negative number",
          data: null,
        });
      }

      book.price = updatedPrice;
    }

    await book.save();

    const updatedBook = await Book.findById(book._id)
      .populate("sellerId", "fullName email");

    return res.status(200).json({
      success: true,
      message: "Listing updated successfully",
      data: updatedBook,
    });
  } catch (error) {
    console.error("Update book error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update listing",
      data: null,
    });
  }
};

export const updateBookStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = [
      "Active",
      "Pending",
      "Sold",
      "Rented",
      "Inactive",
    ];

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid book ID",
        data: null,
      });
    }

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid book status",
        data: null,
      });
    }

    const book = await Book.findById(id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
        data: null,
      });
    }

    const userId = req.user._id.toString();

    const isOwner = book.sellerId.toString() === userId;
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this listing",
        data: null,
      });
    }

    book.status = status;

    await book.save();

    return res.status(200).json({
      success: true,
      message: "Book status updated successfully",
      data: book,
    });
  } catch (error) {
    console.error("Update book status error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update book status",
      data: null,
    });
  }
};

export const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid book ID",
        data: null,
      });
    }

    const book = await Book.findById(id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
        data: null,
      });
    }

    const userId = req.user._id.toString();

    const isOwner = book.sellerId.toString() === userId;
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this listing",
        data: null,
      });
    }

    await book.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Listing deleted successfully",
      data: null,
    });
  } catch (error) {
    console.error("Delete book error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to delete listing",
      data: null,
    });
  }
};

export const getCategories = async (req, res) => {
  try {
    const categories = await Book.aggregate([
      {
        $match: {
          status: "Active",
        },
      },
      {
        $group: {
          _id: "$category",
          count: {
            $sum: 1,
          },
        },
      },
      {
        $project: {
          _id: 0,
          category: "$_id",
          count: 1,
        },
      },
      {
        $sort: {
          category: 1,
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      message: "Categories fetched successfully",
      data: categories,
    });
  } catch (error) {
    console.error("Get categories error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch categories",
      data: null,
    });
  }
};

export const getMyListings = async (req, res) => {
  try {
    const books = await Book.find({
      sellerId: req.user._id,
    })
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      message: "My listings fetched successfully",
      data: books,
    });
  } catch (error) {
    console.error("Get my listings error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch my listings",
      data: null,
    });
  }
};