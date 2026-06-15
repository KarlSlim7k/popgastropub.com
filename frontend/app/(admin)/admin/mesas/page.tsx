"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { fetchWithAuth } from "@/lib/api";
import { getAuthSession } from "@/lib/auth-session";

interface Mesa {
  id: number;
  numero: number;
  capacidad: number;
  activa: boolean;
}

export default function AdminMesasPage() {
  const [mesas, setMesas] = useState<Mesa[]>([]);
  const [loading, setLoading] = useState(true);
  const [nuevoNumero, setNuevoNumero] = useState("");
  const [nuevaCapacidad, setNuevaCapacidad] = useState("4");

  const fetchMesas = async () => {
    const session = getAuthSession();
    if (!session) return;
    setLoading(true);
    try {
      const data = await fetchWithAuth<Mesa[]>("/admin/mesas", session.token);
      setMesas(Array.isArray(data) ? data : []);
    } catch {
      toast.error("No se pudieron cargar las mesas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMesas(); }, []);

  const handleCreate = async () => {
    const session = getAuthSession();
    if (!session) return;
    const numero = Number(nuevoNumero);
    const capacidad = Number(nuevaCapacidad);
    if (!numero || numero < 1) {
      toast.error("Ingresa un número de mesa válido");
      return;
    }
    try {
      await fetchWithAuth("/admin/mesas", session.token, {
        method: "POST",
        body: JSON.stringify({ numero, capacidad }),
      });
      setNuevoNumero("");
      setNuevaCapacidad("4");
      fetchMesas();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error al crear mesa");
    }
  };

  const updateMesa = async (mesa: Mesa, data: Partial<Mesa>) => {
    const session = getAuthSession();
    if (!session) return;
    try {
      await fetchWithAuth(`/admin/mesas/${mesa.id}`, session.token, {
        method: "PUT",
        body: JSON.stringify(data),
      });
      setMesas((prev) => prev.map((m) => (m.id === mesa.id ? { ...m, ...data } : m)));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error al actualizar mesa");
    }
  };

  const handleDelete = async (mesa: Mesa) => {
    const session = getAuthSession();
    if (!session) return;
    if (!confirm(`¿Eliminar la Mesa ${mesa.numero}?`)) return;
    try {
      await fetchWithAuth(`/admin/mesas/${mesa.id}`, session.token, { method: "DELETE" });
      setMesas((prev) => prev.filter((m) => m.id !== mesa.id));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error al eliminar");
    }
  };

  return (
    <main className="pt-24 lg:pt-20 p-4 lg:p-10 min-h-screen bg-pop-black">
      <header className="mb-10">
        <h1 className="text-4xl lg:text-6xl font-black tracking-tighter text-white font-epilogue uppercase leading-none flex items-center gap-4">
          <span className="material-symbols-outlined text-pop-gold text-5xl lg:text-6xl">table_restaurant</span>
          Mesas
        </h1>
        <p className="text-pop-orange mt-2 text-xs font-bold uppercase tracking-[0.3em]">
          Configuración del salón para reservaciones
        </p>
      </header>

      <section className="bg-pop-cardGreen rounded-2xl border border-white/5 p-6 mb-8 flex flex-wrap items-end gap-4">
        <div className="space-y-2">
          <label className="text-[9px] font-black uppercase tracking-widest text-gray-500">Número</label>
          <input
            type="number"
            min={1}
            value={nuevoNumero}
            onChange={(e) => setNuevoNumero(e.target.value)}
            placeholder="13"
            className="w-28 bg-pop-black border border-white/10 rounded-xl p-3 text-white focus:border-pop-gold outline-none"
          />
        </div>
        <div className="space-y-2">
          <label className="text-[9px] font-black uppercase tracking-widest text-gray-500">Capacidad</label>
          <input
            type="number"
            min={1}
            value={nuevaCapacidad}
            onChange={(e) => setNuevaCapacidad(e.target.value)}
            className="w-28 bg-pop-black border border-white/10 rounded-xl p-3 text-white focus:border-pop-gold outline-none"
          />
        </div>
        <button
          onClick={handleCreate}
          className="px-8 py-3 bg-pop-gold text-pop-black font-black uppercase text-xs tracking-[0.2em] rounded-lg hover:bg-pop-lightGold transition-all shadow-lg"
        >
          Agregar Mesa
        </button>
      </section>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {mesas.map((mesa) => (
          <article
            key={mesa.id}
            className={`bg-pop-cardGreen rounded-2xl border p-5 transition-all ${
              mesa.activa ? "border-white/5" : "border-red-500/20 opacity-60"
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white font-black text-lg">Mesa {mesa.numero}</h3>
              <button
                onClick={() => handleDelete(mesa)}
                className="text-red-400 material-symbols-outlined text-lg"
              >
                delete
              </button>
            </div>
            <div className="space-y-2 mb-3">
              <label className="text-[9px] font-black uppercase tracking-widest text-gray-500">Capacidad</label>
              <input
                type="number"
                min={1}
                defaultValue={mesa.capacidad}
                onBlur={(e) => {
                  const val = Number(e.target.value);
                  if (val > 0 && val !== mesa.capacidad) updateMesa(mesa, { capacidad: val });
                }}
                className="w-full bg-pop-black border border-white/10 rounded-lg p-2 text-white text-sm focus:border-pop-gold outline-none"
              />
            </div>
            <button
              onClick={() => updateMesa(mesa, { activa: !mesa.activa })}
              className={`w-full py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${
                mesa.activa
                  ? "bg-green-500/10 text-green-400 border border-green-500/20"
                  : "bg-red-500/10 text-red-400 border border-red-500/20"
              }`}
            >
              {mesa.activa ? "Activa" : "Inactiva"}
            </button>
          </article>
        ))}
      </div>

      {mesas.length === 0 && !loading && (
        <div className="text-center py-16 text-gray-500 text-xs uppercase tracking-widest">
          No hay mesas configuradas
        </div>
      )}
    </main>
  );
}
