"use client";

import { useAuth } from "@/lib/auth-provider";
import { fetchWithAuth, fetchAPI } from "@/lib/api";
import { useState, useEffect, useCallback } from "react";

interface Recompensa {
  id: number | string;
  nombre: string;
  descripcion?: string;
  puntos_requeridos: number;
  imagen?: string | null;
  categoria?: string;
  tier?: string;
}

export default function RecompensasPage() {
  const { session } = useAuth();
  const [rewards, setRewards] = useState<Recompensa[]>([]);
  const [userPoints, setUserPoints] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("todos");
  const [toast, setToast] = useState<string | null>(null);
  const [redeemingId, setRedeemingId] = useState<number | string | null>(null);

  const token = session?.token ?? "";

  const fetchRewards = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAPI<{ data?: Recompensa[]; recompensas?: Recompensa[] }>("/api/recompensas");
      const list = Array.isArray(data) ? data : data.data ?? data.recompensas ?? [];
      setRewards(list);
    } catch (err: any) {
      setError(err?.message || "No se pudieron cargar las recompensas");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPoints = useCallback(async () => {
    if (!token) return;
    try {
      const data = await fetchWithAuth<{ puntos?: number; points?: number; total?: number }>("/api/loyalty/points", token);
      const pts = (data as any).puntos ?? (data as any).points ?? (data as any).total ?? 0;
      setUserPoints(Number(pts) || 0);
    } catch {
      // Silently fail; keep 0 points
      setUserPoints(0);
    }
  }, [token]);

  useEffect(() => {
    fetchRewards();
  }, [fetchRewards]);

  useEffect(() => {
    fetchPoints();
  }, [fetchPoints]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  const handleRedeem = async (id: number | string) => {
    if (!token) {
      setToast("Inicia sesión para canjear recompensas");
      return;
    }
    setRedeemingId(id);
    try {
      await fetchWithAuth(`/api/recompensas/${id}/canjear`, token, { method: "POST" });
      setToast("Canje exitoso");
      await fetchPoints();
    } catch (err: any) {
      const msg = err?.message || "";
      if (msg.toLowerCase().includes("insuficiente") || msg.toLowerCase().includes("puntos")) {
        setToast("Puntos insuficientes para esta recompensa");
      } else {
        setToast(msg || "Error al canjear la recompensa");
      }
    } finally {
      setRedeemingId(null);
    }
  };

  const categories = ["todos", ...Array.from(new Set(rewards.map((r) => r.categoria).filter((c): c is string => !!c)))];

  const filteredRewards =
    filter === "todos" || !rewards.some((r) => r.categoria)
      ? rewards
      : rewards.filter((r) => r.categoria === filter);

  return (
    <main className="pt-24 lg:pt-32 p-4 lg:p-12 max-w-7xl mx-auto space-y-12">
      {/* Toast */}
      {toast && (
        <div className="fixed top-24 right-4 z-50 bg-pop-black border border-pop-gold/30 text-pop-gold px-6 py-3 rounded-xl shadow-lg text-xs font-black uppercase tracking-widest">
          {toast}
        </div>
      )}

      {/* Header & Balance */}
      <header className="flex flex-col lg:flex-row justify-between items-center bg-[#1C1B1B] p-8 lg:px-12 rounded-3xl border border-white/5 relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-pop-gold/5 via-transparent to-transparent pointer-events-none" />
        <div className="relative z-10 text-center lg:text-left">
          <h1 className="text-4xl lg:text-6xl font-black text-white font-epilogue tracking-tighter uppercase leading-none">
            Catálogo de Premios
          </h1>
          <p className="text-pop-orange mt-2 text-xs font-bold uppercase tracking-[0.3em]">
            Canjea tu lealtad por experiencias únicas
          </p>
        </div>

        <div className="mt-8 lg:mt-0 relative z-10 bg-pop-black/40 backdrop-blur-md px-8 py-4 rounded-2xl border border-white/10 text-center lg:text-right">
          <p className="text-4xl font-black text-pop-gold font-epilogue tracking-tighter leading-none">
            {userPoints.toLocaleString()}
          </p>
          <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.3em] mt-1">Tus Puntos POP</p>
        </div>
      </header>

      {/* Categories & Navigation */}
      {categories.length > 1 && (
        <nav className="flex flex-wrap justify-center lg:justify-start gap-4 lg:gap-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-6 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all border ${
                filter === cat
                  ? "bg-pop-gold text-pop-black border-pop-gold"
                  : "bg-transparent text-gray-400 border-white/5 hover:bg-white/5"
              }`}
            >
              {cat}
            </button>
          ))}
        </nav>
      )}

      {/* Rewards Grid */}
      {loading ? (
        <div className="bg-[#1C1B1B] p-12 rounded-3xl border border-dashed border-white/5 text-center">
          <div className="w-8 h-8 border-2 border-pop-gold border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-gray-500 font-black uppercase text-[10px] tracking-widest mt-4">Cargando recompensas...</p>
        </div>
      ) : error ? (
        <div className="bg-[#1C1B1B] p-12 rounded-3xl border border-dashed border-white/5 text-center space-y-4">
          <span className="material-symbols-outlined text-red-500 text-5xl">error</span>
          <p className="text-gray-500 font-black uppercase text-[10px] tracking-widest">{error}</p>
        </div>
      ) : filteredRewards.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredRewards.map((reward) => {
            const isAffordable = userPoints >= reward.puntos_requeridos;
            return (
              <article
                key={reward.id}
                className={`group bg-[#1C1B1B] rounded-3xl overflow-hidden border border-white/5 transition-all flex flex-col ${
                  !isAffordable ? "opacity-75" : "hover:border-pop-gold/30 hover:shadow-[0_0_30px_rgba(242,199,119,0.05)]"
                }`}
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={reward.imagen || "/images/logopop.png"}
                    alt={reward.nombre}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                  <div className="absolute top-4 right-4 bg-pop-black/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 flex items-center gap-2">
                    <span className="material-symbols-outlined text-pop-gold text-sm">stars</span>
                    <span className="text-sm font-black text-white">{reward.puntos_requeridos} pts</span>
                  </div>
                  {!isAffordable && (
                    <div className="absolute inset-0 bg-pop-black/60 backdrop-blur-sm flex flex-center items-center justify-center">
                      <div className="bg-pop-black/80 p-4 rounded-2xl border border-white/10 flex flex-col items-center gap-2">
                        <span className="material-symbols-outlined text-white/40 text-3xl">lock</span>
                        <p className="text-[10px] font-black text-white uppercase tracking-widest">
                          Faltan {reward.puntos_requeridos - userPoints} pts
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      {reward.categoria && (
                        <span className="text-[9px] font-black text-pop-orange uppercase tracking-widest">
                          {reward.categoria}
                        </span>
                      )}
                      {reward.tier && (
                        <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded">
                          Nivel {reward.tier}
                        </span>
                      )}
                    </div>
                    <h3 className="text-base lg:text-lg font-black text-white uppercase leading-tight">{reward.nombre}</h3>
                    {reward.descripcion && (
                      <p className="text-[10px] text-gray-500 font-bold mt-1 leading-relaxed">{reward.descripcion}</p>
                    )}
                  </div>

                  <button
                    disabled={!isAffordable || redeemingId === reward.id}
                    onClick={() => handleRedeem(reward.id)}
                    className={`w-full py-4 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all ${
                      isAffordable
                        ? "bg-white/5 text-pop-gold border border-pop-gold/20 hover:bg-pop-gold hover:text-pop-black"
                        : "bg-transparent text-gray-600 border border-white/5 cursor-not-allowed"
                    }`}
                  >
                    {redeemingId === reward.id
                      ? "Procesando..."
                      : isAffordable
                      ? "¡Lo quiero!"
                      : "Puntos Insuficientes"}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="bg-[#1C1B1B] p-12 rounded-3xl border border-dashed border-white/5 text-center space-y-4">
          <span className="material-symbols-outlined text-gray-700 text-5xl">card_giftcard</span>
          <p className="text-gray-500 font-black uppercase text-[10px] tracking-widest">No hay recompensas disponibles</p>
        </div>
      )}

      {/* Why Loyalty? Info */}
      <section className="bg-pop-orange/5 border border-pop-orange/10 p-8 lg:p-12 rounded-3xl flex flex-col lg:flex-row items-center gap-10">
        <div className="lg:w-2/3 space-y-4 text-center lg:text-left">
          <h2 className="text-2xl lg:text-4xl font-black text-white uppercase tracking-tighter">¿Cómo gano más puntos?</h2>
          <p className="text-gray-400 text-sm font-manrope leading-relaxed">
            En POP Perote, cada visita cuenta. Gana 1 punto por cada $10 de consumo, obtén bonos por check-in en redes sociales y recibe regalos exclusivos en tu cumpleaños. ¡Sube de nivel para multiplicar tus recompensas!
          </p>
          <div className="flex flex-wrap justify-center lg:justify-start gap-4 pt-4">
            <div className="bg-pop-black/50 px-4 py-2 rounded-lg border border-white/5 flex items-center gap-2">
              <span className="material-symbols-outlined text-pop-gold text-lg">celebration</span>
              <span className="text-xs font-bold text-gray-300">Cumpleaños: +150 pts</span>
            </div>
            <div className="bg-pop-black/50 px-4 py-2 rounded-lg border border-white/5 flex items-center gap-2">
              <span className="material-symbols-outlined text-pop-gold text-lg">person_add</span>
              <span className="text-xs font-bold text-gray-300">Referidos: +200 pts</span>
            </div>
          </div>
        </div>
        <div className="lg:w-1/3 w-full">
          <a
            href="/puntos"
            className="block w-full text-center py-5 bg-pop-orange text-white font-black uppercase text-xs tracking-[0.2em] rounded-2xl hover:brightness-110 transition-all shadow-[0_10px_30px_rgba(217,103,37,0.3)]"
          >
            Ver mi progreso de nivel
          </a>
        </div>
      </section>
    </main>
  );
}
