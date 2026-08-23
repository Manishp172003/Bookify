import AuthBranding from "./AuthBranding";

function AuthLayout({ children, title, subtitle }) {
  return (
    <div className="min-h-screen bg-[#F8F7FF] lg:grid lg:grid-cols-2">
      
      {/* Left Branding Section */}
      <AuthBranding
        title={title}
        subtitle={subtitle}
      />

      {/* Right Auth Section */}
      <main className="flex min-h-screen items-center justify-center bg-white px-6 py-10 sm:px-10 lg:px-16">
        <div className="w-full max-w-md">
          {children}
        </div>
      </main>

    </div>
  );
}

export default AuthLayout;