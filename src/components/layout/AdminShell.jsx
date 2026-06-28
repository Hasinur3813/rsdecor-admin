"use client";
import { useState, useEffect } from "react";
import AuthGuard from "@/components/auth/AuthGuard";
import AdminSidebar from "./AdminSidebar";
import AdminTopbar from "./AdminTopbar";
import AdminMobileNav from "./AdminMobileNav";

// Helper to get initial sidebar state from localStorage
const getInitialSidebarState = () => {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("sidebar-open");
    if (saved !== null) {
      return saved === "true";
    }
  }
  return true; // Default to open if no saved state
};

export default function AdminShell({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(getInitialSidebarState);
  const [isHoveringSidebar, setIsHoveringSidebar] = useState(false);

  const effectiveSidebarOpen = isSidebarOpen || isHoveringSidebar;

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
    setIsHoveringSidebar(false);
  };

  // Persist sidebar state in localStorage when it changes
  useEffect(() => {
    localStorage.setItem("sidebar-open", isSidebarOpen.toString());
  }, [isSidebarOpen]);

  return (
    <AuthGuard>
      <div className="min-h-screen flex bg-surface">
        <AdminSidebar
          isOpen={effectiveSidebarOpen}
          setIsOpen={setIsSidebarOpen}
          onMouseEnter={() => !isSidebarOpen && setIsHoveringSidebar(true)}
          onMouseLeave={() => setIsHoveringSidebar(false)}
        />
        <div
          className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${effectiveSidebarOpen ? "lg:ml-64" : "lg:ml-16"}`}
        >
          <AdminTopbar
            isSidebarOpen={effectiveSidebarOpen}
            toggleSidebar={toggleSidebar}
          />
          <main className="flex-1 overflow-auto pb-20 lg:pb-0">{children}</main>
        </div>
        <AdminMobileNav />
      </div>
    </AuthGuard>
  );
}
