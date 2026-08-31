import { useState } from "react";
import { ChevronDown, ChevronUp, X } from "lucide-react";


const editorPicks = [
  { label: "Best Sales", count: 105 },
  { label: "Alone Here", count: null },
  { label: "Alien Invasion", count: null },
  { label: "Bullo The Cat", count: null },
  { label: "Cut That Hair", count: null },
  { label: "Dragon Of The King", count: null },
];

const quickLinks = [
  { label: "Most Commented", count: 21 },
  { label: "Latest Books", count: 32 },
  { label: "Featured", count: 129 },
  { label: "Watch History", count: 30 },
  { label: "Best Books", count: 44 },
];

const publishers = [
  "Penguin Classics",
  "HarperOne",
  "Scribner",
  "Vintage",
  "Bloomsbury",
  "Mariner Books",
  "Anchor",
  "Riverhead Books",
  "Simon & Schuster",
  "Scholastic",
];

const years = ["2026", "2025", "2024", "2023", "2022", "2021", "2020", "Older"];

const shopCategories = [
  "Literary Fiction",
  "Fantasy",
  "Thriller",
  "Mystery",
  "Romance",
  "Horror",
  "Classic",
  "Young Adult",
  "Historical Fiction",
  "Adventure",
  "Dystopian",
  "Gothic",
  "Magical Realism",
  "Satire",
  "Post-Apocalyptic",
  "War",
  "True Crime",
  "Fable",
  "Children's",
  "Sci-Fi",
];

function FilterSection({ title, defaultOpen = true, children }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-bookify-border pb-4 mb-4 last:border-0 last:pb-0 last:mb-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full text-left group"
      >
        <span className="font-[family-name:var(--font-heading)] font-bold text-sm text-bookify-text group-hover:text-[#6C4BF4] transition-colors">
          {title}
        </span>
        {isOpen ? (
          <ChevronUp size={16} className="text-gray-400" />
        ) : (
          <ChevronDown size={16} className="text-gray-400" />
        )}
      </button>
      {isOpen && <div className="mt-3">{children}</div>}
    </div>
  );
}

