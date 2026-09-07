import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ListingWizardLayout from '../../components/listing/ListingWizardLayout';
import { useListing } from '../../context/ListingContext';
import { Search, Barcode, BookOpen, Sparkles, ArrowRight, Check, AlertCircle } from 'lucide-react';

const DUMMY_PRESETS = [
  {
    isbn: '9780262033848',
    title: 'Introduction to Algorithms',
    author: 'Thomas H. Cormen, Charles E. Leiserson, Ronald L. Rivest',
    publisher: 'MIT Press',
    edition: '3rd Edition',
    year: '2009',
    category: 'Computer Science & Engineering',
    mrp: 1450,
    cover: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=300'
  },
  {
    isbn: '9780984782857',
    title: 'Cracking the Coding Interview',
    author: 'Gayle Laakmann McDowell',
    publisher: 'CareerCup',
    edition: '6th Edition',
    year: '2015',
    category: 'Placement & Competitive',
    mrp: 999,
    cover: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=300'
  },
  {
    isbn: '9780070671607',
    title: 'Concepts of Physics (Vol 1)',
    author: 'Dr. H.C. Verma',
    publisher: 'Bharati Bhawan',
    edition: '2023 Reprint',
    year: '2023',
    category: 'JEE & Physics',
    mrp: 460,
    cover: 'https://images.unsplash.com/photo-1532012164546-f432f2e3edd3?auto=format&fit=crop&q=80&w=300'
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

  const handleIsbnSubmit = (e) => {
    e.preventDefault();
    if (!isbnInput.trim()) return;
    setIsSearching(true);

    setTimeout(() => {
      setIsSearching(false);
      const matched = DUMMY_PRESETS.find(b => b.isbn.includes(isbnInput.trim())) || DUMMY_PRESETS[0];
      updateListingData({
        isbn: isbnInput.trim(),
        title: matched.title,
        author: matched.author,
        publisher: matched.publisher,
        edition: matched.edition,
        year: matched.year,
        category: matched.category,
        mrp: matched.mrp,
        cover: matched.cover
      });
      setLookupSuccess(true);
    }, 400);
  };

  const handleTitleSubmit = (e) => {
    e.preventDefault();
    if (!titleInput.trim()) return;
    setIsSearching(true);

    setTimeout(() => {
      setIsSearching(false);
      const matched = DUMMY_PRESETS.find(b => b.title.toLowerCase().includes(titleInput.toLowerCase())) || DUMMY_PRESETS[1];
      updateListingData({
        isbn: matched.isbn,
        title: titleInput.trim(),
        author: matched.author,
        publisher: matched.publisher,
        edition: matched.edition,
        year: matched.year,
        category: matched.category,
        mrp: matched.mrp,
        cover: matched.cover
      });
      setLookupSuccess(true);
    }, 400);
  };

  const handleSelectPreset = (preset) => {
    setIsbnInput(preset.isbn);
    setTitleInput(preset.title);
    updateListingData(preset);
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
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                10 or 13-Digit ISBN (Found on back cover barcode)
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. 9780262033848"
                  value={isbnInput}
                  onChange={(e) => setIsbnInput(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-gray-200 bg-[#F8F7FF] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6C4BF4]/20 focus:border-[#6C4BF4] transition text-sm text-[#17152A] font-medium font-mono"
                />
                <Barcode className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
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
    </ListingWizardLayout>
  );
}
