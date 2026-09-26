import React, { useState } from "react";
import { Star, X, Check, Loader2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { testimonialService } from "../../services/testimonialService";
import { useCommerce } from "../../context/CommerceContext";

export default function ReviewModal({ isOpen, onClose, onSuccess }) {
  const { user } = useAuth();
  const { showToast } = useCommerce();

  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [role, setRole] = useState(
    user?.college ? `Student, ${user.college}` : user?.role === "author" ? "Author" : "Student"
  );
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const ratingLabels = {
    1: "Needs Improvement",
    2: "Fair",
    3: "Good",
    4: "Very Good",
    5: "Exceptional / Loved It!",
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (comment.trim().length < 10) {
      showToast("Please write at least 10 characters in your review.", "warning");
      return;
    }

    setSubmitting(true);
    try {
      await testimonialService.submitTestimonial({
        rating,
        comment: comment.trim(),
        role: role.trim(),
      });
      showToast("Thank you! Your review has been submitted for admin approval.", "success");
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      showToast(err.message || "Failed to submit review", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-gray-100 overflow-hidden transform transition-all">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#6C4BF4] to-[#4828c2] text-white p-6 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full">
              Student & Author Voice
            </span>
            <h3 className="text-xl font-bold font-[family-name:var(--font-heading)] mt-1">
              Share Your Experience
            </h3>
            <p className="text-xs text-purple-100 mt-0.5">
              Help your campus peers discover trusted book swapping and rentals.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10 transition cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Star Rating Selector */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Your Rating
            </label>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 transition-transform hover:scale-110 cursor-pointer focus:outline-none"
                  >
                    <Star
                      size={28}
                      className={
                        (hoverRating || rating) >= star
                          ? "text-amber-400 fill-amber-400"
                          : "text-gray-200 fill-gray-100"
                      }
                    />
                  </button>
                ))}
              </div>
              <span className="text-xs font-semibold text-purple-700 ml-2">
                {ratingLabels[hoverRating || rating]}
              </span>
            </div>
          </div>

          {/* User & Role Display */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Campus / Designation
            </label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g. Student, IIT Bombay or Author"
              className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-2.5 px-3.5 text-xs font-medium text-gray-800 outline-none focus:border-[#6C4BF4] focus:bg-white transition"
              required
            />
            <span className="text-[11px] text-gray-400 mt-1 block">
              Submitting as: <strong className="text-gray-700">{user?.name}</strong>
            </span>
          </div>

          {/* Review Message */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                Your Review
              </label>
              <span className="text-[11px] text-gray-400">
                {comment.length}/400
              </span>
            </div>
            <textarea
              rows={4}
              maxLength={400}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="What do you love most about Bookify? How did it help you buy, sell, or rent textbooks on campus?"
              className="w-full rounded-xl border border-gray-200 bg-gray-50/50 p-3.5 text-xs text-gray-800 outline-none focus:border-[#6C4BF4] focus:bg-white transition resize-none leading-relaxed"
              required
            />
            <span className="text-[10px] text-gray-400 mt-1 block">
              Minimum 10 characters. Reviews are reviewed by admin to keep the community genuine.
            </span>
          </div>

          {/* Buttons */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || comment.trim().length < 10}
              className="px-6 py-2.5 bg-[#6C4BF4] text-white rounded-xl text-xs font-bold hover:bg-[#5b3ed9] transition shadow-md shadow-[#6C4BF4]/25 flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Check size={14} />
                  <span>Submit Review</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
