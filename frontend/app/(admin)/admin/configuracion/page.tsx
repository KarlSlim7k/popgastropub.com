"use client";

import { useState, useEffect } from "react";
import { fetchWithAuth } from "@/lib/api";
import { getAuthSession } from "@/lib/auth-session";

export default function AdminConfiguracionPage() {
  const [activeTab, setActiveTab] = useState<"general" | "notificaciones" | "apariencia" | "seguridad">("general");
  const [settings, setSettings] = useState<Record<string, Record<string, string>>>({ general: {}, notificaciones: {}, apariencia: {}, seguridad: {} });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const session = getAuthSession();
    if (!session) return;
    fetchWithAuth<Record<string, Record<string, string>>>("/api/admin/configuracion", session.token)
      .then((data) => {
        setSettings({
          general: { nombre: "POP Perote", telefono: "282-825-32-43", email: "contacto@pop-perote.com", direccion: "Justo Sierra No. 11, Col. Amado Nervo, Perote, Veracruz", timezone: "America/Mexico_City", idioma: "es", ...data.general },
          notificaciones: { nuevos_registros: "true", pedidos_facturacion: "true", promos_expirar: "true", ranking_meseros: "false", canjes_puntos: "true", stock_bajo: "true", resenas_google: "false", ...data.notificaciones },
          apariencia: { tema: "dark", densidad: "Normal", sidebar_colapsada: "false", ...data.apariencia },
          seguridad: { two_factor: "false", session_timeout: "60", ...data.seguridad },
        });
      }).catch(() => {});
  }, []);

  const updateField = (group: string, key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [group]: { ...prev[group], [key]: value } }));
  };

  const saveGroup = async (group: string) => {
    const session = getAuthSession();
    if (!session) return;
    setSaving(true);
    setMessage("");
    try {
      await fetchWithAuth("/api/admin/configuracion", session.token, { method: "PUT", body: JSON.stringify({ group, data: settings[group] }) });
      setMessage("Configuración guardada");
      setTimeout(() => setMessage(""), 3000);
    } catch { setMessage("Error al guardar"); }
    finally { setSaving(false); }
  };

  const tabs = [
    { id: "general" as const, label: "General", icon: "tune" },
    { id: "notificaciones" as const, label: "Notificaciones", icon: "notifications" },
    { id: "apariencia" as const, label: "Apariencia", icon: "palette" },
    { id: "seguridad" as const, label: "Seguridad", icon: "security" },
  ];

  return (
    <main className="pt-24 lg:pt-20 p-4 lg:p-10 min-h-screen bg-pop-black">
      <header className="mb-8 lg:mb-10">
        <h1 className="text-4xl lg:text-5xl font-black tracking-tighter text-white font-epilogue uppercase flex items-center gap-3">
          <span className="material-symbols-outlined text-pop-gold text-5xl">settings</span>Configuración
        </h1>
        <p className="text-gray-400 mt-2 text-base lg:text-lg font-manrope">Ajustes generales del panel de administración</p>
      </header>

      {message && <div className={`mb-6 p-4 rounded-xl text-sm font-bold ${message.includes("Error") ? "bg-red-500/10 text-red-400" : "bg-green-500/10 text-green-400"}`}>{message}</div>}

      <section className="flex overflow-x-auto gap-2 mb-8 pb-2 -mx-4 px-4 lg:mx-0 lg:px-0 lg:gap-0 lg:bg-[#1C1B1B] lg:rounded-xl lg:p-1.5 lg:border lg:border-white/5 lg:w-fit">
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-5 py-3 text-sm font-bold uppercase tracking-wider rounded-lg whitespace-nowrap transition-all ${activeTab === tab.id ? "bg-pop-gold text-pop-black" : "bg-[#1C1B1B] lg:bg-transparent text-gray-400 hover:text-white hover:bg-white/5"}`}>
            <span className="material-symbols-outlined text-lg">{tab.icon}</span>{tab.label}
          </button>
        ))}
      </section>

      {activeTab === "general" && (
        <section className="space-y-8">
          <div className="bg-[#1C1B1B] rounded-xl border border-white/5 overflow-hidden">
            <div className="p-6 border-b border-white/5">
              <h2 className="text-xl font-black uppercase font-epilogue tracking-tighter text-white flex items-center gap-3"><span className="material-symbols-outlined text-pop-gold">tune</span>Configuración General</h2>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <label className="text-[10px] uppercase font-bold text-gray-500 block mb-2">Nombre del Restaurante</label>
                <input type="text" value={settings.general.nombre || ""} onChange={(e) => updateField("general", "nombre", e.target.value)} className="w-full bg-gray-800/50 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-pop-gold/50" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-500 block mb-2">Teléfono</label>
                  <input type="tel" value={settings.general.telefono || ""} onChange={(e) => updateField("general", "telefono", e.target.value)} className="w-full bg-gray-800/50 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-pop-gold/50" />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-500 block mb-2">Email de Contacto</label>
                  <input type="email" value={settings.general.email || ""} onChange={(e) => updateField("general", "email", e.target.value)} className="w-full bg-gray-800/50 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-pop-gold/50" />
                </div>
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-gray-500 block mb-2">Dirección</label>
                <input type="text" value={settings.general.direccion || ""} onChange={(e) => updateField("general", "direccion", e.target.value)} className="w-full bg-gray-800/50 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-pop-gold/50" />
              </div>
            </div>
          </div>
          <div className="bg-[#1C1B1B] rounded-xl border border-white/5 overflow-hidden">
            <div className="p-6 border-b border-white/5">
              <h2 className="text-xl font-black uppercase font-epilogue tracking-tighter text-white flex items-center gap-3"><span className="material-symbols-outlined text-pop-gold">schedule</span>Horario de Operación</h2>
            </div>
            <div className="p-6 space-y-4">
              {[{ day: "Lunes", key: "lun", def: "14:00-21:30" }, { day: "Martes", key: "mar", def: "CERRADO" }, { day: "Miércoles", key: "mie", def: "14:00-21:30" }, { day: "Jueves", key: "jue", def: "14:00-21:30" }, { day: "Viernes", key: "vie", def: "14:00-22:00" }, { day: "Sábado", key: "sab", def: "14:00-22:00" }, { day: "Domingo", key: "dom", def: "14:00-21:00" }].map((s) => (
                <div key={s.key} className="flex items-center justify-between py-3 border-b border-gray-800/50 last:border-0">
                  <span className="text-sm font-semibold text-white">{s.day}</span>
                  <input type="text" value={settings.general[`horario_${s.key}`] || s.def} onChange={(e) => updateField("general", `horario_${s.key}`, e.target.value)} className="bg-gray-800/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white w-40 text-right focus:outline-none focus:border-pop-gold/50" />
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-end">
            <button onClick={() => saveGroup("general")} disabled={saving} className="px-8 py-3 text-sm font-semibold text-pop-black bg-pop-gold rounded-lg hover:bg-pop-light-gold transition-all flex items-center gap-2 disabled:opacity-50">
              <span className="material-symbols-outlined text-lg">save</span>{saving ? "Guardando..." : "Guardar Configuración"}
            </button>
          </div>
        </section>
      )}

      {activeTab === "notificaciones" && (
        <section className="space-y-8">
          <div className="bg-[#1C1B1B] rounded-xl border border-white/5 overflow-hidden">
            <div className="p-6 border-b border-white/5">
              <h2 className="text-xl font-black uppercase font-epilogue tracking-tighter text-white flex items-center gap-3"><span className="material-symbols-outlined text-pop-gold">notifications</span>Preferencias de Notificación</h2>
            </div>
            <div className="divide-y divide-gray-800/50">
              {[
                { key: "nuevos_registros", title: "Nuevos registros de clientes", desc: "Recibir alerta cuando un nuevo cliente se registre" },
                { key: "pedidos_facturacion", title: "Pedidos de facturación", desc: "Notificar cuando un cliente solicite una factura" },
                { key: "promos_expirar", title: "Promociones por expirar", desc: "Aviso 3 días antes de que expire una promoción" },
                { key: "ranking_meseros", title: "Cambios en el ranking de meseros", desc: "Resumen semanal del ranking POP Bar Stars" },
                { key: "canjes_puntos", title: "Canjes de puntos POP", desc: "Notificar cuando un cliente canjee puntos" },
                { key: "stock_bajo", title: "Stock bajo de platillos", desc: "Alerta cuando un platillo tenga stock menor al 20%" },
                { key: "resenas_google", title: "Reseñas de Google", desc: "Notificar cuando un cliente deje una reseña nueva" },
              ].map((n) => (
                <div key={n.key} className="p-6 flex items-center justify-between">
                  <div><p className="text-sm font-semibold text-white">{n.title}</p><p className="text-xs text-gray-500 mt-1">{n.desc}</p></div>
                  <label className="relative inline-flex items-center cursor-pointer flex-shrink-0 ml-4">
                    <input type="checkbox" checked={settings.notificaciones[n.key] === "true"} onChange={(e) => updateField("notificaciones", n.key, e.target.checked ? "true" : "false")} className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pop-gold"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-end">
            <button onClick={() => saveGroup("notificaciones")} disabled={saving} className="px-8 py-3 text-sm font-semibold text-pop-black bg-pop-gold rounded-lg hover:bg-pop-light-gold transition-all flex items-center gap-2 disabled:opacity-50">
              <span className="material-symbols-outlined text-lg">save</span>{saving ? "Guardando..." : "Guardar Preferencias"}
            </button>
          </div>
        </section>
      )}

      {activeTab === "apariencia" && (
        <section className="space-y-8">
          <div className="bg-[#1C1B1B] rounded-xl border border-white/5 overflow-hidden">
            <div className="p-6 border-b border-white/5">
              <h2 className="text-xl font-black uppercase font-epilogue tracking-tighter text-white flex items-center gap-3"><span className="material-symbols-outlined text-pop-gold">palette</span>Apariencia del Panel</h2>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <label className="text-[10px] uppercase font-bold text-gray-500 block mb-4">Tema</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[{ name: "Oscuro", value: "dark", preview: "bg-gray-900" }, { name: "Light", value: "light", preview: "bg-gray-100" }, { name: "Auto", value: "auto", preview: "bg-gradient-to-br from-gray-900 to-gray-100" }].map((t) => (
                    <label key={t.value} className={`cursor-pointer rounded-xl border-2 p-4 transition-all hover:border-pop-gold/50 ${settings.apariencia.tema === t.value ? "border-pop-gold bg-pop-gold/5" : "border-gray-700"}`} onClick={() => updateField("apariencia", "tema", t.value)}>
                      <div className={`h-16 ${t.preview} rounded-lg mb-3 border border-gray-700/30`} />
                      <p className="text-sm font-semibold text-white text-center">{t.name}</p>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-gray-500 block mb-4">Densidad de Tablas</label>
                <div className="flex gap-3">
                  {["Compacta", "Normal", "Cómoda"].map((d) => (
                    <label key={d} className={`cursor-pointer rounded-lg border px-5 py-3 text-sm font-bold transition-all ${settings.apariencia.densidad === d ? "border-pop-gold bg-pop-gold/5 text-pop-gold" : "border-gray-700 text-gray-400"}`} onClick={() => updateField("apariencia", "densidad", d)}>{d}</label>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <button onClick={() => saveGroup("apariencia")} disabled={saving} className="px-8 py-3 text-sm font-semibold text-pop-black bg-pop-gold rounded-lg hover:bg-pop-light-gold transition-all flex items-center gap-2 disabled:opacity-50">
              <span className="material-symbols-outlined text-lg">save</span>{saving ? "Guardando..." : "Guardar Apariencia"}
            </button>
          </div>
        </section>
      )}

      {activeTab === "seguridad" && (
        <section className="space-y-8">
          <div className="bg-[#1C1B1B] rounded-xl border border-white/5 overflow-hidden">
            <div className="p-6 border-b border-white/5">
              <h2 className="text-xl font-black uppercase font-epilogue tracking-tighter text-white flex items-center gap-3"><span className="material-symbols-outlined text-pop-gold">security</span>Seguridad</h2>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between bg-gray-800/30 rounded-lg p-5">
                <div><p className="text-sm font-semibold text-white">Autenticación de Dos Factores (2FA)</p><p className="text-xs text-gray-500 mt-1">Capa extra de seguridad</p></div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={settings.seguridad.two_factor === "true"} onChange={(e) => updateField("seguridad", "two_factor", e.target.checked ? "true" : "false")} className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pop-gold"></div>
                </label>
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-gray-500 block mb-2">Tiempo de Sesión (minutos)</label>
                <select value={settings.seguridad.session_timeout || "60"} onChange={(e) => updateField("seguridad", "session_timeout", e.target.value)} className="w-full bg-gray-800/50 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-pop-gold/50">
                  <option value="30">30 minutos</option><option value="60">60 minutos</option><option value="120">120 minutos</option><option value="240">240 minutos</option>
                </select>
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <button onClick={() => saveGroup("seguridad")} disabled={saving} className="px-8 py-3 text-sm font-semibold text-pop-black bg-pop-gold rounded-lg hover:bg-pop-light-gold transition-all flex items-center gap-2 disabled:opacity-50">
              <span className="material-symbols-outlined text-lg">save</span>{saving ? "Guardando..." : "Guardar Seguridad"}
            </button>
          </div>
        </section>
      )}
    </main>
  );
}
