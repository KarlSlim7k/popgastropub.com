"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/lib/auth-provider";

const navItems = [
  { label: "Dashboard", href: "/admin/dashboard", icon: "dashboard" },
  { label: "Gestión Menú", href: "/admin/gestion-menu", icon: "restaurant_menu" },
  { label: "Promociones", href: "/admin/promociones", icon: "sell" },
  { label: "Puntos POP", href: "/admin/puntos", icon: "military_tech" },
  { label: "Usuarios", href: "/admin/usuarios", icon: "group" },
  { label: "Ranking Staff", href: "/admin/meseros", icon: "star" },
  { label: "Facturación", href: "/admin/facturacion", icon: "receipt_long" },
];

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const { session, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const userName = session?.user?.name || "Admin User";
  const userInitials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
  const userEmail = session?.user?.email || "admin@pop-perote.com";

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    }
    if (showUserMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showUserMenu]);

  const handleLogout = async () => {
    setShowUserMenu(false);
    onClose();
    await logout();
  };

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
          <Link href="/admin/dashboard" className="flex flex-col" onClick={onClose}>
            <span className="text-2xl font-black text-pop-gold font-epilogue tracking-tighter">
              POP PEROTE
            </span>
            <span className="text-[10px] text-pop-orange font-bold uppercase tracking-[0.3em] mt-1">
              CONTROL CENTRAL
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

        {/* User Section with Dropdown */}
        <div className="relative bg-[#131111] border-t border-[#1A1A1A]" ref={menuRef}>
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="w-full p-6 flex items-center gap-4 hover:bg-white/5 transition-colors text-left"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pop-orange to-pop-gold p-[2px] flex-shrink-0">
              <div className="w-full h-full rounded-full bg-pop-black flex items-center justify-center text-pop-gold font-bold text-xs">
                {userInitials}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white uppercase tracking-wider truncate">{userName}</p>
              <p className="text-[10px] text-pop-orange font-bold uppercase">Master Access</p>
            </div>
            <span
              className={`material-symbols-outlined text-gray-500 text-lg transition-transform duration-200 ${
                showUserMenu ? "rotate-180" : ""
              }`}
            >
              expand_more
            </span>
          </button>

          {/* Dropdown Menu */}
          {showUserMenu && (
            <div className="absolute bottom-full left-0 right-0 bg-[#1C1B1B] border-t border-[#1A1A1A] border-b border-[#1A1A1A] shadow-[0_-10px_40px_rgba(0,0,0,0.5)] animate-in fade-in slide-in-from-bottom-2 duration-200">
              <div className="p-3 space-y-1">
                {/* User Info Header */}
                <div className="px-3 py-2 mb-1 bg-black/30 rounded-lg">
                  <p className="text-xs font-bold text-white">{userName}</p>
                  <p className="text-[10px] text-gray-500 truncate">{userEmail}</p>
                </div>

                {/* Perfil */}
                <Link
                  href="/admin/perfil"
                  onClick={() => {
                    setShowUserMenu(false);
                    onClose();
                  }}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-all duration-200"
                >
                  <span className="material-symbols-outlined text-lg text-gray-500">person_outline</span>
                  Perfil
                </Link>

                {/* Configuración */}
                <Link
                  href="/admin/configuracion"
                  onClick={() => {
                    setShowUserMenu(false);
                    onClose();
                  }}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-all duration-200"
                >
                  <span className="material-symbols-outlined text-lg text-gray-500">settings</span>
                  Configuración
                </Link>

                {/* Divider */}
                <div className="border-t border-[#1A1A1A] my-1" />

                {/* Cerrar Sesión */}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-error hover:bg-error/10 transition-all duration-200"
                >
                  <span className="material-symbols-outlined text-lg">logout</span>
                  Cerrar Sesión
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
}
