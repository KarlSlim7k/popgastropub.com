"use client";

import React, { useEffect, useState } from 'react';
import { useAuth } from "@/lib/auth-provider";
import { fetchWithAuth } from "@/lib/api";

interface Reserva { id: number; nombre: string; telefono: string; fecha: string; hora: string; personas: number; estado: string; notas?: string; }
interface SalonData { total_mesas: number; ocupadas: number; disponibles: number; ocupacion_pct: number; }

export default function StaffReservationsPage() {
  const { session } = useAuth();
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [salon, setSalon] = useState<SalonData | null>(null);
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    if (!session?.token) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetchWithAuth<{ reservas: Reserva[]; salon: SalonData }>(`/staff/reservas?fecha=${fecha}`, session.token);
      setReservas(res.reservas || []);
      setSalon(res.salon || null);
    } catch (e: any) {
      setError(e.message || 'Error al cargar reservas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [session?.token, fecha]);

  const updateStatus = async (id: number, estado: string) => {
    if (!session?.token) return;
    try {
      await fetchWithAuth(`/staff/reservas/${id}/status`, session.token, { method: "PATCH", body: JSON.stringify({ estado }) });
      fetchData();
    } catch (e: any) {
      alert(e.message || 'Error al actualizar estado');
    }
  };

  const statusBadge = (s: string) => {
    const map: Record<string, string> = { pendiente: "bg-pop-orange/10 text-pop-orange", confirmada: "bg-blue-500/10 text-blue-400", sentada: "bg-green-500/10 text-green-400", completada: "bg-gray-500/10 text-gray-400", cancelada: "bg-red-500/10 text-red-400", no_show: "bg-red-500/10 text-red-500" };
    return map[s] || "bg-gray-500/10 text-gray-400";
  };

  return (
    <main className="pt-24 lg:pt-20 p-6 lg:p-10 min-h-screen bg-pop-black">
      <header className="mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
        <div>
          <h1 className="text-4xl lg:text-5xl font-black tracking-tighter text-white font-epilogue uppercase">Reservaciones</h1>
          <p className="text-pop-orange mt-2 text-xs font-bold uppercase tracking-[0.3em]">Gestión de mesas</p>
        </div>
        <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} className="bg-pop-cardGreen border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:border-pop-gold outline-none" />
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {loading ? (
          <div className="lg:col-span-3 flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-pop-gold border-t-transparent rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="lg:col-span-3 text-center py-20">
            <p className="text-red-400 text-sm mb-4">{error}</p>
            <button onClick={fetchData} className="px-6 py-3 bg-pop-gold text-pop-black font-black uppercase text-xs tracking-widest rounded-lg">Reintentar</button>
          </div>
        ) : (
        <>
        <section className="lg:col-span-2">
          <div className="bg-pop-cardGreen p-8 rounded-xl border border-white/5">
            <h2 className="text-2xl font-black uppercase font-epilogue tracking-tighter text-white mb-8 flex items-center gap-3">
              Reservas del Día <span className="text-[10px] font-bold text-pop-gold bg-pop-gold/10 px-2 py-0.5 rounded tracking-widest uppercase">{reservas.length} total</span>
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/5 text-[10px] uppercase tracking-[0.2em] text-gray-500">
                    <th className="pb-4 font-bold">Hora</th><th className="pb-4 font-bold">Cliente</th><th className="pb-4 font-bold">Personas</th><th className="pb-4 font-bold">Estado</th><th className="pb-4 text-right font-bold">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {reservas.map((r) => (
                    <tr key={r.id} className="hover:bg-white/[0.02]">
                      <td className="py-6 font-mono text-pop-gold text-lg font-bold">{r.hora}</td>
                      <td className="py-6"><p className="text-white font-bold">{r.nombre}</p><p className="text-[10px] text-gray-500">{r.telefono}</p></td>
                      <td className="py-6 text-gray-300 font-mono">{r.personas} pax</td>
                      <td className="py-6"><span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${statusBadge(r.estado)}`}>{r.estado}</span></td>
                      <td className="py-6 text-right">
                        <select onChange={(e) => { if (e.target.value) updateStatus(r.id, e.target.value); e.target.value = ""; }} defaultValue="" className="bg-pop-black border border-white/10 rounded-lg px-2 py-1 text-[10px] text-white outline-none">
                          <option value="" disabled>Cambiar...</option>
                          <option value="confirmada">Confirmar</option>
                          <option value="sentada">Sentar</option>
                          <option value="completada">Completar</option>
                          <option value="no_show">No Show</option>
                          <option value="cancelada">Cancelar</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                  {reservas.length === 0 && <tr><td colSpan={5} className="py-10 text-center text-gray-500 text-xs uppercase">Sin reservas para esta fecha</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <aside className="space-y-8">
          <article className="bg-pop-cardGreen p-8 rounded-xl border border-white/5">
            <h3 className="text-lg font-black uppercase font-epilogue tracking-tighter text-white mb-6">Estado del Salón</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-pop-black/40 rounded-lg border border-white/5">
                <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">Ocupación</span>
                <span className="text-xl font-black text-white">{salon?.ocupacion_pct || 0}%</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-pop-black/40 rounded-lg border border-white/5">
                <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">Mesas Libres</span>
                <span className="text-xl font-black text-pop-gold font-mono">{String(salon?.disponibles || 0).padStart(2, '0')}</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-pop-black/40 rounded-lg border border-white/5">
                <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">Total Mesas</span>
                <span className="text-xl font-black text-white font-mono">{salon?.total_mesas || 12}</span>
              </div>
            </div>
          </article>
        </aside>
        </>
        )}
      </div>
    </main>
  );
}
