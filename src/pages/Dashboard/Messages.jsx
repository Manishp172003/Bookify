import { useState, useRef, useEffect } from "react";
import DashboardSidebar from "../../components/dashboard/DashboardSidebar";
import { Send, Calendar, MapPin } from "lucide-react";

const INITIAL_CHATS = [
  {
    id: 1,
    name: "Sneha Reddy",
    book: "Introduction to Algorithms",
    avatar: "/images/profile-avatar.png",
    unread: false,
    lastMsg: "Let's meet near the central library tomorrow?",
    history: [
      { sender: "them", text: "Hey! Is the Introduction to Algorithms book still available?", time: "10:30 AM" },
      { sender: "me", text: "Yes, it is! The condition is very good, no highlight marks.", time: "10:35 AM" },
      { sender: "them", text: "Awesome. I'm willing to buy it for ₹650. Can we meet on campus?", time: "10:40 AM" },
      { sender: "me", text: "Sure, campus meetup works perfectly for me.", time: "10:42 AM" },
      { sender: "them", text: "Let's meet near the central library tomorrow?", time: "10:45 AM" }
    ]
  },
  {
    id: 2,
    name: "Aarav Sharma",
    book: "Concepts of Physics Vol 1",
    avatar: "/images/profile-avatar.png",
    unread: true,
    lastMsg: "Is the price negotiable?",
    history: [
      { sender: "them", text: "Hello, interested in your Physics textbook. Is the price negotiable?", time: "Yesterday" }
    ]
  },
  {
    id: 3,
    name: "Sneha Patel",
    book: "Organic Chemistry, 8th Edition",
    avatar: "/images/profile-avatar.png",
    unread: false,
    lastMsg: "Thanks for the book! Swap went smoothly.",
    history: [
      { sender: "me", text: "Hey, did you reach the cafeteria?", time: "12 Aug" },
      { sender: "them", text: "Yes, sitting near the entrance.", time: "12 Aug" },
      { sender: "me", text: "Cool, I see you. Coming over.", time: "12 Aug" },
      { sender: "them", text: "Thanks for the book! Swap went smoothly.", time: "12 Aug" }
    ]
  }
];

