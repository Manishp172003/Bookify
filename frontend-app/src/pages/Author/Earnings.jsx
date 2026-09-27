import React, { useState, useEffect } from "react";
import { CircleDollarSign, ArrowUpRight, ArrowDownLeft, Wallet, CheckCircle, X, ShieldCheck } from "lucide-react";
import { authorService, isDemoAuthor } from "../../services/authorService";
import { useCommerce } from "../../context/CommerceContext";

function Earnings() {
  const { showToast } = useCommerce();
  const isDemo = isDemoAuthor();

  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [balance, setBalance] = useState(isDemo ? 32680 : 0);
  const [totalEarnings, setTotalEarnings] = useState(isDemo ? 48750 : 0);
  const [totalWithdrawn, setTotalWithdrawn] = useState(isDemo ? 14090 : 0);
  const [escrowPending, setEscrowPending] = useState(isDemo ? 1980 : 0);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [payoutMethod, setPayoutMethod] = useState("UPI");

  const getInitialMonthlyData = (isDemoAccount) => {
    if (isDemoAccount) {
      return [
        { month: "Jan", royalties: 3500, height: 35 },
        { month: "Feb", royalties: 5500, height: 55 },
        { month: "Mar", royalties: 8000, height: 80 },
        { month: "Apr", royalties: 5000, height: 50 },
        { month: "May", royalties: 9000, height: 90 },
        { month: "Jun (Live)", royalties: 7000, height: 70, isCurrent: true },
      ];
    }
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const now = new Date();
    const arr = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const label = i === 0 ? `${monthNames[d.getMonth()]} (Live)` : monthNames[d.getMonth()];
      arr.push({ month: label, royalties: 0, height: 0, isCurrent: i === 0 });
    }
    return arr;
  };

  const [monthlyGrowth, setMonthlyGrowth] = useState(() => getInitialMonthlyData(isDemo));
  const [growthRate, setGrowthRate] = useState(isDemo ? 24 : 0);

  const [payoutDetails, setPayoutDetails] = useState({
    upiId: isDemo ? "rahul.author@oksbi" : "",
    accountName: isDemo ? "Rahul Verma" : "",
    accountNumber: isDemo ? "918237461928" : "",
    ifscCode: isDemo ? "SBIN0004921" : ""
  });

  const [transactions, setTransactions] = useState(
    isDemo
      ? [
          { id: 1, type: "sale", label: "Book Royalties", desc: "The Silent Mind (5 Copies)", amount: "₹2,250", date: "Today", positive: true },
          { id: 2, type: "sale", label: "Book Royalties", desc: "The Silent Mind (Digital Edition)", amount: "₹897", date: "Yesterday", positive: true },
          { id: 3, type: "withdrawal", label: "UPI Payout", desc: "rahul.author@oksbi", amount: "₹5,000", date: "20 May 2026", positive: false },
          { id: 4, type: "sale", label: "Rental Earnings", desc: "The Silent Mind (Weekly Rental)", amount: "₹299", date: "18 May 2026", positive: true }
        ]
      : []
  );

  useEffect(() => {
    let isMounted = true;
    authorService.getEarnings().then((data) => {
      if (!isMounted || !data) return;
      if (data.availableBalance !== undefined) setBalance(data.availableBalance);
      if (data.totalRevenue !== undefined) setTotalEarnings(data.totalRevenue);
      if (data.lifetimePaidOut !== undefined) setTotalWithdrawn(data.lifetimePaidOut);
      if (data.pendingPayout !== undefined) setEscrowPending(data.pendingPayout);
      if (data.monthlyGrowth && data.monthlyGrowth.length > 0) {
        setMonthlyGrowth(data.monthlyGrowth);
      }
      if (data.growthRate !== undefined) {
        setGrowthRate(data.growthRate);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleWithdrawSubmit = async (e) => {
    e.preventDefault();
    const num = Number(withdrawAmount);
    if (!num || num < 100) {
      showToast("Minimum withdrawal is ₹100", "warning");
      return;
    }
    if (num > balance) {
      showToast("Requested amount exceeds available balance", "error");
      return;
    }

    try {
      await authorService.requestPayout(num, payoutMethod, payoutDetails);
    } catch {}

    setBalance((prev) => Math.max(0, prev - num));
    setTotalWithdrawn((prev) => prev + num);
    setTransactions([
      {
        id: Date.now(),
        type: "withdrawal",
        label: `${payoutMethod} Payout Request`,
        desc: payoutMethod === "UPI" ? payoutDetails.upiId : `Bank Transfer · ${payoutDetails.accountNumber.slice(-4)}`,
        amount: `₹${num.toLocaleString()}`,
        date: "Just now",
        positive: false
      },
      ...transactions
    ]);

    setShowWithdrawModal(false);
    setWithdrawAmount("");
    showToast(`Withdrawal request of ₹${num} submitted! Transfer arriving in 24h.`, "success");
  };

  const stats = [
    { label: "Available Balance", value: `₹${balance.toLocaleString()}`, color: "text-[#6C4BF4]", bg: "bg-[#EEEAFE]" },
    { label: "Total Royalties", value: `₹${totalEarnings.toLocaleString()}`, color: "text-[#22C55E]", bg: "bg-[#E8F8EE]" },
    { label: "Total Withdrawn", value: `₹${totalWithdrawn.toLocaleString()}`, color: "text-[#FF8A3D]", bg: "bg-[#FFF0E6]" },
    { label: "Pending (Escrow)", value: `₹${escrowPending.toLocaleString()}`, color: "text-[#38BDF8]", bg: "bg-sky-50" }
  ];

  return (
    <div className="space-y-8 relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#17152A] font-poppins">Earnings & Royalties</h1>
          <p className="text-[#6B6880] mt-1 text-sm">Track your author sales revenue, royalties, and payout transactions.</p>
        </div>
        <button
          type="button"
          onClick={() => setShowWithdrawModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#22C55E] text-white rounded-xl text-sm font-semibold hover:bg-[#1da850] active:scale-95 transition shadow-md self-start cursor-pointer"
        >
          <Wallet size={16} />
          <span>Withdraw Royalties</span>
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl border border-[#E7E4F2] shadow-xs hover:shadow-md transition">
            <span className="text-xs text-[#6B6880] font-semibold uppercase tracking-wider block">{stat.label}</span>
            <span className={`text-3xl font-extrabold ${stat.color} mt-2 block font-poppins`}>{stat.value}</span>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Earnings Chart */}
        <div className="bg-white p-6 rounded-2xl border border-[#E7E4F2] lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-bold text-[#17152A] font-poppins">Monthly Royalty Growth</h2>
              <p className="text-xs text-[#6B6880]">Cumulative payout curve for published manuscripts</p>
            </div>
            {totalEarnings > 0 || (isDemo && totalEarnings > 0) ? (
              <span className="flex items-center gap-1 text-xs font-bold text-[#22C55E] bg-[#E8F8EE] px-2.5 py-1 rounded-full">
                {growthRate >= 0 ? `+${growthRate}% vs last month` : `${growthRate}% vs last month`}
              </span>
            ) : (
              <span className="flex items-center gap-1 text-xs font-semibold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
                ₹0 this month
              </span>
            )}
          </div>
          
          {/* Bar chart visualization */}
          <div className="h-64 bg-[#F8F7FF] rounded-xl p-6 flex flex-col justify-between relative overflow-hidden">
            <svg className="w-full h-40 overflow-visible" viewBox="0 0 500 100" preserveAspectRatio="none">
              {/* Horizontal guide lines */}
              <line x1="15" y1="20" x2="485" y2="20" stroke="#E7E4F2" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
              <line x1="15" y1="50" x2="485" y2="50" stroke="#E7E4F2" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
              <line x1="15" y1="80" x2="485" y2="80" stroke="#E7E4F2" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
              <line x1="15" y1="99" x2="485" y2="99" stroke="#E7E4F2" strokeWidth="1.5" />

              {/* Dynamic or zero-state bars */}
              {monthlyGrowth.map((item, idx) => {
                const x = 20 + idx * 80;
                const maxVal = Math.max(...monthlyGrowth.map((m) => m.royalties || 0), 1);
                const hasAnyRoyalties = totalEarnings > 0 || (isDemo && totalEarnings > 0);
                const isZero = !hasAnyRoyalties || !item.royalties || item.royalties === 0;
                const h = isZero ? 2 : Math.max(8, Math.round(((item.royalties || 0) / maxVal) * 85));
                const y = 100 - h;
                const fill = isZero ? "#D5CFFA" : item.isCurrent ? "#22C55E" : "#6C4BF4";

                return (
                  <g key={idx}>
                    <rect 
                      x={x} 
                      y={y} 
                      width="35" 
                      height={h} 
                      rx={isZero ? "1" : "6"} 
                      fill={fill} 
                      opacity={isZero ? 0.45 : 1}
                    />
                  </g>
                );
              })}
            </svg>

            {!(totalEarnings > 0 || (isDemo && totalEarnings > 0)) && (
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-6">
                <div className="bg-white/95 backdrop-blur-xs border border-[#E7E4F2] px-4 py-2.5 rounded-2xl text-center shadow-xs max-w-xs">
                  <p className="text-xs font-bold text-[#17152A] font-poppins">₹0 Royalties Accumulated</p>
                  <p className="text-[11px] text-[#6B6880] mt-0.5">
                    Monthly bars will rise as your published books generate sales and payouts.
                  </p>
                </div>
              </div>
            )}

            <div className="flex justify-between text-xs font-bold text-[#6B6880] px-3 relative z-10">
              {monthlyGrowth.map((m, idx) => (
                <span key={idx} className={m.isCurrent ? "text-[#22C55E]" : ""}>
                  {m.month}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white p-6 rounded-2xl border border-[#E7E4F2] space-y-6">
          <h2 className="text-lg font-bold text-[#17152A] font-poppins">Recent Ledger</h2>

          <div className="divide-y divide-[#E7E4F2]/50">
            {transactions.length > 0 ? (
              transactions.map((tx) => (
                <div key={tx.id} className="flex justify-between items-center gap-2 py-3.5 first:pt-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl ${tx.positive ? "bg-[#E8F8EE] text-[#22C55E]" : "bg-red-50 text-red-500"}`}>
                      {tx.positive ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#17152A] font-poppins">{tx.label}</h4>
                      <p className="text-xs text-[#6B6880]">{tx.desc}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-sm font-bold block ${tx.positive ? "text-[#22C55E]" : "text-red-600"}`}>
                      {tx.positive ? `+${tx.amount}` : `-${tx.amount}`}
                    </span>
                    <span className="text-[10px] text-gray-400">{tx.date}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-12 text-center text-gray-400 space-y-1.5">
                <CircleDollarSign size={24} className="mx-auto text-gray-300" />
                <p className="text-xs font-bold text-gray-600">No Transactions Yet</p>
                <p className="text-[11px] text-gray-400">Royalty credits and withdrawals will appear here automatically.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal: Withdraw Funds */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-[#E7E4F2] space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-[#E7E4F2]">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-xl bg-[#E8F8EE] text-[#22C55E] flex items-center justify-center">
                  <Wallet size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-[#17152A] font-poppins">Withdraw Royalties</h3>
                  <p className="text-xs text-gray-500">Available: <strong className="text-[#22C55E]">₹{balance.toLocaleString()}</strong></p>
                </div>
              </div>
              <button 
                type="button" 
                onClick={() => setShowWithdrawModal(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleWithdrawSubmit} className="space-y-4">
              {/* Method selector */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPayoutMethod("UPI")}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition cursor-pointer ${
                    payoutMethod === "UPI" ? "border-[#6C4BF4] bg-[#F0ECFF] text-[#6C4BF4]" : "border-gray-200 text-gray-600"
                  }`}
                >
                  ⚡ Instant UPI
                </button>
                <button
                  type="button"
                  onClick={() => setPayoutMethod("Bank Account")}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition cursor-pointer ${
                    payoutMethod === "Bank Account" ? "border-[#6C4BF4] bg-[#F0ECFF] text-[#6C4BF4]" : "border-gray-200 text-gray-600"
                  }`}
                >
                  🏦 Bank Transfer (NEFT)
                </button>
              </div>

              {/* Amount */}
              <div>
                <label className="block text-xs font-bold text-[#17152A] uppercase tracking-wider mb-1.5">Amount (₹)</label>
                <input
                  type="number"
                  placeholder="e.g. 5000"
                  max={balance}
                  min="100"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-[#F8F7FF] py-3 px-4 text-sm font-bold outline-none focus:border-[#6C4BF4]"
                  required
                />
                <div className="flex gap-2 mt-2">
                  {[500, 1000, 2500, balance].map((amt, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setWithdrawAmount(amt.toString())}
                      className="px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-[#EEEAFE] text-[11px] font-bold text-gray-700 hover:text-[#6C4BF4] transition cursor-pointer"
                    >
                      {amt === balance ? "Max All" : `₹${amt}`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Details */}
              {payoutMethod === "UPI" ? (
                <div>
                  <label className="block text-xs font-bold text-[#17152A] uppercase tracking-wider mb-1.5">UPI ID</label>
                  <input
                    type="text"
                    value={payoutDetails.upiId}
                    onChange={(e) => setPayoutDetails({ ...payoutDetails, upiId: e.target.value })}
                    placeholder="yourname@bank"
                    className="w-full rounded-xl border border-gray-200 bg-[#F8F7FF] py-2.5 px-4 text-xs outline-none focus:border-[#6C4BF4]"
                    required
                  />
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-[#17152A] uppercase tracking-wider mb-1">Account Holder Name</label>
                    <input
                      type="text"
                      value={payoutDetails.accountName}
                      onChange={(e) => setPayoutDetails({ ...payoutDetails, accountName: e.target.value })}
                      className="w-full rounded-xl border border-gray-200 bg-[#F8F7FF] py-2 px-3 text-xs outline-none focus:border-[#6C4BF4]"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-bold text-[#17152A] uppercase tracking-wider mb-1">Account Number</label>
                      <input
                        type="text"
                        value={payoutDetails.accountNumber}
                        onChange={(e) => setPayoutDetails({ ...payoutDetails, accountNumber: e.target.value })}
                        className="w-full rounded-xl border border-gray-200 bg-[#F8F7FF] py-2 px-3 text-xs outline-none focus:border-[#6C4BF4]"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#17152A] uppercase tracking-wider mb-1">IFSC Code</label>
                      <input
                        type="text"
                        value={payoutDetails.ifscCode}
                        onChange={(e) => setPayoutDetails({ ...payoutDetails, ifscCode: e.target.value })}
                        className="w-full rounded-xl border border-gray-200 bg-[#F8F7FF] py-2 px-3 text-xs outline-none focus:border-[#6C4BF4]"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t border-[#E7E4F2]">
                <button
                  type="button"
                  onClick={() => setShowWithdrawModal(false)}
                  className="px-5 py-2.5 border border-gray-200 text-gray-700 rounded-xl text-xs font-bold hover:bg-gray-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#22C55E] text-white rounded-xl text-xs font-bold hover:bg-[#1da850] transition shadow-md cursor-pointer"
                >
                  Confirm Payout
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Earnings;
