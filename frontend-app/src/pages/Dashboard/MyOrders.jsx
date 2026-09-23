import { useState } from "react";
import { Link } from "react-router-dom";
import DashboardSidebar from "../../components/dashboard/DashboardSidebar";
import { useCommerce } from "../../context/CommerceContext";
import {
  ShoppingBag,
  Eye,
  Download,
  HelpCircle,
  CheckCircle2,
  Truck,
  Clock,
  Menu,
  Check,
  Package,
  ShieldCheck,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Send,
  X,
  Phone,
  MapPin,
  Sparkles
} from "lucide-react";

const SEED_BUYER_ORDERS = [
  {
    id: "ORD-98725",
    title: "Introduction to Algorithms, 3rd Edition",
    author: "Thomas H. Cormen",
    price: "₹650",
    date: "24 Aug 2026",
    status: "Meetup Scheduled",
    statusColor: "text-amber-600 bg-amber-50 border-amber-100",
    coverClass: "from-[#111827] to-[#374151]",
    step: 2,
    seller: {
      name: "Sneha Reddy",
      phone: "+91 98765 12345",
      meetup: "Central Library Ground Floor, 4:00 PM Wednesday"
    }
  },
  {
    id: "ORD-82710",
    title: "Cracking the Coding Interview",
    author: "Gayle Laakmann McDowell",
    price: "₹450",
    date: "18 Aug 2026",
    status: "Completed",
    statusColor: "text-green-600 bg-green-50 border-green-100",
    coverClass: "from-[#6C4BF4] to-[#8B3FD9]",
    step: 3,
    seller: {
      name: "Aarav Sharma",
      phone: "+91 99887 76655",
      meetup: "Campus Cafeteria, Completed"
    }
  },
  {
    id: "ORD-51920",
    title: "Organic Chemistry, 8th Edition",
    author: "L. G. Wade Jr.",
    price: "₹800",
    date: "12 Aug 2026",
    status: "Cancelled",
    statusColor: "text-red-600 bg-red-50 border-red-100",
    coverClass: "from-[#059669] to-[#10B981]",
    step: 0,
    seller: {
      name: "Rohan Das",
      phone: "N/A",
      meetup: "Cancelled by seller"
    }
  }
];

