"use client";
import { usePathname } from "next/navigation";
import { ChevronRight, Bell, Plus, LogOut, Menu, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

const LABEL_MAP = {
  "/dashboard": "Dashboard",
  "/products": "Products",
  "/products/new": "Add Product",
  "/orders": "Orders",
  "/customers": "Customers",
  "/categories": "Categories",
  "/coupons": "Coupons",
  "/enquiries": "Enquiries",
  "/broadcasts": "Broadcasts",
  "/sliders": "Sliders",
  "/gallery": "Gallery",
  "/settings": "Settings",
};

export default function AdminTopbar({ isSidebarOpen, toggleSidebar }) {
  const pathname = usePathname();
  const router = useRouter();
  const { admin, logout, initializing } = useAuth();

  const getSegments = () => {
    if (LABEL_MAP[pathname]) return [LABEL_MAP[pathname]];
    const parts = pathname.split("/").filter(Boolean);
    if (parts.length >= 2) {
      const parent = LABEL_MAP["/" + parts[0]] || parts[0];
      const child = parts[1] === "new" ? "Add New" : `#${parts[1]}`;
      return [parent, child];
    }
    return ["Admin"];
  };

  const segments = getSegments();
  const initial = admin?.name ? admin.name.charAt(0).toUpperCase() : "";

  return (
    <header
      className="sticky top-0 z-30 h-16 bg-white border-b border-gray-100
      flex items-center justify-between px-4 lg:px-6 gap-4"
    >
      <div className="flex items-center gap-4">
        {/* Sidebar Toggle Button */}
        <button
          onClick={toggleSidebar}
          className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors"
        >
          {isSidebarOpen ? (
            <X className="w-4 h-4" />
          ) : (
            <Menu className="w-4 h-4" />
          )}
        </button>
        <nav className="flex items-center gap-1.5 text-sm min-w-0">
          <span className="text-gray-400 shrink-0">Admin</span>
          {segments.map((seg, i) => (
            <span key={i} className="flex items-center gap-1.5 min-w-0">
              <ChevronRight className="w-3.5 h-3.5 text-gray-300 shrink-0" />
              <span
                className={`truncate ${
                  i === segments.length - 1
                    ? "font-semibold text-gray-800"
                    : "text-gray-400"
                }`}
              >
                {seg}
              </span>
            </span>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={() => router.push("/products/new")}
          className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl
            bg-primary text-white text-sm font-medium
            hover:bg-primary-dark transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </button>

        <button
          className="relative w-9 h-9 rounded-xl flex items-center
          justify-center text-gray-400 hover:bg-gray-100 transition-colors"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary" />
        </button>

        <button
          onClick={logout}
          className="w-9 h-9 rounded-xl flex items-center justify-center
            text-gray-400 hover:bg-gray-100 transition-colors"
          title="Logout"
        >
          <LogOut className="w-4 h-4" />
        </button>

        <div
          className="w-9 h-9 rounded-xl bg-primary flex items-center
          justify-center text-white text-sm font-bold"
          suppressHydrationWarning
        >
          {!initializing && initial}
        </div>
      </div>
    </header>
  );
}
