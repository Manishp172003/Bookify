import React, { useState } from "react";
import { Search, AlertTriangle, Eye, CheckCircle2 } from "lucide-react";

function Disputes() {
  const [filter, setFilter] = useState("All");
  const [disputes, setDisputes] = useState([
    { id: "BK123456", issue: "Wrong / Damaged Book", buyer: "Rohan Verma", status: "Open" },
    { id: "BK123450", issue: "Not as Described", buyer: "Aditya Singh", status: "Under Review" },
    { id: "BK123449", issue: "Late Delivery", buyer: "Priya Mehta", status: "Resolved" },
    { id: "BK123448", issue: "Item Not Received", buyer: "Neha Sharma", status: "Open" }
  ]);

  const handleResolve = (id) => {
    setDisputes(disputes.map(d => d.id === id ? { ...d, status: "Resolved" } : d));
  };

  const filteredDisputes = disputes.filter((d) => filter === "All" || d.status === filter);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-[#17152A] font-poppins">Disputes</h1>
        <p className="text-[#6B6880] mt-1 text-sm">Review transaction disputes and moderate refunds or releases.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-[#E7E4F2] shadow-sm">
          <span className="text-xs text-[#6B6880] font-semibold uppercase tracking-wider block">Total Claims</span>
          <span className="text-3xl font-extrabold text-[#17152A] mt-2 block font-poppins">{disputes.length}</span>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-[#E7E4F2] shadow-sm">
          <span className="text-xs text-[#6B6880] font-semibold uppercase tracking-wider block">Open Disputes</span>
          <span className="text-3xl font-extrabold text-[#FF4F81] mt-2 block font-poppins">
            {disputes.filter(d => d.status !== "Resolved").length}
          </span>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-[#E7E4F2] shadow-sm">
          <span className="text-xs text-[#6B6880] font-semibold uppercase tracking-wider block">Resolved Claims</span>
          <span className="text-3xl font-extrabold text-[#22C55E] mt-2 block font-poppins">
            {disputes.filter(d => d.status === "Resolved").length}
          </span>
        </div>
      </div>

      {/* Ledger */}
      <div className="bg-white rounded-2xl border border-[#E7E4F2] shadow-sm overflow-hidden p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold text-[#17152A] font-poppins">Claims List</h2>
          <div className="flex gap-2">
            {["All", "Open", "Under Review", "Resolved"].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  filter === tab 
                    ? "bg-[#FF4F81] text-white" 
                    : "text-[#6B6880] hover:bg-[#F8F7FF]"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto -mx-6">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F8F7FF] border-b border-[#E7E4F2] text-xs font-bold text-[#6B6880] uppercase tracking-wider">
                <th className="p-5 pl-8">Order ID</th>
                <th className="p-5">Issue</th>
                <th className="p-5">Buyer</th>
                <th className="p-5">Status</th>
                <th className="p-5 text-right pr-8">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E7E4F2]/50 text-sm text-[#17152A]">
              {filteredDisputes.map((d) => (
                <tr key={d.id} className="hover:bg-[#F8F7FF]/50 transition">
                  <td className="p-5 pl-8 font-mono font-bold text-[#6C4BF4]">{d.id}</td>
                  <td className="p-5 font-semibold text-[#17152A]">{d.issue}</td>
                  <td className="p-5">{d.buyer}</td>
                  <td className="p-5">
                    {d.status === "Open" && (
                      <span className="text-xs font-semibold text-[#FF4F81] bg-[#FFE8EF] px-2.5 py-1 rounded-full">Open</span>
                    )}
                    {d.status === "Under Review" && (
                      <span className="text-xs font-semibold text-[#FF8A3D] bg-[#FFF0E6] px-2.5 py-1 rounded-full">Under Review</span>
                    )}
                    {d.status === "Resolved" && (
                      <span className="text-xs font-semibold text-[#22C55E] bg-[#E8F8EE] px-2.5 py-1 rounded-full">Resolved</span>
                    )}
                  </td>
                  <td className="p-5 text-right pr-8 flex justify-end gap-2">
                    {d.status !== "Resolved" ? (
                      <>
                        <button 
                          onClick={() => handleResolve(d.id)}
                          className="px-3 py-1.5 bg-[#E8F8EE] text-[#22C55E] hover:bg-[#22C55E] hover:text-white rounded-lg text-xs font-bold transition"
                        >
                          Resolve
                        </button>
                      </>
                    ) : (
                      <span className="text-xs text-[#22C55E] font-bold flex items-center gap-1">
                        <CheckCircle2 size={14} /> Closed
                      </span>
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

export default Disputes;
