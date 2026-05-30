"use client";

import { useState, useEffect } from "react";
import { fetchWithAuth } from "@/lib/api";
import { getAuthSession } from "@/lib/auth-session";

interface TierData { name: string; range: string; members: number; }
interface MemberActivity { id: string; name: string; initials: string; action: string; points: number; time: string; tier: string; tierColor: string; }
interface TopMember { rank: number; name: string; initials: string; points: number; tier: string; tierColor: string; visits: number; orders: number; redeemed: number; }
interface Stats { totalMembers: number; totalPointsIssued: number; totalRedemptions: number; activeThisMonth: number; }

const TIER_CONFIG = [
  { color: "text-gray-300", bgColor: "bg-gray-700/30", borderColor: "border-gray-600", icon: "person", benefits: ["Promos básicas", "Puntos por compra"] },
  { color: "text-pop-light-gold", bgColor: "bg-pop-light-gold/10", borderColor: "border-pop-light-gold/30", icon: "favorite", benefits: ["+10% puntos", "Promo mensual", "Bebida gratis cumpleaños"] },
  { color: "text-pop-orange", bgColor: "bg-pop-orange/10", borderColor: "border-pop-orange/30", icon: "workspace_premium", benefits: ["+25% puntos", "Roll gratis c/5 visitas", "Acceso anticipado"] },
  { color: "text-pop-gold", bgColor: "bg-pop-gold/10", borderColor: "border-pop-gold/30", icon: "military_tech", benefits: ["+50% puntos", "Reservación prioritaria", "1 buffet gratis/mes", "Eventos VIP"] },
];

const POINTS_ACTIONS = [
  { action: "Primer registro", points: 50, icon: "person_add" },
  { action: "Por cada $10 MXN", points: 1, icon: "shopping_cart" },
  { action: "Check-in en restaurante", points: 25, icon: "location_on" },
  { action: "Reseña Google", points: 100, icon: "star" },
  { action: "Referir amigo", points: 200, icon: "group_add" },
  { action: "Día baja afluencia", points: "2x", icon: "calendar_today" },
  { action: "Cumpleaños", points: 150, icon: "cake" },
  { action: "Compartir en redes", points: 30, icon: "share" },
];

