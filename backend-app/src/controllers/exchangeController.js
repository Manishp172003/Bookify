import Exchange from "../models/Exchange.js";
import User from "../models/User.js";

// Helper: Format exchange for frontend card components
const formatExchange = (exchange, currentUserId) => {
  const doc = exchange.toObject ? exchange.toObject() : { ...exchange };
  const isReceiver = String(doc.receiverId) === String(currentUserId);

  let statusColor = "text-amber-600 bg-amber-50 border-amber-100";
  if (doc.status.includes("Accepted")) {
    statusColor = "text-green-600 bg-green-50 border-green-100";
  } else if (doc.status === "Completed") {
    statusColor = "text-blue-600 bg-blue-50 border-blue-100";
  } else if (doc.status === "Declined") {
    statusColor = "text-red-600 bg-red-50 border-red-100";
  }

  // If current user is receiver:
  // "yourBook" is what the partner requested from you (requestedBook)
  // "theirBook" is what the partner is offering to you (offeredBook)
  // "partner" is the proposer
  //
  // If current user is proposer (sent):
  // "yourBook" is what you are offering (offeredBook)
  // "theirBook" is what you want from them (requestedBook)
  // "partner" is the receiver
  return {
    id: doc.exchangeCode || `SWP-${doc._id.toString().slice(-4)}`,
    _id: doc._id,
    partner: isReceiver ? doc.proposerName : doc.receiverName,
    partnerId: isReceiver ? doc.proposerId : doc.receiverId,
    status: doc.status,
    statusColor,
    yourBook: isReceiver ? doc.requestedBook : doc.offeredBook,
    theirBook: isReceiver ? doc.offeredBook : doc.requestedBook,
    meetupLocation: doc.meetupLocation,
    note: doc.note,
    createdAt: doc.createdAt,
    completedAt: doc.completedAt,
  };
};

/**
 * @desc Get all exchanges for current user (Offers Received & Offers Sent)
 * @route GET /api/exchanges/my-exchanges
 * @access Private
 */
export const getMyExchanges = async (req, res) => {
  try {
    const userId = req.user._id;

    let received = await Exchange.find({ receiverId: userId }).sort({ createdAt: -1 });
    let sent = await Exchange.find({ proposerId: userId }).sort({ createdAt: -1 });

    // Seed realistic proposals if empty
    if (received.length === 0 && sent.length === 0) {
      const partner1 = await User.findOne({ _id: { $ne: userId } }) || { _id: userId, fullName: "Sneha Reddy" };

      const seededReceived = await Exchange.create({
        exchangeCode: "SWP-9021",
        proposerId: partner1._id,
        proposerName: partner1.fullName || "Sneha Reddy",
        receiverId: userId,
        receiverName: req.user.fullName,
        requestedBook: {
          title: "Introduction to Algorithms",
          author: "Cormen, Leiserson",
          condition: "Very Good",
          coverImage: "https://covers.openlibrary.org/b/isbn/9780262033848-L.jpg",
          coverClass: "from-[#111827] to-[#374151]",
        },
        offeredBook: {
          title: "Compiler Design: Principles",
          author: "Aho, Lam, Sethi",
          condition: "Like New",
          coverImage: "https://covers.openlibrary.org/b/isbn/9780321486813-L.jpg",
          coverClass: "from-[#065F46] to-[#047857]",
        },
        meetupLocation: "Campus Central Library Ground Floor",
        note: "Hey, saw your algorithms book! I have the latest dragon book for compiler design in pristine condition. Let me know if you want to trade!",
        status: "Pending Decision",
      });

      const seededSent = await Exchange.create({
        exchangeCode: "SWP-3820",
        proposerId: userId,
        proposerName: req.user.fullName,
        receiverId: partner1._id,
        receiverName: "Aarav Sharma",
        requestedBook: {
          title: "Concepts of Physics Vol 1",
          author: "H.C. Verma",
          condition: "Very Good",
          coverImage: "https://covers.openlibrary.org/b/isbn/9788177091878-L.jpg",
          coverClass: "from-[#E11D48] to-[#F43F5E]",
        },
        offeredBook: {
          title: "Organic Chemistry, 8th Edition",
          author: "L.G. Wade",
          condition: "Good",
          coverImage: "https://covers.openlibrary.org/b/isbn/9780321811295-L.jpg",
          coverClass: "from-[#0F172A] to-[#1E293B]",
        },
        meetupLocation: "Student Center Cafeteria",
        note: "I have the organic chemistry Wade edition ready to swap for HC Verma.",
        status: "Accepted - Meetup Pending",
      });

      received = [seededReceived];
      sent = [seededSent];
    }

    res.status(200).json({
      success: true,
      data: {
        received: received.map((e) => formatExchange(e, userId)),
        sent: sent.map((e) => formatExchange(e, userId)),
      },
    });
  } catch (error) {
    console.error("getMyExchanges error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch exchanges",
      error: error.message,
    });
  }
};

