"use client";

import { useAuth } from "@/lib/auth-provider";
import { useState } from "react";

const rewards = [
  { 
    id: 1, 
    title: "Refresco o Agua del Día", 
    cost: 150, 
    category: "bebidas",
    image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400&h=300&fit=crop",
    tier: "Fan"
  },
  { 
    id: 2, 
    title: "Orden de Papas Gajo", 
    cost: 350, 
    category: "entradas",
    image: "https://images.unsplash.com/photo-1573015084184-2ce27448d085?w=400&h=300&fit=crop",
    tier: "Fan"
  },
  { 
    id: 3, 
    title: "Roll California (10 pzas)", 
    cost: 500, 
    category: "sushi",
    image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&h=300&fit=crop",
    tier: "Lover"
  },
  { 
    id: 4, 
    title: "10 Alitas (Cualquier Salsa)", 
    cost: 750, 
    category: "wings",
    image: "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=400&h=300&fit=crop",
    tier: "Lover"
  },
  { 
    id: 5, 
    title: "Jarra de Clericot (1.5L)", 
    cost: 1200, 
    category: "bebidas",
    image: "https://images.unsplash.com/photo-1510626176961-4b57d4fbad03?w=400&h=300&fit=crop",
    tier: "VIP"
  },
  { 
    id: 6, 
    title: "Cena Completa (2 Personas)", 
    cost: 2500, 
    category: "experiencias",
    image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400&h=300&fit=crop",
    tier: "Elite"
  },
];

export default function RecompensasPage() {
  const { session } = useAuth();
  const userPoints = 1250; // Mocked
  const [filter, setFilter] = useState<string>("todos");

  const filteredRewards = filter === "todos" 
    ? rewards 
    : rewards.filter(r => r.category === filter);

  return (
    <main className="pt-24 lg:pt-32 p-4 lg:p-12 max-w-7xl mx-auto space-y-12">
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
           <p className="text-4xl font-black text-pop-gold font-epilogue tracking-tighter leading-none">{userPoints.toLocaleString()}</p>
           <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.3em] mt-1">Tus Puntos POP</p>
        </div>
      </header>

      {/* Categories & Navigation */}
      <nav className="flex flex-wrap justify-center lg:justify-start gap-4 lg:gap-8">
        {["todos", "sushi", "wings", "bebidas", "entradas", "experiencias"].map((cat) => (
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

      {/* Rewards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredRewards.map((reward) => {
          const isAffordable = userPoints >= reward.cost;
          return (
            <article 
              key={reward.id} 
              className={`group bg-[#1C1B1B] rounded-3xl overflow-hidden border border-white/5 transition-all flex flex-col ${
                !isAffordable ? "opacity-75" : "hover:border-pop-gold/30 hover:shadow-[0_0_30px_rgba(242,199,119,0.05)]"
              }`}
            >
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={reward.image} 
                  alt={reward.title} 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute top-4 right-4 bg-pop-black/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 flex items-center gap-2">
                   <span className="material-symbols-outlined text-pop-gold text-sm">stars</span>
                   <span className="text-sm font-black text-white">{reward.cost} pts</span>
                </div>
                {!isAffordable && (
                   <div className="absolute inset-0 bg-pop-black/60 backdrop-blur-sm flex flex-center items-center justify-center">
                      <div className="bg-pop-black/80 p-4 rounded-2xl border border-white/10 flex flex-col items-center gap-2">
                         <span className="material-symbols-outlined text-white/40 text-3xl">lock</span>
                         <p className="text-[10px] font-black text-white uppercase tracking-widest">Faltan {reward.cost - userPoints} pts</p>
                      </div>
                   </div>
                )}
              </div>
              
              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2">
                     <span className="text-[9px] font-black text-pop-orange uppercase tracking-widest">{reward.category}</span>
                     <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded">Nivel {reward.tier}</span>
                  </div>
                  <h3 className="text-base lg:text-lg font-black text-white uppercase leading-tight">{reward.title}</h3>
                </div>

                <button 
                  disabled={!isAffordable}
                  className={`w-full py-4 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all ${
                    isAffordable 
                      ? "bg-white/5 text-pop-gold border border-pop-gold/20 hover:bg-pop-gold hover:text-pop-black" 
                      : "bg-transparent text-gray-600 border border-white/5 cursor-not-allowed"
                  }`}
                >
                  {isAffordable ? "¡Lo quiero!" : "Puntos Insuficientes"}
                </button>
              </div>
            </article>
          );
        })}
      </div>

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
            <a href="/puntos" className="block w-full text-center py-5 bg-pop-orange text-white font-black uppercase text-xs tracking-[0.2em] rounded-2xl hover:brightness-110 transition-all shadow-[0_10px_30px_rgba(217,103,37,0.3)]">
               Ver mi progreso de nivel
            </a>
         </div>
      </section>
    </main>
  );
}
