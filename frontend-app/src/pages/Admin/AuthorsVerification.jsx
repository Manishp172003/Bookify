import React, { useState } from "react";
import { Search, CheckCircle, ShieldAlert, XCircle } from "lucide-react";

function AuthorsVerification() {
  const [search, setSearch] = useState("");
  const [authors, setAuthors] = useState([
    { id: 1, name: "Rahul Verma", books: 8, status: "Verified", date: "12 Apr 2026" },
    { id: 2, name: "Neha Patel", books: 6, status: "Pending Verification", date: "16 Apr 2026" },
    { id: 3, name: "Vikram Das", books: 3, status: "Verified", date: "14 Apr 2026" }
  ]);

  const verifyAuthor = (id) => {
    setAuthors(authors.map(a => a.id === id ? { ...a, status: "Verified" } : a));
  };

  const rejectAuthor = (id) => {
    setAuthors(authors.map(a => a.id === id ? { ...a, status: "Rejected" } : a));
  };

  const filteredAuthors = authors.filter(a => 
    a.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-[#17152A] font-poppins">Authors</h1>
        <p className="text-[#6B6880] mt-1 text-sm">Verify new Author applications and manage their publication access.</p>
      </div>

      {/* Grid List */}
      <div className="bg-white rounded-2xl border border-[#E7E4F2] shadow-sm overflow-hidden p-6 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-lg font-bold text-[#17152A] font-poppins">Author Registry</h2>
          <div className="relative w-full sm:w-80">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search author name..."
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
                <th className="p-5 pl-8">Author Name</th>
                <th className="p-5">Books Submitted</th>
                <th className="p-5">Status</th>
                <th className="p-5">Joined Date</th>
                <th className="p-5 text-right pr-8">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E7E4F2]/50 text-sm text-[#17152A]">
              {filteredAuthors.map((a) => (
                <tr key={a.id} className="hover:bg-[#F8F7FF]/50 transition">
                  <td className="p-5 pl-8 font-bold">{a.name}</td>
                  <td className="p-5 font-semibold text-[#6C4BF4]">{a.books} books</td>
                  <td className="p-5">
                    {a.status === "Verified" && (
                      <span className="text-xs font-semibold text-[#22C55E] bg-[#E8F8EE] px-2.5 py-1 rounded-full">Verified</span>
                    )}
                    {a.status === "Pending Verification" && (
                      <span className="text-xs font-semibold text-[#6C4BF4] bg-[#F0ECFF] px-2.5 py-1 rounded-full">Pending Verification</span>
                    )}
                    {a.status === "Rejected" && (
                      <span className="text-xs font-semibold text-red-500 bg-red-50 px-2.5 py-1 rounded-full">Rejected</span>
                    )}
                  </td>
                  <td className="p-5">{a.date}</td>
                  <td className="p-5 text-right pr-8 flex justify-end gap-2">
                    {a.status === "Pending Verification" ? (
                      <>
                        <button 
                          onClick={() => verifyAuthor(a.id)}
                          className="p-1.5 bg-[#E8F8EE] text-[#22C55E] hover:bg-[#22C55E] hover:text-white rounded-lg transition"
                          title="Verify Author"
                        >
                          <CheckCircle size={16} />
                        </button>
                        <button 
                          onClick={() => rejectAuthor(a.id)}
                          className="p-1.5 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition"
                          title="Reject"
                        >
                          <XCircle size={16} />
                        </button>
                      </>
                    ) : (
                      <span className="text-xs text-[#6B6880] italic">Verified Account</span>
                    )}
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

export default AuthorsVerification;