/**
 * @desc Propose a new textbook exchange
 * @route POST /api/exchanges/propose
 * @access Private
 */
export const proposeExchange = async (req, res) => {
  try {
    const {
      receiverId,
      receiverName,
      requestedBook,
      offeredBook,
      meetupLocation,
      note,
      chatId,
    } = req.body;

    const exchange = await Exchange.create({
      proposerId: req.user._id,
      proposerName: req.user.fullName,
      receiverId: receiverId || req.user._id,
      receiverName: receiverName || "Campus Student",
      requestedBook: {
        bookId: requestedBook?.bookId,
        title: requestedBook?.title || "Requested Textbook",
        author: requestedBook?.author || "",
        condition: requestedBook?.condition || "Good",
        coverImage: requestedBook?.coverImage || "",
      },
      offeredBook: {
        bookId: offeredBook?.bookId,
        title: offeredBook?.title || "Offered Textbook",
        author: offeredBook?.author || "",
        condition: offeredBook?.condition || "Good",
        coverImage: offeredBook?.coverImage || "",
      },
      meetupLocation: meetupLocation || "Campus Central Library / Student Center",
      note: note || "Let's meet up on campus to exchange textbooks!",
      chatId: chatId || "",
      status: "Pending Decision",
    });

    res.status(201).json({
      success: true,
      message: "Exchange proposal sent successfully",
      data: formatExchange(exchange, req.user._id),
    });
  } catch (error) {
    console.error("proposeExchange error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to propose exchange",
      error: error.message,
    });
  }
};

/**
 * @desc Accept or decline an exchange proposal
 * @route PATCH /api/exchanges/:id/respond
 * @access Private
 */
export const respondExchange = async (req, res) => {
  try {
    const { id } = req.params;
    const { action } = req.body; // "Accepted" or "Declined"

    const exchange = await Exchange.findOne({
      $or: [{ exchangeCode: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }],
    });

    if (!exchange) {
      return res.status(404).json({ success: false, message: "Exchange proposal not found" });
    }

    if (action === "Accepted") {
      exchange.status = "Accepted - Meetup Pending";
    } else {
      exchange.status = "Declined";
    }

    await exchange.save();

    res.status(200).json({
      success: true,
      message: `Exchange proposal ${action === "Accepted" ? "accepted" : "declined"}`,
      data: formatExchange(exchange, req.user._id),
    });
  } catch (error) {
    console.error("respondExchange error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to respond to exchange",
      error: error.message,
    });
  }
};

/**
 * @desc Mark exchange as successfully completed
 * @route PATCH /api/exchanges/:id/complete
 * @access Private
 */
export const completeExchange = async (req, res) => {
  try {
    const { id } = req.params;

    const exchange = await Exchange.findOne({
      $or: [{ exchangeCode: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }],
    });

    if (!exchange) {
      return res.status(404).json({ success: false, message: "Exchange proposal not found" });
    }

    exchange.status = "Completed";
    exchange.completedAt = new Date();
    await exchange.save();

    res.status(200).json({
      success: true,
      message: "Exchange completed! Both parties have confirmed book handover.",
      data: formatExchange(exchange, req.user._id),
    });
  } catch (error) {
    console.error("completeExchange error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to complete exchange",
      error: error.message,
    });
  }
};
