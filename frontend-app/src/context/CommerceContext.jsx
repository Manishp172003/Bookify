import React, { createContext, useContext, useState, useEffect } from "react";
import { io } from "socket.io-client";
import { chatService } from "../services/chatService";
import { isRealUserAvatar } from "../utils/avatarUtils";

const CommerceContext = createContext(null);

const INITIAL_COUPONS = [
  { code: "CAMPUS100", discount: 100, description: "₹100 off on orders above ₹500" },
  { code: "BOKIFY50", discount: 50, description: "₹50 off on your first order" },
  { code: "FREESHIP", discount: 60, description: "Free campus delivery credit (₹60 value)" }
];

const INITIAL_ADDRESSES = [
  {
    id: "addr_1",
    name: "Manish Pawar",
    phone: "+91 9876543210",
    type: "Campus / Hostel",
    campus: "Nagpur University Campus",
    hostelBlock: "Hostel Block A, Room 204",
    meetupSpot: "Central Library Entrance",
    street: "Hostel Block A, Room 204, Nagpur University Campus",
    city: "Nagpur",
    state: "Maharashtra",
    pincode: "440033",
    isDefault: true
  }
];

const INITIAL_CONVERSATIONS = [
  {
    id: "chat_1",
    active: true,
    requestStatus: "accepted",
    requesterId: "usr_me",
    seller: {
      id: "usr_aarav",
      name: "Aarav Sharma",
      avatar: null,
      online: true,
      verified: true,
      college: "IIT Bombay",
      responseTime: "< 10 min",
      rating: "4.9",
      reviewsCount: 28,
      memberSince: "Jan 2024",
      totalSales: 22,
      location: "Powai, Mumbai"
    },
    book: {
      id: 101,
      title: "Concepts of Physics (HC Verma Vol 1)",
      author: "H.C. Verma",
      price: 299,
      originalPrice: 450,
      condition: "Like New",
      image: "https://covers.openlibrary.org/b/isbn/9788177091878-L.jpg"
    },
    lastMessage: "Is ₹280 fine with you? I can hand it over at the campus library today.",
    lastMessageTimestamp: "10:30 AM",
    unreadCount: 2,
    messages: [
      {
        id: "m1",
        sender: "them",
        text: "Hey! Are you still interested in HC Verma Vol 1?",
        time: "10:25 AM",
        status: "read"
      },
      {
        id: "m2",
        sender: "me",
        text: "Yes! Is the condition good with no markings?",
        time: "10:28 AM",
        status: "read"
      },
      {
        id: "m3",
        sender: "them",
        text: "It is in pristine condition, no pen marks.",
        time: "10:29 AM",
        status: "delivered"
      },
      {
        id: "m4",
        sender: "them",
        text: "Is ₹280 fine with you? I can hand it over at the campus library today.",
        time: "10:30 AM",
        status: "delivered"
      }
    ]
  },
  {
    id: "chat_2",
    active: true,
    requestStatus: "accepted",
    requesterId: "usr_me",
    seller: {
      id: "usr_sneha",
      name: "Sneha Reddy",
      avatar: null,
      online: true,
      verified: true,
      college: "BITS Pilani",
      responseTime: "< 5 min",
      rating: "4.8",
      reviewsCount: 16,
      memberSince: "Mar 2024",
      totalSales: 14,
      location: "Hyderabad"
    },
    book: {
      id: 102,
      title: "Introduction to Algorithms (CLRS 3rd Ed)",
      author: "Thomas H. Cormen",
      price: 650,
      originalPrice: 1200,
      condition: "Good",
      image: "https://covers.openlibrary.org/b/isbn/9780262033848-L.jpg"
    },
    lastMessage: "Yes, I can ship it by this evening through campus speed post.",
    lastMessageTimestamp: "Yesterday",
    unreadCount: 1,
    messages: [
      {
        id: "m5",
        sender: "me",
        text: "Hi Sneha, when can you dispatch the Algorithms book?",
        time: "Yesterday 4:15 PM",
        status: "read"
      },
      {
        id: "m6",
        sender: "them",
        text: "Yes, I can ship it by this evening through campus speed post.",
        time: "Yesterday 4:20 PM",
        status: "delivered"
      }
    ]
  },
  {
    id: "chat_3",
    active: true,
    requestStatus: "pending",
    requesterId: "usr_vikram",
    seller: {
      id: "usr_vikram",
      name: "Vikram Malhotra",
      avatar: null,
      online: true,
      verified: true,
      college: "VNIT Nagpur",
      responseTime: "< 15 min",
      rating: "4.7",
      reviewsCount: 9,
      memberSince: "May 2024",
      totalSales: 8,
      location: "Nagpur, Maharashtra"
    },
    book: {
      id: 103,
      title: "Cracking the Coding Interview (6th Edition)",
      author: "Gayle Laakmann McDowell",
      price: 499,
      originalPrice: 999,
      condition: "Like New",
      image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=300"
    },
    lastMessage: "Hi! I want to purchase this book for campus meetup. Can we finalize the deal?",
    lastMessageTimestamp: "11:15 AM",
    unreadCount: 1,
    messages: [
      {
        id: "m7",
        sender: "them",
        text: "Hi! I want to purchase this book for campus meetup. Can we finalize the deal?",
        time: "11:15 AM",
        status: "delivered"
      }
    ]
  }
];

