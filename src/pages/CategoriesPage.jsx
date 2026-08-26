import { Link, useSearchParams } from "react-router-dom";
import { ChevronRight, BookOpen } from "lucide-react";
import categories from "../data/categories";
import books from "../data/books";

export default function CategoriesPage() {
  const [searchParams] = useSearchParams();
  const activeCat = searchParams.get("cat");

  const getCategoryBookCount = (catId) => {
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
    return books.filter((b) => b.category === catMap[catId]).length;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="font-[family-name:var(--font-heading)] text-3xl font-bold text-bookify-text">
          Browse Categories
        </h1>
        <p className="text-bookify-text-secondary mt-2">
          Discover books across {categories.length} major categories
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => {
          const count = getCategoryBookCount(cat.id);
          return (
            <div
              key={cat.id}
              className="bg-white rounded-xl border border-bookify-border hover:border-bookify-purple hover:shadow-md transition-all overflow-hidden group"
            >
              <div className="h-2" style={{ backgroundColor: cat.color }} />
              <div className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {cat.image ? (
                      <img src={cat.image} alt={cat.name} className="w-12 h-12 rounded-xl object-cover flex-shrink-0" />
                    ) : (
                      <span
                        className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                        style={{ backgroundColor: cat.bgColor }}
                      >
                        {cat.icon}
                      </span>
                    )}
                    <div>
                      <h3 className="font-[family-name:var(--font-heading)] font-semibold text-bookify-text group-hover:text-bookify-purple transition-colors">
                        {cat.name}
                      </h3>
                      <p className="text-xs text-bookify-text-secondary mt-0.5">
                        {count} books available
                      </p>
                    </div>
                  </div>
                  <ChevronRight
                    size={18}
                    className="text-bookify-text-secondary group-hover:text-bookify-purple group-hover:translate-x-1 transition-all mt-1"
                  />
                </div>

                <div className="flex flex-wrap gap-2 mt-4">
                  {cat.subCategories.map((sub) => (
                    <Link
                      key={sub}
                      to={`/explore?category=${encodeURIComponent(cat.name)}&sub=${encodeURIComponent(sub)}`}
                      className="text-xs px-2.5 py-1 rounded-full border border-bookify-border text-bookify-text-secondary hover:border-bookify-purple hover:text-bookify-purple hover:bg-bookify-light-purple transition-all"
                    >
                      {sub}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-12">
        <h2 className="font-[family-name:var(--font-heading)] text-xl font-bold text-bookify-text mb-6">
          Popular This Week
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categories.slice(0, 4).map((cat) => (
            <div
              key={cat.id}
              className="bg-white rounded-xl border border-bookify-border p-4"
            >
              <div className="flex items-center gap-2 mb-3">
                <span
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-lg"
                  style={{ backgroundColor: cat.bgColor }}
                >
                  {cat.icon}
                </span>
                <span className="font-semibold text-sm text-bookify-text">
                  {cat.name}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {books
                  .filter((b) => {
                    const catMap = {
                      cs: "Computer Science",
                      science: "Science",
                      engineering: "Engineering",
                      competitive: "Competitive Exams",
                    };
                    return b.category === catMap[cat.id];
                  })
                  .slice(0, 3)
                  .map((book) => (
                    <Link
                      key={book.id}
                      to={`/book/${book.id}`}
                      className="group"
                    >
                      <div className="aspect-[3/4] rounded-lg overflow-hidden">
                        <img
                          src={book.coverImage}
                          alt={book.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <p className="text-xs text-bookify-text mt-1.5 line-clamp-1 font-medium">
                        {book.title}
                      </p>
                      <p className="text-xs font-bold text-bookify-purple">
                        ₹{book.askingPrice}
                      </p>
                    </Link>
                  ))}
                {books.filter((b) => {
                  const catMap = {
                    cs: "Computer Science",
                    science: "Science",
                    engineering: "Engineering",
                    competitive: "Competitive Exams",
                  };
                  return b.category === catMap[cat.id];
                }).length === 0 && (
                  <div className="col-span-3 py-6 text-center text-sm text-bookify-text-secondary">
                    <BookOpen size={24} className="mx-auto mb-2 opacity-40" />
                    No books listed yet
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
