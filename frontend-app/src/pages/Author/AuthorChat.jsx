import React, { useState, useEffect, useRef } from "react";
import {
  Send,
  CheckCheck,
  Headphones,
  Sparkles,
  HelpCircle,
  Clock,
  ShieldCheck,
  DollarSign,
  BookOpen,
  Megaphone,
  FileCheck
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useCommerce } from "../../context/CommerceContext";
import { authorSupportService, INQUIRY_TOPICS } from "../../services/authorSupportService";

const TOPIC_ICONS = {
  royalty: DollarSign,
  isbn: FileCheck,
  campaign: Megaphone,
  listing: BookOpen
};

function AuthorChat() {
  const { user } = useAuth();
  const { socket } = useCommerce();
  const authorId = user?._id || user?.id || "demo_author";

  const [thread, setThread] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Load and subscribe to thread updates
  useEffect(() => {
    const activeThread = authorSupportService.getThreadForAuthor(authorId, user);
    setThread(activeThread);
    authorSupportService.markAsReadByAuthor(authorId);

    const handleUpdate = () => {
      const updated = authorSupportService.getThreadForAuthor(authorId, user);
      setThread({ ...updated });
      authorSupportService.markAsReadByAuthor(authorId);
    };

    window.addEventListener("bookify_author_support_changed", handleUpdate);
    window.addEventListener("storage", handleUpdate);

    return () => {
      window.removeEventListener("bookify_author_support_changed", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, [authorId, user]);

  // Socket setup
  useEffect(() => {
    if (!socket) return;

    const roomName = `support_author_${authorId}`;
    socket.emit("joinChat", roomName);

    const handleIncomingMessage = (data) => {
      if (
        data &&
        (data.conversationId === roomName ||
          data.conversationId === `chat_${roomName}` ||
          data.recipientId === authorId)
      ) {
        const updated = authorSupportService.getThreadForAuthor(authorId, user);
        setThread({ ...updated });
      }
    };

    socket.on("newChatMessage", handleIncomingMessage);

    return () => {
      socket.emit("leaveChat", roomName);
      socket.off("newChatMessage", handleIncomingMessage);
    };
  }, [socket, authorId, user]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [thread?.messages]);

  const handleSendMessage = (textToSend) => {
    const messageText = (textToSend || newMessage).trim();
    if (!messageText) return;

    const result = authorSupportService.sendAuthorMessage(authorId, user, messageText);
    if (result) {
      setThread({ ...result.thread });
      setNewMessage("");

      // Notify socket
      if (socket && socket.connected) {
        socket.emit("sendChatMessage", {
          conversationId: `support_author_${authorId}`,
          text: messageText,
          senderId: authorId,
          senderName: user?.penName || user?.fullName || "Author",
          senderEmail: user?.email || "",
          recipientName: "Bookify Editorial Staff",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        });
      }
    }
  };

  const handleQuickTopicClick = (topic) => {
    setNewMessage(topic.prompt);
    inputRef.current?.focus();
  };

  return (
    <div className="h-[calc(100vh-7.5rem)] flex flex-col md:flex-row bg-white rounded-3xl border border-[#E7E4F2] shadow-sm overflow-hidden relative">
      {/* Left Sidebar: Support Desk Information & FAQ Shortcuts */}
      <div className="w-full md:w-84 border-r border-[#E7E4F2] bg-[#FAF9FF] flex flex-col shrink-0">
        {/* Header Branding */}
        <div className="p-5 border-b border-[#E7E4F2]/80 bg-white">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-[#6C4BF4] to-[#8F72FA] flex items-center justify-center text-white shadow-md shadow-[#6C4BF4]/25 shrink-0">
              <Headphones size={20} />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-[#17152A] leading-tight">
                Author & Editorial Desk
              </h2>
              <p className="text-[11px] text-[#6B6880] flex items-center gap-1.5 mt-0.5 font-medium">
                <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                Staff Online &bull; Direct Line
              </p>
            </div>
          </div>
        </div>

        {/* Operating Hours & Policy Banner */}
        <div className="p-4 mx-4 mt-4 rounded-2xl bg-gradient-to-br from-[#6C4BF4]/5 via-[#6C4BF4]/10 to-indigo-50/50 border border-[#6C4BF4]/15">
          <div className="flex items-start gap-2.5">
            <ShieldCheck size={16} className="text-[#6C4BF4] shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-[#17152A]">Verified Author Priority</p>
              <p className="text-[11px] text-[#6B6880] mt-0.5 leading-relaxed">
                Inquiries are answered directly by Bookify operations, royalties & editorial staff.
              </p>
            </div>
          </div>
          <div className="mt-3 pt-2.5 border-t border-[#6C4BF4]/15 flex items-center justify-between text-[10px] text-[#6B6880] font-semibold">
            <span className="flex items-center gap-1">
              <Clock size={12} className="text-[#6C4BF4]" />
              Response &lt; 15 mins
            </span>
            <span className="text-[#6C4BF4] font-bold">Mon &ndash; Sat</span>
          </div>
        </div>

        {/* Quick Inquiry Categories */}
        <div className="p-4 flex-1 overflow-y-auto">
          <div className="flex items-center justify-between mb-2.5">
            <p className="text-[11px] font-extrabold uppercase tracking-wider text-[#6B6880]">
              Quick Inquiries
            </p>
            <span className="text-[10px] text-[#6C4BF4] font-bold flex items-center gap-0.5">
              <Sparkles size={11} /> 1-Click
            </span>
          </div>

          <div className="space-y-2">
            {INQUIRY_TOPICS.map((topic) => {
              const IconComponent = TOPIC_ICONS[topic.id] || HelpCircle;
              return (
                <button
                  key={topic.id}
                  onClick={() => handleQuickTopicClick(topic)}
                  className="w-full text-left p-3 rounded-xl bg-white hover:bg-[#F3EFFE] border border-[#E7E4F2] hover:border-[#6C4BF4]/40 transition-all duration-200 group shadow-xs cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="h-7 w-7 rounded-lg bg-[#6C4BF4]/10 text-[#6C4BF4] flex items-center justify-center shrink-0 group-hover:bg-[#6C4BF4] group-hover:text-white transition">
                      <IconComponent size={14} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#17152A] group-hover:text-[#6C4BF4] transition truncate">
                          {topic.title}
                        </span>
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-gray-100 text-gray-500 shrink-0">
                          {topic.badge}
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Guidelines note */}
          <div className="mt-5 p-3 rounded-xl bg-amber-50/70 border border-amber-200/80">
            <p className="text-[11px] font-bold text-amber-900 flex items-center gap-1.5">
              <HelpCircle size={13} className="text-amber-700" />
              Publishing Tip
            </p>
            <p className="text-[10px] text-amber-800/90 mt-1 leading-relaxed">
              For royalty payment updates, please provide your IFSC code and Author ID for instant manual verification.
            </p>
          </div>
        </div>
      </div>

      {/* Main Conversation Panel */}
      <div className="flex-1 flex flex-col h-full bg-[#FAF9FF]">
        {/* Top Active Chat Header */}
        <div className="p-4 bg-white border-b border-[#E7E4F2] flex items-center justify-between shrink-0 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-[#6C4BF4] to-[#4320DF] flex items-center justify-center text-white text-xs font-black shadow-inner">
              BK
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-extrabold text-[#17152A]">
                  Bookify Editorial & Operations Desk
                </h3>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-[#6C4BF4]/10 text-[#6C4BF4] border border-[#6C4BF4]/20">
                  Official Support
                </span>
              </div>
              <p className="text-[11px] text-[#6B6880] mt-0.5">
                Connecting with publishing desk staff &bull; Thread ID: {thread?.id || "Active"}
              </p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Support Active
          </div>
        </div>

        {/* Quick Topic Chips Strip */}
        <div className="px-4 py-2.5 bg-white/70 border-b border-[#E7E4F2] flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0">
          <span className="text-[10px] font-bold text-[#6B6880] uppercase tracking-wider shrink-0 flex items-center gap-1">
            <Sparkles size={11} className="text-[#6C4BF4]" />
            Inquire:
          </span>
          {INQUIRY_TOPICS.map((topic) => (
            <button
              key={topic.id}
              onClick={() => handleQuickTopicClick(topic)}
              className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#F3EFFE] text-[#6C4BF4] hover:bg-[#6C4BF4] hover:text-white transition whitespace-nowrap border border-[#6C4BF4]/20 shrink-0 cursor-pointer"
            >
              {topic.title}
            </button>
          ))}
        </div>

        {/* Messages Body */}
        <div className="flex-1 p-5 md:p-6 overflow-y-auto space-y-4">
          {thread?.messages?.map((msg) => {
            const isAuthor = msg.sender === "author";
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isAuthor ? "justify-end" : "justify-start"}`}
              >
                {!isAuthor && (
                  <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-[#6C4BF4] to-[#8F72FA] text-white flex items-center justify-center text-[10px] font-extrabold shrink-0 shadow-xs mt-1">
                    BK
                  </div>
                )}

                <div
                  className={`max-w-[85%] md:max-w-[70%] rounded-2xl px-4.5 py-3 text-xs shadow-xs ${
                    isAuthor
                      ? "bg-gradient-to-r from-[#6C4BF4] to-[#5939E8] text-white rounded-tr-none shadow-md shadow-[#6C4BF4]/15"
                      : "bg-white text-[#17152A] border border-[#E7E4F2] rounded-tl-none"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3 mb-1">
                    <span
                      className={`text-[10px] font-extrabold ${
                        isAuthor ? "text-purple-200" : "text-[#6C4BF4]"
                      }`}
                    >
                      {isAuthor ? (user?.penName || user?.fullName || "You") : msg.senderName}
                    </span>
                    <span
                      className={`text-[9px] font-medium ${
                        isAuthor ? "text-purple-200/80" : "text-[#6B6880]"
                      }`}
                    >
                      {msg.time}
                    </span>
                  </div>

                  <p className="leading-relaxed whitespace-pre-wrap font-normal">{msg.text}</p>

                  {isAuthor && (
                    <div className="flex items-center justify-end gap-1 mt-1 text-[9px] text-purple-200">
                      <span>Delivered</span>
                      <CheckCheck size={11} className="text-white" />
                    </div>
                  )}
                </div>

                {isAuthor && (
                  <div className="h-8 w-8 rounded-xl bg-[#6C4BF4]/15 text-[#6C4BF4] flex items-center justify-center text-[10px] font-black shrink-0 overflow-hidden border border-[#6C4BF4]/20 mt-1">
                    {user?.authorAvatar || user?.avatar ? (
                      <img
                        src={user.authorAvatar || user.avatar}
                        alt="Author"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span>
                        {(user?.penName || user?.fullName || "AU")
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()}
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="p-4 bg-white border-t border-[#E7E4F2] flex gap-3 items-center shrink-0"
        >
          <input
            ref={inputRef}
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your inquiry or choose a topic shortcut above..."
            className="flex-1 rounded-2xl border border-gray-250 bg-[#F8F7FF] py-3.5 px-4.5 text-xs outline-none focus:border-[#6C4BF4] focus:bg-white transition text-[#17152A] placeholder:text-gray-400"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="h-11 w-11 flex items-center justify-center rounded-2xl bg-[#6C4BF4] text-white hover:bg-[#5B3DE0] disabled:opacity-40 disabled:hover:bg-[#6C4BF4] transition shadow-md shadow-[#6C4BF4]/20 shrink-0 cursor-pointer"
            title="Send inquiry"
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}

export default AuthorChat;