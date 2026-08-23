import { ShieldCheck } from "lucide-react";

function AuthBranding({ title, subtitle, illustration, isRegister, theme, tagText, brandingFooter }) {
  const isLightTheme = theme === "light" || isRegister;
  return (
    <section 
      className={`relative hidden w-[420px] shrink-0 flex-col justify-between p-10 overflow-hidden lg:flex transition-all duration-300 ${
        isLightTheme 
          ? "bg-[#F8F7FF]" 
          : "bg-gradient-to-br from-[#2E189A] to-[#6C4BF4]"
      }`}
    >
      {/* Decorative circles & stars for Login */}
      {!isLightTheme && (
        <>
          <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-[#FF4F81]/15 blur-2xl" />
          <div className="absolute -bottom-32 -right-20 h-96 w-96 rounded-full bg-[#38BDF8]/15 blur-2xl" />
          {/* Sparkles / stars */}
          <div className="absolute right-20 top-24 h-4 w-4 rounded-full bg-[#FFD166]/40 blur-[1px]" />
          <div className="absolute left-16 top-48 h-3 w-3 rounded-full bg-[#FF8A3D]/40 blur-[1px]" />
        </>
      )}

      {/* Top Section: Logo */}
      <div className="relative z-10 flex flex-col gap-6">
        {/* Dynamic Tag */}
        {tagText && (
          <div className="w-fit">
            <span className={`inline-flex rounded-lg px-3.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-white shadow-sm ${
              isLightTheme ? "bg-[#401FBE]" : "bg-[#250E7A]"
            }`}>
              {tagText}
            </span>
          </div>
        )}

        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className={`flex h-10 w-10 items-center justify-center rounded-xl font-extrabold text-xl shadow-md ${
            isLightTheme ? "bg-[#6C4BF4] text-white" : "bg-white text-[#6C4BF4]"
          }`}>
            B
          </div>
          <span className={`text-2xl font-bold tracking-tight ${
            isLightTheme ? "text-[#17152A]" : "text-white"
          }`}>
            BOOKIFY
          </span>
        </div>
      </div>

      {/* Middle Section: Title & Subtitle & Illustration */}
      <div className="relative z-10 my-auto flex flex-col justify-center py-6">
        <div className="max-w-[340px]">
          <p className={`mb-3 text-[10px] font-bold uppercase tracking-[0.2em] ${
            isLightTheme ? "text-[#6C4BF4]" : "text-[#FFD166]"
          }`}>
            Student Marketplace
          </p>

          <h1 className={`text-3xl font-extrabold leading-tight tracking-tight xl:text-4xl ${
            isLightTheme ? "text-[#17152A]" : "text-white"
          }`}>
            {title}
          </h1>

          <p className={`mt-4 text-sm leading-6 ${
            isLightTheme ? "text-gray-500" : "text-white/80"
          }`}>
            {subtitle}
          </p>
        </div>

        {/* Illustration */}
        {illustration && (
          <div className="mt-8 flex justify-center">
            <img
              src={illustration}
              alt="Authentication illustration"
              className="h-56 w-auto object-contain pointer-events-none drop-shadow-lg"
            />
          </div>
        )}
      </div>

      {/* Bottom Section: Benefits (Only for Register) */}
      <div className="relative z-10">
        {isRegister && (
          <div className="flex flex-col gap-3.5 border-t border-gray-100 pt-6">
            <div className="flex items-center gap-3 text-sm font-semibold text-[#17152A]">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#10B981]/10 text-[#10B981]">
                <ShieldCheck size={14} strokeWidth={3} />
              </span>
              100% Secure
            </div>
            <div className="flex items-center gap-3 text-sm font-semibold text-[#17152A]">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#10B981]/10 text-[#10B981]">
                <ShieldCheck size={14} strokeWidth={3} />
              </span>
              Student Friendly
            </div>
            <div className="flex items-center gap-3 text-sm font-semibold text-[#17152A]">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#3B82F6]/10 text-[#3B82F6]">
                <ShieldCheck size={14} strokeWidth={3} />
              </span>
              Trusted by Colleges
            </div>
          </div>
        )}
        {brandingFooter && (
          <div className="border-t border-gray-100 pt-6">
            {brandingFooter}
          </div>
        )}
      </div>
    </section>
  );
}

export default AuthBranding;