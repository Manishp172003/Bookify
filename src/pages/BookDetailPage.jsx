import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Heart,
  Share2,
  MessageCircle,
  ShoppingCart,
  MapPin,
  Star,
  Shield,
  Truck,
  Clock,
  RefreshCcw,
  Gift,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
} from "lucide-react";
import ConditionBadge from "../components/ui/ConditionBadge";
import SellerCard from "../components/book/SellerCard";
import BookCard from "../components/book/BookCard";
import books from "../data/books";

const modeConfig = {
  sell: {
    label: "Buy Now",
    icon: <ShoppingCart size={18} />,
    color: "bg-bookify-purple hover:bg-bookify-purple-dark",
    description: "Purchase this book with escrow protection",
  },
  rent: {
    label: "Rent This Book",
    icon: <Clock size={18} />,
    color: "bg-bookify-blue hover:bg-sky-500",
    description: "Rent with refundable security deposit",
  },
  exchange: {
    label: "Propose Exchange",
    icon: <RefreshCcw size={18} />,
    color: "bg-bookify-orange hover:bg-bookify-orange-dark",
    description: "Suggest a book to trade",
  },
  donate: {
    label: "Request This Book",
    icon: <Gift size={18} />,
    color: "bg-bookify-green hover:bg-green-600",
    description: "Free book - request pickup",
  },
};

