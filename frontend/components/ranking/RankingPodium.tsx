"use client";

import React from 'react';

export interface RankingMesero {
  id: number;
  nombre: string;
  puntos: number;
  activo: boolean;
  user?: { name: string; email: string };
}

function getInitials(name: string): string {
  return name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
}

function formatPoints(pts: number): string {
  return pts.toLocaleString('es-MX');
}

const podiumColors = [
  { border: '#F2C166', bg: '#F2C166', text: '#234032' },
  { border: '#F2D194', bg: '#F2D194', text: '#234032' },
  { border: '#D96E30', bg: '#D96E30', text: '#fff' },
];

export function RankingPodium({ meseros }: { meseros: RankingMesero[] }) {
  const topThree = meseros.slice(0, 3);
  if (topThree.length === 0) return null;

  // Visual order: [2nd, 1st, 3rd]
  const podiumOrdered = [topThree[1], topThree[0], topThree[2]].filter(Boolean) as RankingMesero[];

  return (
    <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-16 items-end">
      {podiumOrdered.map((mesero, idx) => {
        const visualRank = idx === 0 ? 2 : idx === 1 ? 1 : 3;
        const isFirst = visualRank === 1;
        const style = podiumColors[visualRank - 1];
        const displayName = mesero.user?.name || mesero.nombre;

        return (
          <article
            key={mesero.id}
            className={`${
              isFirst
                ? 'order-1 lg:order-2 bg-pop-cardGreen p-10 rounded-2xl border-t-8 border-pop-gold relative lg:-translate-y-8 ring-4 ring-pop-gold/10 scale-105 shadow-2xl shadow-pop-gold/5 group hover:bg-[#252424] transition-all'
                : `order-${visualRank} lg:order-${visualRank === 2 ? 1 : 3} bg-pop-cardGreen/80 backdrop-blur-md p-8 rounded-2xl border-t-4 relative group hover:bg-[#252424] transition-all`
            }`}
            style={!isFirst ? { borderTopColor: style.border } : undefined}
          >
            <div
              className={`absolute ${isFirst ? '-top-10 left-1/2 -translate-x-1/2 w-16 h-16 text-3xl shadow-[0_0_30px_rgba(242,199,119,0.3)]' : '-top-6 w-12 h-12 text-xl shadow-lg'} ${visualRank === 2 ? 'left-8' : visualRank === 3 ? 'right-8' : ''} rounded-full flex items-center justify-center font-black`}
              style={{ backgroundColor: style.bg, color: style.text }}
            >
              {visualRank}
            </div>
            <div className="text-center">
              <div className={`${isFirst ? 'w-24 h-24 text-4xl border-4 border-pop-gold bg-pop-gold/10' : 'w-20 h-20 text-2xl border-2 border-white/10 bg-white/5'} rounded-full mx-auto mb-4 flex items-center justify-center font-bold text-gray-400 group-hover:scale-110 transition-transform`}>
                {getInitials(displayName)}
              </div>
              <h3 className={`${isFirst ? 'text-3xl tracking-tighter' : 'text-2xl tracking-tight'} font-black text-white uppercase`}>
                {displayName}
              </h3>
              <p className={`${isFirst ? 'text-pop-gold mt-2 mb-8 animate-pulse tracking-[0.3em]' : 'text-gray-500 mt-1 mb-6 tracking-widest'} text-[10px] font-black uppercase`}>
                {isFirst ? '👑 Top Performer' : getTier(mesero.puntos)}
              </p>
              <p className={`${isFirst ? 'text-6xl text-white' : 'text-4xl'} font-mono font-black`} style={{ color: isFirst ? undefined : style.border }}>
                {formatPoints(mesero.puntos)}
              </p>
              <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mt-2">Puntos Totales</p>
            </div>
          </article>
        );
      })}
    </section>
  );
}

export function getTier(pts: number): string {
  if (pts >= 5000) return 'Legend';
  if (pts >= 3000) return 'Master';
  if (pts >= 1500) return 'Pro';
  if (pts >= 500) return 'Rising';
  return 'Rookie';
}

export function getTierLabel(pts: number): string {
  if (pts >= 3000) return 'Master Mesero';
  if (pts >= 2000) return 'Expert Mesero';
  if (pts >= 1000) return 'Pro Mesero';
  return 'Mesero';
}
