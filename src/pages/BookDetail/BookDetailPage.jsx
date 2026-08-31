import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useCommerce } from "../../context/CommerceContext";
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
import ConditionBadge from "../../components/ui/ConditionBadge";
import SellerCard from "../../components/book/SellerCard";
import BookCard from "../../components/book/BookCard";
import books from "../../data/books";

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
    color: "bg-bookify-purple hover:bg-bookify-purple-dark",
    description: "Rent with refundable security deposit",
  },
  exchange: {
    label: "Propose Exchange",
    icon: <RefreshCcw size={18} />,
    color: "bg-bookify-purple hover:bg-bookify-purple-dark",
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
  const navigate = useNavigate();
  const { addToCart, startOrGetConversation, toggleWishlist, isBookWishlisted } = useCommerce();
  const book = books.find((b) => b.id === Number(id));
  const [activePhoto, setActivePhoto] = useState(0);
  const isFavorited = book ? isBookWishlisted(book.id) : false;
  const [triggerBounce, setTriggerBounce] = useState(false);
  const [isExchangeModalOpen, setIsExchangeModalOpen] = useState(false);
  const [selectedSwapBookId, setSelectedSwapBookId] = useState("my_1");
  const [proposalNote, setProposalNote] = useState("");

  const handleActionClick = () => {
    if (book) {
      if (book.mode === "exchange") {
        setIsExchangeModalOpen(true);
      } else if (book.mode === "donate") {
        const defaultSeller = { id: 101, name: "Rahul Sharma", avatar: "https://i.pravatar.cc/150?img=11", college: "IIT Delhi" };
        const customText = `🎁 Donation Request:\nHi ${book.seller?.name?.split(" ")[0] || "there"}! I would love to request your free copy of "${book.title}" for my studies. Let me know when and where we can meet up on campus for the handoff!`;
        const chatId = startOrGetConversation(book.seller || defaultSeller, book, customText);
        navigate(`/chat/${chatId}`);
      } else {
        addToCart(book, 1);
        navigate("/checkout");
      }
    }
  };

  const handleChatClick = () => {
    if (book) {
      const defaultSeller = { id: 101, name: "Rahul Sharma", avatar: "https://i.pravatar.cc/150?img=11", college: "IIT Delhi" };
      const chatId = startOrGetConversation(book.seller || defaultSeller, book);
      navigate(`/chat/${chatId}`);
    }
  };

  const handleFavoriteToggle = () => {
    if (book) {
      toggleWishlist(book);
      if (!isFavorited) {
        setTriggerBounce(true);
        setTimeout(() => setTriggerBounce(false), 300);
      }
    }
  };

  const handleSubmitProposal = () => {
    if (!book) return;
    const myBooks = [
      { id: "my_1", title: "Concepts of Physics Vol 1", author: "H.C. Verma" },
      { id: "my_2", title: "Organic Chemistry, 8th Edition", author: "L.G. Wade" },
      { id: "my_3", title: "Introduction to Java Programming", author: "Y. Daniel Liang" }
    ];
    const chosen = myBooks.find(b => b.id === selectedSwapBookId) || myBooks[0];
    const defaultSeller = { id: 101, name: "Rahul Sharma", avatar: "https://i.pravatar.cc/150?img=11", college: "IIT Delhi" };
    const customText = `🔄 Proposed swap for "${book.title}" in exchange for my "${chosen.title}" by ${chosen.author}.\n\nNote: ${proposalNote || "Let's meet up to exchange textbooks!"}`;
    const chatId = startOrGetConversation(book.seller || defaultSeller, book, customText);
    setIsExchangeModalOpen(false);
    navigate(`/chat/${chatId}`);
  };

  if (!book) {
    return (
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 py-16 text-center">
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
    .slice(0, 12);

  return (
    <div className="max-w-[1440px] mx-auto px-6 md:px-10 py-6">
      <div className="flex items-center gap-2 text-sm text-bookify-text-secondary mb-6 animate-fade-in">
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
        <div 
          className="lg:col-span-2 space-y-4 animate-fade-in-up" 
          style={{ animationDelay: "75ms", animationFillMode: "both" }}
        >
          <div className="bg-white rounded-xl border border-bookify-border overflow-hidden">
            <div className="relative aspect-[4/3] bg-bookify-bg">
              <img
                key={activePhoto}
                src={book.photos[activePhoto]}
                alt={book.title}
                className="w-full h-full object-contain p-4 animate-fade-in"
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
                      ? "#6C4BF4"
                      : book.mode === "exchange"
                      ? "#6C4BF4"
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
                    className={`w-16 h-20 rounded-lg overflow-hidden border-2 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer ${
                      activePhoto === i
                        ? "border-[#6C4BF4] shadow-md shadow-[#6C4BF4]/15"
                        : "border-transparent hover:border-[#6C4BF4]/40"
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

        <div 
          className="space-y-4 animate-fade-in-left"
          style={{ animationDelay: "150ms", animationFillMode: "both" }}
        >
          <div className="bg-white rounded-xl border border-bookify-border p-5">
            <div className="flex items-start justify-between">
              <ConditionBadge condition={book.condition} size="md" />
              <div className="flex gap-1">
                <button
                  onClick={handleFavoriteToggle}
                  className={`p-2 rounded-lg transition-all duration-300 cursor-pointer ${
                    isFavorited
                      ? "text-bookify-pink bg-bookify-light-pink"
                      : "text-bookify-text-secondary hover:bg-bookify-bg"
                  } ${triggerBounce ? "animate-scale-bounce" : ""}`}
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
              onClick={handleActionClick}
              className={`w-full flex items-center justify-center gap-2 mt-5 py-3 text-white rounded-xl font-semibold transition-colors cursor-pointer ${mode.color}`}
            >
              {mode.icon}
              {mode.label}
            </button>

            <button 
              onClick={handleChatClick}
              className="w-full flex items-center justify-center gap-2 mt-2 py-3 border-2 border-bookify-purple text-bookify-purple rounded-xl font-semibold hover:bg-bookify-light-purple transition-colors cursor-pointer"
            >
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
        <section className="mt-10">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-[family-name:var(--font-heading)] text-xl font-bold text-bookify-text">
              Similar Books in {book.category}
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  const slider = document.getElementById("related-slider");
                  if (slider) slider.scrollBy({ left: -300, behavior: "smooth" });
                }}
                className="w-8 h-8 rounded-full border border-bookify-border flex items-center justify-center text-bookify-text-secondary hover:bg-bookify-bg transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => {
                  const slider = document.getElementById("related-slider");
                  if (slider) slider.scrollBy({ left: 300, behavior: "smooth" });
                }}
                className="w-8 h-8 rounded-full border border-bookify-border flex items-center justify-center text-bookify-text-secondary hover:bg-bookify-bg transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
          <div
            id="related-slider"
            className="flex gap-3 overflow-x-auto scroll-smooth pb-2 scrollbar-hide"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {relatedBooks.map((b) => (
              <div key={b.id} className="flex-shrink-0 w-[180px]">
                <BookCard book={b} />
              </div>
            ))}
          </div>
        </section>
      )}
      {/* Exchange Proposal Modal */}
      {isExchangeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl animate-scale-up border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg text-bookify-text flex items-center gap-2">
                🔄 Propose Book Exchange
              </h3>
              <button 
                onClick={() => setIsExchangeModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>
            
            <p className="text-xs text-bookify-text-secondary mb-4 leading-relaxed">
              You are proposing a swap for <strong className="text-bookify-text">"{book.title}"</strong> with <strong className="text-bookify-text">{book.seller?.name || "Vikram Singh"}</strong>. Choose a book from your shelf to offer in return:
            </p>

            {/* Book List Selection */}
            <div className="space-y-3.5 max-h-60 overflow-y-auto mb-4 p-1">
              {[
                { id: "my_1", title: "Concepts of Physics Vol 1", author: "H.C. Verma", image: "https://covers.openlibrary.org/b/isbn/9780061120084-L.jpg", condition: "Very Good" },
                { id: "my_2", title: "Organic Chemistry, 8th Edition", author: "L.G. Wade", image: "https://covers.openlibrary.org/b/isbn/9780321768414-L.jpg", condition: "Good" },
                { id: "my_3", title: "Introduction to Java Programming", author: "Y. Daniel Liang", image: "https://covers.openlibrary.org/b/id/8314352-L.jpg", condition: "Like New" }
              ].map((myBook) => (
                <label 
                  key={myBook.id}
                  className={`flex gap-3 p-3 rounded-2xl border transition cursor-pointer select-none items-center ${
                    selectedSwapBookId === myBook.id 
                      ? "border-[#6C4BF4] bg-[#6C4BF4]/5" 
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <input 
                    type="radio" 
                    name="swapBook" 
                    value={myBook.id}
                    checked={selectedSwapBookId === myBook.id}
                    onChange={() => setSelectedSwapBookId(myBook.id)}
                    className="accent-[#6C4BF4] h-4 w-4"
                  />
                  <img src={myBook.image} alt={myBook.title} className="h-12 w-9 object-cover rounded-md border border-gray-100" />
                  <div className="min-w-0 flex-grow">
                    <h4 className="text-xs font-bold text-bookify-text truncate">{myBook.title}</h4>
                    <p className="text-[10px] text-bookify-text-secondary truncate mt-0.5">{myBook.author}</p>
                    <span className="inline-block text-[9px] font-semibold text-bookify-purple bg-bookify-light-purple px-1.5 py-0.5 rounded-md mt-1">
                      {myBook.condition}
                    </span>
                  </div>
                </label>
              ))}
            </div>

            {/* Note Textarea */}
            <div className="mb-5">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-bookify-text-secondary mb-1.5">
                Friendly note for {book.seller?.name?.split(" ")[0] || "Vikram"} (Optional)
              </label>
              <textarea
                placeholder="Hi, would you be down to trade Gulliver's Travels for my Physics book?"
                value={proposalNote}
                onChange={(e) => setProposalNote(e.target.value)}
                className="w-full text-xs p-3 rounded-xl border border-gray-200 focus:border-bookify-purple outline-none h-20 resize-none transition bg-gray-50/50 focus:bg-white"
              />
            </div>

            {/* Submit Actions */}
            <div className="flex gap-2.5">
              <button
                type="button"
                onClick={() => setIsExchangeModalOpen(false)}
                className="flex-1 py-2.5 border border-gray-200 text-gray-500 rounded-xl font-bold hover:bg-gray-50 text-xs transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmitProposal}
                className="flex-1 py-2.5 bg-[#6C4BF4] text-white rounded-xl font-bold hover:bg-[#5B3DE0] text-xs transition cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
              >
                Send Proposal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
