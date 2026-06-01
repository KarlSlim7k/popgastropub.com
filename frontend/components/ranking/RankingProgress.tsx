"use client";

import React from 'react';

interface RankingProgressProps {
  position: number | null;
  puntos: number;
  progress: number;
  tier: string;
}

export function RankingProgress({ position, puntos, progress, tier }: RankingProgressProps) {
  return (
    <article className="bg-pop-gold p-8 rounded-2xl text-pop-black relative overflow-hidden group">
      <div className="relative z-10">
        <h4 className="text-[10px] font-black uppercase tracking-widest mb-2 opacity-60">Tu Progreso</h4>
        <p className="text-3xl font-black uppercase tracking-tighter mb-6">
          {position ? `#${position}` : '—'}
        </p>
        <p className="text-xs font-bold leading-tight mb-8">
          {puntos.toLocaleString('es-MX')} puntos acumulados
        </p>
        <div className="h-2 bg-pop-black/10 rounded-full overflow-hidden mb-2">
          <div className="h-full bg-pop-black transition-all" style={{ width: `${progress}%` }} />
        </div>
        <div className="flex justify-between text-[9px] font-black uppercase tracking-widest">
          <span>{progress}% del Objetivo</span>
          <span>Tier {tier}</span>
        </div>
      </div>
      <span className="material-symbols-outlined absolute -right-6 -bottom-6 text-9xl text-pop-black/5 rotate-12 group-hover:scale-110 transition-transform duration-700">trending_up</span>
    </article>
  );
}
