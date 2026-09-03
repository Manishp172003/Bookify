import { Camera, CheckCircle, Share2, MapPin, Mail, Phone, Calendar, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function ProfileHeader() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Profile link copied to clipboard!");
  };

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm border border-gray-100 select-none">
      
      {/* Cover Banner with Floating SVGs */}
      <div className="relative h-36 bg-gradient-to-r from-[#6C4BF4] via-[#8B3FD9] to-[#C83CCB] overflow-hidden">
        {/* Floating Icons Background */}
        <div className="absolute inset-0">
          {/* Open Book Left */}
          <svg className="absolute left-1/4 top-6 h-10 w-10 text-white/10 rotate-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
          </svg>

          {/* Book Stack Mid-Right */}
          <svg className="absolute right-36 top-4 h-14 w-14 text-white/15 -rotate-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
            <path d="M6 6h10M6 10h10M6 14h10" />
          </svg>

          {/* Graduation Cap Right */}
          <svg className="absolute right-10 bottom-3 h-16 w-16 text-white/20 rotate-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
            <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"/>
          </svg>
        </div>
      </div>

      {/* Profile info section */}
      <div className="relative px-8 pb-7">
        
        {/* Photo and Action buttons alignment */}
        <div className="-mt-14 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
          
          {/* Avatar Picture */}
          <div className="relative">
            <img
              src="/images/profile-avatar.png"
              alt="Profile"
              className="h-28 w-28 rounded-full border-4 border-white object-cover shadow-md"
            />
            <button
              type="button"
              className="absolute bottom-1 right-1 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md cursor-pointer hover:bg-gray-50 transition border border-gray-100"
            >
              <Camera size={15} className="text-[#6C4BF4]" />
            </button>
          </div>

          {/* Action buttons (Share / Edit Cover) */}
          <div className="flex gap-2.5 mt-2 sm:mb-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleShare}
              className="flex flex-1 sm:flex-none items-center justify-center gap-1.5 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs font-bold text-gray-700 hover:text-[#6C4BF4] hover:bg-gray-50 transition cursor-pointer shadow-sm"
            >
              <Share2 size={14} />
              Share Profile
            </button>
            
            <button
              type="button"
              className="flex flex-1 sm:flex-none items-center justify-center gap-1.5 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs font-bold text-gray-700 hover:text-[#6C4BF4] hover:bg-gray-50 transition cursor-pointer shadow-sm"
            >
              <Camera size={14} />
              Change Cover
            </button>

            <button
              type="button"
              onClick={() => { logout(); navigate("/login"); }}
              className="flex flex-1 sm:flex-none items-center justify-center gap-1.5 rounded-xl border border-red-100 bg-red-50 px-4 py-2.5 text-xs font-bold text-red-600 hover:text-red-700 hover:bg-red-100 transition cursor-pointer shadow-sm"
            >
              <LogOut size={14} />
              Logout
            </button>
          </div>

        </div>

        {/* Identity Details */}
        <div className="mt-5">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-[#17152A]">
              Manish Pawar
            </h1>

            <span className="flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-xs font-semibold text-green-600 border border-green-100">
              <CheckCircle size={12} />
              Verified Student
            </span>
          </div>
        </div>

        {/* Metadata Grid (Two-Column Layout to fill empty space) */}
        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-gray-100 pt-5">
          
          {/* Left Column Metadata */}
          <div className="space-y-3 text-sm text-gray-500 font-medium">
            <div className="flex items-center gap-2.5">
              <MapPin size={16} className="text-[#6C4BF4]" />
              <span>Nagpur, Maharashtra</span>
            </div>
            
            <div className="flex items-center gap-2.5">
              <Calendar size={16} className="text-[#6C4BF4]" />
              <span>Member since May 2004</span>
            </div>
          </div>

          {/* Right Column Metadata */}
          <div className="space-y-3 text-sm text-gray-500 font-medium">
            <div className="flex items-center gap-2.5">
              <Mail size={16} className="text-[#6C4BF4]" />
              <span>manishpawar@gmail.com</span>
            </div>

            <div className="flex items-center gap-2.5">
              <Phone size={16} className="text-[#6C4BF4]" />
              <span>+91 9876543210</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

export default ProfileHeader;