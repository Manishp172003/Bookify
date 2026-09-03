import React, { useState } from "react";
import { Megaphone, Plus, Eye, MousePointer, CreditCard, Play, Pause, Trash2 } from "lucide-react";

function Campaigns() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [campaigns, setCampaigns] = useState([
    {
      id: 1,
      name: "Home Boost",
      type: "Home Boost",
      status: "Running",
      rate: "₹299 / day",
      views: "12.4K",
      clicks: "620",
      ctr: "4.99%",
      spent: "₹1,196",
      book: "The Silent Mind"
    },
    {
      id: 2,
      name: "Search Boost",
      type: "Search Boost",
      status: "Running",
      rate: "₹99 / day",
      views: "12.4K",
      clicks: "580",
      ctr: "4.67%",
      spent: "₹600",
      book: "Inner Peace"
    }
  ]);

  const [newCampaign, setNewCampaign] = useState({
    name: "",
    book: "The Silent Mind",
    type: "Home Boost",
    budget: "299"
  });

  const handleCreate = (e) => {
    e.preventDefault();
    setCampaigns([
      ...campaigns,
      {
        id: Date.now(),
        name: newCampaign.name,
        type: newCampaign.type,
        status: "Running",
        rate: `₹${newCampaign.budget} / day`,
        views: "0",
        clicks: "0",
        ctr: "0.00%",
        spent: "₹0",
        book: newCampaign.book
      }
    ]);
    setNewCampaign({ name: "", book: "The Silent Mind", type: "Home Boost", budget: "299" });
  };

  const toggleStatus = (id) => {
    setCampaigns(campaigns.map(c => c.id === id ? { ...c, status: c.status === "Running" ? "Paused" : "Running" } : c));
  };

  return (
    <div className="space-y-8 relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#17152A] font-poppins">Campaigns & Promotions</h1>
          <p className="text-[#6B6880] mt-1 text-sm">Boost your book's visibility on the storefront and search results.</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#6C4BF4] text-white rounded-xl text-sm font-semibold hover:bg-[#5b3ed9] transition shadow-md shadow-[#6C4BF4]/20 self-start"
        >
          <Plus size={16} />
          <span>Create Campaign</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-[#E7E4F2] shadow-sm">
          <span className="text-xs text-[#6B6880] font-semibold uppercase tracking-wider block">Active Campaigns</span>
          <span className="text-3xl font-extrabold text-[#17152A] mt-2 block font-poppins">{campaigns.length}</span>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-[#E7E4F2] shadow-sm">
          <span className="text-xs text-[#6B6880] font-semibold uppercase tracking-wider block">Total Views</span>
          <span className="text-3xl font-extrabold text-[#17152A] mt-2 block font-poppins">24.8K</span>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-[#E7E4F2] shadow-sm">
          <span className="text-xs text-[#6B6880] font-semibold uppercase tracking-wider block">Total Clicks</span>
          <span className="text-3xl font-extrabold text-[#17152A] mt-2 block font-poppins">1.2K</span>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-[#E7E4F2] shadow-sm">
          <span className="text-xs text-[#6B6880] font-semibold uppercase tracking-wider block">Total Spent</span>
          <span className="text-3xl font-extrabold text-[#22C55E] mt-2 block font-poppins">₹1,796</span>
        </div>
      </div>

      {/* Active Campaigns List */}
      <div className="bg-white rounded-2xl border border-[#E7E4F2] shadow-sm overflow-hidden">
        <div className="p-6 border-b border-[#E7E4F2]">
          <h2 className="text-lg font-bold text-[#17152A] font-poppins">Active Campaigns</h2>
        </div>

        <div className="divide-y divide-[#E7E4F2]/50">
          {campaigns.map((c) => (
            <div key={c.id} className="p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6 hover:bg-[#F8F7FF]/50 transition">
              <div className="space-y-2">
                <div className="flex items-center gap-2.5">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#EEEAFE] text-[#6C4BF4]">
                    {c.type}
                  </span>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                    c.status === "Running" ? "text-[#22C55E] bg-[#E8F8EE]" : "text-gray-500 bg-gray-100"
                  }`}>
                    {c.status}
                  </span>
                </div>
                <h3 className="font-extrabold text-[#17152A] text-lg font-poppins">{c.name} - <span className="font-medium text-[#6B6880] text-sm">{c.book}</span></h3>
                <p className="text-xs text-[#6B6880] font-bold">Daily budget: {c.rate}</p>
              </div>

              {/* Stats Grid inside Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 lg:gap-12 text-sm bg-[#F8F7FF] p-4 rounded-xl border border-[#E7E4F2]/50">
                <div>
                  <span className="text-xs text-[#6B6880] block">Views</span>
                  <span className="font-bold text-[#17152A]">{c.views}</span>
                </div>
                <div>
                  <span className="text-xs text-[#6B6880] block">Clicks</span>
                  <span className="font-bold text-[#17152A]">{c.clicks}</span>
                </div>
                <div>
                  <span className="text-xs text-[#6B6880] block">CTR</span>
                  <span className="font-bold text-[#17152A]">{c.ctr}</span>
                </div>
                <div>
                  <span className="text-xs text-[#6B6880] block">Spent</span>
                  <span className="font-bold text-[#17152A]">{c.spent}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button 
                  onClick={() => toggleStatus(c.id)}
                  className="p-2.5 text-gray-500 hover:text-[#6C4BF4] hover:bg-[#EEEAFE] rounded-xl transition"
                >
                  {c.status === "Running" ? <Pause size={16} /> : <Play size={16} className="text-[#22C55E]" />}
                </button>
                <button 
                  onClick={() => setCampaigns(campaigns.filter((item) => item.id !== c.id))}
                  className="p-2.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl transition"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CREATE DIALOG MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-[#17152A]/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-3xl max-w-md w-full border border-[#E7E4F2] shadow-2xl space-y-5">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-[#17152A] font-poppins">Create Campaign</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-[#6B6880] hover:text-black">
                ✕
              </button>
            </div>
            
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#17152A] uppercase tracking-wider mb-2">Campaign Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. New Release Boost" 
                  value={newCampaign.name}
                  onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 bg-[#F8F7FF] py-3 px-4 text-sm outline-none focus:border-[#6C4BF4]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#17152A] uppercase tracking-wider mb-2">Select Book</label>
                <select 
                  value={newCampaign.book}
                  onChange={(e) => setNewCampaign({ ...newCampaign, book: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 bg-[#F8F7FF] py-3 px-4 text-sm outline-none focus:border-[#6C4BF4]"
                >
                  <option>The Silent Mind</option>
                  <option>Inner Peace</option>
                  <option>The Power of Habit</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#17152A] uppercase tracking-wider mb-2">Promotion Type</label>
                <select 
                  value={newCampaign.type}
                  onChange={(e) => setNewCampaign({ ...newCampaign, type: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 bg-[#F8F7FF] py-3 px-4 text-sm outline-none focus:border-[#6C4BF4]"
                >
                  <option>Home Boost</option>
                  <option>Search Boost</option>
                  <option>Category Boost</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#17152A] uppercase tracking-wider mb-2">Daily Budget (INR)</label>
                <input 
                  type="number" 
                  value={newCampaign.budget}
                  onChange={(e) => setNewCampaign({ ...newCampaign, budget: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 bg-[#F8F7FF] py-3 px-4 text-sm outline-none focus:border-[#6C4BF4]"
                  required
                />
              </div>

              <div className="pt-2 flex gap-3 justify-end">
                <button 
                  type="button" 
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-sm font-semibold text-[#6B6880] hover:bg-gray-100 rounded-xl"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2.5 bg-[#6C4BF4] text-white rounded-xl text-sm font-semibold hover:bg-[#5b3ed9] transition shadow-md shadow-[#6C4BF4]/20"
                >
                  Launch Campaign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Campaigns;
