import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ListingWizardLayout from '../../components/listing/ListingWizardLayout';
import { useListing } from '../../context/ListingContext';
import { listingService } from '../../services/listingService';
import { 
  CheckCircle2, 
  MapPin, 
  ShieldCheck, 
  Sparkles, 
  Tag, 
  BookOpen, 
  Clock, 
  Repeat, 
  HeartHandshake, 
  ArrowLeft, 
  Send 
} from 'lucide-react';

export default function PreviewListing() {
  const navigate = useNavigate();
  const { listingData, resetListing } = useListing();
  const [isPublishing, setIsPublishing] = useState(false);

  const handlePublish = () => {
    setIsPublishing(true);
    setTimeout(() => {
      listingService.createListing(listingData);
      resetListing();
      setIsPublishing(false);
      navigate('/sell/success');
    }, 600);
  };

  const getConditionLabel = (id) => {
    switch (id) {
      case 'like-new': return 'Like New';
      case 'very-good': return 'Very Good';
      case 'good': return 'Good';
      case 'fair': return 'Fair';
      default: return 'Good';
    }
  };

  return (
    <ListingWizardLayout
      currentStep={6}
      title="Review & Confirm Listing"
      subtitle="Verify your book information, photos, and price before making it live to campus buyers."
    >
      <div className="space-y-8">
        
        {/* Book Summary Card */}
        <div className="bg-[#F8F7FF] border border-gray-200/80 rounded-3xl p-6 md:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row gap-6 items-start">
            
            {/* Cover Image */}
            <div className="w-28 h-40 rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 shadow-sm shrink-0">
              <img
                src={listingData.photos?.[0] || listingData.cover}
                alt={listingData.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=300';
                }}
              />
            </div>

            {/* Meta */}
            <div className="flex-1 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-[#6C4BF4] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                  {listingData.mode === 'donate' ? 'Free Donation' : listingData.mode === 'rent' ? 'Rental' : listingData.mode === 'exchange' ? 'Exchange' : 'For Sale'}
                </span>
                <span className="bg-[#EEEAFE] text-[#6C4BF4] text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                  {getConditionLabel(listingData.condition)}
                </span>
              </div>

              <h2 className="text-xl md:text-2xl font-bold text-[#17152A] font-[family-name:var(--font-heading)] leading-snug">
                {listingData.title}
              </h2>

              <p className="text-xs md:text-sm text-gray-500 font-medium">
                by {listingData.author}
              </p>

              <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 pt-2 border-t border-gray-200/70">
                <div><span className="font-semibold text-gray-700">ISBN:</span> {listingData.isbn || '9780262033848'}</div>
                <div><span className="font-semibold text-gray-700">Edition:</span> {listingData.edition || 'Standard'}</div>
                <div><span className="font-semibold text-gray-700">Publisher:</span> {listingData.publisher || 'Academic Press'}</div>
                <div><span className="font-semibold text-gray-700">Photos:</span> {listingData.photos?.length || 1} uploaded</div>
              </div>
            </div>

          </div>

          {/* Pricing & Terms Recap */}
          <div className="bg-white rounded-2xl p-5 border border-gray-200/80 flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Listing Price</span>
              <div className="flex items-baseline gap-2 mt-0.5">
                {listingData.mode === 'donate' ? (
                  <span className="text-2xl font-extrabold text-emerald-600">FREE (₹0.00)</span>
                ) : listingData.mode === 'exchange' ? (
                  <div>
                    <span className="text-base font-extrabold text-amber-600">Swap for:</span>
                    <p className="text-xs text-gray-600 font-medium">{listingData.exchangeWish}</p>
                  </div>
                ) : listingData.mode === 'rent' ? (
                  <div>
                    <span className="text-2xl font-extrabold text-[#6C4BF4]">₹{listingData.rentalPrice}</span>
                    <span className="text-xs text-gray-400">/{listingData.rentalDuration || 'semester'}</span>
                  </div>
                ) : (
                  <div>
                    <span className="text-2xl font-extrabold text-[#17152A]">₹{listingData.price}</span>
                    {listingData.mrp && (
                      <span className="text-xs text-gray-400 line-through ml-2">MRP ₹{listingData.mrp}</span>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100">
              <ShieldCheck size={16} className="text-emerald-600" />
              <span>100% Escrow Protection</span>
            </div>
          </div>

          {/* Campus Meetup */}
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <MapPin size={16} className="text-[#6C4BF4]" />
            <span>Campus Pickup Location: <strong className="text-[#17152A]">{listingData.pickupCampus || 'Main Campus Library'}</strong></span>
          </div>
        </div>

        {/* Publication Checklist */}
        <div className="space-y-2 text-xs text-gray-500">
          <div className="flex items-center gap-2 text-emerald-600 font-semibold">
            <CheckCircle2 size={16} /> All listing criteria complete and validated
          </div>
          <p className="text-[11px] text-gray-400 pl-6">
            By publishing, your book will immediately appear in the Explore marketplace and be visible to students across your campus.
          </p>
        </div>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-100">
          <button
            type="button"
            onClick={() => navigate('/sell/price')}
            className="inline-flex items-center gap-2 px-6 py-3.5 border border-gray-200 hover:bg-gray-50 text-gray-600 font-semibold rounded-xl text-sm transition cursor-pointer"
          >
            <ArrowLeft size={16} /> Back to Pricing
          </button>

          <button
            type="button"
            onClick={handlePublish}
            disabled={isPublishing}
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#6C4BF4] hover:bg-[#5B3DE0] text-white font-extrabold rounded-xl text-sm transition shadow-lg shadow-[#6C4BF4]/30 cursor-pointer"
          >
            <Send size={16} />
            {isPublishing ? 'Publishing to Campus...' : 'Publish Listing Now'}
          </button>
        </div>

      </div>
    </ListingWizardLayout>
  );
}
