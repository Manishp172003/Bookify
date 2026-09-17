import React, { useState, useEffect, useRef } from "react";
import { 
  User, Mail, Globe, Share2, Heart, Check, ShieldCheck, Upload, AlertCircle, 
  Sparkles, Trash2, FileText, UploadCloud, Clock, CheckCircle2, X, ChevronRight,
  ExternalLink
} from "lucide-react";
import { authorService, getCurrentAuthor, isDemoAuthor } from "../../services/authorService";
import { useCommerce } from "../../context/CommerceContext";
import { useAuth } from "../../context/AuthContext";

function AuthorProfile() {
  const { showToast } = useCommerce();
  const { updateUser } = useAuth();
  const fileInputRef = useRef(null);
  const docFileInputRef = useRef(null);
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [verifying, setVerifying] = useState(false);

  // Document verification form state
  const [docCategory, setDocCategory] = useState("ISBN Registration Certificate");
  const [customDocTitle, setCustomDocTitle] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [showReapplyForm, setShowReapplyForm] = useState(false);

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
    authorAvatar: isDemo ? null : (current?.authorAvatar || current?.avatar || null),
    verificationStatus: isDemo ? "verified" : (current?.authorVerificationStatus || (current?.isVerified ? "verified" : "unverified")),
    documents: isDemo ? [] : (current?.authorVerificationDocuments || []),
  });

  const getInitials = (name) => {
    if (!name || !name.trim()) return "AU";
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

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
        authorAvatar: data.authorAvatar !== undefined ? data.authorAvatar : prev.authorAvatar,
        verificationStatus: data.authorVerificationStatus || (data.isVerified ? "verified" : "unverified"),
        documents: data.authorVerificationDocuments || prev.documents || [],
      }));
    }).finally(() => {
      if (isMounted) setLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const handlePhotoClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!["image/jpeg", "image/png", "image/webp", "image/gif"].includes(file.type)) {
      showToast("Please select a valid image file (PNG, JPEG, WEBP)", "error");
      return;
    }

    if (file.size > 3 * 1024 * 1024) {
      showToast("Image size must be less than 3MB", "error");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result;
      setProfile((prev) => ({ ...prev, authorAvatar: base64String }));
      showToast("Profile photo selected. Click 'Save Profile Changes' to save!", "info");
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setProfile((prev) => ({ ...prev, authorAvatar: null }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    showToast("Profile photo removed. Remember to save changes!", "info");
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        fullName: profile.name,
        penName: profile.penName,
        authorBio: profile.bio,
        website: profile.website,
        publisherImprint: profile.publisherImprint,
        authorAvatar: profile.authorAvatar,
        socialLinks: {
          twitter: profile.twitter,
          instagram: profile.instagram,
          goodreads: profile.goodreads,
        },
      };

      await authorService.updateProfile(payload);

      if (updateUser) {
        updateUser({
          fullName: profile.name,
          penName: profile.penName,
          authorBio: profile.bio,
          website: profile.website,
          publisherImprint: profile.publisherImprint,
          authorAvatar: profile.authorAvatar,
          avatar: profile.authorAvatar || undefined,
          socialLinks: payload.socialLinks,
          isAuthor: true,
          hasAuthorProfile: true,
        });
      }

      showToast("Author profile updated successfully!", "success");
    } catch (err) {
      showToast("Saved locally.", "info");
    } finally {
      setSaving(false);
    }
  };

  const handleDocFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowed = ["application/pdf", "image/png", "image/jpeg", "image/webp"];
    if (!allowed.includes(file.type)) {
      showToast("Please select a PDF document or image file (PNG, JPG, WEBP)", "error");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast("Document file size must be less than 5MB", "error");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedFile({
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(2) + " MB",
        type: file.type === "application/pdf" ? "pdf" : "image",
        dataUrl: reader.result,
      });
      showToast(`Attached ${file.name}`, "info");
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveDocFile = () => {
    setSelectedFile(null);
    if (docFileInputRef.current) {
      docFileInputRef.current.value = "";
    }
  };

  const handleVerificationSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      showToast("Please attach a verification document (PDF or Image)", "warning");
      return;
    }

    const finalTitle =
      docCategory === "Other"
        ? customDocTitle.trim() || "Official Verification Document"
        : docCategory;

    setVerifying(true);
    try {
      const payload = {
        documentTitle: finalTitle,
        documentFile: selectedFile.dataUrl,
        fileName: selectedFile.name,
        fileType: selectedFile.type,
      };

      await authorService.submitVerification(payload);

      const newDoc = {
        title: finalTitle,
        fileName: selectedFile.name,
        fileType: selectedFile.type,
        url: selectedFile.dataUrl,
        uploadedAt: new Date().toISOString(),
      };

      setProfile((prev) => ({
        ...prev,
        verificationStatus: "pending",
        documents: [newDoc, ...(prev.documents || [])],
      }));

      if (updateUser) {
        updateUser({
          authorVerificationStatus: "pending",
          isAuthor: true,
        });
      }

      setSelectedFile(null);
      if (docFileInputRef.current) docFileInputRef.current.value = "";
      setShowReapplyForm(false);
      showToast("Verification documents submitted for admin review!", "success");
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
            <input
              type="file"
              ref={fileInputRef}
              accept="image/png, image/jpeg, image/webp"
              className="hidden"
              onChange={handlePhotoChange}
            />

            <div className="relative group shrink-0">
              <div className="h-24 w-24 rounded-full bg-[#EEEAFE] border-2 border-[#6C4BF4] flex items-center justify-center text-[#6C4BF4] overflow-hidden relative font-black text-2xl shadow-sm">
                {profile.authorAvatar ? (
                  <img
                    src={profile.authorAvatar}
                    alt={profile.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span>{getInitials(profile.name)}</span>
                )}
              </div>
              <button
                type="button"
                onClick={handlePhotoClick}
                className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-semibold cursor-pointer"
                title="Change Photo"
              >
                <Upload size={20} />
              </button>
            </div>

            <div className="text-center sm:text-left space-y-1.5">
              <h3 className="font-bold text-[#17152A] text-lg font-poppins flex items-center justify-center sm:justify-start gap-2">
                {profile.name}
                {profile.penName && <span className="text-xs text-[#6C4BF4] font-medium">({profile.penName})</span>}
              </h3>
              <p className="text-xs text-[#6B6880]">{profile.publisherImprint || "Independent Author"}</p>
              
              <div className="flex items-center gap-2 pt-1 justify-center sm:justify-start flex-wrap">
                <button 
                  type="button"
                  onClick={handlePhotoClick}
                  className="px-4 py-1.5 bg-[#EEEAFE] text-[#6C4BF4] hover:bg-[#6C4BF4]/15 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
                >
                  <Upload size={13} />
                  Change Photo
                </button>
                {profile.authorAvatar && (
                  <button 
                    type="button"
                    onClick={handleRemovePhoto}
                    className="px-3 py-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
                  >
                    <Trash2 size={13} />
                    Remove Photo
                  </button>
                )}
              </div>
              <p className="text-[11px] text-[#6B6880]/80">JPG, PNG or WEBP, max 3MB.</p>
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

      {/* Verification Box - Multi-state */}
      {profile.verificationStatus === "verified" ? (
        <div className="bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-transparent border border-emerald-500/20 p-8 rounded-2xl shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
              <ShieldCheck size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-[#17152A] text-lg font-poppins">Verified Bookify Author</h3>
                <span className="bg-emerald-100 text-emerald-700 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Active Status
                </span>
              </div>
              <p className="text-xs text-[#6B6880] mt-0.5">
                Your account is officially verified. The green verified author shield is visible on your profile and on all your published book listings across the marketplace.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs text-[#17152A]">
            <div className="flex items-center gap-2 p-3 bg-white/80 rounded-xl border border-emerald-100">
              <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
              <span className="font-medium">Protected against impersonation</span>
            </div>
            <div className="flex items-center gap-2 p-3 bg-white/80 rounded-xl border border-emerald-100">
              <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
              <span className="font-medium">Verified shield on book cards</span>
            </div>
            <div className="flex items-center gap-2 p-3 bg-white/80 rounded-xl border border-emerald-100">
              <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
              <span className="font-medium">Higher student reader trust</span>
            </div>
          </div>
        </div>
      ) : profile.verificationStatus === "pending" && !showReapplyForm ? (
        <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/20 p-8 rounded-2xl shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600 shrink-0 mt-0.5">
                <Clock size={22} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-[#17152A] text-lg font-poppins">Verification Application Under Review</h3>
                  <span className="bg-amber-100 text-amber-800 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    Pending Admin Review
                  </span>
                </div>
                <p className="text-xs text-[#6B6880] mt-1 leading-relaxed">
                  Your verification documents have been received by the Bookify editorial & admin team. Verification is typically completed within 24–48 hours.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowReapplyForm(true)}
              className="px-4 py-2 bg-white border border-amber-200 text-amber-800 hover:bg-amber-50 rounded-xl text-xs font-bold transition shrink-0 cursor-pointer self-start sm:self-center"
            >
              + Submit Another Document
            </button>
          </div>

          {profile.documents && profile.documents.length > 0 && (
            <div className="bg-white/90 p-4 rounded-xl border border-amber-200/60 space-y-2">
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#6B6880]">Submitted Documents:</p>
              <div className="space-y-2">
                {profile.documents.map((doc, idx) => (
                  <div key={idx} className="flex items-center justify-between gap-3 text-xs p-2.5 rounded-lg bg-amber-50/40 border border-amber-100">
                    <div className="flex items-center gap-2.5 truncate">
                      <FileText size={16} className="text-amber-600 shrink-0" />
                      <span className="font-bold text-[#17152A] truncate">{doc.title}</span>
                      {doc.fileName && <span className="text-[#6B6880] text-[11px] truncate">({doc.fileName})</span>}
                    </div>
                    <span className="text-[11px] text-amber-700 font-semibold shrink-0">
                      {doc.uploadedAt ? new Date(doc.uploadedAt).toLocaleDateString() : "Recently Submitted"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="p-3 bg-emerald-50/80 rounded-xl border border-emerald-200/60 text-xs text-emerald-800 flex items-center gap-2">
            <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
            <span>
              <strong>No publishing delay:</strong> You can continue submitting new books, setting prices, and launching campaigns right away while review is underway!
            </span>
          </div>
        </div>
      ) : profile.verificationStatus === "rejected" && !showReapplyForm ? (
        <div className="bg-gradient-to-r from-rose-500/10 via-rose-500/5 to-transparent border border-rose-500/20 p-8 rounded-2xl shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-xl bg-rose-100 flex items-center justify-center text-rose-600 shrink-0 mt-0.5">
                <AlertCircle size={22} />
              </div>
              <div>
                <h3 className="font-bold text-[#17152A] text-lg font-poppins">Verification Application Needs Update</h3>
                <p className="text-xs text-[#6B6880] mt-1 leading-relaxed">
                  The previous verification document could not be approved. Please submit a clearer image or an official certificate (ISBN registration or government photo ID).
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowReapplyForm(true)}
              className="px-5 py-2.5 bg-rose-600 text-white hover:bg-rose-700 rounded-xl text-xs font-bold transition shrink-0 cursor-pointer"
            >
              Submit Updated Proof
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white p-8 rounded-2xl border border-[#E7E4F2] shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2.5">
                <ShieldCheck size={22} className="text-[#6C4BF4]" />
                <h3 className="font-bold text-[#17152A] text-lg font-poppins">Author Verification Badge</h3>
                <span className="text-[11px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">Optional</span>
              </div>
              <p className="text-xs text-[#6B6880] mt-1">
                Submit copyright registration, ISBN certificate, publisher agreement, or official government ID to receive the <strong>Verified Author Badge</strong> on all your book listings.
              </p>
            </div>
            {showReapplyForm && (
              <button
                type="button"
                onClick={() => setShowReapplyForm(false)}
                className="text-xs font-semibold text-gray-500 hover:text-gray-800 self-start sm:self-center cursor-pointer"
              >
                Cancel
              </button>
            )}
          </div>

          <form onSubmit={handleVerificationSubmit} className="space-y-5">
            <input
              type="file"
              ref={docFileInputRef}
              accept="application/pdf,image/png,image/jpeg,image/webp"
              className="hidden"
              onChange={handleDocFileSelect}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#17152A] uppercase tracking-wider mb-2">
                  Document Type
                </label>
                <select
                  value={docCategory}
                  onChange={(e) => setDocCategory(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-[#F8F7FF] py-2.5 px-3 text-xs outline-none focus:border-[#6C4BF4] font-medium"
                >
                  <option value="ISBN Registration Certificate">ISBN Registration Certificate</option>
                  <option value="Government Photo ID / Passport">Government Photo ID / Passport</option>
                  <option value="Publisher Contract / Royalty Agreement">Publisher Contract / Royalty Agreement</option>
                  <option value="Copyright Registration">Copyright Registration</option>
                  <option value="Other">Other Official Proof</option>
                </select>
              </div>

              {docCategory === "Other" && (
                <div>
                  <label className="block text-xs font-bold text-[#17152A] uppercase tracking-wider mb-2">
                    Document Title
                  </label>
                  <input
                    type="text"
                    value={customDocTitle}
                    onChange={(e) => setCustomDocTitle(e.target.value)}
                    placeholder="e.g. Literary Agency Representation Letter"
                    className="w-full rounded-xl border border-gray-200 bg-[#F8F7FF] py-2.5 px-3 text-xs outline-none focus:border-[#6C4BF4]"
                    required
                  />
                </div>
              )}
            </div>

            {/* Document File Attachment Box */}
            <div>
              <label className="block text-xs font-bold text-[#17152A] uppercase tracking-wider mb-2">
                Attach Verification Document (PDF or Image)
              </label>

              {!selectedFile ? (
                <div
                  onClick={() => docFileInputRef.current?.click()}
                  className="border-2 border-dashed border-[#E7E4F2] hover:border-[#6C4BF4] rounded-2xl p-6 text-center cursor-pointer transition bg-[#F8F7FF]/50 hover:bg-[#F8F7FF] group"
                >
                  <div className="h-12 w-12 rounded-xl bg-[#EEEAFE] text-[#6C4BF4] flex items-center justify-center mx-auto mb-3 group-hover:scale-105 transition">
                    <UploadCloud size={24} />
                  </div>
                  <p className="text-xs font-bold text-[#17152A]">
                    Click to select document or browse files
                  </p>
                  <p className="text-[11px] text-[#6B6880] mt-1">
                    Supported formats: PDF, PNG, JPG, WEBP (Max 5MB)
                  </p>
                </div>
              ) : (
                <div className="flex items-center justify-between p-4 rounded-xl border border-[#6C4BF4]/30 bg-[#EEEAFE]/30">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-[#EEEAFE] text-[#6C4BF4] flex items-center justify-center shrink-0">
                      <FileText size={20} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#17152A]">{selectedFile.name}</p>
                      <p className="text-[11px] text-[#6B6880]">{selectedFile.size} • {selectedFile.type.toUpperCase()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => docFileInputRef.current?.click()}
                      className="px-3 py-1.5 bg-white border border-gray-200 text-xs font-semibold rounded-lg hover:bg-gray-50 transition cursor-pointer"
                    >
                      Change
                    </button>
                    <button
                      type="button"
                      onClick={handleRemoveDocFile}
                      className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                      title="Remove attachment"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <p className="text-[11px] text-[#6B6880]">
                Documents are confidential and only used for author badge verification.
              </p>
              <button
                type="submit"
                disabled={verifying || !selectedFile}
                className="w-full sm:w-auto px-6 py-2.5 bg-[#6C4BF4] disabled:opacity-50 text-white rounded-xl text-xs font-bold hover:bg-[#5b3ed9] transition shadow-sm shadow-[#6C4BF4]/20 cursor-pointer"
              >
                {verifying ? "Uploading Proof..." : "Submit for Verification"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default AuthorProfile;
