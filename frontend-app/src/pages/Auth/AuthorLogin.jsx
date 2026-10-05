import { Eye, EyeOff, Lock, Mail, Feather, BookOpen, TrendingUp, DollarSign, CheckCircle2, AlertCircle, KeyRound, ExternalLink } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import loginIllustration from "../../assets/images/auth/login-illustration.png";
import AuthLayout from "../../components/auth/AuthLayout";
import { useAuth } from "../../context/AuthContext";

function AuthorLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState("");
  const [forgotSuccess, setForgotSuccess] = useState(null);

  const [errors, setErrors] = useState({});

  const validateAuthorLogin = (data) => {
    const errs = {};
    if (!data.email) {
      errs.email = "Author email is required";
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      errs.email = "Invalid email format";
    }
    if (!data.password) {
      errs.password = "Password is required";
    } else if (data.password.length < 6) {
      errs.password = "Password must be at least 6 characters";
    }
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateAuthorLogin(formData);
    setErrors(validationErrors);
    setApiError("");

    if (Object.keys(validationErrors).length === 0) {
      setIsLoading(true);

      try {
        const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
        const response = await fetch(`${apiBase}/auth/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            identifier: formData.email,
            password: formData.password,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          if (data.token) {
            localStorage.setItem("token", data.token);
          }
          if (login) {
            login(data.user || formData.email);
          }
          setIsLoading(false);
          navigate("/author");
        } else {
          setIsLoading(false);
          setApiError(data.message || "Login failed. Invalid credentials.");
        }
      } catch (error) {
        setIsLoading(false);
        setApiError("Unable to connect to backend server.");
      }
    }
  };

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    const cleanEmail = forgotEmail.trim();
    if (!cleanEmail) {
      setForgotError("Please enter your registered author email");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(cleanEmail)) {
      setForgotError("Please enter a valid email address");
      return;
    }

    setForgotLoading(true);
    setForgotError("");

    try {
      const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
      const response = await fetch(`${apiBase}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: cleanEmail,
          from: "author",
          clientUrl: window.location.origin,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setForgotSuccess({
          email: cleanEmail,
          message: data.message || "If an account exists, a reset link has been dispatched.",
          resetToken: data.resetToken || null,
          resetLink: data.resetLink || null,
        });
      } else {
        setForgotError(data.message || "Failed to send reset link. Please try again.");
      }
    } catch {
      setForgotError("Unable to connect to authentication server. Please check your connection.");
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Author & Creator Studio"
      subtitle={<span>Publish, promote, and monitor your books on <span className="text-[#FFD166] font-bold">Bookify</span>.</span>}
      illustration={loginIllustration}
      isRegister={false}
      tagText="Author Partner Portal"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1 rounded-md bg-[#6C4BF4]/10 px-2 py-0.5 text-[11px] font-bold text-[#6C4BF4]">
              <Feather size={12} />
              Author & Publisher
            </span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-[#17152A]">
            Sign in to Author Portal
          </h2>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#6C4BF4] to-[#8B6FF5] text-white shadow-md shadow-[#6C4BF4]/20">
          <BookOpen size={20} />
        </div>
      </div>

      {/* Form */}
      <form className="space-y-4" onSubmit={handleSubmit}>
        {/* Email */}
        <div>
          <div className="relative">
            <Mail
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="email"
              placeholder="author@publishing.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full rounded-xl border border-gray-200 bg-white py-3.5 pl-11 pr-4 text-sm text-[#17152A] outline-none transition placeholder:text-gray-400 focus:border-[#6C4BF4] focus:ring-4 focus:ring-[#6C4BF4]/10"
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-xs text-red-500 font-medium">{errors.email}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <div className="relative">
            <Lock
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Author password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full rounded-xl border border-gray-200 bg-white py-3.5 pl-11 pr-11 text-sm text-[#17152A] outline-none transition placeholder:text-gray-400 focus:border-[#6C4BF4] focus:ring-4 focus:ring-[#6C4BF4]/10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-[#6C4BF4]"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-xs text-red-500 font-medium">{errors.password}</p>
          )}
        </div>

        {/* Remember + Forgot */}
        <div className="flex items-center justify-between text-xs pt-1">
          <label className="flex cursor-pointer items-center gap-2 font-semibold text-gray-600">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 accent-[#6C4BF4]"
            />
            Keep me logged in
          </label>

          <button
            type="button"
            onClick={() => {
              setForgotEmail(formData.email || "");
              setForgotError("");
              setForgotSuccess(null);
              setShowForgotModal(true);
            }}
            className="font-bold text-[#6C4BF4] hover:text-[#5B3DE0] cursor-pointer"
          >
            Forgot Password?
          </button>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-xl bg-[#6C4BF4] py-3.5 font-bold text-white shadow-lg shadow-[#6C4BF4]/20 transition duration-200 hover:-translate-y-0.5 hover:bg-[#5B3DE0] hover:shadow-xl active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 cursor-pointer"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Accessing Author Studio...
            </span>
          ) : (
            "Sign In to Author Studio"
          )}
        </button>

        {apiError && (
          <p className="mt-2 text-center text-xs text-red-500">{apiError}</p>
        )}
      </form>

      {/* Author Perks Teaser */}
      <div className="mt-6 grid grid-cols-2 gap-2.5 pt-4 border-t border-gray-100">
        <div className="flex items-center gap-2 rounded-lg bg-gray-50 p-2 text-xs text-gray-600">
          <DollarSign size={14} className="text-emerald-500 shrink-0" />
          <span className="truncate">Direct Royalties</span>
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-gray-50 p-2 text-xs text-gray-600">
          <TrendingUp size={14} className="text-indigo-500 shrink-0" />
          <span className="truncate">Sales Analytics</span>
        </div>
      </div>

      {/* Switch to Student Portal */}
      <div className="mt-6 text-center text-xs text-gray-500">
        <span>Looking for student books? </span>
        <Link
          to="/login"
          className="font-bold text-[#6C4BF4] hover:underline"
        >
          Go to Student Login
        </Link>
      </div>

      {/* Author Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            {forgotSuccess ? (
              <div className="text-center py-2">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                  <CheckCircle2 size={28} />
                </div>
                <h3 className="text-lg font-bold text-[#17152A]">Reset Link Dispatched</h3>
                <p className="mt-1 text-xs text-gray-600 leading-relaxed">
                  If an account exists for <span className="font-semibold text-gray-800">{forgotSuccess.email}</span>, a secure password reset link has been dispatched to your inbox.
                </p>

                <div className="mt-3 rounded-xl bg-[#F8F7FF] p-3 text-left border border-gray-100 text-[11px] text-gray-600">
                  <p className="font-semibold text-gray-700 mb-0.5">ℹ️ Unified Bookify Account:</p>
                  <p>Resetting this password will update your credentials for both Author Studio & Student Marketplace.</p>
                </div>

                {/* Local Dev Fast Reset Link Helper */}
                {forgotSuccess.resetToken && (
                  <div className="mt-3 p-2.5 rounded-xl bg-purple-50 border border-purple-200 text-left">
                    <span className="inline-block px-1.5 py-0.5 rounded bg-purple-200 text-[9px] font-bold text-purple-800 uppercase mb-1">
                      Quick Reset Helper
                    </span>
                    <p className="text-[11px] text-purple-900">Direct password reset URL:</p>
                    <Link
                      to={`/reset-password?token=${forgotSuccess.resetToken}&email=${encodeURIComponent(forgotSuccess.email)}&from=author`}
                      className="mt-1 inline-flex items-center gap-1 text-xs font-bold text-[#6C4BF4] hover:underline"
                    >
                      <span>Proceed to Reset Password</span>
                      <ExternalLink size={12} />
                    </Link>
                  </div>
                )}

                <div className="mt-5 flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setForgotSuccess(null);
                      setForgotEmail("");
                    }}
                    className="text-xs font-bold text-[#6C4BF4] hover:underline cursor-pointer"
                  >
                    Try another email
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="w-full rounded-xl bg-gray-100 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-200 transition cursor-pointer"
                  >
                    Back to Author Login
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="mb-4">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#6C4BF4] uppercase tracking-wider mb-1">
                    <KeyRound size={14} />
                    <span>Author Password Assistance</span>
                  </div>
                  <h3 className="text-xl font-bold tracking-tight text-[#17152A]">
                    Forgot Author Password?
                  </h3>
                  <p className="mt-1 text-xs text-gray-500">
                    Enter your registered email and we'll send a password recovery link.
                  </p>
                </div>

                <div className="mb-3.5 rounded-xl bg-[#F8F7FF] p-2.5 text-[11px] text-gray-600 border border-gray-100 flex items-start gap-2">
                  <span className="text-sm">💡</span>
                  <span><strong>Student + Author Note:</strong> Bookify uses a single unified account. Resetting this password updates access across both portals.</span>
                </div>

                {forgotError && (
                  <div className="mb-3.5 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-2.5 text-xs text-red-600">
                    <AlertCircle size={15} className="shrink-0" />
                    <span>{forgotError}</span>
                  </div>
                )}

                <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
                  <div>
                    <label className="mb-1 block text-xs font-bold text-gray-700">
                      Author / Registered Email
                    </label>
                    <div className="relative">
                      <Mail
                        size={16}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                      />
                      <input
                        type="email"
                        placeholder="author@publishing.com"
                        value={forgotEmail}
                        onChange={(e) => {
                          setForgotEmail(e.target.value);
                          if (forgotError) setForgotError("");
                        }}
                        autoFocus
                        className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-4 text-xs sm:text-sm text-[#17152A] outline-none transition placeholder:text-gray-400 focus:border-[#6C4BF4] focus:ring-4 focus:ring-[#6C4BF4]/10"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2.5 pt-1">
                    <button
                      type="button"
                      onClick={() => setShowForgotModal(false)}
                      className="flex-1 rounded-xl border border-gray-200 py-3 text-xs font-bold text-gray-600 hover:bg-gray-50 transition cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={forgotLoading}
                      className="flex-1 rounded-xl bg-[#6C4BF4] py-3 text-xs font-bold text-white shadow-md shadow-[#6C4BF4]/20 hover:bg-[#5B3DE0] disabled:opacity-50 transition cursor-pointer"
                    >
                      {forgotLoading ? "Sending..." : "Send Reset Link"}
                    </button>
                  </div>
                </form>

                <div className="mt-4 pt-3 border-t border-gray-100 text-center">
                  <Link
                    to="/forgot-password?from=author"
                    onClick={() => setShowForgotModal(false)}
                    className="text-[11px] font-semibold text-gray-400 hover:text-[#6C4BF4] transition"
                  >
                    Open dedicated recovery screen &rarr;
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </AuthLayout>
  );
}

export default AuthorLogin;
