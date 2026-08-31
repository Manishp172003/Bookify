import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Bell,
  Search,
  ShoppingCart,
  MessageSquare,
  MapPin,
  Tag,
  CheckCircle2,
  Menu,
} from "lucide-react";
import { useCommerce } from "../../context/CommerceContext";

const INITIAL_NOTIFICATIONS = [
  {
    id: 1,
    type: "message",
    text: "Sneha Reddy sent you a message: 'Is the price negotiable?'",
    time: "5m ago",
    unread: true,
    link: "/dashboard/messages",
  },
  {
    id: 2,
    type: "meetup",
    text: "Meetup scheduled for 'Concepts of Physics' today at 4:00 PM.",
    time: "2h ago",
    unread: true,
    link: "/dashboard/orders",
  },
  {
    id: 3,
    type: "price_drop",
    text: "Price dropped! 'Introduction to Algorithms' in your wishlist is now ₹650.",
    time: "1d ago",
    unread: false,
    link: "/dashboard/wishlist",
  },
  {
    id: 4,
    type: "system",
    text: "Your listing for 'Compiler Design' has been successfully published.",
    time: "2d ago",
    unread: false,
    link: "/dashboard/listings",
  },
];

function DashboardHeader() {
  const { cartCount } = useCommerce();
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const hasUnread = notifications.some((n) => n.unread);

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const toggleReadStatus = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n))
    );
    setShowNotifications(false);
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "message":
        return (
          <div className="w-8 h-8 rounded-full bg-[#EEEAFE] text-[#6C4BF4] flex items-center justify-center shrink-0">
            <MessageSquare size={14} />
          </div>
        );
      case "meetup":
        return (
          <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
            <MapPin size={14} />
          </div>
        );
      case "price_drop":
        return (
          <div className="w-8 h-8 rounded-full bg-green-50 text-green-600 flex items-center justify-center shrink-0">
            <Tag size={14} />
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <CheckCircle2 size={14} />
          </div>
        );
    }
  };
  return (
    <header className="flex items-center justify-between border-b border-gray-100 bg-white px-4 py-3 md:px-7 md:py-4 select-none">
      <div className="flex items-center gap-3">
        {/* Mobile Hamburger menu */}
        <button
          onClick={() => window.dispatchEvent(new Event("toggle-sidebar"))}
          className="lg:hidden p-1.5 rounded-lg text-gray-500 hover:bg-gray-50 hover:text-[#6C4BF4] transition cursor-pointer"
        >
          <Menu size={20} />
        </button>

        <div className="min-w-0">
          <h1 className="text-sm md:text-xl font-bold text-[#17152A] leading-tight truncate">
            Good Morning, Manish! 👋
          </h1>
          <p className="mt-0.5 text-[10px] md:text-xs text-gray-400 hidden md:block">
            Here's what's happening with your account today.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 md:gap-4 shrink-0">
        {/* Search */}
        <div className="hidden md:flex w-64 items-center gap-2 rounded-xl border border-gray-255 px-3 py-2 bg-gray-50/50">
          <Search size={15} className="text-gray-400" />
          <input
            type="text"
            placeholder="Search books, orders..."
            className="w-full bg-transparent text-xs outline-none placeholder:text-gray-400"
          />
        </div>

        {/* Cart */}
        <Link
          to="/cart"
          className="relative text-gray-600 hover:text-[#6C4BF4] transition"
          title="My Cart"
        >
          <ShoppingCart size={20} />
          {cartCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-[#FF4F81] text-white text-[9px] font-bold h-4.5 w-4.5 rounded-full flex items-center justify-center border border-white">
              {cartCount}
            </span>
          )}
        </Link>

        {/* Notifications */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative text-gray-600 hover:text-[#6C4BF4] cursor-pointer mt-1"
          >
            <Bell size={20} />
            {hasUnread && (
              <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-[#FF4F81]" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-full mt-3 w-80 bg-white border border-gray-150 rounded-2xl shadow-xl shadow-[#6C4BF4]/4 z-50 overflow-hidden animate-fade-in-up">
              {/* Dropdown Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50/50">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Notifications
                </span>
                {hasUnread && (
                  <button
                    onClick={markAllAsRead}
                    className="text-[10px] font-bold text-[#6C4BF4] hover:text-[#5B3DE0] cursor-pointer"
                  >
                    Mark all as read
                  </button>
                )}
              </div>

              {/* List */}
              <div className="max-h-80 overflow-y-auto divide-y divide-gray-50">
                {notifications.map((item) => (
                  <Link
                    key={item.id}
                    to={item.link}
                    onClick={() => toggleReadStatus(item.id)}
                    className={`flex gap-3 p-3.5 hover:bg-gray-50/60 transition-colors ${
                      item.unread ? "bg-[#6C4BF4]/3" : ""
                    }`}
                  >
                    {getNotificationIcon(item.type)}
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs text-gray-700 leading-snug line-clamp-2 ${item.unread ? "font-semibold text-gray-900" : "text-gray-500"}`}>
                        {item.text}
                      </p>
                      <span className="text-[10px] text-gray-400 mt-1 block">
                        {item.time}
                      </span>
                    </div>
                    {item.unread && (
                      <span className="h-1.5 w-1.5 bg-[#6C4BF4] rounded-full mt-1.5 shrink-0" />
                    )}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Profile */}
        <Link
          to="/profile"
          className="flex h-9 w-9 items-center justify-center rounded-full overflow-hidden border border-gray-150 bg-[#EDE7FF] cursor-pointer hover:opacity-90 transition"
        >
          <img
            src="/images/profile-avatar.png"
            alt="Manish Pawar avatar"
            className="h-full w-full object-cover"
          />
        </Link>
      </div>
    </header>
  );
}

export default DashboardHeader;