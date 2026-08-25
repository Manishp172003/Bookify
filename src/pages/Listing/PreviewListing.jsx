import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function PreviewListing() {
  const navigate = useNavigate();

  // Mocked details to simulate previously entered step data
  const listingData = {
    book: {
      title: "Introduction to Algorithms",
      author: "Thomas H. Cormen, Charles E. Leiserson, Ronald L. Rivest, Clifford Stein",
      publisher: "MIT Press",
      edition: "3rd Edition",
      year: "2009",
      format: "Paperback",
      cover: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=300"
    },
    condition: "Very Good",
    conditionDesc: "Minimal signs of use. Pages are clean, spine is solid, with zero or minor highlights.",
    price: 45.00,
    transactionMode: "Sell",
    location: "Student Union / Central Library, Main Campus",
    photosCount: 3
  };

  return (
    <div className="max-w-4xl mx-auto py-2">
      {/* Back Button */}
      <button 
        onClick={() => navigate('/sell/price')}
        className="mb-6 flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-primary transition font-inter cursor-pointer"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Price
      </button>

      <div className="bg-cards p-6 md:p-10 rounded-3xl border border-gray-200/50 shadow-xs">
        <h1 className="text-3xl font-extrabold text-text-main mb-2 font-poppins">Preview Your Listing</h1>
        <p className="text-gray-500 font-inter text-sm mb-8">
          Review your textbook listing details. Once published, students at your campus can purchase it immediately.
        </p>

        {/* Two-Column Summary Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10">
          
          {/* Column 1: Book Info Card (Left) */}
          <div className="lg:col-span-7 bg-background p-6 rounded-2xl border border-gray-200/40 flex flex-col sm:flex-row gap-6">
            <div className="w-full sm:w-36 h-52 rounded-xl overflow-hidden shadow-xs shrink-0 bg-gray-200 border border-gray-300/30 relative">
              <img 
                src={listingData.book.cover} 
                alt={listingData.book.title} 
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-2 left-2 bg-black/65 text-white text-[10px] font-bold px-2 py-0.5 rounded-md font-inter flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {listingData.photosCount} Photos
              </span>
            </div>

            <div className="flex-1 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-primary bg-primary/10 px-2.5 py-0.5 rounded-full uppercase tracking-wider font-inter">
                  Textbook Details
                </span>
                <h3 className="text-xl font-extrabold text-text-main mt-2 mb-2 font-poppins leading-tight">
                  {listingData.book.title}
                </h3>
                <p className="text-sm font-medium text-gray-500 font-inter mb-4">
                  by <span className="text-text-main">{listingData.book.author}</span>
                </p>

                <div className="space-y-1.5 text-xs text-gray-500 font-inter">
                  <div>
                    <span className="font-bold text-gray-400 uppercase text-[9px] tracking-wider inline-block w-20">Publisher:</span>
                    <span className="text-text-main font-semibold">{listingData.book.publisher}</span>
                  </div>
                  <div>
                    <span className="font-bold text-gray-400 uppercase text-[9px] tracking-wider inline-block w-20">Edition:</span>
                    <span className="text-text-main font-semibold">{listingData.book.edition}</span>
                  </div>
                  <div>
                    <span className="font-bold text-gray-400 uppercase text-[9px] tracking-wider inline-block w-20">Year:</span>
                    <span className="text-text-main font-semibold">{listingData.book.year}</span>
                  </div>
                  <div>
                    <span className="font-bold text-gray-400 uppercase text-[9px] tracking-wider inline-block w-20">Format:</span>
                    <span className="text-text-main font-semibold">{listingData.book.format}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Column 2: Listing Parameters (Right) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Condition Panel */}
            <div className="bg-cards border border-gray-200/50 p-5 rounded-2xl shadow-xs">
              <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 font-inter">Condition</span>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-base font-extrabold text-text-main font-poppins">{listingData.condition}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                <span className="text-xs text-primary font-bold font-inter">Verified Grade</span>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed font-inter">
                {listingData.conditionDesc}
              </p>
            </div>

            {/* Transaction & Price Panel */}
            <div className="bg-cards border border-gray-200/50 p-5 rounded-2xl shadow-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 font-inter">Transaction</span>
                  <span className="inline-block bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-lg font-inter">
                    {listingData.transactionMode}
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 font-inter">Listing Price</span>
                  <span className="text-xl font-extrabold text-green-600 font-inter">
                    ${listingData.price.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Meetup Location Panel */}
            <div className="bg-cards border border-gray-200/50 p-5 rounded-2xl shadow-xs">
              <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 font-inter">Exchange Location</span>
              <div className="flex gap-2 items-start">
                <svg className="w-4 h-4 text-primary shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-xs font-semibold text-text-main font-inter">
                  {listingData.location}
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-100">
          <button
            onClick={() => navigate('/sell/price')}
            className="px-6 py-3.5 border border-gray-200 hover:bg-gray-50 text-gray-600 font-semibold rounded-xl text-sm transition cursor-pointer font-inter"
          >
            Back
          </button>
          <button
            onClick={() => navigate('/sell/success')}
            className="px-8 py-3.5 bg-cta hover:bg-cta/90 text-white font-bold rounded-xl text-sm transition font-inter shadow-xs cursor-pointer"
          >
            Publish Listing
          </button>
        </div>
      </div>
    </div>
  );
}
