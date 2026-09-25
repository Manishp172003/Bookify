import Rental from "../models/Rental.js";
import User from "../models/User.js";

// Helper: Calculate dynamic days left and percentage
const formatRental = (rental) => {
  const doc = rental.toObject ? rental.toObject() : { ...rental };
  const now = new Date();
  const due = new Date(doc.dueDate);
  const diffTime = due.getTime() - now.getTime();
  const daysLeft = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  const totalDays = doc.durationDays || 30;
  const percentLeft = Math.min(100, Math.max(0, Math.round((daysLeft / totalDays) * 100)));

  return {
    id: doc.rentalCode || `RNT-${doc._id.toString().slice(-5)}`,
    _id: doc._id,
    title: doc.title,
    author: doc.author,
    coverImage: doc.coverImage,
    coverClass: doc.coverClass || "from-[#0F172A] to-[#1E293B]",
    owner: doc.ownerName,
    ownerId: doc.ownerId,
    renter: doc.renterName,
    renterId: doc.renterId,
    deposit: `₹${doc.depositAmount}`,
    fee: `₹${doc.rentalFee}/mo`,
    depositAmount: doc.depositAmount,
    rentalFee: doc.rentalFee,
    daysLeft: doc.status === "completed" ? 0 : daysLeft,
    percentLeft: doc.status === "completed" ? 0 : percentLeft,
    dueDate: new Date(doc.dueDate).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
    status: doc.status,
    notes: doc.notes,
  };
};

/**
 * @desc Get all rentals (both rented by user and lent by user)
 * @route GET /api/rentals/my-rentals
 * @access Private
 */
export const getMyRentals = async (req, res) => {
  try {
    const userId = req.user._id;

    let rented = await Rental.find({ renterId: userId }).sort({ createdAt: -1 });
    let lent = await Rental.find({ ownerId: userId }).sort({ createdAt: -1 });

    // If database has no rentals for this user, seed default campus active records
    if (rented.length === 0 && lent.length === 0) {
      const demoOwner = await User.findOne({ _id: { $ne: userId } }) || { _id: userId, fullName: "Dev Kumar" };
      const demoRenter = await User.findOne({ _id: { $ne: userId } }) || { _id: userId, fullName: "Amit Sen" };

      const seededRented1 = await Rental.create({
        rentalCode: "RNT-10928",
        title: "Operating System Concepts, 9th Edition",
        author: "Silberschatz, Galvin, Gagne",
        renterId: userId,
        renterName: req.user.fullName,
        ownerId: demoOwner._id,
        ownerName: demoOwner.fullName || "Dev Kumar",
        durationDays: 30,
        startDate: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000),
        dueDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
        depositAmount: 400,
        rentalFee: 150,
        coverImage: "https://covers.openlibrary.org/b/isbn/9781118063330-L.jpg",
        coverClass: "from-[#0F172A] to-[#1E293B]",
        status: "active",
      });

      const seededRented2 = await Rental.create({
        rentalCode: "RNT-51290",
        title: "Core Java: An Integrated Approach",
        author: "R. Nageswara Rao",
        renterId: userId,
        renterName: req.user.fullName,
        ownerId: demoOwner._id,
        ownerName: "Priya Patel",
        durationDays: 30,
        startDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        dueDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
        depositAmount: 300,
        rentalFee: 100,
        coverImage: "https://covers.openlibrary.org/b/isbn/9789351199342-L.jpg",
        coverClass: "from-[#4F46E5] to-[#7C3AED]",
        status: "active",
      });

      const seededLent = await Rental.create({
        rentalCode: "LNT-38290",
        title: "Database System Concepts",
        author: "Korth, Sudarshan",
        renterId: demoRenter._id,
        renterName: demoRenter.fullName || "Amit Sen",
        ownerId: userId,
        ownerName: req.user.fullName,
        durationDays: 30,
        startDate: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        depositAmount: 500,
        rentalFee: 200,
        coverImage: "https://covers.openlibrary.org/b/isbn/9780073523323-L.jpg",
        coverClass: "from-[#047857] to-[#065F46]",
        status: "active",
      });

      rented = [seededRented1, seededRented2];
      lent = [seededLent];
    }

    res.status(200).json({
      success: true,
      data: {
        rented: rented.map(formatRental),
        lent: lent.map(formatRental),
      },
    });
  } catch (error) {
    console.error("getMyRentals error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch rentals",
      error: error.message,
    });
  }
};

