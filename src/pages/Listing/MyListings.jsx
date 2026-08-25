import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const INITIAL_LISTINGS = [
  {
    id: "BKFY-518290",
    title: "Introduction to Algorithms, 3rd Edition",
    price: 45.00,
    condition: "Very Good",
    status: "Active",
    cover: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=300"
  },
  {
    id: "BKFY-982741",
    title: "Cracking the Coding Interview, 6th Edition",
    price: 25.00,
    condition: "Good",
    status: "Active",
    cover: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=300"
  },
  {
    id: "BKFY-304910",
    title: "Calculus: Early Transcendentals",
    price: 60.00,
    condition: "Like New",
    status: "Sold",
    cover: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=300"
  },
  {
    id: "BKFY-298301",
    title: "Organic Chemistry, 8th Edition",
    price: 35.00,
    condition: "Fair",
    status: "Inactive",
    cover: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=300"
  }
];

export default function MyListings() {
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
        return 'bg-green-150 text-green-700 border-green-200/50';
      case 'sold':
        return 'bg-blue-150 text-blue-700 border-blue-200/50';
      case 'inactive':
        return 'bg-amber-150 text-amber-700 border-amber-200/50';
      default:
        return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const getFilterCount = (filterName) => {
    if (filterName === 'All') return listings.length;
    return listings.filter(item => item.status.toLowerCase() === filterName.toLowerCase()).length;
  };

  const filterTabs = ['All', 'Active', 'Sold', 'Inactive'];

  return (
    <div className="max-w-5xl mx-auto py-2">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-text-main mb-2 font-poppins">My Listings</h1>
          <p className="text-gray-500 font-inter text-sm">
            Manage your textbook listings, track sales status, and adjust prices.
          </p>
        </div>
        <button
          onClick={() => navigate('/sell')}
          className="bg-primary hover:bg-primary/95 text-white font-bold px-6 py-3 rounded-xl text-sm transition font-inter shadow-xs cursor-pointer"
        >
          + Create New Listing
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex border-b border-gray-200/70 mb-8 overflow-x-auto gap-2 scrollbar-none">
        {filterTabs.map(tab => {
          const isActive = activeFilter === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={`px-4 py-3.5 text-sm font-semibold transition border-b-2 shrink-0 cursor-pointer flex items-center gap-2 font-inter ${
                isActive
                  ? 'border-primary text-primary font-bold'
                  : 'border-transparent text-gray-500 hover:text-primary hover:border-gray-200'
              }`}
            >
              {tab}
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                isActive ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500'
              }`}>
                {getFilterCount(tab)}
              </span>
            </button>
          );
        })}
      </div>

      {/* Listings Container */}
      {filteredListings.length === 0 ? (
        /* Empty State */
        <div className="bg-cards border border-gray-200/50 rounded-3xl p-12 text-center shadow-xs">
          <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h3 className="font-bold text-text-main text-lg font-poppins mb-1">No listings found</h3>
          <p className="text-gray-500 font-inter text-sm mb-6 max-w-xs mx-auto leading-relaxed">
            There are no {activeFilter !== 'All' ? activeFilter.toLowerCase() : ''} listings to show right now.
          </p>
          {activeFilter !== 'All' ? (
            <button
              onClick={() => setActiveFilter('All')}
              className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold px-5 py-2.5 rounded-xl text-sm transition cursor-pointer font-inter shadow-2xs"
            >
              Clear Filter
            </button>
          ) : (
            <button
              onClick={() => navigate('/sell')}
              className="bg-cta hover:bg-cta/90 text-white font-bold px-6 py-3 rounded-xl text-sm transition cursor-pointer font-inter shadow-xs"
            >
              Start Listing
            </button>
          )}
        </div>
      ) : (
        /* Listings Grid */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredListings.map((item) => (
            <div
              key={item.id}
              className="bg-cards border border-gray-200/50 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row gap-5"
            >
              {/* Cover Image */}
              <div className="w-full sm:w-28 h-36 rounded-xl overflow-hidden shrink-0 bg-gray-50 border border-gray-200 relative">
                <img
                  src={item.cover}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Detail Content */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start gap-2 mb-1.5 flex-wrap">
                    <span className="text-[10px] font-mono font-bold text-gray-400">
                      {item.id}
                    </span>
                    <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${getStatusBadgeClass(item.status)}`}>
                      {item.status}
                    </span>
                  </div>
                  <h3 className="font-bold text-text-main text-base font-poppins line-clamp-2 leading-tight mb-2">
                    {item.title}
                  </h3>
                  
                  <div className="flex items-center gap-4 text-xs font-inter text-gray-500 mb-4">
                    <div>
                      Condition: <span className="font-bold text-text-main">{item.condition}</span>
                    </div>
                    <div>
                      Price: <span className="font-extrabold text-green-600">${item.price.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Actions Button Panel */}
                <div className="flex items-center gap-2 pt-3 border-t border-gray-150/40 flex-wrap">
                  <button
                    onClick={() => handleEdit(item.id)}
                    className="flex-1 min-w-[70px] bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 font-semibold py-2 px-3 rounded-lg text-xs transition cursor-pointer font-inter text-center"
                  >
                    Edit
                  </button>
                  
                  {item.status.toLowerCase() === 'active' && (
                    <button
                      onClick={() => handleMarkSold(item.id)}
                      className="flex-1 min-w-[90px] bg-primary hover:bg-primary/95 text-white font-bold py-2 px-3 rounded-lg text-xs transition cursor-pointer font-inter text-center shadow-2xs"
                    >
                      Mark Sold
                    </button>
                  )}

                  <button
                    onClick={() => handleDelete(item.id)}
                    className="flex-1 min-w-[70px] bg-red-50 hover:bg-red-100 text-red-600 font-semibold py-2 px-3 rounded-lg text-xs transition cursor-pointer font-inter text-center"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
