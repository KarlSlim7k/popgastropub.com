"use client";

import { useAuth } from "@/lib/auth-provider";
import { fetchWithAuth } from "@/lib/api";
import { useState, useEffect, useCallback } from "react";

interface Reserva {
  id: number | string;
  fecha: string;
  hora: string;
  personas: number;
  estado: string;
  nombre?: string;
  telefono?: string;
  notas?: string;
  ubicacion?: string;
  created_at?: string;
}

export default function ReservasPage() {
  const { session } = useAuth();
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [form, setForm] = useState({
    nombre: "",
    telefono: "",
    fecha: "",
    hora: "",
    personas: "2",
    notas: "",
  });

  const token = session?.token ?? "";

  const fetchReservas = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchWithAuth<{ data?: Reserva[]; reservas?: Reserva[] }>(
        "/api/reservas",
        token
      );
      const list = Array.isArray(data) ? data : data.data ?? data.reservas ?? [];
      setReservas(list);
    } catch (err: any) {
      setError(err?.message || "No se pudieron cargar las reservas");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (session?.user) {
      const u = session.user as any;
      setForm((prev) => ({
        ...prev,
        nombre: u.nombre || u.name || "",
        telefono: u.telefono || u.phone || "",
      }));
    }
  }, [session]);

  useEffect(() => {
    fetchReservas();
  }, [fetchReservas]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setSubmitting(true);
    try {
      await fetchWithAuth("/api/reservas", token, {
        method: "POST",
        body: JSON.stringify({
          nombre: form.nombre,
          telefono: form.telefono,
          fecha: form.fecha,
          hora: form.hora,
          personas: Number(form.personas),
          notas: form.notas || undefined,
        }),
      });
      setShowModal(false);
      const u = session?.user as any;
      setForm({
        nombre: u?.nombre || u?.name || "",
        telefono: u?.telefono || u?.phone || "",
        fecha: "",
        hora: "",
        personas: "2",
        notas: "",
      });
      setToast("Reservación creada exitosamente");
      await fetchReservas();
    } catch (err: any) {
      setToast(err?.message || "Error al crear la reservación");
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (fecha: string) => {
    try {
      const d = new Date(fecha);
      if (isNaN(d.getTime())) return fecha;
      return d.toLocaleDateString("es-MX", {
        weekday: "long",
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return fecha;
    }
  };

  const activeReservations = reservas.filter(
    (r) => !["cancelada", "cancelado", "rechazada", "rechazado", "completada", "completado"].includes(
      (r.estado || "").toLowerCase()
    )
  );

  const pastReservations = reservas.filter(
    (r) => ["cancelada", "cancelado", "rechazada", "rechazado", "completada", "completado"].includes(
      (r.estado || "").toLowerCase()
    )
  );

  const statusClass = (estado: string) => {
    const s = (estado || "").toLowerCase();
    if (s === "confirmada" || s === "confirmado") {
      return "bg-green-500/10 text-green-500 border-green-500/20";
    }
    if (s === "pendiente") {
      return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
    }
    if (s === "cancelada" || s === "cancelado" || s === "rechazada" || s === "rechazado") {
      return "bg-red-500/10 text-red-500 border-red-500/20";
    }
    if (s === "completada" || s === "completado") {
      return "bg-pop-gold/10 text-pop-gold border-pop-gold/20";
    }
    return "bg-gray-500/10 text-gray-400 border-gray-500/20";
  };

  return (
    <main className="pt-24 lg:pt-32 p-4 lg:p-12 max-w-5xl mx-auto space-y-12">
      {/* Toast */}
      {toast && (
        <div className="fixed top-24 right-4 z-50 bg-pop-black border border-pop-gold/30 text-pop-gold px-6 py-3 rounded-xl shadow-lg text-xs font-black uppercase tracking-widest">
          {toast}
        </div>
      )}

      {/* Header */}
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
        <div>
          <h1 className="text-4xl lg:text-7xl font-black tracking-tighter text-white font-epilogue uppercase leading-none">
            Mis Reservas
          </h1>
          <p className="text-pop-orange mt-2 text-xs font-bold uppercase tracking-[0.3em]">
            Tu lugar reservado en POP Perote
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="w-full lg:w-auto px-8 py-4 bg-pop-gold text-pop-black font-black uppercase text-[10px] tracking-widest rounded-xl hover:bg-pop-lightGold shadow-lg transition-all"
        >
          Nueva Reservación
        </button>
      </header>

      {/* Active Bookings */}
      <div className="space-y-6">
        <h2 className="text-xs font-black text-gray-500 uppercase tracking-widest px-1">Próximas Visitas</h2>

        {loading ? (
          <div className="bg-[#1C1B1B] p-12 rounded-3xl border border-dashed border-white/5 text-center">
            <div className="w-8 h-8 border-2 border-pop-gold border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-gray-500 font-black uppercase text-[10px] tracking-widest mt-4">Cargando reservas...</p>
          </div>
        ) : error ? (
          <div className="bg-[#1C1B1B] p-12 rounded-3xl border border-dashed border-white/5 text-center space-y-4">
            <span className="material-symbols-outlined text-red-500 text-5xl">error</span>
            <p className="text-gray-500 font-black uppercase text-[10px] tracking-widest">{error}</p>
          </div>
        ) : activeReservations.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {activeReservations.map((res) => (
              <article key={res.id} className="bg-[#1C1B1B] rounded-3xl overflow-hidden border border-white/5 group">
                <div className="flex flex-col lg:flex-row">
                  {/* Visual Context */}
                  <div className="lg:w-1/3 h-48 lg:h-auto overflow-hidden">
                    <img
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBuJxJQ8Yov3h-rdfOh-roeN8Dr0XdASO8zeHu0GW4xfjKjjskW7777abibu0ipYE_K8YdM1H2vw8OC-gQ8IAbr-3MFjlXgmUKc0_jSMBHLMfjUj_cUcizUEUevg9XGWs-Jys5nJzBSrTqKISNwz8BR-yrbGzJ41pg-mYoHWl9r3Zl5W0RBuIBUho_pptkY3fX1UPiTegonwOl8osxZI7Xju7afX4rpA1_flW2-GbC4PNNRHwpCw_brDqYQbgXQTioe-BjVlbWal7AG"
                      alt="POP Ambiance"
                      className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000"
                    />
                  </div>

                  {/* Details */}
                  <div className="lg:w-2/3 p-8 flex flex-col justify-between gap-8">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <p className="text-pop-gold font-epilogue font-black text-2xl lg:text-3xl uppercase leading-tight">
                          {formatDate(res.fecha)}
                        </p>
                        <div className="flex items-center gap-4 text-gray-400 font-bold uppercase text-[10px] tracking-widest">
                          <span>{res.hora}</span>
                          <span className="w-1 h-1 bg-gray-600 rounded-full" />
                          <span>
                            {res.personas} {res.personas === 1 ? "Persona" : "Personas"}
                          </span>
                        </div>
                        {res.notas && (
                          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">
                            Nota: {res.notas}
                          </p>
                        )}
                      </div>
                      <span className={`border text-[9px] font-black uppercase px-3 py-1 rounded-full tracking-widest ${statusClass(res.estado)}`}>
                        {res.estado || "Pendiente"}
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-4">
                      <button
                        disabled
                        className="w-full sm:w-auto px-6 py-3 bg-white/5 text-gray-500 font-black uppercase text-[10px] tracking-widest rounded-xl border border-white/5 cursor-not-allowed"
                      >
                        Modificar Reserva
                      </button>
                      <button
                        onClick={() => setToast("Contacta al restaurante para cancelar")}
                        className="w-full sm:w-auto px-6 py-3 bg-red-500/5 text-red-500 font-black uppercase text-[10px] tracking-widest rounded-xl hover:bg-red-500/10 transition-all border border-red-500/5"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="bg-[#1C1B1B] p-12 rounded-3xl border border-dashed border-white/5 text-center space-y-4">
            <span className="material-symbols-outlined text-gray-700 text-5xl">event_busy</span>
            <p className="text-gray-500 font-black uppercase text-[10px] tracking-widest">No tienes reservaciones activas</p>
          </div>
        )}
      </div>

      {/* Past Bookings Summary */}
      <section className="bg-[#1C1B1B] p-8 lg:p-10 rounded-3xl border border-white/5">
        <h2 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-8">Historial de Visitas</h2>
        {pastReservations.length > 0 ? (
          <div className="space-y-4">
            {pastReservations.map((res) => (
              <div key={res.id} className="flex justify-between items-center py-4 border-b border-white/5 last:border-0 opacity-60">
                <div>
                  <p className="text-sm font-bold text-white uppercase tracking-tight">{formatDate(res.fecha)}</p>
                  <p className="text-[10px] text-gray-600 font-bold uppercase">
                    {res.personas} Pers · {res.estado || "Completada"}
                  </p>
                </div>
                <span className="material-symbols-outlined text-gray-700">task_alt</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 space-y-2">
            <span className="material-symbols-outlined text-gray-700 text-4xl">history</span>
            <p className="text-gray-600 font-black uppercase text-[10px] tracking-widest">Aún no tienes visitas pasadas registradas</p>
          </div>
        )}
      </section>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-pop-black/80 backdrop-blur-sm">
          <div className="bg-[#1C1B1B] rounded-3xl border border-white/10 w-full max-w-lg p-8 space-y-6 shadow-2xl">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-black text-white font-epilogue uppercase tracking-tighter">Nueva Reservación</h2>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-1">Reserva tu mesa en POP Perote</p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="material-symbols-outlined text-gray-500 hover:text-white transition-all"
              >
                close
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Nombre</label>
                  <input
                    name="nombre"
                    required
                    value={form.nombre}
                    onChange={handleChange}
                    className="w-full bg-pop-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-pop-gold transition-all"
                    placeholder="Tu nombre"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Teléfono</label>
                  <input
                    name="telefono"
                    required
                    value={form.telefono}
                    onChange={handleChange}
                    className="w-full bg-pop-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-pop-gold transition-all"
                    placeholder="282-XXX-XXXX"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Fecha</label>
                  <input
                    name="fecha"
                    type="date"
                    required
                    value={form.fecha}
                    onChange={handleChange}
                    className="w-full bg-pop-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-pop-gold transition-all"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Hora</label>
                  <input
                    name="hora"
                    type="time"
                    required
                    value={form.hora}
                    onChange={handleChange}
                    className="w-full bg-pop-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-pop-gold transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Personas</label>
                <select
                  name="personas"
                  value={form.personas}
                  onChange={handleChange}
                  className="w-full bg-pop-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-pop-gold transition-all"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 15, 20].map((n) => (
                    <option key={n} value={n}>
                      {n} {n === 1 ? "persona" : "personas"}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Notas (opcional)</label>
                <textarea
                  name="notas"
                  value={form.notas}
                  onChange={handleChange}
                  rows={3}
                  className="w-full bg-pop-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-pop-gold transition-all resize-none"
                  placeholder="Ocasión especial, alergias, preferencia de mesa..."
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 bg-pop-gold text-pop-black font-black uppercase text-[10px] tracking-widest rounded-xl hover:bg-pop-lightGold transition-all disabled:opacity-50"
                >
                  {submitting ? "Reservando..." : "Confirmar Reservación"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
