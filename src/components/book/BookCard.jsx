import { Link } from "react-router-dom";
import { Star } from "lucide-react";

const modeLabels = {
  sell: { label: "Buy", color: "#6C4BF4" },
  rent: { label: "Rent", color: "#38BDF8" },
  exchange: { label: "Exchange", color: "#FF8A3D" },
  donate: { label: "Free", color: "#22C55E" },
};

export default function BookCard({ book, layout = "grid" }) {
  const mode = modeLabels[book.mode] || modeLabels.sell;
  const discount = book.originalPrice
    ? Math.round(
        ((book.originalPrice - book.askingPrice) / book.originalPrice) * 100
      )
    : null;

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

  // Grid layout (compact Bookscape-style)
  return (
    <Link
      to={`/book/${book.id}`}
      className="group block min-w-[165px] max-w-[180px] bg-white rounded-lg overflow-hidden transition-all duration-200 hover:shadow-lg"
    >
      {/* Cover Image */}
      <div className="relative overflow-hidden">
        <img
          src={book.coverImage}
          alt={book.title}
          className="w-full aspect-[2/3] object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {/* Mode Badge */}
        <span
          className="absolute top-2 left-2 text-[10px] font-bold text-white px-2 py-0.5 rounded"
          style={{ backgroundColor: mode.color }}
        >
          {mode.label}
        </span>
        {/* Quick View overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
          <span className="text-white text-xs font-semibold bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/30">
            Quick View
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="p-2.5">
        {/* Rating */}
        {book.seller.rating && (
          <div className="flex items-center gap-1 mb-1">
            <Star size={11} fill="#FFD166" className="text-bookify-yellow" />
            <span className="text-[11px] font-semibold text-bookify-text">
              {book.seller.rating}
            </span>
            <span className="text-[10px] text-bookify-text-secondary">
              / 5 ({book.seller.totalSales || 0})
            </span>
          </div>
        )}

        {/* Title */}
        <h3 className="font-[family-name:var(--font-heading)] text-xs font-semibold text-bookify-text line-clamp-2 leading-tight mb-0.5">
          {book.title}
        </h3>

        {/* Author */}
        <p className="text-[11px] text-bookify-text-secondary line-clamp-1 mb-1.5">
          {book.author}
        </p>

        {/* Price */}
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

        {/* Discount */}
        {discount && (
          <span className="text-[10px] font-semibold text-bookify-green">
            ({discount}%)
          </span>
        )}
      </div>
    </Link>
  );
}