const INITIAL_ORDERS = [
  {
    id: "BK77109230",
    isSellerOrder: true,
    orderDateFormatted: "Today, 04:30 PM",
    expectedDelivery: "28 Sep 2026",
    status: "placed",
    statusLabel: "Awaiting Seller Confirmation",
    escrowStatus: "held_in_escrow",
    paymentMethod: "Razorpay (UPI)",
    transactionId: "pay_LV884029193",
    subtotal: 299,
    deliveryFee: 40,
    platformFee: 15,
    discount: 0,
    total: 354,
    buyer: {
      id: "usr_rohan",
      name: "Rohan Verma",
      phone: "+91 98765 88990",
      hostelBlock: "Hostel Block B, Room 108",
      campus: "IIT Bombay Campus",
      meetupSpot: "Central Library Ground Floor"
    },
    address: {
      name: "Rohan Verma",
      phone: "+91 98765 88990",
      hostelBlock: "Hostel Block B, Room 108",
      campus: "IIT Bombay Campus",
      meetupSpot: "Central Library Ground Floor",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400076"
    },
    courier: {
      name: "Campus Delivery Network",
      trackingNumber: "CN-718290-IN",
      supportPhone: "+91 9876543210"
    },
    items: [
      {
        id: 101,
        title: "Concepts of Physics (HC Verma Vol 1)",
        author: "H.C. Verma",
        price: 299,
        condition: "Like New",
        image: "https://covers.openlibrary.org/b/isbn/9788177091878-L.jpg",
        quantity: 1
      }
    ],
    timeline: [
      { stage: "placed", title: "Order Placed", date: "Today", description: "Payment verified & ₹354 held safely in escrow.", completed: true, active: false },
      { stage: "confirmed", title: "Seller Confirmed", date: "Pending", description: "Waiting for seller to accept and package the book.", completed: false, active: true },
      { stage: "shipped", title: "Shipped", date: "Pending", description: "Handed over to college logistics courier.", completed: false, active: false },
      { stage: "out_for_delivery", title: "Out for Delivery", date: "Pending", description: "Campus courier heading to delivery meetup spot.", completed: false, active: false },
      { stage: "delivered", title: "Delivered", date: "Pending", description: "Verify package contents & release escrow.", completed: false, active: false }
    ]
  },
  {
    id: "BK82901840",
    isSellerOrder: false,
    orderDateFormatted: "28 Aug 2026",
    expectedDelivery: "01 Sep 2026",
    status: "shipped",
    statusLabel: "In Transit via Campus Courier",
    escrowStatus: "held_in_escrow",
    paymentMethod: "Razorpay (UPI)",
    transactionId: "pay_HP820DFKSLAD9",
    subtotal: 450,
    deliveryFee: 40,
    platformFee: 15,
    discount: 0,
    total: 505,
    address: INITIAL_ADDRESSES[0],
    courier: {
      name: "BlueDart Campus Express",
      trackingNumber: "BD-90218390-IN",
      supportPhone: "+91 9876543210"
    },
    items: [
      {
        id: 2,
        title: "To Kill a Mockingbird",
        author: "Harper Lee",
        price: 450,
        condition: "Good",
        image: "https://covers.openlibrary.org/b/isbn/9780061120084-L.jpg",
        seller: { name: "Priya Patel" },
        quantity: 1
      }
    ],
    timeline: [
      { stage: "placed", title: "Order Placed", date: "28 Aug", description: "Payment verified & held in escrow.", completed: true, active: false },
      { stage: "confirmed", title: "Seller Confirmed", date: "28 Aug", description: "Seller accepted and packaged the book.", completed: true, active: false },
      { stage: "shipped", title: "Shipped", date: "29 Aug", description: "Handed over to college logistics.", completed: true, active: true },
      { stage: "out_for_delivery", title: "Out for Delivery", date: "31 Aug", description: "Campus courier is on their way.", completed: false, active: false },
      { stage: "delivered", title: "Delivered", date: "01 Sep", description: "Verify package contents within 48h.", completed: false, active: false }
    ]
  }
];

