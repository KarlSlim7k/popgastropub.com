"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth-provider";
import { fetchWithAuth } from "@/lib/api";
import { useState, useRef, useEffect } from "react";

export default function ClientTopNav() {
  const { session, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const [notifs, setNotifs] = useState<{ id: number; concept: string; points: number; created_at: string }[]>([]);
  const menuRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const userName = session?.user?.name || "Cliente";
  const userInitials = userName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  const token = session?.token;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) setShowUserMenu(false);
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) setShowNotifs(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!token) return;
    fetchWithAuth<any>("/loyalty/history", token)
      .then((data) => {
        const list = Array.isArray(data) ? data : data?.data ?? [];
        setNotifs(list.slice(0, 5));
      })
      .catch(() => {});
  }, [token]);

  return (
    <nav className="fixed top-0 left-0 w-full bg-pop-darkGreen/90 backdrop-blur-xl border-b border-white/10 z-50 px-6 lg:px-12 py-4 flex justify-between items-center">
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
        <Link href="/reservas" className="text-xs font-black text-white hover:text-pop-gold uppercase tracking-widest transition-colors">Reservas</Link>
        <Link href="/pedidos" className="text-xs font-black text-white hover:text-pop-gold uppercase tracking-widest transition-colors">Pedidos</Link>
        <Link href="/recompensas" className="text-xs font-black text-white hover:text-pop-gold uppercase tracking-widest transition-colors">Recompensas</Link>
        <Link href="/mis-facturas" className="text-xs font-black text-white hover:text-pop-gold uppercase tracking-widest transition-colors">Facturas</Link>
      </div>

      <div className="flex items-center gap-6" ref={menuRef}>
        <div className="relative" ref={notifRef}>
          <button onClick={() => setShowNotifs(!showNotifs)} className="text-gray-400 hover:text-pop-gold transition-colors relative">
            <span className="material-symbols-outlined text-2xl">notifications</span>
            {notifs.length > 0 && <span className="absolute -top-1 -right-1 w-2 h-2 bg-pop-orange rounded-full" />}
          </button>
          {showNotifs && (
            <div className="absolute top-12 right-0 w-72 bg-pop-cardGreen border border-white/10 rounded-2xl shadow-2xl overflow-hidden py-2 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="px-4 py-2 border-b border-white/5">
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Actividad Reciente</p>
              </div>
              {notifs.length === 0 ? (
                <p className="px-4 py-6 text-center text-xs text-gray-500">Sin actividad reciente</p>
              ) : (
                notifs.map((n) => (
                  <div key={n.id} className="px-4 py-3 hover:bg-white/5 transition-colors flex justify-between items-center">
                    <div className="min-w-0">
                      <p className="text-[11px] font-bold text-white truncate">{n.concept}</p>
                      <p className="text-[9px] text-gray-500">{new Date(n.created_at).toLocaleDateString("es-MX", { day: "2-digit", month: "short" })}</p>
                    </div>
                    <span className={`text-xs font-black flex-shrink-0 ml-2 ${n.points >= 0 ? "text-green-400" : "text-pop-orange"}`}>
                      {n.points >= 0 ? "+" : ""}{n.points}
                    </span>
                  </div>
                ))
              )}
              <Link href="/puntos" onClick={() => setShowNotifs(false)} className="block px-4 py-2 border-t border-white/5 text-center text-[10px] font-black text-pop-gold uppercase tracking-widest hover:bg-white/5">
                Ver todo
              </Link>
            </div>
          )}
        </div>

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
            <div className="absolute top-12 right-0 w-56 bg-pop-cardGreen border border-white/10 rounded-2xl shadow-2xl overflow-hidden py-3 animate-in fade-in slide-in-from-top-2 duration-200">
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
