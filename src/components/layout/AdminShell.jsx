"use client";
import { useState, useEffect } from "react";
import AuthGuard from "@/components/auth/AuthGuard";
import AdminSidebar from "./AdminSidebar";
import AdminTopbar from "./AdminTopbar";
import AdminMobileNav from "./AdminMobileNav";

export default function AdminShell({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Persist sidebar state in localStorage
  useEffect(() => {
    const saved = localStorage.getItem("sidebar-open");
    if (saved !== null) {
      setIsSidebarOpen(saved === "true");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("sidebar-open", isSidebarOpen.toString());
  }, [isSidebarOpen]);

  return (
    <AuthGuard>
      <div className="min-h-screen flex bg-surface">
        <AdminSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
        <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${isSidebarOpen ? "lg:ml-64" : "lg:ml-16"}`}>
          <AdminTopbar
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
          />
          <main className="flex-1 overflow-auto pb-20 lg:pb-0">
            {children}
          </main>
        </div>
        <AdminMobileNav />
      </div>
    </AuthGuard>
  );
}
