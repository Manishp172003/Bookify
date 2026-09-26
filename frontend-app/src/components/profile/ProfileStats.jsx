import { useState, useEffect } from "react";
import { useCommerce } from "../../context/CommerceContext";
import { useAuth } from "../../context/AuthContext";
import { listingService } from "../../services/listingService";
import { api } from "../../services/apiClient";

function ProfileStats() {
  const { orders } = useCommerce();
  const { user } = useAuth();
  const [backendStats, setBackendStats] = useState(null);
  const [localStats, setLocalStats] = useState(() => listingService.getStats());

  useEffect(() => {
    const updateLocal = () => setLocalStats(listingService.getStats());
    window.addEventListener("bookify_user_listings_updated", updateLocal);

    const fetchStats = async () => {
      try {
        const res = await api.get("/dashboard/stats");
        if (res?.data?.data) {
          setBackendStats(res.data.data);
        }
      } catch {
        // Fallback silently to local state
      }
    };
    fetchStats();

    return () => window.removeEventListener("bookify_user_listings_updated", updateLocal);
  }, []);

  const buyerOrders = (orders || []).filter((o) => !o.isSellerOrder);
  const purchasedCount = backendStats?.orders?.total ?? buyerOrders.length;
  const soldCount = backendStats?.listings?.sold ?? (localStats.soldCount || 0);
  const earnedAmount = backendStats?.earnings?.net ?? (localStats.totalEarned || 0);
  const ratingValue = user?.rating ? String(user.rating) : "New";

  const stats = [
    {
      value: String(purchasedCount),
      label: "Books Purchased",
      color: "text-[#6C4BF4]",
    },
    {
      value: String(soldCount),
      label: "Books Sold",
      color: "text-[#6C4BF4]",
    },
    {
      value: `₹${earnedAmount.toLocaleString()}`,
      label: "Total Earned",
      color: "text-[#22C55E]",
    },
    {
      value: ratingValue,
      label: "Rating",
      color: "text-[#FF8A3D]",
    },
  ];

  return (
    <div className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-xl border border-gray-100 bg-white px-4 py-5 text-center shadow-sm"
        >
          <p className={`text-2xl font-bold ${stat.color}`}>
            {stat.value}
          </p>

          <p className="mt-1 text-xs text-gray-500">
            {stat.label}
          </p>
        </div>
      ))}
    </div>
  );
}

export default ProfileStats;