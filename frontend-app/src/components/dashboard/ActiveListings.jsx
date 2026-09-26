import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { listingService } from "../../services/listingService";
import { getBookCover, DEFAULT_BOOK_COVER } from "../../utils/bookCoverUtils";

function BookCover({ book, title }) {
  const coverUrl = getBookCover(book || title);
  return (
    <div className="h-11 w-8 shrink-0 overflow-hidden rounded bg-gray-100 border border-gray-200 shadow-2xs relative">
      <img
        src={coverUrl}
        alt={title || "Book"}
        className="h-full w-full object-cover"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = DEFAULT_BOOK_COVER;
        }}
      />
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
              <BookCover book={book} title={book.title} />

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