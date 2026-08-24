import React, { useState } from "react";
import { User, Mail, Globe, Share2, Heart, Code, Check } from "lucide-react";

function AuthorProfile() {
  const [profile, setProfile] = useState({
    name: "Rahul Verma",
    penName: "R. V. Writes",
    email: "rahulverma.author@gmail.com",
    bio: "A passionate writer on self-help and personal transformation. I love to inspire and help readers live a better life.",
    website: "https://rvwrites.com",
    twitter: "https://twitter.com/rvwrites",
    instagram: "https://instagram.com/rvwrites",
    github: "https://github.com/rvwrites"
  });

  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-[#17152A] font-poppins font-poppins">Author Profile</h1>
        <p className="text-[#6B6880] mt-1 text-sm">Customize your public author page and personal details.</p>
      </div>

      <div className="bg-white p-8 rounded-2xl border border-[#E7E4F2] shadow-sm">
        <form onSubmit={handleSave} className="space-y-6">
          
          {/* Avatar upload */}
          <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-[#E7E4F2]/50">
            <div className="h-24 w-24 rounded-full bg-[#EEEAFE] border-2 border-[#6C4BF4] flex items-center justify-center text-[#6C4BF4] overflow-hidden shrink-0 relative">
              <User size={40} />
            </div>
            <div className="text-center sm:text-left space-y-1">
              <h3 className="font-bold text-[#17152A] text-lg font-poppins">Rahul Verma</h3>
              <p className="text-xs text-[#6B6880]">JPG or PNG. Max size 2MB</p>
              <button 
                type="button"
                className="mt-2 px-4 py-1.5 bg-[#EEEAFE] text-[#6C4BF4] hover:bg-[#6C4BF4]/10 rounded-lg text-xs font-bold transition"
              >
                Change Photo
              </button>
            </div>
          </div>

          {/* Form details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-[#17152A] uppercase tracking-wider mb-2">Author Name</label>
              <input 
                type="text" 
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full rounded-xl border border-gray-200 bg-[#F8F7FF] py-3 px-4 text-sm outline-none focus:border-[#6C4BF4]"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#17152A] uppercase tracking-wider mb-2">Pen Name (Optional)</label>
              <input 
                type="text" 
                value={profile.penName}
                onChange={(e) => setProfile({ ...profile, penName: e.target.value })}
                className="w-full rounded-xl border border-gray-200 bg-[#F8F7FF] py-3 px-4 text-sm outline-none focus:border-[#6C4BF4]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#17152A] uppercase tracking-wider mb-2">Email Address</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="email" 
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="w-full rounded-xl border border-gray-200 bg-[#F8F7FF] py-3 pl-10 pr-4 text-sm outline-none focus:border-[#6C4BF4]"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#17152A] uppercase tracking-wider mb-2">Bio</label>
            <textarea 
              rows={4}
              value={profile.bio}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              className="w-full rounded-xl border border-gray-200 bg-[#F8F7FF] py-3 px-4 text-sm outline-none focus:border-[#6C4BF4]"
            />
          </div>

          {/* Social Links */}
          <div className="border-t border-[#E7E4F2]/50 pt-6 space-y-4">
            <h3 className="font-bold text-[#17152A] text-base font-poppins">Social Links</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Globe size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="url" 
                  value={profile.website} 
                  onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                  placeholder="Website"
                  className="w-full rounded-xl border border-gray-200 bg-[#F8F7FF] py-2.5 pl-10 pr-4 text-xs outline-none focus:border-[#6C4BF4]"
                />
              </div>
              <div className="relative">
                <Share2 size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="url" 
                  value={profile.twitter} 
                  onChange={(e) => setProfile({ ...profile, twitter: e.target.value })}
                  placeholder="Twitter URL"
                  className="w-full rounded-xl border border-gray-200 bg-[#F8F7FF] py-2.5 pl-10 pr-4 text-xs outline-none focus:border-[#6C4BF4]"
                />
              </div>
              <div className="relative">
                <Heart size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="url" 
                  value={profile.instagram} 
                  onChange={(e) => setProfile({ ...profile, instagram: e.target.value })}
                  placeholder="Instagram URL"
                  className="w-full rounded-xl border border-gray-200 bg-[#F8F7FF] py-2.5 pl-10 pr-4 text-xs outline-none focus:border-[#6C4BF4]"
                />
              </div>
              <div className="relative">
                <Code size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="url" 
                  value={profile.github} 
                  onChange={(e) => setProfile({ ...profile, github: e.target.value })}
                  placeholder="GitHub Profile"
                  className="w-full rounded-xl border border-gray-200 bg-[#F8F7FF] py-2.5 pl-10 pr-4 text-xs outline-none focus:border-[#6C4BF4]"
                />
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-4 justify-between border-t border-[#E7E4F2]/50 pt-6">
            {saved ? (
              <span className="flex items-center gap-1.5 text-[#22C55E] text-sm font-semibold">
                <Check size={16} />
                <span>Changes saved successfully!</span>
              </span>
            ) : (
              <span />
            )}

            <button 
              type="submit"
              className="px-6 py-2.5 bg-[#6C4BF4] text-white rounded-xl text-sm font-semibold hover:bg-[#5b3ed9] transition shadow-md shadow-[#6C4BF4]/20"
            >
              Save Changes
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default AuthorProfile;
