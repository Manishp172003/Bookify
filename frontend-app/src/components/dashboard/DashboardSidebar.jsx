import { useState, useEffect } from "react";
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
  User,
  X,
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
  { label: "Profile", icon: User, path: "/profile" },
  { label: "Settings", icon: Settings, path: "/settings" },
];

function DashboardSidebar() {
  const location = useLocation();
  const { logout, user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleToggle = () => setIsOpen((prev) => !prev);
    const handleClose = () => setIsOpen(false);

    window.addEventListener("toggle-sidebar", handleToggle);
    window.addEventListener("close-sidebar", handleClose);
    
    return () => {
      window.removeEventListener("toggle-sidebar", handleToggle);
      window.removeEventListener("close-sidebar", handleClose);
    };
  }, []);

  const renderSidebarContent = (onItemClick) => (
    <>
      {/* Logo */}
      <Link
        to="/dashboard"
        onClick={onItemClick}
        className="mb-8 flex items-center gap-3 px-2.5 hover:opacity-90 transition"
      >
        <div className="flex h-8.5 w-8.5 items-center justify-center rounded-xl bg-[#3E29A1] font-extrabold text-white text-base shadow-inner">
          B
        </div>
        <span className="text-lg font-[family-name:var(--font-heading)] font-extrabold text-white tracking-wider">
          BOOKIFY
        </span>
      </Link>

      {/* Navigation */}
      <nav className="flex-grow space-y-1 overflow-y-auto pr-0.5 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.label}
              to={item.path}
              onClick={onItemClick}
              className={`flex items-center gap-3.5 rounded-xl px-4 py-2.5 text-sm font-semibold transition duration-200 cursor-pointer ${
                isActive
                  ? "bg-white/15 text-white"
                  : "text-white/80 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon size={18} className={isActive ? "text-white" : "text-white/80"} />
              <span className="flex-1 text-left">{item.label}</span>
              {item.badge && (
                <span className="flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-white px-1 text-[10px] font-extrabold text-[#6C4BF4]">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Logout Footer Section */}
      <div className="border-t border-white/15 pt-4 mt-4">
        <Link
          to="/login"
          onClick={() => {
            if (onItemClick) onItemClick();
            logout();
          }}
          className="flex items-center justify-between rounded-xl px-3.5 py-2.5 hover:bg-white/5 transition duration-200 cursor-pointer"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-9 w-9 rounded-full overflow-hidden border border-white/20 bg-[#EDE7FF] shrink-0">
              <img
                src={user?.avatar || "/images/profile-avatar.png"}
                alt="User Avatar"
                className="h-full w-full object-cover"
              />
            </div>
            <span className="text-sm font-semibold text-white truncate">Logout</span>
          </div>
          <LogOut size={18} className="text-white/70 hover:text-white shrink-0" />
        </Link>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col bg-gradient-to-b from-[#4E35C3] to-[#6C4BF4] px-4.5 py-5 shrink-0 select-none text-white shadow-lg">
        {renderSidebarContent()}
      </aside>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-300"
            onClick={() => setIsOpen(false)}
          />

          {/* Sliding panel */}
          <aside className="relative flex w-64 h-full flex-col bg-gradient-to-b from-[#4E35C3] to-[#6C4BF4] px-4.5 py-5 text-white shadow-2xl z-10 animate-fade-in-left">
            {/* Close button inside mobile menu */}
            <div className="flex justify-end mb-2">
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-xl hover:bg-white/10 text-white/80 hover:text-white transition cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>
            {renderSidebarContent(() => setIsOpen(false))}
          </aside>
        </div>
      )}
    </>
  );
}

export default DashboardSidebar;