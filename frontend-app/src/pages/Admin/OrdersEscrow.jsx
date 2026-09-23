import React, { useState, useEffect } from "react";
import { Search, DollarSign, Lock, Unlock, Loader2 } from "lucide-react";
import { adminService } from "../../services/adminService";
import { useCommerce } from "../../context/CommerceContext";

function OrdersEscrow() {
  const { showToast } = useCommerce();
  const [search, setSearch] = useState("");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);

  const loadOrders = async () => {
    try {
      const data = await adminService.getOrdersEscrow();
      if (Array.isArray(data)) {
        setOrders(data);
      }
    } catch (err) {
      console.error("Failed to load escrow orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleEscrowRelease = async (id) => {
    setActionId(id);
    try {
      const updated = await adminService.updateEscrow(id, "Released");
      if (updated) {
        setOrders((prev) =>
          prev.map((o) =>
            (o._id === id || o.id === id) ? { ...o, escrowStatus: "Released" } : o
          )
        );
        showToast("Escrow funds released to seller wallet successfully.", "success");
      }
    } catch (err) {
      showToast("Failed to release escrow funds", "error");
    } finally {
      setActionId(null);
    }
  };

  const totalOrdersCount = orders.length;
  const deliveredCount = orders.filter((o) => o.status === "Delivered").length;
  const inTransitCount = orders.filter((o) =>
    ["Shipped", "Out for Delivery", "Processing"].includes(o.status)
  ).length;
  const heldEscrowFunds = orders
    .filter((o) => o.escrowStatus === "Held")
    .reduce((sum, o) => sum + (o.amount || 0), 0);

  const formattedEscrow =
    heldEscrowFunds >= 100000
      ? `₹${(heldEscrowFunds / 100000).toFixed(1)}L`
      : `₹${heldEscrowFunds.toLocaleString("en-IN")}`;

  const filteredOrders = orders.filter((o) => {
    const code = (o._id ? `BK-${o._id.toString().slice(-6).toUpperCase()}` : o.id || "").toLowerCase();
    const buyer = (o.buyerId?.fullName || o.buyer || "").toLowerCase();
    return code.includes(search.toLowerCase()) || buyer.includes(search.toLowerCase());
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-[#17152A] font-poppins">Orders & Escrow</h1>
        <p className="text-[#6B6880] mt-1 text-sm">
          Monitor student orders and manage escrow release holds in real-time.
        </p>
      </div>

      {/* Escrow summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-[#E7E4F2] shadow-sm">
          <span className="text-xs text-[#6B6880] font-semibold uppercase tracking-wider block">Total Orders</span>
          <span className="text-3xl font-extrabold text-[#17152A] mt-2 block font-poppins">
            {totalOrdersCount}
          </span>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-[#E7E4F2] shadow-sm">
          <span className="text-xs text-[#6B6880] font-semibold uppercase tracking-wider block">Delivered</span>
          <span className="text-3xl font-extrabold text-[#17152A] mt-2 block font-poppins">
            {deliveredCount}
          </span>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-[#E7E4F2] shadow-sm">
          <span className="text-xs text-[#6B6880] font-semibold uppercase tracking-wider block">In Transit</span>
          <span className="text-3xl font-extrabold text-[#17152A] mt-2 block font-poppins">
            {inTransitCount}
          </span>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-[#E7E7F2] shadow-sm">
          <span className="text-xs text-[#6B6880] font-semibold uppercase tracking-wider block">Escrow Funds Held</span>
          <span className="text-3xl font-extrabold text-[#6C4BF4] mt-2 block font-poppins">
            {formattedEscrow}
          </span>
        </div>
      </div>

      {/* Filter and Table */}
      <div className="bg-white rounded-2xl border border-[#E7E4F2] shadow-sm overflow-hidden p-6 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-lg font-bold text-[#17152A] font-poppins">Order Ledger</h2>
            <p className="text-xs text-[#6B6880]">Real-time transactions from MongoDB</p>
          </div>
          <div className="relative w-full sm:w-80">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by Order ID, Buyer..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-[#F8F7FF] py-2 pl-10 pr-4 text-xs outline-none focus:border-[#6C4BF4]"
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-4 border-[#6C4BF4] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-xs text-gray-400 font-bold">Loading live escrow ledger...</p>
          </div>
        ) : filteredOrders.length > 0 ? (
          <div className="overflow-x-auto -mx-6">
            <table className="w-full text-left border-collapse min-w-[700px]">
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
                {filteredOrders.map((o) => {
                  const id = o._id || o.id;
                  const orderCode = o._id ? `BK-${o._id.toString().slice(-6).toUpperCase()}` : o.id;
                  const buyerName = o.buyerId?.fullName || o.buyer || "Student Buyer";
                  const isHeld = o.escrowStatus === "Held" || !o.escrowStatus;
                  const isReleased = o.escrowStatus === "Released";

                  return (
                    <tr key={id} className="hover:bg-[#F8F7FF]/50 transition">
                      <td className="p-5 pl-8 font-mono font-bold text-[#6C4BF4]">{orderCode}</td>
                      <td className="p-5 font-semibold text-[#17152A]">{buyerName}</td>
                      <td className="p-5 font-bold text-[#17152A]">₹{o.amount || 0}</td>
                      <td className="p-5">
                        {o.status === "Delivered" ? (
                          <span className="text-xs font-semibold text-[#22C55E] bg-[#E8F8EE] px-2.5 py-1 rounded-full">
                            {o.status}
                          </span>
                        ) : (
                          <span className="text-xs font-semibold text-[#38BDF8] bg-sky-50 px-2.5 py-1 rounded-full">
                            {o.status || "Placed"}
                          </span>
                        )}
                      </td>
                      <td className="p-5">
                        {isReleased ? (
                          <span className="text-xs font-semibold text-[#22C55E] flex items-center gap-1">
                            <Unlock size={12} /> Released
                          </span>
                        ) : o.escrowStatus === "Disputed" ? (
                          <span className="text-xs font-semibold text-rose-500 flex items-center gap-1">
                            <Lock size={12} /> Disputed
                          </span>
                        ) : (
                          <span className="text-xs font-semibold text-[#6C4BF4] flex items-center gap-1">
                            <Lock size={12} /> On Hold
                          </span>
                        )}
                      </td>
                      <td className="p-5 text-right pr-8">
                        {isHeld ? (
                          <button
                            disabled={actionId === id}
                            onClick={() => handleEscrowRelease(id)}
                            className="px-3 py-1.5 bg-[#E8F8EE] text-[#22C55E] hover:bg-[#22C55E] hover:text-white rounded-lg text-xs font-bold transition cursor-pointer"
                          >
                            Release Escrow
                          </button>
                        ) : (
                          <span className="text-xs text-[#6B6880] italic">
                            {isReleased ? "Completed" : o.escrowStatus || "Finalized"}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 text-gray-400 text-xs">
            {search ? `No orders match "${search}"` : "No orders found in the database."}
          </div>
        )}
      </div>
    </div>
  );
}

export default OrdersEscrow;
