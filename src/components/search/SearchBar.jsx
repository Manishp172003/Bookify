import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Barcode, X, TrendingUp } from "lucide-react";

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
}) {
  const [query, setQuery] = useState(defaultValue);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();

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

  const handleTrendingClick = (term) => {
    setQuery(term);
    if (onSearch) {
      onSearch(term);
    } else {
      navigate(`/explore?q=${encodeURIComponent(term)}`);
    }
    setIsFocused(false);
  };

  const sizeClasses = {
    sm: "py-2 pl-11 pr-4 text-sm",
    md: "py-3 pl-12 pr-5 text-base",
    lg: "py-4 pl-14 pr-6 text-lg",
  };

  return (
    <div className="relative w-full">
      <form onSubmit={handleSubmit} className="relative">
        <Search
          size={size === "lg" ? 22 : 18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-bookify-text-secondary pointer-events-none"
        />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
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
              navigate("/explore?isbn=true");
              setIsFocused(false);
            }}
            className="p-2 rounded-lg bg-bookify-light-purple text-bookify-purple hover:bg-bookify-purple hover:text-white transition-colors"
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

      {isFocused && !query && (
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
    </div>
  );
}
