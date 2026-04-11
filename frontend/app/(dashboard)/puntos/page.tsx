"use client";

import { useAuth } from "@/lib/auth-provider";
import { useState } from "react";

export default function PuntosPage() {
  const { session, logout } = useAuth();
  const userName = session?.user?.name || "Sofía Jiménez";
  const userPoints = 1250;
  const nextTierPoints = 1500;
  const progress = (userPoints / nextTierPoints) * 100;

  const [activeTab, setActiveTab] = useState<"beneficios" | "historial">("beneficios");

  const recentActivity = [
    { date: "12 OCT", description: "Consumo: Dragon Roll + Bebida", pts: "+185", type: "earn" },
    { date: "08 OCT", description: "Bonificación: Visita de Martes", pts: "+50", type: "earn" },
    { date: "01 OCT", description: "Canje: Bebida Gratis", pts: "-250", type: "redeem" },
  ];

  const benefits = [
    { icon: "celebration", title: "Bebida cumpleañera", status: "Disponible" },
    { icon: "stars", title: "+25% puntos por compra", status: "Activo" },
    { icon: "confirmation_number", title: "Acceso VIP a eventos", status: "Activo" },
  ];

  return (
    <main className="pt-24 lg:pt-32 p-4 lg:p-12 max-w-7xl mx-auto space-y-12">
      {/* Hero Welcome */}
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
        <div>
          <h1 className="text-4xl lg:text-7xl font-black tracking-tighter text-white font-epilogue uppercase leading-none">
            ¡Hola, {userName.split(" ")[0]}! 👋
          </h1>
          <div className="flex items-center gap-3 mt-4">
             <span className="bg-pop-gold text-pop-black text-[10px] font-black uppercase px-3 py-1 rounded-full tracking-widest">POP VIP</span>
             <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Miembro desde Abril 2024</p>
          </div>
        </div>
        <div className="text-left lg:text-right">
           <p className="text-5xl lg:text-6xl font-black text-pop-gold font-epilogue tracking-tighter leading-none">{userPoints.toLocaleString()}</p>
           <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.3em] mt-2">Puntos Disponibles</p>
        </div>
      </header>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        
        {/* Left Column: Card & Progress */}
        <section className="lg:col-span-8 space-y-10">
           
           {/* Loyalty Card (Digital Check-in) */}
           <article className="relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-[#1C1B1B] to-[#0D0D0D] p-[1.5px] rounded-3xl">
                <div className="w-full h-full bg-[#0D0D0D] rounded-3xl overflow-hidden relative p-8 lg:p-10">
                   {/* Card Texture/Pattern */}
                   <div className="absolute top-0 right-0 w-64 h-64 bg-pop-gold/5 blur-[80px] -mr-32 -mt-32" />
                   
                   <div className="flex flex-col lg:flex-row justify-between gap-10 relative z-10">
                      <div className="flex-1 space-y-8">
                         <div>
                            <span className="text-xs font-black text-pop-gold uppercase tracking-[0.4em]">Digital Membership</span>
                            <h2 className="text-3xl font-black text-white uppercase mt-1">Obsidian Elite Card</h2>
                         </div>
                         <div className="space-y-1">
                            <p className="text-xs text-gray-500 font-bold uppercase mt-1">ID Socio</p>
                            <p className="text-xl font-mono text-white tracking-widest leading-none">#### #### #### 8291</p>
                         </div>
                         <div className="flex gap-10">
                            <div>
                               <p className="text-[10px] text-gray-500 font-bold uppercase">Nivel</p>
                               <p className="text-sm font-black text-pop-gold uppercase">VIP Member</p>
                            </div>
                            <div>
                               <p className="text-[10px] text-gray-500 font-bold uppercase">Expira</p>
                               <p className="text-sm font-black text-white">12 / 2026</p>
                            </div>
                         </div>
                      </div>

                      {/* QR Code Section */}
                      <div className="bg-white p-6 rounded-2xl flex flex-col items-center gap-3 w-fit mx-auto lg:mx-0 shadow-[0_0_30px_rgba(255,255,255,0.05)]">
                         <div className="w-32 h-32 bg-black flex items-center justify-center">
                            {/* Placeholder for QR - In real app use qrcode.react */}
                            <span className="material-symbols-outlined text-white text-6xl">qr_code_2</span>
                         </div>
                         <p className="text-[8px] font-black uppercase text-black tracking-[0.2em] leading-none">Check-in at Bar</p>
                      </div>
                   </div>
                </div>
              </div>
           </article>

           {/* Progress Tracker */}
           <article className="bg-[#1C1B1B] p-8 lg:p-10 rounded-3xl border border-white/5 space-y-6">
              <div className="flex justify-between items-end">
                 <div>
                    <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest">Próximo Nivel</h3>
                    <p className="text-2xl font-black text-white mt-1 uppercase">Hacia POP Elite 🏆</p>
                 </div>
                 <p className="text-sm font-black text-pop-gold">Faltan {nextTierPoints - userPoints} pts</p>
              </div>
              
              <div className="space-y-3">
                 <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-500">
                    <span>VIP</span>
                    <span className="text-pop-gold text-sm">{Math.round(progress)}%</span>
                    <span>ELITE</span>
                 </div>
                 <div className="h-2 bg-pop-black rounded-full overflow-hidden border border-white/5 p-[1.5px]">
                    <div className="h-full bg-gradient-to-r from-pop-orange to-pop-gold rounded-full shadow-[0_0_15px_rgba(242,199,119,0.3)] transition-all duration-1000" style={{ width: `${progress}%` }} />
                 </div>
              </div>
           </article>

           {/* Tabs: Beneficios vs Historial */}
           <article>
              <nav className="flex gap-8 border-b border-white/5 mb-8">
                 {(["beneficios", "historial"] as const).map(tab => (
                   <button 
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-4 text-[10px] font-black uppercase tracking-widest transition-all relative ${activeTab === tab ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}
                   >
                     {tab}
                     {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-pop-gold" />}
                   </button>
                 ))}
              </nav>

              <div className="space-y-4">
                 {activeTab === 'beneficios' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                       {benefits.map((b, i) => (
                         <div key={i} className="bg-[#1C1B1B] p-6 rounded-2xl border border-white/5 group hover:border-pop-gold/20 transition-all">
                            <span className="material-symbols-outlined text-pop-gold text-3xl mb-4 group-hover:scale-110 transition-transform">{b.icon}</span>
                            <p className="text-xs font-black text-white uppercase leading-tight mb-2">{b.title}</p>
                            <span className="text-[9px] font-black text-pop-orange uppercase tracking-widest">{b.status}</span>
                         </div>
                       ))}
                    </div>
                 ) : (
                    <div className="space-y-3">
                       {recentActivity.map((a, i) => (
                         <div key={i} className="bg-[#1C1B1B] p-5 rounded-2xl border border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                               <span className="text-[10px] font-black text-gray-500 w-12">{a.date}</span>
                               <p className="text-xs font-bold text-white uppercase">{a.description}</p>
                            </div>
                            <span className={`text-xs font-black ${a.type === 'earn' ? 'text-green-500' : 'text-pop-orange'}`}>
                               {a.pts}
                            </span>
                         </div>
                       ))}
                    </div>
                 )}
              </div>
           </article>
        </section>

        {/* Right Column: Context/Shortcuts */}
        <aside className="lg:col-span-4 space-y-10">
           {/* Current Promo Banner */}
           <article className="relative h-64 rounded-3xl overflow-hidden group">
              <img 
                src="https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=600&fit=crop" 
                alt="Sushi" 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent p-6 flex flex-col justify-end">
                 <span className="text-[9px] font-black text-pop-gold uppercase tracking-widest mb-1">Membresía VIP</span>
                 <h3 className="text-2xl font-black text-white uppercase leading-none">Promo 2x1 en Rolls Acevichados</h3>
                 <p className="text-[10px] text-gray-400 mt-2 font-bold uppercase tracking-widest">Disponible cada Martes</p>
              </div>
           </article>

           {/* Quick Action List */}
           <section className="space-y-4">
              <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest px-1">Atajos</h3>
              <div className="space-y-2">
                 {[
                   { label: "Historial de Pedidos", icon: "history", href: "/pedidos" },
                   { label: "Mis Reservas", icon: "event_seat", href: "/reservas" },
                   { label: "Gana 200 pts", icon: "group_add", href: "/referidos" },
                   { label: "Mis Facturas (CFDI)", icon: "receipt_long", href: "/mis-facturas" },
                 ].map((link, i) => (
                   <a key={i} href={link.href} className="flex items-center justify-between bg-[#1C1B1B] p-5 rounded-2xl border border-white/5 hover:bg-white/[0.02] transition-all group">
                      <div className="flex items-center gap-4">
                         <span className="material-symbols-outlined text-pop-gold text-xl">{link.icon}</span>
                         <span className="text-xs font-black text-white uppercase tracking-tight">{link.label}</span>
                      </div>
                      <span className="material-symbols-outlined text-gray-600 group-hover:translate-x-1 transition-transform">chevron_right</span>
                   </a>
                 ))}
                 
                 <button 
                  onClick={() => logout()}
                  className="flex items-center justify-between w-full bg-[#1C1B1B] p-5 rounded-2xl border border-white/5 hover:bg-red-500/5 hover:border-red-500/20 transition-all group group-logout mt-4"
                 >
                    <div className="flex items-center gap-4">
                       <span className="material-symbols-outlined text-red-500/50 group-hover:text-red-500 text-xl transition-colors">logout</span>
                       <span className="text-xs font-black text-white uppercase tracking-tight">Cerrar Sesión Segura</span>
                    </div>
                    <span className="material-symbols-outlined text-gray-600 group-hover:translate-x-1 transition-transform">chevron_right</span>
                 </button>
              </div>
           </section>

           {/* Support Card */}
           <article className="bg-[#1C1B1B] p-8 rounded-3xl border-2 border-white/5 border-dashed text-center">
              <span className="material-symbols-outlined text-gray-600 text-4xl mb-4">support_agent</span>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest leading-relaxed">¿Necesitas ayuda con tus puntos?</p>
              <button className="text-pop-gold text-[10px] font-black uppercase mt-4 underline underline-offset-4 decoration-pop-gold/30">Contactar Soporte VIP</button>
           </article>
        </aside>
      </div>
    </main>
  );
}
