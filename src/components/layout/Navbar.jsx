import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Search, Menu, X, Heart, MessageSquare, ShoppingCart } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useCommerce } from "../../context/CommerceContext";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { cartCount } = useCommerce();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/explore?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate("/explore");
    }
  };

  const centerLinks = [
    { path: "/", label: "Home" },
    { path: "/explore", label: "Explore" },
    { path: "/sell", label: "Sell" },
    { path: "/explore?type=rent", label: "Rent" },
    { path: "/explore?type=exchange", label: "Exchange" },
    { path: "/dashboard/want-board", label: "Want Board" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#E7E4F2] shadow-xs">
      <div className="max-w-[1440px] mx-auto px-6 md:px-10">
        <div className="flex items-center justify-between h-16.5 gap-4">
          
          {/* Left: Bookify Logo */}
          <Link to="/" className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-8.5 h-8.5 bg-gradient-to-tr from-[#6C4BF4] to-[#8B6FF5] rounded-xl flex items-center justify-center font-bold text-white text-base shadow-sm">
              B
            </div>
            <span className="font-[family-name:var(--font-heading)] font-extrabold text-lg text-[#17152A] tracking-wider">
              BOOK<span className="text-[#6C4BF4]">IFY</span>
            </span>
          </Link>

          {/* Center Navigation Links (Hidden on Mobile) */}
          <div className="hidden lg:flex items-center gap-1">
            {centerLinks.map((link) => {
              const isActive = location.pathname + location.search === link.path;
              return (
                <Link
                  key={link.label}
                  to={link.path}
                  className={`relative px-3.5 py-2 text-sm font-semibold transition-all duration-200 group ${
                    isActive
                      ? "text-[#6C4BF4]"
                      : "text-gray-500 hover:text-[#6C4BF4]"
                  }`}
                >
                  {link.label}
                  <span
                    className={`absolute bottom-0 left-3.5 right-3.5 h-[3px] bg-[#6C4BF4] rounded-full transition-all duration-300 transform origin-center ${
                      isActive
                        ? "scale-x-100 opacity-100"
                        : "scale-x-0 opacity-0 group-hover:scale-x-100 group-hover:opacity-100"
                    }`}
                  />
                </Link>
              );
            })}
          </div>

          {/* Center-Right: Search Input Box */}
          <form 
            onSubmit={handleSearchSubmit} 
            className="hidden md:flex items-center flex-1 max-w-sm relative animate-fade-in"
          >
            <input
              type="text"
              placeholder="Search books, authors, ISBN..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#6C4BF4]/5 hover:bg-[#6C4BF4]/10 focus:bg-white focus:ring-4 focus:ring-[#6C4BF4]/10 border border-[#E7E4F2] focus:border-[#6C4BF4] rounded-xl py-2 pl-4 pr-10 text-xs font-semibold text-[#17152A] outline-none transition-all duration-200"
            />
            <button 
              type="submit" 
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#6C4BF4] cursor-pointer transition-colors"
            >
              <Search size={14} />
            </button>
          </form>

          {/* Right Controls (Guest vs. Logged In) */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                {/* Wishlist Heart Icon */}
                <Link 
                  to="/dashboard/wishlist" 
                  className={`p-2.5 rounded-xl border border-gray-150 text-gray-400 hover:text-red-500 hover:bg-red-50 hover:border-red-100 transition duration-200 cursor-pointer ${
                    location.pathname === "/dashboard/wishlist" ? "bg-red-50 text-red-500 border-red-100" : "bg-white"
                  }`}
                  title="My Wishlist"
                >
                  <Heart size={15} />
                </Link>

                {/* Messages Chat Icon */}
                <Link 
                  to="/dashboard/messages" 
                  className={`p-2.5 rounded-xl border border-gray-150 text-gray-400 hover:text-[#6C4BF4] hover:bg-purple-50 hover:border-purple-100 transition duration-200 cursor-pointer ${
                    location.pathname === "/dashboard/messages" ? "bg-[#EEEAFE] text-[#6C4BF4] border-purple-100" : "bg-white"
                  }`}
                  title="My Messages"
                >
                  <MessageSquare size={15} />
                </Link>

                {/* Cart Icon */}
                <Link 
                  to="/cart" 
                  className={`p-2.5 rounded-xl border border-gray-150 text-gray-400 hover:text-[#6C4BF4] hover:bg-purple-50 hover:border-purple-100 transition duration-200 cursor-pointer relative ${
                    location.pathname === "/cart" ? "bg-[#EEEAFE] text-[#6C4BF4] border-purple-100" : "bg-white"
                  }`}
                  title="My Cart"
                >
                  <ShoppingCart size={15} />
                  {cartCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-[#FF4F81] text-white text-[9px] font-bold h-4 w-4 rounded-full flex items-center justify-center border border-white">
                      {cartCount}
                    </span>
                  )}
                </Link>



                {/* User Avatar */}
                <Link 
                  to="/profile" 
                  className="flex h-9.5 w-9.5 items-center justify-center rounded-full overflow-hidden border border-gray-150 bg-[#EDE7FF] cursor-pointer hover:ring-2 hover:ring-[#6C4BF4]/30 hover:opacity-90 transition shrink-0 ml-1"
                >
                  <img
                    src={user?.avatar || "/images/profile-avatar.png"}
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                </Link>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="px-4 py-2 text-sm font-semibold text-gray-500 hover:text-[#6C4BF4] transition-colors"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="px-4 py-2 bg-[#6C4BF4] text-white rounded-xl text-sm font-semibold hover:bg-[#5B3DE0] shadow-sm shadow-[#6C4BF4]/15 transition-all select-none"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
            className="lg:hidden p-2.5 rounded-xl border border-gray-100 bg-white text-gray-500 hover:bg-gray-55 cursor-pointer"
          >
            {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>

        </div>
      </div>

      {/* Mobile Dropdown Panel */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white py-4 px-6 space-y-4 shadow-sm animate-fade-in">
          
          {/* Mobile Search */}
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <input
              type="text"
              placeholder="Search books, authors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#6C4BF4]/5 border border-[#E7E4F2] rounded-xl py-2.5 pl-4 pr-10 text-xs font-semibold text-[#17152A] outline-none"
            />
            <button type="submit" className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400">
              <Search size={14} />
            </button>
          </form>

          {/* Mobile Navigation Links */}
          <div className="flex flex-col gap-1">
            {centerLinks.map((link) => {
              const isActive = location.pathname + location.search === link.path;
              return (
                <Link
                  key={link.label}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? "text-[#6C4BF4] bg-[#EEEAFE]"
                      : "text-gray-500 hover:text-[#6C4BF4] hover:bg-gray-50"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          <hr className="border-gray-100" />

          {/* Mobile User Controls */}
          {isAuthenticated ? (
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <Link 
                  to="/dashboard/wishlist" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2.5 rounded-xl border border-gray-100 text-gray-500 hover:text-red-500 hover:bg-red-50"
                >
                  <Heart size={14} />
                </Link>
                <Link 
                  to="/dashboard/messages" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2.5 rounded-xl border border-gray-100 text-gray-500 hover:text-[#6C4BF4] hover:bg-purple-50"
                >
                  <MessageSquare size={14} />
                </Link>
                <Link 
                  to="/cart" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2.5 rounded-xl border border-gray-100 text-gray-500 hover:text-[#6C4BF4] hover:bg-purple-50 relative"
                >
                  <ShoppingCart size={14} />
                  {cartCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-[#FF4F81] text-white text-[9px] font-bold h-4 w-4 rounded-full flex items-center justify-center border border-white">
                      {cartCount}
                    </span>
                  )}
                </Link>
              </div>

              <Link 
                to="/profile" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2"
              >
                <span className="text-xs font-bold text-[#17152A]">{user?.name || "My Profile"}</span>
                <div className="h-8 w-8 rounded-full overflow-hidden border border-gray-100 bg-[#EDE7FF]">
                  <img src={user?.avatar || "/images/profile-avatar.png"} alt="Avatar" className="h-full w-full object-cover" />
                </div>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2 pt-1">
              <Link 
                to="/login" 
                onClick={() => setIsMobileMenuOpen(false)} 
                className="flex items-center justify-center px-4 py-2 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-55"
              >
                Login
              </Link>
              <Link 
                to="/register" 
                onClick={() => setIsMobileMenuOpen(false)} 
                className="flex items-center justify-center px-4 py-2 bg-[#6C4BF4] text-white rounded-xl text-sm font-semibold hover:bg-[#5B3DE0]"
              >
                Sign Up
              </Link>
            </div>
          )}

        </div>
      )}
    </nav>
  );
}
