import React, { useState, useEffect } from "react";
import { 
  Search, CheckCircle, ShieldAlert, XCircle, FileText, 
  ExternalLink, Eye, X, ShieldCheck, Clock, AlertCircle 
} from "lucide-react";
import { adminService } from "../../services/adminService";

function AuthorsVerification() {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedDoc, setSelectedDoc] = useState(null); // for document inspection modal
  const [authors, setAuthors] = useState([]);

  const loadAuthors = async () => {
    setLoading(true);
    try {
      const data = await adminService.getAuthorsForVerification();
      if (data && data.length > 0) {
        setAuthors(
          data.map((u) => ({
            id: u._id || u.id,
            name: u.fullName || "Author",
            penName: u.penName || "",
            email: u.email || "",
            books: u.booksCount || 0,
            status:
              u.authorVerificationStatus === "verified"
                ? "Verified"
                : u.authorVerificationStatus === "rejected"
                ? "Rejected"
                : u.authorVerificationStatus === "pending" || (u.authorVerificationDocuments && u.authorVerificationDocuments.length > 0)
                ? "Pending Verification"
                : "Unverified",
            date: u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "Recent",
            documents: u.authorVerificationDocuments || [],
          }))
        );
      } else {
        // Fallback demo data if no authors in DB yet
        setAuthors([
          { 
            id: "demo_1", 
            name: "Rahul Verma", 
            penName: "R. V. Writes",
            email: "author@bookify.com", 
            books: 1, 
            status: "Verified", 
            date: "12 Apr 2026",
            documents: [{ title: "ISBN Certificate", fileName: "isbn_978_0132350884.pdf", fileType: "pdf", url: "" }]
          },
          { 
            id: "demo_2", 
            name: "Neha Patel", 
            penName: "N. Patel",
            email: "neha.patel@gmail.com", 
            books: 2, 
            status: "Pending Verification", 
            date: "16 Apr 2026",
            documents: [{ title: "Copyright Registration Certificate", fileName: "copyright_neha.pdf", fileType: "pdf", url: "" }]
          },
          { 
            id: "demo_3", 
            name: "Vikram Das", 
            penName: "V. Das",
            email: "vikram.das@gmail.com", 
            books: 1, 
            status: "Pending Verification", 
            date: "14 Apr 2026",
            documents: [{ title: "Government Photo ID", fileName: "passport_scan.jpg", fileType: "image", url: "" }]
          }
        ]);
      }
    } catch (err) {
      console.warn("Failed to load authors:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAuthors();
  }, []);

  const handleVerify = async (id) => {
    await adminService.verifyAuthor(id, "verified");
    setAuthors((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: "Verified" } : a))
    );
  };

  const handleReject = async (id) => {
    await adminService.verifyAuthor(id, "rejected");
    setAuthors((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: "Rejected" } : a))
    );
  };

  const filteredAuthors = authors.filter(
    (a) =>
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      (a.penName && a.penName.toLowerCase().includes(search.toLowerCase())) ||
      a.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-[#17152A] font-poppins">Authors Verification</h1>
        <p className="text-[#6B6880] mt-1 text-sm">
          Review verification documents (ISBN certificates, Government IDs) and manage official Verified Author Badges.
        </p>
      </div>

      {/* Grid List */}
      <div className="bg-white rounded-2xl border border-[#E7E4F2] shadow-sm overflow-hidden p-6 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-lg font-bold text-[#17152A] font-poppins">Author Registry</h2>
            <p className="text-xs text-[#6B6880]">Total {filteredAuthors.length} registered publishing authors</p>
          </div>
          <div className="relative w-full sm:w-80">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search author name, pen name, email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-[#F8F7FF] py-2 pl-10 pr-4 text-xs outline-none focus:border-[#6C4BF4]"
            />
          </div>
        </div>

        <div className="overflow-x-auto -mx-6">
          <table className="w-full text-left border-collapse min-w-[750px]">
            <thead>
              <tr className="bg-[#F8F7FF] border-b border-[#E7E4F2] text-xs font-bold text-[#6B6880] uppercase tracking-wider">
                <th className="p-5 pl-8">Author Details</th>
                <th className="p-5">Catalog</th>
                <th className="p-5">Verification Documents</th>
                <th className="p-5">Status</th>
                <th className="p-5">Date</th>
                <th className="p-5 text-right pr-8">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E7E4F2]/50 text-sm text-[#17152A]">
              {filteredAuthors.map((a) => (
                <tr key={a.id} className="hover:bg-[#F8F7FF]/50 transition">
                  <td className="p-5 pl-8">
                    <div className="font-bold flex items-center gap-1.5">
                      {a.name}
                      {a.status === "Verified" && (
                        <ShieldCheck size={14} className="text-[#22C55E]" title="Verified Author" />
                      )}
                    </div>
                    {a.penName && <div className="text-xs text-[#6C4BF4] font-medium">Pen Name: {a.penName}</div>}
                    <div className="text-xs text-[#6B6880]">{a.email}</div>
                  </td>

                  <td className="p-5 font-semibold text-[#6C4BF4]">
                    {a.books} {a.books === 1 ? "book" : "books"}
                  </td>

                  <td className="p-5">
                    {a.documents && a.documents.length > 0 ? (
                      <div className="space-y-1">
                        {a.documents.slice(0, 1).map((doc, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setSelectedDoc(doc)}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-50 hover:bg-purple-100 text-[#6C4BF4] text-xs font-semibold transition cursor-pointer"
                              title="Click to inspect document"
                            >
                              <FileText size={13} />
                              <span className="truncate max-w-[130px]">{doc.title || "Proof Document"}</span>
                              <Eye size={12} className="shrink-0" />
                            </button>
                            {a.documents.length > 1 && (
                              <span className="text-[10px] text-gray-500 font-bold">+{a.documents.length - 1}</span>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400 italic">No document attached</span>
                    )}
                  </td>

                  <td className="p-5">
                    {a.status === "Verified" && (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-[#22C55E] bg-[#E8F8EE] px-2.5 py-1 rounded-full">
                        <CheckCircle size={12} />
                        Verified
                      </span>
                    )}
                    {a.status === "Pending Verification" && (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                        <Clock size={12} />
                        Under Review
                      </span>
                    )}
                    {a.status === "Rejected" && (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-red-500 bg-red-50 px-2.5 py-1 rounded-full">
                        <XCircle size={12} />
                        Rejected
                      </span>
                    )}
                    {a.status === "Unverified" && (
                      <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
                        Unverified
                      </span>
                    )}
                  </td>

                  <td className="p-5 text-xs text-[#6B6880]">{a.date}</td>

                  <td className="p-5 text-right pr-8">
                    <div className="flex justify-end items-center gap-2">
                      {a.status !== "Verified" && (
                        <button 
                          type="button"
                          onClick={() => handleVerify(a.id)}
                          className="flex items-center gap-1 px-3 py-1.5 bg-[#E8F8EE] text-[#22C55E] hover:bg-[#22C55E] hover:text-white rounded-lg text-xs font-bold transition cursor-pointer"
                          title="Grant Verified Badge"
                        >
                          <CheckCircle size={14} />
                          Approve
                        </button>
                      )}
                      {a.status !== "Rejected" && (
                        <button 
                          type="button"
                          onClick={() => handleReject(a.id)}
                          className="flex items-center gap-1 px-2.5 py-1.5 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-lg text-xs font-bold transition cursor-pointer"
                          title="Reject Application"
                        >
                          <XCircle size={14} />
                          Reject
                        </button>
                      )}
                      {a.status === "Verified" && (
                        <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                          <ShieldCheck size={14} />
                          Active Badge
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Document Inspection Modal */}
      {selectedDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-2xl relative max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <FileText size={20} className="text-[#6C4BF4]" />
                <div>
                  <h3 className="font-bold text-[#17152A] text-sm font-poppins">{selectedDoc.title}</h3>
                  <p className="text-[11px] text-[#6B6880]">{selectedDoc.fileName || "Uploaded Proof Document"}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedDoc(null)}
                className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-auto rounded-xl bg-gray-50 border p-4 flex items-center justify-center min-h-[300px]">
              {selectedDoc.url ? (
                selectedDoc.url.startsWith("data:application/pdf") ? (
                  <iframe 
                    src={selectedDoc.url} 
                    title={selectedDoc.title}
                    className="w-full h-[450px] rounded-lg border"
                  />
                ) : (
                  <img 
                    src={selectedDoc.url} 
                    alt={selectedDoc.title} 
                    className="max-h-[450px] max-w-full object-contain rounded-lg shadow-sm"
                  />
                )
              ) : (
                <div className="text-center py-12 space-y-2">
                  <FileText size={40} className="text-[#6C4BF4] mx-auto opacity-40" />
                  <p className="text-xs font-bold text-[#17152A]">Document Title: {selectedDoc.title}</p>
                  <p className="text-xs text-[#6B6880]">Demo record without stored file binary.</p>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setSelectedDoc(null)}
                className="px-5 py-2 bg-gray-900 text-white hover:bg-black rounded-xl text-xs font-bold transition cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AuthorsVerification;
