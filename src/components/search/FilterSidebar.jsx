import { useState } from "react";
import { ChevronDown, ChevronUp, X, SlidersHorizontal } from "lucide-react";
import categories from "../../data/categories";

const conditions = [
  { value: "LIKE_NEW", label: "Like New", color: "#22C55E" },
  { value: "GOOD", label: "Good", color: "#38BDF8" },
  { value: "FAIR", label: "Fair", color: "#FF8A3D" },
  { value: "WORN", label: "Worn", color: "#FF4F81" },
];

const modes = [
  { value: "sell", label: "Buy", color: "#6C4BF4" },
  { value: "rent", label: "Rent", color: "#38BDF8" },
  { value: "exchange", label: "Exchange", color: "#FF8A3D" },
  { value: "donate", label: "Free", color: "#22C55E" },
];

const priceRanges = [
  { value: "0-100", label: "Under ₹100" },
  { value: "100-300", label: "₹100 - ₹300" },
  { value: "300-500", label: "₹300 - ₹500" },
  { value: "500-1000", label: "₹500 - ₹1000" },
  { value: "1000+", label: "Above ₹1000" },
];

function FilterSection({ title, defaultOpen = true, children }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-bookify-border pb-4 mb-4 last:border-0 last:pb-0 last:mb-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full text-left"
      >
        <span className="font-[family-name:var(--font-heading)] font-semibold text-sm text-bookify-text">
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
  const activeCount = [
    filters.conditions?.length,
    filters.modes?.length,
    filters.priceRange,
    filters.category,
    filters.negotiable,
  ].filter(Boolean).length;

  const toggleArrayFilter = (key, value) => {
    const current = filters[key] || [];
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    onFilterChange({ ...filters, [key]: updated });
  };

  const clearAll = () => {
    onFilterChange({
      conditions: [],
      modes: [],
      priceRange: null,
      category: null,
      negotiable: false,
      location: null,
    });
  };

  return (
    <div className="bg-white rounded-xl border border-bookify-border p-5 h-fit sticky top-24">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={16} className="text-bookify-purple" />
          <span className="font-[family-name:var(--font-heading)] font-semibold text-bookify-text">
            Filters
          </span>
          {activeCount > 0 && (
            <span className="text-xs font-bold text-white bg-bookify-purple w-5 h-5 rounded-full flex items-center justify-center">
              {activeCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {activeCount > 0 && (
            <button
              onClick={clearAll}
              className="text-xs text-bookify-purple hover:text-bookify-purple-dark font-medium"
            >
              Clear all
            </button>
          )}
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-bookify-bg lg:hidden"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      <FilterSection title="Transaction Mode">
        <div className="flex flex-wrap gap-2">
          {modes.map((mode) => (
            <button
              key={mode.value}
              onClick={() => toggleArrayFilter("modes", mode.value)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-all font-medium ${
                filters.modes?.includes(mode.value)
                  ? "text-white border-transparent"
                  : "text-bookify-text-secondary border-bookify-border hover:border-bookify-purple"
              }`}
              style={
                filters.modes?.includes(mode.value)
                  ? { backgroundColor: mode.color }
                  : {}
              }
            >
              {mode.label}
            </button>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Book Condition">
        <div className="flex flex-col gap-2">
          {conditions.map((cond) => (
            <label
              key={cond.value}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={filters.conditions?.includes(cond.value) || false}
                onChange={() => toggleArrayFilter("conditions", cond.value)}
                className="w-4 h-4 rounded border-bookify-border text-bookify-purple accent-[#6C4BF4]"
              />
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cond.color }} />
              <span className="text-sm text-bookify-text-secondary group-hover:text-bookify-text transition-colors">
                {cond.label}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Price Range">
        <div className="flex flex-col gap-1.5">
          {priceRanges.map((range) => (
            <label
              key={range.value}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <input
                type="radio"
                name="priceRange"
                checked={filters.priceRange === range.value}
                onChange={() =>
                  onFilterChange({
                    ...filters,
                    priceRange:
                      filters.priceRange === range.value ? null : range.value,
                  })
                }
                className="w-4 h-4 border-bookify-border text-bookify-purple accent-[#6C4BF4]"
              />
              <span className="text-sm text-bookify-text-secondary group-hover:text-bookify-text transition-colors">
                {range.label}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Category" defaultOpen={false}>
        <div className="flex flex-col gap-1.5">
          {categories.map((cat) => (
            <label
              key={cat.id}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <input
                type="radio"
                name="category"
                checked={filters.category === cat.id}
                onChange={() =>
                  onFilterChange({
                    ...filters,
                    category:
                      filters.category === cat.id ? null : cat.id,
                  })
                }
                className="w-4 h-4 border-bookify-border text-bookify-purple accent-[#6C4BF4]"
              />
              <span className="text-sm">
                {cat.icon}{" "}
                <span className="text-bookify-text-secondary group-hover:text-bookify-text transition-colors">
                  {cat.name}
                </span>
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Other">
        <label className="flex items-center gap-2 cursor-pointer group">
          <input
            type="checkbox"
            checked={filters.negotiable || false}
            onChange={(e) =>
              onFilterChange({ ...filters, negotiable: e.target.checked })
            }
            className="w-4 h-4 rounded border-bookify-border text-bookify-purple accent-[#6C4BF4]"
          />
          <span className="text-sm text-bookify-text-secondary group-hover:text-bookify-text transition-colors">
            Price Negotiable
          </span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer mt-2 group">
          <input
            type="checkbox"
            checked={filters.deliveryAvailable || false}
            onChange={(e) =>
              onFilterChange({
                ...filters,
                deliveryAvailable: e.target.checked,
              })
            }
            className="w-4 h-4 rounded border-bookify-border text-bookify-purple accent-[#6C4BF4]"
          />
          <span className="text-sm text-bookify-text-secondary group-hover:text-bookify-text transition-colors">
            Delivery Available
          </span>
        </label>
      </FilterSection>
    </div>
  );
}
