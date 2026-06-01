"use client";

import React from 'react';
import { RankingMesero, getTierLabel } from './RankingPodium';

function getInitials(name: string): string {
  return name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
}

function formatPoints(pts: number): string {
  return pts.toLocaleString('es-MX');
}

export function RankingTable({ meseros, startRank = 4 }: { meseros: RankingMesero[]; startRank?: number }) {
  if (meseros.length === 0) {
    return (
      <div className="p-10 text-center">
        <p className="text-gray-500 text-sm">No hay más meseros en el ranking.</p>
      </div>
    );
  }

  return (
    <div className="bg-pop-cardGreen overflow-hidden rounded-2xl border border-white/5">
      <div className="p-8 border-b border-white/5">
        <h2 className="text-2xl font-black uppercase font-epilogue tracking-tighter text-white">Tabla General</h2>
      </div>
      <div className="overflow-x-auto min-w-full">
        <table className="w-full text-left">
          <tbody>
            {meseros.map((mesero, index) => {
              const rank = index + startRank;
              const displayName = mesero.user?.name || mesero.nombre;
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
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{getTierLabel(mesero.puntos)}</p>
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
    </div>
  );
}
