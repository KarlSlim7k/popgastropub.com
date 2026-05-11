"use client";

import React, { useState } from 'react';
import { useAuth } from "@/lib/auth-provider";
import { fetchWithAuth } from "@/lib/api";

const DRINK_CATEGORIES = [
  { key: "cocktail", label: "Cóctel / Margarita", points: 10, icon: "local_bar" },
  { key: "premium", label: "Bebida Premium", points: 15, icon: "wine_bar" },
  { key: "pitcher", label: "Pitcher / Compartida", points: 25, icon: "sports_bar" },
  { key: "bottle", label: "Botella Completa", points: 50, icon: "liquor" },
  { key: "combo", label: "Combo Comida + Bebida", points: 20, icon: "restaurant" },
  { key: "upsell", label: "Upselling (Upgrade)", points: 15, icon: "trending_up" },
];

export default function StaffVentasPage() {
  const { session } = useAuth();
  const [selected, setSelected] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [todayPoints, setTodayPoints] = useState(0);
  const [todaySales, setTodaySales] = useState(0);

  const handleSubmit = async () => {
    if (!session?.token || !selected) return;
    const cat = DRINK_CATEGORIES.find(c => c.key === selected);
    if (!cat) return;

    setSubmitting(true);
    try {
      const totalPts = cat.points * quantity;
      await fetchWithAuth("/ranking/points", session.token, {
        method: "POST",
        body: JSON.stringify({
          mesero_id: undefined, // backend will use auth user's mesero
          points: totalPts,
          concepto: `${quantity}x ${cat.label}`,
          category: selected,
        }),
      });
      setTodayPoints(prev => prev + totalPts);
      setTodaySales(prev => prev + quantity);
      setToast(`+${totalPts} pts registrados`);
      setSelected(null);
      setQuantity(1);
      setTimeout(() => setToast(null), 3000);
    } catch (e: any) {
      setToast(e.message || "Error al registrar");
      setTimeout(() => setToast(null), 3000);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="pt-24 lg:pt-20 p-6 lg:p-10 min-h-screen bg-pop-black">
      <header className="mb-10">
        <h1 className="text-4xl lg:text-5xl font-black tracking-tighter text-white font-epilogue uppercase">Registrar Venta</h1>
        <p className="text-pop-orange mt-2 text-xs font-bold uppercase tracking-[0.3em]">POP Bar Stars • Suma puntos por cada bebida vendida</p>
      </header>

      {/* Today's Stats */}
      <div className="grid grid-cols-2 gap-4 mb-10">
        <div className="bg-[#1C1B1B] p-6 rounded-xl border border-white/5">
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Puntos Hoy</p>
          <p className="text-3xl font-black text-pop-gold font-epilogue">{todayPoints}</p>
        </div>
        <div className="bg-[#1C1B1B] p-6 rounded-xl border border-white/5">
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Ventas Hoy</p>
          <p className="text-3xl font-black text-white font-epilogue">{todaySales}</p>
        </div>
      </div>

      {/* Drink Categories */}
      <section className="mb-8">
        <h2 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-6">Selecciona tipo de venta</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {DRINK_CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setSelected(cat.key)}
              className={`p-6 rounded-xl border transition-all text-left ${selected === cat.key ? "bg-pop-gold/10 border-pop-gold" : "bg-[#1C1B1B] border-white/5 hover:border-pop-gold/30"}`}
            >
              <div className="flex items-center gap-4 mb-3">
                <span className={`material-symbols-outlined text-3xl ${selected === cat.key ? "text-pop-gold" : "text-gray-500"}`}>{cat.icon}</span>
                <div>
                  <p className="text-sm font-black text-white uppercase">{cat.label}</p>
                  <p className="text-xs text-pop-gold font-bold">+{cat.points} pts/unidad</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Quantity & Submit */}
      {selected && (
        <section className="bg-[#1C1B1B] p-8 rounded-xl border border-pop-gold/20 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Cantidad</p>
              <p className="text-sm text-gray-400 mt-1">{DRINK_CATEGORIES.find(c => c.key === selected)?.label}</p>
            </div>
            <div className="flex items-center gap-4">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center text-white hover:bg-white/10">
                <span className="material-symbols-outlined">remove</span>
              </button>
              <span className="text-3xl font-black text-white font-epilogue w-12 text-center">{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center text-white hover:bg-white/10">
                <span className="material-symbols-outlined">add</span>
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-6 border-t border-white/5">
            <div>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Total puntos</p>
              <p className="text-4xl font-black text-pop-gold font-epilogue">+{(DRINK_CATEGORIES.find(c => c.key === selected)?.points || 0) * quantity}</p>
            </div>
            <button onClick={handleSubmit} disabled={submitting} className="px-10 py-4 bg-pop-gold text-pop-black font-black uppercase text-xs tracking-widest rounded-xl hover:bg-pop-lightGold transition-all disabled:opacity-50 shadow-lg">
              {submitting ? "Registrando..." : "Registrar Venta"}
            </button>
          </div>
        </section>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-pop-gold text-pop-black px-6 py-3 rounded-xl font-black text-sm uppercase tracking-widest shadow-2xl animate-in fade-in slide-in-from-bottom z-50">
          {toast}
        </div>
      )}
    </main>
  );
}
