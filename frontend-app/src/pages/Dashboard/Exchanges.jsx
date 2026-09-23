import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DashboardSidebar from "../../components/dashboard/DashboardSidebar";
import { useCommerce } from "../../context/CommerceContext";
import { ArrowLeftRight, MessageSquare, Check, X, MapPin, Menu, ShieldCheck, CheckCircle2 } from "lucide-react";
import { api } from "../../services/apiClient";

const INITIAL_RECEIVED = [
  {
    id: "SWP-9021",
    partner: "Sneha Reddy",
    partnerId: "usr_sneha",
    status: "Pending Decision",
    statusColor: "text-amber-600 bg-amber-50 border-amber-100",
    yourBook: {
      title: "Introduction to Algorithms",
      condition: "Very Good",
      coverClass: "from-[#111827] to-[#374151]"
    },
    theirBook: {
      title: "Compiler Design: Principles",
      condition: "Like New",
      coverClass: "from-[#065F46] to-[#047857]"
    }
  }
];

const INITIAL_SENT = [
  {
    id: "SWP-3820",
    partner: "Aarav Sharma",
    partnerId: "usr_aarav",
    status: "Accepted - Meetup Pending",
    statusColor: "text-green-600 bg-green-50 border-green-100",
    yourBook: {
      title: "Organic Chemistry, 8th Edition",
      condition: "Good",
      coverClass: "from-[#0F172A] to-[#1E293B]"
    },
    theirBook: {
      title: "Concepts of Physics Vol 1",
      condition: "Very Good",
      coverClass: "from-[#E11D48] to-[#F43F5E]"
    }
  }
];

