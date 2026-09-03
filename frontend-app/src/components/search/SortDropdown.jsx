import { useState, useRef, useEffect } from "react";
import { ArrowUpDown, Check } from "lucide-react";

const sortOptions = [
  { value: "relevance", label: "Relevance" },
  { value: "price_low", label: "Price: Low to High" },
  { value: "price_high", label: "Price: High to Low" },
  { value: "newest", label: "Newest First" },
  { value: "rating", label: "Seller Rating" },
  { value: "discount", label: "Biggest Discount" },
];

export default function SortDropdown({ value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  const currentLabel =
    sortOptions.find((o) => o.value === value)?.label || "Relevance";

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-white border border-bookify-border rounded-lg text-sm text-bookify-text hover:border-bookify-purple transition-colors"
      >
        <ArrowUpDown size={14} className="text-bookify-text-secondary" />
        <span className="text-bookify-text-secondary">Sort:</span>
        <span className="font-medium">{currentLabel}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1 bg-white border border-bookify-border rounded-xl shadow-lg z-50 py-1 min-w-[200px]">
          {sortOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={`flex items-center justify-between w-full px-4 py-2 text-sm text-left hover:bg-bookify-bg transition-colors ${
                value === option.value
                  ? "text-bookify-purple font-medium"
                  : "text-bookify-text-secondary"
              }`}
            >
              {option.label}
              {value === option.value && <Check size={14} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
