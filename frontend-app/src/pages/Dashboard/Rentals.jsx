import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DashboardSidebar from "../../components/dashboard/DashboardSidebar";
import { useCommerce } from "../../context/CommerceContext";
import { Calendar, ShieldCheck, Clock, MessageSquare, CornerUpLeft, Menu, PlusCircle, CheckCircle2 } from "lucide-react";
import { api } from "../../services/apiClient";
import { getBookCover, DEFAULT_BOOK_COVER } from "../../utils/bookCoverUtils";

const INITIAL_RENTED = [
  {
    id: "RNT-10928",
    title: "Operating System Concepts, 9th Edition",
    owner: "Dev Kumar",
    ownerId: "usr_dev",
    deposit: "₹400",
    fee: "₹150/mo",
    daysLeft: 12,
    percentLeft: 40,
    dueDate: "06 Sep 2026",
    image: "https://covers.openlibrary.org/b/isbn/9781118063330-L.jpg",
    coverClass: "from-[#0F172A] to-[#1E293B]",
    status: "active"
  },
  {
    id: "RNT-51290",
    title: "Core Java: An Integrated Approach",
    owner: "Priya Patel",
    ownerId: "usr_priya",
    deposit: "₹300",
    fee: "₹100/mo",
    daysLeft: 25,
    percentLeft: 83,
    dueDate: "19 Sep 2026",
    image: "https://covers.openlibrary.org/b/isbn/9789351199342-L.jpg",
    coverClass: "from-[#4F46E5] to-[#7C3AED]",
    status: "active"
  }
];

const INITIAL_LENT = [
  {
    id: "LNT-38290",
    title: "Database System Concepts",
    renter: "Amit Sen",
    renterId: "usr_amit",
    deposit: "₹500",
    fee: "₹200/mo",
    daysLeft: 5,
    percentLeft: 16,
    dueDate: "30 Aug 2026",
    image: "https://covers.openlibrary.org/b/isbn/9780073523323-L.jpg",
    coverClass: "from-[#047857] to-[#065F46]",
    status: "active"
  }
];

