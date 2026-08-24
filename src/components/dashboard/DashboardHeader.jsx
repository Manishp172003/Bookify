import { Link } from "react-router-dom";
import { Bell, Search, ShoppingCart } from "lucide-react";

function DashboardHeader() {
  return (
    <header className="flex items-center justify-between border-b border-gray-100 bg-white px-7 py-4">
      <div>
        <h1 className="text-xl font-bold text-[#17152A]">
          Good Morning, Manish! 👋
        </h1>

        <p className="mt-1 text-xs text-gray-500">
          Here's what's happening with your account today.
        </p>
      </div>

      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="flex w-64 items-center gap-2 rounded-lg border border-gray-200 px-3 py-2">
          <Search size={16} className="text-gray-400" />

          <input
            type="text"
            placeholder="Search books, orders..."
            className="w-full bg-transparent text-xs outline-none placeholder:text-gray-400"
          />
        </div>

        {/* Cart */}
        <button
          type="button"
          className="text-gray-600 hover:text-[#6C4BF4]"
        >
          <ShoppingCart size={20} />
        </button>

        {/* Notifications */}
        <button
          type="button"
          className="relative text-gray-600 hover:text-[#6C4BF4]"
        >
          <Bell size={20} />

          <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-[#FF4F81]" />
        </button>

        {/* Profile */}
        <Link
          to="/profile"
          className="flex h-9 w-9 items-center justify-center rounded-full overflow-hidden border border-gray-150 bg-[#EDE7FF] cursor-pointer hover:opacity-90 transition"
        >
          <img
            src="/images/profile-avatar.png"
            alt="Manish Pawar avatar"
            className="h-full w-full object-cover"
          />
        </Link>
      </div>
    </header>
  );
}

export default DashboardHeader;