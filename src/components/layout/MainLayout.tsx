"use client";

import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

export function MainLayout({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#F8F9FA]">
      <Sidebar isCollapsed={isCollapsed} />
      <main className="flex-1 overflow-y-auto transition-all duration-300 ease-in-out">
        <Topbar onToggle={toggleSidebar} />
        <div className="container mx-auto p-4 md:p-6 lg:p-8">
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">{children}</div>
        </div>
      </main>
    </div>
  );
}
