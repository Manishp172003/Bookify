import React from "react";
import AuthorSidebar from "./AuthorSidebar";

function AuthorLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-[#F8F7FF]">
      <AuthorSidebar />
      <main className="flex-1 overflow-y-auto h-screen p-8">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}

export default AuthorLayout;
