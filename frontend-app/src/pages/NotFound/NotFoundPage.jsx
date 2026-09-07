import { Link } from "react-router-dom";
import { Home, Search, BookOpen } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-5xl w-full grid md:grid-cols-2 gap-8 items-center">
        {/* Left Content */}
        <div className="text-center md:text-left">
          <div className="flex items-center gap-2 mb-8 justify-center md:justify-start">
            <BookOpen size={28} className="text-bookify-purple" />
            <span className="font-[family-name:var(--font-heading)] text-xl font-bold text-bookify-text">
              Bookify
            </span>
          </div>

          <h1 className="font-[family-name:var(--font-heading)] text-[120px] md:text-[160px] font-bold leading-none text-bookify-purple">
            404
          </h1>
          <h2 className="font-[family-name:var(--font-heading)] text-2xl md:text-3xl font-bold text-bookify-text mt-2">
            PAGE NOT FOUND!
          </h2>
          <p className="text-bookify-text-secondary mt-4 text-sm md:text-base max-w-md">
            Looks like the book you are looking for has been misplaced or sold
            out. Let's get you back on track.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mt-8 justify-center md:justify-start">
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-bookify-purple hover:bg-bookify-purple-dark text-white font-semibold rounded-xl transition-colors"
            >
              <Home size={18} />
              GO BACK TO HOME
            </Link>
            <Link
              to="/explore"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 border-2 border-bookify-purple text-bookify-purple hover:bg-bookify-light-purple font-semibold rounded-xl transition-colors"
            >
              <Search size={18} />
              Browse Books
            </Link>
          </div>
        </div>

        {/* Right Illustration */}
        <div className="hidden md:flex items-center justify-center relative">
          <div className="relative w-full max-w-md">
            {/* Floating Books */}
            <div className="absolute -top-4 left-8 animate-bounce" style={{ animationDelay: "0s", animationDuration: "3s" }}>
              <div className="w-16 h-20 bg-bookify-purple rounded-lg shadow-lg transform rotate-[-15deg] flex items-center justify-center">
                <BookOpen size={24} className="text-white" />
              </div>
            </div>
            <div className="absolute -top-8 right-16 animate-bounce" style={{ animationDelay: "0.5s", animationDuration: "2.5s" }}>
              <div className="w-14 h-18 bg-bookify-orange rounded-lg shadow-lg transform rotate-[10deg] flex items-center justify-center">
                <BookOpen size={20} className="text-white" />
              </div>
            </div>
            <div className="absolute top-4 right-4 animate-bounce" style={{ animationDelay: "1s", animationDuration: "3.5s" }}>
              <div className="w-12 h-16 bg-bookify-pink rounded-lg shadow-lg transform rotate-[-5deg] flex items-center justify-center">
                <BookOpen size={18} className="text-white" />
              </div>
            </div>
            <div className="absolute top-12 left-0 animate-bounce" style={{ animationDelay: "1.5s", animationDuration: "2.8s" }}>
              <div className="w-10 h-14 bg-bookify-blue rounded-lg shadow-lg transform rotate-[20deg] flex items-center justify-center">
                <BookOpen size={16} className="text-white" />
              </div>
            </div>
            <div className="absolute -top-2 left-1/2 animate-bounce" style={{ animationDelay: "0.8s", animationDuration: "3.2s" }}>
              <div className="w-8 h-10 bg-bookify-green rounded-lg shadow-lg transform rotate-[-25deg]" />
            </div>

            {/* Question Mark */}
            <div className="absolute -top-6 right-1/3">
              <span className="text-5xl text-bookify-purple font-bold opacity-60">?</span>
            </div>

            {/* Desk Surface */}
            <div className="bg-gradient-to-b from-gray-100 to-gray-200 rounded-t-3xl h-48 mt-20 border-b-4 border-gray-300 relative">
              {/* Monitor */}
              <div className="absolute top-8 left-1/2 -translate-x-1/2">
                <div className="w-40 h-28 bg-gray-800 rounded-xl p-2 shadow-xl">
                  <div className="w-full h-full bg-gradient-to-br from-bookify-purple/20 to-bookify-purple/40 rounded-lg flex items-center justify-center">
                    <span className="text-4xl">😴</span>
                  </div>
                </div>
                <div className="w-16 h-4 bg-gray-600 mx-auto rounded-b-lg" />
                <div className="w-24 h-2 bg-gray-500 mx-auto rounded-full" />
              </div>

              {/* Student Character */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-6xl">
                🧑‍💻
              </div>

              {/* Stack of Books on desk */}
              <div className="absolute bottom-4 left-8">
                <div className="w-12 h-3 bg-bookify-orange rounded-sm" />
                <div className="w-14 h-3 bg-bookify-purple rounded-sm -mt-0.5" />
                <div className="w-11 h-3 bg-bookify-blue rounded-sm -mt-0.5" />
              </div>

              {/* Coffee Mug */}
              <div className="absolute bottom-4 right-12 text-2xl">☕</div>
            </div>

            {/* Desk Legs */}
            <div className="flex justify-between px-12">
              <div className="w-3 h-16 bg-gray-300 rounded-b-lg" />
              <div className="w-3 h-16 bg-gray-300 rounded-b-lg" />
            </div>

            {/* Backpack */}
            <div className="absolute bottom-0 left-4 text-4xl">🎒</div>

            {/* Plant */}
            <div className="absolute bottom-0 right-4">
              <span className="text-3xl">🪴</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
