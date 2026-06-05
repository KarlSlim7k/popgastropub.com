"use client";

import { useState } from "react";
import { RequireRole, useAuth } from "@/lib/auth-provider";
import StaffSidebar from "@/components/ui/StaffSidebar";
import StaffBottomNav from "@/components/ui/StaffBottomNav";

function StaffLayoutInner({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { session } = useAuth();
  const userName = session?.user?.name || "";
  const userInitials =
    userName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "ST";

  return (
    <div className="min-h-screen bg-pop-black">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 w-full bg-pop-darkGreen border-b border-white/10 z-40 px-6 py-4 flex justify-between items-center">
        <div className="flex flex-col">
          <span className="text-lg font-black text-pop-gold font-epilogue tracking-tighter leading-none">
            POP PEROTE
          </span>
          <span className="text-[8px] text-pop-orange font-bold uppercase tracking-[0.2em] mt-1">
            PORTAL STAFF
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pop-orange to-pop-gold p-[1.5px] flex-shrink-0">
            <div className="w-full h-full rounded-full bg-pop-black flex items-center justify-center text-pop-gold font-bold text-[10px] uppercase">
              {userInitials}
            </div>
          </div>
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="text-pop-gold p-2 hover:bg-white/5 rounded-lg transition-colors"
          >
            <span className="material-symbols-outlined text-2xl">menu</span>
          </button>
        </div>
      </header>

      <StaffSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className="lg:pl-64 flex flex-col min-h-screen pb-24 lg:pb-0">
        <div className="flex-1">{children}</div>

        <footer className="bg-pop-darkGreen py-10 px-6 lg:px-10 border-t border-white/10 mt-10 hidden lg:block">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-center md:text-left">
              <span className="text-pop-gold font-black text-2xl font-epilogue tracking-tighter">
                POP PEROTE
              </span>
              <p className="text-[10px] text-gray-500 mt-2 uppercase tracking-[0.2em]">
                © 2026 Portal de Staff - POP Bar Stars Unit
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-6 lg:gap-8 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">
              <span className="text-gray-600 cursor-default">
                Manual de Servicio
              </span>
              <span className="text-gray-600 cursor-default">
                Código de Conducta
              </span>
              <a
                className="hover:text-pop-gold transition-colors"
                href="https://wa.me/522828253243?text=Soporte%20IT%20-%20Portal%20Staff%20POP%20Perote"
                target="_blank"
                rel="noopener noreferrer"
              >
                Soporte IT
              </a>
            </div>
          </div>
        </footer>
      </div>

      <StaffBottomNav />
    </div>
  );
}

export default function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RequireRole roles={["mesero", "admin"]}>
      <StaffLayoutInner>{children}</StaffLayoutInner>
    </RequireRole>
  );
}
