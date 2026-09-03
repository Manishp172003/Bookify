import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const MODES = [
  {
    id: 'sell',
    name: 'Sell',
    description: 'Sell your book for a fixed price. Receive outright cash or digital payments.',
    icon: (
      <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  },
  {
    id: 'rent',
    name: 'Rent',
    description: 'Rent your textbook to others for a semester, a month, or a customized duration.',
    icon: (
      <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    )
  },
  {
    id: 'exchange',
    name: 'Exchange',
    description: 'Swap your textbook with someone else for a book you need for your next courses.',
    icon: (
      <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
      </svg>
    )
  },
  {
    id: 'donate',
    name: 'Donate',
    description: 'List your book for free ($0.00). Support fellow students who need study resources.',
    icon: (
      <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    )
  }
];

export default function TransactionMode() {
  const navigate = useNavigate();
  const [selectedMode, setSelectedMode] = useState(null);

  return (
    <div className="max-w-3xl mx-auto py-2">
      {/* Back Button */}
      <button 
        onClick={() => navigate('/sell/photos')}
        className="mb-6 flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-primary transition font-inter cursor-pointer"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Photos
      </button>

      <div className="bg-cards p-6 md:p-10 rounded-3xl border border-gray-200/50 shadow-xs">
        <h1 className="text-3xl font-extrabold text-text-main mb-2 font-poppins">Choose Transaction Mode</h1>
        <p className="text-gray-500 font-inter text-sm mb-8">
          Select how you want to transact your book. You can sell it, rent it, swap it, or list it as a free donation.
        </p>

        {/* Modes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
          {MODES.map((mode) => {
            const isSelected = selectedMode === mode.id;
            return (
              <button
                key={mode.id}
                onClick={() => setSelectedMode(mode.id)}
                className={`text-left p-6 rounded-2xl border transition duration-200 cursor-pointer flex gap-4 items-start ${
                  isSelected
                    ? 'border-primary bg-primary/5 ring-1 ring-primary'
                    : 'border-gray-200 hover:border-primary/50 bg-cards'
                }`}
              >
                <div className="p-3 bg-primary/10 rounded-xl shrink-0 mt-0.5">
                  {mode.icon}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <h3 className="font-bold text-text-main text-lg font-poppins">
                      {mode.name}
                    </h3>
                    
                    {/* Selection Indicator */}
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center border transition ${
                      isSelected 
                        ? 'bg-primary border-primary text-white' 
                        : 'border-gray-300 bg-white'
                    }`}>
                      {isSelected && (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  </div>
                  <p className="text-gray-500 font-inter text-sm leading-relaxed pr-2">
                    {mode.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-100">
          <button
            onClick={() => navigate('/sell/photos')}
            className="px-6 py-3.5 border border-gray-200 hover:bg-gray-50 text-gray-600 font-semibold rounded-xl text-sm transition cursor-pointer font-inter"
          >
            Back
          </button>
          <button
            onClick={() => navigate('/sell/price')}
            disabled={!selectedMode}
            className={`px-8 py-3.5 font-bold rounded-xl text-sm transition font-inter shadow-xs cursor-pointer ${
              selectedMode
                ? 'bg-cta hover:bg-cta/90 text-white'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'
            }`}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
