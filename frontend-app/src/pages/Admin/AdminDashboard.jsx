import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Users, BookMarked, Receipt, BarChart3, Clock, AlertTriangle, ShieldAlert, Sparkles } from "lucide-react";
import { adminService } from "../../services/adminService";

function AdminDashboard() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService
      .getMetrics()
      .then((data) => {
        if (data) setMetrics(data);
      })
      .finally(() => setLoading(false));
  }, []);

  const totalUsers = metrics?.totalUsers ?? 0;
  const totalListings = metrics?.totalBooks ?? 0;
  const totalOrders = metrics?.totalOrders ?? 0;
  const platformRevenue = metrics?.platformRevenue ?? 0;

  const formattedRevenue =
    platformRevenue >= 100000
      ? `₹${(platformRevenue / 100000).toFixed(1)}L`
      : `₹${platformRevenue.toLocaleString("en-IN")}`;

  const stats = [
    {
      label: "Total Users",
      value: totalUsers.toLocaleString(),
      change: "Active",
      icon: Users,
      color: "text-[#6C4BF4]",
      bg: "bg-[#EEEAFE]",
    },
    {
      label: "Total Listings",
      value: totalListings.toLocaleString(),
      change: "Marketplace",
      icon: BookMarked,
      color: "text-[#38BDF8]",
      bg: "bg-sky-50",
    },
    {
      label: "Total Orders",
      value: totalOrders.toLocaleString(),
      change: "Orders",
      icon: Receipt,
      color: "text-[#FF8A3D]",
      bg: "bg-[#FFF0E6]",
    },
    {
      label: "Total Revenue",
      value: formattedRevenue,
      change: "Completed",
      icon: BarChart3,
      color: "text-[#22C55E]",
      bg: "bg-[#E8F8EE]",
    },
  ];

  const pendingAlerts = [
    {
      label: "Pending Listings",
      value: (metrics?.pendingListings ?? 0).toString(),
      color: "text-[#FF8A3D]",
      bg: "bg-[#FFF0E6]",
      link: "/admin/listings",
    },
    {
      label: "Pending Authors",
      value: (metrics?.pendingAuthors ?? 0).toString(),
      color: "text-[#6C4BF4]",
      bg: "bg-[#EEEAFE]",
      link: "/admin/authors",
    },
    {
      label: "Open Disputes",
      value: (metrics?.openDisputes ?? 0).toString(),
      color: "text-[#FF4F81]",
      bg: "bg-[#FFE8EF]",
      link: "/admin/disputes",
    },
  ];

  const logs = metrics?.recentLogs || [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-[#17152A] font-poppins">Admin Dashboard</h1>
        <p className="text-[#6B6880] mt-1 text-sm">System-wide platform overview, activity monitor, and alert queue.</p>
      </div>

      {loading ? (
        <div className="py-12 text-center bg-white rounded-2xl border border-[#E7E4F2]">
          <div className="w-8 h-8 border-4 border-[#6C4BF4] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-xs text-gray-400 font-bold">Synchronizing real-time platform metrics...</p>
        </div>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div key={idx} className="bg-white p-6 rounded-2xl border border-[#E7E4F2] shadow-sm">
                  <div className="flex justify-between items-start">
                    <div className={`${stat.bg} ${stat.color} p-3 rounded-xl`}>
                      <Icon size={22} />
                    </div>
                    <span className="text-xs font-semibold text-[#22C55E] bg-[#E8F8EE] px-2 py-1 rounded-full">
                      {stat.change}
                    </span>
                  </div>
                  <div className="mt-4">
                    <h3 className="text-2xl font-bold text-[#17152A] font-poppins">{stat.value}</h3>
                    <p className="text-sm text-[#6B6880] mt-0.5">{stat.label}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Grid: Alerts Queue & System Growth Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Growth Chart */}
            <div className="bg-white p-6 rounded-2xl border border-[#E7E4F2] lg:col-span-2 space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-bold text-[#17152A] font-poppins">Platform Revenue Growth</h2>
                  <p className="text-xs text-[#6B6880]">Cumulative sales and commissions generated from orders</p>
                </div>
                <span className="text-xs font-bold text-[#22C55E] bg-[#E8F8EE] px-2.5 py-1 rounded-full">
                  Net: {formattedRevenue}
                </span>
              </div>

              <div className="relative h-64 w-full bg-[#F8F7FF] rounded-xl p-4 flex flex-col justify-between overflow-hidden">
                <svg className="w-full h-48 mt-4 overflow-visible" viewBox="0 0 500 100" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="adminGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6C4BF4" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#6C4BF4" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M 0 95 Q 60 70 120 75 T 240 40 T 360 45 T 500 15 L 500 100 L 0 100 Z"
                    fill="url(#adminGrad)"
                  />
                  <path
                    d="M 0 95 Q 60 70 120 75 T 240 40 T 360 45 T 500 15"
                    fill="none"
                    stroke="#6C4BF4"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                  <circle cx="240" cy="40" r="5" fill="#6C4BF4" stroke="#ffffff" strokeWidth="2" />
                  <circle cx="500" cy="15" r="5" fill="#22C55E" stroke="#ffffff" strokeWidth="2" />
                </svg>

                <div className="flex justify-between text-[10px] font-semibold text-[#6B6880] px-2">
                  <span>Semester Start</span>
                  <span>Midterms</span>
                  <span>Exam Rush</span>
                  <span>Swaps Peak</span>
                  <span>Rentals Close</span>
                  <span>Present</span>
                </div>
              </div>
            </div>

            {/* Action Needed Alerts */}
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-[#E7E4F2] space-y-4">
                <h2 className="text-lg font-bold text-[#17152A] font-poppins">Action Needed</h2>
                <div className="grid grid-cols-1 gap-3">
                  {pendingAlerts.map((alert, idx) => (
                    <Link
                      to={alert.link}
                      key={idx}
                      className="flex items-center justify-between p-4 rounded-xl border border-[#E7E4F2]/50 hover:bg-[#F8F7FF] transition cursor-pointer"
                    >
                      <div>
                        <span className="text-xs text-[#6B6880] block font-semibold">{alert.label}</span>
                        <span className={`text-xl font-black ${alert.color} mt-1 block`}>{alert.value}</span>
                      </div>
                      <div className={`p-2.5 rounded-xl ${alert.bg} ${alert.color}`}>
                        <Clock size={18} />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Recent System Log */}
          <div className="bg-white p-6 rounded-2xl border border-[#E7E4F2] space-y-6">
            <h2 className="text-lg font-bold text-[#17152A] font-poppins">Recent System Log</h2>
            {logs.length > 0 ? (
              <div className="divide-y divide-[#E7E4F2]/50">
                {logs.map((log) => (
                  <div
                    key={log.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-4 first:pt-0 last:pb-0"
                  >
                    <div>
                      <p className="text-sm font-semibold text-[#17152A]">{log.text}</p>
                      <span className="inline-block mt-1 text-[10px] font-bold text-[#6B6880] bg-gray-100 px-2 py-0.5 rounded">
                        {log.role}
                      </span>
                    </div>
                    <span className="text-xs text-[#6B6880] sm:text-right">{log.time}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-gray-400 text-xs">
                No recent activity logged in the system yet.
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default AdminDashboard;
