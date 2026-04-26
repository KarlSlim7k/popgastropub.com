"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useAuth } from "@/lib/auth-provider";
import { fetchWithAuth } from "@/lib/api";

interface RankingUser {
  name: string;
  email: string;
}

interface Mesero {
  id: number;
  nombre: string;
  puntos: number;
  activo: boolean;
  user: RankingUser;
}

interface StatCardProps {
  label: string;
  value: string;
  icon: string;
}

interface OrderItem {
  id: string;
  description: string;
  status: "ready" | "preparing";
  time: string;
}

const StatCard = ({ label, value, icon }: StatCardProps) => (
  <div className="bg-[#1C1B1B] p-6 rounded-xl border border-white/5 hover:border-pop-gold/20 transition-all group">
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 bg-white/5 rounded-lg group-hover:bg-pop-gold/10 transition-colors">
        <span className="material-symbols-outlined text-pop-gold text-3xl group-hover:scale-110 transition-transform">
          {icon}
        </span>
      </div>
    </div>
    <p className="text-4xl font-black text-white tracking-tighter font-epilogue mb-1">{value}</p>
    <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-bold">{label}</p>
  </div>
);

export default function WaiterDashboardPage() {
  const { session } = useAuth();
  const [meseros, setMeseros] = useState<Mesero[]>([]);
  const [rankingLoading, setRankingLoading] = useState(true);

  const userName = session?.user?.name || 'Mesero';

  const stats = [
    { label: "Mesas Atendidas", value: "14", icon: "table_restaurant" },
    { label: "Bebidas Vendidas", value: "42", icon: "local_bar" },
    { label: "Puntos Ganados", value: "2,840", icon: "military_tech" },
  ];

  const orders: OrderItem[] = [
    { id: "1", description: "2x Old Fashioned, 1x Tartare", status: "ready", time: "Recoger ahora en Barra 1" },
    { id: "2", description: "1x Ribeye, 1x Red Wine", status: "preparing", time: "En preparación (5 min)" },
    { id: "3", description: "3x Margarita Pops", status: "preparing", time: "En preparación (8 min)" },
  ];

  useEffect(() => {
    if (!session?.token) return;

    let cancelled = false;

    async function loadRanking() {
      try {
        setRankingLoading(true);
        const data = await fetchWithAuth<Mesero[]>('/api/ranking', session!.token);
        if (!cancelled) {
          const sorted = [...data].sort((a, b) => b.puntos - a.puntos);
          setMeseros(sorted);
        }
      } catch {
        // Silently fail for dashboard ranking snapshot; data stays empty
      } finally {
        if (!cancelled) setRankingLoading(false);
      }
    }

    loadRanking();

    return () => {
      cancelled = true;
    };
  }, [session?.token]);

  const topMesero = useMemo(() => meseros[0] || null, [meseros]);

  return (
    <main className="pt-24 lg:pt-20 p-6 lg:p-10 min-h-screen bg-pop-black">
      {/* Header */}
      <header className="mb-10">
        <h1 className="text-4xl lg:text-5xl font-black tracking-tighter text-white font-epilogue uppercase">
          ¡Hola, {userName}! 🌟
        </h1>
        <p className="text-gray-400 mt-2 text-base lg:text-lg font-manrope">
          Portal de mesero • Tu rendimiento en tiempo real
        </p>
      </header>

      {/* Stats Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        {/* Real-time Orders */}
        <section className="lg:col-span-2 bg-[#1C1B1B] p-8 rounded-xl border border-white/5">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-black uppercase font-epilogue tracking-tighter text-white">Órdenes Activas</h2>
            <span className="material-symbols-outlined text-pop-gold animate-pulse">monitoring</span>
          </div>
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="p-5 bg-pop-black/40 rounded-lg border border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <p className="text-lg font-bold text-white mb-1">{order.description}</p>
                  <p className="text-xs text-pop-orange font-bold uppercase tracking-widest">{order.time}</p>
                </div>
                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                  order.status === 'ready' ? 'bg-green-500/10 text-green-400' : 'bg-pop-gold/10 text-pop-gold'
                }`}>
                  {order.status === 'ready' ? 'Listo para servir' : 'Preparando'}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Personal Ranking Snapshot */}
        <section className="bg-[#1C1B1B] p-8 rounded-xl border border-white/5 flex flex-col">
          <h2 className="text-2xl font-black uppercase font-epilogue tracking-tighter text-white mb-6">Ranking Personal</h2>
          <div className="flex-1 flex flex-col justify-center items-center text-center p-6 bg-pop-black/20 rounded-lg border border-white/5 mb-6">
            {rankingLoading ? (
              <div className="w-6 h-6 border-2 border-pop-gold border-t-transparent rounded-full animate-spin" />
            ) : topMesero ? (
              <>
                <span className="text-5xl font-black text-pop-gold mb-2">#1</span>
                <p className="text-xs text-gray-500 uppercase tracking-widest mb-4">Posición Actual</p>
                <p className="text-sm font-bold text-white max-w-[220px]">
                  Top: <span className="text-pop-orange italic">{topMesero.user?.name || topMesero.nombre}</span> con {topMesero.puntos.toLocaleString('es-MX')} pts
                </p>
              </>
            ) : (
              <>
                <span className="text-5xl font-black text-pop-gold mb-2">--</span>
                <p className="text-xs text-gray-500 uppercase tracking-widest mb-4">Sin datos</p>
                <p className="text-sm font-bold text-white max-w-[150px]">
                  No hay ranking disponible
                </p>
              </>
            )}
          </div>
          <button className="w-full py-4 bg-pop-gold text-pop-black font-black uppercase text-xs tracking-[0.2em] rounded-lg hover:bg-pop-lightGold transition-all">
            Ver Ranking Completo
          </button>
        </section>
      </div>

      {/* Notifications */}
      <section className="bg-[#1C1B1B] p-8 rounded-xl border border-white/5">
        <h2 className="text-2xl font-black uppercase font-epilogue tracking-tighter text-white mb-8">Notificaciones</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 bg-red-500/5 border border-red-500/20 rounded-lg">
            <p className="text-xs font-black text-red-400 uppercase tracking-widest mb-2">Bar principal: Alerta stock</p>
            <p className="text-sm text-gray-300">Mezcal "Don Julio" se está agotando. Informar a los invitados antes de pedir.</p>
          </div>
          <div className="p-6 bg-pop-orange/5 border border-pop-orange/20 rounded-lg">
            <p className="text-xs font-black text-pop-orange uppercase tracking-widest mb-2">Flash Bonus!</p>
            <p className="text-sm text-gray-300">Doble puntuación por cada 'Summer Sunset' vendido en la próxima hora.</p>
          </div>
          <div className="p-6 bg-white/5 border border-white/10 rounded-lg">
            <p className="text-xs font-black text-white uppercase tracking-widest mb-2">Estado de Cocina</p>
            <p className="text-sm text-gray-300">La sección de parrilla está operando a alta capacidad. Retraso para cortes +15min.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
