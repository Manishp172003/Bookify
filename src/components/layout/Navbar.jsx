import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Search, BookOpen, Menu, X, Bell, Plus } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const navLinks = [
  { path: "/", label: "Home" },
  { path: "/explore", label: "Explore" },
  { path: "/categories", label: "Categories" },
];

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-bookify-border">
      <div className="max-w-[1440px] mx-auto px-6 md:px-10">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-9 h-9 bg-bookify-purple rounded-xl flex items-center justify-center">
              <BookOpen size={20} className="text-white" />
            </div>
            <span className="font-[family-name:var(--font-heading)] font-bold text-xl text-bookify-text">
              Book<span className="text-bookify-purple">ify</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === link.path
                    ? "text-bookify-purple bg-bookify-light-purple"
                    : "text-bookify-text-secondary hover:text-bookify-text hover:bg-bookify-bg"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-2">
            {isAuthenticated ? (
              <>
                <Link to="/explore" className="p-2 rounded-lg text-bookify-text-secondary hover:text-bookify-text hover:bg-bookify-bg transition-colors">
                  <Search size={20} />
                </Link>
                <button className="relative p-2 rounded-lg text-bookify-text-secondary hover:text-bookify-text hover:bg-bookify-bg transition-colors cursor-pointer">
                  <Bell size={20} />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-bookify-orange rounded-full" />
                </button>
                <Link to="/profile" className="flex h-8 w-8 items-center justify-center rounded-full overflow-hidden border border-gray-150 bg-[#EDE7FF] cursor-pointer hover:opacity-90 transition">
                  <img
                    src={user?.avatar || "/images/profile-avatar.png"}
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                </Link>
                <Link to="/sell" className="flex items-center gap-1.5 px-4 py-2 bg-bookify-orange text-white rounded-lg text-sm font-medium hover:bg-bookify-orange-dark transition-colors cursor-pointer shadow-sm shadow-bookify-orange/10">
                  <Plus size={16} />
                  Sell a Book
                </Link>
              </>
            ) : (
              <>
                <Link to="/explore" className="p-2 rounded-lg text-bookify-text-secondary hover:text-bookify-text hover:bg-bookify-bg transition-colors mr-2">
                  <Search size={20} />
                </Link>
                <Link to="/login" className="px-4 py-2 text-sm font-bold text-gray-600 hover:text-[#6C4BF4] transition-colors">
                  Login
                </Link>
                <Link to="/register" className="px-4 py-2 bg-[#6C4BF4] text-white rounded-xl text-sm font-bold hover:bg-[#5B3DE0] shadow-md shadow-[#6C4BF4]/10 transition-all select-none">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden p-2 rounded-lg text-bookify-text-secondary hover:bg-bookify-bg cursor-pointer">
            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-bookify-border bg-white">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link key={link.path} to={link.path} onClick={() => setIsMobileMenuOpen(false)} className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${location.pathname === link.path ? "text-bookify-purple bg-bookify-light-purple" : "text-bookify-text-secondary hover:text-bookify-text hover:bg-bookify-bg"}`}>
                {link.label}
              </Link>
            ))}
            <hr className="border-bookify-border my-2" />
            {isAuthenticated ? (
              <Link to="/sell" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-bookify-orange text-white rounded-lg text-sm font-medium">
                <Plus size={16} />
                Sell a Book
              </Link>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-center px-4 py-2 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-50">
                  Login
                </Link>
                <Link to="/register" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-center px-4 py-2 bg-[#6C4BF4] text-white rounded-xl text-xs font-bold hover:bg-[#5B3DE0]">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
