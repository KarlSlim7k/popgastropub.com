"use client";

import { useState, useEffect } from "react";
import { fetchWithAuth } from "@/lib/api";
import { getAuthSession } from "@/lib/auth-session";

interface Promo {
  id: string;
  name: string;
  description: string;
  type: "descuento" | "2x1" | "combo" | "happy_hour" | "evento";
  discount: string;
  startDate: string;
  endDate: string;
  daysActive: string;
  status: "activa" | "proxima" | "expirada" | "pausada";
  redemptions: number;
  target: number;
  revenue: string;
  image: string;
  imageAlt: string;
}

export default function AdminPromocionesPage() {
  const [filterStatus, setFilterStatus] = useState("todas");
  const [showModal, setShowModal] = useState(false);
  const [editingPromo, setEditingPromo] = useState<Promo | null>(null);
  const [promos, setPromos] = useState<Promo[]>([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState<Partial<Promo>>({
    name: "",
    description: "",
    type: "descuento",
    discount: "",
    startDate: "",
    endDate: "",
    daysActive: "",
    status: "activa",
    target: 0,
    image: "",
  });

  const fetchPromos = async () => {
    const session = getAuthSession();
    if (!session) return;
    setLoading(true);
    try {
      const data = await fetchWithAuth<Promo[]>("/api/admin/promociones", session.token);
      setPromos(data);
    } catch {
      // error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPromos();
  }, []);

  const openCreate = () => {
    setEditingPromo(null);
    setForm({ name: "", description: "", type: "descuento", discount: "", startDate: "", endDate: "", daysActive: "", status: "activa", target: 0, image: "" });
    setShowModal(true);
  };

  const openEdit = (promo: Promo) => {
    setEditingPromo(promo);
    setForm({ ...promo });
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

  const handleSubmit = async () => {
    const session = getAuthSession();
    if (!session) return;
    const body = JSON.stringify(form);
    try {
      if (editingPromo) {
        await fetchWithAuth(`/api/admin/promociones/${editingPromo.id}`, session.token, { method: "PUT", body });
      } else {
        await fetchWithAuth("/api/admin/promociones", session.token, { method: "POST", body });
      }
      closeModal();
      fetchPromos();
    } catch {
      alert("Error al guardar promoción");
    }
  };

  const handleDelete = async (id: string) => {
    const session = getAuthSession();
    if (!session) return;
    if (!confirm("¿Eliminar esta promoción?")) return;
    try {
      await fetchWithAuth(`/api/admin/promociones/${id}`, session.token, { method: "DELETE" });
      fetchPromos();
    } catch {
      alert("Error al eliminar");
    }
  };

  const filteredPromos = promos.filter((p) => {
    if (filterStatus === "todas") return true;
    return p.status === filterStatus;
  });

  const getStatusBadge = (status: Promo["status"]) => {
    const styles = {
      activa: "bg-pop-gold/10 text-pop-gold",
      proxima: "bg-blue-500/10 text-blue-400",
      expirada: "bg-red-500/10 text-red-500",
      pausada: "bg-gray-600/10 text-gray-400",
    };
    const labels = { activa: "Activa", proxima: "Próxima", expirada: "Expirada", pausada: "Pausada" };
    return (
      <span className={`text-[10px] font-bold px-2.5 py-1 rounded uppercase tracking-wider ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const getTypeBadge = (type: Promo["type"]) => {
    const labels = { descuento: "Descuento", "2x1": "2x1", combo: "Combo", happy_hour: "Happy Hour", evento: "Evento" };
    return <span className="bg-gray-800 px-2.5 py-1 text-xs font-medium text-gray-300 rounded-md">{labels[type]}</span>;
  };

  const activeCount = promos.filter((p) => p.status === "activa").length;
  const totalRedemptions = promos.reduce((acc, p) => acc + (p.redemptions || 0), 0);

  return (
    <main className="pt-24 lg:pt-20 p-4 lg:p-10 min-h-screen bg-pop-black">
      <header className="mb-8 lg:mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-4xl lg:text-5xl font-black tracking-tighter text-white font-epilogue uppercase">
            Promociones
          </h1>
          <p className="text-gray-400 mt-2 text-base lg:text-lg font-manrope">Gestiona ofertas, descuentos y eventos especiales</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={openCreate}
            className="px-5 py-2.5 text-sm font-semibold text-pop-black bg-pop-gold rounded-lg hover:bg-pop-light-gold transition-all duration-200 flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-lg">add_circle</span>
            Nueva Promo
          </button>
        </div>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-10" aria-label="Estadísticas de promociones">
        {[
          { label: "Promociones Activas", value: String(activeCount), icon: "local_offer", color: "pop-gold", sublabel: `De ${promos.length} totales` },
          { label: "Redenciones del Mes", value: totalRedemptions.toLocaleString(), icon: "redeem", color: "pop-orange", sublabel: "Acumulado" },
          { label: "Ingreso por Promos", value: "$0", icon: "payments", color: "pop-light-gold", sublabel: "ROI: -" },
          { label: "Próximas a Expirar", value: String(promos.filter((p) => p.status === "proxima").length), icon: "schedule", color: "error", sublabel: "Esta semana" },
        ].map((stat, index) => (
          <article
            key={index}
            className="bg-[#1C1B1B] backdrop-blur-sm rounded-xl p-6 border-l-4 border-pop-gold hover:border-pop-orange transition-all duration-500 hover:shadow-[0_0_30px_rgba(217,103,37,0.05)] group"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 rounded-lg bg-white/5 group-hover:bg-pop-gold/10 transition-colors">
                <span className="material-symbols-outlined text-pop-gold text-3xl transition-transform group-hover:scale-110">{stat.icon}</span>
              </div>
              <span className="text-[10px] font-bold text-pop-gold bg-pop-gold/10 px-3 py-1 rounded-full uppercase tracking-widest">{stat.sublabel}</span>
            </div>
            <h3 className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold mb-2">{stat.label}</h3>
            <p className="text-3xl font-black text-white tracking-tighter font-epilogue">{stat.value}</p>
          </article>
        ))}
      </section>

      <section className="bg-[#1C1B1B] backdrop-blur-sm rounded-xl p-6 lg:p-8 border border-white/5 mb-8">
        <h2 className="text-xl font-black uppercase font-epilogue tracking-tighter text-white mb-6">Calendario Semanal de Promociones</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {[
            { day: "Lun", promos: ["Happy Hour"], active: true },
            { day: "Mar", promos: ["Sushi -30%"], active: true },
            { day: "Mié", promos: ["Happy Hour"], active: true },
            { day: "Jue", promos: ["Wings 2x1"], active: false },
            { day: "Vie", promos: ["Happy Hour", "Combo"], active: true },
            { day: "Sáb", promos: ["Combo", "Crepe"], active: true },
            { day: "Dom", promos: ["Cumpleañero"], active: true },
          ].map((day, idx) => (
            <div
              key={idx}
              className={`rounded-xl p-4 border transition-all ${
                day.active ? "bg-pop-gold/5 border-pop-gold/20 hover:bg-pop-gold/10" : "bg-gray-800/30 border-gray-700/30 opacity-60"
              }`}
            >
              <p className="text-xs font-bold text-pop-gold uppercase tracking-wider mb-3">{day.day}</p>
              <div className="space-y-1.5">
                {day.promos.map((promo, pIdx) => (
                  <span key={pIdx} className="block text-[10px] bg-pop-orange/10 text-pop-orange px-2 py-1 rounded font-medium truncate">{promo}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-wrap gap-2 mb-6">
        {["todas", "activa", "proxima", "pausada", "expirada"].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all duration-200 ${
              filterStatus === status ? "bg-pop-gold text-pop-black" : "bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-700/50"
            }`}
          >
            {status === "todas" ? "Todas" : status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </section>

      <section className="bg-[#1C1B1B] backdrop-blur-sm rounded-xl border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full" role="table">
            <thead>
              <tr className="border-b border-gray-800 text-xs uppercase tracking-wider text-gray-500">
                <th className="pb-4 px-6 text-left font-medium">Promoción</th>
                <th className="pb-4 text-left font-medium">Tipo</th>
                <th className="pb-4 text-left font-medium">Descuento</th>
                <th className="pb-4 text-left font-medium">Vigencia</th>
                <th className="pb-4 text-left font-medium">Días</th>
                <th className="pb-4 text-left font-medium">Progreso</th>
                <th className="pb-4 text-left font-medium">Estado</th>
                <th className="pb-4 text-right font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {filteredPromos.map((promo) => {
                const progressPercent = promo.target > 0 ? Math.round((promo.redemptions / promo.target) * 100) : 0;
                return (
                  <tr key={promo.id} className="hover:bg-gray-800/30 transition-colors duration-200">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-gray-800">
                          <img className="w-full h-full object-cover" src={promo.image} alt={promo.imageAlt || promo.name} loading="lazy" />
                        </div>
                        <div>
                          <p className="font-semibold text-white text-sm">{promo.name}</p>
                          <p className="text-[10px] text-gray-500 mt-0.5 truncate max-w-[200px]">{promo.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4">{getTypeBadge(promo.type)}</td>
                    <td className="py-4 font-mono font-bold text-pop-gold text-sm">{promo.discount}</td>
                    <td className="py-4 text-xs text-gray-400">
                      <p>{promo.startDate}</p>
                      <p className="text-gray-600">{promo.endDate}</p>
                    </td>
                    <td className="py-4 text-xs text-gray-300 font-medium">{promo.daysActive}</td>
                    <td className="py-4">
                      <div className="w-24">
                        <div className="flex justify-between text-[10px] text-gray-500 mb-1">
                          <span>{promo.redemptions}</span>
                          <span>{promo.target}</span>
                        </div>
                        <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${progressPercent >= 80 ? "bg-pop-gold" : progressPercent >= 50 ? "bg-pop-light-gold" : "bg-pop-orange"}`}
                            style={{ width: `${progressPercent}%` }}
                          />
                        </div>
                        <p className="text-[10px] text-gray-500 mt-1">{progressPercent}%</p>
                      </div>
                    </td>
                    <td className="py-4">{getStatusBadge(promo.status)}</td>
                    <td className="py-4 text-right">
                      <div className="flex justify-end gap-1">
                        <button onClick={() => openEdit(promo)} className="p-1.5 hover:bg-pop-gold/10 rounded transition-colors" title="Editar">
                          <span className="material-symbols-outlined text-pop-gold text-lg">edit</span>
                        </button>
                        <button onClick={() => handleDelete(promo.id)} className="p-1.5 hover:bg-error/10 rounded transition-colors" title="Eliminar">
                          <span className="material-symbols-outlined text-error text-lg">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredPromos.length === 0 && !loading && (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-gray-500 text-xs uppercase tracking-widest">
                    Sin promociones
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={closeModal}>
          <div className="bg-[#1C1B1B] border border-white/10 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-white/5 flex justify-between items-center">
              <h2 className="text-2xl font-black uppercase font-epilogue tracking-tighter text-white">
                {editingPromo ? "Editar Promoción" : "Crear Promoción"}
              </h2>
              <button onClick={closeModal} className="text-gray-500 hover:text-white transition-colors">
                <span className="material-symbols-outlined text-2xl">close</span>
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <label className="text-[10px] uppercase font-bold text-gray-500 block mb-2">Nombre de la Promoción</label>
                <input
                  type="text"
                  value={form.name || ""}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Ej: Happy Hour Margaritas"
                  className="w-full bg-gray-800/50 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-pop-gold/50 transition-all"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-500 block mb-2">Tipo de Promoción</label>
                  <select
                    value={form.type || "descuento"}
                    onChange={(e) => setForm({ ...form, type: e.target.value as any })}
                    className="w-full bg-gray-800/50 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-pop-gold/50 transition-all"
                  >
                    <option value="descuento">Descuento</option>
                    <option value="2x1">2x1</option>
                    <option value="combo">Combo</option>
                    <option value="happy_hour">Happy Hour</option>
                    <option value="evento">Evento Especial</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-500 block mb-2">Descuento / Beneficio</label>
                  <input
                    type="text"
                    value={form.discount || ""}
                    onChange={(e) => setForm({ ...form, discount: e.target.value })}
                    placeholder="Ej: 20%, 2x1, Gratis"
                    className="w-full bg-gray-800/50 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-pop-gold/50 transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-gray-500 block mb-2">Descripción</label>
                <textarea
                  rows={3}
                  value={form.description || ""}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Describe los detalles de la promoción..."
                  className="w-full bg-gray-800/50 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-pop-gold/50 transition-all resize-none"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-500 block mb-2">Fecha de Inicio</label>
                  <input
                    type="date"
                    value={form.startDate || ""}
                    onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                    className="w-full bg-gray-800/50 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-pop-gold/50 transition-all"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-500 block mb-2">Fecha de Fin</label>
                  <input
                    type="date"
                    value={form.endDate || ""}
                    onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                    className="w-full bg-gray-800/50 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-pop-gold/50 transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-gray-500 block mb-2">Días Activos</label>
                <input
                  type="text"
                  value={form.daysActive || ""}
                  onChange={(e) => setForm({ ...form, daysActive: e.target.value })}
                  placeholder="Ej: Lun-Vie, Todos"
                  className="w-full bg-gray-800/50 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-pop-gold/50 transition-all"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-500 block mb-2">Meta de Redenciones</label>
                  <input
                    type="number"
                    value={form.target || 0}
                    onChange={(e) => setForm({ ...form, target: Number(e.target.value) })}
                    placeholder="Ej: 500"
                    className="w-full bg-gray-800/50 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-pop-gold/50 transition-all"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-500 block mb-2">URL de Imagen (opcional)</label>
                  <input
                    type="text"
                    value={form.image || ""}
                    onChange={(e) => setForm({ ...form, image: e.target.value })}
                    placeholder="https://..."
                    className="w-full bg-gray-800/50 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-pop-gold/50 transition-all"
                  />
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-white/5 flex justify-end gap-3">
              <button onClick={closeModal} className="px-6 py-2.5 text-sm font-semibold text-gray-400 border border-gray-700 rounded-lg hover:bg-gray-800/50 transition-all">
                Cancelar
              </button>
              <button
                onClick={handleSubmit}
                className="px-6 py-2.5 text-sm font-semibold text-pop-black bg-pop-gold rounded-lg hover:bg-pop-light-gold transition-all"
              >
                {editingPromo ? "Guardar Cambios" : "Crear Promoción"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
