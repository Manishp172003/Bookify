import React from "react";
import AdminSidebar from "./AdminSidebar";

function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-[#F8F7FF]">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto h-screen p-8">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}

export default AdminLayout;
