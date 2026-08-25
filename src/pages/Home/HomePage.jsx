import { Link } from "react-router-dom";
import {
  ArrowRight,
  TrendingUp,
  Star,
  Shield,
  Zap,
  Truck,
  ChevronRight,
} from "lucide-react";
import SearchBar from "../../components/search/SearchBar";
import BookCard from "../../components/book/BookCard";
import books from "../../data/books";
import categories from "../../data/categories";

const features = [
  {
    icon: <Shield size={24} className="text-bookify-purple" />,
    title: "Escrow Protection",
    desc: "Funds held safely until buyer confirms delivery",
  },
  {
    icon: <Zap size={24} className="text-bookify-orange" />,
    title: "ISBN Auto-Fill",
    desc: "Scan barcode to auto-populate book details",
  },
  {
    icon: <Truck size={24} className="text-bookify-green" />,
    title: "Campus Delivery",
    desc: "Fast delivery to your college campus",
  },
  {
    icon: <Star size={24} className="text-bookify-yellow" />,
    title: "Verified Sellers",
    desc: "College ID verification for trusted sellers",
  },
];

export default function HomePage() {
  const featuredBooks = books.slice(0, 8);
  const recentBooks = books.filter((b) => b.postedDaysAgo <= 2);
  const freeBooks = books.filter((b) => b.mode === "donate");

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-bookify-purple via-bookify-purple-dark to-[#4A2DB8] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 bg-bookify-orange rounded-full blur-[120px]" />
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-bookify-pink rounded-full blur-[140px]" />
        </div>

        <div className="max-w-[1440px] mx-auto px-6 md:px-10 py-16 md:py-24 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur rounded-full text-sm font-medium mb-6">
              <span className="w-2 h-2 bg-bookify-green rounded-full animate-pulse" />
              2,500+ Books Listed This Week
            </span>
            <h1 className="font-[family-name:var(--font-heading)] text-4xl md:text-6xl font-bold leading-tight">
              Buy, Sell & Rent
              <br />
              <span className="text-bookify-yellow">Books</span> at Your Campus
            </h1>
            <p className="text-white/70 mt-4 text-lg max-w-xl mx-auto">
              India's smartest peer-to-peer book marketplace. Save up to 80% on
              textbooks, or earn from books you no longer need.
            </p>

            <div className="mt-8 max-w-2xl mx-auto">
              <SearchBar
                size="lg"
                placeholder="Search by title, author, ISBN, or subject..."
              />
            </div>

            <div className="flex items-center justify-center gap-8 mt-10 text-sm">
              {[
                { value: "50K+", label: "Books Listed" },
                { value: "12K+", label: "Happy Students" },
                { value: "200+", label: "Colleges" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="font-bold text-xl">{stat.value}</div>
                  <div className="text-white/60">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features bar */}
      <section className="border-b border-bookify-border bg-white">
        <div className="max-w-[1440px] mx-auto px-6 md:px-10">
          <div className="grid grid-cols-2 md:grid-cols-4">
            {features.map((f, i) => (
              <div
                key={i}
                className="flex items-center gap-3 py-5 px-4 border-r border-bookify-border last:border-0"
              >
                {f.icon}
                <div>
                  <p className="text-sm font-semibold text-bookify-text">
                    {f.title}
                  </p>
                  <p className="text-xs text-bookify-text-secondary hidden sm:block">
                    {f.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-[1440px] mx-auto px-6 md:px-10 py-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-bookify-text">
              Browse Categories
            </h2>
            <p className="text-bookify-text-secondary text-sm mt-1">
              Find books by subject and field of study
            </p>
          </div>
          <Link
            to="/categories"
            className="flex items-center gap-1 text-sm font-medium text-bookify-purple hover:text-bookify-purple-dark transition-colors"
          >
            View All <ChevronRight size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-3">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/categories?cat=${cat.id}`}
              className="flex items-center gap-3 p-4 bg-white rounded-xl border border-bookify-border hover:border-bookify-purple hover:shadow-md transition-all group"
            >
              <span className="text-2xl">{cat.icon}</span>
              <div>
                <p className="text-sm font-semibold text-bookify-text group-hover:text-bookify-purple transition-colors">
                  {cat.name}
                </p>
                <p className="text-xs text-bookify-text-secondary">
                  {cat.subCategories.length} subcategories
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Trending Books */}
      <section className="max-w-[1440px] mx-auto px-6 md:px-10 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2">
              <TrendingUp size={20} className="text-bookify-orange" />
              <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-bookify-text">
                Trending Now
              </h2>
            </div>
            <p className="text-bookify-text-secondary text-sm mt-1">
              Most popular books this week
            </p>
          </div>
          <Link
            to="/explore?sort=trending"
            className="flex items-center gap-1 text-sm font-medium text-bookify-purple hover:text-bookify-purple-dark transition-colors"
          >
            See All <ChevronRight size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {featuredBooks.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </section>

      {/* Recently Listed */}
      {recentBooks.length > 0 && (
        <section className="max-w-[1440px] mx-auto px-6 md:px-10 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-bookify-text">
                Just Listed 🔥
              </h2>
              <p className="text-bookify-text-secondary text-sm mt-1">
                Fresh books added in the last 48 hours
              </p>
            </div>
            <Link
              to="/explore?sort=newest"
              className="flex items-center gap-1 text-sm font-medium text-bookify-purple hover:text-bookify-purple-dark transition-colors"
            >
              See All <ChevronRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {recentBooks.slice(0, 4).map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </section>
      )}

      {/* Free Books Banner */}
      {freeBooks.length > 0 && (
        <section className="max-w-[1440px] mx-auto px-6 md:px-10 py-8">
          <div className="bg-gradient-to-r from-bookify-green-light to-[#D1FADF] rounded-2xl p-6 md:p-8">
            <div className="flex items-start justify-between">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-bookify-green text-white text-xs font-bold rounded-full mb-3">
                  🎁 FREE BOOKS
                </span>
                <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-bookify-text">
                  Books Available for Free
                </h2>
                <p className="text-bookify-text-secondary text-sm mt-1">
                  Generous readers are donating books to students in need
                </p>
              </div>
              <Link
                to="/explore?mode=donate"
                className="flex items-center gap-1 px-4 py-2 bg-bookify-green text-white rounded-lg text-sm font-medium hover:bg-green-600 transition-colors flex-shrink-0"
              >
                Browse Free <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-6">
              {freeBooks.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="max-w-[1440px] mx-auto px-6 md:px-10 py-12">
        <div className="bg-bookify-purple rounded-2xl p-8 md:p-12 text-center text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -top-20 -right-20 w-60 h-60 bg-bookify-orange rounded-full blur-[100px]" />
            <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-bookify-pink rounded-full blur-[100px]" />
          </div>
          <div className="relative z-10">
            <h2 className="font-[family-name:var(--font-heading)] text-2xl md:text-3xl font-bold">
              Have Books to Sell?
            </h2>
            <p className="text-white/70 mt-2 max-w-lg mx-auto">
              List your used textbooks in minutes. Reach thousands of students at
              your campus and across India.
            </p>
            <button className="mt-6 px-8 py-3 bg-bookify-orange text-white rounded-xl font-semibold hover:bg-bookify-orange-dark transition-colors">
              Start Selling Now
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