export function CommerceProvider({ children }) {
  // Toast notifications
  const [toast, setToast] = useState(null);
  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Cart State
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem("bookify_cart");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("bookify_cart", JSON.stringify(cartItems));
  }, [cartItems]);

  // Addresses State
  const [addresses, setAddresses] = useState(() => {
    const saved = localStorage.getItem("bookify_addresses");
    return saved ? JSON.parse(saved) : INITIAL_ADDRESSES;
  });

  useEffect(() => {
    localStorage.setItem("bookify_addresses", JSON.stringify(addresses));
  }, [addresses]);

  const [selectedAddressId, setSelectedAddressId] = useState(
    addresses.length > 0 ? addresses[0].id : null
  );

  const selectedAddress = addresses.find((addr) => addr.id === selectedAddressId);

  // Coupons State
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [availableCoupons] = useState(INITIAL_COUPONS);

  // Shipping Method
  const [shippingMethod, setShippingMethod] = useState("standard");

  // Orders State
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem("bookify_orders");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((o) => {
            if (o.isSellerOrder && (o.buyer?.name === "Aarav Sharma" || o.buyer?.name?.includes("Aarav"))) {
              return {
                ...o,
                buyer: {
                  ...o.buyer,
                  id: "usr_rohan",
                  name: "Rohan Verma",
                  phone: "+91 98765 88990",
                  meetupSpot: "Central Library Ground Floor",
                  hostelBlock: "Hostel Block B, Room 108"
                },
                address: {
                  ...o.address,
                  name: "Rohan Verma",
                  phone: "+91 98765 88990",
                  meetupSpot: "Central Library Ground Floor"
                }
              };
            }
            return o;
          });
        }
      } catch {}
    }
    return INITIAL_ORDERS;
  });

  useEffect(() => {
    localStorage.setItem("bookify_orders", JSON.stringify(orders));
  }, [orders]);

  // Conversations State
  const [conversations, setConversations] = useState(() => {
    const saved = localStorage.getItem("bookify_conversations");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((c) => ({
            ...c,
            seller: {
              ...c.seller,
              avatar: isRealUserAvatar(c.seller?.avatar) ? c.seller.avatar : null,
            },
          }));
        }
      } catch {}
    }
    return INITIAL_CONVERSATIONS;
  });
  const [activeConversationId, setActiveConversationId] = useState("chat_1");
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    localStorage.setItem("bookify_conversations", JSON.stringify(conversations));
  }, [conversations]);

  // Connect to live Socket.io Backend
  useEffect(() => {
    let savedUser = null;
    try {
      savedUser = JSON.parse(localStorage.getItem("bookify_user"));
    } catch {}
    const token = localStorage.getItem("token");

    const newSocket = io("http://localhost:5000", {
      auth: {
        token: token || "",
        user: savedUser || null,
      },
      transports: ["websocket", "polling"],
      reconnectionAttempts: 5,
    });

    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("[Bookify Socket] Connected to backend on port 5000:", newSocket.id);
      // Join default demo chat rooms
      newSocket.emit("joinChat", "chat_1");
      newSocket.emit("joinChat", "chat_2");
    });

    newSocket.on("newChatMessage", (data) => {
      if (!data || !data.conversationId) return;

      let currentUser = null;
      try {
        currentUser = JSON.parse(localStorage.getItem("bookify_user"));
      } catch {}

      const isMe =
        currentUser &&
        (currentUser.email === data.senderEmail ||
          currentUser.fullName === data.senderName ||
          currentUser.id === data.senderId);

      const isCurrentlyViewing =
        window.location.pathname.includes(data.conversationId) ||
        (window.location.pathname.startsWith("/chat") && activeConversationId === data.conversationId);

      const incomingMsg = {
        id: data.id || `msg_live_${Date.now()}`,
        sender: isMe ? "me" : "them",
        text: data.text,
        time: data.time || new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
        status: isMe || isCurrentlyViewing ? "read" : "delivered",
      };

      setConversations((prev) => {
        const index = prev.findIndex((c) => c.id === data.conversationId);
        if (index !== -1) {
          const target = prev[index];
          // Avoid duplicate message if already added by sender
          const exists = target.messages.some(
            (m) =>
              m.id === incomingMsg.id ||
              (m.text === incomingMsg.text && m.time === incomingMsg.time && m.sender === incomingMsg.sender)
          );
          if (exists) return prev;

          const updatedChat = {
            ...target,
            requestStatus: data.requestStatus || target.requestStatus || "accepted",
            requesterId: data.requesterId || target.requesterId,
            lastMessage: incomingMsg.text,
            lastMessageTimestamp: incomingMsg.time,
            unreadCount: isMe || isCurrentlyViewing ? 0 : (target.unreadCount || 0) + 1,
            messages: [...target.messages, incomingMsg],
          };
          const next = [...prev];
          next[index] = updatedChat;
          return next;
        }

        // If conversation does not exist yet on this user's screen, dynamically create thread
        const newThread = {
          id: data.conversationId,
          active: true,
          requestStatus: data.requestStatus || "pending",
          requesterId: data.requesterId || (isMe ? (currentUser?.id || "usr_me") : (data.senderId || "peer_user")),
          seller: {
            id: isMe ? (data.recipientId || "peer_user") : (data.senderId || "peer_user"),
            name: isMe ? "Aarav Sharma" : (data.senderName || "Student Peer"),
            avatar: null,
            online: true,
            verified: true,
            college: "Campus College",
          },
          book: data.book || {
            id: 1001,
            title: "Concepts of Physics (HC Verma Vol 1)",
            price: 299,
            condition: "Like New",
            image: "https://covers.openlibrary.org/b/isbn/9788177091878-L.jpg",
          },
          lastMessage: incomingMsg.text,
          lastMessageTimestamp: incomingMsg.time,
          unreadCount: isMe || isCurrentlyViewing ? 0 : 1,
          messages: [incomingMsg],
        };
        return [newThread, ...prev];
      });

      if (!isMe) {
        showToast(`New message from ${data.senderName || "Student"}: "${data.text.slice(0, 30)}..."`, "info");
      }
    });

    newSocket.on("chatRequestAccepted", (data) => {
      setConversations((prev) =>
        prev.map((c) =>
          c.id === data.conversationId
            ? { ...c, requestStatus: "accepted" }
            : c
        )
      );
      showToast("Chat request accepted! You can now chat in real-time.", "success");
    });

    newSocket.on("chatRequestDeclined", (data) => {
      setConversations((prev) =>
        prev.map((c) =>
          c.id === data.conversationId
            ? { ...c, requestStatus: "rejected" }
            : c
        )
      );
      showToast("Chat request was declined.", "info");
    });

    // Real-Time Dynamic Order Tracking & Seller Status Socket Listener
    newSocket.on("orderStatusUpdated", (data) => {
      if (!data) return;
      const targetId = data._id || data.id || data.razorpayOrderId;
      console.log("[Bookify Socket] Received live orderStatusUpdated:", targetId, data.status);

      const rawStatus = (data.status || "").toLowerCase();
      const mappedStatus =
        rawStatus === "confirmed" || rawStatus === "processing"
          ? "confirmed"
          : rawStatus === "out for delivery"
          ? "out_for_delivery"
          : rawStatus;

      setOrders((prev) =>
        prev.map((o) => {
          if (o.id === targetId || o._id === targetId || o.id === data._id || o._id === data.id) {
            return {
              ...o,
              status: mappedStatus,
              statusLabel:
                mappedStatus === "confirmed"
                  ? "Seller Confirmed & Packaging"
                  : mappedStatus === "shipped"
                  ? "In Transit via Campus Courier"
                  : mappedStatus === "out_for_delivery"
                  ? "Out for Delivery"
                  : mappedStatus === "delivered"
                  ? "Delivered & Escrow Released"
                  : data.status,
              courier: data.courier || o.courier,
              escrowStatus: data.escrowStatus === "Released" ? "released_to_seller" : o.escrowStatus,
              timeline: data.timeline
                ? data.timeline.map((t) => ({
                    stage: t.stage.toLowerCase().replace(/ /g, "_"),
                    title: t.title,
                    date: t.date
                      ? new Date(t.date).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                        })
                      : "Today",
                    description: t.description,
                    completed: t.completed,
                    active: t.active,
                  }))
                : o.timeline,
            };
          }
          return o;
        })
      );

      // Dispatch global window event so any open tracking or dashboard views update instantly
      window.dispatchEvent(
        new CustomEvent("bookify_order_updated", {
          detail: { ...data, mappedStatus },
        })
      );

      showToast(`Order status updated: ${data.status} 🚀`, "info");
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  // Automatically join active conversation room on Socket.io and fetch history from MongoDB
  useEffect(() => {
    if (socket && activeConversationId) {
      socket.emit("joinChat", activeConversationId);
    }

    if (!activeConversationId) return;

    let isMounted = true;
    chatService.getHistory(activeConversationId).then((dbMessages) => {
      if (!isMounted || !Array.isArray(dbMessages) || dbMessages.length === 0) return;

      let currentUser = null;
      try {
        currentUser = JSON.parse(localStorage.getItem("bookify_user"));
      } catch {}

      const formatted = dbMessages.map((m) => {
        const isMe =
          currentUser &&
          (currentUser.email === m.senderEmail ||
            currentUser.fullName === m.senderName ||
            currentUser.id === m.senderId);

        return {
          id: m._id || m.id,
          sender: isMe ? "me" : "them",
          text: m.text,
          time: m.time,
          status: m.status || "delivered",
        };
      });

      setConversations((prev) => {
        return prev.map((c) => {
          if (c.id === activeConversationId) {
            const msgMap = new Map();
            (c.messages || []).forEach((msg) => msgMap.set(msg.id || `${msg.sender}_${msg.text}`, msg));
            formatted.forEach((msg) => msgMap.set(msg.id || `${msg.sender}_${msg.text}`, msg));
            const merged = Array.from(msgMap.values());
            const lastMsg = merged[merged.length - 1];

            return {
              ...c,
              lastMessage: lastMsg ? lastMsg.text : c.lastMessage,
              lastMessageTimestamp: lastMsg ? lastMsg.time : c.lastMessageTimestamp,
              messages: merged,
            };
          }
          return c;
        });
      });
    });

    return () => {
      isMounted = false;
    };
  }, [socket, activeConversationId]);

  const activeConversation = conversations.find(
    (c) => c.id === activeConversationId
  );

  // Wishlist State
  const [wishlistItems, setWishlistItems] = useState(() => {
    const saved = localStorage.getItem("bookify_wishlist");
    const INITIAL_WISHLIST = [
      {
        id: 1,
        title: "Introduction to Algorithms, 3rd Edition",
        author: "Thomas H. Cormen",
        price: "₹650",
        condition: "Very Good",
        alertActive: true,
        coverImage: "https://covers.openlibrary.org/b/isbn/9780062315007-L.jpg"
      },
      {
        id: 2,
        title: "Concepts of Physics Vol 1",
        author: "H.C. Verma",
        price: "₹350",
        condition: "Good",
        alertActive: false,
        coverImage: "https://covers.openlibrary.org/b/isbn/9780061120084-L.jpg"
      }
    ];
    return saved ? JSON.parse(saved) : INITIAL_WISHLIST;
  });

  useEffect(() => {
    localStorage.setItem("bookify_wishlist", JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  const toggleWishlist = (book) => {
    const isWish = wishlistItems.some((item) => item.id === book.id);
    if (isWish) {
      setWishlistItems((prev) => prev.filter((item) => item.id !== book.id));
      showToast("Removed from wishlist.", "info");
    } else {
      const newItem = {
        id: book.id,
        title: book.title,
        author: book.author,
        price: book.mode === "donate" ? "Free" : `₹${book.askingPrice || book.price}`,
        condition: book.condition?.replace(/_/g, " ") || "Good",
        alertActive: false,
        coverImage: book.coverImage || (book.photos && book.photos[0]) || ""
      };
      setWishlistItems((prev) => [...prev, newItem]);
      showToast("Added to wishlist!");
    }
  };

  const toggleWishlistAlert = (id) => {
    setWishlistItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, alertActive: !item.alertActive } : item
      )
    );
  };

  const isBookWishlisted = (id) => {
    return wishlistItems.some((item) => item.id === id);
  };

  // Cart operations
  const addToCart = (book, quantity = 1) => {
    setCartItems((prev) => {
      const exists = prev.find((item) => item.id === book.id);
      if (exists) {
        return prev.map((item) =>
          item.id === book.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [
        ...prev,
        {
          id: book.id,
          title: book.title,
          author: book.author,
          price: book.askingPrice || book.price,
          condition: book.condition?.replace(/_/g, " ") || "Good",
          image: book.coverImage || book.image,
          seller: book.seller || { name: "Campus Seller" },
          quantity
        }
      ];
    });
    showToast(`"${book.title}" added to cart!`);
  };

  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
    showToast("Item removed from cart.", "info");
  };

  const updateQuantity = (id, quantity) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const moveToWishlist = (id) => {
    const item = cartItems.find((i) => i.id === id);
    if (!item) return;

    // Add to localStorage wishlist
    const currentList = JSON.parse(localStorage.getItem("bookify_wishlist") || "[]");
    if (!currentList.some((w) => w.id === id)) {
      const wishItem = {
        id: item.id,
        title: item.title,
        author: item.author,
        price: `₹${item.price}`,
        condition: item.condition,
        alertActive: false,
        coverImage: item.image
      };
      localStorage.setItem("bookify_wishlist", JSON.stringify([...currentList, wishItem]));
    }
    
    // Remove from cart
    removeFromCart(id);
    showToast("Moved item to wishlist.", "success");
  };

  const clearCart = () => {
    setCartItems([]);
    showToast("Shopping cart cleared.", "info");
  };

  // Coupons
  const applyCoupon = async (code) => {
    if (!code || !code.trim()) return;
    const cleanCode = code.trim().toUpperCase();

    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
      const res = await fetch(`${apiUrl}/author/coupons/validate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: cleanCode }),
      });
      const data = await res.json();
      if (res.ok && data.success && data.data) {
        const c = data.data;
        if (c.minPurchase > 0 && subtotal < c.minPurchase) {
          showToast(`Minimum order of ₹${c.minPurchase} required for this coupon.`, "error");
          return;
        }

        const isPercentage = (c.discountType || "").toLowerCase() === "percentage";
        const calculatedDiscount = isPercentage
          ? Math.round((subtotal * c.discountValue) / 100)
          : Math.min(subtotal, c.discountValue);

        setAppliedCoupon({
          code: c.code,
          discount: calculatedDiscount,
          discountType: isPercentage ? "percentage" : "flat",
          discountValue: c.discountValue,
          minPurchase: c.minPurchase || 0,
        });
        showToast(`Coupon "${c.code}" applied! Saved ₹${calculatedDiscount}`);
        return;
      } else {
        const fallback = availableCoupons.find(
          (c) => c.code.toUpperCase() === cleanCode
        );
        if (fallback) {
          setAppliedCoupon(fallback);
          showToast(`Coupon "${fallback.code}" applied!`);
          return;
        }
        showToast(data.message || "Invalid coupon code.", "error");
      }
    } catch (err) {
      const fallback = availableCoupons.find(
        (c) => c.code.toUpperCase() === cleanCode
      );
      if (fallback) {
        setAppliedCoupon(fallback);
        showToast(`Coupon "${fallback.code}" applied!`);
        return;
      }
      showToast("Could not validate coupon.", "error");
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast("Coupon removed.", "info");
  };

  // Addresses
  const selectAddress = (id) => {
    setSelectedAddressId(id);
  };

  const addAddress = (address) => {
    const newAddress = {
      ...address,
      id: `addr_${Date.now()}`
    };
    setAddresses((prev) => [...prev, newAddress]);
    setSelectedAddressId(newAddress.id);
    showToast("New delivery address added!");
  };

  // Checkout order generation
  const createOrder = ({ paymentMethod, transactionId }) => {
    const isExpress = shippingMethod === "express";
    const deliveryDays = isExpress ? 2 : 4;
    const shippingMethodLabel = isExpress
      ? "Express Campus Priority (1-2 Days)"
      : shippingMethod === "pickup"
      ? "Self Campus Pickup (Same Day)"
      : "Standard Campus Delivery (3-5 Days)";

    const newOrder = {
      id: `BK${Math.floor(10000000 + Math.random() * 90000000)}`,
      orderDateFormatted: new Date().toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
      }),
      expectedDelivery: new Date(Date.now() + deliveryDays * 24 * 60 * 60 * 1000).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
      }),
      status: "placed",
      statusLabel: "Payment Held in Escrow",
      escrowStatus: "held_in_escrow",
      paymentMethod,
      shippingMethod,
      shippingMethodLabel,
      transactionId,
      subtotal,
      deliveryFee,
      platformFee,
      discount,
      total,
      address: selectedAddress,
      isSellerOrder: true,
      seller: cartItems[0]?.seller || { name: "Aarav Sharma", id: "usr_aarav" },
      buyer: {
        name: selectedAddress?.name || "Student Buyer",
        phone: selectedAddress?.phone || "+91 98765 43210",
        meetupSpot: selectedAddress?.meetupSpot || selectedAddress?.campus || "Campus Central Library Entrance",
        hostelBlock: selectedAddress?.hostelBlock || selectedAddress?.street || "Hostel Block A, Room 204"
      },
      courier: {
        name: isExpress ? "Campus Express Air / Courier" : "Campus Delivery Network",
        trackingNumber: `CN-${Math.floor(100000 + Math.random() * 900000)}-IN`,
        supportPhone: "+91 9876543210"
      },
      items: [...cartItems],
      timeline: [
        { stage: "placed", title: "Order Placed", date: "Today", description: "Payment verified & held in escrow.", completed: true, active: true },
        { stage: "confirmed", title: "Seller Confirmed", date: "Pending", description: "Seller accepted and packaging the book.", completed: false, active: false },
        { stage: "shipped", title: "Shipped", date: "Pending", description: "Handed over to college logistics.", completed: false, active: false },
        { stage: "out_for_delivery", title: "Out for Delivery", date: "Pending", description: "Campus courier is on their way.", completed: false, active: false },
        { stage: "delivered", title: "Delivered", date: "Pending", description: "Verify package contents within 48h.", completed: false, active: false }
      ]
    };

    setOrders((prev) => [newOrder, ...prev]);
    setCartItems([]);
    setAppliedCoupon(null);
    return newOrder;
  };

  const getOrderById = (id) => orders.find((o) => o.id === id);

  const releaseEscrowPayment = (orderId) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id === orderId) {
          const updatedTimeline = order.timeline.map((step) => ({
            ...step,
            completed: true,
            active: step.stage === "delivered" ? false : step.active
          }));
          return {
            ...order,
            status: "delivered",
            escrowStatus: "released_to_seller",
            statusLabel: "Delivered & Payment Released",
            timeline: updatedTimeline
          };
        }
        return order;
      })
    );
    showToast("Payment released to seller! Transaction closed.");
  };

  const updateOrderStatus = async (orderId, newStatus, courierData = null) => {
    // 1. Send update to backend API if reachable
    try {
      let token = localStorage.getItem("token") || localStorage.getItem("bookify_token");
      if (!token) {
        try {
          const user = JSON.parse(localStorage.getItem("bookify_user") || "{}");
          token = user.token;
        } catch {}
      }

      await fetch(`http://localhost:5000/api/orders/${orderId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          status: newStatus,
          courier: courierData
        })
      });
    } catch (apiErr) {
      console.warn("[CommerceContext] Backend status update notice:", apiErr.message);
    }

    // 2. Synchronize local state optimistically
    const rawStatus = (newStatus || "").toLowerCase();
    const mappedStatus =
      rawStatus === "confirmed" || rawStatus === "processing"
        ? "confirmed"
        : rawStatus === "out for delivery"
        ? "out_for_delivery"
        : rawStatus;

    const isDeliv = mappedStatus === "delivered";
    const isShipped = mappedStatus === "shipped";
    const isConfirmed = mappedStatus === "confirmed";
    const isOutForDelivery = mappedStatus === "out_for_delivery";

    const stageOrder = ["placed", "confirmed", "shipped", "out_for_delivery", "delivered"];
    const targetIdx = stageOrder.indexOf(mappedStatus);

    let updatedTargetOrder = null;

    setOrders((prev) =>
      prev.map((order) => {
        if (order.id === orderId || order._id === orderId) {
          const updatedTimeline = (order.timeline || []).map((step) => {
            const stepIdx = stageOrder.indexOf(step.stage);
            if (stepIdx < targetIdx) {
              return { ...step, completed: true, active: false };
            } else if (stepIdx === targetIdx) {
              return { ...step, completed: true, active: !isDeliv, date: "Today" };
            } else {
              return { ...step, completed: false, active: false };
            }
          });

          const courierObj = courierData
            ? {
                name: courierData.name || order.courier?.name || "Campus Express Delivery",
                trackingNumber:
                  courierData.trackingNumber ||
                  order.courier?.trackingNumber ||
                  `AWB-${Math.floor(100000 + Math.random() * 900000)}`,
                supportPhone: order.courier?.supportPhone || "+91 9876543210"
              }
            : order.courier;

          const updated = {
            ...order,
            status: mappedStatus,
            statusLabel:
              isConfirmed
                ? "Seller Confirmed & Packaging"
                : isShipped
                ? "In Transit via Campus Courier"
                : isOutForDelivery
                ? "Out for Delivery"
                : isDeliv
                ? "Delivered & Escrow Released"
                : newStatus,
            escrowStatus: isDeliv ? "released_to_seller" : order.escrowStatus,
            courier: courierObj,
            timeline: updatedTimeline
          };
          updatedTargetOrder = updated;
          return updated;
        }
        return order;
      })
    );

    // 3. Emit via socket and window event so tracking and active screens refresh instantly
    if (socket && socket.connected) {
      socket.emit("sendMessage", {
        orderId,
        message: `Status updated to ${newStatus}`
      });
    }

    window.dispatchEvent(
      new CustomEvent("bookify_order_updated", {
        detail: updatedTargetOrder || { id: orderId, status: newStatus, courier: courierData }
      })
    );

    showToast(`Order status updated to: ${newStatus}`, "success");
    return updatedTargetOrder;
  };

  // Chats direct messaging
  const startOrGetConversation = (seller, book, customInitialMessage = null) => {
    // Generate deterministic ID so both buyer and seller join the identical socket room
    const safeSellerId = (seller?.id || seller?.name || "seller").toString().replace(/[^a-zA-Z0-9_]/g, "_");
    const bookId = book?.id || "general";
    const newChatId = `chat_${safeSellerId}_${bookId}`;

    const existing = conversations.find(
      (c) => c.id === newChatId || (c.seller?.id === seller.id && c.book?.id === book.id)
    );

    let savedUser = null;
    try {
      savedUser = JSON.parse(localStorage.getItem("bookify_user"));
    } catch {}

    const myUserId = savedUser?.id || "usr_me";

    if (existing) {
      if (customInitialMessage) {
        const newMsg = {
          id: `msg_custom_${Date.now()}`,
          sender: "me",
          text: customInitialMessage,
          time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
          status: "sent"
        };
        existing.messages.push(newMsg);

        if (socket && socket.connected) {
          socket.emit("sendChatMessage", {
            conversationId: existing.id,
            text: customInitialMessage,
            senderName: savedUser?.fullName || "Student Buyer",
            senderEmail: savedUser?.email || "buyer@bookify.com",
            senderId: myUserId,
            recipientId: seller.id,
            book: book,
            time: newMsg.time,
            requestStatus: existing.requestStatus || "accepted",
            requesterId: existing.requesterId || myUserId
          });
        }
      }
      selectConversation(existing.id);
      return existing.id;
    }

    const initialMsgText = customInitialMessage || `Hi! I am interested in your book "${book.title}". Is it still available?`;
    const newChat = {
      id: newChatId,
      active: true,
      requestStatus: "pending",
      requesterId: myUserId,
      seller: {
        id: seller.id,
        name: seller.name,
        avatar: isRealUserAvatar(seller.avatar) ? seller.avatar : null,
        online: true,
        verified: seller.isVerified || false,
        college: seller.college || "Campus College"
      },
      book: {
        id: book.id,
        title: book.title,
        author: book.author,
        price: book.askingPrice || book.price,
        condition: book.condition?.replace(/_/g, " ") || "Good",
        image: book.coverImage || (book.photos && book.photos[0]) || ""
      },
      messages: [
        {
          id: `msg_init_${Date.now()}`,
          sender: "me",
          text: initialMsgText,
          time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
          status: "sent"
        }
      ]
    };

    setConversations((prev) => [newChat, ...prev]);
    setActiveConversationId(newChatId);

    const initPayload = {
      id: newChat.messages[0].id,
      conversationId: newChatId,
      text: initialMsgText,
      senderName: savedUser?.fullName || "Student Buyer",
      senderEmail: savedUser?.email || "buyer@bookify.com",
      senderId: myUserId,
      recipientId: seller.id,
      recipientName: seller.name,
      book: newChat.book,
      time: newChat.messages[0].time,
      requestStatus: "pending",
      requesterId: myUserId
    };

    chatService.sendMessage(initPayload);

    if (socket && socket.connected) {
      socket.emit("joinChat", newChatId);
      socket.emit("sendChatMessage", initPayload);
    }

    return newChatId;
  };

  const acceptChatRequest = async (conversationId) => {
    try {
      await chatService.acceptRequest(conversationId);
      setConversations((prev) =>
        prev.map((c) =>
          c.id === conversationId ? { ...c, requestStatus: "accepted" } : c
        )
      );
      if (socket && socket.connected) {
        socket.emit("chatRequestAccepted", { conversationId });
      }
      showToast("Chat request accepted! You can now chat in real-time.", "success");
    } catch (err) {
      console.error("Failed to accept chat request:", err);
      setConversations((prev) =>
        prev.map((c) =>
          c.id === conversationId ? { ...c, requestStatus: "accepted" } : c
        )
      );
      showToast("Chat request accepted!", "success");
    }
  };

  const declineChatRequest = async (conversationId) => {
    try {
      await chatService.declineRequest(conversationId);
      setConversations((prev) =>
        prev.map((c) =>
          c.id === conversationId ? { ...c, requestStatus: "rejected" } : c
        )
      );
      if (socket && socket.connected) {
        socket.emit("chatRequestDeclined", { conversationId });
      }
      showToast("Chat request declined.", "info");
    } catch (err) {
      console.error("Failed to decline chat request:", err);
      setConversations((prev) =>
        prev.map((c) =>
          c.id === conversationId ? { ...c, requestStatus: "rejected" } : c
        )
      );
      showToast("Chat request declined.", "info");
    }
  };

  const selectConversation = (id) => {
    setActiveConversationId(id);
    if (socket && socket.connected) {
      socket.emit("joinChat", id);
    }

    let savedUser = null;
    try {
      savedUser = JSON.parse(localStorage.getItem("bookify_user"));
    } catch {}

    chatService.markRead(id, savedUser?.id || "usr_me");

    setConversations((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              unreadCount: 0,
              messages: (c.messages || []).map((m) => ({ ...m, status: "read" })),
            }
          : c
      )
    );
  };

  const sendMessage = (conversationId, text) => {
    if (!text.trim()) return;

    let savedUser = null;
    try {
      savedUser = JSON.parse(localStorage.getItem("bookify_user"));
    } catch {}

    const conv = conversations.find((c) => c.id === conversationId);

    const newMessage = {
      id: `msg_${Date.now()}`,
      sender: "me",
      text: text.trim(),
      time: new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit"
      }),
      status: "sent"
    };

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === conversationId) {
          return {
            ...c,
            lastMessage: text.trim(),
            lastMessageTimestamp: newMessage.time,
            messages: [...c.messages, newMessage]
          };
        }
        return c;
      })
    );

    const payload = {
      id: newMessage.id,
      conversationId,
      text: text.trim(),
      senderName: savedUser?.fullName || "Student",
      senderEmail: savedUser?.email || "student@bookify.com",
      senderId: savedUser?.id || "usr_me",
      senderAvatar: savedUser?.avatar || null,
      recipientId: conv?.seller?.id || null,
      recipientName: conv?.seller?.name || "Peer User",
      book: conv?.book || null,
      time: newMessage.time,
      requestStatus: conv?.requestStatus || "accepted",
      requesterId: conv?.requesterId || null
    };

    // 1. Persist directly to MongoDB via REST API
    chatService.sendMessage(payload);

    // 2. Emit live message over Socket.io for immediate real-time sync
    if (socket && socket.connected) {
      socket.emit("sendChatMessage", payload);
    }
  };

  // Unread Messages Calculation
  const unreadMessagesCount = conversations.reduce((acc, conv) => {
    if (typeof conv.unreadCount === "number") {
      return acc + conv.unreadCount;
    }
    const unreadMsgs = (conv.messages || []).filter(
      (m) => m.sender !== "me" && m.status !== "read"
    ).length;
    return acc + unreadMsgs;
  }, 0);

  // Cart Pricing calculations
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const deliveryFee =
    cartItems.length === 0
      ? 0
      : shippingMethod === "express"
      ? 120
      : shippingMethod === "pickup"
      ? 0
      : subtotal >= 999
      ? 0
      : 60;
  const discount = appliedCoupon
    ? appliedCoupon.discountType === "percentage"
      ? Math.round((subtotal * appliedCoupon.discountValue) / 100)
      : (appliedCoupon.discount !== undefined ? appliedCoupon.discount : appliedCoupon.discountValue || 0)
    : 0;
  const total = Math.max(0, subtotal + deliveryFee + platformFee - discount);

  return (
    <CommerceContext.Provider
      value={{
        cartItems,
        cartCount,
        removeFromCart,
        updateQuantity,
        moveToWishlist,
        clearCart,
        subtotal,
        deliveryFee,
        platformFee,
        discount,
        total,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        availableCoupons,
        addToCart,
        addresses,
        selectedAddressId,
        selectedAddress,
        selectAddress,
        addAddress,
        shippingMethod,
        setShippingMethod,
        createOrder,
        orders,
        setOrders,
        getOrderById,
        updateOrderStatus,
        releaseEscrowPayment,
        conversations,
        activeConversation,
        activeConversationId,
        selectConversation,
        startOrGetConversation,
        sendMessage,
        acceptChatRequest,
        declineChatRequest,
        unreadMessagesCount,
        showToast,
        wishlistItems,
        toggleWishlist,
        toggleWishlistAlert,
        isBookWishlisted,
        socket
      }}
    >
      {children}
      {/* Toast Alert Box */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-55 flex items-center gap-2 rounded-2xl px-5 py-3.5 shadow-2xl text-xs font-bold text-white transition-all duration-300 transform translate-y-0 animate-fade-in-up border ${
            toast.type === "error"
              ? "bg-red-500 border-red-400"
              : toast.type === "warning"
              ? "bg-amber-500 border-amber-400"
              : "bg-[#6C4BF4] border-[#8B6FF5]"
          }`}
        >
          <span>{toast.message}</span>
        </div>
      )}
    </CommerceContext.Provider>
  );
}

export function useCommerce() {
  const context = useContext(CommerceContext);
  if (!context) {
    throw new Error("useCommerce must be used within a CommerceProvider");
  }
  return context;
}
