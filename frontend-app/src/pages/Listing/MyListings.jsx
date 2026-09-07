import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { listingService } from '../../services/listingService';
import { 
  Plus, 
  BookOpen, 
  Trash2, 
  Edit3, 
  CheckCircle, 
  Eye, 
  Clock, 
  ShieldCheck, 
  Search, 
  MapPin, 
  ArrowRight 
} from 'lucide-react';

export default function MyListings() {
  const navigate = useNavigate();
  const [listings, setListings] = useState(() => listingService.getAllListings());
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const reload = () => {
    setListings(listingService.getAllListings());
  };

  useEffect(() => {
    reload();
    window.addEventListener('bookify_user_listings_updated', reload);
    return () => window.removeEventListener('bookify_user_listings_updated', reload);
  }, []);

  const handleMarkSold = (id) => {
    const item = listings.find(l => l.id === id);
    if (item) {
      listingService.updateStatus(id, item.status === 'Sold' ? 'Active' : 'Sold');
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to remove this listing?")) {
      listingService.deleteListing(id);
    }
  };

  const filteredListings = listings.filter(item => {
    const matchesFilter = activeFilter === 'All' || item.status.toLowerCase() === activeFilter.toLowerCase();
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusBadge = (status) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'sold':
        return 'bg-purple-50 text-[#6C4BF4] border-purple-200';
      case 'inactive':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const filterTabs = ['All', 'Active', 'Sold', 'Inactive'];

  return (
    <div className="bg-[#F8F7FF] min-h-screen py-8">
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 space-y-8">
        
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-[#17152A] font-[family-name:var(--font-heading)]">
              My Active Listings
            </h1>
            <p className="text-xs md:text-sm text-gray-500 mt-1">
              Manage your textbook listings, track buyer interest, and mark books as sold.
            </p>
          </div>

          <button
            onClick={() => navigate('/sell/isbn')}
            className="inline-flex items-center gap-2 bg-[#6C4BF4] hover:bg-[#5B3DE0] text-white font-bold px-6 py-3.5 rounded-2xl text-sm transition shadow-md shadow-[#6C4BF4]/25 cursor-pointer hover:scale-105 active:scale-95"
          >
            <Plus size={18} /> + Create New Listing
          </button>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-white border border-bookify-border/70 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
          
          {/* Tabs */}
          <div className="flex bg-gray-100 p-1 rounded-xl gap-1">
            {filterTabs.map(tab => {
              const isActive = activeFilter === tab;
              const count = tab === 'All' 
                ? listings.length 
                : listings.filter(l => l.status.toLowerCase() === tab.toLowerCase()).length;

              return (
                <button
                  key={tab}
                  onClick={() => setActiveFilter(tab)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    isActive
                      ? 'bg-white text-[#6C4BF4] shadow-xs'
                      : 'text-gray-500 hover:text-[#17152A]'
                  }`}
                >
                  <span>{tab}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isActive ? 'bg-[#EEEAFE] text-[#6C4BF4]' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Input */}
          <div className="relative min-w-[260px]">
            <input
              type="text"
              placeholder="Search your listings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 bg-[#F8F7FF] focus:bg-white focus:outline-none focus:border-[#6C4BF4] text-xs text-[#17152A]"
            />
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>

        </div>

        {/* Listings List */}
        {filteredListings.length === 0 ? (
          <div className="bg-white border border-bookify-border/70 rounded-3xl p-12 text-center shadow-xs space-y-4">
            <div className="w-16 h-16 bg-[#EEEAFE] text-[#6C4BF4] rounded-full flex items-center justify-center mx-auto">
              <BookOpen size={28} />
            </div>
            <h3 className="font-bold text-lg text-[#17152A]">No Listings Found</h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              You don't have any listings in this category. Clear out your bookshelf and list a book today!
            </p>
            <button
              onClick={() => navigate('/sell/isbn')}
              className="inline-flex items-center gap-2 bg-[#6C4BF4] text-white font-bold text-xs px-6 py-3 rounded-xl shadow-md shadow-[#6C4BF4]/25 hover:bg-[#5B3DE0] cursor-pointer"
            >
              + List Your First Book
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredListings.map(item => (
              <div
                key={item.id}
                className="bg-white border border-bookify-border/70 rounded-3xl p-5 shadow-xs hover:shadow-md transition flex flex-col sm:flex-row gap-4 justify-between"
              >
                <div className="flex gap-4">
                  <img
                    src={item.cover}
                    alt={item.title}
                    className="w-20 h-28 object-cover rounded-xl border border-gray-200 shrink-0"
                  />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getStatusBadge(item.status)}`}>
                        {item.status}
                      </span>
                      <span className="text-[10px] font-medium text-gray-400 font-mono">
                        {item.id}
                      </span>
                    </div>

                    <h3 className="font-bold text-sm text-[#17152A] line-clamp-2 leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-xs text-gray-500">by {item.author}</p>

                    <div className="flex items-baseline gap-2 pt-1">
                      {item.mode === 'donate' ? (
                        <span className="text-sm font-extrabold text-emerald-600">FREE</span>
                      ) : (
                        <span className="text-base font-extrabold text-[#17152A]">₹{item.price}</span>
                      )}
                      {item.mrp && <span className="text-xs text-gray-400 line-through">₹{item.mrp}</span>}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 pt-3 sm:pt-0 border-gray-100 gap-2 shrink-0">
                  <div className="flex items-center gap-1 text-[11px] text-gray-400">
                    <Eye size={12} /> {item.views} views
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleMarkSold(item.id)}
                      className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition cursor-pointer ${
                        item.status === 'Sold'
                          ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                          : 'border-gray-200 hover:border-[#6C4BF4] text-gray-700'
                      }`}
                    >
                      {item.status === 'Sold' ? 'Sold ✓' : 'Mark as Sold'}
                    </button>

                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition cursor-pointer"
                      title="Delete Listing"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
