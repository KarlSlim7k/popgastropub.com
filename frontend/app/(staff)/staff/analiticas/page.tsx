"use client";

import React from 'react';

export default function StaffAnalyticsPage() {
  return (
    <main className="pt-24 lg:pt-20 p-6 lg:p-10 min-h-screen bg-pop-black">
      {/* Header */}
      <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl lg:text-5xl font-black tracking-tighter text-white font-epilogue uppercase">
            Mis Analíticas
          </h1>
          <p className="text-pop-orange mt-2 text-xs font-bold uppercase tracking-[0.3em]">
            Rendimiento individual • POP Bar Stars
          </p>
        </div>
        <div className="flex bg-white/5 p-1 rounded-lg border border-white/10">
          <button className="px-4 py-2 bg-pop-gold text-pop-black text-[10px] font-black uppercase tracking-widest rounded-md">Esta Semana</button>
          <button className="px-4 py-2 text-gray-500 hover:text-white text-[10px] font-bold uppercase tracking-widest rounded-md transition-colors">Mes Pasado</button>
        </div>
      </header>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8 overflow-hidden">
        {/* Main Chart Area */}
        <section className="lg:col-span-3 space-y-8">
          {/* Sales Chart Mockup */}
          <article className="bg-[#1C1B1B] p-8 rounded-xl border border-white/5 min-h-[400px] flex flex-col">
            <h3 className="text-xl font-black uppercase font-epilogue tracking-tighter text-white mb-10">Ventas por Día</h3>
            <div className="flex-1 flex items-end justify-between gap-1 sm:gap-4 px-4">
              {[65, 45, 85, 30, 95, 70, 50].map((height, i) => (
                <div key={i} className="flex-1 flex flex-col items-center group">
                  <div 
                    className="w-full bg-gradient-to-t from-pop-orange/40 to-pop-gold rounded-t-sm group-hover:from-pop-orange group-hover:to-pop-lightGold transition-all duration-300 relative" 
                    style={{ height: `${height}%` }}
                  >
                    <span className="absolute -top-10 left-1/2 -translate-x-1/2 text-xs font-mono font-bold text-pop-gold opacity-0 group-hover:opacity-100 transition-opacity">
                      ${height * 10}
                    </span>
                  </div>
                  <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-4">
                    {['L', 'M', 'M', 'J', 'V', 'S', 'D'][i]}
                  </span>
                </div>
              ))}
            </div>
          </article>

          {/* Secondary Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <article className="bg-[#1C1B1B] p-8 rounded-xl border border-white/5">
              <h3 className="text-lg font-black uppercase font-epilogue tracking-tighter text-white mb-6">Eficiencia de Servicio</h3>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-[10px] text-gray-400 font-bold uppercase">Tiempo promedio de atención</span>
                    <span className="text-xs text-pop-gold font-bold">18 min</span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-pop-gold w-[82%]" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-[10px] text-gray-400 font-bold uppercase">Calificación Promedio</span>
                    <span className="text-xs text-pop-gold font-bold">4.8 ★</span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-pop-gold w-[96%]" />
                  </div>
                </div>
              </div>
            </article>

            <article className="bg-[#1C1B1B] p-8 rounded-xl border border-white/5">
              <h3 className="text-lg font-black uppercase font-epilogue tracking-tighter text-white mb-6">Categorías Estrella</h3>
              <div className="space-y-4">
                 <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5">
                   <span className="text-xs font-bold text-white uppercase tracking-wider">Cocktails</span>
                   <span className="text-xs text-pop-orange font-bold">+25%</span>
                 </div>
                 <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5">
                   <span className="text-xs font-bold text-white uppercase tracking-wider">Sushi Rolls</span>
                   <span className="text-xs text-pop-orange font-bold">+12%</span>
                 </div>
                 <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5">
                   <span className="text-xs font-bold text-white uppercase tracking-wider">Appetizers</span>
                   <span className="text-xs text-pop-orange font-bold">+05%</span>
                 </div>
              </div>
            </article>
          </div>
        </section>

        {/* Sidebar Mini Profile Stats */}
        <aside className="space-y-8">
          <article className="bg-[#1C1B1B] p-8 rounded-xl border border-white/5 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-pop-gold/10 blur-[60px] rounded-full" />
             <h3 className="text-lg font-black uppercase font-epilogue tracking-tighter text-white mb-8">Puntos Totales</h3>
             <p className="text-6xl font-black text-white tracking-tighter font-epilogue mb-2">12,450</p>
             <p className="text-[10px] text-pop-orange font-bold uppercase tracking-[0.2em] mb-8">Acumulado Histórico</p>

             <div className="space-y-4 pt-6 border-t border-white/5">
               <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest text-center">Próxima Recompensa</p>
               <div className="p-4 bg-pop-gold/10 rounded-lg text-center border border-pop-gold/20">
                 <span className="material-symbols-outlined text-pop-gold mb-2">military_tech</span>
                 <p className="text-xs font-bold text-white uppercase tracking-wider">Bono de Desempeño</p>
                 <p className="text-[10px] text-pop-gold font-bold mt-1">Faltan 550 pts</p>
               </div>
             </div>
          </article>

          <button className="w-full py-5 bg-pop-gold text-pop-black font-black uppercase text-xs tracking-[0.2em] rounded-lg hover:bg-pop-lightGold transition-all">
            Descargar Reporte Semanal
          </button>
        </aside>
      </div>
    </main>
  );
}
