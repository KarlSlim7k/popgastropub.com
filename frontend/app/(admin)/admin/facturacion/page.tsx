"use client";

import { useState } from "react";

export default function AdminFacturacionPage() {
  const [selectedStatus, setSelectedStatus] = useState("todos");

  const requests = [
    { id: "PP-8821", client: "Gastronomía Avanzada S.A.", rfc: "GAV920301-RT4", amount: 14500.00, date: "12 Oct, 14:30", status: "timbrado" },
    { id: "PP-8822", client: "Juan Pérez López", rfc: "PELJ850412-HX5", amount: 2140.00, date: "12 Oct, 15:10", status: "pendiente" },
    { id: "PP-8823", client: "Distribuidora Perote", rfc: "DPE100822-AA1", amount: 450.00, date: "12 Oct, 16:45", status: "error" },
  ];

  return (
    <main className="pt-24 lg:pt-20 p-4 lg:p-10 min-h-screen bg-pop-black">
      {/* Header */}
      <header className="mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
        <div>
          <h1 className="text-4xl lg:text-7xl font-black tracking-tighter text-white font-epilogue uppercase leading-none">
            Facturación
          </h1>
          <p className="text-pop-orange mt-2 text-xs font-bold uppercase tracking-[0.3em]">
            Control Fiscal y Certificación CFDI 4.0
          </p>
        </div>
        <div className="flex w-full sm:w-auto gap-2">
           <button className="flex-1 sm:flex-none px-6 py-4 bg-pop-gold text-pop-black text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-pop-lightGold transition-all shadow-lg">
             Sincronizar PAC
           </button>
        </div>
      </header>

      {/* KPI Grid - Responsive stacking */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <article className="bg-[#1C1B1B] p-6 rounded-2xl border border-white/5 border-l-4 border-pop-gold">
          <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mb-1">Fiscal del Mes</p>
          <p className="text-3xl font-black text-white font-epilogue tracking-tighter">$84,200</p>
          <p className="text-[9px] text-pop-gold font-bold uppercase mt-2">1,284 Facturas</p>
        </article>
        <article className="bg-[#1C1B1B] p-6 rounded-2xl border border-white/5 border-l-4 border-pop-orange">
          <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mb-1">Pendientes</p>
          <p className="text-3xl font-black text-white font-epilogue tracking-tighter">42</p>
          <p className="text-[9px] text-pop-orange font-bold uppercase mt-2">Acción Requerida</p>
        </article>
        <article className="bg-[#1C1B1B] p-6 rounded-2xl border border-white/5 border-l-4 border-green-500">
          <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mb-1">Certificadas</p>
          <p className="text-3xl font-black text-white font-epilogue tracking-tighter">1,235</p>
          <p className="text-[9px] text-green-500 font-bold uppercase mt-2">100% Validado</p>
        </article>
        <article className="bg-[#1C1B1B] p-6 rounded-2xl border border-white/5 border-l-4 border-red-500">
          <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mb-1">Errores PAC</p>
          <p className="text-3xl font-black text-white font-epilogue tracking-tighter">7</p>
          <p className="text-[9px] text-red-500 font-bold uppercase mt-2">Revisión Urgente</p>
        </article>
      </section>

      {/* Requests Section: Desktop Table / Mobile Cards */}
      <section className="bg-[#1C1B1B] rounded-3xl border border-white/5 overflow-hidden mb-10">
        <header className="p-6 lg:p-8 border-b border-white/5 flex justify-between items-center">
           <h2 className="text-xl font-black text-white uppercase font-epilogue tracking-tighter">Solicitudes Recientes</h2>
           <button className="p-2 hover:bg-white/5 rounded-lg text-gray-400">
             <span className="material-symbols-outlined">filter_list</span>
           </button>
        </header>
        
        <div className="overflow-x-auto">
          {/* Desktop Table */}
          <table className="hidden lg:table w-full text-left">
            <thead className="bg-white/[0.01] text-[10px] font-black uppercase text-gray-500 tracking-widest border-b border-white/5">
              <tr>
                <th className="py-5 px-8">Folio</th>
                <th className="py-5 px-4">Cliente / RFC</th>
                <th className="py-5 px-4 text-right">Monto</th>
                <th className="py-5 px-4">Estado</th>
                <th className="py-5 px-8 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {requests.map(r => (
                <tr key={r.id} className="hover:bg-white/[0.01] transition-all group">
                   <td className="py-6 px-8 text-sm font-black text-pop-gold">{r.id}</td>
                   <td className="py-6 px-4">
                      <p className="text-sm font-bold text-white">{r.client}</p>
                      <p className="text-[10px] text-gray-500 uppercase font-black tabular-nums">{r.rfc}</p>
                   </td>
                   <td className="py-6 px-4 text-right font-mono font-bold text-white">${r.amount.toLocaleString()}</td>
                   <td className="py-6 px-4">
                      <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                        r.status === 'timbrado' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 
                        r.status === 'error' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 
                        'bg-pop-gold/10 text-pop-gold border-pop-gold/20'
                      }`}>
                        {r.status}
                      </span>
                   </td>
                   <td className="py-6 px-8 text-right">
                      <button className="p-2 bg-white/5 rounded-lg text-gray-400 hover:text-white transition-all">
                        <span className="material-symbols-outlined text-sm">visibility</span>
                      </button>
                   </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Mobile Card List */}
          <div className="lg:hidden divide-y divide-white/5">
            {requests.map(r => (
              <article key={r.id} className="p-6 space-y-4 hover:bg-white/[0.01] transition-all">
                 <div className="flex justify-between items-start">
                    <span className="text-sm font-black text-pop-gold">{r.id}</span>
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                        r.status === 'timbrado' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 
                        r.status === 'error' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 
                        'bg-pop-gold/10 text-pop-gold border-pop-gold/20'
                      }`}>
                        {r.status}
                    </span>
                 </div>
                 <div>
                    <p className="text-base font-black text-white leading-tight">{r.client}</p>
                    <p className="text-[10px] text-gray-500 uppercase font-black tabular-nums mt-1">{r.rfc}</p>
                 </div>
                 <div className="flex justify-between items-end pt-2">
                    <div>
                       <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest mb-1">Monto Total</p>
                       <p className="text-xl font-black text-white font-mono">${r.amount.toLocaleString()}</p>
                    </div>
                    <button className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-gray-300 font-black text-[10px] uppercase tracking-widest">
                       Ver Detalle
                    </button>
                 </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* PAC Configuration - Vertical stacking on mobile */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <article className="bg-[#1C1B1B] p-8 lg:p-10 rounded-3xl border border-white/5">
           <h3 className="text-xl font-black text-white uppercase font-epilogue tracking-tighter mb-8">Configuración Proveedor (PAC)</h3>
           <div className="space-y-6">
              <div className="space-y-2">
                 <label className="text-[9px] font-black uppercase tracking-widest text-gray-500">Proveedor</label>
                 <select className="w-full bg-pop-black border border-white/10 rounded-xl p-4 text-white focus:border-pop-gold outline-none">
                    <option>Facturama (Producción 4.0)</option>
                    <option>SW Sapien</option>
                 </select>
              </div>
              <div className="space-y-2">
                 <label className="text-[9px] font-black uppercase tracking-widest text-gray-500">API Key</label>
                 <input type="password" value="************************" className="w-full bg-pop-black border border-white/10 rounded-xl p-4 text-white focus:border-pop-gold outline-none font-mono" />
              </div>
              <button className="w-full py-4 bg-pop-gold text-pop-black font-black uppercase text-[10px] tracking-widest rounded-xl hover:bg-pop-lightGold shadow-lg">
                Actualizar Credenciales
              </button>
           </div>
        </article>

        <article className="bg-pop-gold/5 p-8 lg:p-10 rounded-3xl border border-pop-gold/10 flex flex-col justify-between">
           <div>
              <div className="flex items-center gap-4 mb-6">
                 <div className="w-14 h-14 bg-pop-gold/10 rounded-2xl flex items-center justify-center text-pop-gold">
                    <span className="material-symbols-outlined text-3xl">verified_user</span>
                 </div>
                 <div>
                    <h4 className="text-white font-black uppercase text-sm tracking-tight">PAC Operational</h4>
                    <p className="text-[10px] text-green-500 font-bold uppercase tracking-widest animate-pulse">Servicio en Línea</p>
                 </div>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed font-manrope">
                La conexión con el SAT es estable. Los folios se están timbrando con una latencia promedio de <span className="text-white font-bold">1.2s</span>.
                Certificado digital vigente por <span className="text-pop-gold font-bold">280 días</span>.
              </p>
           </div>
           <div className="mt-10 pt-8 border-t border-white/5">
              <div className="flex justify-between items-center mb-4">
                 <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Saldo de Folios</span>
                 <span className="text-sm font-black text-white font-mono">14,200</span>
              </div>
              <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                 <div className="h-full bg-pop-gold" style={{ width: '70%' }} />
              </div>
           </div>
        </article>
      </section>
    </main>
  );
}