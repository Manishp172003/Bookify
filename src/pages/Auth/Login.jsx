import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

import { validateLogin } from "../../utils/validators";
import AuthLayout from "../../components/auth/AuthLayout";
import AuthCard from "../../components/auth/AuthCard";

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
      subtitle="Login to continue your Bookify journey."
    >
      <AuthCard>

        {/* Header */}
        <div className="mb-8">
  <div className="mb-3 inline-flex rounded-full bg-[#F0ECFF] px-3 py-1 text-xs font-semibold text-[#6C4BF4]">
    Student Marketplace
  </div>

  <h2 className="text-3xl font-bold tracking-tight text-[#17152A]">
    Welcome back 👋
  </h2>

  <p className="mt-2 text-sm leading-6 text-gray-500">
    Login to continue your Bookify journey.
  </p>
</div>

        {/* Form */}
        <form className="space-y-5" onSubmit={handleSubmit}>

          {/* Email / Phone */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-[#17152A]">
              Email or Phone Number
            </label>

            <div className="relative">
              <Mail
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                placeholder="Enter your email or phone number"
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
            <label className="mb-2 block text-sm font-semibold text-[#17152A]">
              Password
            </label>

            <div className="relative">
              <Lock
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
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

            <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-600">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 accent-[#6C4BF4]"
              />

              Remember Me
            </label>

            <button
              type="button"
              className="text-sm font-semibold text-[#6C4BF4] hover:text-[#5B3DE0]"
            >
              Forgot Password?
            </button>

          </div>

          {/* Login */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-xl bg-[#6C4BF4] py-3.5 font-semibold text-white shadow-lg shadow-[#6C4BF4]/20 transition duration-200 hover:-translate-y-0.5 hover:bg-[#5B3DE0] hover:shadow-xl active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
          {apiError && (
            <p className="mt-2 text-center text-xs text-red-500">{apiError}</p>
          )}

        </form>

        {/* Divider */}
        <div className="my-6 flex items-center gap-4">

          <div className="h-px flex-1 bg-gray-200" />

          <span className="text-xs font-medium text-gray-400">
            OR CONTINUE WITH
          </span>

          <div className="h-px flex-1 bg-gray-200" />

        </div>

        {/* Social Login */}
        <div className="grid grid-cols-2 gap-3">

          <button
            type="button"
            className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 py-3 text-sm font-medium text-[#17152A] transition hover:border-[#6C4BF4] hover:bg-[#F8F7FF]"
          >
            <span className="text-base font-bold text-[#4285F4]">
              G
            </span>

            Google
          </button>

          <button
        type="button"
         className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 py-3 text-sm font-medium text-[#17152A] transition hover:border-[#6C4BF4] hover:bg-[#F8F7FF]"
           >
       <span className="text-base font-bold">
          GH
          </span>

       GitHub
      </button>

        </div>

        {/* Register */}
        <p className="mt-7 text-center text-sm text-gray-500">

          Don't have an account?{" "}

          <Link
            to="/register"
            className="font-semibold text-[#6C4BF4] hover:text-[#5B3DE0]"
          >
            Sign up
          </Link>

        </p>

      </AuthCard>
    </AuthLayout>
  );
}

export default Login;