import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardSidebar from '../../components/dashboard/DashboardSidebar';
import { Edit2, Trash2, CheckCircle2, TrendingUp, Heart, BookOpen } from 'lucide-react';

const INITIAL_LISTINGS = [
  {
    id: "BKFY-518290",
    title: "Introduction to Algorithms, 3rd Edition",
    price: "₹650",
    condition: "Very Good",
    status: "Active",
    views: 42,
    wishlists: 12,
    coverClass: "from-[#111827] to-[#374151]"
  },
  {
    id: "BKFY-982741",
    title: "Cracking the Coding Interview",
    price: "₹450",
    condition: "Good",
    status: "Active",
    views: 29,
    wishlists: 5,
    coverClass: "from-[#6C4BF4] to-[#8B3FD9]"
  },
  {
    id: "BKFY-304910",
    title: "Organic Chemistry, 8th Edition",
    price: "₹800",
    condition: "Like New",
    status: "Sold",
    views: 95,
    wishlists: 18,
    coverClass: "from-[#059669] to-[#10B981]"
  },
  {
    id: "BKFY-298301",
    title: "Calculus: Early Transcendentals",
    price: "₹950",
    condition: "Fair",
    status: "Inactive",
    views: 14,
    wishlists: 2,
    coverClass: "from-[#E11D48] to-[#F43F5E]"
  }
];

export default function MyListingsPage() {
  const navigate = useNavigate();
  const [listings, setListings] = useState(INITIAL_LISTINGS);
  const [activeFilter, setActiveFilter] = useState('All');

  const handleMarkSold = (id) => {
    setListings(prev =>
      prev.map(item =>
        item.id === id ? { ...item, status: 'Sold' } : item
      )
    );
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this listing?")) {
      setListings(prev => prev.filter(item => item.id !== id));
    }
  };

  const handleEdit = (id) => {
    alert(`Editing mode simulated for Listing ID: ${id}. Redirecting to Sell flow.`);
    navigate('/sell');
  };

  // Filter listings
  const filteredListings = listings.filter(item => {
    if (activeFilter === 'All') return true;
    return item.status.toLowerCase() === activeFilter.toLowerCase();
  });

  const getStatusBadgeClass = (status) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-50 text-green-700 border-green-100';
      case 'sold':
        return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'inactive':
        return 'bg-amber-50 text-amber-700 border-amber-100';
      default:
        return 'bg-gray-50 text-gray-600 border-gray-100';
    }
  };

  const getFilterCount = (filterName) => {
    if (filterName === 'All') return listings.length;
    return listings.filter(item => item.status.toLowerCase() === filterName.toLowerCase()).length;
  };

  const filterTabs = ['All', 'Active', 'Sold', 'Inactive'];

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gradient-to-br from-[#F4F2FF] via-[#F8F7FF] to-[#F0F5FF]">
      <DashboardSidebar />

      <div className="flex min-w-0 flex-1 flex-col h-full">
        <main className="flex-1 overflow-y-auto p-7 animate-fade-in-up">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-[#17152A]">My Listings</h1>
              <p className="text-sm text-gray-500">Manage your textbook listings, track sales status, and adjust prices.</p>
            </div>
            <button
              onClick={() => navigate('/sell')}
              className="bg-[#6C4BF4] hover:bg-[#5B3DE0] text-white font-bold px-5 py-2.5 rounded-xl text-xs transition cursor-pointer shadow-sm shadow-[#6C4BF4]/15"
            >
              + Create New Listing
            </button>
          </div>

          {/* Filter Tabs */}
          <div className="flex border-b border-gray-150 mb-6 gap-6 overflow-x-auto scrollbar-none">
            {filterTabs.map(tab => {
              const isActive = activeFilter === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveFilter(tab)}
                  className={`pb-3 text-sm font-semibold transition border-b-2 shrink-0 cursor-pointer flex items-center gap-2 ${
                    isActive
                      ? 'border-[#6C4BF4] text-[#6C4BF4] font-bold'
                      : 'border-transparent text-gray-500 hover:text-gray-800'
                  }`}
                >
                  {tab}
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                    isActive ? 'bg-[#6C4BF4] text-white' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {getFilterCount(tab)}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Listings Stack */}
          <div className="space-y-4">
            {filteredListings.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 rounded-2xl bg-white border border-gray-100 p-8 text-center">
                <BookOpen size={48} className="text-gray-300 mb-3" />
                <h3 className="font-bold text-[#17152A] text-lg">No listings found</h3>
                <p className="text-sm text-gray-400 mt-1">Try creating a new listing to start selling!</p>
              </div>
            ) : (
              filteredListings.map(item => (
                <div key={item.id} className="rounded-2xl bg-white border border-gray-100 p-5 shadow-sm flex flex-col lg:flex-row gap-6 justify-between items-start lg:items-center">
                  
                  {/* Left block: info */}
                  <div className="flex gap-4 min-w-0">
                    <div className={`h-20 w-14 shrink-0 rounded-lg bg-gradient-to-br ${item.coverClass} flex items-center justify-center text-[8px] font-extrabold text-white uppercase tracking-wider border border-black/5`}>
                      {item.title.split(' ').map(w => w[0]).join('')}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-bold text-gray-400">{item.id}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getStatusBadgeClass(item.status)}`}>
                          {item.status}
                        </span>
                        <span className="text-[10px] font-semibold text-gray-500">{item.condition}</span>
                      </div>
                      <h3 className="font-bold text-[#17152A] text-sm mt-1.5 truncate">{item.title}</h3>
                      <p className="text-xs font-bold text-[#6C4BF4] mt-1">{item.price}</p>
                    </div>
                  </div>

                  {/* Middle block: analytics */}
                  <div className="flex items-center gap-6 bg-gray-50/50 rounded-xl px-4 py-2.5 border border-gray-100/50 w-full lg:w-auto justify-around lg:justify-start">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-gray-500">
                        <TrendingUp size={14} />
                        <span className="text-xs font-bold text-[#17152A]">{item.views}</span>
                      </div>
                      <p className="text-[9px] font-semibold text-gray-400 mt-0.5">Views</p>
                    </div>
                    
                    <div className="h-6 w-px bg-gray-200" />
                    
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-gray-500">
                        <Heart size={14} className="text-red-500 fill-red-500" />
                        <span className="text-xs font-bold text-[#17152A]">{item.wishlists}</span>
                      </div>
                      <p className="text-[9px] font-semibold text-gray-400 mt-0.5">Saves</p>
                    </div>
                  </div>

                  {/* Right block: Action controls */}
                  <div className="flex gap-2 w-full lg:w-auto">
                    {item.status === 'Active' && (
                      <button
                        onClick={() => handleMarkSold(item.id)}
                        className="flex-1 lg:flex-initial flex items-center justify-center gap-1.5 rounded-xl bg-green-50 border border-green-200 text-green-700 px-4 py-2.5 text-xs font-bold hover:bg-green-150 transition cursor-pointer"
                      >
                        <CheckCircle2 size={13} />
                        Mark Sold
                      </button>
                    )}
                    <button
                      onClick={() => handleEdit(item.id)}
                      className="flex-1 lg:flex-initial flex items-center justify-center gap-1.5 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs font-bold text-gray-600 hover:bg-gray-50 cursor-pointer"
                    >
                      <Edit2 size={13} />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="flex items-center justify-center p-2.5 rounded-xl border border-red-100 bg-red-50 text-red-500 hover:text-red-700 hover:bg-red-100 transition cursor-pointer"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                </div>
              ))
            )}
          </div>

        </main>
      </div>
    </div>
  );
}