export default function MyOrders() {
  const { orders: contextOrders, updateOrderStatus, startOrGetConversation, showToast } = useCommerce();
  const [viewMode, setViewMode] = useState("seller_hub"); // default to "seller_hub" so user immediately sees confirmation buttons!
  const [activeTab, setActiveTab] = useState("All");
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [selectedHelpOrder, setSelectedHelpOrder] = useState(null);
  const [helpReason, setHelpReason] = useState("");

  // Courier Dispatch Modal state for sellers
  const [dispatchOrder, setDispatchOrder] = useState(null);
  const [courierName, setCourierName] = useState("BlueDart Campus Express");
  const [trackingNumber, setTrackingNumber] = useState("");

  // Format Buyer Purchases
  const buyerPurchases = (contextOrders || [])
    .filter((ord) => !ord.isSellerOrder)
    .map((ord) => {
      const primaryItem = ord.items?.[0];
      const isMeetup = ord.shippingMethod === "pickup" || (!ord.shippingMethod && !ord.courier?.trackingNumber);
      const isCompleted = ord.status === "delivered";
      const isCancelled = ord.status === "cancelled";
      const isShipped = ord.status === "shipped" || ord.status === "out_for_delivery";

      const statusText = isCompleted
        ? "Completed"
        : isCancelled
        ? "Cancelled"
        : isShipped
        ? "In Transit"
        : isMeetup
        ? "Meetup Scheduled"
        : "Escrow Secured";

      const statusColor = isCompleted
        ? "text-emerald-700 bg-emerald-50 border-emerald-200"
        : isCancelled
        ? "text-red-700 bg-red-50 border-red-200"
        : isShipped
        ? "text-blue-700 bg-blue-50 border-blue-200"
        : "text-[#6C4BF4] bg-[#F0ECFF] border-[#E9E4FF]";

      return {
        id: ord.id || `ORD-${Math.floor(10000 + Math.random() * 90000)}`,
        title: primaryItem?.title || ord.title || "Textbook Order",
        author: primaryItem?.author || ord.author || "Academic Author",
        image: primaryItem?.image || ord.image || null,
        totalItemsCount: ord.items?.length || 1,
        price: ord.total ? `₹${ord.total}` : "₹499",
        subtotal: ord.subtotal || ord.total || 450,
        deliveryFee: ord.deliveryFee ?? 0,
        platformFee: ord.platformFee ?? 15,
        discount: ord.discount ?? 0,
        date: ord.orderDateFormatted || "Recently",
        expectedDelivery: ord.expectedDelivery,
        shippingMethod: ord.shippingMethod,
        shippingMethodLabel: ord.shippingMethodLabel,
        status: statusText,
        statusColor: statusColor,
        rawStatus: ord.status,
        coverClass: "from-[#6C4BF4] to-[#8B3FD9]",
        step: isCompleted ? 3 : isShipped ? 2 : 1,
        seller: {
          id: primaryItem?.seller?.id || "usr_seller",
          name: primaryItem?.seller?.name || "Campus Peer",
          phone: "+91 98765 00000",
          meetup: ord.address?.meetupSpot || ord.address?.hostelBlock || "Main Campus Library Entrance"
        },
        items: ord.items || [{ title: ord.title || "Academic Book", price: ord.total || 450, image: ord.image }]
      };
    });

  const allBuyerOrders = [
    ...buyerPurchases,
    ...SEED_BUYER_ORDERS.filter((s) => !buyerPurchases.some((c) => c.id === s.id))
  ];

  // Seller Incoming Orders (books sold by me waiting to be fulfilled)
  const sellerOrders = (contextOrders || []).filter((ord) => ord.isSellerOrder);

  // Fallback demo seller order if none in state
  const effectiveSellerOrders =
    sellerOrders.length > 0
      ? sellerOrders
      : [
          {
            id: "BK77109230",
            isSellerOrder: true,
            orderDateFormatted: "Today, 04:30 PM",
            expectedDelivery: "28 Sep 2026",
            status: "placed",
            statusLabel: "Awaiting Seller Confirmation",
            escrowStatus: "held_in_escrow",
            subtotal: 299,
            total: 354,
            buyer: {
              name: "Aarav Sharma",
              phone: "+91 98765 43210",
              meetupSpot: "Central Library Ground Floor",
              hostelBlock: "Hostel Block C, Room 312"
            },
            address: {
              name: "Aarav Sharma",
              phone: "+91 98765 43210",
              meetupSpot: "Central Library Ground Floor",
              hostelBlock: "Hostel Block C, Room 312",
              campus: "Main Campus"
            },
            items: [
              {
                title: "Concepts of Physics (HC Verma Vol 1)",
                author: "H.C. Verma",
                price: 299,
                condition: "Like New",
                image: "https://covers.openlibrary.org/b/isbn/9788177091878-L.jpg"
              }
            ],
            courier: {
              name: "Campus Courier Logistics",
              trackingNumber: "CN-718290-IN"
            }
          }
        ];

  // Filter Buyer Orders
  const filteredBuyerOrders = allBuyerOrders.filter((order) => {
    if (activeTab === "All") return true;
    if (activeTab === "Active")
      return (
        order.status === "Meetup Scheduled" ||
        order.status === "Escrow Secured" ||
        order.status === "In Transit" ||
        order.status === "Processing"
      );
    if (activeTab === "Completed") return order.status === "Completed";
    if (activeTab === "Cancelled") return order.status === "Cancelled";
    return true;
  });

  // Filter Seller Orders
  const filteredSellerOrders = effectiveSellerOrders.filter((order) => {
    const st = (order.status || "placed").toLowerCase();
    if (activeTab === "All") return true;
    if (activeTab === "Needs Confirmation") return st === "placed";
    if (activeTab === "To Ship") return st === "confirmed" || st === "processing";
    if (activeTab === "In Transit") return st === "shipped" || st === "out_for_delivery";
    if (activeTab === "Completed") return st === "delivered";
    return true;
  });

  // Count orders needing seller confirmation
  const pendingConfirmationCount = effectiveSellerOrders.filter(
    (o) => (o.status || "placed").toLowerCase() === "placed"
  ).length;

  // Handlers for Seller Actions
  const handleSellerConfirm = async (orderId) => {
    await updateOrderStatus(orderId, "Confirmed");
    showToast("Order Confirmed! Buyer notified & status updated in real-time.", "success");
  };

  const handleOpenDispatchModal = (order) => {
    setDispatchOrder(order);
    setTrackingNumber(`AWB-${Math.floor(100000 + Math.random() * 900000)}`);
  };

  const handleConfirmDispatch = async () => {
    if (!dispatchOrder) return;
    await updateOrderStatus(dispatchOrder.id, "Shipped", {
      name: courierName,
      trackingNumber: trackingNumber || `AWB-${Math.floor(100000 + Math.random() * 900000)}`
    });
    setDispatchOrder(null);
    showToast("Order marked as Shipped! Live tracking updated across devices.", "success");
  };

  const handleMarkOutForDelivery = async (orderId) => {
    await updateOrderStatus(orderId, "Out for Delivery");
    showToast("Status updated to Out for Delivery!", "info");
  };

  const handleMarkDelivered = async (orderId) => {
    await updateOrderStatus(orderId, "Delivered");
    showToast("Order marked Delivered! Escrow payment released to your wallet 🎉", "success");
  };

  const handleCancelOrder = async (orderId) => {
    if (window.confirm("Are you sure you want to decline this order? Escrow funds will be returned to the buyer.")) {
      await updateOrderStatus(orderId, "Cancelled");
      showToast("Order cancelled and buyer refunded.", "warning");
    }
  };

  const openInvoice = (order) => {
    setSelectedInvoice(order);
  };

  const handleHelpSubmit = (e) => {
    e.preventDefault();
    if (showToast) {
      showToast("Help ticket submitted. Campus Escrow team will review within 24h.", "success");
    }
    setSelectedHelpOrder(null);
    setHelpReason("");
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gradient-to-br from-[#F4F2FF] via-[#F8F7FF] to-[#F0F5FF]">
      <DashboardSidebar />

      <div className="flex min-w-0 flex-1 flex-col h-full">
        <main className="flex-1 overflow-y-auto p-4 md:p-7 animate-fade-in-up">
          {/* Header */}
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 select-none">
            <div className="flex items-start gap-3">
              {/* Mobile Hamburger Menu */}
              <button
                onClick={() => window.dispatchEvent(new Event("toggle-sidebar"))}
                className="lg:hidden p-1.5 rounded-lg text-gray-500 hover:bg-gray-50 hover:text-[#6C4BF4] transition cursor-pointer mt-1"
              >
                <Menu size={20} />
              </button>

              <div>
                <h1 className="text-xl md:text-2xl font-bold text-[#17152A]">Orders & Fulfillment Hub</h1>
                <p className="mt-0.5 text-xs text-gray-400">
                  Manage your book purchases and confirm incoming sales orders in real-time.
                </p>
              </div>
            </div>

            {/* Segmented Switcher: Buyer Purchases vs Seller Hub */}
            <div className="flex items-center rounded-2xl bg-white p-1 border border-gray-200 shadow-xs shrink-0 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => {
                  setViewMode("seller_hub");
                  setActiveTab("All");
                }}
                className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition cursor-pointer ${
                  viewMode === "seller_hub"
                    ? "bg-[#6C4BF4] text-white shadow-xs"
                    : "text-gray-600 hover:text-[#6C4BF4] hover:bg-gray-50"
                }`}
              >
                <Package size={15} />
                <span>Seller Orders to Fulfill</span>
                {pendingConfirmationCount > 0 && (
                  <span className="flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-amber-400 px-1 text-[10px] font-black text-black">
                    {pendingConfirmationCount}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setViewMode("purchases");
                  setActiveTab("All");
                }}
                className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition cursor-pointer ${
                  viewMode === "purchases"
                    ? "bg-[#6C4BF4] text-white shadow-xs"
                    : "text-gray-600 hover:text-[#6C4BF4] hover:bg-gray-50"
                }`}
              >
                <ShoppingBag size={15} />
                <span>My Purchases</span>
              </button>
            </div>
          </div>

          {/* ================= SELLER HUB VIEW ================= */}
          {viewMode === "seller_hub" && (
            <div className="space-y-6">
              {/* Seller Overview Banner */}
              <div className="rounded-3xl bg-gradient-to-r from-[#17152A] via-[#241B4B] to-[#3B2879] p-6 text-white shadow-lg relative overflow-hidden">
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold text-[#FFD166] border border-white/10 mb-2">
                      <Sparkles size={12} />
                      <span>Peer-to-Peer Student Escrow Fulfillment</span>
                    </div>
                    <h2 className="text-xl font-extrabold tracking-tight">
                      Seller Confirmation & Dispatch Dashboard
                    </h2>
                    <p className="mt-1 text-xs text-white/70 max-w-xl">
                      When students buy your listed textbooks, funds are held safely in Escrow. Confirm order availability within 24h to unlock courier dispatch and earn payouts!
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="rounded-2xl bg-white/10 p-3 text-center border border-white/10 backdrop-blur-xs min-w-[110px]">
                      <span className="text-[10px] font-bold text-white/60 uppercase block">Pending Confirm</span>
                      <span className="text-2xl font-black text-amber-400">{pendingConfirmationCount}</span>
                    </div>
                    <div className="rounded-2xl bg-white/10 p-3 text-center border border-white/10 backdrop-blur-xs min-w-[110px]">
                      <span className="text-[10px] font-bold text-white/60 uppercase block">Escrow Protected</span>
                      <span className="text-2xl font-black text-emerald-400">100%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Seller Filter Tabs */}
              <div className="flex border-b border-gray-150 gap-6 overflow-x-auto scrollbar-none">
                {["All", "Needs Confirmation", "To Ship", "In Transit", "Completed"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-3 text-sm font-semibold transition-all border-b-2 cursor-pointer whitespace-nowrap ${
                      activeTab === tab
                        ? "border-[#6C4BF4] text-[#6C4BF4]"
                        : "border-transparent text-gray-500 hover:text-gray-800"
                    }`}
                  >
                    {tab}
                    {tab === "Needs Confirmation" && pendingConfirmationCount > 0 && (
                      <span className="ml-1.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-extrabold px-1.5 py-0.2">
                        {pendingConfirmationCount}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Seller Orders List */}
              <div className="space-y-4">
                {filteredSellerOrders.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 rounded-3xl bg-white border border-gray-150 p-8 text-center">
                    <Package size={48} className="text-gray-300 mb-3" />
                    <h3 className="font-bold text-[#17152A] text-lg">No incoming orders found</h3>
                    <p className="text-sm text-gray-400 mt-1">There are no orders matching "{activeTab}".</p>
                  </div>
                ) : (
                  filteredSellerOrders.map((ord) => {
                    const primary = ord.items?.[0] || {};
                    const st = (ord.status || "placed").toLowerCase();
                    const isPlaced = st === "placed";
                    const isConfirmed = st === "confirmed" || st === "processing";
                    const isShipped = st === "shipped";
                    const isOut = st === "out_for_delivery";
                    const isDelivered = st === "delivered";

                    return (
                      <div
                        key={ord.id}
                        className={`rounded-3xl bg-white border p-6 shadow-sm transition-all duration-300 ${
                          isPlaced
                            ? "border-amber-300 ring-2 ring-amber-100"
                            : "border-gray-150 hover:shadow-md"
                        }`}
                      >
                        {/* Top Row: Order ID, Status, Escrow Badge */}
                        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-gray-100">
                          <div className="flex items-center gap-3">
                            <span className="rounded-xl bg-[#F0ECFF] px-3 py-1 font-mono text-xs font-bold text-[#6C4BF4]">
                              Order #{ord.id}
                            </span>
                            <span className="text-xs text-gray-400">Placed: {ord.orderDateFormatted}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800 border border-emerald-200">
                              <ShieldCheck size={14} className="text-emerald-600" />
                              <span>₹{ord.total} Held in Escrow</span>
                            </div>

                            <span
                              className={`rounded-full px-3 py-1 text-xs font-extrabold border ${
                                isPlaced
                                  ? "bg-amber-50 text-amber-800 border-amber-200 animate-pulse"
                                  : isConfirmed
                                  ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                                  : isShipped
                                  ? "bg-blue-50 text-blue-700 border-blue-200"
                                  : isOut
                                  ? "bg-purple-50 text-purple-700 border-purple-200"
                                  : "bg-emerald-50 text-emerald-700 border-emerald-200"
                              }`}
                            >
                              ● {ord.statusLabel || ord.status}
                            </span>
                          </div>
                        </div>

                        {/* Middle Content: Book Details & Buyer Details */}
                        <div className="grid gap-6 md:grid-cols-12 py-5 items-center">
                          {/* Book Details (6 cols) */}
                          <div className="md:col-span-6 flex gap-4 items-center">
                            {primary.image ? (
                              <div className="h-20 w-15 shrink-0 overflow-hidden rounded-xl bg-gray-100 border border-black/5 shadow-2xs">
                                <img
                                  src={primary.image}
                                  alt={primary.title}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                            ) : (
                              <div className="h-20 w-15 shrink-0 rounded-xl bg-gradient-to-br from-[#6C4BF4] to-[#8B3FD9] flex items-center justify-center text-xs font-black text-white uppercase shadow-sm">
                                BOOK
                              </div>
                            )}

                            <div className="min-w-0">
                              <h3 className="font-extrabold text-sm text-[#17152A] truncate">
                                {primary.title || "Academic Textbook"}
                              </h3>
                              <p className="text-xs text-gray-500 mt-0.5">Author: {primary.author || "Academic Author"}</p>
                              <div className="flex items-center gap-3 mt-2">
                                <span className="text-xs font-black text-[#6C4BF4]">
                                  Selling Price: ₹{primary.price || ord.subtotal || 299}
                                </span>
                                <span className="rounded bg-gray-100 px-2 py-0.5 text-[10px] font-bold text-gray-600">
                                  {primary.condition || "Like New"}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Buyer & Meetup Details (6 cols) */}
                          <div className="md:col-span-6 rounded-2xl bg-[#F8F7FF] p-4 border border-gray-150 text-xs">
                            <div className="flex items-center justify-between font-bold text-[#17152A] mb-1">
                              <span className="flex items-center gap-1.5">
                                👤 Buyer: {ord.buyer?.name || ord.address?.name || "Student Buyer"}
                              </span>
                              <span className="text-gray-500 flex items-center gap-1">
                                <Phone size={12} /> {ord.buyer?.phone || ord.address?.phone || "+91 98765 43210"}
                              </span>
                            </div>
                            <p className="text-gray-600 flex items-center gap-1 mt-1">
                              <MapPin size={12} className="text-[#6C4BF4] shrink-0" />
                              <span>
                                Meetup / Delivery: {ord.buyer?.meetupSpot || ord.address?.meetupSpot || ord.address?.hostelBlock || "Campus Library Reception"}
                              </span>
                            </p>
                            {ord.courier?.trackingNumber && (
                              <p className="mt-1 text-[11px] text-gray-500">
                                🚚 Logistics: <span className="font-bold text-[#17152A]">{ord.courier.name}</span> ({ord.courier.trackingNumber})
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Bottom Row: Dynamic Seller Confirmation & Status Buttons */}
                        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-gray-100 bg-[#FBFBFE] -mx-6 -mb-6 p-4 rounded-b-3xl">
                          <div className="text-xs text-gray-500 flex items-center gap-2">
                            {isPlaced && (
                              <span className="flex items-center gap-1.5 font-bold text-amber-700">
                                <AlertCircle size={15} /> Action Required: Confirm you have this book ready to pack
                              </span>
                            )}
                            {isConfirmed && (
                              <span className="flex items-center gap-1.5 font-bold text-indigo-700">
                                <CheckCircle2 size={15} /> Book confirmed! Next step: Hand over to courier
                              </span>
                            )}
                            {isShipped && (
                              <span className="flex items-center gap-1.5 font-bold text-blue-700">
                                <Truck size={15} /> In Transit via campus courier network
                              </span>
                            )}
                            {isOut && (
                              <span className="flex items-center gap-1.5 font-bold text-purple-700">
                                <Truck size={15} /> Out for Delivery to buyer's meetup destination
                              </span>
                            )}
                            {isDelivered && (
                              <span className="flex items-center gap-1.5 font-bold text-emerald-700">
                                <CheckCircle2 size={15} /> Order Delivered & Escrow Released to your wallet!
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2.5 flex-wrap">
                            {/* STAGE 1: Confirm Order Button (The exact button user requested) */}
                            {isPlaced && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => handleSellerConfirm(ord.id)}
                                  className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-emerald-700 transition cursor-pointer hover:scale-102"
                                >
                                  <Check size={15} strokeWidth={3} />
                                  <span>Confirm Order (I Have Book)</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleCancelOrder(ord.id)}
                                  className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-bold text-gray-600 hover:bg-red-50 hover:text-red-600 transition cursor-pointer"
                                >
                                  Decline
                                </button>
                              </>
                            )}

                            {/* STAGE 2: Dispatch & Ship Button */}
                            {isConfirmed && (
                              <button
                                type="button"
                                onClick={() => handleOpenDispatchModal(ord)}
                                className="flex items-center gap-1.5 rounded-xl bg-[#6C4BF4] px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-[#5B3DE0] transition cursor-pointer hover:scale-102"
                              >
                                <Truck size={15} />
                                <span>Dispatch & Add Courier AWB</span>
                              </button>
                            )}

                            {/* STAGE 3: Mark Out for Delivery Button */}
                            {isShipped && (
                              <button
                                type="button"
                                onClick={() => handleMarkOutForDelivery(ord.id)}
                                className="flex items-center gap-1.5 rounded-xl bg-purple-600 px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-purple-700 transition cursor-pointer hover:scale-102"
                              >
                                <MapPin size={15} />
                                <span>Mark Out for Delivery</span>
                              </button>
                            )}

                            {/* STAGE 4: Mark Delivered Button */}
                            {isOut && (
                              <button
                                type="button"
                                onClick={() => handleMarkDelivered(ord.id)}
                                className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-emerald-700 transition cursor-pointer hover:scale-102"
                              >
                                <CheckCircle2 size={15} />
                                <span>Confirm Delivery (Release Escrow)</span>
                              </button>
                            )}

                            {/* Link to Live Order Tracking Page */}
                            <Link
                              to={`/orders/${ord.id}/tracking`}
                              target="_blank"
                              className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-xs font-bold text-[#6C4BF4] hover:bg-gray-50 transition cursor-pointer shadow-2xs"
                            >
                              <ExternalLink size={13} />
                              <span>Live Tracking View</span>
                            </Link>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* ================= BUYER PURCHASES VIEW ================= */}
          {viewMode === "purchases" && (
            <div className="space-y-6">
              {/* Navigation Tabs */}
              <div className="flex border-b border-gray-150 gap-6">
                {["All", "Active", "Completed", "Cancelled"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-3 text-sm font-semibold transition-all border-b-2 cursor-pointer ${
                      activeTab === tab
                        ? "border-[#6C4BF4] text-[#6C4BF4]"
                        : "border-transparent text-gray-500 hover:text-gray-800"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Buyer Orders Stack */}
              <div className="space-y-4">
                {filteredBuyerOrders.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 rounded-3xl bg-white border border-gray-150 p-8 text-center">
                    <ShoppingBag size={48} className="text-gray-300 mb-3" />
                    <h3 className="font-bold text-[#17152A] text-lg">No orders found</h3>
                    <p className="text-sm text-gray-400 mt-1">There are no orders matching your current tab.</p>
                  </div>
                ) : (
                  filteredBuyerOrders.map((order) => (
                    <div
                      key={order.id}
                      className="rounded-3xl bg-white border border-gray-150 p-6 shadow-xs flex flex-col md:flex-row gap-6 justify-between items-start md:items-center hover:shadow-md transition"
                    >
                      {/* Left Column: Details */}
                      <div className="flex gap-4">
                        {order.image ? (
                          <div className="h-20 w-14 shrink-0 overflow-hidden rounded-xl bg-gray-100 border border-black/5 shadow-2xs">
                            <img src={order.image} alt={order.title} className="h-full w-full object-cover" />
                          </div>
                        ) : (
                          <div
                            className={`h-20 w-14 shrink-0 rounded-xl bg-gradient-to-br ${order.coverClass} flex items-center justify-center text-[8px] font-extrabold text-white uppercase tracking-wider border border-black/5`}
                          >
                            {order.title.split(" ").map((w) => w[0]).join("")}
                          </div>
                        )}

                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[10px] font-bold text-gray-400">{order.id}</span>
                            <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${order.statusColor}`}>
                              {order.status}
                            </span>
                            {order.totalItemsCount > 1 && (
                              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-gray-100 text-gray-600">
                                +{order.totalItemsCount - 1} more items
                              </span>
                            )}
                          </div>
                          <h3 className="font-bold text-[#17152A] text-sm mt-1.5 truncate">{order.title}</h3>
                          <p className="text-xs text-gray-400 mt-0.5">Author: {order.author}</p>
                          <div className="flex items-center gap-4 mt-2">
                            <span className="text-xs font-bold text-[#6C4BF4]">{order.price}</span>
                            <span className="text-[10px] text-gray-400">Ordered: {order.date}</span>
                          </div>
                        </div>
                      </div>

                      {/* Middle Column: Progress Tracker */}
                      {order.status !== "Cancelled" && (
                        <div className="hidden lg:flex items-center gap-2 w-72">
                          <div className="flex flex-col items-center">
                            <CheckCircle2 size={16} className="text-emerald-500" />
                            <span className="text-[9px] font-semibold text-gray-500 mt-1">Ordered</span>
                          </div>
                          <div className={`h-0.5 flex-1 ${order.step >= 2 ? "bg-emerald-500" : "bg-gray-200"}`} />
                          <div className="flex flex-col items-center">
                            {order.step >= 2 ? (
                              <CheckCircle2 size={16} className="text-emerald-500" />
                            ) : (
                              <Clock size={16} className="text-amber-500 animate-pulse" />
                            )}
                            <span className="text-[9px] font-semibold text-gray-500 mt-1">
                              {order.shippingMethod === "pickup" ? "Meetup" : "In Transit"}
                            </span>
                          </div>
                          <div className={`h-0.5 flex-1 ${order.step >= 3 ? "bg-emerald-500" : "bg-gray-200"}`} />
                          <div className="flex flex-col items-center">
                            {order.step >= 3 ? (
                              <CheckCircle2 size={16} className="text-emerald-500" />
                            ) : (
                              <Truck size={16} className="text-gray-300" />
                            )}
                            <span className="text-[9px] font-semibold text-gray-500 mt-1">Delivered</span>
                          </div>
                        </div>
                      )}

                      {/* Right Column: Actions */}
                      <div className="flex gap-2 w-full md:w-auto flex-wrap sm:flex-nowrap">
                        {order.status === "Meetup Scheduled" && (
                          <button
                            onClick={() => setSelectedSeller(order)}
                            className="flex-1 md:flex-initial flex items-center justify-center gap-1.5 rounded-xl bg-[#F0ECFF] text-[#6C4BF4] px-3.5 py-2.5 text-xs font-bold hover:bg-[#E9E4FF] cursor-pointer transition shadow-2xs"
                          >
                            <Eye size={14} />
                            Seller Details
                          </button>
                        )}
                        <Link
                          to={`/orders/${order.id}/tracking`}
                          className="flex-1 md:flex-initial flex items-center justify-center gap-1.5 rounded-xl bg-[#6C4BF4] text-white px-4 py-2.5 text-xs font-bold hover:bg-[#5B3DE0] cursor-pointer shadow-xs shadow-[#6C4BF4]/20 transition"
                        >
                          <Truck size={14} />
                          Live Track
                        </Link>
                        <button
                          onClick={() => openInvoice(order)}
                          className="flex-1 md:flex-initial flex items-center justify-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-xs font-bold text-gray-600 hover:text-[#6C4BF4] hover:bg-gray-50 cursor-pointer transition shadow-2xs"
                        >
                          <Download size={14} />
                          Invoice
                        </button>
                        <button
                          onClick={() => setSelectedHelpOrder(order)}
                          title="Need Help / Escrow Support"
                          className="flex items-center justify-center p-2.5 rounded-xl border border-gray-200 bg-white text-gray-400 hover:text-gray-600 hover:bg-gray-50 cursor-pointer"
                        >
                          <HelpCircle size={15} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Seller Dispatch Courier Modal */}
      {dispatchOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-150 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Truck size={18} className="text-[#6C4BF4]" />
                <h3 className="text-sm font-bold text-[#17152A]">Dispatch Book & Add Courier AWB</h3>
              </div>
              <button
                type="button"
                onClick={() => setDispatchOrder(null)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-600 font-bold mb-1">Courier Logistics Partner</label>
                <select
                  value={courierName}
                  onChange={(e) => setCourierName(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 p-2.5 outline-none focus:border-[#6C4BF4] font-medium"
                >
                  <option value="BlueDart Campus Express">BlueDart Campus Express</option>
                  <option value="Delhivery Logistics">Delhivery Logistics</option>
                  <option value="Campus Speed Post">Campus Speed Post</option>
                  <option value="Peer-to-Peer Campus Courier">Peer-to-Peer Campus Courier</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-600 font-bold mb-1">AWB / Courier Tracking Number</label>
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="e.g. BD-9821034-IN"
                  className="w-full rounded-xl border border-gray-200 p-2.5 font-mono text-xs outline-none focus:border-[#6C4BF4]"
                />
              </div>

              <div className="rounded-xl bg-purple-50 p-3 text-[11px] text-purple-900 border border-purple-100">
                <span>💡 Once dispatched, the buyer's order tracking timeline will automatically update to <b>"Shipped"</b> in real time via WebSockets!</span>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setDispatchOrder(null)}
                className="rounded-xl border border-gray-200 px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDispatch}
                className="rounded-xl bg-[#6C4BF4] px-5 py-2 text-xs font-bold text-white shadow-md hover:bg-[#5B3DE0] cursor-pointer"
              >
                Confirm Dispatch
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Invoice Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-150 pb-3 mb-4">
              <div>
                <h3 className="text-base font-bold text-[#17152A]">Order Receipt & Tax Invoice</h3>
                <p className="text-[11px] text-gray-400">Order ID: {selectedInvoice.id}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedInvoice(null)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between text-gray-600">
                <span>Book Title:</span>
                <span className="font-bold text-[#17152A]">{selectedInvoice.title}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Book Price:</span>
                <span>₹{selectedInvoice.subtotal || 299}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery & Logistics:</span>
                <span>₹{selectedInvoice.deliveryFee || 40}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Escrow Trust & Safety:</span>
                <span>₹{selectedInvoice.platformFee || 15}</span>
              </div>
              <div className="flex justify-between border-t border-gray-150 pt-2 text-sm font-extrabold text-[#17152A]">
                <span>Total Paid:</span>
                <span className="text-[#6C4BF4]">{selectedInvoice.price || `₹${selectedInvoice.total || 354}`}</span>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => window.print()}
                className="rounded-xl border border-gray-200 px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-50 cursor-pointer flex items-center gap-1.5"
              >
                <Download size={14} /> Print Receipt
              </button>
              <button
                type="button"
                onClick={() => setSelectedInvoice(null)}
                className="rounded-xl bg-[#6C4BF4] px-4 py-2 text-xs font-bold text-white cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
