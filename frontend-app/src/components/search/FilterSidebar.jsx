import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, X, Check } from "lucide-react";
import categories from "../../data/categories";

const conditionsList = [
  { value: "LIKE_NEW", label: "Like New", desc: "Unread or crisp copy", color: "bg-emerald-500" },
  { value: "GOOD", label: "Good", desc: "Clean pages, minor wear", color: "bg-sky-500" },
  { value: "FAIR", label: "Fair", desc: "Readable with visible wear", color: "bg-amber-500" },
  { value: "NEW", label: "Brand New", desc: "Unopened / perfect", color: "bg-purple-500" },
];

const transactionModes = [
  { value: "sell", label: "Buy (Purchase)" },
  { value: "rent", label: "Rent" },
  { value: "exchange", label: "Exchange" },
  { value: "donate", label: "Free (Donation)" },
];

function FilterSection({ title, defaultOpen = true, badge = null, children }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-100 pb-4 mb-4 last:border-0 last:pb-0 last:mb-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full text-left group py-1 cursor-pointer"
      >
        <span className="font-[family-name:var(--font-heading)] font-bold text-sm text-bookify-text group-hover:text-[#6C4BF4] transition-colors flex items-center gap-2">
          {title}
          {badge && (
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[#EEEAFE] text-[#6C4BF4]">
              {badge}
            </span>
          )}
        </span>
        {isOpen ? (
          <ChevronUp size={16} className="text-gray-400 group-hover:text-[#6C4BF4] transition-colors" />
        ) : (
          <ChevronDown size={16} className="text-gray-400 group-hover:text-[#6C4BF4] transition-colors" />
        )}
      </button>
      {isOpen && <div className="mt-3 animate-fade-in">{children}</div>}
    </div>
  );
}