export default function BookDetailPage() {
  const { id } = useParams();
  const book = books.find((b) => b.id === Number(id));
  const [activePhoto, setActivePhoto] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);

  if (!book) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="text-6xl mb-4">📚</div>
        <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-bookify-text">
          Book not found
        </h2>
        <p className="text-bookify-text-secondary mt-2">
          This listing may have been removed or doesn't exist.
        </p>
        <Link
          to="/explore"
          className="inline-flex items-center gap-2 mt-4 px-6 py-2 bg-bookify-purple text-white rounded-lg font-medium hover:bg-bookify-purple-dark transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Explore
        </Link>
      </div>
    );
  }

  const mode = modeConfig[book.mode];
  const discount = book.originalPrice
    ? Math.round(
        ((book.originalPrice - book.askingPrice) / book.originalPrice) * 100
      )
    : null;

  const relatedBooks = books
    .filter((b) => b.id !== book.id && b.category === book.category)
    .slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-center gap-2 text-sm text-bookify-text-secondary mb-6">
        <Link to="/" className="hover:text-bookify-purple transition-colors">
          Home
        </Link>
        <ChevronRight size={14} />
        <Link
          to="/explore"
          className="hover:text-bookify-purple transition-colors"
        >
          Explore
        </Link>
        <ChevronRight size={14} />
        <span className="text-bookify-text truncate max-w-[200px]">
          {book.title}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-bookify-border overflow-hidden">
            <div className="relative aspect-[4/3] bg-bookify-bg">
              <img
                src={book.photos[activePhoto]}
                alt={book.title}
                className="w-full h-full object-contain p-4"
              />

              {book.photos.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setActivePhoto(
                        activePhoto === 0
                          ? book.photos.length - 1
                          : activePhoto - 1
                      )
                    }
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 backdrop-blur rounded-full flex items-center justify-center shadow hover:bg-white transition-colors"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    onClick={() =>
                      setActivePhoto(
                        activePhoto === book.photos.length - 1
                          ? 0
                          : activePhoto + 1
                      )
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 backdrop-blur rounded-full flex items-center justify-center shadow hover:bg-white transition-colors"
                  >
                    <ChevronRight size={16} />
                  </button>
                </>
              )}

              <span
                className="absolute top-4 left-4 px-3 py-1 text-sm font-bold text-white rounded-lg"
                style={{
                  backgroundColor:
                    book.mode === "sell"
                      ? "#6C4BF4"
                      : book.mode === "rent"
                      ? "#38BDF8"
                      : book.mode === "exchange"
                      ? "#FF8A3D"
                      : "#22C55E",
                }}
              >
                {book.mode === "sell"
                  ? "For Sale"
                  : book.mode === "rent"
                  ? "For Rent"
                  : book.mode === "exchange"
                  ? "Exchange"
                  : "Free Donation"}
              </span>
            </div>

            {book.photos.length > 1 && (
              <div className="flex gap-2 p-4 border-t border-bookify-border">
                {book.photos.map((photo, i) => (
                  <button
                    key={i}
                    onClick={() => setActivePhoto(i)}
                    className={`w-16 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      activePhoto === i
                        ? "border-bookify-purple"
                        : "border-transparent hover:border-bookify-border"
                    }`}
                  >
                    <img
                      src={photo}
                      alt={`Photo ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl border border-bookify-border p-6 mt-4">
            <h3 className="font-[family-name:var(--font-heading)] font-semibold text-bookify-text mb-3">
              About This Book
            </h3>
            <p className="text-bookify-text-secondary leading-relaxed">
              {book.description}
            </p>

            <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-bookify-border">
              {[
                { label: "ISBN", value: book.isbn },
                { label: "Publisher", value: book.publisher },
                { label: "Category", value: book.category },
                { label: "Sub-Category", value: book.subCategory },
              ].map((detail) => (
                <div key={detail.label}>
                  <p className="text-xs text-bookify-text-secondary">
                    {detail.label}
                  </p>
                  <p className="text-sm font-medium text-bookify-text mt-0.5">
                    {detail.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {book.mode === "sell" && (
            <div className="bg-bookify-light-purple rounded-xl p-4 mt-4 flex items-start gap-3">
              <AlertCircle
                size={20}
                className="text-bookify-purple flex-shrink-0 mt-0.5"
              />
              <div>
                <p className="text-sm font-semibold text-bookify-text">
                  Escrow Protection Active
                </p>
                <p className="text-xs text-bookify-text-secondary mt-1">
                  Your payment is held safely in escrow for 48 hours after
                  delivery. If the book condition doesn't match the listing, you
                  can raise a dispute for a full refund.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-bookify-border p-5">
            <div className="flex items-start justify-between">
              <ConditionBadge condition={book.condition} size="md" />
              <div className="flex gap-1">
                <button
                  onClick={() => setIsFavorited(!isFavorited)}
                  className={`p-2 rounded-lg transition-colors ${
                    isFavorited
                      ? "text-bookify-pink bg-bookify-light-pink"
                      : "text-bookify-text-secondary hover:bg-bookify-bg"
                  }`}
                >
                  <Heart
                    size={18}
                    fill={isFavorited ? "currentColor" : "none"}
                  />
                </button>
                <button className="p-2 rounded-lg text-bookify-text-secondary hover:bg-bookify-bg transition-colors">
                  <Share2 size={18} />
                </button>
              </div>
            </div>

            <h1 className="font-[family-name:var(--font-heading)] text-xl font-bold text-bookify-text mt-3">
              {book.title}
            </h1>
            <p className="text-bookify-text-secondary text-sm mt-1">
              by {book.author}
            </p>

            <div className="mt-4 flex items-baseline gap-3">
              <span className="text-3xl font-bold text-bookify-text">
                {book.mode === "donate" ? "Free" : `₹${book.askingPrice}`}
              </span>
              {book.originalPrice && (
                <>
                  <span className="text-lg text-bookify-text-secondary line-through">
                    ₹{book.originalPrice}
                  </span>
                  <span className="text-sm font-bold text-bookify-green">
                    {discount}% off
                  </span>
                </>
              )}
            </div>

            {book.mode === "rent" && book.rentalRate && (
              <p className="text-sm text-bookify-text-secondary mt-1">
                ₹{book.rentalRate}/day • ₹{book.securityDeposit} refundable
                deposit
              </p>
            )}

            {book.isNegotiable && (
              <span className="inline-flex items-center gap-1 text-xs font-medium text-bookify-orange mt-2">
                💬 Price is negotiable
              </span>
            )}

            <button
              className={`w-full flex items-center justify-center gap-2 mt-5 py-3 text-white rounded-xl font-semibold transition-colors ${mode.color}`}
            >
              {mode.icon}
              {mode.label}
            </button>

            <button className="w-full flex items-center justify-center gap-2 mt-2 py-3 border-2 border-bookify-purple text-bookify-purple rounded-xl font-semibold hover:bg-bookify-light-purple transition-colors">
              <MessageCircle size={18} />
              Chat with Seller
            </button>
          </div>

          <div className="bg-white rounded-xl border border-bookify-border p-4">
            <h4 className="font-semibold text-sm text-bookify-text mb-3">
              Delivery & Pickup
            </h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-bookify-text-secondary">
                {book.deliveryAvailable ? (
                  <Truck size={14} className="text-bookify-green" />
                ) : (
                  <MapPin size={14} className="text-bookify-orange" />
                )}
                {book.deliveryAvailable
                  ? "Courier delivery available"
                  : "Campus pickup only"}
              </div>
              <div className="flex items-center gap-2 text-sm text-bookify-text-secondary">
                <MapPin size={14} />
                {book.seller.location}
              </div>
            </div>
          </div>

          <SellerCard seller={book.seller} />

          <p className="text-xs text-bookify-text-secondary text-center">
            Listed {book.postedDaysAgo === 0 ? "today" : `${book.postedDaysAgo} days ago`}
          </p>
        </div>
      </div>

      {relatedBooks.length > 0 && (
        <section className="mt-12">
          <h2 className="font-[family-name:var(--font-heading)] text-xl font-bold text-bookify-text mb-4">
            Similar Books in {book.category}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {relatedBooks.map((b) => (
              <BookCard key={b.id} book={b} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
