"use client";

import { useState, useEffect } from "react";
import { fetchWithAuth } from "@/lib/api";
import { getAuthSession } from "@/lib/auth-session";

interface Waiter {
  id: number;
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
}

export default function AdminMeserosPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<"semana" | "mes" | "todo">("mes");
  const [waiters, setWaiters] = useState<Waiter[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingWaiter, setEditingWaiter] = useState<Waiter | null>(null);
  const [form, setForm] = useState<Partial<Waiter>>({
    name: "",
    initials: "",
    status: "activo",
    cocktailPoints: 0,
    premiumPoints: 0,
    pitcherPoints: 0,
    bottlePoints: 0,
    comboPoints: 0,
    upsellPoints: 0,
    ratingPoints: 0,
    totalSales: 0,
    ordersServed: 0,
    avgRating: 5,
  });

  const fetchWaiters = async () => {
    const session = getAuthSession();
    if (!session) return;
    setLoading(true);
    try {
      const data = await fetchWithAuth<Waiter[]>("/api/admin/meseros", session.token);
      const sorted = [...data].sort((a, b) => (b.totalPoints || 0) - (a.totalPoints || 0));
      sorted.forEach((w, i) => (w.rank = i + 1));
      setWaiters(sorted);
    } catch {
      // error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWaiters();
  }, []);

  const openCreate = () => {
    setEditingWaiter(null);
    setForm({
      name: "",
      initials: "",
      status: "activo",
      cocktailPoints: 0,
      premiumPoints: 0,
      pitcherPoints: 0,
      bottlePoints: 0,
      comboPoints: 0,
      upsellPoints: 0,
      ratingPoints: 0,
      totalSales: 0,
      ordersServed: 0,
      avgRating: 5,
    });
    setShowModal(true);
  };

  const openEdit = (w: Waiter) => {
    setEditingWaiter(w);
    setForm({ ...w });
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

  const handleSubmit = async () => {
    const session = getAuthSession();
    if (!session) return;
    const body = JSON.stringify(form);
    try {
      if (editingWaiter) {
        await fetchWithAuth(`/api/admin/meseros/${editingWaiter.id}`, session.token, { method: "PUT", body });
      } else {
        await fetchWithAuth("/api/admin/meseros", session.token, { method: "POST", body });
      }
      closeModal();
      fetchWaiters();
    } catch {
      alert("Error al guardar mesero");
    }
  };

  const handleDelete = async (id: number) => {
    const session = getAuthSession();
    if (!session) return;
    if (!confirm("¿Eliminar este mesero?")) return;
    try {
      await fetchWithAuth(`/api/admin/meseros/${id}`, session.token, { method: "DELETE" });
      fetchWaiters();
    } catch {
      alert("Error al eliminar");
    }
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) return "bg-pop-gold text-pop-black";
    if (rank === 2) return "bg-gray-300 text-pop-black";
    if (rank === 3) return "bg-pop-orange text-pop-black";
    return "bg-gray-700 text-gray-300";
  };

  const getStatusBadge = (status: Waiter["status"]) => {
    const styles = {
      activo: "bg-pop-gold/10 text-pop-gold border-pop-gold/20",
      inactivo: "bg-gray-600/10 text-gray-400 border-gray-600/20",
      descanso: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    };
    return (
      <span className={`text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest border ${styles[status]}`}>
        {status}
      </span>
    );
  };

  const top3 = waiters.slice(0, 3);
  const podiumOrder = [top3[1], top3[0], top3[2]].filter(Boolean);

  return (
    <main className="pt-24 lg:pt-20 p-4 lg:p-10 min-h-screen bg-pop-black">
      <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl lg:text-7xl font-black tracking-tighter text-white font-epilogue uppercase leading-none flex items-center gap-4">
            Bar Stars
          </h1>
          <p className="text-pop-orange mt-2 text-xs font-bold uppercase tracking-[0.3em]">Gestión de Performance Staff</p>
        </div>
        <div className="flex w-full md:w-auto gap-2">
          <button
            onClick={openCreate}
            className="flex-1 md:flex-none px-6 py-4 bg-pop-gold text-pop-black text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-pop-lightGold transition-all shadow-lg"
          >
            Agregar Mesero
          </button>
        </div>
      </header>

      <div className="flex bg-[#1C1B1B] p-1 rounded-xl border border-white/5 mb-8 w-fit overflow-x-auto no-scrollbar">
        {(["semana", "mes", "todo"] as const).map((p) => (
          <button
            key={p}
            onClick={() => setSelectedPeriod(p)}
            className={`px-6 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all whitespace-nowrap ${
              selectedPeriod === p ? "bg-pop-gold text-pop-black" : "text-gray-500 hover:text-white"
            }`}
          >
            {p === "semana" ? "Esta Semana" : p === "mes" ? "Este Mes" : "Histórico"}
          </button>
        ))}
      </div>

      {waiters.length > 0 && (
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12 items-end">
          {podiumOrder.map((w) => {
            if (!w) return null;
            const isWinner = w.rank === 1;
            return (
              <article
                key={w.id}
                className={`relative bg-[#1C1B1B] p-8 lg:p-10 rounded-3xl border transition-all flex flex-col items-center text-center ${
                  isWinner ? "border-pop-gold lg:py-16 shadow-[0_0_40px_rgba(242,199,119,0.1)] lg:-translate-y-4" : "border-white/5"
                } ${w.rank === 2 ? "order-2 lg:order-1" : w.rank === 1 ? "order-1 lg:order-2" : "order-3"}`}
              >
                {isWinner && (
                  <span className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-pop-gold text-pop-black text-[10px] font-black uppercase tracking-[0.2em] rounded-full shadow-lg">
                    Líder Actual
                  </span>
                )}
                <div
                  className={`w-20 h-20 lg:w-24 lg:h-24 rounded-full flex items-center justify-center font-black text-2xl lg:text-3xl border-4 mb-6 ${
                    w.rank === 1 ? "border-pop-gold text-pop-gold" : w.rank === 2 ? "border-gray-400 text-white" : "border-pop-orange text-pop-orange"
                  }`}
                >
                  {w.initials}
                </div>
                <h3 className="text-xl lg:text-2xl font-black text-white uppercase font-epilogue leading-none">{w.name}</h3>
                <p className="text-4xl lg:text-5xl font-black text-pop-gold mt-4 tracking-tighter font-epilogue">{w.totalPoints.toLocaleString()}</p>
                <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] mt-1">Puntos Acumulados</p>
                <div className="grid grid-cols-2 gap-8 mt-8 pt-8 border-t border-white/5 w-full">
                  <div>
                    <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest">Órdenes</p>
                    <p className="text-lg font-black text-white">{w.ordersServed}</p>
                  </div>
                  <div>
                    <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest">Rating</p>
                    <p className="text-lg font-black text-pop-gold flex items-center justify-center gap-1">
                      {w.avgRating}{" "}
                      <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                        star
                      </span>
                    </p>
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      )}

      <h2 className="text-xs font-black text-gray-500 uppercase tracking-[0.3em] mb-6">Ranking del Equipo</h2>
      <div className="space-y-4">
        <div className="hidden lg:grid grid-cols-6 gap-4 px-10 py-5 bg-white/[0.02] text-[10px] font-black uppercase text-gray-400 tracking-widest border-b border-white/5">
          <div># Posición</div>
          <div className="col-span-2">Nombre / Estado</div>
          <div>Cócteles</div>
          <div>Otros Puntos</div>
          <div className="text-right">Total / Acciones</div>
        </div>

        {waiters.map((w) => (
          <article
            key={w.id}
            className="bg-[#1C1B1B] lg:bg-transparent rounded-2xl lg:rounded-none p-5 lg:p-0 border border-white/5 lg:border-none lg:grid lg:grid-cols-6 lg:gap-4 lg:px-10 lg:py-6 lg:items-center hover:bg-white/[0.02] transition-all"
          >
            <div className="flex items-center justify-between lg:block mb-4 lg:mb-0">
              <span className={`w-8 h-8 lg:w-10 lg:h-10 rounded-full flex items-center justify-center font-black text-xs ${getRankBadge(w.rank)}`}>
                {w.rank}
              </span>
              <div className="lg:hidden">{getStatusBadge(w.status)}</div>
            </div>

            <div className="lg:col-span-2 flex items-center gap-4 mb-6 lg:mb-0">
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center font-black text-xs text-gray-400 border border-white/10">
                {w.initials}
              </div>
              <div>
                <p className="text-base lg:text-sm font-black text-white uppercase">{w.name}</p>
                <div className="hidden lg:block mt-2">{getStatusBadge(w.status)}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 lg:block gap-4 mb-6 lg:mb-0 pt-6 border-t lg:border-none border-white/5">
              <div>
                <p className="lg:hidden text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">Cócteles</p>
                <p className="text-sm font-black text-white font-mono">
                  {w.cocktailPoints} <span className="text-[10px] text-gray-500 font-bold ml-1">pts</span>
                </p>
              </div>
              <div className="text-right lg:text-left">
                <p className="lg:hidden text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">Premium/Combos</p>
                <p className="text-sm font-bold text-white font-mono">
                  {w.premiumPoints + w.comboPoints} <span className="text-[10px] text-gray-500 font-bold ml-1">pts</span>
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between lg:justify-end gap-3 pt-6 lg:pt-0 border-t lg:border-none border-white/5">
              <div className="lg:hidden">
                <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Total Puntos</p>
              </div>
              <p className="text-2xl lg:text-base font-black text-pop-gold font-epilogue lg:font-mono">{w.totalPoints.toLocaleString()}</p>
              <div className="flex gap-2 ml-4">
                <button
                  onClick={() => openEdit(w)}
                  className="w-8 h-8 flex items-center justify-center bg-white/5 text-pop-gold rounded-lg hover:bg-pop-gold/10"
                >
                  <span className="material-symbols-outlined text-base">edit</span>
                </button>
                <button
                  onClick={() => handleDelete(w.id)}
                  className="w-8 h-8 flex items-center justify-center bg-white/5 text-red-400 rounded-lg hover:bg-red-500/10"
                >
                  <span className="material-symbols-outlined text-base">delete</span>
                </button>
              </div>
            </div>
          </article>
        ))}
        {waiters.length === 0 && !loading && (
          <div className="text-center py-10 text-gray-500 text-xs uppercase tracking-widest">Sin meseros</div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-pop-black/95 backdrop-blur-xl" onClick={closeModal} />
          <div className="relative bg-[#1C1B1B] border border-white/10 w-full max-w-xl rounded-3xl overflow-hidden shadow-2xl">
            <header className="p-8 lg:p-10 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
              <div>
                <h2 className="text-2xl font-black text-white uppercase font-epilogue tracking-tighter">
                  {editingWaiter ? "Editar Mesero" : "Nuevo Mesero"}
                </h2>
                <p className="text-[10px] text-pop-orange font-bold uppercase tracking-widest mt-1">Datos del Staff</p>
              </div>
              <button
                onClick={closeModal}
                className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center text-gray-500 hover:text-white transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </header>
            <div className="p-8 lg:p-10 space-y-6 max-h-[60vh] overflow-y-auto no-scrollbar">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-gray-500">Nombre</label>
                  <input
                    type="text"
                    value={form.name || ""}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full bg-pop-black border border-white/10 rounded-xl p-4 text-white focus:border-pop-gold outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-gray-500">Iniciales</label>
                  <input
                    type="text"
                    value={form.initials || ""}
                    onChange={(e) => setForm({ ...form, initials: e.target.value })}
                    className="w-full bg-pop-black border border-white/10 rounded-xl p-4 text-white focus:border-pop-gold outline-none"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-gray-500">Estado</label>
                <select
                  value={form.status || "activo"}
                  onChange={(e) => setForm({ ...form, status: e.target.value as any })}
                  className="w-full bg-pop-black border border-white/10 rounded-xl p-4 text-white focus:border-pop-gold outline-none"
                >
                  <option value="activo">Activo</option>
                  <option value="inactivo">Inactivo</option>
                  <option value="descanso">Descanso</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-gray-500">Cócteles Pts</label>
                  <input
                    type="number"
                    value={form.cocktailPoints || 0}
                    onChange={(e) => setForm({ ...form, cocktailPoints: Number(e.target.value) })}
                    className="w-full bg-pop-black border border-white/10 rounded-xl p-4 text-white focus:border-pop-gold outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-gray-500">Premium Pts</label>
                  <input
                    type="number"
                    value={form.premiumPoints || 0}
                    onChange={(e) => setForm({ ...form, premiumPoints: Number(e.target.value) })}
                    className="w-full bg-pop-black border border-white/10 rounded-xl p-4 text-white focus:border-pop-gold outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-gray-500">Pitcher Pts</label>
                  <input
                    type="number"
                    value={form.pitcherPoints || 0}
                    onChange={(e) => setForm({ ...form, pitcherPoints: Number(e.target.value) })}
                    className="w-full bg-pop-black border border-white/10 rounded-xl p-4 text-white focus:border-pop-gold outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-gray-500">Botella Pts</label>
                  <input
                    type="number"
                    value={form.bottlePoints || 0}
                    onChange={(e) => setForm({ ...form, bottlePoints: Number(e.target.value) })}
                    className="w-full bg-pop-black border border-white/10 rounded-xl p-4 text-white focus:border-pop-gold outline-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-gray-500">Combo Pts</label>
                  <input
                    type="number"
                    value={form.comboPoints || 0}
                    onChange={(e) => setForm({ ...form, comboPoints: Number(e.target.value) })}
                    className="w-full bg-pop-black border border-white/10 rounded-xl p-4 text-white focus:border-pop-gold outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-gray-500">Upsell Pts</label>
                  <input
                    type="number"
                    value={form.upsellPoints || 0}
                    onChange={(e) => setForm({ ...form, upsellPoints: Number(e.target.value) })}
                    className="w-full bg-pop-black border border-white/10 rounded-xl p-4 text-white focus:border-pop-gold outline-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-gray-500">Rating Pts</label>
                  <input
                    type="number"
                    value={form.ratingPoints || 0}
                    onChange={(e) => setForm({ ...form, ratingPoints: Number(e.target.value) })}
                    className="w-full bg-pop-black border border-white/10 rounded-xl p-4 text-white focus:border-pop-gold outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-gray-500">Órdenes Servidas</label>
                  <input
                    type="number"
                    value={form.ordersServed || 0}
                    onChange={(e) => setForm({ ...form, ordersServed: Number(e.target.value) })}
                    className="w-full bg-pop-black border border-white/10 rounded-xl p-4 text-white focus:border-pop-gold outline-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-gray-500">Rating Promedio</label>
                  <input
                    type="number"
                    step="0.1"
                    value={form.avgRating || 0}
                    onChange={(e) => setForm({ ...form, avgRating: Number(e.target.value) })}
                    className="w-full bg-pop-black border border-white/10 rounded-xl p-4 text-white focus:border-pop-gold outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-gray-500">Ventas Totales</label>
                  <input
                    type="number"
                    value={form.totalSales || 0}
                    onChange={(e) => setForm({ ...form, totalSales: Number(e.target.value) })}
                    className="w-full bg-pop-black border border-white/10 rounded-xl p-4 text-white focus:border-pop-gold outline-none"
                  />
                </div>
              </div>
            </div>
            <footer className="p-8 lg:p-10 border-t border-white/5 flex gap-4">
              <button onClick={closeModal} className="flex-1 py-4 text-xs font-black text-gray-500 uppercase tracking-widest">
                Descartar
              </button>
              <button
                onClick={handleSubmit}
                className="flex-[2] py-5 bg-pop-gold text-pop-black text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-pop-lightGold shadow-xl"
              >
                Guardar Cambios
              </button>
            </footer>
          </div>
        </div>
      )}
    </main>
  );
}
