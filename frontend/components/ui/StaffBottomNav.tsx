"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const bottomNavItems = [
  { label: "Dashboard", href: "/staff/dashboard", icon: "dashboard" },
  { label: "Órdenes", href: "/staff/dashboard", icon: "restaurant" },
  { label: "Ranking", href: "/staff/ranking", icon: "military_tech" },
  { label: "Perfil", href: "/staff/dashboard", icon: "person" },
];

export default function StaffBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-[#0D0D0D] border-t border-white/10 z-50 lg:hidden flex justify-around items-center px-4 py-3 pb-6 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
      {bottomNavItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.label}
            href={item.href}
            className={`flex flex-col items-center gap-1 transition-all ${
              isActive ? "text-pop-gold" : "text-gray-500 hover:text-white"
            }`}
          >
            <span
              className={`material-symbols-outlined text-2xl transition-transform ${
                isActive ? "scale-110" : ""
              }`}
              style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
            >
              {item.icon}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest leading-none">
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
