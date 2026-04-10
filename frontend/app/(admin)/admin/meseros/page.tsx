"use client";

import { useState } from "react";

// Types
interface Waiter {
  rank: number;
  initials: string;
  name: string;
  status: "activo" | "inactivo" | "descanso";
  cocktailPoints: number;
  premiumPoints: number;
  pitcherPoints: number;
  bottlePoints: number;
  comboPoints: number;
  upsellPoints: number;
  ratingPoints: number;
  totalPoints: number;
  totalSales: number;
  ordersServed: number;
  avgRating: number;
  customerMentions: number;
  drinkOfMonth: number;
  joinDate: string;
  shift: string;
}

interface PointsConfig {
  action: string;
  points: number;
  icon: string;
  description: string;
}

export default function AdminMeserosPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<"semana" | "mes" | "todo">("mes");
  const [showConfigModal, setShowConfigModal] = useState(false);

  const pointsConfig: PointsConfig[] = [
    { action: "Cóctel/Margarita", points: 10, icon: "local_bar", description: "Venta individual" },
    { action: "Bebida Premium", points: 15, icon: "wine_bar", description: "Bebidas de carta premium" },
    { action: "Jarra/Compartida", points: 25, icon: "sports_bar", description: "Jarras para compartir" },
    { action: "Botella Completa", points: 50, icon: "liquor", description: "Botella de tequila/vino" },
    { action: "Combo Comida+Bebida", points: 20, icon: "restaurant", description: "Upsell de combo" },
    { action: "Upgrade de Bebida", points: 15, icon: "upgrade", description: "Mejora de bebida" },
    { action: "Mención del Cliente", points: 30, icon: "star", description: "Cliente menciona al mesero" },
    { action: "Bebida del Mes", points: 0, icon: "emoji_events", description: "Multiplicador x2 automático" },
  ];

  const waiters: Waiter[] = [
    {
      rank: 1,
      initials: "RG",
      name: "Ricardo García",
      status: "activo",
      cocktailPoints: 850,
      premiumPoints: 450,
      pitcherPoints: 300,
      bottlePoints: 200,
      comboPoints: 350,
      upsellPoints: 150,
      ratingPoints: 150,
      totalPoints: 2450,
      totalSales: 128,
      ordersServed: 142,
      avgRating: 4.9,
      customerMentions: 5,
      drinkOfMonth: 32,
      joinDate: "2023-09-01",
      shift: "Vespertino",
    },
    {
      rank: 2,
      initials: "SL",
      name: "Sofía Luna",
      status: "activo",
      cocktailPoints: 720,
      premiumPoints: 380,
      pitcherPoints: 250,
      bottlePoints: 150,
      comboPoints: 280,
      upsellPoints: 90,
      ratingPoints: 150,
      totalPoints: 1920,
      totalSales: 98,
      ordersServed: 128,
      avgRating: 4.8,
      customerMentions: 4,
      drinkOfMonth: 28,
      joinDate: "2023-10-10",
      shift: "Vespertino",
    },
    {
      rank: 3,
      initials: "MA",
      name: "Marco Antonio Ruiz",
      status: "descanso",
      cocktailPoints: 600,
      premiumPoints: 300,
      pitcherPoints: 200,
      bottlePoints: 100,
      comboPoints: 250,
      upsellPoints: 130,
      ratingPoints: 150,
      totalPoints: 1680,
      totalSales: 86,
      ordersServed: 115,
      avgRating: 4.7,
      customerMentions: 3,
      drinkOfMonth: 22,
      joinDate: "2023-11-05",
      shift: "Matutino",
    },
    {
      rank: 4,
      initials: "LC",
      name: "Laura Castillo",
      status: "activo",
      cocktailPoints: 520,
      premiumPoints: 280,
      pitcherPoints: 180,
      bottlePoints: 150,
      comboPoints: 180,
      upsellPoints: 90,
      ratingPoints: 150,
      totalPoints: 1450,
      totalSales: 72,
      ordersServed: 98,
      avgRating: 4.6,
      customerMentions: 3,
      drinkOfMonth: 18,
      joinDate: "2023-10-15",
      shift: "Vespertino",
    },
    {
      rank: 5,
      initials: "JP",
      name: "Jorge Pérez",
      status: "activo",
      cocktailPoints: 450,
      premiumPoints: 200,
      pitcherPoints: 150,
      bottlePoints: 50,
      comboPoints: 200,
      upsellPoints: 130,
      ratingPoints: 100,
      totalPoints: 1280,
      totalSales: 58,
      ordersServed: 87,
      avgRating: 4.5,
      customerMentions: 2,
      drinkOfMonth: 15,
      joinDate: "2024-01-08",
      shift: "Matutino",
    },
    {
      rank: 6,
      initials: "DV",
      name: "Daniela Vargas",
      status: "inactivo",
      cocktailPoints: 280,
      premiumPoints: 150,
      pitcherPoints: 100,
      bottlePoints: 50,
      comboPoints: 120,
      upsellPoints: 60,
      ratingPoints: 60,
      totalPoints: 820,
      totalSales: 35,
      ordersServed: 52,
      avgRating: 4.3,
      customerMentions: 1,
      drinkOfMonth: 8,
      joinDate: "2024-02-20",
      shift: "Vespertino",
    },
  ];

  const getRankIcon = (rank: number) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return `#${rank}`;
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) return "bg-pop-gold text-pop-black";
    if (rank === 2) return "bg-gray-300 text-pop-black";
    if (rank === 3) return "bg-pop-orange text-pop-black";
    return "bg-gray-700 text-gray-300";
  };

  const getStatusBadge = (status: Waiter["status"]) => {
    const styles = {
      activo: "bg-pop-gold/10 text-pop-gold",
      inactivo: "bg-gray-600/10 text-gray-400",
      descanso: "bg-blue-500/10 text-blue-400",
    };
    const labels = {
      activo: "Activo",
      inactivo: "Inactivo",
      descanso: "Descanso",
    };
    return (
      <span className={`text-[10px] font-bold px-2.5 py-1 rounded uppercase tracking-wider ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  // Top performer stats
  const topWaiter = waiters[0];
  const totalTeamPoints = waiters.reduce((sum, w) => sum + w.totalPoints, 0);
  const totalTeamSales = waiters.reduce((sum, w) => sum + w.totalSales, 0);
  const avgTeamRating = (waiters.reduce((sum, w) => sum + w.avgRating, 0) / waiters.length).toFixed(1);

  return (
    <main className="pt-24 lg:pt-20 p-4 lg:p-10 min-h-screen bg-pop-black">
      {/* Header */}
      <header className="mb-8 lg:mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-4xl lg:text-5xl font-black tracking-tighter text-white font-epilogue uppercase flex items-center gap-3">
            <span className="material-symbols-outlined text-pop-gold text-5xl">workspace_premium</span>
            POP Bar Stars
          </h1>
          <p className="text-gray-400 mt-2 text-base lg:text-lg font-manrope">
            Ranking de meseros por ventas de bebidas
          </p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2.5 text-sm font-semibold text-pop-gold border border-pop-gold/30 rounded-lg hover:bg-pop-gold/10 transition-all duration-200 flex items-center gap-2">
            <span className="material-symbols-outlined text-lg">download</span>
            Exportar
          </button>
          <button
            onClick={() => setShowConfigModal(true)}
            className="px-4 py-2.5 text-sm font-semibold text-pop-gold border border-pop-gold/30 rounded-lg hover:bg-pop-gold/10 transition-all duration-200 flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-lg">settings</span>
            Configurar Puntos
          </button>
        </div>
      </header>

      {/* Period Selector */}
      <section className="flex items-center gap-3 mb-8">
        <span className="text-xs font-bold text-gray-500 uppercase">Período:</span>
        <div className="flex gap-2 bg-[#1C1B1B] p-1.5 rounded-lg border border-white/5">
          {(["semana", "mes", "todo"] as const).map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`px-5 py-2 text-xs font-bold uppercase tracking-wider rounded-md transition-all ${
                selectedPeriod === period
                  ? "bg-pop-gold text-pop-black"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {period === "semana" ? "Esta Semana" : period === "mes" ? "Este Mes" : "Todo"}
            </button>
          ))}
        </div>
      </section>

      {/* Team Stats */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-10" aria-label="Estadísticas del equipo">
        <article className="bg-[#1C1B1B] backdrop-blur-sm rounded-xl p-6 border-l-4 border-pop-gold hover:border-pop-orange transition-all duration-500 group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 rounded-lg bg-white/5 group-hover:bg-pop-gold/10 transition-colors">
              <span className="material-symbols-outlined text-pop-gold text-3xl transition-transform group-hover:scale-110">
                workspace_premium
              </span>
            </div>
          </div>
          <h3 className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold mb-2">Top Performer</h3>
          <p className="text-2xl font-black text-white tracking-tighter font-epilogue">{topWaiter.name}</p>
          <p className="text-sm text-pop-gold font-bold mt-1">{topWaiter.totalPoints.toLocaleString()} pts</p>
        </article>

        <article className="bg-[#1C1B1B] backdrop-blur-sm rounded-xl p-6 border-l-4 border-pop-orange hover:border-pop-gold transition-all duration-500 group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 rounded-lg bg-white/5 group-hover:bg-pop-orange/10 transition-colors">
              <span className="material-symbols-outlined text-pop-orange text-3xl transition-transform group-hover:scale-110">
                points
              </span>
            </div>
          </div>
          <h3 className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold mb-2">Puntos del Equipo</h3>
          <p className="text-3xl font-black text-white tracking-tighter font-epilogue">{totalTeamPoints.toLocaleString()}</p>
        </article>

        <article className="bg-[#1C1B1B] backdrop-blur-sm rounded-xl p-6 border-l-4 border-pop-light-gold hover:border-pop-gold transition-all duration-500 group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 rounded-lg bg-white/5 group-hover:bg-pop-light-gold/10 transition-colors">
              <span className="material-symbols-outlined text-pop-light-gold text-3xl transition-transform group-hover:scale-110">
                local_bar
              </span>
            </div>
          </div>
          <h3 className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold mb-2">Ventas de Bebidas</h3>
          <p className="text-3xl font-black text-white tracking-tighter font-epilogue">{totalTeamSales}</p>
        </article>

        <article className="bg-[#1C1B1B] backdrop-blur-sm rounded-xl p-6 border-l-4 border-pop-gold hover:border-pop-orange transition-all duration-500 group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 rounded-lg bg-white/5 group-hover:bg-pop-gold/10 transition-colors">
              <span className="material-symbols-outlined text-pop-gold text-3xl transition-transform group-hover:scale-110">
                star
              </span>
            </div>
          </div>
          <h3 className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold mb-2">Rating Promedio</h3>
          <p className="text-3xl font-black text-white tracking-tighter font-epilogue flex items-center gap-2">
            {avgTeamRating}
            <span className="material-symbols-outlined text-pop-gold text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
          </p>
        </article>
      </section>

      {/* Ranking Podium (Top 3) */}
      <section className="mb-10">
        <h2 className="text-xl font-black uppercase font-epilogue tracking-tighter text-white mb-6">
          Podio del Mes
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-end">
          {/* 2nd Place */}
          {waiters[1] && (
            <article className="bg-[#1C1B1B] backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 order-2 lg:order-1">
              <div className="text-center mb-4">
                <span className="text-4xl">{getRankIcon(2)}</span>
              </div>
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-300 to-gray-500 p-[2px]">
                  <div className="w-full h-full rounded-full bg-pop-black flex items-center justify-center text-gray-300 font-black text-xl">
                    {waiters[1].initials}
                  </div>
                </div>
              </div>
              <h3 className="text-lg font-black text-white text-center font-epilogue">{waiters[1].name}</h3>
              <p className="text-center text-3xl font-black text-gray-300 mt-2">{waiters[1].totalPoints.toLocaleString()}</p>
              <p className="text-center text-[10px] text-gray-500 uppercase tracking-widest mt-1">puntos</p>
              <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-800">
                <div className="text-center">
                  <p className="text-xs text-gray-400">Ventas</p>
                  <p className="text-lg font-bold text-white">{waiters[1].totalSales}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-400">Rating</p>
                  <p className="text-lg font-bold text-white flex items-center justify-center gap-1">
                    {waiters[1].avgRating}
                    <span className="material-symbols-outlined text-gray-300 text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  </p>
                </div>
              </div>
            </article>
          )}

          {/* 1st Place */}
          {waiters[0] && (
            <article className="bg-[#1C1B1B] backdrop-blur-sm rounded-xl p-6 border-2 border-pop-gold order-1 lg:order-2 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-pop-gold text-pop-black text-[10px] font-black uppercase px-3 py-1 rounded-full tracking-widest">
                Campeón
              </div>
              <div className="text-center mb-4 mt-2">
                <span className="text-5xl">{getRankIcon(1)}</span>
              </div>
              <div className="flex justify-center mb-4">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-pop-gold to-pop-orange p-[2px]">
                  <div className="w-full h-full rounded-full bg-pop-black flex items-center justify-center text-pop-gold font-black text-2xl">
                    {waiters[0].initials}
                  </div>
                </div>
              </div>
              <h3 className="text-xl font-black text-white text-center font-epilogue">{waiters[0].name}</h3>
              <p className="text-center text-4xl font-black text-pop-gold mt-2">{waiters[0].totalPoints.toLocaleString()}</p>
              <p className="text-center text-[10px] text-gray-500 uppercase tracking-widest mt-1">puntos</p>
              <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-800">
                <div className="text-center">
                  <p className="text-xs text-gray-400">Ventas</p>
                  <p className="text-xl font-bold text-pop-gold">{waiters[0].totalSales}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-400">Rating</p>
                  <p className="text-xl font-bold text-pop-gold flex items-center justify-center gap-1">
                    {waiters[0].avgRating}
                    <span className="material-symbols-outlined text-pop-gold text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  </p>
                </div>
              </div>
            </article>
          )}

          {/* 3rd Place */}
          {waiters[2] && (
            <article className="bg-[#1C1B1B] backdrop-blur-sm rounded-xl p-6 border border-pop-orange/30 order-3">
              <div className="text-center mb-4">
                <span className="text-4xl">{getRankIcon(3)}</span>
              </div>
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pop-orange to-orange-700 p-[2px]">
                  <div className="w-full h-full rounded-full bg-pop-black flex items-center justify-center text-pop-orange font-black text-xl">
                    {waiters[2].initials}
                  </div>
                </div>
              </div>
              <h3 className="text-lg font-black text-white text-center font-epilogue">{waiters[2].name}</h3>
              <p className="text-center text-3xl font-black text-pop-orange mt-2">{waiters[2].totalPoints.toLocaleString()}</p>
              <p className="text-center text-[10px] text-gray-500 uppercase tracking-widest mt-1">puntos</p>
              <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-800">
                <div className="text-center">
                  <p className="text-xs text-gray-400">Ventas</p>
                  <p className="text-lg font-bold text-white">{waiters[2].totalSales}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-400">Rating</p>
                  <p className="text-lg font-bold text-white flex items-center justify-center gap-1">
                    {waiters[2].avgRating}
                    <span className="material-symbols-outlined text-pop-orange text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  </p>
                </div>
              </div>
            </article>
          )}
        </div>
      </section>

      {/* Full Ranking Table */}
      <section className="bg-[#1C1B1B] backdrop-blur-sm rounded-xl border border-white/5 overflow-hidden">
        <div className="p-6 border-b border-white/5">
          <h2 className="text-xl font-black uppercase font-epilogue tracking-tighter text-white">
            Ranking Completo
          </h2>
          <p className="text-xs text-pop-orange font-bold uppercase tracking-widest mt-1">
            Todos los meseros · {selectedPeriod === "semana" ? "Esta semana" : selectedPeriod === "mes" ? "Este mes" : "Histórico"}
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full" role="table">
            <thead>
              <tr className="border-b border-gray-800 text-xs uppercase tracking-wider text-gray-500">
                <th className="pb-4 px-6 text-left font-medium">#</th>
                <th className="pb-4 text-left font-medium">Mesero</th>
                <th className="pb-4 text-left font-medium">Estado</th>
                <th className="pb-4 text-left font-medium">Turno</th>
                <th className="pb-4 text-left font-medium">Cócteles</th>
                <th className="pb-4 text-left font-medium">Premium</th>
                <th className="pb-4 text-left font-medium">Jarras</th>
                <th className="pb-4 text-left font-medium">Botellas</th>
                <th className="pb-4 text-left font-medium">Combos</th>
                <th className="pb-4 text-left font-medium">Upsells</th>
                <th className="pb-4 text-left font-medium">Menciones</th>
                <th className="pb-4 text-left font-medium">Bebida Mes</th>
                <th className="pb-4 text-right font-medium">Total Puntos</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {waiters.map((waiter, index) => (
                <tr key={index} className="hover:bg-gray-800/30 transition-colors duration-200">
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-xs font-black ${getRankBadge(waiter.rank)}`}>
                      {getRankIcon(waiter.rank)}
                    </span>
                  </td>
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full bg-gradient-to-br p-[2px] ${
                        waiter.rank === 1
                          ? "from-pop-gold to-pop-orange"
                          : waiter.rank === 2
                          ? "from-gray-300 to-gray-500"
                          : waiter.rank === 3
                          ? "from-pop-orange to-orange-700"
                          : "from-gray-700 to-gray-800"
                      }`}>
                        <div className="w-full h-full rounded-full bg-pop-black flex items-center justify-center text-xs font-bold text-pop-gold">
                          {waiter.initials}
                        </div>
                      </div>
                      <div>
                        <p className="font-semibold text-white text-sm">{waiter.name}</p>
                        <p className="text-[10px] text-gray-500">{waiter.ordersServed} órdenes</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4">{getStatusBadge(waiter.status)}</td>
                  <td className="py-4 text-xs text-gray-400">{waiter.shift}</td>
                  <td className="py-4 font-mono text-sm text-gray-300">{waiter.cocktailPoints}</td>
                  <td className="py-4 font-mono text-sm text-gray-300">{waiter.premiumPoints}</td>
                  <td className="py-4 font-mono text-sm text-gray-300">{waiter.pitcherPoints}</td>
                  <td className="py-4 font-mono text-sm text-gray-300">{waiter.bottlePoints}</td>
                  <td className="py-4 font-mono text-sm text-gray-300">{waiter.comboPoints}</td>
                  <td className="py-4 font-mono text-sm text-gray-300">{waiter.upsellPoints}</td>
                  <td className="py-4 font-mono text-sm text-gray-300">{waiter.ratingPoints}</td>
                  <td className="py-4 font-mono text-sm text-pop-gold">{waiter.drinkOfMonth}</td>
                  <td className="py-4 text-right font-mono font-black text-pop-gold text-lg">
                    {waiter.totalPoints.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Points Configuration Reference */}
      <section className="bg-[#1C1B1B] backdrop-blur-sm rounded-xl p-6 lg:p-8 border border-white/5 mt-8">
        <h2 className="text-xl font-black uppercase font-epilogue tracking-tighter text-white mb-6">
          Configuración de Puntos POP Bar Stars
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {pointsConfig.map((config, index) => (
            <div
              key={index}
              className="bg-gray-800/30 rounded-lg p-4 border border-gray-700/30 hover:border-pop-gold/30 transition-all"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="material-symbols-outlined text-pop-gold text-2xl">{config.icon}</span>
                <div>
                  <p className="text-sm font-bold text-white">{config.action}</p>
                  {config.points > 0 ? (
                    <p className="text-xs text-pop-gold font-bold">+{config.points} pts</p>
                  ) : (
                    <p className="text-xs text-pop-orange font-bold">x2 pts</p>
                  )}
                </div>
              </div>
              <p className="text-[10px] text-gray-500">{config.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Config Points Modal */}
      {showConfigModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowConfigModal(false)}>
          <div className="bg-[#1C1B1B] border border-white/10 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-white/5 flex justify-between items-center">
              <h2 className="text-2xl font-black uppercase font-epilogue tracking-tighter text-white">
                Configurar Puntos
              </h2>
              <button onClick={() => setShowConfigModal(false)} className="text-gray-500 hover:text-white transition-colors">
                <span className="material-symbols-outlined text-2xl">close</span>
              </button>
            </div>
            <div className="p-6 space-y-4">
              {pointsConfig.map((config, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-800/30 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-pop-gold text-xl">{config.icon}</span>
                    <div>
                      <p className="text-sm font-bold text-white">{config.action}</p>
                      <p className="text-[10px] text-gray-500">{config.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {config.points > 0 ? (
                      <>
                        <span className="text-xs text-gray-500">pts</span>
                        <input
                          type="number"
                          defaultValue={config.points}
                          className="w-20 bg-gray-800 border border-white/10 rounded-lg px-3 py-2 text-sm text-white text-center focus:outline-none focus:border-pop-gold/50 transition-all"
                        />
                      </>
                    ) : (
                      <span className="text-xs text-pop-orange font-bold bg-pop-orange/10 px-3 py-1.5 rounded">
                        x2 (especial)
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="p-6 border-t border-white/5 flex justify-end gap-3">
              <button
                onClick={() => setShowConfigModal(false)}
                className="px-6 py-2.5 text-sm font-semibold text-gray-400 border border-gray-700 rounded-lg hover:bg-gray-800/50 transition-all"
              >
                Cancelar
              </button>
              <button className="px-6 py-2.5 text-sm font-semibold text-pop-black bg-pop-gold rounded-lg hover:bg-pop-light-gold transition-all">
                Guardar Configuración
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
