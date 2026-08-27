import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight, Star, BookOpen } from 'lucide-react';
import HeroSlider from '../../components/hero/HeroSlider';
import BookCard from '../../components/book/BookCard';
import books from '../../data/books';
import categories from '../../data/categories';

var trendingFilters = ['All Books', 'Fiction', 'Non-Fiction', 'Academic & Exams', 'Comics & Manga', 'Self-Help'];

var spotlightAuthors = [
  { name: 'Devina Kaur', book: 'The Monsoon Chronicles', desc: 'An evasive journey through changing relationships and hea...', cover: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop' },
  { name: 'Aravind Sharma', book: 'Beyond Code & Karma', desc: "Unveiling the struggles of India's Silicon Valley workforce. Tech...", cover: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=400&fit=crop' },
  { name: 'Preeti Rai', book: 'Spices of the Soul', desc: 'Over 50 forgotten grandmother recipes stitched together with...', cover: 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=300&h=400&fit=crop' },
];

var testimonials = [
  { text: "Perfect for buying costly engineering textbooks. Picked up standard books directly on campus from seniors for half price!", name: 'Siddharth Roy', role: 'Student, IIT Bombay', avatar: 'https://i.pravatar.cc/150?img=11' },
  { text: "I've sold over 30 romance novels that were gathering dust on my shelves. Bookify's shipping is seamless.", name: 'Aradhana Sen', role: 'Avid Reader, Kolkata', avatar: 'https://i.pravatar.cc/150?img=5' },
  { text: "Being able to print copies on demand and see daily analytics changed my writing career. Truly independent publishing.", name: 'Vikram G.', role: 'Self-Published Novelist', avatar: 'https://i.pravatar.cc/150?img=33' },
];

var stats = [
  { value: '2M+', label: 'BOOKS LISTED' },
  { value: '500K+', label: 'HAPPY READERS' },
  { value: '50K+', label: 'PUBLISHED AUTHORS' },
  { value: '1,200+', label: 'ACTIVE CAMPUS CLUBS' },
];

var trustItems = [
  { icon: 'shield', title: 'Escrow-Protected', desc: 'Money held until delivery' },
  { icon: 'users', title: 'Verified Sellers', desc: 'Profiles fully screened' },
  { icon: 'return', title: 'Easy Returns', desc: 'No-questions-asked disputes' },
  { icon: 'headphones', title: '24/7 Support', desc: 'Always here to guide you' },
];

export default function HomePage() {
  var _f = useState('All Books');
  var activeFilter = _f[0];
  var setActiveFilter = _f[1];

  var featuredBooks = books.slice(0, 5);
  var trendingBooks = books.filter(function(b) {
    if (activeFilter === 'All Books') return true;
    return b.category && b.category.toLowerCase().includes(activeFilter.toLowerCase().split(' ')[0]);
  }).slice(0, 5);

  return (
    <div>
      {/* Hero Slider */}
      <section className="max-w-7xl mx-auto px-4 py-6">
        <HeroSlider />
      </section>

      {/* Trending Books Near You */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-[family-name:var(--font-heading)] text-2xl md:text-3xl font-bold text-bookify-text">
              Trending Books Near You
            </h2>
          </div>
          <Link to="/explore?sort=trending" className="flex items-center gap-1 text-sm font-medium text-bookify-purple hover:text-bookify-purple-dark transition-colors">
            Explore All Trending <ArrowRight size={16} />
          </Link>
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {trendingFilters.map(function(f) {
            return (
              <button
                key={f}
                onClick={function() { setActiveFilter(f); }}
                className={
                  'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ' +
                  (activeFilter === f
                    ? 'bg-bookify-purple text-white'
                    : 'bg-white text-bookify-text border border-bookify-border hover:border-bookify-purple')
                }
              >
                {f}
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {(trendingBooks.length > 0 ? trendingBooks : featuredBooks).map(function(book) {
            return <BookCard key={book.id} book={book} />;
          })}
        </div>
      </section>

      {/* Spotlight Authors */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-[family-name:var(--font-heading)] text-2xl md:text-3xl font-bold text-bookify-text">
              Spotlight Authors
            </h2>
            <p className="text-bookify-text-secondary text-sm mt-1">
              Discover incredible self-published works directly from Indian creators
            </p>
          </div>
          <div className="flex gap-2">
            <button className="w-10 h-10 rounded-full border border-bookify-border flex items-center justify-center hover:bg-bookify-light-purple transition-colors">
              <ChevronLeft size={18} />
            </button>
            <button className="w-10 h-10 rounded-full border border-bookify-border flex items-center justify-center hover:bg-bookify-light-purple transition-colors">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {spotlightAuthors.map(function(author, i) {
            return (
              <div key={i} className="bg-white rounded-xl border border-bookify-border p-5 hover:shadow-lg transition-shadow">
                <div className="flex gap-4">
                  <img src={author.cover} alt={author.book} className="w-20 h-28 object-cover rounded-lg flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <span className="inline-block px-2 py-0.5 bg-bookify-orange-light text-bookify-orange-dark text-[10px] font-bold rounded mb-2">
                      PROMOTED AUTHOR
                    </span>
                    <h3 className="font-[family-name:var(--font-heading)] font-bold text-bookify-text truncate">{author.book}</h3>
                    <p className="text-xs text-bookify-text-secondary mt-0.5">By {author.name}</p>
                    <p className="text-xs text-bookify-text-secondary mt-1 line-clamp-2">{author.desc}</p>
                    <button className="mt-3 px-4 py-1.5 bg-bookify-purple text-white text-xs font-semibold rounded-lg hover:bg-bookify-purple-dark transition-colors">
                      View Book
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Browse by Category */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-6">
          <h2 className="font-[family-name:var(--font-heading)] text-2xl md:text-3xl font-bold text-bookify-text">
            Browse by Category
          </h2>
          <p className="text-bookify-text-secondary text-sm mt-1">
            Explore a vast collection of academic textbooks, popular novels, and regional writing
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {categories.map(function(cat) {
            return (
              <Link
                key={cat.id}
                to={'/categories?cat=' + cat.id}
                className="relative h-36 sm:h-40 rounded-2xl overflow-hidden group shadow-sm hover:shadow-xl transition-all duration-300 flex items-center justify-center p-4 bg-slate-900 border border-bookify-border/40"
              >
                {cat.image ? (
                  <>
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="absolute inset-0 w-full h-full object-cover blur-sm group-hover:blur-none group-hover:scale-110 transition-all duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20 group-hover:from-black/60 group-hover:via-black/20 group-hover:to-transparent transition-colors duration-300" />
                    <div className="relative z-10 flex flex-col items-center justify-center text-center">
                      <span className="text-2xl mb-1 drop-shadow">{cat.icon}</span>
                      <p className="text-sm sm:text-base font-bold text-white tracking-wide drop-shadow-md group-hover:scale-105 transition-transform duration-300">
                        {cat.name}
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center gap-2 text-center">
                    <span className="text-3xl">{cat.icon}</span>
                    <p className="text-sm font-semibold text-bookify-text group-hover:text-bookify-purple transition-colors">
                      {cat.name}
                    </p>
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      </section>

      {/* Publish Your Story */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-bookify-bg rounded-2xl p-8 md:p-12 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <span className="inline-block px-3 py-1 bg-bookify-orange-light text-bookify-orange-dark text-xs font-bold rounded-full mb-4">
              FOR CREATORS
            </span>
            <h2 className="font-[family-name:var(--font-heading)] text-2xl md:text-3xl font-bold text-bookify-text mb-4">
              Publish Your Story with Bookify
            </h2>
            <p className="text-bookify-text-secondary mb-6">
              Empowering India independent authors. Ship print-on-demand books, track daily royalty payouts, and reach millions of passionate readers nationwide.
            </p>
            <div className="space-y-3 mb-6">
              <div className="flex gap-3">
                <div className="w-5 h-5 rounded-full bg-bookify-green text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-bookify-text">Upload & Format Instantly</p>
                  <p className="text-xs text-bookify-text-secondary">Convert drafts into publishing-ready formats with our free creator tools.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-5 h-5 rounded-full bg-bookify-green text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-bookify-text">Set Pricing & Royalties</p>
                  <p className="text-xs text-bookify-text-secondary">Take control of your pricing. Earn up to 70% royalties on printed books.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-5 h-5 rounded-full bg-bookify-green text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-bookify-text">Reach Millions of Readers</p>
                  <p className="text-xs text-bookify-text-secondary">Promote your launch via targeted in-app banners and community clubs.</p>
                </div>
              </div>
            </div>
            <button className="px-6 py-3 bg-bookify-purple text-white font-semibold rounded-xl hover:bg-bookify-purple-dark transition-colors">
              Start Publishing
            </button>
          </div>
          <div className="relative">
            <img src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=600&h=400&fit=crop" alt="Author" className="rounded-xl w-full object-cover" />
            <div className="absolute -bottom-4 -left-4 bg-white p-4 rounded-xl shadow-lg max-w-xs hidden md:block">
              <p className="text-xs text-bookify-text italic mb-2">Bookify took my manuscript from a Word file to print in 10 days.</p>
              <p className="text-[10px] text-bookify-purple font-semibold">- Ritesh Deshmukh, Author</p>
            </div>
          </div>
        </div>
      </section>

      {/* Community */}
      <section className="max-w-7xl mx-auto px-4 py-12 text-center">
        <span className="inline-block px-4 py-1.5 bg-bookify-pink-light text-bookify-pink text-xs font-bold rounded-full mb-4">JOIN THE CLUB</span>
        <h2 className="font-[family-name:var(--font-heading)] text-2xl md:text-3xl font-bold text-bookify-text mb-2">Join the Bookify Community</h2>
        <p className="text-bookify-text-secondary mb-8 max-w-lg mx-auto">Share reading goals, debate plot twists, and swap paperbacks with verified members around you.</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
          <div className="text-center"><div className="text-2xl md:text-3xl font-bold text-bookify-pink">2M+</div><div className="text-xs font-semibold text-bookify-text-secondary mt-1">BOOKS LISTED</div></div>
          <div className="text-center"><div className="text-2xl md:text-3xl font-bold text-bookify-pink">500K+</div><div className="text-xs font-semibold text-bookify-text-secondary mt-1">HAPPY READERS</div></div>
          <div className="text-center"><div className="text-2xl md:text-3xl font-bold text-bookify-pink">50K+</div><div className="text-xs font-semibold text-bookify-text-secondary mt-1">PUBLISHED AUTHORS</div></div>
          <div className="text-center"><div className="text-2xl md:text-3xl font-bold text-bookify-pink">1,200+</div><div className="text-xs font-semibold text-bookify-text-secondary mt-1">ACTIVE CAMPUS CLUBS</div></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl border border-bookify-border p-6 text-left">
            <div className="flex gap-0.5 mb-3">{[1,2,3,4,5].map(function(n){return <Star key={n} size={14} className="text-bookify-yellow fill-bookify-yellow" />;})}</div>
            <p className="text-sm text-bookify-text mb-4">"Perfect for buying costly engineering textbooks. Picked up standard books directly on campus from seniors for half price!"</p>
            <div className="flex items-center gap-3"><img src="https://i.pravatar.cc/150?img=11" alt="Siddharth" className="w-9 h-9 rounded-full" /><div><p className="text-sm font-semibold text-bookify-text">Siddharth Roy</p><p className="text-xs text-bookify-text-secondary">Student, IIT Bombay</p></div></div>
          </div>
          <div className="bg-white rounded-xl border border-bookify-border p-6 text-left">
            <div className="flex gap-0.5 mb-3">{[1,2,3,4,5].map(function(n){return <Star key={n} size={14} className="text-bookify-yellow fill-bookify-yellow" />;})}</div>
            <p className="text-sm text-bookify-text mb-4">"I have sold over 30 romance novels that were gathering dust on my shelves. Bookify shipping is seamless."</p>
            <div className="flex items-center gap-3"><img src="https://i.pravatar.cc/150?img=5" alt="Aradhana" className="w-9 h-9 rounded-full" /><div><p className="text-sm font-semibold text-bookify-text">Aradhana Sen</p><p className="text-xs text-bookify-text-secondary">Avid Reader, Kolkata</p></div></div>
          </div>
          <div className="bg-white rounded-xl border border-bookify-border p-6 text-left">
            <div className="flex gap-0.5 mb-3">{[1,2,3,4,5].map(function(n){return <Star key={n} size={14} className="text-bookify-yellow fill-bookify-yellow" />;})}</div>
            <p className="text-sm text-bookify-text mb-4">"Being able to print copies on demand and see daily analytics changed my writing career."</p>
            <div className="flex items-center gap-3"><img src="https://i.pravatar.cc/150?img=33" alt="Vikram" className="w-9 h-9 rounded-full" /><div><p className="text-sm font-semibold text-bookify-text">Vikram G.</p><p className="text-xs text-bookify-text-secondary">Self-Published Novelist</p></div></div>
          </div>
        </div>
        <button className="px-8 py-3 bg-bookify-pink text-white font-semibold rounded-xl hover:bg-pink-500 transition-colors">Join Book Clubs Near You</button>
      </section>

      {/* Trust Footer */}
      <section className="border-t border-bookify-border bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4">
            <div className="flex items-center gap-3 py-5 px-4 border-r border-bookify-border">
              <div className="w-10 h-10 rounded-xl bg-bookify-light-purple flex items-center justify-center">
                <BookOpen size={18} className="text-bookify-purple" />
              </div>
              <div>
                <p className="text-sm font-semibold text-bookify-text">Escrow-Protected</p>
                <p className="text-xs text-bookify-text-secondary">Money held until delivery</p>
              </div>
            </div>
            <div className="flex items-center gap-3 py-5 px-4 border-r border-bookify-border">
              <div className="w-10 h-10 rounded-xl bg-bookify-light-purple flex items-center justify-center">
                <BookOpen size={18} className="text-bookify-purple" />
              </div>
              <div>
                <p className="text-sm font-semibold text-bookify-text">Verified Sellers</p>
                <p className="text-xs text-bookify-text-secondary">Profiles fully screened</p>
              </div>
            </div>
            <div className="flex items-center gap-3 py-5 px-4 border-r border-bookify-border">
              <div className="w-10 h-10 rounded-xl bg-bookify-light-purple flex items-center justify-center">
                <BookOpen size={18} className="text-bookify-purple" />
              </div>
              <div>
                <p className="text-sm font-semibold text-bookify-text">Easy Returns</p>
                <p className="text-xs text-bookify-text-secondary">No-questions-asked disputes</p>
              </div>
            </div>
            <div className="flex items-center gap-3 py-5 px-4">
              <div className="w-10 h-10 rounded-xl bg-bookify-light-purple flex items-center justify-center">
                <BookOpen size={18} className="text-bookify-purple" />
              </div>
              <div>
                <p className="text-sm font-semibold text-bookify-text">24/7 Support</p>
                <p className="text-xs text-bookify-text-secondary">Always here to guide you</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
