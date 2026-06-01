"use client";

import { useAuth } from "@/lib/auth-provider";
import { fetchWithAuth, fetchAPI } from "@/lib/api";
import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import Image from "next/image";

interface Tier {
  name: string;
  min_points: number;
  max_points: number | null;
}

interface PointsData {
  points: number;
}

interface HistoryItem {
  id: number;
  description: string;
  points: number;
  type: "earn" | "redeem";
  created_at: string;
}

const TIER_BENEFITS: Record<string, { icon: string; title: string; status: string }[]> = {
  fan: [
    { icon: "loyalty", title: "Promos básicas", status: "Activo" },
    { icon: "token", title: "1 pt por cada $10 MXN", status: "Activo" },
    { icon: "location_on", title: "Check-in +25 pts", status: "Activo" },
  ],
  lover: [
    { icon: "stars", title: "+10% puntos por compra", status: "Activo" },
    { icon: "celebration", title: "Bebida cumpleañera gratis", status: "Disponible" },
    { icon: "campaign", title: "Promo exclusiva mensual", status: "Activo" },
  ],
  vip: [
    { icon: "stars", title: "+25% puntos por compra", status: "Activo" },
    { icon: "restaurant", title: "Roll gratis cada 5 visitas", status: "Activo" },
    { icon: "bolt", title: "Acceso anticipado a promos", status: "Activo" },
  ],
  elite: [
    { icon: "stars", title: "+50% puntos por compra", status: "Activo" },
    { icon: "event_seat", title: "Reserva prioritaria", status: "Activo" },
    { icon: "confirmation_number", title: "1 buffet gratis/mes", status: "Disponible" },
  ],
};

