import { useState } from "react";
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
  Check
} from "lucide-react";
import { useCommerce } from "../../context/CommerceContext";

function OrderTracking() {
  const { orderId } = useParams();
  const { orders, getOrderById, releaseEscrowPayment } = useCommerce();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showCourierModal, setShowCourierModal] = useState(false);

  const order = getOrderById(orderId) || orders[0];

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

  const isDelivered = order.status === "delivered" || order.escrowStatus === "released_to_seller";

  const handleConfirmReceipt = () => {
    releaseEscrowPayment(order.id);
    setShowConfirmModal(false);
  };

  const timelineIcons = {
    placed: <Clock size={16} />,
    confirmed: <Package size={16} />,
    shipped: <Truck size={16} />,
    out_for_delivery: <Truck size={16} />,
    delivered: <CheckCircle2 size={16} />
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      {/* Back button & Breadcrumb */}
      <div className="mb-4">
        <Link
          to="/cart"
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
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Placed on {order.orderDateFormatted} · Expected Delivery:{" "}
              <span className="font-bold text-[#17152A]">{order.expectedDelivery}</span>
            </p>
          </div>

          {/* Current Status Pill */}
          <div
            className={`flex items-center gap-2 rounded-2xl px-4 py-2 text-xs font-extrabold shadow-xs ${
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
            <span>Status: {isDelivered ? "Delivered & Verified" : order.statusLabel || "In Transit"}</span>
          </div>
        </div>
      </div>

      {/* 1. Timeline Card */}
      <div className="mt-6 rounded-3xl border border-gray-200 bg-white p-6 sm:p-8 shadow-xs">
        <h2 className="text-base font-bold text-[#17152A] mb-6">Delivery Progress</h2>

        {/* Desktop Horizontal Timeline */}
        <div className="hidden lg:grid grid-cols-5 gap-3 relative">
          {/* Background progress bar line */}
          <div className="absolute top-5 left-8 right-8 h-1 bg-gray-100 z-0">
            <div
              className="h-full bg-[#6C4BF4] transition-all duration-700"
              style={{
                width: isDelivered
                  ? "100%"
                  : order.status === "out_for_delivery"
                  ? "75%"
                  : order.status === "shipped"
                  ? "50%"
                  : "25%"
              }}
            />
          </div>

          {order.timeline?.map((step, idx) => {
            const isCompleted = step.completed;
            const isActive = step.active && !isDelivered;

            return (
              <div key={idx} className="relative z-10 flex flex-col items-center text-center">
                {/* Step Node */}
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition shadow-xs ${
                    isCompleted
                      ? "border-emerald-500 bg-emerald-500 text-white"
                      : isActive
                      ? "border-[#6C4BF4] bg-[#6C4BF4] text-white ring-4 ring-[#6C4BF4]/20"
                      : "border-gray-200 bg-white text-gray-400"
                  }`}
                >
                  {isCompleted ? <Check size={16} strokeWidth={3} /> : timelineIcons[step.stage] || <Clock size={16} />}
                </div>

                <h3
                  className={`mt-3 text-xs font-bold ${
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
          {order.timeline?.map((step, idx) => {
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

        {/* Escrow Release CTA Bar */}
        {!isDelivered ? (
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-amber-200 bg-amber-50/80 p-4">
            <div className="flex items-center gap-3">
              <ShieldCheck size={24} className="text-amber-700 shrink-0" />
              <div className="text-xs text-amber-900">
                <span className="font-bold">Have you received your book(s)?</span>
                <p className="text-amber-800 mt-0.5">
                  Confirm receipt to release the payment from Escrow to the student seller.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowConfirmModal(true)}
              className="shrink-0 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-emerald-700 transition cursor-pointer"
            >
              Confirm Receipt & Release Escrow
            </button>
          </div>
        ) : (
          <div className="mt-8 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-semibold text-emerald-800">
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
              <span className="font-semibold text-[#17152A]">{order.shippingMethodLabel}</span>
            </div>

            <div className="flex justify-between text-gray-600">
              <span>Courier Helpline:</span>
              <span className="font-semibold text-[#17152A]">{order.courier?.supportPhone}</span>
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
            <p className="mt-2 text-gray-700 leading-relaxed">{order.address?.street}</p>
            <p className="text-gray-700">
              {order.address?.city}, {order.address?.state} -{" "}
              <span className="font-bold text-[#17152A]">{order.address?.pincode}</span>
            </p>
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
                    Seller: <span className="font-semibold text-gray-700">{item.seller?.name}</span>
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
                  Delhivery Logistics Live Dispatch Log
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
                    <p className="font-bold text-[#17152A]">Package arrived at Delhi North Hub</p>
                    <p className="text-[10px] text-gray-400">24 Aug 2026, 07:15 AM</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="h-2 w-2 rounded-full bg-gray-300 mt-1.5" />
                  <div>
                    <p className="font-bold text-gray-700">Departed seller campus facility</p>
                    <p className="text-[10px] text-gray-400">23 Aug 2026, 05:40 PM</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="h-2 w-2 rounded-full bg-gray-300 mt-1.5" />
                  <div>
                    <p className="font-bold text-gray-700">Shipment picked up by courier</p>
                    <p className="text-[10px] text-gray-400">23 Aug 2026, 11:20 AM</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setShowCourierModal(false)}
                className="rounded-xl bg-[#6C4BF4] px-4 py-2 text-xs font-bold text-white shadow-xs"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OrderTracking;
