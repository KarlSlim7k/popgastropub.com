"use client";

import { useCallback, useState, useEffect } from "react";
import { fetchWithAuth } from "@/lib/api";
import { getAuthSession } from "@/lib/auth-session";

interface Period {
  id: number;
  type: "weekly" | "monthly";
  start_date: string;
  end_date: string;
  active: boolean;
  snapshots?: { mesero_id: number; puntos: number; position: number; tier: string; mesero?: { nombre: string } }[];
}

export default function RankingPeriodosPage() {
  const [data, setData] = useState<{ current: Period | null; history: Period[] }>({ current: null, history: [] });
  const [loading, setLoading] = useState(true);
  const [rotating, setRotating] = useState(false);
  const [multiplier, setMultiplier] = useState(1);
  const [savingMultiplier, setSavingMultiplier] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const token = getAuthSession()?.token ?? "";

  const fetchData = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetchWithAuth<typeof data>("/admin/ranking/periodos", token);
      setData(res);
    } catch {} finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { fetchData(); }, [fetchData]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  const handleRotate = async () => {
    if (!confirm("¿Cerrar el periodo actual y comenzar uno nuevo? Los puntos se resetearán.")) return;
    setRotating(true);
    try {
      await fetchWithAuth("/admin/ranking/rotar", token, { method: "POST", body: JSON.stringify({ type: "monthly" }) });
      setToast("Periodo rotado exitosamente");
      fetchData();
    } catch (e: any) {
      setToast(e.message || "Error al rotar periodo");
    } finally {
      setRotating(false);
    }
  };

  const handleMultiplier = async () => {
    setSavingMultiplier(true);
    try {
      await fetchWithAuth("/admin/ranking/multiplicador", token, { method: "POST", body: JSON.stringify({ multiplier }) });
      setToast(`Multiplicador ${multiplier}x aplicado a todos los meseros`);
    } catch (e: any) {
      setToast(e.message || "Error");
    } finally {
      setSavingMultiplier(false);
    }
  };

  return (
    <main className="pt-24 lg:pt-20 p-4 lg:p-10 min-h-screen bg-pop-black">
      {toast && (
        <div className="fixed top-24 right-4 z-50 bg-pop-black border border-pop-gold/30 text-pop-gold px-6 py-3 rounded-xl shadow-lg text-xs font-black uppercase tracking-widest">
          {toast}
        </div>
      )}

      <header className="mb-10">
        <h1 className="text-4xl lg:text-5xl font-black tracking-tighter text-white font-epilogue uppercase">Periodos de Ranking</h1>
        <p className="text-gray-400 mt-2 text-base font-manrope">Gestiona los ciclos del POP Bar Stars</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        {/* Current Period */}
        <section className="lg:col-span-2 bg-pop-cardGreen p-8 rounded-xl border border-white/5">
          <h2 className="text-xl font-black uppercase font-epilogue tracking-tighter text-white mb-6">Periodo Actual</h2>
          {loading ? (
            <div className="flex items-center justify-center py-10">
              <div className="w-6 h-6 border-2 border-pop-gold border-t-transparent rounded-full animate-spin" />
            </div>
          ) : data.current ? (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-pop-black/40 p-4 rounded-lg">
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Tipo</p>
                  <p className="text-lg font-black text-pop-gold capitalize">{data.current.type}</p>
                </div>
                <div className="bg-pop-black/40 p-4 rounded-lg">
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Inicio</p>
                  <p className="text-sm font-black text-white">{new Date(data.current.start_date).toLocaleDateString("es-MX")}</p>
                </div>
                <div className="bg-pop-black/40 p-4 rounded-lg">
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Fin</p>
                  <p className="text-sm font-black text-white">{new Date(data.current.end_date).toLocaleDateString("es-MX")}</p>
                </div>
              </div>
              <button
                onClick={handleRotate}
                disabled={rotating}
                className="w-full py-4 bg-pop-orange/10 border border-pop-orange/30 text-pop-orange font-black uppercase text-xs tracking-widest rounded-xl hover:bg-pop-orange/20 transition-all disabled:opacity-50"
              >
                {rotating ? "Rotando..." : "🔄 Cerrar Periodo y Comenzar Nuevo"}
              </button>
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-500 text-sm mb-4">No hay periodo activo</p>
              <button onClick={handleRotate} disabled={rotating} className="px-6 py-3 bg-pop-gold text-pop-black font-black uppercase text-xs tracking-widest rounded-xl">
                Iniciar Primer Periodo
              </button>
            </div>
          )}
        </section>

        {/* Multiplier Control */}
        <section className="bg-pop-cardGreen p-8 rounded-xl border border-white/5">
          <h2 className="text-xl font-black uppercase font-epilogue tracking-tighter text-white mb-6">Multiplicador de Puntos</h2>
          <p className="text-xs text-gray-500 mb-6">Aplica un multiplicador temporal a todos los meseros (ej: 2x para "Drink of the Month")</p>
          <div className="flex items-center gap-4 mb-6">
            <button onClick={() => setMultiplier(Math.max(1, multiplier - 0.5))} className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center text-white hover:bg-white/10">
              <span className="material-symbols-outlined">remove</span>
            </button>
            <span className="text-4xl font-black text-pop-gold font-epilogue w-16 text-center">{multiplier}x</span>
            <button onClick={() => setMultiplier(Math.min(3, multiplier + 0.5))} className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center text-white hover:bg-white/10">
              <span className="material-symbols-outlined">add</span>
            </button>
          </div>
          <button
            onClick={handleMultiplier}
            disabled={savingMultiplier}
            className="w-full py-3 bg-pop-gold text-pop-black font-black uppercase text-xs tracking-widest rounded-xl hover:bg-pop-lightGold transition-all disabled:opacity-50"
          >
            {savingMultiplier ? "Aplicando..." : "Aplicar Multiplicador"}
          </button>
        </section>
      </div>

      {/* History */}
      <section className="bg-pop-cardGreen rounded-xl border border-white/5 overflow-hidden">
        <div className="p-6 border-b border-white/5">
          <h2 className="text-xl font-black uppercase font-epilogue tracking-tighter text-white">Historial de Periodos</h2>
        </div>
        {data.history.length === 0 ? (
          <div className="p-10 text-center text-gray-500 text-xs uppercase tracking-widest">Sin historial</div>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5 text-[10px] uppercase tracking-widest text-gray-500">
                <th className="py-4 px-6 font-bold">Periodo</th>
                <th className="py-4 font-bold">Inicio</th>
                <th className="py-4 font-bold">Fin</th>
                <th className="py-4 font-bold">Participantes</th>
                <th className="py-4 font-bold">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {data.history.map((p) => (
                <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-4 px-6 font-mono text-pop-gold font-bold capitalize">{p.type}</td>
                  <td className="py-4 text-sm text-white">{new Date(p.start_date).toLocaleDateString("es-MX")}</td>
                  <td className="py-4 text-sm text-white">{new Date(p.end_date).toLocaleDateString("es-MX")}</td>
                  <td className="py-4 text-sm text-gray-400">{p.snapshots?.length ?? 0} meseros</td>
                  <td className="py-4">
                    <span className={`text-[9px] font-black uppercase px-2 py-1 rounded-full ${p.active ? "bg-green-500/10 text-green-400" : "bg-gray-500/10 text-gray-400"}`}>
                      {p.active ? "Activo" : "Cerrado"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </main>
  );
}