export default function PuntosPage() {
  const { session, logout } = useAuth();
  const userName = session?.user?.name || "Cliente";
  const token = session?.token || "";

  const [points, setPoints] = useState<number>(0);
  const [tier, setTier] = useState<Tier | null>(null);
  const [nextTier, setNextTier] = useState<Tier | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [memberSince, setMemberSince] = useState<string | null>(null);
  const [userTierKey, setUserTierKey] = useState<string>("fan");

  const [activeTab, setActiveTab] = useState<"beneficios" | "historial">("beneficios");
  const [checkinDone, setCheckinDone] = useState(false);
  const [historyVisible, setHistoryVisible] = useState(10);
  const [promo, setPromo] = useState<{ nombre: string; descripcion?: string; imagen?: string } | null>(null);

  const handleCheckin = async () => {
    if (!token || checkinDone) return;
    try {
      const res = await fetchWithAuth<any>("/loyalty/checkin", token, { method: "POST" });
      setPoints(res.points ?? points + 25);
      setCheckinDone(true);
    } catch {}
  };

  useEffect(() => {
    fetchAPI<any[]>("/promociones")
      .then((data) => { if (data?.length) setPromo(data[0]); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!token) return;

    async function fetchData() {
      try {
        setLoading(true);
        const [pointsRes, tierRes, historyRes] = await Promise.all([
          fetchWithAuth<any>("/loyalty/points", token),
          fetchWithAuth<any>("/loyalty/tier", token),
          fetchWithAuth<any>("/loyalty/history", token),
        ]);
        setPoints(pointsRes.user?.points ?? pointsRes.points ?? 0);
        setMemberSince(pointsRes.user?.created_at ?? null);
        setUserTierKey(pointsRes.user?.tier ?? tierRes.user?.tier ?? "fan");
        setTier(tierRes.current_tier ? { name: tierRes.current_tier.name, min_points: tierRes.current_tier.min, max_points: tierRes.current_tier.max } : null);
        setNextTier(tierRes.next_tier ? { name: tierRes.next_tier.name, min_points: tierRes.next_tier.min, max_points: tierRes.next_tier.max } : null);
        const hist = Array.isArray(historyRes) ? historyRes : historyRes.data ?? [];
        setHistory(hist.map((h: any) => ({ id: h.id, description: h.concept ?? h.description ?? '', points: h.points, type: h.points >= 0 ? 'earn' : 'redeem', created_at: h.created_at })));
      } catch (err: any) {
        setError(err?.message || "Error al cargar datos de fidelidad");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [token]);

  const userPoints = points;
  const nextTierPoints = nextTier?.min_points ?? (tier?.max_points ? tier.max_points + 1 : userPoints + 1);
  const progress = nextTier ? ((userPoints - (tier?.min_points ?? 0)) / ((nextTier.min_points - (tier?.min_points ?? 0)) || 1)) * 100 : 100;

  const benefits = TIER_BENEFITS[userTierKey] || TIER_BENEFITS.fan;

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("es-MX", { day: "2-digit", month: "short" }).toUpperCase();
  };

  return (
    <main className="pt-24 lg:pt-32 p-4 lg:p-12 max-w-7xl mx-auto space-y-12">
      {/* Hero Welcome */}
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
        <div>
          <h1 className="text-4xl lg:text-7xl font-black tracking-tighter text-white font-epilogue uppercase leading-none">
            ¡Hola, {userName.split(" ")[0]}! 👋
          </h1>
          <div className="flex items-center gap-3 mt-4">
             <span className="bg-pop-gold text-pop-black text-[10px] font-black uppercase px-3 py-1 rounded-full tracking-widest">{tier?.name?.toUpperCase() || "POP FAN"}</span>
             <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Miembro desde {memberSince ? new Date(memberSince).toLocaleDateString("es-MX", { month: "long", year: "numeric" }) : "—"}</p>
          </div>
        </div>
        <div className="text-left lg:text-right space-y-3">
           <p className="text-5xl lg:text-6xl font-black text-pop-gold font-epilogue tracking-tighter leading-none">{userPoints.toLocaleString()}</p>
           <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.3em] mt-2">Puntos Disponibles</p>
           <button onClick={handleCheckin} disabled={checkinDone} className={`mt-2 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${checkinDone ? "bg-green-500/10 text-green-400 border border-green-500/20" : "bg-pop-gold text-pop-black hover:bg-pop-lightGold"}`}>
             <span className="material-symbols-outlined text-sm align-middle mr-1">{checkinDone ? "check_circle" : "location_on"}</span>
             {checkinDone ? "Check-in ✓ +25 pts" : "Check-in (+25 pts)"}
           </button>
        </div>
      </header>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        
        {/* Left Column: Card & Progress */}
        <section className="lg:col-span-8 space-y-10">
           
           {/* Loyalty Card (Digital Check-in) */}
           <article className="relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-pop-cardGreen to-pop-black p-[1.5px] rounded-3xl">
                <div className="w-full h-full bg-pop-black rounded-3xl overflow-hidden relative p-8 lg:p-10">
                   {/* Card Texture/Pattern */}
                   <div className="absolute top-0 right-0 w-64 h-64 bg-pop-gold/5 blur-[80px] -mr-32 -mt-32" />
                   
                   <div className="flex flex-col lg:flex-row justify-between gap-10 relative z-10">
                      <div className="flex-1 space-y-8">
                         <div>
                            <span className="text-xs font-black text-pop-gold uppercase tracking-[0.4em]">Digital Membership</span>
                            <h2 className="text-3xl font-black text-white uppercase mt-1">{tier?.name || "POP Fan"} Card</h2>
                         </div>
                         <div className="space-y-1">
                            <p className="text-xs text-gray-500 font-bold uppercase mt-1">ID Socio</p>
                            <p className="text-xl font-mono text-white tracking-widest leading-none">#### #### #### {String(session?.user?.id ?? 0).padStart(4, "0")}</p>
                         </div>
                         <div className="flex gap-10">
                            <div>
                               <p className="text-[10px] text-gray-500 font-bold uppercase">Nivel</p>
                               <p className="text-sm font-black text-pop-gold uppercase">{tier?.name || "POP Fan"}</p>
                            </div>
                            <div>
                               <p className="text-[10px] text-gray-500 font-bold uppercase">Expira</p>
                               <p className="text-sm font-black text-white">{String(new Date().getMonth() + 1).padStart(2, "0")} / {new Date().getFullYear() + 1}</p>
                            </div>
                         </div>
                      </div>

                      {/* QR Code Section */}
                      <div className="bg-white p-4 rounded-2xl flex flex-col items-center gap-2 w-fit mx-auto lg:mx-0 shadow-[0_0_30px_rgba(255,255,255,0.05)]">
                         <QRCodeSVG
                           value={`pop-checkin:${session?.user?.id || 0}`}
                           size={128}
                           bgColor="#ffffff"
                           fgColor="#0D0D0D"
                           level="M"
                         />
                         <p className="text-[8px] font-black uppercase text-black tracking-[0.2em] leading-none">Check-in at Bar</p>
                      </div>
                   </div>
                </div>
              </div>
           </article>

           {/* Progress Tracker */}
           <article className="bg-pop-cardGreen p-8 lg:p-10 rounded-3xl border border-white/5 space-y-6">
              <div className="flex justify-between items-end">
                 <div>
                    <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest">Próximo Nivel</h3>
                    <p className="text-2xl font-black text-white mt-1 uppercase">Hacia {nextTier?.name?.toUpperCase() || "POP ELITE"} 🏆</p>
                 </div>
                 <p className="text-sm font-black text-pop-gold">Faltan {Math.max(0, nextTierPoints - userPoints)} pts</p>
              </div>
              
              <div className="space-y-3">
                 <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-500">
                    <span>{tier?.name?.toUpperCase() || "VIP"}</span>
                    <span className="text-pop-gold text-sm">{Math.round(Math.min(100, Math.max(0, progress)))}%</span>
                    <span>{nextTier?.name?.toUpperCase() || "ELITE"}</span>
                 </div>
                 <div className="h-2 bg-pop-black rounded-full overflow-hidden border border-white/5 p-[1.5px]">
                    <div className="h-full bg-gradient-to-r from-pop-orange to-pop-gold rounded-full shadow-[0_0_15px_rgba(242,199,119,0.3)] transition-all duration-1000" style={{ width: `${Math.min(100, Math.max(0, progress))}%` }} />
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
                         <div key={i} className="bg-pop-cardGreen p-6 rounded-2xl border border-white/5 group hover:border-pop-gold/20 transition-all">
                            <span className="material-symbols-outlined text-pop-gold text-3xl mb-4 group-hover:scale-110 transition-transform">{b.icon}</span>
                            <p className="text-xs font-black text-white uppercase leading-tight mb-2">{b.title}</p>
                            <span className="text-[9px] font-black text-pop-orange uppercase tracking-widest">{b.status}</span>
                         </div>
                       ))}
                    </div>
                 ) : (
                    <div className="space-y-3">
                       {loading ? (
                         <div className="bg-pop-cardGreen p-8 rounded-2xl border border-white/5 text-center">
                            <div className="w-6 h-6 border-2 border-pop-gold border-t-transparent rounded-full animate-spin mx-auto" />
                            <p className="text-xs text-gray-500 mt-4 font-bold uppercase tracking-widest">Cargando historial...</p>
                         </div>
                       ) : error ? (
                         <div className="bg-pop-cardGreen p-8 rounded-2xl border border-white/5 text-center">
                            <span className="material-symbols-outlined text-red-500 text-3xl mb-2">error</span>
                            <p className="text-xs text-red-400 font-bold uppercase tracking-widest">{error}</p>
                         </div>
                       ) : history.length === 0 ? (
                         <div className="bg-pop-cardGreen p-8 rounded-2xl border border-white/5 text-center">
                            <span className="material-symbols-outlined text-gray-600 text-4xl mb-4">history</span>
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest leading-relaxed">Aún no tienes actividad en tu cuenta.<br/>¡Haz tu primera compra para empezar a acumular puntos!</p>
                         </div>
                       ) : (
                         <>
                         {history.slice(0, historyVisible).map((a) => (
                           <div key={a.id} className="bg-pop-cardGreen p-5 rounded-2xl border border-white/5 flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                 <span className="text-[10px] font-black text-gray-500 w-12">{formatDate(a.created_at)}</span>
                                 <p className="text-xs font-bold text-white uppercase">{a.description}</p>
                              </div>
                              <span className={`text-xs font-black ${a.type === 'earn' ? 'text-green-500' : 'text-pop-orange'}`}>
                                 {a.type === 'earn' ? '+' : ''}{a.points}
                              </span>
                           </div>
                         ))}
                         {history.length > historyVisible && (
                           <button onClick={() => setHistoryVisible((v) => v + 10)} className="w-full py-3 bg-white/5 border border-white/5 rounded-2xl text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-pop-gold transition-all">
                             Ver más ({history.length - historyVisible} restantes)
                           </button>
                         )}
                         </>
                       )}
                    </div>
                 )}
              </div>
           </article>
        </section>

        {/* Right Column: Context/Shortcuts */}
        <aside className="lg:col-span-4 space-y-10">
           {/* Current Promo Banner */}
           <article className="relative h-64 rounded-3xl overflow-hidden group">
              <Image
                src={promo?.imagen || "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=600&fit=crop"}
                alt={promo?.nombre || "Promoción"}
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent p-6 flex flex-col justify-end">
                 <span className="text-[9px] font-black text-pop-gold uppercase tracking-widest mb-1">Promo Activa</span>
                 <h3 className="text-2xl font-black text-white uppercase leading-none">{promo?.nombre || "Descubre nuestras promos"}</h3>
                 {promo?.descripcion && <p className="text-[10px] text-gray-400 mt-2 font-bold uppercase tracking-widest line-clamp-2">{promo.descripcion}</p>}
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
                   <a key={i} href={link.href} className="flex items-center justify-between bg-pop-cardGreen p-5 rounded-2xl border border-white/5 hover:bg-white/[0.02] transition-all group">
                      <div className="flex items-center gap-4">
                         <span className="material-symbols-outlined text-pop-gold text-xl">{link.icon}</span>
                         <span className="text-xs font-black text-white uppercase tracking-tight">{link.label}</span>
                      </div>
                      <span className="material-symbols-outlined text-gray-600 group-hover:translate-x-1 transition-transform">chevron_right</span>
                   </a>
                 ))}
                 
                 <button 
                  onClick={() => logout()}
                  className="flex items-center justify-between w-full bg-pop-cardGreen p-5 rounded-2xl border border-white/5 hover:bg-red-500/5 hover:border-red-500/20 transition-all group group-logout mt-4"
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
           <article className="bg-pop-cardGreen p-8 rounded-3xl border-2 border-white/5 border-dashed text-center">
              <span className="material-symbols-outlined text-gray-600 text-4xl mb-4">support_agent</span>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest leading-relaxed">¿Necesitas ayuda con tus puntos?</p>
              <a href="https://wa.me/522821278014?text=Hola%2C%20necesito%20ayuda%20con%20mis%20POP%20Points" target="_blank" rel="noopener noreferrer" className="text-pop-gold text-[10px] font-black uppercase mt-4 underline underline-offset-4 decoration-pop-gold/30 inline-block">Contactar Soporte VIP</a>
           </article>
        </aside>
      </div>
    </main>
  );
}
