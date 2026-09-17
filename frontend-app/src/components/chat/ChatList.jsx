import { useState } from "react";
import { Search, BookOpen, ShieldCheck, Inbox, Clock } from "lucide-react";
import { isRealUserAvatar, getInitials } from "../../utils/avatarUtils";

function ChatList({ conversations, activeId, onSelectConversation }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all"); // "all" | "requests"

  let savedUser = null;
  try {
    savedUser = JSON.parse(localStorage.getItem("bookify_user"));
  } catch {}
  const myUserId = savedUser?.id || "usr_me";

  const pendingRequestsCount = conversations.filter(
    (c) => c.requestStatus === "pending" && c.requesterId !== myUserId
  ).length;

  const totalRequestsCount = conversations.filter(
    (c) => c.requestStatus === "pending"
  ).length;

  const filteredConversations = conversations
    .filter((conv) => {
      if (activeTab === "requests") {
        return conv.requestStatus === "pending";
      }
      return true;
    })
    .filter((conv) => {
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

        {/* Tab Filters */}
        <div className="flex items-center gap-1 rounded-xl bg-gray-100 p-1 mb-3">
          <button
            type="button"
            onClick={() => setActiveTab("all")}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-bold transition cursor-pointer ${
              activeTab === "all"
                ? "bg-white text-[#17152A] shadow-xs"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            <Inbox size={13} />
            <span>All Messages</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("requests")}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-bold transition cursor-pointer ${
              activeTab === "requests"
                ? "bg-white text-[#6C4BF4] shadow-xs"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            <Clock size={13} />
            <span>Requests</span>
            {totalRequestsCount > 0 && (
              <span
                className={`flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-black ${
                  pendingRequestsCount > 0
                    ? "bg-[#6C4BF4] text-white animate-pulse"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {totalRequestsCount}
              </span>
            )}
          </button>
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
            <p className="text-sm font-semibold">
              {activeTab === "requests" ? "No pending chat requests" : "No conversations found"}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {activeTab === "requests"
                ? "When buyers request to chat, they will appear here"
                : "Try searching another name or book"}
            </p>
          </div>
        ) : (
          filteredConversations.map((conv) => {
            const isActive = conv.id === activeId;
            const isPending = conv.requestStatus === "pending";
            const isRejected = conv.requestStatus === "rejected";
            const isMyRequest = conv.requesterId === myUserId;

            return (
              <button
                key={conv.id}
                type="button"
                onClick={() => onSelectConversation(conv.id)}
                className={`flex w-full items-start gap-3 p-3.5 text-left border-l-4 transition-colors duration-150 cursor-pointer hover:bg-[#F8F7FF] ${
                  isActive ? "bg-[#F0ECFF]/60 border-[#6C4BF4]" : "border-transparent"
                }`}
              >
                {/* Avatar with Online Status Indicator */}
                <div className="relative shrink-0">
                  <div className="h-11 w-11 overflow-hidden rounded-full border border-gray-200 bg-gray-100 shadow-xs">
                    {isRealUserAvatar(conv.seller?.avatar) ? (
                      <img
                        src={conv.seller.avatar}
                        alt={conv.seller.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center font-black text-xs text-[#6C4BF4] bg-[#F0ECFF] select-none tracking-wider">
                        {getInitials(conv.seller?.name)}
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

                  {/* Associated Book Tag & Request Status Pill */}
                  <div className="mt-1 flex flex-wrap items-center gap-1.5">
                    {conv.book && (
                      <div className="flex items-center gap-1 text-[11px] font-semibold text-[#6C4BF4] bg-[#F0ECFF]/80 rounded-md px-1.5 py-0.5 max-w-full truncate">
                        <BookOpen size={11} className="shrink-0" />
                        <span className="truncate">{conv.book.title}</span>
                        <span className="text-gray-400 font-normal">· ₹{conv.book.price}</span>
                      </div>
                    )}

                    {isPending && !isMyRequest && (
                      <span className="rounded-md bg-purple-100 text-[#6C4BF4] border border-purple-200 px-1.5 py-0.5 text-[10px] font-extrabold tracking-tight">
                        Needs Approval
                      </span>
                    )}

                    {isPending && isMyRequest && (
                      <span className="rounded-md bg-amber-50 text-amber-700 border border-amber-200 px-1.5 py-0.5 text-[10px] font-bold">
                        Request Sent
                      </span>
                    )}

                    {isRejected && (
                      <span className="rounded-md bg-red-50 text-red-600 border border-red-200 px-1.5 py-0.5 text-[10px] font-bold">
                        Declined
                      </span>
                    )}
                  </div>

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
