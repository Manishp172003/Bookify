import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  BookOpen, 
  Users, 
  TrendingUp, 
  CircleDollarSign, 
  Plus, 
  Sparkles, 
  ChevronRight,
  ArrowUpRight
} from "lucide-react";
import { authorService } from "../../services/authorService";

function AuthorDashboard() {
  const [statsData, setStatsData] = useState({
    totalBooks: 0,
    totalReaders: "0",
    totalSales: "₹0",
    totalEarnings: "₹0",
    isDemo: false
  });

  const [books, setBooks] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    let isMounted = true;
    Promise.all([authorService.getDashboardStats(), authorService.getMyBooks()]).then(
      ([stats, myBooks]) => {
        if (!isMounted) return;
        setBooks(myBooks || []);

        if (stats) {
          setStatsData({
            totalBooks: myBooks ? myBooks.length : (stats.totalBooks || 0),
            totalReaders: stats.totalReaders ? stats.totalReaders.toString() : "0",
            totalSales: stats.totalSales || "₹0",
            totalEarnings: stats.totalEarnings || "₹0",
            isDemo: stats.isDemo || false
          });
        }

        if (myBooks && myBooks.length > 0) {
          setRecentActivity([
            { id: 1, type: "review", text: `Reader engagement on "${myBooks[0].title}"`, detail: "Active reading traffic across colleges", time: "15m ago", iconBg: "bg-[#FFE8EF]" },
            { id: 2, type: "sale", text: "Catalog published & visible on marketplace", detail: "Verified Author status active", time: "1h ago", iconBg: "bg-[#E8F8EE]" }
          ]);
        } else {
          setRecentActivity([
            { id: 1, type: "system", text: "Welcome to Bookify Author Hub!", detail: "Submit your first book to begin publishing", time: "Just now", iconBg: "bg-[#EEEAFE]" }
          ]);
        }
      }
    );

    return () => {
      isMounted = false;
    };
  }, []);

  const topBook = books.length > 0 ? books[0] : null;

  const stats = [
    { label: "Total Books", value: statsData.totalBooks.toString(), change: statsData.totalBooks > 0 ? "+Active" : "New", icon: BookOpen, color: "text-[#6C4BF4]", bg: "bg-[#EEEAFE]" },
    { label: "Total Readers", value: statsData.totalReaders, change: statsData.totalBooks > 0 ? "+Active" : "0", icon: Users, color: "text-[#38BDF8]", bg: "bg-sky-50" },
    { label: "Total Sales", value: statsData.totalSales, change: statsData.totalBooks > 0 ? "+Live" : "₹0", icon: TrendingUp, color: "text-[#FF8A3D]", bg: "bg-[#FFF0E6]" },
    { label: "Author Royalties", value: statsData.totalEarnings, change: statsData.totalBooks > 0 ? "+Live" : "₹0", icon: CircleDollarSign, color: "text-[#22C55E]", bg: "bg-[#E8F8EE]" }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#17152A] font-poppins">Welcome back, Author 👋</h1>
          <p className="text-[#6B6880] mt-1 text-sm">Here's real-time performance of your books, readers, and royalties.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/author/submit-book"
            className="flex items-center gap-2 px-5 py-2.5 bg-[#6C4BF4] text-white rounded-xl text-sm font-semibold hover:bg-[#5b3ed9] transition shadow-md shadow-[#6C4BF4]/20 cursor-pointer"
          >
            <Plus size={16} />
            <span>Submit New Book</span>
          </Link>
          <Link
            to="/author/campaigns"
            className="flex items-center gap-2 px-5 py-2.5 bg-white border border-[#E7E4F2] text-[#17152A] rounded-xl text-sm font-semibold hover:bg-[#F8F7FF] transition cursor-pointer"
          >
            <Sparkles size={16} className="text-[#FF8A3D]" />
            <span>Create Campaign</span>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-white p-6 rounded-2xl border border-[#E7E4F2] shadow-xs hover:shadow-md transition">
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

      {/* Charts & Top Performing */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sales Chart Panel */}
        <div className="bg-white p-6 rounded-2xl border border-[#E7E4F2] lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-bold text-[#17152A] font-poppins">Sales & Reader Demand</h2>
              <p className="text-xs text-[#6B6880]">Monthly performance curve across campus colleges</p>
            </div>
            <span className="text-xs font-bold text-[#6C4BF4] bg-[#EEEAFE] px-3 py-1 rounded-full">
              {books.length} Books Active
            </span>
          </div>

          {/* Custom SVG Line Chart */}
          <div className="relative h-64 w-full bg-[#F8F7FF] rounded-xl p-6 flex flex-col justify-between">
            <div className="absolute inset-0 flex flex-col justify-between p-4 pointer-events-none opacity-40">
              <div className="border-b border-[#E7E4F2] w-full h-0"></div>
              <div className="border-b border-[#E7E4F2] w-full h-0"></div>
              <div className="border-b border-[#E7E4F2] w-full h-0"></div>
              <div className="border-b border-[#E7E4F2] w-full h-0"></div>
            </div>
            
            {/* The SVG curve */}
            <svg className="w-full h-48 mt-4 overflow-visible" viewBox="0 0 500 100" preserveAspectRatio="none">
              <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6C4BF4" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#6C4BF4" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path 
                d="M 20 80 Q 80 40 160 60 T 320 20 T 460 30 L 460 100 L 20 100 Z" 
                fill="url(#chartGrad)" 
              />
              <path 
                d="M 20 80 Q 80 40 160 60 T 320 20 T 460 30" 
                fill="none" 
                stroke="#6C4BF4" 
                strokeWidth="3.5" 
                strokeLinecap="round" 
              />
              <circle cx="160" cy="60" r="5" fill="#6C4BF4" stroke="#ffffff" strokeWidth="2" />
              <circle cx="320" cy="20" r="5" fill="#FF4F81" stroke="#ffffff" strokeWidth="2" />
            </svg>

            <div className="flex justify-between text-xs font-semibold text-[#6B6880] px-2">
              <span>05 May</span>
              <span>10 May</span>
              <span>15 May</span>
              <span>20 May</span>
              <span>25 May</span>
              <span className="text-[#6C4BF4] font-bold">30 May</span>
            </div>
          </div>
        </div>

        {/* Top Performing Book Panel */}
        <div className="bg-white p-6 rounded-2xl border border-[#E7E4F2] space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-[#17152A] font-poppins">Top Performing</h2>
            <Link to="/author/analytics" className="text-xs font-semibold text-[#6C4BF4] flex items-center hover:underline">
              <span>View Analytics</span>
              <ChevronRight size={14} />
            </Link>
          </div>

          {topBook ? (
            <div className="flex gap-4 p-4 rounded-xl bg-[#F8F7FF] border border-[#E7E4F2]/50">
              <div className="w-16 h-24 bg-[#6C4BF4] rounded-lg shadow-xs shrink-0 flex items-center justify-center text-white font-extrabold text-xs relative overflow-hidden">
                {topBook.cover ? (
                  <img src={topBook.cover} alt={topBook.title} className="h-full w-full object-cover" />
                ) : (
                  <span className="relative z-10 text-center px-1 font-poppins">{topBook.title}</span>
                )}
              </div>
              <div className="flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-[#17152A] text-sm line-clamp-1">{topBook.title}</h4>
                  <p className="text-xs text-[#6B6880]">{topBook.category}</p>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-[#6B6880]">Sales:</span>
                    <span className="font-bold text-[#17152A]">{topBook.sales || "0"}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-[#6B6880]">Royalties:</span>
                    <span className="font-bold text-[#22C55E]">{topBook.earnings || `₹${topBook.price || 0}`}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 text-center rounded-xl bg-[#F8F7FF] border border-[#E7E4F2] space-y-2">
              <BookOpen size={24} className="text-[#6C4BF4] mx-auto opacity-60" />
              <h4 className="text-xs font-bold text-[#17152A]">No Books Published Yet</h4>
              <p className="text-[11px] text-[#6B6880]">Submit your first manuscript to view reader metrics and royalties.</p>
              <Link
                to="/author/submit-book"
                className="inline-block mt-2 px-3 py-1.5 bg-[#6C4BF4] text-white rounded-lg text-xs font-bold hover:bg-[#5b3ed9] transition"
              >
                Publish Book
              </Link>
            </div>
          )}

          {/* Quick list */}
          {books.length > 1 && (
            <div className="space-y-2 pt-2">
              {books.slice(1, 3).map((b) => (
                <div key={b.id} className="flex items-center justify-between text-xs p-2.5 rounded-lg hover:bg-[#F8F7FF] transition">
                  <span className="text-[#6B6880] font-medium truncate max-w-[150px]">{b.title}</span>
                  <span className="font-bold text-[#17152A]">{b.earnings || `₹${b.price || 0}`}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Grid: Recent Activity & Promotional Spotlight */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-2xl border border-[#E7E4F2] space-y-6">
          <h2 className="text-lg font-bold text-[#17152A] font-poppins">Recent Reader Activity</h2>
          <div className="divide-y divide-[#E7E4F2]/50">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-4 first:pt-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <div className={`w-3.5 h-3.5 rounded-full ${activity.iconBg}`} />
                  <div>
                    <p className="text-sm font-semibold text-[#17152A]">{activity.text}</p>
                    <p className="text-xs text-[#6B6880] mt-0.5">{activity.detail}</p>
                  </div>
                </div>
                <span className="text-xs text-[#6B6880]">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions / Tips Card */}
        <div className="bg-[#EEEAFE] border border-[#6C4BF4]/10 p-6 rounded-2xl flex flex-col justify-between relative overflow-hidden">
          <div className="absolute right-0 bottom-0 translate-x-8 translate-y-8 w-48 h-48 bg-[#6C4BF4] opacity-5 rounded-full blur-xl pointer-events-none" />
          <div className="space-y-4">
            <span className="inline-block px-3 py-1 bg-white text-[#6C4BF4] rounded-full text-xs font-bold shadow-xs">
              Author Spotlight
            </span>
            <h3 className="text-xl font-bold text-[#17152A] font-poppins leading-tight">
              Boost your book visibility using targeted Home & Category Campaigns!
            </h3>
            <p className="text-sm text-[#6B6880]">
              Promoted titles gain up to 3x more campus reads and higher search placements across colleges.
            </p>
          </div>
          <div className="mt-8">
            <Link
              to="/author/campaigns"
              className="inline-flex items-center gap-2 px-5 py-3 bg-[#6C4BF4] text-white rounded-xl text-sm font-bold hover:bg-[#5b3ed9] transition shadow-md shadow-[#6C4BF4]/20 cursor-pointer"
            >
              <span>Launch Campaign</span>
              <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthorDashboard;
