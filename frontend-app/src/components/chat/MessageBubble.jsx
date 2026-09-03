import { Check, CheckCheck } from "lucide-react";

function MessageBubble({ message, sellerAvatar, sellerName }) {
  const isBuyer = message.sender === "buyer";

  return (
    <div className={`flex w-full items-end gap-2.5 my-2.5 animate-message-pop ${isBuyer ? "justify-end" : "justify-start"}`}>
      {/* Seller Avatar for incoming messages */}
      {!isBuyer && (
        <div className="h-8 w-8 shrink-0 overflow-hidden rounded-full border border-gray-200 bg-[#E9E4FF] shadow-xs">
          {sellerAvatar ? (
            <img src={sellerAvatar} alt={sellerName} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center font-bold text-xs text-[#6C4BF4]">
              {sellerName ? sellerName.charAt(0) : "S"}
            </div>
          )}
        </div>
      )}

      {/* Bubble Box */}
      <div
        className={`relative max-w-[82%] sm:max-w-[70%] rounded-2xl px-4 py-2.5 shadow-xs transition-all ${
          isBuyer
            ? "bg-[#6C4BF4] text-white rounded-br-xs"
            : "bg-white text-[#17152A] border border-gray-100 rounded-bl-xs"
        }`}
      >
        {/* Message Content */}
        <p className="text-sm leading-relaxed whitespace-pre-wrap break-words select-text">
          {message.text}
        </p>

        {/* Timestamp and Delivery Status */}
        <div className={`mt-1 flex items-center justify-end gap-1 text-[10px] ${isBuyer ? "text-white/75" : "text-gray-400"}`}>
          <span>{message.timestamp}</span>

          {isBuyer && (
            <span className="inline-flex items-center">
              {message.status === "read" ? (
                <CheckCheck size={13} className="text-[#38BDF8]" strokeWidth={2.5} />
              ) : message.status === "delivered" ? (
                <CheckCheck size={13} className="text-white/80" strokeWidth={2} />
              ) : (
                <Check size={13} className="text-white/70" strokeWidth={2} />
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default MessageBubble;
