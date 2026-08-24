import { useState } from "react";
import DashboardSidebar from "../../components/dashboard/DashboardSidebar";

function Settings() {
  const [formData, setFormData] = useState({
    fullName: "Manish Pawar",
    email: "manishpawar@gmail.com",
    phone: "+91 9876543210",
    location: "Nagpur, Maharashtra",
  });

  const categories = [
    { name: "Profile Settings", active: true },
    { name: "Change Password", active: false },
    { name: "Notifications", active: false },
    { name: "Privacy", active: false },
    { name: "Address", active: false },
    { name: "Payment Methods", active: false },
  ];

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Profile settings saved successfully!");
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F8F7FF]">
      {/* Left Column: Sidebar */}
      <DashboardSidebar />

      {/* Right Column: Main Settings Interface */}
      <div className="flex min-w-0 flex-1 flex-col h-full">
        <main className="flex-1 overflow-y-auto p-7">
          
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-[#17152A]">Settings</h1>
          </div>

          {/* Sub-layout structure */}
          <div className="flex flex-col lg:flex-row gap-6 w-full">
            
            {/* Left Sub-Column: Categories Menu */}
            <div className="w-full lg:w-64 bg-white rounded-2xl border border-gray-100 p-4 shadow-sm h-fit shrink-0">
              <nav className="space-y-1">
                {categories.map((category) => (
                  <button
                    key={category.name}
                    type="button"
                    className={`w-full text-left rounded-xl px-4 py-3 text-sm font-semibold transition cursor-pointer ${
                      category.active
                        ? "bg-[#F0ECFF] text-[#6C4BF4]"
                        : "text-gray-600 hover:bg-gray-50 hover:text-[#6C4BF4]"
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </nav>
            </div>

            {/* Right Sub-Column: Edit Profile Details Form */}
            <div className="flex-1 bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <div className="mb-6 border-b border-gray-100 pb-4">
                <h2 className="text-lg font-bold text-[#17152A]">Profile Settings</h2>
                <p className="text-xs text-gray-500 mt-1">Update your personal information</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-bold text-[#17152A] uppercase tracking-wider mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange("fullName", e.target.value)}
                    className="w-full rounded-xl border border-gray-200 px-4 py-3.5 text-sm font-medium text-[#17152A] outline-none transition focus:border-[#6C4BF4] focus:ring-4 focus:ring-[#6C4BF4]/10"
                    placeholder="Enter your full name"
                  />
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-xs font-bold text-[#17152A] uppercase tracking-wider mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    disabled
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm font-medium text-gray-500 cursor-not-allowed outline-none"
                    placeholder="Enter your email"
                  />
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-xs font-bold text-[#17152A] uppercase tracking-wider mb-2">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className="w-full rounded-xl border border-gray-200 px-4 py-3.5 text-sm font-medium text-[#17152A] outline-none transition focus:border-[#6C4BF4] focus:ring-4 focus:ring-[#6C4BF4]/10"
                    placeholder="Enter your phone number"
                  />
                </div>

                {/* Location */}
                <div>
                  <label className="block text-xs font-bold text-[#17152A] uppercase tracking-wider mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => handleInputChange("location", e.target.value)}
                    className="w-full rounded-xl border border-gray-200 px-4 py-3.5 text-sm font-medium text-[#17152A] outline-none transition focus:border-[#6C4BF4] focus:ring-4 focus:ring-[#6C4BF4]/10"
                    placeholder="Enter your location"
                  />
                </div>

                {/* Profile Picture Upload style */}
                <div>
                  <label className="block text-xs font-bold text-[#17152A] uppercase tracking-wider mb-2">
                    Profile Picture
                  </label>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="h-16 w-16 overflow-hidden rounded-full border border-gray-150 bg-[#EDE7FF]">
                      <img
                        src="/images/profile-avatar.png"
                        alt="Profile Preview"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <button
                      type="button"
                      className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs font-bold text-gray-700 transition hover:bg-gray-50 hover:text-[#6C4BF4] cursor-pointer"
                    >
                      Change Photo
                    </button>
                  </div>
                </div>

                {/* Save changes button */}
                <button
                  type="submit"
                  className="w-full rounded-xl bg-[#6C4BF4] py-3.5 text-sm font-bold text-white shadow-lg shadow-[#6C4BF4]/20 transition hover:bg-[#5B3DE0] cursor-pointer hover:-translate-y-0.5 active:translate-y-0 duration-150 mt-4 text-center"
                >
                  Save Changes
                </button>

              </form>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}

export default Settings;
