"use client";

import { useAuth } from "@/lib/auth-provider";
import { fetchWithAuth } from "@/lib/api";
import { saveAuthSession } from "@/lib/auth-session";
import { usePushNotifications } from "@/lib/usePushNotifications";
import { useEffect, useState } from "react";

interface UserProfile {
  id: number;
  name: string;
  email: string;
  phone?: string;
  birth_date?: string;
  tier?: string;
  points?: number;
  created_at?: string;
  newsletter_subscribed?: boolean;
}

export default function PerfilPage() {
  const { session, logout, refreshSession } = useAuth();
  const { permission, subscribed, subscribe, unsubscribe } = usePushNotifications(session?.token ?? null);
  const token = session?.token || "";
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newsletterSaving, setNewsletterSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const [form, setForm] = useState({ name: "", email: "", phone: "", birth_date: "" });
  const [pwForm, setPwForm] = useState({ current_password: "", password: "", password_confirmation: "" });

  useEffect(() => {
    if (!token) return;
    fetchWithAuth<any>("/auth/me", token)
      .then((res) => {
        const u = res.data ?? res;
        setProfile(u);
        setForm({ name: u.name || "", email: u.email || "", phone: u.phone || "", birth_date: u.birth_date || "" });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token]);

  const handleSave = async () => {
    if (!token) return;
    setSaving(true);
    setMessage("");
    try {
      const res = await fetchWithAuth<any>("/auth/profile", token, { method: "PUT", body: JSON.stringify(form) });
      const u = res.user ?? res;
      setProfile((prev) => ({ ...prev, ...u }));
      if (session) {
        saveAuthSession({ ...session, user: u });
        refreshSession();
      }
      setIsEditing(false);
      setMessage("Perfil actualizado");
      setTimeout(() => setMessage(""), 3000);
    } catch (e: any) { setMessage(e.message || "Error al guardar"); }
    finally { setSaving(false); }
  };

  const handleNewsletterToggle = async () => {
    if (!token || !profile) return;
    const next = !profile.newsletter_subscribed;
    setNewsletterSaving(true);
    setMessage("");
    try {
      const res = await fetchWithAuth<any>("/auth/profile", token, { method: "PUT", body: JSON.stringify({ newsletter_subscribed: next }) });
      const u = res.user ?? res;
      setProfile((prev) => (prev ? { ...prev, ...u } : prev));
    } catch (e: any) { setMessage(e.message || "Error al actualizar la suscripción"); }
    finally { setNewsletterSaving(false); }
  };

  const handlePasswordChange = async () => {
    if (!token) return;
    if (pwForm.password !== pwForm.password_confirmation) { setMessage("Las contraseñas no coinciden"); return; }
    setSaving(true);
    setMessage("");
    try {
      await fetchWithAuth("/auth/password", token, { method: "PUT", body: JSON.stringify(pwForm) });
      setMessage("Contraseña actualizada");
      setShowPasswordModal(false);
      setPwForm({ current_password: "", password: "", password_confirmation: "" });
      setTimeout(() => setMessage(""), 3000);
    } catch (e: any) { setMessage(e.message || "Error al cambiar contraseña"); }
    finally { setSaving(false); }
  };

  const userName = form.name || session?.user?.name || "Cliente";
  const currentTier = profile?.tier ? `POP ${profile.tier.charAt(0).toUpperCase() + profile.tier.slice(1)}` : "POP Fan";

  const tierBenefitsMap: Record<string, { benefit: string; value: string; icon: string }[]> = {
    fan: [
      { benefit: "Acumulación", value: "1 pt / $10 MXN", icon: "token" },
      { benefit: "Check-in", value: "+25 pts/visita", icon: "location_on" },
      { benefit: "Promos", value: "Básicas", icon: "campaign" },
      { benefit: "Referidos", value: "+200 pts", icon: "group_add" },
    ],
    lover: [
      { benefit: "Acumulación", value: "+10% extra", icon: "trending_up" },
      { benefit: "Cumpleaños", value: "Bebida gratis", icon: "cake" },
      { benefit: "Promo mensual", value: "Exclusiva", icon: "campaign" },
      { benefit: "Referidos", value: "+200 pts", icon: "group_add" },
    ],
    vip: [
      { benefit: "Acumulación", value: "+25% extra", icon: "trending_up" },
      { benefit: "Cumpleaños", value: "Bebida + 150 pts", icon: "cake" },
      { benefit: "Visitas", value: "Roll gratis cada 5", icon: "restaurant" },
      { benefit: "Promos", value: "Acceso anticipado", icon: "bolt" },
    ],
    elite: [
      { benefit: "Acumulación", value: "+50% extra", icon: "trending_up" },
      { benefit: "Reserva", value: "Mesa prioritaria", icon: "event_seat" },
      { benefit: "Eventos", value: "Invitación VIP", icon: "confirmation_number" },
      { benefit: "Buffet", value: "1 gratis/mes", icon: "restaurant" },
    ],
  };
  const tierBenefits = tierBenefitsMap[profile?.tier || "fan"] || tierBenefitsMap.fan;

  return (
    <main className="pt-24 lg:pt-32 p-4 lg:p-12 max-w-5xl mx-auto space-y-12">
      {message && (
        <div className={`p-4 rounded-xl text-sm font-bold ${message.includes("Error") || message.includes("no coinciden") ? "bg-red-500/10 text-red-400 border border-red-500/20" : "bg-green-500/10 text-green-400 border border-green-500/20"}`}>{message}</div>
      )}

      <header className="flex flex-col md:flex-row items-center gap-8 bg-pop-cardGreen p-10 rounded-3xl border border-white/5 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-pop-gold/5 blur-[80px] -ml-32 -mt-32" />
        <div className="relative">
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-pop-orange to-pop-gold p-1">
            <div className="w-full h-full rounded-full bg-pop-black flex items-center justify-center text-pop-gold font-black text-4xl font-epilogue uppercase">
              {userName.split(" ").map(n => n[0]).join("").slice(0, 2)}
            </div>
          </div>
        </div>
        <div className="text-center md:text-left space-y-2">
          <h1 className="text-3xl lg:text-4xl font-black text-white font-epilogue uppercase">{userName}</h1>
          <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-1">
            <span className="bg-pop-gold/10 text-pop-gold border border-pop-gold/20 text-[10px] font-black uppercase px-3 py-1 rounded-full tracking-widest">{currentTier}</span>
            <span className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mt-1">ID Socio: #POP-{String(profile?.id || session?.user?.id || 0).padStart(4, "0")}</span>
          </div>
          {profile?.points !== undefined && (
            <p className="text-xs text-pop-gold font-bold">{profile.points.toLocaleString()} puntos acumulados</p>
          )}
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-12">
          <article className="bg-pop-cardGreen p-8 lg:p-10 rounded-3xl border border-white/5 space-y-10">
            <div className="flex justify-between items-center border-b border-white/5 pb-6">
              <h2 className="text-xs font-black text-gray-500 uppercase tracking-widest">Información Personal</h2>
              <button onClick={() => setIsEditing(!isEditing)} className="text-pop-gold text-[10px] font-black uppercase tracking-widest hover:underline decoration-pop-gold/30 underline-offset-8">
                {isEditing ? "Cancelar" : "Editar Perfil"}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
              <div className="space-y-2">
                <label className="text-[10px] text-gray-600 font-black uppercase tracking-[0.2em]">Nombre Completo</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} disabled={!isEditing || loading} className="w-full bg-transparent border-b border-white/10 py-3 text-white font-bold tracking-tight focus:border-pop-gold transition-colors outline-none disabled:text-gray-500" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] text-gray-600 font-black uppercase tracking-[0.2em]">WhatsApp / Teléfono</label>
                <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} disabled={!isEditing || loading} className="w-full bg-transparent border-b border-white/10 py-3 text-white font-bold tracking-tight focus:border-pop-gold transition-colors outline-none disabled:text-gray-500" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] text-gray-600 font-black uppercase tracking-[0.2em]">Correo Electrónico</label>
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} disabled={!isEditing || loading} className="w-full bg-transparent border-b border-white/10 py-3 text-white font-bold tracking-tight focus:border-pop-gold transition-colors outline-none disabled:text-gray-500" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] text-gray-600 font-black uppercase tracking-[0.2em]">Fecha de nacimiento</label>
                <input type="date" value={form.birth_date} onChange={(e) => setForm({ ...form, birth_date: e.target.value })} disabled={!isEditing || loading} max={new Date().toISOString().slice(0, 10)} className="w-full bg-transparent border-b border-white/10 py-3 text-white font-bold tracking-tight focus:border-pop-gold transition-colors outline-none disabled:text-gray-500" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] text-pop-orange font-black uppercase tracking-[0.2em] flex items-center gap-2">Miembro desde <span className="material-symbols-outlined text-xs">calendar_month</span></label>
                <p className="py-3 text-gray-500 font-bold">{profile?.created_at ? new Date(profile.created_at).toLocaleDateString("es-MX", { month: "long", year: "numeric" }) : "—"}</p>
              </div>
              {isEditing && (
                <div className="md:col-span-2 pt-4">
                  <button onClick={handleSave} disabled={saving} className="w-full lg:w-auto px-10 py-4 bg-pop-gold text-pop-black font-black uppercase text-xs tracking-widest rounded-xl hover:bg-pop-lightGold transition-all disabled:opacity-50">
                    {saving ? "Guardando..." : "Guardar Cambios"}
                  </button>
                </div>
              )}
            </div>
          </article>
        </div>

        <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-2 gap-10">
          <article className="bg-pop-cardGreen p-8 lg:p-10 rounded-3xl border border-white/5 space-y-8">
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

          <article className="space-y-4">
            <h2 className="text-xs font-black text-gray-500 uppercase tracking-widest px-1">Seguridad</h2>
            <div className="space-y-2">
              <button onClick={() => setShowPasswordModal(true)} className="w-full flex items-center justify-between bg-pop-cardGreen p-5 rounded-2xl border border-white/5 hover:bg-white/[0.02] transition-all group">
                <div className="flex items-center gap-4">
                  <span className="material-symbols-outlined text-pop-gold text-xl">lock_reset</span>
                  <span className="text-xs font-black text-white uppercase tracking-tight">Cambiar Contraseña</span>
                </div>
                <span className="material-symbols-outlined text-gray-600 group-hover:translate-x-1 transition-transform">chevron_right</span>
              </button>
              <button
                onClick={subscribed ? unsubscribe : subscribe}
                disabled={permission === "denied"}
                className="w-full flex items-center justify-between bg-pop-cardGreen p-5 rounded-2xl border border-white/5 hover:bg-white/[0.02] transition-all"
              >
                <div className="flex items-center gap-4">
                  <span className="material-symbols-outlined text-pop-gold text-xl">notifications</span>
                  <div>
                    <span className="text-xs font-black text-white uppercase tracking-tight">Notificaciones Push</span>
                    <p className="text-[9px] text-gray-500 mt-0.5">{permission === "denied" ? "Bloqueadas en el navegador" : subscribed ? "Activas en este dispositivo" : "Recibe alertas en tiempo real"}</p>
                  </div>
                </div>
                <span className={`text-[9px] font-black uppercase px-2 py-1 rounded-full ${subscribed ? "bg-green-500/10 text-green-400" : "bg-white/5 text-gray-500"}`}>{subscribed ? "Activo" : "Inactivo"}</span>
              </button>
              <button
                onClick={handleNewsletterToggle}
                disabled={newsletterSaving || loading}
                className="w-full flex items-center justify-between bg-pop-cardGreen p-5 rounded-2xl border border-white/5 hover:bg-white/[0.02] transition-all disabled:opacity-50"
              >
                <div className="flex items-center gap-4">
                  <span className="material-symbols-outlined text-pop-gold text-xl">mail</span>
                  <div>
                    <span className="text-xs font-black text-white uppercase tracking-tight">Newsletter</span>
                    <p className="text-[9px] text-gray-500 mt-0.5">Promociones y noticias por correo</p>
                  </div>
                </div>
                <span className={`text-[9px] font-black uppercase px-2 py-1 rounded-full ${profile?.newsletter_subscribed ? "bg-green-500/10 text-green-400" : "bg-white/5 text-gray-500"}`}>{profile?.newsletter_subscribed ? "Activo" : "Inactivo"}</span>
              </button>
              <button onClick={() => logout()} className="w-full flex items-center justify-between bg-red-500/5 p-5 rounded-2xl border border-red-500/10 hover:bg-red-500/10 transition-all group mt-4">
                <div className="flex items-center gap-4">
                  <span className="material-symbols-outlined text-red-500/50 group-hover:text-red-500 text-xl transition-colors">logout</span>
                  <span className="text-xs font-black text-white uppercase tracking-tight">Cerrar Sesión</span>
                </div>
              </button>
            </div>
          </article>
        </div>
      </div>

      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-pop-black/90 backdrop-blur-xl" onClick={() => setShowPasswordModal(false)} />
          <div className="relative bg-pop-cardGreen border border-white/10 w-full max-w-md rounded-3xl overflow-hidden shadow-2xl">
            <header className="p-6 border-b border-white/5 flex justify-between items-center">
              <h2 className="text-xl font-black uppercase font-epilogue tracking-tighter text-white">Cambiar Contraseña</h2>
              <button onClick={() => setShowPasswordModal(false)} className="w-10 h-10 flex items-center justify-center bg-white/5 rounded-full text-gray-500">
                <span className="material-symbols-outlined">close</span>
              </button>
            </header>
            <div className="p-6 space-y-5">
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-gray-500">Contraseña Actual</label>
                <input type="password" value={pwForm.current_password} onChange={(e) => setPwForm({ ...pwForm, current_password: e.target.value })} placeholder="••••••••" className="w-full bg-pop-black border border-white/10 rounded-xl p-3 text-white focus:border-pop-gold outline-none text-sm placeholder-gray-600" />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-gray-500">Nueva Contraseña</label>
                <input type="password" value={pwForm.password} onChange={(e) => setPwForm({ ...pwForm, password: e.target.value })} placeholder="Mínimo 8 caracteres" className="w-full bg-pop-black border border-white/10 rounded-xl p-3 text-white focus:border-pop-gold outline-none text-sm placeholder-gray-600" />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-gray-500">Confirmar Contraseña</label>
                <input type="password" value={pwForm.password_confirmation} onChange={(e) => setPwForm({ ...pwForm, password_confirmation: e.target.value })} placeholder="Repite la contraseña" className="w-full bg-pop-black border border-white/10 rounded-xl p-3 text-white focus:border-pop-gold outline-none text-sm placeholder-gray-600" />
              </div>
            </div>
            <footer className="p-6 border-t border-white/5 flex gap-3">
              <button onClick={() => setShowPasswordModal(false)} className="flex-1 py-3 text-xs font-black text-gray-500 uppercase tracking-widest">Cancelar</button>
              <button onClick={handlePasswordChange} disabled={saving} className="flex-[2] py-3 bg-pop-gold text-pop-black text-xs font-black uppercase tracking-widest rounded-xl hover:bg-pop-lightGold disabled:opacity-50">{saving ? "Actualizando..." : "Cambiar Contraseña"}</button>
            </footer>
          </div>
        </div>
      )}
    </main>
  );
}
