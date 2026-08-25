import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { validateOTP } from "../../utils/validators";
import AuthLayout from "../../components/auth/AuthLayout";
import otpIllustration from "../../assets/images/auth/OTP-verification-illustration.png";

function OTPVerification() {
  const navigate = useNavigate();

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [timer, setTimer] = useState(25);

  useEffect(() => {
    if (timer === 0) return;
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

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
      subtitle="Enter the 6-digit code sent to your phone"
      illustration={otpIllustration}
      isRegister={false}
      theme="light"
      brandingFooter={
        <div className="flex flex-col gap-1 text-[#17152A]">
          <p className="text-sm font-semibold">Didn't receive the code?</p>
          {timer > 0 ? (
            <span className="text-sm font-bold text-[#6C4BF4]">
              Resend in 00:{timer < 10 ? `0${timer}` : timer}
            </span>
          ) : (
            <button
              type="button"
              onClick={() => setTimer(25)}
              className="text-sm font-bold text-[#6C4BF4] hover:text-[#5B3DE0] cursor-pointer text-left hover:underline"
            >
              Resend OTP
            </button>
          )}
        </div>
      }
    >
      <div className="mb-8">
          <h2 className="text-2xl font-bold tracking-tight text-[#17152A]">
            Enter OTP
          </h2>

          <p className="mt-2 text-sm leading-6 text-gray-500 font-medium">
            We have sent a 6-digit code to <span className="font-bold text-[#6C4BF4]">+91 9876543210</span>
          </p>
        </div>

        {/* OTP Inputs */}
        <form onSubmit={handleSubmit}>
        <div className="flex justify-center gap-2 sm:gap-3">
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
          className="mt-8 w-full rounded-xl bg-[#6C4BF4] py-3.5 font-bold text-white shadow-lg shadow-[#6C4BF4]/20 transition hover:-translate-y-0.5 hover:bg-[#5B3DE0] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 cursor-pointer"
        >
          {isLoading ? "Verifying..." : "Verify OTP"}
        </button>
        {apiError && (
          <p className="mt-2 text-center text-xs text-red-500">{apiError}</p>
        )}
      </form>

      {/* Back to register / Change number */}
      <div className="mt-6 text-center">
        <button
          type="button"
          onClick={() => navigate("/register")}
          className="text-xs font-bold text-[#6C4BF4] hover:text-[#5B3DE0] cursor-pointer hover:underline"
        >
          Change Phone Number
        </button>
      </div>
    </AuthLayout>
  );
}

export default OTPVerification;