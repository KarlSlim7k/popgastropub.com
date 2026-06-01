"use client";

import { useEffect, useState } from "react";
import { fetchWithAuth } from "@/lib/api";
import { getAuthSession } from "@/lib/auth-session";
import { Pagination } from "@/components/ui/Pagination";

interface Reserva {
  id: number;
  nombre: string;
  telefono: string;
  fecha: string;
  hora: string;
  personas: number;
  notas?: string;
  estado: "pendiente" | "confirmada" | "cancelada" | "completada";
  user?: { name: string; email: string } | null;
}

const STATUSES = ["todos", "pendiente", "confirmada", "completada", "cancelada"] as const;

export default function AdminReservasPage() {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [filter, setFilter] = useState<(typeof STATUSES)[number]>("todos");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ current_page: 1, last_page: 1, total: 0 });

  const load = async (p = page) => {
    const session = getAuthSession();
    if (!session) return;
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(p), per_page: "20" });
      if (filter !== "todos") params.set("estado", filter);
      const data = await fetchWithAuth<any>(`/admin/reservas?${params}`, session.token);
      setReservas(Array.isArray(data) ? data : data.data ?? []);
      if (data.meta) setMeta(data.meta);
    } catch {
      alert("No se pudieron cargar las reservas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(1); setPage(1); }, [filter]);
  useEffect(() => { load(page); }, [page]);

  const updateStatus = async (id: number, estado: Reserva["estado"]) => {
    const session = getAuthSession();
    if (!session) return;
    try {
      const updated = await fetchWithAuth<Reserva>(`/admin/reservas/${id}/status`, session.token, {
        method: "PATCH",
        body: JSON.stringify({ estado }),
      });
      setReservas((current) => current.map((reserva) => reserva.id === id ? { ...reserva, ...updated } : reserva));
    } catch {
      alert("No se pudo actualizar la reserva");
    }
  };

  const remove = async (id: number) => {
    const session = getAuthSession();
    if (!session || !confirm("¿Eliminar esta reserva?")) return;
    try {
      await fetchWithAuth(`/admin/reservas/${id}`, session.token, { method: "DELETE" });
      setReservas((current) => current.filter((reserva) => reserva.id !== id));
    } catch {
      alert("No se pudo eliminar la reserva");
    }
  };

  const visible = reservas; // Filtering is now server-side

  return (
    <main className="pt-24 lg:pt-20 p-4 lg:p-10 min-h-screen bg-pop-black">
      <header className="mb-8">
        <h1 className="text-4xl lg:text-6xl font-black tracking-tighter text-white font-epilogue uppercase">Reservas</h1>
        <p className="text-pop-orange mt-2 text-xs font-bold uppercase tracking-[0.3em]">Control de mesas y visitas</p>
      </header>

      <section className="flex flex-wrap gap-2 mb-6">
        {STATUSES.map((status) => (
          <button key={status} onClick={() => setFilter(status)} className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest ${filter === status ? "bg-pop-gold text-pop-black" : "bg-white/5 text-gray-400"}`}>
            {status}
          </button>
        ))}
      </section>

      <section className="bg-pop-cardGreen rounded-2xl border border-white/5 overflow-x-auto">
        <table className="w-full min-w-[860px] text-left">
          <thead className="border-b border-white/5 text-[10px] uppercase tracking-widest text-gray-500">
            <tr><th className="p-5">Cliente</th><th>Fecha</th><th>Personas</th><th>Notas</th><th>Estado</th><th className="pr-5 text-right">Acciones</th></tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {visible.map((reserva) => (
              <tr key={reserva.id} className="hover:bg-white/[0.02]">
                <td className="p-5"><p className="text-sm font-bold text-white">{reserva.nombre}</p><p className="text-[10px] text-gray-500">{reserva.telefono}</p></td>
                <td className="text-xs text-gray-300">{reserva.fecha} · {reserva.hora}</td>
                <td className="text-xs font-bold text-pop-gold">{reserva.personas}</td>
                <td className="max-w-xs text-xs text-gray-400 truncate">{reserva.notas || "—"}</td>
                <td>
                  <select value={reserva.estado} onChange={(event) => updateStatus(reserva.id, event.target.value as Reserva["estado"])} className="bg-pop-black border border-white/10 rounded-lg px-3 py-2 text-xs text-white">
                    <option value="pendiente">Pendiente</option><option value="confirmada">Confirmada</option><option value="completada">Completada</option><option value="cancelada">Cancelada</option>
                  </select>
                </td>
                <td className="pr-5 text-right"><button onClick={() => remove(reserva.id)} className="text-red-400 material-symbols-outlined">delete</button></td>
              </tr>
            ))}
            {!loading && visible.length === 0 && <tr><td colSpan={6} className="p-10 text-center text-xs uppercase tracking-widest text-gray-500">Sin reservas</td></tr>}
          </tbody>
        </table>
      </section>
      <div className="mt-4">
        <Pagination currentPage={meta.current_page} lastPage={meta.last_page} total={meta.total} onPageChange={setPage} />
      </div>
    </main>
  );
}
