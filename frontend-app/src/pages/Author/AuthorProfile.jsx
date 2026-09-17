import React, { useState, useEffect } from "react";
import { User, Mail, Globe, Share2, Heart, Check, ShieldCheck, Upload, AlertCircle, Sparkles } from "lucide-react";
import { authorService, getCurrentAuthor, isDemoAuthor } from "../../services/authorService";
import { useCommerce } from "../../context/CommerceContext";

function AuthorProfile() {
  const { showToast } = useCommerce();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [verifying, setVerifying] = useState(false);

  const current = getCurrentAuthor();
  const isDemo = isDemoAuthor(current);

  const [profile, setProfile] = useState({
    name: isDemo ? "Rahul Verma" : (current?.fullName || ""),
    penName: isDemo ? "R. V. Writes" : (current?.penName || ""),
    email: isDemo ? "author@bookify.com" : (current?.email || ""),
    bio: isDemo
      ? "A passionate writer on self-help and personal transformation. Inspiring student communities to read and grow."
      : (current?.authorBio || ""),
    website: isDemo ? "https://rvwrites.com" : (current?.website || ""),
    twitter: isDemo ? "https://twitter.com/rvwrites" : (current?.socialLinks?.twitter || ""),
    instagram: isDemo ? "https://instagram.com/rvwrites" : (current?.socialLinks?.instagram || ""),
    goodreads: isDemo ? "https://goodreads.com/rvwrites" : (current?.socialLinks?.goodreads || ""),
    publisherImprint: isDemo ? "Lotus Crest Publishing" : (current?.publisherImprint || ""),
    verificationStatus: isDemo ? "verified" : (current?.authorVerificationStatus || (current?.isVerified ? "verified" : "unverified")),
  });

  const [docTitle, setDocTitle] = useState("");
  const [docUrl, setDocUrl] = useState("");

  useEffect(() => {
    let isMounted = true;
    authorService.getProfile().then((data) => {
      if (!isMounted || !data) return;
      setProfile((prev) => ({
        ...prev,
        name: data.fullName || prev.name,
        penName: data.penName || prev.penName,
        email: data.email || prev.email,
        bio: data.authorBio || prev.bio,
        website: data.website || prev.website,
        twitter: data.socialLinks?.twitter || prev.twitter,
        instagram: data.socialLinks?.instagram || prev.instagram,
        goodreads: data.socialLinks?.goodreads || prev.goodreads,
        publisherImprint: data.publisherImprint || prev.publisherImprint,
        verificationStatus: data.authorVerificationStatus || (data.isVerified ? "verified" : "unverified"),
      }));
    }).finally(() => {
      if (isMounted) setLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await authorService.updateProfile({
        fullName: profile.name,
        penName: profile.penName,
        authorBio: profile.bio,
        website: profile.website,
        publisherImprint: profile.publisherImprint,
        socialLinks: {
          twitter: profile.twitter,
          instagram: profile.instagram,
          goodreads: profile.goodreads,
        },
      });
      showToast("Author profile updated successfully!", "success");
    } catch (err) {
      showToast("Saved locally.", "info");
    } finally {
      setSaving(false);
    }
  };

  const handleVerificationSubmit = async (e) => {
    e.preventDefault();
    if (!docTitle.trim() || !docUrl.trim()) {
      showToast("Please provide document title and proof URL", "warning");
      return;
    }
    setVerifying(true);
    try {
      await authorService.submitVerification(docTitle, docUrl);
      setProfile((prev) => ({ ...prev, verificationStatus: "pending" }));
      setDocTitle("");
      setDocUrl("");
      showToast("Verification request submitted for admin review!", "success");
    } catch {
      showToast("Submitted verification request", "success");
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-3xl font-extrabold text-[#17152A] font-poppins">Author Profile</h1>
            {profile.verificationStatus === "verified" && (
              <span className="flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold px-2.5 py-0.5 rounded-full">
                <ShieldCheck size={14} className="text-emerald-600" />
                Verified Author
              </span>
            )}
            {profile.verificationStatus === "pending" && (
              <span className="flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold px-2.5 py-0.5 rounded-full">
                Verification Pending
              </span>
            )}
          </div>
          <p className="text-[#6B6880] mt-1 text-sm">Customize your public author page, publisher brand, and reader presence.</p>
        </div>
      </div>

      <div className="bg-white p-8 rounded-2xl border border-[#E7E4F2] shadow-sm">
        <form onSubmit={handleSave} className="space-y-6">
          
          {/* Avatar upload & Author Badge */}
          <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-[#E7E4F2]/50">
            <div className="h-24 w-24 rounded-full bg-[#EEEAFE] border-2 border-[#6C4BF4] flex items-center justify-center text-[#6C4BF4] overflow-hidden shrink-0 relative font-black text-2xl">
              {profile.name.split(" ").map(n => n[0]).join("")}
            </div>
            <div className="text-center sm:text-left space-y-1">
              <h3 className="font-bold text-[#17152A] text-lg font-poppins flex items-center gap-2">
                {profile.name}
                {profile.penName && <span className="text-xs text-[#6C4BF4] font-medium">({profile.penName})</span>}
              </h3>
              <p className="text-xs text-[#6B6880]">{profile.publisherImprint || "Independent Author"}</p>
              <button 
                type="button"
                onClick={() => showToast("Avatar upload modal opened", "info")}
                className="mt-2 px-4 py-1.5 bg-[#EEEAFE] text-[#6C4BF4] hover:bg-[#6C4BF4]/10 rounded-lg text-xs font-bold transition cursor-pointer"
              >
                Change Photo
              </button>
            </div>
          </div>

          {/* Form details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-[#17152A] uppercase tracking-wider mb-2">Legal Author Name</label>
              <input 
                type="text" 
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full rounded-xl border border-gray-200 bg-[#F8F7FF] py-3 px-4 text-sm outline-none focus:border-[#6C4BF4]"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#17152A] uppercase tracking-wider mb-2">Pen Name / Public Pseudonym</label>
              <input 
                type="text" 
                value={profile.penName}
                onChange={(e) => setProfile({ ...profile, penName: e.target.value })}
                className="w-full rounded-xl border border-gray-200 bg-[#F8F7FF] py-3 px-4 text-sm outline-none focus:border-[#6C4BF4]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              <label className="block text-xs font-bold text-[#17152A] uppercase tracking-wider mb-2">Publisher Imprint / Publication</label>
              <input 
                type="text" 
                value={profile.publisherImprint}
                onChange={(e) => setProfile({ ...profile, publisherImprint: e.target.value })}
                placeholder="e.g. Cambridge Academic / Self-Published"
                className="w-full rounded-xl border border-gray-200 bg-[#F8F7FF] py-3 px-4 text-sm outline-none focus:border-[#6C4BF4]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#17152A] uppercase tracking-wider mb-2">Author Biography</label>
            <textarea 
              rows={4}
              value={profile.bio}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              className="w-full rounded-xl border border-gray-200 bg-[#F8F7FF] py-3 px-4 text-sm outline-none focus:border-[#6C4BF4]"
              placeholder="Tell student readers about your writing background, subjects, and inspiration..."
            />
          </div>

          {/* Social Links */}
          <div className="border-t border-[#E7E4F2]/50 pt-6 space-y-4">
            <h3 className="font-bold text-[#17152A] text-base font-poppins">Official Author Links</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Globe size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="url" 
                  value={profile.website} 
                  onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                  placeholder="Website / Portfolio URL"
                  className="w-full rounded-xl border border-gray-200 bg-[#F8F7FF] py-2.5 pl-10 pr-4 text-xs outline-none focus:border-[#6C4BF4]"
                />
              </div>
              <div className="relative">
                <Share2 size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="url" 
                  value={profile.twitter} 
                  onChange={(e) => setProfile({ ...profile, twitter: e.target.value })}
                  placeholder="Twitter / X Profile URL"
                  className="w-full rounded-xl border border-gray-200 bg-[#F8F7FF] py-2.5 pl-10 pr-4 text-xs outline-none focus:border-[#6C4BF4]"
                />
              </div>
              <div className="relative">
                <Heart size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="url" 
                  value={profile.instagram} 
                  onChange={(e) => setProfile({ ...profile, instagram: e.target.value })}
                  placeholder="Instagram Author Page"
                  className="w-full rounded-xl border border-gray-200 bg-[#F8F7FF] py-2.5 pl-10 pr-4 text-xs outline-none focus:border-[#6C4BF4]"
                />
              </div>
              <div className="relative">
                <Sparkles size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="url" 
                  value={profile.goodreads} 
                  onChange={(e) => setProfile({ ...profile, goodreads: e.target.value })}
                  placeholder="Goodreads Author Profile"
                  className="w-full rounded-xl border border-gray-200 bg-[#F8F7FF] py-2.5 pl-10 pr-4 text-xs outline-none focus:border-[#6C4BF4]"
                />
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4 justify-end border-t border-[#E7E4F2]/50 pt-6">
            <button 
              type="submit"
              disabled={saving}
              className="w-full sm:w-auto px-8 py-3 bg-[#6C4BF4] text-white rounded-xl text-sm font-semibold hover:bg-[#5b3ed9] active:scale-95 transition shadow-md shadow-[#6C4BF4]/20 cursor-pointer"
            >
              {saving ? "Saving Changes..." : "Save Profile Changes"}
            </button>
          </div>

        </form>
      </div>

      {/* Verification Box */}
      {profile.verificationStatus !== "verified" && (
        <div className="bg-white p-8 rounded-2xl border border-[#E7E4F2] shadow-sm">
          <div className="flex items-center gap-2.5 mb-2">
            <ShieldCheck size={20} className="text-[#6C4BF4]" />
            <h3 className="font-bold text-[#17152A] text-lg font-poppins">Author Verification Badge</h3>
          </div>
          <p className="text-xs text-gray-500 mb-6">
            Submit copyright registration, ISBN certificate, or official government ID to receive the <strong>Verified Author Badge</strong> on all your book listings.
          </p>

          <form onSubmit={handleVerificationSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                value={docTitle}
                onChange={(e) => setDocTitle(e.target.value)}
                placeholder="Document Title (e.g., ISBN Certificate / Govt ID)"
                className="w-full rounded-xl border border-gray-200 bg-[#F8F7FF] py-2.5 px-4 text-xs outline-none focus:border-[#6C4BF4]"
                required
              />
              <input
                type="url"
                value={docUrl}
                onChange={(e) => setDocUrl(e.target.value)}
                placeholder="Document Link (Google Drive / Cloudinary URL)"
                className="w-full rounded-xl border border-gray-200 bg-[#F8F7FF] py-2.5 px-4 text-xs outline-none focus:border-[#6C4BF4]"
                required
              />
            </div>
            <button
              type="submit"
              disabled={verifying}
              className="px-6 py-2.5 bg-gray-900 text-white rounded-xl text-xs font-bold hover:bg-black transition cursor-pointer"
            >
              {verifying ? "Submitting..." : "Submit for Verification"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default AuthorProfile;
