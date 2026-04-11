"use client";

import { useAuth } from "@/lib/auth-provider";

export default function MisFacturasPage() {
  const { session } = useAuth();
  const userName = session?.user?.name || "Cliente";

  const requestedInvoices = [
    { id: "POP-8821", date: "12 Oct, 2026", amount: "$1,450.00", status: "timbrado", description: "Consumo Familia" },
    { id: "POP-8822", date: "08 Oct, 2026", amount: "$820.00", status: "pendiente", description: "Cena de Negocios" },
    { id: "POP-8823", date: "01 Oct, 2026", amount: "$450.00", status: "error", description: "Consumo General" },
  ];

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
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Column: List of Invoices */}
        <div className="lg:col-span-8 space-y-6">
           <h2 className="text-xs font-black text-gray-500 uppercase tracking-widest px-1">Historial de Folios</h2>
           
           <div className="space-y-4">
              {requestedInvoices.map((inv, i) => (
                <article key={i} className="bg-[#1C1B1B] p-6 rounded-2xl border border-white/5 hover:border-pop-gold/10 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6">
                   <div className="flex items-start gap-5">
                      <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-gray-500">
                         <span className="material-symbols-outlined text-2xl">picture_as_pdf</span>
                      </div>
                      <div>
                         <div className="flex items-center gap-3">
                            <span className="text-sm font-black text-white uppercase">{inv.id}</span>
                            <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest border ${
                               inv.status === 'timbrado' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 
                               inv.status === 'error' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 
                               'bg-pop-gold/10 text-pop-gold border-pop-gold/20'
                            }`}>
                               {inv.status}
                            </span>
                         </div>
                         <p className="text-xs text-gray-400 mt-1 font-bold">{inv.description}</p>
                         <p className="text-[10px] text-gray-600 mt-1 uppercase font-black">{inv.date}</p>
                      </div>
                   </div>

                   <div className="flex items-center justify-between md:justify-end gap-8 pt-4 md:pt-0 border-t md:border-none border-white/5">
                      <div className="text-left md:text-right">
                         <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest leading-none mb-1">Total</p>
                         <p className="text-lg font-black text-white font-mono">{inv.amount}</p>
                      </div>
                      <div className="flex gap-2">
                         {inv.status === 'timbrado' && (
                           <>
                             <button className="w-10 h-10 flex items-center justify-center bg-white/5 rounded-xl text-pop-gold hover:bg-pop-gold/10 transition-all">
                                <span className="material-symbols-outlined text-xl">file_download</span>
                             </button>
                             <button className="w-10 h-10 flex items-center justify-center bg-white/5 rounded-xl text-gray-400 hover:text-white transition-all">
                                <span className="material-symbols-outlined text-xl">share</span>
                             </button>
                           </>
                         )}
                         {inv.status === 'error' && (
                            <button className="px-4 py-2 bg-red-500/10 text-red-500 text-[9px] font-black uppercase tracking-widest rounded-lg border border-red-500/20">
                               Revisar Error
                            </button>
                         )}
                      </div>
                   </div>
                </article>
              ))}
           </div>
        </div>

        {/* Right Column: Tax Profile */}
        <aside className="lg:col-span-4 space-y-8">
           <article className="bg-[#1C1B1B] p-8 rounded-3xl border border-white/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-pop-orange/5 blur-[50px] -mr-16 -mt-16" />
              <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-8 relative z-10">Datos Fiscales Registrados</h3>
              
              <div className="space-y-6 relative z-10">
                 <div className="space-y-1">
                    <p className="text-[9px] text-gray-600 font-black uppercase tracking-widest">RFC</p>
                    <p className="text-base font-black text-pop-gold font-mono tracking-tighter">SOFJ880421H34</p>
                 </div>
                 <div className="space-y-1">
                    <p className="text-[9px] text-gray-600 font-black uppercase tracking-widest">Razón Social</p>
                    <p className="text-sm font-black text-white leading-tight">SOFÍA JIMÉNEZ PÉREZ</p>
                 </div>
                 <div className="space-y-1">
                    <p className="text-[9px] text-gray-600 font-black uppercase tracking-widest">Código Postal</p>
                    <p className="text-sm font-black text-white">91270</p>
                 </div>
                 
                 <div className="pt-6 border-t border-white/5">
                    <button className="w-full py-4 text-pop-gold text-[10px] font-black uppercase tracking-widest border border-pop-gold/20 rounded-xl hover:bg-pop-gold/5 transition-all">
                      Actualizar Datos SAT
                    </button>
                 </div>
              </div>
           </article>

           <article className="p-8 bg-pop-orange/5 border border-pop-orange/10 rounded-3xl">
              <span className="material-symbols-outlined text-pop-orange text-3xl mb-4">info</span>
              <p className="text-xs font-bold text-gray-400 leading-relaxed font-manrope">
                Asegúrate de que tu nombre y código postal coincidan exactamente con tu <span className="text-white">Constancia de Situación Fiscal</span> para evitar errores de timbrado CFDI 4.0.
              </p>
           </article>
        </aside>

      </div>
    </main>
  );
}
