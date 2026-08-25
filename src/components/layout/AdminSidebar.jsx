import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users as UsersIcon,
  BookMarked,
  Receipt,
  AlertTriangle,
  UserCheck,
  Settings,
  LogOut,
  PenTool
} from "lucide-react";

function AdminSidebar() {
  const location = useLocation();
  const activePath = location.pathname;

  const menuItems = [
    { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
    { name: "Users", path: "/admin/users", icon: UsersIcon },
    { name: "Listings", path: "/admin/listings", icon: BookMarked },
    { name: "Orders & Escrow", path: "/admin/orders", icon: Receipt },
    { name: "Disputes", path: "/admin/disputes", icon: AlertTriangle },
    { name: "Authors", path: "/admin/authors", icon: UserCheck },
    { name: "Settings", path: "/admin/settings", icon: Settings },
  ];

  return (
    <aside className="w-64 bg-[#17152A] text-white flex flex-col h-screen sticky top-0 shrink-0">
      {/* Brand Logo */}
      <div className="p-6 border-b border-[#6B6880]/20">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#FF8A3D] text-lg font-bold text-white">
            B
          </div>
          <span className="text-xl font-extrabold tracking-tight text-white">
            BOOKIFY
          </span>
        </Link>
        <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#FF8A3D] text-white">
          Admin Panel
        </span>
      </div>

      {/* Nav Menu */}
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePath === item.path || (item.path === "/admin" && activePath === "/admin/");
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                isActive
                  ? "bg-[#FF8A3D] text-white"
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
          to="/author"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-[#6C4BF4] hover:bg-[#6C4BF4]/10 transition-colors"
        >
          <PenTool size={18} />
          <span>Switch to Author</span>
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

export default AdminSidebar;
