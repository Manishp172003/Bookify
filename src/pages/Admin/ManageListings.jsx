import React, { useState } from "react";
import { Search, Check, X, ShieldAlert, BookOpen } from "lucide-react";

function ManageListings() {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [listings, setListings] = useState([
    { id: 1, title: "Clean Code", author: "Robert C. Martin", seller: "Rahul Sharma", price: "₹450", status: "Pending" },
    { id: 2, title: "Data Structures", author: "Seymour Lipschutz", seller: "Priya Verma", price: "₹250", status: "Pending" },
    { id: 3, title: "Operating System", author: "Galvin", seller: "Aman Singh", price: "₹300", status: "Approved" },
    { id: 4, title: "DBMS", author: "Korth", seller: "Neha Patel", price: "₹400", status: "Rejected" },
    { id: 5, title: "Let Us C", author: "Yashavant Kanetkar", seller: "Vivek Tiwari", price: "₹200", status: "Pending" }
  ]);

  const handleAction = (id, newStatus) => {
    setListings(listings.map(item => item.id === id ? { ...item, status: newStatus } : item));
  };

  const filteredListings = listings.filter((item) => {
    const matchesFilter = filter === "All" || item.status === filter;
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase()) || 
                          item.seller.toLowerCase().includes(search.toLowerCase()) ||
                          item.author.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-[#17152A] font-poppins">Manage Listings</h1>
        <p className="text-[#6B6880] mt-1 text-sm">Approve or reject community book submissions on the marketplace.</p>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-2xl border border-[#E7E4F2]">
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          {["All", "Pending", "Approved", "Rejected"].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                filter === tab 
                  ? "bg-[#FF8A3D] text-white" 
                  : "text-[#6B6880] hover:bg-[#F8F7FF]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-80">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search listings, sellers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-[#F8F7FF] py-2.5 pl-10 pr-4 text-xs outline-none focus:border-[#FF8A3D]"
          />
        </div>
      </div>

      {/* Listings Table */}
      <div className="bg-white rounded-2xl border border-[#E7E4F2] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F8F7FF] border-b border-[#E7E4F2] text-xs font-bold text-[#6B6880] uppercase tracking-wider">
                <th className="p-5">Book Info</th>
                <th className="p-5">Seller</th>
                <th className="p-5">Price</th>
                <th className="p-5">Status</th>
                <th className="p-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E7E4F2]/50 text-sm text-[#17152A]">
              {filteredListings.map((item) => (
                <tr key={item.id} className="hover:bg-[#F8F7FF]/50 transition">
                  <td className="p-5 flex items-center gap-3">
                    <div className="h-10 w-8 bg-[#6C4BF4] rounded flex items-center justify-center text-white text-[8px] font-black shrink-0 relative overflow-hidden">
                      <span className="absolute rotate-12 opacity-20 uppercase font-black text-[6px]">BOOK</span>
                      <BookOpen size={12} />
                    </div>
                    <div>
                      <p className="font-bold">{item.title}</p>
                      <p className="text-xs text-[#6B6880] mt-0.5">by {item.author}</p>
                    </div>
                  </td>
                  <td className="p-5 font-semibold">{item.seller}</td>
                  <td className="p-5 font-bold text-[#17152A]">{item.price}</td>
                  <td className="p-5">
                    {item.status === "Pending" && (
                      <span className="text-xs font-semibold text-[#FF8A3D] bg-[#FFF0E6] px-2.5 py-1 rounded-full">Pending</span>
                    )}
                    {item.status === "Approved" && (
                      <span className="text-xs font-semibold text-[#22C55E] bg-[#E8F8EE] px-2.5 py-1 rounded-full">Approved</span>
                    )}
                    {item.status === "Rejected" && (
                      <span className="text-xs font-semibold text-red-500 bg-red-50 px-2.5 py-1 rounded-full">Rejected</span>
                    )}
                  </td>
                  <td className="p-5 text-right flex justify-end gap-2">
                    {item.status === "Pending" ? (
                      <>
                        <button 
                          onClick={() => handleAction(item.id, "Approved")}
                          className="p-1.5 bg-[#E8F8EE] text-[#22C55E] hover:bg-[#22C55E] hover:text-white rounded-lg transition"
                          title="Approve"
                        >
                          <Check size={16} />
                        </button>
                        <button 
                          onClick={() => handleAction(item.id, "Rejected")}
                          className="p-1.5 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition"
                          title="Reject"
                        >
                          <X size={16} />
                        </button>
                      </>
                    ) : (
                      <span className="text-xs text-[#6B6880] italic">No actions needed</span>
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

export default ManageListings;
