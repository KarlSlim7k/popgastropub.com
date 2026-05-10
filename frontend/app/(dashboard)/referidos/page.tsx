"use client";

import { useAuth } from "@/lib/auth-provider";
import { fetchWithAuth } from "@/lib/api";
import { useState, useEffect } from "react";

interface ReferralData {
  referral_code: string;
  total_referrals: number;
  converted: number;
  points_earned: number;
  referrals: { id: number; name: string; status: string; date: string; converted_at?: string }[];
}

export default function ReferidosPage() {
  const { session } = useAuth();
  const token = session?.token || "";
  const [data, setData] = useState<ReferralData | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!token) return;
    fetchWithAuth<ReferralData>("/referidos", token).then(setData).catch(() => {});
  }, [token]);

  const referralCode = data?.referral_code || "...";
  const referralUrl = `https://popgastropub.com/registro?ref=${referralCode}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareWhatsApp = () => {
    const text = encodeURIComponent(`¡Únete a POP Perote y gana 50 puntos de bienvenida! 🍣🎉 Regístrate aquí: ${referralUrl}`);
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  const shareInstagram = () => {
    navigator.clipboard.writeText(referralUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    window.open("https://www.instagram.com/pop_perote/", "_blank");
  };

  return (
    <main className="pt-24 lg:pt-32 p-4 lg:p-12 max-w-5xl mx-auto space-y-12">
      <header className="flex flex-col lg:flex-row justify-between items-center bg-gradient-to-br from-pop-orange/20 to-pop-gold/10 p-10 lg:p-16 rounded-[2.5rem] border border-pop-gold/20 relative overflow-hidden text-center lg:text-left">
        <div className="absolute top-0 right-0 w-96 h-96 bg-pop-gold/10 blur-[100px] -mr-48 -mt-48" />
        <div className="relative z-10 space-y-6 lg:w-3/5">
          <h1 className="text-4xl lg:text-7xl font-black tracking-tighter text-white font-epilogue uppercase leading-none">Gana-Gana<br />con POP</h1>
          <p className="text-pop-gold text-lg lg:text-xl font-bold uppercase tracking-widest">Gana 200 pts por cada amigo referido</p>
          <p className="text-gray-400 text-sm font-manrope leading-relaxed max-w-md mx-auto lg:mx-0">Comparte tu pasión por el sushi. Cuando tu referido realice su primer pedido, ambos recibirán beneficios exclusivos.</p>
        </div>
        <div className="mt-12 lg:mt-0 relative z-10 flex flex-col items-center gap-4">
          <div className="w-48 h-48 rounded-full bg-pop-black/60 backdrop-blur-xl border border-white/10 flex flex-col items-center justify-center p-4">
            <span className="text-5xl font-black text-pop-gold font-epilogue">{data?.points_earned || 0}</span>
            <span className="text-[10px] text-gray-400 font-black uppercase tracking-[0.3em] mt-2">Pts ganados</span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <section className="lg:col-span-8 space-y-8">
          <article className="bg-[#1C1B1B] p-8 lg:p-10 rounded-3xl border border-white/5 space-y-8">
            <h2 className="text-xs font-black text-gray-500 uppercase tracking-widest">Tu Enlace Personalizado</h2>
            <div className="space-y-4">
              <div className="bg-pop-black/60 border border-white/10 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                <span className="text-xs font-mono text-gray-400 truncate max-w-[200px] md:max-w-none">popgastropub.com/registro?ref={referralCode}</span>
                <button onClick={handleCopy} className={`w-full md:w-auto px-6 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all ${copied ? "bg-green-500 text-white" : "bg-pop-gold text-pop-black hover:bg-pop-lightGold"}`}>
                  {copied ? "¡Copiado!" : "Copiar Enlace"}
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button onClick={shareWhatsApp} className="flex items-center justify-center gap-3 bg-[#25D366]/10 text-[#25D366] py-5 rounded-2xl border border-[#25D366]/20 font-black uppercase text-[10px] tracking-widest hover:bg-[#25D366]/20 transition-all">
                  <span className="material-symbols-outlined text-xl">share</span> WhatsApp
                </button>
                <button onClick={shareInstagram} className="flex items-center justify-center gap-3 bg-[#E1306C]/10 text-[#E1306C] py-5 rounded-2xl border border-[#E1306C]/20 font-black uppercase text-[10px] tracking-widest hover:bg-[#E1306C]/20 transition-all">
                  <span className="material-symbols-outlined text-xl">camera_alt</span> Instagram
                </button>
              </div>
            </div>
          </article>

          <article className="bg-[#1C1B1B] p-8 rounded-3xl border border-white/5 space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xs font-black text-gray-500 uppercase tracking-widest">Amigos Invitados</h2>
              <span className="text-xs font-black text-pop-gold">{data?.total_referrals || 0} total</span>
            </div>
            {data?.referrals && data.referrals.length > 0 ? (
              <div className="space-y-3">
                {data.referrals.map((r) => (
                  <div key={r.id} className="flex items-center justify-between bg-pop-black/40 p-4 rounded-xl border border-white/5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-pop-gold/10 flex items-center justify-center text-pop-gold font-black text-xs">{r.name.charAt(0)}</div>
                      <div>
                        <p className="text-sm font-bold text-white">{r.name}</p>
                        <p className="text-[10px] text-gray-500">{r.date}</p>
                      </div>
                    </div>
                    <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${r.status === "converted" ? "bg-green-500/10 text-green-400" : "bg-pop-gold/10 text-pop-gold"}`}>
                      {r.status === "converted" ? "Convertido" : "Pendiente"}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 opacity-30 space-y-4">
                <span className="material-symbols-outlined text-6xl">group_add</span>
                <p className="text-[10px] font-black uppercase tracking-widest">Aún no tienes referidos activos</p>
              </div>
            )}
          </article>
        </section>

        <aside className="lg:col-span-4 space-y-8">
          <article className="bg-[#1C1B1B] p-8 rounded-3xl border border-white/5 space-y-8">
            <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest">Cómo Funciona</h3>
            <div className="space-y-8">
              <div className="flex gap-5"><span className="text-xl font-black text-pop-gold opacity-30 font-epilogue">01</span><p className="text-xs font-manrope text-gray-400">Envía tu enlace único a un amigo que aún no tenga cuenta en POP.</p></div>
              <div className="flex gap-5"><span className="text-xl font-black text-pop-gold opacity-30 font-epilogue">02</span><p className="text-xs font-manrope text-gray-400">Tu amigo se registra y recibe 50 puntos de bienvenida automáticos.</p></div>
              <div className="flex gap-5"><span className="text-xl font-black text-pop-gold opacity-30 font-epilogue">03</span><p className="text-xs font-manrope text-gray-400">Cuando realice su primer consumo de al menos $200 MXN, ¡tú recibes 200 pts!</p></div>
            </div>
          </article>
          <article className="p-8 bg-pop-orange/5 border border-pop-orange/10 rounded-3xl">
            <p className="text-[10px] font-black text-pop-gold uppercase tracking-widest mb-2">Escala de Beneficio</p>
            <p className="text-xs font-bold text-gray-400 leading-relaxed font-manrope">¡Sin límite! 10 amigos = 2,000 pts (Casi un combo Elite gratis).</p>
          </article>
        </aside>
      </div>
    </main>
  );
}
