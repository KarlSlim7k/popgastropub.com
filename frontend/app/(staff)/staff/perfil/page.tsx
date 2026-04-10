"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-provider";

export default function StaffPerfilPage() {
  const { session } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  const userName = session?.user?.name || "Ricardo S.";
  const userEmail = session?.user?.email || "";
  const userPoints = session?.user?.points ?? 0;
  const userTier = session?.user?.tier || "";

  const [formData, setFormData] = useState({
    name: userName,
    email: userEmail,
    phone: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <main className="pt-24 lg:pt-20 p-4 lg:p-10 min-h-screen bg-pop-black">
      {/* Header */}
      <header className="mb-8 lg:mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-4xl lg:text-5xl font-black tracking-tighter text-white font-epilogue uppercase flex items-center gap-3">
            <span className="material-symbols-outlined text-pop-gold text-5xl">person</span>
            Mi Perfil
          </h1>
          <p className="text-gray-400 mt-2 text-base lg:text-lg font-manrope">
            Tu información personal y credenciales de acceso
          </p>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className={`px-5 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 flex items-center gap-2 ${
            isEditing
              ? "text-gray-400 border border-gray-700 hover:bg-gray-800/50"
              : "text-pop-black bg-pop-gold hover:bg-pop-light-gold"
          }`}
        >
          <span className="material-symbols-outlined text-lg">{isEditing ? "close" : "edit"}</span>
          {isEditing ? "Cancelar" : "Editar Perfil"}
        </button>
      </header>

      {/* Profile Card */}
      <section className="bg-[#1C1B1B] backdrop-blur-sm rounded-xl border border-white/5 overflow-hidden mb-8">
        {/* Avatar Section */}
        <div className="p-8 border-b border-white/5 flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-pop-orange to-pop-gold p-[3px] flex-shrink-0">
            <div className="w-full h-full rounded-full bg-pop-black flex items-center justify-center text-pop-gold font-black text-3xl font-epilogue">
              {userName
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2)}
            </div>
          </div>
          <div className="text-center sm:text-left flex-1">
            <h2 className="text-2xl font-black text-white font-epilogue">{userName}</h2>
            <p className="text-sm text-gray-400 mt-1">{userEmail || "Sin email registrado"}</p>
            <div className="flex flex-wrap gap-2 mt-3 justify-center sm:justify-start">
              <span className="bg-pop-orange/10 text-pop-orange text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                Staff
              </span>
              <span className="bg-pop-gold/10 text-pop-gold text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                Mesero
              </span>
              {userPoints > 0 && (
                <span className="bg-green-500/10 text-green-500 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                  {userPoints} pts
                </span>
              )}
            </div>
          </div>
          <div className="text-center sm:text-right">
            <p className="text-[10px] text-gray-500 uppercase tracking-widest">Último acceso</p>
            <p className="text-sm text-gray-300 font-medium mt-1">Hoy, 14:30</p>
          </div>
        </div>

        {/* Personal Info Form */}
        <div className="p-6 lg:p-8">
          <h3 className="text-lg font-black uppercase font-epilogue tracking-tighter text-white mb-6 flex items-center gap-3">
            <span className="material-symbols-outlined text-pop-gold">badge</span>
            Información Personal
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-[10px] uppercase font-bold text-gray-500 block mb-2">Nombre Completo</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full bg-gray-800/50 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-pop-gold/50 focus:ring-1 focus:ring-pop-gold/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
            <div>
              <label className="text-[10px] uppercase font-bold text-gray-500 block mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full bg-gray-800/50 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-pop-gold/50 focus:ring-1 focus:ring-pop-gold/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
            <div>
              <label className="text-[10px] uppercase font-bold text-gray-500 block mb-2">Teléfono</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                disabled={!isEditing}
                placeholder="282-XXX-XXXX"
                className="w-full bg-gray-800/50 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-pop-gold/50 focus:ring-1 focus:ring-pop-gold/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
            <div>
              <label className="text-[10px] uppercase font-bold text-gray-500 block mb-2">Rol</label>
              <input
                type="text"
                value="Mesero / Staff"
                disabled
                className="w-full bg-gray-800/30 border border-white/5 rounded-lg px-4 py-3 text-sm text-gray-500 cursor-not-allowed"
              />
            </div>
          </div>
          {isEditing && (
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setIsEditing(false)}
                className="px-6 py-2.5 text-sm font-semibold text-gray-400 border border-gray-700 rounded-lg hover:bg-gray-800/50 transition-all"
              >
                Descartar
              </button>
              <button className="px-6 py-2.5 text-sm font-semibold text-pop-black bg-pop-gold rounded-lg hover:bg-pop-light-gold transition-all">
                Guardar Cambios
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Change Password */}
      <section className="bg-[#1C1B1B] backdrop-blur-sm rounded-xl border border-white/5 overflow-hidden">
        <div className="p-6 lg:p-8">
          <h3 className="text-lg font-black uppercase font-epilogue tracking-tighter text-white mb-6 flex items-center gap-3">
            <span className="material-symbols-outlined text-pop-gold">lock</span>
            Cambiar Contraseña
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-[10px] uppercase font-bold text-gray-500 block mb-2">Contraseña Actual</label>
              <input
                type="password"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleInputChange}
                disabled={!isEditing}
                placeholder="••••••••"
                className="w-full bg-gray-800/50 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-pop-gold/50 focus:ring-1 focus:ring-pop-gold/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
            <div />
            <div>
              <label className="text-[10px] uppercase font-bold text-gray-500 block mb-2">Nueva Contraseña</label>
              <input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleInputChange}
                disabled={!isEditing}
                placeholder="Mínimo 8 caracteres"
                className="w-full bg-gray-800/50 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-pop-gold/50 focus:ring-1 focus:ring-pop-gold/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
            <div>
              <label className="text-[10px] uppercase font-bold text-gray-500 block mb-2">Confirmar Contraseña</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                disabled={!isEditing}
                placeholder="Repite la contraseña"
                className="w-full bg-gray-800/50 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-pop-gold/50 focus:ring-1 focus:ring-pop-gold/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
          </div>
          {isEditing && (
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => {
                  setFormData({ ...formData, currentPassword: "", newPassword: "", confirmPassword: "" });
                }}
                className="px-6 py-2.5 text-sm font-semibold text-gray-400 border border-gray-700 rounded-lg hover:bg-gray-800/50 transition-all"
              >
                Limpiar
              </button>
              <button className="px-6 py-2.5 text-sm font-semibold text-pop-black bg-pop-gold rounded-lg hover:bg-pop-light-gold transition-all flex items-center gap-2">
                <span className="material-symbols-outlined text-lg">lock_reset</span>
                Actualizar Contraseña
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Activity Summary */}
      <section className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#1C1B1B] backdrop-blur-sm rounded-xl p-6 border border-white/5 text-center">
          <span className="material-symbols-outlined text-pop-gold text-3xl mb-3">login</span>
          <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold">Último Acceso</p>
          <p className="text-lg font-black text-white font-epilogue mt-1">Hoy, 14:30</p>
        </div>
        <div className="bg-[#1C1B1B] backdrop-blur-sm rounded-xl p-6 border border-white/5 text-center">
          <span className="material-symbols-outlined text-pop-orange text-3xl mb-3">history</span>
          <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold">Sesiones Activas</p>
          <p className="text-lg font-black text-white font-epilogue mt-1">1 dispositivo</p>
        </div>
        <div className="bg-[#1C1B1B] backdrop-blur-sm rounded-xl p-6 border border-white/5 text-center">
          <span className="material-symbols-outlined text-pop-light-gold text-3xl mb-3">military_tech</span>
          <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold">Mis Puntos POP</p>
          <p className="text-lg font-black text-white font-epilogue mt-1">{userPoints > 0 ? `${userPoints} pts` : "—"}</p>
        </div>
      </section>
    </main>
  );
}
