import React, { useState, useEffect } from "react";
import {
  Search,
  UserMinus,
  UserCheck,
  ShieldAlert,
  Loader2,
  Users as UsersIcon,
  GraduationCap,
  PenTool,
  Sparkles,
  Shield,
  RefreshCw,
  Award
} from "lucide-react";
import { adminService } from "../../services/adminService";
import { useCommerce } from "../../context/CommerceContext";

function Users() {
  const { showToast } = useCommerce();
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [counts, setCounts] = useState({
    total: 0,
    studentOnly: 0,
    authorOnly: 0,
    studentAuthor: 0,
    admin: 0
  });
  const [activeCategory, setActiveCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionId, setActionId] = useState(null);

  const loadUsers = async (category = activeCategory) => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminService.getUsers(category);
      if (res && res.users) {
        setCounts(res.counts || { total: 0, studentOnly: 0, authorOnly: 0, studentAuthor: 0, admin: 0 });
        setUsers(
          res.users.map((u) => ({
            id: u._id || u.id,
            name: u.fullName || "User",
            email: u.email || "",
            role: u.role || "student",
            category: u.accountCategory || "student_only",
            isVerifiedAuthor: Boolean(u.isVerifiedAuthor),
            hasStudentProfile: u.hasStudentProfile !== false,
            date: u.createdAt
              ? new Date(u.createdAt).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric"
                })
              : "Recent",
            status: u.status === "Banned" || u.isBanned ? "Banned" : "Active"
          }))
        );
      }
    } catch (err) {
      console.error("Failed to load users:", err);
      setError(err.message || "Failed to load registered users from database.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers(activeCategory);
  }, [activeCategory]);

  const toggleBan = async (id, currentStatus) => {
    setActionId(id);
    try {
      const updated = await adminService.toggleUserBan(id);
      if (updated) {
        setUsers((prev) =>
          prev.map((u) => (u.id === id ? { ...u, status: updated.status } : u))
        );
        showToast(
          `User account ${updated.status === "Banned" ? "banned" : "unbanned"} successfully.`,
          updated.status === "Banned" ? "warning" : "success"
        );
      }
    } catch (err) {
      showToast("Failed to update user status", "error");
    } finally {
      setActionId(null);
    }
  };

  const toggleAuthorPrivileges = async (user) => {
    setActionId(user.id);
    try {
      const updated = await adminService.toggleAuthorStatus(user.id);
      if (updated) {
        showToast(
          `Author studio privileges ${updated.isAuthor ? "granted" : "revoked"} successfully.`,
          updated.isAuthor ? "success" : "info"
        );
        loadUsers(activeCategory);
      }
    } catch (err) {
      showToast(err.message || "Failed to toggle author status", "error");
    } finally {
      setActionId(null);
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.category.toLowerCase().includes(search.toLowerCase());
    return matchesSearch;
  });

  const renderCategoryBadge = (category) => {
    switch (category) {
      case "student_author":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-300">
            <Sparkles size={12} className="text-amber-500 fill-amber-500" />
            <span>Student + Author</span>
          </span>
        );
      case "author_only":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-[#EEEAFE] text-[#6C4BF4] border border-[#6C4BF4]/20">
            <PenTool size={12} />
            <span>Author Only</span>
          </span>
        );
      case "admin":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-purple-900 text-purple-100 border border-purple-700">
            <Shield size={12} />
            <span>Administrator</span>
          </span>
        );
      case "student_only":
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
            <GraduationCap size={12} />
            <span>Student Only</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#17152A] font-poppins">
            User Directory & Categories
          </h1>
          <p className="text-[#6B6880] mt-1 text-sm">
            Categorize and manage campus marketplace students, verified authors, and dual-role creators.
          </p>
        </div>
        <button
          onClick={() => loadUsers(activeCategory)}
          disabled={loading}
          className="flex items-center gap-2 px-3.5 py-2.5 bg-white border border-[#E7E4F2] text-[#6B6880] hover:text-[#17152A] rounded-xl text-sm font-semibold hover:bg-gray-50 transition shadow-sm self-start sm:self-auto"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Category Summary Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          onClick={() => setActiveCategory("student_only")}
          className={`p-5 rounded-2xl border transition cursor-pointer select-none ${
            activeCategory === "student_only"
              ? "bg-blue-50/70 border-blue-300 ring-2 ring-blue-500/20 shadow-sm"
              : "bg-white border-[#E7E4F2] hover:border-blue-200"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-blue-800 uppercase tracking-wider">
              Students Only
            </span>
            <div className="p-2 bg-blue-100 text-blue-700 rounded-xl">
              <GraduationCap size={18} />
            </div>
          </div>
          <span className="text-2xl font-extrabold text-[#17152A] block font-poppins">
            {counts.studentOnly}
          </span>
          <span className="text-[11px] text-[#6B6880] mt-0.5 block">Marketplace buyers & sellers</span>
        </div>

        <div
          onClick={() => setActiveCategory("author_only")}
          className={`p-5 rounded-2xl border transition cursor-pointer select-none ${
            activeCategory === "author_only"
              ? "bg-purple-50/70 border-purple-300 ring-2 ring-purple-500/20 shadow-sm"
              : "bg-white border-[#E7E4F2] hover:border-purple-200"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-purple-800 uppercase tracking-wider">
              Authors Only
            </span>
            <div className="p-2 bg-purple-100 text-[#6C4BF4] rounded-xl">
              <PenTool size={18} />
            </div>
          </div>
          <span className="text-2xl font-extrabold text-[#17152A] block font-poppins">
            {counts.authorOnly}
          </span>
          <span className="text-[11px] text-[#6B6880] mt-0.5 block">Pure publishers & creators</span>
        </div>

        <div
          onClick={() => setActiveCategory("student_author")}
          className={`p-5 rounded-2xl border transition cursor-pointer select-none ${
            activeCategory === "student_author"
              ? "bg-amber-50 border-amber-300 ring-2 ring-amber-500/20 shadow-sm"
              : "bg-white border-[#E7E4F2] hover:border-amber-200"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">
              Student-Authors
            </span>
            <div className="p-2 bg-amber-100 text-amber-700 rounded-xl">
              <Sparkles size={18} />
            </div>
          </div>
          <span className="text-2xl font-extrabold text-[#17152A] block font-poppins">
            {counts.studentAuthor}
          </span>
          <span className="text-[11px] text-[#6B6880] mt-0.5 block">Dual Role (Study + Publish)</span>
        </div>

        <div
          onClick={() => setActiveCategory("admin")}
          className={`p-5 rounded-2xl border transition cursor-pointer select-none ${
            activeCategory === "admin"
              ? "bg-gray-100 border-gray-400 ring-2 ring-gray-500/20 shadow-sm"
              : "bg-white border-[#E7E4F2] hover:border-gray-300"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
              Administrators
            </span>
            <div className="p-2 bg-gray-100 text-gray-700 rounded-xl">
              <Shield size={18} />
            </div>
          </div>
          <span className="text-2xl font-extrabold text-[#17152A] block font-poppins">
            {counts.admin}
          </span>
          <span className="text-[11px] text-[#6B6880] mt-0.5 block">System controllers</span>
        </div>
      </div>

      {/* Main Container */}
      <div className="bg-white rounded-2xl border border-[#E7E4F2] shadow-sm overflow-hidden p-6 space-y-6">
        {/* Category Tabs & Search Bar */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b border-[#E7E4F2]/60 pb-5">
          {/* Quick Segment Pills */}
          <div className="flex flex-wrap gap-2">
            {[
              { id: "all", label: "All Accounts", count: counts.total },
              { id: "student_only", label: "🎓 Students Only", count: counts.studentOnly },
              { id: "author_only", label: "✍️ Authors Only", count: counts.authorOnly },
              { id: "student_author", label: "⭐ Student-Authors", count: counts.studentAuthor },
              { id: "admin", label: "🛡️ Admins", count: counts.admin }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  activeCategory === tab.id
                    ? "bg-[#6C4BF4] text-white shadow-sm"
                    : "bg-[#F8F7FF] text-[#6B6880] hover:text-[#17152A] hover:bg-[#EEEAFE]"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                    activeCategory === tab.id
                      ? "bg-white/20 text-white"
                      : "bg-white text-gray-600 border border-gray-200"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Search Field */}
          <div className="relative w-full lg:w-80">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search by name, email, or category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-[#F8F7FF] py-2.5 pl-10 pr-4 text-xs outline-none transition focus:border-[#6C4BF4]"
            />
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-semibold">
            <div className="flex items-center gap-2">
              <ShieldAlert size={18} className="text-amber-600 shrink-0" />
              <span>{error}</span>
            </div>
            <a
              href="/admin-login"
              className="px-3 py-1.5 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition whitespace-nowrap"
            >
              Sign In to Admin
            </a>
          </div>
        )}

        {/* Table View */}
        {loading ? (
          <div className="text-center py-16 space-y-3">
            <Loader2 className="w-8 h-8 text-[#6C4BF4] animate-spin mx-auto" />
            <p className="text-xs text-gray-500 font-bold">Loading live user database from MongoDB...</p>
          </div>
        ) : filteredUsers.length > 0 ? (
          <div className="overflow-x-auto -mx-6">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-[#F8F7FF] border-b border-[#E7E4F2] text-xs font-bold text-[#6B6880] uppercase tracking-wider">
                  <th className="p-5 pl-8">User Profile</th>
                  <th className="p-5">Account Category</th>
                  <th className="p-5">Capabilities</th>
                  <th className="p-5">Joined</th>
                  <th className="p-5">Status</th>
                  <th className="p-5 text-right pr-8">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E7E4F2]/50 text-sm text-[#17152A]">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-[#F8F7FF]/50 transition">
                    {/* User Name & Email */}
                    <td className="p-5 pl-8">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#6C4BF4] to-[#8B3FD9] text-white flex items-center justify-center font-bold text-sm shrink-0">
                          {u.name ? u.name.slice(0, 2).toUpperCase() : "U"}
                        </div>
                        <div>
                          <span className="font-extrabold text-[#17152A] block text-sm">
                            {u.name}
                          </span>
                          <span className="text-xs text-[#6B6880] block">
                            {u.email}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Account Category */}
                    <td className="p-5">
                      {renderCategoryBadge(u.category)}
                    </td>

                    {/* Capabilities */}
                    <td className="p-5 text-xs text-[#6B6880]">
                      {u.category === "student_author" ? (
                        <span className="font-semibold text-amber-700">Marketplace + Author Studio</span>
                      ) : u.category === "author_only" ? (
                        <span className="font-semibold text-purple-700">Publishing & Campaigns</span>
                      ) : u.category === "admin" ? (
                        <span className="font-semibold text-gray-700">Full System Control</span>
                      ) : (
                        <span className="font-semibold text-blue-700">Buy, Sell & Trade</span>
                      )}
                    </td>

                    {/* Joined Date */}
                    <td className="p-5 text-xs text-[#6B6880] font-medium">{u.date}</td>

                    {/* Status Badge */}
                    <td className="p-5">
                      {u.status === "Active" ? (
                        <span className="text-xs font-semibold text-[#22C55E] bg-[#E8F8EE] px-2.5 py-1 rounded-full">
                          Active
                        </span>
                      ) : (
                        <span className="text-xs font-semibold text-red-500 bg-red-50 px-2.5 py-1 rounded-full">
                          Banned
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="p-5 text-right pr-8">
                      <div className="flex items-center justify-end gap-2">
                        {/* Grant/Revoke Author Privileges (only for non-admins) */}
                        {u.role !== "admin" && (
                          <button
                            disabled={actionId === u.id}
                            onClick={() => toggleAuthorPrivileges(u)}
                            className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                              u.isVerifiedAuthor
                                ? "bg-purple-50 text-purple-700 hover:bg-purple-100"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            } ${actionId === u.id ? "opacity-50 cursor-not-allowed" : ""}`}
                            title={
                              u.isVerifiedAuthor
                                ? "Revoke Author Studio Publishing Access"
                                : "Promote / Grant Author Studio Privileges"
                            }
                          >
                            <Award size={13} />
                            <span>
                              {u.isVerifiedAuthor ? "Revoke Author" : "Grant Author"}
                            </span>
                          </button>
                        )}

                        {/* Ban / Unban Account */}
                        {u.role !== "admin" ? (
                          <button
                            disabled={actionId === u.id}
                            onClick={() => toggleBan(u.id, u.status)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                              u.status === "Active"
                                ? "bg-red-50 text-red-500 hover:bg-red-500 hover:text-white"
                                : "bg-[#E8F8EE] text-[#22C55E] hover:bg-[#22C55E] hover:text-white"
                            } ${actionId === u.id ? "opacity-50 cursor-not-allowed" : ""}`}
                          >
                            {u.status === "Active" ? (
                              <>
                                <UserMinus size={14} />
                                <span>Ban</span>
                              </>
                            ) : (
                              <>
                                <UserCheck size={14} />
                                <span>Unban</span>
                              </>
                            )}
                          </button>
                        ) : (
                          <span className="text-xs text-gray-400 italic font-semibold">Protected</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-16 text-gray-400 text-xs">
            {search
              ? `No accounts found matching "${search}" in this category.`
              : "No accounts found in this category."}
          </div>
        )}
      </div>
    </div>
  );
}

export default Users;
