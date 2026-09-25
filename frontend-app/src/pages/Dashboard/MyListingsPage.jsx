import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import DashboardSidebar from '../../components/dashboard/DashboardSidebar';
import { useCommerce } from '../../context/CommerceContext';
import { listingService } from '../../services/listingService';
import { getBookCover, DEFAULT_BOOK_COVER } from '../../utils/bookCoverUtils';
import { Edit2, Trash2, CheckCircle2, TrendingUp, Heart, BookOpen, Menu, Plus, Package, AlertCircle, X, Save } from 'lucide-react';

export default function MyListingsPage() {
  const navigate = useNavigate();
  const { orders, showToast } = useCommerce();
  const [listings, setListings] = useState(() => listingService.getAllListings());
  const [activeFilter, setActiveFilter] = useState('All');
  const [editingListing, setEditingListing] = useState(null);
  const [editForm, setEditForm] = useState({
    price: '',
    mrp: '',
    condition: 'good',
    status: 'Active',
    conditionNotes: '',
    cover: '',
  });

  const pendingOrdersCount = (orders || []).filter(
    (o) => o.isSellerOrder && (o.status === 'placed' || o.status === 'Placed')
  ).length;

  const reloadListings = () => {
    setListings(listingService.getAllListings());
  };

  useEffect(() => {
    reloadListings();
    window.addEventListener('bookify_user_listings_updated', reloadListings);
    return () => window.removeEventListener('bookify_user_listings_updated', reloadListings);
  }, []);

  const handleMarkSold = (id) => {
    listingService.updateStatus(id, 'Sold');
    if (showToast) showToast('Listing marked as sold!', 'success');
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this listing?")) {
      listingService.deleteListing(id);
      if (showToast) showToast('Listing deleted successfully', 'info');
    }
  };

  const handleEdit = (item) => {
    setEditingListing(item);
    setEditForm({
      price: item.price || '',
      mrp: item.mrp || '',
      condition: item.condition || 'good',
      status: item.status || 'Active',
      conditionNotes: item.conditionNotes || '',
      cover: getBookCover(item),
    });
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editingListing) return;
    if (!editForm.price || Number(editForm.price) <= 0) {
      alert("Please enter a valid price");
      return;
    }

    listingService.updateListing(editingListing.id, {
      price: Number(editForm.price),
      mrp: editForm.mrp ? Number(editForm.mrp) : undefined,
      condition: editForm.condition,
      status: editForm.status,
      conditionNotes: editForm.conditionNotes,
      cover: editForm.cover,
    });

    if (showToast) {
      showToast(`Listing ${editingListing.id} updated successfully!`, 'success');
    }
    setEditingListing(null);
  };

  // Filter listings
  const filteredListings = listings.filter(item => {
    if (activeFilter === 'All') return true;
    return item.status.toLowerCase() === activeFilter.toLowerCase();
  });

  const getStatusBadgeClass = (status) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-50 text-green-700 border-green-100';
      case 'sold':
        return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'inactive':
        return 'bg-amber-50 text-amber-700 border-amber-100';
      default:
        return 'bg-gray-50 text-gray-600 border-gray-100';
    }
  };

  const getFilterCount = (filterName) => {
    if (filterName === 'All') return listings.length;
    return listings.filter(item => item.status.toLowerCase() === filterName.toLowerCase()).length;
  };

  const filterTabs = ['All', 'Active', 'Sold', 'Inactive'];

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
                <h1 className="text-xl md:text-2xl font-bold text-[#17152A]">My Listings</h1>
                <p className="mt-0.5 text-xs text-gray-400">Manage your textbook listings, track sales status, and adjust prices.</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/sell')}
              className="bg-[#6C4BF4] hover:bg-[#5B3DE0] text-white font-bold px-5 py-2.5 rounded-xl text-xs transition cursor-pointer shadow-sm shadow-[#6C4BF4]/15"
            >
              + Create New Listing
            </button>
          </div>

          {/* Pending Seller Confirmation Banner */}
          {pendingOrdersCount > 0 && (
            <div className="mb-6 rounded-2xl bg-amber-50 border border-amber-200 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-in">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                  <Package size={20} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-amber-900">
                    {pendingOrdersCount} Order{pendingOrdersCount > 1 ? "s" : ""} Awaiting Your Confirmation!
                  </h4>
                  <p className="text-[11px] text-amber-700 mt-0.5">
                    A peer has purchased a textbook from your listings. Confirm availability to prepare the package and dispatch via courier.
                  </p>
                </div>
              </div>

              <Link
                to="/dashboard/orders"
                className="shrink-0 rounded-xl bg-[#6C4BF4] px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#5B3DE0] transition cursor-pointer text-center"
              >
                Fulfill & Confirm Orders ➡️
              </Link>
            </div>
          )}

          {/* Filter Tabs */}
          <div className="flex border-b border-gray-150 mb-6 gap-6 overflow-x-auto scrollbar-none">
            {filterTabs.map(tab => {
              const isActive = activeFilter === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveFilter(tab)}
                  className={`pb-3 text-sm font-semibold transition border-b-2 shrink-0 cursor-pointer flex items-center gap-2 ${
                    isActive
                      ? 'border-[#6C4BF4] text-[#6C4BF4] font-bold'
                      : 'border-transparent text-gray-500 hover:text-gray-800'
                  }`}
                >
                  {tab}
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                    isActive ? 'bg-[#6C4BF4] text-white' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {getFilterCount(tab)}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Listings Stack */}
          <div className="space-y-4">
            {filteredListings.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 rounded-2xl bg-white border border-gray-100 p-8 text-center">
                <BookOpen size={48} className="text-gray-300 mb-3" />
                <h3 className="font-bold text-[#17152A] text-lg">No listings found</h3>
                <p className="text-sm text-gray-400 mt-1">Try creating a new listing to start selling!</p>
              </div>
            ) : (
              filteredListings.map(item => (
                <div key={item.id} className="rounded-2xl bg-white border border-gray-100 p-5 shadow-sm flex flex-col lg:flex-row gap-6 justify-between items-start lg:items-center">
                  
                  {/* Left block: info */}
                  <div className="flex gap-4 min-w-0">
                    <div className="h-20 w-15 shrink-0 overflow-hidden rounded-xl bg-gray-100 border border-gray-200 shadow-2xs relative">
                      <img
                        src={getBookCover(item)}
                        alt={item.title}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = DEFAULT_BOOK_COVER;
                        }}
                      />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-bold text-gray-400">{item.id}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getStatusBadgeClass(item.status)}`}>
                          {item.status}
                        </span>
                        <span className="text-[10px] font-semibold text-gray-500">{item.condition}</span>
                      </div>
                      <h3 className="font-bold text-[#17152A] text-sm mt-1.5 truncate">{item.title}</h3>
                      <p className="text-xs font-bold text-[#6C4BF4] mt-1">
                        {typeof item.price === "number" ? `₹${item.price}` : String(item.price).startsWith("₹") ? item.price : `₹${item.price}`}
                      </p>
                    </div>
                  </div>

                  {/* Middle block: analytics */}
                  <div className="flex items-center gap-6 bg-gray-50/50 rounded-xl px-4 py-2.5 border border-gray-100/50 w-full lg:w-auto justify-around lg:justify-start">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-gray-500">
                        <TrendingUp size={14} />
                        <span className="text-xs font-bold text-[#17152A]">{item.views}</span>
                      </div>
                      <p className="text-[9px] font-semibold text-gray-400 mt-0.5">Views</p>
                    </div>
                    
                    <div className="h-6 w-px bg-gray-200" />
                    
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-gray-500">
                        <Heart size={14} className="text-red-500 fill-red-500" />
                        <span className="text-xs font-bold text-[#17152A]">{item.wishlists}</span>
                      </div>
                      <p className="text-[9px] font-semibold text-gray-400 mt-0.5">Saves</p>
                    </div>
                  </div>

                  {/* Right block: Action controls */}
                  <div className="flex gap-2 w-full lg:w-auto">
                    {item.status === 'Active' && (
                      <button
                        onClick={() => handleMarkSold(item.id)}
                        className="flex-1 lg:flex-initial flex items-center justify-center gap-1.5 rounded-xl bg-green-50 border border-green-200 text-green-700 px-4 py-2.5 text-xs font-bold hover:bg-green-150 transition cursor-pointer"
                      >
                        <CheckCircle2 size={13} />
                        Mark Sold
                      </button>
                    )}
                    <button
                      onClick={() => handleEdit(item)}
                      className="flex-1 lg:flex-initial flex items-center justify-center gap-1.5 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs font-bold text-gray-600 hover:bg-gray-50 cursor-pointer"
                    >
                      <Edit2 size={13} />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="flex items-center justify-center p-2.5 rounded-xl border border-red-100 bg-red-50 text-red-500 hover:text-red-700 hover:bg-red-100 transition cursor-pointer"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                </div>
              ))
            )}
          </div>

        </main>
      </div>

      {/* Edit Listing Modal */}
      {editingListing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto animate-fade-in">
          <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 md:p-7 shadow-2xl border border-gray-150 animate-scale-in my-8">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-5">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#6C4BF4]/10 text-[#6C4BF4]">
                  <Edit2 size={16} />
                </div>
                <div>
                  <h2 className="text-base font-bold text-[#17152A]">Edit Listing</h2>
                  <span className="text-[10px] font-mono font-bold text-gray-400">
                    ID: {editingListing.id}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingListing(null)}
                className="rounded-xl p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Book Preview Card */}
            <div className="flex items-center gap-3.5 rounded-2xl bg-gray-50 p-3.5 border border-gray-100 mb-5">
              <div className="h-16 w-12 shrink-0 overflow-hidden rounded-lg bg-gray-200 border border-gray-200 shadow-2xs relative">
                <img
                  src={editForm.cover || getBookCover(editingListing)}
                  alt={editingListing.title}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = DEFAULT_BOOK_COVER;
                  }}
                />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-xs md:text-sm font-bold text-[#17152A] truncate">
                  {editingListing.title}
                </h3>
                <p className="text-[11px] text-gray-500 truncate mt-0.5">
                  by {editingListing.author || "Specified Author"}
                </p>
                <span className="inline-block text-[9px] font-bold text-[#6C4BF4] bg-[#6C4BF4]/10 px-2 py-0.5 rounded-md mt-1">
                  Current Status: {editingListing.status}
                </span>
              </div>
            </div>

            {/* Edit Form */}
            <form onSubmit={handleSaveEdit} className="space-y-4">
              
              {/* Price & MRP */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                    Your Price (₹) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">
                      ₹
                    </span>
                    <input
                      type="number"
                      required
                      min="1"
                      value={editForm.price}
                      onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                      placeholder="e.g. 450"
                      className="w-full rounded-xl border border-gray-200 pl-8 pr-3 py-2.5 text-xs font-bold text-[#17152A] outline-none transition focus:border-[#6C4BF4] focus:ring-1 focus:ring-[#6C4BF4]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                    Original MRP (₹)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">
                      ₹
                    </span>
                    <input
                      type="number"
                      min="1"
                      value={editForm.mrp}
                      onChange={(e) => setEditForm({ ...editForm, mrp: e.target.value })}
                      placeholder="e.g. 999"
                      className="w-full rounded-xl border border-gray-200 pl-8 pr-3 py-2.5 text-xs font-semibold text-gray-600 outline-none transition focus:border-[#6C4BF4] focus:ring-1 focus:ring-[#6C4BF4]"
                    />
                  </div>
                </div>
              </div>

              {/* Condition Selection */}
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                  Book Condition
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: "like-new", label: "Like New" },
                    { id: "very-good", label: "Very Good" },
                    { id: "good", label: "Good" },
                    { id: "fair", label: "Fair" },
                  ].map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setEditForm({ ...editForm, condition: c.id })}
                      className={`py-2 px-2 rounded-xl text-xs font-bold transition cursor-pointer border text-center ${
                        editForm.condition === c.id
                          ? "bg-[#6C4BF4] text-white border-[#6C4BF4] shadow-xs"
                          : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Status Selection */}
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                  Listing Status
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "Active", label: "Active" },
                    { id: "Inactive", label: "Paused" },
                    { id: "Sold", label: "Sold" },
                  ].map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setEditForm({ ...editForm, status: s.id })}
                      className={`py-2 px-2 rounded-xl text-xs font-bold transition cursor-pointer border text-center ${
                        editForm.status === s.id
                          ? "border-[#6C4BF4] bg-[#6C4BF4]/10 text-[#6C4BF4] ring-2 ring-[#6C4BF4]/20"
                          : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Condition Notes */}
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                  Condition Notes / Description
                </label>
                <textarea
                  rows={2}
                  value={editForm.conditionNotes}
                  onChange={(e) => setEditForm({ ...editForm, conditionNotes: e.target.value })}
                  placeholder="e.g. Light pencil markings in chapter 3, binding is tight..."
                  className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-xs text-[#17152A] outline-none transition focus:border-[#6C4BF4] focus:ring-1 focus:ring-[#6C4BF4]"
                />
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-gray-100 mt-5">
                <button
                  type="button"
                  onClick={() => setEditingListing(null)}
                  className="rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-xs font-bold text-gray-600 hover:bg-gray-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 rounded-xl bg-[#6C4BF4] hover:bg-[#5B3DE0] px-6 py-2.5 text-xs font-bold text-white shadow-md shadow-[#6C4BF4]/20 transition cursor-pointer active:scale-[0.98]"
                >
                  <Save size={14} />
                  Save Changes
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}
