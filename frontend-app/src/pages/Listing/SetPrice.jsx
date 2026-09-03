import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SetPrice() {
  const navigate = useNavigate();
  const [transactionMode, setTransactionMode] = useState('sell'); // 'sell' | 'donate'
  const [price, setPrice] = useState(45);
  const mrp = 120; // Mock MRP (Original retail price)

  const handleSliderChange = (e) => {
    setPrice(Number(e.target.value));
  };

  const handlePriceInputChange = (e) => {
    const value = e.target.value === '' ? '' : Number(e.target.value);
    setPrice(value);
  };

  return (
    <div className="max-w-3xl mx-auto py-2">
      {/* Back Button */}
      <button 
        onClick={() => navigate('/sell/transaction')}
        className="mb-6 flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-primary transition font-inter cursor-pointer"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Transaction Mode
      </button>

      <div className="bg-cards p-6 md:p-10 rounded-3xl border border-gray-200/50 shadow-xs">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-text-main mb-2 font-poppins">Set Your Price</h1>
            <p className="text-gray-500 font-inter text-sm">
              Price your book competitively to help it find a buyer faster.
            </p>
          </div>

          {/* Mode Switcher for Demo Simulation */}
          <div className="flex bg-background p-1.5 rounded-xl border border-gray-200/60 shrink-0">
            <button
              onClick={() => setTransactionMode('sell')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition duration-150 cursor-pointer ${
                transactionMode === 'sell'
                  ? 'bg-primary text-white shadow-xs'
                  : 'text-gray-500 hover:text-primary'
              }`}
            >
              Paid Mode
            </button>
            <button
              onClick={() => setTransactionMode('donate')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition duration-150 cursor-pointer ${
                transactionMode === 'donate'
                  ? 'bg-primary text-white shadow-xs'
                  : 'text-gray-500 hover:text-primary'
              }`}
            >
              Donate Mode
            </button>
          </div>
        </div>

        {transactionMode === 'donate' ? (
          /* Donate Mode Display */
          <div className="bg-green-50/50 border border-green-200/60 p-8 rounded-2xl text-center mb-10 animate-fadeIn">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="font-bold text-green-950 text-xl font-poppins mb-2">Donation Mode Active</h3>
            <p className="text-green-800/80 font-inter text-sm max-w-md mx-auto leading-relaxed">
              You've chosen to donate this book. It will be listed for **$0.00** so other students can get it for free. Price inputs have been hidden.
            </p>
          </div>
        ) : (
          /* Paid Modes Display (Sell, Rent, Exchange) */
          <div className="space-y-8 mb-10 animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              
              {/* Inputs Form */}
              <div className="space-y-6">
                <div>
                  <label htmlFor="price" className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 font-inter">
                    Your Selling Price ($)
                  </label>
                  <div className="relative rounded-xl shadow-xs">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 font-bold">
                      $
                    </div>
                    <input
                      type="number"
                      name="price"
                      id="price"
                      min="0"
                      value={price}
                      onChange={handlePriceInputChange}
                      className="w-full pl-9 pr-4 py-3.5 rounded-xl border border-gray-200 bg-background focus:outline-hidden focus:ring-2 focus:ring-primary/20 focus:border-primary transition font-inter text-sm font-semibold text-text-main"
                      placeholder="0.00"
                    />
                  </div>
                  
                  {/* MRP Info label */}
                  <div className="mt-2 text-xs font-medium text-gray-500 font-inter">
                    Original retail price (MRP): <span className="font-semibold text-text-main">${mrp.toFixed(2)}</span>
                  </div>
                </div>

                {/* Suggested Price Slider */}
                <div className="bg-background/80 p-5 rounded-2xl border border-gray-200/50">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider font-inter">Suggested Price Range</span>
                    <span className="text-xs font-bold text-primary font-inter">$36 - $60</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max={mrp}
                    value={price === '' ? 0 : price}
                    onChange={handleSliderChange}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary focus:outline-hidden"
                  />
                  <div className="flex justify-between items-center mt-2 text-[10px] font-bold text-gray-400 font-inter">
                    <span>$0</span>
                    <span className="text-primary bg-primary/10 px-2 py-0.5 rounded-md">Recommended 30-50% off retail</span>
                    <span>${mrp}</span>
                  </div>
                </div>
              </div>

              {/* Compare Prices Card */}
              <div className="bg-background border border-gray-200/60 rounded-2xl p-6 shadow-xs">
                <h3 className="font-bold text-text-main text-lg font-poppins mb-4">
                  Compare Payouts
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2.5 border-b border-gray-200/50">
                    <span className="text-sm font-medium text-gray-500 font-inter">Bookstore Buyback</span>
                    <span className="text-sm font-bold text-red-500 font-inter">$12.00 (avg)</span>
                  </div>
                  <div className="flex justify-between items-center py-2.5 border-b border-gray-200/50">
                    <span className="text-sm font-medium text-gray-500 font-inter">Online Buyback Sites</span>
                    <span className="text-sm font-bold text-red-400 font-inter">$21.50 (avg)</span>
                  </div>
                  <div className="flex justify-between items-center pt-2.5">
                    <span className="text-sm font-semibold text-text-main font-inter">Your Payout on Bookify</span>
                    <span className="text-base font-extrabold text-green-600 font-inter">
                      ${price === '' ? '0.00' : (price * 0.9).toFixed(2)} *
                    </span>
                  </div>
                </div>
                <div className="mt-4 text-[10px] text-gray-400 leading-relaxed font-inter">
                  * Estimated payout based on a standard 10% platform transaction fee. Bookify puts the cash directly in your wallet.
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Footer Navigation */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-100">
          <button
            onClick={() => navigate('/sell/transaction')}
            className="px-6 py-3.5 border border-gray-200 hover:bg-gray-50 text-gray-600 font-semibold rounded-xl text-sm transition cursor-pointer font-inter"
          >
            Back
          </button>
          <button
            onClick={() => navigate('/sell/preview')}
            className="px-8 py-3.5 bg-cta hover:bg-cta/90 text-white font-bold rounded-xl text-sm transition font-inter shadow-xs cursor-pointer"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
