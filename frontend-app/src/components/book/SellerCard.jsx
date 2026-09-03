import { Link } from "react-router-dom";
import { MapPin, Star, Shield, Package, UserCheck } from "lucide-react";

export default function SellerCard({ seller, compact = false }) {
  if (compact) {
    return (
      <div className="flex items-center gap-3 bg-white rounded-lg border border-bookify-border p-3">
        <img
          src={seller.avatar}
          alt={seller.name}
          className="w-10 h-10 rounded-full ring-2 ring-bookify-light-purple"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="font-medium text-sm text-bookify-text truncate">
              {seller.name}
            </span>
            {seller.isVerified && (
              <Shield size={12} className="text-bookify-green flex-shrink-0" />
            )}
          </div>
          <p className="text-xs text-bookify-text-secondary truncate">
            {seller.college}
          </p>
        </div>
        <div className="flex items-center gap-0.5 text-bookify-yellow text-xs">
          <Star size={11} fill="currentColor" />
          <span className="font-medium">{seller.rating}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-bookify-border p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        <img
          src={seller.avatar}
          alt={seller.name}
          className="w-14 h-14 rounded-full ring-2 ring-bookify-light-purple"
        />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-[family-name:var(--font-heading)] font-semibold text-bookify-text">
              {seller.name}
            </h3>
            {seller.isVerified && (
              <span className="inline-flex items-center gap-1 text-xs font-medium text-bookify-green bg-bookify-green-light px-2 py-0.5 rounded-full">
                <UserCheck size={10} />
                Verified Seller
              </span>
            )}
          </div>
          <p className="text-sm text-bookify-text-secondary mt-0.5">
            {seller.college}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mt-4">
        <div className="text-center p-2 bg-bookify-bg rounded-lg">
          <div className="flex items-center justify-center gap-1 text-bookify-yellow">
            <Star size={14} fill="currentColor" />
            <span className="font-bold text-bookify-text">{seller.rating}</span>
          </div>
          <p className="text-[10px] text-bookify-text-secondary mt-0.5">Rating</p>
        </div>
        <div className="text-center p-2 bg-bookify-bg rounded-lg">
          <div className="font-bold text-bookify-text text-sm">{seller.totalSales}</div>
          <p className="text-[10px] text-bookify-text-secondary mt-0.5">Sales</p>
        </div>
        <div className="text-center p-2 bg-bookify-bg rounded-lg">
          <div className="flex items-center justify-center gap-0.5 text-bookify-text-secondary text-sm">
            <MapPin size={12} />
          </div>
          <p className="text-[10px] text-bookify-text-secondary mt-0.5 truncate">
            {seller.location}
          </p>
        </div>
      </div>

      <div className="mt-4">
        <Link 
          to={`/explore?seller=${encodeURIComponent(seller.name)}`}
          className="w-full py-2.5 border-2 border-bookify-purple text-bookify-purple hover:bg-bookify-light-purple rounded-xl font-semibold text-center text-xs transition-colors cursor-pointer flex items-center justify-center gap-1 bg-white"
        >
          View Seller's Other Listings →
        </Link>
      </div>
    </div>
  );
}
