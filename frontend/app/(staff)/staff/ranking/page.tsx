"use client";

import React from 'react';

const podio = [
  { rank: 1, name: "Sofía V.", pts: "3,120", category: "Master Mesero", color: "#F2C777", avatar: "SV" },
  { rank: 2, name: "Ricardo S.", pts: "2,840", category: "Expert Mesero", color: "#F2C894", avatar: "RS" },
  { rank: 3, name: "Marcos L.", pts: "2,310", category: "Pro Mesero", color: "#D96725", avatar: "ML" },
];

const otherWaiters = [
  { rank: 4, name: "Elena T.", pts: "1,890", category: "Pro", avatar: "ET" },
  { rank: 5, name: "Daniel C.", pts: "1,450", category: "Senior", avatar: "DC" },
  { rank: 6, name: "Laura M.", pts: "1,200", category: "Junior", avatar: "LM" },
];

export default function RankingPage() {
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

      {/* Podium - Mobile Stacks, Tablet/Desktop Podium Visual */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-16 items-end">
        {/* 2nd Place */}
        <article className="order-2 lg:order-1 bg-[#1C1B1B]/80 backdrop-blur-md p-8 rounded-2xl border-t-4 border-[#F2C894] relative group hover:bg-[#252424] transition-all">
          <div className="absolute -top-6 left-8 w-12 h-12 bg-[#F2C894] rounded-full flex items-center justify-center text-pop-black font-black text-xl shadow-lg">2</div>
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-white/5 mx-auto mb-4 border-2 border-white/10 flex items-center justify-center text-2xl font-bold text-gray-400 group-hover:scale-110 transition-transform">
              {podio[1].avatar}
            </div>
            <h3 className="text-2xl font-black text-white uppercase tracking-tight">{podio[1].name}</h3>
            <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mt-1 mb-6">{podio[1].category}</p>
            <p className="text-4xl font-mono font-black text-[#F2C894]">{podio[1].pts}</p>
            <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Puntos Totales</p>
          </div>
        </article>

        {/* 1st Place - Higher and more prominent */}
        <article className="order-1 lg:order-2 bg-[#1C1B1B] p-10 rounded-2xl border-t-8 border-pop-gold relative lg:-translate-y-8 ring-4 ring-pop-gold/10 scale-105 shadow-2xl shadow-pop-gold/5 group hover:bg-[#252424] transition-all">
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-16 h-16 bg-pop-gold rounded-full flex items-center justify-center text-pop-black font-black text-3xl shadow-[0_0_30px_rgba(242,199,119,0.3)]">1</div>
          <div className="text-center">
            <div className="w-24 h-24 rounded-full bg-pop-gold/10 mx-auto mb-6 border-4 border-pop-gold flex items-center justify-center text-4xl font-black text-pop-gold group-hover:scale-110 transition-transform">
              {podio[0].avatar}
            </div>
            <h3 className="text-3xl font-black text-white uppercase tracking-tighter">{podio[0].name}</h3>
            <p className="text-[10px] text-pop-gold font-black uppercase tracking-[0.3em] mt-2 mb-8 animate-pulse">👑 Top Performer</p>
            <p className="text-6xl font-mono font-black text-white text-glow">{podio[0].pts}</p>
            <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mt-2">Puntos Totales</p>
          </div>
        </article>

        {/* 3rd Place */}
        <article className="order-3 bg-[#1C1B1B]/80 backdrop-blur-md p-8 rounded-2xl border-t-4 border-[#D96725] relative group hover:bg-[#252424] transition-all">
          <div className="absolute -top-6 right-8 w-12 h-12 bg-[#D96725] rounded-full flex items-center justify-center text-white font-black text-xl shadow-lg">3</div>
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-white/5 mx-auto mb-4 border-2 border-white/10 flex items-center justify-center text-2xl font-bold text-gray-400 group-hover:scale-110 transition-transform">
              {podio[2].avatar}
            </div>
            <h3 className="text-2xl font-black text-white uppercase tracking-tight">{podio[2].name}</h3>
            <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mt-1 mb-6">{podio[2].category}</p>
            <p className="text-4xl font-mono font-black text-[#D96725]">{podio[2].pts}</p>
            <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Puntos Totales</p>
          </div>
        </article>
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
                  {otherWaiters.map((waiter) => (
                    <tr key={waiter.rank} className="group hover:bg-white/[0.02] transition-colors border-b border-white/5 last:border-0">
                      <td className="py-6 px-8">
                        <span className="text-lg font-mono font-bold text-gray-500 group-hover:text-pop-gold transition-colors">{waiter.rank}</span>
                      </td>
                      <td className="py-6 px-4">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-xs font-bold text-gray-400 border border-white/10">{waiter.avatar}</div>
                          <div>
                            <p className="text-base font-bold text-white uppercase tracking-tight">{waiter.name}</p>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{waiter.category}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-6 px-4 text-right pr-12">
                         <p className="text-xl font-mono font-black text-white group-hover:text-pop-gold transition-colors">{waiter.pts} pt</p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-6 bg-white/[0.01] text-center">
              <button className="text-[10px] font-black uppercase tracking-[0.3em] text-pop-gold hover:text-white transition-colors">Cargar equipo completo</button>
            </div>
          </div>
        </section>

        {/* Sidebar Stats & Badges */}
        <aside className="space-y-10">
          {/* Personal Goal Progress */}
          <article className="bg-pop-gold p-8 rounded-2xl text-pop-black relative overflow-hidden group">
            <div className="relative z-10">
              <h4 className="text-[10px] font-black uppercase tracking-widest mb-2 opacity-60">Tu Progreso</h4>
              <p className="text-3xl font-black uppercase tracking-tighter mb-6">Faltan 280 pts</p>
              <p className="text-xs font-bold font-manrope leading-tight mb-8">Estás a muy poco de superar a Sofía V. y reclamar el primer lugar. ¡Sigue así!</p>
              <div className="h-2 bg-pop-black/10 rounded-full overflow-hidden mb-2">
                <div className="h-full bg-pop-black w-[92%]" />
              </div>
              <div className="flex justify-between text-[9px] font-black uppercase tracking-widest">
                <span>92% del Objetivo</span>
                <span>Tier Master</span>
              </div>
            </div>
            {/* Background Icon decoration */}
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