export default function Messages() {
  const [chats, setChats] = useState(INITIAL_CHATS);
  const [activeChatId, setActiveChatId] = useState(1);
  const [typedMessage, setTypedMessage] = useState("");
  const [showCoordinator, setShowCoordinator] = useState(false);
  
  // Meetup parameters
  const [meetupLocation, setMeetupLocation] = useState("Central Library");
  const [meetupTime, setMeetupTime] = useState("4:00 PM Wednesday");

  const chatContainerRef = useRef(null);

  const activeChat = chats.find(c => c.id === activeChatId) || chats[0];

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [activeChat.history]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!typedMessage.trim()) return;

    const newMessage = {
      sender: "me",
      text: typedMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    updateChatHistory(newMessage);
    setTypedMessage("");
  };

  const handleProposeMeetup = () => {
    const meetupText = `📅 Campus Meetup Proposal:\n📍 Location: ${meetupLocation}\n⏰ Time: ${meetupTime}`;
    const newMsg = {
      sender: "me",
      text: meetupText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMeetup: true
    };
    updateChatHistory(newMsg);
    setShowCoordinator(false);
  };

  const updateChatHistory = (newMessage) => {
    setChats(prev =>
      prev.map(chat => {
        if (chat.id === activeChatId) {
          return {
            ...chat,
            lastMsg: newMessage.text.startsWith("📅") ? "Proposed a campus meetup" : newMessage.text,
            history: [...chat.history, newMessage]
          };
        }
        return chat;
      })
    );
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gradient-to-br from-[#F4F2FF] via-[#F8F7FF] to-[#F0F5FF]">
      <DashboardSidebar />

      <div className="flex min-w-0 flex-1 flex-col h-full">
        <main className="flex-1 overflow-hidden p-7 flex flex-col animate-fade-in-up">
          
          {/* Header */}
          <div className="mb-6 shrink-0">
            <h1 className="text-2xl font-bold text-[#17152A]">Messages</h1>
            <p className="text-sm text-gray-500">Negotiate and organize textbook handovers with fellow students.</p>
          </div>

          {/* Core Chat Screen container */}
          <div className="flex-1 flex rounded-2xl bg-white border border-gray-100 overflow-hidden shadow-sm min-h-0">
            
            {/* Left pane: Chats listing */}
            <div className="w-80 border-r border-gray-100 flex flex-col shrink-0">
              <div className="p-4 border-b border-gray-100 shrink-0">
                <h3 className="font-bold text-sm text-[#17152A]">Recent Chats</h3>
              </div>
              <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
                {chats.map(chat => (
                  <button
                    key={chat.id}
                    onClick={() => setActiveChatId(chat.id)}
                    className={`w-full text-left p-4 transition flex gap-3 items-center hover:bg-gray-50 cursor-pointer ${
                      activeChatId === chat.id ? "bg-[#6C4BF4]/5 border-l-4 border-[#6C4BF4]" : "border-l-4 border-transparent"
                    }`}
                  >
                    <div className="h-10 w-10 rounded-full bg-gray-100 shrink-0 overflow-hidden border border-gray-200">
                      <img src={chat.avatar} alt={chat.name} className="h-full w-full object-cover" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-xs text-[#17152A] truncate">{chat.name}</span>
                        {chat.unread && <span className="h-2 w-2 rounded-full bg-[#6C4BF4]" />}
                      </div>
                      <p className="text-[10px] text-gray-400 font-bold truncate mt-0.5">{chat.book}</p>
                      <p className="text-[10px] text-gray-400 truncate mt-1">{chat.lastMsg}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Right pane: Main active thread */}
            <div className="flex-1 flex flex-col bg-gray-50/30">
              {/* Active Header */}
              <div className="p-4 bg-white border-b border-gray-100 flex justify-between items-center shrink-0">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-gray-100 overflow-hidden border border-gray-200">
                    <img src={activeChat.avatar} alt={activeChat.name} className="h-full w-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-[#17152A]">{activeChat.name}</h4>
                    <p className="text-[9px] text-gray-400 font-bold truncate mt-0.5">Regarding: {activeChat.book}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowCoordinator(true)}
                  className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-xs font-bold text-gray-700 hover:text-[#6C4BF4] hover:bg-gray-50 shadow-xs cursor-pointer"
                >
                  <Calendar size={13} />
                  Propose Meetup
                </button>
              </div>

              {/* Chat Thread */}
              <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4">
                {activeChat.history.map((msg, idx) => {
                  const isMe = msg.sender === "me";
                  return (
                    <div key={idx} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[70%] rounded-2xl p-3.5 shadow-sm text-xs leading-relaxed ${
                        isMe
                          ? msg.isMeetup
                            ? "bg-amber-50 border border-amber-100 text-amber-900 font-medium"
                            : "bg-[#6C4BF4] text-white"
                          : "bg-white border border-gray-100 text-[#17152A]"
                      }`}>
                        {msg.isMeetup ? (
                          <div className="space-y-1 text-[11px]">
                            <p className="font-bold text-amber-800 flex items-center gap-1">
                              <Calendar size={13} />
                              Campus Meetup Proposal
                            </p>
                            <p className="flex items-center gap-1 text-amber-700">
                              <MapPin size={12} />
                              Spot: {msg.text.split("Location: ")[1]?.split("\n")[0] || "Central Library"}
                            </p>
                            <p className="text-amber-700">
                              Time: {msg.text.split("Time: ")[1] || "4:00 PM Wednesday"}
                            </p>
                            <div className="mt-3 flex gap-1.5 justify-end">
                              <button onClick={() => alert("Meetup proposal accepted!")} className="bg-amber-600 text-white rounded-lg px-2.5 py-1 text-[9px] font-bold hover:bg-amber-700 cursor-pointer">
                                Accept
                              </button>
                              <button onClick={() => alert("Proposal declined.")} className="border border-amber-200 text-amber-700 rounded-lg px-2.5 py-1 text-[9px] font-bold hover:bg-amber-100 cursor-pointer bg-white">
                                Decline
                              </button>
                            </div>
                          </div>
                        ) : (
                          <p>{msg.text}</p>
                        )}
                        <p className={`text-[8px] text-right mt-1.5 select-none ${isMe ? "text-white/60" : "text-gray-400"}`}>
                          {msg.time}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-gray-100 flex gap-2 shrink-0">
                <input
                  type="text"
                  placeholder="Type your message here..."
                  value={typedMessage}
                  onChange={(e) => setTypedMessage(e.target.value)}
                  className="flex-1 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-xs outline-none focus:border-[#6C4BF4] focus:bg-white transition"
                />
                <button
                  type="submit"
                  className="h-10 w-10 rounded-xl bg-[#6C4BF4] text-white flex items-center justify-center hover:bg-[#5B3DE0] cursor-pointer shadow-sm shadow-[#6C4BF4]/20"
                >
                  <Send size={15} />
                </button>
              </form>

            </div>

          </div>

          {/* Meetup Coordinator Modal */}
          {showCoordinator && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-fade-in">
              <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-gray-100">
                <h3 className="text-lg font-bold text-[#17152A] mb-1">Campus Meetup Coordinator</h3>
                <p className="text-xs text-gray-400 mb-4">Suggest a safe, populated public spot on campus to conduct the textbook trade.</p>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] text-gray-400 font-bold uppercase block mb-1">Select Campus Spot</label>
                    <select
                      value={meetupLocation}
                      onChange={(e) => setMeetupLocation(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-xs text-[#17152A] outline-none focus:border-[#6C4BF4]"
                    >
                      <option value="Central Library (Ground Floor)">Central Library (Ground Floor)</option>
                      <option value="Student Cafeteria (Main Canteen)">Student Cafeteria (Main Canteen)</option>
                      <option value="College Gate 1 Plaza">College Gate 1 Plaza</option>
                      <option value="Auditorium Entrance">Auditorium Entrance</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-400 font-bold uppercase block mb-1">Proposed Time / Day</label>
                    <input
                      type="text"
                      placeholder="e.g. Wednesday 4:00 PM"
                      value={meetupTime}
                      onChange={(e) => setMeetupTime(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-xs text-[#17152A] outline-none focus:border-[#6C4BF4]"
                    />
                  </div>
                </div>

                <div className="mt-6 flex gap-2">
                  <button
                    onClick={handleProposeMeetup}
                    className="flex-grow rounded-xl bg-[#6C4BF4] text-white py-3 text-xs font-bold hover:bg-[#5B3DE0] cursor-pointer"
                  >
                    Propose Meetup
                  </button>
                  <button
                    onClick={() => setShowCoordinator(false)}
                    className="rounded-xl border border-gray-200 text-gray-500 px-5 py-3 text-xs font-bold hover:bg-gray-55 cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
