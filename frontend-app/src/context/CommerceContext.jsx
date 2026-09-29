import React, { createContext, useContext, useState, useEffect } from "react";
import { io } from "socket.io-client";
import { chatService } from "../services/chatService";
import { isRealUserAvatar } from "../utils/avatarUtils";
import { useAuth } from "./AuthContext";

const API_BASE = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const CommerceContext = createContext(null);

const INITIAL_COUPONS = [
  { code: "CAMPUS100", discount: 100, description: "₹100 off on orders above ₹500" },
  { code: "BOKIFY50", discount: 50, description: "₹50 off on your first order" },
  { code: "FREESHIP", discount: 60, description: "Free campus delivery credit (₹60 value)" }
];

const getInitialAddresses = () => {
  try {
    const saved = localStorage.getItem("bookify_addresses");
    const userStr = localStorage.getItem("bookify_user");
    const currentUser = userStr ? JSON.parse(userStr) : null;
    const currentName = currentUser?.fullName || currentUser?.name;

    if (saved) {
      let parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((addr) => {
          if (addr.name === "Manish Pawar" || !addr.name) {
            return {
              ...addr,
              name: currentName || "Campus Address",
              phone: currentUser?.phone || addr.phone || "",
            };
          }
          return addr;
        });
      }
    }

    if (currentUser?.address?.campus && currentUser.address.campus.trim()) {
      return [
        {
          id: "addr_1",
          name: currentName || "Student User",
          phone: currentUser.phone || "",
          type: "Campus / Hostel",
          campus: currentUser.address.campus,
          hostelBlock: currentUser.address?.hostelBlock || "",
          meetupSpot: currentUser.address?.meetupSpot || "Central Library Entrance",
          street: `${currentUser.address?.hostelBlock || ""}, ${currentUser.address?.campus || ""}`.trim(),
          city: "Campus City",
          state: "State",
          pincode: "110001",
          isDefault: true,
        },
      ];
    }
  } catch {}
  return [];
};


const MOCK_ORDER_IDS = new Set(["BK77109230", "BK82901840"]);
const MOCK_CHAT_IDS = new Set(["chat_1", "chat_2", "chat_3"]);
const INITIAL_CONVERSATIONS = [];
const INITIAL_ORDERS = [];

