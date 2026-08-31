import React, { createContext, useContext, useState, useEffect } from "react";

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
      id: "sel_1",
      name: "Sneha Reddy",
      avatar: "https://i.pravatar.cc/150?img=5",
      online: true,
      verified: true,
      college: "VNIT Nagpur",
      lastSeen: "Online",
      memberSince: "May 2024",
      rating: 4.8,
      totalSales: 24
    },
    book: {
      id: 1,
      title: "Introduction to Algorithms, 3rd Edition",
      author: "Thomas H. Cormen",
      price: 650,
      originalPrice: 1200,
      condition: "Very Good",
      image: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=500&auto=format&fit=crop&q=60"
    },
    messages: [
      { id: "m1", sender: "them", text: "Hey! Is the Introduction to Algorithms book still available?", time: "10:30 AM", status: "read" },
      { id: "m2", sender: "me", text: "Yes, it is! The condition is very good, no highlight marks.", time: "10:35 AM", status: "read" },
      { id: "m3", sender: "them", text: "Awesome. I'm willing to buy it for ₹650. Can we meet on campus?", time: "10:40 AM", status: "read" },
      { id: "m4", sender: "me", text: "Sure, campus meetup works perfectly for me.", time: "10:42 AM", status: "read" },
      { id: "m5", sender: "them", text: "Let's meet near the central library tomorrow?", time: "10:45 AM", status: "read" }
    ]
  },
  {
    id: "chat_2",
    active: false,
    seller: {
      id: "sel_2",
      name: "Aarav Sharma",
      avatar: "https://i.pravatar.cc/150?img=11",
      online: false,
      verified: false,
      college: "GHRCE Nagpur",
      lastSeen: "2 hours ago",
      memberSince: "Jan 2025",
      rating: 4.5,
      totalSales: 8
    },
    book: {
      id: 2,
      title: "Concepts of Physics Vol 1",
      author: "H.C. Verma",
      price: 350,
      originalPrice: 480,
      condition: "Good",
      image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&auto=format&fit=crop&q=60"
    },
    messages: [
      { id: "m6", sender: "them", text: "Hello, interested in your Physics textbook. Is the price negotiable?", time: "Yesterday", status: "read" }
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
  const [conversations, setConversations] = useState(INITIAL_CONVERSATIONS);
  const [activeConversationId, setActiveConversationId] = useState("chat_1");

  const activeConversation = conversations.find(
    (c) => c.id === activeConversationId
  );

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
  const selectConversation = (id) => {
    setActiveConversationId(id);
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, messages: c.messages.map(m => ({ ...m, status: "read" })) } : c))
    );
  };

  const sendMessage = (conversationId, text) => {
    if (!text.trim()) return;
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
            messages: [...c.messages, newMessage]
          };
        }
        return c;
      })
    );

    // Simulate seller automated reply for prototype high fidelity
    setTimeout(() => {
      const replies = [
        "Sounds good! Let's coordinate the meetup spot.",
        "Yes, we can meet near the library entrance tomorrow afternoon.",
        "Cool. I'll make sure to bring the book copy with me.",
        "Thanks for confirming. I'll see you there!"
      ];
      const randomReply = replies[Math.floor(Math.random() * replies.length)];
      const replyMessage = {
        id: `msg_${Date.now() + 1}`,
        sender: "them",
        text: randomReply,
        time: new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit"
        }),
        status: "read"
      };

      setConversations((prev) =>
        prev.map((c) => {
          if (c.id === conversationId) {
            return {
              ...c,
              messages: [...c.messages, replyMessage]
            };
          }
          return c;
        })
      );
      showToast("New message received!");
    }, 2000);
  };

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
        sendMessage,
        showToast
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