/**
 * @desc Create a new rental
 * @route POST /api/rentals/create
 * @access Private
 */
export const createRental = async (req, res) => {
  try {
    const { bookId, title, author, ownerId, ownerName, durationDays = 30, depositAmount = 300, rentalFee = 150, coverImage } = req.body;

    const dueDate = new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000);

    const rental = await Rental.create({
      bookId,
      title,
      author,
      coverImage,
      renterId: req.user._id,
      renterName: req.user.fullName,
      ownerId,
      ownerName: ownerName || "Book Owner",
      durationDays,
      dueDate,
      depositAmount,
      rentalFee,
      status: "active",
    });

    res.status(201).json({
      success: true,
      message: "Rental created successfully",
      data: formatRental(rental),
    });
  } catch (error) {
    console.error("createRental error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create rental",
      error: error.message,
    });
  }
};

/**
 * @desc Extend rental duration
 * @route PATCH /api/rentals/:id/extend
 * @access Private
 */
export const extendRental = async (req, res) => {
  try {
    const { id } = req.params;
    const additionalDays = Number(req.body.additionalDays || 15);

    const rental = await Rental.findOne({
      $or: [{ rentalCode: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }],
    });

    if (!rental) {
      return res.status(404).json({ success: false, message: "Rental record not found" });
    }

    const currentDue = new Date(rental.dueDate);
    rental.dueDate = new Date(currentDue.getTime() + additionalDays * 24 * 60 * 60 * 1000);
    rental.durationDays += additionalDays;
    rental.notes = `Extended by ${additionalDays} days on ${new Date().toLocaleDateString()}`;
    await rental.save();

    res.status(200).json({
      success: true,
      message: `Rental successfully extended by ${additionalDays} days`,
      data: formatRental(rental),
    });
  } catch (error) {
    console.error("extendRental error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to extend rental",
      error: error.message,
    });
  }
};

/**
 * @desc Renter requests to return the book
 * @route PATCH /api/rentals/:id/return-request
 * @access Private
 */
export const requestReturn = async (req, res) => {
  try {
    const { id } = req.params;

    const rental = await Rental.findOne({
      $or: [{ rentalCode: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }],
    });

    if (!rental) {
      return res.status(404).json({ success: false, message: "Rental record not found" });
    }

    rental.status = "return_initiated";
    rental.actualReturnDate = new Date();
    await rental.save();

    res.status(200).json({
      success: true,
      message: "Return initiated. Security deposit will be refunded once the owner confirms receipt.",
      data: formatRental(rental),
    });
  } catch (error) {
    console.error("requestReturn error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to initiate return",
      error: error.message,
    });
  }
};

/**
 * @desc Owner confirms return and automatically refunds deposit to renter
 * @route PATCH /api/rentals/:id/confirm-return
 * @access Private
 */
export const confirmReturn = async (req, res) => {
  try {
    const { id } = req.params;

    const rental = await Rental.findOne({
      $or: [{ rentalCode: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }],
    });

    if (!rental) {
      return res.status(404).json({ success: false, message: "Rental record not found" });
    }

    rental.status = "completed";
    rental.actualReturnDate = new Date();
    await rental.save();

    // Auto-refund deposit to renter's wallet
    if (rental.depositAmount > 0 && rental.renterId) {
      await User.findByIdAndUpdate(rental.renterId, {
        $inc: { walletBalance: rental.depositAmount },
      });
    }

    res.status(200).json({
      success: true,
      message: `Return confirmed! Security deposit of ₹${rental.depositAmount} refunded to renter's wallet.`,
      data: formatRental(rental),
    });
  } catch (error) {
    console.error("confirmReturn error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to confirm return",
      error: error.message,
    });
  }
};
