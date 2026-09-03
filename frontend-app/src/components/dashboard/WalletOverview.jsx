import { IndianRupee } from "lucide-react";

function WalletOverview() {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-5">
      <h3 className="font-semibold text-[#17152A]">
        Wallet Overview
      </h3>

      <p className="mt-5 text-xs text-gray-400">
        Available Balance
      </p>

      <div className="mt-1 flex items-center gap-1">
        <IndianRupee size={20} />
        <span className="text-2xl font-bold text-[#17152A]">
          1,850
        </span>
      </div>

      <button
        type="button"
        className="mt-5 w-full rounded-xl bg-[#6C4BF4] py-3 text-sm font-bold text-white transition hover:bg-[#5B3DE0] cursor-pointer shadow-sm hover:-translate-y-0.5 active:translate-y-0 duration-150"
      >
        Withdraw
      </button>

      <div className="mt-5 flex justify-between border-t pt-4 text-xs">
        <span className="text-gray-500">Total Earned</span>
        <span className="font-semibold">₹2,450</span>
      </div>

      <div className="mt-3 flex justify-between text-xs">
        <span className="text-gray-500">This Month</span>
        <span className="font-semibold">₹850</span>
      </div>
    </div>
  );
}

export default WalletOverview;