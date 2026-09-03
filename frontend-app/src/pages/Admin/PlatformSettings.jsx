import React, { useState } from "react";
import { Check, Settings, ShieldAlert } from "lucide-react";

function PlatformSettings() {
  const [settings, setSettings] = useState({
    commission: 5,
    rentalCommission: 10,
    exchangeFee: 20,
    escrowDuration: 48,
    allowRentals: true,
    allowExchanges: true,
    allowDonations: false
  });

  const [saved, setSaved] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-[#17152A] font-poppins">Platform Settings & Fees</h1>
        <p className="text-[#6B6880] mt-1 text-sm">Configure system commissions, escrow policies, and activate transaction types.</p>
      </div>

      <div className="bg-white p-8 rounded-2xl border border-[#E7E4F2] shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-[#17152A] uppercase tracking-wider mb-2">Platform Commission (%)</label>
              <input 
                type="number" 
                value={settings.commission}
                onChange={(e) => setSettings({ ...settings, commission: parseInt(e.target.value) || 0 })}
                className="w-full rounded-xl border border-gray-200 bg-[#F8F7FF] py-3 px-4 text-sm outline-none focus:border-[#6C4BF4]"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#17152A] uppercase tracking-wider mb-2">Rental Commission (%)</label>
              <input 
                type="number" 
                value={settings.rentalCommission}
                onChange={(e) => setSettings({ ...settings, rentalCommission: parseInt(e.target.value) || 0 })}
                className="w-full rounded-xl border border-gray-200 bg-[#F8F7FF] py-3 px-4 text-sm outline-none focus:border-[#6C4BF4]"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#17152A] uppercase tracking-wider mb-2">Exchange Fee (INR)</label>
              <input 
                type="number" 
                value={settings.exchangeFee}
                onChange={(e) => setSettings({ ...settings, exchangeFee: parseInt(e.target.value) || 0 })}
                className="w-full rounded-xl border border-gray-200 bg-[#F8F7FF] py-3 px-4 text-sm outline-none focus:border-[#6C4BF4]"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#17152A] uppercase tracking-wider mb-2">Escrow Hold Duration (Hrs)</label>
              <input 
                type="number" 
                value={settings.escrowDuration}
                onChange={(e) => setSettings({ ...settings, escrowDuration: parseInt(e.target.value) || 0 })}
                className="w-full rounded-xl border border-gray-200 bg-[#F8F7FF] py-3 px-4 text-sm outline-none focus:border-[#6C4BF4]"
                required
              />
            </div>
          </div>

          {/* Toggle Switches */}
          <div className="border-t border-[#E7E4F2]/50 pt-6 space-y-4">
            <h3 className="font-bold text-[#17152A] text-base font-poppins">Enable Services</h3>

            <div className="flex items-center justify-between gap-4 py-2">
              <div>
                <label className="text-sm font-bold text-[#17152A]">Allow Rentals</label>
                <p className="text-xs text-[#6B6880] mt-0.5">Let students temporarily rent books from each other.</p>
              </div>
              <input 
                type="checkbox" 
                checked={settings.allowRentals}
                onChange={(e) => setSettings({ ...settings, allowRentals: e.target.checked })}
                className="w-10 h-5 bg-gray-200 rounded-full appearance-none checked:bg-[#22C55E] cursor-pointer relative shrink-0 after:content-[''] after:absolute after:h-4 after:w-4 after:bg-white after:rounded-full after:top-0.5 after:left-0.5 checked:after:left-5.5 after:transition-all"
              />
            </div>

            <div className="flex items-center justify-between gap-4 py-2 border-t border-[#E7E4F2]/50">
              <div>
                <label className="text-sm font-bold text-[#17152A]">Allow Exchanges</label>
                <p className="text-xs text-[#6B6880] mt-0.5">Allow peer-to-peer verified swaps of physical books.</p>
              </div>
              <input 
                type="checkbox" 
                checked={settings.allowExchanges}
                onChange={(e) => setSettings({ ...settings, allowExchanges: e.target.checked })}
                className="w-10 h-5 bg-gray-200 rounded-full appearance-none checked:bg-[#22C55E] cursor-pointer relative shrink-0 after:content-[''] after:absolute after:h-4 after:w-4 after:bg-white after:rounded-full after:top-0.5 after:left-0.5 checked:after:left-5.5 after:transition-all"
              />
            </div>

            <div className="flex items-center justify-between gap-4 py-2 border-t border-[#E7E4F2]/50">
              <div>
                <label className="text-sm font-bold text-[#17152A]">Allow Donations</label>
                <p className="text-xs text-[#6B6880] mt-0.5">Let users offer books for free to school libraries or students.</p>
              </div>
              <input 
                type="checkbox" 
                checked={settings.allowDonations}
                onChange={(e) => setSettings({ ...settings, allowDonations: e.target.checked })}
                className="w-10 h-5 bg-gray-200 rounded-full appearance-none checked:bg-[#22C55E] cursor-pointer relative shrink-0 after:content-[''] after:absolute after:h-4 after:w-4 after:bg-white after:rounded-full after:top-0.5 after:left-0.5 checked:after:left-5.5 after:transition-all"
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4 justify-between border-t border-[#E7E4F2]/50 pt-6">
            {saved ? (
              <span className="flex items-center gap-1.5 text-[#22C55E] text-sm font-semibold">
                <Check size={16} />
                <span>Configuration saved successfully!</span>
              </span>
            ) : (
              <span />
            )}

            <button 
              type="submit"
              className="w-full sm:w-auto px-6 py-2.5 bg-[#6C4BF4] text-white rounded-xl text-sm font-semibold hover:bg-[#5B3DE0] transition shadow-md shadow-[#6C4BF4]/20"
            >
              Save Settings
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default PlatformSettings;
