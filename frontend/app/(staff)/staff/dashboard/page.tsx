"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
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

interface Notification {
  id: number;
  type: string;
  title: string;
  body: string;
  read_at: string | null;
  created_at: string;
}

interface DashStats {
  ventas_hoy: number;
  bebidas_vendidas: number;
  puntos_totales: number;
}

const StatCard = ({ label, value, icon }: { label: string; value: string; icon: string }) => (
  <div className="bg-pop-cardGreen p-6 rounded-xl border border-white/5 hover:border-pop-gold/20 transition-all group">
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 bg-white/5 rounded-lg group-hover:bg-pop-gold/10 transition-colors">
        <span className="material-symbols-outlined text-pop-gold text-3xl group-hover:scale-110 transition-transform">{icon}</span>
      </div>
    </div>
    <p className="text-4xl font-black text-white tracking-tighter font-epilogue mb-1">{value}</p>
    <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-bold">{label}</p>
  </div>
);

export default function WaiterDashboardPage() {
  const { session } = useAuth();
  const token = session?.token;
  const userEmail = session?.user?.email;
  const [meseros, setMeseros] = useState<Mesero[]>([]);
  const [rankingLoading, setRankingLoading] = useState(true);
  const [stats, setStats] = useState<DashStats | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [myPosition, setMyPosition] = useState<number | null>(null);

  const userName = session?.user?.name || "Mesero";

  useEffect(() => {
    const authToken = token;
    if (!authToken) return;
    let cancelled = false;

    async function loadData(activeToken: string) {
      try {
        setRankingLoading(true);
        const [rankingData, dashData, notifs] = await Promise.all([
          fetchWithAuth<Mesero[]>("/ranking", activeToken),
          fetchWithAuth<{ stats: DashStats }>("/staff/dashboard", activeToken).catch(() => null),
          fetchWithAuth<Notification[]>("/staff/notificaciones", activeToken).catch(() => []),
        ]);
        if (cancelled) return;

        const sorted = [...rankingData].sort((a, b) => b.puntos - a.puntos);
        setMeseros(sorted);

        if (dashData?.stats) setStats(dashData.stats);
        setNotifications(notifs || []);

        // Find current user's position
        if (userEmail) {
          const idx = sorted.findIndex((m) => m.user?.email === userEmail);
          setMyPosition(idx >= 0 ? idx + 1 : null);
        }
      } catch {} finally {
        if (!cancelled) setRankingLoading(false);
      }
    }

    loadData(authToken);
    return () => { cancelled = true; };
  }, [token, userEmail]);

  const topMesero = useMemo(() => meseros[0] || null, [meseros]);

  const notifColor: Record<string, { bg: string; border: string; text: string }> = {
    new_rating: { bg: "bg-green-500/5", border: "border-green-500/20", text: "text-green-400" },
    period_end: { bg: "bg-pop-orange/5", border: "border-pop-orange/20", text: "text-pop-orange" },
    tier_up: { bg: "bg-pop-gold/5", border: "border-pop-gold/20", text: "text-pop-gold" },
    multiplier: { bg: "bg-blue-500/5", border: "border-blue-500/20", text: "text-blue-400" },
  };

  return (
    <main className="pt-24 lg:pt-20 p-6 lg:p-10 min-h-screen bg-pop-black">
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
        <StatCard label="Puntos Hoy" value={stats ? stats.ventas_hoy.toLocaleString("es-MX") : "—"} icon="trending_up" />
        <StatCard label="Bebidas Vendidas" value={stats ? String(stats.bebidas_vendidas) : "—"} icon="local_bar" />
        <StatCard label="Puntos Totales" value={stats ? stats.puntos_totales.toLocaleString("es-MX") : "—"} icon="military_tech" />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        {/* Notifications (real) */}
        <section className="lg:col-span-2 bg-pop-cardGreen p-8 rounded-xl border border-white/5">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-black uppercase font-epilogue tracking-tighter text-white">Notificaciones</h2>
            {notifications.filter((n) => !n.read_at).length > 0 && (
              <span className="px-3 py-1 bg-pop-gold/10 text-pop-gold text-[10px] font-black rounded-full">
                {notifications.filter((n) => !n.read_at).length} nuevas
              </span>
            )}
          </div>
          {notifications.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-8">Sin notificaciones recientes</p>
          ) : (
            <div className="space-y-4 max-h-[320px] overflow-y-auto">
              {notifications.slice(0, 6).map((n) => {
                const colors = notifColor[n.type] || { bg: "bg-white/5", border: "border-white/10", text: "text-white" };
                return (
                  <div key={n.id} className={`p-5 ${colors.bg} border ${colors.border} rounded-lg`}>
                    <p className={`text-xs font-black ${colors.text} uppercase tracking-widest mb-2`}>{n.title}</p>
                    <p className="text-sm text-gray-300">{n.body}</p>
                    <p className="text-[9px] text-gray-600 mt-2">{new Date(n.created_at).toLocaleString("es-MX")}</p>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Personal Ranking Snapshot */}
        <section className="bg-pop-cardGreen p-8 rounded-xl border border-white/5 flex flex-col">
          <h2 className="text-2xl font-black uppercase font-epilogue tracking-tighter text-white mb-6">Ranking Personal</h2>
          <div className="flex-1 flex flex-col justify-center items-center text-center p-6 bg-pop-black/20 rounded-lg border border-white/5 mb-6">
            {rankingLoading ? (
              <div className="w-6 h-6 border-2 border-pop-gold border-t-transparent rounded-full animate-spin" />
            ) : myPosition ? (
              <>
                <span className="text-5xl font-black text-pop-gold mb-2">#{myPosition}</span>
                <p className="text-xs text-gray-500 uppercase tracking-widest mb-4">Tu Posición</p>
                {topMesero && (
                  <p className="text-sm font-bold text-white max-w-[220px]">
                    Top: <span className="text-pop-orange italic">{topMesero.user?.name || topMesero.nombre}</span> con {topMesero.puntos.toLocaleString("es-MX")} pts
                  </p>
                )}
              </>
            ) : (
              <>
                <span className="text-5xl font-black text-pop-gold mb-2">--</span>
                <p className="text-xs text-gray-500 uppercase tracking-widest mb-4">Sin datos</p>
                <p className="text-sm font-bold text-white max-w-[150px]">No hay ranking disponible</p>
              </>
            )}
          </div>
          <Link
            href="/staff/ranking"
            className="w-full py-4 bg-pop-gold text-pop-black font-black uppercase text-xs tracking-[0.2em] rounded-lg hover:bg-pop-lightGold transition-all text-center block"
          >
            Ver Ranking Completo
          </Link>
        </section>
      </div>
    </main>
  );
}
