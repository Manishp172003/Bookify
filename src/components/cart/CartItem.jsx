import { Plus, Minus, Trash2, Heart, ShieldCheck, Building2 } from "lucide-react";
import { Link } from "react-router-dom";

function CartItem({ item, onUpdateQuantity, onRemove, onMoveToWishlist }) {
  const discountPercent = item.originalPrice && item.originalPrice > item.price
    ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)
    : 0;

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 shadow-xs transition hover:shadow-md">
      {/* Left: Book Cover & Details */}
      <div className="flex items-start gap-4 min-w-0 flex-1">
        {/* Thumbnail */}
        <div className="h-28 w-20 sm:h-32 sm:w-24 shrink-0 overflow-hidden rounded-xl bg-gray-100 shadow-xs">
          <img
            src={item.image}
            alt={item.title}
            className="h-full w-full object-cover transition duration-300 hover:scale-105"
          />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-emerald-700">
              {item.condition || "Good"}
            </span>
            {item.edition && (
              <span className="rounded-md bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-600">
                {item.edition}
              </span>
            )}
          </div>

          <h3 className="text-base font-bold text-[#17152A] leading-tight truncate">
            {item.title}
          </h3>

          <p className="text-xs text-gray-500 mt-0.5 truncate">
            By <span className="font-medium text-gray-700">{item.author}</span>
          </p>

          {/* Seller details */}
          <div className="mt-2 flex items-center gap-1.5 text-xs text-gray-500">
            <span className="text-gray-400">Sold by:</span>
            <span className="font-semibold text-[#17152A] flex items-center gap-1">
              {item.seller?.name || "Verified Student"}
              <ShieldCheck size={13} className="text-[#6C4BF4]" />
            </span>
            {item.seller?.college && (
              <span className="hidden md:inline text-gray-400">({item.seller.college})</span>
            )}
          </div>

          {/* Mobile Actions: Move to wishlist & Remove */}
          <div className="mt-3 flex sm:hidden items-center gap-4 text-xs font-semibold">
            <button
              type="button"
              onClick={() => onMoveToWishlist(item)}
              className="flex items-center gap-1 text-[#6C4BF4] hover:text-[#5B3DE0] cursor-pointer"
            >
              <Heart size={14} /> Save for later
            </button>
            <button
              type="button"
              onClick={() => onRemove(item.id)}
              className="flex items-center gap-1 text-red-500 hover:text-red-600 cursor-pointer"
            >
              <Trash2 size={14} /> Remove
            </button>
          </div>
        </div>
      </div>

      {/* Right: Price & Quantity Controls */}
      <div className="flex w-full sm:w-auto items-center justify-between sm:flex-col sm:items-end gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-gray-100">
        {/* Pricing */}
        <div className="text-left sm:text-right">
          <div className="flex items-baseline gap-2 sm:justify-end">
            <span className="text-lg font-extrabold text-[#17152A]">
              ₹{item.price * (item.quantity || 1)}
            </span>
            {item.originalPrice && (
              <span className="text-xs text-gray-400 line-through">
                ₹{item.originalPrice * (item.quantity || 1)}
              </span>
            )}
          </div>
          {discountPercent > 0 && (
            <span className="text-[11px] font-bold text-emerald-600">
              Save {discountPercent}%
            </span>
          )}
        </div>

        {/* Quantity Increment/Decrement */}
        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-xl border border-gray-200 bg-[#F8F7FF] p-0.5">
            <button
              type="button"
              onClick={() => onUpdateQuantity(item.id, (item.quantity || 1) - 1)}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-600 transition hover:bg-white hover:text-[#6C4BF4] active:scale-95 cursor-pointer"
              title="Decrease quantity"
            >
              <Minus size={13} />
            </button>

            <span className="w-8 text-center text-xs font-bold text-[#17152A]">
              {item.quantity || 1}
            </span>

            <button
              type="button"
              onClick={() => onUpdateQuantity(item.id, (item.quantity || 1) + 1)}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-600 transition hover:bg-white hover:text-[#6C4BF4] active:scale-95 cursor-pointer"
              title="Increase quantity"
            >
              <Plus size={13} />
            </button>
          </div>
        </div>

        {/* Desktop Quick Actions */}
        <div className="hidden sm:flex items-center gap-3 text-xs font-medium text-gray-400">
          <button
            type="button"
            onClick={() => onMoveToWishlist(item)}
            className="flex items-center gap-1 text-gray-500 hover:text-[#6C4BF4] transition cursor-pointer"
            title="Move to Wishlist"
          >
            <Heart size={13} /> Move to Wishlist
          </button>
          <span>·</span>
          <button
            type="button"
            onClick={() => onRemove(item.id)}
            className="flex items-center gap-1 text-gray-500 hover:text-red-500 transition cursor-pointer"
            title="Remove from Cart"
          >
            <Trash2 size={13} /> Remove
          </button>
        </div>
      </div>
    </div>
  );
}

export default CartItem;
