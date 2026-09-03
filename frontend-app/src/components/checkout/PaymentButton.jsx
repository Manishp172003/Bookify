import { useState } from "react";
import { Lock, Zap, Truck, CreditCard, ShieldCheck, Check, Loader2 } from "lucide-react";

function PaymentButton({
  total,
  shippingMethod,
  onSelectShippingMethod,
  onPay,
  isProcessing
}) {
  const [selectedPaymentMode, setSelectedPaymentMode] = useState("razorpay");

  return (
    <div className="space-y-6">
      {/* 2. Shipping Method Selection */}
      <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-xs">
        <div className="flex items-center gap-2 pb-4 border-b border-gray-100 mb-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#F0ECFF] text-[#6C4BF4]">
            <Truck size={18} />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#17152A]">2. Shipping Method</h2>
            <p className="text-xs text-gray-500">Choose your preferred delivery speed</p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {/* Standard */}
          <div
            onClick={() => onSelectShippingMethod("standard")}
            className={`flex items-start justify-between rounded-2xl border p-4 cursor-pointer transition ${
              shippingMethod === "standard"
                ? "border-[#6C4BF4] bg-[#F0ECFF]/30 ring-2 ring-[#6C4BF4]/20"
                : "border-gray-200 bg-[#F8F7FF]/50 hover:border-gray-300"
            }`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition ${
                  shippingMethod === "standard"
                    ? "border-[#6C4BF4] bg-[#6C4BF4] text-white"
                    : "border-gray-300 bg-white"
                }`}
              >
                {shippingMethod === "standard" && <Check size={12} strokeWidth={3} />}
              </div>
              <div>
                <h3 className="text-xs font-bold text-[#17152A]">Standard Delivery</h3>
                <p className="text-[11px] text-gray-500 mt-0.5">Est. 3-5 business days</p>
                <span className="mt-1 inline-block text-xs font-black text-[#6C4BF4]">
                  ₹60 <span className="text-[10px] text-gray-400 font-normal">(Free over ₹999)</span>
                </span>
              </div>
            </div>
          </div>

          {/* Express */}
          <div
            onClick={() => onSelectShippingMethod("express")}
            className={`flex items-start justify-between rounded-2xl border p-4 cursor-pointer transition ${
              shippingMethod === "express"
                ? "border-[#6C4BF4] bg-[#F0ECFF]/30 ring-2 ring-[#6C4BF4]/20"
                : "border-gray-200 bg-[#F8F7FF]/50 hover:border-gray-300"
            }`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition ${
                  shippingMethod === "express"
                    ? "border-[#6C4BF4] bg-[#6C4BF4] text-white"
                    : "border-gray-300 bg-white"
                }`}
              >
                {shippingMethod === "express" && <Check size={12} strokeWidth={3} />}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs font-bold text-[#17152A]">Express Campus Priority</h3>
                  <span className="rounded bg-amber-100 px-1.5 py-0.2 text-[9px] font-bold text-amber-800 flex items-center gap-0.5">
                    <Zap size={9} /> Fast
                  </span>
                </div>
                <p className="text-[11px] text-gray-500 mt-0.5">Est. 1-2 business days</p>
                <span className="mt-1 inline-block text-xs font-black text-[#6C4BF4]">₹120</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Payment Method & CTA */}
      <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-xs">
        <div className="flex items-center gap-2 pb-4 border-b border-gray-100 mb-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#F0ECFF] text-[#6C4BF4]">
            <CreditCard size={18} />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#17152A]">3. Payment Method</h2>
            <p className="text-xs text-gray-500">All transactions are backed by Escrow</p>
          </div>
        </div>

        <div className="space-y-3 mb-6">
          {/* Razorpay Option */}
          <div
            onClick={() => setSelectedPaymentMode("razorpay")}
            className={`flex items-center justify-between rounded-2xl border p-4 cursor-pointer transition ${
              selectedPaymentMode === "razorpay"
                ? "border-[#6C4BF4] bg-[#F0ECFF]/30 ring-2 ring-[#6C4BF4]/20"
                : "border-gray-200 bg-[#F8F7FF]/50"
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                  selectedPaymentMode === "razorpay"
                    ? "border-[#6C4BF4] bg-[#6C4BF4] text-white"
                    : "border-gray-300 bg-white"
                }`}
              >
                {selectedPaymentMode === "razorpay" && <Check size={12} strokeWidth={3} />}
              </div>
              <div>
                <h3 className="text-xs font-bold text-[#17152A]">Razorpay (UPI, GPay, Cards, NetBanking)</h3>
                <p className="text-[11px] text-gray-500">Direct instant escrow transfer</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs font-extrabold text-[#6C4BF4]">
              <span>UPI / Cards</span>
            </div>
          </div>
        </div>

        {/* Big Pay Button */}
        <button
          type="button"
          onClick={onPay}
          disabled={isProcessing}
          className="flex w-full items-center justify-center gap-2.5 rounded-2xl bg-[#6C4BF4] py-4 text-base font-extrabold text-white shadow-xl shadow-[#6C4BF4]/30 transition duration-200 hover:-translate-y-0.5 hover:bg-[#5B3DE0] hover:shadow-2xl active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 cursor-pointer"
        >
          {isProcessing ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              <span>Securing Escrow Payment...</span>
            </>
          ) : (
            <>
              <Lock size={19} />
              <span>Pay Securely ₹{total}</span>
            </>
          )}
        </button>

        <p className="text-center text-[11px] text-gray-400 mt-3 flex items-center justify-center gap-1">
          <ShieldCheck size={13} className="text-emerald-600" />
          <span>Encrypted with 256-bit SSL · Powered by Razorpay & Bookify Escrow</span>
        </p>
      </div>
    </div>
  );
}

export default PaymentButton;