export default function FilterSidebar({ filters, onFilterChange, onClose }) {
  const [priceMin, setPriceMin] = useState(filters.priceMin || 0);
  const [priceMax, setPriceMax] = useState(filters.priceMax || 1000);
  const [selectedPublisher, setSelectedPublisher] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState(
    filters.subCategories || []
  );

  const toggleSubCategory = (subCat) => {
    const updated = selectedCategories.includes(subCat)
      ? selectedCategories.filter((c) => c !== subCat)
      : [...selectedCategories, subCat];
    setSelectedCategories(updated);
    onFilterChange({ ...filters, subCategories: updated });
  };

  const handlePriceApply = () => {
    onFilterChange({
      ...filters,
      priceMin,
      priceMax,
      priceRange: `${priceMin}-${priceMax}`,
    });
  };

  const clearAll = () => {
    setSelectedCategories([]);
    setSelectedPublisher(null);
    setSelectedYear(null);
    setPriceMin(0);
    setPriceMax(1000);
    onFilterChange({
      conditions: [],
      modes: [],
      priceRange: null,
      priceMin: 0,
      priceMax: 1000,
      category: null,
      negotiable: false,
      deliveryAvailable: false,
      subCategories: [],
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100/80 shadow-lg shadow-[#6C4BF4]/3 p-6 h-fit sticky top-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-[family-name:var(--font-heading)] font-bold text-xs uppercase tracking-wider text-gray-400">
          Filter Option
        </h3>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-bookify-bg lg:hidden"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Editor Picks */}
      <FilterSection title="Editor Picks">
        <div className="space-y-1">
          {editorPicks.map((item) => (
            <button
              key={item.label}
              className="flex items-center justify-between w-full text-left group/link px-2.5 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <span className="text-sm text-gray-500 font-medium group-hover/link:text-[#6C4BF4] transition-colors">
                {item.label}
              </span>
              {item.count && (
                <span className="text-xs font-semibold text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-md group-hover/link:bg-[#EEEAFE] group-hover/link:text-[#6C4BF4] transition-all">
                  {item.count}
                </span>
              )}
            </button>
          ))}
          {quickLinks.map((item) => (
            <button
              key={item.label}
              className="flex items-center justify-between w-full text-left group/link px-2.5 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <span className="text-sm text-gray-500 font-medium group-hover/link:text-[#6C4BF4] transition-colors">
                {item.label}
              </span>
              {item.count && (
                <span className="text-xs font-semibold text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-md group-hover/link:bg-[#EEEAFE] group-hover/link:text-[#6C4BF4] transition-all">
                  {item.count}
                </span>
              )}
            </button>
          ))}
          <button className="text-xs text-[#6C4BF4] font-semibold hover:text-[#5B3DE0] transition-colors pl-2.5 mt-2 text-left">
            + View more
          </button>
        </div>
      </FilterSection>

      {/* Transaction Type */}
      <FilterSection title="Transaction Type" defaultOpen={true}>
        <div className="space-y-1">
          {[
            { value: "sell", label: "Buy (Purchase)" },
            { value: "rent", label: "Rent" },
            { value: "exchange", label: "Exchange" },
            { value: "donate", label: "Free (Donation)" },
          ].map((mode) => {
            const isChecked = (filters.modes || []).includes(mode.value);
            return (
              <label
                key={mode.value}
                className={`flex items-center gap-2.5 cursor-pointer group px-2.5 py-1.5 rounded-xl transition-all ${
                  isChecked
                    ? "bg-[#EEEAFE]/50 text-[#6C4BF4]"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => {
                    const updated = isChecked
                      ? (filters.modes || []).filter((x) => x !== mode.value)
                      : [...(filters.modes || []), mode.value];
                    onFilterChange({ ...filters, modes: updated });
                  }}
                  className="w-4 h-4 rounded border-gray-300 text-[#6C4BF4] focus:ring-[#6C4BF4]/30 accent-[#6C4BF4]"
                />
                <span className="text-sm font-semibold transition-colors">
                  {mode.label}
                </span>
              </label>
            );
          })}
        </div>
      </FilterSection>

      {/* Choose Publisher */}
      <FilterSection title="Choose Publisher" defaultOpen={false}>
        <div className="space-y-1">
          {publishers.map((pub) => {
            const isChecked = selectedPublisher === pub;
            return (
              <label
                key={pub}
                className={`flex items-center gap-2.5 cursor-pointer group px-2.5 py-1.5 rounded-xl transition-all ${
                  isChecked
                    ? "bg-[#EEEAFE]/50 text-[#6C4BF4]"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <input
                  type="radio"
                  name="publisher"
                  checked={isChecked}
                  onChange={() =>
                    setSelectedPublisher(isChecked ? null : pub)
                  }
                  className="w-4 h-4 border-gray-300 text-[#6C4BF4] focus:ring-[#6C4BF4]/30 accent-[#6C4BF4]"
                />
                <span className="text-sm font-semibold transition-colors">
                  {pub}
                </span>
              </label>
            );
          })}
        </div>
      </FilterSection>

      {/* Select Year */}
      <FilterSection title="Select Year" defaultOpen={false}>
        <div className="flex flex-wrap gap-2">
          {years.map((year) => {
            const isSelected = selectedYear === year;
            return (
              <button
                key={year}
                onClick={() => setSelectedYear(isSelected ? null : year)}
                className={`text-xs px-3.5 py-2 rounded-xl border transition-all font-semibold ${
                  isSelected
                    ? "bg-[#6C4BF4] text-white border-transparent shadow-sm shadow-[#6C4BF4]/20"
                    : "text-gray-500 border-[#E7E4F2] bg-gray-50 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                {year}
              </button>
            );
          })}
        </div>
      </FilterSection>

      {/* Shop by Category */}
      <FilterSection title="Shop by Category">
        <div className="grid grid-cols-2 gap-1">
          {shopCategories.map((cat) => {
            const isChecked = selectedCategories.includes(cat);
            return (
              <label
                key={cat}
                className={`flex items-center gap-2.5 cursor-pointer group px-2.5 py-1.5 rounded-xl transition-all ${
                  isChecked
                    ? "bg-[#EEEAFE]/50 text-[#6C4BF4]"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggleSubCategory(cat)}
                  className="w-4 h-4 rounded border-gray-300 text-[#6C4BF4] focus:ring-[#6C4BF4]/30 accent-[#6C4BF4]"
                />
                <span className="text-sm font-semibold transition-colors truncate">
                  {cat}
                </span>
              </label>
            );
          })}
        </div>
      </FilterSection>

      {/* Price Range */}
      <FilterSection title="Price Range">
        <div className="space-y-3">
          {/* Range Slider Track */}
          <div className="relative h-1.5 bg-bookify-border rounded-full mt-2">
            <div
              className="absolute h-full bg-[#6C4BF4] rounded-full"
              style={{
                left: `${(priceMin / 1000) * 100}%`,
                right: `${100 - (priceMax / 1000) * 100}%`,
              }}
            />
            <input
              type="range"
              min="0"
              max="1000"
              value={priceMin}
              onChange={(e) =>
                setPriceMin(Math.min(Number(e.target.value), priceMax - 10))
              }
              className="absolute w-full h-1.5 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#6C4BF4] [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white"
              style={{ zIndex: 2 }}
            />
            <input
              type="range"
              min="0"
              max="1000"
              value={priceMax}
              onChange={(e) =>
                setPriceMax(Math.max(Number(e.target.value), priceMin + 10))
              }
              className="absolute w-full h-1.5 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#6C4BF4] [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white"
              style={{ zIndex: 3 }}
            />
          </div>
          {/* Price Inputs */}
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <input
                type="number"
                value={priceMin}
                onChange={(e) => setPriceMin(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm border border-[#E7E4F2] focus:border-[#6C4BF4] rounded-xl text-bookify-text focus:outline-none transition-colors"
                min="0"
                max={priceMax - 10}
              />
            </div>
            <span className="text-gray-400">—</span>
            <div className="flex-1">
              <input
                type="number"
                value={priceMax}
                onChange={(e) => setPriceMax(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm border border-[#E7E4F2] focus:border-[#6C4BF4] rounded-xl text-bookify-text focus:outline-none transition-colors"
                min={priceMin + 10}
                max="10000"
              />
            </div>
          </div>
        </div>
      </FilterSection>

      {/* Refine Search Button */}
      <button
        onClick={handlePriceApply}
        className="w-full py-3 mt-4 bg-[#6C4BF4] hover:bg-[#5B3DE0] text-white font-semibold rounded-xl transition-all duration-200 text-sm hover:-translate-y-0.5 active:translate-y-0 shadow-sm shadow-[#6C4BF4]/15 cursor-pointer"
      >
        Refine Search
      </button>

      {/* Reset Filter */}
      <button
        onClick={clearAll}
        className="w-full py-2.5 mt-2 border border-[#E7E4F2] text-gray-500 font-semibold rounded-xl hover:border-[#6C4BF4]/30 hover:bg-[#6C4BF4]/5 hover:text-[#6C4BF4] transition-all duration-200 text-sm hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
      >
        Reset Filter
      </button>
    </div>
  );
}
