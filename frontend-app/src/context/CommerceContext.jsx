import React, { createContext, useContext, useState, useEffect } from "react";
import { io } from "socket.io-client";

const CommerceContext = createContext(null);

const INITIAL_COUPONS = [
  { code: "CAMPUS100", discount: 100, description: "₹100 off on orders above ₹500" },
  { code: "BOKIFY50", discount: 50, description: "₹50 off on your first order" },
  { code: "FREESHIP", discount: 40, description: "Free campus delivery credit" }
];

const INITIAL_ADDRESSES = [
  {
    id: "addr_1",
    name: "Manish Pawar",
    phone: "+91 9876543210",
    campus: "Nagpur University Campus",
    hostelBlock: "Hostel Block A, Room 204",
    meetupSpot: "Central Library Entrance",
    isDefault: true
  }
];

const INITIAL_CONVERSATIONS = [
  {
    id: "chat_1",
    active: true,
    seller: {
      id: "usr_aarav",
      name: "Aarav Sharma",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop",
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
    seller: {
      id: "usr_sneha",
      name: "Sneha Reddy",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
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
  }
];

const INITIAL_ORDERS = [
  {
    id: "BK82901840",
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
      trackingNumber: "BD-90218390-IN"
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
  const [shippingMethod, setShippingMethod] = useState("delivery");

  // Orders State
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem("bookify_orders");
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
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
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
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
          seller: {
            id: isMe ? (data.recipientId || "peer_user") : (data.senderId || "peer_user"),
            name: isMe ? "Aarav Sharma" : (data.senderName || "Student Peer"),
            avatar: isMe
              ? "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop"
              : "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
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

    return () => {
      newSocket.disconnect();
    };
  }, []);

  // Automatically join active conversation room on Socket.io
  useEffect(() => {
    if (socket && activeConversationId) {
      socket.emit("joinChat", activeConversationId);
    }
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
  const applyCoupon = (code) => {
    const coupon = availableCoupons.find(
      (c) => c.code.toUpperCase() === code.toUpperCase()
    );
    if (!coupon) {
      showToast("Invalid coupon code.", "error");
      return;
    }
    setAppliedCoupon(coupon);
    showToast(`Coupon "${coupon.code}" applied!`);
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
    const newOrder = {
      id: `BK${Math.floor(10000000 + Math.random() * 90000000)}`,
      orderDateFormatted: new Date().toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
      }),
      expectedDelivery: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
      }),
      status: "placed",
      statusLabel: "Payment Held in Escrow",
      escrowStatus: "held_in_escrow",
      paymentMethod,
      transactionId,
      subtotal,
      deliveryFee,
      platformFee,
      discount,
      total,
      address: selectedAddress,
      courier: {
        name: "Campus Delivery Network",
        trackingNumber: `CN-${Math.floor(100000 + Math.random() * 900000)}-IN`
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
            senderId: savedUser?.id || "usr_buyer",
            recipientId: seller.id,
            book: book,
            time: newMsg.time
          });
        }
      }
      selectConversation(existing.id);
      return existing.id;
    }

    const initialMsgText = customInitialMessage || `Hi! Thanks for showing interest in my book "${book.title}". Let me know if you have any questions!`;
    const newChat = {
      id: newChatId,
      active: true,
      seller: {
        id: seller.id,
        name: seller.name,
        avatar: seller.avatar || "https://i.pravatar.cc/150",
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
          sender: customInitialMessage ? "me" : "them",
          text: initialMsgText,
          time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
          status: "read"
        }
      ]
    };

    setConversations((prev) => [newChat, ...prev]);
    setActiveConversationId(newChatId);

    if (socket && socket.connected) {
      socket.emit("joinChat", newChatId);
      if (customInitialMessage) {
        socket.emit("sendChatMessage", {
          conversationId: newChatId,
          text: customInitialMessage,
          senderName: savedUser?.fullName || "Student Buyer",
          senderEmail: savedUser?.email || "buyer@bookify.com",
          senderId: savedUser?.id || "usr_buyer",
          recipientId: seller.id,
          book: book,
          time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
        });
      }
    }

    return newChatId;
  };

  const selectConversation = (id) => {
    setActiveConversationId(id);
    if (socket && socket.connected) {
      socket.emit("joinChat", id);
    }
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

    // Emit live message over Socket.io
    if (socket && socket.connected) {
      socket.emit("sendChatMessage", {
        id: newMessage.id,
        conversationId,
        text: text.trim(),
        senderName: savedUser?.fullName || "Student",
        senderEmail: savedUser?.email || "student@bookify.com",
        senderId: savedUser?.id || "usr_me",
        recipientId: conv?.seller?.id || null,
        book: conv?.book || null,
        time: newMessage.time
      });
    }

    // Interactive Demo Simulation: If chatting with demo sellers (Aarav / Sneha), simulate an authentic auto-reply
    const isDemoSeller =
      conv?.seller?.name?.includes("Aarav") ||
      conv?.seller?.name?.includes("Sneha") ||
      conversationId.startsWith("chat_");

    if (isDemoSeller) {
      setTimeout(() => {
        const demoReplies = [
          "Sure, sounds great! Let's connect near the library.",
          "I can bring the book today around 4 PM.",
          "The condition is really good, exactly as shown in photos.",
          "Yes, that price works for me! Happy to help a fellow student.",
          "I will keep the book ready for pickup."
        ];
        const randomReply = demoReplies[Math.floor(Math.random() * demoReplies.length)];
        const replyTime = new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

        setConversations((currentConvs) => {
          return currentConvs.map((c) => {
            if (c.id === conversationId) {
              const isViewing =
                window.location.pathname.includes(conversationId) ||
                (window.location.pathname.startsWith("/chat") && activeConversationId === conversationId);

              const replyMsg = {
                id: `msg_reply_${Date.now()}`,
                sender: "them",
                text: randomReply,
                time: replyTime,
                status: isViewing ? "read" : "delivered",
              };

              return {
                ...c,
                lastMessage: randomReply,
                lastMessageTimestamp: replyTime,
                unreadCount: isViewing ? 0 : (c.unreadCount || 0) + 1,
                messages: [...c.messages, replyMsg],
              };
            }
            return c;
          });
        });
      }, 3500);
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
  const deliveryFee = shippingMethod === "pickup" ? 0 : 40;
  const platformFee = cartItems.length > 0 ? 15 : 0;
  const discount = appliedCoupon ? appliedCoupon.discount : 0;
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
        getOrderById,
        releaseEscrowPayment,
        conversations,
        activeConversation,
        activeConversationId,
        selectConversation,
        startOrGetConversation,
        sendMessage,
        unreadMessagesCount,
        showToast,
        wishlistItems,
        toggleWishlist,
        toggleWishlistAlert,
        isBookWishlisted
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
