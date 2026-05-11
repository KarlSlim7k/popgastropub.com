"use client";

import React, { useEffect, useState } from 'react';
import { useAuth } from "@/lib/auth-provider";
import { fetchWithAuth } from "@/lib/api";

interface AnalyticsData {
  puntos_totales: number;
  orders_served: number;
  avg_rating: number;
  total_sales: number;
  categorias: { name: string; points: number }[];
}

export default function StaffAnalyticsPage() {
  const { session } = useAuth();
  const [data, setData] = useState<AnalyticsData | null>(null);

  useEffect(() => {
    if (!session?.token) return;
    fetchWithAuth<AnalyticsData>('/staff/analytics', session.token).then(setData).catch(() => {});
  }, [session?.token]);

  const categorias = data?.categorias || [];
  const maxPoints = Math.max(...categorias.map(c => c.points), 1);

  return (
    <main className="pt-24 lg:pt-20 p-6 lg:p-10 min-h-screen bg-pop-black">
      <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl lg:text-5xl font-black tracking-tighter text-white font-epilogue uppercase">Mis Analíticas</h1>
          <p className="text-pop-orange mt-2 text-xs font-bold uppercase tracking-[0.3em]">Rendimiento individual • POP Bar Stars</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
        <section className="lg:col-span-3 space-y-8">
          {/* Points by Category Chart */}
          <article className="bg-[#1C1B1B] p-8 rounded-xl border border-white/5 min-h-[400px] flex flex-col">
            <h3 className="text-xl font-black uppercase font-epilogue tracking-tighter text-white mb-10">Puntos por Categoría</h3>
            <div className="flex-1 flex items-end justify-between gap-1 sm:gap-4 px-4">
              {categorias.map((cat, i) => (
                <div key={i} className="flex-1 flex flex-col items-center group">
                  <div className="w-full bg-gradient-to-t from-pop-orange/40 to-pop-gold rounded-t-sm group-hover:from-pop-orange group-hover:to-pop-lightGold transition-all duration-300 relative" style={{ height: `${(cat.points / maxPoints) * 100}%`, minHeight: '4px' }}>
                    <span className="absolute -top-10 left-1/2 -translate-x-1/2 text-xs font-mono font-bold text-pop-gold opacity-0 group-hover:opacity-100 transition-opacity">{cat.points}</span>
                  </div>
                  <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mt-4 text-center">{cat.name}</span>
                </div>
              ))}
            </div>
          </article>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <article className="bg-[#1C1B1B] p-8 rounded-xl border border-white/5">
              <h3 className="text-lg font-black uppercase font-epilogue tracking-tighter text-white mb-6">Eficiencia de Servicio</h3>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-[10px] text-gray-400 font-bold uppercase">Órdenes Servidas</span>
                    <span className="text-xs text-pop-gold font-bold">{data?.orders_served || 0}</span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-pop-gold" style={{ width: `${Math.min(100, (data?.orders_served || 0) / 2)}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-[10px] text-gray-400 font-bold uppercase">Calificación Promedio</span>
                    <span className="text-xs text-pop-gold font-bold">{data?.avg_rating || 0} ★</span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-pop-gold" style={{ width: `${((data?.avg_rating || 0) / 5) * 100}%` }} />
                  </div>
                </div>
              </div>
            </article>

            <article className="bg-[#1C1B1B] p-8 rounded-xl border border-white/5">
              <h3 className="text-lg font-black uppercase font-epilogue tracking-tighter text-white mb-6">Ventas Totales</h3>
              <p className="text-4xl font-black text-pop-gold font-epilogue tracking-tighter">${(data?.total_sales || 0).toLocaleString()}</p>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-2 font-bold">Acumulado</p>
            </article>
          </div>
        </section>

        <aside className="space-y-8">
          <article className="bg-[#1C1B1B] p-8 rounded-xl border border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-pop-gold/10 blur-[60px] rounded-full" />
            <h3 className="text-lg font-black uppercase font-epilogue tracking-tighter text-white mb-8">Puntos Totales</h3>
            <p className="text-5xl font-black text-white tracking-tighter font-epilogue mb-2">{(data?.puntos_totales || 0).toLocaleString()}</p>
            <p className="text-[10px] text-pop-orange font-bold uppercase tracking-[0.2em]">Acumulado Histórico</p>
          </article>
        </aside>
      </div>
    </main>
  );
}