const mapBackendOrder = (bo, isSellerOrder = false, user = null) => {
  const primaryItem = bo.items?.[0] || bo.bookId || {};
  const title =
    primaryItem.title ||
    (bo.items && bo.items.length > 0 ? bo.items[0].title : `Order #${bo.orderCode || bo._id?.toString().slice(-8)}`);
  const rawStatus = (bo.status || "Placed").toLowerCase();
  const mappedStatus =
    rawStatus === "confirmed" || rawStatus === "processing"
      ? "confirmed"
      : rawStatus === "out for delivery"
      ? "out_for_delivery"
      : rawStatus;

  const isDelivered = mappedStatus === "delivered";

  // Build timeline
  const stageOrder = ["placed", "confirmed", "shipped", "out_for_delivery", "delivered"];
  const currentIdx = stageOrder.indexOf(mappedStatus);

  const timeline =
    bo.timeline && bo.timeline.length > 0
      ? bo.timeline.map((t) => {
          const stageKey = (t.stage || "").toLowerCase().replace(/ /g, "_");
          const sIdx = stageOrder.indexOf(stageKey);
          return {
            stage: stageKey,
            title: t.title,
            date: t.date
              ? new Date(t.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })
              : sIdx <= currentIdx
              ? "Today"
              : "Pending",
            description: t.description,
            completed: isDelivered || (sIdx !== -1 && sIdx < currentIdx) || (sIdx === currentIdx && isDelivered),
            active: sIdx === currentIdx && !isDelivered,
          };
        })
      : [
          {
            stage: "placed",
            title: "Order Placed",
            date: "Today",
            description: "Payment verified & held safely in escrow.",
            completed: true,
            active: currentIdx === 0,
          },
          {
            stage: "confirmed",
            title: "Seller Confirmed",
            date: currentIdx >= 1 ? "Today" : "Pending",
            description: "Seller accepted and packaging the book.",
            completed: currentIdx >= 1,
            active: currentIdx === 1,
          },
          {
            stage: "shipped",
            title: "Shipped",
            date: currentIdx >= 2 ? "Today" : "Pending",
            description: "Handed over to college logistics courier.",
            completed: currentIdx >= 2,
            active: currentIdx === 2,
          },
          {
            stage: "out_for_delivery",
            title: "Out for Delivery",
            date: currentIdx >= 3 ? "Today" : "Pending",
            description: "Campus delivery executive is on the way.",
            completed: currentIdx >= 3,
            active: currentIdx === 3,
          },
          {
            stage: "delivered",
            title: "Delivered",
            date: isDelivered ? "Today" : "Pending",
            description: "Verify package contents & release escrow funds.",
            completed: isDelivered,
            active: false,
          },
        ];

  const statusLabel =
    mappedStatus === "confirmed"
      ? "Seller Confirmed & Packaging"
      : mappedStatus === "shipped"
      ? "In Transit via Campus Courier"
      : mappedStatus === "out_for_delivery"
      ? "Out for Delivery"
      : mappedStatus === "delivered"
      ? "Delivered & Verified"
      : "Order Placed & Escrow Secured";

  const orderDateFormatted = bo.createdAt
    ? new Date(bo.createdAt).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "Recently";

  const expectedDelivery = bo.expectedDeliveryDate
    ? new Date(bo.expectedDeliveryDate).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "In 3-5 days";

  const buyerData =
    bo.buyerId && typeof bo.buyerId === "object"
      ? {
          id: bo.buyerId._id,
          name: bo.buyerId.fullName || "Student Buyer",
          fullName: bo.buyerId.fullName || "Student Buyer",
          phone: bo.buyerId.phone || bo.shippingAddress?.phone || "+91 98765 00000",
          email: bo.buyerId.email,
          meetupSpot: bo.shippingAddress?.meetupSpot || bo.shippingAddress?.hostelBlock || "Campus Central Library",
        }
      : {
          id: bo.buyerId,
          name: bo.shippingAddress?.name || "Student Buyer",
          fullName: bo.shippingAddress?.name || "Student Buyer",
          phone: bo.shippingAddress?.phone || "+91 98765 00000",
          meetupSpot: bo.shippingAddress?.meetupSpot || bo.shippingAddress?.hostelBlock || "Campus Central Library",
        };

  const sellerData =
    bo.sellerId && typeof bo.sellerId === "object"
      ? {
          id: bo.sellerId._id,
          name: bo.sellerId.fullName || "Campus Seller",
          fullName: bo.sellerId.fullName || "Campus Seller",
          phone: bo.sellerId.phone || "+91 98765 00000",
          email: bo.sellerId.email,
          meetup: bo.shippingAddress?.meetupSpot || "Main Campus Library Entrance",
        }
      : {
          id: bo.sellerId || "usr_seller",
          name: "Campus Seller",
          fullName: "Campus Seller",
          phone: "+91 98765 00000",
          meetup: bo.shippingAddress?.meetupSpot || "Main Campus Library Entrance",
        };

  const currentUserId = user?.id || user?._id;
  const sellerIdStr = (bo.sellerId?._id || bo.sellerId || "").toString();
  const determinedIsSellerOrder =
    isSellerOrder || (currentUserId && sellerIdStr && currentUserId.toString() === sellerIdStr);

  return {
    id: bo._id?.toString() || bo.id,
    _id: bo._id?.toString() || bo.id,
    orderCode: bo.orderCode || bo._id?.toString(),
    orderId: bo.orderCode || bo._id?.toString(),
    title,
    author: primaryItem.author || "",
    items:
      bo.items && bo.items.length > 0
        ? bo.items.map((it) => ({
            id: it.bookId || it._id || bo._id,
            bookId: it.bookId || it._id || bo._id,
            title: it.title || title,
            author: it.author || "",
            price: it.price || bo.amount || 0,
            condition: it.condition || "Good",
            image: it.image || "",
            quantity: it.quantity || 1,
          }))
        : [
            {
              id: bo._id,
              bookId: bo._id,
              title,
              price: bo.amount || 0,
              condition: "Good",
              image: "",
              quantity: 1,
            },
          ],
    total: bo.amount || 0,
    amount: bo.amount || 0,
    subtotal: bo.subtotal || bo.amount || 0,
    deliveryFee: bo.deliveryFee ?? 0,
    platformFee: bo.platformFee ?? 15,
    discount: bo.discount ?? 0,
    price: bo.amount ? `₹${bo.amount}` : "₹0",
    status: mappedStatus,
    statusLabel,
    rawStatus: bo.status,
    escrowStatus:
      bo.escrowStatus === "Released" ? "released_to_seller" : (bo.escrowStatus?.toLowerCase() || "held_in_escrow"),
    paymentMethod: bo.paymentMethod || "Razorpay",
    paymentStatus: bo.paymentStatus || "Completed",
    isSellerOrder: Boolean(determinedIsSellerOrder),
    buyer: buyerData,
    seller: sellerData,
    sellerName: sellerData.fullName || sellerData.name,
    address: bo.shippingAddress || {},
    courier:
      bo.courier && bo.courier.name
        ? bo.courier
        : {
            name: "Campus Delivery Network",
            trackingNumber: bo.courier?.trackingNumber || `AWB-${Math.floor(100000 + Math.random() * 900000)}`,
            supportPhone: "+91 9876543210",
          },
    timeline,
    createdAt: bo.createdAt,
    orderDateFormatted,
    expectedDelivery,
  };
};

