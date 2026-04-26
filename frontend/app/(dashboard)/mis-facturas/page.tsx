"use client";

import { useAuth } from "@/lib/auth-provider";
import { fetchWithAuth } from "@/lib/api";
import { useEffect, useState } from "react";

interface Factura {
  id: number;
  folio: string;
  fecha: string;
  total: number;
  descripcion: string;
  estado: string;
}

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  recibida: { label: "Recibida", color: "bg-pop-gold/10 text-pop-gold border-pop-gold/20" },
  en_proceso: { label: "En Proceso", color: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
  enviada_contadores: { label: "Enviada a Contadores", color: "bg-purple-500/10 text-purple-400 border-purple-500/20" },
  completada: { label: "Completada", color: "bg-green-500/10 text-green-500 border-green-500/20" },
  rechazada: { label: "Rechazada", color: "bg-red-500/10 text-red-500 border-red-500/20" },
};

export default function MisFacturasPage() {
  const { session } = useAuth();
  const userName = session?.user?.name || "Cliente";
  const token = session?.token || "";

  const [facturas, setFacturas] = useState<Factura[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;

    async function fetchFacturas() {
      try {
        setLoading(true);
        const res = await fetchWithAuth<{ data: Factura[] }>("/facturas", token);
        setFacturas(res.data ?? []);
      } catch (err: any) {
        setError(err?.message || "Error al cargar facturas");
      } finally {
        setLoading(false);
      }
    }

    fetchFacturas();
  }, [token]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(value);
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("es-MX", { day: "numeric", month: "short", year: "numeric" });
  };

  return (
    <main className="pt-24 lg:pt-32 p-4 lg:p-12 max-w-7xl mx-auto space-y-12">
      {/* Header */}
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
        <div>
          <h1 className="text-4xl lg:text-7xl font-black tracking-tighter text-white font-epilogue uppercase leading-none">
            Mis Facturas
          </h1>
          <p className="text-pop-orange mt-2 text-xs font-bold uppercase tracking-[0.3em]">
            Gestión Fiscal CFDI 4.0 · POP Perote
          </p>
        </div>
        <button className="w-full lg:w-auto px-8 py-4 bg-pop-gold text-pop-black font-black uppercase text-[10px] tracking-widest rounded-xl hover:bg-pop-lightGold shadow-lg transition-all">
          Solicitar Nueva Factura
        </button>
      </header>

      {/* Main Content */}
      <div className="grid grid-cols-1 gap-10">
        
        {/* List of Invoices */}
        <div className="space-y-6">
           <h2 className="text-xs font-black text-gray-500 uppercase tracking-widest px-1">Historial de Folios</h2>
           
           {loading ? (
             <div className="bg-[#1C1B1B] p-8 rounded-2xl border border-white/5 text-center">
                <div className="w-6 h-6 border-2 border-pop-gold border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs text-gray-500 mt-4 font-bold uppercase tracking-widest">Cargando facturas...</p>
             </div>
           ) : error ? (
             <div className="bg-[#1C1B1B] p-8 rounded-2xl border border-white/5 text-center">
                <span className="material-symbols-outlined text-red-500 text-3xl mb-2">error</span>
                <p className="text-xs text-red-400 font-bold uppercase tracking-widest">{error}</p>
             </div>
           ) : facturas.length === 0 ? (
             <div className="bg-[#1C1B1B] p-12 rounded-2xl border border-white/5 text-center">
                <span className="material-symbols-outlined text-gray-600 text-5xl mb-4">receipt_long</span>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest leading-relaxed">Aún no has solicitado ninguna factura.<br/>Haz clic en "Solicitar Nueva Factura" para comenzar.</p>
             </div>
           ) : (
             <div className="space-y-4">
                {facturas.map((inv) => (
                  <article key={inv.id} className="bg-[#1C1B1B] p-6 rounded-2xl border border-white/5 hover:border-pop-gold/10 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6">
                     <div className="flex items-start gap-5">
                        <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-gray-500">
                           <span className="material-symbols-outlined text-2xl">picture_as_pdf</span>
                        </div>
                        <div>
                           <div className="flex items-center gap-3">
                              <span className="text-sm font-black text-white uppercase">{inv.folio}</span>
                              <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest border ${STATUS_MAP[inv.estado]?.color || STATUS_MAP.recibida.color}`}>
                                 {STATUS_MAP[inv.estado]?.label || inv.estado}
                              </span>
                           </div>
                           <p className="text-xs text-gray-400 mt-1 font-bold">{inv.descripcion}</p>
                           <p className="text-[10px] text-gray-600 mt-1 uppercase font-black">{formatDate(inv.fecha)}</p>
                        </div>
                     </div>

                     <div className="flex items-center justify-between md:justify-end gap-8 pt-4 md:pt-0 border-t md:border-none border-white/5">
                        <div className="text-left md:text-right">
                           <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest leading-none mb-1">Total</p>
                           <p className="text-lg font-black text-white font-mono">{formatCurrency(inv.total)}</p>
                        </div>
                     </div>
                  </article>
                ))}
             </div>
           )}
        </div>

      </div>
    </main>
  );
}
