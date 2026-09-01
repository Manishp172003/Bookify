import React, { useState } from "react";
import { Search, Send, Check, CheckCheck, User, Shield, ChevronLeft } from "lucide-react";

const INITIAL_CHATS = [
  {
    id: 1,
    name: "Rahul Verma",
    role: "Author",
    avatar: "RV",
    unreadCount: 2,
    lastMessage: "Could you please check my pending book submission status?",
    time: "10:30 AM",
    messages: [
      { id: 1, sender: "author", text: "Hello Admin, I submitted a new book 'Clean Code' yesterday.", time: "10:28 AM" },
      { id: 2, sender: "author", text: "Could you please check my pending book submission status?", time: "10:30 AM" }
    ]
  },
  {
    id: 2,
    name: "Priya Patel",
    role: "Seller",
    avatar: "PP",
    unreadCount: 0,
    lastMessage: "The payout has been successfully credited, thank you!",
    time: "Yesterday",
    messages: [
      { id: 1, sender: "admin", text: "Hi Priya, the escrow dispute has been resolved and your payment is released.", time: "4:15 PM" },
      { id: 2, sender: "seller", text: "The payout has been successfully credited, thank you!", time: "4:20 PM" }
    ]
  },
  {
    id: 3,
    name: "Dr. Vikram Das",
    role: "Author",
    avatar: "VD",
    unreadCount: 0,
    lastMessage: "I will update the cover image and re-submit.",
    time: "2 days ago",
    messages: [
      { id: 1, sender: "admin", text: "Hello Vikram, your listing was rejected due to blurry cover page illustration.", time: "11:00 AM" },
      { id: 2, sender: "author", text: "I will update the cover image and re-submit.", time: "11:05 AM" }
    ]
  },
  {
    id: 4,
    name: "Aman Singh",
    role: "Seller",
    avatar: "AS",
    unreadCount: 1,
    lastMessage: "Is there any issue with my verification documents?",
    time: "3 days ago",
    messages: [
      { id: 1, sender: "seller", text: "Is there any issue with my verification documents?", time: "2:40 PM" }
    ]
  }
];

