"use client";

import { useAuth } from "@/lib/auth-provider";
import { useState } from "react";

export default function PerfilPage() {
  const { session, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  
  const userName = session?.user?.name || "Sofía Jiménez Pérez";
  const userPhone = "282 123 4567";
  const userEmail = session?.user?.email || "sofia.jp@example.com";
  const birthDate = "1994-05-21"; // Mocked
  const currentTier = "POP VIP";

  const tierBenefits = [
    { benefit: "Acumulación de puntos", value: "+25% extra", icon: "trending_up" },
    { benefit: "Regalo Cumpleaños", value: "Bebida + 150 pts", icon: "cake" },
    { benefit: "Visitas", value: "Roll gratis cada 5", icon: "restaurant" },
    { benefit: "Eventos", value: "Acceso Anticipado", icon: "event_available" },
  ];

  return (
    <main className="pt-24 lg:pt-32 p-4 lg:p-12 max-w-5xl mx-auto space-y-12">
      {/* Profile Header */}
      <header className="flex flex-col md:flex-row items-center gap-8 bg-[#1C1B1B] p-10 rounded-3xl border border-white/5 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-pop-gold/5 blur-[80px] -ml-32 -mt-32" />
        
        <div className="relative">
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-pop-orange to-pop-gold p-1">
            <div className="w-full h-full rounded-full bg-pop-black flex items-center justify-center text-pop-gold font-black text-4xl font-epilogue uppercase">
              {userName.split(" ").map(n => n[0]).join("").slice(0, 2)}
            </div>
          </div>
          <button className="absolute bottom-0 right-0 bg-pop-gold text-pop-black w-8 h-8 rounded-full flex items-center justify-center shadow-lg border-4 border-pop-black hover:scale-110 transition-transform">
            <span className="material-symbols-outlined text-sm">photo_camera</span>
          </button>
        </div>

        <div className="text-center md:text-left space-y-2">
          <h1 className="text-3xl lg:text-4xl font-black text-white font-epilogue uppercase">{userName}</h1>
          <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-1">
             <span className="bg-pop-gold/10 text-pop-gold border border-pop-gold/20 text-[10px] font-black uppercase px-3 py-1 rounded-full tracking-widest">{currentTier}</span>
             <span className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mt-1">ID Socio: #POP-8291</span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Personal Details Form */}
        <div className="lg:col-span-12">
           <article className="bg-[#1C1B1B] p-8 lg:p-10 rounded-3xl border border-white/5 space-y-10">
              <div className="flex justify-between items-center border-b border-white/5 pb-6">
                 <h2 className="text-xs font-black text-gray-500 uppercase tracking-widest">Información Personal</h2>
                 <button 
                  onClick={() => setIsEditing(!isEditing)}
                  className="text-pop-gold text-[10px] font-black uppercase tracking-widest hover:underline decoration-pop-gold/30 underline-offset-8"
                 >
                   {isEditing ? "Cancelar" : "Editar Perfil"}
                 </button>
              </div>

              <form className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                 <div className="space-y-2 opacity-100 transition-opacity">
                    <label className="text-[10px] text-gray-600 font-black uppercase tracking-[0.2em]">Nombre Completo</label>
                    <input 
                      type="text" 
                      defaultValue={userName} 
                      disabled={!isEditing}
                      className="w-full bg-transparent border-b border-white/10 py-3 text-white font-bold tracking-tight focus:border-pop-gold transition-colors outline-none disabled:text-gray-500"
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] text-gray-600 font-black uppercase tracking-[0.2em]">WhatsApp / Teléfono</label>
                    <input 
                      type="tel" 
                      defaultValue={userPhone} 
                      disabled={!isEditing}
                      className="w-full bg-transparent border-b border-white/10 py-3 text-white font-bold tracking-tight focus:border-pop-gold transition-colors outline-none disabled:text-gray-500"
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] text-gray-600 font-black uppercase tracking-[0.2em]">Correo Electrónico</label>
                    <input 
                      type="email" 
                      defaultValue={userEmail} 
                      disabled={!isEditing}
                      className="w-full bg-transparent border-b border-white/10 py-3 text-white font-bold tracking-tight focus:border-pop-gold transition-colors outline-none disabled:text-gray-500"
                    />
                 </div>

                 {/* Birthday - Critical for Loyalty */}
                 <div className="space-y-2 group relative">
                    <label className="text-[10px] text-pop-orange font-black uppercase tracking-[0.2em] flex items-center gap-2">
                      Fecha de Nacimiento <span className="material-symbols-outlined text-xs">cake</span>
                    </label>
                    <div className="relative">
                      <input 
                        type="date" 
                        defaultValue={birthDate} 
                        disabled={true} // BIRTHDAY IS LOCKED ONCE SET
                        className="w-full bg-transparent border-b border-white/5 py-3 text-gray-500 font-bold tracking-tight outline-none"
                      />
                      <div className="absolute right-0 top-3 text-[8px] font-black text-gray-600 uppercase tracking-widest">ID Protegido</div>
                    </div>
                    <p className="text-[8px] text-gray-700 font-bold uppercase tracking-widest leading-relaxed mt-2 italic">
                      * Por seguridad, tu fecha de nacimiento solo puede ser cambiada contactando a soporte para validar el regalo anual.
                    </p>
                 </div>

                 {isEditing && (
                   <div className="md:col-span-2 pt-4">
                      <button className="w-full lg:w-auto px-10 py-4 bg-pop-gold text-pop-black font-black uppercase text-xs tracking-widest rounded-xl hover:bg-pop-lightGold transition-all">
                        Guardar Cambios
                      </button>
                   </div>
                 )}
              </form>
           </article>
        </div>

        {/* Membership Summary & Benefits */}
        <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-2 gap-10">
           {/* Current Tier Detail */}
           <article className="bg-[#1C1B1B] p-8 lg:p-10 rounded-3xl border border-white/5 space-y-8">
              <h2 className="text-xs font-black text-gray-500 uppercase tracking-widest px-1">Beneficios de Nivel {currentTier}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                 {tierBenefits.map((item, i) => (
                   <div key={i} className="flex gap-4 items-center">
                      <div className="w-10 h-10 bg-pop-gold/5 flex items-center justify-center rounded-xl text-pop-gold">
                         <span className="material-symbols-outlined text-xl">{item.icon}</span>
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest leading-none mb-1">{item.benefit}</p>
                        <p className="text-xs font-bold text-white uppercase">{item.value}</p>
                      </div>
                   </div>
                 ))}
              </div>
           </article>

           {/* Account Actions */}
           <article className="space-y-4">
              <h2 className="text-xs font-black text-gray-500 uppercase tracking-widest px-1">Seguridad e Interfaz</h2>
              <div className="space-y-2">
                 <button className="w-full flex items-center justify-between bg-[#1C1B1B] p-5 rounded-2xl border border-white/5 hover:bg-white/[0.02] transition-all group">
                    <div className="flex items-center gap-4">
                       <span className="material-symbols-outlined text-pop-gold text-xl">lock_reset</span>
                       <span className="text-xs font-black text-white uppercase tracking-tight">Cambiar Contraseña</span>
                    </div>
                    <span className="material-symbols-outlined text-gray-600 group-hover:translate-x-1 transition-transform">chevron_right</span>
                 </button>
                 <button className="w-full flex items-center justify-between bg-[#1C1B1B] p-5 rounded-2xl border border-white/5 hover:bg-white/[0.02] transition-all group">
                    <div className="flex items-center gap-4">
                       <span className="material-symbols-outlined text-pop-gold text-xl">payments</span>
                       <span className="text-xs font-black text-white uppercase tracking-tight">Métodos de Pago</span>
                    </div>
                    <span className="material-symbols-outlined text-gray-600 group-hover:translate-x-1 transition-transform">chevron_right</span>
                 </button>
                 <button className="w-full flex items-center justify-between bg-red-500/5 p-5 rounded-2xl border border-red-500/10 hover:bg-red-500/10 transition-all group group-logout mt-4" onClick={() => logout()}>
                    <div className="flex items-center gap-4">
                       <span className="material-symbols-outlined text-red-500/50 group-hover:text-red-500 text-xl transition-colors">logout</span>
                       <span className="text-xs font-black text-white uppercase tracking-tight">Cerrar Sesión</span>
                    </div>
                 </button>
              </div>
           </article>
        </div>

      </div>
    </main>
  );
}
