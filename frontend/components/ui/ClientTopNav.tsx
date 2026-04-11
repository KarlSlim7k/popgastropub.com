"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth-provider";
import { useState, useRef, useEffect } from "react";

export default function ClientTopNav() {
  const { session, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const userName = session?.user?.name || "Cliente";
  const userInitials = userName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="fixed top-0 left-0 w-full bg-[#0D0D0D]/80 backdrop-blur-xl border-b border-white/5 z-50 px-6 lg:px-12 py-4 flex justify-between items-center">
      <Link href="/puntos" className="flex flex-col">
        <span className="text-xl font-black text-pop-gold font-epilogue tracking-tighter leading-none">
          POP PEROTE
        </span>
        <span className="text-[8px] text-pop-orange font-bold uppercase tracking-[0.3em] mt-1">
          Exclusive Membership
        </span>
      </Link>

      <div className="hidden lg:flex items-center gap-10">
        <Link href="/puntos" className="text-xs font-black text-white hover:text-pop-gold uppercase tracking-widest transition-colors">Mis Puntos</Link>
        <Link href="/recompensas" className="text-xs font-black text-white hover:text-pop-gold uppercase tracking-widest transition-colors font-bold text-pop-gold shadow-[0_0_10px_rgba(242,199,119,0.2)]">Recompensas</Link>
        <Link href="/mis-facturas" className="text-xs font-black text-white hover:text-pop-gold uppercase tracking-widest transition-colors">Mis Facturas</Link>
        <Link href="/menu" className="text-xs font-black text-white hover:text-pop-gold uppercase tracking-widest transition-colors">Menú Real</Link>
      </div>

      <div className="flex items-center gap-6" ref={menuRef}>
        <button className="text-gray-400 hover:text-pop-gold transition-colors relative">
          <span className="material-symbols-outlined text-2xl">notifications</span>
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-pop-orange rounded-full" />
        </button>

        <div className="relative">
          <button 
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-3 group"
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-pop-orange to-pop-gold p-[1.5px] transition-transform group-hover:scale-110">
              <div className="w-full h-full rounded-full bg-pop-black flex items-center justify-center text-pop-gold font-bold text-[10px] uppercase">
                {userInitials}
              </div>
            </div>
          </button>

          {showUserMenu && (
            <div className="absolute top-12 right-0 w-56 bg-[#1C1B1B] border border-white/10 rounded-2xl shadow-2xl overflow-hidden py-3 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="px-5 py-3 border-b border-white/5 mb-2">
                <p className="text-xs font-black text-white uppercase">{userName}</p>
                <p className="text-[10px] text-pop-orange font-bold uppercase mt-0.5">Membresía VIP</p>
              </div>
              <Link href="/perfil" className="flex items-center gap-3 px-5 py-2.5 text-xs font-bold text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
                <span className="material-symbols-outlined text-lg">person</span> Mi Perfil
              </Link>
              <Link href="/recompensas" className="flex items-center gap-3 px-5 py-2.5 text-xs font-bold text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
                <span className="material-symbols-outlined text-lg">redeem</span> Recompensas
              </Link>
              <Link href="/mis-facturas" className="flex items-center gap-3 px-5 py-2.5 text-xs font-bold text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
                <span className="material-symbols-outlined text-lg">receipt_long</span> Facturación
              </Link>
              <div className="border-t border-white/5 my-2" />
              <button 
                onClick={() => logout()}
                className="w-full flex items-center gap-3 px-5 py-2.5 text-xs font-bold text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <span className="material-symbols-outlined text-lg">logout</span> Cerrar Sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
