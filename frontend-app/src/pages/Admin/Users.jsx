import React, { useState, useEffect } from "react";
import { Search, UserMinus, UserCheck, ShieldAlert, Loader2 } from "lucide-react";
import { adminService } from "../../services/adminService";
import { useCommerce } from "../../context/CommerceContext";

function Users() {
  const { showToast } = useCommerce();
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);

  const loadUsers = async () => {
    try {
      const data = await adminService.getUsers();
      if (Array.isArray(data)) {
        setUsers(
          data.map((u) => ({
            id: u._id || u.id,
            name: u.fullName || "User",
            email: u.email || "",
            role:
              u.role === "author"
                ? "Author"
                : u.role === "admin"
                ? "Admin"
                : "Student",
            date: u.createdAt
              ? new Date(u.createdAt).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })
              : "Recent",
            status: u.status === "Banned" || u.isBanned ? "Banned" : "Active",
          }))
        );
      }
    } catch (err) {
      console.error("Failed to load users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

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

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-[#17152A] font-poppins">Users</h1>
        <p className="text-[#6B6880] mt-1 text-sm">
          Manage Bookify registered accounts and students. Restrict accounts violating policies.
        </p>
      </div>

      {/* Search & List */}
      <div className="bg-white rounded-2xl border border-[#E7E4F2] shadow-sm overflow-hidden p-6 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-lg font-bold text-[#17152A] font-poppins">Registered Accounts</h2>
            <p className="text-xs text-[#6B6880]">Live accounts registered in MongoDB database</p>
          </div>
          <div className="relative w-full sm:w-80">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search user name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-[#F8F7FF] py-2 pl-10 pr-4 text-xs outline-none focus:border-[#6C4BF4]"
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-4 border-[#6C4BF4] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-xs text-gray-400 font-bold">Loading real-time user database...</p>
          </div>
        ) : filteredUsers.length > 0 ? (
          <div className="overflow-x-auto -mx-6">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-[#F8F7FF] border-b border-[#E7E4F2] text-xs font-bold text-[#6B6880] uppercase tracking-wider">
                  <th className="p-5 pl-8">Name</th>
                  <th className="p-5">Email</th>
                  <th className="p-5">Role</th>
                  <th className="p-5">Joined</th>
                  <th className="p-5">Status</th>
                  <th className="p-5 text-right pr-8">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E7E4F2]/50 text-sm text-[#17152A]">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-[#F8F7FF]/50 transition">
                    <td className="p-5 pl-8 font-bold">{u.name}</td>
                    <td className="p-5 text-[#6B6880]">{u.email}</td>
                    <td className="p-5">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          u.role === "Author"
                            ? "bg-[#EEEAFE] text-[#6C4BF4]"
                            : u.role === "Admin"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="p-5">{u.date}</td>
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
                    <td className="p-5 text-right pr-8">
                      {u.role !== "Admin" ? (
                        <button
                          disabled={actionId === u.id}
                          onClick={() => toggleBan(u.id, u.status)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ml-auto cursor-pointer ${
                            u.status === "Active"
                              ? "bg-red-50 text-red-500 hover:bg-red-500 hover:text-white"
                              : "bg-[#E8F8EE] text-[#22C55E] hover:bg-[#22C55E] hover:text-white"
                          } ${actionId === u.id ? "opacity-50 cursor-not-allowed" : ""}`}
                        >
                          {u.status === "Active" ? (
                            <>
                              <UserMinus size={14} />
                              <span>Ban User</span>
                            </>
                          ) : (
                            <>
                              <UserCheck size={14} />
                              <span>Unban User</span>
                            </>
                          )}
                        </button>
                      ) : (
                        <span className="text-xs text-gray-400 italic font-semibold">Protected</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 text-gray-400 text-xs">
            {search ? `No accounts match "${search}"` : "No registered accounts found in the database."}
          </div>
        )}
      </div>
    </div>
  );
}

export default Users;
