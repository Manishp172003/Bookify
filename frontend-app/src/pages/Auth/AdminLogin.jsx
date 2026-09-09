 import { Eye, EyeOff, Lock, Mail, ShieldAlert, KeyRound } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import loginIllustration from "../../assets/images/auth/login-illustration.png";
import AuthLayout from "../../components/auth/AuthLayout";

function AdminLogin() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    code: "",
  });

  const [errors, setErrors] = useState({});

  const validateAdminLogin = (data) => {
    const errs = {};
    if (!data.email) {
      errs.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      errs.email = "Invalid email address";
    }
    if (!data.password) {
      errs.password = "Password is required";
    }
    if (!data.code) {
      errs.code = "Verification code is required";
    } else if (!/^\d+$/.test(data.code)) {
      errs.code = "Verification code must be numeric only";
    } else if (data.code.length !== 15) {
      errs.code = `Verification code must be exactly 15 digits (currently ${data.code.length})`;
    }
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateAdminLogin(formData);
    setErrors(validationErrors);
    setApiError("");

    if (Object.keys(validationErrors).length === 0) {
      setIsLoading(true);
      try {
        const response = await fetch("http://localhost:5000/api/auth/admin-login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
            code: formData.code,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Admin authentication failed");
        }

        // Save token & redirect to admin panel
        localStorage.setItem("token", data.token);
        navigate("/admin");
      } catch (err) {
        setApiError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <AuthLayout
      title="Admin Portal Login"
      subtitle={<span>Secure gateway for <span className="text-[#6C4BF4] font-bold">Bookify</span> system administrators.</span>}
      illustration={loginIllustration}
      isRegister={false}
    >
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold tracking-tight text-[#17152A]">
          Admin Authentication
        </h2>
        <div className="bg-[#F0ECFF] p-2 rounded-xl text-[#6C4BF4]">
          <ShieldAlert size={20} />
        </div>
      </div>

      {/* Form */}
      <form className="space-y-5" onSubmit={handleSubmit}>

        {/* Email */}
        <div>
          <div className="relative">
            <Mail
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="email"
              placeholder="Administrator Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full rounded-xl border border-gray-200 bg-white py-3.5 pl-11 pr-4 text-sm text-[#17152A] outline-none transition placeholder:text-gray-400 focus:border-[#6C4BF4] focus:ring-4 focus:ring-[#6C4BF4]/10"
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-xs text-red-500">{errors.email}</p>
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
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-xs text-red-500">{errors.password}</p>
          )}
        </div>

        {/* 15-digit code */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold text-gray-700">Security Verification Code</label>
            <button
              type="button"
              onClick={() => {
                setFormData({
                  email: "admin@bookify.in",
                  password: "AdminPassword123!",
                  code: "123456789012345"
                });
                setErrors({});
              }}
              className="text-[11px] font-bold text-[#6C4BF4] hover:underline cursor-pointer bg-[#F0ECFF] px-2.5 py-0.5 rounded-full"
            >
              ⚡ Fill Demo Admin Credentials
            </button>
          </div>
          <div className="relative">
            <KeyRound
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              maxLength={15}
              placeholder="15-Digit Code (e.g. 123456789012345)"
              value={formData.code}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, ""); // Allow digits only
                setFormData({ ...formData, code: val });
              }}
              className="w-full rounded-xl border border-gray-200 bg-white py-3.5 pl-11 pr-4 text-sm text-[#17152A] outline-none transition placeholder:text-gray-400 focus:border-[#6C4BF4] focus:ring-4 focus:ring-[#6C4BF4]/10 font-mono tracking-widest"
            />
          </div>
          {errors.code && (
            <p className="mt-1 text-xs text-red-500">{errors.code}</p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-xl bg-[#6C4BF4] py-3.5 font-bold text-white shadow-lg shadow-[#6C4BF4]/20 transition duration-200 hover:-translate-y-0.5 hover:bg-[#5B3DE0] hover:shadow-xl active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {isLoading ? "Verifying Credentials..." : "Authenticate"}
        </button>
        {apiError && (
          <p className="mt-2 text-center text-xs text-red-500">{apiError}</p>
        )}

        <p className="text-center text-xs text-gray-500 pt-2">
          Not an administrator?{" "}
          <Link to="/login" className="font-bold text-[#6C4BF4] hover:underline">
            Student Login
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}

export default AdminLogin;