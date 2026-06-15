"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { fetchWithAuth } from "@/lib/api";
import { getAuthSession } from "@/lib/auth-session";
import { Pagination } from "@/components/ui/Pagination";

interface Mesa {
  id: number;
  numero: number;
  capacidad: number;
  activa: boolean;
}

interface Reserva {
  id: number;
  nombre: string;
  telefono?: string;
  email?: string;
  fecha: string;
  hora: string;
  personas: number;
  notas?: string;
  estado: "pendiente" | "confirmada" | "cancelada" | "completada";
  mesa_id?: number | null;
  mesa?: { id: number; numero: number } | null;
  user?: { name: string; email: string } | null;
}

interface DisponibilidadDia {
  fecha: string;
  ocupadas: number;
  libres: number;
  total: number;
}

const STATUSES = ["todos", "pendiente", "confirmada", "completada", "cancelada"] as const;

export default function AdminReservasPage() {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [mesas, setMesas] = useState<Mesa[]>([]);
  const [filter, setFilter] = useState<(typeof STATUSES)[number]>("todos");
  const [fechaFiltro, setFechaFiltro] = useState<string | null>(null);
  const [notificarEmail, setNotificarEmail] = useState(true);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ current_page: 1, last_page: 1, total: 0 });

  const [mes, setMes] = useState(() => new Date().toISOString().slice(0, 7));
  const [disponibilidad, setDisponibilidad] = useState<DisponibilidadDia[]>([]);

  const load = useCallback(async (p: number, silent = false) => {
    const session = getAuthSession();
    if (!session) return;
    if (!silent) setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(p), per_page: "20" });
      if (filter !== "todos") params.set("estado", filter);
      if (fechaFiltro) params.set("fecha", fechaFiltro);
      const data = await fetchWithAuth<any>(`/admin/reservas?${params}`, session.token);
      setReservas(Array.isArray(data) ? data : data.data ?? []);
      if (data.meta) setMeta(data.meta);
    } catch {
      if (!silent) toast.error("No se pudieron cargar las reservas");
    } finally {
      if (!silent) setLoading(false);
    }
  }, [filter, fechaFiltro]);

  const loadMesas = useCallback(async () => {
    const session = getAuthSession();
    if (!session) return;
    try {
      const data = await fetchWithAuth<Mesa[]>("/admin/mesas", session.token);
      setMesas(Array.isArray(data) ? data.filter((m) => m.activa) : []);
    } catch {
      // silent
    }
  }, []);

  const loadDisponibilidad = useCallback(async () => {
    const session = getAuthSession();
    if (!session) return;
    try {
      const data = await fetchWithAuth<DisponibilidadDia[]>(`/admin/reservas/disponibilidad?mes=${mes}`, session.token);
      setDisponibilidad(Array.isArray(data) ? data : []);
    } catch {
      // silent
    }
  }, [mes]);

  useEffect(() => { setPage(1); }, [filter, fechaFiltro]);
  useEffect(() => { load(page); }, [load, page]);
  useEffect(() => { loadMesas(); }, [loadMesas]);
  useEffect(() => { loadDisponibilidad(); }, [loadDisponibilidad]);
  useEffect(() => {
    const timer = window.setInterval(() => {
      if (document.visibilityState === "visible") load(page, true);
    }, 60_000);
    return () => window.clearInterval(timer);
  }, [load, page]);

  const updateStatus = async (id: number, estado: Reserva["estado"]) => {
    const session = getAuthSession();
    if (!session) return;
    try {
      const updated = await fetchWithAuth<Reserva>(`/admin/reservas/${id}/status`, session.token, {
        method: "PATCH",
        body: JSON.stringify({ estado, notificar: notificarEmail }),
      });
      setReservas((current) => current.map((reserva) => reserva.id === id ? { ...reserva, ...updated } : reserva));
      loadDisponibilidad();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo actualizar la reserva");
    }
  };

  const assignMesa = async (id: number, mesaId: number | null) => {
    const session = getAuthSession();
    if (!session) return;
    try {
      const updated = await fetchWithAuth<Reserva>(`/admin/reservas/${id}/status`, session.token, {
        method: "PATCH",
        body: JSON.stringify({ mesa_id: mesaId }),
      });
      setReservas((current) => current.map((reserva) => reserva.id === id ? { ...reserva, ...updated } : reserva));
      loadDisponibilidad();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo asignar la mesa");
    }
  };

  const remove = async (id: number) => {
    const session = getAuthSession();
    if (!session || !confirm("¿Eliminar esta reserva?")) return;
    try {
      await fetchWithAuth(`/admin/reservas/${id}`, session.token, { method: "DELETE" });
      setReservas((current) => current.filter((reserva) => reserva.id !== id));
      loadDisponibilidad();
    } catch {
      toast.error("No se pudo eliminar la reserva");
    }
  };

  const shiftMonth = (delta: number) => {
    const [y, m] = mes.split("-").map(Number);
    const d = new Date(y, m - 1 + delta, 1);
    setMes(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
  };

  const colorFor = (dia: DisponibilidadDia) => {
    if (dia.total === 0) return "bg-white/5 text-gray-500 border-white/10";
    const pct = dia.ocupadas / dia.total;
    if (pct >= 1) return "bg-red-500/10 text-red-400 border-red-500/20";
    if (pct >= 0.6) return "bg-pop-orange/10 text-pop-orange border-pop-orange/20";
    return "bg-green-500/10 text-green-400 border-green-500/20";
  };

  const visible = reservas; // Filtering is now server-side

  return (
    <main className="pt-24 lg:pt-20 p-4 lg:p-10 min-h-screen bg-pop-black">
      <header className="mb-8">
        <h1 className="text-4xl lg:text-6xl font-black tracking-tighter text-white font-epilogue uppercase">Reservas</h1>
        <p className="text-pop-orange mt-2 text-xs font-bold uppercase tracking-[0.3em]">Control de mesas y visitas</p>
        <p className="text-gray-500 mt-2 text-[10px] font-bold uppercase tracking-widest">Actualización automática cada 60 segundos</p>
      </header>

      <section className="bg-pop-cardGreen rounded-2xl border border-white/5 p-5 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-black uppercase tracking-widest text-white">Disponibilidad — {mes}</h2>
          <div className="flex gap-2">
            <button onClick={() => shiftMonth(-1)} className="w-8 h-8 flex items-center justify-center bg-white/5 rounded-lg text-gray-400 hover:text-pop-gold">
              <span className="material-symbols-outlined text-base">chevron_left</span>
            </button>
            <button onClick={() => shiftMonth(1)} className="w-8 h-8 flex items-center justify-center bg-white/5 rounded-lg text-gray-400 hover:text-pop-gold">
              <span className="material-symbols-outlined text-base">chevron_right</span>
            </button>
          </div>
        </div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {disponibilidad.map((dia) => (
            <button
              key={dia.fecha}
              onClick={() => setFechaFiltro(fechaFiltro === dia.fecha ? null : dia.fecha)}
              className={`min-w-[64px] flex-shrink-0 p-2 rounded-xl border text-center transition-all ${colorFor(dia)} ${fechaFiltro === dia.fecha ? "ring-2 ring-pop-gold" : ""}`}
            >
              <p className="text-[9px] font-bold uppercase opacity-70">{dia.fecha.slice(8, 10)}</p>
              <p className="text-sm font-black">{dia.libres}/{dia.total}</p>
            </button>
          ))}
        </div>
        {fechaFiltro && (
          <div className="mt-3 flex items-center gap-2">
            <span className="text-[10px] text-gray-400 uppercase tracking-widest">Filtrando por {fechaFiltro}</span>
            <button onClick={() => setFechaFiltro(null)} className="text-[10px] text-pop-gold uppercase tracking-widest font-bold">Quitar filtro</button>
          </div>
        )}
      </section>

      <section className="flex flex-wrap items-center gap-2 mb-6">
        {STATUSES.map((status) => (
          <button key={status} onClick={() => setFilter(status)} className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest ${filter === status ? "bg-pop-gold text-pop-black" : "bg-white/5 text-gray-400"}`}>
            {status}
          </button>
        ))}
        <label className="ml-auto flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 text-[10px] font-black uppercase tracking-widest text-gray-400 cursor-pointer">
          <input type="checkbox" checked={notificarEmail} onChange={(e) => setNotificarEmail(e.target.checked)} className="accent-pop-gold" />
          Enviar email al confirmar
        </label>
      </section>

      <section className="bg-pop-cardGreen rounded-2xl border border-white/5 overflow-x-auto">
        <table className="w-full min-w-[980px] text-left">
          <thead className="border-b border-white/5 text-[10px] uppercase tracking-widest text-gray-500">
            <tr><th className="p-5">Cliente</th><th>Fecha</th><th>Personas</th><th>Mesa</th><th>Notas</th><th>Estado</th><th className="pr-5 text-right">Acciones</th></tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {visible.map((reserva) => (
              <tr key={reserva.id} className="hover:bg-white/[0.02]">
                <td className="p-5"><p className="text-sm font-bold text-white">{reserva.nombre}</p><p className="text-[10px] text-gray-500">{reserva.email}</p><p className="text-[10px] text-gray-500">{reserva.telefono}</p></td>
                <td className="text-xs text-gray-300">{reserva.fecha} · {reserva.hora}</td>
                <td className="text-xs font-bold text-pop-gold">{reserva.personas}</td>
                <td>
                  <select value={reserva.mesa_id ?? ""} onChange={(event) => assignMesa(reserva.id, event.target.value ? Number(event.target.value) : null)} className="bg-pop-black border border-white/10 rounded-lg px-3 py-2 text-xs text-white">
                    <option value="">Sin mesa</option>
                    {mesas.map((mesa) => <option key={mesa.id} value={mesa.id}>Mesa {mesa.numero}</option>)}
                  </select>
                </td>
                <td className="max-w-xs text-xs text-gray-400 truncate">{reserva.notas || "—"}</td>
                <td>
                  <select value={reserva.estado} onChange={(event) => updateStatus(reserva.id, event.target.value as Reserva["estado"])} className="bg-pop-black border border-white/10 rounded-lg px-3 py-2 text-xs text-white">
                    <option value="pendiente">Pendiente</option><option value="confirmada">Confirmada</option><option value="completada">Completada</option><option value="cancelada">Cancelada</option>
                  </select>
                </td>
                <td className="pr-5 text-right"><button onClick={() => remove(reserva.id)} className="text-red-400 material-symbols-outlined">delete</button></td>
              </tr>
            ))}
            {!loading && visible.length === 0 && <tr><td colSpan={7} className="p-10 text-center text-xs uppercase tracking-widest text-gray-500">Sin reservas</td></tr>}
          </tbody>
        </table>
      </section>
      <div className="mt-4">
        <Pagination currentPage={meta.current_page} lastPage={meta.last_page} total={meta.total} onPageChange={setPage} />
      </div>
    </main>
  );
}
