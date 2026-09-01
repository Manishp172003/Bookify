import { useState } from "react";
import { Search, BookOpen, ShieldCheck } from "lucide-react";

function ChatList({ conversations, activeId, onSelectConversation }) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredConversations = conversations.filter((conv) => {
    const term = searchTerm.toLowerCase();
    const sellerName = (conv.seller?.name || "").toLowerCase();
    const bookTitle = (conv.book?.title || "").toLowerCase();
    const lastMsg = (conv.lastMessage || "").toLowerCase();
    return sellerName.includes(term) || bookTitle.includes(term) || lastMsg.includes(term);
  });

  return (
    <div className="flex h-full flex-col bg-white">
      {/* Header & Search */}
      <div className="border-b border-gray-100 p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-[#17152A]">Messages</h2>
          <span className="rounded-full bg-[#F0ECFF] px-2.5 py-0.5 text-xs font-bold text-[#6C4BF4]">
            {conversations.length} active
          </span>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search sellers or books..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-[#F8F7FF] py-2 pl-9 pr-3 text-xs text-[#17152A] outline-none transition focus:border-[#6C4BF4] focus:bg-white focus:ring-3 focus:ring-[#6C4BF4]/10"
          />
        </div>
      </div>

      {/* Conversation Items List */}
      <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
        {filteredConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-center text-gray-400">
            <BookOpen size={32} className="mb-2 text-gray-300" />
            <p className="text-sm font-semibold">No conversations found</p>
            <p className="text-xs text-gray-400 mt-1">Try searching another name or book</p>
          </div>
        ) : (
          filteredConversations.map((conv) => {
            const isActive = conv.id === activeId;
            return (
              <button
                key={conv.id}
                type="button"
                onClick={() => onSelectConversation(conv.id)}
                className={`flex w-full items-start gap-3 p-3.5 text-left transition cursor-pointer hover:bg-[#F8F7FF] ${
                  isActive ? "bg-[#F0ECFF]/60 border-l-4 border-[#6C4BF4]" : ""
                }`}
              >
                {/* Avatar with Online Status Indicator */}
                <div className="relative shrink-0">
                  <div className="h-11 w-11 overflow-hidden rounded-full border border-gray-200 bg-gray-100 shadow-xs">
                    {conv.seller?.avatar ? (
                      <img
                        src={conv.seller.avatar}
                        alt={conv.seller.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center font-bold text-sm text-[#6C4BF4] bg-[#F0ECFF]">
                        {conv.seller?.name ? conv.seller.name.charAt(0) : "S"}
                      </div>
                    )}
                  </div>
                  {/* Online / Offline Dot */}
                  <span
                    className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${
                      conv.seller?.online ? "bg-emerald-500" : "bg-gray-300"
                    }`}
                    title={conv.seller?.online ? "Online" : "Offline"}
                  />
                </div>

                {/* Info */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <div className="flex items-center gap-1.5 truncate">
                      <span className="font-bold text-sm text-[#17152A] truncate">
                        {conv.seller?.name}
                      </span>
                      {conv.seller?.verified && (
                        <ShieldCheck size={14} className="text-[#6C4BF4] shrink-0" />
                      )}
                    </div>
                    <span className="text-[11px] font-medium text-gray-400 shrink-0">
                      {conv.lastMessageTimestamp}
                    </span>
                  </div>

                  {/* Associated Book Tag */}
                  {conv.book && (
                    <div className="mt-1 flex items-center gap-1 text-[11px] font-semibold text-[#6C4BF4] bg-[#F0ECFF]/80 rounded-md px-1.5 py-0.5 w-fit max-w-full truncate">
                      <BookOpen size={11} className="shrink-0" />
                      <span className="truncate">{conv.book.title}</span>
                      <span className="text-gray-400 font-normal">· ₹{conv.book.price}</span>
                    </div>
                  )}

                  {/* Last Message Snippet */}
                  <p className="mt-1 text-xs text-gray-500 line-clamp-1">
                    {conv.lastMessage}
                  </p>
                </div>

                {/* Unread Indicator Badge */}
                {conv.unreadCount > 0 && (
                  <div className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-[#FF4F81] px-1.5 text-[10px] font-bold text-white shadow-xs">
                    {conv.unreadCount}
                  </div>
                )}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}

export default ChatList;
