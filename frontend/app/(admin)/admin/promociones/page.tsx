"use client";

import { useState } from "react";

// Types
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

interface PromoStats {
  label: string;
  value: string;
  icon: string;
  color: string;
  sublabel: string;
}

export default function AdminPromocionesPage() {
  const [filterStatus, setFilterStatus] = useState("todas");
  const [showCreateModal, setShowCreateModal] = useState(false);

  const stats: PromoStats[] = [
    { label: "Promociones Activas", value: "8", icon: "local_offer", color: "pop-gold", sublabel: "De 12 totales" },
    { label: "Redenciones del Mes", value: "1,240", icon: "redeem", color: "pop-orange", sublabel: "+18% vs mes anterior" },
    { label: "Ingreso por Promos", value: "$68,500", icon: "payments", color: "pop-light-gold", sublabel: "ROI: 3.2x" },
    { label: "Próximas a Expirar", value: "3", icon: "schedule", color: "error", sublabel: "Esta semana" },
  ];

  const promos: Promo[] = [
    {
      id: "PROMO-001",
      name: "Happy Hour Margaritas",
      description: "2x1 en margaritas de 14:00 a 17:00",
      type: "happy_hour",
      discount: "2x1",
      startDate: "2024-04-01",
      endDate: "2024-04-30",
      daysActive: "Lun-Vie",
      status: "activa",
      redemptions: 342,
      target: 500,
      revenue: "$37,620",
      image: "https://images.unsplash.com/photo-1544145945-f9043585543f?w=200&h=150&fit=crop",
      imageAlt: "Margaritas",
    },
    {
      id: "PROMO-002",
      name: "Combo Familiar POP",
      description: "2 rolls + 1 orden de wings + 4 bebidas",
      type: "combo",
      discount: "20%",
      startDate: "2024-04-01",
      endDate: "2024-05-31",
      daysActive: "Sáb-Dom",
      status: "activa",
      redemptions: 186,
      target: 300,
      revenue: "$28,400",
      image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=200&h=150&fit=crop",
      imageAlt: "Combo familiar",
    },
    {
      id: "PROMO-003",
      name: "Martes de Sushi",
      description: "30% de descuento en todos los rolls",
      type: "descuento",
      discount: "30%",
      startDate: "2024-04-02",
      endDate: "2024-06-30",
      daysActive: "Mar",
      status: "activa",
      redemptions: 245,
      target: 400,
      revenue: "$15,800",
      image: "https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=200&h=150&fit=crop",
      imageAlt: "Sushi",
    },
    {
      id: "PROMO-004",
      name: "Wings 2x1 Jueves",
      description: "Orden de wings 2x1 todos los jueves",
      type: "2x1",
      discount: "2x1",
      startDate: "2024-04-04",
      endDate: "2024-04-25",
      daysActive: "Jue",
      status: "expirada",
      redemptions: 298,
      target: 300,
      revenue: "$12,300",
      image: "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=200&h=150&fit=crop",
      imageAlt: "Wings",
    },
    {
      id: "PROMO-005",
      name: "Noche de Crepes",
      description: "Crepe de postre gratis con consumo mayor a $300",
      type: "evento",
      discount: "Gratis",
      startDate: "2024-04-15",
      endDate: "2024-04-20",
      daysActive: "Vie-Sáb",
      status: "proxima",
      redemptions: 0,
      target: 100,
      revenue: "$0",
      image: "https://images.unsplash.com/photo-1519676867240-f9043585543f?w=200&h=150&fit=crop",
      imageAlt: "Crepes",
    },
    {
      id: "PROMO-006",
      name: "Descuento Cumpleañero",
      description: "15% de descuento + bebida gratis el día de tu cumpleaños",
      type: "descuento",
      discount: "15%",
      startDate: "2024-01-01",
      endDate: "2024-12-31",
      daysActive: "Todos",
      status: "activa",
      redemptions: 89,
      target: 200,
      revenue: "$8,900",
      image: "https://images.unsplash.com/photo-1533134242116-79c5e60818a7?w=200&h=150&fit=crop",
      imageAlt: "Cumpleaños",
    },
    {
      id: "PROMO-007",
      name: "Pitchers al Atardecer",
      description: "20% en pitchers de 18:00 a 20:00",
      type: "descuento",
      discount: "20%",
      startDate: "2024-04-10",
      endDate: "2024-05-10",
      daysActive: "Todos",
      status: "pausada",
      redemptions: 80,
      target: 150,
      revenue: "$4,480",
      image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=200&h=150&fit=crop",
      imageAlt: "Pitchers",
    },
  ];

  const filteredPromos = promos.filter((p) => {
    if (filterStatus === "todas") return true;
    return p.status === filterStatus;
  });

  const getStatusBadge = (status: Promo["status"]) => {
    const styles = {
      activa: "bg-pop-gold/10 text-pop-gold",
      proxima: "bg-blue-500/10 text-blue-400",
      expirada: "bg-error/10 text-error",
      pausada: "bg-gray-600/10 text-gray-400",
    };
    const labels = {
      activa: "Activa",
      proxima: "Próxima",
      expirada: "Expirada",
      pausada: "Pausada",
    };
    return (
      <span className={`text-[10px] font-bold px-2.5 py-1 rounded uppercase tracking-wider ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const getTypeBadge = (type: Promo["type"]) => {
    const labels = {
      descuento: "Descuento",
      "2x1": "2x1",
      combo: "Combo",
      happy_hour: "Happy Hour",
      evento: "Evento",
    };
    return (
      <span className="bg-gray-800 px-2.5 py-1 text-xs font-medium text-gray-300 rounded-md">
        {labels[type]}
      </span>
    );
  };

  return (
    <main className="pt-24 lg:pt-20 p-4 lg:p-10 min-h-screen bg-pop-black">
      {/* Header */}
      <header className="mb-8 lg:mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-4xl lg:text-5xl font-black tracking-tighter text-white font-epilogue uppercase">
            Promociones
          </h1>
          <p className="text-gray-400 mt-2 text-base lg:text-lg font-manrope">
            Gestiona ofertas, descuentos y eventos especiales
          </p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2.5 text-sm font-semibold text-pop-gold border border-pop-gold/30 rounded-lg hover:bg-pop-gold/10 transition-all duration-200 flex items-center gap-2">
            <span className="material-symbols-outlined text-lg">calendar_month</span>
            Calendario
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-5 py-2.5 text-sm font-semibold text-pop-black bg-pop-gold rounded-lg hover:bg-pop-light-gold transition-all duration-200 flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-lg">add_circle</span>
            Nueva Promo
          </button>
        </div>
      </header>

      {/* Stats Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-10" aria-label="Estadísticas de promociones">
        {stats.map((stat, index) => (
          <article
            key={index}
            className="bg-[#1C1B1B] backdrop-blur-sm rounded-xl p-6 border-l-4 border-pop-gold hover:border-pop-orange transition-all duration-500 hover:shadow-[0_0_30px_rgba(217,103,37,0.05)] group"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 rounded-lg bg-white/5 group-hover:bg-pop-gold/10 transition-colors">
                <span className="material-symbols-outlined text-pop-gold text-3xl transition-transform group-hover:scale-110">
                  {stat.icon}
                </span>
              </div>
              <span className="text-[10px] font-bold text-pop-gold bg-pop-gold/10 px-3 py-1 rounded-full uppercase tracking-widest">
                {stat.sublabel}
              </span>
            </div>
            <h3 className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold mb-2">
              {stat.label}
            </h3>
            <p className="text-3xl font-black text-white tracking-tighter font-epilogue">{stat.value}</p>
          </article>
        ))}
      </section>

      {/* Weekly Calendar Visual */}
      <section className="bg-[#1C1B1B] backdrop-blur-sm rounded-xl p-6 lg:p-8 border border-white/5 mb-8">
        <h2 className="text-xl font-black uppercase font-epilogue tracking-tighter text-white mb-6">
          Calendario Semanal de Promociones
        </h2>
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
                day.active
                  ? "bg-pop-gold/5 border-pop-gold/20 hover:bg-pop-gold/10"
                  : "bg-gray-800/30 border-gray-700/30 opacity-60"
              }`}
            >
              <p className="text-xs font-bold text-pop-gold uppercase tracking-wider mb-3">{day.day}</p>
              <div className="space-y-1.5">
                {day.promos.map((promo, pIdx) => (
                  <span
                    key={pIdx}
                    className="block text-[10px] bg-pop-orange/10 text-pop-orange px-2 py-1 rounded font-medium truncate"
                  >
                    {promo}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="flex flex-wrap gap-2 mb-6">
        {["todas", "activa", "proxima", "pausada", "expirada"].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all duration-200 ${
              filterStatus === status
                ? "bg-pop-gold text-pop-black"
                : "bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-700/50"
            }`}
          >
            {status === "todas" ? "Todas" : status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </section>

      {/* Promos Table */}
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
                <th className="pb-4 text-left font-medium">Ingreso</th>
                <th className="pb-4 text-left font-medium">Estado</th>
                <th className="pb-4 text-right font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {filteredPromos.map((promo, index) => {
                const progressPercent = promo.target > 0 ? Math.round((promo.redemptions / promo.target) * 100) : 0;
                return (
                  <tr key={index} className="hover:bg-gray-800/30 transition-colors duration-200">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-gray-800">
                          <img
                            className="w-full h-full object-cover"
                            src={promo.image}
                            alt={promo.imageAlt}
                            loading="lazy"
                          />
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
                    <td className="py-4 font-mono font-semibold text-white text-sm">{promo.revenue}</td>
                    <td className="py-4">{getStatusBadge(promo.status)}</td>
                    <td className="py-4 text-right">
                      <div className="flex justify-end gap-1">
                        <button className="p-1.5 hover:bg-pop-gold/10 rounded transition-colors" title="Editar">
                          <span className="material-symbols-outlined text-pop-gold text-lg">edit</span>
                        </button>
                        <button className="p-1.5 hover:bg-pop-gold/10 rounded transition-colors" title="Duplicar">
                          <span className="material-symbols-outlined text-gray-400 text-lg">content_copy</span>
                        </button>
                        <button className="p-1.5 hover:bg-error/10 rounded transition-colors" title="Eliminar">
                          <span className="material-symbols-outlined text-error text-lg">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Create Promo Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowCreateModal(false)}>
          <div className="bg-[#1C1B1B] border border-white/10 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-white/5 flex justify-between items-center">
              <h2 className="text-2xl font-black uppercase font-epilogue tracking-tighter text-white">
                Crear Promoción
              </h2>
              <button onClick={() => setShowCreateModal(false)} className="text-gray-500 hover:text-white transition-colors">
                <span className="material-symbols-outlined text-2xl">close</span>
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <label className="text-[10px] uppercase font-bold text-gray-500 block mb-2">Nombre de la Promoción</label>
                <input
                  type="text"
                  placeholder="Ej: Happy Hour Margaritas"
                  className="w-full bg-gray-800/50 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-pop-gold/50 transition-all"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-500 block mb-2">Tipo de Promoción</label>
                  <select className="w-full bg-gray-800/50 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-pop-gold/50 transition-all">
                    <option value="">Seleccionar tipo</option>
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
                    placeholder="Ej: 20%, 2x1, Gratis"
                    className="w-full bg-gray-800/50 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-pop-gold/50 transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-gray-500 block mb-2">Descripción</label>
                <textarea
                  rows={3}
                  placeholder="Describe los detalles de la promoción..."
                  className="w-full bg-gray-800/50 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-pop-gold/50 transition-all resize-none"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-500 block mb-2">Fecha de Inicio</label>
                  <input
                    type="date"
                    className="w-full bg-gray-800/50 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-pop-gold/50 transition-all"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-500 block mb-2">Fecha de Fin</label>
                  <input
                    type="date"
                    className="w-full bg-gray-800/50 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-pop-gold/50 transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-gray-500 block mb-2">Días Activos</label>
                <div className="flex flex-wrap gap-2">
                  {["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map((day) => (
                    <label key={day} className="flex items-center gap-2 bg-gray-800/50 px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-700/50 transition-colors">
                      <input type="checkbox" className="accent-pop-gold w-4 h-4" />
                      <span className="text-xs font-bold text-gray-300">{day}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-500 block mb-2">Meta de Redenciones</label>
                  <input
                    type="number"
                    placeholder="Ej: 500"
                    className="w-full bg-gray-800/50 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-pop-gold/50 transition-all"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-500 block mb-2">URL de Imagen (opcional)</label>
                  <input
                    type="text"
                    placeholder="https://..."
                    className="w-full bg-gray-800/50 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-pop-gold/50 transition-all"
                  />
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-white/5 flex justify-end gap-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-6 py-2.5 text-sm font-semibold text-gray-400 border border-gray-700 rounded-lg hover:bg-gray-800/50 transition-all"
              >
                Cancelar
              </button>
              <button className="px-6 py-2.5 text-sm font-semibold text-pop-black bg-pop-gold rounded-lg hover:bg-pop-light-gold transition-all">
                Crear Promoción
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
