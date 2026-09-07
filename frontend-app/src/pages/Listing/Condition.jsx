import React from 'react';
import { useNavigate } from 'react-router-dom';
import ListingWizardLayout from '../../components/listing/ListingWizardLayout';
import { useListing } from '../../context/ListingContext';
import { Check, Sparkles, ShieldCheck, ArrowRight, ArrowLeft } from 'lucide-react';

const CONDITIONS = [
  {
    id: 'like-new',
    name: 'Like New',
    badge: 'Flawless',
    badgeColor: 'bg-emerald-100 text-emerald-800',
    description: 'Practically brand new. Zero highlight marks, uncreased spine, crisp pages, and no visible cover wear.'
  },
  {
    id: 'very-good',
    name: 'Very Good',
    badge: 'Popular',
    badgeColor: 'bg-purple-100 text-[#6C4BF4]',
    description: 'Minimal signs of handling. Pages are clean, spine is solid, with minor pencil notes or no highlights.'
  },
  {
    id: 'good',
    name: 'Good',
    badge: 'Great Value',
    badgeColor: 'bg-blue-100 text-blue-800',
    description: 'Light study wear. May contain highlighter marks or margin notes, but 100% readable and intact.'
  },
  {
    id: 'fair',
    name: 'Fair',
    badge: 'Budget Pick',
    badgeColor: 'bg-amber-100 text-amber-800',
    description: 'Visible cover creases, folded page corners, or extensive highlighting, but no missing text or sheets.'
  }
];

export default function Condition() {
  const navigate = useNavigate();
  const { listingData, updateListingData } = useListing();

  const handleSelectCondition = (conditionId) => {
    updateListingData({ condition: conditionId });
  };

  return (
    <ListingWizardLayout
      currentStep={2}
      title="Select Book Condition"
      subtitle="Accurate condition grading ensures smooth handoffs and 5-star seller ratings."
    >
      <div className="space-y-8">
        
        {/* Condition Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {CONDITIONS.map((cond) => {
            const isSelected = listingData.condition === cond.id;
            return (
              <button
                key={cond.id}
                type="button"
                onClick={() => handleSelectCondition(cond.id)}
                className={`text-left p-5 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between gap-3 ${
                  isSelected
                    ? 'border-[#6C4BF4] bg-[#EEEAFE]/30 ring-2 ring-[#6C4BF4] shadow-sm'
                    : 'border-gray-200 hover:border-[#6C4BF4]/60 bg-white hover:bg-gray-50/50'
                }`}
              >
                <div className="flex items-start justify-between gap-2 w-full">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-[#17152A] text-base font-[family-name:var(--font-heading)]">
                      {cond.name}
                    </h3>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${cond.badgeColor}`}>
                      {cond.badge}
                    </span>
                  </div>

                  {/* Radio Indicator */}
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
                  {cond.description}
                </p>
              </button>
            );
          })}
        </div>

        {/* Custom Seller Notes */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">
            Additional Condition Notes (Optional)
          </label>
          <textarea
            rows={3}
            value={listingData.conditionNotes || ''}
            onChange={(e) => updateListingData({ conditionNotes: e.target.value })}
            placeholder="e.g. Includes formula cheat sheet, chapters 1-4 highlighted in yellow, no torn pages."
            className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-[#F8F7FF] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6C4BF4]/20 focus:border-[#6C4BF4] text-sm text-[#17152A]"
          />
        </div>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-100">
          <button
            type="button"
            onClick={() => navigate('/sell/isbn')}
            className="inline-flex items-center gap-2 px-6 py-3.5 border border-gray-200 hover:bg-gray-50 text-gray-600 font-semibold rounded-xl text-sm transition cursor-pointer"
          >
            <ArrowLeft size={16} /> Back
          </button>

          <button
            type="button"
            onClick={() => navigate('/sell/photos')}
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#6C4BF4] hover:bg-[#5B3DE0] text-white font-bold rounded-xl text-sm transition shadow-md shadow-[#6C4BF4]/25 cursor-pointer"
          >
            Continue to Photos <ArrowRight size={16} />
          </button>
        </div>

      </div>
    </ListingWizardLayout>
  );
}
