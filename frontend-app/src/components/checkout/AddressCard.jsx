import { useState } from "react";
import { MapPin, Plus, Check, Edit2, Home, Building2, Phone, User, X } from "lucide-react";

function AddressCard({ addresses, selectedAddressId, onSelectAddress, onAddAddress }) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAddr, setNewAddr] = useState({
    name: "",
    phone: "",
    type: "Campus / Hostel",
    street: "",
    landmark: "",
    city: "",
    state: "",
    pincode: ""
  });
  const [formError, setFormError] = useState("");

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!newAddr.name || !newAddr.phone || !newAddr.street || !newAddr.city || !newAddr.pincode) {
      setFormError("Please fill out all required fields.");
      return;
    }
    onAddAddress(newAddr);
    setShowAddModal(false);
    setNewAddr({
      name: "",
      phone: "",
      type: "Campus / Hostel",
      street: "",
      landmark: "",
      city: "",
      state: "",
      pincode: ""
    });
    setFormError("");
  };

  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-xs">
      <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#F0ECFF] text-[#6C4BF4]">
            <MapPin size={18} />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#17152A]">1. Delivery Address</h2>
            <p className="text-xs text-gray-500">Select where you want your books delivered</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1 text-xs font-bold text-[#6C4BF4] hover:text-[#5B3DE0] transition cursor-pointer"
        >
          <Plus size={15} /> Add New Address
        </button>
      </div>

      {/* Address Options Grid */}
      <div className="grid gap-3 sm:grid-cols-2">
        {addresses.map((addr) => {
          const isSelected = addr.id === selectedAddressId;
          return (
            <div
              key={addr.id}
              onClick={() => onSelectAddress(addr.id)}
              className={`relative flex flex-col justify-between rounded-2xl border p-4 cursor-pointer transition ${
                isSelected
                  ? "border-[#6C4BF4] bg-[#F0ECFF]/30 ring-2 ring-[#6C4BF4]/20 shadow-xs"
                  : "border-gray-200 bg-[#F8F7FF]/50 hover:border-gray-300"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 items-center gap-1 rounded-md bg-[#F0ECFF] px-2 text-[10px] font-extrabold uppercase text-[#6C4BF4]">
                      {addr.type === "Home" ? <Home size={11} /> : <Building2 size={11} />}
                      {addr.type}
                    </span>
                    {addr.isDefault && (
                      <span className="text-[10px] font-bold text-gray-400">Default</span>
                    )}
                  </div>

                  {/* Radio Indicator */}
                  <div
                    className={`flex h-5 w-5 items-center justify-center rounded-full border transition ${
                      isSelected
                        ? "border-[#6C4BF4] bg-[#6C4BF4] text-white"
                        : "border-gray-300 bg-white"
                    }`}
                  >
                    {isSelected && <Check size={12} strokeWidth={3} />}
                  </div>
                </div>

                <h3 className="font-bold text-sm text-[#17152A]">{addr.name}</h3>
                <p className="text-xs text-gray-500 mt-0.5">{addr.phone}</p>
                <p className="mt-2 text-xs text-gray-600 leading-relaxed">
                  {addr.street}
                  {addr.landmark && `, Near ${addr.landmark}`}
                  <br />
                  {addr.city}, {addr.state} - <span className="font-semibold">{addr.pincode}</span>
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Address Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-4">
              <h3 className="text-lg font-bold text-[#17152A]">Add New Delivery Address</h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="rounded-xl p-1 text-gray-400 hover:bg-gray-100 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              {formError && (
                <div className="rounded-xl bg-red-50 p-3 text-xs text-red-600 font-semibold">
                  {formError}
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Shwet Samrat"
                    value={newAddr.name}
                    onChange={(e) => setNewAddr({ ...newAddr, name: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 bg-[#F8F7FF] px-3.5 py-2.5 text-xs text-[#17152A] outline-none focus:border-[#6C4BF4]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Mobile Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 9876543210"
                    value={newAddr.phone}
                    onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 bg-[#F8F7FF] px-3.5 py-2.5 text-xs text-[#17152A] outline-none focus:border-[#6C4BF4]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Address Type</label>
                <div className="flex gap-3">
                  {["Campus / Hostel", "Home", "Other"].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setNewAddr({ ...newAddr, type })}
                      className={`flex-1 rounded-xl py-2 text-xs font-bold transition cursor-pointer border ${
                        newAddr.type === type
                          ? "border-[#6C4BF4] bg-[#F0ECFF] text-[#6C4BF4]"
                          : "border-gray-200 bg-[#F8F7FF] text-gray-600"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Street Address / Hostel Room *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="e.g. Room 304, Shivalik Boys Hostel, North Campus"
                  value={newAddr.street}
                  onChange={(e) => setNewAddr({ ...newAddr, street: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 bg-[#F8F7FF] px-3.5 py-2.5 text-xs text-[#17152A] outline-none focus:border-[#6C4BF4]"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">City *</label>
                  <input
                    type="text"
                    required
                    placeholder="New Delhi"
                    value={newAddr.city}
                    onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 bg-[#F8F7FF] px-3.5 py-2.5 text-xs text-[#17152A] outline-none focus:border-[#6C4BF4]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">State *</label>
                  <input
                    type="text"
                    required
                    placeholder="Delhi"
                    value={newAddr.state}
                    onChange={(e) => setNewAddr({ ...newAddr, state: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 bg-[#F8F7FF] px-3.5 py-2.5 text-xs text-[#17152A] outline-none focus:border-[#6C4BF4]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Pincode *</label>
                  <input
                    type="text"
                    required
                    placeholder="110016"
                    value={newAddr.pincode}
                    onChange={(e) => setNewAddr({ ...newAddr, pincode: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 bg-[#F8F7FF] px-3.5 py-2.5 text-xs text-[#17152A] outline-none focus:border-[#6C4BF4]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="rounded-xl border border-gray-200 px-4 py-2.5 text-xs font-bold text-gray-600 hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#6C4BF4] px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-[#5B3DE0] cursor-pointer"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AddressCard;
