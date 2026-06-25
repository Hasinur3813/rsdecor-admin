"use client";
import AdminSidebar   from "./AdminSidebar";
import AdminTopbar    from "./AdminTopbar";
import AdminMobileNav from "./AdminMobileNav";

export default function AdminShell({ children }) {
  return (
    <div className="min-h-screen flex bg-surface">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0 lg:ml-64">
        <AdminTopbar />
        <main className="flex-1 overflow-auto pb-20 lg:pb-0">
          {children}
        </main>
      </div>
      <AdminMobileNav />
    </div>
  );
}
