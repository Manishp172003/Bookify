import { useState } from "react";
import DashboardSidebar from "../../components/dashboard/DashboardSidebar";
import { Calendar, ShieldCheck, Clock, MessageSquare, CornerUpLeft, Menu } from "lucide-react";

const MOCK_RENTED = [
  {
    id: "RNT-10928",
    title: "Operating System Concepts, 9th Edition",
    owner: "Dev Kumar",
    deposit: "₹400",
    fee: "₹150/mo",
    daysLeft: 12,
    percentLeft: 40,
    dueDate: "06 Sep 2026",
    coverClass: "from-[#0F172A] to-[#1E293B]"
  },
  {
    id: "RNT-51290",
    title: "Core Java: An Integrated Approach",
    owner: "Priya Patel",
    deposit: "₹300",
    fee: "₹100/mo",
    daysLeft: 25,
    percentLeft: 83,
    dueDate: "19 Sep 2026",
    coverClass: "from-[#4F46E5] to-[#7C3AED]"
  }
];

const MOCK_LENT = [
  {
    id: "LNT-38290",
    title: "Database System Concepts",
    renter: "Amit Sen",
    deposit: "₹500",
    fee: "₹200/mo",
    daysLeft: 5,
    percentLeft: 16,
    dueDate: "30 Aug 2026",
    coverClass: "from-[#047857] to-[#065F46]"
  }
];

export default function Rentals() {
  const [activeTab, setActiveTab] = useState("Rented");

  const list = activeTab === "Rented" ? MOCK_RENTED : MOCK_LENT;

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
              <h1 className="text-xl md:text-2xl font-bold text-[#17152A]">Rentals</h1>
              <p className="mt-0.5 text-xs text-gray-400">Track textbooks you have rented from others or lent out to students.</p>
            </div>
          </div>

          {/* Toggle Tabs */}
          <div className="flex border-b border-gray-150 mb-6 gap-6">
            <button
              onClick={() => setActiveTab("Rented")}
              className={`pb-3 text-sm font-semibold transition border-b-2 cursor-pointer ${
                activeTab === "Rented" ? "border-[#6C4BF4] text-[#6C4BF4]" : "border-transparent text-gray-500 hover:text-gray-800"
              }`}
            >
              Rented Books ({MOCK_RENTED.length})
            </button>
            <button
              onClick={() => setActiveTab("Lent")}
              className={`pb-3 text-sm font-semibold transition border-b-2 cursor-pointer ${
                activeTab === "Lent" ? "border-[#6C4BF4] text-[#6C4BF4]" : "border-transparent text-gray-500 hover:text-gray-800"
              }`}
            >
              Lent Books ({MOCK_LENT.length})
            </button>
          </div>

          {/* Rentals Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {list.length === 0 ? (
              <div className="col-span-full flex flex-col items-center justify-center py-12 rounded-2xl bg-white border border-gray-100 p-8 text-center">
                <Clock size={48} className="text-gray-300 mb-3" />
                <h3 className="font-bold text-[#17152A] text-lg">No active rentals</h3>
                <p className="text-sm text-gray-400 mt-1">There are no books currently listed under this tab.</p>
              </div>
            ) : (
              list.map((item) => (
                <div key={item.id} className="rounded-2xl bg-white border border-gray-100 p-6 shadow-sm flex flex-col justify-between">
                  
                  {/* Top block */}
                  <div className="flex gap-4">
                    <div className={`h-24 w-16 shrink-0 rounded-lg bg-gradient-to-br ${item.coverClass} flex items-center justify-center text-[9px] font-extrabold text-white uppercase tracking-wider border border-black/5`}>
                      {item.title.split(' ').map(w => w[0]).join('')}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-gray-400">{item.id}</span>
                        <span className="flex items-center gap-1 text-[9px] font-bold bg-[#6C4BF4]/5 text-[#6C4BF4] px-1.5 py-0.5 rounded border border-[#6C4BF4]/10">
                          <ShieldCheck size={10} />
                          Escrow Active
                        </span>
                      </div>
                      <h3 className="font-bold text-[#17152A] text-sm mt-1.5 truncate">{item.title}</h3>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {activeTab === "Rented" ? `Owner: ${item.owner}` : `Renter: ${item.renter}`}
                      </p>
                      <div className="flex gap-4 mt-3 flex-wrap">
                        <div>
                          <p className="text-[9px] text-gray-400 font-bold uppercase">Refundable Deposit</p>
                          <p className="text-xs font-bold text-[#17152A] mt-0.5">{item.deposit}</p>
                        </div>
                        <div>
                          <p className="text-[9px] text-gray-400 font-bold uppercase">Rental Fee</p>
                          <p className="text-xs font-bold text-[#6C4BF4] mt-0.5">{item.fee}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Middle progress indicator */}
                  <div className="mt-6 pt-4 border-t border-gray-100/70">
                    <div className="flex justify-between text-xs font-bold text-gray-500 mb-2">
                      <span className="flex items-center gap-1.5">
                        <Calendar size={13} className="text-gray-400" />
                        Due: {item.dueDate}
                      </span>
                      <span className={`${item.daysLeft <= 7 ? 'text-red-500 animate-pulse' : 'text-[#6C4BF4]'}`}>
                        {item.daysLeft} days remaining
                      </span>
                    </div>

                    {/* Progress track */}
                    <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          item.daysLeft <= 7 ? 'bg-red-500' : 'bg-[#6C4BF4]'
                        }`}
                        style={{ width: `${item.percentLeft}%` }}
                      />
                    </div>
                  </div>

                  {/* Bottom Action buttons */}
                  <div className="mt-6 flex gap-2">
                    <button
                      onClick={() => alert(`Return process initiated for ${item.title}`)}
                      className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-gray-250 bg-white text-gray-700 py-2.5 text-xs font-bold hover:bg-gray-50 cursor-pointer shadow-xs transition"
                    >
                      <CornerUpLeft size={13} />
                      {activeTab === "Rented" ? "Return Book" : "Confirm Return"}
                    </button>
                    <button
                      onClick={() => alert("Chat window opening...")}
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
