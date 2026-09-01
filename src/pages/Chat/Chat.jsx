import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCommerce } from "../../context/CommerceContext";
import ChatList from "../../components/chat/ChatList";
import ChatWindow from "../../components/chat/ChatWindow";
import SellerInfoPanel from "../../components/chat/SellerInfoPanel";
import { MessageSquare, ShieldCheck, Zap } from "lucide-react";

function Chat() {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const { conversations, activeConversation, activeConversationId, selectConversation, sendMessage } = useCommerce();

  const [showMobileList, setShowMobileList] = useState(!conversationId);
  const [showInfoPanel, setShowInfoPanel] = useState(true);

  // Sync conversationId from URL param if present
  useEffect(() => {
    if (conversationId) {
      selectConversation(conversationId);
      setShowMobileList(false);
    }
  }, [conversationId]);

  const handleSelect = (id) => {
    selectConversation(id);
    navigate(`/chat/${id}`);
    setShowMobileList(false);
  };

  const handleBackToList = () => {
    setShowMobileList(true);
  };

  return (
    <div className="max-w-[1440px] mx-auto px-6 md:px-10 py-6 h-[calc(100vh-66px)] flex flex-col animate-fade-in">
      {/* Top Banner / Breadcrumb */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold tracking-tight text-[#17152A]">
              Direct Messages
            </h1>
            <span className="flex items-center gap-1.5 rounded-full bg-[#E9E4FF] px-2.5 py-0.5 text-xs font-bold text-[#6C4BF4]">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <Zap size={12} /> Instant Chat
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            Chat directly with verified student book sellers across campuses.
          </p>
        </div>

        {/* Escrow badge */}
        <div className="hidden sm:flex items-center gap-2 rounded-xl border border-[#E9E4FF] bg-[#F0ECFF]/60 px-3 py-1.5 text-xs font-semibold text-[#6C4BF4]">
          <ShieldCheck size={16} />
          <span>Payments protected by Bookify Escrow Guarantee</span>
        </div>
      </div>

      {/* Main Chat Container Box */}
      <div className="flex-1 min-h-0 overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-xl flex">
        {/* Left Column: ChatList */}
        <div
          className={`w-full lg:w-80 xl:w-96 shrink-0 border-r border-gray-100 animate-slide-in-left ${
            showMobileList ? "block h-full" : "hidden lg:block h-full"
          }`}
        >
          <ChatList
            conversations={conversations}
            activeId={activeConversationId}
            onSelectConversation={handleSelect}
          />
        </div>

        {/* Center Column: Active Chat Window */}
        <div
          className={`flex-1 flex flex-col min-w-0 animate-fade-in ${
            !showMobileList ? "block h-full" : "hidden lg:flex h-full"
          }`}
        >
          {activeConversation ? (
            <ChatWindow
              conversation={activeConversation}
              onSendMessage={sendMessage}
              onBackToList={handleBackToList}
              showInfoPanel={showInfoPanel}
              onToggleInfoPanel={() => setShowInfoPanel(!showInfoPanel)}
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center p-8 text-center text-gray-400">
              <MessageSquare size={48} className="text-[#6C4BF4]/40 mb-3" />
              <h3 className="text-base font-bold text-[#17152A]">No conversation selected</h3>
              <p className="text-xs text-gray-500 max-w-xs mt-1">
                Choose a conversation from the list to discuss book conditions and pricing with student sellers.
              </p>
            </div>
          )}
        </div>

        {/* Right Column: Seller Profile / Escrow Info Panel (Desktop) */}
        {showInfoPanel && activeConversation && (
          <div className="hidden xl:block w-72 shrink-0 border-l border-gray-100 h-full animate-slide-in-right">
            <SellerInfoPanel
              seller={activeConversation.seller}
              book={activeConversation.book}
              onClose={() => setShowInfoPanel(false)}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default Chat;
