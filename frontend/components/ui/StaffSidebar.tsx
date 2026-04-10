"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Mi Dashboard", href: "/staff/dashboard", icon: "dashboard" },
  { label: "Reservaciones", href: "/staff/dashboard", icon: "calendar_month" }, // Placeholder
  { label: "Carta / Menú", href: "/staff/dashboard", icon: "restaurant_menu" }, // Placeholder
  { label: "Ranking POP Stars", href: "/staff/ranking", icon: "star" },
  { label: "Analíticas", href: "/staff/dashboard", icon: "monitoring" }, // Placeholder
];

interface StaffSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function StaffSidebar({ isOpen, onClose }: StaffSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <nav className={`fixed top-0 left-0 w-64 h-full bg-[#0D0D0D] border-r border-[#1A1A1A] z-50 flex flex-col transition-transform duration-300 transform ${
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      }`}>
        <div className="p-8 flex justify-between items-center">
          <Link href="/staff/dashboard" className="flex flex-col" onClick={onClose}>
            <span className="text-2xl font-black text-pop-gold font-epilogue tracking-tighter">
              POP PEROTE
            </span>
            <span className="text-[10px] text-pop-orange font-bold uppercase tracking-[0.3em] mt-1">
              PORTAL STAFF
            </span>
          </Link>
          <button onClick={onClose} className="lg:hidden text-gray-500 hover:text-white">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-4 px-4 py-3.5 rounded-lg transition-all duration-300 group ${
                  isActive
                    ? "bg-pop-gold/10 text-pop-gold"
                    : "text-gray-500 hover:text-white hover:bg-white/5"
                }`}
              >
                <span
                  className={`material-symbols-outlined text-2xl transition-transform group-hover:scale-110 ${
                    isActive ? "text-pop-gold" : "text-gray-600 group-hover:text-pop-lightGold"
                  }`}
                  style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
                >
                  {item.icon}
                </span>
                <span className="text-sm font-bold tracking-tight uppercase font-manrope">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>

        <div className="p-6 bg-[#131111] border-t border-[#1A1A1A]">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pop-orange to-pop-gold p-[2px]">
              <div className="w-full h-full rounded-full bg-pop-black flex items-center justify-center text-pop-gold font-bold text-xs uppercase">
                RS
              </div>
            </div>
            <div>
              <p className="text-xs font-bold text-white uppercase tracking-wider">Ricardo S.</p>
              <p className="text-[10px] text-pop-orange font-bold uppercase">Master Mesero</p>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
