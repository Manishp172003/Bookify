import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  Send,
  CheckCheck,
  User,
  Shield,
  ChevronLeft,
  Headphones,
  ShoppingBag,
  Clock,
  Sparkles
} from "lucide-react";
import { useCommerce } from "../../context/CommerceContext";
import { authorSupportService } from "../../services/authorSupportService";

const STATIC_SELLER_CHATS = [
  {
    id: "seller_priya",
    name: "Priya Patel",
    role: "Seller",
    avatar: "PP",
    unreadCount: 0,
    lastMessage: "The payout has been successfully credited, thank you!",
    time: "Yesterday",
    messages: [
      {
        id: "sp_1",
        sender: "admin",
        text: "Hi Priya, the escrow dispute has been resolved and your payment is released.",
        time: "4:15 PM"
      },
      {
        id: "sp_2",
        sender: "seller",
        text: "The payout has been successfully credited, thank you!",
        time: "4:20 PM"
      }
    ]
  },
  {
    id: "seller_aman",
    name: "Aman Singh",
    role: "Seller",
    avatar: "AS",
    unreadCount: 1,
    lastMessage: "Is there any issue with my verification documents?",
    time: "3 days ago",
    messages: [
      {
        id: "sa_1",
        sender: "seller",
        text: "Is there any issue with my verification documents?",
        time: "2:40 PM"
      }
    ]
  }
];

