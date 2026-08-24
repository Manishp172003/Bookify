import React, { useState } from "react";
import { Search, DollarSign, Lock, Unlock } from "lucide-react";

function OrdersEscrow() {
  const [search, setSearch] = useState("");
  const [orders, setOrders] = useState([
    { id: "BK123458", buyer: "Manish Kumar", amount: "₹700", status: "Delivered", escrow: "Released" },
    { id: "BK123455", buyer: "Anjali Singh", amount: "₹450", status: "In Transit", escrow: "On Hold" },
    { id: "BK123454", buyer: "Rohan Verma", amount: "₹600", status: "Shipped", escrow: "On Hold" },
    { id: "BK123453", buyer: "Sneha Joshi", amount: "₹350", status: "Delivered", escrow: "Released" },
    { id: "BK123452", buyer: "Karan Patel", amount: "₹500", status: "Delivered", escrow: "On Hold" }
  ]);

  const handleEscrowRelease = (id) => {
    setOrders(orders.map(o => o.id === id ? { ...o, escrow: "Released" } : o));
  };

  const filteredOrders = orders.filter((o) => 
    o.id.toLowerCase().includes(search.toLowerCase()) || 
    o.buyer.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-[#17152A] font-poppins">Orders & Escrow</h1>
        <p className="text-[#6B6880] mt-1 text-sm">Monitor student orders and manage escrow release holds.</p>
      </div>

      {/* Escrow summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-[#E7E4F2] shadow-sm">
          <span className="text-xs text-[#6B6880] font-semibold uppercase tracking-wider block">Total Orders</span>
          <span className="text-3xl font-extrabold text-[#17152A] mt-2 block font-poppins">4,152</span>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-[#E7E4F2] shadow-sm">
          <span className="text-xs text-[#6B6880] font-semibold uppercase tracking-wider block">Delivered</span>
          <span className="text-3xl font-extrabold text-[#17152A] mt-2 block font-poppins">3,452</span>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-[#E7E4F2] shadow-sm">
          <span className="text-xs text-[#6B6880] font-semibold uppercase tracking-wider block">In Transit</span>
          <span className="text-3xl font-extrabold text-[#17152A] mt-2 block font-poppins">412</span>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-[#E7E7F2] shadow-sm">
          <span className="text-xs text-[#6B6880] font-semibold uppercase tracking-wider block">Escrow Funds</span>
          <span className="text-3xl font-extrabold text-[#FF8A3D] mt-2 block font-poppins">₹2.4L</span>
        </div>
      </div>

      {/* Filter and Table */}
      <div className="bg-white rounded-2xl border border-[#E7E4F2] shadow-sm overflow-hidden p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold text-[#17152A] font-poppins">Order Ledger</h2>
          <div className="relative w-80">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by Order ID, Buyer..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-[#F8F7FF] py-2 pl-10 pr-4 text-xs outline-none focus:border-[#FF8A3D]"
            />
          </div>
        </div>

        <div className="overflow-x-auto -mx-6">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F8F7FF] border-b border-[#E7E4F2] text-xs font-bold text-[#6B6880] uppercase tracking-wider">
                <th className="p-5 pl-8">Order ID</th>
                <th className="p-5">Buyer</th>
                <th className="p-5">Amount</th>
                <th className="p-5">Status</th>
                <th className="p-5">Escrow</th>
                <th className="p-5 text-right pr-8">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E7E4F2]/50 text-sm text-[#17152A]">
              {filteredOrders.map((o) => (
                <tr key={o.id} className="hover:bg-[#F8F7FF]/50 transition">
                  <td className="p-5 pl-8 font-mono font-bold text-[#6C4BF4]">{o.id}</td>
                  <td className="p-5 font-semibold">{o.buyer}</td>
                  <td className="p-5 font-bold">{o.amount}</td>
                  <td className="p-5">
                    {o.status === "Delivered" ? (
                      <span className="text-xs font-semibold text-[#22C55E] bg-[#E8F8EE] px-2.5 py-1 rounded-full">{o.status}</span>
                    ) : (
                      <span className="text-xs font-semibold text-[#38BDF8] bg-sky-50 px-2.5 py-1 rounded-full">{o.status}</span>
                    )}
                  </td>
                  <td className="p-5">
                    {o.escrow === "Released" ? (
                      <span className="text-xs font-semibold text-[#22C55E] flex items-center gap-1">
                        <Unlock size={12} /> Released
                      </span>
                    ) : (
                      <span className="text-xs font-semibold text-[#FF8A3D] flex items-center gap-1">
                        <Lock size={12} /> On Hold
                      </span>
                    )}
                  </td>
                  <td className="p-5 text-right pr-8">
                    {o.escrow === "On Hold" ? (
                      <button 
                        onClick={() => handleEscrowRelease(o.id)}
                        className="px-3 py-1.5 bg-[#E8F8EE] text-[#22C55E] hover:bg-[#22C55E] hover:text-white rounded-lg text-xs font-bold transition"
                      >
                        Release Escrow
                      </button>
                    ) : (
                      <span className="text-xs text-[#6B6880] italic">Completed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default OrdersEscrow;
