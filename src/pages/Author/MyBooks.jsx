import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Plus, Eye, MoreVertical, Edit, ShieldAlert } from "lucide-react";

function MyBooks() {
  const [filter, setFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const books = [
    {
      id: 1,
      title: "The Silent Mind",
      category: "Self Help",
      publishedDate: "02 Apr 2026",
      status: "Published",
      sales: "3,260",
      earnings: "₹12,480",
      bgCover: "bg-[#6C4BF4]"
    },
    {
      id: 2,
      title: "Inner Peace",
      category: "Self Help",
      publishedDate: "05 Mar 2026",
      status: "Published",
      sales: "2,190",
      earnings: "₹9,750",
      bgCover: "bg-[#38BDF8]"
    },
    {
      id: 3,
      title: "The Power of Habit",
      category: "Personal Growth",
      publishedDate: "Draft",
      status: "Draft",
      sales: "0",
      earnings: "₹0",
      bgCover: "bg-[#FF4F81]"
    },
    {
      id: 4,
      title: "Unlock Your Potential",
      category: "Motivation",
      publishedDate: "14 May 2026",
      status: "Under Review",
      sales: "0",
      earnings: "₹0",
      bgCover: "bg-[#FF8A3D]"
    }
  ];

  const filteredBooks = books.filter((book) => {
    const matchesFilter = filter === "All" || book.status === filter;
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          book.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case "Published":
        return <span className="text-xs font-semibold text-[#22C55E] bg-[#E8F8EE] px-2.5 py-1 rounded-full">Published</span>;
      case "Draft":
        return <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">Draft</span>;
      case "Under Review":
        return <span className="text-xs font-semibold text-[#FF8A3D] bg-[#FFF0E6] px-2.5 py-1 rounded-full">Under Review</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#17152A] font-poppins">My Books</h1>
          <p className="text-[#6B6880] mt-1 text-sm">Manage your published books and check their statuses.</p>
        </div>
        <Link
          to="/author/submit-book"
          className="flex items-center gap-2 px-5 py-2.5 bg-[#6C4BF4] text-white rounded-xl text-sm font-semibold hover:bg-[#5b3ed9] transition shadow-md shadow-[#6C4BF4]/20"
        >
          <Plus size={16} />
          <span>Submit New Book</span>
        </Link>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-2xl border border-[#E7E4F2]">
        {/* Tabs */}
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          {["All", "Published", "Draft", "Under Review"].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                filter === tab 
                  ? "bg-[#6C4BF4] text-white" 
                  : "text-[#6B6880] hover:bg-[#F8F7FF]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search your books..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-[#F8F7FF] py-2.5 pl-10 pr-4 text-xs outline-none transition focus:border-[#6C4BF4]"
          />
        </div>
      </div>

      {/* Book Grid */}
      {filteredBooks.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredBooks.map((book) => (
            <div key={book.id} className="bg-white p-5 rounded-2xl border border-[#E7E4F2] shadow-sm hover:shadow-md transition flex flex-col justify-between group">
              <div className="space-y-4">
                {/* Simulated Book Cover */}
                <div className={`w-full aspect-[3/4] ${book.bgCover} rounded-xl shadow-sm flex items-center justify-center text-white text-center font-extrabold text-sm relative overflow-hidden group-hover:scale-[1.02] transition-transform`}>
                  <span className="absolute rotate-12 text-[10px] opacity-20 uppercase font-black tracking-wider">{book.title}</span>
                  <span className="relative z-10 px-2 font-poppins">{book.title}</span>
                </div>
                
                {/* Book Details */}
                <div>
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-bold text-[#6B6880] uppercase tracking-wider">{book.category}</span>
                    {getStatusBadge(book.status)}
                  </div>
                  <h3 className="font-extrabold text-[#17152A] text-base mt-1 line-clamp-1 font-poppins">{book.title}</h3>
                  <p className="text-xs text-[#6B6880] mt-0.5">
                    {book.status === "Published" ? `Published on ${book.publishedDate}` : book.publishedDate}
                  </p>
                </div>
              </div>

              {/* Action Stats */}
              <div className="border-t border-[#E7E4F2]/50 mt-4 pt-4 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-[#6B6880] block">Sales</span>
                  <span className="font-bold text-[#17152A] text-sm">{book.sales}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#6B6880] block">Earnings</span>
                  <span className="font-bold text-[#22C55E] text-sm">{book.earnings}</span>
                </div>
                <button className="h-8 w-8 rounded-lg hover:bg-[#F8F7FF] flex items-center justify-center text-gray-500 hover:text-[#6C4BF4] transition">
                  <MoreVertical size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl border border-[#E7E4F2] space-y-3">
          <div className="h-12 w-12 bg-[#F8F7FF] rounded-full flex items-center justify-center mx-auto text-gray-400">
            <Plus size={20} />
          </div>
          <h3 className="text-lg font-bold text-[#17152A] font-poppins">No books found</h3>
          <p className="text-xs text-[#6B6880] max-w-xs mx-auto">Try switching filters or submit a new manuscript to get started.</p>
        </div>
      )}
    </div>
  );
}

export default MyBooks;
