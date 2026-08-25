import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { LayoutGrid, List, SlidersHorizontal, X } from "lucide-react";
import SearchBar from "../../components/search/SearchBar";
import FilterSidebar from "../../components/search/FilterSidebar";
import SortDropdown from "../../components/search/SortDropdown";
import BookCard from "../../components/book/BookCard";
import books from "../../data/books";

export default function ExplorePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [layout, setLayout] = useState("grid");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [sortBy, setSortBy] = useState("relevance");

  const initialQuery = searchParams.get("q") || "";
  const [searchQuery, setSearchQuery] = useState(initialQuery);

  const [filters, setFilters] = useState({
    conditions: [],
    modes: [],
    priceRange: null,
    category: null,
    negotiable: false,
    deliveryAvailable: false,
  });

  const filteredBooks = useMemo(() => {
    let result = [...books];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.author.toLowerCase().includes(q) ||
          b.isbn.includes(q) ||
          b.category.toLowerCase().includes(q) ||
          b.description.toLowerCase().includes(q)
      );
    }

    if (filters.modes.length > 0) {
      result = result.filter((b) => filters.modes.includes(b.mode));
    }

    if (filters.conditions.length > 0) {
      result = result.filter((b) => filters.conditions.includes(b.condition));
    }

    if (filters.priceRange) {
      const [min, max] = filters.priceRange.split("-").map(Number);
      if (filters.priceRange.includes("+")) {
        result = result.filter((b) => b.askingPrice >= min);
      } else {
        result = result.filter(
          (b) => b.askingPrice >= min && b.askingPrice <= max
        );
      }
    }

    if (filters.category) {
      const catMap = {
        cs: "Computer Science",
        science: "Science",
        engineering: "Engineering",
        competitive: "Competitive Exams",
        fiction: "Fiction",
        nonfiction: "Non-Fiction",
        business: "Business & Economics",
        medical: "Medical",
      };
      result = result.filter((b) => b.category === catMap[filters.category]);
    }

    if (filters.negotiable) {
      result = result.filter((b) => b.isNegotiable);
    }

    if (filters.deliveryAvailable) {
      result = result.filter((b) => b.deliveryAvailable);
    }

    switch (sortBy) {
      case "price_low":
        result.sort((a, b) => a.askingPrice - b.askingPrice);
        break;
      case "price_high":
        result.sort((a, b) => b.askingPrice - a.askingPrice);
        break;
      case "newest":
        result.sort((a, b) => a.postedDaysAgo - b.postedDaysAgo);
        break;
      case "rating":
        result.sort((a, b) => b.seller.rating - a.seller.rating);
        break;
      case "discount":
        result.sort((a, b) => {
          const discA = a.originalPrice
            ? (a.originalPrice - a.askingPrice) / a.originalPrice
            : 0;
          const discB = b.originalPrice
            ? (b.originalPrice - b.askingPrice) / b.originalPrice
            : 0;
          return discB - discA;
        });
        break;
      default:
        break;
    }

    return result;
  }, [searchQuery, filters, sortBy]);

  const handleSearch = (q) => {
    setSearchQuery(q);
    setSearchParams(q ? { q } : {});
  };

  const activeFilterCount = [
    filters.conditions.length,
    filters.modes.length,
    filters.priceRange,
    filters.category,
    filters.negotiable,
    filters.deliveryAvailable,
  ].filter(Boolean).length;

  return (
    <div className="max-w-[1440px] mx-auto px-6 md:px-10 py-6">
      <div className="mb-6">
        <SearchBar
          defaultValue={searchQuery}
          onSearch={handleSearch}
          size="md"
        />
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowMobileFilters(true)}
            className="lg:hidden flex items-center gap-2 px-3 py-2 bg-white border border-bookify-border rounded-lg text-sm font-medium text-bookify-text hover:border-bookify-purple transition-colors"
          >
            <SlidersHorizontal size={14} />
            Filters
            {activeFilterCount > 0 && (
              <span className="w-5 h-5 text-xs font-bold text-white bg-bookify-purple rounded-full flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
          <p className="text-sm text-bookify-text-secondary">
            <span className="font-semibold text-bookify-text">
              {filteredBooks.length}
            </span>{" "}
            books found
          </p>
        </div>

        <div className="flex items-center gap-2">
          <SortDropdown value={sortBy} onChange={setSortBy} />

          <div className="hidden sm:flex items-center border border-bookify-border rounded-lg overflow-hidden">
            <button
              onClick={() => setLayout("grid")}
              className={`p-2 transition-colors ${
                layout === "grid"
                  ? "bg-bookify-light-purple text-bookify-purple"
                  : "bg-white text-bookify-text-secondary hover:bg-bookify-bg"
              }`}
            >
              <LayoutGrid size={16} />
            </button>
            <button
              onClick={() => setLayout("list")}
              className={`p-2 transition-colors ${
                layout === "list"
                  ? "bg-bookify-light-purple text-bookify-purple"
                  : "bg-white text-bookify-text-secondary hover:bg-bookify-bg"
              }`}
            >
              <List size={16} />
            </button>
          </div>
        </div>
      </div>

      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {filters.modes.map((m) => {
            const labels = { sell: "Buy", rent: "Rent", exchange: "Exchange", donate: "Free" };
            return (
              <span
                key={m}
                className="inline-flex items-center gap-1 px-3 py-1 bg-bookify-light-purple text-bookify-purple text-xs font-medium rounded-full"
              >
                {labels[m]}
                <button onClick={() => setFilters({ ...filters, modes: filters.modes.filter((x) => x !== m) })}>
                  <X size={12} />
                </button>
              </span>
            );
          })}
          {filters.conditions.map((c) => (
            <span
              key={c}
              className="inline-flex items-center gap-1 px-3 py-1 bg-bookify-light-purple text-bookify-purple text-xs font-medium rounded-full"
            >
              {c.replace("_", " ")}
              <button onClick={() => setFilters({ ...filters, conditions: filters.conditions.filter((x) => x !== c) })}>
                <X size={12} />
              </button>
            </span>
          ))}
          {filters.priceRange && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-bookify-light-purple text-bookify-purple text-xs font-medium rounded-full">
              ₹{filters.priceRange}
              <button onClick={() => setFilters({ ...filters, priceRange: null })}>
                <X size={12} />
              </button>
            </span>
          )}
        </div>
      )}

      <div className="flex gap-6">
        <div className="hidden lg:block w-64 flex-shrink-0">
          <FilterSidebar filters={filters} onFilterChange={setFilters} />
        </div>

        <div className="flex-1">
          {filteredBooks.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📚</div>
              <h3 className="font-[family-name:var(--font-heading)] text-xl font-semibold text-bookify-text">
                No books found
              </h3>
              <p className="text-bookify-text-secondary mt-2">
                Try adjusting your filters or search query
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setFilters({
                    conditions: [],
                    modes: [],
                    priceRange: null,
                    category: null,
                    negotiable: false,
                    deliveryAvailable: false,
                  });
                }}
                className="mt-4 px-6 py-2 bg-bookify-purple text-white rounded-lg text-sm font-medium hover:bg-bookify-purple-dark transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          ) : layout === "grid" ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {filteredBooks.map((book) => (
                <BookCard key={book.id} book={book} layout="grid" />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {filteredBooks.map((book) => (
                <BookCard key={book.id} book={book} layout="list" />
              ))}
            </div>
          )}
        </div>
      </div>

      {showMobileFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowMobileFilters(false)}
          />
          <div className="absolute right-0 top-0 h-full w-80 max-w-[85vw]">
            <FilterSidebar
              filters={filters}
              onFilterChange={setFilters}
              onClose={() => setShowMobileFilters(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
