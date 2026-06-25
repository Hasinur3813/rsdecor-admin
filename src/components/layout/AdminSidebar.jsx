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
} from "lucide-react";
import Link from "next/link";

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
      { label: "Enquiries", href: "/enquiries", icon: MessageSquare, badge: 5 },
      { label: "Broadcasts", href: "/broadcasts", icon: Megaphone },
    ],
  },
  {
    group: "CONTENT",
    items: [
      { label: "Gallery", href: "/gallery", icon: Image },
      { label: "Settings", href: "/settings", icon: Settings },
    ],
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
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
      className="hidden lg:flex fixed left-0 top-0 h-screen w-64
      flex-col z-40 bg-sidebar border-r border-white/5"
    >
      {/* Brand */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-white/5">
        <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
          <Layers className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="font-heading font-bold text-white text-base leading-none">
            RS Wallpaper
          </p>
          <p className="text-[10px] text-white/30 uppercase tracking-widest mt-0.5">
            Admin Panel
          </p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {NAV.map((group) => (
          <div key={group.group}>
            <p
              className="text-[10px] font-semibold tracking-widest
              text-white/25 px-3 mb-2"
            >
              {group.group}
            </p>

            <div className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                const hasKids = item.children?.length > 0;
                const isExpanded = expanded.includes(item.label);

                return (
                  <div key={item.label}>
                    <div
                      onClick={() =>
                        hasKids ? toggle(item.label) : router.push(item.href)
                      }
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl
                        cursor-pointer transition-all duration-150 text-sm
                        ${
                          active
                            ? "bg-primary/20 text-white"
                            : "text-white/45 hover:bg-white/6 hover:text-white/80"
                        }`}
                    >
                      <Icon
                        className="w-4 h-4 shrink-0"
                        style={{
                          color: active ? "var(--color-primary)" : undefined,
                        }}
                      />
                      <span className="flex-1 font-medium">{item.label}</span>

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
                          className="w-3.5 h-3.5 text-white/30 transition-transform duration-200"
                          style={{
                            transform: isExpanded ? "rotate(180deg)" : "none",
                          }}
                        />
                      )}
                    </div>

                    {/* Children */}
                    {hasKids && isExpanded && (
                      <div
                        className="ml-7 mt-0.5 space-y-0.5
                        border-l border-white/8 pl-3"
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
                                    : "text-white/40 hover:text-white/70"
                                }`}
                            >
                              <span
                                className="w-1 h-1 rounded-full"
                                style={{
                                  background: childActive
                                    ? "var(--color-primary)"
                                    : "rgba(255,255,255,0.25)",
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
      <div className="p-3 border-t border-white/5">
        <button
          onClick={() => router.push("/login")}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl
            text-sm text-white/40 hover:bg-red-500/10 hover:text-red-400
            transition-all cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
