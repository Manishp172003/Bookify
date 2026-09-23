import React, { useState, useEffect } from "react";
import { Search, Check, X, ShieldAlert, BookOpen } from "lucide-react";
import { adminService } from "../../services/adminService";
import { useCommerce } from "../../context/CommerceContext";

function ManageListings() {
  const { showToast } = useCommerce();
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);

  const loadListings = async () => {
    try {
      const data = await adminService.getListings();
      if (Array.isArray(data)) {
        setListings(
          data.map((item) => ({
            id: item._id || item.id,
            title: item.title || "Untitled Book",
            author: item.author || "Unknown",
            seller: item.sellerId?.fullName || "Student Seller",
            price: `₹${item.price || 0}`,
            status:
              item.status === "Active" || item.status === "Approved"
                ? "Approved"
                : item.status === "Rejected"
                ? "Rejected"
                : "Pending",
            image: (item.images && item.images[0]) || null,
            category: item.category || "Marketplace",
          }))
        );
      }
    } catch (err) {
      console.error("Failed to load listings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadListings();
  }, []);

  const handleAction = async (id, newStatus) => {
    setActionId(id);
    try {
      const backendStatus = newStatus === "Approved" ? "Active" : "Rejected";
      const updated = await adminService.moderateListing(id, backendStatus);
      if (updated) {
        setListings((prev) =>
          prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
        );
        showToast(
          `Listing "${newStatus === "Approved" ? "Approved" : "Rejected"}" successfully.`,
          newStatus === "Approved" ? "success" : "info"
        );
      }
    } catch (err) {
      showToast("Failed to update listing status", "error");
    } finally {
      setActionId(null);
    }
  };

  const filteredListings = listings.filter((item) => {
    const matchesFilter = filter === "All" || item.status === filter;
    const matchesSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.seller.toLowerCase().includes(search.toLowerCase()) ||
      item.author.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-[#17152A] font-poppins">Manage Listings</h1>
        <p className="text-[#6B6880] mt-1 text-sm">
          Approve or reject community book submissions on the marketplace.
        </p>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-2xl border border-[#E7E4F2]">
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          {["All", "Pending", "Approved", "Rejected"].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                filter === tab
                  ? "bg-[#6C4BF4] text-white"
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
            className="w-full rounded-xl border border-gray-200 bg-[#F8F7FF] py-2.5 pl-10 pr-4 text-xs outline-none focus:border-[#6C4BF4]"
          />
        </div>
      </div>

      {/* Listings Table */}
      <div className="bg-white rounded-2xl border border-[#E7E4F2] shadow-sm overflow-hidden">
        {loading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-4 border-[#6C4BF4] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-xs text-gray-400 font-bold">Loading live book listings from database...</p>
          </div>
        ) : filteredListings.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
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
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.title}
                          className="h-10 w-8 object-cover rounded shadow-xs shrink-0"
                        />
                      ) : (
                        <div className="h-10 w-8 bg-[#6C4BF4] rounded flex items-center justify-center text-white text-[8px] font-black shrink-0 relative overflow-hidden">
                          <BookOpen size={12} />
                        </div>
                      )}
                      <div>
                        <p className="font-bold text-sm text-[#17152A]">{item.title}</p>
                        <p className="text-xs text-[#6B6880] mt-0.5">by {item.author}</p>
                      </div>
                    </td>
                    <td className="p-5 font-semibold text-sm text-[#17152A]">{item.seller}</td>
                    <td className="p-5 font-bold text-[#17152A]">{item.price}</td>
                    <td className="p-5">
                      {item.status === "Pending" && (
                        <span className="text-xs font-semibold text-[#6C4BF4] bg-[#F0ECFF] px-2.5 py-1 rounded-full">
                          Pending
                        </span>
                      )}
                      {item.status === "Approved" && (
                        <span className="text-xs font-semibold text-[#22C55E] bg-[#E8F8EE] px-2.5 py-1 rounded-full">
                          Approved
                        </span>
                      )}
                      {item.status === "Rejected" && (
                        <span className="text-xs font-semibold text-red-500 bg-red-50 px-2.5 py-1 rounded-full">
                          Rejected
                        </span>
                      )}
                    </td>
                    <td className="p-5 text-right">
                      {item.status === "Pending" ? (
                        <div className="flex justify-end gap-2">
                          <button
                            disabled={actionId === item.id}
                            onClick={() => handleAction(item.id, "Approved")}
                            className="p-1.5 bg-[#E8F8EE] text-[#22C55E] hover:bg-[#22C55E] hover:text-white rounded-lg transition cursor-pointer"
                            title="Approve Listing"
                          >
                            <Check size={16} />
                          </button>
                          <button
                            disabled={actionId === item.id}
                            onClick={() => handleAction(item.id, "Rejected")}
                            className="p-1.5 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition cursor-pointer"
                            title="Reject Listing"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-[#6B6880] italic">Moderated</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 text-gray-400 text-xs">
            {search ? `No listings match "${search}"` : "No book listings found in the marketplace."}
          </div>
        )}
      </div>
    </div>
  );
}

export default ManageListings;
