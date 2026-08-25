import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

import loginIllustration from "../../assets/images/auth/login-illustration.png";
import { validateLogin } from "../../utils/validators";
import AuthLayout from "../../components/auth/AuthLayout";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = validateLogin(formData);

    setErrors(validationErrors);
    setApiError("");

    if (Object.keys(validationErrors).length === 0) {
      setIsLoading(true);
      console.log("Login form is valid:", formData);
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    }
  };

  return (
    <AuthLayout
      title="Welcome Back!"
      subtitle={<span>Login to continue your <span className="text-[#FFD166] font-bold">Bookify</span> journey.</span>}
      illustration={loginIllustration}
      isRegister={false}
    >
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
            className="text-xs font-bold text-[#6C4BF4] hover:text-[#5B3DE0]"
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
    </AuthLayout>
  );
}

export default Login;