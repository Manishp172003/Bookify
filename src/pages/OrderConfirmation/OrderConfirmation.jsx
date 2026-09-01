import { useLocation, Link, useNavigate } from "react-router-dom";
import { CheckCircle2, ShieldCheck, Truck, Package, ArrowRight, ShoppingBag, MapPin, Calendar, Clock, Lock, Sparkles } from "lucide-react";
import { useCommerce } from "../../context/CommerceContext";

function OrderConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { orders, getOrderById } = useCommerce();

  // Retrieve order from route state or fall back to most recent order
  const orderId = location.state?.orderId || (orders.length > 0 ? orders[0].id : "BK12345678");
  const order = getOrderById(orderId) || orders[0];

  if (!order) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-[#17152A]">No recent order found</h2>
        <Link to="/explore" className="mt-4 inline-block text-sm font-bold text-[#6C4BF4]">
          Return to Explore Books
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 animate-settle-up">
      {/* 1. Success Hero Box */}
      <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white p-8 text-center shadow-md relative">
        {/* Decorative background glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 h-48 w-48 rounded-full bg-[#6C4BF4]/10 blur-3xl" />

        <div className="relative z-10">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-100 text-emerald-600 shadow-lg shadow-emerald-500/20 animate-bounce">
            <CheckCircle2 size={44} strokeWidth={2.5} />
          </div>

          <span className="inline-flex items-center gap-1 rounded-full bg-[#F0ECFF] px-3 py-1 text-xs font-extrabold text-[#6C4BF4]">
            <Sparkles size={13} /> Order Placed Successfully
          </span>

          <h1 className="mt-3 text-3xl font-black tracking-tight text-[#17152A] sm:text-4xl">
            Thank You for Your Order!
          </h1>

          <p className="mt-2 text-xs sm:text-sm text-gray-500 max-w-md mx-auto">
            Your payment is safely guarded in <span className="font-bold text-[#6C4BF4]">Bookify Escrow</span>. The seller has been notified to package and dispatch your books.
          </p>

          {/* Dynamic Order ID pill */}
          <div className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-[#F8F7FF] border border-gray-200 px-4 py-2 text-xs">
            <span className="text-gray-400">Order ID:</span>
            <span className="font-extrabold text-[#17152A] tracking-wider">{order.id}</span>
          </div>
        </div>
      </div>

      {/* 2. Escrow Status Highlight Card */}
      <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-3xl border border-[#E9E4FF] bg-gradient-to-r from-[#F8F7FF] via-[#F0ECFF]/50 to-[#F8F7FF] p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#6C4BF4] text-white">
            <Lock size={18} />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-[#17152A]">
              Escrow Protection Guarantee Active
            </h3>
            <p className="text-[11px] text-gray-500">
              Funds will only be released to the seller after you receive and inspect the books.
            </p>
          </div>
        </div>

        <Link
          to={`/orders/${order.id}/tracking`}
          className="shrink-0 rounded-xl bg-[#6C4BF4] px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#5B3DE0] transition"
        >
          Track Live Delivery →
        </Link>
      </div>

      {/* 3. Order Details Grid */}
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        {/* Left: Items Summary */}
        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-3">
            <h3 className="text-sm font-bold text-[#17152A] flex items-center gap-2">
              <Package size={16} className="text-[#6C4BF4]" /> Items in Order ({order.items?.length || 1})
            </h3>
            <span className="text-xs font-semibold text-gray-400">
              Est. Delivery: <span className="font-bold text-[#17152A]">{order.expectedDelivery}</span>
            </span>
          </div>

          <div className="divide-y divide-gray-50 space-y-2">
            {order.items?.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 pt-2 first:pt-0">
                <div className="h-14 w-10 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                  <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-[#17152A] truncate">{item.title}</h4>
                  <p className="text-[11px] text-gray-500 truncate">
                    Seller: <span className="font-medium text-gray-700">{item.seller?.name}</span>
                  </p>
                  <span className="inline-block rounded bg-emerald-50 px-1.5 py-0.2 text-[9px] font-bold text-emerald-700">
                    {item.condition || "Like New"}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-extrabold text-[#17152A]">
                    ₹{item.price * (item.quantity || 1)}
                  </span>
                  <p className="text-[10px] text-gray-400">Qty: {item.quantity || 1}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Pricing Recap */}
          <div className="mt-4 border-t border-gray-100 pt-3 space-y-1.5 text-xs text-gray-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-semibold text-[#17152A]">₹{order.subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping Fee</span>
              <span className="font-semibold text-[#17152A]">
                {order.deliveryFee === 0 ? "FREE" : `₹${order.deliveryFee}`}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Platform Escrow Fee</span>
              <span className="font-semibold text-[#17152A]">₹{order.platformFee}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-emerald-600 font-semibold">
                <span>Coupon Discount</span>
                <span>-₹{order.discount}</span>
              </div>
            )}
            <div className="flex justify-between text-sm font-extrabold text-[#17152A] pt-2 border-t border-gray-100">
              <span>Total Paid</span>
              <span className="text-base font-black text-[#6C4BF4]">₹{order.total}</span>
            </div>
          </div>
        </div>

        {/* Right: Delivery & Payment Details */}
        <div className="space-y-6">
          {/* Address Card */}
          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-xs">
            <h3 className="text-sm font-bold text-[#17152A] flex items-center gap-2 pb-3 border-b border-gray-100 mb-3">
              <MapPin size={16} className="text-[#6C4BF4]" /> Delivery Destination
            </h3>
            <div className="text-xs text-gray-600 space-y-1">
              <p className="font-bold text-sm text-[#17152A]">{order.address?.name}</p>
              <p className="text-gray-500">{order.address?.phone}</p>
              <p className="mt-1">{order.address?.street}</p>
              <p>
                {order.address?.city}, {order.address?.state} - <span className="font-semibold">{order.address?.pincode}</span>
              </p>
            </div>
          </div>

          {/* Payment & Shipping Info */}
          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-xs">
            <h3 className="text-sm font-bold text-[#17152A] flex items-center gap-2 pb-3 border-b border-gray-100 mb-3">
              <Truck size={16} className="text-[#6C4BF4]" /> Shipping & Payment Method
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-400">Payment Status:</span>
                <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                  ● Paid & Escrow Secured
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Payment Method:</span>
                <span className="font-semibold text-[#17152A]">{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Shipping Service:</span>
                <span className="font-semibold text-[#17152A]">{order.shippingMethodLabel}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Order Placed On:</span>
                <span className="font-semibold text-[#17152A]">{order.orderDateFormatted}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Bottom Action Buttons */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        <Link
          to={`/orders/${order.id}/tracking`}
          className="flex items-center gap-2 rounded-2xl bg-[#6C4BF4] px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#6C4BF4]/25 hover:bg-[#5B3DE0] hover:shadow-xl transition"
        >
          <Truck size={17} />
          <span>Track Order Status</span>
        </Link>

        <Link
          to="/explore"
          className="flex items-center gap-2 rounded-2xl border border-gray-200 bg-[#F8F7FF] px-6 py-3.5 text-sm font-bold text-[#17152A] hover:border-[#6C4BF4] hover:bg-[#F0ECFF] hover:text-[#6C4BF4] transition"
        >
          <ShoppingBag size={17} />
          <span>Continue Shopping</span>
        </Link>
      </div>
    </div>
  );
}

export default OrderConfirmation;
