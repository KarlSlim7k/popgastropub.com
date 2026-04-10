"use client";

import { useState } from "react";

// Types
interface KPIData {
  label: string;
  value: string;
  trend: string;
  trendUp: boolean;
  icon: string;
  color: string;
}

interface WaiterData {
  initials: string;
  name: string;
  orders: number;
  rating: number;
  points: number;
}

interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: string;
  stockPercent: number;
  stockLabel: string;
  stockColor: string;
  active: boolean;
  image: string;
  imageAlt: string;
}

interface ActivityItem {
  type: "registro" | "canje" | "meta";
  title: string;
  description: string;
  time: string;
}

export default function AdminDashboardPage() {
  const [chartPeriod, setChartPeriod] = useState<"7D" | "30D">("30D");

  const kpiData: KPIData[] = [
    {
      label: "Usuarios Totales",
      value: "1,540",
      trend: "+12%",
      trendUp: true,
      icon: "group",
      color: "pop-gold",
    },
    {
      label: "Pedidos del Mes",
      value: "840",
      trend: "+5%",
      trendUp: true,
      icon: "receipt_long",
      color: "pop-orange",
    },
    {
      label: "Puntos Emitidos",
      value: "125,000",
      trend: "Crecimiento",
      trendUp: true,
      icon: "token",
      color: "pop-light-gold",
    },
    {
      label: "Ventas Bebidas",
      value: "$45,600",
      trend: "En vivo",
      trendUp: true,
      icon: "payments",
      color: "pop-gold",
    },
  ];

  const barData = [
    { day: "LUN", value: 40 },
    { day: "MAR", value: 60 },
    { day: "MIÉ", value: 55 },
    { day: "JUE", value: 85 },
    { day: "VIE", value: 70 },
    { day: "SÁB", value: 95 },
    { day: "DOM", value: 80 },
  ];

  const donutData = [
    { name: "Perote Burger Supreme", percent: 45, color: "#F2C777" },
    { name: "Tacos de Ribeye", percent: 25, color: "#D96725" },
    { name: "Pasta Obsidian", percent: 15, color: "#F2C894" },
    { name: "Otros", percent: 15, color: "#732817" },
  ];

  const topWaiters: WaiterData[] = [
    { initials: "RG", name: "Ricardo G.", orders: 142, rating: 4.9, points: 2450 },
    { initials: "SL", name: "Sofía L.", orders: 128, rating: 4.8, points: 1920 },
    { initials: "MA", name: "Marco A.", orders: 115, rating: 4.7, points: 1680 },
  ];

  const recentActivity: ActivityItem[] = [
    { type: "registro", title: "Nuevo Registro", description: "Juan P. se ha unido al programa", time: "Hace 2 min" },
    { type: "canje", title: "Canje de Premio", description: "Margarita (vía Sofía L.)", time: "Hace 15 min" },
  ];

  const menuItems: MenuItem[] = [
    {
      id: "POP-001",
      name: "Perote Burger Supreme",
      category: "Plato Principal",
      price: "$185.00",
      stockPercent: 85,
      stockLabel: "Alta Demanda",
      stockColor: "bg-pop-gold",
      active: true,
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&h=150&fit=crop",
      imageAlt: "Hamburguesa gourmet",
    },
    {
      id: "POP-004",
      name: "Zen Garden Bowl",
      category: "Ensaladas",
      price: "$140.00",
      stockPercent: 30,
      stockLabel: "Reabastecer",
      stockColor: "bg-pop-orange",
      active: true,
      image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=200&h=150&fit=crop",
      imageAlt: "Ensalada fresca",
    },
  ];

  return (
    <main className="pt-24 lg:pt-20 p-4 lg:p-10 min-h-screen bg-pop-black">
      {/* Responsive Header */}
      <header className="mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
        <div>
          <h1 className="text-4xl lg:text-7xl font-black tracking-tighter text-white font-epilogue uppercase leading-none">
            Dashboard
          </h1>
          <p className="text-pop-orange mt-2 text-xs font-bold uppercase tracking-[0.3em]">
            Supervisión Directiva · POP Perote Digital
          </p>
        </div>
        <div className="flex w-full sm:w-auto gap-2">
           <button className="flex-1 sm:flex-none px-6 py-3 bg-pop-gold text-pop-black text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-pop-lightGold transition-all">
             Vista en Vivo
           </button>
        </div>
      </header>

      {/* KPI Grid - Responsive columns */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-10">
        {kpiData.map((kpi, idx) => (
          <article key={idx} className="bg-[#1C1B1B] p-6 rounded-2xl border border-white/5 hover:border-pop-gold/30 transition-all group">
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center group-hover:bg-pop-gold/10 transition-all">
                <span className="material-symbols-outlined text-pop-gold text-2xl">{kpi.icon}</span>
              </div>
              <span className="text-[10px] font-black text-pop-gold bg-pop-gold/10 px-3 py-1 rounded-full uppercase tracking-widest leading-none">
                {kpi.trend}
              </span>
            </div>
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">{kpi.label}</p>
            <p className="text-4xl font-black text-white tracking-tighter font-epilogue leading-none">{kpi.value}</p>
          </article>
        ))}
      </section>

      {/* Charts - Stacked on mobile */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        <article className="lg:col-span-2 bg-[#1C1B1B] p-6 lg:p-8 rounded-2xl border border-white/5 overflow-hidden">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-xl font-black uppercase tracking-tighter text-white font-epilogue">Facturación Diaria</h2>
            <div className="flex bg-pop-black/50 p-1 rounded-lg">
              {["7D", "30D"].map(p => (
                <button 
                  key={p} 
                  onClick={() => setChartPeriod(p as any)}
                  className={`px-3 py-1.5 text-[10px] font-black rounded-md uppercase transition-all ${chartPeriod === p ? 'bg-pop-gold text-pop-black' : 'text-gray-500'}`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
          <div className="h-64 flex items-end justify-between gap-2 overflow-x-auto no-scrollbar pb-2">
            {barData.map((d, i) => (
              <div key={i} className="flex flex-col items-center flex-1 min-w-[30px] group">
                <div className="w-full relative h-48 bg-white/5 rounded-t-lg overflow-hidden">
                  <div className="absolute bottom-0 left-0 right-0 bg-pop-gold group-hover:bg-pop-lightGold transition-all rounded-t-lg shadow-[0_0_15px_rgba(242,199,119,0.2)]" style={{ height: `${d.value}%` }} />
                </div>
                <span className="text-[9px] font-black text-gray-500 mt-3 uppercase tracking-tighter">{d.day}</span>
              </div>
            ))}
          </div>
        </article>

        <article className="bg-[#1C1B1B] p-6 lg:p-8 rounded-2xl border border-white/5">
           <h2 className="text-xl font-black uppercase tracking-tighter text-white font-epilogue mb-10">Mix de Ventas</h2>
           <div className="space-y-6">
              {donutData.map((d, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                    <span className="text-gray-400">{d.name}</span>
                    <span className="text-white">{d.percent}%</span>
                  </div>
                  <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-pop-gold" style={{ width: `${d.percent}%`, backgroundColor: d.color }} />
                  </div>
                </div>
              ))}
           </div>
        </article>
      </section>

      {/* Desktop Tables (Hidden on Mobile) */}
      <section className="hidden lg:grid grid-cols-2 gap-8 mb-10">
        <article className="bg-[#1C1B1B] rounded-2xl border border-white/5 overflow-hidden">
           <header className="p-6 border-b border-white/5 flex justify-between items-center">
             <h3 className="text-sm font-black text-white uppercase tracking-widest font-epilogue">Top Meseros</h3>
             <span className="material-symbols-outlined text-pop-gold">stars</span>
           </header>
           <table className="w-full text-left">
              <thead className="bg-white/[0.01] text-[10px] font-black uppercase text-gray-500 tracking-widest">
                <tr>
                   <th className="py-4 px-6">Mesero</th>
                   <th className="py-4 px-4">Órdenes</th>
                   <th className="py-4 px-6 text-right">Puntos</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {topWaiters.map((w, idx) => (
                  <tr key={idx} className="hover:bg-white/[0.01] transition-colors">
                    <td className="py-5 px-6">
                       <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-pop-gold text-pop-black flex items-center justify-center font-black text-[10px]">
                            {w.initials}
                          </div>
                          <span className="text-sm font-bold text-white">{w.name}</span>
                       </div>
                    </td>
                    <td className="py-5 px-4 font-mono text-xs text-gray-400">{w.orders}</td>
                    <td className="py-5 px-6 text-right font-black text-pop-gold text-xs">{w.points.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
           </table>
        </article>

        <article className="bg-[#1C1B1B] rounded-2xl border border-white/5 overflow-hidden">
           <header className="p-6 border-b border-white/5 flex justify-between items-center">
             <h3 className="text-sm font-black text-white uppercase tracking-widest font-epilogue">Menú en Vivo</h3>
             <span className="material-symbols-outlined text-pop-orange">inventory_2</span>
           </header>
           <table className="w-full text-left">
              <thead className="bg-white/[0.01] text-[10px] font-black uppercase text-gray-500 tracking-widest">
                <tr>
                   <th className="py-4 px-6">Platillo</th>
                   <th className="py-4 px-4 text-right">Stock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {menuItems.map((m, idx) => (
                  <tr key={idx} className="hover:bg-white/[0.01] transition-colors">
                    <td className="py-3 px-6">
                       <div className="flex items-center gap-3">
                          <img src={m.image} alt={m.name} className="w-10 h-8 rounded object-cover border border-white/10" />
                          <span className="text-xs font-bold text-white">{m.name}</span>
                       </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                       <div className="inline-flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${m.stockPercent < 50 ? 'bg-pop-orange' : 'bg-pop-gold'}`} />
                          <span className="text-[10px] font-black text-white">{m.stockPercent}%</span>
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
           </table>
        </article>
      </section>

      {/* Mobile Card Views (Shown only on Mobile) */}
      <section className="lg:hidden space-y-6">
        <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-4">Métricas Operativas</h3>
        {/* Waiters Mobile List */}
        <div className="space-y-3">
           {topWaiters.map((w, idx) => (
             <article key={idx} className="bg-[#1C1B1B] p-4 rounded-xl border border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 rounded-full bg-pop-gold text-pop-black flex items-center justify-center font-black text-xs">
                     {w.initials}
                   </div>
                   <div>
                     <p className="text-sm font-black text-white leading-tight">{w.name}</p>
                     <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">{w.orders} órdenes servidas</p>
                   </div>
                </div>
                <div className="text-right">
                   <p className="text-xs font-black text-pop-gold">{w.points.toLocaleString()}</p>
                   <p className="text-[8px] text-gray-500 uppercase font-black">PTS</p>
                </div>
             </article>
           ))}
        </div>
        
        {/* Menu Mobile List */}
        <div className="space-y-3">
           {menuItems.map((m, idx) => (
             <article key={idx} className="bg-[#1C1B1B] p-4 rounded-xl border border-white/5 flex items-center gap-4">
                <img src={m.image} alt={m.name} className="w-16 h-12 rounded-lg object-cover border border-white/10" />
                <div className="flex-1">
                   <p className="text-xs font-black text-white uppercase">{m.name}</p>
                   <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                         <div className={`h-full ${m.stockPercent < 50 ? 'bg-pop-orange' : 'bg-pop-gold'}`} style={{ width: `${m.stockPercent}%` }} />
                      </div>
                      <span className="text-[10px] font-black text-white">{m.stockPercent}%</span>
                   </div>
                </div>
             </article>
           ))}
        </div>
      </section>
    </main>
  );
}
