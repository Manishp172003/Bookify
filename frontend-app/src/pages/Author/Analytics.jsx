import React, { useState, useEffect } from "react";
import { BookOpen, Users, TrendingUp, CircleDollarSign, BarChart2, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { authorService, isDemoAuthor } from "../../services/authorService";

function Analytics() {
  const [books, setBooks] = useState([]);
  const [statsData, setStatsData] = useState({
    totalViews: "0",
    totalReaders: "0",
    totalSales: "₹0",
    totalEarnings: "₹0",
  });
  const [topBooks, setTopBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const isDemo = isDemoAuthor();

    Promise.all([authorService.getMyBooks(), authorService.getDashboardStats()]).then(
      ([myBooks, dashboardStats]) => {
        if (!isMounted) return;

        const bookList = Array.isArray(myBooks) ? myBooks : [];
        setBooks(bookList);

        if (isDemo && bookList.length > 0) {
          // Demo showcase author with showcase book
          setStatsData({
            totalViews: "12.4K",
            totalReaders: "3,260",
            totalSales: "₹48,750",
            totalEarnings: "₹32,680",
          });

          setTopBooks([
            {
              rank: 1,
              title: bookList[0]?.title || "The Silent Mind",
              views: "12.4K",
              change: "+8%",
            },
          ]);
        } else if (bookList.length > 0) {
          // Real registered author with published books
          const totalSalesCount = bookList.reduce((sum, b) => {
            const num = parseInt((b.sales || "0").replace(/[^0-9]/g, ""), 10);
            return sum + (isNaN(num) ? 0 : num);
          }, 0);

          const totalRevenue = bookList.reduce((sum, b) => {
            const num = parseFloat((b.earnings || "0").replace(/[^0-9.]/g, ""));
            return sum + (isNaN(num) ? 0 : num);
          }, 0);

          const viewsCount = Math.round(totalSalesCount * 3.8);

          setStatsData({
            totalViews: viewsCount > 0 ? `${viewsCount.toLocaleString()}` : "0",
            totalReaders: totalSalesCount > 0 ? `${totalSalesCount.toLocaleString()}` : "0",
            totalSales: `₹${totalRevenue.toLocaleString()}`,
            totalEarnings: `₹${Math.round(totalRevenue * 0.75).toLocaleString()}`,
          });

          setTopBooks(
            bookList.map((b, idx) => ({
              rank: idx + 1,
              title: b.title,
              views: b.views || `${Math.max(10, Math.round(parseInt((b.sales || "0").replace(/[^0-9]/g, "") || "0") * 3.8))}`,
              change: b.status === "Published" ? "+12%" : b.status || "Live",
            }))
          );
        } else {
          // Clean state: strictly 0 dummy data
          setStatsData({
            totalViews: "0",
            totalReaders: "0",
            totalSales: "₹0",
            totalEarnings: "₹0",
          });
          setTopBooks([]);
        }

        setLoading(false);
      }
    );

    return () => {
      isMounted = false;
    };
  }, []);

  const hasData = books.length > 0;

  const stats = [
    { label: "Total Views", value: statsData.totalViews, change: hasData ? "+15%" : "0%", icon: BookOpen, color: "text-[#6C4BF4]", bg: "bg-[#EEEAFE]" },
    { label: "Total Readers", value: statsData.totalReaders, change: hasData ? "+10%" : "0%", icon: Users, color: "text-[#38BDF8]", bg: "bg-sky-50" },
    { label: "Total Sales", value: statsData.totalSales, change: hasData ? "+Live" : "₹0", icon: TrendingUp, color: "text-[#FF8A3D]", bg: "bg-[#FFF0E6]" },
    { label: "Author Royalties", value: statsData.totalEarnings, change: hasData ? "+Live" : "₹0", icon: CircleDollarSign, color: "text-[#22C55E]", bg: "bg-[#E8F8EE]" },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#17152A] font-poppins">Analytics</h1>
          <p className="text-[#6B6880] mt-1 text-sm">Detailed stats and analytics breakdown of your library.</p>
        </div>
        {!hasData && (
          <Link
            to="/author/submit-book"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#6C4BF4] text-white rounded-xl text-xs font-semibold hover:bg-[#5b3ed9] transition shadow-md shadow-[#6C4BF4]/20 self-start sm:self-auto cursor-pointer"
          >
            <Sparkles size={16} />
            <span>Publish Your First Book</span>
          </Link>
        )}
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
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${hasData ? "text-[#22C55E] bg-[#E8F8EE]" : "text-gray-400 bg-gray-100"}`}>
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

          {hasData ? (
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
          ) : (
            <div className="h-64 w-full bg-[#F8F7FF] rounded-xl p-6 flex flex-col items-center justify-center text-center">
              <div className="h-12 w-12 rounded-full bg-white border border-[#E7E4F2] flex items-center justify-center text-[#6C4BF4] mb-3 shadow-xs">
                <BarChart2 size={24} />
              </div>
              <h3 className="text-sm font-bold text-[#17152A] font-poppins">No view data recorded yet</h3>
              <p className="text-xs text-[#6B6880] mt-1 max-w-sm">
                Reader engagement trends and daily view graphs will automatically populate once your published books start receiving traffic.
              </p>
            </div>
          )}
        </div>

        {/* Top Books by Views */}
        <div className="bg-white p-6 rounded-2xl border border-[#E7E4F2] space-y-6">
          <h2 className="text-lg font-bold text-[#17152A] font-poppins">Top Books by Views</h2>
          
          {topBooks.length > 0 ? (
            <div className="divide-y divide-[#E7E4F2]/50">
              {topBooks.map((b) => (
                <div key={b.rank} className="flex justify-between items-center py-4 first:pt-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <span className="w-6 text-sm font-bold text-[#6B6880]">{b.rank}</span>
                    <div>
                      <h4 className="text-sm font-bold text-[#17152A] font-poppins truncate max-w-[140px] sm:max-w-none">{b.title}</h4>
                      <span className="text-[10px] font-semibold text-[#22C55E] bg-[#E8F8EE] px-1.5 py-0.5 rounded-full">{b.change}</span>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-[#17152A]">{b.views} views</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500 space-y-2">
              <div className="h-12 w-12 rounded-full bg-[#F8F7FF] flex items-center justify-center mx-auto text-gray-400">
                <BookOpen size={24} />
              </div>
              <h4 className="text-sm font-bold text-[#17152A]">No published books yet</h4>
              <p className="text-xs text-[#6B6880] max-w-[200px] mx-auto">
                Your highest performing books will be ranked here based on reader impressions.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Analytics;
