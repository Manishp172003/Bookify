import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  PlusCircle,
  Megaphone,
  BarChart3,
  CircleDollarSign,
  User,
  LogOut,
  Shield,
  Globe,
  MessageSquare,
  Ticket,
  X
} from "lucide-react";

function AuthorSidebar({ isOpen, onClose }) {
  const location = useLocation();
  const activePath = location.pathname;

  const menuItems = [
    { name: "Dashboard", path: "/author", icon: LayoutDashboard },
    { name: "My Books", path: "/author/my-books", icon: BookOpen },
    { name: "Submit Book", path: "/author/submit-book", icon: PlusCircle },
    { name: "Campaigns", path: "/author/campaigns", icon: Megaphone },
    { name: "Coupons", path: "/author/coupons", icon: Ticket },
    { name: "Analytics", path: "/author/analytics", icon: BarChart3 },
    { name: "Earnings", path: "/author/earnings", icon: CircleDollarSign },
    { name: "Chat", path: "/author/chat", icon: MessageSquare },
    { name: "Profile", path: "/author/profile", icon: User },
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      <aside className={`w-64 bg-[#17152A] text-white flex flex-col h-screen fixed inset-y-0 left-0 z-50 lg:sticky lg:translate-x-0 transition-transform duration-355 ease-in-out ${
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      } shrink-0`}>
        {/* Brand Logo */}
        <div className="p-6 border-b border-[#6B6880]/20 flex items-center justify-between">
          <div className="flex flex-col">
            <Link to="/" className="flex items-center gap-2" onClick={onClose}>
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#6C4BF4] text-lg font-bold text-white">
                B
              </div>
              <span className="text-xl font-extrabold tracking-tight text-white">
                BOOKIFY
              </span>
            </Link>
            <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#6C4BF4] text-white self-start">
              Author Portal
            </span>
          </div>
          {/* Close button for mobile */}
          <button 
            onClick={onClose} 
            className="lg:hidden p-1.5 rounded-lg bg-[#6B6880]/15 hover:bg-[#6B6880]/30 text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav Menu */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePath === item.path || (item.path === "/author" && activePath === "/author/");
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={onClose}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-[#6C4BF4] text-white"
                    : "text-[#6B6880] hover:bg-[#6B6880]/10 hover:text-white"
                }`}
              >
                <Icon size={18} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer Controls */}
        <div className="p-4 border-t border-[#6B6880]/20 space-y-2">
          <Link
            to="/"
            onClick={onClose}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-[#6C4BF4] hover:bg-[#6C4BF4]/10 transition-colors"
          >
            <Globe size={18} />
            <span>Switch to Dashboard</span>
          </Link>
          <Link
            to="/login"
            onClick={onClose}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </Link>
        </div>
      </aside>
    </>
  );
}

export default AuthorSidebar;