export default function AdminPuntosPage() {
  const [stats, setStats] = useState<Stats>({ totalMembers: 0, totalPointsIssued: 0, totalRedemptions: 0, activeThisMonth: 0 });
  const [tiers, setTiers] = useState<TierData[]>([]);
  const [topMembers, setTopMembers] = useState<TopMember[]>([]);
  const [activity, setActivity] = useState<MemberActivity[]>([]);
  const [showRedeemModal, setShowRedeemModal] = useState(false);
  const [redeemForm, setRedeemForm] = useState({ user_id: "", points: "", description: "" });
  const [searchResults, setSearchResults] = useState<{ id: number; name: string; points: number }[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const session = getAuthSession();
    if (!session) return;
    Promise.all([
      fetchWithAuth<Stats>("/admin/puntos/stats", session.token),
      fetchWithAuth<TierData[]>("/admin/puntos/tiers", session.token),
      fetchWithAuth<TopMember[]>("/admin/puntos/top-members", session.token),
      fetchWithAuth<MemberActivity[]>("/admin/puntos/activity", session.token),
    ]).then(([s, t, m, a]) => { setStats(s); setTiers(t); setTopMembers(m); setActivity(a); }).catch(() => {});
  }, []);

  const searchUsers = async (q: string) => {
    setSearchQuery(q);
    if (q.length < 2) { setSearchResults([]); return; }
    const session = getAuthSession();
    if (!session) return;
    try {
      const users = await fetchWithAuth<any[]>("/admin/usuarios", session.token);
      setSearchResults(users.filter((u: any) => u.name.toLowerCase().includes(q.toLowerCase()) || u.email.includes(q)).slice(0, 5).map((u: any) => ({ id: Number(u.id), name: u.name, points: u.points })));
    } catch {}
  };

  const handleRedeem = async () => {
    const session = getAuthSession();
    if (!session || !redeemForm.user_id || !redeemForm.points) return;
    try {
      await fetchWithAuth("/admin/puntos/redeem", session.token, { method: "POST", body: JSON.stringify({ user_id: Number(redeemForm.user_id), points: Number(redeemForm.points), description: redeemForm.description }) });
      setShowRedeemModal(false);
      setRedeemForm({ user_id: "", points: "", description: "" });
      // Refresh data
      const [s, m, a] = await Promise.all([
        fetchWithAuth<Stats>("/admin/puntos/stats", session.token),
        fetchWithAuth<TopMember[]>("/admin/puntos/top-members", session.token),
        fetchWithAuth<MemberActivity[]>("/admin/puntos/activity", session.token),
      ]);
      setStats(s); setTopMembers(m); setActivity(a);
    } catch (e: any) { alert(e.message || "Error al registrar canje"); }
  };

  const getActivityIcon = (action: string) => {
    const icons: Record<string, string> = { registro: "person_add", canje: "redeem", visita: "location_on", review: "star", referido: "group_add", cumpleaños: "cake", compra: "shopping_cart" };
    return icons[action] || "token";
  };

  return (
    <main className="pt-24 lg:pt-20 p-4 lg:p-10 min-h-screen bg-pop-black">
      <header className="mb-8 lg:mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-4xl lg:text-5xl font-black tracking-tighter text-white font-epilogue uppercase flex items-center gap-3">
            <span className="material-symbols-outlined text-pop-gold text-5xl">token</span>Puntos POP
          </h1>
          <p className="text-gray-400 mt-2 text-base lg:text-lg font-manrope">Programa de lealtad — Tiers, redenciones y membresías</p>
        </div>
        <button onClick={() => setShowRedeemModal(true)} className="px-5 py-2.5 text-sm font-semibold text-pop-black bg-pop-gold rounded-lg hover:bg-pop-light-gold transition-all flex items-center gap-2">
          <span className="material-symbols-outlined text-lg">redeem</span>Registrar Canje
        </button>
      </header>

      {/* KPI Stats */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-10">
        {[
          { label: "Miembros Totales", value: stats.totalMembers, icon: "group", border: "border-pop-gold" },
          { label: "Puntos Emitidos", value: stats.totalPointsIssued, icon: "token", border: "border-pop-light-gold" },
          { label: "Redenciones Totales", value: stats.totalRedemptions, icon: "redeem", border: "border-pop-orange" },
          { label: "Activos este Mes", value: stats.activeThisMonth, icon: "trending_up", border: "border-pop-gold" },
        ].map((kpi, i) => (
          <article key={i} className={`bg-[#1C1B1B] rounded-xl p-6 border-l-4 ${kpi.border} group`}>
            <div className="p-3 rounded-lg bg-white/5 group-hover:bg-pop-gold/10 transition-colors w-fit mb-4">
              <span className="material-symbols-outlined text-pop-gold text-3xl">{kpi.icon}</span>
            </div>
            <h3 className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold mb-2">{kpi.label}</h3>
            <p className="text-3xl font-black text-white tracking-tighter font-epilogue">{kpi.value.toLocaleString()}</p>
          </article>
        ))}
      </section>

      {/* Tier Cards */}
      <section className="mb-10">
        <h2 className="text-xl font-black uppercase font-epilogue tracking-tighter text-white mb-6">Niveles del Programa</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {tiers.map((tier, i) => {
            const cfg = TIER_CONFIG[i] || TIER_CONFIG[0];
            return (
              <article key={i} className={`${cfg.bgColor} rounded-xl p-6 border ${cfg.borderColor} transition-all`}>
                <div className="flex items-center gap-3 mb-4">
                  <span className={`material-symbols-outlined ${cfg.color} text-3xl`}>{cfg.icon}</span>
                  <div>
                    <h3 className={`text-lg font-black ${cfg.color} font-epilogue`}>{tier.name}</h3>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest">{tier.range}</p>
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  {cfg.benefits.map((b, bi) => (
                    <p key={bi} className="text-xs text-gray-400 flex items-center gap-2">
                      <span className="material-symbols-outlined text-pop-gold text-sm">check_circle</span>{b}
                    </p>
                  ))}
                </div>
                <div className="pt-4 border-t border-white/10 flex justify-between items-center">
                  <span className="text-[10px] text-gray-500 uppercase">Miembros</span>
                  <span className={`text-xl font-black ${cfg.color}`}>{tier.members}</span>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Points Actions */}
      <section className="bg-[#1C1B1B] rounded-xl p-6 lg:p-8 border border-white/5 mb-8">
        <h2 className="text-xl font-black uppercase font-epilogue tracking-tighter text-white mb-6">Cómo Ganar Puntos</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {POINTS_ACTIONS.map((a, i) => (
            <div key={i} className="bg-gray-800/30 rounded-lg p-4 border border-gray-700/30 hover:border-pop-gold/30 transition-all">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-pop-gold text-2xl">{a.icon}</span>
                <div>
                  <p className="text-sm font-bold text-white">{a.action}</p>
                  <p className="text-xs font-bold text-pop-gold">{typeof a.points === "string" ? a.points : `+${a.points} pts`}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Top Members + Activity */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        <article className="lg:col-span-2 bg-[#1C1B1B] rounded-xl p-8 border border-white/5">
          <h2 className="text-2xl font-black uppercase font-epilogue tracking-tighter text-white mb-6">Top 5 Miembros POP</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800 text-xs uppercase tracking-wider text-gray-500">
                  <th className="pb-4 text-left">#</th><th className="pb-4 text-left">Miembro</th><th className="pb-4 text-left">Tier</th><th className="pb-4 text-left">Visitas</th><th className="pb-4 text-right">Puntos</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/50">
                {topMembers.map((m) => (
                  <tr key={m.rank} className="hover:bg-gray-800/30">
                    <td className="py-4"><span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-xs font-black ${m.rank === 1 ? "bg-pop-gold text-pop-black" : m.rank === 2 ? "bg-gray-300 text-pop-black" : m.rank === 3 ? "bg-pop-orange text-pop-black" : "bg-gray-700 text-gray-300"}`}>{m.rank}</span></td>
                    <td className="py-4"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-xs font-bold text-pop-gold">{m.initials}</div><span className="font-semibold text-white">{m.name}</span></div></td>
                    <td className="py-4"><span className={`text-xs font-bold ${m.tierColor}`}>{m.tier}</span></td>
                    <td className="py-4 text-gray-300 font-mono">{m.visits}</td>
                    <td className="py-4 text-right font-mono font-bold text-pop-gold text-lg">{m.points.toLocaleString()}</td>
                  </tr>
                ))}
                {topMembers.length === 0 && <tr><td colSpan={5} className="py-8 text-center text-gray-500 text-xs">Sin miembros</td></tr>}
              </tbody>
            </table>
          </div>
        </article>

        <article className="bg-[#1C1B1B] rounded-xl p-8 border border-white/5">
          <h2 className="text-2xl font-black uppercase font-epilogue tracking-tighter text-white mb-6">Actividad Reciente</h2>
          <div className="space-y-6 relative">
            <div className="absolute left-4 top-2 bottom-2 w-px bg-gray-800" />
            {activity.map((a, i) => (
              <div key={i} className="relative pl-12">
                <div className="absolute left-1.5 top-1.5 w-5 h-5 rounded-full ring-4 ring-gray-900 bg-pop-gold flex items-center justify-center">
                  <span className="material-symbols-outlined text-white text-[10px]">{getActivityIcon(a.action)}</span>
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-semibold text-white">{a.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{a.action}</p>
                  </div>
                  <span className={`text-sm font-bold ${a.points > 0 ? "text-pop-gold" : "text-red-400"}`}>{a.points > 0 ? "+" : ""}{a.points} pts</span>
                </div>
                <p className="text-[10px] text-gray-600 mt-1">{a.time}</p>
              </div>
            ))}
            {activity.length === 0 && <p className="text-center text-gray-500 text-xs pl-12">Sin actividad reciente</p>}
          </div>
        </article>
      </section>

      {/* Redeem Modal */}
      {showRedeemModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowRedeemModal(false)}>
          <div className="bg-[#1C1B1B] border border-white/10 rounded-xl w-full max-w-xl" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-white/5 flex justify-between items-center">
              <h2 className="text-2xl font-black uppercase font-epilogue tracking-tighter text-white flex items-center gap-3">
                <span className="material-symbols-outlined text-pop-gold">redeem</span>Registrar Canje
              </h2>
              <button onClick={() => setShowRedeemModal(false)} className="text-gray-500 hover:text-white"><span className="material-symbols-outlined text-2xl">close</span></button>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <label className="text-[10px] uppercase font-bold text-gray-500 block mb-2">Buscar Miembro</label>
                <input type="text" value={searchQuery} onChange={(e) => searchUsers(e.target.value)} placeholder="Nombre o email..." className="w-full bg-gray-800/50 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-pop-gold/50" />
                {searchResults.length > 0 && (
                  <div className="mt-2 bg-gray-800 rounded-lg border border-white/10 divide-y divide-white/5">
                    {searchResults.map((u) => (
                      <button key={u.id} onClick={() => { setRedeemForm({ ...redeemForm, user_id: String(u.id) }); setSearchQuery(u.name); setSearchResults([]); }} className="w-full px-4 py-3 text-left text-sm text-white hover:bg-white/5 flex justify-between">
                        <span>{u.name}</span><span className="text-pop-gold font-bold">{u.points} pts</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-gray-500 block mb-2">Puntos a Descontar</label>
                <input type="number" value={redeemForm.points} onChange={(e) => setRedeemForm({ ...redeemForm, points: e.target.value })} placeholder="Ej: 200" className="w-full bg-gray-800/50 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-pop-gold/50" />
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-gray-500 block mb-2">Descripción (opcional)</label>
                <input type="text" value={redeemForm.description} onChange={(e) => setRedeemForm({ ...redeemForm, description: e.target.value })} placeholder="Ej: Bebida gratis" className="w-full bg-gray-800/50 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-pop-gold/50" />
              </div>
            </div>
            <div className="p-6 border-t border-white/5 flex justify-end gap-3">
              <button onClick={() => setShowRedeemModal(false)} className="px-6 py-2.5 text-sm font-semibold text-gray-400 border border-gray-700 rounded-lg hover:bg-gray-800/50">Cancelar</button>
              <button onClick={handleRedeem} className="px-6 py-2.5 text-sm font-semibold text-pop-black bg-pop-gold rounded-lg hover:bg-pop-light-gold">Confirmar Canje</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
