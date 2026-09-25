import { useNavigate, Link } from "react-router-dom";
import { MessageSquare, ChevronRight } from "lucide-react";
import { useCommerce } from "../../context/CommerceContext";
import { isRealUserAvatar, getInitials } from "../../utils/avatarUtils";

function RecentMessages() {
  const navigate = useNavigate();
  const { conversations, selectConversation } = useCommerce();

  const handleOpenChat = (id) => {
    selectConversation(id);
    navigate(`/chat/${id}`);
  };

  const displayList = (conversations || []).slice(0, 4);

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold text-[#17152A]">
          Recent Messages
        </h3>

        {displayList.length > 0 && (
          <Link
            to="/chat"
            className="text-xs font-semibold text-[#6C4BF4] cursor-pointer hover:underline"
          >
            View All
          </Link>
        )}
      </div>

      <div className="space-y-3">
        {displayList.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EDE7FF] text-[#6C4BF4] mb-2.5">
              <MessageSquare size={18} />
            </div>
            <p className="text-xs font-semibold text-[#17152A]">No messages yet</p>
            <p className="text-[11px] text-gray-400 mt-0.5 max-w-[220px]">
              Chat inquiries from campus buyers and sellers will appear here.
            </p>
          </div>
        ) : (
          displayList.map((conv) => {
            const lastMsg =
              conv.messages && conv.messages.length > 0
                ? conv.messages[conv.messages.length - 1]
                : null;
            const snippet = lastMsg?.text || conv.lastMessage || "Click to view chat";
            const timeDisplay = lastMsg?.time || conv.lastMessageTimestamp || "Recent";

            return (
              <div
                key={conv.id}
                onClick={() => handleOpenChat(conv.id)}
                className="flex items-center gap-3 cursor-pointer hover:bg-gray-50/80 p-2 rounded-xl transition"
              >
                <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full border border-gray-100 bg-[#EDE7FF]">
                  {isRealUserAvatar(conv.seller?.avatar) ? (
                    <img 
                      src={conv.seller.avatar} 
                      alt={conv.seller?.name || "Seller"}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center font-black text-[10px] text-[#6C4BF4] select-none tracking-wider">
                      {getInitials(conv.seller?.name)}
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-[#17152A] truncate">
                      {conv.seller?.name || "Student Seller"}
                    </p>
                    <span className="text-[10px] text-gray-400 shrink-0">
                      {timeDisplay}
                    </span>
                  </div>

                  <p className="mt-0.5 truncate text-xs text-gray-500">
                    {snippet}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {conv.unreadCount > 0 && (
                    <span className="flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-[#FF4F81] px-1 text-[10px] font-bold text-white">
                      {conv.unreadCount}
                    </span>
                  )}
                  <div 
                    className="flex h-6 w-6 items-center justify-center rounded-full bg-[#F0ECFF] text-[#6C4BF4] hover:bg-[#6C4BF4] hover:text-white cursor-pointer shadow-xs transition"
                  >
                    <ChevronRight size={13} strokeWidth={2.5} />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default RecentMessages;