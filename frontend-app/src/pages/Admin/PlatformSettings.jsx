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
    allowRentals: true,
    allowExchanges: true,
    allowDonations: false,
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
            allowRentals: data.allowRentals ?? true,
            allowExchanges: data.allowExchanges ?? true,
            allowDonations: data.allowDonations ?? false,
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
        showToast("Platform commission and fees saved to database.", "success");
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (err) {
      showToast("Failed to save settings to database", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-[#17152A] font-poppins">Platform Settings & Fees</h1>
        <p className="text-[#6B6880] mt-1 text-sm">
          Configure real-time system commissions, escrow policies, and activate transaction types stored in MongoDB.
        </p>
      </div>

      <div className="bg-white p-8 rounded-2xl border border-[#E7E4F2] shadow-sm">
        {loading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-4 border-[#6C4BF4] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-xs text-gray-400 font-bold">Loading settings from database...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-[#17152A] uppercase tracking-wider mb-2">
                  Platform Commission (%)
                </label>
                <input
                  type="number"
                  value={settings.commission}
                  onChange={(e) =>
                    setSettings({ ...settings, commission: parseInt(e.target.value) || 0 })
                  }
                  className="w-full rounded-xl border border-gray-200 bg-[#F8F7FF] py-3 px-4 text-sm outline-none focus:border-[#6C4BF4]"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#17152A] uppercase tracking-wider mb-2">
                  Rental Commission (%)
                </label>
                <input
                  type="number"
                  value={settings.rentalCommission}
                  onChange={(e) =>
                    setSettings({ ...settings, rentalCommission: parseInt(e.target.value) || 0 })
                  }
                  className="w-full rounded-xl border border-gray-200 bg-[#F8F7FF] py-3 px-4 text-sm outline-none focus:border-[#6C4BF4]"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#17152A] uppercase tracking-wider mb-2">
                  Exchange Fee (INR)
                </label>
                <input
                  type="number"
                  value={settings.exchangeFee}
                  onChange={(e) =>
                    setSettings({ ...settings, exchangeFee: parseInt(e.target.value) || 0 })
                  }
                  className="w-full rounded-xl border border-gray-200 bg-[#F8F7FF] py-3 px-4 text-sm outline-none focus:border-[#6C4BF4]"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#17152A] uppercase tracking-wider mb-2">
                  Escrow Hold Duration (Hrs)
                </label>
                <input
                  type="number"
                  value={settings.escrowDuration}
                  onChange={(e) =>
                    setSettings({ ...settings, escrowDuration: parseInt(e.target.value) || 0 })
                  }
                  className="w-full rounded-xl border border-gray-200 bg-[#F8F7FF] py-3 px-4 text-sm outline-none focus:border-[#6C4BF4]"
                  required
                />
              </div>
            </div>

            <div className="pt-4 border-t border-[#E7E4F2] space-y-4">
              <h3 className="text-sm font-bold text-[#17152A] uppercase tracking-wider">
                Transaction Mode Features
              </h3>
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.allowRentals}
                    onChange={(e) => setSettings({ ...settings, allowRentals: e.target.checked })}
                    className="w-4 h-4 rounded text-[#6C4BF4] focus:ring-[#6C4BF4]"
                  />
                  <span className="text-sm font-semibold text-[#17152A]">
                    Enable Semester Rentals Marketplace
                  </span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.allowExchanges}
                    onChange={(e) => setSettings({ ...settings, allowExchanges: e.target.checked })}
                    className="w-4 h-4 rounded text-[#6C4BF4] focus:ring-[#6C4BF4]"
                  />
                  <span className="text-sm font-semibold text-[#17152A]">
                    Enable Direct Campus Book Swapping & Exchanges
                  </span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.allowDonations}
                    onChange={(e) => setSettings({ ...settings, allowDonations: e.target.checked })}
                    className="w-4 h-4 rounded text-[#6C4BF4] focus:ring-[#6C4BF4]"
                  />
                  <span className="text-sm font-semibold text-[#17152A]">
                    Enable Campus Charity Book Donations
                  </span>
                </label>
              </div>
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
