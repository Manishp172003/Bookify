import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  Home,
  ShoppingBag,
  BookOpen,
  Repeat2,
  ArrowLeftRight,
  Heart,
  MessageCircle,
  Wallet,
  Lightbulb,
  Settings,
  LogOut,
  Globe,
} from "lucide-react";

const menuItems = [
  { label: "Browse Marketplace", icon: Globe, path: "/" },
  { label: "Overview", icon: Home, path: "/dashboard" },
  { label: "My Orders", icon: ShoppingBag, path: "/dashboard/orders" },
  { label: "My Listings", icon: BookOpen, path: "/dashboard/listings" },
  { label: "Rentals", icon: Repeat2, path: "/dashboard/rentals" },
  { label: "Exchanges", icon: ArrowLeftRight, path: "/dashboard/exchanges" },
  { label: "Wishlist", icon: Heart, path: "/dashboard/wishlist" },
  { label: "Messages", icon: MessageCircle, badge: 3, path: "/dashboard/messages" },
  { label: "Earnings", icon: Wallet, path: "/dashboard/earnings" },
  { label: "Want Board", icon: Lightbulb, path: "/dashboard/want-board" },
  { label: "Settings", icon: Settings, path: "/settings" },
];

function DashboardSidebar() {
  const location = useLocation();
  const { logout } = useAuth();

  return (
    <aside className="flex w-56 flex-col border-r border-gray-100 bg-white px-4 py-5 shrink-0 select-none">
      {/* Logo */}
      <Link to="/dashboard" className="mb-8 flex items-center gap-2 px-2 hover:opacity-90">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#6C4BF4] font-extrabold text-white">
          B
        </div>

        <span className="text-lg font-bold text-[#17152A]">
          BOOKIFY
        </span>
      </Link>

      {/* Navigation */}
      <nav className="flex-1 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.label}
              to={item.path}
              className={`relative flex items-center gap-3 rounded-lg pl-4 pr-3 py-2.5 text-sm transition cursor-pointer ${
                isActive
                  ? "bg-[#F0ECFF] font-bold text-[#6C4BF4]"
                  : "text-gray-600 hover:bg-gray-50 hover:text-[#6C4BF4]"
              }`}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.2 h-6 rounded-r bg-[#6C4BF4]" />
              )}
              <Icon size={18} />

              <span className="flex-1 text-left">
                {item.label}
              </span>

              {item.badge && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#6C4BF4] px-1 text-xs font-semibold text-white">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <Link
        to="/login"
        onClick={logout}
        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-600 transition hover:bg-red-50 hover:text-red-500 cursor-pointer"
      >
        <LogOut size={18} />
        Logout
      </Link>
    </aside>
  );
}

export default DashboardSidebar;