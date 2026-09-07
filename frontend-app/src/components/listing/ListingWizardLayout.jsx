import React from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useListing } from '../../context/ListingContext';
import { 
  BookOpen, 
  Sparkles, 
  Camera, 
  ArrowLeftRight, 
  Tag, 
  CheckCircle2, 
  ArrowLeft, 
  ShieldCheck, 
  MapPin, 
  HelpCircle 
} from 'lucide-react';

const STEPS = [
  { id: 1, path: '/sell/isbn', label: 'Find Book', icon: BookOpen },
  { id: 2, path: '/sell/condition', label: 'Condition', icon: Sparkles },
  { id: 3, path: '/sell/photos', label: 'Photos', icon: Camera },
  { id: 4, path: '/sell/transaction', label: 'Mode', icon: ArrowLeftRight },
  { id: 5, path: '/sell/price', label: 'Pricing', icon: Tag },
  { id: 6, path: '/sell/preview', label: 'Review', icon: CheckCircle2 }
];

export default function ListingWizardLayout({ currentStep, title, subtitle, children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { listingData } = useListing();

  const getConditionLabel = (id) => {
    switch (id) {
      case 'like-new': return 'Like New';
      case 'very-good': return 'Very Good';
      case 'good': return 'Good';
      case 'fair': return 'Fair';
      default: return 'Good';
    }
  };

  const getModeBadge = (mode) => {
    switch (mode) {
      case 'rent':
        return { label: 'For Rent', color: 'bg-blue-50 text-blue-700 border-blue-200' };
      case 'exchange':
        return { label: 'Swap / Exchange', color: 'bg-amber-50 text-amber-700 border-amber-200' };
      case 'donate':
        return { label: 'Free Donation', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      default:
        return { label: 'For Sale', color: 'bg-purple-50 text-purple-700 border-purple-200' };
    }
  };

  const modeBadge = getModeBadge(listingData.mode);

  return (
    <div className="min-h-screen bg-[#F8F7FF] py-6">
      <div className="max-w-[1440px] mx-auto px-6 md:px-10">
        
        {/* Top Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <button
            type="button"
            onClick={() => navigate('/sell')}
            className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-[#6C4BF4] transition cursor-pointer"
          >
            <ArrowLeft size={16} /> Exit Listing Wizard
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-gray-500">
              Step <span className="font-bold text-[#6C4BF4]">{currentStep}</span> of 6
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span className="text-[11px] font-medium text-gray-400">Draft auto-saved</span>
          </div>
        </div>

        {/* Stepper Progress Bar */}
        <div className="bg-white border border-bookify-border/70 rounded-2xl p-3 md:p-4 mb-8 shadow-xs overflow-x-auto scrollbar-hide">
          <div className="flex items-center justify-between min-w-[620px] gap-2">
            {STEPS.map((step, idx) => {
              const StepIcon = step.icon;
              const isPassed = currentStep > step.id;
              const isCurrent = currentStep === step.id;

              return (
                <React.Fragment key={step.id}>
                  <Link
                    to={isPassed ? step.path : '#'}
                    onClick={(e) => { if (!isPassed && !isCurrent) e.preventDefault(); }}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-xl transition ${
                      isCurrent
                        ? 'bg-[#EEEAFE] text-[#6C4BF4] font-bold shadow-xs'
                        : isPassed
                        ? 'text-emerald-700 hover:bg-emerald-50 font-semibold cursor-pointer'
                        : 'text-gray-400 opacity-60 cursor-not-allowed'
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs shrink-0 ${
                        isCurrent
                          ? 'bg-[#6C4BF4] text-white'
                          : isPassed
                          ? 'bg-emerald-600 text-white'
                          : 'bg-gray-100 text-gray-400'
                      }`}
                    >
                      {isPassed ? <CheckCircle2 size={14} /> : <StepIcon size={14} />}
                    </div>
                    <span className="text-xs tracking-tight whitespace-nowrap">{step.label}</span>
                  </Link>

                  {idx < STEPS.length - 1 && (
                    <div
                      className={`h-[2px] flex-1 mx-1 rounded-full ${
                        currentStep > idx + 1 ? 'bg-emerald-500' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Active Step Form */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-6">
            <div className="bg-white border border-bookify-border/70 rounded-3xl p-6 md:p-10 shadow-xs">
              <div className="mb-6">
                <h1 className="text-2xl md:text-3xl font-extrabold text-[#17152A] font-[family-name:var(--font-heading)]">
                  {title}
                </h1>
                {subtitle && (
                  <p className="text-sm text-gray-500 mt-1.5 leading-relaxed">
                    {subtitle}
                  </p>
                )}
              </div>

              {children}
            </div>
          </div>

          {/* Right Column: Live Book Preview Card & Tips */}
          <div className="lg:col-span-5 xl:col-span-4 space-y-6 sticky top-6">
            
            {/* Live Preview Card */}
            <div className="bg-white border border-bookify-border/70 rounded-3xl p-6 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Live Listing Preview
                </span>
                <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${modeBadge.color}`}>
                  {modeBadge.label}
                </span>
              </div>

              <div className="flex gap-4">
                <div className="w-24 h-32 bg-gray-100 rounded-xl overflow-hidden shrink-0 border border-gray-200 shadow-xs relative">
                  <img
                    src={listingData.photos?.[0] || listingData.cover}
                    alt={listingData.title || 'Book Cover'}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=300';
                    }}
                  />
                  <span className="absolute bottom-1 right-1 bg-black/70 text-white text-[9px] px-1.5 py-0.5 rounded font-bold">
                    {listingData.photos?.length || 1} photo{listingData.photos?.length > 1 ? 's' : ''}
                  </span>
                </div>

                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm md:text-base font-bold text-[#17152A] line-clamp-2 leading-snug">
                      {listingData.title || 'Untitled Book'}
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5 truncate">
                      by {listingData.author || 'Author not specified'}
                    </p>
                    <div className="flex items-center gap-1.5 mt-2">
                      <span className="inline-block bg-[#EEEAFE] text-[#6C4BF4] text-[10px] font-bold px-2 py-0.5 rounded-md">
                        {getConditionLabel(listingData.condition)}
                      </span>
                      {listingData.edition && (
                        <span className="text-[10px] text-gray-400">
                          • {listingData.edition}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-gray-100 flex items-baseline justify-between">
                    <div>
                      {listingData.mode === 'donate' ? (
                        <span className="text-base font-extrabold text-emerald-600">FREE</span>
                      ) : listingData.mode === 'exchange' ? (
                        <span className="text-xs font-bold text-amber-600">Open for Swap</span>
                      ) : listingData.mode === 'rent' ? (
                        <div>
                          <span className="text-lg font-extrabold text-[#6C4BF4]">₹{listingData.rentalPrice || 199}</span>
                          <span className="text-[10px] text-gray-400">/{listingData.rentalDuration || 'semester'}</span>
                        </div>
                      ) : (
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-lg font-extrabold text-[#17152A]">₹{listingData.price || 499}</span>
                          {listingData.mrp && (
                            <span className="text-xs text-gray-400 line-through">₹{listingData.mrp}</span>
                          )}
                        </div>
                      )}
                    </div>
                    <span className="text-[10px] font-semibold text-emerald-600 flex items-center gap-1">
                      <ShieldCheck size={12} /> Escrow Protected
                    </span>
                  </div>
                </div>
              </div>

              {/* Campus Meetup Note */}
              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center gap-2 text-xs text-gray-500">
                <MapPin size={14} className="text-[#6C4BF4] shrink-0" />
                <span className="truncate">{listingData.pickupCampus || 'Campus Library / Student Center'}</span>
              </div>
            </div>

            {/* Seller Tips & Guarantee */}
            <div className="bg-white border border-bookify-border/70 rounded-3xl p-6 shadow-xs">
              <div className="flex items-center gap-2 text-sm font-bold text-[#17152A] mb-3">
                <HelpCircle size={16} className="text-[#6C4BF4]" />
                <span>Tips for Faster Sales</span>
              </div>
              <ul className="space-y-2 text-xs text-gray-500 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="text-[#6C4BF4] font-bold">•</span>
                  <span>Upload clear photos of front cover, back cover, and any marked pages.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#6C4BF4] font-bold">•</span>
                  <span>Pricing 40-50% below MRP sells within 48 hours on campus.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#6C4BF4] font-bold">•</span>
                  <span>Buyers inspect the book in person before funds are released to your wallet.</span>
                </li>
              </ul>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
