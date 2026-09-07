import React, { useState, useEffect } from "react";
import DashboardSidebar from "../../components/dashboard/DashboardSidebar";
import DashboardHeader from "../../components/dashboard/DashboardHeader";
import StatCard from "../../components/dashboard/StatCard";
import RecentOrders from "../../components/dashboard/RecentOrders";
import ActiveListings from "../../components/dashboard/ActiveListings";
import WalletOverview from "../../components/dashboard/WalletOverview";
import QuickActions from "../../components/dashboard/QuickActions";
import RecentMessages from "../../components/dashboard/RecentMessages";
import { useCommerce } from "../../context/CommerceContext";
import { listingService } from "../../services/listingService";

function StudentDashboard() {
  const { orders } = useCommerce();
  const [listingStats, setListingStats] = useState(() => listingService.getStats());

  const updateStats = () => {
    setListingStats(listingService.getStats());
  };

  useEffect(() => {
    updateStats();
    window.addEventListener("bookify_user_listings_updated", updateStats);
    return () => window.removeEventListener("bookify_user_listings_updated", updateStats);
  }, []);

  const purchasedCount = (orders?.length || 0) + 3;
  const totalEarned = listingStats.totalEarned > 0 ? listingStats.totalEarned : 1850;

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gradient-to-br from-[#F4F2FF] via-[#F8F7FF] to-[#F0F5FF]">
      {/* Left Column: Sidebar */}
      <DashboardSidebar />

      {/* Right Column: Main Content */}
      <div className="flex min-w-0 flex-1 flex-col h-full">
        <DashboardHeader />

        <main className="flex-1 overflow-y-auto p-4 md:p-7 animate-fade-in-up">
          {/* Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard
              type="books"
              value={String(purchasedCount)}
              label="Books Purchased"
            />

            <StatCard
              type="saved"
              value="₹2,450"
              label="Total Saved"
            />

            <StatCard
              type="sold"
              value={String(listingStats.soldCount > 0 ? listingStats.soldCount : 8)}
              label="Books Sold"
            />

            <StatCard
              type="earned"
              value={`₹${totalEarned.toLocaleString()}`}
              label="Total Earned"
            />
          </div>
          {/* Dashboard Middle Section */}
          <div className="mt-5 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            <RecentOrders />
            <ActiveListings />
            <div className="md:col-span-2 xl:col-span-1">
              <WalletOverview />
            </div>
          </div>
          {/* Bottom Section */}
          <div className="mt-5 grid grid-cols-1 xl:grid-cols-2 gap-4">
            <QuickActions />
            <RecentMessages />
          </div>
        </main>
      </div>
    </div>
  );
}

export default StudentDashboard;