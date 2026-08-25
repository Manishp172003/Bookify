import React, { useState } from "react";
import { CircleDollarSign, ArrowUpRight, ArrowDownLeft, Wallet, CheckCircle } from "lucide-react";

function Earnings() {
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [balance, setBalance] = useState(12480);
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);

  const stats = [
    { label: "Available Balance", value: `₹${balance.toLocaleString()}`, color: "text-[#6C4BF4]", bg: "bg-[#EEEAFE]" },
    { label: "Total Earnings", value: "₹32,680", color: "text-[#22C55E]", bg: "bg-[#E8F8EE]" },
    { label: "Total Withdrawn", value: "₹20,200", color: "text-[#FF8A3D]", bg: "bg-[#FFF0E6]" },
    { label: "Pending (Escrow)", value: "₹1,980", color: "text-[#38BDF8]", bg: "bg-sky-50" }
  ];

  const transactions = [
    { id: 1, type: "sale", label: "Book Sale", desc: "The Silent Mind", amount: "₹450", date: "24 May 2026", positive: true },
    { id: 2, type: "payout", label: "Campaign Payout", desc: "Search Boost", amount: "₹1,200", date: "22 May 2026", positive: false },
    { id: 3, type: "withdrawal", label: "Withdrawal", desc: "Bank Account Transfer", amount: "₹2,000", date: "20 May 2026", positive: false },
    { id: 4, type: "sale", label: "Book Sale", desc: "Inner Peace", amount: "₹300", date: "19 May 2026", positive: true }
  ];

  const handleWithdrawSubmit = (e) => {
    e.preventDefault();
    setBalance(0);
    setWithdrawSuccess(true);
    setTimeout(() => {
      setShowWithdrawModal(false);
      setWithdrawSuccess(false);
    }, 2000);
  };

  return (
    <div className="space-y-8 relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#17152A] font-poppins">Earnings</h1>
          <p className="text-[#6B6880] mt-1 text-sm">Track your sales revenue, campaign spends, and withdrawals.</p>
        </div>
        <button
          onClick={() => setShowWithdrawModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#22C55E] text-white rounded-xl text-sm font-semibold hover:bg-[#1da850] transition shadow-md self-start"
        >
          <Wallet size={16} />
          <span>Withdraw Funds</span>
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl border border-[#E7E4F2] shadow-sm">
            <span className="text-xs text-[#6B6880] font-semibold uppercase tracking-wider block">{stat.label}</span>
            <span className={`text-3xl font-extrabold ${stat.color} mt-2 block font-poppins`}>{stat.value}</span>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Earnings Chart */}
        <div className="bg-white p-6 rounded-2xl border border-[#E7E4F2] lg:col-span-2 space-y-6">
          <h2 className="text-lg font-bold text-[#17152A] font-poppins">Earnings Overview</h2>
          
          {/* Custom SVG Bar Chart */}
          <div className="h-64 bg-[#F8F7FF] rounded-xl p-6 flex flex-col justify-between">
            <svg className="w-full h-40 overflow-visible" viewBox="0 0 500 100" preserveAspectRatio="none">
              <rect x="20" y="65" width="35" height="35" rx="4" fill="#6C4BF4" className="hover:fill-[#FF8A3D] transition-colors" />
              <rect x="100" y="45" width="35" height="55" rx="4" fill="#6C4BF4" className="hover:fill-[#FF8A3D] transition-colors" />
              <rect x="180" y="20" width="35" height="80" rx="4" fill="#6C4BF4" className="hover:fill-[#FF8A3D] transition-colors" />
              <rect x="260" y="55" width="35" height="45" rx="4" fill="#6C4BF4" className="hover:fill-[#FF8A3D] transition-colors" />
              <rect x="340" y="5" width="35" height="95" rx="4" fill="#6C4BF4" className="hover:fill-[#FF8A3D] transition-colors" />
              <rect x="420" y="40" width="35" height="60" rx="4" fill="#6C4BF4" className="hover:fill-[#FF8A3D] transition-colors" />
            </svg>
            <div className="flex justify-between text-[10px] font-bold text-[#6B6880] px-4">
              <span>Jan</span>
              <span>Feb</span>
              <span>Mar</span>
              <span>Apr</span>
              <span>May</span>
              <span>Jun</span>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white p-6 rounded-2xl border border-[#E7E4F2] space-y-6">
          <h2 className="text-lg font-bold text-[#17152A] font-poppins font-poppins">Recent Transactions</h2>

          <div className="divide-y divide-[#E7E4F2]/50">
            {transactions.map((tx) => (
              <div key={tx.id} className="flex justify-between items-center py-3.5 first:pt-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl ${tx.positive ? "bg-[#E8F8EE] text-[#22C55E]" : "bg-red-50 text-red-500"}`}>
                    {tx.positive ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#17152A] font-poppins">{tx.label}</h4>
                    <p className="text-xs text-[#6B6880] mt-0.5">{tx.desc}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-sm font-bold ${tx.positive ? "text-[#22C55E]" : "text-red-500"}`}>
                    {tx.positive ? "+" : "-"}{tx.amount}
                  </span>
                  <p className="text-[10px] text-[#6B6880] mt-0.5">{tx.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* WITHDRAW MODAL */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 bg-[#17152A]/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-3xl max-w-md w-full border border-[#E7E4F2] shadow-2xl space-y-5">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-[#17152A] font-poppins">Withdraw Funds</h3>
              <button onClick={() => setShowWithdrawModal(false)} className="text-[#6B6880] hover:text-black">
                ✕
              </button>
            </div>
            
            {withdrawSuccess ? (
              <div className="text-center py-6 space-y-3">
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#E8F8EE] text-[#22C55E] mb-2">
                  <CheckCircle size={32} />
                </div>
                <h4 className="text-lg font-bold text-[#17152A]">Transfer Initiated!</h4>
                <p className="text-xs text-[#6B6880]">Funds will be deposited into your bank account shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleWithdrawSubmit} className="space-y-4">
                <div className="bg-[#F8F7FF] p-4 rounded-xl border border-[#E7E4F2]/50">
                  <span className="text-xs text-[#6B6880] block">Available to Withdraw</span>
                  <span className="text-2xl font-extrabold text-[#17152A]">₹{balance.toLocaleString()}</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#17152A] uppercase tracking-wider mb-2">Select Bank Account</label>
                  <select className="w-full rounded-xl border border-gray-200 bg-[#F8F7FF] py-3 px-4 text-sm outline-none focus:border-[#6C4BF4]">
                    <option>HDFC Bank - xxxx 4829</option>
                    <option>SBI Bank - xxxx 1928</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#17152A] uppercase tracking-wider mb-2">Withdrawal Amount (INR)</label>
                  <input 
                    type="number" 
                    max={balance} 
                    defaultValue={balance} 
                    className="w-full rounded-xl border border-gray-200 bg-[#F8F7FF] py-3 px-4 text-sm outline-none focus:border-[#6C4BF4]"
                    required
                  />
                </div>

                <div className="pt-2 flex gap-3 justify-end">
                  <button 
                    type="button" 
                    onClick={() => setShowWithdrawModal(false)}
                    className="px-4 py-2 text-sm font-semibold text-[#6B6880] hover:bg-gray-100 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-5 py-2.5 bg-[#22C55E] text-white rounded-xl text-sm font-semibold hover:bg-[#1da850] transition shadow-md shadow-[#22C55E]/20"
                  >
                    Confirm Withdrawal
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Earnings;
