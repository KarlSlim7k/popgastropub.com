"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/lib/auth-provider";
import { fetchWithAuth, APIError } from "@/lib/api";
import { getAuthSession, saveAuthSession, type AuthSessionUser } from "@/lib/auth-session";

type MessageKind = "success" | "error" | "info";

interface Message {
  kind: MessageKind;
  text: string;
}

export default function AdminPerfilPage() {
  const { session, refreshSession } = useAuth();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [message, setMessage] = useState<Message | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [passwordData, setPasswordData] = useState({
    current_password: "",
    password: "",
    password_confirmation: "",
  });

  useEffect(() => {
    if (!session?.user) return;
    setFormData({
      name: session.user.name ?? "",
      email: session.user.email ?? "",
      phone: session.user.phone ?? "",
    });
  }, [session?.user?.id, session?.user?.name, session?.user?.email, session?.user?.phone]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const cancelProfileEdit = () => {
    if (!session?.user) return;
    setFormData({
      name: session.user.name ?? "",
      email: session.user.email ?? "",
      phone: session.user.phone ?? "",
    });
    setIsEditingProfile(false);
  };

  const cancelPasswordEdit = () => {
    setPasswordData({ current_password: "", password: "", password_confirmation: "" });
    setIsEditingPassword(false);
  };

  const saveProfile = async () => {
    const token = session?.token;
    if (!token) {
      setMessage({ kind: "error", text: "Tu sesión expiró. Vuelve a iniciar sesión." });
      return;
    }
    if (!formData.name.trim()) {
      setMessage({ kind: "error", text: "El nombre no puede estar vacío." });
      return;
    }
    if (!formData.email.trim()) {
      setMessage({ kind: "error", text: "El correo no puede estar vacío." });
      return;
    }

    setSavingProfile(true);
    setMessage(null);
    try {
      const response = await fetchWithAuth<{ message: string; user: AuthSessionUser }>(
        "/auth/profile",
        token,
        {
          method: "PUT",
          body: JSON.stringify({
            name: formData.name.trim(),
            email: formData.email.trim(),
            phone: formData.phone.trim() || null,
          }),
        },
      );
      const current = getAuthSession();
      if (current && response.user) {
        saveAuthSession({ ...current, user: response.user });
      }
      refreshSession();
      setMessage({ kind: "success", text: response.message || "Perfil actualizado correctamente." });
      setIsEditingProfile(false);
    } catch (e: any) {
      const apiErr = e instanceof APIError ? e : null;
      setMessage({
        kind: "error",
        text: apiErr?.getAllMessages?.() || e?.message || "Error al guardar el perfil.",
      });
    } finally {
      setSavingProfile(false);
    }
  };

  const savePassword = async () => {
    const token = session?.token;
    if (!token) {
      setMessage({ kind: "error", text: "Tu sesión expiró. Vuelve a iniciar sesión." });
      return;
    }
    if (passwordData.password !== passwordData.password_confirmation) {
      setMessage({ kind: "error", text: "Las contraseñas no coinciden." });
      return;
    }
    if (passwordData.password.length < 8) {
      setMessage({ kind: "error", text: "La nueva contraseña debe tener al menos 8 caracteres." });
      return;
    }

    setSavingPassword(true);
    setMessage(null);
    try {
      const response = await fetchWithAuth<{ message: string }>("/auth/password", token, {
        method: "PUT",
        body: JSON.stringify(passwordData),
      });
      setMessage({ kind: "success", text: response.message || "Contraseña actualizada correctamente." });
      setPasswordData({ current_password: "", password: "", password_confirmation: "" });
      setIsEditingPassword(false);
    } catch (e: any) {
      const apiErr = e instanceof APIError ? e : null;
      setMessage({
        kind: "error",
        text: apiErr?.getAllMessages?.() || e?.message || "Error al cambiar la contraseña.",
      });
    } finally {
      setSavingPassword(false);
    }
  };

  const userName = session?.user?.name || "Admin";
  const userEmail = session?.user?.email || "";
  const userRoleLabel = useMemo(() => {
    const role = session?.user?.role;
    if (!role) return "Administrador";
    return role.charAt(0).toUpperCase() + role.slice(1);
  }, [session?.user?.role]);
  const userInitials = useMemo(
    () =>
      userName
        .split(" ")
        .filter(Boolean)
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2) || "AD",
    [userName],
  );

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
          onClick={() => (isEditingProfile ? cancelProfileEdit() : setIsEditingProfile(true))}
          className={`px-5 py-2.5 text-sm font-semibold rounded-lg transition-all flex items-center gap-2 ${isEditingProfile ? "text-gray-400 border border-gray-700 hover:bg-gray-800/50" : "text-pop-black bg-pop-gold hover:bg-pop-light-gold"}`}
        >
          <span className="material-symbols-outlined text-lg">{isEditingProfile ? "close" : "edit"}</span>
          {isEditingProfile ? "Cancelar" : "Editar Perfil"}
        </button>
      </header>

      {message && (
        <div
          role="status"
          className={`mb-6 p-4 rounded-xl text-sm font-bold ${
            message.kind === "error"
              ? "bg-red-500/10 text-red-400 border border-red-500/20"
              : message.kind === "success"
                ? "bg-green-500/10 text-green-400 border border-green-500/20"
                : "bg-gray-500/10 text-gray-300 border border-gray-500/20"
          }`}
        >
          {message.text}
        </div>
      )}

      <section className="bg-pop-cardGreen rounded-xl border border-white/5 overflow-hidden mb-8">
        <div className="p-8 border-b border-white/5 flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-pop-orange to-pop-gold p-[3px] flex-shrink-0">
            <div className="w-full h-full rounded-full bg-pop-black flex items-center justify-center text-pop-gold font-black text-3xl font-epilogue">
              {userInitials}
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
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                disabled={!isEditingProfile}
                placeholder="Tu nombre"
                className="w-full bg-gray-800/50 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-pop-gold/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
            <div>
              <label className="text-[10px] uppercase font-bold text-gray-500 block mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                disabled={!isEditingProfile}
                placeholder="tu@correo.com"
                className="w-full bg-gray-800/50 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-pop-gold/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
            <div>
              <label className="text-[10px] uppercase font-bold text-gray-500 block mb-2">Teléfono</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                disabled={!isEditingProfile}
                placeholder="10 dígitos, sin espacios"
                className="w-full bg-gray-800/50 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-pop-gold/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
            <div>
              <label className="text-[10px] uppercase font-bold text-gray-500 block mb-2">Rol</label>
              <input
                type="text"
                value={userRoleLabel}
                disabled
                className="w-full bg-gray-800/30 border border-white/5 rounded-lg px-4 py-3 text-sm text-gray-500 cursor-not-allowed"
              />
            </div>
          </div>
          {isEditingProfile && (
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={cancelProfileEdit}
                disabled={savingProfile}
                className="px-6 py-2.5 text-sm font-semibold text-gray-400 border border-gray-700 rounded-lg hover:bg-gray-800/50 transition-all disabled:opacity-50"
              >
                Descartar
              </button>
              <button
                onClick={saveProfile}
                disabled={savingProfile}
                className="px-6 py-2.5 text-sm font-semibold text-pop-black bg-pop-gold rounded-lg hover:bg-pop-light-gold transition-all disabled:opacity-50"
              >
                {savingProfile ? "Guardando..." : "Guardar Cambios"}
              </button>
            </div>
          )}
        </div>
      </section>

      <section className="bg-pop-cardGreen rounded-xl border border-white/5 overflow-hidden">
        <div className="p-6 lg:p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-black uppercase font-epilogue tracking-tighter text-white flex items-center gap-3">
              <span className="material-symbols-outlined text-pop-gold">lock</span>Cambiar Contraseña
            </h3>
            {!isEditingPassword && (
              <button
                onClick={() => setIsEditingPassword(true)}
                className="px-4 py-2 text-xs font-bold text-pop-gold border border-pop-gold/30 rounded-lg hover:bg-pop-gold/10 transition-all flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-base">edit</span>
                Cambiar
              </button>
            )}
          </div>
          {isEditingPassword ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="text-[10px] uppercase font-bold text-gray-500 block mb-2">Contraseña Actual</label>
                  <input
                    type="password"
                    name="current_password"
                    value={passwordData.current_password}
                    onChange={handlePasswordChange}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    className="w-full bg-gray-800/50 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-pop-gold/50 transition-all"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-500 block mb-2">Nueva Contraseña</label>
                  <input
                    type="password"
                    name="password"
                    value={passwordData.password}
                    onChange={handlePasswordChange}
                    placeholder="Mínimo 8 caracteres"
                    autoComplete="new-password"
                    className="w-full bg-gray-800/50 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-pop-gold/50 transition-all"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-500 block mb-2">Confirmar Contraseña</label>
                  <input
                    type="password"
                    name="password_confirmation"
                    value={passwordData.password_confirmation}
                    onChange={handlePasswordChange}
                    placeholder="Repite la contraseña"
                    autoComplete="new-password"
                    className="w-full bg-gray-800/50 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-pop-gold/50 transition-all"
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={cancelPasswordEdit}
                  disabled={savingPassword}
                  className="px-6 py-2.5 text-sm font-semibold text-gray-400 border border-gray-700 rounded-lg hover:bg-gray-800/50 transition-all disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={savePassword}
                  disabled={savingPassword || !passwordData.current_password || !passwordData.password || !passwordData.password_confirmation}
                  className="px-6 py-2.5 text-sm font-semibold text-pop-black bg-pop-gold rounded-lg hover:bg-pop-light-gold transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="material-symbols-outlined text-lg">lock_reset</span>
                  {savingPassword ? "Actualizando..." : "Actualizar Contraseña"}
                </button>
              </div>
            </>
          ) : (
            <p className="text-sm text-gray-500">Tu contraseña está cifrada y nunca se muestra por seguridad.</p>
          )}
        </div>
      </section>
    </main>
  );
}
