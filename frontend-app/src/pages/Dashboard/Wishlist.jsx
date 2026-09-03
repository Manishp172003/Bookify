// React imports omitted
import DashboardSidebar from "../../components/dashboard/DashboardSidebar";
import { Heart, Bell, BellOff, MessageCircle, ShoppingCart, Trash2, ArrowLeft, Menu } from "lucide-react";
import { Link } from "react-router-dom";
import { useCommerce } from "../../context/CommerceContext";

const INITIAL_WISHLIST = [
  {
    id: 1,
    title: "Introduction to Algorithms, 3rd Edition",
    author: "Thomas H. Cormen",
    price: "₹650",
    condition: "Very Good",
    alertActive: true,
    coverClass: "from-[#111827] to-[#374151]"
  },
  {
    id: 2,
    title: "Concepts of Physics Vol 1",
    author: "H.C. Verma",
    price: "₹350",
    condition: "Good",
    alertActive: false,
    coverClass: "from-[#6C4BF4] to-[#8B3FD9]"
  },
  {
    id: 3,
    title: "Compiler Design: Principles & Tools",
    author: "Alfred V. Aho",
    price: "₹450",
    condition: "Like New",
    alertActive: false,
    coverClass: "from-[#059669] to-[#10B981]"
  }
];

export default function Wishlist() {
  const { wishlistItems: wishlist, toggleWishlist, toggleWishlistAlert } = useCommerce();

  const toggleAlert = (id) => {
    toggleWishlistAlert(id);
  };

  const handleRemove = (id) => {
    toggleWishlist({ id });
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gradient-to-br from-[#F4F2FF] via-[#F8F7FF] to-[#F0F5FF]">
      <DashboardSidebar />

      <div className="flex min-w-0 flex-1 flex-col h-full">
        <main className="flex-1 overflow-y-auto p-4 md:p-7 animate-fade-in-up">
          
          {/* Header */}
          <div className="mb-6 flex items-start gap-3 select-none">
            {/* Mobile Hamburger Menu */}
            <button
              onClick={() => window.dispatchEvent(new Event("toggle-sidebar"))}
              className="lg:hidden p-1.5 rounded-lg text-gray-500 hover:bg-gray-50 hover:text-[#6C4BF4] transition cursor-pointer mt-1"
            >
              <Menu size={20} />
            </button>

            <div>
              <h1 className="text-xl md:text-2xl font-bold text-[#17152A]">Wishlist</h1>
              <p className="mt-0.5 text-xs text-gray-400">Track listings you've saved and configure price drop notifications.</p>
            </div>
          </div>

          {/* Wishlist Items Grid */}
          {wishlist.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 rounded-2xl bg-white border border-gray-100 p-8 text-center">
              <Heart size={48} className="text-gray-300 mb-3" />
              <h3 className="font-bold text-[#17152A] text-lg">Your Wishlist is empty</h3>
              <p className="text-sm text-gray-400 mt-1 max-w-sm">Save listings from the marketplace to keep an eye on discounts and availability.</p>
              <Link
                to="/explore"
                className="inline-flex items-center gap-2 mt-5 px-5 py-2.5 bg-[#6C4BF4] hover:bg-[#5B3DE0] text-white rounded-xl text-xs font-bold transition shadow-sm"
              >
                <ArrowLeft size={14} />
                Explore Books
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {wishlist.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl bg-white border border-gray-100 p-4 shadow-sm hover:shadow-md hover:border-[#6C4BF4]/20 transition duration-300 flex gap-5 items-stretch"
                >
                  {/* Left: Book Cover */}
                  <div className="relative w-22 h-[120px] rounded-xl overflow-hidden shrink-0 border border-gray-100 shadow-xs">
                    {item.coverImage ? (
                      <img
                        src={item.coverImage}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div
                        className={`w-full h-full bg-gradient-to-br ${
                          item.coverClass || "from-[#6C4BF4] to-[#8B3FD9]"
                        } flex items-center justify-center text-[10px] font-extrabold text-white uppercase tracking-wider`}
                      >
                        {item.title.split(" ").map((w) => w[0]).join("")}
                      </div>
                    )}
                  </div>

                  {/* Right: Info & Actions Panel */}
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      {/* Top Line: Title & Action Group */}
                      <div className="flex justify-between items-start gap-2">
                        <div className="min-w-0">
                          <h3 className="font-bold text-[#17152A] text-sm md:text-base line-clamp-1 hover:text-[#6C4BF4] transition-colors leading-snug">
                            <Link to={`/book/${item.id}`}>{item.title}</Link>
                          </h3>
                          <p className="text-xs text-gray-400 mt-0.5 font-medium truncate">
                            by {item.author}
                          </p>
                        </div>

                        {/* Quick Action Circle Buttons */}
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            onClick={() => toggleAlert(item.id)}
                            className={`p-1.5 rounded-xl border transition cursor-pointer ${
                              item.alertActive
                                ? "bg-amber-50 border-amber-100 text-amber-500 hover:bg-amber-100"
                                : "bg-white border-gray-200 text-gray-400 hover:text-gray-600 hover:bg-gray-50"
                            }`}
                            title={
                              item.alertActive
                                ? "Price drop alerts active"
                                : "Enable price drop alerts"
                            }
                          >
                            {item.alertActive ? <Bell size={14} /> : <BellOff size={14} />}
                          </button>
                          <button
                            onClick={() => handleRemove(item.id)}
                            className="p-1.5 rounded-xl border border-red-100 bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-700 transition cursor-pointer"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>

                      {/* Condition & Price Row */}
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider bg-gray-50 px-2 py-0.5 rounded border border-gray-100">
                          {item.condition}
                        </span>
                        <span className="text-sm font-extrabold text-[#6C4BF4]">
                          {item.price}
                        </span>
                      </div>
                    </div>

                    {/* Bottom Line: Buy & Contact CTAs */}
                    <div className="flex gap-2 mt-3 pt-3 border-t border-gray-50">
                      <button
                        onClick={() =>
                          alert(`Redirecting to checkout for ${item.title}`)
                        }
                        className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-[#6C4BF4] hover:bg-[#5B3DE0] text-white py-2 text-xs font-bold transition cursor-pointer shadow-sm shadow-[#6C4BF4]/15"
                      >
                        <ShoppingCart size={13} />
                        Buy Now
                      </button>
                      <button
                        onClick={() => alert("Starting conversation with seller...")}
                        className="flex items-center justify-center p-2 rounded-xl border border-gray-200 bg-white text-gray-400 hover:text-gray-600 hover:bg-gray-50 cursor-pointer"
                      >
                        <MessageCircle size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
