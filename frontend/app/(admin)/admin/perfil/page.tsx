"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-provider";
import { fetchWithAuth } from "@/lib/api";
import { getAuthSession, saveAuthSession } from "@/lib/auth-session";

export default function AdminPerfilPage() {
  const { session, refreshSession } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const userName = session?.user?.name || "Admin User";
  const userEmail = session?.user?.email || "admin@pop-perote.com";

  const [formData, setFormData] = useState({
    name: userName,
    email: userEmail,
    phone: "",
  });

  const [passwordData, setPasswordData] = useState({
    current_password: "",
    password: "",
    password_confirmation: "",
  });

  useEffect(() => {
    const auth = getAuthSession();
    if (!auth) return;
    fetchWithAuth<any>("/auth/me", auth.token).then((user) => {
      setFormData({ name: user.name || "", email: user.email || "", phone: user.phone || "" });
    }).catch(() => {});
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const saveProfile = async () => {
    const auth = getAuthSession();
    if (!auth) return;
    setSaving(true);
    setMessage("");
    try {
      const response = await fetchWithAuth<{ user: typeof auth.user }>("/auth/profile", auth.token, {
        method: "PUT",
        body: JSON.stringify(formData),
      });
      saveAuthSession({ ...auth, user: response.user });
      refreshSession();
      setMessage("Perfil actualizado correctamente");
      setIsEditing(false);
    } catch (e: any) {
      setMessage(e.message || "Error al guardar");
    } finally {
      setSaving(false);
    }
  };

  const savePassword = async () => {
    const auth = getAuthSession();
    if (!auth) return;
    if (passwordData.password !== passwordData.password_confirmation) {
      setMessage("Las contraseñas no coinciden");
      return;
    }
    setSaving(true);
    setMessage("");
    try {
      await fetchWithAuth("/auth/password", auth.token, {
        method: "PUT",
        body: JSON.stringify(passwordData),
      });
      setMessage("Contraseña actualizada correctamente");
      setPasswordData({ current_password: "", password: "", password_confirmation: "" });
    } catch (e: any) {
      setMessage(e.message || "Error al cambiar contraseña");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="pt-24 lg:pt-20 p-4 lg:p-10 min-h-screen bg-pop-black">
      <header className="mb-8 lg:mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-4xl lg:text-5xl font-black tracking-tighter text-white font-epilogue uppercase flex items-center gap-3">
            <span className="material-symbols-outlined text-pop-gold text-5xl">person</span>
            Mi Perfil
          </h1>
          <p className="text-gray-400 mt-2 text-base lg:text-lg font-manrope">Gestiona tu información personal y credenciales</p>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className={`px-5 py-2.5 text-sm font-semibold rounded-lg transition-all flex items-center gap-2 ${isEditing ? "text-gray-400 border border-gray-700 hover:bg-gray-800/50" : "text-pop-black bg-pop-gold hover:bg-pop-light-gold"}`}
        >
          <span className="material-symbols-outlined text-lg">{isEditing ? "close" : "edit"}</span>
          {isEditing ? "Cancelar" : "Editar Perfil"}
        </button>
      </header>

      {message && (
        <div className={`mb-6 p-4 rounded-xl text-sm font-bold ${message.includes("Error") || message.includes("no coinciden") ? "bg-red-500/10 text-red-400 border border-red-500/20" : "bg-green-500/10 text-green-400 border border-green-500/20"}`}>
          {message}
        </div>
      )}

      <section className="bg-pop-cardGreen rounded-xl border border-white/5 overflow-hidden mb-8">
        <div className="p-8 border-b border-white/5 flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-pop-orange to-pop-gold p-[3px] flex-shrink-0">
            <div className="w-full h-full rounded-full bg-pop-black flex items-center justify-center text-pop-gold font-black text-3xl font-epilogue">
              {userName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
            </div>
          </div>
          <div className="text-center sm:text-left flex-1">
            <h2 className="text-2xl font-black text-white font-epilogue">{userName}</h2>
            <p className="text-sm text-gray-400 mt-1">{userEmail}</p>
            <div className="flex flex-wrap gap-2 mt-3 justify-center sm:justify-start">
              <span className="bg-pop-gold/10 text-pop-gold text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">Admin</span>
            </div>
          </div>
        </div>

        <div className="p-6 lg:p-8">
          <h3 className="text-lg font-black uppercase font-epilogue tracking-tighter text-white mb-6 flex items-center gap-3">
            <span className="material-symbols-outlined text-pop-gold">badge</span>Información Personal
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-[10px] uppercase font-bold text-gray-500 block mb-2">Nombre Completo</label>
              <input type="text" name="name" value={formData.name} onChange={handleInputChange} disabled={!isEditing} className="w-full bg-gray-800/50 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-pop-gold/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed" />
            </div>
            <div>
              <label className="text-[10px] uppercase font-bold text-gray-500 block mb-2">Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleInputChange} disabled={!isEditing} className="w-full bg-gray-800/50 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-pop-gold/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed" />
            </div>
            <div>
              <label className="text-[10px] uppercase font-bold text-gray-500 block mb-2">Teléfono</label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} disabled={!isEditing} className="w-full bg-gray-800/50 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-pop-gold/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed" />
            </div>
            <div>
              <label className="text-[10px] uppercase font-bold text-gray-500 block mb-2">Rol</label>
              <input type="text" value="Administrador" disabled className="w-full bg-gray-800/30 border border-white/5 rounded-lg px-4 py-3 text-sm text-gray-500 cursor-not-allowed" />
            </div>
          </div>
          {isEditing && (
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setIsEditing(false)} className="px-6 py-2.5 text-sm font-semibold text-gray-400 border border-gray-700 rounded-lg hover:bg-gray-800/50 transition-all">Descartar</button>
              <button onClick={saveProfile} disabled={saving} className="px-6 py-2.5 text-sm font-semibold text-pop-black bg-pop-gold rounded-lg hover:bg-pop-light-gold transition-all disabled:opacity-50">{saving ? "Guardando..." : "Guardar Cambios"}</button>
            </div>
          )}
        </div>
      </section>

      <section className="bg-pop-cardGreen rounded-xl border border-white/5 overflow-hidden">
        <div className="p-6 lg:p-8">
          <h3 className="text-lg font-black uppercase font-epilogue tracking-tighter text-white mb-6 flex items-center gap-3">
            <span className="material-symbols-outlined text-pop-gold">lock</span>Cambiar Contraseña
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-[10px] uppercase font-bold text-gray-500 block mb-2">Contraseña Actual</label>
              <input type="password" name="current_password" value={passwordData.current_password} onChange={handlePasswordChange} disabled={!isEditing} placeholder="••••••••" className="w-full bg-gray-800/50 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-pop-gold/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed" />
            </div>
            <div />
            <div>
              <label className="text-[10px] uppercase font-bold text-gray-500 block mb-2">Nueva Contraseña</label>
              <input type="password" name="password" value={passwordData.password} onChange={handlePasswordChange} disabled={!isEditing} placeholder="Mínimo 8 caracteres" className="w-full bg-gray-800/50 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-pop-gold/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed" />
            </div>
            <div>
              <label className="text-[10px] uppercase font-bold text-gray-500 block mb-2">Confirmar Contraseña</label>
              <input type="password" name="password_confirmation" value={passwordData.password_confirmation} onChange={handlePasswordChange} disabled={!isEditing} placeholder="Repite la contraseña" className="w-full bg-gray-800/50 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-pop-gold/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed" />
            </div>
          </div>
          {isEditing && (
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setPasswordData({ current_password: "", password: "", password_confirmation: "" })} className="px-6 py-2.5 text-sm font-semibold text-gray-400 border border-gray-700 rounded-lg hover:bg-gray-800/50 transition-all">Limpiar</button>
              <button onClick={savePassword} disabled={saving} className="px-6 py-2.5 text-sm font-semibold text-pop-black bg-pop-gold rounded-lg hover:bg-pop-light-gold transition-all flex items-center gap-2 disabled:opacity-50">
                <span className="material-symbols-outlined text-lg">lock_reset</span>{saving ? "Actualizando..." : "Actualizar Contraseña"}
              </button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
