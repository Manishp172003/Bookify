import DashboardSidebar from "../../components/dashboard/DashboardSidebar";
import ProfileHeader from "../../components/profile/ProfileHeader";
import ProfileStats from "../../components/profile/ProfileStats";
import AboutMe from "../../components/profile/AboutMe";
import { Menu } from "lucide-react";

function ProfileWidgets() {
  return (
    <div className="space-y-6">
      {/* Account Status Widget */}
      <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
        <h3 className="font-bold text-[#17152A] text-sm">Account Status</h3>
        
        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex justify-between text-xs font-semibold text-gray-500 mb-1.5">
            <span>Profile Completion</span>
            <span className="text-[#6C4BF4] font-bold">85%</span>
          </div>
          <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-[#6C4BF4] rounded-full" style={{ width: "85%" }}></div>
          </div>
        </div>

        {/* Checklist */}
        <ul className="mt-5 space-y-2.5 text-xs">
          <li className="flex items-center gap-2 text-gray-600">
            <span className="text-green-500 font-bold">✓</span> Verify Email
          </li>
          <li className="flex items-center gap-2 text-gray-600">
            <span className="text-green-500 font-bold">✓</span> Verify Student ID
          </li>
          <li className="flex items-center gap-2 text-gray-600">
            <span className="text-green-500 font-bold">✓</span> Add Mobile Number
          </li>
          <li className="flex items-center gap-2 text-gray-405">
            <span className="text-gray-300">•</span> Link Bank Account (for payouts)
          </li>
        </ul>
      </div>

      {/* Wishlist Quick-view Widget */}
      <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
        <h3 className="font-bold text-[#17152A] text-sm mb-4">Saved Wishlist</h3>
        
        <div className="space-y-3">
          {[
            { title: "Introduction to Algorithms", price: "₹650", bgClass: "from-[#111827] to-[#374151]" },
            { title: "Compiler Design", price: "₹450", bgClass: "from-[#065F46] to-[#047857]" }
          ].map((book) => (
            <div key={book.title} className="flex items-center gap-3">
              <div className={`h-9 w-6.5 shrink-0 rounded bg-gradient-to-br ${book.bgClass} flex items-center justify-center text-[5px] font-extrabold text-white uppercase tracking-tighter select-none border border-black/5`}>
                {book.title.split(' ').map(w => w[0]).join('')}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-bold text-[#17152A]">
                  {book.title}
                </p>
                <p className="text-[10px] text-[#6C4BF4] font-semibold mt-0.5">
                  {book.price}
                </p>
              </div>
            </div>
          ))}
        </div>
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