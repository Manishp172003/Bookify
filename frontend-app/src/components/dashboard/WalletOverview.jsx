import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IndianRupee, Wallet } from "lucide-react";
import { listingService } from "../../services/listingService";

function WalletOverview() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(() => listingService.getStats());

  useEffect(() => {
    const updateStats = () => setStats(listingService.getStats());
    window.addEventListener("bookify_user_listings_updated", updateStats);
    return () => window.removeEventListener("bookify_user_listings_updated", updateStats);
  }, []);

  const totalEarned = stats.totalEarned || 0;
  const availableBalance = totalEarned;

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-5">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-[#17152A]">Wallet Overview</h3>
        <Wallet size={16} className="text-gray-400" />
      </div>

      <p className="mt-5 text-xs text-gray-400">Available Balance</p>

      <div className="mt-1 flex items-center gap-1">
        <IndianRupee size={20} className="text-[#17152A]" />
        <span className="text-2xl font-bold text-[#17152A]">
          {availableBalance.toLocaleString()}
        </span>
      </div>

      <button
        type="button"
        onClick={() => navigate('/dashboard/earnings')}
        className="mt-5 w-full rounded-xl bg-[#6C4BF4] py-3 text-sm font-bold text-white transition hover:bg-[#5B3DE0] cursor-pointer shadow-sm hover:-translate-y-0.5 active:translate-y-0 duration-150 text-center"
      >
        Withdraw & Payouts
      </button>

      <div className="mt-5 flex justify-between border-t border-gray-100 pt-4 text-xs">
        <span className="text-gray-500">Total Earned</span>
        <span className="font-semibold text-[#17152A]">₹{totalEarned.toLocaleString()}</span>
      </div>

      <div className="mt-3 flex justify-between text-xs">
        <span className="text-gray-500">This Month</span>
        <span className="font-semibold text-[#17152A]">₹{totalEarned.toLocaleString()}</span>
      </div>
    </div>
  );
}

export default WalletOverview;