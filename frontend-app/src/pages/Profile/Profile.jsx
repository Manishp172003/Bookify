import { Link } from "react-router-dom";
import DashboardSidebar from "../../components/dashboard/DashboardSidebar";
import ProfileHeader from "../../components/profile/ProfileHeader";
import ProfileStats from "../../components/profile/ProfileStats";
import AboutMe from "../../components/profile/AboutMe";
import { Menu, Heart, ArrowRight } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useCommerce } from "../../context/CommerceContext";

function ProfileWidgets() {
  const { wishlistItems } = useCommerce();
  const { user } = useAuth();

  const hasEmail = Boolean(user?.email);
  const hasStudentId = Boolean(user?.studentId || user?.isStudentVerified || user?.role === "student");
  const hasPhone = Boolean(user?.phone && user?.phone !== "Not provided" && user?.phone.length >= 7);
  const hasBank = Boolean(user?.payment?.accountNumber || user?.payment?.upiId);

  const steps = [
    { label: "Verify Email", done: hasEmail },
    { label: "Verify Student ID", done: hasStudentId },
    { label: "Add Mobile Number", done: hasPhone },
    { label: "Link Bank Account (for payouts)", done: hasBank },
  ];

  const completedCount = steps.filter((s) => s.done).length;
  const completionPercentage = Math.round((completedCount / steps.length) * 100);

  return (
    <div className="space-y-6">
      {/* Account Status Widget */}
      <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
        <h3 className="font-bold text-[#17152A] text-sm">Account Status</h3>
        
        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex justify-between text-xs font-semibold text-gray-500 mb-1.5">
            <span>Profile Completion</span>
            <span className="text-[#6C4BF4] font-bold">{completionPercentage}%</span>
          </div>
          <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-[#6C4BF4] rounded-full transition-all duration-500" style={{ width: `${completionPercentage}%` }}></div>
          </div>
        </div>

        {/* Checklist */}
        <ul className="mt-5 space-y-2.5 text-xs">
          {steps.map((step) => (
            <li key={step.label} className={`flex items-center gap-2 ${step.done ? "text-gray-700 font-medium" : "text-gray-400"}`}>
              {step.done ? (
                <span className="text-green-500 font-bold">✓</span>
              ) : (
                <span className="text-gray-300">•</span>
              )}
              <span>{step.label}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Wishlist Quick-view Widget */}
      <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-[#17152A] text-sm">Saved Wishlist</h3>
          <Link to="/dashboard/wishlist" className="text-[11px] font-bold text-[#6C4BF4] hover:underline flex items-center gap-1">
            View All ({wishlistItems?.length || 0})
          </Link>
        </div>
        
        {(!wishlistItems || wishlistItems.length === 0) ? (
          <div className="text-center py-6 text-gray-400">
            <Heart size={22} className="mx-auto mb-1.5 text-gray-300" />
            <p className="text-xs font-semibold">No saved books yet</p>
            <Link to="/explore" className="text-[11px] text-[#6C4BF4] font-bold hover:underline mt-1.5 inline-flex items-center gap-1">
              Explore Marketplace <ArrowRight size={11} />
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {wishlistItems.slice(0, 4).map((book) => (
              <Link
                key={book.id || book.title}
                to={book.id ? `/book/${book.id}` : "/dashboard/wishlist"}
                className="flex items-center gap-3 p-1.5 -mx-1.5 rounded-xl hover:bg-gray-50 transition group cursor-pointer"
              >
                {book.coverImage ? (
                  <img
                    src={book.coverImage}
                    alt={book.title}
                    className="h-10 w-7.5 shrink-0 rounded object-cover border border-gray-200 shadow-2xs"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="h-10 w-7.5 shrink-0 rounded bg-gradient-to-br from-[#6C4BF4] to-[#8B3FD9] flex items-center justify-center text-[7px] font-extrabold text-white uppercase tracking-tighter select-none border border-black/5">
                    {book.title ? book.title.split(' ').map(w => w[0]).slice(0, 2).join('') : "BK"}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-bold text-[#17152A] group-hover:text-[#6C4BF4] transition">
                    {book.title}
                  </p>
                  <div className="flex items-center justify-between mt-0.5">
                    <p className="text-[10px] text-[#6C4BF4] font-bold">
                      {book.price}
                    </p>
                    {book.condition && (
                      <span className="text-[9px] text-gray-400 font-medium">
                        {book.condition}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Profile() {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gradient-to-br from-[#F4F2FF] via-[#F8F7FF] to-[#F0F5FF]">
      {/* Left Column: Sidebar */}
      <DashboardSidebar />

      {/* Right Column: Main Content */}
      <div className="flex min-w-0 flex-1 flex-col h-full">
        <main className="flex-1 overflow-y-auto p-4 md:p-7 animate-fade-in-up">
          {/* Page heading */}
          <div className="mb-6 flex items-start gap-3 select-none">
            {/* Mobile Hamburger Menu */}
            <button
              onClick={() => window.dispatchEvent(new Event("toggle-sidebar"))}
              className="lg:hidden p-1.5 rounded-lg text-gray-500 hover:bg-gray-50 hover:text-[#6C4BF4] transition cursor-pointer mt-1"
            >
              <Menu size={20} />
            </button>

            <div>
              <h1 className="text-xl md:text-2xl font-bold text-[#17152A]">
                My Profile
              </h1>
              <p className="mt-0.5 text-xs text-gray-400">
                Manage your profile and account information.
              </p>
            </div>
          </div>

          {/* Profile Details Container */}
          <div className="w-full space-y-6">
            {/* Profile Header */}
            <ProfileHeader />

            {/* Bottom 2-Column layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Left 2/3 columns: Stats and About */}
              <div className="lg:col-span-2 space-y-6">
                <ProfileStats />
                <AboutMe />
              </div>

              {/* Right 1/3 column: Account health & Wishlist */}
              <div className="lg:col-span-1">
                <ProfileWidgets />
              </div>

            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Profile;