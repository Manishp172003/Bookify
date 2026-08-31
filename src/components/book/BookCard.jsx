// React imports omitted as hooks are not used directly
import { Link } from "react-router-dom";
import { Star, Heart } from "lucide-react";
import { useCommerce } from "../../context/CommerceContext";

const modeLabels = {
  sell: { label: "Buy", color: "#6C4BF4" },
  rent: { label: "Rent", color: "#6C4BF4" },
  exchange: { label: "Exchange", color: "#6C4BF4" },
  donate: { label: "Free", color: "#22C55E" },
};

export default function BookCard({ book, layout = "grid" }) {
  const mode = modeLabels[book.mode] || modeLabels.sell;
  const discount = book.originalPrice
    ? Math.round(
        ((book.originalPrice - book.askingPrice) / book.originalPrice) * 100
      )
    : null;

  const { toggleWishlist, isBookWishlisted } = useCommerce();
  const isWishlisted = isBookWishlisted(book.id);

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(book);
  };

  // List layout for ExplorePage
  if (layout === "list") {
    return (
      <Link
        to={`/book/${book.id}`}
        className="flex bg-white rounded-xl border border-bookify-border hover:border-bookify-purple hover:shadow-lg transition-all duration-300 overflow-hidden group"
      >
        <div className="relative w-32 sm:w-40 flex-shrink-0">
          <img
            src={book.coverImage}
            alt={book.title}
            loading="lazy"
            className="w-full h-full object-cover"
          />
          <span
            className="absolute top-2 left-2 text-xs font-bold text-white px-2 py-0.5 rounded-md"
            style={{ backgroundColor: mode.color }}
          >
            {mode.label}
          </span>
        </div>
        <div className="flex-1 p-4 flex flex-col justify-between">
          <div>
            <h3 className="font-[family-name:var(--font-heading)] font-semibold text-bookify-text group-hover:text-bookify-purple transition-colors line-clamp-1">
              {book.title}
            </h3>
            <p className="text-bookify-text-secondary text-sm mt-0.5">
              {book.author}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs font-semibold text-bookify-purple bg-bookify-light-purple px-2 py-0.5 rounded">
                {book.condition?.replace(/_/g, " ")}
              </span>
              <span className="text-xs text-bookify-text-secondary">
                {book.category}
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-bookify-text">
                {book.mode === "donate" ? "Free" : `₹${book.askingPrice}`}
              </span>
              {book.originalPrice && (
                <span className="text-sm text-bookify-text-secondary line-through">
                  ₹{book.originalPrice}
                </span>
              )}
              {discount && (
                <span className="text-xs font-semibold text-bookify-green">
                  {discount}% off
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // Grid layout (premium responsive card)
  return (
    <Link
      to={`/book/${book.id}`}
      className="group block w-full bg-white rounded-2xl border border-gray-100/90 overflow-hidden transition-all duration-300 hover:border-[#6C4BF4]/30 hover:shadow-md hover:shadow-[#6C4BF4]/4 flex flex-col h-full animate-fade-in-up"
    >
      {/* Cover Image */}
      <div className="relative overflow-hidden aspect-[2/3]">
        <img
          src={book.coverImage}
          alt={book.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {/* Mode Badge */}
        <span
          className="absolute top-2.5 left-2.5 text-[10px] font-bold text-white px-2 py-0.5 rounded-lg z-10"
          style={{ backgroundColor: mode.color }}
        >
          {mode.label}
        </span>
        {/* Floating Wishlist Button */}
        <button
          onClick={handleWishlistToggle}
          className={`absolute top-2.5 right-2.5 z-10 w-7 h-7 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-sm border border-gray-100 cursor-pointer ${
            isWishlisted ? "text-red-500" : "text-gray-400 hover:text-red-500"
          }`}
        >
          <Heart size={13} className={isWishlisted ? "fill-red-500" : "transition-colors"} />
        </button>

      </div>

      {/* Info */}
      <div className="p-3 flex-1 flex flex-col justify-between">
        <div>
          {/* Rating */}
          {book.seller.rating && (
            <div className="flex items-center gap-1 mb-1">
              <Star size={11} fill="#FFD166" className="text-bookify-yellow" />
              <span className="text-[11px] font-bold text-bookify-text">
                {book.seller.rating}
              </span>
              <span className="text-[10px] text-bookify-text-secondary">
                / 5 ({book.seller.totalSales || 0})
              </span>
            </div>
          )}

          {/* Title */}
          <h3 className="font-[family-name:var(--font-heading)] text-xs font-bold text-bookify-text line-clamp-2 leading-tight mb-0.5 group-hover:text-[#6C4BF4] transition-colors">
            {book.title}
          </h3>

          {/* Author */}
          <p className="text-[11px] text-bookify-text-secondary line-clamp-1 mb-2">
            {book.author}
          </p>
        </div>

        {/* Price & Discount Row */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-50 mt-1">
          <div className="flex items-baseline gap-1.5">
            <span className="text-sm font-bold text-bookify-text">
              {book.mode === "donate" ? "Free" : `₹${book.askingPrice}`}
            </span>
            {book.originalPrice && (
              <span className="text-[10px] text-bookify-text-secondary line-through">
                ₹{book.originalPrice}
              </span>
            )}
          </div>
          {discount && (
            <span className="text-[10px] font-semibold text-bookify-green bg-green-50 px-1.5 py-0.5 rounded-md">
              {discount}% off
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
