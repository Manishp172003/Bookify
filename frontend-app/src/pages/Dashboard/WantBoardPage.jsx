import { useState } from "react";
import DashboardSidebar from "../../components/dashboard/DashboardSidebar";
import { Lightbulb, Book, MessageSquare, Menu } from "lucide-react";

const INITIAL_BOARD_REQUESTS = [
  {
    id: "REQ-002",
    title: "Operating System Concepts, 10th Edition",
    author: "Abraham Silberschatz",
    expectedPrice: "₹400 - ₹500",
    urgency: "High Urgency",
    urgencyColor: "text-red-600 bg-red-50 border-red-100 animate-pulse",
    requester: "Rohan Gupta",
    date: "Posted 1 day ago",
    details: "Required for CS-302 semester. Can meet near hostel block 3."
  },
  {
    id: "REQ-003",
    title: "Concepts of Physics Vol 2",
    author: "H.C. Verma",
    expectedPrice: "₹200 - ₹300",
    urgency: "Medium Urgency",
    urgencyColor: "text-amber-600 bg-amber-50 border-amber-100",
    requester: "Sneha Reddy",
    date: "Posted 3 days ago",
    details: "Preferably unmarked copy. Need to buy before exam week."
  }
];

const INITIAL_MY_REQUESTS = [
  {
    id: "REQ-001",
    title: "Introduction to Algorithms, 3rd Edition",
    author: "Thomas H. Cormen",
    expectedPrice: "₹500 - ₹600",
    urgency: "Low Urgency",
    urgencyColor: "text-gray-500 bg-gray-50 border-gray-100",
    requester: "Me",
    date: "Posted 5 days ago",
    details: "Urgent need for algorithmic homework reference."
  }
];

