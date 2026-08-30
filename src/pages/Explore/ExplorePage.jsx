import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import {
  SlidersHorizontal,
  X,
  ChevronLeft,
  ChevronRight,
  Star,
  ChevronDown,
} from "lucide-react";
import SearchBar from "../../components/search/SearchBar";
import FilterSidebar from "../../components/search/FilterSidebar";
import BookCard from "../../components/book/BookCard";
import books from "../../data/books";
import ScrollReveal from "../../components/ui/ScrollReveal";

const ITEMS_PER_PAGE = 12;

const timeTabs = [
  { value: "today", label: "Today" },
  { value: "week", label: "This Week" },
  { value: "month", label: "This Month" },
];

const sortOptions = [
  { value: "newest", label: "Newest" },
  { value: "price_low", label: "Price: Low to High" },
  { value: "price_high", label: "Price: High to Low" },
  { value: "rating", label: "Seller Rating" },
  { value: "discount", label: "Biggest Discount" },
];

export default function ExplorePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [timeTab, setTimeTab] = useState("month");
  const [sortBy, setSortBy] = useState("newest");
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [email, setEmail] = useState("");

  const initialQuery = searchParams.get("q") || "";
  const initialCategory = searchParams.get("category") || null;
  const [searchQuery, setSearchQuery] = useState(initialQuery);

  const [filters, setFilters] = useState({
    conditions: [],
    modes: [],
    priceRange: null,
    priceMin: 0,
    priceMax: 1000,
    category: initialCategory,
    negotiable: false,
    deliveryAvailable: false,
    subCategories: [],
  });

  const filteredBooks = useMemo(() => {
    let result = [...books];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const keywords = q.split(/\s+/).filter(Boolean);

      result = result.filter((b) => {
        const title = b.title.toLowerCase();
        const author = b.author.toLowerCase();
        const isbn = (b.isbn || "").toLowerCase();
        const category = b.category.toLowerCase();
        const subCategory = (b.subCategory || "").toLowerCase();
        const description = b.description.toLowerCase();

        // Direct substring match
        if (
          title.includes(q) ||
          author.includes(q) ||
          isbn.includes(q) ||
          category.includes(q) ||
          subCategory.includes(q) ||
          description.includes(q)
        ) {
          return true;
        }

        // Keyword matching - book must match at least one keyword
        return keywords.some(
          (kw) =>
            kw.length >= 2 &&
            (title.includes(kw) ||
              author.includes(kw) ||
              category.includes(kw) ||
              subCategory.includes(kw) ||
              description.includes(kw))
        );
      });
    }

    if (filters.modes.length > 0) {
      result = result.filter((b) => filters.modes.includes(b.mode));
    }

    if (filters.conditions.length > 0) {
      result = result.filter((b) => filters.conditions.includes(b.condition));
    }

    if (filters.priceRange) {
      const parts = filters.priceRange.split("-").map(Number);
      const [min, max] = parts;
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
        fiction: "Fiction",
        nonfiction: "Non-Fiction",
        academic: "Academic & Textbooks",
        comics: "Comics & Manga",
        selfhelp: "Self-Help",
        competitive: "Competitive Exams",
        children: "Children's Books",
        regional: "Regional Languages",
      };
      result = result.filter((b) => b.category === catMap[filters.category]);
    }

    if (filters.subCategories && filters.subCategories.length > 0) {
      result = result.filter((b) =>
        filters.subCategories.includes(b.subCategory)
      );
    }

    if (filters.negotiable) {
      result = result.filter((b) => b.isNegotiable);
    }

    if (filters.deliveryAvailable) {
      result = result.filter((b) => b.deliveryAvailable);
    }

    if (timeTab === "today") {
      result = result.filter((b) => b.postedDaysAgo === 0);
    } else if (timeTab === "week") {
      result = result.filter((b) => b.postedDaysAgo <= 7);
    } else if (timeTab === "month") {
      result = result.filter((b) => b.postedDaysAgo <= 30);
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
  }, [searchQuery, filters, sortBy, timeTab]);

  const totalPages = Math.ceil(filteredBooks.length / ITEMS_PER_PAGE);
  const paginatedBooks = filteredBooks.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const booksOnSale = useMemo(() => {
    return books
      .filter((b) => b.originalPrice && b.originalPrice > b.askingPrice)
      .sort((a, b) => {
        const discA = (a.originalPrice - a.askingPrice) / a.originalPrice;
        const discB = (b.originalPrice - b.askingPrice) / b.originalPrice;
        return discB - discA;
      })
      .slice(0, 6);
  }, []);

  const handleSearch = (q) => {
    setSearchQuery(q);
    setSearchParams(q ? { q } : {});
    setCurrentPage(1);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setSearchQuery("");
    setFilters({
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
    setTimeTab("month");
    setSortBy("newest");
    setCurrentPage(1);
  };

  const activeFilterCount = [
    filters.conditions.length,
    filters.modes.length,
    filters.priceRange,
    filters.category,
    filters.negotiable,
    filters.deliveryAvailable,
    filters.subCategories?.length,
  ].filter(Boolean).length;

  return (
    <div>
      {/* Search Bar */}
      <section className="max-w-[1440px] mx-auto px-4 md:px-8 py-6">
        <SearchBar
          defaultValue={searchQuery}
          onSearch={handleSearch}
          size="md"
          books={books}
        />
      </section>

      <div className="max-w-[1440px] mx-auto px-4 md:px-8 pb-16">
        <div className="flex gap-8">
          {/* Left Sidebar */}
          <div className="hidden lg:block w-64 flex-shrink-0 animate-fade-in-left">
            <FilterSidebar
              filters={filters}
              onFilterChange={handleFilterChange}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Mobile Filter Button */}
            <button
              onClick={() => setShowMobileFilters(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-white border border-bookify-border rounded-lg text-sm font-medium text-bookify-text hover:border-bookify-purple transition-colors mb-4"
            >
              <SlidersHorizontal size={14} />
              Filters
              {activeFilterCount > 0 && (
                <span className="w-5 h-5 text-xs font-bold text-white bg-bookify-purple rounded-full flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {/* Active Filter Pills */}
            {activeFilterCount > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {filters.modes.map((m) => {
                  const labels = {
                    sell: "Buy",
                    rent: "Rent",
                    exchange: "Exchange",
                    donate: "Free",
                  };
                  return (
                    <span
                      key={m}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-bookify-light-purple text-bookify-purple text-xs font-medium rounded-full"
                    >
                      {labels[m]}
                      <button
                        onClick={() =>
                          setFilters({
                            ...filters,
                            modes: filters.modes.filter((x) => x !== m),
                          })
                        }
                      >
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
                    <button
                      onClick={() =>
                        setFilters({
                          ...filters,
                          conditions: filters.conditions.filter((x) => x !== c),
                        })
                      }
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
                {filters.subCategories?.map((sc) => (
                  <span
                    key={sc}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-bookify-light-purple text-bookify-purple text-xs font-medium rounded-full"
                  >
                    {sc}
                    <button
                      onClick={() =>
                        setFilters({
                          ...filters,
                          subCategories: filters.subCategories.filter(
                            (x) => x !== sc
                          ),
                        })
                      }
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
                {filters.priceRange && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-bookify-light-purple text-bookify-purple text-xs font-medium rounded-full">
                    ₹{filters.priceRange}
                    <button
                      onClick={() =>
                        setFilters({ ...filters, priceRange: null })
                      }
                    >
                      <X size={12} />
                    </button>
                  </span>
                )}
              </div>
            )}

            {/* Title + Tabs Row */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <h1 className="font-[family-name:var(--font-heading)] text-2xl md:text-3xl font-bold text-bookify-text">
                  Books
                </h1>
                <div className="flex gap-4 mt-3">
                  {timeTabs.map((tab) => (
                    <button
                      key={tab.value}
                      onClick={() => {
                        setTimeTab(tab.value);
                        setCurrentPage(1);
                      }}
                      className={`text-sm font-medium pb-1 border-b-2 transition-colors ${
                        timeTab === tab.value
                          ? "text-bookify-text border-bookify-purple font-semibold"
                          : "text-bookify-text-secondary border-transparent hover:text-bookify-text"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* Sort Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setShowSortDropdown(!showSortDropdown)}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-[#E7E4F2] focus:border-[#6C4BF4] rounded-xl text-sm font-semibold text-bookify-text hover:border-[#6C4BF4] transition-all"
                  >
                    <span className="text-gray-500 font-medium">Sort:</span>
                    <span className="font-bold text-[#6C4BF4]">
                      {sortOptions.find((o) => o.value === sortBy)?.label}
                    </span>
                    <ChevronDown size={14} className="text-gray-400" />
                  </button>
                  {showSortDropdown && (
                    <div className="absolute right-0 top-full mt-1 bg-white border border-bookify-border rounded-xl shadow-lg z-50 py-1 min-w-[180px]">
                      {sortOptions.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => {
                            setSortBy(option.value);
                            setShowSortDropdown(false);
                          }}
                          className={`w-full px-4 py-2 text-sm text-left hover:bg-bookify-bg transition-colors ${
                            sortBy === option.value
                              ? "text-bookify-purple font-medium"
                              : "text-bookify-text-secondary"
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Book Grid */}
            {paginatedBooks.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">📚</div>
                <h3 className="font-[family-name:var(--font-heading)] text-xl font-semibold text-bookify-text">
                  No books found
                </h3>
                <p className="text-bookify-text-secondary mt-2">
                  Try adjusting your filters or search query
                </p>
                <button
                  onClick={resetFilters}
                  className="mt-4 px-6 py-2 bg-bookify-purple text-white rounded-lg text-sm font-medium hover:bg-bookify-purple-dark transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
                {paginatedBooks.map((book) => (
                  <BookCard key={book.id} book={book} layout="grid" />
                ))}
              </div>
            )}

            {/* Pagination */}
            {filteredBooks.length > 0 && (
              <div className="flex flex-col-reverse sm:grid sm:grid-cols-3 gap-4 items-center mt-8 pt-6 border-t border-bookify-border">
                {/* Left Spacer for desktop alignment balance */}
                <div className="hidden sm:block"></div>

                {/* Center: Pagination Buttons */}
                <div className="flex justify-center">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() =>
                        setCurrentPage((p) => Math.max(1, p - 1))
                      }
                      disabled={currentPage === 1}
                      className="px-3 py-2 text-sm font-medium rounded-lg border border-bookify-border text-bookify-text-secondary hover:border-bookify-purple hover:text-bookify-purple transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`w-9 h-9 text-sm font-medium rounded-lg transition-colors ${
                            currentPage === pageNum
                              ? "bg-bookify-purple text-white"
                              : "text-bookify-text-secondary hover:bg-bookify-bg"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    <button
                      onClick={() =>
                        setCurrentPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={currentPage === totalPages}
                      className="px-3 py-2 text-sm font-medium rounded-lg border border-bookify-border text-bookify-text-secondary hover:border-bookify-purple hover:text-bookify-purple transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                </div>

                {/* Right: Info Text */}
                <div className="text-center sm:text-right w-full">
                  <p className="text-sm text-bookify-text-secondary">
                    Showing{" "}
                    <span className="font-semibold text-bookify-text">
                      {Math.min(
                        currentPage * ITEMS_PER_PAGE,
                        filteredBooks.length
                      )}
                    </span>{" "}
                    from{" "}
                    <span className="font-semibold text-bookify-text">
                      {filteredBooks.length}
                    </span>{" "}
                    data
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Books on Sale Section */}
        <ScrollReveal>
          <section className="mt-16">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-[family-name:var(--font-heading)] text-2xl md:text-3xl font-bold text-bookify-text">
                Books on Sale
              </h2>
              <div className="flex gap-2">
                <button className="w-10 h-10 rounded-full border border-bookify-border flex items-center justify-center hover:bg-bookify-light-purple transition-colors">
                  <ChevronLeft size={18} />
                </button>
                <button className="w-10 h-10 rounded-full border border-bookify-border flex items-center justify-center hover:bg-bookify-light-purple transition-colors">
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {booksOnSale.map((book) => {
                const discount = Math.round(
                  ((book.originalPrice - book.askingPrice) /
                    book.originalPrice) *
                    100
                );
                return (
                  <a
                    key={book.id}
                    href={`/book/${book.id}`}
                    className="group"
                  >
                    <div className="relative aspect-[3/4] rounded-xl overflow-hidden mb-3">
                      <img
                        src={book.coverImage}
                        alt={book.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <span className="absolute top-2 left-2 px-2 py-1 bg-bookify-green text-white text-[10px] font-bold rounded-lg">
                        {discount}% OFF
                      </span>
                    </div>
                    <h4 className="font-[family-name:var(--font-heading)] text-sm font-semibold text-bookify-text line-clamp-1 group-hover:text-bookify-purple transition-colors">
                      {book.title}
                    </h4>
                    <p className="text-[11px] text-bookify-text-secondary mt-0.5">
                      {book.subCategory}
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      <Star
                        size={11}
                        fill="#FFD166"
                        className="text-bookify-yellow"
                      />
                      <span className="text-[11px] font-medium text-bookify-text">
                        {book.seller.rating}
                      </span>
                    </div>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-sm font-bold text-bookify-text">
                        ₹{book.askingPrice}
                      </span>
                      <span className="text-[11px] text-bookify-text-secondary line-through">
                        ₹{book.originalPrice}
                      </span>
                    </div>
                  </a>
                );
              })}
            </div>
          </section>
        </ScrollReveal>

        {/* Newsletter Section */}
        <ScrollReveal>
          <section className="mt-16 bg-bookify-purple rounded-2xl p-10 md:p-14 text-center text-white">
            <h2 className="font-[family-name:var(--font-heading)] text-2xl md:text-3xl font-bold mb-2">
              Subscribe our newsletter for newest
            </h2>
            <h2 className="font-[family-name:var(--font-heading)] text-2xl md:text-3xl font-bold mb-8">
              books updates
            </h2>
            <div className="max-w-md mx-auto flex gap-2">
              <input
                type="email"
                placeholder="Type your email here"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-4 py-3 rounded-xl text-bookify-text text-sm border-2 border-white/40 focus:outline-none focus:ring-2 focus:ring-white/50 placeholder-white/60 text-white bg-white/10"
              />
              <button className="px-6 py-3 bg-white text-bookify-purple font-semibold rounded-xl hover:bg-gray-100 transition-colors text-sm">
                SUBSCRIBE
              </button>
            </div>
          </section>
        </ScrollReveal>
      </div>

      {/* Mobile Filter Overlay */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowMobileFilters(false)}
          />
          <div className="absolute left-0 top-0 h-full w-80 max-w-[85vw] overflow-y-auto bg-white">
            <FilterSidebar
              filters={filters}
              onFilterChange={handleFilterChange}
              onClose={() => setShowMobileFilters(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
