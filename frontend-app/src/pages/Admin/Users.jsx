import React, { useState } from "react";
import { Search, UserMinus, UserCheck, ShieldAlert } from "lucide-react";

function Users() {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([
    { id: 1, name: "Priya Verma", email: "priya@gmail.com", role: "Student", date: "12 May 2026", status: "Active" },
    { id: 2, name: "Anjali Singh", email: "anjali@gmail.com", role: "Student", date: "11 May 2026", status: "Active" },
    { id: 3, name: "Aman Singh", email: "aman@gmail.com", role: "Student", date: "10 May 2026", status: "Banned" },
    { id: 4, name: "Rohan Verma", email: "rohan@gmail.com", role: "Author", date: "08 May 2026", status: "Active" }
  ]);

  const toggleBan = (id) => {
    setUsers(users.map(u => {
      if (u.id === id) {
        return { ...u, status: u.status === "Active" ? "Banned" : "Active" };
      }
      return u;
    }));
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) || 
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-[#17152A] font-poppins">Users</h1>
        <p className="text-[#6B6880] mt-1 text-sm">Manage Bookify users and students. Restrict accounts violating policies.</p>
      </div>

      {/* Search & List */}
      <div className="bg-white rounded-2xl border border-[#E7E4F2] shadow-sm overflow-hidden p-6 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-lg font-bold text-[#17152A] font-poppins">Registered Accounts</h2>
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
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      u.role === "Author" ? "bg-[#EEEAFE] text-[#6C4BF4]" : "bg-gray-100 text-gray-700"
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="p-5">{u.date}</td>
                  <td className="p-5">
                    {u.status === "Active" ? (
                      <span className="text-xs font-semibold text-[#22C55E] bg-[#E8F8EE] px-2.5 py-1 rounded-full">Active</span>
                    ) : (
                      <span className="text-xs font-semibold text-red-500 bg-red-50 px-2.5 py-1 rounded-full">Banned</span>
                    )}
                  </td>
                  <td className="p-5 text-right pr-8">
                    <button 
                      onClick={() => toggleBan(u.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ml-auto ${
                        u.status === "Active" 
                          ? "bg-red-50 text-red-500 hover:bg-red-500 hover:text-white" 
                          : "bg-[#E8F8EE] text-[#22C55E] hover:bg-[#22C55E] hover:text-white"
                      }`}
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
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Users;
