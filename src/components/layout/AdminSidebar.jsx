"use client";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  ChevronDown,
  LogOut,
  Layers,
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  MessageSquare,
  Image,
  Settings,
  Megaphone,
  Loader2,
  Tag,
  MonitorPlay,
  Grid,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

const NAV = [
  {
    group: "MAIN",
    items: [{ label: "Dashboard", href: "/dashboard", icon: LayoutDashboard }],
  },
  {
    group: "MANAGE",
    items: [
      {
        label: "Products",
        href: "/products",
        icon: Package,
        children: [
          { label: "All Products", href: "/products" },
          { label: "Add Product", href: "/products/new" },
        ],
      },
      { label: "Orders", href: "/orders", icon: ShoppingBag, badge: 3 },
      { label: "Customers", href: "/customers", icon: Users },
      { label: "Categories", href: "/categories", icon: Grid },
      { label: "Coupons", href: "/coupons", icon: Tag },
      { label: "Enquiries", href: "/enquiries", icon: MessageSquare, badge: 5 },
      { label: "Broadcasts", href: "/broadcasts", icon: Megaphone },
    ],
  },
  {
    group: "CONTENT",
    items: [
      { label: "Sliders", href: "/sliders", icon: MonitorPlay },
      { label: "Gallery", href: "/gallery", icon: Image },
      { label: "Settings", href: "/settings", icon: Settings },
    ],
  },
];

export default function AdminSidebar({
  isOpen,
  setIsOpen,
  onMouseEnter,
  onMouseLeave,
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout, loading } = useAuth();
  const [expanded, setExpanded] = useState(["Products"]);

  const toggle = (label) =>
    setExpanded((p) =>
      p.includes(label) ? p.filter((l) => l !== label) : [...p, label],
    );

  const isActive = (href) => {
    if (href === "/dashboard") return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <aside
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`hidden lg:flex fixed left-0 top-0 h-screen flex-col z-1000 bg-white border-r border-gray-200 transition-all duration-300 overflow-visible ${isOpen ? "w-64" : "w-16"}`}
    >
      {/* Brand */}
      <div
        className={`flex items-center ${isOpen ? "gap-3 px-5" : "justify-center"} py-5 border-b border-gray-200`}
      >
        <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shrink-0">
          <Layers className="w-5 h-5 text-white" />
        </div>
        {isOpen && (
          <div className="min-w-0">
            <p className="font-heading font-bold text-gray-900 text-base leading-none truncate">
              RS Wallpaper
            </p>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-0.5">
              Admin Panel
            </p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto overflow-x-visible px-3 py-4 space-y-6">
        {NAV.map((group) => (
          <div key={group.group}>
            {isOpen && (
              <p
                className="text-[10px] font-semibold tracking-widest
                text-gray-400 px-3 mb-2"
              >
                {group.group}
              </p>
            )}

            <div className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                const hasKids = item.children?.length > 0;
                const isExpanded = expanded.includes(item.label);

                return (
                  <div key={item.label} className="relative group">
                    <div
                      onClick={() =>
                        hasKids ? toggle(item.label) : router.push(item.href)
                      }
                      className={`flex items-center ${isOpen ? "gap-3 px-3" : "justify-center px-2"} py-2.5 rounded-xl
                        cursor-pointer transition-all duration-150 text-sm
                        ${
                          active
                            ? "bg-primary/10 text-gray-900"
                            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                        }`}
                    >
                      <Icon
                        className="w-4 h-4 shrink-0"
                        style={{
                          color: active ? "var(--color-primary)" : undefined,
                        }}
                      />
                      {isOpen && (
                        <>
                          <span className="flex-1 font-medium">
                            {item.label}
                          </span>

                          {item.badge && (
                            <span
                              className="text-[10px] font-bold text-white
                              bg-primary px-1.5 py-0.5 rounded-full leading-none"
                            >
                              {item.badge}
                            </span>
                          )}

                          {hasKids && (
                            <ChevronDown
                              className="w-3.5 h-3.5 text-gray-400 transition-transform duration-200"
                              style={{
                                transform: isExpanded
                                  ? "rotate(180deg)"
                                  : "none",
                              }}
                            />
                          )}
                        </>
                      )}
                    </div>

                    {/* Collapsed mode: tooltip with optional submenu */}
                    {!isOpen && (
                      <div className="absolute left-full top-0 ml-2 opacity-0 group-hover:opacity-100 transition-opacity z-2000 pointer-events-none group-hover:pointer-events-auto">
                        {hasKids ? (
                          <div className="bg-white rounded-lg border border-gray-200 shadow-xl py-2 min-w-44 overflow-visible">
                            {/* Main item label */}
                            <div className="px-3 py-2 text-xs font-semibold text-gray-500 border-b border-gray-100">
                              {item.label}
                              {item.badge && ` (${item.badge})`}
                            </div>
                            {/* Submenu items */}
                            <div className="py-1">
                              {item.children.map((child) => {
                                const childActive = pathname === child.href;
                                return (
                                  <Link
                                    key={child.href}
                                    href={child.href}
                                    className={`block px-3 py-2 text-sm transition-colors
                                      ${
                                        childActive
                                          ? "bg-primary/10 text-primary font-medium"
                                          : "text-gray-600 hover:bg-gray-50"
                                      }`}
                                  >
                                    {child.label}
                                  </Link>
                                );
                              })}
                            </div>
                          </div>
                        ) : (
                          <div className="px-3 py-2 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap">
                            {item.label}
                            {item.badge && ` (${item.badge})`}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Children - only show when sidebar is open */}
                    {isOpen && hasKids && isExpanded && (
                      <div
                        className="ml-7 mt-0.5 space-y-0.5
                        border-l border-gray-200 pl-3"
                      >
                        {item.children.map((child) => {
                          const childActive = pathname === child.href;
                          return (
                            <Link
                              key={child.href}
                              href={child.href}
                              className={`flex items-center gap-2 px-3 py-2
                                rounded-lg text-sm transition-colors
                                ${
                                  childActive
                                    ? "text-primary font-semibold"
                                    : "text-gray-500 hover:text-gray-700"
                                }`}
                            >
                              <span
                                className="w-1 h-1 rounded-full"
                                style={{
                                  background: childActive
                                    ? "var(--color-primary)"
                                    : "#d1d5db",
                                }}
                              />
                              {child.label}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-gray-200">
        <button
          onClick={() => logout()}
          disabled={loading}
          className={`w-full flex items-center ${isOpen ? "gap-3 px-3" : "justify-center px-2"} py-2.5 rounded-xl
            text-sm transition-all cursor-pointer
            ${loading ? "opacity-50 cursor-not-allowed" : "text-gray-600 hover:bg-red-50 hover:text-red-600"}`}
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <LogOut className="w-4 h-4" />
          )}
          {isOpen && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  );
}
