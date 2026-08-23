function AuthBranding({ title, subtitle }) {
  return (
    <section className="relative hidden min-h-screen overflow-hidden bg-[#6C4BF4] lg:flex">
      
      {/* Decorative circles */}
      <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-[#FF4F81]/20" />

      <div className="absolute -bottom-32 -right-20 h-96 w-96 rounded-full bg-[#38BDF8]/15" />

      <div className="absolute right-20 top-20 h-5 w-5 rounded-full bg-[#FFD166]" />

      <div className="absolute left-20 top-32 h-3 w-3 rounded-full bg-[#FF8A3D]" />

      <div className="relative z-10 flex w-full flex-col px-10 py-10 xl:px-16">
        
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-xl font-bold text-[#6C4BF4] shadow-lg">
            B
          </div>

          <span className="text-2xl font-bold tracking-tight text-white">
            BOOKIFY
          </span>
        </div>

        {/* Main Content */}
        <div className="flex flex-1 flex-col justify-center">

            <div className="mb-8 inline-flex w-fit items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm">
              <span className="h-2 w-2 rounded-full bg-[#22C55E]" />
              Made for college students
            </div>
          
          <div className="max-w-xl">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-[#FFD166]">
              Student Marketplace
            </p>

            <h1 className="max-w-lg text-4xl font-extrabold leading-tight tracking-tight text-white xl:text-6xl">
              {title}
            </h1>

            <p className="mt-5 max-w-lg text-lg leading-8 text-white/80 xl:text-xl">
              {subtitle}
            </p>
          </div>

          {/* Temporary illustration area */}
          <div className="mt-10 flex items-end justify-center">
            
            <div className="relative">
              
              {/* Books */}
              <div className="relative flex flex-col items-center">
                
                <div className="h-5 w-40 rotate-[-4deg] rounded-md bg-[#FF8A3D] shadow-lg" />

                <div className="-mt-1 h-6 w-48 rotate-[3deg] rounded-md bg-[#38BDF8] shadow-lg" />

                <div className="-mt-1 h-7 w-44 rotate-[-2deg] rounded-md bg-[#FF4F81] shadow-lg" />

                <div className="-mt-1 h-8 w-52 rotate-[2deg] rounded-md bg-[#FFD166] shadow-lg" />

              </div>

              {/* Floating book */}
              <div className="absolute -right-20 -top-16 flex h-16 w-12 rotate-12 items-center justify-center rounded-md bg-white text-xl shadow-xl">
                📚
              </div>

              {/* Plant */}
              <div className="absolute -left-16 -top-12 text-5xl">
                🌱
              </div>

            </div>

          </div>

          {/* Benefits */}
          <div className="mt-12 flex flex-wrap gap-3">
            
            <div className="rounded-full bg-white/10 px-4 py-2 text-sm text-white backdrop-blur-sm">
              ✓ Student Friendly
            </div>

            <div className="rounded-full bg-white/10 px-4 py-2 text-sm text-white backdrop-blur-sm">
              ✓ Save Money
            </div>

            <div className="rounded-full bg-white/10 px-4 py-2 text-sm text-white backdrop-blur-sm">
              ✓ Trusted Marketplace
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

export default AuthBranding;