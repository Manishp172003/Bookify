import { useRef, useEffect } from "react";
import { ArrowLeft, ShieldCheck, ShoppingBag, ExternalLink, Info, CheckCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import MessageBubble from "./MessageBubble";
import ChatInput from "./ChatInput";
import { useCommerce } from "../../context/CommerceContext";

function ChatWindow({
  conversation,
  onSendMessage,
  onBackToList,
  showInfoPanel,
  onToggleInfoPanel
}) {
  const messagesEndRef = useRef(null);
  const { addToCart } = useCommerce();
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation?.messages]);

  if (!conversation) {
    return (
      <div className="flex h-full items-center justify-center bg-gray-50 p-6 text-center text-gray-400">
        <p className="font-semibold text-sm">Select a conversation to start chatting</p>
      </div>
    );
  }

  const { seller, book, messages } = conversation;

  const handleAddToCartAndCheckout = () => {
    if (book) {
      addToCart(book, 1);
      navigate("/checkout");
    }
  };

  return (
    <div className="flex h-full flex-col bg-[#F8F7FF]">
      {/* 1. Seller Header */}
      <div className="flex items-center justify-between border-b border-gray-100 bg-white px-4 py-3 shadow-xs">
        <div className="flex items-center gap-3">
          {/* Mobile Back Button */}
          <button
            type="button"
            onClick={onBackToList}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-gray-600 hover:bg-gray-100 lg:hidden cursor-pointer"
          >
            <ArrowLeft size={19} />
          </button>

          {/* Seller Avatar */}
          <div className="relative">
            <div className="h-10 w-10 overflow-hidden rounded-full border border-gray-200 bg-gray-100">
              {seller?.avatar ? (
                <img src={seller.avatar} alt={seller.name} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center font-bold text-sm text-[#6C4BF4] bg-[#F0ECFF]">
                  {seller?.name?.charAt(0)}
                </div>
              )}
            </div>
            <span
              className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white ${
                seller?.online ? "bg-emerald-500" : "bg-gray-300"
              }`}
            />
          </div>

          {/* Name & Status */}
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-bold text-sm text-[#17152A]">{seller?.name}</h3>
              {seller?.verified && (
                <ShieldCheck size={14} className="text-[#6C4BF4]" />
              )}
            </div>
            <p className="text-[11px] font-medium text-gray-400">
              {seller?.online ? (
                <span className="text-emerald-600 font-semibold">● Online</span>
              ) : (
                `Last seen ${seller?.lastSeen || "recently"}`
              )}
              {seller?.college && <span className="hidden sm:inline text-gray-400"> · {seller.college}</span>}
            </p>
          </div>
        </div>

        {/* Right Actions in Header */}
        <div className="flex items-center gap-2">
          {/* Quick Buy CTA */}
          {book && (
            <button
              type="button"
              onClick={handleAddToCartAndCheckout}
              className="hidden sm:flex items-center gap-1.5 rounded-xl bg-[#6C4BF4] px-3.5 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-[#5B3DE0] active:scale-95 transition cursor-pointer"
            >
              <ShoppingBag size={14} /> Buy Now ₹{book.price}
            </button>
          )}

          {/* Info toggle */}
          <button
            type="button"
            onClick={onToggleInfoPanel}
            title="Seller Profile & Safety"
            className={`flex h-9 w-9 items-center justify-center rounded-xl transition cursor-pointer ${
              showInfoPanel ? "bg-[#F0ECFF] text-[#6C4BF4]" : "text-gray-500 hover:bg-gray-100"
            }`}
          >
            <Info size={18} />
          </button>
        </div>
      </div>

      {/* 2. Associated Book Banner */}
      {book && (
        <div className="flex items-center justify-between border-b border-gray-100 bg-white/90 px-4 py-2.5 backdrop-blur-xs">
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-10 w-8 shrink-0 overflow-hidden rounded bg-gray-100 shadow-xs">
              <img src={book.image} alt={book.title} className="h-full w-full object-cover" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs text-[#17152A] truncate">{book.title}</span>
                <span className="shrink-0 rounded bg-emerald-50 px-1.5 py-0.5 text-[10px] font-bold text-emerald-700">
                  {book.condition}
                </span>
              </div>
              <p className="text-[11px] text-gray-500">
                <span className="font-bold text-[#6C4BF4]">₹{book.price}</span>
                {book.originalPrice && (
                  <span className="ml-1.5 text-gray-400 line-through">₹{book.originalPrice}</span>
                )}
                <span className="ml-2 hidden sm:inline text-gray-400">· {book.author}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => addToCart(book, 1)}
              className="flex items-center gap-1 rounded-lg border border-[#6C4BF4] px-2.5 py-1 text-xs font-bold text-[#6C4BF4] hover:bg-[#F0ECFF] transition cursor-pointer"
            >
              + Cart
            </button>
            <Link
              to="/explore"
              className="hidden md:flex items-center gap-1 rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-600 hover:bg-gray-200 transition"
            >
              <ExternalLink size={12} /> View Listing
            </Link>
          </div>
        </div>
      )}

      {/* 3. Escrow Security Pill */}
      <div className="flex justify-center my-2 px-4">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-[#E9E4FF]/60 px-3 py-1 text-[11px] font-semibold text-[#6C4BF4]">
          <CheckCircle size={12} className="text-emerald-600" />
          <span>Escrow Protected: Money remains in holding until you verify the book</span>
        </div>
      </div>

      {/* 4. Messages Container */}
      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-1">
        {messages && messages.length > 0 ? (
          messages.map((msg) => (
            <MessageBubble
              key={msg.id}
              message={msg}
              sellerAvatar={seller?.avatar}
              sellerName={seller?.name}
            />
          ))
        ) : (
          <div className="flex h-full flex-col items-center justify-center text-center text-gray-400 py-10">
            <p className="text-sm font-semibold">Start the conversation with {seller?.name}</p>
            <p className="text-xs text-gray-400 mt-1">Ask about book condition, edition, or shipping</p>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* 5. Chat Input Area */}
      <ChatInput
        onSendMessage={(text) => onSendMessage(conversation.id, text)}
        sellerName={seller?.name}
        bookTitle={book?.title}
      />
    </div>
  );
}

export default ChatWindow;
