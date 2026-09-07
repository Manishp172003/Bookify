import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import DashboardSidebar from "../../components/dashboard/DashboardSidebar";
import { wantBoardService } from "../../services/wantBoardService";
import { 
  Lightbulb, 
  Book, 
  MessageSquare, 
  Menu, 
  Trash2, 
  ExternalLink, 
  CheckCircle2, 
  Clock, 
  Plus, 
  Search, 
  Sparkles 
} from "lucide-react";

export default function WantBoardPage() {
  const navigate = useNavigate();
  const [boardRequests, setBoardRequests] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  
  // Default to student's own requests inside their dashboard
  const [activeTab, setActiveTab] = useState("MyRequests");
  const [showRequestForm, setShowRequestForm] = useState(false);

  // New Request Form Fields
  const [newTitle, setNewTitle] = useState("");
  const [newAuthor, setNewAuthor] = useState("");
  const [newDept, setNewDept] = useState("Computer Science");
  const [newPrice, setNewPrice] = useState("");
  const [newUrgency, setNewUrgency] = useState("High Urgency");
  const [newDetails, setNewDetails] = useState("");

  const loadRequests = () => {
    setBoardRequests(wantBoardService.getBrowseRequests());
    setMyRequests(wantBoardService.getMyRequests());
  };

  useEffect(() => {
    loadRequests();
    window.addEventListener("bookify_want_board_updated", loadRequests);
    return () => window.removeEventListener("bookify_want_board_updated", loadRequests);
  }, []);

  const handlePostRequest = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    wantBoardService.createRequest({
      title: newTitle,
      author: newAuthor || "Unknown Author",
      department: newDept,
      expectedPrice: newPrice || "₹300 - ₹500",
      urgency: newUrgency,
      notes: newDetails || "No additional notes."
    });

    setNewTitle("");
    setNewAuthor("");
    setNewPrice("");
    setNewUrgency("High Urgency");
    setNewDetails("");
    setShowRequestForm(false);
    setActiveTab("MyRequests");
  };

  const handleFulfillOffer = (req) => {
    navigate("/chat");
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this book request?")) {
      wantBoardService.deleteRequest(id);
    }
  };

  const handleToggleFulfilled = (id) => {
    wantBoardService.markFulfilled(id);
  };

  const list = activeTab === "MyRequests" ? myRequests : boardRequests;

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gradient-to-br from-[#F4F2FF] via-[#F8F7FF] to-[#F0F5FF]">
      <DashboardSidebar />

      <div className="flex min-w-0 flex-1 flex-col h-full">
        <main className="flex-1 overflow-y-auto p-4 md:p-7 animate-fade-in-up space-y-6">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 select-none">
            <div className="flex items-start gap-3">
              {/* Mobile Hamburger Menu */}
              <button
                onClick={() => window.dispatchEvent(new Event("toggle-sidebar"))}
                className="lg:hidden p-1.5 rounded-lg text-gray-500 hover:bg-gray-50 hover:text-[#6C4BF4] transition cursor-pointer mt-1"
              >
                <Menu size={20} />
              </button>
              
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-[#17152A]">Want Board Manager</h1>
                <p className="mt-0.5 text-xs text-gray-400">
                  Manage the textbook requests you posted and respond to peer inquiries on campus.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link
                to="/want-board"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-200 text-gray-700 hover:text-[#6C4BF4] hover:border-[#6C4BF4] text-xs font-bold rounded-xl transition shadow-2xs"
              >
                Public Board <ExternalLink size={13} />
              </Link>
              
              <button
                onClick={() => setShowRequestForm(true)}
                className="inline-flex items-center gap-1.5 bg-[#6C4BF4] hover:bg-[#5B3DE0] text-white font-bold px-4 py-2 rounded-xl text-xs transition cursor-pointer shadow-sm shadow-[#6C4BF4]/20"
              >
                <Plus size={14} /> Post Book Request
              </button>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white border border-bookify-border/70 rounded-2xl p-4 shadow-xs">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">My Active Requests</span>
              <div className="text-xl font-extrabold text-[#6C4BF4] mt-0.5">
                {myRequests.filter(r => r.status === 'Open').length}
              </div>
              <p className="text-[10px] text-gray-400 mt-0.5">Open on campus marketplace</p>
            </div>

            <div className="bg-white border border-bookify-border/70 rounded-2xl p-4 shadow-xs">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Fulfilled / Found</span>
              <div className="text-xl font-extrabold text-emerald-600 mt-0.5">
                {myRequests.filter(r => r.status === 'Fulfilled').length}
              </div>
              <p className="text-[10px] text-gray-400 mt-0.5">Resolved semester books</p>
            </div>

            <div className="bg-white border border-bookify-border/70 rounded-2xl p-4 shadow-xs">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Campus Peer Requests</span>
              <div className="text-xl font-extrabold text-[#17152A] mt-0.5">
                {boardRequests.length}
              </div>
              <p className="text-[10px] text-gray-400 mt-0.5">Other students looking for books</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200/80 gap-6">
            <button
              onClick={() => setActiveTab("MyRequests")}
              className={`pb-3 text-xs font-bold transition border-b-2 flex items-center gap-2 cursor-pointer ${
                activeTab === "MyRequests"
                  ? "border-[#6C4BF4] text-[#6C4BF4]"
                  : "border-transparent text-gray-400 hover:text-gray-600"
              }`}
            >
              <span>My Posted Requests</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                activeTab === "MyRequests" ? "bg-[#EEEAFE] text-[#6C4BF4]" : "bg-gray-100 text-gray-500"
              }`}>
                {myRequests.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("Browse")}
              className={`pb-3 text-xs font-bold transition border-b-2 flex items-center gap-2 cursor-pointer ${
                activeTab === "Browse"
                  ? "border-[#6C4BF4] text-[#6C4BF4]"
                  : "border-transparent text-gray-400 hover:text-gray-600"
              }`}
            >
              <span>Campus Feed Preview</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                activeTab === "Browse" ? "bg-[#EEEAFE] text-[#6C4BF4]" : "bg-gray-100 text-gray-500"
              }`}>
                {boardRequests.length}
              </span>
            </button>
          </div>

          {/* Content List */}
          {list.length === 0 ? (
            <div className="bg-white border border-bookify-border/70 rounded-3xl p-10 text-center shadow-xs space-y-3">
              <div className="w-14 h-14 bg-[#EEEAFE] text-[#6C4BF4] rounded-2xl flex items-center justify-center mx-auto">
                <Book size={24} />
              </div>
              <h3 className="font-bold text-base text-[#17152A]">No Requests in this tab</h3>
              <p className="text-xs text-gray-400 max-w-sm mx-auto">
                {activeTab === "MyRequests"
                  ? "You haven't posted any book requests yet. Post one to notify classmates!"
                  : "No open campus requests currently."}
              </p>
              {activeTab === "MyRequests" && (
                <button
                  onClick={() => setShowRequestForm(true)}
                  className="px-5 py-2.5 bg-[#6C4BF4] text-white text-xs font-bold rounded-xl shadow-xs hover:bg-[#5B3DE0] cursor-pointer"
                >
                  + Post a Request Now
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {list.map((req) => (
                <div
                  key={req.id}
                  className="bg-white border border-bookify-border/70 rounded-3xl p-5 shadow-xs hover:shadow-md transition flex flex-col justify-between space-y-3"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          req.status === 'Fulfilled' 
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-purple-50 text-[#6C4BF4] border border-purple-100'
                        }`}>
                          {req.status}
                        </span>
                        <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-md border border-red-100">
                          {req.urgency}
                        </span>
                      </div>
                      <span className="text-xs font-extrabold text-[#6C4BF4]">
                        Budget: {req.expectedPrice || `₹${req.budget}`}
                      </span>
                    </div>

                    <h3 className="font-bold text-sm text-[#17152A] leading-snug line-clamp-2">
                      {req.title}
                    </h3>
                    <p className="text-xs text-gray-500">by {req.author}</p>

                    <p className="text-xs text-gray-600 mt-2.5 p-2.5 bg-[#F8F7FF] rounded-xl border border-gray-200/60 leading-relaxed italic">
                      "{req.notes || req.details}"
                    </p>
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-gray-400">
                      {req.date} {req.campus ? `• ${req.campus}` : ''}
                    </span>

                    {activeTab === "MyRequests" ? (
                      <div className="flex items-center gap-2">
                        {req.status !== 'Fulfilled' && (
                          <button
                            onClick={() => handleToggleFulfilled(req.id)}
                            className="px-2.5 py-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-200 transition cursor-pointer"
                          >
                            Mark Found ✓
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(req.id)}
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition cursor-pointer"
                          title="Delete Request"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleFulfillOffer(req)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#6C4BF4] hover:bg-[#5B3DE0] text-white font-bold text-xs rounded-xl shadow-2xs transition cursor-pointer"
                      >
                        <MessageSquare size={12} /> Offer Book
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Modal: Post New Request */}
          {showRequestForm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
              <div className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full space-y-4 shadow-2xl border border-gray-100">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <h3 className="text-base font-bold text-[#17152A]">
                    Post a Textbook Request
                  </h3>
                  <button
                    onClick={() => setShowRequestForm(false)}
                    className="text-gray-400 hover:text-gray-600 font-bold text-sm cursor-pointer p-1"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handlePostRequest} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                      Book Title & Edition *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Operating System Concepts, 10th Edition"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-[#F8F7FF] text-xs text-[#17152A] focus:bg-white focus:outline-none focus:border-[#6C4BF4]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                        Author
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Silberschatz"
                        value={newAuthor}
                        onChange={(e) => setNewAuthor(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-[#F8F7FF] text-xs text-[#17152A] focus:bg-white focus:outline-none focus:border-[#6C4BF4]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                        Budget Range (₹)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. ₹400 - ₹500"
                        value={newPrice}
                        onChange={(e) => setNewPrice(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-[#F8F7FF] text-xs text-[#17152A] focus:bg-white focus:outline-none focus:border-[#6C4BF4]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                        Department
                      </label>
                      <select
                        value={newDept}
                        onChange={(e) => setNewDept(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-[#F8F7FF] text-xs text-[#17152A] focus:bg-white focus:outline-none focus:border-[#6C4BF4]"
                      >
                        <option value="Computer Science">Computer Science</option>
                        <option value="Mechanical Engineering">Mechanical</option>
                        <option value="Economics & Commerce">Economics</option>
                        <option value="Pre-Med / NEET">Pre-Med</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                        Urgency
                      </label>
                      <select
                        value={newUrgency}
                        onChange={(e) => setNewUrgency(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-[#F8F7FF] text-xs text-[#17152A] focus:bg-white focus:outline-none focus:border-[#6C4BF4]"
                      >
                        <option value="High Urgency">High Urgency (Exam)</option>
                        <option value="Medium Urgency">Medium Urgency</option>
                        <option value="Low Urgency">Low Urgency</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                      Notes / Handshake Location
                    </label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Can meet in Canteen or Library after 4 PM."
                      value={newDetails}
                      onChange={(e) => setNewDetails(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-gray-200 bg-[#F8F7FF] text-xs text-[#17152A] focus:bg-white focus:outline-none focus:border-[#6C4BF4]"
                    />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowRequestForm(false)}
                      className="flex-1 py-2.5 border border-gray-200 text-gray-600 font-bold text-xs rounded-xl cursor-pointer hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2.5 bg-[#6C4BF4] hover:bg-[#5B3DE0] text-white font-bold text-xs rounded-xl shadow-md shadow-[#6C4BF4]/20 cursor-pointer"
                    >
                      Post Request
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
