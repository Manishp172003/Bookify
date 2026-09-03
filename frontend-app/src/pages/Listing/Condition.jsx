import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CONDITIONS = [
  {
    id: 'like-new',
    name: 'Like New',
    description: 'Practically brand new. No highlight marks, folded pages, or visible cover wear.'
  },
  {
    id: 'very-good',
    name: 'Very Good',
    description: 'Minimal signs of use. Pages are clean, spine is solid, with zero or minor highlights.'
  },
  {
    id: 'good',
    name: 'Good',
    description: 'Some light wear. May contain highlight marks or margin notes, but perfectly readable.'
  },
  {
    id: 'fair',
    name: 'Fair',
    description: 'Visible wear, folded corners, or significant highlight marks, but all pages are intact.'
  }
];

export default function Condition() {
  const navigate = useNavigate();
  const [selectedCondition, setSelectedCondition] = useState(null);

  return (
    <div className="max-w-3xl mx-auto py-2">
      {/* Back Button */}
      <button 
        onClick={() => navigate('/sell/isbn')}
        className="mb-6 flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-primary transition font-inter cursor-pointer"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Find Book
      </button>

      <div className="bg-cards p-6 md:p-10 rounded-3xl border border-gray-200/50 shadow-xs">
        <h1 className="text-3xl font-extrabold text-text-main mb-2 font-poppins">Select Book Condition</h1>
        <p className="text-gray-500 font-inter text-sm mb-8">
          Be honest about your book's condition. Happy buyers lead to better seller ratings!
        </p>

        {/* Condition Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
          {CONDITIONS.map((cond) => {
            const isSelected = selectedCondition === cond.id;
            return (
              <button
                key={cond.id}
                onClick={() => setSelectedCondition(cond.id)}
                className={`text-left p-6 rounded-2xl border transition duration-200 cursor-pointer flex justify-between items-start gap-4 ${
                  isSelected
                    ? 'border-primary bg-primary/5 ring-1 ring-primary'
                    : 'border-gray-200 hover:border-primary/50 bg-cards'
                }`}
              >
                <div className="flex-1">
                  <h3 className="font-bold text-text-main text-lg font-poppins mb-1.5">
                    {cond.name}
                  </h3>
                  <p className="text-gray-500 font-inter text-sm leading-relaxed">
                    {cond.description}
                  </p>
                </div>

                {/* Selection Indicator */}
                <div className={`w-6 h-6 rounded-full shrink-0 flex items-center justify-center border transition ${
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
              </button>
            );
          })}
        </div>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-100">
          <button
            onClick={() => navigate('/sell/isbn')}
            className="px-6 py-3.5 border border-gray-200 hover:bg-gray-50 text-gray-600 font-semibold rounded-xl text-sm transition cursor-pointer font-inter"
          >
            Back
          </button>
          <button
            onClick={() => navigate('/sell/photos')}
            disabled={!selectedCondition}
            className={`px-8 py-3.5 font-bold rounded-xl text-sm transition font-inter shadow-xs cursor-pointer ${
              selectedCondition
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
