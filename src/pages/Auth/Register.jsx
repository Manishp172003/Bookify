import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import registerIllustration from "../../assets/images/auth/register-illustration.png";
import { validateRegister } from "../../utils/validators";
import AuthLayout from "../../components/auth/AuthLayout";

function Register() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    terms: false,
  });

  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = validateRegister(formData);

    setErrors(validationErrors);
    setApiError("");

    if (Object.keys(validationErrors).length === 0) {
      setIsLoading(true);
      console.log("Register form is valid:", formData);
      setTimeout(() => {
        setIsLoading(false);
        navigate("/verify-otp");
      }, 2000);
    }
  };

  return (
    <AuthLayout
      title={<span>Create Your<br />Bookify <span className="text-[#6C4BF4]">Account</span></span>}
      subtitle="Join thousands of students saving money on books"
      illustration={registerIllustration}
      isRegister={true}
    >
      <form className="space-y-4" onSubmit={handleSubmit}>

        {/* Full Name */}
        <div>
          <label className="mb-1.5 block text-xs font-bold text-[#17152A]">
            Full Name
          </label>

          <input
            type="text"
            placeholder="Enter your full name"
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            className="w-full rounded-xl border border-gray-200 bg-white py-3 px-4 text-sm outline-none transition placeholder:text-gray-400 focus:border-[#6C4BF4] focus:ring-4 focus:ring-[#6C4BF4]/10"
          />
          {errors.fullName && (
            <p className="mt-1 text-xs text-red-500">{errors.fullName}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="mb-1.5 block text-xs font-bold text-[#17152A]">
            Email
          </label>

          <input
            type="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full rounded-xl border border-gray-200 bg-white py-3 px-4 text-sm outline-none transition placeholder:text-gray-400 focus:border-[#6C4BF4] focus:ring-4 focus:ring-[#6C4BF4]/10"
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-500">{errors.email}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label className="mb-1.5 block text-xs font-bold text-[#17152A]">
            Phone Number
          </label>

          <input
            type="tel"
            placeholder="Enter your phone number"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full rounded-xl border border-gray-200 bg-white py-3 px-4 text-sm outline-none transition placeholder:text-gray-400 focus:border-[#6C4BF4] focus:ring-4 focus:ring-[#6C4BF4]/10"
          />
          {errors.phone && (
            <p className="mt-1 text-xs text-red-500">{errors.phone}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="mb-1.5 block text-xs font-bold text-[#17152A]">
            Password
          </label>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Create a password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-4 pr-11 text-sm outline-none transition placeholder:text-gray-400 focus:border-[#6C4BF4] focus:ring-4 focus:ring-[#6C4BF4]/10"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#6C4BF4]"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-xs text-red-500">{errors.password}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="mb-1.5 block text-xs font-bold text-[#17152A]">
            Confirm Password
          </label>

          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-4 pr-11 text-sm outline-none transition placeholder:text-gray-400 focus:border-[#6C4BF4] focus:ring-4 focus:ring-[#6C4BF4]/10"
            />

            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#6C4BF4]"
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="mt-1 text-xs text-red-500">{errors.confirmPassword}</p>
          )}
        </div>

        {/* Terms */}
        <label className="flex cursor-pointer items-center gap-2 pt-1 text-xs font-medium text-gray-600">
          <input
            type="checkbox"
            checked={formData.terms}
            onChange={(e) => setFormData({ ...formData, terms: e.target.checked })}
            className="h-4 w-4 rounded border-gray-300 accent-[#6C4BF4]"
          />
          <span>
            I agree to the{" "}
            <button
              type="button"
              className="font-bold text-[#6C4BF4] hover:underline"
            >
              Terms & Conditions
            </button>
          </span>
        </label>
        {errors.terms && (
          <p className="mt-1 text-xs text-red-500">{errors.terms}</p>
        )}

        {/* Create Account */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-xl bg-[#6C4BF4] py-3.5 mt-2 font-bold text-white shadow-lg shadow-[#6C4BF4]/20 transition hover:-translate-y-0.5 hover:bg-[#5B3DE0] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 cursor-pointer"
        >
          {isLoading ? "Creating account..." : "Create Account"}
        </button>
        {apiError && (
          <p className="mt-2 text-center text-xs text-red-500">{apiError}</p>
        )}

      </form>

      {/* Login footer link */}
      <p className="mt-6 text-center text-sm text-gray-500 font-semibold">
        Already have an account?{" "}
        <Link
          to="/login"
          className="font-bold text-[#6C4BF4] hover:text-[#5B3DE0]"
        >
          Login
        </Link>
      </p>
    </AuthLayout>
  );
}

export default Register;