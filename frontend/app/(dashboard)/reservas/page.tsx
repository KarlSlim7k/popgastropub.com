"use client";

import { useAuth } from "@/lib/auth-provider";

export default function ReservasPage() {
  const { session } = useAuth();
  
  const activeReservations = [
    { 
      id: "RES-4412", 
      date: "Viernes, 20 Oct", 
      time: "20:30 hrs",
      guests: "4 Personas",
      status: "Confirmada",
      location: "Área Principal - Planta Alta"
    }
  ];

  return (
    <main className="pt-24 lg:pt-32 p-4 lg:p-12 max-w-5xl mx-auto space-y-12">
      {/* Header */}
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
        <div>
          <h1 className="text-4xl lg:text-7xl font-black tracking-tighter text-white font-epilogue uppercase leading-none">
            Mis Reservas
          </h1>
          <p className="text-pop-orange mt-2 text-xs font-bold uppercase tracking-[0.3em]">
            Tu lugar reservado en POP Perote
          </p>
        </div>
        <button className="w-full lg:w-auto px-8 py-4 bg-pop-gold text-pop-black font-black uppercase text-[10px] tracking-widest rounded-xl hover:bg-pop-lightGold shadow-lg transition-all">
          Nueva Reservación
        </button>
      </header>

      {/* Active Bookings */}
      <div className="space-y-6">
        <h2 className="text-xs font-black text-gray-500 uppercase tracking-widest px-1">Próximas Visitas</h2>
        
        {activeReservations.length > 0 ? (
           <div className="grid grid-cols-1 gap-6">
              {activeReservations.map((res, i) => (
                <article key={i} className="bg-[#1C1B1B] rounded-3xl overflow-hidden border border-white/5 group">
                   <div className="flex flex-col lg:flex-row">
                      {/* Visual Context */}
                      <div className="lg:w-1/3 h-48 lg:h-auto overflow-hidden">
                         <img 
                           src="https://lh3.googleusercontent.com/aida-public/AB6AXuBuJxJQ8Yov3h-rdfOh-roeN8Dr0XdASO8zeHu0GW4xfjKjjskW7777abibu0ipYE_K8YdM1H2vw8OC-gQ8IAbr-3MFjlXgmUKc0_jSMBHLMfjUj_cUcizUEUevg9XGWs-Jys5nJzBSrTqKISNwz8BR-yrbGzJ41pg-mYoHWl9r3Zl5W0RBuIBUho_pptkY3fX1UPiTegonwOl8osxZI7Xju7afX4rpA1_flW2-GbC4PNNRHwpCw_brDqYQbgXQTioe-BjVlbWal7AG" 
                           alt="POP Ambiance" 
                           className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000"
                         />
                      </div>
                      
                      {/* Details */}
                      <div className="lg:w-2/3 p-8 flex flex-col justify-between gap-8">
                         <div className="flex justify-between items-start">
                            <div className="space-y-1">
                               <p className="text-pop-gold font-epilogue font-black text-2xl lg:text-3xl uppercase leading-tight">{res.date}</p>
                               <div className="flex items-center gap-4 text-gray-400 font-bold uppercase text-[10px] tracking-widest">
                                  <span>{res.time}</span>
                                  <span className="w-1 h-1 bg-gray-600 rounded-full" />
                                  <span>{res.guests}</span>
                               </div>
                            </div>
                            <span className="bg-green-500/10 text-green-500 border border-green-500/20 text-[9px] font-black uppercase px-3 py-1 rounded-full tracking-widest">
                               {res.status}
                            </span>
                         </div>

                         <div className="flex flex-col sm:flex-row items-center gap-4">
                            <button className="w-full sm:w-auto px-6 py-3 bg-white/5 text-white font-black uppercase text-[10px] tracking-widest rounded-xl hover:bg-white/10 transition-all border border-white/5">
                               Modificar Reserva
                            </button>
                            <button className="w-full sm:w-auto px-6 py-3 bg-red-500/5 text-red-500 font-black uppercase text-[10px] tracking-widest rounded-xl hover:bg-red-500/10 transition-all border border-red-500/5">
                               Cancelar
                            </button>
                         </div>
                      </div>
                   </div>
                </article>
              ))}
           </div>
        ) : (
           <div className="bg-[#1C1B1B] p-12 rounded-3xl border border-dashed border-white/5 text-center space-y-4">
              <span className="material-symbols-outlined text-gray-700 text-5xl">event_busy</span>
              <p className="text-gray-500 font-black uppercase text-[10px] tracking-widest">No tienes reservaciones activas</p>
           </div>
        )}
      </div>

      {/* Past Bookings Summary */}
      <section className="bg-[#1C1B1B] p-8 lg:p-10 rounded-3xl border border-white/5">
         <h2 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-8">Historial de Visitas</h2>
         <div className="space-y-4 opacity-50">
            <div className="flex justify-between items-center py-4 border-b border-white/5">
               <div>
                  <p className="text-sm font-bold text-white uppercase tracking-tight">Sábado, 30 Sep</p>
                  <p className="text-[10px] text-gray-600 font-bold uppercase">2 Pers · Completada</p>
               </div>
               <span className="material-symbols-outlined text-gray-700">task_alt</span>
            </div>
            <div className="flex justify-between items-center py-4">
               <div>
                  <p className="text-sm font-bold text-white uppercase tracking-tight">Viernes, 15 Sep</p>
                  <p className="text-[10px] text-gray-600 font-bold uppercase">4 Pers · Completada</p>
               </div>
               <span className="material-symbols-outlined text-gray-700">task_alt</span>
            </div>
         </div>
      </section>
    </main>
  );
}
