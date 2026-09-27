 import { Eye, EyeOff, Lock, Mail, Feather, CheckCircle2, X, AlertCircle, ExternalLink, KeyRound } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

import loginIllustration from "../../assets/images/auth/login-illustration.png";
import { validateLogin } from "../../utils/validators";
import AuthLayout from "../../components/auth/AuthLayout";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../services/apiClient";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  
  // New state for success popup modal
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  // Forgot Password modal state
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState("");
  const [forgotSuccess, setForgotSuccess] = useState(null);

  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    const cleanEmail = forgotEmail.trim();
    if (!cleanEmail) {
      setForgotError("Please enter your registered email address");
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
          clientUrl: window.location.origin,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setForgotSuccess({
          email: cleanEmail,
          message: data.message || "Password reset link sent to your email",
          resetToken: data.resetToken || null,
          resetLink: data.resetLink || null,
        });
      } else {
        setForgotError(data.message || "Failed to dispatch reset link");
      }
    } catch (err) {
      setForgotError("Unable to connect to the server. Please try again.");
    } finally {
      setForgotLoading(false);
    }
  };

 const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateLogin(formData);

    setErrors(validationErrors);
    setApiError("");

    if (Object.keys(validationErrors).length === 0) {
      setIsLoading(true);
      
      try {
        // 1. Send login credentials to backend API
        const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
        const response = await fetch(`${apiBase}/auth/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            identifier: formData.identifier,
            password: formData.password,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          // 2. Store the JWT token in localStorage
          localStorage.setItem("token", data.token);

          // 3. Update Auth Context state
          login(data.user || formData.identifier);

          setIsLoading(false);
          setShowSuccessPopup(true);

          // 4. Redirect after short popup delay
          setTimeout(() => {
            const isAuthor = formData.identifier.toLowerCase().includes("author");
            if (isAuthor) {
              navigate("/author", { replace: true });
            } else {
              const from = location.state?.from?.pathname || "/dashboard";
              navigate(from, { replace: true });
            }
          }, 1500);
        } else {
          // Handle wrong password / user not found errors from backend
          setIsLoading(false);
          setApiError(data.message || "Login failed. Invalid credentials.");
        }
      } catch (error) {
        setIsLoading(false);
        setApiError("Unable to connect to backend server. Make sure server is running.");
        console.error("Login fetch error:", error);
      }
    }
  };

  const handleGoogleLogin = () => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId) {
      setApiError("Google Sign-In is pending setup. Please set VITE_GOOGLE_CLIENT_ID in your environment variables.");
      return;
    }

    const startOAuth = () => {
      try {
        if (!window.google?.accounts?.oauth2) {
          throw new Error("Google Identity Services not loaded");
        }

        const client = window.google.accounts.oauth2.initTokenClient({
          client_id: clientId,
          scope: "openid email profile",
          callback: async (tokenResponse) => {
            if (tokenResponse?.error) {
              setIsLoading(false);
              if (tokenResponse.error !== "popup_closed_by_user") {
                setApiError(tokenResponse.error_description || tokenResponse.error);
              }
              return;
            }

            if (tokenResponse?.access_token) {
              setIsLoading(true);
              setApiError("");
              try {
                const userInfoRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
                  headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
                });
                const googleUser = await userInfoRes.json();

                if (!googleUser?.email) {
                  throw new Error("Unable to retrieve email from Google account");
                }

                const res = await api.post("/auth/google", {
                  email: googleUser.email,
                  fullName: googleUser.name || googleUser.given_name || "Google User",
                  avatar: googleUser.picture || null,
                  googleId: googleUser.sub,
                });

                if (res?.token) {
                  login(res.user, res.token);
                  setShowSuccessPopup(true);
                  setTimeout(() => {
                    navigate("/dashboard", { replace: true });
                  }, 1500);
                } else {
                  throw new Error(res?.message || "Failed to authenticate with Bookify server");
                }
              } catch (err) {
                console.error("Google authentication error:", err);
                setApiError(err.message || "Google authentication failed");
              } finally {
                setIsLoading(false);
              }
            }
          },
        });

        client.requestAccessToken();
      } catch (err) {
        console.error("Failed to start Google OAuth:", err);
        setApiError(err.message || "Google Sign-In initialization failed");
        setIsLoading(false);
      }
    };

    if (window.google?.accounts?.oauth2) {
      startOAuth();
    } else {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = startOAuth;
      script.onerror = () => {
        setApiError("Failed to load Google Identity Services library. Please check your internet connection.");
      };
      document.body.appendChild(script);
    }
  };

  return (
    <AuthLayout
      title="Welcome Back!"
      subtitle={<span>Login to continue your <span className="text-[#FFD166] font-bold">Bookify</span> journey.</span>}
      illustration={loginIllustration}
      isRegister={false}
    >
      {/* Success Popup Modal Overlay */}
      {showSuccessPopup && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs transition-all">
          <div className="w-80 rounded-2xl bg-white p-6 text-center shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-green-600">
              <CheckCircle2 size={32} />
            </div>
            <h3 className="text-lg font-bold text-[#17152A]">Logged In Successfully!</h3>
            <p className="mt-1 text-xs text-gray-500">
              Welcome back! Redirecting to your dashboard...
            </p>
          </div>
        </div>
      )}

      {/* Header with mini books & plant accent */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold tracking-tight text-[#17152A]">
            Login to Bookify
          </h2>
          
          {/* Cute CSS stack of books with plant */}
          <div className="relative flex flex-col items-center justify-end w-12 h-12 shrink-0">
            <span className="text-xl leading-none z-10 select-none animate-bounce mb-1">🪴</span>
            <div className="flex flex-col items-center w-full gap-0.5">
              <div className="h-1 w-6 rounded-sm bg-[#FFD166] shadow-sm" />
              <div className="h-1 w-8 rounded-sm bg-[#38BDF8] shadow-sm" />
              <div className="h-1.5 w-7 rounded-sm bg-[#FF4F81] shadow-sm" />
            </div>
          </div>
        </div>

        {/* Form */}
        <form className="space-y-5" onSubmit={handleSubmit}>

        {/* Email / Phone */}
        <div>
          <div className="relative">
            <Mail
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              placeholder="Email or Phone Number"
              value={formData.identifier}
              onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
              className="w-full rounded-xl border border-gray-200 bg-white py-3.5 pl-11 pr-4 text-sm text-[#17152A] outline-none transition placeholder:text-gray-400 focus:border-[#6C4BF4] focus:ring-4 focus:ring-[#6C4BF4]/10"
            />
          </div>
          {errors.identifier && (
            <p className="mt-1 text-xs text-red-500">{errors.identifier}</p>
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
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full rounded-xl border border-gray-200 bg-white py-3.5 pl-11 pr-11 text-sm text-[#17152A] outline-none transition placeholder:text-gray-400 focus:border-[#6C4BF4] focus:ring-4 focus:ring-[#6C4BF4]/10"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-[#6C4BF4]"
            >
              {showPassword ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-xs text-red-500">{errors.password}</p>
          )}
        </div>

        {/* Remember + Forgot */}
        <div className="flex items-center justify-between">
          <label className="flex cursor-pointer items-center gap-2 text-xs font-semibold text-gray-600">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 accent-[#6C4BF4]"
            />
            Remember Me
          </label>

          <button
            type="button"
            onClick={() => {
              setForgotEmail(formData.identifier && formData.identifier.includes("@") ? formData.identifier : "");
              setForgotError("");
              setForgotSuccess(null);
              setShowForgotModal(true);
            }}
            className="text-xs font-bold text-[#6C4BF4] hover:text-[#5B3DE0] cursor-pointer"
          >
            Forgot Password?
          </button>
        </div>

        {/* Login */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-xl bg-[#6C4BF4] py-3.5 font-bold text-white shadow-lg shadow-[#6C4BF4]/20 transition duration-200 hover:-translate-y-0.5 hover:bg-[#5B3DE0] hover:shadow-xl active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 cursor-pointer"
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>
        {apiError && (
          <p className="mt-2 text-center text-xs text-red-500">{apiError}</p>
        )}

      </form>

      {/* Divider */}
      <div className="my-6 flex items-center gap-4">
        <div className="h-px flex-1 bg-gray-150" />
        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
          or continue with
        </span>
        <div className="h-px flex-1 bg-gray-150" />
      </div>

      {/* Social Login */}
      <div>
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="flex w-full items-center justify-center gap-3 rounded-xl border border-gray-200 py-3 text-sm font-bold text-[#17152A] transition hover:border-[#6C4BF4] hover:bg-[#F8F7FF] cursor-pointer"
        >
          <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>
      </div>

      {/* Register */}
      <p className="mt-7 text-center text-sm text-gray-500 font-semibold">
        Don't have an account?{" "}
        <Link
          to="/register"
          className="font-bold text-[#6C4BF4] hover:text-[#5B3DE0]"
        >
          Sign up
        </Link>
      </p>

      {/* Author Portal Link */}
      <div className="mt-6 pt-5 border-t border-gray-150 text-center">
        <div className="inline-flex items-center gap-2 rounded-xl bg-[#F8F7FF] px-3.5 py-2 text-xs text-gray-600 border border-[#6C4BF4]/15">
          <Feather size={14} className="text-[#6C4BF4] shrink-0" />
          <span>Publishing with Bookify?</span>
          <Link
            to="/author/login"
            className="font-bold text-[#6C4BF4] hover:text-[#5B3DE0] hover:underline"
          >
            Author Portal &rarr;
          </Link>
        </div>
      </div>

      {/* Forgot Password Modal Overlay */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-fade-in">
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-gray-100 animate-scale-in">
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setShowForgotModal(false)}
              className="absolute right-4 top-4 rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition cursor-pointer"
            >
              <X size={18} />
            </button>

            {forgotSuccess ? (
              <div className="py-2 text-center">
                <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-purple-50 text-[#6C4BF4] shadow-sm">
                  <Mail size={28} />
                </div>
                <h3 className="text-xl font-bold text-[#17152A]">Check Your Inbox</h3>
                <p className="mt-2 text-xs text-gray-600 leading-relaxed">
                  If an account exists for <span className="font-semibold text-gray-900">{forgotSuccess.email}</span>, a password reset link has been dispatched to your email.
                </p>

                {forgotSuccess.resetToken && (
                  <div className="mt-4 p-3 rounded-xl bg-amber-50 border border-amber-200 text-left">
                    <span className="inline-block px-1.5 py-0.5 rounded bg-amber-200 text-[10px] font-bold text-amber-800 uppercase mb-1">
                      Dev Helper
                    </span>
                    <p className="text-[11px] text-amber-800">
                      Direct link for instant local testing:
                    </p>
                    <Link
                      to={`/reset-password?token=${forgotSuccess.resetToken}&email=${encodeURIComponent(forgotSuccess.email)}`}
                      onClick={() => setShowForgotModal(false)}
                      className="mt-1.5 inline-flex items-center gap-1 text-xs font-bold text-[#6C4BF4] hover:underline"
                    >
                      <span>Proceed to Reset Password</span>
                      <ExternalLink size={12} />
                    </Link>
                  </div>
                )}

                <div className="mt-6 flex flex-col gap-2">
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
                    Back to Login
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="mb-4">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#6C4BF4] uppercase tracking-wider mb-1">
                    <KeyRound size={14} />
                    <span>Password Recovery</span>
                  </div>
                  <h3 className="text-xl font-bold tracking-tight text-[#17152A]">
                    Forgot Your Password?
                  </h3>
                  <p className="mt-1 text-xs text-gray-500">
                    Enter the email registered with your Bookify account and we'll send you a password reset link.
                  </p>
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
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail
                        size={16}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                      />
                      <input
                        type="email"
                        placeholder="you@university.edu"
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
                    to="/forgot-password"
                    onClick={() => setShowForgotModal(false)}
                    className="text-[11px] font-semibold text-gray-400 hover:text-[#6C4BF4] transition"
                  >
                    Open dedicated reset page &rarr;
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

export default Login;