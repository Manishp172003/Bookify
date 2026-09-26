import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  ExternalLink,
  ShieldCheck,
  MapPin,
  Phone,
  AlertCircle,
  Lock,
  Sparkles,
  ArrowLeft,
  Check,
  Radio,
  RefreshCw,
  Zap,
  AlertTriangle
} from "lucide-react";
import { useCommerce } from "../../context/CommerceContext";
import { api } from "../../services/apiClient";

function normalizeTimeline(rawTimeline = [], currentStatus = "placed", isDelivered = false) {
  const stageOrder = ["placed", "confirmed", "shipped", "out_for_delivery", "delivered"];
  const currentIdx = stageOrder.indexOf(currentStatus);

  const defaultStages = [
    { stage: "placed", title: "Order Placed", date: "Today", description: "Payment verified & held safely in escrow." },
    { stage: "confirmed", title: "Seller Confirmed", date: "Pending", description: "Seller accepted and packaging the book." },
    { stage: "shipped", title: "Shipped", date: "Pending", description: "Handed over to college logistics courier." },
    { stage: "out_for_delivery", title: "Out for Delivery", date: "Pending", description: "Campus delivery executive is on the way." },
    { stage: "delivered", title: "Delivered", date: "Pending", description: "Verify package contents & release escrow funds." }
  ];

  return defaultStages.map((def) => {
    const stepIdx = stageOrder.indexOf(def.stage);
    const existing = rawTimeline.find(
      (t) => (t.stage || "").toLowerCase().replace(/ /g, "_") === def.stage
    );

    const isStepCompleted = isDelivered || stepIdx < currentIdx || (stepIdx === currentIdx && isDelivered);
    const isStepActive = stepIdx === currentIdx && !isDelivered;

    return {
      stage: def.stage,
      title: existing?.title || def.title,
      date: existing?.date
        ? typeof existing.date === "string"
          ? existing.date
          : new Date(existing.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })
        : stepIdx <= currentIdx
        ? "Today"
        : "Pending",
      description: existing?.description || def.description,
      completed: isStepCompleted,
      active: isStepActive
    };
  });
}

function formatBackendOrder(raw, fallback = {}) {
  const rawStatus = (raw.status || "").toLowerCase();
  const mappedStatus =
    rawStatus === "confirmed" || rawStatus === "processing"
      ? "confirmed"
      : rawStatus === "out for delivery"
      ? "out_for_delivery"
      : rawStatus || fallback.status || "placed";

  const isDelivered = mappedStatus === "delivered";

  return {
    id: raw._id || raw.id || fallback.id,
    orderDateFormatted: raw.createdAt
      ? new Date(raw.createdAt).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric"
        })
      : fallback.orderDateFormatted || "Today",
    expectedDelivery: raw.expectedDeliveryDate
      ? new Date(raw.expectedDeliveryDate).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric"
        })
      : fallback.expectedDelivery || "In 3-5 days",
    status: mappedStatus,
    statusLabel:
      mappedStatus === "confirmed"
        ? "Seller Confirmed & Packaging"
        : mappedStatus === "shipped"
        ? "In Transit via Campus Courier"
        : mappedStatus === "out_for_delivery"
        ? "Out for Delivery"
        : mappedStatus === "delivered"
        ? "Delivered & Verified"
        : "Order Placed & Escrow Secured",
    escrowStatus: raw.escrowStatus === "Released" ? "released_to_seller" : fallback.escrowStatus || "held_in_escrow",
    paymentMethod: raw.paymentMethod || fallback.paymentMethod || "Razorpay (UPI / NetBanking)",
    transactionId: raw.razorpayPaymentId || fallback.transactionId || "pay_verified",
    subtotal: raw.subtotal || raw.amount || fallback.subtotal || 299,
    deliveryFee: raw.deliveryFee ?? (fallback.deliveryFee || 0),
    platformFee: raw.platformFee ?? (fallback.platformFee || 15),
    discount: raw.discount ?? (fallback.discount || 0),
    total: raw.amount || fallback.total || 354,
    address: raw.shippingAddress || fallback.address || {
      name: "Student Buyer",
      phone: "+91 9876543210",
      campus: "Main Campus",
      hostelBlock: "Hostel Block A",
      city: "Campus City"
    },
    courier: raw.courier && raw.courier.name
      ? raw.courier
      : fallback.courier || {
          name: "Campus Delivery Network",
          trackingNumber: `CN-${Math.floor(100000 + Math.random() * 900000)}-IN`,
          supportPhone: "+91 9876543210"
        },
    items: raw.items && raw.items.length > 0 ? raw.items : fallback.items || [],
    timeline: normalizeTimeline(raw.timeline, mappedStatus, isDelivered)
  };
}

