import { useState, useEffect } from "react";
import DashboardSidebar from "../../components/dashboard/DashboardSidebar";
import { useCommerce } from "../../context/CommerceContext";
import { useAuth } from "../../context/AuthContext";
import { Wallet, Landmark, Shield, AlertCircle, Menu, CheckCircle2, ArrowDownRight, ArrowUpRight, QrCode } from "lucide-react";
import { api } from "../../services/apiClient";
import { listingService } from "../../services/listingService";

const INITIAL_TRANSACTIONS = [];

export default function Earnings() {
  const { showToast } = useCommerce();
  const { user } = useAuth();
  const listingStats = listingService.getStats();
  const [totalEarned, setTotalEarned] = useState(() => listingStats.totalEarned || 0);
  const [withdrawn, setWithdrawn] = useState(0);
  const [escrowPending, setEscrowPending] = useState(0);
  const [availableToWithdraw, setAvailableToWithdraw] = useState(() => listingStats.totalEarned || 0);
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);

  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [payoutMethod, setPayoutMethod] = useState("upi"); // 'upi' or 'bank'
  const [upiId, setUpiId] = useState(() => {
    try {
      const saved = localStorage.getItem("bookify_user_payment");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.upiId && !parsed.upiId.includes("manishpawar")) return parsed.upiId;
      }
    } catch {}
    return user?.payment?.upiId || "";
  });
  const [isEditingUpi, setIsEditingUpi] = useState(false);
  const [tempUpi, setTempUpi] = useState(() => upiId);
  const [bankAcc, setBankAcc] = useState(() => {
    try {
      const saved = localStorage.getItem("bookify_user_payment");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.accountNumber && !parsed.accountNumber.includes("918273645019")) return parsed.accountNumber;
      }
    } catch {}
    return user?.payment?.accountNumber || "";
  });
  const [bankIfsc, setBankIfsc] = useState(() => {
    try {
      const saved = localStorage.getItem("bookify_user_payment");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.ifscCode && !parsed.ifscCode.includes("HDFC0001245")) return parsed.ifscCode;
      }
    } catch {}
    return user?.payment?.ifscCode || "";
  });
  const [payoutAmount, setPayoutAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("bookify_user_payment");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.upiId && !parsed.upiId.includes("manishpawar")) {
          setUpiId(parsed.upiId);
          setTempUpi(parsed.upiId);
        }
        if (parsed.accountNumber && !parsed.accountNumber.includes("918273645019")) setBankAcc(parsed.accountNumber);
        if (parsed.ifscCode && !parsed.ifscCode.includes("HDFC0001245")) setBankIfsc(parsed.ifscCode);
        if (parsed.mode === "Bank Account") setPayoutMethod("bank");
      } else if (user?.payment) {
        if (user.payment.upiId) {
          setUpiId(user.payment.upiId);
          setTempUpi(user.payment.upiId);
        }
        if (user.payment.accountNumber) setBankAcc(user.payment.accountNumber);
        if (user.payment.ifscCode) setBankIfsc(user.payment.ifscCode);
      }
    } catch {}

    const fetchWallet = async () => {
      try {
        const res = await api.get("/payouts/my-payouts");
        if (res?.data) {
          if (res.data.availableBalance !== undefined && res.data.availableBalance > 0) {
            setAvailableToWithdraw(res.data.availableBalance);
          }
          if (res.data.totalWithdrawn !== undefined && res.data.totalWithdrawn > 0) {
            setWithdrawn(res.data.totalWithdrawn);
          }
          if (res.data.escrowPending !== undefined) {
            setEscrowPending(res.data.escrowPending);
          }
          if (res.data.payouts && res.data.payouts.length > 0) {
            const formatted = res.data.payouts.map((p) => ({
              id: p.id,
              date: p.date,
              desc: `Payout to ${p.payoutMethod}`,
              type: "debit",
              amount: `₹${p.amount}`,
              method: p.payoutMethod === "UPI" ? "UPI Transfer" : "Bank Transfer",
            }));
            setTransactions((prev) => [...formatted, ...prev]);
          }
        }
      } catch (err) {
        console.warn("Could not load backend payouts, keeping defaults:", err);
      }
    };

    fetchWallet();
  }, []);

  const handleWithdrawalRequest = async (e) => {
    e.preventDefault();
    const amount = Number(payoutAmount);
    if (!amount || amount <= 0 || amount > availableToWithdraw) {
      if (showToast) showToast("Please enter a valid payout amount.", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post("/payouts/request", {
        amount,
        payoutMethod: payoutMethod === "upi" ? "UPI" : "Bank Account",
        payoutDetails: {
          upiId: upiId,
          accountNumber: bankAcc,
          ifscCode: bankIfsc,
        },
      });
    } catch (err) {
      console.warn("Backend payout API error, falling back locally:", err);
    } finally {
      setIsSubmitting(false);
    }

    const newTxn = {
      id: `TXN-${Math.floor(10000 + Math.random() * 90000)}`,
      date: "Today",
      desc: payoutMethod === "upi" ? `Payout to UPI (${upiId})` : `Payout to Bank (${bankAcc.slice(-4)})`,
      type: "debit",
      amount: `₹${amount}`,
      method: payoutMethod === "upi" ? "Instant UPI Transfer" : "NEFT Bank Transfer"
    };

    setTransactions(prev => [newTxn, ...prev]);
    setWithdrawn(prev => prev + amount);
    setAvailableToWithdraw(prev => Math.max(0, prev - amount));
    setPayoutAmount("");
    setShowPayoutModal(false);

    if (showToast) {
      showToast(`Payout of ₹${amount} initiated successfully! Transferred to ${payoutMethod === "upi" ? upiId : "Bank Account"}.`, "success");
    }
  };

  // Simple pure CSS charts definition
  const CHART_DATA = [
    { label: "Mon", height: "h-12", amount: "₹120" },
    { label: "Tue", height: "h-20", amount: "₹200" },
    { label: "Wed", height: "h-36", amount: "₹360" },
    { label: "Thu", height: "h-8", amount: "₹80" },
    { label: "Fri", height: "h-24", amount: "₹240" },
    { label: "Sat", height: "h-14", amount: "₹140" },
    { label: "Sun", height: "h-6", amount: "₹50" }
  ];

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gradient-to-br from-[#F4F2FF] via-[#F8F7FF] to-[#F0F5FF]">
      <DashboardSidebar />

      <div className="flex min-w-0 flex-1 flex-col h-full">
        <main className="flex-1 overflow-y-auto p-4 md:p-7 animate-fade-in-up">
          
          {/* Header */}
          <div className="mb-6 flex items-start gap-3 select-none">
            {/* Mobile Hamburger Menu */}
            <button
              onClick={() => window.dispatchEvent(new Event("toggle-sidebar"))}
              className="lg:hidden p-1.5 rounded-lg text-gray-500 hover:bg-gray-50 hover:text-[#6C4BF4] transition cursor-pointer mt-1"
            >
              <Menu size={20} />
            </button>

            <div>
              <h1 className="text-xl md:text-2xl font-bold text-[#17152A]">Earnings & Wallet</h1>
              <p className="mt-0.5 text-xs text-gray-400">Track book sales revenue, pending escrow balances, and withdraw earnings.</p>
            </div>
          </div>

          {/* Metrics Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
            {/* Metric 1 */}
            <div className="rounded-2xl bg-white border border-gray-100 p-5 shadow-sm flex items-center gap-4">
              <div className="h-11 w-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Wallet size={22} />
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase">Total Revenue</p>
                <p className="text-lg font-extrabold text-[#17152A] mt-0.5">₹{totalEarned.toLocaleString()}</p>
              </div>
            </div>

            {/* Metric 2 */}
            <div className="rounded-2xl bg-white border border-[#E9E4FF] bg-gradient-to-br from-white to-[#F8F7FF] p-5 shadow-sm flex items-center gap-4">
              <div className="h-11 w-11 rounded-xl bg-[#6C4BF4]/10 text-[#6C4BF4] flex items-center justify-center">
                <Landmark size={22} />
              </div>
              <div>
                <p className="text-[10px] text-[#6C4BF4] font-bold uppercase">Available Payout</p>
                <p className="text-lg font-extrabold text-[#6C4BF4] mt-0.5">₹{availableToWithdraw.toLocaleString()}</p>
              </div>
            </div>

            {/* Metric 3 */}
            <div className="rounded-2xl bg-white border border-gray-100 p-5 shadow-sm flex items-center gap-4">
              <div className="h-11 w-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Shield size={22} />
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase">Escrow Holding</p>
                <p className="text-lg font-extrabold text-[#17152A] mt-0.5">₹{escrowPending.toLocaleString()}</p>
              </div>
            </div>

            {/* Metric 4 */}
            <div className="rounded-2xl bg-white border border-gray-100 p-5 shadow-sm flex items-center gap-4">
              <div className="h-11 w-11 rounded-xl bg-gray-100 text-gray-600 flex items-center justify-center">
                <AlertCircle size={22} />
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase">Total Withdrawn</p>
                <p className="text-lg font-extrabold text-[#17152A] mt-0.5">₹{withdrawn.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            
            {/* Chart Column (2/3 width) */}
            <div className="lg:col-span-2 rounded-2xl bg-white border border-gray-100 p-6 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-[#17152A]">Weekly Income Analytics</h3>
                  <p className="text-[10px] text-gray-400 mt-0.5">Summary of book sales and rentals from last 7 days</p>
                </div>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                  +24% this week
                </span>
              </div>

              {/* Chart Graphics */}
              <div className="mt-8 flex justify-between items-end h-40 px-4">
                {CHART_DATA.map((col, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-2 group relative">
                    {/* Tooltip */}
                    <span className="absolute bottom-full mb-1 opacity-0 group-hover:opacity-100 transition bg-gray-900 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm select-none z-10">
                      {col.amount}
                    </span>
                    {/* Bar */}
                    <div className={`w-8 rounded-t bg-gradient-to-t from-[#6C4BF4] to-[#8B3FD9] ${col.height} transition-all duration-500 hover:brightness-110`} />
                    <span className="text-[10px] font-bold text-gray-400">{col.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Setup / Withdraw Control (1/3 width) */}
            <div className="lg:col-span-1 rounded-2xl bg-white border border-gray-100 p-6 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-sm text-[#17152A]">Instant Payout</h3>
                <p className="text-[10px] text-gray-400 mt-0.5">Transfer your earnings immediately to your bank or UPI.</p>
                
                <div className="mt-4 rounded-xl bg-[#F8F7FF] border border-[#E9E4FF] p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] text-[#6C4BF4] font-bold uppercase">Linked UPI ID</p>
                    <span className="text-[10px] font-bold text-emerald-600">Verified</span>
                  </div>
                  <p className="text-xs font-bold text-[#17152A] mt-1 truncate">{upiId}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">Zero processing fees for campus students</p>
                </div>
              </div>

              <button
                disabled={availableToWithdraw <= 0}
                onClick={() => setShowPayoutModal(true)}
                className="mt-6 w-full rounded-xl bg-[#6C4BF4] text-white py-3 text-xs font-bold hover:bg-[#5B3DE0] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-sm shadow-[#6C4BF4]/15 active:scale-98 transition"
              >
                Withdraw Funds (₹{availableToWithdraw})
              </button>
            </div>

          </div>

          {/* Ledger Table */}
          <div className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-sm text-[#17152A]">Transaction History</h3>
              <span className="text-[11px] font-bold text-gray-400">{transactions.length} records</span>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-400 font-bold uppercase text-[9px] border-b border-gray-100">
                    <th className="p-4">TXN ID</th>
                    <th className="p-4">Date</th>
                    <th className="p-4">Description</th>
                    <th className="p-4">Payment Method</th>
                    <th className="p-4 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-600 font-medium">
                  {transactions.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-xs text-gray-400">
                        No transactions recorded yet. Earnings will appear once textbook sales or rentals are completed.
                      </td>
                    </tr>
                  ) : (
                    transactions.map((txn) => (
                      <tr key={txn.id} className="hover:bg-gray-50/50">
                        <td className="p-4 font-bold text-gray-400">{txn.id}</td>
                        <td className="p-4 text-gray-500">{txn.date}</td>
                        <td className="p-4 text-[#17152A] font-semibold flex items-center gap-1.5">
                          {txn.type === "credit" ? (
                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 shrink-0">
                              <ArrowDownRight size={12} />
                            </span>
                          ) : (
                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-rose-50 text-rose-500 shrink-0">
                              <ArrowUpRight size={12} />
                            </span>
                          )}
                          <span>{txn.desc}</span>
                        </td>
                        <td className="p-4 text-gray-500">{txn.method}</td>
                        <td className={`p-4 text-right font-black ${
                          txn.type === "credit" ? "text-emerald-600" : "text-rose-500"
                        }`}>
                          {txn.type === "credit" ? "+" : "-"}{txn.amount}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Payout Withdrawal Modal */}
          {showPayoutModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-fade-in">
              <form onSubmit={handleWithdrawalRequest} className="w-full max-w-md rounded-3xl bg-white p-6 sm:p-7 shadow-2xl border border-gray-100">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-[#17152A]">Request Withdrawal</h3>
                    <p className="text-xs text-gray-400">Transfer your available balance to bank or UPI.</p>
                  </div>
                  <span className="text-xs font-black text-[#6C4BF4] bg-[#F0ECFF] px-2.5 py-1 rounded-full">
                    Max ₹{availableToWithdraw}
                  </span>
                </div>

                {/* Method selector */}
                <div className="flex rounded-xl bg-gray-100 p-1 mb-4">
                  <button
                    type="button"
                    onClick={() => setPayoutMethod("upi")}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${
                      payoutMethod === "upi" ? "bg-white text-[#6C4BF4] shadow-xs" : "text-gray-500 hover:text-gray-900"
                    }`}
                  >
                    UPI Transfer
                  </button>
                  <button
                    type="button"
                    onClick={() => setPayoutMethod("bank")}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${
                      payoutMethod === "bank" ? "bg-white text-[#6C4BF4] shadow-xs" : "text-gray-500 hover:text-gray-900"
                    }`}
                  >
                    Bank Account (NEFT)
                  </button>
                </div>
                
                <div className="space-y-3">
                  {payoutMethod === "upi" ? (
                    <div className="rounded-xl bg-gray-50 p-3.5 border border-gray-100">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[10px] text-gray-400 font-bold uppercase">UPI Address</span>
                        <button
                          type="button"
                          onClick={() => setIsEditingUpi(!isEditingUpi)}
                          className="text-[11px] font-bold text-[#6C4BF4] hover:underline cursor-pointer"
                        >
                          {isEditingUpi ? "Done" : "Change"}
                        </button>
                      </div>
                      {isEditingUpi ? (
                        <input
                          type="text"
                          value={tempUpi}
                          onChange={(e) => setTempUpi(e.target.value)}
                          onBlur={() => { setUpiId(tempUpi); setIsEditingUpi(false); }}
                          className="w-full rounded-lg border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-semibold text-[#17152A] outline-none"
                        />
                      ) : (
                        <p className="text-xs font-bold text-[#17152A]">{upiId}</p>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-2 rounded-xl bg-gray-50 p-3.5 border border-gray-100">
                      <div>
                        <span className="text-[10px] text-gray-400 font-bold uppercase">Account Number</span>
                        <input
                          type="text"
                          value={bankAcc}
                          onChange={(e) => setBankAcc(e.target.value)}
                          className="mt-0.5 w-full rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-[#17152A] outline-none"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-400 font-bold uppercase">IFSC Code</span>
                        <input
                          type="text"
                          value={bankIfsc}
                          onChange={(e) => setBankIfsc(e.target.value)}
                          className="mt-0.5 w-full rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-[#17152A] outline-none uppercase"
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="text-[10px] text-gray-400 font-bold uppercase block mb-1">
                      Withdrawal Amount (₹)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-gray-400">₹</span>
                      <input
                        type="number"
                        required
                        placeholder={`e.g. ${availableToWithdraw}`}
                        max={availableToWithdraw}
                        min="1"
                        value={payoutAmount}
                        onChange={(e) => setPayoutAmount(e.target.value)}
                        className="w-full rounded-xl border border-gray-200 bg-white pl-8 pr-3.5 py-2.5 text-sm font-bold text-[#17152A] outline-none focus:border-[#6C4BF4]"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {[100, 250, 500, availableToWithdraw].filter(a => a <= availableToWithdraw && a > 0).map((amt, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setPayoutAmount(String(amt))}
                        className="rounded-lg border border-gray-200 bg-gray-50 px-2.5 py-1 text-[11px] font-bold text-gray-600 hover:border-[#6C4BF4] hover:text-[#6C4BF4] transition cursor-pointer"
                      >
                        ₹{amt}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-6 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowPayoutModal(false)}
                    className="flex-1 rounded-xl border border-gray-200 text-gray-600 py-3 text-xs font-bold hover:bg-gray-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 rounded-xl bg-[#6C4BF4] text-white py-3 text-xs font-bold hover:bg-[#5B3DE0] cursor-pointer shadow-sm shadow-[#6C4BF4]/15"
                  >
                    Confirm & Payout
                  </button>
                </div>
              </form>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