export default function Exchanges() {
  const { showToast, startOrGetConversation } = useCommerce();
  const [activeTab, setActiveTab] = useState("Received");
  const [receivedList, setReceivedList] = useState(INITIAL_RECEIVED);
  const [sentList, setSentList] = useState(INITIAL_SENT);
  const [selectedMeetup, setSelectedMeetup] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchExchanges = async () => {
      try {
        setIsLoading(true);
        const res = await api.get("/exchanges/my-exchanges");
        if (res?.data) {
          if (res.data.received && res.data.received.length > 0) {
            setReceivedList(res.data.received);
          }
          if (res.data.sent && res.data.sent.length > 0) {
            setSentList(res.data.sent);
          }
        }
      } catch (err) {
        console.warn("Could not fetch exchanges from backend, using fallback:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchExchanges();
  }, []);

  const list = activeTab === "Received" ? receivedList : sentList;

  const handleAction = async (id, type) => {
    try {
      await api.patch(`/exchanges/${id}/respond`, { action: type });
    } catch (err) {
      console.warn("API respond exchange failed:", err);
    }

    if (type === "Accepted") {
      setReceivedList(prev =>
        prev.map(item =>
          item.id === id || item._id === id
            ? {
                ...item,
                status: "Accepted - Meetup Pending",
                statusColor: "text-green-600 bg-green-50 border-green-100"
              }
            : item
        )
      );
      if (showToast) showToast(`Swap proposal ${id} accepted! You can now coordinate meetup at library.`, "success");
    } else {
      setReceivedList(prev =>
        prev.map(item =>
          item.id === id || item._id === id
            ? {
                ...item,
                status: "Declined",
                statusColor: "text-red-600 bg-red-50 border-red-100"
              }
            : item
        )
      );
      if (showToast) showToast(`Swap proposal ${id} declined.`, "info");
    }
  };

  const handleComplete = async (id) => {
    try {
      await api.patch(`/exchanges/${id}/complete`);
    } catch (err) {
      console.warn("API complete exchange failed:", err);
    }

    const updater = prev =>
      prev.map(item =>
        item.id === id || item._id === id
          ? {
              ...item,
              status: "Completed",
              statusColor: "text-blue-600 bg-blue-50 border-blue-100"
            }
          : item
      );

    setReceivedList(updater);
    setSentList(updater);
    if (showToast) showToast("Exchange confirmed! Handover successfully completed. 🎉", "success");
  };

  const handleOpenChat = (item) => {
    startOrGetConversation(
      { id: item.partnerId || "partner_usr", name: item.partner },
      { id: item.id, title: `${item.yourBook.title} ↔ ${item.theirBook.title}`, price: "Exchange" },
      `Hi ${item.partner}, regarding our textbook exchange for "${item.yourBook.title}" with "${item.theirBook.title}".`
    );
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gradient-to-br from-[#F4F2FF] via-[#F8F7FF] to-[#F0F5FF]">
      <DashboardSidebar />

      <div className="flex min-w-0 flex-1 flex-col h-full">
        <main className="flex-1 overflow-y-auto p-4 md:p-7 animate-fade-in-up">
          
          {/* Header */}
          <div className="mb-6 flex items-start gap-3 select-none">
            {/* Mobile Hamburger Menu */}
            <button
              onClick={() => window.dispatchEvent(new Event("toggle-sidebar"))}
              className="lg:hidden p-1.5 rounded-lg text-gray-500 hover:bg-gray-50 hover:text-[#6C4BF4] transition cursor-pointer mt-1"
            >
              <Menu size={20} />
            </button>

            <div>
              <h1 className="text-xl md:text-2xl font-bold text-[#17152A]">Textbook Exchanges</h1>
              <p className="mt-0.5 text-xs text-gray-400">Swap and trade textbook copies with other college students across campus.</p>
            </div>
          </div>

          {/* Toggle Tabs */}
          <div className="flex border-b border-gray-150 mb-6 gap-6">
            <button
              onClick={() => setActiveTab("Received")}
              className={`pb-3 text-sm font-semibold transition border-b-2 cursor-pointer ${
                activeTab === "Received" ? "border-[#6C4BF4] text-[#6C4BF4]" : "border-transparent text-gray-500 hover:text-gray-800"
              }`}
            >
              Offers Received ({receivedList.length})
            </button>
            <button
              onClick={() => setActiveTab("Sent")}
              className={`pb-3 text-sm font-semibold transition border-b-2 cursor-pointer ${
                activeTab === "Sent" ? "border-[#6C4BF4] text-[#6C4BF4]" : "border-transparent text-gray-500 hover:text-gray-800"
              }`}
            >
              Offers Sent ({sentList.length})
            </button>
          </div>

          {/* Exchanges stack */}
          <div className="space-y-6">
            {list.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 rounded-2xl bg-white border border-gray-100 p-8 text-center">
                <ArrowLeftRight size={48} className="text-gray-300 mb-3" />
                <h3 className="font-bold text-[#17152A] text-lg">No exchange proposals</h3>
                <p className="text-sm text-gray-400 mt-1">There are no swap offers listed in this tab.</p>
              </div>
            ) : (
              list.map((item) => (
                <div key={item.id} className="rounded-2xl bg-white border border-gray-100 p-6 shadow-sm">
                  
                  {/* Top Header Card Info */}
                  <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-5 flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-gray-400">{item.id}</span>
                      <span className="text-xs text-gray-500">Partner: <span className="font-bold text-[#17152A]">{item.partner}</span></span>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${item.statusColor}`}>
                      {item.status}
                    </span>
                  </div>

                  {/* Side-by-Side Swapping Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-5 items-center gap-4">
                    
                    {/* Your book */}
                    <div className="md:col-span-2 rounded-xl bg-gray-50 p-4 border border-gray-100 flex items-center gap-3">
                      <div className={`h-16 w-11 shrink-0 rounded bg-gradient-to-br ${item.yourBook.coverClass} flex items-center justify-center text-[7px] font-extrabold text-white uppercase border border-black/5`}>
                        {item.yourBook.title.split(' ').map(w => w[0]).join('')}
                      </div>
                      <div className="min-w-0">
                        <p className="text-[9px] text-gray-400 font-bold uppercase">Your Book</p>
                        <h4 className="font-bold text-xs text-[#17152A] truncate mt-0.5">{item.yourBook.title}</h4>
                        <p className="text-[10px] text-gray-400 mt-0.5">Cond: {item.yourBook.condition}</p>
                      </div>
                    </div>

                    {/* Swap indicator */}
                    <div className="flex justify-center md:col-span-1">
                      <div className="h-10 w-10 rounded-full bg-[#6C4BF4]/5 border border-[#6C4BF4]/10 text-[#6C4BF4] flex items-center justify-center rotate-90 md:rotate-0">
                        <ArrowLeftRight size={16} />
                      </div>
                    </div>

                    {/* Their Book */}
                    <div className="md:col-span-2 rounded-xl bg-[#F8F7FF] p-4 border border-[#E9E4FF] flex items-center gap-3">
                      <div className={`h-16 w-11 shrink-0 rounded bg-gradient-to-br ${item.theirBook.coverClass} flex items-center justify-center text-[7px] font-extrabold text-white uppercase border border-black/5`}>
                        {item.theirBook.title.split(' ').map(w => w[0]).join('')}
                      </div>
                      <div className="min-w-0">
                        <p className="text-[9px] text-[#6C4BF4] font-bold uppercase">Their Offered Book</p>
                        <h4 className="font-bold text-xs text-[#17152A] truncate mt-0.5">{item.theirBook.title}</h4>
                        <p className="text-[10px] text-gray-400 mt-0.5">Cond: {item.theirBook.condition}</p>
                      </div>
                    </div>

                  </div>

                  {/* Actions footer */}
                  <div className="mt-6 flex justify-end gap-2 border-t border-gray-100 pt-4 flex-wrap">
                    {activeTab === "Received" && item.status === "Pending Decision" ? (
                      <>
                        <button
                          onClick={() => handleAction(item.id, "Accepted")}
                          className="flex items-center gap-1 bg-[#6C4BF4] hover:bg-[#5B3DE0] text-white font-bold px-4 py-2.5 rounded-xl text-xs transition cursor-pointer shadow-sm"
                        >
                          <Check size={14} />
                          Accept Swap
                        </button>
                        <button
                          onClick={() => handleAction(item.id, "Declined")}
                          className="flex items-center gap-1 border border-gray-200 text-gray-600 hover:text-red-500 hover:bg-red-50 px-4 py-2.5 rounded-xl text-xs transition cursor-pointer"
                        >
                          <X size={14} />
                          Decline
                        </button>
                      </>
                    ) : item.status === "Completed" ? (
                      <span className="flex items-center gap-1.5 text-xs font-bold text-blue-600 bg-blue-50 px-3.5 py-2 rounded-xl">
                        <CheckCircle2 size={14} /> Handover Completed
                      </span>
                    ) : (
                      <>
                        <button
                          onClick={() => setSelectedMeetup(item)}
                          className="flex items-center gap-1.5 border border-[#6C4BF4] text-[#6C4BF4] hover:bg-[#6C4BF4]/5 px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer"
                        >
                          <MapPin size={13} />
                          View Meetup Details
                        </button>
                        <button
                          onClick={() => handleComplete(item.id)}
                          className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer shadow-xs"
                        >
                          <CheckCircle2 size={13} />
                          Mark Completed
                        </button>
                      </>
                    )}
                    <Link
                      to="/chat"
                      onClick={() => handleOpenChat(item)}
                      className="flex items-center justify-center p-2.5 rounded-xl border border-gray-200 bg-white text-gray-400 hover:text-[#6C4BF4] hover:bg-purple-50 cursor-pointer transition"
                      title="Chat with partner"
                    >
                      <MessageSquare size={14} />
                    </Link>
                  </div>

                </div>
              ))
            )}
          </div>

          {/* Meetup Modal */}
          {selectedMeetup && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-fade-in">
              <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-gray-100">
                <h3 className="text-lg font-bold text-[#17152A] mb-1">Exchange Meetup Coordination</h3>
                <p className="text-xs text-gray-400 mb-4">Coordinate book physical inspection and handover on campus.</p>
                
                <div className="rounded-xl bg-[#F8F7FF] border border-[#E9E4FF] p-4 text-xs space-y-2 mb-4">
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase">Trading Partner</span>
                    <p className="font-bold text-[#17152A] mt-0.5">{selectedMeetup.partner}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase">Campus Location</span>
                    <p className="font-bold text-[#6C4BF4] mt-0.5">Central Library Ground Floor Entrance</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedMeetup(null)}
                    className="flex-1 rounded-xl bg-gray-100 text-gray-700 py-2.5 text-xs font-bold hover:bg-gray-200 cursor-pointer"
                  >
                    Close
                  </button>
                  <Link
                    to="/chat"
                    onClick={() => {
                      handleOpenChat(selectedMeetup);
                      setSelectedMeetup(null);
                    }}
                    className="flex-1 text-center rounded-xl bg-[#6C4BF4] text-white py-2.5 text-xs font-bold hover:bg-[#5B3DE0] cursor-pointer"
                  >
                    Chat to Coordinate
                  </Link>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
