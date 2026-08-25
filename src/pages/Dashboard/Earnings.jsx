import { useState } from "react";
import DashboardSidebar from "../../components/dashboard/DashboardSidebar";
import { Wallet, Landmark, Shield, AlertCircle } from "lucide-react";

const TRANSACTION_HISTORY = [
  { id: "TXN-00192", date: "24 Aug 2026", desc: "Sold Introduction to Algorithms", type: "credit", amount: "₹650", method: "Wallet Credit" },
  { id: "TXN-00154", date: "18 Aug 2026", desc: "Sold Cracking the Coding Interview", type: "credit", amount: "₹450", method: "Wallet Credit" },
  { id: "TXN-00120", date: "15 Aug 2026", desc: "Requested Payout to Bank Account", type: "debit", amount: "₹1,000", method: "Bank Transfer" },
  { id: "TXN-00098", date: "10 Aug 2026", desc: "Rental Deposit Refunded", type: "debit", amount: "₹300", method: "UPI Refund" }
];

export default function Earnings() {
  const [totalEarned] = useState(1100);
  const [withdrawn, setWithdrawn] = useState(1000);
  const [escrowPending] = useState(650);
  
  const [availableToWithdraw, setAvailableToWithdraw] = useState(100);

  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [upiId, setUpiId] = useState("manishpawar@okaxis");
  const [payoutAmount, setPayoutAmount] = useState("");

  const handleWithdrawalRequest = (e) => {
    e.preventDefault();
    const amount = Number(payoutAmount);
    if (!amount || amount <= 0 || amount > availableToWithdraw) {
      alert("Invalid payout amount.");
      return;
    }

    alert(`Payout of ₹${amount} initiated successfully to UPI: ${upiId}!`);
    setWithdrawn(prev => prev + amount);
    setAvailableToWithdraw(prev => prev - amount);
    setPayoutAmount("");
    setShowPayoutModal(false);
  };

  // Simple pure CSS charts definition
  const CHART_DATA = [
    { label: "Mon", height: "h-12", amount: "₹120" },
    { label: "Tue", height: "h-20", amount: "₹200" },
    { label: "Wed", height: "h-36", amount: "₹360" },
    { label: "Thu", height: "h-8", amount: "₹80" },
    { label: "Fri", height: "h-24", amount: "₹240" },
    { label: "Sat", height: "h-14", amount: "₹140" },
    { label: "Sun", height: "h-0", amount: "₹0" }
  ];

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gradient-to-br from-[#F4F2FF] via-[#F8F7FF] to-[#F0F5FF]">
      <DashboardSidebar />

      <div className="flex min-w-0 flex-1 flex-col h-full">
        <main className="flex-1 overflow-y-auto p-7 animate-fade-in-up">
          
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-[#17152A]">Earnings & Wallet</h1>
            <p className="text-sm text-gray-500">Track book sales revenue, pending escrow balances, and withdraw earnings.</p>
          </div>

          {/* Metrics Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {/* Metric 1 */}
            <div className="rounded-2xl bg-white border border-gray-100 p-5 shadow-sm flex items-center gap-4">
              <div className="h-10 w-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
                <Wallet size={20} />
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase">Total Earned</p>
                <p className="text-lg font-extrabold text-[#17152A] mt-0.5">₹{totalEarned}</p>
              </div>
            </div>

            {/* Metric 2 */}
            <div className="rounded-2xl bg-white border border-gray-100 p-5 shadow-sm flex items-center gap-4">
              <div className="h-10 w-10 rounded-xl bg-[#6C4BF4]/5 text-[#6C4BF4] flex items-center justify-center">
                <Landmark size={20} />
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase">Available Payout</p>
                <p className="text-lg font-extrabold text-[#17152A] mt-0.5">₹{availableToWithdraw}</p>
              </div>
            </div>

            {/* Metric 3 */}
            <div className="rounded-2xl bg-white border border-gray-100 p-5 shadow-sm flex items-center gap-4">
              <div className="h-10 w-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Shield size={20} />
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase">Escrow Locked</p>
                <p className="text-lg font-extrabold text-[#17152A] mt-0.5">₹{escrowPending}</p>
              </div>
            </div>

            {/* Metric 4 */}
            <div className="rounded-2xl bg-white border border-gray-100 p-5 shadow-sm flex items-center gap-4">
              <div className="h-10 w-10 rounded-xl bg-gray-50 text-gray-500 flex items-center justify-center">
                <AlertCircle size={20} />
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase">Withdrawn</p>
                <p className="text-lg font-extrabold text-[#17152A] mt-0.5">₹{withdrawn}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            
            {/* Chart Column (2/3 width) */}
            <div className="lg:col-span-2 rounded-2xl bg-white border border-gray-100 p-6 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-sm text-[#17152A]">Weekly Income Analytics</h3>
                <p className="text-[10px] text-gray-400 mt-0.5">Summary of book sales and rentals from last 7 days</p>
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
                    <div className={`w-8 rounded-t bg-gradient-to-t from-[#6C4BF4] to-[#8B3FD9] ${col.height} transition-all duration-500`} />
                    <span className="text-[10px] font-bold text-gray-400">{col.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Setup / Withdraw Control (1/3 width) */}
            <div className="lg:col-span-1 rounded-2xl bg-white border border-gray-100 p-6 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-sm text-[#17152A]">Instant Payout</h3>
                <p className="text-[10px] text-gray-400 mt-0.5">Transfer your earnings immediately to your bank.</p>
                
                <div className="mt-5 rounded-xl bg-gray-50 border border-gray-100 p-4">
                  <p className="text-[9px] text-gray-400 font-bold uppercase">Linked UPI Address</p>
                  <p className="text-xs font-bold text-[#17152A] mt-1">{upiId}</p>
                </div>
              </div>

              <button
                disabled={availableToWithdraw <= 0}
                onClick={() => setShowPayoutModal(true)}
                className="mt-6 w-full rounded-xl bg-[#6C4BF4] text-white py-3 text-xs font-bold hover:bg-[#5B3DE0] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-sm shadow-[#6C4BF4]/15"
              >
                Withdraw Funds
              </button>
            </div>

          </div>

          {/* Ledger Table */}
          <div className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <h3 className="font-bold text-sm text-[#17152A]">Transaction History</h3>
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
                  {TRANSACTION_HISTORY.map((txn) => (
                    <tr key={txn.id} className="hover:bg-gray-50/50">
                      <td className="p-4 font-bold text-gray-400">{txn.id}</td>
                      <td className="p-4">{txn.date}</td>
                      <td className="p-4 text-[#17152A] font-semibold">{txn.desc}</td>
                      <td className="p-4">{txn.method}</td>
                      <td className={`p-4 text-right font-bold ${
                        txn.type === "credit" ? "text-green-600" : "text-red-500"
                      }`}>
                        {txn.type === "credit" ? "+" : "-"}{txn.amount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Payout Modal */}
          {showPayoutModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-fade-in">
              <form onSubmit={handleWithdrawalRequest} className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-gray-100">
                <h3 className="text-lg font-bold text-[#17152A] mb-1">Request Withdrawal</h3>
                <p className="text-xs text-gray-400 mb-4">Transfer cash to your linked UPI address.</p>
                
                <div className="space-y-4">
                  <div className="rounded-xl bg-gray-50 p-3.5 border border-gray-100 flex justify-between">
                    <div>
                      <p className="text-[9px] text-gray-400 font-bold uppercase">UPI Target</p>
                      <p className="text-xs font-bold text-[#17152A] mt-0.5">{upiId}</p>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => { const newUpi = prompt("Enter new UPI ID:", upiId); if (newUpi) setUpiId(newUpi); }} 
                      className="text-xs font-bold text-[#6C4BF4] hover:underline"
                    >
                      Change
                    </button>
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-400 font-bold uppercase block mb-1">Withdrawal Amount (₹)</label>
                    <input
                      type="number"
                      required
                      placeholder={`Max ₹${availableToWithdraw}`}
                      max={availableToWithdraw}
                      min="1"
                      value={payoutAmount}
                      onChange={(e) => setPayoutAmount(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-xs text-[#17152A] outline-none focus:border-[#6C4BF4]"
                    />
                  </div>
                </div>

                <div className="mt-6 flex gap-2">
                  <button
                    type="submit"
                    className="flex-grow rounded-xl bg-[#6C4BF4] text-white py-3 text-xs font-bold hover:bg-[#5B3DE0] cursor-pointer"
                  >
                    Confirm & Transfer
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowPayoutModal(false)}
                    className="rounded-xl border border-gray-200 text-gray-500 px-5 py-3 text-xs font-bold hover:bg-gray-55 cursor-pointer"
                  >
                    Cancel
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
