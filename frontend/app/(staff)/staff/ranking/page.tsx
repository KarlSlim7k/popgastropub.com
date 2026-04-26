"use client";

import React, { useEffect, useState, useMemo } from 'react';
import { useAuth } from '@/lib/auth-provider';
import { fetchWithAuth } from '@/lib/api';

interface RankingUser {
  name: string;
  email: string;
}

interface Mesero {
  id: number;
  nombre: string;
  puntos: number;
  activo: boolean;
  user: RankingUser;
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function formatPoints(pts: number): string {
  return pts.toLocaleString('es-MX');
}

function getCategory(pts: number): string {
  if (pts >= 3000) return 'Master Mesero';
  if (pts >= 2000) return 'Expert Mesero';
  if (pts >= 1000) return 'Pro Mesero';
  return 'Mesero';
}

const podiumColors = [
  { border: '#F2C777', bg: '#F2C777', text: 'pop-black', glow: true, scale: true },
  { border: '#F2C894', bg: '#F2C894', text: 'pop-black', glow: false, scale: false },
  { border: '#D96725', bg: '#D96725', text: 'white', glow: false, scale: false },
];

export default function RankingPage() {
  const { session } = useAuth();
  const [meseros, setMeseros] = useState<Mesero[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!session?.token) return;

    let cancelled = false;

    async function loadRanking() {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchWithAuth<Mesero[]>('/api/ranking', session!.token);
        if (!cancelled) {
          // Ensure descending order by points
          const sorted = [...data].sort((a, b) => b.puntos - a.puntos);
          setMeseros(sorted);
        }
      } catch (err: any) {
        if (!cancelled) {
          setError(err?.message || 'Error al cargar el ranking');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadRanking();

    return () => {
      cancelled = true;
    };
  }, [session?.token]);

  const topThree = useMemo(() => meseros.slice(0, 3), [meseros]);
  const rest = useMemo(() => meseros.slice(3), [meseros]);

  // Podium order for visual layout: [2nd, 1st, 3rd]
  const podiumOrdered = useMemo(() => {
    if (topThree.length === 0) return [];
    const t = [...topThree];
    return [t[1], t[0], t[2]].filter(Boolean) as Mesero[];
  }, [topThree]);

  if (loading) {
    return (
      <main className="pt-24 lg:pt-20 p-6 lg:p-10 min-h-screen bg-pop-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-pop-gold border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-black uppercase tracking-[0.3em] text-gray-500">Cargando ranking...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="pt-24 lg:pt-20 p-6 lg:p-10 min-h-screen bg-pop-black flex items-center justify-center">
        <div className="text-center max-w-md">
          <p className="text-red-400 font-black uppercase tracking-widest text-sm mb-2">Error</p>
          <p className="text-gray-300 text-sm mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-pop-gold text-pop-black font-black uppercase text-xs tracking-[0.2em] rounded-lg hover:bg-pop-lightGold transition-colors"
          >
            Reintentar
          </button>
        </div>
      </main>
    );
  }

  if (meseros.length === 0) {
    return (
      <main className="pt-24 lg:pt-20 p-6 lg:p-10 min-h-screen bg-pop-black flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 rounded-full bg-white/5 mx-auto mb-6 flex items-center justify-center">
            <span className="material-symbols-outlined text-4xl text-gray-500">emoji_events</span>
          </div>
          <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-2">Ranking vacío</h2>
          <p className="text-gray-500 text-sm">Aún no hay meseros registrados en el ranking. ¡Vuelve más tarde!</p>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-24 lg:pt-20 p-6 lg:p-10 min-h-screen bg-pop-black">
      {/* Header */}
      <header className="mb-12">
        <h1 className="text-5xl lg:text-7xl font-black tracking-tighter text-white font-epilogue uppercase italic leading-none">
          Wall of Fame
        </h1>
        <p className="text-pop-gold mt-4 text-xs font-black uppercase tracking-[0.4em] flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-pop-gold animate-pulse" />
          POP Bar Stars • Ranking en Vivo
        </p>
      </header>

      {/* Podium */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-16 items-end">
        {podiumOrdered.map((mesero, idx) => {
          const visualRank = idx === 0 ? 2 : idx === 1 ? 1 : 3;
          const isFirst = visualRank === 1;
          const style = podiumColors[visualRank - 1];
          const displayName = mesero.user?.name || mesero.nombre;
          const category = getCategory(mesero.puntos);

          return (
            <article
              key={mesero.id}
              className={`${
                isFirst
                  ? 'order-1 lg:order-2 bg-[#1C1B1B] p-10 rounded-2xl border-t-8 border-pop-gold relative lg:-translate-y-8 ring-4 ring-pop-gold/10 scale-105 shadow-2xl shadow-pop-gold/5 group hover:bg-[#252424] transition-all'
                  : `order-${visualRank} lg:order-${visualRank === 2 ? 1 : 3} bg-[#1C1B1B]/80 backdrop-blur-md p-8 rounded-2xl border-t-4 relative group hover:bg-[#252424] transition-all`
              }`}
              style={!isFirst ? { borderTopColor: style.border } : undefined}
            >
              <div
                className={`absolute ${isFirst ? '-top-10 left-1/2 -translate-x-1/2 w-16 h-16 text-3xl shadow-[0_0_30px_rgba(242,199,119,0.3)]' : '-top-6 w-12 h-12 text-xl shadow-lg'} ${visualRank === 2 ? 'left-8' : visualRank === 3 ? 'right-8' : ''} rounded-full flex items-center justify-center font-black`}
                style={{ backgroundColor: style.bg, color: style.text === 'pop-black' ? '#0D0D0D' : '#fff' }}
              >
                {visualRank}
              </div>
              <div className="text-center">
                <div
                  className={`${isFirst ? 'w-24 h-24 text-4xl border-4 border-pop-gold bg-pop-gold/10' : 'w-20 h-20 text-2xl border-2 border-white/10 bg-white/5'} rounded-full mx-auto mb-4 flex items-center justify-center font-bold text-gray-400 group-hover:scale-110 transition-transform`}
                >
                  {getInitials(displayName)}
                </div>
                <h3 className={`${isFirst ? 'text-3xl tracking-tighter' : 'text-2xl tracking-tight'} font-black text-white uppercase`}>
                  {displayName}
                </h3>
                <p className={`${isFirst ? 'text-pop-gold mt-2 mb-8 animate-pulse tracking-[0.3em]' : 'text-gray-500 mt-1 mb-6 tracking-widest'} text-[10px] font-black uppercase`}>
                  {isFirst ? '👑 Top Performer' : category}
                </p>
                <p className={`${isFirst ? 'text-6xl text-white text-glow' : 'text-4xl'} font-mono font-black`} style={{ color: isFirst ? undefined : style.border }}>
                  {formatPoints(mesero.puntos)}
                </p>
                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mt-2">Puntos Totales</p>
              </div>
            </article>
          );
        })}
      </section>

      {/* Main Grid: Leaderboard + Stats */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
        {/* Full Leaderboard */}
        <section className="xl:col-span-2">
          <div className="bg-[#1C1B1B] overflow-hidden rounded-2xl border border-white/5">
            <div className="p-8 border-b border-white/5">
              <h2 className="text-2xl font-black uppercase font-epilogue tracking-tighter text-white">Tabla General</h2>
            </div>
            <div className="overflow-x-auto min-w-full">
              <table className="w-full text-left">
                <tbody>
                  {rest.map((mesero, index) => {
                    const rank = index + 4;
                    const displayName = mesero.user?.name || mesero.nombre;
                    const category = getCategory(mesero.puntos);
                    return (
                      <tr key={mesero.id} className="group hover:bg-white/[0.02] transition-colors border-b border-white/5 last:border-0">
                        <td className="py-6 px-8">
                          <span className="text-lg font-mono font-bold text-gray-500 group-hover:text-pop-gold transition-colors">{rank}</span>
                        </td>
                        <td className="py-6 px-4">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-xs font-bold text-gray-400 border border-white/10">{getInitials(displayName)}</div>
                            <div>
                              <p className="text-base font-bold text-white uppercase tracking-tight">{displayName}</p>
                              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{category}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-6 px-4 text-right pr-12">
                          <p className="text-xl font-mono font-black text-white group-hover:text-pop-gold transition-colors">{formatPoints(mesero.puntos)} pt</p>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {rest.length === 0 && (
              <div className="p-10 text-center">
                <p className="text-gray-500 text-sm">No hay más meseros en el ranking.</p>
              </div>
            )}
          </div>
        </section>

        {/* Sidebar Stats & Badges */}
        <aside className="space-y-10">
          {/* Personal Goal Progress (static placeholder, can be connected later) */}
          <article className="bg-pop-gold p-8 rounded-2xl text-pop-black relative overflow-hidden group">
            <div className="relative z-10">
              <h4 className="text-[10px] font-black uppercase tracking-widest mb-2 opacity-60">Tu Progreso</h4>
              <p className="text-3xl font-black uppercase tracking-tighter mb-6">Sigue sumando</p>
              <p className="text-xs font-bold font-manrope leading-tight mb-8">Cada venta cuenta. Mantén el ritmo para escalar posiciones en el Wall of Fame.</p>
              <div className="h-2 bg-pop-black/10 rounded-full overflow-hidden mb-2">
                <div className="h-full bg-pop-black w-[65%]" />
              </div>
              <div className="flex justify-between text-[9px] font-black uppercase tracking-widest">
                <span>65% del Objetivo</span>
                <span>Tier Pro</span>
              </div>
            </div>
            <span className="material-symbols-outlined absolute -right-6 -bottom-6 text-9xl text-pop-black/5 rotate-12 group-hover:scale-110 transition-transform duration-700">trending_up</span>
          </article>

          {/* Insignias Activas */}
          <article className="bg-[#1C1B1B] p-8 rounded-2xl border border-white/5">
            <h3 className="text-lg font-black uppercase font-epilogue tracking-tighter text-white mb-8">Insignias del Mes</h3>
            <div className="grid grid-cols-2 gap-6">
              {[
                { label: "Margarita Queen", icon: "local_bar", color: "#F2C777", active: true },
                { label: "Ventas Shark", icon: "trending_up", color: "#D96725", active: true },
                { label: "Punctual Pro", icon: "schedule", color: "#666", active: false },
                { label: "Service God", icon: "verified", color: "#666", active: false },
              ].map((badge, i) => (
                <div key={i} className={`flex flex-col items-center text-center gap-3 ${!badge.active ? 'opacity-20 grayscale' : 'group cursor-pointer'}`}>
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center border-2 transition-transform group-hover:scale-110`} style={{ borderColor: badge.active ? badge.color : '#333', backgroundColor: badge.active ? `${badge.color}15` : 'transparent' }}>
                    <span className="material-symbols-outlined text-3xl" style={{ color: badge.active ? badge.color : '#666' }}>{badge.icon}</span>
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-widest text-gray-400 group-hover:text-white transition-colors">{badge.label}</span>
                </div>
              ))}
            </div>
          </article>
        </aside>
      </div>
    </main>
  );
}
