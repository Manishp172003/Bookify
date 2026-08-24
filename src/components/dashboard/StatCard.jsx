import { BookOpen, IndianRupee, ShoppingBag, Wallet } from "lucide-react";

const icons = {
  books: BookOpen,
  sold: ShoppingBag,
  earned: Wallet,
  saved: IndianRupee,
};

function StatCard({ type, value, label }) {
  const Icon = icons[type];

  return (
    <div className="flex items-center justify-between rounded-xl border border-gray-100 bg-white px-5 py-4 shadow-sm">
      <div>
        <p className="text-2xl font-bold text-[#17152A]">{value}</p>
        <p className="mt-1 text-xs text-gray-500">{label}</p>
      </div>

      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F0ECFF] text-[#6C4BF4]">
        <Icon size={20} />
      </div>
    </div>
  );
}

export default StatCard;