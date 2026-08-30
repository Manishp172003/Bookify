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
        <span className="font-[family-name:var(--font-heading)] font-semibold text-sm text-bookify-text group-hover:text-bookify-purple transition-colors">
          {title}
        </span>
        {isOpen ? (
          <ChevronUp size={16} className="text-bookify-text-secondary" />
        ) : (
          <ChevronDown size={16} className="text-bookify-text-secondary" />
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
    <div className="bg-white rounded-xl border border-bookify-border p-5 h-fit sticky top-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-[family-name:var(--font-heading)] font-bold text-base text-bookify-text">
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
        <div className="space-y-2">
          {editorPicks.map((item) => (
            <button
              key={item.label}
              className="flex items-center justify-between w-full text-left group/link"
            >
              <span className="text-sm text-bookify-text-secondary group-hover/link:text-bookify-purple transition-colors">
                {item.label}
              </span>
              {item.count && (
                <span className="text-xs text-bookify-text-secondary">
                  ({item.count})
                </span>
              )}
            </button>
          ))}
          {quickLinks.map((item) => (
            <button
              key={item.label}
              className="flex items-center justify-between w-full text-left group/link"
            >
              <span className="text-sm text-bookify-text-secondary group-hover/link:text-bookify-purple transition-colors">
                {item.label}
              </span>
              {item.count && (
                <span className="text-xs text-bookify-text-secondary">
                  ({item.count})
                </span>
              )}
            </button>
          ))}
          <button className="text-sm text-bookify-purple font-medium hover:text-bookify-purple-dark transition-colors">
            View more...
          </button>
        </div>
      </FilterSection>

      {/* Choose Publisher */}
      <FilterSection title="Choose Publisher" defaultOpen={false}>
        <div className="space-y-2">
          {publishers.map((pub) => (
            <label
              key={pub}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <input
                type="radio"
                name="publisher"
                checked={selectedPublisher === pub}
                onChange={() =>
                  setSelectedPublisher(
                    selectedPublisher === pub ? null : pub
                  )
                }
                className="w-4 h-4 border-bookify-border text-bookify-purple accent-[#6C4BF4]"
              />
              <span className="text-sm text-bookify-text-secondary group-hover:text-bookify-text transition-colors">
                {pub}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Select Year */}
      <FilterSection title="Select Year" defaultOpen={false}>
        <div className="flex flex-wrap gap-2">
          {years.map((year) => (
            <button
              key={year}
              onClick={() =>
                setSelectedYear(selectedYear === year ? null : year)
              }
              className={`text-xs px-3 py-1.5 rounded-full border transition-all font-medium ${
                selectedYear === year
                  ? "bg-bookify-purple text-white border-transparent"
                  : "text-bookify-text-secondary border-bookify-border hover:border-bookify-purple"
              }`}
            >
              {year}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Shop by Category */}
      <FilterSection title="Shop by Category">
        <div className="grid grid-cols-2 gap-2">
          {shopCategories.map((cat) => (
            <label
              key={cat}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={selectedCategories.includes(cat)}
                onChange={() => toggleSubCategory(cat)}
                className="w-4 h-4 rounded border-bookify-border text-bookify-purple accent-[#6C4BF4]"
              />
              <span className="text-sm text-bookify-text-secondary group-hover:text-bookify-text transition-colors truncate">
                {cat}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Price Range */}
      <FilterSection title="Price Range">
        <div className="space-y-3">
          {/* Range Slider Track */}
          <div className="relative h-1.5 bg-bookify-border rounded-full mt-2">
            <div
              className="absolute h-full bg-bookify-purple rounded-full"
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
              className="absolute w-full h-1.5 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-bookify-purple [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white"
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
              className="absolute w-full h-1.5 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-bookify-purple [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white"
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
                className="w-full px-3 py-2 text-sm border border-bookify-border rounded-lg text-bookify-text focus:border-bookify-purple focus:outline-none transition-colors"
                min="0"
                max={priceMax - 10}
              />
            </div>
            <span className="text-bookify-text-secondary">—</span>
            <div className="flex-1">
              <input
                type="number"
                value={priceMax}
                onChange={(e) => setPriceMax(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm border border-bookify-border rounded-lg text-bookify-text focus:border-bookify-purple focus:outline-none transition-colors"
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
        className="w-full py-3 mt-2 bg-bookify-purple hover:bg-bookify-purple-dark text-white font-semibold rounded-xl transition-colors text-sm"
      >
        Refine Search
      </button>

      {/* Reset Filter */}
      <button
        onClick={clearAll}
        className="w-full py-2.5 mt-2 border border-bookify-border text-bookify-text-secondary font-medium rounded-xl hover:border-bookify-purple hover:text-bookify-purple transition-colors text-sm"
      >
        Reset Filter
      </button>
    </div>
  );
}
