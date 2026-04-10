"use client";

import { useState } from "react";

// Types
interface TierConfig {
  name: string;
  range: string;
  minPoints: number;
  maxPoints: number;
  color: string;
  bgColor: string;
  borderColor: string;
  icon: string;
  benefits: string[];
  members: number;
}

interface MemberActivity {
  id: string;
  name: string;
  initials: string;
  action: "registro" | "canje" | "visita" | "review" | "referido" | "cumpleaños";
  points: number;
  time: string;
  tier: string;
  tierColor: string;
}

interface TopMember {
  rank: number;
  name: string;
  initials: string;
  points: number;
  tier: string;
  tierColor: string;
  visits: number;
  orders: number;
  redeemed: number;
}

export default function AdminPuntosPage() {
  const [selectedTier, setSelectedTier] = useState<string>("todos");
  const [showRedeemModal, setShowRedeemModal] = useState(false);

  const tiers: TierConfig[] = [
    {
      name: "POP Fan",
      range: "0-499 pts",
      minPoints: 0,
      maxPoints: 499,
      color: "text-gray-300",
      bgColor: "bg-gray-700/30",
      borderColor: "border-gray-600",
      icon: "person",
      benefits: ["Promos básicas", "Puntos por compra"],
      members: 842,
    },
    {
      name: "POP Lover",
      range: "500-1,499 pts",
      minPoints: 500,
      maxPoints: 1499,
      color: "text-pop-light-gold",
      bgColor: "bg-pop-light-gold/10",
      borderColor: "border-pop-light-gold/30",
      icon: "favorite",
      benefits: ["+10% puntos", "Promo mensual", "Bebida gratis cumpleaños"],
      members: 328,
    },
    {
      name: "POP VIP",
      range: "1,500-2,999 pts",
      minPoints: 1500,
      maxPoints: 2999,
      color: "text-pop-orange",
      bgColor: "bg-pop-orange/10",
      borderColor: "border-pop-orange/30",
      icon: "workspace_premium",
      benefits: ["+25% puntos", "Roll gratis c/5 visitas", "Acceso anticipado"],
      members: 86,
    },
    {
      name: "POP Elite",
      range: "3,000+ pts",
      minPoints: 3000,
      maxPoints: Infinity,
      color: "text-pop-gold",
      bgColor: "bg-pop-gold/10",
      borderColor: "border-pop-gold/30",
      icon: "military_tech",
      benefits: ["+50% puntos", "Reservación优先", "1 buffet gratis/mes", "Eventos VIP"],
      members: 12,
    },
  ];

  const pointsActions = [
    { action: "Primer registro", points: 50, icon: "person_add", color: "text-pop-gold" },
    { action: "Por cada $10 MXN", points: 1, icon: "shopping_cart", color: "text-pop-gold" },
    { action: "Check-in en restaurante", points: 25, icon: "location_on", color: "text-pop-orange" },
    { action: "Reseña Google", points: 100, icon: "star", color: "text-pop-gold" },
    { action: "Referir amigo", points: 200, icon: "group_add", color: "text-pop-orange" },
    { action: "Pedido día baja afluencia", points: "2x", icon: "calendar_today", color: "text-pop-light-gold" },
    { action: "Cumpleaños", points: 150, icon: "cake", color: "text-pop-gold" },
    { action: "Compartir en redes", points: 30, icon: "share", color: "text-pop-light-gold" },
  ];

  const recentActivity: MemberActivity[] = [
    { id: "ACT-001", name: "Juan Pérez", initials: "JP", action: "registro", points: 50, time: "Hace 2 min", tier: "POP Fan", tierColor: "text-gray-300" },
    { id: "ACT-002", name: "María López", initials: "ML", action: "canje", points: -200, time: "Hace 15 min", tier: "POP Lover", tierColor: "text-pop-light-gold" },
    { id: "ACT-003", name: "Carlos Ruiz", initials: "CR", action: "visita", points: 25, time: "Hace 30 min", tier: "POP VIP", tierColor: "text-pop-orange" },
    { id: "ACT-004", name: "Ana Martínez", initials: "AM", action: "review", points: 100, time: "Hace 1 hora", tier: "POP VIP", tierColor: "text-pop-orange" },
    { id: "ACT-005", name: "Sofía Luna", initials: "SL", action: "referido", points: 200, time: "Hace 2 horas", tier: "POP Lover", tierColor: "text-pop-light-gold" },
    { id: "ACT-006", name: "Pedro Gómez", initials: "PG", action: "cumpleaños", points: 150, time: "Hace 3 horas", tier: "POP Elite", tierColor: "text-pop-gold" },
  ];

  const topMembers: TopMember[] = [
    { rank: 1, name: "Roberto Sánchez", initials: "RS", points: 4250, tier: "POP Elite", tierColor: "text-pop-gold", visits: 89, orders: 156, redeemed: 12 },
    { rank: 2, name: "Laura Castillo", initials: "LC", points: 3680, tier: "POP Elite", tierColor: "text-pop-gold", visits: 72, orders: 128, redeemed: 8 },
    { rank: 3, name: "Diego Fernández", initials: "DF", points: 2950, tier: "POP VIP", tierColor: "text-pop-orange", visits: 58, orders: 98, redeemed: 6 },
    { rank: 4, name: "Valentina Torres", initials: "VT", points: 2400, tier: "POP VIP", tierColor: "text-pop-orange", visits: 45, orders: 82, redeemed: 5 },
    { rank: 5, name: "Andrés Morales", initials: "AM", points: 1850, tier: "POP VIP", tierColor: "text-pop-orange", visits: 38, orders: 67, redeemed: 4 },
  ];

  const totalMembers = tiers.reduce((sum, t) => sum + t.members, 0);
  const totalPointsIssued = 125000;
  const totalRedemptions = 342;
  const activeThisMonth = 486;

  const getActivityIcon = (action: MemberActivity["action"]) => {
    const icons = {
      registro: "person_add",
      canje: "redeem",
      visita: "location_on",
      review: "star",
      referido: "group_add",
      cumpleaños: "cake",
    };
    return icons[action];
  };

  const getActivityColor = (action: MemberActivity["action"]) => {
    const colors = {
      registro: "bg-primary-container",
      canje: "bg-secondary",
      visita: "bg-pop-gold",
      review: "bg-pop-orange",
      referido: "bg-pop-light-gold",
      cumpleaños: "bg-pop-gold",
    };
    return colors[action];
  };

  return (
    <main className="pt-24 lg:pt-20 p-4 lg:p-10 min-h-screen bg-pop-black">
      {/* Header */}
      <header className="mb-8 lg:mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-4xl lg:text-5xl font-black tracking-tighter text-white font-epilogue uppercase flex items-center gap-3">
            <span className="material-symbols-outlined text-pop-gold text-5xl">token</span>
            Puntos POP
          </h1>
          <p className="text-gray-400 mt-2 text-base lg:text-lg font-manrope">
            Programa de lealtad — Tiers, redenciones y membresías
          </p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2.5 text-sm font-semibold text-pop-gold border border-pop-gold/30 rounded-lg hover:bg-pop-gold/10 transition-all duration-200 flex items-center gap-2">
            <span className="material-symbols-outlined text-lg">download</span>
            Exportar
          </button>
          <button
            onClick={() => setShowRedeemModal(true)}
            className="px-5 py-2.5 text-sm font-semibold text-pop-black bg-pop-gold rounded-lg hover:bg-pop-light-gold transition-all duration-200 flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-lg">redeem</span>
            Registrar Canje
          </button>
        </div>
      </header>

      {/* KPI Stats */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-10" aria-label="Estadísticas de puntos">
        <article className="bg-[#1C1B1B] backdrop-blur-sm rounded-xl p-6 border-l-4 border-pop-gold hover:border-pop-orange transition-all duration-500 group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 rounded-lg bg-white/5 group-hover:bg-pop-gold/10 transition-colors">
              <span className="material-symbols-outlined text-pop-gold text-3xl transition-transform group-hover:scale-110">
                group
              </span>
            </div>
          </div>
          <h3 className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold mb-2">
            Miembros Totales
          </h3>
          <p className="text-3xl font-black text-white tracking-tighter font-epilogue">{totalMembers.toLocaleString()}</p>
        </article>

        <article className="bg-[#1C1B1B] backdrop-blur-sm rounded-xl p-6 border-l-4 border-pop-light-gold hover:border-pop-gold transition-all duration-500 group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 rounded-lg bg-white/5 group-hover:bg-pop-light-gold/10 transition-colors">
              <span className="material-symbols-outlined text-pop-light-gold text-3xl transition-transform group-hover:scale-110">
                token
              </span>
            </div>
          </div>
          <h3 className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold mb-2">
            Puntos Emitidos
          </h3>
          <p className="text-3xl font-black text-white tracking-tighter font-epilogue">{totalPointsIssued.toLocaleString()}</p>
        </article>

        <article className="bg-[#1C1B1B] backdrop-blur-sm rounded-xl p-6 border-l-4 border-pop-orange hover:border-pop-gold transition-all duration-500 group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 rounded-lg bg-white/5 group-hover:bg-pop-orange/10 transition-colors">
              <span className="material-symbols-outlined text-pop-orange text-3xl transition-transform group-hover:scale-110">
                redeem
              </span>
            </div>
          </div>
          <h3 className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold mb-2">
            Redenciones Totales
          </h3>
          <p className="text-3xl font-black text-white tracking-tighter font-epilogue">{totalRedemptions}</p>
        </article>

        <article className="bg-[#1C1B1B] backdrop-blur-sm rounded-xl p-6 border-l-4 border-pop-gold hover:border-pop-orange transition-all duration-500 group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 rounded-lg bg-white/5 group-hover:bg-pop-gold/10 transition-colors">
              <span className="material-symbols-outlined text-pop-gold text-3xl transition-transform group-hover:scale-110">
                trending_up
              </span>
            </div>
          </div>
          <h3 className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold mb-2">
            Activos este Mes
          </h3>
          <p className="text-3xl font-black text-white tracking-tighter font-epilogue">{activeThisMonth}</p>
        </article>
      </section>

      {/* Tier Cards */}
      <section className="mb-10">
        <h2 className="text-xl font-black uppercase font-epilogue tracking-tighter text-white mb-6">
          Niveles del Programa
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {tiers.map((tier, index) => (
            <article
              key={index}
              className={`${tier.bgColor} backdrop-blur-sm rounded-xl p-6 border ${tier.borderColor} hover:scale-[1.02] transition-all duration-300 cursor-pointer`}
              onClick={() => setSelectedTier(selectedTier === tier.name ? "todos" : tier.name)}
            >
              <div className="flex items-center gap-3 mb-4">
                <span className={`material-symbols-outlined ${tier.color} text-3xl`}>{tier.icon}</span>
                <div>
                  <h3 className={`text-lg font-black ${tier.color} font-epilogue`}>{tier.name}</h3>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest">{tier.range}</p>
                </div>
              </div>
              <div className="space-y-2 mb-4">
                {tier.benefits.map((benefit, bIdx) => (
                  <p key={bIdx} className="text-xs text-gray-400 flex items-center gap-2">
                    <span className="material-symbols-outlined text-pop-gold text-sm">check_circle</span>
                    {benefit}
                  </p>
                ))}
              </div>
              <div className="pt-4 border-t border-white/10 flex justify-between items-center">
                <span className="text-[10px] text-gray-500 uppercase">Miembros</span>
                <span className={`text-xl font-black ${tier.color}`}>{tier.members}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Points Actions Grid */}
      <section className="bg-[#1C1B1B] backdrop-blur-sm rounded-xl p-6 lg:p-8 border border-white/5 mb-8">
        <h2 className="text-xl font-black uppercase font-epilogue tracking-tighter text-white mb-6">
          Cómo Ganar Puntos
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {pointsActions.map((action, index) => (
            <div
              key={index}
              className="bg-gray-800/30 rounded-lg p-4 border border-gray-700/30 hover:border-pop-gold/30 transition-all"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className={`material-symbols-outlined ${action.color} text-2xl`}>{action.icon}</span>
                <div>
                  <p className="text-sm font-bold text-white">{action.action}</p>
                  <p className={`text-xs font-bold ${typeof action.points === 'string' ? 'text-pop-light-gold' : 'text-pop-gold'}`}>
                    {typeof action.points === 'string' ? action.points : `+${action.points} pts`}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Two Column: Top Members + Recent Activity */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        {/* Top 5 Members */}
        <article className="lg:col-span-2 bg-[#1C1B1B] backdrop-blur-sm rounded-xl p-8 border border-white/5">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-black uppercase font-epilogue tracking-tighter text-white">Top 5 Miembros POP</h2>
              <p className="text-xs text-pop-orange font-bold uppercase tracking-widest mt-2">Ranking por puntos acumulados</p>
            </div>
            <span className="material-symbols-outlined text-pop-gold text-4xl">emoji_events</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full" role="table">
              <thead>
                <tr className="border-b border-gray-800 text-xs uppercase tracking-wider text-gray-500">
                  <th className="pb-4 text-left font-medium">#</th>
                  <th className="pb-4 text-left font-medium">Miembro</th>
                  <th className="pb-4 text-left font-medium">Tier</th>
                  <th className="pb-4 text-left font-medium">Visitas</th>
                  <th className="pb-4 text-left font-medium">Pedidos</th>
                  <th className="pb-4 text-left font-medium">Redenciones</th>
                  <th className="pb-4 text-right font-medium">Puntos</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/50">
                {topMembers.map((member, index) => (
                  <tr key={index} className="hover:bg-gray-800/30 transition-colors duration-200">
                    <td className="py-4">
                      <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-xs font-black ${
                        member.rank === 1 ? "bg-pop-gold text-pop-black" :
                        member.rank === 2 ? "bg-gray-300 text-pop-black" :
                        member.rank === 3 ? "bg-pop-orange text-pop-black" :
                        "bg-gray-700 text-gray-300"
                      }`}>
                        {member.rank}
                      </span>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-xs font-bold text-pop-gold">
                          {member.initials}
                        </div>
                        <span className="font-semibold text-white">{member.name}</span>
                      </div>
                    </td>
                    <td className="py-4">
                      <span className={`text-xs font-bold ${member.tierColor}`}>{member.tier}</span>
                    </td>
                    <td className="py-4 text-gray-300 font-mono">{member.visits}</td>
                    <td className="py-4 text-gray-300 font-mono">{member.orders}</td>
                    <td className="py-4 text-gray-300 font-mono">{member.redeemed}</td>
                    <td className="py-4 text-right font-mono font-bold text-pop-gold text-lg">
                      {member.points.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        {/* Recent Activity */}
        <article className="bg-[#1C1B1B] backdrop-blur-sm rounded-xl p-8 border border-white/5">
          <div className="mb-8">
            <h2 className="text-2xl font-black uppercase font-epilogue tracking-tighter text-white">Actividad Reciente</h2>
            <p className="text-xs text-pop-orange font-bold uppercase tracking-widest mt-2">Últimos movimientos</p>
          </div>
          <div className="space-y-6 relative">
            <div className="absolute left-4 top-2 bottom-2 w-px bg-gray-800" />
            {recentActivity.map((activity, index) => (
              <div key={index} className="relative pl-12">
                <div
                  className={`absolute left-1.5 top-1.5 w-5 h-5 rounded-full ring-4 ring-gray-900 ${getActivityColor(activity.action)}`}
                >
                  <span className="material-symbols-outlined text-white text-xs flex items-center justify-center h-full">
                    {getActivityIcon(activity.action)}
                  </span>
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-semibold text-white">
                      {activity.name}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {activity.action.charAt(0).toUpperCase() + activity.action.slice(1)}
                    </p>
                  </div>
                  <span className={`text-sm font-bold ${activity.points > 0 ? "text-pop-gold" : "text-error"}`}>
                    {activity.points > 0 ? "+" : ""}{activity.points} pts
                  </span>
                </div>
                <p className="text-[10px] text-gray-600 mt-1">{activity.time}</p>
              </div>
            ))}
          </div>
        </article>
      </section>

      {/* Redeem Modal */}
      {showRedeemModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowRedeemModal(false)}>
          <div className="bg-[#1C1B1B] border border-white/10 rounded-xl w-full max-w-xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-white/5 flex justify-between items-center">
              <h2 className="text-2xl font-black uppercase font-epilogue tracking-tighter text-white flex items-center gap-3">
                <span className="material-symbols-outlined text-pop-gold">redeem</span>
                Registrar Canje
              </h2>
              <button onClick={() => setShowRedeemModal(false)} className="text-gray-500 hover:text-white transition-colors">
                <span className="material-symbols-outlined text-2xl">close</span>
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <label className="text-[10px] uppercase font-bold text-gray-500 block mb-2">Buscar Miembro</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-xl">
                    search
                  </span>
                  <input
                    type="text"
                    placeholder="Nombre, email o teléfono..."
                    className="w-full bg-gray-800/50 border border-white/10 rounded-lg pl-12 pr-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-pop-gold/50 transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-gray-500 block mb-2">Tipo de Canje</label>
                <select className="w-full bg-gray-800/50 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-pop-gold/50 transition-all">
                  <option value="">Seleccionar beneficio</option>
                  <option>Bebida gratis (POP Lover)</option>
                  <option>Roll gratis c/5 visitas (POP VIP)</option>
                  <option>Buffet gratis (POP Elite)</option>
                  <option>Descuento especial</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-gray-500 block mb-2">Puntos a Descontar</label>
                <input
                  type="number"
                  placeholder="Ej: 200"
                  className="w-full bg-gray-800/50 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-pop-gold/50 transition-all"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-gray-500 block mb-2">Notas (opcional)</label>
                <textarea
                  rows={2}
                  placeholder="Observaciones..."
                  className="w-full bg-gray-800/50 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-pop-gold/50 transition-all resize-none"
                />
              </div>
            </div>
            <div className="p-6 border-t border-white/5 flex justify-end gap-3">
              <button
                onClick={() => setShowRedeemModal(false)}
                className="px-6 py-2.5 text-sm font-semibold text-gray-400 border border-gray-700 rounded-lg hover:bg-gray-800/50 transition-all"
              >
                Cancelar
              </button>
              <button className="px-6 py-2.5 text-sm font-semibold text-pop-black bg-pop-gold rounded-lg hover:bg-pop-light-gold transition-all">
                Confirmar Canje
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
