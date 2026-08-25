import { useState } from "react";
import DashboardSidebar from "../../components/dashboard/DashboardSidebar";
import { ShoppingBag, Eye, Download, HelpCircle, CheckCircle2, Truck, Clock } from "lucide-react";

const MOCK_ORDERS = [
  {
    id: "ORD-98725",
    title: "Introduction to Algorithms, 3rd Edition",
    author: "Thomas H. Cormen",
    price: "₹650",
    date: "24 Aug 2026",
    status: "Meetup Scheduled",
    statusColor: "text-amber-600 bg-amber-50 border-amber-100",
    coverClass: "from-[#111827] to-[#374151]",
    step: 2,
    seller: {
      name: "Sneha Reddy",
      phone: "+91 98765 12345",
      meetup: "Central Library Ground Floor, 4:00 PM Wednesday"
    }
  },
  {
    id: "ORD-82710",
    title: "Cracking the Coding Interview",
    author: "Gayle Laakmann McDowell",
    price: "₹450",
    date: "18 Aug 2026",
    status: "Completed",
    statusColor: "text-green-600 bg-green-50 border-green-100",
    coverClass: "from-[#6C4BF4] to-[#8B3FD9]",
    step: 3,
    seller: {
      name: "Aarav Sharma",
      phone: "+91 99887 76655",
      meetup: "Campus Cafeteria, Completed"
    }
  },
  {
    id: "ORD-51920",
    title: "Organic Chemistry, 8th Edition",
    author: "L. G. Wade Jr.",
    price: "₹800",
    date: "12 Aug 2026",
    status: "Cancelled",
    statusColor: "text-red-600 bg-red-50 border-red-100",
    coverClass: "from-[#059669] to-[#10B981]",
    step: 0,
    seller: {
      name: "Rohan Das",
      phone: "N/A",
      meetup: "Cancelled by seller"
    }
  }
];

