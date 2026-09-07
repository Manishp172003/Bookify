import React from 'react';
import { useNavigate } from 'react-router-dom';
import ListingWizardLayout from '../../components/listing/ListingWizardLayout';
import { useListing } from '../../context/ListingContext';
import { IndianRupee, Tag, ShieldCheck, MapPin, Sparkles, ArrowRight, ArrowLeft, Clock, Repeat, HeartHandshake } from 'lucide-react';

export default function SetPrice() {
  const navigate = useNavigate();
  const { listingData, updateListingData } = useListing();

  const mode = listingData.mode || 'sell';
  const mrp = listingData.mrp || 1200;
  const price = listingData.price || 499;

  const discountPercent = mrp > 0 ? Math.round(((mrp - price) / mrp) * 100) : 0;
  const sellerPayout = price; // 0% commission on campus peer-to-peer

  return (
    <ListingWizardLayout
      currentStep={5}
      title={
        mode === 'rent'
          ? 'Set Rental Terms'
          : mode === 'exchange'
          ? 'Set Book Exchange Preferences'
          : mode === 'donate'
          ? 'Free Donation Details'
          : 'Set Your Selling Price'
      }
      subtitle="Fair pricing ensures your book gets reserved within 24-48 hours on your campus."
    >
      <div className="space-y-8">
        
        {/* Mode-Specific Pricing Inputs */}
        {mode === 'sell' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                  Your Selling Price (₹) *
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    value={listingData.price}
                    onChange={(e) => updateListingData({ price: Number(e.target.value) })}
                    className="w-full pl-10 pr-4 py-3.5 rounded-2xl border border-gray-200 bg-[#F8F7FF] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6C4BF4]/20 focus:border-[#6C4BF4] text-lg font-bold text-[#17152A]"
                  />
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-gray-400">₹</span>
                </div>
                <p className="text-[11px] text-gray-400 mt-1">
                  Original Retail Price (MRP): <span className="font-semibold text-gray-600">₹{mrp}</span>
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                  Buyer Discount
                </label>
                <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center justify-between">
                  <div>
                    <span className="text-sm font-extrabold text-emerald-800">{discountPercent}% OFF MRP</span>
                    <p className="text-[10px] text-emerald-600 mt-0.5">Recommended: 35% - 60% off for fast sale</p>
                  </div>
                  <Sparkles size={20} className="text-emerald-600" />
                </div>
              </div>
            </div>

            {/* Seller Payout Breakdown */}
            <div className="bg-[#F8F7FF] border border-gray-200/80 rounded-2xl p-5 space-y-3">
              <h4 className="font-bold text-xs text-gray-500 uppercase tracking-wider">
                Payout Breakdown
              </h4>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-gray-600">
                  <span>Selling Price</span>
                  <span className="font-semibold text-[#17152A]">₹{price}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Bookify Campus Fee (0%)</span>
                  <span className="font-semibold text-emerald-600">FREE</span>
                </div>
                <div className="pt-2 border-t border-gray-200 flex justify-between text-sm font-bold text-[#17152A]">
                  <span>Your Net Payout</span>
                  <span className="text-base text-[#6C4BF4]">₹{sellerPayout}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {mode === 'rent' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                  Rental Fee (₹) *
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    value={listingData.rentalPrice || 199}
                    onChange={(e) => updateListingData({ rentalPrice: Number(e.target.value) })}
                    className="w-full pl-10 pr-4 py-3.5 rounded-2xl border border-gray-200 bg-[#F8F7FF] focus:bg-white focus:outline-none focus:border-[#6C4BF4] text-lg font-bold text-[#17152A]"
                  />
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-gray-400">₹</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                  Rental Duration
                </label>
                <select
                  value={listingData.rentalDuration || 'semester'}
                  onChange={(e) => updateListingData({ rentalDuration: e.target.value })}
                  className="w-full px-4 py-3.5 rounded-2xl border border-gray-200 bg-[#F8F7FF] focus:bg-white focus:outline-none focus:border-[#6C4BF4] text-sm font-semibold text-[#17152A]"
                >
                  <option value="1 month">1 Month (Exam Sprint)</option>
                  <option value="3 months">3 Months (Mid-term)</option>
                  <option value="semester">Full Semester (6 Months)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {mode === 'exchange' && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                Books / Subjects You Want in Return *
              </label>
              <textarea
                rows={3}
                value={listingData.exchangeWish || ''}
                onChange={(e) => updateListingData({ exchangeWish: e.target.value })}
                placeholder="e.g. Operating Systems by Galvin (9th/10th Ed) or Compiler Design or Any 4th Sem CSE Core book"
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-[#F8F7FF] focus:bg-white focus:outline-none focus:border-[#6C4BF4] text-sm text-[#17152A]"
              />
            </div>
          </div>
        )}

        {mode === 'donate' && (
          <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-start gap-4">
            <HeartHandshake size={28} className="text-emerald-600 shrink-0 mt-1" />
            <div>
              <h4 className="font-bold text-sm text-emerald-900">Thank You for Gifting Knowledge!</h4>
              <p className="text-xs text-emerald-700 mt-1 leading-relaxed">
                This listing will be marked as ₹0.00 (Free). Interested students on campus can chat with you to arrange a quick handover.
              </p>
            </div>
          </div>
        )}

        {/* Campus Pickup Location */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">
            Preferred Campus Meetup Spot
          </label>
          <div className="relative">
            <input
              type="text"
              value={listingData.pickupCampus || ''}
              onChange={(e) => updateListingData({ pickupCampus: e.target.value })}
              placeholder="e.g. Central Library Gate 1 / Canteen / Academic Block B"
              className="w-full pl-10 pr-4 py-3 rounded-2xl border border-gray-200 bg-[#F8F7FF] focus:bg-white focus:outline-none focus:border-[#6C4BF4] text-sm text-[#17152A]"
            />
            <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6C4BF4]" size={16} />
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-100">
          <button
            type="button"
            onClick={() => navigate('/sell/transaction')}
            className="inline-flex items-center gap-2 px-6 py-3.5 border border-gray-200 hover:bg-gray-50 text-gray-600 font-semibold rounded-xl text-sm transition cursor-pointer"
          >
            <ArrowLeft size={16} /> Back
          </button>

          <button
            type="button"
            onClick={() => navigate('/sell/preview')}
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#6C4BF4] hover:bg-[#5B3DE0] text-white font-bold rounded-xl text-sm transition shadow-md shadow-[#6C4BF4]/25 cursor-pointer"
          >
            Review & Publish <ArrowRight size={16} />
          </button>
        </div>

      </div>
    </ListingWizardLayout>
  );
}
