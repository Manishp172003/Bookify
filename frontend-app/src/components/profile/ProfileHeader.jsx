import { useState, useRef } from "react";
import { Camera, CheckCircle, Share2, MapPin, Mail, Phone, Calendar, LogOut, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function ProfileHeader() {
  const navigate = useNavigate();
  const { user, updateUser, logout } = useAuth();
  const fileInputRef = useRef(null);
  const coverInputRef = useRef(null);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Profile link copied to clipboard!");
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateUser({ avatar: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCoverUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateUser({ coverImage: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm border border-gray-100 select-none">
      <input
        type="file"
        ref={coverInputRef}
        accept="image/*"
        className="hidden"
        onChange={handleCoverUpload}
      />
      
      {/* Cover Banner */}
      <div className="relative h-36 md:h-44 bg-gradient-to-r from-[#6C4BF4] via-[#8B3FD9] to-[#C83CCB] overflow-hidden">
        {user?.coverImage ? (
          <img
            src={user.coverImage}
            alt="Profile Cover"
            className="h-full w-full object-cover"
          />
        ) : (
          /* Floating Icons Background */
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
        )}
      </div>

      {/* Profile info section */}
      <div className="relative px-8 pb-7">
        
        {/* Photo and Action buttons alignment */}
        <div className="-mt-14 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
          
          {/* Avatar Picture */}
          <div className="relative">
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
            {user?.avatar && user.avatar !== "/images/profile-avatar.png" ? (
              <img
                src={user.avatar}
                alt={user?.fullName || "Profile"}
                className="h-28 w-28 rounded-full border-4 border-white object-cover shadow-md bg-white"
              />
            ) : (
              <div className="h-28 w-28 rounded-full border-4 border-white bg-gradient-to-br from-[#6C4BF4] to-[#8B3FD9] text-white flex items-center justify-center text-3xl font-extrabold shadow-md">
                {user?.fullName ? user.fullName.split(" ").map(n => n[0]).join("").slice(0, 2) : "U"}
              </div>
            )}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              title="Upload Profile Picture"
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
              onClick={() => coverInputRef.current?.click()}
              title="Upload Banner Cover"
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
              {user?.fullName || "Student User"}
            </h1>

            <span className="flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-xs font-semibold text-green-600 border border-green-100">
              <CheckCircle size={12} />
              Verified Student
            </span>
          </div>
        </div>

        {/* Metadata Grid */}
        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-gray-100 pt-5">
          
          {/* Left Column Metadata */}
          <div className="space-y-3 text-sm text-gray-500 font-medium">
            <div className="flex items-center gap-2.5">
              <MapPin size={16} className="text-[#6C4BF4]" />
              <span>Campus Community, India</span>
            </div>
            
            <div className="flex items-center gap-2.5">
              <Calendar size={16} className="text-[#6C4BF4]" />
              <span>Member since 2025</span>
            </div>
          </div>

          {/* Right Column Metadata */}
          <div className="space-y-3 text-sm text-gray-500 font-medium">
            <div className="flex items-center gap-2.5">
              <Mail size={16} className="text-[#6C4BF4]" />
              <span>{user?.email || "student@bookify.com"}</span>
            </div>

            <div className="flex items-center gap-2.5">
              <Phone size={16} className="text-[#6C4BF4]" />
              <span>{user?.phone || "+91 9876543210"}</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

export default ProfileHeader;