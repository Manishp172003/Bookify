import { useState, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Barcode,
  X,
  TrendingUp,
  BookOpen,
  ArrowRight,
} from "lucide-react";

const trendingSearches = [
  "NCERT Physics",
  "Data Structures",
  "Atomic Habits",
  "JEE Mathematics",
  "UPSC Polity",
];

export default function SearchBar({
  defaultValue = "",
  onSearch,
  size = "md",
  placeholder = "Search by title, author, ISBN...",
  books = [],
}) {
  const [query, setQuery] = useState(defaultValue);
  const [isFocused, setIsFocused] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const inputRef = useRef(null);
  const wrapperRef = useRef(null);
  const navigate = useNavigate();

  const playBeep = () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.type = "sine";
      oscillator.frequency.value = 1000;
      gainNode.gain.setValueAtTime(0.08, audioCtx.currentTime);

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      oscillator.start();
      setTimeout(() => {
        oscillator.stop();
        audioCtx.close();
      }, 120);
    } catch (err) {
      console.warn("Audio Context failed to play beep:", err);
    }
  };

  const triggerMockScan = (bookTitle, isbnCode) => {
    playBeep();
    setQuery(bookTitle);
    setIsScannerOpen(false);
    if (onSearch) {
      onSearch(bookTitle);
    } else {
      navigate(`/explore?q=${encodeURIComponent(bookTitle)}`);
    }
  };

  // Generate suggestions from books based on query
  const suggestions = useMemo(() => {
    if (!query || query.length < 2 || books.length === 0) return [];

    const q = query.toLowerCase();
    const keywords = q.split(/\s+/).filter(Boolean);

    const matched = books
      .map((book) => {
        let score = 0;
        const title = book.title.toLowerCase();
        const author = book.author.toLowerCase();
        const isbn = book.isbn || "";
        const category = book.category.toLowerCase();
        const subCategory = (book.subCategory || "").toLowerCase();

        // Exact title start match = highest score
        if (title.startsWith(q)) score += 100;
        // Title contains full query
        if (title.includes(q)) score += 80;
        // Author contains query
        if (author.includes(q)) score += 60;
        // ISBN match
        if (isbn.includes(q)) score += 90;
        // Category match
        if (category.includes(q)) score += 40;
        // Sub-category match
        if (subCategory.includes(q)) score += 35;

        // Keyword matching - each keyword adds score
        keywords.forEach((kw) => {
          if (title.includes(kw)) score += 20;
          if (author.includes(kw)) score += 15;
          if (category.includes(kw)) score += 10;
          if (subCategory.includes(kw)) score += 8;
        });

        return { book, score };
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 8);

    return matched;
  }, [query, books]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      if (onSearch) {
        onSearch(query.trim());
      } else {
        navigate(`/explore?q=${encodeURIComponent(query.trim())}`);
      }
      setIsFocused(false);
    }
  };

  const handleSuggestionClick = (book) => {
    setQuery(book.title);
    setIsFocused(false);
    // Always navigate to book detail page when suggestion is clicked
    navigate(`/book/${book.id}`);
  };

  const handleTrendingClick = (term) => {
    setQuery(term);
    if (onSearch) {
      onSearch(term);
    } else {
      navigate(`/explore?q=${encodeURIComponent(term)}`);
    }
    setIsFocused(false);
  };

  const handleKeyDown = (e) => {
    if (!suggestions.length) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIndex((prev) =>
        prev > 0 ? prev - 1 : suggestions.length - 1
      );
    } else if (e.key === "Enter" && highlightIndex >= 0) {
      e.preventDefault();
      handleSuggestionClick(suggestions[highlightIndex].book);
    } else if (e.key === "Escape") {
      setIsFocused(false);
      inputRef.current?.blur();
    }
  };

  // Highlight matching text
  const highlightMatch = (text, maxLength = 40) => {
    if (!query) return text;
    const truncated = text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
    const q = query.toLowerCase();
    const idx = truncated.toLowerCase().indexOf(q);
    if (idx === -1) {
      // Try keyword match
      const keywords = q.split(/\s+/);
      let result = truncated;
      keywords.forEach((kw) => {
        if (kw.length < 2) return;
        const regex = new RegExp(`(${kw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
        result = result.replace(regex, '<mark class="bg-bookify-light-purple text-bookify-purple rounded px-0.5">$1</mark>');
      });
      return <span dangerouslySetInnerHTML={{ __html: result }} />;
    }
    const before = truncated.slice(0, idx);
    const match = truncated.slice(idx, idx + query.length);
    const after = truncated.slice(idx + query.length);
    return (
      <span>
        {before}
        <mark className="bg-bookify-light-purple text-bookify-purple rounded px-0.5">{match}</mark>
        {after}
      </span>
    );
  };

  const sizeClasses = {
    sm: "py-2 pl-11 pr-4 text-sm",
    md: "py-3 pl-12 pr-5 text-base",
    lg: "py-4 pl-14 pr-6 text-lg",
  };

  const showSuggestions = isFocused && query && query.length >= 2 && suggestions.length > 0;
  const showTrending = isFocused && !query;

  return (
    <div className="relative w-full" ref={wrapperRef}>
      <form onSubmit={handleSubmit} className="relative">
        <Search
          size={size === "lg" ? 22 : 18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-bookify-text-secondary pointer-events-none"
        />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setHighlightIndex(-1);
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 250)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={`w-full ${sizeClasses[size]} bg-white border-2 border-bookify-border rounded-xl focus:border-bookify-purple focus:outline-none transition-colors text-bookify-text placeholder-bookify-text-secondary font-[family-name:var(--font-body)]`}
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                inputRef.current?.focus();
              }}
              className="p-1.5 rounded-full hover:bg-bookify-bg transition-colors text-bookify-text-secondary"
            >
              <X size={14} />
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              setIsScannerOpen(true);
              setIsFocused(false);
            }}
            className="p-2 rounded-lg bg-bookify-light-purple text-bookify-purple hover:bg-bookify-purple hover:text-white transition-colors cursor-pointer"
            title="Scan ISBN barcode"
          >
            <Barcode size={16} />
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-bookify-purple text-white text-sm font-medium hover:bg-bookify-purple-dark transition-colors"
          >
            Search
          </button>
        </div>
      </form>

      {/* Trending Searches (when focused but empty) */}
      {showTrending && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-bookify-border rounded-xl shadow-lg z-50 p-4">
          <p className="text-xs font-medium text-bookify-text-secondary mb-2 flex items-center gap-1">
            <TrendingUp size={12} />
            TRENDING SEARCHES
          </p>
          <div className="flex flex-wrap gap-2">
            {trendingSearches.map((term) => (
              <button
                key={term}
                onMouseDown={() => handleTrendingClick(term)}
                className="text-sm px-3 py-1.5 rounded-full bg-bookify-bg text-bookify-text-secondary hover:bg-bookify-light-purple hover:text-bookify-purple transition-colors"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Book Suggestions Dropdown */}
      {showSuggestions && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-bookify-border rounded-xl shadow-lg z-50 overflow-hidden">
          <div className="p-2">
            <p className="text-xs font-medium text-bookify-text-secondary px-3 py-1.5 flex items-center gap-1">
              <BookOpen size={12} />
              BOOKS ({suggestions.length})
            </p>
            {suggestions.map((item, index) => (
              <button
                key={item.book.id}
                onMouseDown={() => handleSuggestionClick(item.book)}
                onMouseEnter={() => setHighlightIndex(index)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-left ${
                  highlightIndex === index
                    ? "bg-bookify-light-purple"
                    : "hover:bg-bookify-bg"
                }`}
              >
                <img
                  src={item.book.coverImage}
                  alt={item.book.title}
                  className="w-10 h-14 rounded object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-bookify-text truncate">
                    {highlightMatch(item.book.title)}
                  </p>
                  <p className="text-xs text-bookify-text-secondary truncate">
                    {highlightMatch(item.book.author)}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs font-semibold text-bookify-purple">
                      ₹{item.book.askingPrice}
                    </span>
                    <span className="text-[10px] text-bookify-text-secondary">
                      {item.book.category}
                    </span>
                  </div>
                </div>
                <ArrowRight
                  size={14}
                  className={`flex-shrink-0 transition-colors ${
                    highlightIndex === index
                      ? "text-bookify-purple"
                      : "text-bookify-text-secondary"
                  }`}
                />
              </button>
            ))}
          </div>
          <div className="border-t border-bookify-border px-4 py-2.5 bg-bookify-bg/50">
            <button
              onMouseDown={handleSubmit}
              className="w-full text-sm text-bookify-purple font-medium hover:underline flex items-center justify-center gap-1"
            >
              View all results for "{query}"
              <ArrowRight size={12} />
            </button>
          </div>
        </div>
      )}
      {/* Webcam Barcode Scanner Modal */}
      {isScannerOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-fade-in">
          <div className="bg-[#121124] text-white rounded-3xl max-w-md w-full p-6 shadow-2xl animate-scale-up border border-white/5 relative overflow-hidden">
            {/* Ambient top scanning grid glow */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#6C4BF4] to-transparent animate-pulse" />

            {/* Modal Header */}
            <div className="flex justify-between items-center mb-5 relative z-10">
              <div className="flex items-center gap-2">
                <span className="flex h-2.5 w-2.5 rounded-full bg-red-500 animate-ping" />
                <h3 className="font-bold text-xs tracking-wide text-gray-200">
                  ISBN WEBCAM SCANNER
                </h3>
              </div>
              <button 
                onClick={() => setIsScannerOpen(false)}
                className="text-gray-400 hover:text-white transition p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Simulated Video Frame */}
            <div className="relative aspect-video w-full rounded-2xl border border-white/10 bg-black overflow-hidden flex flex-col items-center justify-center mb-5">
              {/* scanning grid overlay */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-transparent to-black/40" />
              
              {/* Laser scan line animation */}
              <div className="absolute left-0 right-0 h-0.5 bg-[#22C55E] shadow-[0_0_8px_#22C55E] animate-scan" style={{
                animation: "scan 2s linear infinite"
              }} />

              {/* Corner scanner brackets */}
              <div className="absolute top-6 left-12 w-6 h-6 border-t-2 border-l-2 border-[#22C55E] rounded-tl-md" />
              <div className="absolute top-6 right-12 w-6 h-6 border-t-2 border-r-2 border-[#22C55E] rounded-tr-md" />
              <div className="absolute bottom-6 left-12 w-6 h-6 border-b-2 border-l-2 border-[#22C55E] rounded-bl-md" />
              <div className="absolute bottom-6 right-12 w-6 h-6 border-b-2 border-r-2 border-[#22C55E] rounded-br-md" />

              {/* Instructions overlay */}
              <p className="absolute bottom-3 text-[10px] text-gray-400 font-medium tracking-wide bg-black/60 px-3 py-1 rounded-full border border-white/5">
                Position barcode inside green brackets
              </p>

              <Barcode size={48} className="text-white/10 animate-pulse" />
            </div>

            {/* Simulation Trigger Controllers */}
            <div className="space-y-4">
              <div>
                <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Simulate Scan Actions
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { isbn: "9780262033848", name: "Algorithms Book", title: "Introduction to Algorithms" },
                    { isbn: "9780061120084", name: "Physics Textbook", title: "Concepts of Physics Vol 1" },
                    { isbn: "9780140441018", name: "Gulliver's Travels", title: "Gulliver's Travels" },
                    { isbn: "9780321768414", name: "Chemistry Book", title: "Organic Chemistry" }
                  ].map((sim) => (
                    <button
                      key={sim.isbn}
                      onClick={() => triggerMockScan(sim.title, sim.isbn)}
                      className="py-2.5 px-3 rounded-xl border border-white/5 bg-white/5 text-[10px] font-bold hover:bg-[#6C4BF4] hover:text-white transition cursor-pointer text-left truncate flex flex-col justify-between"
                    >
                      <span className="text-gray-300 font-semibold truncate">{sim.name}</span>
                      <span className="text-[8px] text-gray-500 mt-0.5 font-medium">{sim.isbn}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Manual ISBN entry fallback */}
              <div className="border-t border-white/5 pt-4">
                <div className="flex gap-2">
                  <input 
                    type="text"
                    placeholder="Enter ISBN code manually..."
                    id="manualIsbnInput"
                    className="flex-grow text-[11px] bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-[#6C4BF4] transition"
                  />
                  <button
                    onClick={() => {
                      const val = document.getElementById("manualIsbnInput")?.value || "";
                      if (val.trim()) {
                        const matches = {
                          "9780262033848": "Introduction to Algorithms",
                          "9780061120084": "Concepts of Physics Vol 1",
                          "9780140441018": "Gulliver's Travels",
                          "9780321768414": "Organic Chemistry"
                        };
                        const title = matches[val.trim()] || "Introduction to Algorithms";
                        triggerMockScan(title, val.trim());
                      }
                    }}
                    className="px-4 py-2 bg-[#6C4BF4] hover:bg-[#5B3DE0] text-white rounded-xl text-[10px] font-bold transition cursor-pointer shrink-0"
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <style>{`
        @keyframes scan {
          0% { top: 15%; }
          50% { top: 85%; }
          100% { top: 15%; }
        }
      `}</style>
    </div>
  );
}