export default function FilterSidebar({ filters, onFilterChange, onClose }) {
  const [priceMin, setPriceMin] = useState(filters.priceMin ?? 0);
  const [priceMax, setPriceMax] = useState(filters.priceMax ?? 1000);

  useEffect(() => {
    if (filters.priceMin !== undefined) setPriceMin(filters.priceMin);
    if (filters.priceMax !== undefined) setPriceMax(filters.priceMax);
  }, [filters.priceMin, filters.priceMax]);

  const handlePriceApply = () => {
    onFilterChange({
      ...filters,
      priceMin,
      priceMax,
      priceRange: `${priceMin}-${priceMax}`,
    });
  };

  const handleCategorySelect = (catId) => {
    const isAlreadySelected = filters.category === catId;
    onFilterChange({
      ...filters,
      category: isAlreadySelected ? null : catId,
    });
  };

  const toggleMode = (modeVal) => {
    const current = filters.modes || [];
    const updated = current.includes(modeVal)
      ? current.filter((m) => m !== modeVal)
      : [...current, modeVal];
    onFilterChange({ ...filters, modes: updated });
  };

  const toggleCondition = (condVal) => {
    const current = filters.conditions || [];
    const updated = current.includes(condVal)
      ? current.filter((c) => c !== condVal)
      : [...current, condVal];
    onFilterChange({ ...filters, conditions: updated });
  };

  const clearAll = () => {
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

  const activeCount = [
    filters.category,
    (filters.modes || []).length,
    (filters.conditions || []).length,
    filters.priceRange,
    filters.negotiable,
    filters.deliveryAvailable,
  ].filter(Boolean).length;

  return (
    <div className="bg-white rounded-2xl border border-gray-100/90 shadow-sm p-5 h-fit sticky top-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <h3 className="font-[family-name:var(--font-heading)] font-bold text-xs uppercase tracking-wider text-gray-400">
            Filter Options
          </h3>
          {activeCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-[#6C4BF4] text-white text-[10px] font-bold flex items-center justify-center">
              {activeCount}
            </span>
          )}
        </div>
        {activeCount > 0 && (
          <button
            onClick={clearAll}
            className="text-xs font-semibold text-[#6C4BF4] hover:text-[#5B3DE0] transition cursor-pointer"
          >
            Clear all
          </button>
        )}
        {onClose && (
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-gray-100 text-gray-400 lg:hidden cursor-pointer"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* 1. Category */}
      <FilterSection
        title="Category"
        defaultOpen={true}
        badge={filters.category ? "1 selected" : null}
      >
        <div className="space-y-1 max-h-56 overflow-y-auto pr-1">
          <button
            onClick={() => handleCategorySelect(null)}
            className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition cursor-pointer ${
              !filters.category
                ? "bg-[#EEEAFE] text-[#6C4BF4]"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <span>All Categories</span>
            {!filters.category && <Check size={14} className="text-[#6C4BF4]" />}
          </button>

          {categories.map((cat) => {
            const isSelected = filters.category === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => handleCategorySelect(cat.id)}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition cursor-pointer ${
                  isSelected
                    ? "bg-[#EEEAFE] text-[#6C4BF4]"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <span className="truncate">{cat.name}</span>
                {isSelected && <Check size={14} className="text-[#6C4BF4] shrink-0" />}
              </button>
            );
          })}
        </div>
      </FilterSection>

      {/* 2. Transaction Type */}
      <FilterSection
        title="Transaction Type"
        defaultOpen={true}
        badge={(filters.modes || []).length ? `${filters.modes.length}` : null}
      >
        <div className="space-y-1.5">
          {transactionModes.map((mode) => {
            const isChecked = (filters.modes || []).includes(mode.value);
            return (
              <label
                key={mode.value}
                className={`flex items-center gap-2.5 cursor-pointer px-3 py-2 rounded-xl transition select-none ${
                  isChecked
                    ? "bg-[#EEEAFE]/60 text-[#6C4BF4] font-bold"
                    : "text-gray-600 hover:bg-gray-50 font-medium"
                }`}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggleMode(mode.value)}
                  className="w-4 h-4 rounded border-gray-300 text-[#6C4BF4] focus:ring-[#6C4BF4]/30 accent-[#6C4BF4] cursor-pointer"
                />
                <span className="text-xs">{mode.label}</span>
              </label>
            );
          })}
        </div>
      </FilterSection>

      {/* 3. Book Condition */}
      <FilterSection
        title="Book Condition"
        defaultOpen={true}
        badge={(filters.conditions || []).length ? `${filters.conditions.length}` : null}
      >
        <div className="space-y-1.5">
          {conditionsList.map((cond) => {
            const isChecked = (filters.conditions || []).includes(cond.value);
            return (
              <label
                key={cond.value}
                className={`flex items-center justify-between cursor-pointer px-3 py-2 rounded-xl transition select-none ${
                  isChecked
                    ? "bg-[#EEEAFE]/60 text-[#6C4BF4] font-bold"
                    : "text-gray-600 hover:bg-gray-50 font-medium"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleCondition(cond.value)}
                    className="w-4 h-4 rounded border-gray-300 text-[#6C4BF4] focus:ring-[#6C4BF4]/30 accent-[#6C4BF4] cursor-pointer"
                  />
                  <div>
                    <p className="text-xs font-semibold leading-tight">{cond.label}</p>
                    <p className="text-[10px] text-gray-400 font-normal">{cond.desc}</p>
                  </div>
                </div>
                <span className={`w-2 h-2 rounded-full ${cond.color}`} />
              </label>
            );
          })}
        </div>
      </FilterSection>

      {/* 4. Price Range */}
      <FilterSection title="Price Range" defaultOpen={true}>
        <div className="space-y-3">
          {/* Dual Slider Track */}
          <div className="relative h-1.5 bg-gray-200 rounded-full mt-3 mb-4">
            <div
              className="absolute h-full bg-[#6C4BF4] rounded-full"
              style={{
                left: `${Math.min(100, (priceMin / 1000) * 100)}%`,
                right: `${Math.max(0, 100 - (priceMax / 1000) * 100)}%`,
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

          {/* Min / Max Inputs */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-semibold">₹</span>
              <input
                type="number"
                value={priceMin}
                onChange={(e) => setPriceMin(Number(e.target.value))}
                className="w-full pl-6 pr-2 py-1.5 text-xs font-semibold border border-gray-200 focus:border-[#6C4BF4] rounded-lg text-bookify-text focus:outline-none transition"
                min="0"
                max={priceMax - 10}
              />
            </div>
            <span className="text-gray-300 font-bold">—</span>
            <div className="relative flex-1">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-semibold">₹</span>
              <input
                type="number"
                value={priceMax}
                onChange={(e) => setPriceMax(Number(e.target.value))}
                className="w-full pl-6 pr-2 py-1.5 text-xs font-semibold border border-gray-200 focus:border-[#6C4BF4] rounded-lg text-bookify-text focus:outline-none transition"
                min={priceMin + 10}
                max="10000"
              />
            </div>
          </div>
        </div>
      </FilterSection>

      {/* 5. Availability & Perks */}
      <FilterSection title="Perks & Delivery" defaultOpen={false}>
        <div className="space-y-1.5">
          <label className="flex items-center gap-2.5 cursor-pointer px-3 py-1.5 rounded-xl hover:bg-gray-50 transition">
            <input
              type="checkbox"
              checked={Boolean(filters.deliveryAvailable)}
              onChange={(e) =>
                onFilterChange({ ...filters, deliveryAvailable: e.target.checked })
              }
              className="w-4 h-4 rounded border-gray-300 text-[#6C4BF4] focus:ring-[#6C4BF4]/30 accent-[#6C4BF4] cursor-pointer"
            />
            <span className="text-xs text-gray-700 font-medium">Courier Delivery Available</span>
          </label>

          <label className="flex items-center gap-2.5 cursor-pointer px-3 py-1.5 rounded-xl hover:bg-gray-50 transition">
            <input
              type="checkbox"
              checked={Boolean(filters.negotiable)}
              onChange={(e) =>
                onFilterChange({ ...filters, negotiable: e.target.checked })
              }
              className="w-4 h-4 rounded border-gray-300 text-[#6C4BF4] focus:ring-[#6C4BF4]/30 accent-[#6C4BF4] cursor-pointer"
            />
            <span className="text-xs text-gray-700 font-medium">Price Negotiable</span>
          </label>
        </div>
      </FilterSection>

      {/* Action Buttons */}
      <div className="pt-2 space-y-2">
        <button
          onClick={handlePriceApply}
          className="w-full py-2.5 bg-[#6C4BF4] hover:bg-[#5B3DE0] text-white font-semibold rounded-xl transition text-xs shadow-sm shadow-[#6C4BF4]/15 cursor-pointer active:scale-[0.98]"
        >
          Apply Filters
        </button>

        {activeCount > 0 && (
          <button
            onClick={clearAll}
            className="w-full py-2 border border-gray-200 text-gray-500 font-semibold rounded-xl hover:border-[#6C4BF4]/30 hover:bg-[#6C4BF4]/5 hover:text-[#6C4BF4] transition text-xs cursor-pointer active:scale-[0.98]"
          >
            Reset Filters
          </button>
        )}
      </div>
    </div>
  );
}
