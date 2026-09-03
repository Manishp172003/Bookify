import React, { useState } from 'react';

const INITIAL_REQUESTS = [
  {
    id: "REQ-01",
    title: "Introduction to Algorithms, 3rd Edition",
    author: "Thomas H. Cormen",
    location: "Engineering Library, Campus North",
    status: "Wanted",
    isMyRequest: false,
    cover: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=300"
  },
  {
    id: "REQ-02",
    title: "Cracking the Coding Interview, 6th Edition",
    author: "Gayle Laakmann McDowell",
    location: "Computer Science Lobby",
    status: "Matched",
    isMyRequest: false,
    cover: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=300"
  },
  {
    id: "REQ-03",
    title: "Calculus: Early Transcendentals",
    author: "James Stewart",
    location: "Mathematics Hall Room 302",
    status: "Fulfilled",
    isMyRequest: true,
    cover: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=300"
  },
  {
    id: "REQ-04",
    title: "Physics for Scientists and Engineers",
    author: "Raymond A. Serway",
    location: "Science Center Building C",
    status: "Wanted",
    isMyRequest: true,
    cover: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=300"
  }
];

export default function WantBoard() {
  const [requests, setRequests] = useState(INITIAL_REQUESTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All');

  const handleIHaveThis = (id) => {
    setRequests(prev =>
      prev.map(req =>
        req.id === id ? { ...req, status: 'Matched' } : req
      )
    );
    alert("Awesome! You've matched with this request. The requester will be notified to review your listing.");
  };

  const getStatusBadge = (status) => {
    switch (status.toLowerCase()) {
      case 'wanted':
        return 'bg-orange-100 text-orange-700 border-orange-200/50';
      case 'matched':
        return 'bg-primary/10 text-primary border-primary/20';
      case 'fulfilled':
        return 'bg-green-150 text-green-700 border-green-200/50';
      default:
        return 'bg-gray-100 text-gray-500 border-gray-200';
    }
  };

  const tabs = ['All', 'My Requests', 'Matched', 'Fulfilled'];

  const getFilteredRequests = () => {
    return requests.filter(req => {
      // Tab filter
      if (activeTab === 'My Requests' && !req.isMyRequest) return false;
      if (activeTab === 'Matched' && req.status.toLowerCase() !== 'matched') return false;
      if (activeTab === 'Fulfilled' && req.status.toLowerCase() !== 'fulfilled') return false;

      // Search query filter
      const query = searchQuery.toLowerCase();
      return (
        req.title.toLowerCase().includes(query) ||
        req.author.toLowerCase().includes(query) ||
        req.location.toLowerCase().includes(query)
      );
    });
  };

  const getTabCount = (tabName) => {
    return requests.filter(req => {
      if (tabName === 'All') return true;
      if (tabName === 'My Requests') return req.isMyRequest;
      if (tabName === 'Matched') return req.status.toLowerCase() === 'matched';
      if (tabName === 'Fulfilled') return req.status.toLowerCase() === 'fulfilled';
      return false;
    }).length;
  };

  const filteredRequests = getFilteredRequests();

  return (
    <div className="max-w-5xl mx-auto py-2">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-text-main mb-2 font-poppins">Want Board</h1>
          <p className="text-gray-500 font-inter text-sm">
            Fulfill book requests from classmates or submit your own request.
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Search requests by title, author, or location..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-gray-200 bg-cards focus:outline-hidden focus:ring-2 focus:ring-primary/20 focus:border-primary transition font-inter text-sm text-text-main shadow-xs"
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex border-b border-gray-200/70 mb-8 overflow-x-auto gap-2 scrollbar-none">
        {tabs.map(tab => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
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
                {getTabCount(tab)}
              </span>
            </button>
          );
        })}
      </div>

      {/* Cards List Grid */}
      {filteredRequests.length === 0 ? (
        /* Empty State */
        <div className="bg-cards border border-gray-200/50 rounded-3xl p-12 text-center shadow-xs">
          <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="font-bold text-text-main text-lg font-poppins mb-1">No requests found</h3>
          <p className="text-gray-500 font-inter text-sm max-w-xs mx-auto leading-relaxed">
            Try adjusting your search criteria or clear the filters to view all entries.
          </p>
        </div>
      ) : (
        /* Requests Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredRequests.map((req) => (
            <div
              key={req.id}
              className="bg-cards border border-gray-200/50 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row gap-5"
            >
              {/* Cover Image */}
              <div className="w-full sm:w-28 h-36 rounded-xl overflow-hidden shrink-0 bg-gray-50 border border-gray-200 relative">
                <img
                  src={req.cover}
                  alt={req.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Content Panel */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start gap-2 mb-1.5 flex-wrap">
                    <span className="text-[10px] font-mono font-bold text-gray-400">
                      {req.id}
                    </span>
                    <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${getStatusBadge(req.status)}`}>
                      {req.status}
                    </span>
                  </div>
                  
                  <h3 className="font-bold text-text-main text-base font-poppins line-clamp-2 leading-tight">
                    {req.title}
                  </h3>
                  <p className="text-xs font-medium text-gray-500 font-inter mb-3 mt-0.5">
                    by {req.author}
                  </p>

                  {/* Location Meta */}
                  <div className="flex items-start gap-1 text-xs text-gray-500 font-inter mb-4">
                    <svg className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{req.location}</span>
                  </div>
                </div>

                {/* Confirm Match Trigger Button */}
                {req.status.toLowerCase() === 'wanted' ? (
                  <button
                    onClick={() => handleIHaveThis(req.id)}
                    className="w-full bg-cta hover:bg-cta/90 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition cursor-pointer font-inter text-center shadow-2xs"
                  >
                    I Have This Book
                  </button>
                ) : (
                  <div className="w-full bg-gray-50 border border-gray-150/40 text-gray-400 font-semibold py-2.5 px-4 rounded-xl text-xs font-inter text-center">
                    {req.status === 'Matched' ? 'Match In Review' : 'Request Fulfilled'}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
