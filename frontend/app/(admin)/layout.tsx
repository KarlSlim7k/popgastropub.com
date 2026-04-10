'use client';

import { useState } from 'react';
import { RequireRole } from '@/lib/auth-provider';
import AdminSidebar from '@/components/ui/AdminSidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <RequireRole roles={['admin']}>
      <div className="min-h-screen bg-pop-black">
        {/* Mobile Header */}
        <header className="lg:hidden fixed top-0 w-full bg-[#0D0D0D] border-b border-white/5 z-30 px-6 py-4 flex justify-between items-center">
          <div className="flex flex-col">
            <span className="text-lg font-black text-pop-gold font-epilogue tracking-tighter leading-none">
              POP PEROTE
            </span>
            <span className="text-[8px] text-pop-orange font-bold uppercase tracking-[0.2em] mt-1">
              CONTROL CENTRAL
            </span>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="text-pop-gold p-2 hover:bg-white/5 rounded-lg transition-colors"
          >
            <span className="material-symbols-outlined text-2xl">menu</span>
          </button>
        </header>

        <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        
        <div className="lg:pl-64 flex flex-col min-h-screen">
          <div className="flex-1">
            {children}
          </div>
          <footer className="bg-[#1C1B1B] py-10 px-6 lg:px-10 border-t border-white/5 mt-10">
            <div className="flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="text-center md:text-left">
                <span className="text-pop-gold font-black text-2xl font-epilogue tracking-tighter">POP PEROTE</span>
                <p className="text-[10px] text-gray-500 mt-2 uppercase tracking-[0.2em]">
                  © 2024 Gastronomic Editorial - Internal Control Unit
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-6 lg:gap-8 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">
                <a className="hover:text-pop-gold transition-colors" href="#">Estado del Servidor</a>
                <a className="hover:text-pop-gold transition-colors" href="#">Logs de Respaldo</a>
                <a className="hover:text-pop-gold transition-colors" href="#">Portal de Soporte</a>
                <a className="hover:text-pop-gold transition-colors" href="#">Privacidad</a>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </RequireRole>
  );
}