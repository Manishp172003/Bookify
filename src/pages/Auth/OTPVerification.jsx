import { ArrowLeft, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { validateOTP } from "../../utils/validators";
import AuthLayout from "../../components/auth/AuthLayout";
import AuthCard from "../../components/auth/AuthCard";

function OTPVerification() {
  const navigate = useNavigate();

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const handleOtpChange = (index, value) => {
    if (value && !/^[0-9]$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const otpString = otp.join("");
    const validationErrors = validateOTP(otpString);

    setErrors(validationErrors);
    setApiError("");

    if (Object.keys(validationErrors).length === 0) {
      setIsLoading(true);
      console.log("OTP is valid:", otpString);
      setTimeout(() => {
        setIsLoading(false);
        navigate("/login");
      }, 2000);
    }
  };

  return (
    <AuthLayout
      title="Almost There!"
      subtitle="Verify your account and start your Bookify journey."
    >
      <AuthCard>

        <div className="text-center">

          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F0ECFF]">
            <ShieldCheck size={32} className="text-[#6C4BF4]" />
          </div>

          <h2 className="text-3xl font-bold text-[#17152A]">
            Verify Your Account
          </h2>

          <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-gray-500">
            We sent a 6-digit verification code to your email or phone number.
          </p>

        </div>

        {/* OTP Inputs */}
        <form onSubmit={handleSubmit}>
          <div className="mt-8 flex justify-center gap-2 sm:gap-3">
            {[0, 1, 2, 3, 4, 5].map((index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                maxLength="1"
                inputMode="numeric"
                value={otp[index]}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="h-12 w-11 rounded-xl border border-gray-200 text-center text-lg font-bold outline-none transition focus:border-[#6C4BF4] focus:ring-4 focus:ring-[#6C4BF4]/10 sm:h-14 sm:w-12"
              />
            ))}
          </div>
          {errors.otp && (
            <p className="mt-2 text-center text-xs text-red-500">{errors.otp}</p>
          )}

        {/* Verify */}
        <button
          type="submit"
          disabled={isLoading}
          className="mt-7 w-full rounded-xl bg-[#6C4BF4] py-3.5 font-semibold text-white shadow-lg shadow-[#6C4BF4]/20 transition hover:-translate-y-0.5 hover:bg-[#5B3DE0] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
        >
          {isLoading ? "Verifying..." : "Verify Account"}
        </button>
        {apiError && (
          <p className="mt-2 text-center text-xs text-red-500">{apiError}</p>
        )}
        </form>

        {/* Resend */}
        <p className="mt-6 text-center text-sm text-gray-500">
          Didn't receive the code?{" "}
          <button
            type="button"
            className="font-semibold text-[#6C4BF4]"
          >
            Resend OTP
          </button>
        </p>

        {/* Back */}
        <button
     type="button"
     onClick={() => navigate("/register")}
  className="mx-auto mt-5 flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-[#6C4BF4]"
>
  <ArrowLeft size={16} />
  Back to Register
</button>

      </AuthCard>
    </AuthLayout>
  );
}

export default OTPVerification;