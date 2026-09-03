import { useState } from "react";
import DashboardSidebar from "../../components/dashboard/DashboardSidebar";
import { Eye, EyeOff, Camera, Trash2, Menu } from "lucide-react";

export default function Settings() {
  const [activeCategory, setActiveCategory] = useState("Profile Settings");

  // Profile Form State
  const [profileData, setProfileData] = useState({
    fullName: "Manish Pawar",
    email: "manishpawar@gmail.com",
    phone: "+91 9876543210",
    location: "Nagpur, Maharashtra",
  });

  // Password Form State
  const [passwordData, setPasswordData] = useState({
    current: "",
    newPassword: "",
    confirm: "",
  });
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  // Notifications State
  const [notifications, setNotifications] = useState({
    priceDrops: true,
    purchases: true,
    exchanges: false,
    chatAlerts: true,
    meetups: true,
  });

  // Privacy Toggles State
  const [privacy, setPrivacy] = useState({
    showPhone: true,
    showHostel: false,
    requirePin: true,
  });

  // Address Form State
  const [addressData, setAddressData] = useState({
    campus: "Nagpur University Campus",
    hostelBlock: "Hostel Block A, Room 204",
    meetupSpot: "Central Library Entrance",
  });

  // Payment Methods Form State
  const [paymentData, setPaymentData] = useState({
    mode: "UPI",
    upiId: "manishpawar@okaxis",
    accountName: "Manish Pawar",
    accountNumber: "987654321098",
    ifscCode: "UTIB0001234",
  });

  const categories = [
    "Profile Settings",
    "Change Password",
    "Notifications",
    "Privacy",
    "Address",
    "Payment Methods",
  ];

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    alert("Profile settings saved successfully!");
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirm) {
      alert("New passwords do not match!");
      return;
    }
    alert("Password updated successfully!");
    setPasswordData({ current: "", newPassword: "", confirm: "" });
  };

  const handleNotificationsSubmit = (e) => {
    e.preventDefault();
    alert("Notification preferences saved!");
  };

  const handlePrivacySubmit = (e) => {
    e.preventDefault();
    alert("Privacy settings updated!");
  };

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    alert("Address and campus location saved!");
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    alert("Payment methods information updated!");
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gradient-to-br from-[#F4F2FF] via-[#F8F7FF] to-[#F0F5FF]">
      {/* Left Column: Sidebar */}
      <DashboardSidebar />

      {/* Right Column: Main Settings Interface */}
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
              <h1 className="text-xl md:text-2xl font-bold text-[#17152A]">Settings</h1>
            </div>
          </div>

          {/* Sub-layout structure */}
          <div className="flex flex-col lg:flex-row gap-6 w-full max-w-[1440px]">
            
            {/* Left Sub-Column: Categories Menu */}
            <div className="w-full lg:w-64 bg-white rounded-2xl border border-gray-100 p-4 shadow-sm h-fit shrink-0">
              <nav className="space-y-1">
                {categories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setActiveCategory(category)}
                    className={`w-full text-left rounded-xl px-4 py-3 text-sm font-semibold transition cursor-pointer ${
                      activeCategory === category
                        ? "bg-[#F0ECFF] text-[#6C4BF4]"
                        : "text-gray-600 hover:bg-gray-50 hover:text-[#6C4BF4]"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </nav>
            </div>

            {/* Right Sub-Column: Dynamic Content Form Panel */}
            <div className="flex-1 bg-white rounded-2xl border border-gray-100 p-6 shadow-sm min-w-0">
              
              {/* Profile Settings Tab */}
              {activeCategory === "Profile Settings" && (
                <div>
                  <div className="mb-6 border-b border-gray-100 pb-4">
                    <h2 className="text-lg font-bold text-[#17152A]">Profile Settings</h2>
                    <p className="text-xs text-gray-500 mt-1">Update your personal information</p>
                  </div>

                  <form onSubmit={handleProfileSubmit} className="space-y-6">
                    
                    {/* PROFILE PICTURE AT THE TOP */}
                    <div className="bg-gray-50/55 rounded-2xl p-4 border border-gray-100 flex flex-col sm:flex-row items-center gap-4">
                      <div className="h-16 w-16 overflow-hidden rounded-full border border-gray-150 bg-[#EDE7FF] shrink-0">
                        <img
                          src="/images/profile-avatar.png"
                          alt="Profile Preview"
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="text-center sm:text-left flex-1">
                        <p className="text-xs font-bold text-[#17152A]">Profile Picture</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">JPG or PNG. Max size 800KB</p>
                        <div className="flex items-center gap-2 mt-2 justify-center sm:justify-start">
                          <button
                            type="button"
                            className="flex items-center gap-1 rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-[10px] font-bold text-gray-700 transition hover:bg-gray-55 hover:text-[#6C4BF4] cursor-pointer"
                          >
                            <Camera size={12} />
                            Change Photo
                          </button>
                          <button
                            type="button"
                            className="flex items-center gap-1 rounded-xl border border-red-100 bg-red-50 px-3.5 py-2 text-[10px] font-bold text-red-500 transition hover:bg-red-100 hover:text-red-700 cursor-pointer"
                          >
                            <Trash2 size={12} />
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* TWO-COLUMN GRID FOR FIELDS */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-[10px] font-bold text-gray-450 uppercase tracking-wider mb-2">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={profileData.fullName}
                          onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                          className="w-full rounded-xl border border-gray-200 px-4 py-3 text-xs font-semibold text-[#17152A] outline-none transition focus:border-[#6C4BF4] focus:ring-4 focus:ring-[#6C4BF4]/10"
                          placeholder="Enter your full name"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-gray-450 uppercase tracking-wider mb-2">
                          Phone Number
                        </label>
                        <input
                          type="text"
                          value={profileData.phone}
                          onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                          className="w-full rounded-xl border border-gray-200 px-4 py-3 text-xs font-semibold text-[#17152A] outline-none transition focus:border-[#6C4BF4] focus:ring-4 focus:ring-[#6C4BF4]/10"
                          placeholder="Enter your phone number"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-gray-450 uppercase tracking-wider mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={profileData.email}
                          disabled
                          className="w-full rounded-xl border border-gray-200 bg-gray-55 px-4 py-3 text-xs font-semibold text-gray-400 cursor-not-allowed outline-none"
                          placeholder="Enter your email"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-gray-450 uppercase tracking-wider mb-2">
                          Location
                        </label>
                        <input
                          type="text"
                          value={profileData.location}
                          onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                          className="w-full rounded-xl border border-gray-200 px-4 py-3 text-xs font-semibold text-[#17152A] outline-none transition focus:border-[#6C4BF4] focus:ring-4 focus:ring-[#6C4BF4]/10"
                          placeholder="Enter your location"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full sm:w-auto rounded-xl bg-[#6C4BF4] px-8 py-3 text-xs font-bold text-white shadow-lg shadow-[#6C4BF4]/20 transition hover:bg-[#5B3DE0] cursor-pointer hover:-translate-y-0.5 active:translate-y-0 duration-150 text-center"
                    >
                      Save Changes
                    </button>
                  </form>
                </div>
              )}

              {/* Change Password Tab */}
              {activeCategory === "Change Password" && (
                <div className="max-w-md">
                  <div className="mb-6 border-b border-gray-100 pb-4">
                    <h2 className="text-lg font-bold text-[#17152A]">Change Password</h2>
                    <p className="text-xs text-gray-500 mt-1">Manage password credentials</p>
                  </div>

                  <form onSubmit={handlePasswordSubmit} className="space-y-5">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-455 uppercase tracking-wider mb-2">
                        Current Password
                      </label>
                      <div className="relative">
                        <input
                          type={showCurrent ? "text" : "password"}
                          value={passwordData.current}
                          required
                          onChange={(e) => setPasswordData({ ...passwordData, current: e.target.value })}
                          className="w-full rounded-xl border border-gray-200 px-4 py-3 text-xs font-semibold text-[#17152A] outline-none transition focus:border-[#6C4BF4] focus:ring-4 focus:ring-[#6C4BF4]/10"
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrent(!showCurrent)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#6C4BF4]"
                        >
                          {showCurrent ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-gray-455 uppercase tracking-wider mb-2">
                        New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showNew ? "text" : "password"}
                          value={passwordData.newPassword}
                          required
                          onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                          className="w-full rounded-xl border border-gray-200 px-4 py-3 text-xs font-semibold text-[#17152A] outline-none transition focus:border-[#6C4BF4] focus:ring-4 focus:ring-[#6C4BF4]/10"
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNew(!showNew)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#6C4BF4]"
                        >
                          {showNew ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-gray-455 uppercase tracking-wider mb-2">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        value={passwordData.confirm}
                        required
                        onChange={(e) => setPasswordData({ ...passwordData, confirm: e.target.value })}
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-xs font-semibold text-[#17152A] outline-none transition focus:border-[#6C4BF4] focus:ring-4 focus:ring-[#6C4BF4]/10"
                        placeholder="••••••••"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full sm:w-auto rounded-xl bg-[#6C4BF4] px-8 py-3 text-xs font-bold text-white shadow-lg shadow-[#6C4BF4]/20 transition hover:bg-[#5B3DE0] cursor-pointer hover:-translate-y-0.5 active:translate-y-0 duration-150 text-center"
                    >
                      Update Password
                    </button>
                  </form>
                </div>
              )}

              {/* Notifications Tab */}
              {activeCategory === "Notifications" && (
                <div>
                  <div className="mb-6 border-b border-gray-100 pb-4">
                    <h2 className="text-lg font-bold text-[#17152A]">Notifications</h2>
                    <p className="text-xs text-gray-500 mt-1">Manage notification updates and preferences</p>
                  </div>

                  <form onSubmit={handleNotificationsSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* Email Notifications Column */}
                      <div className="space-y-4">
                        <h3 className="font-extrabold text-xs text-[#17152A] uppercase tracking-wider">Email Notifications</h3>
                        
                        <label className="flex items-start gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={notifications.priceDrops}
                            onChange={(e) => setNotifications({ ...notifications, priceDrops: e.target.checked })}
                            className="h-4.5 w-4.5 rounded border-gray-305 accent-[#6C4BF4] mt-0.5"
                          />
                          <div>
                            <p className="text-xs font-bold text-[#17152A]">Price Drops Alerts</p>
                            <p className="text-[10px] text-gray-405 mt-0.5 leading-relaxed">Receive alert when books in your wishlist go on sale.</p>
                          </div>
                        </label>

                        <label className="flex items-start gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={notifications.purchases}
                            onChange={(e) => setNotifications({ ...notifications, purchases: e.target.checked })}
                            className="h-4.5 w-4.5 rounded border-gray-305 accent-[#6C4BF4] mt-0.5"
                          />
                          <div>
                            <p className="text-xs font-bold text-[#17152A]">Order Purchases</p>
                            <p className="text-[10px] text-gray-405 mt-0.5 leading-relaxed">Receive updates regarding textbook order updates and receipts.</p>
                          </div>
                        </label>

                        <label className="flex items-start gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={notifications.exchanges}
                            onChange={(e) => setNotifications({ ...notifications, exchanges: e.target.checked })}
                            className="h-4.5 w-4.5 rounded border-gray-305 accent-[#6C4BF4] mt-0.5"
                          />
                          <div>
                            <p className="text-xs font-bold text-[#17152A]">Swap Requests</p>
                            <p className="text-[10px] text-gray-405 mt-0.5 leading-relaxed">Receive notification when a user proposes a book exchange.</p>
                          </div>
                        </label>
                      </div>

                      {/* SMS Column */}
                      <div className="space-y-4">
                        <h3 className="font-extrabold text-xs text-[#17152A] uppercase tracking-wider">SMS / Instant Alerts</h3>
                        
                        <label className="flex items-start gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={notifications.chatAlerts}
                            onChange={(e) => setNotifications({ ...notifications, chatAlerts: e.target.checked })}
                            className="h-4.5 w-4.5 rounded border-gray-305 accent-[#6C4BF4] mt-0.5"
                          />
                          <div>
                            <p className="text-xs font-bold text-[#17152A]">Chat Notifications</p>
                            <p className="text-[10px] text-gray-405 mt-0.5 leading-relaxed">Receive mobile message alerts when someone messages you about a book.</p>
                          </div>
                        </label>

                        <label className="flex items-start gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={notifications.meetups}
                            onChange={(e) => setNotifications({ ...notifications, meetups: e.target.checked })}
                            className="h-4.5 w-4.5 rounded border-gray-305 accent-[#6C4BF4] mt-0.5"
                          />
                          <div>
                            <p className="text-xs font-bold text-[#17152A]">Meetup reminders</p>
                            <p className="text-[10px] text-gray-405 mt-0.5 leading-relaxed">Receive SMS coordinates 1 hour before a scheduled campus meetup.</p>
                          </div>
                        </label>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-100">
                      <button
                        type="submit"
                        className="w-full sm:w-auto rounded-xl bg-[#6C4BF4] px-8 py-3 text-xs font-bold text-white shadow-lg shadow-[#6C4BF4]/20 transition hover:bg-[#5B3DE0] cursor-pointer text-center"
                      >
                        Save Preferences
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Privacy Tab */}
              {activeCategory === "Privacy" && (
                <div className="max-w-xl">
                  <div className="mb-6 border-b border-gray-100 pb-4">
                    <h2 className="text-lg font-bold text-[#17152A]">Privacy Settings</h2>
                    <p className="text-xs text-gray-500 mt-1">Control listing privacy and account safety</p>
                  </div>

                  <form onSubmit={handlePrivacySubmit} className="space-y-6">
                    <div className="space-y-5">
                      <label className="flex items-start justify-between gap-4 cursor-pointer">
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-[#17152A]">Public Phone Number</p>
                          <p className="text-[10px] text-gray-400 mt-0.5">Allow users to view your contact phone number directly on listings.</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={privacy.showPhone}
                          onChange={(e) => setPrivacy({ ...privacy, showPhone: e.target.checked })}
                          className="h-5 w-10 shrink-0 rounded-full border border-gray-250 accent-[#6C4BF4] cursor-pointer"
                        />
                      </label>

                      <div className="h-px bg-gray-100/50" />

                      <label className="flex items-start justify-between gap-4 cursor-pointer">
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-[#17152A]">Show Campus Location Details</p>
                          <p className="text-[10px] text-gray-400 mt-0.5">Display your hostel name/block on listings to help buyers plan trades.</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={privacy.showHostel}
                          onChange={(e) => setPrivacy({ ...privacy, showHostel: e.target.checked })}
                          className="h-5 w-10 shrink-0 rounded-full border border-gray-250 accent-[#6C4BF4] cursor-pointer"
                        />
                      </label>

                      <div className="h-px bg-gray-100/50" />

                      <label className="flex items-start justify-between gap-4 cursor-pointer">
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-[#17152A]">Require Verification Meetup PIN</p>
                          <p className="text-[10px] text-gray-400 mt-0.5">Buyers must enter a 4-digit code in meetup before escrow cash is released.</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={privacy.requirePin}
                          onChange={(e) => setPrivacy({ ...privacy, requirePin: e.target.checked })}
                          className="h-5 w-10 shrink-0 rounded-full border border-gray-250 accent-[#6C4BF4] cursor-pointer"
                        />
                      </label>
                    </div>

                    <button
                      type="submit"
                      className="w-full sm:w-auto rounded-xl bg-[#6C4BF4] px-8 py-3 text-xs font-bold text-white shadow-lg shadow-[#6C4BF4]/20 transition hover:bg-[#5B3DE0] cursor-pointer text-center"
                    >
                      Save Privacy Settings
                    </button>
                  </form>
                </div>
              )}

              {/* Address Tab */}
              {activeCategory === "Address" && (
                <div>
                  <div className="mb-6 border-b border-gray-100 pb-4">
                    <h2 className="text-lg font-bold text-[#17152A]">Campus & Hostel Details</h2>
                    <p className="text-xs text-gray-500 mt-1">Configure campus coordinates for meetup trades</p>
                  </div>

                  <form onSubmit={handleAddressSubmit} className="space-y-5">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-455 uppercase tracking-wider mb-2">
                        Select College Campus
                      </label>
                      <select
                        value={addressData.campus}
                        onChange={(e) => setAddressData({ ...addressData, campus: e.target.value })}
                        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-xs font-semibold text-[#17152A] outline-none transition focus:border-[#6C4BF4]"
                      >
                        <option value="Nagpur University Campus">Nagpur University Campus</option>
                        <option value="VNIT Nagpur Campus">VNIT Nagpur Campus</option>
                        <option value="GHRCE Campus">GHRCE Campus</option>
                        <option value="YCCE Campus">YCCE Campus</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-[10px] font-bold text-gray-455 uppercase tracking-wider mb-2">
                          Hostel Name / Room Number
                        </label>
                        <input
                          type="text"
                          value={addressData.hostelBlock}
                          onChange={(e) => setAddressData({ ...addressData, hostelBlock: e.target.value })}
                          className="w-full rounded-xl border border-gray-200 px-4 py-3 text-xs font-semibold text-[#17152A] outline-none transition focus:border-[#6C4BF4] focus:ring-4 focus:ring-[#6C4BF4]/10"
                          placeholder="e.g. Hostel Block A, Room 204"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-gray-455 uppercase tracking-wider mb-2">
                          Default Meetup Spot
                        </label>
                        <input
                          type="text"
                          value={addressData.meetupSpot}
                          onChange={(e) => setAddressData({ ...addressData, meetupSpot: e.target.value })}
                          className="w-full rounded-xl border border-gray-200 px-4 py-3 text-xs font-semibold text-[#17152A] outline-none transition focus:border-[#6C4BF4] focus:ring-4 focus:ring-[#6C4BF4]/10"
                          placeholder="e.g. Library Entrance / Canteen Gate"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full sm:w-auto rounded-xl bg-[#6C4BF4] px-8 py-3 text-xs font-bold text-white shadow-lg shadow-[#6C4BF4]/20 transition hover:bg-[#5B3DE0] cursor-pointer text-center"
                    >
                      Save Address Details
                    </button>
                  </form>
                </div>
              )}

              {/* Payment Methods Tab */}
              {activeCategory === "Payment Methods" && (
                <div className="max-w-xl">
                  <div className="mb-6 border-b border-gray-100 pb-4">
                    <h2 className="text-lg font-bold text-[#17152A]">Payment Methods</h2>
                    <p className="text-xs text-gray-500 mt-1">Configure UPI and Bank Account details for payouts</p>
                  </div>

                  <form onSubmit={handlePaymentSubmit} className="space-y-5">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-455 uppercase tracking-wider mb-2">
                        Default Payout mode
                      </label>
                      <div className="flex gap-6 mt-2">
                        {["UPI", "Bank Account"].map((m) => (
                          <label key={m} className="flex items-center gap-2 cursor-pointer text-xs font-bold text-gray-700">
                            <input
                              type="radio"
                              name="payoutMode"
                              checked={paymentData.mode === m}
                              onChange={() => setPaymentData({ ...paymentData, mode: m })}
                              className="accent-[#6C4BF4] h-4 w-4"
                            />
                            {m}
                          </label>
                        ))}
                      </div>
                    </div>

                    {paymentData.mode === "UPI" ? (
                      <div className="max-w-md">
                        <label className="block text-[10px] font-bold text-gray-455 uppercase tracking-wider mb-2">
                          UPI ID Address
                        </label>
                        <input
                          type="text"
                          required
                          value={paymentData.upiId}
                          onChange={(e) => setPaymentData({ ...paymentData, upiId: e.target.value })}
                          className="w-full rounded-xl border border-gray-200 px-4 py-3 text-xs font-semibold text-[#17152A] outline-none transition focus:border-[#6C4BF4] focus:ring-4 focus:ring-[#6C4BF4]/10"
                          placeholder="e.g. name@upi"
                        />
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-[10px] font-bold text-gray-455 uppercase tracking-wider mb-2">
                            Account Holder Name
                          </label>
                          <input
                            type="text"
                            required
                            value={paymentData.accountName}
                            onChange={(e) => setPaymentData({ ...paymentData, accountName: e.target.value })}
                            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-xs font-semibold text-[#17152A] outline-none transition focus:border-[#6C4BF4]"
                            placeholder="Manish Pawar"
                          />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] font-bold text-gray-455 uppercase tracking-wider mb-2">
                              Account Number
                            </label>
                            <input
                              type="text"
                              required
                              value={paymentData.accountNumber}
                              onChange={(e) => setPaymentData({ ...paymentData, accountNumber: e.target.value })}
                              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-xs font-semibold text-[#17152A] outline-none transition focus:border-[#6C4BF4]"
                              placeholder="987654321098"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-gray-455 uppercase tracking-wider mb-2">
                              IFSC Code
                            </label>
                            <input
                              type="text"
                              required
                              value={paymentData.ifscCode}
                              onChange={(e) => setPaymentData({ ...paymentData, ifscCode: e.target.value })}
                              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-xs font-semibold text-[#17152A] outline-none transition focus:border-[#6C4BF4]"
                              placeholder="UTIB0001234"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    <button
                      type="submit"
                      className="w-full sm:w-auto rounded-xl bg-[#6C4BF4] px-8 py-3 text-xs font-bold text-white shadow-lg shadow-[#6C4BF4]/20 transition hover:bg-[#5B3DE0] cursor-pointer text-center mt-4"
                    >
                      Save Payment Info
                    </button>
                  </form>
                </div>
              )}

            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
