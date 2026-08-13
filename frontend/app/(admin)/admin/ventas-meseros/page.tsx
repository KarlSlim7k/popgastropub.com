"use client";

import { useCallback, useEffect, useState } from "react";
import { fetchWithAuth } from "@/lib/api";
import { useAuth } from "@/lib/auth-provider";

type SaleStatus = "pending" | "approved" | "rejected";

interface StaffSale {
  id: number;
  category: string;
  quantity: number;
  points: number;
  multiplier: string | number;
  status: SaleStatus;
  created_at: string;
  reviewed_at: string | null;
  mesero: { nombre: string; user?: { email?: string } };
  reviewer?: { name: string } | null;
}

export default function VentasMeserosPage() {
  const { session } = useAuth();
  const [status, setStatus] = useState<SaleStatus>("pending");
  const [sales, setSales] = useState<StaffSale[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<number | null>(null);
  const [message, setMessage] = useState("");

  const loadSales = useCallback(async () => {
    if (!session?.token) return;
    setLoading(true);
    try {
      setSales(await fetchWithAuth<StaffSale[]>(`/admin/staff-sales?status=${status}`, session.token));
    } catch (error: unknown) {
      setMessage(error instanceof Error ? error.message : "No fue posible cargar las ventas");
    } finally {
      setLoading(false);
    }
  }, [session?.token, status]);

  useEffect(() => {
    loadSales();
  }, [loadSales]);

  const review = async (sale: StaffSale, action: "approve" | "reject") => {
    if (!session?.token) return;
    setProcessing(sale.id);
    try {
      const result = await fetchWithAuth<{ message: string }>(
        `/admin/staff-sales/${sale.id}/${action}`,
        session.token,
        { method: "PATCH" },
      );
      setMessage(result.message);
      await loadSales();
    } catch (error: unknown) {
      setMessage(error instanceof Error ? error.message : "No fue posible revisar la venta");
    } finally {
      setProcessing(null);
    }
  };

  return (
    <main className="pt-24 lg:pt-20 p-4 lg:p-10 min-h-screen bg-pop-black">
      <header className="mb-10">
        <h1 className="text-4xl lg:text-6xl font-black tracking-tighter text-white font-epilogue uppercase">Ventas Bar Stars</h1>
        <p className="text-pop-orange mt-2 text-xs font-bold uppercase tracking-[0.3em]">Revisión y acreditación de ventas de bebidas</p>
      </header>

      {message && <div className="mb-6 rounded-xl border border-pop-gold/20 bg-pop-gold/10 px-5 py-3 text-sm text-pop-gold">{message}</div>}

      <nav className="flex flex-wrap gap-3 mb-8">
        {(["pending", "approved", "rejected"] as SaleStatus[]).map((item) => (
          <button key={item} onClick={() => setStatus(item)} className={`rounded-full px-5 py-2 text-[10px] font-black uppercase tracking-widest ${status === item ? "bg-pop-gold text-pop-black" : "bg-white/5 text-gray-400"}`}>
            {item === "pending" ? "Pendientes" : item === "approved" ? "Aprobadas" : "Rechazadas"}
          </button>
        ))}
      </nav>

      <section className="overflow-x-auto rounded-2xl border border-white/5 bg-pop-cardGreen">
        <table className="w-full min-w-[760px] text-left">
          <thead className="border-b border-white/5 text-[10px] uppercase tracking-widest text-gray-500">
            <tr><th className="p-5">Mesero</th><th className="p-5">Categoría</th><th className="p-5">Cantidad</th><th className="p-5">Puntos</th><th className="p-5">Fecha</th><th className="p-5 text-right">Acciones</th></tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {sales.map((sale) => (
              <tr key={sale.id}>
                <td className="p-5"><p className="font-bold text-white">{sale.mesero.nombre}</p><p className="text-xs text-gray-500">{sale.mesero.user?.email}</p></td>
                <td className="p-5 text-sm uppercase text-pop-orange">{sale.category}</td>
                <td className="p-5 text-sm text-white">{sale.quantity}</td>
                <td className="p-5 font-black text-pop-gold">+{sale.points}</td>
                <td className="p-5 text-xs text-gray-400">{new Date(sale.created_at).toLocaleString("es-MX")}</td>
                <td className="p-5 text-right">
                  {status === "pending" ? <div className="flex justify-end gap-2">
                    <button disabled={processing === sale.id} onClick={() => review(sale, "reject")} className="rounded-lg border border-red-500/20 px-4 py-2 text-[10px] font-black uppercase text-red-400 disabled:opacity-50">Rechazar</button>
                    <button disabled={processing === sale.id} onClick={() => review(sale, "approve")} className="rounded-lg bg-pop-gold px-4 py-2 text-[10px] font-black uppercase text-pop-black disabled:opacity-50">Aprobar</button>
                  </div> : <span className="text-xs text-gray-500">{sale.reviewer?.name || "—"}</span>}
                </td>
              </tr>
            ))}
            {!loading && sales.length === 0 && <tr><td colSpan={6} className="p-12 text-center text-sm text-gray-500">No hay ventas en este estado.</td></tr>}
          </tbody>
        </table>
        {loading && <p className="p-12 text-center text-sm text-gray-500">Cargando ventas...</p>}
      </section>
    </main>
  );
}
