import { useState } from "react";
import DashboardSidebar from "../../components/dashboard/DashboardSidebar";
import { ArrowLeftRight, MessageSquare, Check, X, MapPin } from "lucide-react";

const MOCK_RECEIVED = [
  {
    id: "SWP-9021",
    partner: "Sneha Reddy",
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

const MOCK_SENT = [
  {
    id: "SWP-3820",
    partner: "Aarav Sharma",
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
  const [activeTab, setActiveTab] = useState("Received");

  const list = activeTab === "Received" ? MOCK_RECEIVED : MOCK_SENT;

  const handleAction = (id, type) => {
    alert(`Exchange proposal ${id} ${type} successfully (Mock swap event).`);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gradient-to-br from-[#F4F2FF] via-[#F8F7FF] to-[#F0F5FF]">
      <DashboardSidebar />

      <div className="flex min-w-0 flex-1 flex-col h-full">
        <main className="flex-1 overflow-y-auto p-7 animate-fade-in-up">
          
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-[#17152A]">Exchanges</h1>
            <p className="text-sm text-gray-500">Swap and trade textbook copies with other college students on campus.</p>
          </div>

          {/* Toggle Tabs */}
          <div className="flex border-b border-gray-150 mb-6 gap-6">
            <button
              onClick={() => setActiveTab("Received")}
              className={`pb-3 text-sm font-semibold transition border-b-2 cursor-pointer ${
                activeTab === "Received" ? "border-[#6C4BF4] text-[#6C4BF4]" : "border-transparent text-gray-500 hover:text-gray-800"
              }`}
            >
              Offers Received ({MOCK_RECEIVED.length})
            </button>
            <button
              onClick={() => setActiveTab("Sent")}
              className={`pb-3 text-sm font-semibold transition border-b-2 cursor-pointer ${
                activeTab === "Sent" ? "border-[#6C4BF4] text-[#6C4BF4]" : "border-transparent text-gray-500 hover:text-gray-800"
              }`}
            >
              Offers Sent ({MOCK_SENT.length})
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
                    <div className="md:col-span-2 rounded-xl bg-gray-50 p-4 border border-gray-100 flex items-center gap-3">
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
                    {activeTab === "Received" ? (
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
                    ) : (
                      <button
                        onClick={() => alert("Coordinate details opening...")}
                        className="flex items-center gap-1.5 border border-[#6C4BF4] text-[#6C4BF4] hover:bg-[#6C4BF4]/5 px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer"
                      >
                        <MapPin size={13} />
                        Setup Meetup
                      </button>
                    )}
                    <button
                      onClick={() => alert("Opening chat discussion...")}
                      className="flex items-center justify-center p-2.5 rounded-xl border border-gray-200 bg-white text-gray-400 hover:text-gray-600 hover:bg-gray-50 cursor-pointer"
                    >
                      <MessageSquare size={14} />
                    </button>
                  </div>

                </div>
              ))
            )}
          </div>

        </main>
      </div>
    </div>
  );
}