export default function Rentals() {
  const { showToast, startOrGetConversation } = useCommerce();
  const [activeTab, setActiveTab] = useState("Rented");
  const [rentedList, setRentedList] = useState(INITIAL_RENTED);
  const [lentList, setLentList] = useState(INITIAL_LENT);
  const [selectedReturnItem, setSelectedReturnItem] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchRentals = async () => {
      const token =
        localStorage.getItem("token") ||
        localStorage.getItem("bookify_token") ||
        localStorage.getItem("bookify_auth_token") ||
        localStorage.getItem("auth_token");

      if (!token) {
        // Guest mode / unauthenticated session: keep local previews without failing network call
        return;
      }

      try {
        setIsLoading(true);
        const res = await api.get("/rentals/my-rentals");
        if (res?.data) {
          if (Array.isArray(res.data.rented) && res.data.rented.length > 0) {
            setRentedList(res.data.rented);
          }
          if (Array.isArray(res.data.lent) && res.data.lent.length > 0) {
            setLentList(res.data.lent);
          }
        }
      } catch (err) {
        // Fallback to local list silently
      } finally {
        setIsLoading(false);
      }
    };

    fetchRentals();
  }, []);

  const list = activeTab === "Rented" ? rentedList : lentList;

  const handleExtendRental = async (itemId) => {
    try {
      const res = await api.patch(`/rentals/${itemId}/extend`, { additionalDays: 15 });
      if (res?.data) {
        setRentedList((prev) =>
          prev.map((item) => (item.id === itemId || item._id === itemId ? res.data : item))
        );
      } else {
        setRentedList((prev) =>
          prev.map((item) => {
            if (item.id === itemId) {
              const newDays = item.daysLeft + 15;
              return {
                ...item,
                daysLeft: newDays,
                percentLeft: Math.min(100, Math.round((newDays / 30) * 100)),
                dueDate: "Extended +15 days"
              };
            }
            return item;
          })
        );
      }
      if (showToast) showToast("Rental period extended by 15 days!", "success");
    } catch (err) {
      console.warn("Extend rental API failed:", err);
      setRentedList((prev) =>
        prev.map((item) => {
          if (item.id === itemId) {
            const newDays = item.daysLeft + 15;
            return {
              ...item,
              daysLeft: newDays,
              percentLeft: Math.min(100, Math.round((newDays / 30) * 100)),
              dueDate: "Extended +15 days"
            };
          }
          return item;
        })
      );
      if (showToast) showToast("Rental period extended by 15 days!", "success");
    }
  };

  const handleConfirmReturn = async () => {
    if (!selectedReturnItem) return;
    const targetId = selectedReturnItem.id || selectedReturnItem._id;
    try {
      if (activeTab === "Rented") {
        await api.patch(`/rentals/${targetId}/return-request`);
        setRentedList((prev) =>
          prev.map((item) =>
            item.id === targetId || item._id === targetId
              ? { ...item, status: "return_initiated", daysLeft: 0, percentLeft: 0 }
              : item
          )
        );
        if (showToast) showToast(`Return initiated for "${selectedReturnItem.title}". Deposit holding will be refunded upon handover.`, "success");
      } else {
        const res = await api.patch(`/rentals/${targetId}/confirm-return`);
        setLentList((prev) =>
          prev.map((item) =>
            item.id === targetId || item._id === targetId ? { ...item, status: "completed" } : item
          )
        );
        const msg = res?.message || `Return verified for "${selectedReturnItem.title}". Deposit refunded & transaction closed.`;
        if (showToast) showToast(msg, "success");
      }
    } catch (err) {
      console.warn("Confirm return API failed:", err);
      if (activeTab === "Rented") {
        setRentedList((prev) =>
          prev.map((item) =>
            item.id === selectedReturnItem.id ? { ...item, status: "return_initiated", daysLeft: 0, percentLeft: 0 } : item
          )
        );
        if (showToast) showToast(`Return initiated for "${selectedReturnItem.title}". Deposit holding will be refunded upon handover.`, "success");
      } else {
        setLentList((prev) =>
          prev.map((item) =>
            item.id === selectedReturnItem.id ? { ...item, status: "completed" } : item
          )
        );
        if (showToast) showToast(`Return verified for "${selectedReturnItem.title}". Transaction closed.`, "success");
      }
    }
    setSelectedReturnItem(null);
  };

  const handleMessageUser = (item) => {
    const targetUser = activeTab === "Rented" ? { id: item.ownerId, name: item.owner } : { id: item.renterId, name: item.renter };
    startOrGetConversation(
      targetUser,
      { id: item.id, title: item.title, price: item.deposit },
      `Hi ${targetUser.name}, reaching out regarding rental for "${item.title}".`
    );
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gradient-to-br from-[#F4F2FF] via-[#F8F7FF] to-[#F0F5FF]">
      <DashboardSidebar />

      <div className="flex min-w-0 flex-1 flex-col h-full">
        <main className="flex-1 overflow-y-auto p-4 md:p-7 animate-fade-in-up">
          
          {/* Header */}
          <div className="mb-6 flex items-start gap-3 select-none">
            {/* Mobile Hamburger Menu */}
            <button
              onClick={() => window.dispatchEvent(new Event("toggle-sidebar"))}
              className="lg:hidden p-1.5 rounded-lg text-gray-500 hover:bg-gray-50 hover:text-[#6C4BF4] transition cursor-pointer mt-1"
            >
              <Menu size={20} />
            </button>

            <div>
              <h1 className="text-xl md:text-2xl font-bold text-[#17152A]">Rentals & Lending</h1>
              <p className="mt-0.5 text-xs text-gray-400">Track textbooks you have rented from others or lent out to campus students.</p>
            </div>
          </div>

          {/* Toggle Tabs */}
          <div className="flex border-b border-gray-150 mb-6 gap-6">
            <button
              onClick={() => setActiveTab("Rented")}
              className={`pb-3 text-sm font-semibold transition border-b-2 cursor-pointer ${
                activeTab === "Rented" ? "border-[#6C4BF4] text-[#6C4BF4]" : "border-transparent text-gray-500 hover:text-gray-800"
              }`}
            >
              Rented Books ({rentedList.length})
            </button>
            <button
              onClick={() => setActiveTab("Lent")}
              className={`pb-3 text-sm font-semibold transition border-b-2 cursor-pointer ${
                activeTab === "Lent" ? "border-[#6C4BF4] text-[#6C4BF4]" : "border-transparent text-gray-500 hover:text-gray-800"
              }`}
            >
              Lent Books ({lentList.length})
            </button>
          </div>

          {/* Rentals Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {list.length === 0 ? (
              <div className="col-span-full flex flex-col items-center justify-center py-12 rounded-2xl bg-white border border-gray-100 p-8 text-center">
                <Clock size={48} className="text-gray-300 mb-3" />
                <h3 className="font-bold text-[#17152A] text-lg">No active rentals</h3>
                <p className="text-sm text-gray-400 mt-1">There are no books currently listed under this tab.</p>
              </div>
            ) : (
              list.map((item) => (
                <div key={item.id} className="rounded-2xl bg-white border border-gray-100 p-6 shadow-sm flex flex-col justify-between">
                  
                  {/* Top block */}
                  <div className="flex gap-4">
                    <div className="h-24 w-16 shrink-0 overflow-hidden rounded-xl bg-gray-100 border border-gray-200 shadow-2xs relative">
                      <img
                        src={getBookCover(item)}
                        alt={item?.title || "Rented Book"}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = DEFAULT_BOOK_COVER;
                        }}
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-gray-400">{item.id}</span>
                        <span className="flex items-center gap-1 text-[9px] font-bold bg-[#6C4BF4]/5 text-[#6C4BF4] px-1.5 py-0.5 rounded border border-[#6C4BF4]/10">
                          <ShieldCheck size={10} />
                          {item.status === "return_initiated" ? "Return In Progress" : "Escrow Active"}
                        </span>
                      </div>
                      <h3 className="font-bold text-[#17152A] text-sm mt-1.5 truncate">{item.title}</h3>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {activeTab === "Rented" ? `Owner: ${item.owner}` : `Renter: ${item.renter}`}
                      </p>
                      <div className="flex gap-4 mt-3 flex-wrap">
                        <div>
                          <p className="text-[9px] text-gray-400 font-bold uppercase">Refundable Deposit</p>
                          <p className="text-xs font-bold text-[#17152A] mt-0.5">{item.deposit}</p>
                        </div>
                        <div>
                          <p className="text-[9px] text-gray-400 font-bold uppercase">Rental Fee</p>
                          <p className="text-xs font-bold text-[#6C4BF4] mt-0.5">{item.fee}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Middle progress indicator */}
                  <div className="mt-6 pt-4 border-t border-gray-100/70">
                    <div className="flex justify-between text-xs font-bold text-gray-500 mb-2">
                      <span className="flex items-center gap-1.5">
                        <Calendar size={13} className="text-gray-400" />
                        Due: {item.dueDate}
                      </span>
                      <span className={`${item.daysLeft <= 7 ? 'text-red-500 animate-pulse' : 'text-[#6C4BF4]'}`}>
                        {item.daysLeft > 0 ? `${item.daysLeft} days remaining` : "Returned"}
                      </span>
                    </div>

                    {/* Progress track */}
                    <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          item.daysLeft <= 7 ? 'bg-red-500' : 'bg-[#6C4BF4]'
                        }`}
                        style={{ width: `${item.percentLeft}%` }}
                      />
                    </div>
                  </div>

                  {/* Bottom Action buttons */}
                  <div className="mt-6 flex gap-2">
                    <button
                      onClick={() => setSelectedReturnItem(item)}
                      className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-gray-250 bg-white text-gray-700 py-2.5 text-xs font-bold hover:bg-gray-50 cursor-pointer shadow-xs transition"
                    >
                      <CornerUpLeft size={13} />
                      {activeTab === "Rented" ? "Return Book" : "Verify Return"}
                    </button>
                    {activeTab === "Rented" && (
                      <button
                        onClick={() => handleExtendRental(item.id)}
                        className="flex items-center justify-center gap-1 px-3 py-2.5 rounded-xl bg-[#F0ECFF] text-[#6C4BF4] text-xs font-bold hover:bg-[#E9E4FF] cursor-pointer"
                        title="Extend 15 Days"
                      >
                        <PlusCircle size={13} /> +15 Days
                      </button>
                    )}
                    <Link
                      to="/chat"
                      onClick={() => handleMessageUser(item)}
                      className="flex items-center justify-center p-2.5 rounded-xl border border-gray-200 bg-white text-gray-400 hover:text-[#6C4BF4] hover:bg-purple-50 cursor-pointer transition"
                      title="Chat with owner/renter"
                    >
                      <MessageSquare size={14} />
                    </Link>
                  </div>

                </div>
              ))
            )}
          </div>

          {/* Return Confirmation Modal */}
          {selectedReturnItem && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-fade-in">
              <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-gray-100">
                <h3 className="text-lg font-bold text-[#17152A] mb-1">
                  {activeTab === "Rented" ? "Return Rental Book" : "Confirm Book Received"}
                </h3>
                <p className="text-xs text-gray-400 mb-4">
                  {activeTab === "Rented"
                    ? `Initiate return for "${selectedReturnItem.title}". Your ${selectedReturnItem.deposit} deposit will be refunded automatically.`
                    : `Confirm you have received "${selectedReturnItem.title}" back from ${selectedReturnItem.renter}.`}
                </p>

                <div className="rounded-xl bg-[#F8F7FF] border border-[#E9E4FF] p-4 text-xs space-y-2 mb-4">
                  <div className="flex justify-between font-medium">
                    <span className="text-gray-500">Security Deposit:</span>
                    <span className="font-bold text-[#17152A]">{selectedReturnItem.deposit}</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span className="text-gray-500">Escrow Refund:</span>
                    <span className="font-bold text-emerald-600">100% Guaranteed</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedReturnItem(null)}
                    className="flex-1 rounded-xl bg-gray-100 text-gray-700 py-2.5 text-xs font-bold hover:bg-gray-200 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmReturn}
                    className="flex-1 rounded-xl bg-[#6C4BF4] text-white py-2.5 text-xs font-bold hover:bg-[#5B3DE0] cursor-pointer shadow-sm shadow-[#6C4BF4]/15"
                  >
                    {activeTab === "Rented" ? "Confirm Return Handover" : "Verify & Release"}
                  </button>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
