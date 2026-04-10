'use client';

import { RequireRole } from '@/lib/auth-provider';
import AdminSidebar from '@/components/ui/AdminSidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <RequireRole roles={['admin']}>
      <div className="min-h-screen bg-pop-black">
        <AdminSidebar />
        <div className="lg:pl-64 flex flex-col min-h-screen">
          <div className="flex-1">
            {children}
          </div>
          <footer className="bg-[#1C1B1B] py-10 px-10 border-t border-white/5 mt-10">
            <div className="flex flex-col md:flex-row justify-between items-center gap-8">
              <div>
                <span className="text-pop-gold font-black text-2xl font-epilogue tracking-tighter">POP PEROTE</span>
                <p className="text-[10px] text-gray-500 mt-2 uppercase tracking-[0.2em]">
                  © 2024 Gastronomic Editorial - Internal Control Unit
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-8 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">
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