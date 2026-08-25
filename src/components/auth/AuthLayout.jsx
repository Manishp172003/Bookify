import AuthBranding from "./AuthBranding";
import AuthCard from "./AuthCard";

function AuthLayout({ children, title, subtitle, illustration, isRegister, theme, tagText, brandingFooter }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#ECE7FF] via-[#F4F5FA] to-[#E8F0FE] p-4 sm:p-6 md:p-8">
      <div className="flex w-full max-w-[1000px] overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-[0_25px_70px_-10px_rgba(23,21,42,0.12)] min-h-[640px]">
        
        {/* Left Branding Section */}
        <AuthBranding
          title={title}
          subtitle={subtitle}
          illustration={illustration}
          isRegister={isRegister}
          theme={theme}
          tagText={tagText}
          brandingFooter={brandingFooter}
        />

        {/* Right Auth Section */}
        <main className="flex flex-1 flex-col justify-center bg-white px-6 py-10 sm:px-10 lg:px-14">
          <div className="mx-auto w-full max-w-[400px]">
            <AuthCard>
              {children}
            </AuthCard>
          </div>
        </main>

      </div>
    </div>
  );
}

export default AuthLayout;