function Chat() {
  const { socket } = useCommerce();
  const [sellerChats, setSellerChats] = useState(STATIC_SELLER_CHATS);
  const [authorThreads, setAuthorThreads] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [filter, setFilter] = useState("All"); // All, Authors, Sellers, Unread
  const [search, setSearch] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [showMobileChat, setShowMobileChat] = useState(false);
  const messagesEndRef = useRef(null);

  // Sync author support threads
  const reloadAuthorThreads = () => {
    const threads = authorSupportService.getThreads();
    const formatted = threads.map((t) => ({
      id: t.id,
      authorId: t.authorId,
      name: t.name,
      role: "Author",
      avatar: t.avatar || "AU",
      unreadCount: t.adminUnread || 0,
      lastMessage: t.lastMessage,
      time: t.time,
      isAuthorSupport: true,
      messages: t.messages.map((m) => ({
        id: m.id,
        sender: m.sender,
        senderName: m.senderName || (m.sender === "admin" ? "Bookify Staff" : t.name),
        text: m.text,
        time: m.time
      }))
    }));
    setAuthorThreads(formatted);
    return formatted;
  };

  useEffect(() => {
    const loaded = reloadAuthorThreads();
    if (loaded.length > 0 && !activeChatId) {
      setActiveChatId(loaded[0].id);
    }

    const handleSupportUpdate = () => {
      reloadAuthorThreads();
    };

    window.addEventListener("bookify_author_support_changed", handleSupportUpdate);
    window.addEventListener("storage", handleSupportUpdate);

    return () => {
      window.removeEventListener("bookify_author_support_changed", handleSupportUpdate);
      window.removeEventListener("storage", handleSupportUpdate);
    };
  }, []);

  // Socket listener for real-time messages
  useEffect(() => {
    if (!socket) return;

    // Join admin broadcast room
    socket.emit("joinChat", "admins");

    // Join existing author support rooms
    authorThreads.forEach((th) => {
      socket.emit("joinChat", `support_author_${th.authorId}`);
    });

    const handleSocketMessage = (data) => {
      if (data?.conversationId?.startsWith("support_author_")) {
        reloadAuthorThreads();
      }
    };

    socket.on("newChatMessage", handleSocketMessage);

    return () => {
      socket.off("newChatMessage", handleSocketMessage);
    };
  }, [socket, authorThreads.length]);

  // Combine author threads and seller chats
  const allChats = [...authorThreads, ...sellerChats];

  // If activeChatId not set yet, fallback
  const activeChat = allChats.find((c) => c.id === activeChatId) || allChats[0];

  // Auto-scroll on active chat messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeChat?.messages?.length]);

  const selectChat = (chat) => {
    setActiveChatId(chat.id);
    setShowMobileChat(true);

    if (chat.isAuthorSupport) {
      authorSupportService.markAsReadByAdmin(chat.authorId);
      reloadAuthorThreads();
    } else {
      setSellerChats((prev) =>
        prev.map((c) => (c.id === chat.id ? { ...c, unreadCount: 0 } : c))
      );
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChat) return;

    const timeString = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    if (activeChat.isAuthorSupport) {
      // Send through authorSupportService
      authorSupportService.sendAdminReply(
        activeChat.authorId,
        newMessage,
        "Bookify Editorial Staff"
      );
      reloadAuthorThreads();

      // Emit socket broadcast
      if (socket && socket.connected) {
        socket.emit("sendChatMessage", {
          conversationId: `support_author_${activeChat.authorId}`,
          text: newMessage,
          senderName: "Bookify Editorial Staff",
          senderRole: "admin",
          time: timeString
        });
      }
    } else {
      // Local update for demo seller chat
      setSellerChats((prev) =>
        prev.map((chat) => {
          if (chat.id === activeChat.id) {
            return {
              ...chat,
              lastMessage: newMessage,
              time: timeString,
              messages: [
                ...chat.messages,
                { id: `msg_${Date.now()}`, sender: "admin", text: newMessage, time: timeString }
              ]
            };
          }
          return chat;
        })
      );
    }

    setNewMessage("");
  };

  // Filter logic
  const filteredChats = allChats.filter((chat) => {
    const matchesSearch =
      chat.name.toLowerCase().includes(search.toLowerCase()) ||
      chat.role.toLowerCase().includes(search.toLowerCase()) ||
      chat.lastMessage?.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;

    if (filter === "Authors") return chat.role === "Author";
    if (filter === "Sellers") return chat.role === "Seller";
    if (filter === "Unread") return chat.unreadCount > 0;
    return true;
  });

  return (
    <div className="h-[calc(100vh-8rem)] flex bg-white rounded-3xl border border-[#E7E4F2] shadow-sm overflow-hidden relative">
      {/* Sidebar - Chats List */}
      <div
        className={`w-full md:w-84 border-r border-[#E7E4F2] flex flex-col h-full bg-[#FBFBFF] ${
          showMobileChat ? "hidden md:flex" : "flex"
        }`}
      >
        {/* Search and Filters */}
        <div className="p-4 border-b border-[#E7E4F2]/70 space-y-3 bg-white">
          <div className="relative">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search conversations or topics..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-2xl border border-gray-250 bg-[#F8F7FF] py-2.5 pl-10 pr-4 text-xs outline-none focus:border-[#6C4BF4] focus:bg-white transition text-[#17152A]"
            />
          </div>

          {/* Filter Chips */}
          <div className="flex bg-gray-100/90 p-1 rounded-xl text-[11px] font-bold text-[#6B6880]">
            {["All", "Authors", "Sellers", "Unread"].map((opt) => (
              <button
                key={opt}
                onClick={() => setFilter(opt)}
                className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer ${
                  filter === opt
                    ? "bg-white text-[#17152A] shadow-xs font-extrabold"
                    : "hover:text-[#17152A]"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Chats List Scrollable */}
        <div className="flex-1 overflow-y-auto divide-y divide-[#E7E4F2]/50">
          {filteredChats.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#6B6880]">
              No conversations found matching your filter.
            </div>
          ) : (
            filteredChats.map((chat) => {
              const isSelected = activeChat && chat.id === activeChat.id;
              const isAuthor = chat.role === "Author";

              return (
                <button
                  key={chat.id}
                  onClick={() => selectChat(chat)}
                  className={`w-full text-left p-4 transition-all flex gap-3 items-start cursor-pointer ${
                    isSelected ? "bg-[#F3EFFE]" : "hover:bg-gray-50/80"
                  }`}
                >
                  {/* Avatar */}
                  <div
                    className={`h-10 w-10 rounded-2xl flex items-center justify-center text-xs font-black text-white shrink-0 shadow-xs ${
                      isAuthor
                        ? "bg-gradient-to-tr from-[#6C4BF4] to-[#8F72FA]"
                        : "bg-gradient-to-tr from-sky-500 to-indigo-500"
                    }`}
                  >
                    {chat.avatar}
                  </div>

                  {/* Body */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline">
                      <h4 className="text-xs font-extrabold text-[#17152A] truncate">
                        {chat.name}
                      </h4>
                      <span className="text-[10px] text-[#6B6880] shrink-0 font-medium">
                        {chat.time}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 mt-1">
                      <span
                        className={`text-[9px] font-black px-1.5 py-0.5 rounded-md flex items-center gap-1 ${
                          isAuthor
                            ? "bg-[#6C4BF4]/10 text-[#6C4BF4]"
                            : "bg-sky-100 text-sky-700"
                        }`}
                      >
                        {isAuthor ? <Headphones size={10} /> : <ShoppingBag size={10} />}
                        {isAuthor ? "Author Support" : "Book Seller"}
                      </span>
                      {chat.isAuthorSupport && (
                        <span className="text-[9px] text-emerald-600 font-bold">• Live Desk</span>
                      )}
                    </div>

                    <p
                      className={`text-xs mt-1.5 truncate ${
                        chat.unreadCount > 0
                          ? "font-extrabold text-[#17152A]"
                          : "text-[#6B6880]"
                      }`}
                    >
                      {chat.lastMessage}
                    </p>
                  </div>

                  {/* Unread Badge */}
                  {chat.unreadCount > 0 && (
                    <span className="h-4.5 min-w-4.5 flex items-center justify-center rounded-full bg-[#6C4BF4] px-1.5 text-[9px] font-extrabold text-white shrink-0 mt-0.5 shadow-xs animate-pulse">
                      {chat.unreadCount}
                    </span>
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Main Chat Workspace */}
      <div
        className={`flex-1 flex flex-col h-full bg-[#FAF9FF] ${
          showMobileChat ? "flex" : "hidden md:flex"
        }`}
      >
        {activeChat ? (
          <>
            {/* Active Header */}
            <div className="p-4 bg-white border-b border-[#E7E4F2] flex items-center justify-between shrink-0 shadow-xs">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowMobileChat(false)}
                  className="md:hidden p-1.5 rounded-xl hover:bg-gray-100 text-[#6B6880]"
                >
                  <ChevronLeft size={20} />
                </button>

                <div
                  className={`h-10 w-10 rounded-2xl flex items-center justify-center text-xs font-black text-white shrink-0 shadow-xs ${
                    activeChat.role === "Author"
                      ? "bg-gradient-to-tr from-[#6C4BF4] to-[#8F72FA]"
                      : "bg-gradient-to-tr from-sky-500 to-indigo-500"
                  }`}
                >
                  {activeChat.avatar}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-extrabold text-[#17152A]">
                      {activeChat.name}
                    </h3>
                    <span
                      className={`text-[9px] font-black px-2 py-0.5 rounded-md flex items-center gap-1 ${
                        activeChat.role === "Author"
                          ? "bg-[#6C4BF4]/10 text-[#6C4BF4]"
                          : "bg-sky-100 text-sky-700"
                      }`}
                    >
                      {activeChat.role === "Author" ? (
                        <>
                          <Headphones size={10} /> Author Desk
                        </>
                      ) : (
                        <>
                          <ShoppingBag size={10} /> Student Seller
                        </>
                      )}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5 text-[10px] text-[#6B6880]">
                    <span className="text-emerald-500 font-semibold">• Active Ticket</span>
                    {activeChat.isAuthorSupport && (
                      <span>&bull; Author ID: {activeChat.authorId}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Badges */}
              {activeChat.isAuthorSupport && (
                <div className="hidden sm:flex items-center gap-2">
                  <span className="text-xs font-bold text-[#6C4BF4] bg-[#6C4BF4]/10 px-3 py-1.5 rounded-xl border border-[#6C4BF4]/20 flex items-center gap-1.5">
                    <Sparkles size={12} />
                    Official Editorial Desk Reply
                  </span>
                </div>
              )}
            </div>

            {/* Messages Scroll Content */}
            <div className="flex-1 p-5 md:p-6 overflow-y-auto space-y-4">
              {activeChat.messages.map((msg) => {
                const isAdmin = msg.sender === "admin";
                return (
                  <div
                    key={msg.id}
                    className={`flex gap-3 ${isAdmin ? "justify-end" : "justify-start"}`}
                  >
                    {!isAdmin && (
                      <div className="h-8 w-8 rounded-xl bg-gray-200 text-[#17152A] flex items-center justify-center text-[10px] font-black shrink-0 mt-1">
                        {activeChat.avatar}
                      </div>
                    )}

                    <div
                      className={`max-w-[85%] md:max-w-[70%] rounded-2xl px-4.5 py-3 text-xs shadow-xs ${
                        isAdmin
                          ? "bg-gradient-to-r from-[#6C4BF4] to-[#5939E8] text-white rounded-tr-none shadow-md shadow-[#6C4BF4]/15"
                          : "bg-white text-[#17152A] border border-[#E7E4F2] rounded-tl-none"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3 mb-1">
                        <span
                          className={`text-[10px] font-extrabold ${
                            isAdmin ? "text-purple-200" : "text-[#6C4BF4]"
                          }`}
                        >
                          {isAdmin ? "You (Bookify Staff)" : msg.senderName || activeChat.name}
                        </span>
                        <span
                          className={`text-[9px] font-medium ${
                            isAdmin ? "text-purple-200/80" : "text-[#6B6880]"
                          }`}
                        >
                          {msg.time}
                        </span>
                      </div>

                      <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>

                      {isAdmin && (
                        <div className="flex items-center justify-end gap-1 mt-1 text-[9px] text-purple-200">
                          <span>Sent</span>
                          <CheckCheck size={11} className="text-white" />
                        </div>
                      )}
                    </div>

                    {isAdmin && (
                      <div className="h-8 w-8 rounded-xl bg-[#6C4BF4] text-white flex items-center justify-center text-[10px] font-extrabold shrink-0 shadow-xs mt-1">
                        AD
                      </div>
                    )}
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input area */}
            <form
              onSubmit={handleSendMessage}
              className="p-4 bg-white border-t border-[#E7E4F2] flex gap-3 items-center shrink-0"
            >
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder={`Type a response to ${activeChat.name} (${activeChat.role})...`}
                className="flex-1 rounded-2xl border border-gray-250 bg-[#F8F7FF] py-3.5 px-4.5 text-xs outline-none focus:border-[#6C4BF4] focus:bg-white transition text-[#17152A] placeholder:text-gray-400"
              />
              <button
                type="submit"
                disabled={!newMessage.trim()}
                className="h-11 w-11 flex items-center justify-center rounded-2xl bg-[#6C4BF4] text-white hover:bg-[#5B3DE0] disabled:opacity-40 disabled:hover:bg-[#6C4BF4] transition shadow-md shadow-[#6C4BF4]/20 shrink-0 cursor-pointer"
                title="Send reply"
              >
                <Send size={16} />
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-[#6B6880] p-8">
            <User size={48} className="text-gray-300 mb-2" />
            <p className="text-sm font-semibold">Select a conversation to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Chat;