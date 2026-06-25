"use client";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, Package, ShoppingBag,
  MessageSquare, Settings,
} from "lucide-react";

const TABS = [
  { label: "Dashboard", href: "/dashboard",  icon: LayoutDashboard },
  { label: "Products",  href: "/products",   icon: Package          },
  { label: "Orders",    href: "/orders",     icon: ShoppingBag      },
  { label: "Enquiries", href: "/enquiries",  icon: MessageSquare    },
  { label: "Settings",  href: "/settings",   icon: Settings         },
];

export default function AdminMobileNav() {
  const pathname = usePathname();
  const router   = useRouter();

  const isActive = (href) => {
    if (href === "/dashboard") return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden
      bg-sidebar border-t border-white/5">
      <div className="grid grid-cols-5">
        {TABS.map(tab => {
          const Icon   = tab.icon;
          const active = isActive(tab.href);
          return (
            <button
              key={tab.label}
              onClick={() => router.push(tab.href)}
              className="flex flex-col items-center justify-center py-3 gap-1
                transition-colors"
              style={{
                color: active
                  ? "var(--color-primary)"
                  : "rgba(255,255,255,0.3)",
              }}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
