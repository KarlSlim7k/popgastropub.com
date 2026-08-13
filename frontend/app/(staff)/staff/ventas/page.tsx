"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from "@/lib/auth-provider";
import { fetchWithAuth } from "@/lib/api";

interface DrinkType {
  id: number;
  slug: string;
  label: string;
  points: number;
  icon: string;
}

export default function StaffVentasPage() {
  const { session } = useAuth();
  const [selected, setSelected] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [todayPoints, setTodayPoints] = useState(0);
  const [todaySales, setTodaySales] = useState(0);
  const [pendingSales, setPendingSales] = useState(0);
  const [drinkTypes, setDrinkTypes] = useState<DrinkType[]>([]);
  const [loadingTypes, setLoadingTypes] = useState(true);

  useEffect(() => {
    if (!session?.token) return;
    Promise.all([
      fetchWithAuth<{ stats: { ventas_hoy: number; bebidas_vendidas: number; ventas_pendientes: number } }>("/staff/dashboard", session.token),
      fetchWithAuth<DrinkType[]>("/ranking/drink-types", session.token),
    ])
      .then(([data, types]) => {
        if (data?.stats) {
          setTodayPoints(data.stats.ventas_hoy);
          setTodaySales(data.stats.bebidas_vendidas);
          setPendingSales(data.stats.ventas_pendientes);
        }
        setDrinkTypes(types);
      })
      .catch((error: unknown) => {
        setToast(error instanceof Error ? error.message : "No fue posible cargar los tipos de bebida");
      })
      .finally(() => setLoadingTypes(false));
  }, [session?.token]);

  const handleSubmit = async () => {
    if (!session?.token || !selected) return;
    setSubmitting(true);
    try {
      const res = await fetchWithAuth<{ message: string }>("/ranking/points", session.token, {
        method: "POST",
        body: JSON.stringify({ category: selected, quantity }),
      });
      setPendingSales((prev) => prev + 1);
      setToast(res.message);
      setSelected(null);
      setQuantity(1);
      setTimeout(() => setToast(null), 3000);
    } catch (error: unknown) {
      setToast(error instanceof Error ? error.message : "Error al registrar");
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
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <div className="bg-pop-cardGreen p-6 rounded-xl border border-white/5">
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Puntos Hoy</p>
          <p className="text-3xl font-black text-pop-gold font-epilogue">{todayPoints}</p>
        </div>
        <div className="bg-pop-cardGreen p-6 rounded-xl border border-white/5">
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Pendientes de revisión</p>
          <p className="text-3xl font-black text-pop-orange font-epilogue">{pendingSales}</p>
        </div>
        <div className="bg-pop-cardGreen p-6 rounded-xl border border-white/5">
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Ventas Hoy</p>
          <p className="text-3xl font-black text-white font-epilogue">{todaySales}</p>
        </div>
      </div>

      {/* Drink Categories */}
      <section className="mb-8">
        <h2 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-6">Selecciona tipo de venta</h2>
        {loadingTypes ? (
          <p className="text-sm text-gray-500">Cargando tipos de bebida...</p>
        ) : drinkTypes.length === 0 ? (
          <p className="text-sm text-red-400">No hay tipos de bebida activos. Solicita al administrador que configure el ranking.</p>
        ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {drinkTypes.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => setSelected(cat.slug)}
              className={`p-6 rounded-xl border transition-all text-left ${selected === cat.slug ? "bg-pop-gold/10 border-pop-gold" : "bg-pop-cardGreen border-white/5 hover:border-pop-gold/30"}`}
            >
              <div className="flex items-center gap-4 mb-3">
                <span className={`material-symbols-outlined text-3xl ${selected === cat.slug ? "text-pop-gold" : "text-gray-500"}`}>{cat.icon || "local_bar"}</span>
                <div>
                  <p className="text-sm font-black text-white uppercase">{cat.label}</p>
                  <p className="text-xs text-pop-gold font-bold">+{cat.points} pts/unidad</p>
                </div>
              </div>
            </button>
          ))}
        </div>
        )}
      </section>

      {/* Quantity & Submit */}
      {selected && (
        <section className="bg-pop-cardGreen p-8 rounded-xl border border-pop-gold/20 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Cantidad</p>
              <p className="text-sm text-gray-400 mt-1">{drinkTypes.find(c => c.slug === selected)?.label}</p>
            </div>
            <div className="flex items-center gap-4">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center text-white hover:bg-white/10">
                <span className="material-symbols-outlined">remove</span>
              </button>
              <span className="text-3xl font-black text-white font-epilogue w-12 text-center">{quantity}</span>
              <button onClick={() => setQuantity(Math.min(20, quantity + 1))} className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center text-white hover:bg-white/10">
                <span className="material-symbols-outlined">add</span>
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-6 border-t border-white/5">
            <div>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Puntos base estimados</p>
              <p className="text-4xl font-black text-pop-gold font-epilogue">+{(drinkTypes.find(c => c.slug === selected)?.points || 0) * quantity}</p>
            </div>
            <button onClick={handleSubmit} disabled={submitting} className="px-10 py-4 bg-pop-gold text-pop-black font-black uppercase text-xs tracking-widest rounded-xl hover:bg-pop-lightGold transition-all disabled:opacity-50 shadow-lg">
              {submitting ? "Enviando..." : "Enviar a revisión"}
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