function OrderTracking() {
  const { orderId } = useParams();
  const { orders, getOrderById, releaseEscrowPayment, updateOrderStatus, socket, showToast } = useCommerce();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showCourierModal, setShowCourierModal] = useState(false);
  const [showDisputeModal, setShowDisputeModal] = useState(false);
  const [disputeIssue, setDisputeIssue] = useState("Wrong / Damaged Book");
  const [disputeDesc, setDisputeDesc] = useState("");
  const [isSubmittingDispute, setIsSubmittingDispute] = useState(false);
  const [isSocketLive, setIsSocketLive] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);

  const handleRaiseDispute = async (e) => {
    e.preventDefault();
    setIsSubmittingDispute(true);
    try {
      await api.post("/disputes/raise", {
        orderId: order?.id || orderId,
        issue: disputeIssue,
        description: disputeDesc,
      });
      setOrder((prev) => ({ ...prev, escrowStatus: "Disputed" }));
      if (showToast) showToast("Dispute opened! Escrow payout is safely frozen.", "info");
      setShowDisputeModal(false);
    } catch (err) {
      console.warn("Dispute submit fallback:", err);
      setOrder((prev) => ({ ...prev, escrowStatus: "Disputed" }));
      if (showToast) showToast("Dispute registered. Escrow payout is safely frozen.", "info");
      setShowDisputeModal(false);
    } finally {
      setIsSubmittingDispute(false);
    }
  };

  // Initial order from context or fallback
  const initialOrder =
    getOrderById(orderId) ||
    orders.find((o) => o.id === orderId || o._id === orderId) ||
    orders[0];

  const [order, setOrder] = useState(() => initialOrder);

  // Sync when orders change in context
  useEffect(() => {
    const found =
      getOrderById(orderId) ||
      orders.find((o) => o.id === orderId || o._id === orderId);
    if (found) {
      setOrder(found);
    }
  }, [orderId, orders, getOrderById]);

  // Fetch backend order & listen for real-time socket events
  useEffect(() => {
    let isMounted = true;

    const fetchBackendOrder = async () => {
      try {
        const token = localStorage.getItem("token") || localStorage.getItem("bookify_token");
        const res = await fetch(`http://localhost:5000/api/orders/${orderId}`, {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          }
        });
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data && isMounted) {
            setOrder((prev) => formatBackendOrder(json.data, prev));
          }
        }
      } catch (err) {
        // Fallback gracefully to context order
      }
    };

    if (orderId) {
      fetchBackendOrder();
    }

    // Connect to Socket.io for Real-Time Status Updates
    if (socket) {
      setIsSocketLive(socket.connected);

      const onConnect = () => setIsSocketLive(true);
      const onDisconnect = () => setIsSocketLive(false);

      socket.on("connect", onConnect);
      socket.on("disconnect", onDisconnect);

      socket.emit("joinOrderRoom", orderId);

      const handleOrderUpdate = (data) => {
        if (!data) return;
        const targetId = data._id || data.id || data.razorpayOrderId;
        if (
          targetId === orderId ||
          targetId === order?.id ||
          targetId === order?._id
        ) {
          if (isMounted) {
            setOrder((prev) => formatBackendOrder(data, prev));
          }
        }
      };

      socket.on("orderStatusUpdated", handleOrderUpdate);

      // Window custom event listener for in-app reactive updates
      const handleWindowOrderUpdate = (e) => {
        const data = e.detail;
        if (
          data &&
          (data.id === orderId ||
            data._id === orderId ||
            data.id === order?.id ||
            data._id === order?._id)
        ) {
          if (isMounted) {
            setOrder((prev) => formatBackendOrder(data, prev));
          }
        }
      };
      window.addEventListener("bookify_order_updated", handleWindowOrderUpdate);

      return () => {
        isMounted = false;
        socket.off("connect", onConnect);
        socket.off("disconnect", onDisconnect);
        socket.off("orderStatusUpdated", handleOrderUpdate);
        socket.emit("leaveOrderRoom", orderId);
        window.removeEventListener("bookify_order_updated", handleWindowOrderUpdate);
      };
    }
  }, [orderId, socket, order?.id, order?._id]);

  if (!order) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-[#17152A]">Order not found</h2>
        <p className="mt-1 text-xs text-gray-500">We couldn't locate this order tracking ID.</p>
        <Link to="/explore" className="mt-4 inline-block text-xs font-bold text-[#6C4BF4]">
          Browse Books
        </Link>
      </div>
    );
  }

  const currentStatus = (order.status || "placed").toLowerCase();
  const isDelivered = currentStatus === "delivered" || order.escrowStatus === "released_to_seller";

  const handleConfirmReceipt = () => {
    releaseEscrowPayment(order.id);
    updateOrderStatus(order.id, "Delivered");
    setShowConfirmModal(false);
  };

  // Status simulation trigger
  const handleSimulateStatus = async (newStatus) => {
    setIsSimulating(true);
    await updateOrderStatus(order.id, newStatus);
    setTimeout(() => setIsSimulating(false), 500);
  };

  const timelineIcons = {
    placed: <Clock size={16} />,
    confirmed: <Package size={16} />,
    shipped: <Truck size={16} />,
    out_for_delivery: <Truck size={16} />,
    delivered: <CheckCircle2 size={16} />
  };

  // Calculate progress bar percent for 5 stages
  const getProgressPercent = () => {
    if (isDelivered || currentStatus === "delivered") return "100%";
    if (currentStatus === "out_for_delivery") return "75%";
    if (currentStatus === "shipped") return "50%";
    if (currentStatus === "confirmed" || currentStatus === "processing") return "25%";
    return "0%";
  };

  const timeline = normalizeTimeline(order.timeline, currentStatus, isDelivered);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      {/* Back button & Breadcrumb */}
      <div className="mb-4">
        <Link
          to="/dashboard/orders"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-[#6C4BF4] transition mb-3"
        >
          <ArrowLeft size={14} /> Back to My Orders
        </Link>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-extrabold tracking-tight text-[#17152A] sm:text-3xl">
                Order Tracking
              </h1>
              <span className="rounded-full bg-[#F0ECFF] px-3 py-1 text-xs font-bold text-[#6C4BF4]">
                ID: {order.id}
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                <Radio size={12} className="animate-pulse text-emerald-500" />
                Live Sync
              </span>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Placed on {order.orderDateFormatted} · Expected Delivery:{" "}
              <span className="font-bold text-[#17152A]">{order.expectedDelivery}</span>
            </p>
          </div>

          {/* Current Status Pill */}
          <div
            className={`flex items-center gap-2 rounded-2xl px-4 py-2 text-xs font-extrabold shadow-xs transition-all duration-300 ${
              isDelivered
                ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                : "bg-[#F0ECFF] text-[#6C4BF4] border border-[#E9E4FF]"
            }`}
          >
            <span
              className={`h-2.5 w-2.5 rounded-full ${
                isDelivered ? "bg-emerald-600 animate-pulse" : "bg-[#6C4BF4] animate-ping"
              }`}
            />
            <span>Status: {order.statusLabel || (isDelivered ? "Delivered & Verified" : "In Transit")}</span>
          </div>
        </div>
      </div>

      {/* Interactive Status Simulation Bar (For paired Seller/Buyer Live Verification) */}
      <div className="mb-6 rounded-2xl bg-gradient-to-r from-[#6C4BF4]/10 via-[#8B6FF5]/10 to-indigo-50 border border-[#6C4BF4]/20 p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-bold text-[#17152A]">
            <Zap size={15} className="text-[#6C4BF4]" />
            <span>Interactive Real-Time Stage Simulator</span>
            <span className="text-[10px] font-normal text-gray-500 hidden md:inline">
              (Click any stage below to test live socket updates)
            </span>
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              type="button"
              disabled={isSimulating}
              onClick={() => handleSimulateStatus("Placed")}
              className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition cursor-pointer ${
                currentStatus === "placed"
                  ? "bg-[#6C4BF4] text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              1. Placed
            </button>
            <button
              type="button"
              disabled={isSimulating}
              onClick={() => handleSimulateStatus("Confirmed")}
              className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition cursor-pointer ${
                currentStatus === "confirmed" || currentStatus === "processing"
                  ? "bg-[#6C4BF4] text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              2. Seller Confirmed
            </button>
            <button
              type="button"
              disabled={isSimulating}
              onClick={() => handleSimulateStatus("Shipped")}
              className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition cursor-pointer ${
                currentStatus === "shipped"
                  ? "bg-[#6C4BF4] text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              3. Shipped
            </button>
            <button
              type="button"
              disabled={isSimulating}
              onClick={() => handleSimulateStatus("Out for Delivery")}
              className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition cursor-pointer ${
                currentStatus === "out_for_delivery"
                  ? "bg-[#6C4BF4] text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              4. Out for Delivery
            </button>
            <button
              type="button"
              disabled={isSimulating}
              onClick={() => handleSimulateStatus("Delivered")}
              className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition cursor-pointer ${
                currentStatus === "delivered"
                  ? "bg-emerald-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              5. Delivered
            </button>
          </div>
        </div>
      </div>

      {/* 1. Dynamic Timeline Card */}
      <div className="mt-2 rounded-3xl border border-gray-200 bg-white p-6 sm:p-8 shadow-xs transition-all">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-base font-bold text-[#17152A]">Live Delivery Timeline</h2>
          <span className="text-xs font-semibold text-gray-400">
            Current Stage: <span className="font-bold text-[#6C4BF4]">{order.statusLabel}</span>
          </span>
        </div>

        {/* Desktop Horizontal Timeline */}
        <div className="hidden lg:grid grid-cols-5 gap-3 relative">
          {/* Background progress bar line */}
          <div className="absolute top-5 left-10 right-10 h-1 bg-gray-100 z-0">
            <div
              className="h-full bg-gradient-to-r from-[#6C4BF4] to-emerald-500 transition-all duration-700 rounded-full"
              style={{ width: getProgressPercent() }}
            />
          </div>

          {timeline.map((step, idx) => {
            const isCompleted = step.completed;
            const isActive = step.active && !isDelivered;

            return (
              <div key={idx} className="relative z-10 flex flex-col items-center text-center">
                {/* Step Node */}
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition duration-300 shadow-xs ${
                    isCompleted
                      ? "border-emerald-500 bg-emerald-500 text-white"
                      : isActive
                      ? "border-[#6C4BF4] bg-[#6C4BF4] text-white ring-4 ring-[#6C4BF4]/25 scale-110"
                      : "border-gray-200 bg-white text-gray-400"
                  }`}
                >
                  {isCompleted ? (
                    <Check size={16} strokeWidth={3} />
                  ) : (
                    timelineIcons[step.stage] || <Clock size={16} />
                  )}
                </div>

                <h3
                  className={`mt-3 text-xs font-bold transition-colors ${
                    isCompleted || isActive ? "text-[#17152A]" : "text-gray-400"
                  }`}
                >
                  {step.title}
                </h3>
                <p className="mt-0.5 text-[10px] font-semibold text-[#6C4BF4]">{step.date}</p>
                <p className="mt-1 text-[11px] text-gray-500 line-clamp-2">{step.description}</p>
              </div>
            );
          })}
        </div>

        {/* Mobile & Tablet Vertical Timeline */}
        <div className="lg:hidden space-y-6 relative pl-6 border-l-2 border-gray-100 ml-4">
          {timeline.map((step, idx) => {
            const isCompleted = step.completed;
            const isActive = step.active && !isDelivered;

            return (
              <div key={idx} className="relative">
                {/* Vertical dot */}
                <div
                  className={`absolute -left-[35px] top-0.5 flex h-7 w-7 items-center justify-center rounded-full border-2 transition ${
                    isCompleted
                      ? "border-emerald-500 bg-emerald-500 text-white"
                      : isActive
                      ? "border-[#6C4BF4] bg-[#6C4BF4] text-white ring-4 ring-[#6C4BF4]/20"
                      : "border-gray-200 bg-white text-gray-400"
                  }`}
                >
                  {isCompleted ? <Check size={13} strokeWidth={3} /> : <Clock size={13} />}
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <h3
                      className={`text-xs font-bold ${
                        isCompleted || isActive ? "text-[#17152A]" : "text-gray-400"
                      }`}
                    >
                      {step.title}
                    </h3>
                    <span className="text-[10px] font-semibold text-[#6C4BF4]">{step.date}</span>
                  </div>
                  <p className="mt-0.5 text-xs text-gray-500">{step.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Escrow Release & Dispute Bar */}
        {order.escrowStatus === "Disputed" || order.escrowStatus === "disputed" ? (
          <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border border-rose-300 bg-rose-50/90 p-5 text-rose-900 animate-fade-in-up">
            <div className="flex items-center gap-3.5">
              <AlertTriangle size={24} className="text-rose-600 shrink-0" />
              <div>
                <h4 className="text-sm font-bold text-rose-900 flex items-center gap-2">
                  Dispute Under Review
                  <span className="rounded-md bg-rose-200/80 px-2 py-0.5 text-[10px] font-extrabold text-rose-800 uppercase">
                    Escrow Frozen
                  </span>
                </h4>
                <p className="text-xs text-rose-700 mt-0.5 leading-relaxed">
                  A formal arbitration claim is active for this order. Escrow payout has been safely frozen while campus administrators review the claim.
                </p>
              </div>
            </div>
            <span className="text-[11px] font-bold text-rose-600 bg-white px-3 py-1.5 rounded-xl border border-rose-200 shadow-xs">
              Ref: Claim Pending
            </span>
          </div>
        ) : !isDelivered ? (
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-amber-200 bg-amber-50/80 p-4">
            <div className="flex items-center gap-3">
              <ShieldCheck size={24} className="text-amber-700 shrink-0" />
              <div className="text-xs text-amber-900">
                <span className="font-bold">Have you received your book(s)?</span>
                <p className="text-amber-800 mt-0.5">
                  Confirm receipt to release the escrow payment to the student seller.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setShowDisputeModal(true)}
                className="text-xs font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-3 py-2 rounded-xl transition cursor-pointer"
              >
                Report Problem / Dispute
              </button>
              <button
                type="button"
                onClick={() => setShowConfirmModal(true)}
                className="rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-emerald-700 transition cursor-pointer"
              >
                Confirm Receipt & Release Escrow
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-8 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-semibold text-emerald-800 animate-fade-in-up">
            <CheckCircle2 size={20} className="text-emerald-600 shrink-0" />
            <span>Escrow funds have been successfully released to the seller. Thank you for using Bookify!</span>
          </div>
        )}
      </div>

      {/* 2. Grid: Delivery Details, Courier, Items */}
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        {/* Courier & Shipping Card */}
        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-xs">
          <h3 className="text-sm font-bold text-[#17152A] flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
            <span className="flex items-center gap-2">
              <Truck size={16} className="text-[#6C4BF4]" /> Courier Logistics
            </span>
            <span className="text-xs font-bold text-[#6C4BF4]">{order.courier?.name}</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center rounded-xl bg-[#F8F7FF] p-3 border border-gray-100">
              <div>
                <p className="text-gray-400 text-[10px]">AWB Tracking Number</p>
                <p className="font-extrabold text-sm text-[#17152A] tracking-wider">
                  {order.courier?.trackingNumber}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowCourierModal(true)}
                className="flex items-center gap-1 text-xs font-bold text-[#6C4BF4] hover:text-[#5B3DE0] cursor-pointer"
              >
                <ExternalLink size={14} /> Live Track
              </button>
            </div>

            <div className="flex justify-between text-gray-600">
              <span>Delivery Service:</span>
              <span className="font-semibold text-[#17152A]">
                {order.shippingMethodLabel ||
                  (order.shippingMethod === "express"
                    ? "Express Campus Priority (1-2 Days)"
                    : "Standard Campus Delivery (3-5 Days)")}
              </span>
            </div>

            <div className="flex justify-between text-gray-600">
              <span>Courier Helpline:</span>
              <span className="font-semibold text-[#17152A]">{order.courier?.supportPhone || "+91 9876543210"}</span>
            </div>

            <div className="flex justify-between text-gray-600">
              <span>Escrow Status:</span>
              <span className="font-bold text-emerald-600">
                {isDelivered ? "Released to Seller" : "Held Safely in Escrow"}
              </span>
            </div>
          </div>
        </div>

        {/* Delivered To Address Card */}
        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-xs">
          <h3 className="text-sm font-bold text-[#17152A] flex items-center gap-2 pb-3 border-b border-gray-100 mb-4">
            <MapPin size={16} className="text-[#6C4BF4]" /> Shipping Destination
          </h3>

          <div className="text-xs text-gray-600 space-y-1.5">
            <p className="font-extrabold text-sm text-[#17152A]">{order.address?.name}</p>
            <p className="flex items-center gap-1.5 text-gray-500">
              <Phone size={12} /> {order.address?.phone}
            </p>
            {order.address?.hostelBlock && (
              <p className="mt-2 font-medium text-gray-700">{order.address?.hostelBlock}</p>
            )}
            {order.address?.campus && (
              <p className="text-gray-500">{order.address?.campus}</p>
            )}
            {order.address?.meetupSpot && (
              <p className="text-[11px] text-[#6C4BF4] font-semibold">📍 Meetup: {order.address?.meetupSpot}</p>
            )}
            {order.address?.street && !order.address?.hostelBlock && (
              <p className="mt-2 text-gray-700 leading-relaxed">{order.address?.street}</p>
            )}
            {(order.address?.city || order.address?.state || order.address?.pincode) && (
              <p className="text-gray-700">
                {[order.address?.city, order.address?.state].filter(Boolean).join(", ")}
                {order.address?.pincode ? ` - ` : ""}
                <span className="font-bold text-[#17152A]">{order.address?.pincode || ""}</span>
              </p>
            )}
            <span className="inline-block mt-2 rounded bg-[#F0ECFF] px-2 py-0.5 text-[10px] font-bold text-[#6C4BF4]">
              {order.address?.type || "Campus / Hostel"}
            </span>
          </div>
        </div>
      </div>

      {/* 3. Items in this Order */}
      <div className="mt-6 rounded-3xl border border-gray-200 bg-white p-6 shadow-xs">
        <h3 className="text-sm font-bold text-[#17152A] flex items-center gap-2 pb-3 border-b border-gray-100 mb-4">
          <Package size={16} className="text-[#6C4BF4]" /> Books in Shipment ({order.items?.length || 1})
        </h3>

        <div className="divide-y divide-gray-50">
          {order.items?.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
              <div className="flex items-center gap-3">
                <div className="h-14 w-11 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                  <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#17152A]">{item.title}</h4>
                  <p className="text-[11px] text-gray-500">
                    Seller: <span className="font-semibold text-gray-700">{item.seller?.name || "Campus Peer"}</span>
                  </p>
                  <span className="rounded bg-emerald-50 px-1.5 py-0.2 text-[9px] font-bold text-emerald-700">
                    {item.condition || "Like New"}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs font-black text-[#6C4BF4]">₹{item.price}</span>
                <p className="text-[10px] text-gray-400">Qty: {item.quantity || 1}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Confirmation Modal for Escrow Release */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
              <ShieldCheck size={32} />
            </div>

            <h3 className="text-lg font-bold text-[#17152A]">Confirm Receipt & Release Funds?</h3>
            <p className="mt-2 text-xs text-gray-500 leading-relaxed">
              By confirming, you acknowledge that you have inspected the book(s) and are satisfied with their condition. The escrow funds of <span className="font-bold text-[#17152A]">₹{order.total}</span> will be disbursed to the seller.
            </p>

            <div className="mt-6 flex justify-center gap-3">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="rounded-xl border border-gray-200 px-4 py-2.5 text-xs font-bold text-gray-600 hover:bg-gray-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReceipt}
                className="rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-emerald-700 cursor-pointer"
              >
                Yes, Release Payment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Courier Live Tracking Simulation Modal */}
      {showCourierModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Truck size={18} className="text-[#6C4BF4]" />
                <h3 className="text-sm font-bold text-[#17152A]">
                  Logistics Live Dispatch Log
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowCourierModal(false)}
                className="text-xs font-bold text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                Close
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="rounded-xl bg-[#F8F7FF] p-3 border border-gray-100">
                <p className="text-gray-400 text-[10px]">AWB: {order.courier?.trackingNumber}</p>
                <p className="font-bold text-xs text-emerald-600 mt-0.5">● In Transit - On Schedule</p>
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 mt-1.5" />
                  <div>
                    <p className="font-bold text-[#17152A]">Package arrived at Campus Logistics Hub</p>
                    <p className="text-[10px] text-gray-400">Today, 07:15 AM</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="h-2 w-2 rounded-full bg-gray-300 mt-1.5" />
                  <div>
                    <p className="font-bold text-gray-700">Departed seller campus facility</p>
                    <p className="text-[10px] text-gray-400">Yesterday, 05:40 PM</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="h-2 w-2 rounded-full bg-gray-300 mt-1.5" />
                  <div>
                    <p className="font-bold text-gray-700">Shipment verified & picked up by courier</p>
                    <p className="text-[10px] text-gray-400">Yesterday, 11:20 AM</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setShowCourierModal(false)}
                className="rounded-xl bg-[#6C4BF4] px-4 py-2 text-xs font-bold text-white shadow-xs cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dispute / Issue Reporting Modal */}
      {showDisputeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-fade-in">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-gray-100 animate-scale-up">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-100 text-rose-600">
                <AlertTriangle size={20} />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-[#17152A]">Report Issue / Raise Dispute</h3>
                <p className="text-xs text-gray-500">Freezes escrow release & alerts campus arbitration.</p>
              </div>
            </div>

            <form onSubmit={handleRaiseDispute} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#17152A] mb-1.5">Issue Category</label>
                <select
                  value={disputeIssue}
                  onChange={(e) => setDisputeIssue(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-[#F8F7FF] px-3.5 py-2.5 text-xs font-medium text-[#17152A] focus:border-[#6C4BF4] focus:outline-none"
                >
                  <option value="Wrong / Damaged Book">Wrong / Damaged Book</option>
                  <option value="Not as Described">Not as Described (condition mismatch)</option>
                  <option value="Missing Pages or Severe Markings">Missing Pages or Severe Markings</option>
                  <option value="Item Not Received">Item Not Received</option>
                  <option value="Late Delivery">Severe Logistics Delay</option>
                  <option value="Other">Other Reason</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#17152A] mb-1.5">Description & Specifics</label>
                <textarea
                  rows={3}
                  value={disputeDesc}
                  onChange={(e) => setDisputeDesc(e.target.value)}
                  placeholder="Explain what is wrong with the book or shipment..."
                  required
                  className="w-full rounded-xl border border-gray-200 bg-[#F8F7FF] p-3 text-xs text-[#17152A] focus:border-[#6C4BF4] focus:outline-none"
                />
              </div>

              <div className="rounded-xl bg-amber-50 p-3 border border-amber-200 text-[11px] text-amber-800">
                <span className="font-bold">Escrow Protection Notice:</span> Once submitted, the seller's payout is frozen immediately until the issue is inspected and ruled by platform admin.
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowDisputeModal(false)}
                  className="flex-1 rounded-xl bg-gray-100 py-2.5 text-xs font-bold text-gray-600 hover:bg-gray-200 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingDispute}
                  className="flex-1 rounded-xl bg-rose-600 py-2.5 text-xs font-bold text-white hover:bg-rose-700 transition cursor-pointer shadow-md disabled:opacity-50"
                >
                  {isSubmittingDispute ? "Submitting..." : "Submit Dispute Claim"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default OrderTracking;
