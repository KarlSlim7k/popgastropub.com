'use client';

import { useState } from 'react';
import { RequireRole } from '@/lib/auth-provider';
import StaffSidebar from '@/components/ui/StaffSidebar';
import StaffBottomNav from '@/components/ui/StaffBottomNav';

export default function StaffLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <RequireRole roles={['mesero', 'admin']}>
      <div className="min-h-screen bg-pop-black">
        {/* Mobile Header */}
        <header className="lg:hidden fixed top-0 w-full bg-[#0D0D0D] border-b border-white/5 z-40 px-6 py-4 flex justify-between items-center">
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
                MD
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

        <StaffSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        
        <div className="lg:pl-64 flex flex-col min-h-screen pb-24 lg:pb-0">
          <div className="flex-1">
            {children}
          </div>
          
          <footer className="bg-[#1C1B1B] py-10 px-6 lg:px-10 border-t border-white/5 mt-10 hidden lg:block">
            <div className="flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="text-center md:text-left">
                <span className="text-pop-gold font-black text-2xl font-epilogue tracking-tighter">POP PEROTE</span>
                <p className="text-[10px] text-gray-500 mt-2 uppercase tracking-[0.2em]">
                  © 2024 Portal de Staff - POP Bar Stars Unit
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-6 lg:gap-8 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">
                <a className="hover:text-pop-gold transition-colors" href="#">Manual de Servicio</a>
                <a className="hover:text-pop-gold transition-colors" href="#">Código de Conducta</a>
                <a className="hover:text-pop-gold transition-colors" href="#">Soporte IT</a>
              </div>
            </div>
          </footer>
        </div>

        <StaffBottomNav />
      </div>
    </RequireRole>
  );
}