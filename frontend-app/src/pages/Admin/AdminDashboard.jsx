import React from "react";
import { Users, BookMarked, Receipt, BarChart3, Clock, AlertTriangle, ShieldAlert } from "lucide-react";

function AdminDashboard() {
  const stats = [
    { label: "Total Users", value: "12,540", change: "+14%", icon: Users, color: "text-[#6C4BF4]", bg: "bg-[#EEEAFE]" },
    { label: "Total Listings", value: "6,842", change: "+8%", icon: BookMarked, color: "text-[#38BDF8]", bg: "bg-sky-50" },
    { label: "Total Orders", value: "4,152", change: "+12%", icon: Receipt, color: "text-[#FF8A3D]", bg: "bg-[#FFF0E6]" },
    { label: "Total Revenue", value: "₹18.6L", change: "+24%", icon: BarChart3, color: "text-[#22C55E]", bg: "bg-[#E8F8EE]" }
  ];

  const pendingAlerts = [
    { label: "Pending Listings", value: "123", color: "text-[#FF8A3D]", bg: "bg-[#FFF0E6]", link: "/admin/listings" },
    { label: "Pending Authors", value: "18", color: "text-[#6C4BF4]", bg: "bg-[#EEEAFE]", link: "/admin/authors" },
    { label: "Open Disputes", value: "7", color: "text-[#FF4F81]", bg: "bg-[#FFE8EF]", link: "/admin/disputes" }
  ];

  const logs = [
    { id: 1, text: "New open registration: Priya Verma", role: "Student", time: "2m ago" },
    { id: 2, text: "New book listed: Clean Code by Robert C. Martin", role: "Listing ID: #39281", time: "5m ago" },
    { id: 3, text: "Payout processed: R. V. Writes", role: "Amount: ₹2,000", time: "15m ago" },
    { id: 4, text: "Dispute raised: Order #89271", role: "Item Not Received", time: "1h ago" }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-[#17152A] font-poppins">Admin Dashboard</h1>
        <p className="text-[#6B6880] mt-1 text-sm">System-wide platform overview, activity monitor, and alert queue.</p>
      </div>

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
              <p className="text-xs text-[#6B6880]">Cumulative sales and commissions generated</p>
            </div>
            <span className="text-xs font-bold text-[#22C55E] bg-[#E8F8EE] px-2.5 py-1 rounded-full">
              Target Met 92.4L
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
              <span>05 May</span>
              <span>10 May</span>
              <span>15 May</span>
              <span>20 May</span>
              <span>25 May</span>
              <span>30 May</span>
            </div>
          </div>
        </div>

        {/* Action Needed Alerts */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-[#E7E4F2] space-y-4">
            <h2 className="text-lg font-bold text-[#17152A] font-poppins">Action Needed</h2>
            <div className="grid grid-cols-1 gap-3">
              {pendingAlerts.map((alert, idx) => (
                <a 
                  href={alert.link}
                  key={idx} 
                  className="flex items-center justify-between p-4 rounded-xl border border-[#E7E4F2]/50 hover:bg-[#F8F7FF] transition"
                >
                  <div>
                    <span className="text-xs text-[#6B6880] block font-semibold">{alert.label}</span>
                    <span className={`text-xl font-black ${alert.color} mt-1 block`}>{alert.value}</span>
                  </div>
                  <div className={`p-2.5 rounded-xl ${alert.bg} ${alert.color}`}>
                    <Clock size={18} />
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent System Log */}
      <div className="bg-white p-6 rounded-2xl border border-[#E7E4F2] space-y-6">
        <h2 className="text-lg font-bold text-[#17152A] font-poppins">Recent System Log</h2>
        <div className="divide-y divide-[#E7E4F2]/50">
          {logs.map((log) => (
            <div key={log.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-4 first:pt-0 last:pb-0">
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
      </div>

    </div>
  );
}

export default AdminDashboard;
