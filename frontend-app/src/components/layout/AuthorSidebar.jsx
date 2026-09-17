import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
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
  const navigate = useNavigate();
  const { user, logout, hasStudentProfile } = useAuth();
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

  const renderSidebarContent = (onItemClick) => (
    <>
      {/* Logo */}
      <Link
        to="/author"
        onClick={onItemClick}
        className="mb-6 flex items-center gap-3 px-2.5 hover:opacity-90 transition"
      >
        <div className="flex h-8.5 w-8.5 items-center justify-center rounded-xl bg-[#3E29A1] font-extrabold text-white text-base shadow-inner">
          B
        </div>
        <span className="text-lg font-[family-name:var(--font-heading)] font-extrabold text-white tracking-wider">
          BOOKIFY
        </span>
      </Link>

      {/* Author Mini Profile Card */}
      <Link
        to="/author/profile"
        onClick={onItemClick}
        className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 transition duration-200 mb-5 border border-white/10"
      >
        <div className="h-9 w-9 rounded-full overflow-hidden bg-white/20 flex items-center justify-center text-white font-bold text-xs shrink-0 border border-white/30">
          {user?.authorAvatar || user?.avatar ? (
            <img
              src={user.authorAvatar || user.avatar}
              alt={user?.penName || user?.fullName || "Author"}
              className="h-full w-full object-cover"
            />
          ) : (
            <span>
              {(user?.penName || user?.fullName || "AU")
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()}
            </span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold text-white truncate">
            {user?.penName || user?.fullName || "Author"}
          </p>
          <p className="text-[10px] text-white/70 truncate">
            {user?.publisherImprint || "Author Studio"}
          </p>
        </div>
      </Link>

      {/* Navigation */}
      <nav className="flex-grow space-y-1 overflow-y-auto pr-0.5 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePath === item.path || (item.path === "/author" && activePath === "/author/");

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
      <div className="border-t border-white/15 pt-4 mt-4 space-y-1">
        {/* Student Marketplace Switcher (Only visible if author also has an active student profile) */}
        {hasStudentProfile && (
          <Link
            to="/dashboard"
            onClick={() => {
              if (onItemClick) onItemClick();
            }}
            className="flex items-center gap-3.5 rounded-xl px-4 py-2.5 bg-white/10 text-[#FFD166] border border-white/20 hover:bg-white/20 transition duration-200 cursor-pointer text-sm font-semibold"
            title="Switch to Student / Reader Marketplace"
          >
            <Globe size={18} className="text-[#FFD166]" />
            <span>Student Marketplace 🎓</span>
          </Link>
        )}
        <button
          type="button"
          onClick={() => {
            if (onItemClick) onItemClick();
            if (logout) logout();
            navigate("/author/login");
          }}
          className="w-full flex items-center gap-3.5 rounded-xl px-4 py-2.5 hover:bg-white/5 transition duration-200 cursor-pointer text-white/80 hover:text-white text-left"
        >
          <LogOut size={18} className="text-white/80" />
          <span className="text-sm font-semibold">Sign Out</span>
        </button>
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

export default AuthorSidebar;