export function CommerceProvider({ children }) {
  const { user, isAuthenticated } = useAuth();

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
  const [addresses, setAddresses] = useState(getInitialAddresses);

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
        if (Array.isArray(parsed)) {
          const cleanOrders = parsed.filter((o) => !MOCK_ORDER_IDS.has(o.id));
          if (cleanOrders.length !== parsed.length) {
            localStorage.setItem("bookify_orders", JSON.stringify(cleanOrders));
          }
          return cleanOrders.map((o) => {
            if (o.address?.name === "Manish Pawar") {
              const userStr = localStorage.getItem("bookify_user");
              const currentUser = userStr ? JSON.parse(userStr) : null;
              return {
                ...o,
                address: {
                  ...o.address,
                  name: currentUser?.fullName || currentUser?.name || "Student Buyer",
                  phone: currentUser?.phone || o.address?.phone || "",
                },
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
    if (orders && orders.length > 0) {
      localStorage.setItem("bookify_orders", JSON.stringify(orders));
    } else {
      localStorage.removeItem("bookify_orders");
    }
  }, [orders]);

  // Conversations State
  const [conversations, setConversations] = useState(() => {
    const saved = localStorage.getItem("bookify_conversations");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const cleanChats = parsed.filter((c) => !MOCK_CHAT_IDS.has(c.id));
          if (cleanChats.length !== parsed.length) {
            localStorage.setItem("bookify_conversations", JSON.stringify(cleanChats));
          }
          return cleanChats.map((c) => ({
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
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (conversations && conversations.length > 0) {
      localStorage.setItem("bookify_conversations", JSON.stringify(conversations));
    } else {
      localStorage.removeItem("bookify_conversations");
    }
  }, [conversations]);

  // Sync state cleanly with user authentication lifecycle
  useEffect(() => {
    if (!isAuthenticated || !user) {
      setOrders([]);
      setConversations([]);
      setCartItems([]);
      return;
    }

    // Fetch user's real orders from MongoDB backend (both purchases and incoming sales)
    const fetchUserOrders = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const [ordersRes, salesRes] = await Promise.all([
          fetch(`${API_BASE}/orders/my-orders`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          fetch(`${API_BASE}/orders/my-sales`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

        const combined = [];

        if (ordersRes.ok) {
          const json = await ordersRes.json();
          if (json?.data && Array.isArray(json.data)) {
            const mappedPurchases = json.data.map((bo) => mapBackendOrder(bo, false, user));
            combined.push(...mappedPurchases);
          }
        }

        if (salesRes.ok) {
          const json = await salesRes.json();
          if (json?.data && Array.isArray(json.data)) {
            const existingIds = new Set(combined.map((o) => o.id));
            const mappedSales = json.data
              .filter((bo) => !existingIds.has(bo._id?.toString()))
              .map((bo) => mapBackendOrder(bo, true, user));
            combined.push(...mappedSales);
          }
        }

        setOrders(combined);
      } catch (err) {
        console.warn("[CommerceContext] Failed to fetch orders from backend:", err);
      }
    };

    fetchUserOrders();

    const handleOrdersReset = () => {
      fetchUserOrders();
    };
    const handleConversationsReset = () => setConversations([]);

    window.addEventListener("bookify_orders_updated", handleOrdersReset);
    window.addEventListener("bookify_conversations_updated", handleConversationsReset);
    return () => {
      window.removeEventListener("bookify_orders_updated", handleOrdersReset);
      window.removeEventListener("bookify_conversations_updated", handleConversationsReset);
    };
  }, [user?.id || user?._id, isAuthenticated]);

  // Connect to live Socket.io Backend
  useEffect(() => {
    let savedUser = null;
    try {
      savedUser = JSON.parse(localStorage.getItem("bookify_user"));
    } catch {}
    const token = localStorage.getItem("token");

    const rawApiBase = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || "http://localhost:5000/api";
    const socketBase = import.meta.env.VITE_SOCKET_URL || rawApiBase.replace(/\/api\/?$/, "");
    const newSocket = io(socketBase, {
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

    // Real-Time Incoming Order for Sellers
    newSocket.on("newOrder", (data) => {
      console.log("[Bookify Socket] Received live newOrder:", data);
      window.dispatchEvent(new Event("bookify_orders_updated"));
      showToast("🎉 You received a new order to fulfill!", "success");
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

  // Wishlist State (Database-backed for logged-in users + localStorage cache)
  const [wishlistItems, setWishlistItems] = useState(() => {
    const saved = localStorage.getItem("bookify_wishlist");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const cleaned = parsed.filter((item) => item.id !== 1 && item.id !== 2);
          if (cleaned.length !== parsed.length) {
            localStorage.setItem("bookify_wishlist", JSON.stringify(cleaned));
          }
          return cleaned;
        }
      } catch {}
    }
    return [];
  });

  // Keep localStorage updated with current wishlist items
  useEffect(() => {
    localStorage.setItem("bookify_wishlist", JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  // Synchronize and fetch wishlist from MongoDB when user logs in
  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    const token = localStorage.getItem("token") || localStorage.getItem("bookify_admin_token");
    if (!token) return;

    const syncAndFetchWishlist = async () => {
      try {
        // 1. If guest had local items, sync / merge with DB
        const saved = localStorage.getItem("bookify_wishlist");
        let localItems = [];
        try {
          localItems = saved ? JSON.parse(saved) : [];
        } catch {}

        if (Array.isArray(localItems) && localItems.length > 0) {
          const syncRes = await fetch(`${API_BASE}/wishlist/sync`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ items: localItems }),
          });
          if (syncRes.ok) {
            const syncJson = await syncRes.json();
            if (Array.isArray(syncJson.data)) {
              setWishlistItems(syncJson.data);
              return;
            }
          }
        }

        // 2. Fetch fresh wishlist from MongoDB
        const res = await fetch(`${API_BASE}/wishlist`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.ok) {
          const json = await res.json();
          if (Array.isArray(json.data)) {
            setWishlistItems(json.data);
          }
        }
      } catch (err) {
        console.warn("[Bookify] Wishlist backend load error:", err);
      }
    };

    syncAndFetchWishlist();
  }, [isAuthenticated, user?.id, user?.email]);

  const toggleWishlist = async (book) => {
    const isWish = wishlistItems.some((item) => String(item.id) === String(book.id));
    const token = localStorage.getItem("token") || localStorage.getItem("bookify_admin_token");

    const itemPayload = {
      id: String(book.id),
      title: book.title || "Untitled Book",
      author: book.author || "Unknown Author",
      price: book.mode === "donate" ? "Free" : `₹${book.askingPrice || book.price || 0}`,
      condition: book.condition?.replace(/_/g, " ") || "Good",
      alertActive: false,
      coverImage: book.coverImage || (book.photos && book.photos[0]) || "",
      mode: book.mode || "buy",
    };

    if (isWish) {
      setWishlistItems((prev) => prev.filter((item) => String(item.id) !== String(book.id)));
      showToast("Removed from wishlist.", "info");
    } else {
      setWishlistItems((prev) => [...prev, itemPayload]);
      showToast("Added to wishlist!");
    }

    if (token) {
      try {
        await fetch(`${API_BASE}/wishlist/toggle`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(itemPayload),
        });
      } catch (err) {
        console.warn("[Bookify] Failed to sync wishlist toggle to DB:", err);
      }
    }
  };

  const toggleWishlistAlert = async (id) => {
    setWishlistItems((prev) =>
      prev.map((item) =>
        String(item.id) === String(id) ? { ...item, alertActive: !item.alertActive } : item
      )
    );

    const token = localStorage.getItem("token") || localStorage.getItem("bookify_admin_token");
    if (token) {
      try {
        await fetch(`${API_BASE}/wishlist/${id}/alert`, {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } catch (err) {
        console.warn("[Bookify] Failed to sync wishlist alert to DB:", err);
      }
    }
  };

  const isBookWishlisted = (id) => {
    return wishlistItems.some((item) => String(item.id) === String(id));
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

  const moveToWishlist = async (id) => {
    const item = cartItems.find((i) => String(i.id) === String(id));
    if (!item) return;

    const wishItem = {
      id: String(item.id),
      title: item.title || "Untitled Book",
      author: item.author || "Unknown Author",
      price: `₹${item.price || 0}`,
      condition: item.condition || "Good",
      alertActive: false,
      coverImage: item.image || item.coverImage || "",
      mode: "buy",
    };

    setWishlistItems((prev) => {
      if (prev.some((w) => String(w.id) === String(id))) return prev;
      return [...prev, wishItem];
    });

    // Remove from cart
    removeFromCart(id);
    showToast("Moved item to wishlist.", "success");

    const token = localStorage.getItem("token") || localStorage.getItem("bookify_admin_token");
    if (token) {
      try {
        await fetch(`${API_BASE}/wishlist/toggle`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(wishItem),
        });
      } catch (err) {
        console.warn("[Bookify] Failed to sync moveToWishlist to DB:", err);
      }
    }
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
      const apiUrl = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || "http://localhost:5000/api";
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
  const createOrder = ({ paymentMethod, transactionId, backendOrder = null }) => {
    const isExpress = shippingMethod === "express";
    const deliveryDays = isExpress ? 2 : 4;
    const shippingMethodLabel = isExpress
      ? "Express Campus Priority (1-2 Days)"
      : shippingMethod === "pickup"
      ? "Self Campus Pickup (Same Day)"
      : "Standard Campus Delivery (3-5 Days)";

    const orderId =
      backendOrder?._id?.toString() ||
      backendOrder?.id ||
      backendOrder?.orderCode ||
      `BK${Math.floor(10000000 + Math.random() * 90000000)}`;

    const newOrder = backendOrder
      ? mapBackendOrder(backendOrder, false, user)
      : {
          id: orderId,
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
      isSellerOrder: false,
      seller: cartItems[0]?.seller || { name: cartItems[0]?.author || "Campus Seller", id: "usr_seller" },
      buyer: {
        name: selectedAddress?.name || user?.fullName || "Student Buyer",
        phone: selectedAddress?.phone || user?.phone || "+91 98765 43210",
        meetupSpot: selectedAddress?.meetupSpot || selectedAddress?.campus || "Campus Central Library Entrance",
        hostelBlock: selectedAddress?.hostelBlock || selectedAddress?.street || "Campus Hostel"
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

    setOrders((prev) => [newOrder, ...prev.filter((o) => o.id !== newOrder.id && o._id !== newOrder.id)]);
    setCartItems([]);
    setAppliedCoupon(null);
    window.dispatchEvent(new Event("bookify_orders_updated"));
    return newOrder;
  };

  const getOrderById = (id) => orders.find((o) => o.id === id || o._id === id || o.orderCode === id);

  const releaseEscrowPayment = (orderId) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id === orderId || order._id === orderId || order.orderCode === orderId) {
          const updatedTimeline = (order.timeline || []).map((step) => ({
            ...step,
            completed: true,
            active: false
          }));
          return {
            ...order,
            status: "delivered",
            escrowStatus: "released_to_seller",
            statusLabel: "Delivered & Verified",
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
      let token =
        localStorage.getItem("token") ||
        localStorage.getItem("bookify_token") ||
        localStorage.getItem("bookify_auth_token");
      if (!token) {
        try {
          const user = JSON.parse(localStorage.getItem("bookify_user") || "{}");
          token = user.token;
        } catch {}
      }

      const apiUrl = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || "http://localhost:5000/api";
      await fetch(`${apiUrl}/orders/${orderId}/status`, {
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
      // Non-blocking for mock seed orders
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
  const platformFee = cartItems.length > 0 ? 15 : 0;
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
