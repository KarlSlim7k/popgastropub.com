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

interface TicketItem {
  ref: string;
  total: number;
  puntos: number;
  canjeado_at: string | null;
  created_at: string;
}

export default function StaffAnalyticsPage() {
  const { session } = useAuth();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [tickets, setTickets] = useState<TicketItem[]>([]);
  const [pointsLog, setPointsLog] = useState<{ id: number; category: string; points: number; multiplier: number; status: 'pending' | 'approved' | 'rejected'; created_at: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session?.token) return;
    setLoading(true);
    Promise.all([
      fetchWithAuth<AnalyticsData>('/staff/analytics', session.token).then(setData).catch(() => {}),
      fetchWithAuth<TicketItem[]>('/staff/tickets', session.token).then(setTickets).catch(() => {}),
      fetchWithAuth<any[]>('/ranking/history', session.token).then(setPointsLog).catch(() => {}),
    ]).finally(() => setLoading(false));
  }, [session?.token]);

  const categorias = data?.categorias || [];
  const maxPoints = Math.max(...categorias.map(c => c.points), 1);

  const formatDate = (d: string) => new Date(d).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }).toUpperCase();

  return (
    <main className="pt-24 lg:pt-20 p-6 lg:p-10 min-h-screen bg-pop-black">
      <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl lg:text-5xl font-black tracking-tighter text-white font-epilogue uppercase">Mis Analíticas</h1>
          <p className="text-pop-orange mt-2 text-xs font-bold uppercase tracking-[0.3em]">Rendimiento individual • POP Bar Stars</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
        {loading ? (
          <div className="lg:col-span-4 flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-pop-gold border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
        <>
        <section className="lg:col-span-3 space-y-8">
          {/* Points by Category Chart */}
          <article className="bg-pop-cardGreen p-8 rounded-xl border border-white/5 min-h-[400px] flex flex-col">
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
            <article className="bg-pop-cardGreen p-8 rounded-xl border border-white/5">
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

            <article className="bg-pop-cardGreen p-8 rounded-xl border border-white/5">
              <h3 className="text-lg font-black uppercase font-epilogue tracking-tighter text-white mb-6">Ventas Totales</h3>
              <p className="text-4xl font-black text-pop-gold font-epilogue tracking-tighter">${(data?.total_sales || 0).toLocaleString()}</p>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-2 font-bold">Acumulado</p>
            </article>
          </div>

          {/* Historial de Tickets QR */}
          <article className="bg-pop-cardGreen rounded-xl border border-white/5 overflow-hidden">
            <header className="p-6 border-b border-white/5 flex justify-between items-center">
              <h3 className="text-sm font-black text-white uppercase tracking-widest font-epilogue">Historial de QRs Generados</h3>
              <span className="material-symbols-outlined text-pop-gold">qr_code_2</span>
            </header>
            {tickets.length === 0 ? (
              <div className="p-10 text-center">
                <span className="material-symbols-outlined text-gray-700 text-4xl">receipt_long</span>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-4">Aún no has generado tickets QR</p>
              </div>
            ) : (
              <table className="w-full text-left">
                <thead className="bg-white/[0.01] text-[10px] font-black uppercase text-gray-500 tracking-widest">
                  <tr>
                    <th className="py-4 px-6">Referencia</th>
                    <th className="py-4 px-4">Monto</th>
                    <th className="py-4 px-4">Puntos</th>
                    <th className="py-4 px-4">Estado</th>
                    <th className="py-4 px-6 text-right">Fecha</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {tickets.map((t) => (
                    <tr key={t.ref} className="hover:bg-white/[0.01]">
                      <td className="py-4 px-6 font-mono text-xs text-gray-400">{t.ref}</td>
                      <td className="py-4 px-4 text-xs font-bold text-white">${t.total}</td>
                      <td className="py-4 px-4 text-xs font-black text-pop-gold">+{t.puntos}</td>
                      <td className="py-4 px-4">
                        {t.canjeado_at ? (
                          <span className="text-[9px] font-black uppercase px-2 py-1 rounded-full bg-green-500/10 text-green-500">Canjeado</span>
                        ) : (
                          <span className="text-[9px] font-black uppercase px-2 py-1 rounded-full bg-yellow-500/10 text-yellow-500">Pendiente</span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-right text-[10px] text-gray-500 font-bold">{formatDate(t.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </article>

          {/* Points Log */}
          {pointsLog.length > 0 && (
            <article className="bg-pop-cardGreen rounded-xl border border-white/5 overflow-hidden">
              <header className="p-6 border-b border-white/5 flex justify-between items-center">
                <h3 className="text-sm font-black text-white uppercase tracking-widest font-epilogue">Historial de Puntos</h3>
                <span className="material-symbols-outlined text-pop-gold">history</span>
              </header>
              <table className="w-full text-left">
                <thead className="bg-white/[0.01] text-[10px] font-black uppercase text-gray-500 tracking-widest">
                  <tr>
                    <th className="py-3 px-6">Categoría</th>
                    <th className="py-3 px-4">Pts</th>
                    <th className="py-3 px-4">Estado</th>
                    <th className="py-3 px-6 text-right">Fecha</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {pointsLog.slice(0, 20).map((log) => (
                    <tr key={log.id} className="hover:bg-white/[0.01]">
                      <td className="py-3 px-6 text-xs font-bold text-white capitalize">{log.category}</td>
                      <td className={`py-3 px-4 text-xs font-black ${log.status === 'approved' ? 'text-pop-gold' : 'text-gray-500'}`}>{log.status === 'approved' ? '+' : ''}{log.points}</td>
                      <td className="py-3 px-4 text-[10px] font-bold uppercase text-gray-500">{log.status === 'approved' ? 'Aprobada' : log.status === 'rejected' ? 'Rechazada' : 'Pendiente'}</td>
                      <td className="py-3 px-6 text-right text-[10px] text-gray-500">{new Date(log.created_at).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </article>
          )}
        </section>

        <aside className="space-y-8">
          <article className="bg-pop-cardGreen p-8 rounded-xl border border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-pop-gold/10 blur-[60px] rounded-full" />
            <h3 className="text-lg font-black uppercase font-epilogue tracking-tighter text-white mb-8">Puntos Totales</h3>
            <p className="text-5xl font-black text-white tracking-tighter font-epilogue mb-2">{(data?.puntos_totales || 0).toLocaleString()}</p>
            <p className="text-[10px] text-pop-orange font-bold uppercase tracking-[0.2em]">Acumulado Histórico</p>
          </article>

          {/* Resumen QR */}
          <article className="bg-pop-cardGreen p-8 rounded-xl border border-white/5">
            <h3 className="text-sm font-black uppercase font-epilogue tracking-tighter text-white mb-6">Resumen QR</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-gray-500 font-bold uppercase">Generados</span>
                <span className="text-lg font-black text-white">{tickets.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-gray-500 font-bold uppercase">Canjeados</span>
                <span className="text-lg font-black text-green-500">{tickets.filter(t => t.canjeado_at).length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-gray-500 font-bold uppercase">Pendientes</span>
                <span className="text-lg font-black text-yellow-500">{tickets.filter(t => !t.canjeado_at).length}</span>
              </div>
              <div className="pt-4 border-t border-white/5 flex justify-between items-center">
                <span className="text-[10px] text-gray-500 font-bold uppercase">Pts otorgados</span>
                <span className="text-lg font-black text-pop-gold">{tickets.filter(t => t.canjeado_at).reduce((s, t) => s + t.puntos, 0)}</span>
              </div>
            </div>
          </article>
        </aside>
        </>
        )}
      </div>
    </main>
  );
}
