import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useListing } from '../../context/ListingContext';
import { 
  CheckCircle2, 
  Sparkles, 
  Share2, 
  Copy, 
  Check, 
  BookOpen, 
  ArrowRight, 
  PlusCircle, 
  ShieldCheck, 
  MessageSquare 
} from 'lucide-react';

export default function PublishSuccess() {
  const navigate = useNavigate();
  const { listingData, resetListing } = useListing();
  const [copied, setCopied] = useState(false);

  const listingId = 'BKF-' + Math.floor(100000 + Math.random() * 900000);
  const shareUrl = window.location.origin + '/book/' + listingId;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleListAnother = () => {
    resetListing();
    navigate('/sell/isbn');
  };

  return (
    <div className="bg-[#F8F7FF] min-h-screen py-12">
      <div className="max-w-2xl mx-auto px-6">
        
        {/* Success Box */}
        <div className="bg-white border border-bookify-border/70 rounded-3xl p-8 md:p-12 shadow-md text-center space-y-6">
          
          {/* Animated Success Badge */}
          <div className="w-20 h-20 rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
            <CheckCircle2 size={44} strokeWidth={2.5} />
          </div>

          <div className="space-y-2">
            <span className="inline-block bg-[#EEEAFE] text-[#6C4BF4] text-xs font-extrabold uppercase tracking-wider px-3.5 py-1 rounded-full">
              ★ Listing Published Live
            </span>
            <h1 className="text-2xl md:text-3xl font-extrabold text-[#17152A] font-[family-name:var(--font-heading)]">
              Your Book is Live on Campus!
            </h1>
            <p className="text-xs md:text-sm text-gray-500 max-w-md mx-auto leading-relaxed">
              Students at your university can now find, chat with you, and reserve <strong>{listingData.title || 'your book'}</strong>.
            </p>
          </div>

          {/* Reference ID Pill */}
          <div className="bg-[#F8F7FF] border border-gray-200/80 rounded-2xl p-4 flex items-center justify-between gap-3 text-left">
            <div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Listing Reference ID</span>
              <div className="text-sm font-mono font-bold text-[#6C4BF4]">{listingId}</div>
            </div>
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-700 hover:text-[#6C4BF4] hover:border-[#6C4BF4] transition cursor-pointer shadow-2xs"
            >
              {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
              {copied ? 'Copied Link!' : 'Copy Share Link'}
            </button>
          </div>

          {/* What happens next box */}
          <div className="bg-purple-50/50 border border-purple-100 rounded-2xl p-4 text-left space-y-2 text-xs text-purple-900">
            <div className="font-bold flex items-center gap-1.5">
              <Sparkles size={14} className="text-[#6C4BF4]" /> What happens next?
            </div>
            <p className="text-purple-800/80 leading-relaxed text-[11px]">
              When an interested student messages you or requests a meetup, you will receive an instant notification in your Messages center.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row gap-3 items-center justify-center">
            <button
              onClick={() => navigate('/dashboard/listings')}
              className="w-full sm:w-auto px-6 py-3.5 bg-[#6C4BF4] hover:bg-[#5B3DE0] text-white font-bold text-sm rounded-xl transition shadow-md shadow-[#6C4BF4]/25 cursor-pointer"
            >
              Go to My Listings
            </button>

            <button
              onClick={handleListAnother}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white border border-gray-200 hover:bg-gray-50 text-[#17152A] font-bold text-sm rounded-xl transition cursor-pointer"
            >
              <PlusCircle size={16} /> List Another Book
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
