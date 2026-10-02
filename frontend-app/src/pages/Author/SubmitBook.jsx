import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  ChevronRight, 
  ChevronLeft, 
  Upload, 
  DollarSign, 
  CheckCircle,
  X,
  Image as ImageIcon,
  FileText,
  Trash2,
  Sparkles,
  ShieldCheck,
  BookOpen,
  ArrowRight,
  Eye,
  Check
} from "lucide-react";
import { authorService, getCurrentAuthor } from "../../services/authorService";

const SAMPLE_COVERS = [
  "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=600",
  "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=600",
  "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=600",
  "https://images.unsplash.com/photo-1532012164546-f432f2e3edd3?auto=format&fit=crop&q=80&w=600"
];

export default function SubmitBook() {
  const navigate = useNavigate();
  const currentAuthor = getCurrentAuthor() || {};
  const defaultAuthorName = currentAuthor.penName || currentAuthor.fullName || "Author";

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    authorName: defaultAuthorName,
    category: "Self Help",
    customCategory: "",
    subCategory: "Mental Wellness",
    customSubCategory: "",
    description: "",
    tags: ["Mindfulness", "Self Help", "Personal Growth"],
    newTag: "",
    language: "English",
    customLanguage: "",
    bookType: "Paperback",
    coverPreview: "",
    coverFileName: "",
    coverFileSize: "",
    manuscriptFile: null,
    manuscriptFileName: "",
    manuscriptFileSize: "",
    sellingPrice: "",
    rentalPrice: "",
    allowExchanges: true,
    termsAccepted: false
  });

  const [submittedBook, setSubmittedBook] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const coverInputRef = useRef(null);
  const manuscriptInputRef = useRef(null);
  const [isCoverDragging, setIsCoverDragging] = useState(false);
  const [isManuscriptDragging, setIsManuscriptDragging] = useState(false);

  // Quick Demo Samples for Testing
  const handleUseSampleCover = (sampleUrl = SAMPLE_COVERS[0]) => {
    setFormData((prev) => ({
      ...prev,
      coverPreview: sampleUrl,
      coverFileName: "author_sample_cover.jpg",
      coverFileSize: "1.2 MB"
    }));
  };

  const handleUseSampleManuscript = () => {
    setFormData((prev) => ({
      ...prev,
      manuscriptFile: { name: "The_Silent_Mind_Final_Draft.pdf", size: 3670016, type: "application/pdf" },
      manuscriptFileName: "The_Silent_Mind_Final_Draft.pdf",
      manuscriptFileSize: "3.5 MB"
    }));
  };

  const handleAutoFillDemo = () => {
    setFormData({
      title: "The Silent Mind: Art of Mental Peace",
      subtitle: "A practical mindfulness guide for university students",
      authorName: defaultAuthorName,
      category: "Self Help",
      customCategory: "",
      subCategory: "Mental Wellness",
      customSubCategory: "",
      description: "A transformative exploration of meditation, mental clarity, and focus for high-pressure academic lifestyles. Written by campus authors for modern students.",
      tags: ["Mindfulness", "Self Help", "Personal Growth", "Study Habits"],
      newTag: "",
      language: "English",
      customLanguage: "",
      bookType: "Paperback",
      coverPreview: SAMPLE_COVERS[0],
      coverFileName: "the_silent_mind_cover.jpg",
      coverFileSize: "1.4 MB",
      manuscriptFile: { name: "The_Silent_Mind_Final_Draft.pdf", size: 3670016, type: "application/pdf" },
      manuscriptFileName: "The_Silent_Mind_Final_Draft.pdf",
      manuscriptFileSize: "3.5 MB",
      sellingPrice: "349",
      rentalPrice: "39",
      allowExchanges: true,
      termsAccepted: true
    });
  };

  // File Handlers
  const handleCoverFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Please upload a valid image file (PNG, JPG, JPEG, or WEBP).");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      alert("Cover image file size must be less than 8MB.");
      return;
    }
    const formattedSize =
      file.size > 1024 * 1024
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
        : `${Math.round(file.size / 1024)} KB`;

    const reader = new FileReader();
    reader.onload = (e) => {
      setFormData((prev) => ({
        ...prev,
        coverPreview: e.target.result,
        coverFileName: file.name,
        coverFileSize: formattedSize
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleManuscriptFile = (file) => {
    if (!file) return;
    const ext = file.name.split(".").pop().toLowerCase();
    const validExtensions = ["pdf", "epub", "docx", "mobi"];
    if (!validExtensions.includes(ext) && !file.type.includes("pdf")) {
      alert("Please upload a valid manuscript file (.pdf, .epub, or .docx).");
      return;
    }
    const formattedSize =
      file.size > 1024 * 1024
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
        : `${Math.round(file.size / 1024)} KB`;

    setFormData((prev) => ({
      ...prev,
      manuscriptFile: file,
      manuscriptFileName: file.name,
      manuscriptFileSize: formattedSize
    }));
  };

  const removeCover = (e) => {
    e.stopPropagation();
    setFormData((prev) => ({
      ...prev,
      coverPreview: "",
      coverFileName: "",
      coverFileSize: ""
    }));
    if (coverInputRef.current) coverInputRef.current.value = "";
  };

  const removeManuscript = (e) => {
    e.stopPropagation();
    setFormData((prev) => ({
      ...prev,
      manuscriptFile: null,
      manuscriptFileName: "",
      manuscriptFileSize: ""
    }));
    if (manuscriptInputRef.current) manuscriptInputRef.current.value = "";
  };

  // Step Validation & Navigation
  const handleNext = () => {
    if (step === 1) {
      if (!formData.title.trim() || !formData.description.trim()) {
        alert("Please fill in Book Title and Description before continuing.");
        return;
      }
      if (formData.category === "Other" && !formData.customCategory.trim()) {
        alert("Please enter your custom Category.");
        return;
      }
      if (formData.subCategory === "Other" && !formData.customSubCategory.trim()) {
        alert("Please enter your custom Sub Category.");
        return;
      }
      if (formData.language === "Other" && !formData.customLanguage.trim()) {
        alert("Please enter your custom Language.");
        return;
      }
    }
    if (step === 2) {
      if (!formData.coverPreview) {
        alert("Please upload a Book Cover Image before continuing.");
        return;
      }
      if (!formData.manuscriptFileName) {
        alert("Please upload your Manuscript File (PDF or EPUB) before continuing.");
        return;
      }
    }
    if (step === 3) {
      const priceNum = Number(formData.sellingPrice);
      if (!formData.sellingPrice || isNaN(priceNum) || priceNum <= 0) {
        alert("Please specify a valid Selling Price in INR.");
        return;
      }
    }
    setStep((prev) => Math.min(prev + 1, 4));
  };

  const handlePrev = () => setStep((prev) => Math.max(prev - 1, 1));

  // Tag Helpers
  const addTag = () => {
    const trimmed = formData.newTag.trim();
    if (trimmed && !formData.tags.includes(trimmed)) {
      setFormData({
        ...formData,
        tags: [...formData.tags, trimmed],
        newTag: ""
      });
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((t) => t !== tagToRemove)
    });
  };

  // Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.termsAccepted) {
      alert("Please accept the original author publishing terms to continue.");
      return;
    }

    setSubmitting(true);
    setSubmitError("");

    const bookPayload = {
      title: formData.title.trim(),
      subtitle: formData.subtitle.trim(),
      author: formData.authorName.trim() || defaultAuthorName,
      category: formData.category === "Other" ? formData.customCategory.trim() : formData.category,
      subCategory: formData.subCategory === "Other" ? formData.customSubCategory.trim() : formData.subCategory,
      language: formData.language === "Other" ? formData.customLanguage.trim() : formData.language,
      tags: formData.tags,
      description: formData.description.trim(),
      bookType: formData.bookType,
      price: Number(formData.sellingPrice) || 0,
      originalPrice: Math.round((Number(formData.sellingPrice) || 0) * 1.25),
      rentalPrice: Number(formData.rentalPrice) || 0,
      allowExchanges: formData.allowExchanges,
      images: formData.coverPreview
        ? [formData.coverPreview]
        : ["https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop"],
      manuscriptUrl: formData.manuscriptFileName,
      status: "Active",
      isAuthorOriginal: true,
      isPublisherListing: true
    };

    try {
      const created = await authorService.submitBook(bookPayload);
      setSubmittedBook(created);
      setSubmitted(true);
    } catch (err) {
      console.error("Submit book error:", err);
      setSubmitError(err.message || "Failed to publish manuscript. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const stepsHeader = [
    { num: 1, label: "Book Info" },
    { num: 2, label: "Cover & Manuscript" },
    { num: 3, label: "Set Price & Rights" },
    { num: 4, label: "Preview & Submit" }
  ];

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto bg-white p-8 sm:p-12 rounded-3xl border border-[#E7E4F2] shadow-xl text-center space-y-6 animate-fade-in-up">
        <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-[#E8F8EE] text-[#22C55E] mb-2 shadow-inner">
          <CheckCircle size={44} />
        </div>
        <h2 className="text-3xl font-extrabold text-[#17152A] font-poppins">Book Published Successfully!</h2>
        <p className="text-[#6B6880] max-w-md mx-auto text-sm leading-relaxed">
          Your manuscript <span className="font-bold text-[#17152A]">"{formData.title}"</span> by <span className="font-bold text-[#6C4BF4]">{formData.authorName}</span> is now active on the Bookify marketplace under <span className="font-bold text-[#17152A]">Author Originals</span>.
        </p>

        {formData.coverPreview && (
          <div className="mx-auto w-36 h-52 rounded-2xl overflow-hidden shadow-lg border border-gray-100 my-4">
            <img src={formData.coverPreview} alt="Cover Preview" className="w-full h-full object-cover" />
          </div>
        )}

        <div className="pt-4 flex flex-col sm:flex-row justify-center gap-3">
          <Link
            to={`/explore?search=${encodeURIComponent(formData.title)}`}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-[#6C4BF4] text-white rounded-xl text-sm font-bold hover:bg-[#5b3ed9] transition shadow-md shadow-[#6C4BF4]/20"
          >
            <Eye size={16} />
            <span>View on Explore Page</span>
          </Link>
          <Link
            to="/author/my-books"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-[#E7E4F2] text-[#17152A] rounded-xl text-sm font-semibold hover:bg-[#F8F7FF] transition"
          >
            <BookOpen size={16} />
            <span>Go to Author Inventory</span>
          </Link>
          <button 
            type="button"
            onClick={() => {
              setSubmitted(false);
              setStep(1);
              setFormData({
                title: "",
                subtitle: "",
                authorName: defaultAuthorName,
                category: "Self Help",
                customCategory: "",
                subCategory: "Mental Wellness",
                customSubCategory: "",
                description: "",
                tags: ["Mindfulness", "Self Help"],
                newTag: "",
                language: "English",
                customLanguage: "",
                bookType: "Paperback",
                coverPreview: "",
                coverFileName: "",
                coverFileSize: "",
                manuscriptFile: null,
                manuscriptFileName: "",
                manuscriptFileSize: "",
                sellingPrice: "",
                rentalPrice: "",
                allowExchanges: true,
                termsAccepted: false
              });
            }}
            className="px-5 py-3 text-xs font-semibold text-gray-500 hover:text-gray-800 transition"
          >
            + Publish Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#6C4BF4] mb-1">
            <Sparkles size={14} />
            <span>Independent Author Publishing Suite</span>
          </div>
          <h1 className="text-3xl font-extrabold text-[#17152A] font-poppins">Publish New Book / Manuscript</h1>
          <p className="text-[#6B6880] mt-1 text-sm">Upload your original work, configure royalties, and list directly across campus libraries.</p>
        </div>

        <button
          type="button"
          onClick={handleAutoFillDemo}
          className="self-start sm:self-center shrink-0 flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#EEEAFE] hover:bg-[#E0D8FD] text-xs font-bold text-[#6C4BF4] border border-[#6C4BF4]/30 shadow-xs transition cursor-pointer hover:scale-102"
        >
          <Sparkles size={14} />
          <span>Auto-Fill Demo Book</span>
        </button>
      </div>

      {/* Progress Tracker */}
      <div className="bg-white p-6 rounded-2xl border border-[#E7E4F2] shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {stepsHeader.map((s) => (
            <div key={s.num} className="flex items-center gap-3">
              <div
                className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  step === s.num 
                    ? "bg-[#6C4BF4] text-white ring-4 ring-[#6C4BF4]/20" 
                    : step > s.num 
                      ? "bg-[#22C55E] text-white" 
                      : "bg-[#F8F7FF] text-[#6B6880] border border-[#E7E4F2]"
                }`}
              >
                {step > s.num ? <Check size={14} strokeWidth={3} /> : s.num}
              </div>
              <span className={`text-xs font-semibold ${step === s.num ? "text-[#17152A]" : "text-[#6B6880]"}`}>
                {s.label}
              </span>
              {s.num < 4 && <ChevronRight size={14} className="text-[#6B6880]/30 hidden md:block" />}
            </div>
          ))}
        </div>
      </div>

      {/* Main Wizard Form Card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E7E4F2] shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* STEP 1: Book Info */}
          {step === 1 && (
            <div className="space-y-5 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-[#17152A] uppercase tracking-wider mb-2">Book Title*</label>
                  <input 
                    type="text" 
                    placeholder="e.g. The Silent Mind" 
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 bg-[#F8F7FF] py-3 px-4 text-sm outline-none transition focus:border-[#6C4BF4] focus:ring-4 focus:ring-[#6C4BF4]/10"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#17152A] uppercase tracking-wider mb-2">Subtitle / Tagline</label>
                  <input 
                    type="text" 
                    placeholder="e.g. A Practical Guide to Mental Clarity" 
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 bg-[#F8F7FF] py-3 px-4 text-sm outline-none transition focus:border-[#6C4BF4] focus:ring-4 focus:ring-[#6C4BF4]/10"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#17152A] uppercase tracking-wider mb-2">Author Pen Name*</label>
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Your Published Author Name" 
                    value={formData.authorName}
                    onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 bg-[#F8F7FF] py-3 pl-4 pr-10 text-sm outline-none transition focus:border-[#6C4BF4] focus:ring-4 focus:ring-[#6C4BF4]/10"
                    required
                  />
                  <ShieldCheck size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-500" />
                </div>
                <p className="text-[11px] text-gray-500 mt-1">This author name will appear on the book cover and marketplace listing.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-[#17152A] uppercase tracking-wider mb-2">Category*</label>
                  <select 
                    value={formData.category} 
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 bg-[#F8F7FF] py-3 px-4 text-sm outline-none transition focus:border-[#6C4BF4]"
                  >
                    <option>Self Help</option>
                    <option>Fiction & Novels</option>
                    <option>Technology & Coding</option>
                    <option>Engineering & Science</option>
                    <option>Business & Startups</option>
                    <option>Poetry & Literature</option>
                    <option value="Other">Other (Add Custom)</option>
                  </select>
                  {formData.category === "Other" && (
                    <input 
                      type="text"
                      placeholder="Enter custom category"
                      value={formData.customCategory}
                      onChange={(e) => setFormData({ ...formData, customCategory: e.target.value })}
                      className="w-full mt-2 rounded-xl border border-gray-200 bg-[#F8F7FF] py-2.5 px-4 text-sm outline-none focus:border-[#6C4BF4]"
                      required
                    />
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#17152A] uppercase tracking-wider mb-2">Sub-Category</label>
                  <select 
                    value={formData.subCategory} 
                    onChange={(e) => setFormData({ ...formData, subCategory: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 bg-[#F8F7FF] py-3 px-4 text-sm outline-none transition focus:border-[#6C4BF4]"
                  >
                    <option>Mental Wellness</option>
                    <option>Philosophy</option>
                    <option>Psychology</option>
                    <option>Productivity & Habits</option>
                    <option>Career Growth</option>
                    <option value="Other">Other (Add Custom)</option>
                  </select>
                  {formData.subCategory === "Other" && (
                    <input 
                      type="text"
                      placeholder="Enter custom sub-category"
                      value={formData.customSubCategory}
                      onChange={(e) => setFormData({ ...formData, customSubCategory: e.target.value })}
                      className="w-full mt-2 rounded-xl border border-gray-200 bg-[#F8F7FF] py-2.5 px-4 text-sm outline-none focus:border-[#6C4BF4]"
                    />
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#17152A] uppercase tracking-wider mb-2">Description / Book Synopsis*</label>
                <textarea 
                  rows={4}
                  placeholder="Give readers an engaging overview of the book, chapters, and core takeaways..." 
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 bg-[#F8F7FF] py-3 px-4 text-sm outline-none transition focus:border-[#6C4BF4] focus:ring-4 focus:ring-[#6C4BF4]/10"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#17152A] uppercase tracking-wider mb-2">Tags / Topics</label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {formData.tags.map((tag) => (
                    <span key={tag} className="flex items-center gap-1 bg-[#EEEAFE] text-[#6C4BF4] px-3 py-1 rounded-full text-xs font-semibold">
                      <span>{tag}</span>
                      <button type="button" onClick={() => removeTag(tag)} className="cursor-pointer hover:text-red-500">
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Add tag (e.g. Motivation)" 
                    value={formData.newTag}
                    onChange={(e) => setFormData({ ...formData, newTag: e.target.value })}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                    className="rounded-xl border border-gray-200 bg-[#F8F7FF] py-2 px-4 text-sm outline-none transition focus:border-[#6C4BF4] w-48"
                  />
                  <button 
                    type="button" 
                    onClick={addTag}
                    className="px-4 py-2 bg-[#F8F7FF] border border-gray-200 text-[#17152A] rounded-xl text-sm font-semibold hover:bg-gray-100 transition cursor-pointer"
                  >
                    + Add
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-[#17152A] uppercase tracking-wider mb-2">Language*</label>
                  <select 
                    value={formData.language} 
                    onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 bg-[#F8F7FF] py-3 px-4 text-sm outline-none transition focus:border-[#6C4BF4]"
                  >
                    <option>English</option>
                    <option>Hindi</option>
                    <option>Marathi</option>
                    <option>Spanish</option>
                    <option>German</option>
                    <option value="Other">Other (Add Custom)</option>
                  </select>
                  {formData.language === "Other" && (
                    <input 
                      type="text"
                      placeholder="Enter custom language"
                      value={formData.customLanguage}
                      onChange={(e) => setFormData({ ...formData, customLanguage: e.target.value })}
                      className="w-full mt-2 rounded-xl border border-gray-200 bg-[#F8F7FF] py-2.5 px-4 text-sm outline-none focus:border-[#6C4BF4]"
                    />
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#17152A] uppercase tracking-wider mb-2">Book Format / Type*</label>
                  <select 
                    value={formData.bookType} 
                    onChange={(e) => setFormData({ ...formData, bookType: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 bg-[#F8F7FF] py-3 px-4 text-sm outline-none transition focus:border-[#6C4BF4]"
                  >
                    <option value="Paperback">Paperback (Print on Demand)</option>
                    <option value="Hardcover">Hardcover Edition</option>
                    <option value="eBook">Digital eBook (EPUB/PDF)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Upload Cover & Manuscript */}
          {step === 2 && (
            <div className="space-y-6 animate-fade-in">
              {/* Cover Image Upload */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold text-[#17152A] uppercase tracking-wider">
                    Book Cover Image* (High-Res Front Cover)
                  </label>
                  <button
                    type="button"
                    onClick={() => handleUseSampleCover()}
                    className="text-xs font-bold text-[#6C4BF4] bg-[#EEEAFE] hover:bg-[#E0D8FD] px-2.5 py-1 rounded-lg transition cursor-pointer flex items-center gap-1 shadow-2xs"
                  >
                    <Sparkles size={12} />
                    <span>Use Sample Cover</span>
                  </button>
                </div>
                
                {/* Hidden native input */}
                <input 
                  type="file"
                  ref={coverInputRef}
                  accept="image/png, image/jpeg, image/jpg, image/webp"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleCoverFile(e.target.files[0]);
                    }
                  }}
                  className="hidden"
                />

                {!formData.coverPreview ? (
                  <>
                    <div 
                      onClick={() => coverInputRef.current && coverInputRef.current.click()}
                      onDragOver={(e) => { e.preventDefault(); setIsCoverDragging(true); }}
                      onDragLeave={() => setIsCoverDragging(false)}
                      onDrop={(e) => {
                        e.preventDefault();
                        setIsCoverDragging(false);
                        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                          handleCoverFile(e.dataTransfer.files[0]);
                        }
                      }}
                      className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition ${
                        isCoverDragging 
                          ? "border-[#6C4BF4] bg-[#EEEAFE]/50 scale-[1.01]" 
                          : "border-[#E7E4F2] hover:border-[#6C4BF4] bg-[#F8F7FF]"
                      }`}
                    >
                      <div className="mx-auto w-14 h-14 rounded-2xl bg-white shadow-xs flex items-center justify-center text-[#6C4BF4] mb-3">
                        <ImageIcon size={28} />
                      </div>
                      <p className="text-sm font-bold text-[#17152A]">
                        Click to browse or drag & drop book cover here
                      </p>
                      <p className="text-xs text-[#6B6880] mt-1">
                        Supports PNG, JPG, or WEBP up to 8MB (Recommended aspect ratio 2:3)
                      </p>
                    </div>

                    <div className="flex items-center gap-2 mt-2.5">
                      <span className="text-[11px] text-gray-500 font-medium">Or pick sample cover:</span>
                      <div className="flex gap-2">
                        {SAMPLE_COVERS.map((url, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => handleUseSampleCover(url)}
                            className="h-9 w-7 rounded-lg border border-gray-200 overflow-hidden hover:scale-110 hover:border-[#6C4BF4] transition cursor-pointer shadow-xs"
                            title={`Sample Cover ${idx + 1}`}
                          >
                            <img src={url} alt={`Sample ${idx + 1}`} className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center gap-4 rounded-2xl border border-emerald-200 bg-[#E8F8EE]/60 p-4">
                    <div className="w-16 h-24 rounded-xl overflow-hidden bg-gray-100 shadow-sm border border-emerald-300 shrink-0">
                      <img src={formData.coverPreview} alt="Cover Preview" className="w-full h-full object-cover" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-[#17152A] truncate">{formData.coverFileName}</span>
                        <span className="rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                          {formData.coverFileSize}
                        </span>
                      </div>
                      <p className="text-xs text-emerald-700 flex items-center gap-1 mt-1 font-semibold">
                        <CheckCircle size={14} /> Ready for publishing preview
                      </p>
                      <div className="flex items-center gap-3 mt-2">
                        <button
                          type="button"
                          onClick={() => coverInputRef.current && coverInputRef.current.click()}
                          className="text-xs font-bold text-[#6C4BF4] hover:underline cursor-pointer"
                        >
                          Change Cover Image
                        </button>
                        <button
                          type="button"
                          onClick={removeCover}
                          className="text-xs font-bold text-rose-600 hover:underline cursor-pointer flex items-center gap-1"
                        >
                          <Trash2 size={12} /> Remove
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Manuscript File Upload */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold text-[#17152A] uppercase tracking-wider">
                    Manuscript Document File* (PDF / EPUB)
                  </label>
                  <button
                    type="button"
                    onClick={handleUseSampleManuscript}
                    className="text-xs font-bold text-[#6C4BF4] bg-[#EEEAFE] hover:bg-[#E0D8FD] px-2.5 py-1 rounded-lg transition cursor-pointer flex items-center gap-1 shadow-2xs"
                  >
                    <Sparkles size={12} />
                    <span>Use Demo Manuscript (PDF)</span>
                  </button>
                </div>

                {/* Hidden native input */}
                <input 
                  type="file"
                  ref={manuscriptInputRef}
                  accept=".pdf, .epub, .docx"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleManuscriptFile(e.target.files[0]);
                    }
                  }}
                  className="hidden"
                />

                {!formData.manuscriptFileName ? (
                  <div 
                    onClick={() => manuscriptInputRef.current && manuscriptInputRef.current.click()}
                    onDragOver={(e) => { e.preventDefault(); setIsManuscriptDragging(true); }}
                    onDragLeave={() => setIsManuscriptDragging(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsManuscriptDragging(false);
                      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                        handleManuscriptFile(e.dataTransfer.files[0]);
                      }
                    }}
                    className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition ${
                      isManuscriptDragging 
                        ? "border-[#6C4BF4] bg-[#EEEAFE]/50 scale-[1.01]" 
                        : "border-[#E7E4F2] hover:border-[#6C4BF4] bg-[#F8F7FF]"
                    }`}
                  >
                    <div className="mx-auto w-14 h-14 rounded-2xl bg-white shadow-xs flex items-center justify-center text-[#6C4BF4] mb-3">
                      <FileText size={28} />
                    </div>
                    <p className="text-sm font-bold text-[#17152A]">
                      Click to browse or drag & drop manuscript PDF/EPUB
                    </p>
                    <p className="text-xs text-[#6B6880] mt-1">
                      PDF, EPUB, or DOCX up to 50MB (Stored securely in your author vault)
                    </p>
                  </div>
                ) : (
                  <div className="flex items-center gap-4 rounded-2xl border border-emerald-200 bg-[#E8F8EE]/60 p-4">
                    <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center text-emerald-600 shrink-0 border border-emerald-300">
                      <FileText size={24} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-[#17152A] truncate">{formData.manuscriptFileName}</span>
                        <span className="rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                          {formData.manuscriptFileSize}
                        </span>
                      </div>
                      <p className="text-xs text-emerald-700 flex items-center gap-1 mt-1 font-semibold">
                        <CheckCircle size={14} /> Manuscript verified for reader distribution
                      </p>
                      <div className="flex items-center gap-3 mt-2">
                        <button
                          type="button"
                          onClick={() => manuscriptInputRef.current && manuscriptInputRef.current.click()}
                          className="text-xs font-bold text-[#6C4BF4] hover:underline cursor-pointer"
                        >
                          Replace File
                        </button>
                        <button
                          type="button"
                          onClick={removeManuscript}
                          className="text-xs font-bold text-rose-600 hover:underline cursor-pointer flex items-center gap-1"
                        >
                          <Trash2 size={12} /> Remove
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 3: Set Price & Rights */}
          {step === 3 && (
            <div className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-[#17152A] uppercase tracking-wider mb-2">Selling Price (INR)*</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-gray-400">₹</span>
                    <input 
                      type="number" 
                      placeholder="e.g. 399" 
                      value={formData.sellingPrice}
                      onChange={(e) => setFormData({ ...formData, sellingPrice: e.target.value })}
                      className="w-full rounded-xl border border-gray-200 bg-[#F8F7FF] py-3 pl-8 pr-4 text-sm font-semibold outline-none transition focus:border-[#6C4BF4] focus:ring-4 focus:ring-[#6C4BF4]/10"
                      required
                    />
                  </div>
                  <p className="text-xs text-[#6B6880] mt-1.5">You keep up to 90% royalty on every direct student purchase.</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#17152A] uppercase tracking-wider mb-2">
                    Weekly Rental Price (INR) <span className="text-gray-400 font-normal lowercase">(optional)</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-gray-400">₹</span>
                    <input 
                      type="number" 
                      placeholder="e.g. 49 (leave empty if not renting)" 
                      value={formData.rentalPrice}
                      onChange={(e) => setFormData({ ...formData, rentalPrice: e.target.value })}
                      className="w-full rounded-xl border border-gray-200 bg-[#F8F7FF] py-3 pl-8 pr-4 text-sm font-semibold outline-none transition focus:border-[#6C4BF4] focus:ring-4 focus:ring-[#6C4BF4]/10"
                    />
                  </div>
                  <p className="text-xs text-[#6B6880] mt-1.5">Optional weekly rent for campus students who want temporary access.</p>
                </div>
              </div>

              <div className="border-t border-[#E7E4F2]/50 pt-5">
                <div className="flex items-start gap-3">
                  <input 
                    type="checkbox" 
                    id="exchanges"
                    checked={formData.allowExchanges}
                    onChange={(e) => setFormData({ ...formData, allowExchanges: e.target.checked })}
                    className="w-4 h-4 rounded text-[#6C4BF4] border-gray-300 focus:ring-[#6C4BF4] mt-1 cursor-pointer"
                  />
                  <div>
                    <label htmlFor="exchanges" className="text-sm font-bold text-[#17152A] cursor-pointer">
                      Allow peer-to-peer student exchanges
                    </label>
                    <p className="text-xs text-[#6B6880] mt-0.5">
                      Enable verified student swaps under campus library exchange policies.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Preview & Submit */}
          {step === 4 && (
            <div className="space-y-6 animate-fade-in">
              {/* Visual Showcase Card */}
              <div className="rounded-3xl border border-indigo-100 bg-gradient-to-br from-[#F8F7FF] via-white to-[#F0ECFF] p-6 shadow-sm">
                <div className="flex flex-col sm:flex-row gap-6 items-start">
                  {/* Left: Book Cover */}
                  <div className="relative w-32 sm:w-40 aspect-[2/3] rounded-2xl overflow-hidden shadow-md border border-gray-200 shrink-0 bg-gray-100">
                    <img 
                      src={formData.coverPreview || "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop"} 
                      alt="Cover Preview" 
                      className="w-full h-full object-cover" 
                    />
                    <span className="absolute top-2 left-2 text-[9px] font-extrabold text-white bg-[#6C4BF4] px-2 py-0.5 rounded-md shadow-xs">
                      {formData.bookType}
                    </span>
                    <span className="absolute bottom-2 left-2 text-[9px] font-extrabold text-white bg-gradient-to-r from-emerald-600 to-teal-600 px-2 py-0.5 rounded-md shadow-xs flex items-center gap-1">
                      <Sparkles size={10} /> Author Original
                    </span>
                  </div>

                  {/* Right: Book Details */}
                  <div className="flex-1 space-y-3">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#6C4BF4] bg-[#EEEAFE] px-2.5 py-0.5 rounded-full">
                        {formData.category === "Other" ? formData.customCategory : formData.category} • {formData.subCategory === "Other" ? formData.customSubCategory : formData.subCategory}
                      </span>
                      <h3 className="text-xl font-extrabold text-[#17152A] font-poppins mt-1.5 leading-snug">
                        {formData.title || "Untitled Book"}
                      </h3>
                      {formData.subtitle && <p className="text-xs text-gray-500 font-medium">{formData.subtitle}</p>}
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-gray-700">
                      <span>By <strong className="text-[#17152A]">{formData.authorName}</strong></span>
                      <ShieldCheck size={14} className="text-emerald-500" />
                      <span className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.2 rounded">
                        Verified Author
                      </span>
                    </div>

                    <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed">
                      {formData.description}
                    </p>

                    <div className="flex items-baseline gap-3 pt-2 border-t border-gray-100">
                      <div>
                        <span className="text-[10px] text-gray-400 block font-semibold">SELLING PRICE</span>
                        <span className="text-lg font-black text-[#17152A]">₹{formData.sellingPrice || "0"}</span>
                      </div>
                      {formData.rentalPrice && (
                        <div>
                          <span className="text-[10px] text-gray-400 block font-semibold">RENTAL / WEEK</span>
                          <span className="text-sm font-bold text-[#6C4BF4]">₹{formData.rentalPrice}</span>
                        </div>
                      )}
                      <div>
                        <span className="text-[10px] text-gray-400 block font-semibold">FORMAT</span>
                        <span className="text-xs font-bold text-gray-700">{formData.bookType}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-400 block font-semibold">MANUSCRIPT</span>
                        <span className="text-xs font-bold text-emerald-700">{formData.manuscriptFileSize || "Ready"}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tag Pills */}
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-4 pt-3 border-t border-indigo-50">
                    {formData.tags.map((t) => (
                      <span key={t} className="bg-white border border-gray-200 text-xs px-2.5 py-0.5 rounded-full font-semibold text-gray-700">
                        #{t}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Copyright confirmation */}
              <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-4">
                <div className="flex items-start gap-3">
                  <input 
                    type="checkbox" 
                    id="terms"
                    checked={formData.termsAccepted}
                    onChange={(e) => setFormData({ ...formData, termsAccepted: e.target.checked })}
                    className="w-4 h-4 rounded text-[#6C4BF4] border-gray-300 focus:ring-[#6C4BF4] mt-1 cursor-pointer"
                    required
                  />
                  <div>
                    <label htmlFor="terms" className="text-xs font-bold text-[#17152A] cursor-pointer block">
                      I confirm that this is my own original work and I hold exclusive distribution rights.
                    </label>
                    <p className="text-[11px] text-amber-900/80 mt-0.5">
                      Submitting plagiarized or copyrighted materials without proper rights will result in immediate listing removal and author revocation.
                    </p>
                  </div>
                </div>
              </div>

              {submitError && (
                <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-bold text-rose-700">
                  {submitError}
                </div>
              )}
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex justify-between border-t border-[#E7E4F2]/60 pt-6">
            {step > 1 ? (
              <button 
                type="button" 
                onClick={handlePrev}
                className="flex items-center gap-2 px-5 py-2.5 bg-white border border-[#E7E4F2] text-[#17152A] rounded-xl text-sm font-semibold hover:bg-[#F8F7FF] transition cursor-pointer"
              >
                <ChevronLeft size={16} />
                <span>Back</span>
              </button>
            ) : (
              <div />
            )}

            {step < 4 ? (
              <button 
                type="button" 
                onClick={handleNext}
                className="flex items-center gap-2 px-6 py-2.5 bg-[#6C4BF4] text-white rounded-xl text-sm font-bold hover:bg-[#5b3ed9] transition shadow-md shadow-[#6C4BF4]/20 cursor-pointer hover:scale-102"
              >
                <span>Continue</span>
                <ChevronRight size={16} />
              </button>
            ) : (
              <button 
                type="submit"
                disabled={!formData.termsAccepted || submitting}
                className="flex items-center gap-2 px-7 py-3 bg-[#22C55E] disabled:bg-gray-300 text-white rounded-xl text-sm font-bold hover:bg-[#1da850] transition shadow-md cursor-pointer hover:scale-102 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <span>Publishing Manuscript...</span>
                ) : (
                  <>
                    <Sparkles size={16} />
                    <span>Publish Book Now</span>
                  </>
                )}
              </button>
            )}
          </div>

        </form>
      </div>
    </div>
  );
}
