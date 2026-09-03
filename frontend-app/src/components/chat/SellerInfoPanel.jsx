import { ShieldCheck, Star, Clock, MapPin, Building2, Lock, Sparkles, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

function SellerInfoPanel({ seller, book, onClose }) {
  if (!seller) return null;

  return (
    <div className="flex h-full flex-col overflow-y-auto bg-white p-5 text-[#17152A]">
      {/* Seller Header */}
      <div className="flex flex-col items-center text-center pb-5 border-b border-gray-100">
        <div className="relative mb-3">
          <div className="h-20 w-20 overflow-hidden rounded-full border-2 border-[#E9E4FF] bg-gray-100 shadow-md">
            {seller.avatar ? (
              <img src={seller.avatar} alt={seller.name} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center font-bold text-2xl text-[#6C4BF4] bg-[#F0ECFF]">
                {seller.name?.charAt(0)}
              </div>
            )}
          </div>
          {seller.verified && (
            <span
              title="Verified Student Seller"
              className="absolute bottom-0 right-0 flex h-6 w-6 items-center justify-center rounded-full bg-[#6C4BF4] text-white shadow-sm ring-2 ring-white"
            >
              <ShieldCheck size={14} />
            </span>
          )}
        </div>

        <h3 className="text-base font-extrabold text-[#17152A]">{seller.name}</h3>
        <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
          <Building2 size={12} className="text-[#6C4BF4]" /> {seller.college || "Campus Seller"}
        </p>

        {/* Badges row */}
        <div className="mt-3 flex items-center justify-center gap-3">
          <div className="flex items-center gap-1 rounded-lg bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700">
            <Star size={13} className="fill-amber-400 text-amber-400" />
            {seller.rating || "4.8"}
            <span className="font-normal text-amber-600/80">({seller.reviewsCount || 20})</span>
          </div>

          <div className="flex items-center gap-1 rounded-lg bg-[#F0ECFF] px-2.5 py-1 text-xs font-bold text-[#6C4BF4]">
            <Clock size={13} />
            {seller.responseTime || "< 15m"}
          </div>
        </div>
      </div>

      {/* Seller Highlights */}
      <div className="py-4 border-b border-gray-100 space-y-2.5 text-xs text-gray-600">
        <div className="flex items-center justify-between">
          <span className="text-gray-400">Member Since:</span>
          <span className="font-semibold text-[#17152A]">{seller.memberSince || "Aug 2023"}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-400">Total Books Sold:</span>
          <span className="font-semibold text-emerald-600">{seller.totalSales || 15}+ books</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-400">Location:</span>
          <span className="font-semibold text-[#17152A] flex items-center gap-1 truncate max-w-[150px]">
            <MapPin size={11} className="text-gray-400" /> {seller.location || "Delhi, India"}
          </span>
        </div>
      </div>

      {/* Associated Book Summary Card */}
      {book && (
        <div className="py-4 border-b border-gray-100">
          <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2.5">
            Book Discussed
          </p>
          <div className="flex gap-3 rounded-2xl border border-gray-100 bg-[#F8F7FF] p-3">
            <div className="h-16 w-12 shrink-0 overflow-hidden rounded-lg bg-gray-200">
              <img src={book.image} alt={book.title} className="h-full w-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold text-[#17152A] truncate">{book.title}</h4>
              <p className="text-[11px] text-gray-500 truncate">{book.author}</p>
              <div className="mt-1 flex items-center gap-2">
                <span className="text-xs font-black text-[#6C4BF4]">₹{book.price}</span>
                <span className="text-[10px] text-gray-400 line-through">₹{book.originalPrice}</span>
                <span className="rounded bg-emerald-100 px-1 py-0.2 text-[9px] font-bold text-emerald-700">
                  {book.condition}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Escrow Guarantee Notice */}
      <div className="mt-4 rounded-2xl bg-gradient-to-br from-[#F0ECFF] to-[#E9E4FF] p-4 text-xs">
        <div className="flex items-center gap-2 font-bold text-[#6C4BF4] mb-1.5">
          <Lock size={15} /> Bookify Escrow Guarantee
        </div>
        <p className="text-gray-600 leading-relaxed">
          Never pay sellers directly via UPI or cash. Your payment is held safely until you receive & inspect the book.
        </p>
        <div className="mt-3 flex items-center gap-1 text-[11px] font-bold text-[#6C4BF4]">
          <CheckCircle2 size={13} /> 100% Protected Transaction
        </div>
      </div>
    </div>
  );
}

export default SellerInfoPanel;
