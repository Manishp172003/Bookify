import { Link } from "react-router-dom";
import { Home, Search, BookOpen } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#f0edff] via-[#f5f3ff] to-[#f0edff]">

      {/* ── Floating Books (scattered across background) ── */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Top‑left cluster */}
        <div className="absolute top-[8%] left-[5%] w-16 h-20 rounded-lg shadow-md bg-[#a5b4fc] transform rotate-[-18deg]" />
        <div className="absolute top-[6%] left-[12%] w-14 h-18 rounded-lg shadow-md bg-[#c4b5fd] transform rotate-[8deg]" />

        {/* Top center / right */}
        <div className="absolute top-[4%] left-[35%] w-14 h-18 rounded-lg shadow-md bg-[#a78bfa] transform rotate-[12deg]" />
        <div className="absolute top-[10%] right-[32%] w-12 h-16 rounded-lg shadow-md bg-[#f9a8d4] transform rotate-[-8deg]" />
        <div className="absolute top-[5%] right-[18%] w-16 h-20 rounded-lg shadow-md bg-[#fdba74] transform rotate-[15deg]" />
        <div className="absolute top-[12%] right-[6%] w-14 h-18 rounded-lg shadow-md bg-[#f9a8d4] transform rotate-[-10deg]" />

        {/* Middle edges */}
        <div className="absolute top-[40%] left-[2%] w-12 h-16 rounded-lg shadow-md bg-[#c4b5fd] transform rotate-[20deg]" />
        <div className="absolute top-[35%] right-[2%] w-12 h-16 rounded-lg shadow-md bg-[#fda4af] transform rotate-[-15deg]" />

        {/* Bottom area */}
        <div className="absolute bottom-[18%] left-[8%] w-14 h-18 rounded-lg shadow-md bg-[#93c5fd] transform rotate-[-12deg]" />
        <div className="absolute bottom-[22%] right-[10%] w-16 h-20 rounded-lg shadow-md bg-[#fca5a5] transform rotate-[10deg]" />
        <div className="absolute bottom-[15%] right-[25%] w-12 h-16 rounded-lg shadow-md bg-[#d8b4fe] transform rotate-[18deg]" />
        <div className="absolute bottom-[20%] left-[22%] w-10 h-14 rounded-lg shadow-md bg-[#a5b4fc] transform rotate-[-22deg]" />

        {/* Soft gradient overlay so text stays readable */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/40 to-transparent" />
      </div>

      {/* ── Main Content ── */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-4xl w-full">

        {/* Bookify Logo */}
        <div className="absolute top-0 left-0 flex items-center gap-2">
          <BookOpen size={28} className="text-bookify-purple" />
          <span className="font-[family-name:var(--font-heading)] text-xl font-bold text-bookify-text">
            Bookify
          </span>
        </div>

        {/* Floating illustration — student at desk (top‑right area) */}
        <div className="hidden lg:block absolute top-4 right-4 w-72 h-72">
          {/* Desk */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-52 h-28 bg-[#e8e4f0] rounded-t-xl shadow-sm" />
          {/* Desk legs */}
          <div className="absolute bottom-0 left-[calc(50%-88px)] w-2.5 h-8 bg-[#d4cfe5] rounded-b" />
          <div className="absolute bottom-0 right-[calc(50%-88px)] w-2.5 h-8 bg-[#d4cfe5] rounded-b" />
          {/* Monitor */}
          <div className="absolute bottom-[120px] left-1/2 -translate-x-1/2 w-24 h-16 bg-[#3b3654] rounded-lg shadow-lg flex items-center justify-center">
            <div className="w-[85%] h-[80%] bg-[#5b5280] rounded" />
          </div>
          <div className="absolute bottom-[110px] left-1/2 -translate-x-1/2 w-8 h-3 bg-[#4a4465] rounded-b" />
          {/* Student (simplified) */}
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2">
            {/* Head */}
            <div className="w-12 h-12 bg-[#fddcb5] rounded-full mx-auto relative">
              {/* Hair */}
              <div className="absolute -top-1 -left-1 w-14 h-8 bg-[#3b3654] rounded-t-full" />
              {/* Eyes */}
              <div className="absolute top-5 left-2.5 w-1.5 h-1.5 bg-[#3b3654] rounded-full" />
              <div className="absolute top-5 right-2.5 w-1.5 h-1.5 bg-[#3b3654] rounded-full" />
              {/* Frown */}
              <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 w-4 h-2 border-b-2 border-[#3b3654] rounded-b-full" />
            </div>
            {/* Body */}
            <div className="w-16 h-14 bg-[#6c4bf4] rounded-t-xl -mt-1 mx-auto" />
          </div>
          {/* Book stack on desk */}
          <div className="absolute bottom-32 left-6 flex flex-col gap-0.5">
            <div className="w-10 h-2 bg-[#c4b5fd] rounded-sm" />
            <div className="w-10 h-2 bg-[#a78bfa] rounded-sm" />
            <div className="w-10 h-2 bg-[#8b5cf6] rounded-sm" />
          </div>
          {/* Backpack on floor */}
          <div className="absolute bottom-2 left-2 w-8 h-10 bg-[#8b5cf6] rounded-lg rounded-b-2xl" />
          {/* Question marks */}
          <span className="absolute top-12 right-12 text-3xl text-bookify-purple font-bold opacity-50 animate-bounce" style={{ animationDuration: "2s" }}>?</span>
          <span className="absolute top-20 right-20 text-2xl text-bookify-purple font-bold opacity-40 animate-bounce" style={{ animationDelay: "0.5s", animationDuration: "2.8s" }}>?</span>
        </div>

        {/* 404 Number */}
        <h1 className="font-[family-name:var(--font-heading)] text-[100px] sm:text-[130px] md:text-[160px] font-black leading-none text-bookify-purple select-none">
          404
        </h1>

        {/* Heading */}
        <h2 className="font-[family-name:var(--font-heading)] text-2xl sm:text-3xl md:text-4xl font-bold text-bookify-text mt-2 tracking-tight">
          PAGE NOT FOUND!
        </h2>

        {/* Description */}
        <p className="text-bookify-text-secondary mt-3 text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
          Looks like the book you are looking for has been misplaced or sold
          out. Let&apos;s get you back on track.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-bookify-purple hover:bg-bookify-purple-dark text-white font-semibold rounded-xl transition-all shadow-lg shadow-bookify-purple/25 hover:shadow-bookify-purple/40"
          >
            <Home size={18} />
            GO BACK TO HOME
          </Link>
          <Link
            to="/explore"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 border-2 border-bookify-purple text-bookify-purple hover:bg-bookify-light-purple font-semibold rounded-xl transition-all"
          >
            <Search size={18} />
            Browse Books
          </Link>
        </div>
      </div>
    </div>
  );
}