export default function WantBoardPage() {
  const [boardRequests] = useState(INITIAL_BOARD_REQUESTS);
  const [myRequests, setMyRequests] = useState(INITIAL_MY_REQUESTS);
  
  const [activeTab, setActiveTab] = useState("Browse");
  const [showRequestForm, setShowRequestForm] = useState(false);

  // New Request Form Fields
  const [newTitle, setNewTitle] = useState("");
  const [newAuthor, setNewAuthor] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newUrgency, setNewUrgency] = useState("Medium Urgency");
  const [newDetails, setNewDetails] = useState("");

  const handlePostRequest = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const request = {
      id: `REQ-${Math.floor(100 + Math.random() * 900)}`,
      title: newTitle,
      author: newAuthor || "Unknown Author",
      expectedPrice: newPrice || "₹300 - ₹500",
      urgency: newUrgency,
      urgencyColor: newUrgency === "High Urgency" 
        ? "text-red-600 bg-red-50 border-red-100 animate-pulse" 
        : newUrgency === "Medium Urgency"
          ? "text-amber-600 bg-amber-50 border-amber-100"
          : "text-gray-500 bg-gray-50 border-gray-100",
      requester: "Me",
      date: "Posted Just Now",
      details: newDetails || "No additional notes."
    };

    setMyRequests([request, ...myRequests]);
    setNewTitle("");
    setNewAuthor("");
    setNewPrice("");
    setNewUrgency("Medium Urgency");
    setNewDetails("");
    setShowRequestForm(false);
    setActiveTab("MyRequests");
    alert("Book request posted to Want Board successfully!");
  };

  const handleFulfillOffer = (req) => {
    alert(`Offering book to ${req.requester} for ${req.title}. Opening chat conversation...`);
  };

  const list = activeTab === "Browse" ? boardRequests : myRequests;

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gradient-to-br from-[#F4F2FF] via-[#F8F7FF] to-[#F0F5FF]">
      <DashboardSidebar />

      <div className="flex min-w-0 flex-1 flex-col h-full">
        <main className="flex-1 overflow-y-auto p-4 md:p-7 animate-fade-in-up">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 select-none">
            <div className="flex items-start gap-3">
              {/* Mobile Hamburger Menu */}
              <button
                onClick={() => window.dispatchEvent(new Event("toggle-sidebar"))}
                className="lg:hidden p-1.5 rounded-lg text-gray-500 hover:bg-gray-50 hover:text-[#6C4BF4] transition cursor-pointer mt-1"
              >
                <Menu size={20} />
              </button>
              
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-[#17152A]">Want Board</h1>
                <p className="mt-0.5 text-xs text-gray-400">Can't find a book in the market? Post a request here, or fulfill other students' requests.</p>
              </div>
            </div>
            <button
              onClick={() => setShowRequestForm(true)}
              className="bg-[#6C4BF4] hover:bg-[#5B3DE0] text-white font-bold px-5 py-2.5 rounded-xl text-xs transition cursor-pointer shadow-sm shadow-[#6C4BF4]/15"
            >
              + Post Book Request
            </button>
          </div>

          {/* Toggle Tabs */}
          <div className="flex border-b border-gray-150 mb-6 gap-6">
            <button
              onClick={() => setActiveTab("Browse")}
              className={`pb-3 text-sm font-semibold transition border-b-2 cursor-pointer ${
                activeTab === "Browse" ? "border-[#6C4BF4] text-[#6C4BF4]" : "border-transparent text-gray-500 hover:text-gray-800"
              }`}
            >
              Marketplace Requests ({boardRequests.length})
            </button>
            <button
              onClick={() => setActiveTab("MyRequests")}
              className={`pb-3 text-sm font-semibold transition border-b-2 cursor-pointer ${
                activeTab === "MyRequests" ? "border-[#6C4BF4] text-[#6C4BF4]" : "border-transparent text-gray-500 hover:text-gray-800"
              }`}
            >
              My Requests ({myRequests.length})
            </button>
          </div>

          {/* Requests stack */}
          <div className="space-y-4">
            {list.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 rounded-2xl bg-white border border-gray-100 p-8 text-center">
                <Lightbulb size={48} className="text-gray-300 mb-3" />
                <h3 className="font-bold text-[#17152A] text-lg">No active requests</h3>
                <p className="text-sm text-gray-400 mt-1">There are no requests listed under this tab currently.</p>
              </div>
            ) : (
              list.map((req) => (
                <div key={req.id} className="rounded-2xl bg-white border border-gray-100 p-6 shadow-sm flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
                  
                  {/* Left Column Info */}
                  <div className="flex gap-4 items-start min-w-0 flex-1">
                    <div className="h-10 w-10 rounded-xl bg-[#6C4BF4]/5 text-[#6C4BF4] flex items-center justify-center shrink-0 border border-[#6C4BF4]/10">
                      <Book size={18} />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-bold text-gray-400">{req.id}</span>
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${req.urgencyColor}`}>
                          {req.urgency}
                        </span>
                        <span className="text-[10px] text-gray-400">{req.date}</span>
                      </div>
                      <h3 className="font-bold text-[#17152A] text-sm mt-1.5">{req.title}</h3>
                      <p className="text-xs text-gray-400 mt-0.5">Author: {req.author}</p>
                      <p className="text-xs text-gray-500 mt-2 bg-gray-50 p-2.5 rounded-xl border border-gray-100/50 leading-relaxed font-medium">
                        "{req.details}"
                      </p>
                    </div>
                  </div>

                  {/* Right Column details & action */}
                  <div className="flex flex-row md:flex-col items-start md:items-end justify-between md:justify-center gap-4 shrink-0 w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-gray-100">
                    <div className="text-left md:text-right">
                      <p className="text-[9px] text-gray-400 font-bold uppercase">Expected Price</p>
                      <p className="text-xs font-bold text-[#6C4BF4] mt-0.5">{req.expectedPrice}</p>
                      {activeTab === "Browse" && (
                        <p className="text-[10px] text-gray-400 mt-0.5 font-medium">By: {req.requester}</p>
                      )}
                    </div>

                    {activeTab === "Browse" ? (
                      <button
                        onClick={() => handleFulfillOffer(req)}
                        className="flex items-center gap-1 bg-[#6C4BF4] hover:bg-[#5B3DE0] text-white font-bold px-4 py-2 rounded-xl text-xs transition cursor-pointer shadow-sm shadow-[#6C4BF4]/15"
                      >
                        <MessageSquare size={13} />
                        I Have This Book
                      </button>
                    ) : (
                      <button
                        onClick={() => setMyRequests(prev => prev.filter(r => r.id !== req.id))}
                        className="flex items-center gap-1 border border-red-200 text-red-500 hover:bg-red-50 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer"
                      >
                        Delete Request
                      </button>
                    )}
                  </div>

                </div>
              ))
            )}
          </div>

          {/* New Request Modal Form */}
          {showRequestForm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-fade-in">
              <form onSubmit={handlePostRequest} className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-gray-100">
                <h3 className="text-lg font-bold text-[#17152A] mb-1">Post Textbook Request</h3>
                <p className="text-xs text-gray-400 mb-4">Request a textbook other students might have to sell or lend.</p>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] text-gray-400 font-bold uppercase block mb-1">Book Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Operating System Concepts"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-xs text-[#17152A] outline-none focus:border-[#6C4BF4]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] text-gray-400 font-bold uppercase block mb-1">Author</label>
                      <input
                        type="text"
                        placeholder="e.g. Silberschatz"
                        value={newAuthor}
                        onChange={(e) => setNewAuthor(e.target.value)}
                        className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-xs text-[#17152A] outline-none focus:border-[#6C4BF4]"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-gray-400 font-bold uppercase block mb-1">Budget Range (₹)</label>
                      <input
                        type="text"
                        placeholder="e.g. ₹300 - ₹500"
                        value={newPrice}
                        onChange={(e) => setNewPrice(e.target.value)}
                        className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-xs text-[#17152A] outline-none focus:border-[#6C4BF4]"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-400 font-bold uppercase block mb-1">Urgency</label>
                    <select
                      value={newUrgency}
                      onChange={(e) => setNewUrgency(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-xs text-[#17152A] outline-none focus:border-[#6C4BF4]"
                    >
                      <option value="Low Urgency">Low Urgency (Reference)</option>
                      <option value="Medium Urgency">Medium Urgency (Upcoming Classes)</option>
                      <option value="High Urgency">High Urgency (Exam Preparation)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-400 font-bold uppercase block mb-1">Additional details</label>
                    <textarea
                      placeholder="e.g. Need the Indian edition with code. Can meet in Canteen."
                      value={newDetails}
                      onChange={(e) => setNewDetails(e.target.value)}
                      rows="3"
                      className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-xs text-[#17152A] outline-none focus:border-[#6C4BF4] resize-none"
                    />
                  </div>
                </div>

                <div className="mt-6 flex gap-2">
                  <button
                    type="submit"
                    className="flex-grow rounded-xl bg-[#6C4BF4] text-white py-3 text-xs font-bold hover:bg-[#5B3DE0] cursor-pointer"
                  >
                    Post Request
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowRequestForm(false)}
                    className="rounded-xl border border-gray-200 text-gray-500 px-5 py-3 text-xs font-bold hover:bg-gray-55 cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
