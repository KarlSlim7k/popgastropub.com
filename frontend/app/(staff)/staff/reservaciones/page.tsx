"use client";

import React from 'react';

const reservations = [
  { id: '1', name: 'Laura Martínez', time: '19:30', guests: 4, table: 'Mesa 12', status: 'confirmed' },
  { id: '2', name: 'Carlos Ruiz', time: '20:00', guests: 2, table: 'Terraza 4', status: 'arrived' },
  { id: '3', name: 'Sofía Elena', time: '20:30', guests: 6, table: 'VIP 1', status: 'pending' },
  { id: '4', name: 'Roberto Gómez', time: '21:00', guests: 3, table: 'Mesa 8', status: 'pending' },
];

export default function StaffReservationsPage() {
  return (
    <main className="pt-24 lg:pt-20 p-6 lg:p-10 min-h-screen bg-pop-black">
      {/* Header */}
      <header className="mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
        <div>
          <h1 className="text-4xl lg:text-5xl font-black tracking-tighter text-white font-epilogue uppercase">
            Reservaciones
          </h1>
          <p className="text-pop-orange mt-2 text-xs font-bold uppercase tracking-[0.3em]">
            Gestión de mesas • Hoy, 10 de Abril
          </p>
        </div>
        <div className="flex gap-4">
          <button className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white text-[10px] font-bold uppercase tracking-widest rounded-lg border border-white/10 transition-all">
            Ver Mapa de Mesas
          </button>
          <button className="px-6 py-3 bg-pop-gold text-pop-black text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-pop-lightGold transition-all">
            Nueva Reserva
          </button>
        </div>
      </header>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Reservation List */}
        <section className="lg:col-span-2 space-y-6">
          <div className="bg-[#1C1B1B] p-8 rounded-xl border border-white/5">
            <h2 className="text-2xl font-black uppercase font-epilogue tracking-tighter text-white mb-8 flex items-center gap-3">
              Próximas Reservas
              <span className="text-[10px] font-bold text-pop-gold bg-pop-gold/10 px-2 py-0.5 rounded tracking-widest uppercase">
                {reservations.length} total
              </span>
            </h2>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/5 text-[10px] uppercase tracking-[0.2em] text-gray-500">
                    <th className="pb-4 font-bold">Hora</th>
                    <th className="pb-4 font-bold">Cliente</th>
                    <th className="pb-4 font-bold">Personas</th>
                    <th className="pb-4 font-bold">Ubicación</th>
                    <th className="pb-4 text-right font-bold">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {reservations.map((res) => (
                    <tr key={res.id} className="group hover:bg-white/[0.02] transition-colors">
                      <td className="py-6 font-mono text-pop-gold text-lg font-bold">{res.time}</td>
                      <td className="py-6">
                        <p className="text-white font-bold">{res.name}</p>
                        <p className="text-[10px] text-gray-500 uppercase font-black">Cliente VIP</p>
                      </td>
                      <td className="py-6 text-gray-300 font-mono">{res.guests} pax</td>
                      <td className="py-6">
                        <span className="text-gray-300 font-medium">{res.table}</span>
                      </td>
                      <td className="py-6 text-right">
                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                          res.status === 'confirmed' ? 'bg-blue-500/10 text-blue-400' :
                          res.status === 'arrived' ? 'bg-green-500/10 text-green-400' :
                          'bg-pop-orange/10 text-pop-orange'
                        }`}>
                          {res.status === 'confirmed' ? 'Confirmado' :
                           res.status === 'arrived' ? 'En Mesa' : 'Pendiente'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Status & Quick Actions */}
        <aside className="space-y-8">
          {/* Table Summary */}
          <article className="bg-[#1C1B1B] p-8 rounded-xl border border-white/5 ring-1 ring-pop-gold/5">
            <h3 className="text-lg font-black uppercase font-epilogue tracking-tighter text-white mb-6">Estado del Salón</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-pop-black/40 rounded-lg border border-white/5">
                <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">Ocupación</span>
                <span className="text-xl font-black text-white">75%</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-pop-black/40 rounded-lg border border-white/5">
                <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">Mesas Libres</span>
                <span className="text-xl font-black text-pop-gold font-mono text-glow">08</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-pop-black/40 rounded-lg border border-white/5">
                <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">Turno</span>
                <span className="text-[10px] font-black text-pop-orange uppercase tracking-widest">Comida / Cena</span>
              </div>
            </div>
          </article>

          {/* Waitlist */}
          <article className="bg-[#1C1B1B] p-8 rounded-xl border border-white/5">
            <h3 className="text-lg font-black uppercase font-epilogue tracking-tighter text-white mb-6">Lista de Espera</h3>
            <div className="space-y-4 mb-6">
              <div className="p-4 border-l-2 border-pop-orange bg-white/[0.02]">
                <p className="text-sm font-bold text-white">Familia Pérez</p>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-[10px] text-gray-500 font-bold uppercase">5 Pax • 15 min esp.</span>
                  <button className="text-[10px] font-black text-pop-gold uppercase hover:underline">Asignar</button>
                </div>
              </div>
            </div>
            <button className="w-full py-3 bg-white/5 hover:bg-white/10 text-white text-[10px] font-bold uppercase tracking-widest rounded-lg border border-white/10 transition-all">
              Añadir a la lista
            </button>
          </article>
        </aside>
      </div>
    </main>
  );
}
