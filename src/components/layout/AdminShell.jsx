"use client";
import { useState, useEffect } from "react";
import AuthGuard from "@/components/auth/AuthGuard";
import AdminSidebar from "./AdminSidebar";
import AdminTopbar from "./AdminTopbar";
import AdminMobileNav from "./AdminMobileNav";

export default function AdminShell({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isHoveringSidebar, setIsHoveringSidebar] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const saved = localStorage.getItem("sidebar-open");
    if (saved !== null) {
      setIsSidebarOpen(saved === "true");
    }
  }, []);

  const effectiveSidebarOpen = isSidebarOpen || isHoveringSidebar;

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => {
      const newState = !prev;
      localStorage.setItem("sidebar-open", newState.toString());
      return newState;
    });
    setIsHoveringSidebar(false);
  };

  // Persist sidebar state when updated outside of toggle (if any)
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("sidebar-open", isSidebarOpen.toString());
    }
  }, [isSidebarOpen, isMounted]);

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
