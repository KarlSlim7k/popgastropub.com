"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-provider";
import { fetchWithAuth } from "@/lib/api";
import { saveAuthSession } from "@/lib/auth-session";

export default function StaffPerfilPage() {
  const { session, logout, refreshSession } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [showPwModal, setShowPwModal] = useState(false);

  const [form, setForm] = useState({ name: session?.user?.name || "", email: session?.user?.email || "", phone: "" });
  const [pwForm, setPwForm] = useState({ current_password: "", password: "", password_confirmation: "" });

  useEffect(() => {
    if (!session?.token) return;
    fetchWithAuth<any>("/auth/me", session.token).then((u) => {
      const user = u.data ?? u;
      setForm({ name: user.name || "", email: user.email || "", phone: user.phone || "" });
    }).catch(() => {});
  }, [session?.token]);

  const handleSave = async () => {
    if (!session?.token) return;
    setSaving(true);
    try {
      const response = await fetchWithAuth<{ user: typeof session.user }>("/auth/profile", session.token, { method: "PUT", body: JSON.stringify(form) });
      saveAuthSession({ ...session, user: response.user });
      refreshSession();
      setMessage("Perfil actualizado");
      setIsEditing(false);
    } catch (e: any) { setMessage(e.message || "Error"); }
    finally { setSaving(false); setTimeout(() => setMessage(""), 3000); }
  };

  const handlePassword = async () => {
    if (!session?.token) return;
    if (pwForm.password.length < 8) { setMessage("La contraseña debe tener al menos 8 caracteres"); setTimeout(() => setMessage(""), 3000); return; }
    if (pwForm.password !== pwForm.password_confirmation) { setMessage("Las contraseñas no coinciden"); setTimeout(() => setMessage(""), 3000); return; }
    setSaving(true);
    try {
      await fetchWithAuth("/auth/password", session.token, { method: "PUT", body: JSON.stringify(pwForm) });
      setMessage("Contraseña actualizada");
      setShowPwModal(false);
      setPwForm({ current_password: "", password: "", password_confirmation: "" });
    } catch (e: any) { setMessage(e.message || "Error"); }
    finally { setSaving(false); setTimeout(() => setMessage(""), 3000); }
  };

  const userName = form.name || "Staff";

  return (
    <main className="pt-24 lg:pt-20 p-4 lg:p-10 min-h-screen bg-pop-black">
      <header className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-4xl lg:text-5xl font-black tracking-tighter text-white font-epilogue uppercase flex items-center gap-3">
            <span className="material-symbols-outlined text-pop-gold text-5xl">person</span>Mi Perfil
          </h1>
          <p className="text-gray-400 mt-2 text-base font-manrope">Tu información personal y credenciales</p>
        </div>
        <button onClick={() => setIsEditing(!isEditing)} className={`px-5 py-2.5 text-sm font-semibold rounded-lg transition-all flex items-center gap-2 ${isEditing ? "text-gray-400 border border-gray-700" : "text-pop-black bg-pop-gold hover:bg-pop-light-gold"}`}>
          <span className="material-symbols-outlined text-lg">{isEditing ? "close" : "edit"}</span>{isEditing ? "Cancelar" : "Editar"}
        </button>
      </header>

      {message && <div className={`mb-6 p-4 rounded-xl text-sm font-bold ${message.includes("Error") || message.includes("no coinciden") ? "bg-red-500/10 text-red-400" : "bg-green-500/10 text-green-400"}`}>{message}</div>}

      <section className="bg-pop-cardGreen rounded-xl border border-white/5 overflow-hidden mb-8">
        <div className="p-8 border-b border-white/5 flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-pop-orange to-pop-gold p-[3px]">
            <div className="w-full h-full rounded-full bg-pop-black flex items-center justify-center text-pop-gold font-black text-3xl font-epilogue">
              {userName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)}
            </div>
          </div>
          <div className="text-center sm:text-left">
            <h2 className="text-2xl font-black text-white font-epilogue">{userName}</h2>
            <p className="text-sm text-gray-400 mt-1">{form.email}</p>
            <span className="inline-block mt-2 bg-pop-gold/10 text-pop-gold text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">{session?.user?.role === 'admin' ? 'Admin' : 'Staff'}</span>
          </div>
        </div>
        <div className="p-6 lg:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div><label className="text-[10px] uppercase font-bold text-gray-500 block mb-2">Nombre</label><input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} disabled={!isEditing} className="w-full bg-gray-800/50 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:border-pop-gold outline-none disabled:opacity-50 disabled:cursor-not-allowed" /></div>
            <div><label className="text-[10px] uppercase font-bold text-gray-500 block mb-2">Email</label><input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} disabled={!isEditing} className="w-full bg-gray-800/50 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:border-pop-gold outline-none disabled:opacity-50 disabled:cursor-not-allowed" /></div>
            <div><label className="text-[10px] uppercase font-bold text-gray-500 block mb-2">Teléfono</label><input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} disabled={!isEditing} className="w-full bg-gray-800/50 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:border-pop-gold outline-none disabled:opacity-50 disabled:cursor-not-allowed" /></div>
          </div>
          {isEditing && <div className="mt-6 flex justify-end"><button onClick={handleSave} disabled={saving} className="px-6 py-2.5 text-sm font-semibold text-pop-black bg-pop-gold rounded-lg hover:bg-pop-light-gold disabled:opacity-50">{saving ? "Guardando..." : "Guardar Cambios"}</button></div>}
        </div>
      </section>

      <div className="space-y-2">
        <button onClick={() => setShowPwModal(true)} className="w-full flex items-center justify-between bg-pop-cardGreen p-5 rounded-xl border border-white/5 hover:bg-white/[0.02] transition-all">
          <div className="flex items-center gap-4"><span className="material-symbols-outlined text-pop-gold">lock_reset</span><span className="text-xs font-black text-white uppercase">Cambiar Contraseña</span></div>
          <span className="material-symbols-outlined text-gray-600">chevron_right</span>
        </button>
        <button onClick={() => logout()} className="w-full flex items-center justify-between bg-red-500/5 p-5 rounded-xl border border-red-500/10 hover:bg-red-500/10 transition-all">
          <div className="flex items-center gap-4"><span className="material-symbols-outlined text-red-500/50">logout</span><span className="text-xs font-black text-white uppercase">Cerrar Sesión</span></div>
        </button>
      </div>

      {showPwModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-pop-black/90 backdrop-blur-xl" onClick={() => setShowPwModal(false)} />
          <div className="relative bg-pop-cardGreen border border-white/10 w-full max-w-md rounded-3xl overflow-hidden">
            <div className="p-6 border-b border-white/5 flex justify-between items-center"><h2 className="text-xl font-black uppercase font-epilogue text-white">Cambiar Contraseña</h2><button onClick={() => setShowPwModal(false)} className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-gray-500"><span className="material-symbols-outlined">close</span></button></div>
            <div className="p-6 space-y-5">
              <div><label className="text-[9px] font-black uppercase tracking-widest text-gray-500">Actual</label><input type="password" value={pwForm.current_password} onChange={(e) => setPwForm({ ...pwForm, current_password: e.target.value })} className="w-full bg-pop-black border border-white/10 rounded-xl p-3 text-white focus:border-pop-gold outline-none text-sm mt-2" /></div>
              <div><label className="text-[9px] font-black uppercase tracking-widest text-gray-500">Nueva</label><input type="password" value={pwForm.password} onChange={(e) => setPwForm({ ...pwForm, password: e.target.value })} className="w-full bg-pop-black border border-white/10 rounded-xl p-3 text-white focus:border-pop-gold outline-none text-sm mt-2" /></div>
              <div><label className="text-[9px] font-black uppercase tracking-widest text-gray-500">Confirmar</label><input type="password" value={pwForm.password_confirmation} onChange={(e) => setPwForm({ ...pwForm, password_confirmation: e.target.value })} className="w-full bg-pop-black border border-white/10 rounded-xl p-3 text-white focus:border-pop-gold outline-none text-sm mt-2" /></div>
            </div>
            <div className="p-6 border-t border-white/5 flex gap-3"><button onClick={() => setShowPwModal(false)} className="flex-1 py-3 text-xs font-black text-gray-500 uppercase">Cancelar</button><button onClick={handlePassword} disabled={saving} className="flex-[2] py-3 bg-pop-gold text-pop-black text-xs font-black uppercase rounded-xl disabled:opacity-50">{saving ? "..." : "Cambiar"}</button></div>
          </div>
        </div>
      )}
    </main>
  );
}
