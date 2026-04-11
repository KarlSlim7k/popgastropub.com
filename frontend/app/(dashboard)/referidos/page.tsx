"use client";

import { useAuth } from "@/lib/auth-provider";
import { useState } from "react";

export default function ReferidosPage() {
  const { session } = useAuth();
  const referralCode = "POP-SOFIA-2026";
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(`https://pop-perote.com/registro?ref=${referralCode}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="pt-24 lg:pt-32 p-4 lg:p-12 max-w-5xl mx-auto space-y-12">
      {/* Header */}
      <header className="flex flex-col lg:flex-row justify-between items-center bg-gradient-to-br from-pop-orange/20 to-pop-gold/10 p-10 lg:p-16 rounded-[2.5rem] border border-pop-gold/20 relative overflow-hidden text-center lg:text-left">
        <div className="absolute top-0 right-0 w-96 h-96 bg-pop-gold/10 blur-[100px] -mr-48 -mt-48" />
        
        <div className="relative z-10 space-y-6 lg:w-3/5">
          <h1 className="text-4xl lg:text-7xl font-black tracking-tighter text-white font-epilogue uppercase leading-none">
            Gana-Gana <br />con POP
          </h1>
          <p className="text-pop-gold text-lg lg:text-xl font-bold uppercase tracking-widest">
            Gana 200 pts por cada amigo referido
          </p>
          <p className="text-gray-400 text-sm font-manrope leading-relaxed max-w-md mx-auto lg:mx-0">
             Comparte tu pasión por el sushi. Cuando tu referido realice su primer pedido, ambos recibirán beneficios exclusivos.
          </p>
        </div>

        <div className="mt-12 lg:mt-0 relative z-10 flex flex-col items-center gap-6">
           <div className="w-48 h-48 rounded-full bg-pop-black/60 backdrop-blur-xl border border-white/10 flex flex-col items-center justify-center p-4">
              <span className="text-5xl font-black text-pop-gold font-epilogue">200</span>
              <span className="text-[10px] text-gray-400 font-black uppercase tracking-[0.3em] mt-2">Puntos por amigo</span>
           </div>
        </div>
      </header>

      {/* Referral Link Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Your Link Card */}
        <section className="lg:col-span-8 space-y-8">
           <article className="bg-[#1C1B1B] p-8 lg:p-10 rounded-3xl border border-white/5 space-y-8">
              <h2 className="text-xs font-black text-gray-500 uppercase tracking-widest">Tu Enlace Personalizado</h2>
              
              <div className="space-y-4">
                 <div className="bg-pop-black/60 border border-white/10 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                    <span className="text-xs font-mono text-gray-400 truncate max-w-[200px] md:max-w-none">
                       pop-perote.com/registro?ref={referralCode}
                    </span>
                    <button 
                      onClick={handleCopy}
                      className={`w-full md:w-auto px-6 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all ${
                        copied ? 'bg-green-500 text-white' : 'bg-pop-gold text-pop-black hover:bg-pop-lightGold'
                      }`}
                    >
                      {copied ? '¡Copiado!' : 'Copiar Enlace'}
                    </button>
                 </div>

                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button className="flex items-center justify-center gap-3 bg-[#25D366]/10 text-[#25D366] py-5 rounded-2xl border border-[#25D366]/20 font-black uppercase text-[10px] tracking-widest hover:bg-[#25D366]/20 transition-all">
                       <span className="material-symbols-outlined text-xl">share</span> WhatsApp
                    </button>
                    <button className="flex items-center justify-center gap-3 bg-[#E1306C]/10 text-[#E1306C] py-5 rounded-2xl border border-[#E1306C]/20 font-black uppercase text-[10px] tracking-widest hover:bg-[#E1306C]/20 transition-all">
                       <span className="material-symbols-outlined text-xl">camera_alt</span> Instagram
                    </button>
                 </div>
              </div>
           </article>

           {/* Referrals Status */}
           <article className="bg-[#1C1B1B] p-8 rounded-3xl border border-white/5 space-y-6">
              <h2 className="text-xs font-black text-gray-500 uppercase tracking-widest px-1">Amigos Invitados</h2>
              <div className="flex flex-col items-center justify-center py-10 opacity-30 space-y-4">
                 <span className="material-symbols-outlined text-6xl">group_add</span>
                 <p className="text-[10px] font-black uppercase tracking-widest">Aún no tienes referidos activos</p>
              </div>
           </article>
        </section>

        {/* Rules Sidebar */}
        <aside className="lg:col-span-4 space-y-8">
           <article className="bg-[#1C1B1B] p-8 rounded-3xl border border-white/5 space-y-8">
              <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest">Cómo Funciona</h3>
              <div className="space-y-8">
                 <div className="flex gap-5">
                    <span className="text-xl font-black text-pop-gold opacity-30 font-epilogue whitespace-nowrap">01</span>
                    <p className="text-xs font-manrope text-gray-400">Envía tu enlace único a un amigo que aún no tenga cuenta en POP.</p>
                 </div>
                 <div className="flex gap-5">
                    <span className="text-xl font-black text-pop-gold opacity-30 font-epilogue whitespace-nowrap">02</span>
                    <p className="text-xs font-manrope text-gray-400">Tu amigo se registra y recibe 50 puntos de bienvenida automáticos.</p>
                 </div>
                 <div className="flex gap-5">
                    <span className="text-xl font-black text-pop-gold opacity-30 font-epilogue whitespace-nowrap">03</span>
                    <p className="text-xs font-manrope text-gray-400">Cuando realice su primer consumo de al menos $200 MXN, ¡tú recibes 200 pts!</p>
                 </div>
              </div>
           </article>

           <article className="p-8 bg-pop-orange/5 border border-pop-orange/10 rounded-3xl">
              <p className="text-[10px] font-black text-pop-gold uppercase tracking-widest mb-2 leading-none">Escala de Beneficio</p>
              <p className="text-xs font-bold text-gray-400 leading-relaxed font-manrope">
                ¡Sin límite! Invite a tantos amigos como quiera. 10 amigos = 2,000 pts (Casi un combo Elite gratis).
              </p>
           </article>
        </aside>

      </div>
    </main>
  );
}
