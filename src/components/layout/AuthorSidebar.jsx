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
  Shield
} from "lucide-react";

function AuthorSidebar() {
  const location = useLocation();
  const activePath = location.pathname;

  const menuItems = [
    { name: "Dashboard", path: "/author", icon: LayoutDashboard },
    { name: "My Books", path: "/author/my-books", icon: BookOpen },
    { name: "Submit Book", path: "/author/submit-book", icon: PlusCircle },
    { name: "Campaigns", path: "/author/campaigns", icon: Megaphone },
    { name: "Analytics", path: "/author/analytics", icon: BarChart3 },
    { name: "Earnings", path: "/author/earnings", icon: CircleDollarSign },
    { name: "Profile", path: "/author/profile", icon: User },
  ];

  return (
    <aside className="w-64 bg-[#17152A] text-white flex flex-col h-screen sticky top-0 shrink-0">
      {/* Brand Logo */}
      <div className="p-6 border-b border-[#6B6880]/20">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#6C4BF4] text-lg font-bold text-white">
            B
          </div>
          <span className="text-xl font-extrabold tracking-tight text-white">
            BOOKIFY
          </span>
        </Link>
        <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#6C4BF4] text-white">
          Author Portal
        </span>
      </div>

      {/* Nav Menu */}
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePath === item.path || (item.path === "/author" && activePath === "/author/");
          return (
            <Link
              key={item.name}
              to={item.path}
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
          to="/admin"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-[#FF8A3D] hover:bg-[#FF8A3D]/10 transition-colors"
        >
          <Shield size={18} />
          <span>Switch to Admin</span>
        </Link>
        <Link
          to="/login"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </Link>
      </div>
    </aside>
  );
}

export default AuthorSidebar;
