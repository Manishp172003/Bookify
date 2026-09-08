import { Eye, EyeOff, Lock, Mail, Feather, BookOpen, Sparkles, TrendingUp, DollarSign } from "lucide-react";
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

  const handleFillDemo = () => {
    setFormData({
      email: "author@bookify.com",
      password: "Author@123",
    });
    setErrors({});
    setApiError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = validateAuthorLogin(formData);
    setErrors(validationErrors);
    setApiError("");

    if (Object.keys(validationErrors).length === 0) {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        // Login with author mock user
        if (login) {
          login(formData.email);
        }
        navigate("/author");
      }, 1200);
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

      {/* Demo Autofill Banner */}
      <div className="mb-6 flex items-center justify-between rounded-xl border border-[#6C4BF4]/20 bg-[#F8F7FF] p-3 text-xs">
        <div className="flex items-center gap-2 text-gray-700">
          <Sparkles size={16} className="text-[#6C4BF4] shrink-0" />
          <span>Need quick demo access?</span>
        </div>
        <button
          type="button"
          onClick={handleFillDemo}
          className="rounded-lg bg-[#6C4BF4] px-3 py-1.5 font-bold text-white shadow-sm transition hover:bg-[#5B3DE0] cursor-pointer"
        >
          ⚡ Fill Demo Author
        </button>
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
            className="font-bold text-[#6C4BF4] hover:text-[#5B3DE0]"
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
    </AuthLayout>
  );
}

export default AuthorLogin;
