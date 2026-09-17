import { useState } from "react";
import { Link } from "react-router-dom";
import DashboardSidebar from "../../components/dashboard/DashboardSidebar";
import { useCommerce } from "../../context/CommerceContext";
import { ShoppingBag, Eye, Download, HelpCircle, CheckCircle2, Truck, Clock, Menu } from "lucide-react";

const SEED_ORDERS = [
  {
    id: "ORD-98725",
    title: "Introduction to Algorithms, 3rd Edition",
    author: "Thomas H. Cormen",
    price: "₹650",
    date: "24 Aug 2026",
    status: "Meetup Scheduled",
    statusColor: "text-amber-600 bg-amber-50 border-amber-100",
    coverClass: "from-[#111827] to-[#374151]",
    step: 2,
    seller: {
      name: "Sneha Reddy",
      phone: "+91 98765 12345",
      meetup: "Central Library Ground Floor, 4:00 PM Wednesday"
    }
  },
  {
    id: "ORD-82710",
    title: "Cracking the Coding Interview",
    author: "Gayle Laakmann McDowell",
    price: "₹450",
    date: "18 Aug 2026",
    status: "Completed",
    statusColor: "text-green-600 bg-green-50 border-green-100",
    coverClass: "from-[#6C4BF4] to-[#8B3FD9]",
    step: 3,
    seller: {
      name: "Aarav Sharma",
      phone: "+91 99887 76655",
      meetup: "Campus Cafeteria, Completed"
    }
  },
  {
    id: "ORD-51920",
    title: "Organic Chemistry, 8th Edition",
    author: "L. G. Wade Jr.",
    price: "₹800",
    date: "12 Aug 2026",
    status: "Cancelled",
    statusColor: "text-red-600 bg-red-50 border-red-100",
    coverClass: "from-[#059669] to-[#10B981]",
    step: 0,
    seller: {
      name: "Rohan Das",
      phone: "N/A",
      meetup: "Cancelled by seller"
    }
  }
];

