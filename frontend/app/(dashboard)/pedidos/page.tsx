"use client";

import { useAuth } from "@/lib/auth-provider";
import { fetchWithAuth, fetchAPI } from "@/lib/api";
import { useState, useEffect, useCallback } from "react";

interface Pedido {
  id: number | string;
  fecha?: string;
  created_at?: string;
  items: string | Array<{ nombre?: string; name?: string; cantidad?: number; quantity?: number }>;
  total: number | string;
  puntos_ganados?: number | string;
  estado?: string;
  tipo?: string;
}

export default function PedidosPage() {
  const { session } = useAuth();
  const [orders, setOrders] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const token = session?.token ?? "";

  const fetchPedidos = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchWithAuth<{ data?: Pedido[]; pedidos?: Pedido[] }>("/api/pedidos", token);
      const list = Array.isArray(data) ? data : data.data ?? data.pedidos ?? [];
      setOrders(list);
    } catch (err: any) {
      setError(err?.message || "No se pudieron cargar los pedidos");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchPedidos();
  }, [fetchPedidos]);

  const formatItems = (items: Pedido["items"]) => {
    if (typeof items === "string") return items;
    if (Array.isArray(items)) {
      return items
        .map((it) => {
          const name = it.nombre || it.name || "Item";
          const qty = it.cantidad || it.quantity || 1;
          return `${qty}x ${name}`;
        })
        .join(", ");
    }
    return "";
  };

  const formatCurrency = (value: number | string) => {
    const num = typeof value === "string" ? parseFloat(value) : value;
    if (isNaN(num)) return String(value);
    return new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(num);
  };

  const formatPoints = (value?: number | string) => {
    if (value === undefined || value === null) return "+0 pts";
    return `+${value} pts`;
  };

  const estadoBadge = (estado?: string) => {
    const s = (estado || "").toLowerCase();
    if (s === "entregado" || s === "completado" || s === "completada") {
      return "bg-green-500/10 text-green-500 border-green-500/20";
    }
    if (s === "en preparación" || s === "preparando") {
      return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
    }
    if (s === "pendiente") {
      return "bg-pop-orange/10 text-pop-orange border-pop-orange/20";
    }
    if (s === "cancelado" || s === "cancelada") {
      return "bg-red-500/10 text-red-500 border-red-500/20";
    }
    return "bg-gray-500/10 text-gray-400 border-gray-500/20";
  };

  const formatDate = (fecha?: string) => {
    if (!fecha) return "";
    try {
      const d = new Date(fecha);
      if (isNaN(d.getTime())) return fecha;
      return d.toLocaleDateString("es-MX", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return fecha;
    }
  };

  return (
    <main className="pt-24 lg:pt-32 p-4 lg:p-12 max-w-5xl mx-auto space-y-12">
      {/* Header */}
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
        <div>
          <h1 className="text-4xl lg:text-7xl font-black tracking-tighter text-white font-epilogue uppercase leading-none">
            Mis Experiencias
          </h1>
          <p className="text-pop-orange mt-2 text-xs font-bold uppercase tracking-[0.3em]">
            Tu historial gastronómico en POP Perote
          </p>
        </div>
      </header>

      {/* History List */}
      <div className="space-y-6">
        <h2 className="text-xs font-black text-gray-500 uppercase tracking-widest px-1">Pedidos Recientes</h2>

        {loading ? (
          <div className="bg-[#1C1B1B] p-12 rounded-3xl border border-dashed border-white/5 text-center">
            <div className="w-8 h-8 border-2 border-pop-gold border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-gray-500 font-black uppercase text-[10px] tracking-widest mt-4">Cargando pedidos...</p>
          </div>
        ) : error ? (
          <div className="bg-[#1C1B1B] p-12 rounded-3xl border border-dashed border-white/5 text-center space-y-4">
            <span className="material-symbols-outlined text-red-500 text-5xl">error</span>
            <p className="text-gray-500 font-black uppercase text-[10px] tracking-widest">{error}</p>
          </div>
        ) : orders.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {orders.map((order) => (
              <article key={order.id} className="bg-[#1C1B1B] p-6 lg:p-8 rounded-3xl border border-white/5 hover:border-pop-gold/10 transition-all group">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="space-y-4 flex-1">
                    <div className="flex flex-wrap items-center gap-4">
                      <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${estadoBadge(order.estado)}`}>
                        {order.estado || "Entregado"}
                      </span>
                      <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest leading-none">
                        {order.id} · {formatDate(order.fecha || order.created_at)}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-white leading-tight uppercase font-manrope">
                      {formatItems(order.items)}
                    </h3>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-10 pt-6 md:pt-0 border-t md:border-none border-white/5">
                    <div className="text-left md:text-right">
                      <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mb-1 leading-none">Total Pagado</p>
                      <p className="text-xl font-black text-white font-mono">{formatCurrency(order.total)}</p>
                    </div>
                    <div className="text-right min-w-[80px]">
                      <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mb-1 leading-none">Ganancia</p>
                      <p className="text-lg font-black text-pop-gold">{formatPoints(order.puntos_ganados)}</p>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="bg-[#1C1B1B] p-12 rounded-3xl border border-dashed border-white/5 text-center space-y-4">
            <span className="material-symbols-outlined text-gray-700 text-5xl">receipt_long</span>
            <p className="text-gray-500 font-black uppercase text-[10px] tracking-widest">Aún no tienes pedidos registrados</p>
          </div>
        )}
      </div>

      {/* Promotion Hook */}
      <section className="bg-pop-orange/5 border border-pop-orange/10 p-10 rounded-3xl text-center space-y-4">
        <span className="material-symbols-outlined text-pop-gold text-4xl">restaurant_menu</span>
        <h2 className="text-2xl font-black text-white uppercase tracking-tighter">¿Listo para repetir?</h2>
        <p className="text-gray-400 text-sm max-w-md mx-auto font-manrope">
          Explora nuestra carta completa y descubre nuevos sabores para tu próxima visita. Recuerda que los martes tenemos 2x1 en Rolls.
        </p>
        <div className="pt-4">
          <a href="/menu" className="inline-block px-10 py-4 bg-pop-gold text-pop-black font-black uppercase text-xs tracking-widest rounded-xl hover:bg-pop-lightGold transition-all">
            Ver Menú Digital
          </a>
        </div>
      </section>
    </main>
  );
}
