import { useState } from "react";
import { ArrowRight, Tag, ShieldCheck, Check, Sparkles, AlertCircle, ShoppingBag } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

function CartSummary({
  subtotal,
  deliveryFee,
  platformFee,
  discount,
  total,
  appliedCoupon,
  onApplyCoupon,
  onRemoveCoupon,
  availableCoupons,
  cartCount
}) {
  const [couponInput, setCouponInput] = useState("");
  const [couponError, setCouponError] = useState("");
  const navigate = useNavigate();

  const handleApply = (e) => {
    e?.preventDefault();
    setCouponError("");
    if (!couponInput.trim()) return;

    const result = onApplyCoupon(couponInput.trim());
    if (!result.success) {
      setCouponError(result.message);
    } else {
      setCouponInput("");
    }
  };

  const handleQuickCoupon = (code) => {
    setCouponError("");
    const result = onApplyCoupon(code);
    if (!result.success) {
      setCouponError(result.message);
    }
  };

  const freeDeliveryThreshold = 999;
  const remainingForFreeDelivery = Math.max(0, freeDeliveryThreshold - subtotal);
  const freeDeliveryProgress = Math.min(100, Math.round((subtotal / freeDeliveryThreshold) * 100));

  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-bold text-[#17152A] pb-4 border-b border-gray-100">
        Order Summary
      </h2>

      {/* Free Delivery Bar */}
      <div className="my-4 rounded-2xl bg-[#F8F7FF] p-3.5 border border-gray-100">
        <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
          <span className="text-[#17152A]">
            {remainingForFreeDelivery === 0
              ? "🎉 You qualified for FREE Standard Delivery!"
              : `Add ₹${remainingForFreeDelivery} more for FREE Delivery`}
          </span>
          <span className="font-bold text-[#6C4BF4]">{freeDeliveryProgress}%</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
          <div
            className="h-full rounded-full bg-[#6C4BF4] transition-all duration-500"
            style={{ width: `${freeDeliveryProgress}%` }}
          />
        </div>
      </div>

      {/* Coupon Section */}
      <div className="py-4 border-b border-gray-100">
        <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
          Apply Coupon / Student Code
        </label>

        {appliedCoupon ? (
          <div className="flex items-center justify-between rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-white font-bold text-[10px]">
                %
              </span>
              <div>
                <span className="font-bold text-emerald-800 tracking-wide">{appliedCoupon.code}</span>
                <p className="text-[11px] text-emerald-600">Saved ₹{discount}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onRemoveCoupon}
              className="font-bold text-red-500 hover:text-red-700 text-xs cursor-pointer"
            >
              Remove
            </button>
          </div>
        ) : (
          <form onSubmit={handleApply} className="space-y-2">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Tag
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  placeholder="Enter code (e.g. BOOKIFY50)"
                  value={couponInput}
                  onChange={(e) => {
                    setCouponInput(e.target.value.toUpperCase());
                    setCouponError("");
                  }}
                  className="w-full rounded-xl border border-gray-200 bg-[#F8F7FF] py-2.5 pl-9 pr-3 text-xs font-semibold uppercase text-[#17152A] outline-none transition focus:border-[#6C4BF4] focus:bg-white focus:ring-3 focus:ring-[#6C4BF4]/10"
                />
              </div>
              <button
                type="submit"
                disabled={!couponInput.trim()}
                className="rounded-xl bg-[#6C4BF4] px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[#5B3DE0] disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
              >
                Apply
              </button>
            </div>

            {couponError && (
              <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                <AlertCircle size={13} /> {couponError}
              </p>
            )}

            {/* Quick Coupon Suggestions */}
            {availableCoupons && availableCoupons.length > 0 && (
              <div className="pt-2">
                <p className="text-[11px] font-medium text-gray-400 mb-1.5 flex items-center gap-1">
                  <Sparkles size={11} className="text-[#6C4BF4]" /> Available for you:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {availableCoupons.map((coupon) => (
                    <button
                      key={coupon.code}
                      type="button"
                      onClick={() => handleQuickCoupon(coupon.code)}
                      className="rounded-lg border border-dashed border-[#6C4BF4]/40 bg-[#F0ECFF]/60 px-2 py-1 text-[11px] font-bold text-[#6C4BF4] hover:bg-[#F0ECFF] hover:border-[#6C4BF4] transition cursor-pointer"
                    >
                      {coupon.code}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </form>
        )}
      </div>

      {/* Calculations Breakdown */}
      <div className="py-4 space-y-3 text-sm border-b border-gray-100">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal ({cartCount} {cartCount === 1 ? "item" : "items"})</span>
          <span className="font-semibold text-[#17152A]">₹{subtotal}</span>
        </div>

        <div className="flex justify-between text-gray-600">
          <span className="flex items-center gap-1">
            Delivery Fee
            {deliveryFee === 0 && (
              <span className="rounded bg-emerald-100 px-1.5 py-0.2 text-[10px] font-bold text-emerald-700">
                FREE
              </span>
            )}
          </span>
          <span className="font-semibold text-[#17152A]">
            {deliveryFee === 0 ? "₹0" : `₹${deliveryFee}`}
          </span>
        </div>

        <div className="flex justify-between text-gray-600">
          <span className="flex items-center gap-1" title="Covers payment gateway, buyer escrow protection & dispute resolution">
            Platform Escrow Fee
          </span>
          <span className="font-semibold text-[#17152A]">₹{platformFee}</span>
        </div>

        {discount > 0 && (
          <div className="flex justify-between text-emerald-600 font-semibold">
            <span>Coupon Discount</span>
            <span>-₹{discount}</span>
          </div>
        )}
      </div>

      {/* Final Total */}
      <div className="py-4 flex items-baseline justify-between">
        <div>
          <span className="text-base font-extrabold text-[#17152A]">Total Amount</span>
          <p className="text-[11px] text-gray-400">Includes all taxes & escrow charges</p>
        </div>
        <div className="text-right">
          <span className="text-2xl font-black text-[#6C4BF4]">₹{total}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 pt-2">
        <button
          type="button"
          onClick={() => navigate("/checkout")}
          disabled={cartCount === 0}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#6C4BF4] py-4 text-sm font-bold text-white shadow-lg shadow-[#6C4BF4]/25 transition duration-200 hover:-translate-y-0.5 hover:bg-[#5B3DE0] hover:shadow-xl active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 cursor-pointer"
        >
          <span>Proceed to Checkout</span>
          <ArrowRight size={18} />
        </button>

        <Link
          to="/explore"
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-gray-200 py-3 text-xs font-bold text-gray-700 transition hover:border-[#6C4BF4] hover:bg-[#F8F7FF] hover:text-[#6C4BF4]"
        >
          <ShoppingBag size={15} />
          <span>Continue Shopping</span>
        </Link>
      </div>

      {/* Escrow Guarantee Footer */}
      <div className="mt-5 flex items-start gap-2 rounded-2xl bg-[#F8F7FF] p-3 text-[11px] text-gray-500 border border-gray-100">
        <ShieldCheck size={16} className="text-[#6C4BF4] shrink-0 mt-0.5" />
        <p>
          <span className="font-bold text-[#17152A]">Bookify Escrow Protected:</span> Payment is safely held in escrow until you receive and verify the book.
        </p>
      </div>
    </div>
  );
}

export default CartSummary;
