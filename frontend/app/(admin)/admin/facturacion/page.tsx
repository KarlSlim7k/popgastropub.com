"use client";

import { useState, useEffect } from "react";
import { fetchWithAuth } from "@/lib/api";
import { getAuthSession } from "@/lib/auth-session";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://popgastropub.com/api";

interface Factura {
  id: number;
  rfc: string;
  razon_social: string;
  email?: string;
  created_at: string;
  estado: "recibida" | "en_proceso" | "enviada_contadores" | "completada" | "rechazada";
  ticket_path?: string;
}

export default function AdminFacturacionPage() {
  const [selectedStatus, setSelectedStatus] = useState("todos");
  const [requests, setRequests] = useState<Factura[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFacturas = async () => {
    const session = getAuthSession();
    if (!session) return;
    setLoading(true);
    try {
      const data = await fetchWithAuth<Factura[]>("/api/admin/facturas", session.token);
      setRequests(data);
    } catch {
      // error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFacturas();
  }, []);

  const updateStatus = async (id: number, newStatus: string) => {
    const session = getAuthSession();
    if (!session) return;
    try {
      await fetchWithAuth(`/api/admin/facturas/${id}/status`, session.token, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus }),
      });
      setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status: newStatus as any } : r)));
    } catch {
      alert("Error al actualizar estado");
    }
  };

  const statusBadge = (status: string) => {
    const map: Record<string, string> = {
      recibida: "bg-blue-500/10 text-blue-400 border-blue-500/20",
      en_proceso: "bg-pop-gold/10 text-pop-gold border-pop-gold/20",
      enviada_contadores: "bg-purple-500/10 text-purple-400 border-purple-500/20",
      completada: "bg-green-500/10 text-green-400 border-green-500/20",
      rechazada: "bg-red-500/10 text-red-500 border-red-500/20",
    };
    return map[status] || "bg-gray-500/10 text-gray-400 border-gray-500/20";
  };

  const filteredRequests = selectedStatus === "todos" ? requests : requests.filter((r) => r.estado === selectedStatus);

  const pendientes = requests.filter((r) => r.estado === "recibida" || r.estado === "en_proceso").length;
  const completadas = requests.filter((r) => r.estado === "completada").length;
  const rechazadas = requests.filter((r) => r.estado === "rechazada").length;

  const ticketUrl = (path?: string) => {
    if (!path) return "";
    return path.startsWith("http") ? path : `${API_URL}${path}`;
  };

  return (
    <main className="pt-24 lg:pt-20 p-4 lg:p-10 min-h-screen bg-pop-black">
      <header className="mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
        <div>
          <h1 className="text-4xl lg:text-7xl font-black tracking-tighter text-white font-epilogue uppercase leading-none">
            Facturación
          </h1>
          <p className="text-pop-orange mt-2 text-xs font-bold uppercase tracking-[0.3em]">
            Control Fiscal Interno
          </p>
        </div>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <article className="bg-[#1C1B1B] p-6 rounded-2xl border border-white/5 border-l-4 border-pop-gold">
          <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mb-1">Total Solicitudes</p>
          <p className="text-3xl font-black text-white font-epilogue tracking-tighter">{requests.length}</p>
          <p className="text-[9px] text-pop-gold font-bold uppercase mt-2">Este mes</p>
        </article>
        <article className="bg-[#1C1B1B] p-6 rounded-2xl border border-white/5 border-l-4 border-pop-orange">
          <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mb-1">Pendientes</p>
          <p className="text-3xl font-black text-white font-epilogue tracking-tighter">{pendientes}</p>
          <p className="text-[9px] text-pop-orange font-bold uppercase mt-2">Acción Requerida</p>
        </article>
        <article className="bg-[#1C1B1B] p-6 rounded-2xl border border-white/5 border-l-4 border-green-500">
          <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mb-1">Completadas</p>
          <p className="text-3xl font-black text-white font-epilogue tracking-tighter">{completadas}</p>
          <p className="text-[9px] text-green-500 font-bold uppercase mt-2">Procesadas</p>
        </article>
        <article className="bg-[#1C1B1B] p-6 rounded-2xl border border-white/5 border-l-4 border-red-500">
          <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mb-1">Rechazadas</p>
          <p className="text-3xl font-black text-white font-epilogue tracking-tighter">{rechazadas}</p>
          <p className="text-[9px] text-red-500 font-bold uppercase mt-2">Revisión Urgente</p>
        </article>
      </section>

      <div className="flex flex-wrap gap-2 mb-6">
        {["todos", "recibida", "en_proceso", "enviada_contadores", "completada", "rechazada"].map((s) => (
          <button
            key={s}
            onClick={() => setSelectedStatus(s)}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
              selectedStatus === s ? "bg-pop-gold text-pop-black" : "bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-700/50"
            }`}
          >
            {s === "todos" ? "Todos" : s.replace("_", " ")}
          </button>
        ))}
      </div>

      <section className="bg-[#1C1B1B] rounded-3xl border border-white/5 overflow-hidden mb-10">
        <header className="p-6 lg:p-8 border-b border-white/5 flex justify-between items-center">
          <h2 className="text-xl font-black text-white uppercase font-epilogue tracking-tighter">Solicitudes Recientes</h2>
        </header>

        <div className="overflow-x-auto">
          <table className="hidden lg:table w-full text-left">
             <thead className="bg-white/[0.01] text-[10px] font-black uppercase text-gray-500 tracking-widest border-b border-white/5">
               <tr>
                 <th className="py-5 px-8">Folio</th>
                 <th className="py-5 px-4">Cliente / RFC</th>
                 <th className="py-5 px-4">Estado</th>
                 <th className="py-5 px-4">Ticket</th>
                 <th className="py-5 px-8 text-right">Acciones</th>
               </tr>
             </thead>
            <tbody className="divide-y divide-white/5">
              {filteredRequests.map((r) => (
                <tr key={r.id} className="hover:bg-white/[0.01] transition-all group">
                  <td className="py-6 px-8 text-sm font-black text-pop-gold">F-{String(r.id).padStart(4, '0')}</td>
                  <td className="py-6 px-4">
                    <p className="text-sm font-bold text-white">{r.razon_social}</p>
                    <p className="text-[10px] text-gray-500 uppercase font-black tabular-nums">{r.rfc}</p>
                    {r.email && <p className="text-[10px] text-gray-600 mt-0.5">{r.email}</p>}
                  </td>
                  <td className="py-6 px-4">
                    <select
                      value={r.estado}
                      onChange={(e) => updateStatus(r.id, e.target.value)}
                      className={`bg-transparent border rounded-full px-3 py-1 text-[9px] font-black uppercase tracking-widest border-current cursor-pointer outline-none ${statusBadge(r.estado)}`}
                    >
                      <option value="recibida" className="bg-pop-black text-blue-400">Recibida</option>
                      <option value="en_proceso" className="bg-pop-black text-pop-gold">En Proceso</option>
                      <option value="enviada_contadores" className="bg-pop-black text-purple-400">Enviada Contadores</option>
                      <option value="completada" className="bg-pop-black text-green-400">Completada</option>
                      <option value="rechazada" className="bg-pop-black text-red-500">Rechazada</option>
                    </select>
                  </td>
                  <td className="py-6 px-4">
                    {r.ticket_path ? (
                      <a
                        href={ticketUrl(r.ticket_path)}
                        target="_blank"
                        rel="noreferrer"
                        className="text-pop-gold hover:text-white transition-colors"
                      >
                        <span className="material-symbols-outlined text-sm">image</span>
                      </a>
                    ) : (
                      <span className="text-gray-600 material-symbols-outlined text-sm">hide_image</span>
                    )}
                  </td>
                  <td className="py-6 px-8 text-right">
                    <button className="p-2 bg-white/5 rounded-lg text-gray-400 hover:text-white transition-all">
                      <span className="material-symbols-outlined text-sm">visibility</span>
                    </button>
                  </td>
                </tr>
              ))}
              {filteredRequests.length === 0 && !loading && (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-gray-500 text-xs uppercase tracking-widest">
                    Sin solicitudes
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="lg:hidden divide-y divide-white/5">
            {filteredRequests.map((r) => (
              <article key={r.id} className="p-6 space-y-4 hover:bg-white/[0.01] transition-all">
                <div className="flex justify-between items-start">
                  <span className="text-sm font-black text-pop-gold">F-{String(r.id).padStart(4, '0')}</span>
                  <select
                    value={r.estado}
                    onChange={(e) => updateStatus(r.id, e.target.value)}
                    className={`bg-transparent border rounded-full px-3 py-1 text-[9px] font-black uppercase tracking-widest border-current cursor-pointer outline-none ${statusBadge(r.estado)}`}
                  >
                    <option value="recibida" className="bg-pop-black text-blue-400">Recibida</option>
                    <option value="en_proceso" className="bg-pop-black text-pop-gold">En Proceso</option>
                    <option value="enviada_contadores" className="bg-pop-black text-purple-400">Enviada Contadores</option>
                    <option value="completada" className="bg-pop-black text-green-400">Completada</option>
                    <option value="rechazada" className="bg-pop-black text-red-500">Rechazada</option>
                  </select>
                </div>
                <div>
                  <p className="text-base font-black text-white leading-tight">{r.razon_social}</p>
                  <p className="text-[10px] text-gray-500 uppercase font-black tabular-nums mt-1">{r.rfc}</p>
                  {r.email && <p className="text-[10px] text-gray-600 mt-0.5">{r.email}</p>}
                </div>
                <div className="flex justify-between items-end pt-2">
                  <div>
                    <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest mb-1">Solicitud</p>
                    <p className="text-xl font-black text-white font-mono">{new Date(r.created_at).toLocaleDateString('es-MX')}</p>
                  </div>
                  <div className="flex gap-2">
                    {r.ticket_path ? (
                      <a
                        href={ticketUrl(r.ticket_path)}
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-pop-gold font-black text-[10px] uppercase tracking-widest flex items-center gap-2"
                      >
                        <span className="material-symbols-outlined text-sm">image</span> Ticket
                      </a>
                    ) : null}
                    <button className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-gray-300 font-black text-[10px] uppercase tracking-widest">
                      Ver Detalle
                    </button>
                  </div>
                </div>
              </article>
            ))}
            {filteredRequests.length === 0 && !loading && (
              <div className="py-10 text-center text-gray-500 text-xs uppercase tracking-widest">Sin solicitudes</div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
