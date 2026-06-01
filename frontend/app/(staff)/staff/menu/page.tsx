"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from "@/lib/auth-provider";
import { fetchWithAuth } from "@/lib/api";

interface MenuItem { id: number; nombre: string; categoria: string; precio: number; disponible: boolean; stock: number; }

export default function StaffMenuPage() {
  const { session } = useAuth();
  const [items, setItems] = useState<MenuItem[]>([]);
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!session?.token) return;
    setLoading(true);
    fetchWithAuth<MenuItem[]>('/staff/menu', session.token)
      .then(setItems)
      .catch((e) => setError(e.message || 'Error al cargar menú'))
      .finally(() => setLoading(false));
  }, [session?.token]);

  const toggleDisponibilidad = async (id: number) => {
    if (!session?.token) return;
    try {
      const res = await fetchWithAuth<{ id: number; disponible: boolean }>(`/staff/menu/${id}/disponibilidad`, session.token, { method: "PATCH" });
      setItems(prev => prev.map(i => i.id === id ? { ...i, disponible: res.disponible } : i));
    } catch {}
  };

  const categories = ["Todos", ...Array.from(new Set(items.map(i => i.categoria)))];
  const filtered = items.filter(i => {
    const matchCat = activeCategory === "Todos" || i.categoria === activeCategory;
    const matchSearch = !search || i.nombre.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <main className="pt-24 lg:pt-20 p-6 lg:p-10 min-h-screen bg-pop-black">
      <header className="mb-10">
        <h1 className="text-4xl lg:text-5xl font-black tracking-tighter text-white font-epilogue uppercase">Consulta de Carta</h1>
        <p className="text-gray-400 mt-3 text-base font-manrope">Consulta precios y disponibilidad en tiempo real.</p>
      </header>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-pop-gold border-t-transparent rounded-full animate-spin" />
        </div>
      ) : error ? (
        <div className="text-center py-20">
          <p className="text-red-400 text-sm mb-4">{error}</p>
          <button onClick={() => window.location.reload()} className="px-6 py-3 bg-pop-gold text-pop-black font-black uppercase text-xs tracking-widest rounded-lg">Reintentar</button>
        </div>
      ) : (
      <>
      <div className="mb-6">
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar platillo..." className="w-full max-w-md bg-pop-cardGreen border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-pop-gold/50" />
      </div>

      <div className="flex overflow-x-auto gap-4 mb-8 pb-4 no-scrollbar">
        {categories.map((cat) => (
          <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeCategory === cat ? "bg-pop-gold text-pop-black" : "bg-white/5 text-gray-400 hover:text-white"}`}>{cat}</button>
        ))}
      </div>

      <section className="bg-pop-cardGreen p-8 rounded-xl border border-white/5">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5 text-[10px] uppercase tracking-[0.2em] text-gray-500">
                <th className="pb-4 font-bold">Platillo</th>
                <th className="pb-4 font-bold">Categoría</th>
                <th className="pb-4 font-bold">Precio</th>
                <th className="pb-4 font-bold">Stock</th>
                <th className="pb-4 text-right font-bold">Disponibilidad</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="py-6"><span className="text-lg font-bold text-white group-hover:text-pop-gold transition-colors">{item.nombre}</span></td>
                  <td className="py-6"><span className="text-[10px] font-black uppercase tracking-widest text-pop-orange/80">{item.categoria}</span></td>
                  <td className="py-6 font-mono text-white font-bold">${item.precio.toFixed(2)}</td>
                  <td className="py-6"><span className="text-xs text-gray-400">{item.stock}%</span></td>
                  <td className="py-6 text-right">
                    <button onClick={() => toggleDisponibilidad(item.id)} className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${item.disponible ? "bg-green-500/10 text-green-400 hover:bg-green-500/20" : "bg-red-500/10 text-red-400 hover:bg-red-500/20"}`}>
                      {item.disponible ? "Disponible" : "Agotado"}
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={5} className="py-10 text-center text-gray-500 text-xs uppercase">Sin platillos</td></tr>}
            </tbody>
          </table>
        </div>
      </section>
      </>
      )}
    </main>
  );
}
