"use client";

import { useAuth } from "@/lib/auth-provider";

export default function PedidosPage() {
  const { session } = useAuth();
  
  const orderHistory = [
    { 
      id: "ORD-9912", 
      date: "12 Oct, 2026", 
      items: "2x California Roll, 10x Wings BBQ, 1x Jarra Clericot",
      total: "$1,450.00",
      pointsEarned: "+145 pts",
      type: "Restaurante"
    },
    { 
      id: "ORD-9845", 
      date: "05 Oct, 2026", 
      items: "1x Dragon Roll, 1x Boneless Mango Habanero",
      total: "$620.00",
      pointsEarned: "+62 pts",
      type: "Para llevar"
    },
    { 
      id: "ORD-9701", 
      date: "28 Sep, 2026", 
      items: "Buffet Sushi (2 personas), 2x Limonadas",
      total: "$1,100.00",
      pointsEarned: "+110 pts",
      type: "Restaurante"
    },
  ];

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
        
        <div className="grid grid-cols-1 gap-4">
           {orderHistory.map((order, i) => (
             <article key={i} className="bg-[#1C1B1B] p-6 lg:p-8 rounded-3xl border border-white/5 hover:border-pop-gold/10 transition-all group">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                   <div className="space-y-4 flex-1">
                      <div className="flex items-center gap-4">
                         <span className="text-[10px] font-black text-pop-gold uppercase tracking-widest bg-pop-gold/5 px-3 py-1 rounded-full border border-pop-gold/20">
                            {order.type}
                         </span>
                         <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest leading-none">
                            {order.id} · {order.date}
                         </span>
                      </div>
                      <h3 className="text-lg font-bold text-white leading-tight uppercase font-manrope">
                         {order.items}
                      </h3>
                   </div>

                   <div className="flex items-center justify-between md:justify-end gap-10 pt-6 md:pt-0 border-t md:border-none border-white/5">
                      <div className="text-left md:text-right">
                         <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mb-1 leading-none">Total Pagado</p>
                         <p className="text-xl font-black text-white font-mono">{order.total}</p>
                      </div>
                      <div className="text-right min-w-[80px]">
                         <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mb-1 leading-none">Ganalia</p>
                         <p className="text-lg font-black text-pop-gold">{order.pointsEarned}</p>
                      </div>
                   </div>
                </div>
             </article>
           ))}
        </div>
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
