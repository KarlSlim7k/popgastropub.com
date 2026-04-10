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
    { initials: "LC", name: "Laura C.", orders: 98, rating: 4.6, points: 1450 },
    { initials: "JP", name: "Jorge P.", orders: 87, rating: 4.5, points: 1280 },
  ];

  const recentActivity: ActivityItem[] = [
    {
      type: "registro",
      title: "Nuevo Registro",
      description: "Juan P. se ha unido al programa",
      time: "Hace 2 min",
    },
    {
      type: "canje",
      title: "Canje de Premio",
      description: "Margarita (vía Sofía L.)",
      time: "Hace 15 min",
    },
    {
      type: "meta",
      title: "Meta Alcanzada",
      description: "Ricardo G. completó objetivo diario",
      time: "Hace 1 hora",
    },
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
    {
      id: "POP-088",
      name: "Old Fashioned Perote",
      category: "Cócteles",
      price: "$125.00",
      stockPercent: 100,
      stockLabel: "Stock Completo",
      stockColor: "bg-pop-gold",
      active: false,
      image: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=200&h=150&fit=crop",
      imageAlt: "Cóctel premium",
    },
  ];

  const getActivityColor = (type: ActivityItem["type"]) => {
    switch (type) {
      case "registro":
        return "bg-pop-gold";
      case "canje":
        return "bg-pop-orange";
      case "meta":
        return "bg-pop-light-gold";
    }
  };

  const getActivityLabelColor = (type: ActivityItem["type"]) => {
    switch (type) {
      case "registro":
        return "text-pop-gold";
      case "canje":
        return "text-pop-orange";
      case "meta":
        return "text-pop-light-gold";
    }
  };

  return (
    <main className="ml-64 pt-20 p-6 lg:p-8 min-h-screen bg-pop-black">
      {/* Header Section */}
      <header className="mb-8 lg:mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-white">
            Panel de Control
          </h1>
          <p className="text-gray-400 mt-2 text-sm lg:text-base">
            Monitoreo en tiempo real del rendimiento de POP Perote
          </p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2.5 text-sm font-semibold text-pop-gold border border-pop-gold/30 rounded-lg hover:bg-pop-gold/10 transition-all duration-200 flex items-center gap-2">
            <span className="material-symbols-outlined text-lg">download</span>
            Exportar
          </button>
          <button className="px-5 py-2.5 text-sm font-semibold text-pop-black bg-pop-gold rounded-lg hover:bg-pop-light-gold transition-all duration-200 flex items-center gap-2">
            <span className="material-symbols-outlined text-lg">visibility</span>
            Vista en Vivo
          </button>
        </div>
      </header>

      {/* KPI Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8" aria-label="Métricas principales">
        {kpiData.map((kpi, index) => (
          <article
            key={index}
            className="bg-gray-900/70 backdrop-blur-sm rounded-xl p-5 lg:p-6 border-l-4 border-pop-gold hover:border-pop-light-gold transition-all duration-300 hover:shadow-lg hover:shadow-pop-gold/5"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-2.5 rounded-lg bg-${kpi.color}/10`}>
                <span className={`material-symbols-outlined text-${kpi.color} text-2xl`}>
                  {kpi.icon}
                </span>
              </div>
              <span className="text-xs font-semibold text-pop-gold bg-pop-gold/10 px-2.5 py-1 rounded-full">
                {kpi.trend}
              </span>
            </div>
            <h3 className="text-xs uppercase tracking-wider text-gray-400 font-medium mb-2">
              {kpi.label}
            </h3>
            <p className="text-3xl font-bold text-white tracking-tight">{kpi.value}</p>
          </article>
        ))}
      </section>

      {/* Charts Section */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 mb-8">
        {/* Bar Chart: Pedidos por Día */}
        <article className="lg:col-span-2 bg-gray-900/70 backdrop-blur-sm rounded-xl p-6 lg:p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-white">Pedidos por Día</h2>
            <div className="flex gap-2 bg-gray-800/50 p-1 rounded-lg">
              <button
                onClick={() => setChartPeriod("7D")}
                className={`px-3 py-1.5 text-xs font-semibold uppercase rounded-md transition-all ${
                  chartPeriod === "7D"
                    ? "bg-pop-gold text-pop-black"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                7D
              </button>
              <button
                onClick={() => setChartPeriod("30D")}
                className={`px-3 py-1.5 text-xs font-semibold uppercase rounded-md transition-all ${
                  chartPeriod === "30D"
                    ? "bg-pop-gold text-pop-black"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                30D
              </button>
            </div>
          </div>
          <div className="h-64 flex items-end justify-between gap-3">
            {barData.map((item, index) => (
              <div key={index} className="flex flex-col items-center gap-2 flex-1 group">
                <div className="w-full relative h-[85%] bg-gray-800/50 rounded-t-md overflow-hidden">
                  <div
                    className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-pop-gold to-pop-light-gold rounded-t-md transition-all duration-500 group-hover:opacity-90"
                    style={{ height: `${item.value}%` }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-xs font-bold text-pop-black bg-white/80 px-2 py-0.5 rounded">
                      {item.value}%
                    </span>
                  </div>
                </div>
                <span className="text-xs font-medium text-gray-500">{item.day}</span>
              </div>
            ))}
          </div>
        </article>

        {/* Donut Chart: Top Platillos */}
        <article className="bg-gray-900/70 backdrop-blur-sm rounded-xl p-6 lg:p-8">
          <h2 className="text-xl font-semibold text-white mb-6">Top Platillos</h2>
          <div className="relative w-44 h-44 mx-auto mb-6">
            <svg className="transform -rotate-90 w-full h-full" viewBox="0 0 100 100">
              {donutData.reduce(
                (acc, item, index) => {
                  const circumference = 2 * Math.PI * 40;
                  const strokeDasharray = `${(item.percent / 100) * circumference} ${circumference}`;
                  const strokeDashoffset = -acc.offset;
                  acc.offset += (item.percent / 100) * circumference;

                  acc.elements.push(
                    <circle
                      key={index}
                      cx="50"
                      cy="50"
                      fill="transparent"
                      r="40"
                      stroke={item.color}
                      strokeDasharray={strokeDasharray}
                      strokeDashoffset={strokeDashoffset}
                      strokeWidth="10"
                      className="transition-all duration-300 hover:opacity-80"
                    />
                  );
                  return acc;
                },
                { offset: 0, elements: [] as React.ReactElement[] }
              ).elements}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-white">840</span>
              <span className="text-xs text-gray-400">Total</span>
            </div>
          </div>
          <ul className="space-y-3">
            {donutData.map((item, index) => (
              <li key={index} className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2.5">
                  <span
                    className="w-3 h-3 rounded-sm"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-gray-300 font-medium">{item.name}</span>
                </div>
                <span className="text-gray-400 font-semibold">{item.percent}%</span>
              </li>
            ))}
          </ul>
        </article>
      </section>

      {/* Secondary Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 mb-8">
        {/* Top 5 Meseros del Mes */}
        <article className="lg:col-span-2 bg-gray-900/70 backdrop-blur-sm rounded-xl p-6 lg:p-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-semibold text-white">Top Meseros del Mes</h2>
              <p className="text-sm text-gray-400 mt-1">Ranking por ventas y calificación</p>
            </div>
            <span className="material-symbols-outlined text-pop-gold text-3xl">
              workspace_premium
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full" role="table">
              <thead>
                <tr className="border-b border-gray-800 text-xs uppercase tracking-wider text-gray-500">
                  <th className="pb-4 text-left font-medium">Mesero</th>
                  <th className="pb-4 text-left font-medium">Pedidos</th>
                  <th className="pb-4 text-left font-medium">Calificación</th>
                  <th className="pb-4 text-right font-medium">Puntos</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/50">
                {topWaiters.map((waiter, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-800/30 transition-colors duration-200"
                  >
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-xs font-bold text-pop-gold">
                          {waiter.initials}
                        </div>
                        <span className="font-semibold text-white">{waiter.name}</span>
                      </div>
                    </td>
                    <td className="py-4 text-gray-300 font-mono">{waiter.orders}</td>
                    <td className="py-4">
                      <div className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-pop-gold text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                          star
                        </span>
                        <span className="text-gray-300 font-semibold">{waiter.rating}</span>
                      </div>
                    </td>
                    <td className="py-4 text-right font-mono font-bold text-pop-gold">
                      {waiter.points.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        {/* Recent Activity Timeline */}
        <article className="bg-gray-900/70 backdrop-blur-sm rounded-xl p-6 lg:p-8">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-white">Actividad Reciente</h2>
            <p className="text-sm text-gray-400 mt-1">Últimas acciones del equipo</p>
          </div>
          <div className="space-y-6 relative">
            <div className="absolute left-3.5 top-2 bottom-2 w-px bg-gray-800" />
            {recentActivity.map((activity, index) => (
              <div key={index} className="relative pl-10">
                <div
                  className={`absolute left-1.5 top-1.5 w-4 h-4 rounded-full ring-4 ring-gray-900 ${getActivityColor(activity.type)}`}
                />
                <p className={`text-xs font-semibold uppercase tracking-wide ${getActivityLabelColor(activity.type)}`}>
                  {activity.title}
                </p>
                <p className="text-sm font-medium text-gray-300 mt-1">
                  {activity.description}
                </p>
                <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
              </div>
            ))}
          </div>
        </article>
      </section>

      {/* Menu Management */}
      <section className="bg-gray-900/70 backdrop-blur-sm rounded-xl p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h2 className="text-xl font-semibold text-white">Gestión de Menú</h2>
            <p className="text-sm text-gray-400 mt-1">Control de platillos y disponibilidad</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-pop-gold text-pop-black font-semibold text-sm rounded-lg hover:bg-pop-light-gold transition-all duration-200">
            <span className="material-symbols-outlined text-lg">add</span>
            Agregar Platillo
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full" role="table">
            <thead>
              <tr className="border-b border-gray-800 text-xs uppercase tracking-wider text-gray-500">
                <th className="pb-4 text-left font-medium">Platillo</th>
                <th className="pb-4 text-left font-medium">Categoría</th>
                <th className="pb-4 text-left font-medium">Precio</th>
                <th className="pb-4 text-left font-medium">Stock</th>
                <th className="pb-4 text-right font-medium">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {menuItems.map((item, index) => (
                <tr key={index} className="hover:bg-gray-800/30 transition-colors duration-200">
                  <td className="py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-gray-800">
                        <img
                          className="w-full h-full object-cover"
                          src={item.image}
                          alt={item.imageAlt}
                          loading="lazy"
                        />
                      </div>
                      <div>
                        <p className="font-semibold text-white">{item.name}</p>
                        <p className="text-xs text-gray-500 uppercase mt-0.5">ID: {item.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-5">
                    <span className="bg-gray-800 px-2.5 py-1 text-xs font-medium text-gray-300 rounded-md">
                      {item.category}
                    </span>
                  </td>
                  <td className="py-5 font-mono font-semibold text-white">{item.price}</td>
                  <td className="py-5">
                    <div className="w-24 bg-gray-800 h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${item.stockColor}`}
                        style={{ width: `${item.stockPercent}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-400 mt-1.5">{item.stockLabel}</p>
                  </td>
                  <td className="py-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                          item.active ? "bg-pop-gold" : "bg-gray-700"
                        }`}
                        aria-label={item.active ? "Desactivar" : "Activar"}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ${
                            item.active ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>
                      <span className={`text-xs font-semibold ${item.active ? "text-pop-gold" : "text-gray-500"}`}>
                        {item.active ? "Activo" : "Inactivo"}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
