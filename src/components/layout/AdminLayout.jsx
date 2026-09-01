import React, { useState } from "react";
import AdminSidebar from "./AdminSidebar";
import { Menu } from "lucide-react";

function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#F8F7FF]">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile top bar */}
        <header className="bg-white border-b border-[#E7E4F2] px-6 py-4 flex items-center justify-between lg:hidden sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-xl bg-gray-50 hover:bg-gray-150 text-[#17152A] transition-colors"
            >
              <Menu size={20} />
            </button>
            <span className="font-extrabold tracking-tight text-[#17152A] text-lg">
              BOOKIFY <span className="text-[#6C4BF4] font-medium text-xs ml-1 px-2 py-0.5 rounded-full bg-[#6C4BF4]/10">Admin</span>
            </span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto h-[calc(100vh-4.5rem)] lg:h-screen p-4 md:p-8">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
