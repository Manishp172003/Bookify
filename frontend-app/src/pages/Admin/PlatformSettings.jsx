import React, { useState, useEffect } from "react";
import { Check, Settings, ShieldAlert, Loader2 } from "lucide-react";
import { adminService } from "../../services/adminService";
import { useCommerce } from "../../context/CommerceContext";

function PlatformSettings() {
  const { showToast } = useCommerce();
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
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

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
          });
        }
      })
      .finally(() => setLoading(false));
  }, []);

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

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-[#17152A] font-poppins">Platform Settings & Fees</h1>
        <p className="text-[#6B6880] mt-1 text-sm">
          Configure real-time system commissions, delivery charges, wallet limits, and transaction policies stored in MongoDB.
        </p>
      </div>

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
                <span className="text-[11px] text-gray-400 mt-1 block">Standard fee on completed book sales.</span>
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
                <span className="text-[11px] text-gray-400 mt-1 block">Fee applied to semester rental transactions.</span>
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
                <span className="text-[11px] text-gray-400 mt-1 block">Platform facilitation fee per student book swap.</span>
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
                <span className="text-[11px] text-gray-400 mt-1 block">Time funds stay in escrow before auto-release.</span>
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
                <span className="text-[11px] text-gray-400 mt-1 block">Flat courier charge applied at student checkout.</span>
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
                    setSettings({ ...settings, freeDeliveryThreshold: parseInt(e.target.value) || 0 })
                  }
                  className="w-full rounded-xl border border-gray-200 bg-[#F8F7FF] py-3 px-4 text-sm outline-none focus:border-[#6C4BF4]"
                  required
                />
                <span className="text-[11px] text-gray-400 mt-1 block">Orders equal or above this amount get free delivery.</span>
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
                    setSettings({ ...settings, minWithdrawalAmount: parseInt(e.target.value) || 0 })
                  }
                  className="w-full rounded-xl border border-gray-200 bg-[#F8F7FF] py-3 px-4 text-sm outline-none focus:border-[#6C4BF4]"
                  required
                />
                <span className="text-[11px] text-gray-400 mt-1 block">Minimum wallet earnings required to request bank payout.</span>
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
                    setSettings({ ...settings, disputeWindowDays: parseInt(e.target.value) || 0 })
                  }
                  className="w-full rounded-xl border border-gray-200 bg-[#F8F7FF] py-3 px-4 text-sm outline-none focus:border-[#6C4BF4]"
                  required
                />
                <span className="text-[11px] text-gray-400 mt-1 block">Days a buyer has after delivery to report issues.</span>
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
                    onChange={(e) => setSettings({ ...settings, allowExchanges: e.target.checked })}
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
                    onChange={(e) => setSettings({ ...settings, allowCampusPickup: e.target.checked })}
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
                    onChange={(e) => setSettings({ ...settings, allowDonations: e.target.checked })}
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
                    onChange={(e) => setSettings({ ...settings, announcementEnabled: e.target.checked })}
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
                    onChange={(e) => setSettings({ ...settings, announcementText: e.target.value })}
                    className="w-full rounded-xl border border-purple-200 bg-[#F8F7FF] py-3 px-4 text-sm outline-none focus:border-[#6C4BF4]"
                  />
                  <div className="bg-[#6C4BF4]/10 border border-[#6C4BF4]/20 rounded-xl px-4 py-2.5 flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-[#6C4BF4] text-white px-2 py-0.5 rounded-full">Preview</span>
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
    </div>
  );
}

export default PlatformSettings;
