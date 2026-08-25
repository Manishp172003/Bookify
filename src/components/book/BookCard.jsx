import { Link } from "react-router-dom";
import ConditionBadge from "../ui/ConditionBadge";
import { MapPin, Star } from "lucide-react";

const modeLabels = {
  sell: { label: "Buy", color: "#6C4BF4" },
  rent: { label: "Rent", color: "#38BDF8" },
  exchange: { label: "Exchange", color: "#FF8A3D" },
  donate: { label: "Free", color: "#22C55E" },
};

export default function BookCard({ book, layout = "grid" }) {
  const mode = modeLabels[book.mode] || modeLabels.sell;
  const discount = book.originalPrice
    ? Math.round(((book.originalPrice - book.askingPrice) / book.originalPrice) * 100)
    : null;

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
              <ConditionBadge condition={book.condition} />
              <span className="text-xs text-bookify-text-secondary">
                {book.category}
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-bookify-text">
                ₹{book.askingPrice}
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
            <div className="flex items-center gap-1 text-bookify-text-secondary text-xs">
              <MapPin size={12} />
              {book.seller.location}
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      to={`/book/${book.id}`}
      className="bg-white rounded-xl border border-bookify-border hover:border-bookify-purple hover:shadow-lg transition-all duration-300 overflow-hidden group flex flex-col"
    >
      <div className="relative aspect-[3/4] overflow-hidden">
        <img
          src={book.coverImage}
          alt={book.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <span
          className="absolute top-2 left-2 text-xs font-bold text-white px-2 py-0.5 rounded-md"
          style={{ backgroundColor: mode.color }}
        >
          {mode.label}
        </span>
        {discount && (
          <span className="absolute top-2 right-2 text-xs font-bold text-white bg-bookify-green px-2 py-0.5 rounded-md">
            {discount}% off
          </span>
        )}
        {book.isNegotiable && (
          <span className="absolute bottom-2 left-2 text-[10px] font-medium text-bookify-purple bg-white/90 backdrop-blur px-2 py-0.5 rounded-full">
            Negotiable
          </span>
        )}
      </div>

      <div className="p-3 flex flex-col flex-1">
        <h3 className="font-[family-name:var(--font-heading)] font-semibold text-sm text-bookify-text group-hover:text-bookify-purple transition-colors line-clamp-2 leading-tight">
          {book.title}
        </h3>
        <p className="text-bookify-text-secondary text-xs mt-1 line-clamp-1">
          {book.author}
        </p>

        <div className="mt-2">
          <ConditionBadge condition={book.condition} />
        </div>

        <div className="mt-auto pt-3 flex items-baseline gap-2">
          <span className="text-lg font-bold text-bookify-text">
            {book.mode === "donate" ? "Free" : `₹${book.askingPrice}`}
          </span>
          {book.originalPrice && (
            <span className="text-xs text-bookify-text-secondary line-through">
              ₹{book.originalPrice}
            </span>
          )}
        </div>

        <div className="mt-2 pt-2 border-t border-bookify-border flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <img
              src={book.seller.avatar}
              alt={book.seller.name}
              className="w-5 h-5 rounded-full"
            />
            <span className="text-xs text-bookify-text-secondary truncate max-w-[100px]">
              {book.seller.name}
            </span>
            {book.seller.isVerified && (
              <span className="text-bookify-green text-[10px]">✓</span>
            )}
          </div>
          <div className="flex items-center gap-0.5 text-bookify-yellow text-xs">
            <Star size={10} fill="currentColor" />
            {book.seller.rating}
          </div>
        </div>
      </div>
    </Link>
  );
}
