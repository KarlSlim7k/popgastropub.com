"use client";

import { useState } from "react";

// Types
interface Waiter {
  rank: number;
  initials: string;
  name: string;
  status: "activo" | "inactivo" | "descanso";
  cocktailPoints: number;
  premiumPoints: number;
  pitcherPoints: number;
  bottlePoints: number;
  comboPoints: number;
  upsellPoints: number;
  ratingPoints: number;
  totalPoints: number;
  totalSales: number;
  ordersServed: number;
  avgRating: number;
}

export default function AdminMeserosPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<"semana" | "mes" | "todo">("mes");
  const [showConfigModal, setShowConfigModal] = useState(false);

  const waiters: Waiter[] = [
    { rank: 1, initials: "RG", name: "Ricardo García", status: "activo", cocktailPoints: 850, premiumPoints: 450, pitcherPoints: 300, bottlePoints: 200, comboPoints: 350, upsellPoints: 150, ratingPoints: 150, totalPoints: 2450, totalSales: 128, ordersServed: 142, avgRating: 4.9 },
    { rank: 2, initials: "SL", name: "Sofía Luna", status: "activo", cocktailPoints: 720, premiumPoints: 380, pitcherPoints: 250, bottlePoints: 150, comboPoints: 280, upsellPoints: 90, ratingPoints: 150, totalPoints: 1920, totalSales: 98, ordersServed: 128, avgRating: 4.8 },
    { rank: 3, initials: "MA", name: "Marco Antonio Ruiz", status: "descanso", cocktailPoints: 600, premiumPoints: 300, pitcherPoints: 200, bottlePoints: 100, comboPoints: 250, upsellPoints: 130, ratingPoints: 150, totalPoints: 1680, totalSales: 86, ordersServed: 115, avgRating: 4.7 },
  ];

  const getRankBadge = (rank: number) => {
    if (rank === 1) return "bg-pop-gold text-pop-black";
    if (rank === 2) return "bg-gray-300 text-pop-black";
    if (rank === 3) return "bg-pop-orange text-pop-black";
    return "bg-gray-700 text-gray-300";
  };

  const getStatusBadge = (status: Waiter["status"]) => {
    const styles = {
      activo: "bg-pop-gold/10 text-pop-gold border-pop-gold/20",
      inactivo: "bg-gray-600/10 text-gray-400 border-gray-600/20",
      descanso: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    };
    return (
      <span className={`text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest border ${styles[status]}`}>
        {status}
      </span>
    );
  };

  return (
    <main className="pt-24 lg:pt-20 p-4 lg:p-10 min-h-screen bg-pop-black">
      {/* Responsive Header */}
      <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl lg:text-7xl font-black tracking-tighter text-white font-epilogue uppercase leading-none flex items-center gap-4">
             Bar Stars
          </h1>
          <p className="text-pop-orange mt-2 text-xs font-bold uppercase tracking-[0.3em]">Gestión de Performance Staff</p>
        </div>
        <div className="flex w-full md:w-auto gap-2">
          <button onClick={() => setShowConfigModal(true)} className="flex-1 md:flex-none px-6 py-4 bg-white/5 border border-white/10 text-pop-gold text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-pop-gold/10 transition-all">
            Ajustar Puntos
          </button>
        </div>
      </header>

      {/* Period Selector - Mobile Scrollable */}
      <div className="flex bg-[#1C1B1B] p-1 rounded-xl border border-white/5 mb-8 w-fit overflow-x-auto no-scrollbar">
        {(["semana", "mes", "todo"] as const).map(p => (
           <button 
             key={p} 
             onClick={() => setSelectedPeriod(p)}
             className={`px-6 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all whitespace-nowrap ${selectedPeriod === p ? 'bg-pop-gold text-pop-black' : 'text-gray-500 hover:text-white'}`}
           >
             {p === 'semana' ? 'Esta Semana' : p === 'mes' ? 'Este Mes' : 'Histórico'}
           </button>
        ))}
      </div>

      {/* Vertical/Horizontal Podium */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12 items-end">
        {/* Podium Order: 2, 1, 3 for Desktop | 1, 2, 3 for Mobile */}
        {[waiters[1], waiters[0], waiters[2]].map((w, idx) => {
          if (!w) return null;
          const isWinner = w.rank === 1;
          return (
            <article 
              key={w.rank} 
              className={`relative bg-[#1C1B1B] p-8 lg:p-10 rounded-3xl border transition-all flex flex-col items-center text-center ${
                isWinner ? 'border-pop-gold lg:py-16 shadow-[0_0_40px_rgba(242,199,119,0.1)] lg:-translate-y-4' : 'border-white/5'
              } ${w.rank === 2 ? 'order-2 lg:order-1' : w.rank === 1 ? 'order-1 lg:order-2' : 'order-3'}`}
            >
              {isWinner && <span className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-pop-gold text-pop-black text-[10px] font-black uppercase tracking-[0.2em] rounded-full shadow-lg">Líder Actual</span>}
              <div className={`w-20 h-20 lg:w-24 lg:h-24 rounded-full flex items-center justify-center font-black text-2xl lg:text-3xl border-4 mb-6 ${
                w.rank === 1 ? 'border-pop-gold text-pop-gold' : w.rank === 2 ? 'border-gray-400 text-white' : 'border-pop-orange text-pop-orange'
              }`}>
                {w.initials}
              </div>
              <h3 className="text-xl lg:text-2xl font-black text-white uppercase font-epilogue leading-none">{w.name}</h3>
              <p className="text-4xl lg:text-5xl font-black text-pop-gold mt-4 tracking-tighter font-epilogue">{w.totalPoints.toLocaleString()}</p>
              <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] mt-1">Puntos Acumulados</p>
              
              <div className="grid grid-cols-2 gap-8 mt-8 pt-8 border-t border-white/5 w-full">
                 <div>
                    <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest">Órdenes</p>
                    <p className="text-lg font-black text-white">{w.ordersServed}</p>
                 </div>
                 <div>
                    <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest">Rating</p>
                    <p className="text-lg font-black text-pop-gold flex items-center justify-center gap-1">
                      {w.avgRating} <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    </p>
                 </div>
              </div>
            </article>
          );
        })}
      </section>

      {/* Full Ranking - Desktop Table / Mobile Cards */}
      <h2 className="text-xs font-black text-gray-500 uppercase tracking-[0.3em] mb-6">Ranking del Equipo</h2>
      <div className="space-y-4">
        {/* Desktop Header */}
        <div className="hidden lg:grid grid-cols-6 gap-4 px-10 py-5 bg-white/[0.02] text-[10px] font-black uppercase text-gray-400 tracking-widest border-b border-white/5">
           <div># Posición</div>
           <div className="col-span-2">Nombre / Estado</div>
           <div>Cócteles</div>
           <div>Otros Puntos</div>
           <div className="text-right">Total</div>
        </div>

        {/* List Items */}
        {waiters.map(w => (
          <article key={w.rank} className="bg-[#1C1B1B] lg:bg-transparent rounded-2xl lg:rounded-none p-5 lg:p-0 border border-white/5 lg:border-none lg:grid lg:grid-cols-6 lg:gap-4 lg:px-10 lg:py-6 lg:items-center hover:bg-white/[0.02] transition-all">
             {/* Mobile Rank + Desktop Pos */}
             <div className="flex items-center justify-between lg:block mb-4 lg:mb-0">
               <span className={`w-8 h-8 lg:w-10 lg:h-10 rounded-full flex items-center justify-center font-black text-xs ${getRankBadge(w.rank)}`}>
                 {w.rank}
               </span>
               <div className="lg:hidden">{getStatusBadge(w.status)}</div>
             </div>

             {/* Identity */}
             <div className="lg:col-span-2 flex items-center gap-4 mb-6 lg:mb-0">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center font-black text-xs text-gray-400 border border-white/10">
                  {w.initials}
                </div>
                <div>
                   <p className="text-base lg:text-sm font-black text-white uppercase">{w.name}</p>
                   <div className="hidden lg:block mt-2">{getStatusBadge(w.status)}</div>
                </div>
             </div>

             {/* Mobile Detail Sections */}
             <div className="grid grid-cols-2 lg:block gap-4 mb-6 lg:mb-0 pt-6 border-t lg:border-none border-white/5">
                <div>
                   <p className="lg:hidden text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">Cócteles</p>
                   <p className="text-sm font-black text-white font-mono">{w.cocktailPoints} <span className="text-[10px] text-gray-500 font-bold ml-1">pts</span></p>
                </div>
                <div className="text-right lg:text-left">
                   <p className="lg:hidden text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">Premium/Combos</p>
                   <p className="text-sm font-bold text-white font-mono">{w.premiumPoints + w.comboPoints} <span className="text-[10px] text-gray-500 font-bold ml-1">pts</span></p>
                </div>
             </div>

             <div className="flex items-center justify-between lg:justify-end gap-3 pt-6 lg:pt-0 border-t lg:border-none border-white/5">
                <div className="lg:hidden">
                   <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Total Puntos</p>
                </div>
                <p className="text-2xl lg:text-base font-black text-pop-gold font-epilogue lg:font-mono">{w.totalPoints.toLocaleString()}</p>
             </div>
          </article>
        ))}
      </div>

      {/* Config Modal - Mobile Friendly */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-pop-black/95 backdrop-blur-xl" onClick={() => setShowConfigModal(false)} />
          <div className="relative bg-[#1C1B1B] border border-white/10 w-full max-w-xl rounded-[2.5rem] overflow-hidden shadow-2xl">
             <header className="p-8 lg:p-10 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
                <div>
                   <h2 className="text-2xl font-black text-white uppercase font-epilogue tracking-tighter">Ajustar Sistema</h2>
                   <p className="text-[10px] text-pop-orange font-bold uppercase tracking-widest mt-1">Configuración de Puntuación POP</p>
                </div>
                <button onClick={() => setShowConfigModal(false)} className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center text-gray-500 hover:text-white transition-colors">
                   <span className="material-symbols-outlined">close</span>
                </button>
             </header>
             <div className="p-8 lg:p-10 space-y-6 max-h-[60vh] overflow-y-auto no-scrollbar">
                {[
                  { label: "Cóctel / Margarita", value: 10 },
                  { label: "Bebida Premium", value: 15 },
                  { label: "Botella Completa", value: 50 },
                  { label: "Upselling Combo", value: 20 },
                ].map((c, i) => (
                  <div key={i} className="flex items-center justify-between bg-white/[0.02] p-5 rounded-2xl border border-white/5">
                     <span className="text-xs font-black text-white uppercase tracking-widest">{c.label}</span>
                     <div className="flex items-center gap-3">
                        <span className="text-[10px] font-bold text-pop-gold">PTS</span>
                        <input type="number" defaultValue={c.value} className="w-20 bg-pop-black border border-white/10 rounded-xl p-3 text-center text-white font-black text-sm outline-none focus:border-pop-gold" />
                     </div>
                  </div>
                ))}
             </div>
             <footer className="p-8 lg:p-10 border-t border-white/5 flex gap-4">
                <button onClick={() => setShowConfigModal(false)} className="flex-1 py-4 text-xs font-black text-gray-500 uppercase tracking-widest">Descartar</button>
                <button className="flex-[2] py-5 bg-pop-gold text-pop-black text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-pop-lightGold shadow-xl">Guardar Cambios</button>
             </footer>
          </div>
        </div>
      )}
    </main>
  );
}
