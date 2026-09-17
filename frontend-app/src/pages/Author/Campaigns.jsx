import React, { useState, useEffect } from "react";
import { Megaphone, Plus, Eye, MousePointer, Play, Pause, Trash2, Sparkles, X, Target } from "lucide-react";
import { authorService } from "../../services/authorService";
import { useCommerce } from "../../context/CommerceContext";

function Campaigns() {
  const { showToast } = useCommerce();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  const [newCampaign, setNewCampaign] = useState({
    name: "",
    book: "",
    type: "Home Boost",
    budget: "299",
    targetCategory: "Self Help",
    days: "7"
  });

  const loadCampaigns = () => {
    authorService.getCampaigns().then((camps) => {
      setCampaigns(Array.isArray(camps) ? camps : []);
    }).finally(() => {
      setLoading(false);
    });
  };

  useEffect(() => {
    loadCampaigns();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newCampaign.name.trim()) return;

    const payload = {
      title: newCampaign.name.trim(),
      campaignType: newCampaign.type === "Home Boost" ? "home_banner" : "category_boost",
      targetCategory: newCampaign.targetCategory,
      budget: Number(newCampaign.budget) || 299,
      book: newCampaign.book || "Published Book",
      endDate: new Date(Date.now() + Number(newCampaign.days || 7) * 24 * 60 * 60 * 1000)
    };

    const created = await authorService.createCampaign(payload);
    setCampaigns((prev) => [created, ...prev]);
    setShowCreateModal(false);
    setNewCampaign({ name: "", book: "", type: "Home Boost", budget: "299", targetCategory: "Self Help", days: "7" });
    showToast(`Campaign "${created.name}" launched successfully!`, "success");
  };

  const toggleStatus = async (id) => {
    const current = campaigns.find(c => c.id === id);
    const newStatus = current?.status === "Running" ? "paused" : "running";
    await authorService.updateCampaignStatus(id, newStatus);
    setCampaigns((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: newStatus === "running" ? "Running" : "Paused" } : c))
    );
    showToast(`Campaign ${newStatus === "running" ? "resumed" : "paused"}.`, "info");
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete campaign "${name}"? This cannot be undone.`)) return;
    await authorService.deleteCampaign(id);
    setCampaigns((prev) => prev.filter((c) => c.id !== id));
    showToast(`Campaign "${name}" deleted permanently.`, "info");
  };

  const totalViews = campaigns.reduce((sum, c) => {
    const num = parseInt((c.views || "0").replace(/[^0-9]/g, ""), 10);
    return sum + (isNaN(num) ? 0 : num);
  }, 0);

  const totalClicks = campaigns.reduce((sum, c) => {
    const num = parseInt((c.clicks || "0").replace(/[^0-9]/g, ""), 10);
    return sum + (isNaN(num) ? 0 : num);
  }, 0);

  const avgCtr = totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(2) : "0.00";

  return (
    <div className="space-y-8 relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#17152A] font-poppins">Campaigns & Promotions</h1>
          <p className="text-[#6B6880] mt-1 text-sm">Boost your book's visibility on the storefront and campus category feeds.</p>
        </div>
        <button
          type="button"
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#6C4BF4] text-white rounded-xl text-sm font-semibold hover:bg-[#5b3ed9] transition shadow-md shadow-[#6C4BF4]/20 self-start cursor-pointer"
        >
          <Plus size={16} />
          <span>Create Campaign</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-[#E7E4F2] shadow-xs">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-[#EEEAFE] text-[#6C4BF4] rounded-xl">
              <Eye size={22} />
            </div>
            <div>
              <span className="text-xs font-bold text-[#6B6880] uppercase tracking-wider">Total Impressions</span>
              <h3 className="text-2xl font-bold text-[#17152A] font-poppins mt-0.5">
                {totalViews > 0 ? `${(totalViews / 1000).toFixed(1)}K` : "0"}
              </h3>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-[#E7E4F2] shadow-xs">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-[#E8F8EE] text-[#22C55E] rounded-xl">
              <MousePointer size={22} />
            </div>
            <div>
              <span className="text-xs font-bold text-[#6B6880] uppercase tracking-wider">Total Clicks</span>
              <h3 className="text-2xl font-bold text-[#17152A] font-poppins mt-0.5">{totalClicks.toLocaleString()}</h3>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-[#E7E4F2] shadow-xs">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-[#FFF0E6] text-[#FF8A3D] rounded-xl">
              <Sparkles size={22} />
            </div>
            <div>
              <span className="text-xs font-bold text-[#6B6880] uppercase tracking-wider">Average CTR</span>
              <h3 className="text-2xl font-bold text-[#17152A] font-poppins mt-0.5">{avgCtr}%</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Active Campaigns Table or Clean Empty State */}
      <div className="bg-white rounded-2xl border border-[#E7E4F2] shadow-sm overflow-hidden">
        <div className="p-6 border-b border-[#E7E4F2]">
          <h2 className="text-lg font-bold text-[#17152A] font-poppins">Active Campaigns</h2>
          <p className="text-xs text-[#6B6880]">Promotional campaigns running on campus feeds.</p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-4 border-[#6C4BF4] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-xs text-gray-400 font-bold">Loading campaigns...</p>
          </div>
        ) : campaigns.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-[#17152A]">
              <thead className="bg-[#F8F7FF] text-xs font-bold text-[#6B6880] uppercase tracking-wider border-b border-[#E7E4F2]">
                <tr>
                  <th className="py-3.5 px-6">Campaign</th>
                  <th className="py-3.5 px-6">Type</th>
                  <th className="py-3.5 px-6">Daily Rate</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6">Views</th>
                  <th className="py-3.5 px-6">Clicks</th>
                  <th className="py-3.5 px-6">CTR</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E7E4F2]">
                {campaigns.map((c) => (
                  <tr key={c.id} className="hover:bg-[#F8F7FF]/50 transition">
                    <td className="py-4 px-6 font-bold font-poppins">
                      <div>{c.name}</div>
                      <div className="text-xs font-normal text-[#6B6880]">{c.book}</div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#EEEAFE] text-[#6C4BF4]">
                        <Megaphone size={12} />
                        {c.type}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-medium text-xs text-gray-700">{c.rate}</td>
                    <td className="py-4 px-6">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        c.status === "Running" ? "bg-[#E8F8EE] text-[#22C55E]" : "bg-gray-100 text-gray-500"
                      }`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-medium text-xs">{c.views}</td>
                    <td className="py-4 px-6 font-medium text-xs">{c.clicks}</td>
                    <td className="py-4 px-6 font-bold text-[#6C4BF4] text-xs">{c.ctr}</td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => toggleStatus(c.id)}
                          className={`p-1.5 rounded-lg border transition cursor-pointer ${
                            c.status === "Running" 
                              ? "border-amber-200 text-amber-600 hover:bg-amber-50" 
                              : "border-emerald-200 text-emerald-600 hover:bg-emerald-50"
                          }`}
                          title={c.status === "Running" ? "Pause" : "Resume"}
                        >
                          {c.status === "Running" ? <Pause size={14} /> : <Play size={14} />}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(c.id, c.name)}
                          className="p-1.5 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition cursor-pointer"
                          title="Delete Campaign"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-16 px-4 space-y-3">
            <div className="h-12 w-12 rounded-full bg-[#EEEAFE] text-[#6C4BF4] flex items-center justify-center mx-auto">
              <Megaphone size={22} />
            </div>
            <h3 className="text-base font-bold text-[#17152A]">No Campaigns Created Yet</h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              Promote your titles on the homepage banner or category tops to boost book discovery.
            </p>
            <button
              type="button"
              onClick={() => setShowCreateModal(true)}
              className="mt-2 px-4 py-2 bg-[#6C4BF4] text-white rounded-xl text-xs font-bold hover:bg-[#5b3ed9] transition cursor-pointer"
            >
              Launch Your First Campaign
            </button>
          </div>
        )}
      </div>

      {/* Modal: Create Campaign */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-[#E7E4F2] space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-[#E7E4F2]">
              <div className="flex items-center gap-2">
                <div className="h-9 w-9 rounded-xl bg-[#EEEAFE] text-[#6C4BF4] flex items-center justify-center">
                  <Megaphone size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-[#17152A] font-poppins">Launch Promotional Campaign</h3>
                  <p className="text-xs text-gray-500">Reach thousands of student readers across universities</p>
                </div>
              </div>
              <button 
                type="button" 
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#17152A] uppercase tracking-wider mb-1.5">Campaign Name</label>
                <input
                  type="text"
                  placeholder="e.g. Mid-Sem Exams Spotlight"
                  value={newCampaign.name}
                  onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 bg-[#F8F7FF] py-2.5 px-4 text-xs outline-none focus:border-[#6C4BF4]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#17152A] uppercase tracking-wider mb-1.5">Placement Type</label>
                  <select
                    value={newCampaign.type}
                    onChange={(e) => setNewCampaign({ ...newCampaign, type: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 bg-[#F8F7FF] py-2.5 px-3 text-xs outline-none focus:border-[#6C4BF4]"
                  >
                    <option value="Home Boost">Home Banner Boost (₹299/day)</option>
                    <option value="Category Boost">Category Feed Boost (₹149/day)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#17152A] uppercase tracking-wider mb-1.5">Campaign Duration</label>
                  <select
                    value={newCampaign.days}
                    onChange={(e) => setNewCampaign({ ...newCampaign, days: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 bg-[#F8F7FF] py-2.5 px-3 text-xs outline-none focus:border-[#6C4BF4]"
                  >
                    <option value="3">3 Days</option>
                    <option value="7">7 Days (Recommended)</option>
                    <option value="14">14 Days</option>
                    <option value="30">30 Days</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#17152A] uppercase tracking-wider mb-1.5">Target Book Title</label>
                <input
                  type="text"
                  placeholder="e.g. My Textbook Title"
                  value={newCampaign.book}
                  onChange={(e) => setNewCampaign({ ...newCampaign, book: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 bg-[#F8F7FF] py-2.5 px-4 text-xs outline-none focus:border-[#6C4BF4]"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#E7E4F2]">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-5 py-2.5 border border-gray-200 text-gray-700 rounded-xl text-xs font-bold hover:bg-gray-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#6C4BF4] text-white rounded-xl text-xs font-bold hover:bg-[#5b3ed9] transition shadow-md shadow-[#6C4BF4]/20 cursor-pointer"
                >
                  Start Campaign
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
