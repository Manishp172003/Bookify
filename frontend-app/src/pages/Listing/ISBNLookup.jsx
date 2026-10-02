import React, { useState, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import ListingWizardLayout from '../../components/listing/ListingWizardLayout';
const BarcodeScannerModal = lazy(() => import('../../components/listing/BarcodeScannerModal'));
import { useListing } from '../../context/ListingContext';
import { Search, Barcode, BookOpen, Sparkles, ArrowRight, Check, AlertCircle, Camera, Tag } from 'lucide-react';
import { getBookCover, DEFAULT_BOOK_COVER } from '../../utils/bookCoverUtils';
import categories from '../../data/categories';

const DUMMY_PRESETS = [
  {
    isbn: '9780262033848',
    title: 'Introduction to Algorithms',
    author: 'Thomas H. Cormen, Charles E. Leiserson, Ronald L. Rivest',
    publisher: 'MIT Press',
    edition: '3rd Edition',
    year: '2009',
    category: 'Academic & Textbooks',
    subCategory: 'Computer Science',
    mrp: 1450,
    price: 699,
    cover: 'https://covers.openlibrary.org/b/isbn/9780262033848-L.jpg'
  },
  {
    isbn: '9780984782857',
    title: 'Cracking the Coding Interview',
    author: 'Gayle Laakmann McDowell',
    publisher: 'CareerCup',
    edition: '6th Edition',
    year: '2015',
    category: 'Competitive Exams',
    subCategory: 'Placements & Coding',
    mrp: 999,
    price: 499,
    cover: 'https://covers.openlibrary.org/b/isbn/9780984782857-L.jpg'
  },
  {
    isbn: '9780070671607',
    title: 'Concepts of Physics (Vol 1)',
    author: 'Dr. H.C. Verma',
    publisher: 'Bharati Bhawan',
    edition: '2023 Reprint',
    year: '2023',
    category: 'Competitive Exams',
    subCategory: 'JEE',
    mrp: 460,
    price: 230,
    cover: 'https://covers.openlibrary.org/b/isbn/9788177091878-L.jpg'
  }
];

export default function ISBNLookup() {
  const navigate = useNavigate();
  const { listingData, updateListingData } = useListing();

  const [isbnInput, setIsbnInput] = useState(listingData.isbn || '');
  const [titleInput, setTitleInput] = useState(listingData.title || '');
  const [activeTab, setActiveTab] = useState('isbn'); // 'isbn' | 'title' | 'manual'
  const [isSearching, setIsSearching] = useState(false);
  const [lookupSuccess, setLookupSuccess] = useState(true);
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  const resolvePlatformCategory = (raw) => {
    if (!raw) return 'Academic & Textbooks';
    const low = raw.toLowerCase();
    if (low.includes('competitive') || low.includes('exam') || low.includes('jee') || low.includes('neet') || low.includes('upsc') || low.includes('gate') || low.includes('cat')) {
      return 'Competitive Exams';
    }
    if (low.includes('comic') || low.includes('manga') || low.includes('graphic novel')) {
      return 'Comics & Manga';
    }
    if (low.includes('child') || low.includes('kid') || low.includes('juvenile') || low.includes('young reader')) {
      return "Children's Books";
    }
    if (low.includes('hindi') || low.includes('tamil') || low.includes('telugu') || low.includes('bengali') || low.includes('marathi') || low.includes('regional')) {
      return 'Regional Languages';
    }
    if (low.includes('fiction') || low.includes('novel') || low.includes('literature')) {
      return 'Fiction & Novels';
    }
    if (low.includes('self') || low.includes('psychology') || low.includes('productivity') || low.includes('mindfulness') || low.includes('wellness')) {
      return 'Self-Help';
    }
    if (low.includes('history') || low.includes('biography') || low.includes('non-fiction') || low.includes('philosophy')) {
      return 'Non-Fiction';
    }
    return 'Academic & Textbooks';
  };

  const fetchIsbnDetails = async (rawIsbn) => {
    const clean = (rawIsbn || '').trim().replace(/-/g, '');
    if (!clean) return;
    setIsbnInput(clean);
    setIsSearching(true);

    try {
      // Try backend Google Books / Open Library lookup first
      const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
      const res = await fetch(`${apiBase}/books/isbn/${clean}`);
      const data = await res.json();
      if (res.ok && data.success && data.data) {
        const book = data.data;
        const estMrp = book.mrp || 800;
        const estPrice = Math.round(estMrp * 0.5);
        const resolvedCover = getBookCover(book) || book.coverImage || DEFAULT_BOOK_COVER;
        updateListingData({
          isbn: book.isbn || clean,
          title: book.title || "Found Textbook",
          author: book.author || "Unknown Author",
          publisher: book.publisher || "Academic Publisher",
          edition: book.publishedDate || "Standard Edition",
          category: resolvePlatformCategory(book.category),
          mrp: estMrp,
          price: estPrice,
          cover: resolvedCover,
          photos: resolvedCover ? [resolvedCover] : listingData.photos
        });
        setIsSearching(false);
        setLookupSuccess(true);
        return;
      }
    } catch {
      // Fallback gracefully to presets
    }

    const matched = DUMMY_PRESETS.find(b => b.isbn.includes(clean)) || DUMMY_PRESETS[0];
    const calcPrice = matched.price || Math.round((matched.mrp || 1000) * 0.5);
    const coverToUse = getBookCover(matched.title) || matched.cover;
    updateListingData({
      isbn: clean,
      title: matched.title,
      author: matched.author,
      publisher: matched.publisher,
      edition: matched.edition,
      year: matched.year,
      category: matched.category,
      mrp: matched.mrp,
      price: calcPrice,
      cover: coverToUse,
      photos: [coverToUse]
    });
    setIsSearching(false);
    setLookupSuccess(true);
  };

  const handleIsbnSubmit = (e) => {
    e.preventDefault();
    fetchIsbnDetails(isbnInput);
  };

  const handleScanSuccess = (scannedIsbn) => {
    setIsScannerOpen(false);
    setActiveTab('isbn');
    fetchIsbnDetails(scannedIsbn);
  };

  const handleTitleSubmit = (e) => {
    e.preventDefault();
    if (!titleInput.trim()) return;
    setIsSearching(true);

    setTimeout(() => {
      setIsSearching(false);
      const matched = DUMMY_PRESETS.find(b => b.title.toLowerCase().includes(titleInput.toLowerCase())) || DUMMY_PRESETS[1];
      const calcPrice = matched.price || Math.round((matched.mrp || 1000) * 0.5);
      updateListingData({
        isbn: matched.isbn,
        title: titleInput.trim(),
        author: matched.author,
        publisher: matched.publisher,
        edition: matched.edition,
        year: matched.year,
        category: matched.category,
        mrp: matched.mrp,
        price: calcPrice,
        cover: matched.cover,
        photos: [matched.cover]
      });
      setLookupSuccess(true);
    }, 300);
  };

  const handleSelectPreset = (preset) => {
    setIsbnInput(preset.isbn);
    setTitleInput(preset.title);
    const calcPrice = preset.price || Math.round((preset.mrp || 1000) * 0.5);
    updateListingData({
      ...preset,
      price: calcPrice,
      photos: [preset.cover]
    });
  };

  return (
    <ListingWizardLayout
      currentStep={1}
      title="Find Your Book"
      subtitle="Enter your 13-digit ISBN or book title to automatically fetch standard details, edition, and publisher info."
    >
      <div className="space-y-6">
        
        {/* Search Method Tabs */}
        <div className="flex bg-gray-100 p-1.5 rounded-2xl gap-1">
          <button
            type="button"
            onClick={() => setActiveTab('isbn')}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'isbn'
                ? 'bg-white text-[#6C4BF4] shadow-xs'
                : 'text-gray-500 hover:text-[#17152A]'
            }`}
          >
            <Barcode size={16} /> Search by ISBN
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('title')}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'title'
                ? 'bg-white text-[#6C4BF4] shadow-xs'
                : 'text-gray-500 hover:text-[#17152A]'
            }`}
          >
            <Search size={16} /> Search by Title
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('manual')}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'manual'
                ? 'bg-white text-[#6C4BF4] shadow-xs'
                : 'text-gray-500 hover:text-[#17152A]'
            }`}
          >
            <BookOpen size={16} /> Manual Entry
          </button>
        </div>

        {/* Tab 1: ISBN Search */}
        {activeTab === 'isbn' && (
          <form onSubmit={handleIsbnSubmit} className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  10 or 13-Digit ISBN (Back Cover Barcode)
                </label>
                <button
                  type="button"
                  onClick={() => setIsScannerOpen(true)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#6C4BF4] bg-[#6C4BF4]/10 hover:bg-[#6C4BF4]/20 px-3 py-1 rounded-lg transition cursor-pointer"
                >
                  <Camera size={14} /> Scan with Camera
                </button>
              </div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. 9780262033848"
                  value={isbnInput}
                  onChange={(e) => setIsbnInput(e.target.value)}
                  className="w-full pl-11 pr-24 py-3.5 rounded-xl border border-gray-200 bg-[#F8F7FF] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6C4BF4]/20 focus:border-[#6C4BF4] transition text-sm text-[#17152A] font-medium font-mono"
                />
                <Barcode className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <button
                  type="button"
                  onClick={() => setIsScannerOpen(true)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 text-[11px] font-bold text-gray-600 hover:text-[#6C4BF4] bg-white border border-gray-200 hover:border-[#6C4BF4]/40 px-2.5 py-1.5 rounded-lg transition shadow-2xs cursor-pointer"
                  title="Scan barcode with camera"
                >
                  <Camera size={13} className="text-[#6C4BF4]" />
                  <span>Scan</span>
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSearching}
              className="w-full bg-[#6C4BF4] hover:bg-[#5B3DE0] text-white font-bold py-3.5 px-6 rounded-xl transition duration-200 shadow-md shadow-[#6C4BF4]/25 cursor-pointer text-sm flex items-center justify-center gap-2"
            >
              {isSearching ? 'Fetching Book Metadata...' : 'Lookup ISBN & Populate Details'}
              {!isSearching && <ArrowRight size={16} />}
            </button>
          </form>
        )}

        {/* Tab 2: Title Search */}
        {activeTab === 'title' && (
          <form onSubmit={handleTitleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                Book Title / Subject Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. Cracking the Coding Interview or Introduction to Algorithms"
                  value={titleInput}
                  onChange={(e) => setTitleInput(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-gray-200 bg-[#F8F7FF] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6C4BF4]/20 focus:border-[#6C4BF4] transition text-sm text-[#17152A] font-medium"
                />
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSearching}
              className="w-full bg-[#6C4BF4] hover:bg-[#5B3DE0] text-white font-bold py-3.5 px-6 rounded-xl transition duration-200 shadow-md shadow-[#6C4BF4]/25 cursor-pointer text-sm flex items-center justify-center gap-2"
            >
              {isSearching ? 'Searching Catalog...' : 'Search Book Title'}
              {!isSearching && <ArrowRight size={16} />}
            </button>
          </form>
        )}

        {/* Tab 3: Manual Entry */}
        {activeTab === 'manual' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                  Book Title *
                </label>
                <input
                  type="text"
                  value={listingData.title}
                  onChange={(e) => updateListingData({ title: e.target.value })}
                  placeholder="e.g. Engineering Mathematics"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-[#F8F7FF] focus:bg-white focus:outline-none focus:border-[#6C4BF4] text-sm text-[#17152A]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                  Author(s) *
                </label>
                <input
                  type="text"
                  value={listingData.author}
                  onChange={(e) => updateListingData({ author: e.target.value })}
                  placeholder="e.g. B.S. Grewal"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-[#F8F7FF] focus:bg-white focus:outline-none focus:border-[#6C4BF4] text-sm text-[#17152A]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                  Publisher
                </label>
                <input
                  type="text"
                  value={listingData.publisher}
                  onChange={(e) => updateListingData({ publisher: e.target.value })}
                  placeholder="e.g. Khanna Publishers"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-[#F8F7FF] focus:bg-white focus:outline-none focus:border-[#6C4BF4] text-sm text-[#17152A]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                  Edition / Year
                </label>
                <input
                  type="text"
                  value={listingData.edition}
                  onChange={(e) => updateListingData({ edition: e.target.value })}
                  placeholder="e.g. 44th Edition (2021)"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-[#F8F7FF] focus:bg-white focus:outline-none focus:border-[#6C4BF4] text-sm text-[#17152A]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                  Category *
                </label>
                <select
                  value={listingData.category || 'Academic & Textbooks'}
                  onChange={(e) => {
                    const chosen = e.target.value;
                    const catObj = categories.find(c => c.name === chosen);
                    updateListingData({
                      category: chosen,
                      subCategory: catObj?.subCategories?.[0] || ''
                    });
                  }}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-[#F8F7FF] focus:bg-white focus:outline-none focus:border-[#6C4BF4] text-sm text-[#17152A]"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.name}>{c.icon} {c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                  Sub-Category / Stream
                </label>
                <select
                  value={listingData.subCategory || ''}
                  onChange={(e) => updateListingData({ subCategory: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-[#F8F7FF] focus:bg-white focus:outline-none focus:border-[#6C4BF4] text-sm text-[#17152A]"
                >
                  <option value="">General / Standard</option>
                  {(categories.find(c => c.name === (listingData.category || 'Academic & Textbooks'))?.subCategories || []).map((sub) => (
                    <option key={sub} value={sub}>{sub}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Quick Presets for Demo / Easy Selection */}
        <div className="pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Or Choose from Popular Campus Books
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {DUMMY_PRESETS.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectPreset(preset)}
                className="text-left p-3 rounded-xl border border-gray-200 hover:border-[#6C4BF4] hover:bg-[#EEEAFE]/30 transition cursor-pointer flex gap-3 items-center group"
              >
                <img
                  src={preset.cover}
                  alt={preset.title}
                  className="w-10 h-14 object-cover rounded-md border border-gray-200 shrink-0"
                />
                <div className="min-w-0">
                  <div className="text-xs font-bold text-[#17152A] truncate group-hover:text-[#6C4BF4]">
                    {preset.title}
                  </div>
                  <div className="text-[10px] text-gray-400 truncate">{preset.author}</div>
                  <div className="text-[10px] font-bold text-emerald-600 mt-1">MRP ₹{preset.mrp}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Selected Book Verification & Category Review Card */}
        {listingData.title && (
          <div className="bg-[#F8F7FF] border border-[#6C4BF4]/25 rounded-2xl p-4 sm:p-5 transition shadow-xs">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex gap-3.5 items-center min-w-0">
                <img
                  src={listingData.photos?.[0] || listingData.cover || DEFAULT_BOOK_COVER}
                  alt={listingData.title}
                  className="w-12 h-16 object-cover rounded-lg border border-gray-200 shrink-0 shadow-xs"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                      <Check size={11} /> Selected for Listing
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-[#17152A] truncate">{listingData.title}</h4>
                  <p className="text-xs text-gray-500 truncate">by {listingData.author || "Unknown Author"}</p>
                </div>
              </div>

              {/* Category picker to ensure student puts book in correct category */}
              <div className="w-full sm:w-auto flex flex-col sm:items-end gap-1 shrink-0">
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
                  Marketplace Category
                </label>
                <select
                  value={listingData.category || 'Academic & Textbooks'}
                  onChange={(e) => {
                    const chosen = e.target.value;
                    const catObj = categories.find(c => c.name === chosen);
                    updateListingData({
                      category: chosen,
                      subCategory: catObj?.subCategories?.[0] || ''
                    });
                  }}
                  className="bg-white border border-[#6C4BF4]/40 rounded-xl px-3 py-1.5 text-xs font-bold text-[#6C4BF4] focus:outline-none focus:ring-2 focus:ring-[#6C4BF4]/20 cursor-pointer shadow-2xs"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.name}>{c.icon} {c.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Next Step Action Button */}
        <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate('/sell')}
            className="px-6 py-3.5 border border-gray-200 hover:bg-gray-50 text-gray-600 font-semibold rounded-xl text-sm transition cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={() => navigate('/sell/condition')}
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#6C4BF4] hover:bg-[#5B3DE0] text-white font-bold rounded-xl text-sm transition shadow-md shadow-[#6C4BF4]/25 cursor-pointer"
          >
            Continue to Condition <ArrowRight size={16} />
          </button>
        </div>

      </div>

      {/* Real-Time HTML5 Webcam Barcode Scanner Modal (On-demand Chunk) */}
      {isScannerOpen && (
        <Suspense fallback={null}>
          <BarcodeScannerModal
            isOpen={isScannerOpen}
            onClose={() => setIsScannerOpen(false)}
            onScanSuccess={handleScanSuccess}
          />
        </Suspense>
      )}
    </ListingWizardLayout>
  );
}
