"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { fetchAPI } from "@/lib/api";

interface Producto {
  id: number;
  nombre: string;
  descripcion?: string;
  precio: number;
  categoria: string;
  imagen?: string;
  disponible: boolean;
  destacado?: boolean;
}

const FOODBOOKING_URL =
  "https://www.foodbooking.com/ordering/restaurant/menu?company_uid=04f4d10b-2c07-4411-895d-4437eb890919&restaurant_uid=499ca112-e4ea-46f4-8990-47d5b58748ae&facebook=true";

export default function MenuPage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("Todos");

  useEffect(() => {
    fetchAPI<Producto[]>("/menu")
      .then(setProductos)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const categories = ["Todos", ...Array.from(new Set(productos.map((p) => p.categoria)))];
  const filtered = activeCategory === "Todos" ? productos : productos.filter((p) => p.categoria === activeCategory);

  return (
    <main className="min-h-screen bg-[#0D0D0D] pt-20 pb-32">
      {/* Hero */}
      <section className="relative h-[400px] flex items-center justify-center overflow-hidden">
        <Image alt="Sushi POP Perote" src="/images/sushi_1.webp" fill className="object-cover brightness-[0.25]" priority />
        <div className="relative z-10 text-center px-4 space-y-4">
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white uppercase leading-none">
            Nuestro <span className="text-[#F2C777]">Menú</span>
          </h1>
          <p className="text-white/60 text-lg max-w-lg mx-auto">
            Más de 100 platillos esperándote. Sushi, alitas, boneless, crepas y mucho más.
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="max-w-6xl mx-auto px-6 mt-10">
        <div className="flex overflow-x-auto gap-3 pb-4 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                activeCategory === cat ? "bg-[#F2C777] text-[#0D0D0D]" : "bg-white/5 text-gray-400 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Products Grid */}
      <section className="max-w-6xl mx-auto px-6 mt-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-[#F2C777] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-sm">No hay productos disponibles en esta categoría.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((p) => (
              <article key={p.id} className="bg-[#1C1C1C] border border-white/5 rounded-xl overflow-hidden hover:border-[#F2C777]/20 transition-all group">
                {p.imagen && (
                  <div className="relative h-44 overflow-hidden">
                    <Image src={p.imagen} alt={p.nombre} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                )}
                <div className="p-5">
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <h3 className="text-white font-bold text-base">{p.nombre}</h3>
                    <span className="text-[#F2C777] font-black text-lg whitespace-nowrap">${p.precio}</span>
                  </div>
                  {p.descripcion && <p className="text-white/40 text-xs leading-relaxed line-clamp-2">{p.descripcion}</p>}
                  <span className="inline-block mt-3 text-[9px] font-black uppercase tracking-widest text-[#D96725]/80 bg-[#D96725]/10 px-2 py-1 rounded">
                    {p.categoria}
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* CTA - FoodBooking */}
      <section className="max-w-3xl mx-auto px-6 mt-20 text-center space-y-8">
        <div className="bg-[#1C1C1C] border border-white/5 rounded-2xl p-12 space-y-6">
          <h2 className="text-3xl font-black text-white tracking-tight">Ordena directo desde tu celular</h2>
          <p className="text-white/50 max-w-md mx-auto text-sm">
            Personaliza tu orden y recógela en el restaurante o pide a domicilio.
          </p>
          <a
            href={FOODBOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-[#D96725] hover:bg-[#F2C777] hover:text-[#0D0D0D] text-white font-black uppercase tracking-widest text-sm px-10 py-4 rounded-sm transition-all duration-300"
          >
            <span className="material-symbols-outlined">shopping_bag</span>
            Ordenar Ahora
          </a>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <span className="text-white/40 text-sm">¿Prefieres ordenar por WhatsApp?</span>
          <a
            href="https://wa.me/522821278014?text=Hola%20POP%20Perote%2C%20quiero%20hacer%20un%20pedido"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 border border-[#F2C777]/20 text-[#F2C777] font-bold text-sm px-6 py-3 rounded-sm hover:bg-[#F2C777]/10 transition-all"
          >
            <span className="material-symbols-outlined text-base">chat</span>
            Ordenar por WhatsApp
          </a>
        </div>
      </section>
    </main>
  );
}
