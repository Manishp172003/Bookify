import React from 'react';
import { Routes, Route, NavLink, Navigate } from 'react-router-dom';

// Import Pages
import SellBook from './pages/Listing/SellBook';
import ISBNLookup from './pages/Listing/ISBNLookup';
import Condition from './pages/Listing/Condition';
import UploadPhotos from './pages/Listing/UploadPhotos';
import TransactionMode from './pages/Listing/TransactionMode';
import SetPrice from './pages/Listing/SetPrice';
import PreviewListing from './pages/Listing/PreviewListing';
import PublishSuccess from './pages/Listing/PublishSuccess';
import MyListings from './pages/Listing/MyListings';
import WantBoard from './pages/Listing/WantBoard';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-text-main font-inter antialiased">
      
      {/* Sticky top header (80px height: h-20) */}
      <header className="sticky top-0 z-50 h-20 bg-cards/85 backdrop-blur-md border-b border-border-custom px-6 md:px-10 flex items-center justify-between shadow-xs shadow-primary/2 shrink-0">
        
        {/* Left branding */}
        <div className="flex items-center gap-3">
          <img src="/logo.jpg" alt="Bookify Logo" className="h-10 object-contain" />
          <span className="hidden sm:inline-block bg-primary/10 text-primary px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest font-inter">
            Seller Hub
          </span>
        </div>

        {/* Center: Horizontal navigation menu (My Listings, Want Board, Sell Book) */}
        <nav className="hidden md:flex items-center gap-1.5 bg-background/80 p-1.5 rounded-full border border-border-custom/40 shadow-2xs">
          <NavLink
            to="/listings"
            className={({ isActive }) =>
              `px-5 py-2.5 rounded-full text-xs font-bold transition duration-250 font-inter ${
                isActive
                  ? 'bg-primary text-white shadow-xs'
                  : 'text-gray-500 hover:text-primary hover:bg-primary/5'
              }`
            }
          >
            My Listings
          </NavLink>
          <NavLink
            to="/want-board"
            className={({ isActive }) =>
              `px-5 py-2.5 rounded-full text-xs font-bold transition duration-250 font-inter ${
                isActive
                  ? 'bg-primary text-white shadow-xs'
                  : 'text-gray-500 hover:text-primary hover:bg-primary/5'
              }`
            }
          >
            Want Board
          </NavLink>
          <NavLink
            to="/sell"
            className={({ isActive }) =>
              `px-5 py-2.5 rounded-full text-xs font-bold transition duration-250 font-inter ${
                isActive
                  ? 'bg-primary text-white shadow-xs'
                  : 'text-gray-500 hover:text-primary hover:bg-primary/5'
              }`
            }
          >
            Sell Book
          </NavLink>
        </nav>

        {/* Right side controls */}
        <div className="flex items-center gap-4">
          
          {/* Notification icon */}
          <button className="p-2.5 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-full transition duration-200 relative cursor-pointer">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-pink-custom ring-2 ring-cards"></span>
          </button>

          {/* User Profile Avatar */}
          <div className="h-9 w-9 rounded-full bg-linear-to-tr from-primary to-pink-custom border-2 border-cards shadow-xs flex items-center justify-center text-white font-bold text-xs tracking-wide cursor-pointer hover:scale-105 transition duration-200 font-poppins">
            JD
          </div>

          {/* Orange "+ Sell A Book" button */}
          <NavLink
            to="/sell"
            className="hidden sm:inline-flex bg-cta hover:bg-cta/90 hover:scale-[1.02] active:scale-98 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition duration-250 font-inter shadow-xs shadow-cta/20 items-center gap-1.5 cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            Sell A Book
          </NavLink>

        </div>
      </header>

      {/* Responsive mobile sub-navigation bar (Only visible below md) */}
      <div className="md:hidden sticky top-20 z-40 bg-cards/85 backdrop-blur-md border-b border-border-custom py-2.5 px-4 flex justify-center shadow-2xs">
        <nav className="flex items-center gap-1 bg-background/80 p-1 rounded-full border border-border-custom/40">
          <NavLink
            to="/listings"
            className={({ isActive }) =>
              `px-4 py-2 rounded-full text-[11px] font-bold transition duration-250 font-inter ${
                isActive
                  ? 'bg-primary text-white shadow-xs'
                  : 'text-gray-500 hover:text-primary hover:bg-primary/5'
              }`
            }
          >
            My Listings
          </NavLink>
          <NavLink
            to="/want-board"
            className={({ isActive }) =>
              `px-4 py-2 rounded-full text-[11px] font-bold transition duration-250 font-inter ${
                isActive
                  ? 'bg-primary text-white shadow-xs'
                  : 'text-gray-500 hover:text-primary hover:bg-primary/5'
              }`
            }
          >
            Want Board
          </NavLink>
          <NavLink
            to="/sell"
            className={({ isActive }) =>
              `px-4 py-2 rounded-full text-[11px] font-bold transition duration-250 font-inter ${
                isActive
                  ? 'bg-primary text-white shadow-xs'
                  : 'text-gray-500 hover:text-primary hover:bg-primary/5'
              }`
            }
          >
            Sell Book
          </NavLink>
        </nav>
      </div>

      {/* Main Content Container (Full width background, 1400px max-width, center aligned, 40px padding: p-10) */}
      <div className="flex-1 w-full bg-background flex justify-center min-h-0">
        <main className="w-full max-w-[1400px] px-6 py-8 md:p-10 font-inter">
          <Routes>
            <Route path="/" element={<Navigate to="/listings" replace />} />
            <Route path="/listings" element={<MyListings />} />
            <Route path="/want-board" element={<WantBoard />} />
            <Route path="/sell" element={<SellBook />} />
            <Route path="/sell/isbn" element={<ISBNLookup />} />
            <Route path="/sell/condition" element={<Condition />} />
            <Route path="/sell/photos" element={<UploadPhotos />} />
            <Route path="/sell/transaction" element={<TransactionMode />} />
            <Route path="/sell/price" element={<SetPrice />} />
            <Route path="/sell/preview" element={<PreviewListing />} />
            <Route path="/sell/success" element={<PublishSuccess />} />
          </Routes>
        </main>
      </div>

    </div>
  );
}
