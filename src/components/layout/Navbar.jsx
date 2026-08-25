import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Search, BookOpen, Menu, X, User, Bell, Plus } from "lucide-react";

const navLinks = [
  { path: "/", label: "Home" },
  { path: "/explore", label: "Explore" },
  { path: "/categories", label: "Categories" },
];

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-bookify-border">
      <div className="max-w-7xl mx-auto px-4">
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
            <Link to="/explore" className="p-2 rounded-lg text-bookify-text-secondary hover:text-bookify-text hover:bg-bookify-bg transition-colors">
              <Search size={20} />
            </Link>
            <button className="relative p-2 rounded-lg text-bookify-text-secondary hover:text-bookify-text hover:bg-bookify-bg transition-colors">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-bookify-orange rounded-full" />
            </button>
            <button className="p-2 rounded-lg text-bookify-text-secondary hover:text-bookify-text hover:bg-bookify-bg transition-colors">
              <User size={20} />
            </button>
            <Link to="/explore" className="flex items-center gap-1.5 px-4 py-2 bg-bookify-orange text-white rounded-lg text-sm font-medium hover:bg-bookify-orange-dark transition-colors">
              <Plus size={16} />
              Sell a Book
            </Link>
          </div>

          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden p-2 rounded-lg text-bookify-text-secondary hover:bg-bookify-bg">
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
            <Link to="/explore" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-bookify-orange text-white rounded-lg text-sm font-medium">
              <Plus size={16} />
              Sell a Book
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
