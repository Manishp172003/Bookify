import {
  Search,
  ShoppingCart,
  Bell,
  MessageCircle,
  Menu,
} from "lucide-react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white">
      <div className="mx-auto flex h-20 max-w-7xl items-center gap-8 px-6">

        {/* Logo */}
        <Link
          to="/"
          className="flex shrink-0 items-center gap-2"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#6C4BF4] text-lg font-bold text-white">
            B
          </div>

          <span className="text-xl font-extrabold tracking-tight text-[#17152A]">
            BOOKIFY
          </span>
        </Link>

        {/* Navigation */}
        <nav className="hidden items-center gap-6 lg:flex">
          <Link
            to="/"
            className="text-sm font-medium text-gray-600 transition hover:text-[#6C4BF4]"
          >
            Home
          </Link>

          <Link
            to="/explore"
            className="text-sm font-medium text-gray-600 transition hover:text-[#6C4BF4]"
          >
            Explore
          </Link>

          <Link
            to="/sell"
            className="text-sm font-medium text-gray-600 transition hover:text-[#6C4BF4]"
          >
            Sell
          </Link>

          <Link
            to="/rent"
            className="text-sm font-medium text-gray-600 transition hover:text-[#6C4BF4]"
          >
            Rent
          </Link>

          <Link
            to="/exchange"
            className="text-sm font-medium text-gray-600 transition hover:text-[#6C4BF4]"
          >
            Exchange
          </Link>

          <Link
            to="/want-board"
            className="text-sm font-medium text-gray-600 transition hover:text-[#6C4BF4]"
          >
            Want Board
          </Link>
        </nav>

        {/* Search */}
        <div className="ml-auto hidden max-w-sm flex-1 md:flex">
          <div className="relative w-full">
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              placeholder="Search books, authors, ISBN..."
              className="w-full rounded-xl border border-gray-200 bg-[#F8F7FF] py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-[#6C4BF4] focus:ring-4 focus:ring-[#6C4BF4]/10"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="hidden items-center gap-4 md:flex">

          <button
            type="button"
            className="relative text-gray-500 transition hover:text-[#6C4BF4]"
          >
            <ShoppingCart size={20} />

            <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#FF4F81] px-1 text-[9px] font-bold text-white">
              2
            </span>
          </button>

          <button
            type="button"
            className="relative text-gray-500 transition hover:text-[#6C4BF4]"
          >
            <Bell size={20} />

            <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-[#FF4F81]" />
          </button>

          <button
            type="button"
            className="text-gray-500 transition hover:text-[#6C4BF4]"
          >
            <MessageCircle size={20} />
          </button>

          {/* Profile */}
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border-2 border-[#E9E4FF] bg-[#F0ECFF]"
          >
            <span className="font-semibold text-[#6C4BF4]">
              M
            </span>
          </button>
        </div>

        {/* Mobile menu */}
        <button
          type="button"
          className="rounded-lg p-2 text-gray-600 hover:bg-[#F8F7FF] lg:hidden"
        >
          <Menu size={24} />
        </button>

      </div>
    </header>
  );
}

export default Navbar;