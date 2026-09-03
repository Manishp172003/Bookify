import { BookOpen, IndianRupee, ShoppingBag, Wallet } from "lucide-react";

const icons = {
  books: BookOpen,
  sold: ShoppingBag,
  earned: Wallet,
  saved: IndianRupee,
};

const colors = {
  books: { bg: "bg-purple-50", text: "text-purple-600" },
  saved: { bg: "bg-amber-50", text: "text-amber-600" },
  sold: { bg: "bg-blue-50", text: "text-blue-600" },
  earned: { bg: "bg-green-50", text: "text-green-600" },
};

function StatCard({ type, value, label }) {
  const Icon = icons[type];
  const color = colors[type] || { bg: "bg-[#F0ECFF]", text: "text-[#6C4BF4]" };

  return (
    <div className="flex items-center justify-between rounded-2xl border border-gray-100 bg-white px-5 py-4.5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer">
      <div>
        <p className="text-2xl font-extrabold text-[#17152A]">{value}</p>
        <p className="mt-1 text-xs font-semibold text-gray-400">{label}</p>
      </div>

      <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${color.bg} ${color.text}`}>
        <Icon size={20} />
      </div>
    </div>
  );
}

export default StatCard;