export default function MyOrders() {
  const [activeTab, setActiveTab] = useState("All");
  const [selectedSeller, setSelectedSeller] = useState(null);

  const filteredOrders = MOCK_ORDERS.filter(order => {
    if (activeTab === "All") return true;
    if (activeTab === "Active") return order.status === "Meetup Scheduled";
    if (activeTab === "Completed") return order.status === "Completed";
    if (activeTab === "Cancelled") return order.status === "Cancelled";
    return true;
  });

  const downloadInvoice = (orderId) => {
    alert(`Downloading invoice for Order ${orderId}... (Mock PDF success)`);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gradient-to-br from-[#F4F2FF] via-[#F8F7FF] to-[#F0F5FF]">
      <DashboardSidebar />

      <div className="flex min-w-0 flex-1 flex-col h-full">
        <main className="flex-1 overflow-y-auto p-7 animate-fade-in-up">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-[#17152A]">My Orders</h1>
            <p className="text-sm text-gray-500">Track and view history of your textbook purchases.</p>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-gray-150 mb-6 gap-6">
            {["All", "Active", "Completed", "Cancelled"].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 text-sm font-semibold transition-all border-b-2 cursor-pointer ${
                  activeTab === tab
                    ? "border-[#6C4BF4] text-[#6C4BF4]"
                    : "border-transparent text-gray-500 hover:text-gray-800"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Orders Stack */}
          <div className="space-y-4">
            {filteredOrders.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 rounded-2xl bg-white border border-gray-100 p-8 text-center">
                <ShoppingBag size={48} className="text-gray-300 mb-3" />
                <h3 className="font-bold text-[#17152A] text-lg">No orders found</h3>
                <p className="text-sm text-gray-400 mt-1">There are no orders matching your current tab.</p>
              </div>
            ) : (
              filteredOrders.map(order => (
                <div key={order.id} className="rounded-2xl bg-white border border-gray-100 p-6 shadow-sm flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
                  
                  {/* Left Column: Details */}
                  <div className="flex gap-4">
                    {/* Cover block */}
                    <div className={`h-20 w-14 shrink-0 rounded-lg bg-gradient-to-br ${order.coverClass} flex items-center justify-center text-[8px] font-extrabold text-white uppercase tracking-wider border border-black/5`}>
                      {order.title.split(' ').map(w => w[0]).join('')}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-bold text-gray-400">{order.id}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${order.statusColor}`}>
                          {order.status}
                        </span>
                      </div>
                      <h3 className="font-bold text-[#17152A] text-sm mt-1.5 truncate">{order.title}</h3>
                      <p className="text-xs text-gray-400 mt-0.5">Author: {order.author}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-xs font-bold text-[#6C4BF4]">{order.price}</span>
                        <span className="text-[10px] text-gray-400">Ordered: {order.date}</span>
                      </div>
                    </div>
                  </div>

                  {/* Middle Column: Progress Tracker */}
                  {order.status !== "Cancelled" && (
                    <div className="hidden lg:flex items-center gap-2 w-72">
                      <div className="flex flex-col items-center">
                        <CheckCircle2 size={16} className="text-green-500" />
                        <span className="text-[9px] font-semibold text-gray-500 mt-1">Ordered</span>
                      </div>
                      <div className={`h-0.5 flex-1 ${order.step >= 2 ? 'bg-green-500' : 'bg-gray-200'}`} />
                      <div className="flex flex-col items-center">
                        {order.step >= 2 ? (
                          <CheckCircle2 size={16} className="text-green-500" />
                        ) : (
                          <Clock size={16} className="text-amber-500 animate-pulse" />
                        )}
                        <span className="text-[9px] font-semibold text-gray-500 mt-1">Meetup</span>
                      </div>
                      <div className={`h-0.5 flex-1 ${order.step >= 3 ? 'bg-green-500' : 'bg-gray-200'}`} />
                      <div className="flex flex-col items-center">
                        {order.step >= 3 ? (
                          <CheckCircle2 size={16} className="text-green-500" />
                        ) : (
                          <Truck size={16} className="text-gray-300" />
                        )}
                        <span className="text-[9px] font-semibold text-gray-500 mt-1">Delivered</span>
                      </div>
                    </div>
                  )}

                  {/* Right Column: Actions */}
                  <div className="flex gap-2 w-full md:w-auto">
                    {order.status === "Meetup Scheduled" && (
                      <button
                        onClick={() => setSelectedSeller(order)}
                        className="flex-1 md:flex-initial flex items-center justify-center gap-1.5 rounded-xl bg-[#6C4BF4] text-white px-4 py-2.5 text-xs font-bold hover:bg-[#5B3DE0] cursor-pointer shadow-sm shadow-[#6C4BF4]/15"
                      >
                        <Eye size={14} />
                        View Seller & Meetup
                      </button>
                    )}
                    <button
                      onClick={() => downloadInvoice(order.id)}
                      className="flex-1 md:flex-initial flex items-center justify-center gap-1.5 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs font-bold text-gray-600 hover:text-[#6C4BF4] hover:bg-gray-50 cursor-pointer transition shadow-xs"
                    >
                      <Download size={14} />
                      Invoice
                    </button>
                    <button
                      onClick={() => alert("Help ticket created. Support will contact you shortly.")}
                      className="flex items-center justify-center p-2.5 rounded-xl border border-gray-200 bg-white text-gray-400 hover:text-gray-600 hover:bg-gray-50 cursor-pointer"
                    >
                      <HelpCircle size={15} />
                    </button>
                  </div>

                </div>
              ))
            )}
          </div>

          {/* Seller Meetup Modal */}
          {selectedSeller && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-fade-in">
              <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-gray-100">
                <h3 className="text-lg font-bold text-[#17152A] mb-1">Meetup Details</h3>
                <p className="text-xs text-gray-400 mb-4">Coordinate with the seller on campus to receive your book.</p>
                
                <div className="space-y-4">
                  <div className="rounded-xl bg-gray-55 p-3.5 border border-gray-100">
                    <p className="text-[10px] text-gray-400 font-bold uppercase">Seller Name</p>
                    <p className="text-sm font-bold text-[#17152A] mt-0.5">{selectedSeller.seller.name}</p>
                  </div>
                  <div className="rounded-xl bg-gray-55 p-3.5 border border-gray-100">
                    <p className="text-[10px] text-gray-400 font-bold uppercase">Contact Number</p>
                    <p className="text-sm font-bold text-[#17152A] mt-0.5">{selectedSeller.seller.phone}</p>
                  </div>
                  <div className="rounded-xl bg-gray-55 p-3.5 border border-gray-100">
                    <p className="text-[10px] text-gray-400 font-bold uppercase">Suggested Meetup Spot</p>
                    <p className="text-sm font-bold text-[#6C4BF4] mt-0.5 leading-relaxed">{selectedSeller.seller.meetup}</p>
                  </div>
                </div>

                <div className="mt-6 flex gap-2">
                  <button
                    onClick={() => setSelectedSeller(null)}
                    className="flex-1 rounded-xl bg-[#6C4BF4] text-white py-3 text-xs font-bold hover:bg-[#5B3DE0] cursor-pointer"
                  >
                    Got It
                  </button>
                  <button
                    onClick={() => { setSelectedSeller(null); alert("Opening chat..."); }}
                    className="flex-1 rounded-xl border border-gray-200 text-gray-600 py-3 text-xs font-bold hover:bg-gray-50 cursor-pointer"
                  >
                    Send Message
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
