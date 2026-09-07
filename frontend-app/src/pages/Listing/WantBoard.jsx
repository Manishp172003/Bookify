import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { wantBoardService } from '../../services/wantBoardService';
import { 
  Search, 
  Plus, 
  MessageSquare, 
  BookOpen, 
  Tag, 
  Calendar, 
  User, 
  CheckCircle, 
  Sparkles, 
  ArrowRight, 
  MapPin, 
  HelpCircle 
} from 'lucide-react';

export default function WantBoard() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [showModal, setShowModal] = useState(false);

  // New Request Form state
  const [newTitle, setNewTitle] = useState('');
  const [newAuthor, setNewAuthor] = useState('');
  const [newDept, setNewDept] = useState('Computer Science');
  const [newBudget, setNewBudget] = useState(400);
  const [newNotes, setNewNotes] = useState('');

  const loadRequests = () => {
    setRequests(wantBoardService.getAllRequests());
  };

  useEffect(() => {
    loadRequests();
    window.addEventListener("bookify_want_board_updated", loadRequests);
    return () => window.removeEventListener("bookify_want_board_updated", loadRequests);
  }, []);

  const departments = ['All', 'Computer Science', 'Mechanical Engineering', 'Economics & Commerce', 'Pre-Med / NEET'];

  const filteredRequests = requests.filter(req => {
    const matchesDept = selectedDept === 'All' || req.department.toLowerCase() === selectedDept.toLowerCase();
    const matchesSearch = req.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          req.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (req.courseCode && req.courseCode.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesDept && matchesSearch;
  });

  const handleCreateRequest = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    wantBoardService.createRequest({
      title: newTitle.trim(),
      author: newAuthor.trim() || 'Author not specified',
      department: newDept,
      courseCode: "GEN101",
      urgency: "High",
      budget: Number(newBudget),
      notes: newNotes.trim() || "Looking for urgent semester copy."
    });

    setShowModal(false);
    setNewTitle('');
    setNewAuthor('');
    setNewNotes('');
  };

  const handleOfferBook = (req) => {
    // Redirect to chat with pre-seeded message
    navigate('/chat');
  };

  return (
    <div className="bg-[#F8F7FF] min-h-screen py-8">
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 space-y-8">
        
        {/* Header Hero Box - Brand Gradient */}
        <div className="relative overflow-hidden bg-gradient-to-r from-[#5B3DE0] via-[#6C4BF4] to-[#8B6FF5] rounded-3xl p-6 sm:p-8 md:p-12 text-white shadow-xl shadow-[#6C4BF4]/15 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          {/* Subtle Ambient Decorative Glows */}
          <div className="absolute -right-16 -top-16 w-72 h-72 rounded-full bg-white/10 blur-2xl pointer-events-none" />
          <div className="absolute right-1/3 -bottom-16 w-56 h-56 rounded-full bg-[#3B25A8]/25 blur-xl pointer-events-none" />

          <div className="space-y-2.5 max-w-xl relative z-10">
            <span className="inline-block bg-white/20 backdrop-blur-md text-white border border-white/30 text-[10px] sm:text-xs font-extrabold uppercase tracking-wider px-3.5 py-1 rounded-full">
              ★ Campus Textbook Request Board
            </span>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-[family-name:var(--font-heading)] leading-tight text-white drop-shadow-xs">
              Can't Find Your Course Book? Post a Request!
            </h1>
            <p className="text-xs sm:text-sm text-white/90 leading-relaxed max-w-lg">
              Students who own the book will receive a notification and can offer it to you for cash, rent, or swap.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap gap-3 w-full sm:w-auto relative z-10">
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center justify-center gap-2 bg-white text-[#6C4BF4] hover:bg-[#F3F0FF] font-bold px-6 py-3.5 rounded-2xl text-sm transition-all hover:scale-[1.02] shadow-lg shadow-black/10 cursor-pointer w-full sm:w-auto"
            >
              <Plus size={18} /> Post a Book Request
            </button>
            <button
              onClick={() => navigate('/sell/isbn')}
              className="inline-flex items-center justify-center gap-2 bg-white/15 hover:bg-white/25 border border-white/30 backdrop-blur-xs text-white font-bold px-5 py-3.5 rounded-2xl text-sm transition-all hover:scale-[1.02] cursor-pointer w-full sm:w-auto"
            >
              Sell a Book Instead
            </button>
          </div>
        </div>

        {/* Filter and Search */}
        <div className="bg-white border border-bookify-border/70 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
          
          {/* Department Pills */}
          <div className="flex bg-gray-100 p-1 rounded-xl gap-1 overflow-x-auto scrollbar-hide">
            {departments.map(dept => {
              const isActive = selectedDept === dept;
              return (
                <button
                  key={dept}
                  onClick={() => setSelectedDept(dept)}
                  className={`px-3.5 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                    isActive
                      ? 'bg-white text-[#6C4BF4] shadow-xs'
                      : 'text-gray-500 hover:text-[#17152A]'
                  }`}
                >
                  {dept}
                </button>
              );
            })}
          </div>

          {/* Search Input */}
          <div className="relative min-w-[280px]">
            <input
              type="text"
              placeholder="Search requested books or courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 bg-[#F8F7FF] focus:bg-white focus:outline-none focus:border-[#6C4BF4] text-xs text-[#17152A]"
            />
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>

        </div>

        {/* Request Cards Grid */}
        {filteredRequests.length === 0 ? (
          <div className="bg-white border border-bookify-border/70 rounded-3xl p-12 text-center shadow-xs space-y-4">
            <div className="w-16 h-16 bg-[#EEEAFE] text-[#6C4BF4] rounded-full flex items-center justify-center mx-auto">
              <BookOpen size={28} />
            </div>
            <h3 className="font-bold text-lg text-[#17152A]">No Requests Found</h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              No students are currently searching for this title. Be the first to post a request!
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-2 bg-[#6C4BF4] text-white font-bold text-xs px-6 py-3 rounded-xl shadow-md shadow-[#6C4BF4]/25 hover:bg-[#5B3DE0] cursor-pointer"
            >
              + Post a Request
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredRequests.map(req => (
              <div
                key={req.id}
                className="bg-white border border-bookify-border/70 rounded-3xl p-6 shadow-xs hover:shadow-md transition flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="bg-[#EEEAFE] text-[#6C4BF4] text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                        {req.department}
                      </span>
                      {req.courseCode && (
                        <span className="bg-gray-100 text-gray-600 text-[10px] font-semibold px-2 py-0.5 rounded-md font-mono">
                          {req.courseCode}
                        </span>
                      )}
                    </div>

                    <span className="text-xs font-extrabold text-[#6C4BF4] bg-purple-50 px-2.5 py-1 rounded-xl border border-purple-100">
                      Budget: ₹{req.budget}
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-[#17152A] font-[family-name:var(--font-heading)] leading-snug">
                    {req.title}
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">by {req.author}</p>

                  <p className="text-xs text-gray-600 mt-3 p-3 bg-[#F8F7FF] rounded-xl border border-gray-200/60 leading-relaxed italic">
                    "{req.notes}"
                  </p>
                </div>

                <div className="pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3 text-[11px] text-gray-400">
                    <span className="flex items-center gap-1">
                      <User size={12} /> {req.requestedBy}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin size={12} className="text-[#6C4BF4]" /> {req.campus}
                    </span>
                  </div>

                  <button
                    onClick={() => handleOfferBook(req)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#6C4BF4] hover:bg-[#5B3DE0] text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer"
                  >
                    <MessageSquare size={14} /> I Have This Book
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal: Post New Request */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
            <div className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full space-y-5 shadow-2xl border border-gray-100">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <h3 className="text-lg font-bold text-[#17152A] font-[family-name:var(--font-heading)]">
                  Post a Book Request
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600 font-bold text-sm cursor-pointer p-1"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateRequest} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                    Book Title & Edition *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Signals and Systems (Oppenheim 2nd Ed)"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-[#F8F7FF] text-xs text-[#17152A]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                      Author
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Alan V. Oppenheim"
                      value={newAuthor}
                      onChange={(e) => setNewAuthor(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-[#F8F7FF] text-xs text-[#17152A]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                      Budget (₹)
                    </label>
                    <input
                      type="number"
                      value={newBudget}
                      onChange={(e) => setNewBudget(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-[#F8F7FF] text-xs text-[#17152A]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                    Department / Branch
                  </label>
                  <select
                    value={newDept}
                    onChange={(e) => setNewDept(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-[#F8F7FF] text-xs text-[#17152A]"
                  >
                    <option value="Computer Science">Computer Science</option>
                    <option value="Mechanical Engineering">Mechanical Engineering</option>
                    <option value="Electronics & Communication">Electronics & Communication</option>
                    <option value="Economics & Commerce">Economics & Commerce</option>
                    <option value="Pre-Med / NEET">Pre-Med / NEET</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                    Notes / Requirements
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Urgently needed before Monday exam. In-person meetup at Library."
                    value={newNotes}
                    onChange={(e) => setNewNotes(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 bg-[#F8F7FF] text-xs text-[#17152A]"
                  />
                </div>

                <div className="flex gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 py-3 border border-gray-200 text-gray-600 font-bold text-xs rounded-xl cursor-pointer hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-[#6C4BF4] hover:bg-[#5B3DE0] text-white font-bold text-xs rounded-xl shadow-md shadow-[#6C4BF4]/25 cursor-pointer"
                  >
                    Submit Request
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
