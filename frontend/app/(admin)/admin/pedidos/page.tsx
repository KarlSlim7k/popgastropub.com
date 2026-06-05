"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { fetchWithAuth } from "@/lib/api";
import { getAuthSession } from "@/lib/auth-session";
import { Pagination } from "@/components/ui/Pagination";

interface Pedido {
  id: number;
  foodbooking_ref?: string;
  items: Array<{ nombre?: string; name?: string; cantidad?: number; quantity?: number }> | string;
  total: number | string;
  puntos_ganados: number;
  puntos_acreditados_at?: string | null;
  estado: "pendiente" | "preparando" | "listo" | "entregado" | "cancelado";
  created_at: string;
  user?: { name: string; email: string } | null;
}

const STATUSES = ["todos", "pendiente", "preparando", "listo", "entregado", "cancelado"] as const;

export default function AdminPedidosPage() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [filter, setFilter] = useState<(typeof STATUSES)[number]>("todos");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ current_page: 1, last_page: 1, total: 0 });

  const load = async (p = page) => {
    const session = getAuthSession();
    if (!session) return;
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(p), per_page: "20" });
      if (filter !== "todos") params.set("estado", filter);
      const data = await fetchWithAuth<any>(`/admin/pedidos?${params}`, session.token);
      setPedidos(Array.isArray(data) ? data : data.data ?? []);
      if (data.meta) setMeta(data.meta);
    } catch {
      toast.error("No se pudieron cargar los pedidos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(1); setPage(1); }, [filter]);
  useEffect(() => { load(page); }, [page]);

  const updateStatus = async (id: number, estado: Pedido["estado"]) => {
    const session = getAuthSession();
    if (!session) return;
    try {
      const updated = await fetchWithAuth<Pedido>(`/admin/pedidos/${id}/status`, session.token, {
        method: "PATCH",
        body: JSON.stringify({ estado }),
      });
      setPedidos((current) => current.map((pedido) => pedido.id === id ? updated : pedido));
    } catch {
      toast.error("No se pudo actualizar el pedido");
    }
  };

  const remove = async (id: number) => {
    const session = getAuthSession();
    if (!session || !confirm("¿Eliminar este pedido?")) return;
    try {
      await fetchWithAuth(`/admin/pedidos/${id}`, session.token, { method: "DELETE" });
      setPedidos((current) => current.filter((pedido) => pedido.id !== id));
    } catch {
      toast.error("No se pudo eliminar el pedido");
    }
  };

  const formatItems = (items: Pedido["items"]) => {
    if (typeof items === "string") return items;
    return items.map((item) => `${item.cantidad || item.quantity || 1}x ${item.nombre || item.name || "Item"}`).join(", ");
  };

  const visible = pedidos; // Filtering is now server-side

  return (
    <main className="pt-24 lg:pt-20 p-4 lg:p-10 min-h-screen bg-pop-black">
      <header className="mb-8">
        <h1 className="text-4xl lg:text-6xl font-black tracking-tighter text-white font-epilogue uppercase">Pedidos</h1>
        <p className="text-pop-orange mt-2 text-xs font-bold uppercase tracking-[0.3em]">Entrega y acreditación de Puntos POP</p>
      </header>

      <section className="flex flex-wrap gap-2 mb-6">
        {STATUSES.map((status) => <button key={status} onClick={() => setFilter(status)} className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest ${filter === status ? "bg-pop-gold text-pop-black" : "bg-white/5 text-gray-400"}`}>{status}</button>)}
      </section>

      <section className="bg-pop-cardGreen rounded-2xl border border-white/5 overflow-x-auto">
        <table className="w-full min-w-[940px] text-left">
          <thead className="border-b border-white/5 text-[10px] uppercase tracking-widest text-gray-500">
            <tr><th className="p-5">Pedido</th><th>Cliente</th><th>Productos</th><th>Total</th><th>Puntos</th><th>Estado</th><th className="pr-5 text-right">Acciones</th></tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {visible.map((pedido) => (
              <tr key={pedido.id} className="hover:bg-white/[0.02]">
                <td className="p-5"><p className="text-sm font-black text-pop-gold">#{pedido.id}</p><p className="text-[10px] text-gray-500">{pedido.foodbooking_ref || new Date(pedido.created_at).toLocaleDateString("es-MX")}</p></td>
                <td className="text-xs text-white">{pedido.user?.name || "Cliente"}</td>
                <td className="max-w-sm text-xs text-gray-400">{formatItems(pedido.items)}</td>
                <td className="text-xs font-black text-white">${Number(pedido.total).toFixed(2)}</td>
                <td className="text-xs font-black text-pop-gold">{pedido.puntos_ganados || Math.floor(Number(pedido.total) / 10)} pts {pedido.puntos_acreditados_at ? "✓" : ""}</td>
                <td><select value={pedido.estado} onChange={(event) => updateStatus(pedido.id, event.target.value as Pedido["estado"])} className="bg-pop-black border border-white/10 rounded-lg px-3 py-2 text-xs text-white"><option value="pendiente">Pendiente</option><option value="preparando">Preparando</option><option value="listo">Listo</option><option value="entregado">Entregado</option><option value="cancelado">Cancelado</option></select></td>
                <td className="pr-5 text-right"><button onClick={() => remove(pedido.id)} className="text-red-400 material-symbols-outlined">delete</button></td>
              </tr>
            ))}
            {!loading && visible.length === 0 && <tr><td colSpan={7} className="p-10 text-center text-xs uppercase tracking-widest text-gray-500">Sin pedidos</td></tr>}
          </tbody>
        </table>
      </section>
      <div className="mt-4">
        <Pagination currentPage={meta.current_page} lastPage={meta.last_page} total={meta.total} onPageChange={setPage} />
      </div>
    </main>
  );
}
