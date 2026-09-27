import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, CheckCircle2, AlertCircle, ArrowLeft, KeyRound, ExternalLink } from "lucide-react";
import AuthLayout from "../../components/auth/AuthLayout";
import loginIllustration from "../../assets/images/auth/login-illustration.png";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successInfo, setSuccessInfo] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setError("Please enter your registered email address");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(cleanEmail)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
      const response = await fetch(`${apiBase}/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: cleanEmail }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessInfo({
          email: cleanEmail,
          message: data.message || "If an account exists, a reset link has been dispatched.",
          resetToken: data.resetToken || null,
          resetLink: data.resetLink || null,
        });
      } else {
        setError(data.message || "Unable to send reset link. Please try again.");
      }
    } catch (err) {
      setError("Unable to connect to the server. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Reset Your Password"
      subtitle={<span>We'll help you get back into your <span className="text-[#FFD166] font-bold">Bookify</span> account.</span>}
      illustration={loginIllustration}
      isRegister={false}
      tagText="Account Recovery"
    >
      {successInfo ? (
        <div className="py-4 text-center animate-fade-in">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-50 text-[#6C4BF4] shadow-md">
            <Mail size={32} />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-[#17152A]">
            Check Your Email
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-gray-600 leading-relaxed">
            If an account exists for <span className="font-semibold text-gray-900">{successInfo.email}</span>, we have sent a password reset link to your inbox.
          </p>
          <div className="mt-4 rounded-xl border border-gray-100 bg-[#F8F7FF] p-3.5 text-xs text-gray-600 text-left">
            <p className="font-semibold text-gray-800 mb-1">Didn't receive an email?</p>
            <ul className="list-disc list-inside space-y-1 text-gray-500 text-[11px]">
              <li>Check your Spam / Junk folder</li>
              <li>Wait 1-2 minutes for delivery</li>
              <li>Ensure the email entered matches your account</li>
            </ul>
          </div>

          {/* Quick Dev/Demo link helper */}
          {successInfo.resetToken && (
            <div className="mt-4 p-3 rounded-xl bg-amber-50 border border-amber-200 text-left">
              <span className="inline-block px-1.5 py-0.5 rounded bg-amber-200 text-[10px] font-bold text-amber-800 uppercase mb-1">
                Development Helper
              </span>
              <p className="text-[11px] text-amber-800">
                Direct reset link for quick local verification:
              </p>
              <Link
                to={`/reset-password?token=${successInfo.resetToken}&email=${encodeURIComponent(successInfo.email)}`}
                className="mt-1.5 inline-flex items-center gap-1 text-xs font-bold text-[#6C4BF4] hover:underline"
              >
                <span>Open Password Reset Screen</span>
                <ExternalLink size={12} />
              </Link>
            </div>
          )}

          <div className="mt-6 flex flex-col gap-2">
            <button
              type="button"
              onClick={() => {
                setSuccessInfo(null);
                setEmail("");
              }}
              className="text-xs font-bold text-[#6C4BF4] hover:underline cursor-pointer"
            >
              Send to a different email
            </button>
            <Link
              to="/login"
              className="inline-flex items-center justify-center gap-1.5 text-xs font-bold text-gray-500 hover:text-gray-800 transition"
            >
              <ArrowLeft size={14} />
              <span>Back to Login</span>
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
                <span>Password Assistance</span>
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-[#17152A]">
                Forgot Password?
              </h2>
              <p className="mt-1 text-xs text-gray-500">
                Enter your account email to receive a password reset link.
              </p>
            </div>
          </div>

          {error && (
            <div className="mb-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-600">
              <AlertCircle size={16} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="mb-1 block text-xs font-bold text-gray-700">
                Email Address
              </label>
              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="email"
                  placeholder="student@university.edu"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError("");
                  }}
                  className="w-full rounded-xl border border-gray-200 bg-white py-3.5 pl-11 pr-4 text-sm text-[#17152A] outline-none transition placeholder:text-gray-400 focus:border-[#6C4BF4] focus:ring-4 focus:ring-[#6C4BF4]/10"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="mt-2 w-full rounded-xl bg-[#6C4BF4] py-3.5 font-bold text-white shadow-lg shadow-[#6C4BF4]/20 transition duration-200 hover:-translate-y-0.5 hover:bg-[#5B3DE0] hover:shadow-xl active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 cursor-pointer"
            >
              {isLoading ? "Sending Reset Link..." : "Send Reset Link"}
            </button>
          </form>

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
