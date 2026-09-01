import { ShieldCheck, Lock, CheckCircle2, RefreshCw, UserCheck } from "lucide-react";

function EscrowCard() {
  const steps = [
    {
      num: "1",
      title: "Secure Payment",
      desc: "You pay safely via Razorpay UPI, Card, or NetBanking."
    },
    {
      num: "2",
      title: "Held in Escrow",
      desc: "Bookify holds the payment in a secure escrow vault."
    },
    {
      num: "3",
      title: "Seller Dispatches",
      desc: "Seller ships book package with real-time tracking."
    },
    {
      num: "4",
      title: "Inspect & Release",
      desc: "You have 48h to verify book condition before seller is paid."
    }
  ];

  return (
    <div className="rounded-3xl border border-[#E9E4FF] bg-gradient-to-br from-[#F8F7FF] to-[#F0ECFF]/60 p-6 shadow-xs">
      <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#E9E4FF]">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#6C4BF4] text-white shadow-md shadow-[#6C4BF4]/20">
            <Lock size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-extrabold text-[#17152A]">
                Bookify Escrow Protection™
              </h2>
              <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-extrabold text-emerald-800 uppercase tracking-wide">
                Active
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              100% Student Buyer & Seller Protection
            </p>
          </div>
        </div>

        <ShieldCheck size={28} className="text-[#6C4BF4] shrink-0 opacity-80" />
      </div>

      {/* Main Escrow Explanation Statement */}
      <div className="my-4 rounded-2xl bg-white p-4 border border-[#E9E4FF] shadow-xs">
        <p className="text-xs sm:text-sm font-semibold text-[#17152A] leading-relaxed">
          "Your payment is securely held until the order is delivered and the transaction is completed successfully."
        </p>
      </div>

      {/* 3 Core Trust Badges */}
      <div className="grid gap-3 sm:grid-cols-3 mb-5">
        <div className="flex items-center gap-2.5 rounded-xl bg-white/80 p-3 border border-gray-100">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#6C4BF4]/10 text-[#6C4BF4]">
            <Lock size={14} />
          </span>
          <div>
            <h3 className="text-xs font-bold text-[#17152A]">Secure Payment</h3>
            <p className="text-[10px] text-gray-500">256-bit Encrypted</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 rounded-xl bg-white/80 p-3 border border-gray-100">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600">
            <ShieldCheck size={14} />
          </span>
          <div>
            <h3 className="text-xs font-bold text-[#17152A]">Buyer Protection</h3>
            <p className="text-[10px] text-gray-500">48h Inspection Period</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 rounded-xl bg-white/80 p-3 border border-gray-100">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600">
            <UserCheck size={14} />
          </span>
          <div>
            <h3 className="text-xs font-bold text-[#17152A]">Verified Sellers</h3>
            <p className="text-[10px] text-gray-500">College ID Verified</p>
          </div>
        </div>
      </div>

      {/* Escrow Timeline Process */}
      <div className="pt-2">
        <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-3">
          How Escrow Safeguards Your Purchase:
        </p>
        <div className="grid gap-3 sm:grid-cols-4">
          {steps.map((s, idx) => (
            <div key={idx} className="relative rounded-2xl bg-white/70 p-3 border border-gray-100">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#6C4BF4] text-[10px] font-bold text-white">
                  {s.num}
                </span>
                <h3 className="text-xs font-bold text-[#17152A]">{s.title}</h3>
              </div>
              <p className="text-[11px] text-gray-500 leading-snug">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default EscrowCard;
