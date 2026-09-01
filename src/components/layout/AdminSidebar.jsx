import React, { useState, useEffect } from "react";
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
  PenTool,
  Globe,
  MessageSquare,
  Ticket,
  X
} from "lucide-react";

function AdminSidebar({ isOpen, onClose }) {
  const location = useLocation();
  const activePath = location.pathname;
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const handleToggle = () => setIsSidebarOpen((prev) => !prev);
    const handleClose = () => setIsSidebarOpen(false);

    window.addEventListener("toggle-sidebar", handleToggle);
    window.addEventListener("close-sidebar", handleClose);
    
    return () => {
      window.removeEventListener("toggle-sidebar", handleToggle);
      window.removeEventListener("close-sidebar", handleClose);
    };
  }, []);

  const menuItems = [
    { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
    { name: "Users", path: "/admin/users", icon: UsersIcon },
    { name: "Listings", path: "/admin/listings", icon: BookMarked },
    { name: "Orders & Escrow", path: "/admin/orders", icon: Receipt },
    { name: "Disputes", path: "/admin/disputes", icon: AlertTriangle },
    { name: "Authors", path: "/admin/authors", icon: UserCheck },
    { name: "Coupons", path: "/admin/coupons", icon: Ticket },
    { name: "Chat", path: "/admin/chat", icon: MessageSquare },
    { name: "Settings", path: "/admin/settings", icon: Settings },
  ];

  const renderSidebarContent = (onItemClick) => (
    <>
      {/* Logo */}
      <Link
        to="/admin"
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
          const isActive = activePath === item.path || (item.path === "/admin" && activePath === "/admin/");

          return (
            <Link
              key={item.name}
              to={item.path}
              onClick={onItemClick}
              className={`flex items-center gap-3.5 rounded-xl px-4 py-2.5 text-sm font-semibold transition duration-200 cursor-pointer ${
                isActive
                  ? "bg-white/15 text-white"
                  : "text-white/80 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon size={18} className={isActive ? "text-white" : "text-white/80"} />
              <span className="flex-1 text-left">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout Footer Section */}
      <div className="border-t border-white/15 pt-4 mt-4">
        <Link
          to="/"
          onClick={() => {
            if (onItemClick) onItemClick();
          }}
          className="flex items-center gap-3.5 rounded-xl px-4 py-2.5 hover:bg-white/5 transition duration-200 cursor-pointer text-white/80 hover:text-white"
        >
          <Globe size={18} className="text-white/80" />
          <span className="text-sm font-semibold">Switch to Dashboard</span>
        </Link>
        <Link
          to="/author"
          onClick={() => {
            if (onItemClick) onItemClick();
          }}
          className="flex items-center gap-3.5 rounded-xl px-4 py-2.5 hover:bg-white/5 transition duration-200 cursor-pointer text-white/80 hover:text-white"
        >
          <PenTool size={18} className="text-white/80" />
          <span className="text-sm font-semibold">Switch to Author</span>
        </Link>
        <Link
          to="/login"
          onClick={() => {
            if (onItemClick) onItemClick();
          }}
          className="flex items-center gap-3.5 rounded-xl px-4 py-2.5 hover:bg-white/5 transition duration-200 cursor-pointer text-white/80 hover:text-white"
        >
          <LogOut size={18} className="text-white/80" />
          <span className="text-sm font-semibold">Logout</span>
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
      {(isOpen || isSidebarOpen) && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-300"
            onClick={() => {
              onClose();
              setIsSidebarOpen(false);
            }}
          />

          {/* Sliding panel */}
          <aside className="relative flex w-64 h-full flex-col bg-gradient-to-b from-[#4E35C3] to-[#6C4BF4] px-4.5 py-5 text-white shadow-2xl z-10 animate-fade-in-left">
            {/* Close button inside mobile menu */}
            <div className="flex justify-end mb-2">
              <button
                onClick={() => {
                  onClose();
                  setIsSidebarOpen(false);
                }}
                className="p-1.5 rounded-xl hover:bg-white/10 text-white/80 hover:text-white transition cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>
            {renderSidebarContent(() => {
              onClose();
              setIsSidebarOpen(false);
            })}
          </aside>
        </div>
      )}
    </>
  );
}

export default AdminSidebar;
