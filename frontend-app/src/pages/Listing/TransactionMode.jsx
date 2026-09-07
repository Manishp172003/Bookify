import React from 'react';
import { useNavigate } from 'react-router-dom';
import ListingWizardLayout from '../../components/listing/ListingWizardLayout';
import { useListing } from '../../context/ListingContext';
import { Wallet, Clock, Repeat, HeartHandshake, Check, ArrowRight, ArrowLeft } from 'lucide-react';

const MODES = [
  {
    id: 'sell',
    name: 'Sell for Cash',
    tag: 'Highest Demand',
    badgeColor: 'bg-purple-100 text-[#6C4BF4]',
    description: 'Sell outright for a fixed price. Receive instant payouts directly to your UPI or bank wallet upon buyer delivery.',
    icon: Wallet
  },
  {
    id: 'rent',
    name: 'Semester Rental',
    tag: 'Recurring Passive Income',
    badgeColor: 'bg-blue-100 text-blue-800',
    description: 'Rent your textbook to juniors for 1 month, 3 months, or full semester. Maintain book ownership for future years.',
    icon: Clock
  },
  {
    id: 'exchange',
    name: 'Direct Book Swap',
    tag: 'Zero Cost',
    badgeColor: 'bg-amber-100 text-amber-800',
    description: 'Trade this book for an upcoming semester course book with verified campus students. 100% free peer trade.',
    icon: Repeat
  },
  {
    id: 'donate',
    name: 'Free Book Donation',
    tag: 'Community Goodwill',
    badgeColor: 'bg-emerald-100 text-emerald-800',
    description: 'List your book at ₹0.00 to support fellow campus peers who cannot afford standard engineering/medical textbooks.',
    icon: HeartHandshake
  }
];

export default function TransactionMode() {
  const navigate = useNavigate();
  const { listingData, updateListingData } = useListing();

  const handleSelectMode = (modeId) => {
    updateListingData({ mode: modeId });
  };

  return (
    <ListingWizardLayout
      currentStep={4}
      title="Choose Transaction Mode"
      subtitle="Select whether you want to sell for cash, rent for the semester, swap with a classmate, or donate."
    >
      <div className="space-y-8">
        
        {/* Modes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {MODES.map((mode) => {
            const isSelected = listingData.mode === mode.id;
            const ModeIcon = mode.icon;

            return (
              <button
                key={mode.id}
                type="button"
                onClick={() => handleSelectMode(mode.id)}
                className={`text-left p-6 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between gap-4 ${
                  isSelected
                    ? 'border-[#6C4BF4] bg-[#EEEAFE]/30 ring-2 ring-[#6C4BF4] shadow-sm'
                    : 'border-gray-200 hover:border-[#6C4BF4]/60 bg-white hover:bg-gray-50/50'
                }`}
              >
                <div className="flex items-start justify-between gap-3 w-full">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-3 rounded-xl shrink-0 ${
                        isSelected ? 'bg-[#6C4BF4] text-white' : 'bg-gray-100 text-[#6C4BF4]'
                      }`}
                    >
                      <ModeIcon size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-[#17152A] text-base font-[family-name:var(--font-heading)]">
                        {mode.name}
                      </h3>
                      <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mt-0.5 ${mode.badgeColor}`}>
                        {mode.tag}
                      </span>
                    </div>
                  </div>

                  {/* Radio Button */}
                  <div
                    className={`w-6 h-6 rounded-full shrink-0 flex items-center justify-center border transition ${
                      isSelected
                        ? 'bg-[#6C4BF4] border-[#6C4BF4] text-white'
                        : 'border-gray-300 bg-white'
                    }`}
                  >
                    {isSelected && <Check size={14} strokeWidth={3} />}
                  </div>
                </div>

                <p className="text-xs text-gray-500 leading-relaxed">
                  {mode.description}
                </p>
              </button>
            );
          })}
        </div>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-100">
          <button
            type="button"
            onClick={() => navigate('/sell/photos')}
            className="inline-flex items-center gap-2 px-6 py-3.5 border border-gray-200 hover:bg-gray-50 text-gray-600 font-semibold rounded-xl text-sm transition cursor-pointer"
          >
            <ArrowLeft size={16} /> Back
          </button>

          <button
            type="button"
            onClick={() => navigate('/sell/price')}
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#6C4BF4] hover:bg-[#5B3DE0] text-white font-bold rounded-xl text-sm transition shadow-md shadow-[#6C4BF4]/25 cursor-pointer"
          >
            Continue to Pricing <ArrowRight size={16} />
          </button>
        </div>

      </div>
    </ListingWizardLayout>
  );
}
