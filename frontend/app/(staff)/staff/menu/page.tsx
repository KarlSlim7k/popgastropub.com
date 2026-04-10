"use client";

import React, { useState } from 'react';

const categories = ["Todos", "Rolls Especiales", "Entradas", "Bebidas", "Postres"];

const menuItems = [
  { id: 1, name: "Filadelfia Roll", category: "Rolls Especiales", price: "$145.00", stock: true },
  { id: 2, name: "Maki de Atún", category: "Rolls Especiales", price: "$165.00", stock: true },
  { id: 3, name: "Alitas BBQ (10p)", category: "Entradas", price: "$120.00", stock: false },
  { id: 4, name: "Margarita Pop", category: "Bebidas", price: "$85.00", stock: true },
  { id: 5, name: "Crepa de Cajeta", category: "Postres", price: "$75.00", stock: true },
];

export default function StaffMenuPage() {
  const [activeCategory, setActiveCategory] = useState("Todos");

  const filteredItems = activeCategory === "Todos" 
    ? menuItems 
    : menuItems.filter(item => item.category === activeCategory);

  return (
    <main className="pt-24 lg:pt-20 p-6 lg:p-10 min-h-screen bg-pop-black">
      {/* Header */}
      <header className="mb-10">
        <h1 className="text-4xl lg:text-5xl font-black tracking-tighter text-white font-epilogue uppercase leading-none">
          Consulta de Carta
        </h1>
        <p className="text-gray-400 mt-3 text-base font-manrope">
          Consulta precios y disponibilidad en tiempo real para informar a los clientes.
        </p>
      </header>

      {/* Category Filter */}
      <div className="flex overflow-x-auto gap-4 mb-8 pb-4 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
              activeCategory === cat 
                ? "bg-pop-gold text-pop-black scale-105 shadow-lg shadow-pop-gold/20" 
                : "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Menu Grid */}
      <section className="bg-[#1C1B1B] p-8 rounded-xl border border-white/5">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5 text-[10px] uppercase tracking-[0.2em] text-gray-500">
                <th className="pb-4 font-bold">Platillo</th>
                <th className="pb-4 font-bold">Categoría</th>
                <th className="pb-4 font-bold">Precio</th>
                <th className="pb-4 text-right font-bold">Disponibilidad</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="py-6">
                    <span className="text-lg font-bold text-white group-hover:text-pop-gold transition-colors">{item.name}</span>
                  </td>
                  <td className="py-6">
                    <span className="text-[10px] font-black uppercase tracking-widest text-pop-orange/80">{item.category}</span>
                  </td>
                  <td className="py-6 font-mono text-white font-bold">{item.price}</td>
                  <td className="py-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                       <div className={`w-2 h-2 rounded-full ${item.stock ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]'}`} />
                       <span className={`text-[10px] font-black uppercase tracking-widest ${item.stock ? 'text-green-400' : 'text-red-400'}`}>
                         {item.stock ? 'Disponible' : 'Agotado'}
                       </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Quick Search Note */}
      <div className="mt-10 p-6 bg-pop-gold/5 border border-pop-gold/10 rounded-xl flex items-center gap-4">
        <span className="material-symbols-outlined text-pop-gold">info</span>
        <p className="text-sm text-gray-400 italic">
          Tip: Si un cliente pregunta por ingredientes, recuerda consultar la guía de alérgenos en la barra principal.
        </p>
      </div>
    </main>
  );
}
