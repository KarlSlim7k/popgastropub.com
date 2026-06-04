"use client";

import { useState, useEffect, useCallback } from "react";
import { fetchWithAuth } from "@/lib/api";
import { getAuthSession } from "@/lib/auth-session";

interface TierData {
  id: number;
  name: string;
  slug: string;
  range: string;
  min_points: number;
  max_points: number | null;
  color: string;
  bg_color: string;
  border_color: string;
  icon: string;
  benefits: string[];
  config: Record<string, unknown>;
  members: number;
  is_active: boolean;
  sort_order: number;
}

interface PointAction {
  id: number;
  action: string;
  slug: string;
  points: number;
  points_type: "fixed" | "per_amount" | "multiplier";
  icon: string;
  color: string;
  description: string | null;
  conditions: Record<string, unknown> | null;
  is_active: boolean;
  sort_order: number;
}

interface MemberActivity {
  id: string;
  name: string;
  initials: string;
  action: string;
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

interface Stats {
  totalMembers: number;
  totalPointsIssued: number;
  totalRedemptions: number;
  activeThisMonth: number;
}

type ModalType = "redeem" | "adjust" | "tier" | "action" | null;

const defaultTierForm = {
  name: "",
  slug: "",
  min_points: 0,
  max_points: "" as number | "",
  color: "#F2C777",
  bg_color: "#F2C777",
  border_color: "#F2C777",
  icon: "person",
  benefits: "",
  is_active: true,
  sort_order: 0,
};

const defaultActionForm = {
  action: "",
  slug: "",
  points: 0,
  points_type: "fixed" as "fixed" | "per_amount" | "multiplier",
  icon: "token",
  color: "#F2C777",
  description: "",
  is_active: true,
  sort_order: 0,
};

export default function AdminPuntosPage() {
  const [stats, setStats] = useState<Stats>({ totalMembers: 0, totalPointsIssued: 0, totalRedemptions: 0, activeThisMonth: 0 });
  const [tiers, setTiers] = useState<TierData[]>([]);
  const [actions, setActions] = useState<PointAction[]>([]);
  const [topMembers, setTopMembers] = useState<TopMember[]>([]);
  const [activity, setActivity] = useState<MemberActivity[]>([]);

  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [tierForm, setTierForm] = useState(defaultTierForm);
  const [actionForm, setActionForm] = useState(defaultActionForm);
  const [adjustForm, setAdjustForm] = useState({ user_id: "", points: "", description: "" });
  const [redeemForm, setRedeemForm] = useState({ user_id: "", points: "", description: "" });
  const [searchResults, setSearchResults] = useState<{ id: number; name: string; points: number }[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [adjustSearchQuery, setAdjustSearchQuery] = useState("");
  const [adjustSearchResults, setAdjustSearchResults] = useState<{ id: number; name: string; points: number }[]>([]);
  const [loading, setLoading] = useState(false);

  const loadData = useCallback(async () => {
    const session = getAuthSession();
    if (!session) return;
    try {
      const [s, t, a, m, act] = await Promise.all([
        fetchWithAuth<Stats>("/admin/puntos/stats", session.token),
        fetchWithAuth<TierData[]>("/admin/puntos/tiers", session.token),
        fetchWithAuth<PointAction[]>("/admin/puntos/actions", session.token),
        fetchWithAuth<TopMember[]>("/admin/puntos/top-members", session.token),
        fetchWithAuth<MemberActivity[]>("/admin/puntos/activity", session.token),
      ]);
      setStats(s);
      setTiers(t);
      setActions(a);
      setTopMembers(m);
      setActivity(act);
    } catch {}
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const searchUsers = async (q: string, setter: typeof setSearchResults) => {
    if (q.length < 2) { setter([]); return; }
    const session = getAuthSession();
    if (!session) return;
    try {
      const params = new URLSearchParams({ search: q, role: "cliente", per_page: "5" });
      const response = await fetchWithAuth<{ data: { id: string; name: string; points: number }[] }>(`/admin/usuarios?${params}`, session.token);
      setter(response.data.map((u) => ({ id: Number(u.id), name: u.name, points: u.points })));
    } catch {}
  };

  const closeModal = () => {
    setActiveModal(null);
    setEditingId(null);
    setTierForm(defaultTierForm);
    setActionForm(defaultActionForm);
    setAdjustForm({ user_id: "", points: "", description: "" });
    setRedeemForm({ user_id: "", points: "", description: "" });
    setSearchQuery("");
    setSearchResults([]);
    setAdjustSearchQuery("");
    setAdjustSearchResults([]);
  };

  const openEditTier = (tier: TierData) => {
    setEditingId(tier.id);
    setTierForm({
      name: tier.name,
      slug: tier.slug,
      min_points: tier.min_points,
      max_points: tier.max_points ?? "",
      color: tier.color,
      bg_color: tier.bg_color,
      border_color: tier.border_color,
      icon: tier.icon,
      benefits: tier.benefits.join(", "),
      is_active: tier.is_active,
      sort_order: tier.sort_order,
    });
    setActiveModal("tier");
  };

  const openEditAction = (act: PointAction) => {
    setEditingId(act.id);
    setActionForm({
      action: act.action,
      slug: act.slug,
      points: act.points,
      points_type: act.points_type,
      icon: act.icon,
      color: act.color,
      description: act.description ?? "",
      is_active: act.is_active,
      sort_order: act.sort_order,
    });
    setActiveModal("action");
  };

  const handleSaveTier = async () => {
    const session = getAuthSession();
    if (!session) return;
    setLoading(true);
    try {
      const body = {
        name: tierForm.name,
        slug: tierForm.slug,
        min_points: tierForm.min_points,
        max_points: tierForm.max_points === "" ? null : Number(tierForm.max_points),
        color: tierForm.color,
        bg_color: tierForm.bg_color,
        border_color: tierForm.border_color,
        icon: tierForm.icon,
        benefits: tierForm.benefits.split(",").map((b) => b.trim()).filter(Boolean),
        is_active: tierForm.is_active,
        sort_order: tierForm.sort_order,
      };
      if (editingId) {
        await fetchWithAuth(`/admin/puntos/tiers/${editingId}`, session.token, { method: "PUT", body: JSON.stringify(body) });
      } else {
        await fetchWithAuth("/admin/puntos/tiers", session.token, { method: "POST", body: JSON.stringify(body) });
      }
      closeModal();
      await loadData();
    } catch (e: any) {
      alert(e.message || "Error al guardar nivel");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTier = async (id: number) => {
    if (!confirm("Eliminar este nivel?")) return;
    const session = getAuthSession();
    if (!session) return;
    try {
      await fetchWithAuth(`/admin/puntos/tiers/${id}`, session.token, { method: "DELETE" });
      await loadData();
    } catch (e: any) {
      alert(e.message || "Error al eliminar");
    }
  };

  const handleSaveAction = async () => {
    const session = getAuthSession();
    if (!session) return;
    setLoading(true);
    try {
      const body = {
        action: actionForm.action,
        slug: actionForm.slug,
        points: actionForm.points,
        points_type: actionForm.points_type,
        icon: actionForm.icon,
        color: actionForm.color,
        description: actionForm.description || null,
        is_active: actionForm.is_active,
        sort_order: actionForm.sort_order,
      };
      if (editingId) {
        await fetchWithAuth(`/admin/puntos/actions/${editingId}`, session.token, { method: "PUT", body: JSON.stringify(body) });
      } else {
        await fetchWithAuth("/admin/puntos/actions", session.token, { method: "POST", body: JSON.stringify(body) });
      }
      closeModal();
      await loadData();
    } catch (e: any) {
      alert(e.message || "Error al guardar acción");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAction = async (id: number) => {
    if (!confirm("Eliminar esta acción?")) return;
    const session = getAuthSession();
    if (!session) return;
    try {
      await fetchWithAuth(`/admin/puntos/actions/${id}`, session.token, { method: "DELETE" });
      await loadData();
    } catch (e: any) {
      alert(e.message || "Error al eliminar");
    }
  };

  const handleRedeem = async () => {
    const session = getAuthSession();
    if (!session || !redeemForm.user_id || !redeemForm.points) return;
    setLoading(true);
    try {
      await fetchWithAuth("/admin/puntos/redeem", session.token, {
        method: "POST",
        body: JSON.stringify({ user_id: Number(redeemForm.user_id), points: Number(redeemForm.points), description: redeemForm.description }),
      });
      closeModal();
      await loadData();
    } catch (e: any) {
      alert(e.message || "Error al registrar canje");
    } finally {
      setLoading(false);
    }
  };

  const handleAdjust = async () => {
    const session = getAuthSession();
    if (!session || !adjustForm.user_id || !adjustForm.points) return;
    setLoading(true);
    try {
      await fetchWithAuth("/admin/puntos/adjust", session.token, {
        method: "POST",
        body: JSON.stringify({ user_id: Number(adjustForm.user_id), points: Number(adjustForm.points), description: adjustForm.description }),
      });
      closeModal();
      await loadData();
    } catch (e: any) {
      alert(e.message || "Error al ajustar puntos");
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (action: string) => {
    const icons: Record<string, string> = { registro: "person_add", canje: "redeem", visita: "location_on", review: "star", referido: "group_add", cumpleaños: "cake", compra: "shopping_cart" };
    return icons[action] || "token";
  };

  const getPointsLabel = (a: PointAction) => {
    if (a.points_type === "multiplier") return `${a.points}x`;
    if (a.points_type === "per_amount") return `+${a.points} pts/$${a.conditions?.amount || 10}`;
    return `+${a.points} pts`;
  };

  const inputCls = "w-full bg-gray-800/50 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-pop-gold/50";
  const labelCls = "text-[10px] uppercase font-bold text-gray-500 block mb-2";

  return (
    <main className="pt-24 lg:pt-20 p-4 lg:p-10 min-h-screen bg-pop-black">
      <header className="mb-8 lg:mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-4xl lg:text-5xl font-black tracking-tighter text-white font-epilogue uppercase flex items-center gap-3">
            <span className="material-symbols-outlined text-pop-gold text-5xl">token</span>Puntos POP
          </h1>
          <p className="text-gray-400 mt-2 text-base lg:text-lg font-manrope">Programa de lealtad — Tiers, redenciones y membresías</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => { closeModal(); setActiveModal("adjust"); }} className="px-4 py-2.5 text-sm font-semibold text-pop-gold border border-pop-gold/50 rounded-lg hover:bg-pop-gold/10 transition-all flex items-center gap-2">
            <span className="material-symbols-outlined text-lg">add_circle</span>Ajustar Puntos
          </button>
          <button onClick={() => { closeModal(); setActiveModal("redeem"); }} className="px-4 py-2.5 text-sm font-semibold text-pop-black bg-pop-gold rounded-lg hover:bg-pop-light-gold transition-all flex items-center gap-2">
            <span className="material-symbols-outlined text-lg">redeem</span>Registrar Canje
          </button>
        </div>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-10">
        {[
          { label: "Miembros Totales", value: stats.totalMembers, icon: "group", border: "border-pop-gold" },
          { label: "Puntos Emitidos", value: stats.totalPointsIssued, icon: "token", border: "border-pop-light-gold" },
          { label: "Redenciones Totales", value: stats.totalRedemptions, icon: "redeem", border: "border-pop-orange" },
          { label: "Activos este Mes", value: stats.activeThisMonth, icon: "trending_up", border: "border-pop-gold" },
        ].map((kpi, i) => (
          <article key={i} className={`bg-pop-cardGreen rounded-xl p-6 border-l-4 ${kpi.border} group`}>
            <div className="p-3 rounded-lg bg-white/5 group-hover:bg-pop-gold/10 transition-colors w-fit mb-4">
              <span className="material-symbols-outlined text-pop-gold text-3xl">{kpi.icon}</span>
            </div>
            <h3 className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold mb-2">{kpi.label}</h3>
            <p className="text-3xl font-black text-white tracking-tighter font-epilogue">{kpi.value.toLocaleString()}</p>
          </article>
        ))}
      </section>

      <section className="mb-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-black uppercase font-epilogue tracking-tighter text-white">Niveles del Programa</h2>
          <button onClick={() => { closeModal(); setActiveModal("tier"); }} className="px-4 py-2 text-xs font-semibold text-pop-black bg-pop-gold rounded-lg hover:bg-pop-light-gold transition-all flex items-center gap-1.5">
            <span className="material-symbols-outlined text-sm">add</span>Nuevo Nivel
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {tiers.map((tier) => (
            <article key={tier.id} className="rounded-xl p-6 border transition-all relative group" style={{ backgroundColor: `${tier.bg_color}15`, borderColor: `${tier.border_color}50` }}>
              <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => openEditTier(tier)} className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white">
                  <span className="material-symbols-outlined text-sm">edit</span>
                </button>
                <button onClick={() => handleDeleteTier(tier.id)} className="p-1.5 rounded-lg bg-white/10 hover:bg-red-500/30 text-red-400">
                  <span className="material-symbols-outlined text-sm">delete</span>
                </button>
              </div>
              <div className="flex items-center gap-3 mb-4">
                <span className="material-symbols-outlined text-3xl" style={{ color: tier.color }}>{tier.icon}</span>
                <div>
                  <h3 className="text-lg font-black font-epilogue" style={{ color: tier.color }}>{tier.name}</h3>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest">{tier.range}</p>
                </div>
              </div>
              <div className="space-y-2 mb-4">
                {tier.benefits.map((b, bi) => (
                  <p key={bi} className="text-xs text-gray-400 flex items-center gap-2">
                    <span className="material-symbols-outlined text-pop-gold text-sm">check_circle</span>{b}
                  </p>
                ))}
              </div>
              <div className="pt-4 border-t border-white/10 flex justify-between items-center">
                <span className="text-[10px] text-gray-500 uppercase">Miembros</span>
                <span className="text-xl font-black" style={{ color: tier.color }}>{tier.members}</span>
              </div>
              {!tier.is_active && <span className="absolute bottom-2 right-2 text-[9px] uppercase tracking-wider text-red-400 font-bold">Inactivo</span>}
            </article>
          ))}
        </div>
      </section>

      <section className="bg-pop-cardGreen rounded-xl p-6 lg:p-8 border border-white/5 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-black uppercase font-epilogue tracking-tighter text-white">Cómo Ganar Puntos</h2>
          <button onClick={() => { closeModal(); setActiveModal("action"); }} className="px-4 py-2 text-xs font-semibold text-pop-black bg-pop-gold rounded-lg hover:bg-pop-light-gold transition-all flex items-center gap-1.5">
            <span className="material-symbols-outlined text-sm">add</span>Nueva Acción
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {actions.map((a) => (
            <div key={a.id} className="bg-gray-800/30 rounded-lg p-4 border border-gray-700/30 hover:border-pop-gold/30 transition-all relative group">
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => openEditAction(a)} className="p-1 rounded bg-white/10 hover:bg-white/20 text-white">
                  <span className="material-symbols-outlined text-xs">edit</span>
                </button>
                <button onClick={() => handleDeleteAction(a.id)} className="p-1 rounded bg-white/10 hover:bg-red-500/30 text-red-400">
                  <span className="material-symbols-outlined text-xs">delete</span>
                </button>
              </div>
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-2xl" style={{ color: a.color }}>{a.icon}</span>
                <div>
                  <p className="text-sm font-bold text-white">{a.action}</p>
                  <p className="text-xs font-bold text-pop-gold">{getPointsLabel(a)}</p>
                  {a.description && <p className="text-[10px] text-gray-500 mt-0.5">{a.description}</p>}
                </div>
              </div>
              {!a.is_active && <span className="absolute bottom-1 right-1 text-[9px] uppercase tracking-wider text-red-400 font-bold">Inactivo</span>}
            </div>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        <article className="lg:col-span-2 bg-pop-cardGreen rounded-xl p-8 border border-white/5">
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

        <article className="bg-pop-cardGreen rounded-xl p-8 border border-white/5">
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

      {activeModal === "redeem" && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={closeModal}>
          <div className="bg-pop-cardGreen border border-white/10 rounded-xl w-full max-w-xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-white/5 flex justify-between items-center">
              <h2 className="text-2xl font-black uppercase font-epilogue tracking-tighter text-white flex items-center gap-3">
                <span className="material-symbols-outlined text-pop-gold">redeem</span>Registrar Canje
              </h2>
              <button onClick={closeModal} className="text-gray-500 hover:text-white"><span className="material-symbols-outlined text-2xl">close</span></button>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <label className={labelCls}>Buscar Miembro</label>
                <input type="text" value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); searchUsers(e.target.value, setSearchResults); }} placeholder="Nombre o email..." className={inputCls} />
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
                <label className={labelCls}>Puntos a Descontar</label>
                <input type="number" min="1" value={redeemForm.points} onChange={(e) => setRedeemForm({ ...redeemForm, points: e.target.value })} placeholder="Ej: 200" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Descripción (opcional)</label>
                <input type="text" value={redeemForm.description} onChange={(e) => setRedeemForm({ ...redeemForm, description: e.target.value })} placeholder="Ej: Bebida gratis" className={inputCls} />
              </div>
            </div>
            <div className="p-6 border-t border-white/5 flex justify-end gap-3">
              <button onClick={closeModal} className="px-6 py-2.5 text-sm font-semibold text-gray-400 border border-gray-700 rounded-lg hover:bg-gray-800/50">Cancelar</button>
              <button onClick={handleRedeem} disabled={loading} className="px-6 py-2.5 text-sm font-semibold text-pop-black bg-pop-gold rounded-lg hover:bg-pop-light-gold disabled:opacity-50">{loading ? "Procesando..." : "Confirmar Canje"}</button>
            </div>
          </div>
        </div>
      )}

      {activeModal === "adjust" && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={closeModal}>
          <div className="bg-pop-cardGreen border border-white/10 rounded-xl w-full max-w-xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-white/5 flex justify-between items-center">
              <h2 className="text-2xl font-black uppercase font-epilogue tracking-tighter text-white flex items-center gap-3">
                <span className="material-symbols-outlined text-pop-gold">add_circle</span>Ajustar Puntos
              </h2>
              <button onClick={closeModal} className="text-gray-500 hover:text-white"><span className="material-symbols-outlined text-2xl">close</span></button>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <label className={labelCls}>Buscar Miembro</label>
                <input type="text" value={adjustSearchQuery} onChange={(e) => { setAdjustSearchQuery(e.target.value); searchUsers(e.target.value, setAdjustSearchResults); }} placeholder="Nombre o email..." className={inputCls} />
                {adjustSearchResults.length > 0 && (
                  <div className="mt-2 bg-gray-800 rounded-lg border border-white/10 divide-y divide-white/5">
                    {adjustSearchResults.map((u) => (
                      <button key={u.id} onClick={() => { setAdjustForm({ ...adjustForm, user_id: String(u.id) }); setAdjustSearchQuery(u.name); setAdjustSearchResults([]); }} className="w-full px-4 py-3 text-left text-sm text-white hover:bg-white/5 flex justify-between">
                        <span>{u.name}</span><span className="text-pop-gold font-bold">{u.points} pts</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <label className={labelCls}>Puntos (positivo = sumar, negativo = restar)</label>
                <input type="number" value={adjustForm.points} onChange={(e) => setAdjustForm({ ...adjustForm, points: e.target.value })} placeholder="Ej: 100 o -50" className={inputCls} />
                <p className="text-[10px] text-gray-500 mt-1">Usa números negativos para restar puntos</p>
              </div>
              <div>
                <label className={labelCls}>Descripción</label>
                <input type="text" value={adjustForm.description} onChange={(e) => setAdjustForm({ ...adjustForm, description: e.target.value })} placeholder="Ej: Corrección manual" className={inputCls} />
              </div>
            </div>
            <div className="p-6 border-t border-white/5 flex justify-end gap-3">
              <button onClick={closeModal} className="px-6 py-2.5 text-sm font-semibold text-gray-400 border border-gray-700 rounded-lg hover:bg-gray-800/50">Cancelar</button>
              <button onClick={handleAdjust} disabled={loading} className="px-6 py-2.5 text-sm font-semibold text-pop-black bg-pop-gold rounded-lg hover:bg-pop-light-gold disabled:opacity-50">{loading ? "Procesando..." : "Ajustar Puntos"}</button>
            </div>
          </div>
        </div>
      )}

      {activeModal === "tier" && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={closeModal}>
          <div className="bg-pop-cardGreen border border-white/10 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-white/5 flex justify-between items-center">
              <h2 className="text-2xl font-black uppercase font-epilogue tracking-tighter text-white flex items-center gap-3">
                <span className="material-symbols-outlined text-pop-gold">workspace_premium</span>{editingId ? "Editar Nivel" : "Nuevo Nivel"}
              </h2>
              <button onClick={closeModal} className="text-gray-500 hover:text-white"><span className="material-symbols-outlined text-2xl">close</span></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Nombre</label>
                  <input type="text" value={tierForm.name} onChange={(e) => setTierForm({ ...tierForm, name: e.target.value })} placeholder="POP Fan" className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Slug</label>
                  <input type="text" value={tierForm.slug} onChange={(e) => setTierForm({ ...tierForm, slug: e.target.value })} placeholder="fan" className={inputCls} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Puntos Mínimos</label>
                  <input type="number" min="0" value={tierForm.min_points} onChange={(e) => setTierForm({ ...tierForm, min_points: Number(e.target.value) })} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Puntos Máximos (vacío = sin límite)</label>
                  <input type="number" min="0" value={tierForm.max_points} onChange={(e) => setTierForm({ ...tierForm, max_points: e.target.value === "" ? "" : Number(e.target.value) })} placeholder="499" className={inputCls} />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className={labelCls}>Color</label>
                  <input type="color" value={tierForm.color} onChange={(e) => setTierForm({ ...tierForm, color: e.target.value })} className="w-full h-10 rounded-lg cursor-pointer bg-transparent" />
                </div>
                <div>
                  <label className={labelCls}>Color Fondo</label>
                  <input type="color" value={tierForm.bg_color} onChange={(e) => setTierForm({ ...tierForm, bg_color: e.target.value })} className="w-full h-10 rounded-lg cursor-pointer bg-transparent" />
                </div>
                <div>
                  <label className={labelCls}>Color Borde</label>
                  <input type="color" value={tierForm.border_color} onChange={(e) => setTierForm({ ...tierForm, border_color: e.target.value })} className="w-full h-10 rounded-lg cursor-pointer bg-transparent" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Icono (Material Symbol)</label>
                  <input type="text" value={tierForm.icon} onChange={(e) => setTierForm({ ...tierForm, icon: e.target.value })} placeholder="person" className={inputCls} />
                  <span className="material-symbols-outlined text-2xl mt-1" style={{ color: tierForm.color }}>{tierForm.icon}</span>
                </div>
                <div>
                  <label className={labelCls}>Orden</label>
                  <input type="number" min="0" value={tierForm.sort_order} onChange={(e) => setTierForm({ ...tierForm, sort_order: Number(e.target.value) })} className={inputCls} />
                </div>
              </div>
              <div>
                <label className={labelCls}>Beneficios (separados por coma)</label>
                <input type="text" value={tierForm.benefits} onChange={(e) => setTierForm({ ...tierForm, benefits: e.target.value })} placeholder="Promos básicas, Puntos por compra" className={inputCls} />
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" id="tier-active" checked={tierForm.is_active} onChange={(e) => setTierForm({ ...tierForm, is_active: e.target.checked })} className="w-4 h-4 accent-pop-gold" />
                <label htmlFor="tier-active" className="text-sm text-white font-semibold">Activo</label>
              </div>
            </div>
            <div className="p-6 border-t border-white/5 flex justify-end gap-3">
              <button onClick={closeModal} className="px-6 py-2.5 text-sm font-semibold text-gray-400 border border-gray-700 rounded-lg hover:bg-gray-800/50">Cancelar</button>
              <button onClick={handleSaveTier} disabled={loading} className="px-6 py-2.5 text-sm font-semibold text-pop-black bg-pop-gold rounded-lg hover:bg-pop-light-gold disabled:opacity-50">{loading ? "Guardando..." : editingId ? "Actualizar" : "Crear"}</button>
            </div>
          </div>
        </div>
      )}

      {activeModal === "action" && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={closeModal}>
          <div className="bg-pop-cardGreen border border-white/10 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-white/5 flex justify-between items-center">
              <h2 className="text-2xl font-black uppercase font-epilogue tracking-tighter text-white flex items-center gap-3">
                <span className="material-symbols-outlined text-pop-gold">token</span>{editingId ? "Editar Acción" : "Nueva Acción"}
              </h2>
              <button onClick={closeModal} className="text-gray-500 hover:text-white"><span className="material-symbols-outlined text-2xl">close</span></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Nombre</label>
                  <input type="text" value={actionForm.action} onChange={(e) => setActionForm({ ...actionForm, action: e.target.value })} placeholder="Primer registro" className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Slug</label>
                  <input type="text" value={actionForm.slug} onChange={(e) => setActionForm({ ...actionForm, slug: e.target.value })} placeholder="welcome" className={inputCls} />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className={labelCls}>Puntos</label>
                  <input type="number" min="0" value={actionForm.points} onChange={(e) => setActionForm({ ...actionForm, points: Number(e.target.value) })} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Tipo</label>
                  <select value={actionForm.points_type} onChange={(e) => setActionForm({ ...actionForm, points_type: e.target.value as "fixed" | "per_amount" | "multiplier" })} className={inputCls}>
                    <option value="fixed">Fijo</option>
                    <option value="per_amount">Por monto</option>
                    <option value="multiplier">Multiplicador</option>
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Orden</label>
                  <input type="number" min="0" value={actionForm.sort_order} onChange={(e) => setActionForm({ ...actionForm, sort_order: Number(e.target.value) })} className={inputCls} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Icono (Material Symbol)</label>
                  <input type="text" value={actionForm.icon} onChange={(e) => setActionForm({ ...actionForm, icon: e.target.value })} placeholder="token" className={inputCls} />
                  <span className="material-symbols-outlined text-2xl mt-1" style={{ color: actionForm.color }}>{actionForm.icon}</span>
                </div>
                <div>
                  <label className={labelCls}>Color</label>
                  <input type="color" value={actionForm.color} onChange={(e) => setActionForm({ ...actionForm, color: e.target.value })} className="w-full h-10 rounded-lg cursor-pointer bg-transparent" />
                </div>
              </div>
              <div>
                <label className={labelCls}>Descripción</label>
                <input type="text" value={actionForm.description} onChange={(e) => setActionForm({ ...actionForm, description: e.target.value })} placeholder="Bono de bienvenida al registrarse" className={inputCls} />
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" id="action-active" checked={actionForm.is_active} onChange={(e) => setActionForm({ ...actionForm, is_active: e.target.checked })} className="w-4 h-4 accent-pop-gold" />
                <label htmlFor="action-active" className="text-sm text-white font-semibold">Activo</label>
              </div>
            </div>
            <div className="p-6 border-t border-white/5 flex justify-end gap-3">
              <button onClick={closeModal} className="px-6 py-2.5 text-sm font-semibold text-gray-400 border border-gray-700 rounded-lg hover:bg-gray-800/50">Cancelar</button>
              <button onClick={handleSaveAction} disabled={loading} className="px-6 py-2.5 text-sm font-semibold text-pop-black bg-pop-gold rounded-lg hover:bg-pop-light-gold disabled:opacity-50">{loading ? "Guardando..." : editingId ? "Actualizar" : "Crear"}</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}