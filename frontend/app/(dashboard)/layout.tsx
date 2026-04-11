"use client";

import { RequireRole } from "@/lib/auth-provider";
import ClientTopNav from "@/components/ui/ClientTopNav";
import ClientBottomNav from "@/components/ui/ClientBottomNav";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <RequireRole roles={["cliente"]}>
      <div className="min-h-screen bg-pop-black">
        <ClientTopNav />
        <div className="flex flex-col min-h-screen pb-24 lg:pb-0">
          <div className="flex-1">
            {children}
          </div>
          
          <footer className="bg-[#1C1B1B] py-12 px-6 lg:px-12 border-t border-white/5 mt-auto hidden lg:block">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="text-center md:text-left">
                <span className="text-pop-gold font-black text-2xl font-epilogue tracking-tighter">POP PEROTE</span>
                <p className="text-[10px] text-gray-500 mt-2 uppercase tracking-[0.2em] font-bold">
                  © 2026 Club de Lealtad · Experiencia Gastronómica Obsidian
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-8 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
                <a className="hover:text-pop-gold transition-all" href="#">Aviso de Privacidad</a>
                <a className="hover:text-pop-gold transition-all" href="#">Términos POP Points</a>
                <a className="hover:text-pop-gold transition-all" href="#">Soporte Clientes</a>
              </div>
            </div>
          </footer>
        </div>
        <ClientBottomNav />
      </div>
    </RequireRole>
  );
}