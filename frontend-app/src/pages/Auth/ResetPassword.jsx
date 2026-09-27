import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Lock, Eye, EyeOff, CheckCircle2, AlertCircle, ArrowLeft, KeyRound } from "lucide-react";
import AuthLayout from "../../components/auth/AuthLayout";
import loginIllustration from "../../assets/images/auth/login-illustration.png";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token") || "";
  const emailParam = searchParams.get("email") || "";

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!token) {
      setApiError("Reset token is missing or invalid. Please request a new password reset link.");
    }
  }, [token]);

  const validate = () => {
    const errs = {};
    if (!formData.password) {
      errs.password = "New password is required";
    } else if (formData.password.length < 6) {
      errs.password = "Password must be at least 6 characters";
    }

    if (!formData.confirmPassword) {
      errs.confirmPassword = "Confirm your new password";
    } else if (formData.password !== formData.confirmPassword) {
      errs.confirmPassword = "Passwords do not match";
    }

    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      setApiError("Invalid reset token. Please request a new reset link.");
      return;
    }

    const validationErrors = validate();
    setErrors(validationErrors);
    setApiError("");

    if (Object.keys(validationErrors).length === 0) {
      setIsLoading(true);
      try {
        const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
        const response = await fetch(`${apiBase}/auth/reset-password`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token,
            newPassword: formData.password,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          setIsSuccess(true);
          setTimeout(() => {
            navigate("/login");
          }, 2500);
        } else {
          setApiError(data.message || "Failed to reset password. The link may have expired.");
        }
      } catch (err) {
        setApiError("Unable to connect to the authentication server. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <AuthLayout
      title="Create New Password"
      subtitle={<span>Secure your account and continue your journey on <span className="text-[#6C4BF4] font-bold">Bookify</span>.</span>}
      illustration={loginIllustration}
      isRegister={false}
      tagText="Account Security"
    >
      {isSuccess ? (
        <div className="py-8 text-center animate-fade-in">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-500 shadow-md">
            <CheckCircle2 size={36} />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-[#17152A]">
            Password Updated!
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Your password has been reset successfully. Redirecting you to login in a moment...
          </p>
          <div className="mt-6">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 rounded-xl bg-[#6C4BF4] px-6 py-3 text-sm font-bold text-white shadow-md transition hover:bg-[#5B3DE0]"
            >
              Sign In Now
            </Link>
          </div>
        </div>
      ) : (
        <div>
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1.5 mb-1 text-[11px] font-bold text-[#6C4BF4] uppercase tracking-wider">
                <KeyRound size={14} />
                <span>Security Portal</span>
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-[#17152A]">
                Reset Password
              </h2>
              {emailParam && (
                <p className="mt-1 text-xs text-gray-500">
                  For: <span className="font-semibold text-gray-700">{emailParam}</span>
                </p>
              )}
            </div>
          </div>

          {apiError && (
            <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs text-red-600">
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              <div className="flex-1">
                <span>{apiError}</span>
                {(!token || apiError.includes("expired") || apiError.includes("invalid")) && (
                  <div className="mt-2">
                    <Link
                      to="/forgot-password"
                      className="font-bold text-red-700 underline hover:text-red-800"
                    >
                      Request a new password reset link
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* New Password */}
            <div>
              <label className="mb-1 block text-xs font-bold text-gray-700">
                New Password
              </label>
              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="At least 6 characters"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full rounded-xl border border-gray-200 bg-white py-3.5 pl-11 pr-11 text-sm text-[#17152A] outline-none transition placeholder:text-gray-400 focus:border-[#6C4BF4] focus:ring-4 focus:ring-[#6C4BF4]/10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-[#6C4BF4] cursor-pointer"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-red-500">{errors.password}</p>
              )}
            </div>

            {/* Confirm New Password */}
            <div>
              <label className="mb-1 block text-xs font-bold text-gray-700">
                Confirm New Password
              </label>
              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Re-type your new password"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({ ...formData, confirmPassword: e.target.value })
                  }
                  className="w-full rounded-xl border border-gray-200 bg-white py-3.5 pl-11 pr-11 text-sm text-[#17152A] outline-none transition placeholder:text-gray-400 focus:border-[#6C4BF4] focus:ring-4 focus:ring-[#6C4BF4]/10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-[#6C4BF4] cursor-pointer"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading || !token}
              className="mt-2 w-full rounded-xl bg-[#6C4BF4] py-3.5 font-bold text-white shadow-lg shadow-[#6C4BF4]/20 transition duration-200 hover:-translate-y-0.5 hover:bg-[#5B3DE0] hover:shadow-xl active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 cursor-pointer"
            >
              {isLoading ? "Updating Password..." : "Save New Password"}
            </button>
          </form>

          {/* Back to Login link */}
          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-[#6C4BF4] transition"
            >
              <ArrowLeft size={14} />
              <span>Back to Login</span>
            </Link>
          </div>
        </div>
      )}
    </AuthLayout>
  );
}
