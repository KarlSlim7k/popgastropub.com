"use client";

import { useState, useEffect } from "react";
import { fetchWithAuth } from "@/lib/api";
import { getAuthSession } from "@/lib/auth-session";

interface KPIData { label: string; value: string; trend: string; icon: string; }
interface DashboardData { totalUsers: number; totalMeseros: number; totalFacturas: number; facturasHoy: number; totalPuntos: number; usuariosNuevosMes: number; }
interface ChartItem { day: string; value: number; }
interface SalesMixItem { name: string; percent: number; color: string; }
interface WaiterItem { initials: string; name: string; orders: number; rating: number; points: number; }
interface MenuItem { id: string; name: string; stockPercent: number; image: string; }

export default function AdminDashboardPage() {
  const [chartPeriod, setChartPeriod] = useState<"7D" | "30D">("7D");
  const [kpiData, setKpiData] = useState<KPIData[]>([]);
  const [barData, setBarData] = useState<ChartItem[]>([]);
  const [donutData, setDonutData] = useState<SalesMixItem[]>([]);
  const [topWaiters, setTopWaiters] = useState<WaiterItem[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session = getAuthSession();
    if (!session) { setLoading(false); return; }

    Promise.all([
      fetchWithAuth<DashboardData>("/admin/dashboard", session.token),
      fetchWithAuth<ChartItem[]>(`/admin/dashboard/chart-data?period=${chartPeriod}`, session.token),
      fetchWithAuth<SalesMixItem[]>("/admin/dashboard/sales-mix", session.token),
      fetchWithAuth<WaiterItem[]>("/admin/dashboard/top-waiters", session.token),
      fetchWithAuth<MenuItem[]>("/admin/dashboard/live-menu", session.token),
    ]).then(([data, chart, mix, waiters, menu]) => {
      setKpiData([
        { label: "Usuarios Totales", value: data.totalUsers?.toLocaleString() || "0", trend: "Total", icon: "group" },
        { label: "Meseros Activos", value: data.totalMeseros?.toLocaleString() || "0", trend: "Staff", icon: "restaurant" },
        { label: "Facturas Total", value: data.totalFacturas?.toLocaleString() || "0", trend: "Histórico", icon: "receipt_long" },
        { label: "Facturas Hoy", value: data.facturasHoy?.toLocaleString() || "0", trend: "Hoy", icon: "today" },
        { label: "Puntos Emitidos", value: data.totalPuntos?.toLocaleString() || "0", trend: "Acumulado", icon: "token" },
        { label: "Nuevos (Mes)", value: data.usuariosNuevosMes?.toLocaleString() || "0", trend: "Este mes", icon: "person_add" },
      ]);
      setBarData(chart);
      setDonutData(mix);
      setTopWaiters(waiters);
      setMenuItems(menu);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [chartPeriod]);

  const maxBar = Math.max(...barData.map(d => d.value), 1);

  return (
    <main className="pt-24 lg:pt-20 p-4 lg:p-10 min-h-screen bg-pop-black">
      <header className="mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
        <div>
          <h1 className="text-4xl lg:text-7xl font-black tracking-tighter text-white font-epilogue uppercase leading-none">Dashboard</h1>
          <p className="text-pop-orange mt-2 text-xs font-bold uppercase tracking-[0.3em]">Supervisión Directiva · POP Perote Digital</p>
        </div>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mb-10">
        {kpiData.map((kpi, idx) => (
          <article key={idx} className="bg-pop-cardGreen p-6 rounded-2xl border border-white/5 hover:border-pop-gold/30 transition-all group">
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center group-hover:bg-pop-gold/10 transition-all">
                <span className="material-symbols-outlined text-pop-gold text-2xl">{kpi.icon}</span>
              </div>
              <span className="text-[10px] font-black text-pop-gold bg-pop-gold/10 px-3 py-1 rounded-full uppercase tracking-widest">{kpi.trend}</span>
            </div>
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">{kpi.label}</p>
            <p className="text-4xl font-black text-white tracking-tighter font-epilogue leading-none">{loading ? "-" : kpi.value}</p>
          </article>
        ))}
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        <article className="lg:col-span-2 bg-pop-cardGreen p-6 lg:p-8 rounded-2xl border border-white/5">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-xl font-black uppercase tracking-tighter text-white font-epilogue">Facturación Diaria</h2>
            <div className="flex bg-pop-black/50 p-1 rounded-lg">
              {(["7D", "30D"] as const).map((p) => (
                <button key={p} onClick={() => setChartPeriod(p)} className={`px-3 py-1.5 text-[10px] font-black rounded-md uppercase transition-all ${chartPeriod === p ? "bg-pop-gold text-pop-black" : "text-gray-500"}`}>{p}</button>
              ))}
            </div>
          </div>
          <div className="h-64 flex items-end justify-between gap-1 overflow-x-auto no-scrollbar pb-2">
            {barData.map((d, i) => (
              <div key={i} className="flex flex-col items-center flex-1 min-w-[20px] group">
                <div className="w-full relative h-48 bg-white/5 rounded-t-lg overflow-hidden">
                  <div className="absolute bottom-0 left-0 right-0 bg-pop-gold group-hover:bg-pop-lightGold transition-all rounded-t-lg" style={{ height: `${maxBar > 0 ? (d.value / maxBar) * 100 : 0}%` }} />
                </div>
                <span className="text-[8px] font-black text-gray-500 mt-2 uppercase">{d.day}</span>
              </div>
            ))}
          </div>
        </article>

        <article className="bg-pop-cardGreen p-6 lg:p-8 rounded-2xl border border-white/5">
          <h2 className="text-xl font-black uppercase tracking-tighter text-white font-epilogue mb-10">Mix de Bebidas</h2>
          <div className="space-y-6">
            {donutData.map((d, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                  <span className="text-gray-400 truncate mr-2">{d.name}</span>
                  <span className="text-white">{d.percent}%</span>
                </div>
                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full" style={{ width: `${d.percent}%`, backgroundColor: d.color }} />
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        <article className="bg-pop-cardGreen rounded-2xl border border-white/5 overflow-hidden">
          <header className="p-6 border-b border-white/5 flex justify-between items-center">
            <h3 className="text-sm font-black text-white uppercase tracking-widest font-epilogue">Top Meseros</h3>
            <span className="material-symbols-outlined text-pop-gold">stars</span>
          </header>
          <table className="w-full text-left">
            <thead className="bg-white/[0.01] text-[10px] font-black uppercase text-gray-500 tracking-widest">
              <tr><th className="py-4 px-6">Mesero</th><th className="py-4 px-4">Órdenes</th><th className="py-4 px-6 text-right">Puntos</th></tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {topWaiters.map((w, idx) => (
                <tr key={idx} className="hover:bg-white/[0.01]">
                  <td className="py-5 px-6"><div className="flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-pop-gold text-pop-black flex items-center justify-center font-black text-[10px]">{w.initials}</div><span className="text-sm font-bold text-white">{w.name}</span></div></td>
                  <td className="py-5 px-4 font-mono text-xs text-gray-400">{w.orders}</td>
                  <td className="py-5 px-6 text-right font-black text-pop-gold text-xs">{w.points.toLocaleString()}</td>
                </tr>
              ))}
              {topWaiters.length === 0 && <tr><td colSpan={3} className="py-8 text-center text-gray-500 text-xs">Sin datos</td></tr>}
            </tbody>
          </table>
        </article>

        <article className="bg-pop-cardGreen rounded-2xl border border-white/5 overflow-hidden">
          <header className="p-6 border-b border-white/5 flex justify-between items-center">
            <h3 className="text-sm font-black text-white uppercase tracking-widest font-epilogue">Bebidas en Vivo</h3>
            <span className="material-symbols-outlined text-pop-orange">inventory_2</span>
          </header>
          <table className="w-full text-left">
            <thead className="bg-white/[0.01] text-[10px] font-black uppercase text-gray-500 tracking-widest">
              <tr><th className="py-4 px-6">Bebida</th><th className="py-4 px-4 text-right">Stock</th></tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {menuItems.map((m, idx) => (
                <tr key={idx} className="hover:bg-white/[0.01]">
                  <td className="py-3 px-6"><span className="text-xs font-bold text-white">{m.name}</span></td>
                  <td className="py-3 px-4 text-right"><div className="inline-flex items-center gap-2"><span className={`w-2 h-2 rounded-full ${m.stockPercent < 50 ? "bg-pop-orange" : "bg-pop-gold"}`} /><span className="text-[10px] font-black text-white">{m.stockPercent}%</span></div></td>
                </tr>
              ))}
              {menuItems.length === 0 && <tr><td colSpan={2} className="py-8 text-center text-gray-500 text-xs">Sin datos</td></tr>}
            </tbody>
          </table>
        </article>
      </section>
    </main>
  );
}
