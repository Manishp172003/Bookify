import { ShieldCheck, Truck, BookOpen } from "lucide-react";

function OrderSummary({
  items,
  subtotal,
  deliveryFee,
  platformFee,
  discount,
  total,
  appliedCoupon,
  shippingMethod
}) {
  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-xs">
      <h2 className="text-base font-bold text-[#17152A] pb-4 border-b border-gray-100 flex items-center justify-between">
        <span>Order Summary</span>
        <span className="text-xs font-semibold text-[#6C4BF4] bg-[#F0ECFF] px-2.5 py-0.5 rounded-full">
          {items.length} {items.length === 1 ? "Item" : "Items"}
        </span>
      </h2>

      {/* Items preview list */}
      <div className="py-4 divide-y divide-gray-50 max-h-60 overflow-y-auto pr-1">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0">
            <div className="h-12 w-9 shrink-0 overflow-hidden rounded-md bg-gray-100 shadow-2xs">
              <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-xs font-bold text-[#17152A] truncate">{item.title}</h3>
              <p className="text-[11px] text-gray-500 truncate">
                Qty: {item.quantity || 1} · By {item.seller?.name || "Verified Seller"}
              </p>
            </div>
            <div className="text-right shrink-0">
              <span className="text-xs font-bold text-[#17152A]">
                ₹{item.price * (item.quantity || 1)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Calculations */}
      <div className="pt-4 border-t border-gray-100 space-y-2.5 text-xs">
        <div className="flex justify-between text-gray-600">
          <span>Items Subtotal</span>
          <span className="font-semibold text-[#17152A]">₹{subtotal}</span>
        </div>

        <div className="flex justify-between text-gray-600">
          <span className="flex items-center gap-1">
            Shipping ({shippingMethod === "express" ? "Express" : "Standard"})
          </span>
          <span className="font-semibold text-[#17152A]">
            {deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}
          </span>
        </div>

        <div className="flex justify-between text-gray-600">
          <span>Platform Escrow Fee</span>
          <span className="font-semibold text-[#17152A]">₹{platformFee}</span>
        </div>

        {discount > 0 && (
          <div className="flex justify-between text-emerald-600 font-semibold">
            <span>Coupon ({appliedCoupon?.code})</span>
            <span>-₹{discount}</span>
          </div>
        )}

        {/* Total */}
        <div className="pt-3 border-t border-gray-100 flex items-baseline justify-between">
          <span className="text-sm font-extrabold text-[#17152A]">Total Amount</span>
          <span className="text-xl font-black text-[#6C4BF4]">₹{total}</span>
        </div>
      </div>
    </div>
  );
}

export default OrderSummary;