function Chat() {
  const [chats, setChats] = useState(INITIAL_CHATS);
  const [activeChatId, setActiveChatId] = useState(1);
  const [filter, setFilter] = useState("All"); // All, Unread, Read
  const [search, setSearch] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [showMobileChat, setShowMobileChat] = useState(false);

  const activeChat = chats.find(c => c.id === activeChatId) || chats[0];

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setChats(chats.map(chat => {
      if (chat.id === activeChat.id) {
        return {
          ...chat,
          lastMessage: newMessage,
          time: timeString,
          messages: [
            ...chat.messages,
            { id: chat.messages.length + 1, sender: "admin", text: newMessage, time: timeString }
          ]
        };
      }
      return chat;
    }));

    setNewMessage("");
  };

  const selectChat = (id) => {
    setActiveChatId(id);
    setShowMobileChat(true);
    // Mark as read
    setChats(chats.map(chat => {
      if (chat.id === id) {
        return { ...chat, unreadCount: 0 };
      }
      return chat;
    }));
  };

  // Filter logic
  const filteredChats = chats.filter(chat => {
    // Search match
    const matchesSearch = chat.name.toLowerCase().includes(search.toLowerCase()) || 
                          chat.role.toLowerCase().includes(search.toLowerCase());
    
    // Status filter match
    if (filter === "Unread") {
      return matchesSearch && chat.unreadCount > 0;
    }
    if (filter === "Read") {
      return matchesSearch && chat.unreadCount === 0;
    }
    return matchesSearch;
  });

  return (
    <div className="h-[calc(100vh-8rem)] flex bg-white rounded-2xl border border-[#E7E4F2] shadow-sm overflow-hidden relative">
      {/* Sidebar - Chats List */}
      <div className={`w-full md:w-80 border-r border-[#E7E4F2] flex flex-col h-full bg-[#FBFBFF] ${
        showMobileChat ? "hidden md:flex" : "flex"
      }`}>
        {/* Search */}
        <div className="p-4 border-b border-[#E7E4F2]/60 space-y-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-gray-250 bg-white py-2 pl-9 pr-4 text-xs outline-none focus:border-[#6C4BF4] transition"
            />
          </div>

          {/* Read/Unread Filters */}
          <div className="flex bg-gray-100 p-0.5 rounded-lg text-xs font-bold text-[#6B6880]">
            {["All", "Unread", "Read"].map((opt) => (
              <button
                key={opt}
                onClick={() => setFilter(opt)}
                className={`flex-1 py-1.5 rounded-md transition ${
                  filter === opt 
                    ? "bg-white text-[#17152A] shadow-xs" 
                    : "hover:text-[#17152A]"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Chats List Scrollable */}
        <div className="flex-1 overflow-y-auto divide-y divide-[#E7E4F2]/40">
          {filteredChats.length === 0 ? (
            <div className="p-6 text-center text-xs text-[#6B6880]">
              No conversations found.
            </div>
          ) : (
            filteredChats.map((chat) => {
              const isSelected = chat.id === activeChat.id;
              return (
                <button
                  key={chat.id}
                  onClick={() => selectChat(chat.id)}
                  className={`w-full text-left p-4 transition-colors flex gap-3 items-start ${
                    isSelected ? "bg-[#F0ECFF]" : "hover:bg-gray-50"
                  }`}
                >
                  {/* Avatar */}
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0 ${
                    chat.role === "Author" ? "bg-[#6C4BF4]" : "bg-sky-500"
                  }`}>
                    {chat.avatar}
                  </div>

                  {/* Body */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline">
                      <h4 className="text-xs font-extrabold text-[#17152A] truncate">{chat.name}</h4>
                      <span className="text-[10px] text-[#6B6880] shrink-0 font-medium">{chat.time}</span>
                    </div>

                    <div className="flex items-center gap-1.5 mt-1">
                      <span className={`text-[9px] font-black px-1.5 py-0.25 rounded-md ${
                        chat.role === "Author" 
                          ? "bg-[#6C4BF4]/10 text-[#6C4BF4]" 
                          : "bg-sky-100 text-sky-600"
                      }`}>
                        {chat.role}
                      </span>
                    </div>

                    <p className={`text-xs mt-1.5 truncate ${
                      chat.unreadCount > 0 ? "font-bold text-[#17152A]" : "text-[#6B6880]"
                    }`}>
                      {chat.lastMessage}
                    </p>
                  </div>

                  {/* Badge */}
                  {chat.unreadCount > 0 && (
                    <span className="h-4 min-w-4 flex items-center justify-center rounded-full bg-[#6C4BF4] px-1 text-[9px] font-bold text-white shrink-0 mt-0.5">
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
      <div className={`flex-1 flex flex-col h-full bg-[#FAF9FF] ${
        showMobileChat ? "flex" : "hidden md:flex"
      }`}>
        {activeChat ? (
          <>
            {/* Active Header */}
            <div className="p-4 bg-white border-b border-[#E7E4F2] flex items-center gap-3 shrink-0">
              {/* Back button for mobile view */}
              <button
                onClick={() => setShowMobileChat(false)}
                className="md:hidden p-1.5 rounded-xl hover:bg-gray-100 text-[#6B6880]"
              >
                <ChevronLeft size={20} />
              </button>

              <div className={`h-10 w-10 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0 ${
                activeChat.role === "Author" ? "bg-[#6C4BF4]" : "bg-sky-500"
              }`}>
                {activeChat.avatar}
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-[#17152A]">{activeChat.name}</h3>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className={`text-[9px] font-black px-1.5 py-0.25 rounded-md ${
                    activeChat.role === "Author" 
                      ? "bg-[#6C4BF4]/10 text-[#6C4BF4]" 
                      : "bg-sky-100 text-sky-600"
                  }`}>
                    {activeChat.role}
                  </span>
                  <span className="text-[10px] text-green-500 font-semibold">• Active Now</span>
                </div>
              </div>
            </div>

            {/* Messages scroll content */}
            <div className="flex-1 p-6 overflow-y-auto space-y-4">
              {activeChat.messages.map((msg) => {
                const isAdmin = msg.sender === "admin";
                return (
                  <div 
                    key={msg.id}
                    className={`flex ${isAdmin ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`max-w-[70%] rounded-2xl px-4 py-2.5 text-xs shadow-xs ${
                      isAdmin 
                        ? "bg-[#6C4BF4] text-white rounded-tr-none" 
                        : "bg-white text-[#17152A] border border-[#E7E4F2] rounded-tl-none"
                    }`}>
                      <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                      <div className={`flex items-center justify-end gap-1 mt-1 text-[9px] ${
                        isAdmin ? "text-purple-200" : "text-[#6B6880]"
                      }`}>
                        <span>{msg.time}</span>
                        {isAdmin && <CheckCheck size={10} className="text-white" />}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Input area */}
            <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-[#E7E4F2] flex gap-3 items-center shrink-0">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder={`Type a message to ${activeChat.name}...`}
                className="flex-1 rounded-xl border border-gray-250 bg-[#F8F7FF] py-3 px-4 text-xs outline-none focus:border-[#6C4BF4] transition"
              />
              <button
                type="submit"
                className="h-10 w-10 flex items-center justify-center rounded-xl bg-[#6C4BF4] text-white hover:bg-[#5B3DE0] transition shadow-md shadow-[#6C4BF4]/20 shrink-0"
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
