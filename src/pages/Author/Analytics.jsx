import React from "react";
import { BookOpen, Users, TrendingUp, CircleDollarSign } from "lucide-react";

function Analytics() {
  const stats = [
    { label: "Total Views", value: "24.8K", change: "+15%", icon: BookOpen, color: "text-[#6C4BF4]", bg: "bg-[#EEEAFE]" },
    { label: "Total Readers", value: "8.7K", change: "+10%", icon: Users, color: "text-[#38BDF8]", bg: "bg-sky-50" },
    { label: "Total Sales", value: "1,248", change: "+20%", icon: TrendingUp, color: "text-[#FF8A3D]", bg: "bg-[#FFF0E6]" },
    { label: "Total Earnings", value: "₹32,680", change: "+18%", icon: CircleDollarSign, color: "text-[#22C55E]", bg: "bg-[#E8F8EE]" }
  ];

  const booksByViews = [
    { rank: 1, title: "The Silent Mind", views: "12.4K", change: "+8%" },
    { rank: 2, title: "Inner Peace", views: "8.6K", change: "+12%" },
    { rank: 3, title: "The Power of Habit", views: "3.2K", change: "New" },
    { rank: 4, title: "Unlock Your Potential", views: "2.4K", change: "Reviewing" }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-[#17152A] font-poppins">Analytics</h1>
        <p className="text-[#6B6880] mt-1 text-sm">Detailed stats and analytics breakdown of your library.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-white p-6 rounded-2xl border border-[#E7E4F2] shadow-sm hover:shadow-md transition">
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

      {/* Analytics details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Views Over Time */}
        <div className="bg-white p-6 rounded-2xl border border-[#E7E4F2] lg:col-span-2 space-y-6">
          <div>
            <h2 className="text-lg font-bold text-[#17152A] font-poppins">Views Over Time</h2>
            <p className="text-xs text-[#6B6880]">Reader engagement trend line</p>
          </div>

          <div className="relative h-64 w-full bg-[#F8F7FF] rounded-xl p-6 flex flex-col justify-between">
            <svg className="w-full h-48 mt-4 overflow-visible" viewBox="0 0 500 100" preserveAspectRatio="none">
              <defs>
                <linearGradient id="viewsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#38BDF8" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path 
                d="M 20 90 Q 80 70 150 30 T 290 40 T 410 15 T 460 25 L 460 100 L 20 100 Z" 
                fill="url(#viewsGrad)" 
              />
              <path 
                d="M 20 90 Q 80 70 150 30 T 290 40 T 410 15 T 460 25" 
                fill="none" 
                stroke="#38BDF8" 
                strokeWidth="3.5" 
                strokeLinecap="round"
              />
              <circle cx="150" cy="30" r="5" fill="#38BDF8" stroke="#ffffff" strokeWidth="2" />
              <circle cx="410" cy="15" r="5" fill="#6C4BF4" stroke="#ffffff" strokeWidth="2" />
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

        {/* Top Books by Views */}
        <div className="bg-white p-6 rounded-2xl border border-[#E7E4F2] space-y-6">
          <h2 className="text-lg font-bold text-[#17152A] font-poppins">Top Books by Views</h2>
          
          <div className="divide-y divide-[#E7E4F2]/50">
            {booksByViews.map((b) => (
              <div key={b.rank} className="flex justify-between items-center py-4 first:pt-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <span className="w-6 text-sm font-bold text-[#6B6880]">{b.rank}</span>
                  <div>
                    <h4 className="text-sm font-bold text-[#17152A] font-poppins">{b.title}</h4>
                    <span className="text-[10px] font-semibold text-[#22C55E] bg-[#E8F8EE] px-1.5 py-0.5 rounded-full">{b.change}</span>
                  </div>
                </div>
                <span className="text-sm font-bold text-[#17152A]">{b.views}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analytics;
