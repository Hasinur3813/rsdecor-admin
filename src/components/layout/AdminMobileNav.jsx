"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  MessageSquare,
  Settings,
  MoreHorizontal,
  Grid,
  Users,
  Tag,
  Megaphone,
  MonitorPlay,
  Image as ImageIcon,
  X,
} from "lucide-react";

const MAIN_TABS = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Products", href: "/products", icon: Package },
  { label: "Orders", href: "/orders", icon: ShoppingBag },
  { label: "Enquiries", href: "/enquiries", icon: MessageSquare },
];

const MORE_TABS = [
  { label: "Categories", href: "/categories", icon: Grid },
  { label: "Customers", href: "/customers", icon: Users },
  { label: "Coupons", href: "/coupons", icon: Tag },
  { label: "Broadcasts", href: "/broadcasts", icon: Megaphone },
  { label: "Sliders", href: "/sliders", icon: MonitorPlay },
  { label: "Gallery", href: "/gallery", icon: ImageIcon },
  { label: "Settings", href: "/settings", icon: Settings },
];

export default function AdminMobileNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const menuRef = useRef(null);
  const moreButtonRef = useRef(null);

  const isActive = (href) => {
    if (href === "/dashboard") return pathname === href;
    return pathname.startsWith(href);
  };

  // Close menu when route changes
  useEffect(() => {
    setTimeout(() => setShowMoreMenu(false), 0);
  }, [pathname]);

  // Close menu when clicking outside
  const handleClickOutside = useCallback(
    (event) => {
      if (
        showMoreMenu &&
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        moreButtonRef.current &&
        !moreButtonRef.current.contains(event.target)
      ) {
        setShowMoreMenu(false);
      }
    },
    [showMoreMenu],
  );

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]);

  const toggleMoreMenu = useCallback(() => {
    setShowMoreMenu((prev) => !prev);
  }, []);

  return (
    <div className="lg:hidden">
      {/* More Menu Overlay */}
      {showMoreMenu && (
        <div className="fixed inset-0 z-40 flex items-end justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowMoreMenu(false)}
          />
          <div
            ref={menuRef}
            className="relative z-50 w-full max-w-md bg-white rounded-t-3xl shadow-2xl"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">More</h3>
              <button
                onClick={() => setShowMoreMenu(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-4 grid grid-cols-3 gap-2">
              {MORE_TABS.map((tab) => {
                const Icon = tab.icon;
                const active = isActive(tab.href);
                return (
                  <button
                    key={tab.href}
                    onClick={() => router.push(tab.href)}
                    className={`flex flex-col items-center justify-center py-4 rounded-xl transition-all ${
                      active
                        ? "bg-primary/10 text-primary"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <Icon className="w-6 h-6 mb-1" />
                    <span className="text-xs font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </div>
            <div className="h-12" />
          </div>
        </div>
      )}

      {/* Bottom Nav Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg">
        <div className="grid grid-cols-5">
          {MAIN_TABS.map((tab) => {
            const Icon = tab.icon;
            const active = isActive(tab.href);
            return (
              <button
                key={tab.label}
                onClick={() => router.push(tab.href)}
                className="flex flex-col items-center justify-center py-3 gap-1 transition-all"
                style={{
                  color: active ? "var(--color-primary)" : "rgb(107, 114, 128)",
                }}
              >
                <Icon className="w-6 h-6" />
                <span className="text-[10px] font-medium">{tab.label}</span>
              </button>
            );
          })}
          {/* More Button */}
          <button
            ref={moreButtonRef}
            onClick={toggleMoreMenu}
            className="flex flex-col items-center justify-center py-3 gap-1 transition-all"
            style={{
              color: showMoreMenu
                ? "var(--color-primary)"
                : "rgb(107, 114, 128)",
            }}
          >
            <MoreHorizontal className="w-6 h-6" />
            <span className="text-[10px] font-medium">More</span>
          </button>
        </div>
        {/* Safe area padding for iPhone */}
        {/* <div className="h-6" /> */}
      </nav>
    </div>
  );
}
