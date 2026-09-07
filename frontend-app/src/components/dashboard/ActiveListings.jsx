import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { listingService } from "../../services/listingService";

function BookCover({ title, bgClass = "from-[#2E189A] to-[#6C4BF4]" }) {
  const words = title ? title.split(" ") : ["BK"];
  const initials = words.length >= 2 
    ? `${words[0].substring(0, 1)}${words[1].substring(0, 1)}` 
    : (title ? title.substring(0, 2) : "BK");
  
  return (
    <div className={`h-11 w-8 shrink-0 rounded bg-gradient-to-br ${bgClass} flex flex-col justify-between p-1 text-[7px] font-extrabold text-white shadow-sm border border-black/5 leading-none text-center select-none uppercase tracking-tighter`}>
      <span className="text-[3px] opacity-75 block text-left">BOOK</span>
      <span className="my-auto block leading-[8px] break-all">{initials}</span>
      <span className="text-[3px] opacity-50 block text-right">ED.</span>
    </div>
  );
}

function ActiveListings() {
  const [listings, setListings] = useState(() => listingService.getActiveListings().slice(0, 3));

  const reload = () => {
    setListings(listingService.getActiveListings().slice(0, 3));
  };

  useEffect(() => {
    reload();
    window.addEventListener("bookify_user_listings_updated", reload);
    return () => window.removeEventListener("bookify_user_listings_updated", reload);
  }, []);

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold text-[#17152A]">Active Listings</h3>
        <Link 
          to="/dashboard/listings" 
          className="text-xs font-semibold text-[#6C4BF4] cursor-pointer hover:underline"
        >
          View All
        </Link>
      </div>

      <div className="space-y-4">
        {listings.length === 0 ? (
          <div className="text-center py-4 text-xs text-gray-400">
            No active listings yet. <Link to="/sell" className="text-[#6C4BF4] font-semibold underline ml-1">List a book</Link>
          </div>
        ) : (
          listings.map((book) => (
            <div
              key={book.id}
              className="flex items-center gap-3"
            >
              <BookCover title={book.title} bgClass={book.coverClass || "from-[#1E3A8A] to-[#3B82F6]"} />

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-[#17152A]">
                  {book.title}
                </p>
                <p className="mt-0.5 text-xs text-gray-400">
                  Views: {book.views || 0} • ₹{book.price}
                </p>
              </div>

              <span className="rounded-full bg-[#E9F9EF] px-2.5 py-1 text-[10px] font-semibold text-green-600 shrink-0">
                Active
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ActiveListings;