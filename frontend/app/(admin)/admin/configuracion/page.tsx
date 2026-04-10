"use client";

import { useState } from "react";

export default function AdminConfiguracionPage() {
  const [activeTab, setActiveTab] = useState<"general" | "notificaciones" | "apariencia" | "seguridad">("general");

  const tabs = [
    { id: "general" as const, label: "General", icon: "tune" },
    { id: "notificaciones" as const, label: "Notificaciones", icon: "notifications" },
    { id: "apariencia" as const, label: "Apariencia", icon: "palette" },
    { id: "seguridad" as const, label: "Seguridad", icon: "security" },
  ];

  return (
    <main className="pt-24 lg:pt-20 p-4 lg:p-10 min-h-screen bg-pop-black">
      {/* Header */}
      <header className="mb-8 lg:mb-10">
        <h1 className="text-4xl lg:text-5xl font-black tracking-tighter text-white font-epilogue uppercase flex items-center gap-3">
          <span className="material-symbols-outlined text-pop-gold text-5xl">settings</span>
          Configuración
        </h1>
        <p className="text-gray-400 mt-2 text-base lg:text-lg font-manrope">
          Ajustes generales del panel de administración
        </p>
      </header>

      {/* Tabs */}
      <section className="flex overflow-x-auto gap-2 mb-8 pb-2 -mx-4 px-4 lg:mx-0 lg:px-0 lg:gap-0 lg:bg-[#1C1B1B] lg:rounded-xl lg:p-1.5 lg:border lg:border-white/5 lg:w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-bold uppercase tracking-wider rounded-lg whitespace-nowrap transition-all duration-200 ${
              activeTab === tab.id
                ? "bg-pop-gold text-pop-black"
                : "bg-[#1C1B1B] lg:bg-transparent text-gray-400 hover:text-white hover:bg-white/5 lg:hover:bg-white/5"
            }`}
          >
            <span className="material-symbols-outlined text-lg">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </section>

      {/* General Tab */}
      {activeTab === "general" && (
        <section className="space-y-8">
          {/* App Settings */}
          <div className="bg-[#1C1B1B] backdrop-blur-sm rounded-xl border border-white/5 overflow-hidden">
            <div className="p-6 border-b border-white/5">
              <h2 className="text-xl font-black uppercase font-epilogue tracking-tighter text-white flex items-center gap-3">
                <span className="material-symbols-outlined text-pop-gold">tune</span>
                Configuración General
              </h2>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <label className="text-[10px] uppercase font-bold text-gray-500 block mb-2">Nombre del Restaurante</label>
                <input
                  type="text"
                  defaultValue="POP Perote"
                  className="w-full bg-gray-800/50 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-pop-gold/50 transition-all"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-500 block mb-2">Teléfono</label>
                  <input
                    type="tel"
                    defaultValue="282-825-32-43"
                    className="w-full bg-gray-800/50 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-pop-gold/50 transition-all"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-500 block mb-2">Email de Contacto</label>
                  <input
                    type="email"
                    defaultValue="contacto@pop-perote.com"
                    className="w-full bg-gray-800/50 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-pop-gold/50 transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-gray-500 block mb-2">Dirección</label>
                <input
                  type="text"
                  defaultValue="Justo Sierra No. 11, Col. Amado Nervo, Perote, Veracruz"
                  className="w-full bg-gray-800/50 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-pop-gold/50 transition-all"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-500 block mb-2">Zona Horaria</label>
                  <select className="w-full bg-gray-800/50 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-pop-gold/50 transition-all">
                    <option>America/Mexico_City (UTC-6)</option>
                    <option>America/Cancun (UTC-5)</option>
                    <option>America/Tijuana (UTC-8)</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-500 block mb-2">Idioma del Panel</label>
                  <select className="w-full bg-gray-800/50 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-pop-gold/50 transition-all">
                    <option>Español</option>
                    <option>English</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Business Hours */}
          <div className="bg-[#1C1B1B] backdrop-blur-sm rounded-xl border border-white/5 overflow-hidden">
            <div className="p-6 border-b border-white/5">
              <h2 className="text-xl font-black uppercase font-epilogue tracking-tighter text-white flex items-center gap-3">
                <span className="material-symbols-outlined text-pop-gold">schedule</span>
                Horario de Operación
              </h2>
            </div>
            <div className="p-6 space-y-4">
              {[
                { day: "Lunes", hours: "14:00 - 21:30", open: true },
                { day: "Martes", hours: "CERRADO", open: false },
                { day: "Miércoles", hours: "14:00 - 21:30", open: true },
                { day: "Jueves", hours: "14:00 - 21:30", open: true },
                { day: "Viernes", hours: "14:00 - 22:00", open: true },
                { day: "Sábado", hours: "14:00 - 22:00", open: true },
                { day: "Domingo", hours: "14:00 - 21:00", open: true },
              ].map((schedule, index) => (
                <div key={index} className="flex items-center justify-between py-3 border-b border-gray-800/50 last:border-0">
                  <div className="flex items-center gap-3">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked={schedule.open} className="sr-only peer" />
                      <div className="w-9 h-5 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-pop-gold"></div>
                    </label>
                    <span className={`text-sm font-semibold ${schedule.open ? "text-white" : "text-gray-600"}`}>
                      {schedule.day}
                    </span>
                  </div>
                  <span className={`text-sm font-mono ${schedule.open ? "text-gray-300" : "text-error"}`}>
                    {schedule.hours}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button className="px-8 py-3 text-sm font-semibold text-pop-black bg-pop-gold rounded-lg hover:bg-pop-light-gold transition-all flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">save</span>
              Guardar Configuración
            </button>
          </div>
        </section>
      )}

      {/* Notifications Tab */}
      {activeTab === "notificaciones" && (
        <section className="space-y-8">
          <div className="bg-[#1C1B1B] backdrop-blur-sm rounded-xl border border-white/5 overflow-hidden">
            <div className="p-6 border-b border-white/5">
              <h2 className="text-xl font-black uppercase font-epilogue tracking-tighter text-white flex items-center gap-3">
                <span className="material-symbols-outlined text-pop-gold">notifications</span>
                Preferencias de Notificación
              </h2>
            </div>
            <div className="divide-y divide-gray-800/50">
              {[
                {
                  title: "Nuevos registros de clientes",
                  description: "Recibir alerta cuando un nuevo cliente se registre",
                  defaultChecked: true,
                },
                {
                  title: "Pedidos de facturación",
                  description: "Notificar cuando un cliente solicite una factura",
                  defaultChecked: true,
                },
                {
                  title: "Promociones por expirar",
                  description: "Aviso 3 días antes de que expire una promoción",
                  defaultChecked: true,
                },
                {
                  title: "Cambios en el ranking de meseros",
                  description: "Resumen semanal del ranking POP Bar Stars",
                  defaultChecked: false,
                },
                {
                  title: "Canjes de puntos POP",
                  description: "Notificar cuando un cliente canjee puntos",
                  defaultChecked: true,
                },
                {
                  title: "Stock bajo de platillos",
                  description: "Alerta cuando un platillo tenga stock menor al 20%",
                  defaultChecked: true,
                },
                {
                  title: "Reseñas de Google",
                  description: "Notificar cuando un cliente deje una reseña nueva",
                  defaultChecked: false,
                },
              ].map((notif, index) => (
                <div key={index} className="p-6 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-white">{notif.title}</p>
                    <p className="text-xs text-gray-500 mt-1">{notif.description}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer flex-shrink-0 ml-4">
                    <input type="checkbox" defaultChecked={notif.defaultChecked} className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pop-gold"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Notification Channels */}
          <div className="bg-[#1C1B1B] backdrop-blur-sm rounded-xl border border-white/5 overflow-hidden">
            <div className="p-6 border-b border-white/5">
              <h2 className="text-xl font-black uppercase font-epilogue tracking-tighter text-white flex items-center gap-3">
                <span className="material-symbols-outlined text-pop-gold">mail</span>
                Canales de Notificación
              </h2>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between bg-gray-800/30 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-pop-gold text-2xl">email</span>
                  <div>
                    <p className="text-sm font-semibold text-white">Email</p>
                    <p className="text-xs text-gray-500">admin@pop-perote.com</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-pop-gold bg-pop-gold/10 px-3 py-1 rounded-full uppercase">Activo</span>
              </div>
              <div className="flex items-center justify-between bg-gray-800/30 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-green-500 text-2xl">chat</span>
                  <div>
                    <p className="text-sm font-semibold text-white">WhatsApp</p>
                    <p className="text-xs text-gray-500">282-825-32-43</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-pop-gold bg-pop-gold/10 px-3 py-1 rounded-full uppercase">Activo</span>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button className="px-8 py-3 text-sm font-semibold text-pop-black bg-pop-gold rounded-lg hover:bg-pop-light-gold transition-all flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">save</span>
              Guardar Preferencias
            </button>
          </div>
        </section>
      )}

      {/* Appearance Tab */}
      {activeTab === "apariencia" && (
        <section className="space-y-8">
          <div className="bg-[#1C1B1B] backdrop-blur-sm rounded-xl border border-white/5 overflow-hidden">
            <div className="p-6 border-b border-white/5">
              <h2 className="text-xl font-black uppercase font-epilogue tracking-tighter text-white flex items-center gap-3">
                <span className="material-symbols-outlined text-pop-gold">palette</span>
                Apariencia del Panel
              </h2>
            </div>
            <div className="p-6 space-y-6">
              {/* Theme */}
              <div>
                <label className="text-[10px] uppercase font-bold text-gray-500 block mb-4">Tema</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { name: "Oscuro (Actual)", value: "dark", preview: "bg-gray-900" },
                    { name: "Light", value: "light", preview: "bg-gray-100" },
                    { name: "Auto", value: "auto", preview: "bg-gradient-to-br from-gray-900 to-gray-100" },
                  ].map((theme, index) => (
                    <label
                      key={index}
                      className={`cursor-pointer rounded-xl border-2 p-4 transition-all hover:border-pop-gold/50 ${
                        theme.value === "dark" ? "border-pop-gold bg-pop-gold/5" : "border-gray-700"
                      }`}
                    >
                      <input type="radio" name="theme" value={theme.value} defaultChecked={theme.value === "dark"} className="sr-only" />
                      <div className={`h-16 ${theme.preview} rounded-lg mb-3 border border-gray-700/30`} />
                      <p className="text-sm font-semibold text-white text-center">{theme.name}</p>
                    </label>
                  ))}
                </div>
              </div>

              {/* Density */}
              <div>
                <label className="text-[10px] uppercase font-bold text-gray-500 block mb-4">Densidad de Tablas</label>
                <div className="flex gap-3">
                  {["Compacta", "Normal", "Cómoda"].map((density, index) => (
                    <label
                      key={density}
                      className={`cursor-pointer rounded-lg border px-5 py-3 text-sm font-bold transition-all hover:border-pop-gold/50 ${
                        density === "Normal"
                          ? "border-pop-gold bg-pop-gold/5 text-pop-gold"
                          : "border-gray-700 text-gray-400"
                      }`}
                    >
                      <input type="radio" name="density" value={density} defaultChecked={density === "Normal"} className="sr-only" />
                      {density}
                    </label>
                  ))}
                </div>
              </div>

              {/* Sidebar */}
              <div>
                <label className="text-[10px] uppercase font-bold text-gray-500 block mb-4">Sidebar Colapsada</label>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pop-gold"></div>
                  <span className="ml-3 text-sm text-gray-400">Colapsar sidebar por defecto</span>
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button className="px-8 py-3 text-sm font-semibold text-pop-black bg-pop-gold rounded-lg hover:bg-pop-light-gold transition-all flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">save</span>
              Guardar Apariencia
            </button>
          </div>
        </section>
      )}

      {/* Security Tab */}
      {activeTab === "seguridad" && (
        <section className="space-y-8">
          <div className="bg-[#1C1B1B] backdrop-blur-sm rounded-xl border border-white/5 overflow-hidden">
            <div className="p-6 border-b border-white/5">
              <h2 className="text-xl font-black uppercase font-epilogue tracking-tighter text-white flex items-center gap-3">
                <span className="material-symbols-outlined text-pop-gold">security</span>
                Seguridad de la Cuenta
              </h2>
            </div>
            <div className="p-6 space-y-6">
              {/* 2FA */}
              <div className="flex items-center justify-between bg-gray-800/30 rounded-lg p-5">
                <div>
                  <p className="text-sm font-semibold text-white">Autenticación de Dos Factores (2FA)</p>
                  <p className="text-xs text-gray-500 mt-1">Agrega una capa extra de seguridad a tu cuenta</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer flex-shrink-0 ml-4">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pop-gold"></div>
                </label>
              </div>

              {/* Session Timeout */}
              <div>
                <label className="text-[10px] uppercase font-bold text-gray-500 block mb-2">Tiempo de Sesión (minutos)</label>
                <select className="w-full bg-gray-800/50 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-pop-gold/50 transition-all" defaultValue="60 minutos">
                  <option>30 minutos</option>
                  <option value="60 minutos">60 minutos</option>
                  <option>120 minutos</option>
                  <option>240 minutos</option>
                  <option>Sin límite</option>
                </select>
              </div>

              {/* Password Requirements */}
              <div>
                <label className="text-[10px] uppercase font-bold text-gray-500 block mb-2">Requisitos de Contraseña</label>
                <div className="space-y-3 bg-gray-800/30 rounded-lg p-5">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" defaultChecked className="accent-pop-gold w-4 h-4" />
                    <span className="text-sm text-gray-300">Mínimo 8 caracteres</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" defaultChecked className="accent-pop-gold w-4 h-4" />
                    <span className="text-sm text-gray-300">Al menos una mayúscula</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" className="accent-pop-gold w-4 h-4" />
                    <span className="text-sm text-gray-300">Al menos un número</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" className="accent-pop-gold w-4 h-4" />
                    <span className="text-sm text-gray-300">Al menos un carácter especial</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Active Sessions */}
          <div className="bg-[#1C1B1B] backdrop-blur-sm rounded-xl border border-white/5 overflow-hidden">
            <div className="p-6 border-b border-white/5">
              <h2 className="text-xl font-black uppercase font-epilogue tracking-tighter text-white flex items-center gap-3">
                <span className="material-symbols-outlined text-pop-gold">devices</span>
                Sesiones Activas
              </h2>
            </div>
            <div className="divide-y divide-gray-800/50">
              <div className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="material-symbols-outlined text-pop-gold text-3xl">laptop_mac</span>
                  <div>
                    <p className="text-sm font-semibold text-white">Chrome · Windows</p>
                    <p className="text-xs text-pop-gold font-bold">Sesión actual</p>
                    <p className="text-[10px] text-gray-600">192.168.1.100 · Hace 2 min</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-pop-gold bg-pop-gold/10 px-3 py-1 rounded-full uppercase">Activa</span>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-[#1C1B1B] backdrop-blur-sm rounded-xl border border-error/30 overflow-hidden">
            <div className="p-6 border-b border-error/20">
              <h2 className="text-xl font-black uppercase font-epilogue tracking-tighter text-error flex items-center gap-3">
                <span className="material-symbols-outlined">warning</span>
                Zona de Peligro
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between bg-error/5 rounded-lg p-5">
                <div>
                  <p className="text-sm font-semibold text-white">Cerrar todas las sesiones</p>
                  <p className="text-xs text-gray-500 mt-1">Forzar el cierre de sesión en todos los dispositivos</p>
                </div>
                <button className="px-4 py-2 text-xs font-bold text-error border border-error/30 rounded-lg hover:bg-error/10 transition-all uppercase tracking-wider">
                  Cerrar Todas
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button className="px-8 py-3 text-sm font-semibold text-pop-black bg-pop-gold rounded-lg hover:bg-pop-light-gold transition-all flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">save</span>
              Guardar Seguridad
            </button>
          </div>
        </section>
      )}
    </main>
  );
}
