import React, { useState, useEffect } from "react";
import {
  Ticket,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  Edit2,
  Trash2,
  Power,
  BookOpen,
  Info,
  Sparkles,
  ShieldCheck
} from "lucide-react";
import {
  getAuthorCoupons,
  addCoupon,
  updateCoupon,
  toggleCouponStatus,
  deleteCoupon
} from "../../services/couponService";
import { getAuthorPublishedBooks } from "../../services/bookService";

function AuthorCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [filter, setFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);

  // Strictly ONLY published books by the current author
  const authorPublishedBooks = getAuthorPublishedBooks();

  // Form State
  const [formData, setFormData] = useState({
    code: "",
    discountType: "percentage",
    discountValue: "",
    minPurchase: "",
    applicableScope: "ALL_AUTHOR_BOOKS", // 'ALL_AUTHOR_BOOKS' | 'SPECIFIC_BOOKS'
    applicableBooks: ["All My Published Books"],
    validUntil: "",
    usageLimit: "100"
  });

  const loadCoupons = () => {
    setCoupons(getAuthorCoupons());
  };

  useEffect(() => {
    loadCoupons();
  }, []);

  const handleOpenCreateModal = () => {
    setEditingCoupon(null);
    setFormData({
      code: "",
      discountType: "percentage",
      discountValue: "",
      minPurchase: "0",
      applicableScope: "ALL_AUTHOR_BOOKS",
      applicableBooks: ["All My Published Books"],
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      usageLimit: "100"
    });
    setShowModal(true);
  };

  const handleOpenEditModal = (coupon) => {
    setEditingCoupon(coupon);
    setFormData({
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      minPurchase: coupon.minPurchase || "0",
      applicableScope: coupon.applicableScope || "ALL_AUTHOR_BOOKS",
      applicableBooks: coupon.applicableBooks || ["All My Published Books"],
      validUntil: coupon.validUntil,
      usageLimit: coupon.usageLimit || "100"
    });
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let assignedBooks = ["All My Published Books"];
    if (formData.applicableScope === "SPECIFIC_BOOKS") {
      assignedBooks =
        formData.applicableBooks.length > 0
          ? formData.applicableBooks
          : ["All My Published Books"];
    }

    const payload = {
      code: formData.code,
      discountType: formData.discountType,
      discountValue: Number(formData.discountValue),
      minPurchase: Number(formData.minPurchase) || 0,
      creatorRole: "author",
      creatorName: "Current Author",
      applicableScope: formData.applicableScope,
      applicableBooks: assignedBooks,
      validUntil: formData.validUntil,
      usageLimit: Number(formData.usageLimit) || 100,
      status: "Active"
    };

    if (editingCoupon) {
      updateCoupon(editingCoupon.id, payload);
    } else {
      addCoupon(payload);
    }

    setShowModal(false);
    loadCoupons();
  };

  const handleToggleStatus = (id) => {
    toggleCouponStatus(id);
    loadCoupons();
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this coupon?")) {
      deleteCoupon(id);
      loadCoupons();
    }
  };

  const handleBookSelectionChange = (bookTitle) => {
    let currentSelected = [...formData.applicableBooks];
    if (currentSelected.includes("All My Published Books")) {
      currentSelected = [];
    }

    if (currentSelected.includes(bookTitle)) {
      currentSelected = currentSelected.filter((b) => b !== bookTitle);
    } else {
      currentSelected.push(bookTitle);
    }

    if (currentSelected.length === 0) {
      currentSelected = ["All My Published Books"];
    }

    setFormData({ ...formData, applicableBooks: currentSelected });
  };

  const filteredCoupons = coupons.filter((item) => {
    const matchesFilter =
      filter === "All"
        ? true
        : filter === "Active"
        ? item.status === "Active"
        : filter === "Inactive"
        ? item.status === "Inactive"
        : true;

    const matchesSearch =
      item.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.applicableBooks.some((b) =>
        b.toLowerCase().includes(searchQuery.toLowerCase())
      );

    return matchesFilter && matchesSearch;
  });

  const totalCouponsCount = coupons.length;
  const activeCouponsCount = coupons.filter((c) => c.status === "Active").length;
  const totalRedemptions = coupons.reduce((sum, c) => sum + (c.usageCount || 0), 0);

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-extrabold text-[#17152A] font-poppins">
              Author Book Coupons
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#EEEAFE] text-[#6C4BF4]">
              Author Portal
            </span>
          </div>
          <p className="text-[#6B6880] mt-1 text-sm">
            Create promotional discount codes strictly for your published books to boost sales.
          </p>
        </div>
        <button
          onClick={handleOpenCreateModal}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#6C4BF4] text-white rounded-xl text-sm font-semibold hover:bg-[#5b3ed9] transition shadow-md shadow-[#6C4BF4]/20 self-start sm:self-auto"
        >
          <Plus size={18} />
          <span>Create Book Coupon</span>
        </button>
      </div>

      {/* Author Restriction Rule Banner */}
      <div className="bg-[#EEEAFE] border border-[#6C4BF4]/20 p-4 rounded-2xl flex items-start gap-3 text-xs sm:text-sm text-[#17152A]">
        <ShieldCheck size={20} className="text-[#6C4BF4] shrink-0 mt-0.5" />
        <div>
          <span className="font-extrabold text-[#6C4BF4] block mb-0.5">
            Author Coupon Scope Notice:
          </span>
          Coupons created in your Author Portal apply <strong className="text-[#6C4BF4]">ONLY to books published by you</strong> (such as <em>"The Silent Mind"</em> and <em>"Inner Peace"</em>). Un-published drafts, manuscripts under review, and third-party books are automatically excluded.
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-[#E7E4F2] shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-[#6B6880] font-semibold uppercase tracking-wider block">
              Active Author Coupons
            </span>
            <span className="text-3xl font-extrabold text-[#22C55E] mt-2 block font-poppins">
              {activeCouponsCount}
            </span>
          </div>
          <div className="p-3 bg-[#E8F8EE] text-[#22C55E] rounded-xl">
            <CheckCircle2 size={24} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#E7E4F2] shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-[#6B6880] font-semibold uppercase tracking-wider block">
              Total Redemptions
            </span>
            <span className="text-3xl font-extrabold text-[#6C4BF4] mt-2 block font-poppins">
              {totalRedemptions}
            </span>
          </div>
          <div className="p-3 bg-[#EEEAFE] text-[#6C4BF4] rounded-xl">
            <Ticket size={24} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#E7E4F2] shadow-sm flex items-center justify-between sm:col-span-2 lg:col-span-1">
          <div>
            <span className="text-xs text-[#6B6880] font-semibold uppercase tracking-wider block">
              Your Published Titles
            </span>
            <span className="text-3xl font-extrabold text-[#FF8A3D] mt-2 block font-poppins">
              {authorPublishedBooks.length}
            </span>
          </div>
          <div className="p-3 bg-[#FFF0E6] text-[#FF8A3D] rounded-xl">
            <BookOpen size={24} />
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-2xl border border-[#E7E4F2]">
        {/* Tabs */}
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          {["All", "Active", "Inactive"].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                filter === tab
                  ? "bg-[#6C4BF4] text-white"
                  : "text-[#6B6880] hover:bg-[#F8F7FF]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search your coupon code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-[#F8F7FF] py-2.5 pl-10 pr-4 text-xs outline-none transition focus:border-[#6C4BF4]"
          />
        </div>
      </div>

      {/* Coupons Table Desktop / Mobile View */}
      {filteredCoupons.length > 0 ? (
        <div className="bg-white rounded-2xl border border-[#E7E4F2] shadow-sm overflow-hidden">
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-[#F8F7FF] border-b border-[#E7E4F2] text-xs font-bold text-[#6B6880] uppercase tracking-wider">
                  <th className="p-5">Coupon Code</th>
                  <th className="p-5">Discount</th>
                  <th className="p-5">Applicable Author Book(s)</th>
                  <th className="p-5">Min Purchase</th>
                  <th className="p-5">Redemptions</th>
                  <th className="p-5">Expiry Date</th>
                  <th className="p-5">Status</th>
                  <th className="p-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E7E4F2]/50 text-sm text-[#17152A]">
                {filteredCoupons.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-[#F8F7FF]/50 transition"
                  >
                    <td className="p-5">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-[#EEEAFE] text-[#6C4BF4] rounded-xl flex items-center justify-center font-mono font-black text-sm shrink-0">
                          %
                        </div>
                        <div>
                          <span className="font-mono font-extrabold text-[#17152A] text-base tracking-wider block">
                            {item.code}
                          </span>
                          <span className="text-[10px] text-[#6C4BF4] font-semibold uppercase">
                            Author Exclusive
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="p-5">
                      <span className="font-extrabold text-[#6C4BF4]">
                        {item.discountType === "percentage"
                          ? `${item.discountValue}% OFF`
                          : `₹${item.discountValue} OFF`}
                      </span>
                    </td>
                    <td className="p-5">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {item.applicableScope === "ALL_AUTHOR_BOOKS" ||
                        item.applicableBooks.includes("All My Published Books") ? (
                          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-[#22C55E] border border-emerald-200">
                            All My Published Books
                          </span>
                        ) : (
                          item.applicableBooks.map((b, i) => (
                            <span
                              key={i}
                              className="px-2.5 py-0.5 rounded-md text-xs font-medium bg-[#EEEAFE] text-[#6C4BF4]"
                            >
                              {b}
                            </span>
                          ))
                        )}
                      </div>
                    </td>
                    <td className="p-5 font-semibold text-[#6B6880]">
                      {item.minPurchase > 0 ? `₹${item.minPurchase}` : "No Min"}
                    </td>
                    <td className="p-5">
                      <span className="font-bold text-[#17152A]">
                        {item.usageCount}
                      </span>
                      <span className="text-xs text-[#6B6880]">
                        {" "}
                        / {item.usageLimit}
                      </span>
                    </td>
                    <td className="p-5 font-medium text-xs text-[#6B6880]">
                      {item.validUntil}
                    </td>
                    <td className="p-5">
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                          item.status === "Active"
                            ? "text-[#22C55E] bg-[#E8F8EE]"
                            : "text-gray-500 bg-gray-100"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="p-5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleToggleStatus(item.id)}
                          className={`p-2 rounded-lg transition ${
                            item.status === "Active"
                              ? "text-gray-400 hover:text-amber-600 hover:bg-amber-50"
                              : "text-gray-400 hover:text-[#22C55E] hover:bg-green-50"
                          }`}
                          title={
                            item.status === "Active" ? "Deactivate" : "Activate"
                          }
                        >
                          <Power size={16} />
                        </button>
                        <button
                          onClick={() => handleOpenEditModal(item)}
                          className="p-2 text-gray-400 hover:text-[#6C4BF4] hover:bg-[#EEEAFE] rounded-lg transition"
                          title="Edit Coupon"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                          title="Delete Coupon"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards View */}
          <div className="block md:hidden divide-y divide-[#E7E4F2]">
            {filteredCoupons.map((item) => (
              <div key={item.id} className="p-5 space-y-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-[#EEEAFE] text-[#6C4BF4] rounded-xl flex items-center justify-center font-mono font-black text-sm">
                      %
                    </div>
                    <div>
                      <span className="font-mono font-extrabold text-[#17152A] text-lg">
                        {item.code}
                      </span>
                      <span className="text-[10px] text-[#6C4BF4] block font-semibold">
                        Author Exclusive
                      </span>
                    </div>
                  </div>
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                      item.status === "Active"
                        ? "text-[#22C55E] bg-[#E8F8EE]"
                        : "text-gray-500 bg-gray-100"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 bg-[#F8F7FF] p-3 rounded-xl text-xs">
                  <div>
                    <span className="text-[#6B6880] block">Discount:</span>
                    <span className="font-bold text-[#6C4BF4] text-sm">
                      {item.discountType === "percentage"
                        ? `${item.discountValue}% OFF`
                        : `₹${item.discountValue} OFF`}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#6B6880] block">Min Purchase:</span>
                    <span className="font-bold text-[#17152A]">
                      {item.minPurchase > 0 ? `₹${item.minPurchase}` : "No Min"}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#6B6880] block">Redemptions:</span>
                    <span className="font-bold text-[#17152A]">
                      {item.usageCount} / {item.usageLimit}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#6B6880] block">Expiry:</span>
                    <span className="font-medium text-[#17152A]">
                      {item.validUntil}
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-[#6B6880] block font-bold mb-1">
                    YOUR APPLICABLE BOOKS:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {item.applicableScope === "ALL_AUTHOR_BOOKS" ||
                    item.applicableBooks.includes("All My Published Books") ? (
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-[#22C55E] border border-emerald-200">
                        All My Published Books
                      </span>
                    ) : (
                      item.applicableBooks.map((b, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded text-xs bg-[#EEEAFE] text-[#6C4BF4]"
                        >
                          {b}
                        </span>
                      ))
                    )}
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-[#E7E4F2]/50">
                  <button
                    onClick={() => handleToggleStatus(item.id)}
                    className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition"
                  >
                    {item.status === "Active" ? "Deactivate" : "Activate"}
                  </button>
                  <button
                    onClick={() => handleOpenEditModal(item)}
                    className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#EEEAFE] text-[#6C4BF4] transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-red-50 text-red-600 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl border border-[#E7E4F2] space-y-3">
          <div className="h-12 w-12 bg-[#F8F7FF] rounded-full flex items-center justify-center mx-auto text-gray-400">
            <Ticket size={24} />
          </div>
          <h3 className="text-lg font-bold text-[#17152A] font-poppins">
            No author coupons found
          </h3>
          <p className="text-xs text-[#6B6880] max-w-xs mx-auto">
            Create a coupon for your published books to offer special discounts to your readers.
          </p>
        </div>
      )}

      {/* CREATE / EDIT MODAL DIALOG FOR AUTHOR */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-[#17152A]/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white p-6 sm:p-8 rounded-3xl max-w-lg w-full border border-[#E7E4F2] shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto my-auto">
            <div className="flex justify-between items-center border-b border-[#E7E4F2] pb-4">
              <div>
                <h3 className="text-xl font-bold text-[#17152A] font-poppins">
                  {editingCoupon ? "Edit Author Coupon" : "Create Book Coupon"}
                </h3>
                <p className="text-xs text-[#6B6880] mt-0.5">
                  Applies strictly to your published books.
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-[#6B6880] hover:text-black p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Coupon Code */}
              <div>
                <label className="block text-xs font-bold text-[#17152A] uppercase tracking-wider mb-2">
                  Coupon Code
                </label>
                <input
                  type="text"
                  placeholder="e.g. SILENT25"
                  value={formData.code}
                  onChange={(e) =>
                    setFormData({ ...formData, code: e.target.value })
                  }
                  className="w-full rounded-xl border border-gray-200 bg-[#F8F7FF] py-3 px-4 text-sm font-mono font-bold uppercase tracking-wider outline-none focus:border-[#6C4BF4]"
                  required
                />
              </div>

              {/* Discount Type & Value */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#17152A] uppercase tracking-wider mb-2">
                    Discount Type
                  </label>
                  <select
                    value={formData.discountType}
                    onChange={(e) =>
                      setFormData({ ...formData, discountType: e.target.value })
                    }
                    className="w-full rounded-xl border border-gray-200 bg-[#F8F7FF] py-3 px-4 text-sm outline-none focus:border-[#6C4BF4]"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#17152A] uppercase tracking-wider mb-2">
                    Discount Value
                  </label>
                  <input
                    type="number"
                    placeholder={
                      formData.discountType === "percentage" ? "25" : "100"
                    }
                    value={formData.discountValue}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        discountValue: e.target.value
                      })
                    }
                    className="w-full rounded-xl border border-gray-200 bg-[#F8F7FF] py-3 px-4 text-sm outline-none focus:border-[#6C4BF4]"
                    required
                    min="1"
                  />
                </div>
              </div>

              {/* Applicable Scope for Author (All My Published Books vs Specific Published Book) */}
              <div>
                <label className="block text-xs font-bold text-[#17152A] uppercase tracking-wider mb-2">
                  Apply To Which Published Book?
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        applicableScope: "ALL_AUTHOR_BOOKS",
                        applicableBooks: ["All My Published Books"]
                      })
                    }
                    className={`py-2.5 px-3 rounded-xl border text-xs font-bold text-center transition ${
                      formData.applicableScope === "ALL_AUTHOR_BOOKS"
                        ? "border-[#6C4BF4] bg-[#EEEAFE] text-[#6C4BF4]"
                        : "border-gray-200 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    All My Published Books
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        applicableScope: "SPECIFIC_BOOKS",
                        applicableBooks:
                          formData.applicableBooks.includes(
                            "All My Published Books"
                          )
                            ? []
                            : formData.applicableBooks
                      })
                    }
                    className={`py-2.5 px-3 rounded-xl border text-xs font-bold text-center transition ${
                      formData.applicableScope === "SPECIFIC_BOOKS"
                        ? "border-[#6C4BF4] bg-[#EEEAFE] text-[#6C4BF4]"
                        : "border-gray-200 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    Specific Published Book(s)
                  </button>
                </div>
              </div>

              {/* Specific Published Books Checkbox Selection */}
              {formData.applicableScope === "SPECIFIC_BOOKS" && (
                <div className="bg-[#F8F7FF] p-4 rounded-xl border border-gray-200 space-y-2">
                  <label className="block text-xs font-bold text-[#17152A] uppercase tracking-wider mb-1">
                    Select From Your Published Books:
                  </label>
                  <div className="space-y-2">
                    {authorPublishedBooks.map((book) => {
                      const isChecked = formData.applicableBooks.includes(
                        book.title
                      );
                      return (
                        <label
                          key={book.id}
                          className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 cursor-pointer text-xs font-semibold text-[#17152A]"
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() =>
                              handleBookSelectionChange(book.title)
                            }
                            className="h-4 w-4 accent-[#6C4BF4]"
                          />
                          <span>{book.title}</span>
                          <span className="text-[10px] text-[#22C55E] bg-[#E8F8EE] px-2 py-0.5 rounded-full font-bold ml-auto">
                            Published
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Min Purchase & Usage Limit */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#17152A] uppercase tracking-wider mb-2">
                    Min Purchase (₹)
                  </label>
                  <input
                    type="number"
                    placeholder="0"
                    value={formData.minPurchase}
                    onChange={(e) =>
                      setFormData({ ...formData, minPurchase: e.target.value })
                    }
                    className="w-full rounded-xl border border-gray-200 bg-[#F8F7FF] py-3 px-4 text-sm outline-none focus:border-[#6C4BF4]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#17152A] uppercase tracking-wider mb-2">
                    Usage Limit
                  </label>
                  <input
                    type="number"
                    placeholder="100"
                    value={formData.usageLimit}
                    onChange={(e) =>
                      setFormData({ ...formData, usageLimit: e.target.value })
                    }
                    className="w-full rounded-xl border border-gray-200 bg-[#F8F7FF] py-3 px-4 text-sm outline-none focus:border-[#6C4BF4]"
                    required
                  />
                </div>
              </div>

              {/* Expiry Date */}
              <div>
                <label className="block text-xs font-bold text-[#17152A] uppercase tracking-wider mb-2">
                  Expiry Date
                </label>
                <input
                  type="date"
                  value={formData.validUntil}
                  onChange={(e) =>
                    setFormData({ ...formData, validUntil: e.target.value })
                  }
                  className="w-full rounded-xl border border-gray-200 bg-[#F8F7FF] py-3 px-4 text-sm outline-none focus:border-[#6C4BF4]"
                  required
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-[#E7E4F2] flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 text-sm font-semibold text-[#6B6880] hover:bg-gray-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#6C4BF4] text-white rounded-xl text-sm font-semibold hover:bg-[#5b3ed9] transition shadow-md shadow-[#6C4BF4]/20"
                >
                  {editingCoupon ? "Save Changes" : "Create Coupon"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AuthorCoupons;