export default function MyOrders() {
  const { orders: contextOrders, startOrGetConversation, showToast } = useCommerce();
  const [activeTab, setActiveTab] = useState("All");
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [selectedHelpOrder, setSelectedHelpOrder] = useState(null);
  const [helpReason, setHelpReason] = useState("");

  // Normalize context orders and merge with seed orders
  const formattedContextOrders = (contextOrders || []).map((ord) => {
    const primaryItem = ord.items?.[0];
    const isMeetup = ord.shippingMethod === "pickup" || (!ord.shippingMethod && !ord.courier?.trackingNumber);
    const isCompleted = ord.status === "delivered";
    const isCancelled = ord.status === "cancelled";
    const isShipped = ord.status === "shipped" || ord.status === "out_for_delivery";

    const statusText = isCompleted
      ? "Completed"
      : isCancelled
      ? "Cancelled"
      : isShipped
      ? "In Transit"
      : isMeetup
      ? "Meetup Scheduled"
      : "Escrow Secured";

    const statusColor = isCompleted
      ? "text-emerald-700 bg-emerald-50 border-emerald-200"
      : isCancelled
      ? "text-red-700 bg-red-50 border-red-200"
      : isShipped
      ? "text-blue-700 bg-blue-50 border-blue-200"
      : "text-[#6C4BF4] bg-[#F0ECFF] border-[#E9E4FF]";

    return {
      id: ord.id || `ORD-${Math.floor(10000 + Math.random() * 90000)}`,
      title: primaryItem?.title || ord.title || "Textbook Order",
      author: primaryItem?.author || ord.author || "Academic Author",
      image: primaryItem?.image || ord.image || null,
      totalItemsCount: ord.items?.length || 1,
      price: ord.total ? `₹${ord.total}` : "₹499",
      subtotal: ord.subtotal || ord.total || 450,
      deliveryFee: ord.deliveryFee ?? 0,
      platformFee: ord.platformFee ?? 15,
      discount: ord.discount ?? 0,
      date: ord.orderDateFormatted || "Recently",
      expectedDelivery: ord.expectedDelivery,
      shippingMethod: ord.shippingMethod,
      shippingMethodLabel: ord.shippingMethodLabel,
      status: statusText,
      statusColor: statusColor,
      coverClass: "from-[#6C4BF4] to-[#8B3FD9]",
      step: isCompleted ? 3 : isShipped ? 2 : 1,
      seller: {
        id: primaryItem?.seller?.id || "usr_seller",
        name: primaryItem?.seller?.name || "Campus Peer",
        phone: "+91 98765 00000",
        meetup: ord.address?.meetupSpot || ord.address?.hostelBlock || "Main Campus Library Entrance"
      },
      items: ord.items || [{ title: ord.title || "Academic Book", price: ord.total || 450, image: ord.image }]
    };
  });

  // Combine and deduplicate
  const allOrders = [...formattedContextOrders, ...SEED_ORDERS.filter(s => !formattedContextOrders.some(c => c.id === s.id))];

  const filteredOrders = allOrders.filter(order => {
    if (activeTab === "All") return true;
    if (activeTab === "Active") return order.status === "Meetup Scheduled" || order.status === "Escrow Secured" || order.status === "In Transit" || order.status === "Processing";
    if (activeTab === "Completed") return order.status === "Completed";
    if (activeTab === "Cancelled") return order.status === "Cancelled";
    return true;
  });

  const openInvoice = (order) => {
    setSelectedInvoice(order);
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  const handleHelpSubmit = (e) => {
    e.preventDefault();
    if (showToast) {
      showToast("Help ticket submitted. Campus Escrow team will review within 24h.", "success");
    }
    setSelectedHelpOrder(null);
    setHelpReason("");
  };

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
              <h1 className="text-xl md:text-2xl font-bold text-[#17152A]">My Orders</h1>
              <p className="mt-0.5 text-xs text-gray-400">Track and view history of your textbook purchases.</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-gray-150 mb-6 gap-6">
            {["All", "Active", "Completed", "Cancelled"].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 text-sm font-semibold transition-all border-b-2 cursor-pointer ${
                  activeTab === tab
                    ? "border-[#6C4BF4] text-[#6C4BF4]"
                    : "border-transparent text-gray-500 hover:text-gray-800"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Orders Stack */}
          <div className="space-y-4">
            {filteredOrders.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 rounded-2xl bg-white border border-gray-100 p-8 text-center">
                <ShoppingBag size={48} className="text-gray-300 mb-3" />
                <h3 className="font-bold text-[#17152A] text-lg">No orders found</h3>
                <p className="text-sm text-gray-400 mt-1">There are no orders matching your current tab.</p>
              </div>
            ) : (
              filteredOrders.map(order => (
                <div key={order.id} className="rounded-2xl bg-white border border-gray-100 p-6 shadow-sm flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
                  
                  {/* Left Column: Details */}
                  <div className="flex gap-4">
                    {/* Cover block */}
                    {order.image ? (
                      <div className="h-20 w-14 shrink-0 overflow-hidden rounded-lg bg-gray-100 border border-black/5 shadow-2xs">
                        <img src={order.image} alt={order.title} className="h-full w-full object-cover" />
                      </div>
                    ) : (
                      <div className={`h-20 w-14 shrink-0 rounded-lg bg-gradient-to-br ${order.coverClass} flex items-center justify-center text-[8px] font-extrabold text-white uppercase tracking-wider border border-black/5`}>
                        {order.title.split(' ').map(w => w[0]).join('')}
                      </div>
                    )}

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-bold text-gray-400">{order.id}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${order.statusColor}`}>
                          {order.status}
                        </span>
                        {order.totalItemsCount > 1 && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-gray-100 text-gray-600">
                            +{order.totalItemsCount - 1} more items
                          </span>
                        )}
                      </div>
                      <h3 className="font-bold text-[#17152A] text-sm mt-1.5 truncate">{order.title}</h3>
                      <p className="text-xs text-gray-400 mt-0.5">Author: {order.author}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-xs font-bold text-[#6C4BF4]">{order.price}</span>
                        <span className="text-[10px] text-gray-400">Ordered: {order.date}</span>
                      </div>
                    </div>
                  </div>

                  {/* Middle Column: Progress Tracker */}
                  {order.status !== "Cancelled" && (
                    <div className="hidden lg:flex items-center gap-2 w-72">
                      <div className="flex flex-col items-center">
                        <CheckCircle2 size={16} className="text-emerald-500" />
                        <span className="text-[9px] font-semibold text-gray-500 mt-1">Ordered</span>
                      </div>
                      <div className={`h-0.5 flex-1 ${order.step >= 2 ? 'bg-emerald-500' : 'bg-gray-200'}`} />
                      <div className="flex flex-col items-center">
                        {order.step >= 2 ? (
                          <CheckCircle2 size={16} className="text-emerald-500" />
                        ) : (
                          <Clock size={16} className="text-amber-500 animate-pulse" />
                        )}
                        <span className="text-[9px] font-semibold text-gray-500 mt-1">
                          {order.shippingMethod === "pickup" ? "Meetup" : "In Transit"}
                        </span>
                      </div>
                      <div className={`h-0.5 flex-1 ${order.step >= 3 ? 'bg-emerald-500' : 'bg-gray-200'}`} />
                      <div className="flex flex-col items-center">
                        {order.step >= 3 ? (
                          <CheckCircle2 size={16} className="text-emerald-500" />
                        ) : (
                          <Truck size={16} className="text-gray-300" />
                        )}
                        <span className="text-[9px] font-semibold text-gray-500 mt-1">Delivered</span>
                      </div>
                    </div>
                  )}

                  {/* Right Column: Actions */}
                  <div className="flex gap-2 w-full md:w-auto flex-wrap sm:flex-nowrap">
                    {order.status === "Meetup Scheduled" && (
                      <button
                        onClick={() => setSelectedSeller(order)}
                        className="flex-1 md:flex-initial flex items-center justify-center gap-1.5 rounded-xl bg-[#F0ECFF] text-[#6C4BF4] px-3.5 py-2.5 text-xs font-bold hover:bg-[#E9E4FF] cursor-pointer transition shadow-2xs"
                      >
                        <Eye size={14} />
                        Seller Details
                      </button>
                    )}
                    <Link
                      to={`/orders/${order.id}/tracking`}
                      className="flex-1 md:flex-initial flex items-center justify-center gap-1.5 rounded-xl bg-[#6C4BF4] text-white px-4 py-2.5 text-xs font-bold hover:bg-[#5B3DE0] cursor-pointer shadow-xs shadow-[#6C4BF4]/20 transition"
                    >
                      <Truck size={14} />
                      Track
                    </Link>
                    <button
                      onClick={() => openInvoice(order)}
                      className="flex-1 md:flex-initial flex items-center justify-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-xs font-bold text-gray-600 hover:text-[#6C4BF4] hover:bg-gray-50 cursor-pointer transition shadow-2xs"
                    >
                      <Download size={14} />
                      Invoice
                    </button>
                    <button
                      onClick={() => setSelectedHelpOrder(order)}
                      title="Need Help / Escrow Support"
                      className="flex items-center justify-center p-2.5 rounded-xl border border-gray-200 bg-white text-gray-400 hover:text-gray-600 hover:bg-gray-50 cursor-pointer"
                    >
                      <HelpCircle size={15} />
                    </button>
                  </div>

                </div>
              ))
            )}
          </div>

          {/* Seller Meetup Modal */}
          {selectedSeller && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-fade-in">
              <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-gray-100">
                <h3 className="text-lg font-bold text-[#17152A] mb-1">Meetup Details</h3>
                <p className="text-xs text-gray-400 mb-4">Coordinate with the seller on campus to receive your book.</p>
                
                <div className="space-y-3">
                  <div className="rounded-xl bg-gray-55 p-3.5 border border-gray-100">
                    <p className="text-[10px] text-gray-400 font-bold uppercase">Seller Name</p>
                    <p className="text-sm font-bold text-[#17152A] mt-0.5">{selectedSeller.seller?.name || "Campus Seller"}</p>
                  </div>
                  <div className="rounded-xl bg-gray-55 p-3.5 border border-gray-100">
                    <p className="text-[10px] text-gray-400 font-bold uppercase">Contact Number</p>
                    <p className="text-sm font-bold text-[#17152A] mt-0.5">{selectedSeller.seller?.phone || "+91 98765 43210"}</p>
                  </div>
                  <div className="rounded-xl bg-[#F0ECFF] p-3.5 border border-[#E9E4FF]">
                    <p className="text-[10px] text-[#6C4BF4] font-bold uppercase">Suggested Meetup Spot</p>
                    <p className="text-sm font-bold text-[#6C4BF4] mt-0.5 leading-relaxed">{selectedSeller.seller?.meetup || "Central Campus Library Entrance"}</p>
                  </div>
                </div>

                <div className="mt-6 flex gap-2">
                  <button
                    onClick={() => setSelectedSeller(null)}
                    className="flex-1 rounded-xl bg-gray-100 text-gray-700 py-3 text-xs font-bold hover:bg-gray-200 cursor-pointer"
                  >
                    Close
                  </button>
                  <Link
                    to="/chat"
                    onClick={() => {
                      if (selectedSeller?.seller) {
                        startOrGetConversation(
                          selectedSeller.seller,
                          { id: selectedSeller.id, title: selectedSeller.title, price: selectedSeller.price },
                          `Hi ${selectedSeller.seller.name}, regarding order ${selectedSeller.id} for "${selectedSeller.title}". When can we meet?`
                        );
                      }
                      setSelectedSeller(null);
                    }}
                    className="flex-1 text-center rounded-xl bg-[#6C4BF4] text-white py-3 text-xs font-bold hover:bg-[#5B3DE0] cursor-pointer"
                  >
                    Chat with Seller
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Printable Invoice & Order Receipt Modal */}
          {selectedInvoice && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-fade-in">
              <div className="w-full max-w-lg rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#6C4BF4] text-xs font-black text-white">B</span>
                      <span className="font-extrabold text-lg text-[#17152A] tracking-wider">BOOKIFY RECEIPT</span>
                    </div>
                    <p className="text-[11px] text-gray-400 mt-1">Order #{selectedInvoice.id} · {selectedInvoice.date}</p>
                  </div>
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-bold text-emerald-700 border border-emerald-200">
                    ✓ Escrow Protected
                  </span>
                </div>

                <div className="space-y-4 text-xs">
                  <div className="grid grid-cols-2 gap-4 rounded-xl bg-gray-50 p-4">
                    <div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase">Seller</span>
                      <p className="font-bold text-[#17152A] mt-0.5">{selectedInvoice.seller?.name || "Campus Peer"}</p>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase">Payment Method</span>
                      <p className="font-bold text-[#17152A] mt-0.5">UPI / Razorpay Escrow</p>
                    </div>
                  </div>

                  <div>
                    <span className="text-[11px] font-bold text-gray-400 uppercase">Purchased Items</span>
                    <div className="mt-2 divide-y divide-gray-100 rounded-xl border border-gray-100 bg-white p-3">
                      {selectedInvoice.items && selectedInvoice.items.length > 1 ? (
                        selectedInvoice.items.map((it, idx) => (
                          <div key={idx} className="flex justify-between py-2 font-medium">
                            <span className="font-bold text-[#17152A]">{it.title} {it.quantity > 1 ? `(x${it.quantity})` : ""}</span>
                            <span className="font-bold text-[#6C4BF4]">₹{it.price * (it.quantity || 1)}</span>
                          </div>
                        ))
                      ) : (
                        <div className="flex justify-between py-2 font-medium">
                          <span className="font-bold text-[#17152A]">{selectedInvoice.title}</span>
                          <span className="font-bold text-[#6C4BF4]">₹{selectedInvoice.subtotal || selectedInvoice.price}</span>
                        </div>
                      )}

                      <div className="flex justify-between py-1.5 text-gray-500 text-[11px]">
                        <span>Shipping ({selectedInvoice.shippingMethod === "express" ? "Express Priority" : selectedInvoice.shippingMethod === "pickup" ? "Self Pickup" : "Standard"})</span>
                        <span className="font-semibold text-gray-700">
                          {selectedInvoice.deliveryFee === 0 ? "FREE" : `₹${selectedInvoice.deliveryFee}`}
                        </span>
                      </div>
                      <div className="flex justify-between py-1.5 text-gray-500 text-[11px]">
                        <span>Platform Escrow Protection Fee</span>
                        <span className="font-semibold text-gray-700">
                          {selectedInvoice.platformFee === 0 ? "FREE" : `₹${selectedInvoice.platformFee}`}
                        </span>
                      </div>
                      {selectedInvoice.discount > 0 && (
                        <div className="flex justify-between py-1.5 text-emerald-600 text-[11px] font-semibold">
                          <span>Coupon Discount</span>
                          <span>-₹{selectedInvoice.discount}</span>
                        </div>
                      )}
                      <div className="flex justify-between pt-2 text-sm font-black text-[#17152A] border-t border-gray-100">
                        <span>Total Paid</span>
                        <span className="text-[#6C4BF4]">{selectedInvoice.price}</span>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl border border-[#E9E4FF] bg-[#F8F7FF] p-3 text-[11px] text-gray-600 leading-relaxed">
                    <span className="font-bold text-[#6C4BF4]">Bookify 100% Escrow Guarantee:</span> Your funds are held safely until you verify the book condition. If anything is wrong, you receive an instant full refund.
                  </div>
                </div>

                <div className="mt-6 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedInvoice(null)}
                    className="flex-1 rounded-xl border border-gray-200 bg-white py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50 cursor-pointer"
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    onClick={handlePrintReceipt}
                    className="flex-1 rounded-xl bg-[#6C4BF4] text-white py-2.5 text-xs font-bold hover:bg-[#5B3DE0] cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <Download size={14} /> Print / Save PDF
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Help & Escrow Dispute Support Modal */}
          {selectedHelpOrder && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-fade-in">
              <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-gray-100">
                <h3 className="text-lg font-bold text-[#17152A] mb-1">Escrow & Order Support</h3>
                <p className="text-xs text-gray-400 mb-4">Order #{selectedHelpOrder.id} · Need assistance or have a dispute?</p>
                
                <form onSubmit={handleHelpSubmit} className="space-y-3">
                  <div>
                    <label className="text-[11px] font-bold text-gray-500 uppercase">Reason for Issue</label>
                    <select
                      value={helpReason}
                      onChange={(e) => setHelpReason(e.target.value)}
                      required
                      className="mt-1 w-full rounded-xl border border-gray-200 bg-gray-50 p-2.5 text-xs font-semibold text-[#17152A] outline-none focus:border-[#6C4BF4]"
                    >
                      <option value="">Select a reason...</option>
                      <option value="not_met">Seller did not show up for meetup</option>
                      <option value="condition">Book condition does not match listing photos</option>
                      <option value="cancel">Request order cancellation and escrow refund</option>
                      <option value="other">Other question about transaction</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-gray-500 uppercase">Additional Comments (Optional)</label>
                    <textarea
                      rows={3}
                      placeholder="Describe what happened..."
                      className="mt-1 w-full rounded-xl border border-gray-200 bg-gray-50 p-2.5 text-xs font-medium text-[#17152A] outline-none focus:border-[#6C4BF4]"
                    />
                  </div>

                  <div className="mt-4 flex gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedHelpOrder(null)}
                      className="flex-1 rounded-xl bg-gray-100 text-gray-700 py-2.5 text-xs font-bold hover:bg-gray-200 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 rounded-xl bg-[#6C4BF4] text-white py-2.5 text-xs font-bold hover:bg-[#5B3DE0] cursor-pointer"
                    >
                      Submit Ticket
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
