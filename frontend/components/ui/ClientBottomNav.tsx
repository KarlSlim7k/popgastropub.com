"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Dashboard", href: "/puntos", icon: "dashboard" },
  { label: "Menú", href: "/menu", icon: "restaurant" },
  { label: "Premios", href: "/recompensas", icon: "redeem" },
  { label: "Perfil", href: "/perfil", icon: "account_circle" },
];

export default function ClientBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-[#0D0D0D]/80 backdrop-blur-xl border-t border-white/5 z-50 lg:hidden flex justify-around items-center px-4 py-3 pb-7 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
      {navItems.map((item) => {
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
            <span className="text-[10px] font-black uppercase tracking-[0.1em] leading-none">
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
