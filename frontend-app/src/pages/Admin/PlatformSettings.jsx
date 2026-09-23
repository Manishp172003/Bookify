import React, { useState, useEffect } from "react";
import {
  Check,
  Settings,
  ShieldAlert,
  Loader2,
  Sliders,
  MessageSquareQuote,
  Star,
  Trash2,
  CheckCircle2,
  XCircle,
  Sparkles,
  Mail,
  Download,
  Search,
  RefreshCw,
} from "lucide-react";
import { adminService } from "../../services/adminService";
import { useCommerce } from "../../context/CommerceContext";

function PlatformSettings() {
  const { showToast } = useCommerce();
  const [activeTab, setActiveTab] = useState("fees"); // 'fees' | 'testimonials'

  // Settings State
  const [settings, setSettings] = useState({
    commission: 5,
    rentalCommission: 10,
    exchangeFee: 20,
    escrowDuration: 48,
    deliveryFee: 40,
    freeDeliveryThreshold: 499,
    minWithdrawalAmount: 200,
    disputeWindowDays: 3,
    allowRentals: true,
    allowExchanges: true,
    allowDonations: false,
    allowCampusPickup: true,
    announcementEnabled: false,
    announcementText: "",
    autoApproveTestimonials: false,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Testimonials State
  const [testimonials, setTestimonials] = useState([]);
  const [testimonialsLoading, setTestimonialsLoading] = useState(false);
  const [testimonialStatusFilter, setTestimonialStatusFilter] = useState("all");
  const [testimonialCounts, setTestimonialCounts] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });

  // Fetch Settings
  useEffect(() => {
    adminService
      .getPlatformSettings()
      .then((data) => {
        if (data) {
          setSettings({
            commission: data.commission ?? 5,
            rentalCommission: data.rentalCommission ?? 10,
            exchangeFee: data.exchangeFee ?? 20,
            escrowDuration: data.escrowDuration ?? 48,
            deliveryFee: data.deliveryFee ?? 40,
            freeDeliveryThreshold: data.freeDeliveryThreshold ?? 499,
            minWithdrawalAmount: data.minWithdrawalAmount ?? 200,
            disputeWindowDays: data.disputeWindowDays ?? 3,
            allowRentals: data.allowRentals ?? true,
            allowExchanges: data.allowExchanges ?? true,
            allowDonations: data.allowDonations ?? false,
            allowCampusPickup: data.allowCampusPickup ?? true,
            announcementEnabled: data.announcementEnabled ?? false,
            announcementText: data.announcementText ?? "",
            autoApproveTestimonials: data.autoApproveTestimonials ?? false,
          });
        }
      })
      .finally(() => setLoading(false));
  }, []);

  // Fetch Testimonials
  const loadTestimonials = (status = testimonialStatusFilter) => {
    setTestimonialsLoading(true);
    adminService
      .getTestimonials(status)
      .then((res) => {
        if (res && res.data) {
          setTestimonials(res.data);
          if (res.counts) setTestimonialCounts(res.counts);
        }
      })
      .finally(() => setTestimonialsLoading(false));
  };

  useEffect(() => {
    loadTestimonials(testimonialStatusFilter);
  }, [testimonialStatusFilter]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updated = await adminService.updatePlatformSettings(settings);
      if (updated) {
        setSaved(true);
        showToast("Platform settings saved to database successfully.", "success");
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (err) {
      showToast("Failed to save settings to database", "error");
    } finally {
      setSaving(false);
    }
  };

  // Testimonial Moderation Handlers
  const handleStatusChange = async (id, status) => {
    try {
      await adminService.updateTestimonialStatus(id, status);
      showToast(`Testimonial ${status} successfully.`, "success");
      loadTestimonials();
    } catch (err) {
      showToast("Failed to update status", "error");
    }
  };

  const handleToggleFeatured = async (id) => {
    try {
      const updated = await adminService.toggleFeaturedTestimonial(id);
      showToast(
        updated?.isFeatured ? "Featured on Home Page!" : "Removed from featured",
        "success"
      );
      loadTestimonials();
    } catch (err) {
      showToast("Failed to toggle featured status", "error");
    }
  };

  const handleDeleteTestimonial = async (id) => {
    if (!window.confirm("Are you sure you want to permanently delete this testimonial?")) return;
    try {
      await adminService.deleteTestimonial(id);
      showToast("Testimonial deleted", "success");
      loadTestimonials();
    } catch (err) {
      showToast("Failed to delete testimonial", "error");
    }
  };

  const handleToggleAutoApprove = async () => {
    const nextVal = !settings.autoApproveTestimonials;
    setSettings((prev) => ({ ...prev, autoApproveTestimonials: nextVal }));
    try {
      await adminService.updatePlatformSettings({ autoApproveTestimonials: nextVal });
      showToast(
        nextVal
          ? "Auto-approval enabled: New reviews will be published instantly."
          : "Manual review enabled: New reviews will require admin approval.",
        "success"
      );
    } catch (err) {
      showToast("Failed to update auto-approval setting", "error");
    }
  };

  // Newsletter Subscribers State
  const [subscribers, setSubscribers] = useState([]);
  const [subscribersLoading, setSubscribersLoading] = useState(false);
  const [subscriberStatusFilter, setSubscriberStatusFilter] = useState("all");
  const [subscriberSearch, setSubscriberSearch] = useState("");
  const [subscriberCounts, setSubscriberCounts] = useState({
    total: 0,
    active: 0,
    unsubscribed: 0,
  });

  const loadSubscribers = (status = subscriberStatusFilter, search = subscriberSearch) => {
    setSubscribersLoading(true);
    adminService
      .getNewsletterSubscribers({ status, search })
      .then((res) => {
        if (res && res.subscribers) {
          setSubscribers(res.subscribers);
          if (res.counts) setSubscriberCounts(res.counts);
        }
      })
      .finally(() => setSubscribersLoading(false));
  };

  useEffect(() => {
    if (activeTab === "subscribers") {
      loadSubscribers(subscriberStatusFilter, subscriberSearch);
    }
  }, [activeTab, subscriberStatusFilter]);

  const handleExportCSV = async () => {
    try {
      const data = await adminService.exportNewsletterSubscribers();
      if (!data || data.length === 0) {
        showToast("No active subscribers to export.", "info");
        return;
      }
      const headers = ["Email", "Source", "Subscribed At"];
      const rows = data.map((s) => [
        `"${s.email}"`,
        `"${s.source || "explore_page"}"`,
        `"${new Date(s.subscribedAt).toISOString()}"`,
      ]);
      const csvContent =
        "data:text/csv;charset=utf-8," +
        [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute(
        "download",
        `bookify_subscribers_${new Date().toISOString().split("T")[0]}.csv`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast(`Exported ${data.length} subscribers!`, "success");
    } catch (err) {
      showToast("Failed to export subscribers", "error");
    }
  };

  const handleDeleteSubscriber = async (id, email) => {
    if (!window.confirm(`Are you sure you want to remove ${email} from newsletter subscribers?`))
      return;
    try {
      const ok = await adminService.deleteNewsletterSubscriber(id);
      if (ok) {
        showToast(`Subscriber ${email} deleted successfully.`, "success");
        loadSubscribers();
      } else {
        showToast("Failed to delete subscriber", "error");
      }
    } catch (err) {
      showToast("Error deleting subscriber", "error");
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-[#17152A] font-poppins">
          Platform Settings & Moderation
        </h1>
        <p className="text-[#6B6880] mt-1 text-sm">
          Configure real-time fees, delivery charges, global announcement banner, and moderate community reviews.
        </p>
      </div>

      {/* Tab Selector */}
      <div className="flex items-center gap-3 border-b border-[#E7E4F2] pb-3">
        <button
          onClick={() => setActiveTab("fees")}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
            activeTab === "fees"
              ? "bg-[#6C4BF4] text-white shadow-md shadow-[#6C4BF4]/20"
              : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
          }`}
        >
          <Sliders size={16} />
          <span>Platform Fees & Policies</span>
        </button>

        <button
          onClick={() => setActiveTab("testimonials")}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer relative ${
            activeTab === "testimonials"
              ? "bg-[#6C4BF4] text-white shadow-md shadow-[#6C4BF4]/20"
              : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
          }`}
        >
          <MessageSquareQuote size={16} />
          <span>Community Testimonials</span>
          {testimonialCounts.pending > 0 && (
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                activeTab === "testimonials"
                  ? "bg-amber-400 text-gray-900"
                  : "bg-amber-100 text-amber-800"
              }`}
            >
              {testimonialCounts.pending} pending
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab("subscribers")}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
            activeTab === "subscribers"
              ? "bg-[#6C4BF4] text-white shadow-md shadow-[#6C4BF4]/20"
              : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
          }`}
        >
          <Mail size={16} />
          <span>Newsletter Subscribers</span>
          {subscriberCounts.active > 0 && (
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                activeTab === "subscribers"
                  ? "bg-white/20 text-white"
                  : "bg-purple-100 text-[#6C4BF4]"
              }`}
            >
              {subscriberCounts.active}
            </span>
          )}
        </button>
      </div>

      {/* TAB 1: FEES & POLICIES */}
      {activeTab === "fees" && (
        <div className="bg-white p-8 rounded-2xl border border-[#E7E4F2] shadow-sm">
          {loading ? (
            <div className="text-center py-12">
              <div className="w-8 h-8 border-4 border-[#6C4BF4] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <p className="text-xs text-gray-400 font-bold">Loading settings from database...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Input Grid (4x2) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-[#17152A] uppercase tracking-wider mb-2">
                    Platform Commission (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={settings.commission}
                    onChange={(e) =>
                      setSettings({ ...settings, commission: parseInt(e.target.value) || 0 })
                    }
                    className="w-full rounded-xl border border-gray-200 bg-[#F8F7FF] py-3 px-4 text-sm outline-none focus:border-[#6C4BF4]"
                    required
                  />
                  <span className="text-[11px] text-gray-400 mt-1 block">
                    Standard fee on completed book sales.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#17152A] uppercase tracking-wider mb-2">
                    Rental Commission (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={settings.rentalCommission}
                    onChange={(e) =>
                      setSettings({ ...settings, rentalCommission: parseInt(e.target.value) || 0 })
                    }
                    className="w-full rounded-xl border border-gray-200 bg-[#F8F7FF] py-3 px-4 text-sm outline-none focus:border-[#6C4BF4]"
                    required
                  />
                  <span className="text-[11px] text-gray-400 mt-1 block">
                    Fee applied to semester rental transactions.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#17152A] uppercase tracking-wider mb-2">
                    Exchange Fee (INR ₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={settings.exchangeFee}
                    onChange={(e) =>
                      setSettings({ ...settings, exchangeFee: parseInt(e.target.value) || 0 })
                    }
                    className="w-full rounded-xl border border-gray-200 bg-[#F8F7FF] py-3 px-4 text-sm outline-none focus:border-[#6C4BF4]"
                    required
                  />
                  <span className="text-[11px] text-gray-400 mt-1 block">
                    Platform facilitation fee per student book swap.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#17152A] uppercase tracking-wider mb-2">
                    Escrow Hold Duration (Hrs)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={settings.escrowDuration}
                    onChange={(e) =>
                      setSettings({ ...settings, escrowDuration: parseInt(e.target.value) || 0 })
                    }
                    className="w-full rounded-xl border border-gray-200 bg-[#F8F7FF] py-3 px-4 text-sm outline-none focus:border-[#6C4BF4]"
                    required
                  />
                  <span className="text-[11px] text-gray-400 mt-1 block">
                    Time funds stay in escrow before auto-release.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#17152A] uppercase tracking-wider mb-2">
                    Standard Delivery Fee (INR ₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={settings.deliveryFee}
                    onChange={(e) =>
                      setSettings({ ...settings, deliveryFee: parseInt(e.target.value) || 0 })
                    }
                    className="w-full rounded-xl border border-gray-200 bg-[#F8F7FF] py-3 px-4 text-sm outline-none focus:border-[#6C4BF4]"
                    required
                  />
                  <span className="text-[11px] text-gray-400 mt-1 block">
                    Flat courier charge applied at student checkout.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#17152A] uppercase tracking-wider mb-2">
                    Free Delivery Threshold (INR ₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={settings.freeDeliveryThreshold}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        freeDeliveryThreshold: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full rounded-xl border border-gray-200 bg-[#F8F7FF] py-3 px-4 text-sm outline-none focus:border-[#6C4BF4]"
                    required
                  />
                  <span className="text-[11px] text-gray-400 mt-1 block">
                    Orders equal or above this amount get free delivery.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#17152A] uppercase tracking-wider mb-2">
                    Min. Wallet Withdrawal (INR ₹)
                  </label>
                  <input
                    type="number"
                    min="10"
                    value={settings.minWithdrawalAmount}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        minWithdrawalAmount: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full rounded-xl border border-gray-200 bg-[#F8F7FF] py-3 px-4 text-sm outline-none focus:border-[#6C4BF4]"
                    required
                  />
                  <span className="text-[11px] text-gray-400 mt-1 block">
                    Minimum wallet earnings required to request bank payout.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#17152A] uppercase tracking-wider mb-2">
                    Return / Dispute Window (Days)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={settings.disputeWindowDays}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        disputeWindowDays: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full rounded-xl border border-gray-200 bg-[#F8F7FF] py-3 px-4 text-sm outline-none focus:border-[#6C4BF4]"
                    required
                  />
                  <span className="text-[11px] text-gray-400 mt-1 block">
                    Days a buyer has after delivery to report issues.
                  </span>
                </div>
              </div>

              {/* Transaction Mode Features */}
              <div className="pt-6 border-t border-[#E7E4F2] space-y-4">
                <h3 className="text-sm font-bold text-[#17152A] uppercase tracking-wider">
                  Transaction Mode Features
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.allowRentals}
                      onChange={(e) => setSettings({ ...settings, allowRentals: e.target.checked })}
                      className="w-4 h-4 rounded text-[#6C4BF4] focus:ring-[#6C4BF4]"
                    />
                    <span className="text-sm font-medium text-[#17152A]">
                      Enable Semester Rentals Marketplace
                    </span>
                  </label>
                  <label className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.allowExchanges}
                      onChange={(e) =>
                        setSettings({ ...settings, allowExchanges: e.target.checked })
                      }
                      className="w-4 h-4 rounded text-[#6C4BF4] focus:ring-[#6C4BF4]"
                    />
                    <span className="text-sm font-medium text-[#17152A]">
                      Enable Campus Swapping & Exchanges
                    </span>
                  </label>
                  <label className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.allowCampusPickup}
                      onChange={(e) =>
                        setSettings({ ...settings, allowCampusPickup: e.target.checked })
                      }
                      className="w-4 h-4 rounded text-[#6C4BF4] focus:ring-[#6C4BF4]"
                    />
                    <span className="text-sm font-medium text-[#17152A]">
                      Enable Free Campus Meetup / Pickup
                    </span>
                  </label>
                  <label className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.allowDonations}
                      onChange={(e) =>
                        setSettings({ ...settings, allowDonations: e.target.checked })
                      }
                      className="w-4 h-4 rounded text-[#6C4BF4] focus:ring-[#6C4BF4]"
                    />
                    <span className="text-sm font-medium text-[#17152A]">
                      Enable Campus Charity Donations
                    </span>
                  </label>
                </div>
              </div>

              {/* Announcement Banner */}
              <div className="pt-6 border-t border-[#E7E4F2] space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-[#17152A] uppercase tracking-wider">
                      Global Announcement Banner
                    </h3>
                    <p className="text-xs text-[#6B6880] mt-0.5">
                      Display a highlighted notice or promotional broadcast to students across the marketplace.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.announcementEnabled}
                      onChange={(e) =>
                        setSettings({ ...settings, announcementEnabled: e.target.checked })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#6C4BF4]"></div>
                  </label>
                </div>

                {settings.announcementEnabled && (
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="e.g. 🎓 Semester Book Fair is live! Use code EXAM50 for ₹50 off on all orders."
                      value={settings.announcementText}
                      onChange={(e) =>
                        setSettings({ ...settings, announcementText: e.target.value })
                      }
                      className="w-full rounded-xl border border-purple-200 bg-[#F8F7FF] py-3 px-4 text-sm outline-none focus:border-[#6C4BF4]"
                    />
                    <div className="bg-[#6C4BF4]/10 border border-[#6C4BF4]/20 rounded-xl px-4 py-2.5 flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-[#6C4BF4] text-white px-2 py-0.5 rounded-full">
                        Preview
                      </span>
                      <span className="text-xs font-medium text-[#17152A] truncate">
                        {settings.announcementText || "Your announcement text will appear here..."}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-[#E7E4F2] flex items-center justify-between">
                <span className="text-xs text-[#6B6880]">
                  Changes persist system-wide to MongoDB Atlas.
                </span>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 bg-[#6C4BF4] text-white rounded-xl text-xs font-bold hover:bg-[#5b3ed9] transition shadow-md shadow-[#6C4BF4]/20 flex items-center gap-2 cursor-pointer"
                >
                  {saving ? (
                    <span>Saving to DB...</span>
                  ) : saved ? (
                    <>
                      <Check size={16} />
                      <span>Saved!</span>
                    </>
                  ) : (
                    <span>Save Settings</span>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* TAB 2: TESTIMONIALS MODERATION */}
      {activeTab === "testimonials" && (
        <div className="space-y-6">
          {/* Moderation Mode Toggle Banner */}
          <div className="bg-white p-5 rounded-2xl border border-[#E7E4F2] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                  settings.autoApproveTestimonials
                    ? "bg-green-100 text-green-700"
                    : "bg-purple-100 text-[#6C4BF4]"
                }`}
              >
                <Sliders size={20} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-[#17152A]">
                    Review Moderation Mode
                  </h3>
                  <span
                    className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      settings.autoApproveTestimonials
                        ? "bg-green-100 text-green-700"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {settings.autoApproveTestimonials ? "Auto-Approve Active" : "Manual Review Required"}
                  </span>
                </div>
                <p className="text-xs text-[#6B6880] mt-0.5">
                  {settings.autoApproveTestimonials
                    ? "New reviews submitted by students and authors will be automatically published immediately without manual admin approval."
                    : "New reviews will be held in 'Pending' status until manually reviewed and approved by an administrator."}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
              <span className="text-xs font-bold text-gray-500">
                {settings.autoApproveTestimonials ? "Auto-Approve" : "Manual"}
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.autoApproveTestimonials}
                  onChange={handleToggleAutoApprove}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
              </label>
            </div>
          </div>

          {/* Status Filter Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { id: "all", label: "All Reviews", count: testimonialCounts.total, color: "text-gray-700" },
              { id: "pending", label: "Pending", count: testimonialCounts.pending, color: "text-amber-600" },
              { id: "approved", label: "Approved", count: testimonialCounts.approved, color: "text-green-600" },
              { id: "rejected", label: "Rejected", count: testimonialCounts.rejected, color: "text-red-600" },
            ].map((card) => (
              <button
                key={card.id}
                onClick={() => setTestimonialStatusFilter(card.id)}
                className={`p-4 rounded-xl border text-left transition cursor-pointer ${
                  testimonialStatusFilter === card.id
                    ? "bg-[#6C4BF4]/5 border-[#6C4BF4] shadow-xs"
                    : "bg-white border-[#E7E4F2] hover:bg-gray-50"
                }`}
              >
                <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                  {card.label}
                </p>
                <p className={`text-2xl font-black mt-1 ${card.color}`}>{card.count}</p>
              </button>
            ))}
          </div>

          {/* Testimonial List */}
          <div className="bg-white rounded-2xl border border-[#E7E4F2] shadow-sm overflow-hidden">
            <div className="p-5 border-b border-[#E7E4F2] flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[#17152A]">
                  Student & Author Stories ({testimonials.length})
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Moderate student reviews and feature top genuine stories on the Home Page.
                </p>
              </div>
              <button
                onClick={() => loadTestimonials()}
                className="text-xs text-[#6C4BF4] font-semibold hover:underline cursor-pointer"
              >
                Refresh List
              </button>
            </div>

            {testimonialsLoading ? (
              <div className="text-center py-12">
                <div className="w-8 h-8 border-4 border-[#6C4BF4] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                <p className="text-xs text-gray-400 font-bold">Loading testimonials...</p>
              </div>
            ) : testimonials.length === 0 ? (
              <div className="text-center py-12 px-4">
                <MessageSquareQuote size={40} className="text-gray-300 mx-auto mb-3" />
                <h4 className="text-sm font-bold text-gray-700">No reviews found</h4>
                <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
                  When students or authors submit reviews via the Home Page "Share Your Experience" button, they will appear here for moderation.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {testimonials.map((item) => (
                  <div
                    key={item._id}
                    className="p-5 hover:bg-gray-50/50 transition flex flex-col md:flex-row md:items-start justify-between gap-4"
                  >
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-3">
                        {item.avatar ? (
                          <img
                            src={item.avatar}
                            alt={item.name}
                            className="w-9 h-9 rounded-full object-cover border border-purple-100"
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#6C4BF4] to-[#4828c2] text-white flex items-center justify-center font-bold text-xs">
                            {item.name?.charAt(0) || "U"}
                          </div>
                        )}
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-[#17152A]">{item.name}</span>
                            <span className="text-[11px] text-gray-400">({item.role})</span>
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <div className="flex gap-0.5">
                              {[1, 2, 3, 4, 5].map((n) => (
                                <Star
                                  key={n}
                                  size={12}
                                  className={
                                    n <= item.rating
                                      ? "text-amber-400 fill-amber-400"
                                      : "text-gray-200 fill-gray-100"
                                  }
                                />
                              ))}
                            </div>
                            <span className="text-[11px] text-gray-400">
                              {new Date(item.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      <p className="text-xs text-gray-700 leading-relaxed bg-[#F8F7FF] p-3 rounded-xl border border-purple-50">
                        "{item.comment}"
                      </p>

                      <div className="flex items-center gap-2 pt-1">
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                            item.status === "approved"
                              ? "bg-green-100 text-green-700"
                              : item.status === "rejected"
                              ? "bg-red-100 text-red-700"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {item.status}
                        </span>

                        {item.isFeatured && (
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-purple-100 text-[#6C4BF4] flex items-center gap-1">
                            <Sparkles size={10} />
                            Featured on Home
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                      {item.status !== "approved" && (
                        <button
                          onClick={() => handleStatusChange(item._id, "approved")}
                          className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs font-bold hover:bg-green-700 transition flex items-center gap-1 cursor-pointer"
                        >
                          <CheckCircle2 size={13} />
                          <span>Approve</span>
                        </button>
                      )}

                      {item.status !== "rejected" && (
                        <button
                          onClick={() => handleStatusChange(item._id, "rejected")}
                          className="px-3 py-1.5 bg-gray-100 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                        >
                          <XCircle size={13} />
                          <span>Reject</span>
                        </button>
                      )}

                      <button
                        onClick={() => handleToggleFeatured(item._id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                          item.isFeatured
                            ? "bg-purple-100 text-[#6C4BF4] hover:bg-purple-200"
                            : "border border-gray-200 text-gray-600 hover:border-[#6C4BF4] hover:text-[#6C4BF4]"
                        }`}
                      >
                        <Star size={13} className={item.isFeatured ? "fill-[#6C4BF4]" : ""} />
                        <span>{item.isFeatured ? "Unfeature" : "Feature on Home"}</span>
                      </button>

                      <button
                        onClick={() => handleDeleteTestimonial(item._id)}
                        className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg transition cursor-pointer"
                        title="Delete Review"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: NEWSLETTER SUBSCRIBERS */}
      {activeTab === "subscribers" && (
        <div className="space-y-6">
          {/* Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-[#E7E4F2] shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Subscribers</p>
                <p className="text-2xl font-black text-gray-900 mt-1">{subscriberCounts.total}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#6C4BF4] flex items-center justify-center">
                <Mail size={20} />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#E7E4F2] shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Active List</p>
                <p className="text-2xl font-black text-emerald-600 mt-1">{subscriberCounts.active}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 size={20} />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#E7E4F2] shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Unsubscribed</p>
                <p className="text-2xl font-black text-gray-400 mt-1">{subscriberCounts.unsubscribed}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-gray-100 text-gray-500 flex items-center justify-center">
                <XCircle size={20} />
              </div>
            </div>
          </div>

          {/* Table Container */}
          <div className="bg-white rounded-2xl border border-[#E7E4F2] shadow-sm overflow-hidden p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              {/* Search + Filter */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative min-w-[240px]">
                  <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search subscriber email..."
                    value={subscriberSearch}
                    onChange={(e) => setSubscriberSearch(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") loadSubscribers(subscriberStatusFilter, subscriberSearch);
                    }}
                    className="w-full pl-9 pr-3 py-2 text-xs border border-gray-200 focus:border-[#6C4BF4] rounded-xl focus:outline-none transition"
                  />
                </div>

                <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-xl border border-gray-200">
                  {["all", "active", "unsubscribed"].map((st) => (
                    <button
                      key={st}
                      onClick={() => setSubscriberStatusFilter(st)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition cursor-pointer ${
                        subscriberStatusFilter === st
                          ? "bg-white text-[#6C4BF4] shadow-xs"
                          : "text-gray-500 hover:text-gray-900"
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => loadSubscribers(subscriberStatusFilter, subscriberSearch)}
                  className="p-2 border border-gray-200 text-gray-500 hover:text-gray-900 rounded-xl hover:bg-gray-50 transition cursor-pointer"
                  title="Refresh list"
                >
                  <RefreshCw size={15} />
                </button>

                <button
                  onClick={handleExportCSV}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition flex items-center gap-2 cursor-pointer shadow-xs active:scale-95"
                >
                  <Download size={14} />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>

            {/* Subscribers Table */}
            {subscribersLoading ? (
              <div className="text-center py-12">
                <Loader2 size={24} className="animate-spin text-[#6C4BF4] mx-auto mb-2" />
                <p className="text-xs text-gray-400 font-bold">Loading subscribers...</p>
              </div>
            ) : subscribers.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-gray-100 rounded-xl">
                <Mail size={32} className="text-gray-300 mx-auto mb-2" />
                <p className="text-sm font-bold text-gray-700">No subscribers found</p>
                <p className="text-xs text-gray-400 mt-1">
                  {subscriberSearch ? "No matches for your search query." : "Subscribers from the Explore page will appear here."}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100 text-[11px] font-extrabold uppercase tracking-wider text-gray-400">
                      <th className="pb-3 px-3">Subscriber Email</th>
                      <th className="pb-3 px-3">Source Page</th>
                      <th className="pb-3 px-3">Date Joined</th>
                      <th className="pb-3 px-3">Status</th>
                      <th className="pb-3 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 text-xs">
                    {subscribers.map((sub) => (
                      <tr key={sub._id} className="hover:bg-gray-50/60 transition">
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-purple-50 text-[#6C4BF4] flex items-center justify-center shrink-0">
                              <Mail size={13} />
                            </div>
                            <span className="font-semibold text-gray-900">{sub.email}</span>
                          </div>
                        </td>
                        <td className="py-3 px-3 text-gray-500 font-medium">
                          <span className="px-2 py-0.5 rounded-md bg-gray-100 text-[11px] font-semibold text-gray-600">
                            {sub.source ? sub.source.replace("_", " ") : "explore page"}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-gray-500">
                          {new Date(sub.subscribedAt || sub.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </td>
                        <td className="py-3 px-3">
                          {sub.status === "active" ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                              Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-gray-100 text-gray-600 border border-gray-200">
                              Unsubscribed
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            onClick={() => handleDeleteSubscriber(sub._id, sub.email)}
                            className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition cursor-pointer"
                            title="Delete Subscriber"
                          >
                            <Trash2 size={15} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default PlatformSettings;
