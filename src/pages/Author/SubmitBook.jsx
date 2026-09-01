import React, { useState } from "react";
import { 
  ChevronRight, 
  ChevronLeft, 
  Upload, 
  BookOpen, 
  DollarSign, 
  CheckCircle,
  X
} from "lucide-react";

function SubmitBook() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    category: "Self Help",
    subCategory: "Mental Wellness",
    description: "",
    tags: ["Mindfulness", "Self Help", "Personal Growth"],
    newTag: "",
    language: "English",
    bookType: "eBook",
    file: null,
    coverFile: null,
    sellingPrice: "",
    rentalPrice: "",
    allowExchanges: true,
    termsAccepted: false
  });

  const [submitted, setSubmitted] = useState(false);

  const handleNext = () => {
    if (step === 1) {
      if (!formData.title || !formData.subtitle || !formData.description) {
        alert("Please fill in all details (Book Title, Subtitle, and Description) before continuing.");
        return;
      }
      if (formData.category === "Other" && !formData.customCategory) {
        alert("Please enter your custom Category.");
        return;
      }
      if (formData.subCategory === "Other" && !formData.customSubCategory) {
        alert("Please enter your custom Sub Category.");
        return;
      }
      if (formData.language === "Other" && !formData.customLanguage) {
        alert("Please enter your custom Language.");
        return;
      }
    }
    if (step === 2) {
      if (!formData.file || !formData.coverFile) {
        alert("Please click to upload both the Book Cover Image and the Manuscript File.");
        return;
      }
    }
    if (step === 3) {
      if (!formData.sellingPrice || !formData.rentalPrice) {
        alert("Please specify the Selling Price and Weekly Rental Price.");
        return;
      }
    }
    setStep((prev) => Math.min(prev + 1, 4));
  };
  const handlePrev = () => setStep((prev) => Math.max(prev - 1, 1));

  const addTag = () => {
    if (formData.newTag.trim() && !formData.tags.includes(formData.newTag.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, formData.newTag.trim()],
        newTag: ""
      });
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(t => t !== tagToRemove)
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const stepsHeader = [
    { num: 1, label: "Book Info" },
    { num: 2, label: "Upload Manuscript" },
    { num: 3, label: "Set Price & Rights" },
    { num: 4, label: "Preview & Submit" }
  ];

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto bg-white p-10 rounded-3xl border border-[#E7E4F2] shadow-xl text-center space-y-6">
        <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-[#E8F8EE] text-[#22C55E] mb-2">
          <CheckCircle size={44} />
        </div>
        <h2 className="text-3xl font-extrabold text-[#17152A] font-poppins">Manuscript Submitted!</h2>
        <p className="text-[#6B6880] max-w-md mx-auto">
          Your book <span className="font-bold text-[#17152A]">"{formData.title || "The Journey Within"}"</span> has been uploaded successfully and is currently under review by our moderation team.
        </p>
        <div className="pt-4 flex justify-center gap-4">
          <button 
            onClick={() => { setSubmitted(false); setStep(1); setFormData({ ...formData, title: "", description: "" }); }}
            className="px-6 py-3 bg-[#6C4BF4] text-white rounded-xl text-sm font-semibold hover:bg-[#5b3ed9] transition shadow-md shadow-[#6C4BF4]/20"
          >
            Submit Another Book
          </button>
          <a 
            href="/author/my-books"
            className="px-6 py-3 bg-white border border-[#E7E4F2] text-[#17152A] rounded-xl text-sm font-semibold hover:bg-[#F8F7FF] transition"
          >
            Go to My Books
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-[#17152A] font-poppins">Submit New Book / Manuscript</h1>
        <p className="text-[#6B6880] mt-1 text-sm">Publish your work to the Bookify library and earn royalties.</p>
      </div>

      {/* Progress Tracker */}
      <div className="bg-white p-6 rounded-2xl border border-[#E7E4F2] shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {stepsHeader.map((s) => (
            <div key={s.num} className="flex items-center gap-3">
              <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                step === s.num 
                  ? "bg-[#6C4BF4] text-white ring-4 ring-[#6C4BF4]/20" 
                  : step > s.num 
                    ? "bg-[#22C55E] text-white" 
                    : "bg-[#F8F7FF] text-[#6B6880] border border-[#E7E4F2]"
              }`}>
                {s.num}
              </div>
              <span className={`text-xs font-semibold ${step === s.num ? "text-[#17152A]" : "text-[#6B6880]"}`}>
                {s.label}
              </span>
              {s.num < 4 && <ChevronRight size={14} className="text-[#6B6880]/30 hidden md:block" />}
            </div>
          ))}
        </div>
      </div>

      {/* Form Content */}
      <div className="bg-white p-8 rounded-2xl border border-[#E7E4F2] shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* STEP 1: Book Info */}
          {step === 1 && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                 <div>
                  <label className="block text-xs font-bold text-[#17152A] uppercase tracking-wider mb-2">Book Title*</label>
                  <input 
                    type="text" 
                    placeholder="The Journey Within" 
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 bg-[#F8F7FF] py-3 px-4 text-sm outline-none transition focus:border-[#6C4BF4] focus:ring-4 focus:ring-[#6C4BF4]/10"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#17152A] uppercase tracking-wider mb-2">Subtitle*</label>
                  <input 
                    type="text" 
                    placeholder="A Guide to Self Discovery" 
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 bg-[#F8F7FF] py-3 px-4 text-sm outline-none transition focus:border-[#6C4BF4] focus:ring-4 focus:ring-[#6C4BF4]/10"
                    required
                  />
                </div>
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
                    <option>Fiction</option>
                    <option>Non-Fiction</option>
                    <option>Textbooks & Academic</option>
                    <option value="Other">Other (Add Custom)</option>
                  </select>
                  {formData.category === "Other" && (
                    <input 
                      type="text"
                      placeholder="Enter custom category"
                      onChange={(e) => setFormData({ ...formData, customCategory: e.target.value })}
                      className="w-full mt-2 rounded-xl border border-gray-200 bg-[#F8F7FF] py-2.5 px-4 text-sm outline-none focus:border-[#6C4BF4]"
                      required
                    />
                  )}
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#17152A] uppercase tracking-wider mb-2">Sub Category*</label>
                  <select 
                    value={formData.subCategory} 
                    onChange={(e) => setFormData({ ...formData, subCategory: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 bg-[#F8F7FF] py-3 px-4 text-sm outline-none transition focus:border-[#6C4BF4]"
                  >
                    <option>Mental Wellness</option>
                    <option>Philosophy</option>
                    <option>Psychology</option>
                    <option>Business & Habits</option>
                    <option value="Other">Other (Add Custom)</option>
                  </select>
                  {formData.subCategory === "Other" && (
                    <input 
                      type="text"
                      placeholder="Enter custom sub-category"
                      onChange={(e) => setFormData({ ...formData, customSubCategory: e.target.value })}
                      className="w-full mt-2 rounded-xl border border-gray-200 bg-[#F8F7FF] py-2.5 px-4 text-sm outline-none focus:border-[#6C4BF4]"
                      required
                    />
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#17152A] uppercase tracking-wider mb-2">Description*</label>
                <textarea 
                  rows={4}
                  placeholder="The Journey Within is a practical guide to understanding yourself better..." 
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 bg-[#F8F7FF] py-3 px-4 text-sm outline-none transition focus:border-[#6C4BF4] focus:ring-4 focus:ring-[#6C4BF4]/10"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#17152A] uppercase tracking-wider mb-2">Tags</label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {formData.tags.map((tag) => (
                    <span key={tag} className="flex items-center gap-1 bg-[#EEEAFE] text-[#6C4BF4] px-3 py-1 rounded-full text-xs font-semibold">
                      <span>{tag}</span>
                      <button type="button" onClick={() => removeTag(tag)}>
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Add tag" 
                    value={formData.newTag}
                    onChange={(e) => setFormData({ ...formData, newTag: e.target.value })}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                    className="rounded-xl border border-gray-200 bg-[#F8F7FF] py-2 px-4 text-sm outline-none transition focus:border-[#6C4BF4] w-48"
                  />
                  <button 
                    type="button" 
                    onClick={addTag}
                    className="px-4 py-2 bg-[#F8F7FF] border border-gray-200 text-[#17152A] rounded-xl text-sm font-semibold hover:bg-gray-100 transition"
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
                    <option>Spanish</option>
                    <option>German</option>
                    <option value="Other">Other (Add Custom)</option>
                  </select>
                  {formData.language === "Other" && (
                    <input 
                      type="text"
                      placeholder="Enter custom language"
                      onChange={(e) => setFormData({ ...formData, customLanguage: e.target.value })}
                      className="w-full mt-2 rounded-xl border border-gray-200 bg-[#F8F7FF] py-2.5 px-4 text-sm outline-none focus:border-[#6C4BF4]"
                      required
                    />
                  )}
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#17152A] uppercase tracking-wider mb-2">Book Type*</label>
                  <select 
                    value={formData.bookType} 
                    onChange={(e) => setFormData({ ...formData, bookType: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 bg-[#F8F7FF] py-3 px-4 text-sm outline-none transition focus:border-[#6C4BF4]"
                  >
                    <option>eBook</option>
                    <option>Physical Book</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Upload Manuscript */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-[#17152A] uppercase tracking-wider mb-2">Book Cover Image*</label>
                <div 
                  onClick={() => setFormData({ ...formData, coverFile: { name: 'cover.png' } })}
                  className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition ${
                    formData.coverFile ? "border-[#22C55E] bg-[#E8F8EE]" : "border-[#E7E4F2] hover:border-[#6C4BF4] bg-[#F8F7FF]"
                  }`}
                >
                  <Upload size={32} className={`mx-auto mb-3 ${formData.coverFile ? "text-[#22C55E]" : "text-[#6C4BF4]"}`} />
                  <p className="text-sm font-bold text-[#17152A]">
                    {formData.coverFile ? "Selected: cover.png (Click to change)" : "Drag & drop cover here, or browse"}
                  </p>
                  <p className="text-xs text-[#6B6880] mt-1">PNG, JPG or JPEG up to 5MB</p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#17152A] uppercase tracking-wider mb-2">Manuscript File (PDF / EPUB)*</label>
                <div 
                  onClick={() => setFormData({ ...formData, file: { name: 'manuscript.pdf' } })}
                  className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition ${
                    formData.file ? "border-[#22C55E] bg-[#E8F8EE]" : "border-[#E7E4F2] hover:border-[#6C4BF4] bg-[#F8F7FF]"
                  }`}
                >
                  <Upload size={36} className={`mx-auto mb-3 ${formData.file ? "text-[#22C55E]" : "text-[#6C4BF4]"}`} />
                  <p className="text-sm font-bold text-[#17152A]">
                    {formData.file ? "Selected: manuscript.pdf (Click to change)" : "Drag & drop manuscript PDF/EPUB here"}
                  </p>
                  <p className="text-xs text-[#6B6880] mt-1">Recommended size under 50MB</p>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Set Price & Rights */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-[#17152A] uppercase tracking-wider mb-2">Selling Price (INR)*</label>
                  <div className="relative">
                    <DollarSign size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                      type="number" 
                      placeholder="499" 
                      value={formData.sellingPrice}
                      onChange={(e) => setFormData({ ...formData, sellingPrice: e.target.value })}
                      className="w-full rounded-xl border border-gray-200 bg-[#F8F7FF] py-3 pl-9 pr-4 text-sm outline-none transition focus:border-[#6C4BF4]"
                      required
                    />
                  </div>
                  <p className="text-xs text-[#6B6880] mt-1.5">Set a price for permanent digital downloads/purchases.</p>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#17152A] uppercase tracking-wider mb-2">Rental Price / week (INR)*</label>
                  <div className="relative">
                    <DollarSign size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                      type="number" 
                      placeholder="99" 
                      value={formData.rentalPrice}
                      onChange={(e) => setFormData({ ...formData, rentalPrice: e.target.value })}
                      className="w-full rounded-xl border border-gray-200 bg-[#F8F7FF] py-3 pl-9 pr-4 text-sm outline-none transition focus:border-[#6C4BF4]"
                      required
                    />
                  </div>
                  <p className="text-xs text-[#6B6880] mt-1.5">Optional. Set a weekly price for temporary readers.</p>
                </div>
              </div>

              <div className="border-t border-[#E7E4F2]/50 pt-5">
                <div className="flex items-start gap-3">
                  <input 
                    type="checkbox" 
                    id="exchanges"
                    checked={formData.allowExchanges}
                    onChange={(e) => setFormData({ ...formData, allowExchanges: e.target.checked })}
                    className="w-4 h-4 rounded text-[#6C4BF4] border-gray-300 focus:ring-[#6C4BF4] mt-1"
                  />
                  <div>
                    <label htmlFor="exchanges" className="text-sm font-bold text-[#17152A] cursor-pointer">Allow peer-to-peer exchanges</label>
                    <p className="text-xs text-[#6B6880] mt-0.5">Let users swap this book under verified exchange rules.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Preview & Submit */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="bg-[#F8F7FF] p-6 rounded-2xl border border-[#E7E4F2]/80 space-y-4">
                <h3 className="text-lg font-bold text-[#17152A] font-poppins">{formData.title || "Untitled Book"}</h3>
                {formData.subtitle && <p className="text-sm text-[#6B6880] -mt-3">{formData.subtitle}</p>}
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-xs text-[#6B6880] block">Category</span>
                    <span className="font-semibold text-[#17152A]">
                      {formData.category === "Other" ? formData.customCategory : formData.category} / {formData.subCategory === "Other" ? formData.customSubCategory : formData.subCategory}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-[#6B6880] block">Type / Language</span>
                    <span className="font-semibold text-[#17152A]">
                      {formData.bookType} / {formData.language === "Other" ? formData.customLanguage : formData.language}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-[#6B6880] block">Selling Price</span>
                    <span className="font-semibold text-[#17152A]">₹{formData.sellingPrice || "0"}</span>
                  </div>
                  <div>
                    <span className="text-xs text-[#6B6880] block">Weekly Rental</span>
                    <span className="font-semibold text-[#17152A]">{formData.rentalPrice ? `₹${formData.rentalPrice}` : "Not Available"}</span>
                  </div>
                </div>

                <div className="border-t border-[#E7E4F2]/50 pt-4">
                  <span className="text-xs text-[#6B6880] block mb-1">Tags</span>
                  <div className="flex flex-wrap gap-1.5">
                    {formData.tags.map((t) => (
                      <span key={t} className="bg-white border border-[#E7E4F2] text-xs px-2.5 py-0.5 rounded-full font-medium text-[#17152A]">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <input 
                  type="checkbox" 
                  id="terms"
                  checked={formData.termsAccepted}
                  onChange={(e) => setFormData({ ...formData, termsAccepted: e.target.checked })}
                  className="w-4 h-4 rounded text-[#6C4BF4] border-gray-300 focus:ring-[#6C4BF4] mt-1"
                  required
                />
                <div>
                  <label htmlFor="terms" className="text-sm font-semibold text-[#17152A] cursor-pointer">I confirm that this is my own original work and I hold full publishing rights.</label>
                  <p className="text-xs text-[#6B6880] mt-0.5">Submitting copyrighted material without license is subject to immediate account termination.</p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex justify-between border-t border-[#E7E4F2]/50 pt-6">
            {step > 1 ? (
              <button 
                type="button" 
                onClick={handlePrev}
                className="flex items-center gap-2 px-5 py-2.5 bg-white border border-[#E7E4F2] text-[#17152A] rounded-xl text-sm font-semibold hover:bg-[#F8F7FF] transition"
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
                className="flex items-center gap-2 px-5 py-2.5 bg-[#6C4BF4] text-white rounded-xl text-sm font-semibold hover:bg-[#5b3ed9] transition shadow-md shadow-[#6C4BF4]/20"
              >
                <span>Continue</span>
                <ChevronRight size={16} />
              </button>
            ) : (
              <button 
                type="submit"
                disabled={!formData.termsAccepted}
                className="flex items-center gap-2 px-6 py-2.5 bg-[#22C55E] disabled:bg-[#22C55E]/50 text-white rounded-xl text-sm font-semibold hover:bg-[#1da850] transition shadow-md"
              >
                <span>Submit Manuscript</span>
              </button>
            )}
          </div>

        </form>
      </div>
    </div>
  );
}

export default SubmitBook;
