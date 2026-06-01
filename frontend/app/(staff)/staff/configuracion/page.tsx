"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-provider";
import { fetchWithAuth } from "@/lib/api";

export default function StaffConfiguracionPage() {
  const { session } = useAuth();
  const [activeTab, setActiveTab] = useState<"notificaciones" | "apariencia">("notificaciones");
  const [settings, setSettings] = useState<Record<string, string>>({ notif_pedidos: "true", notif_reservas: "true", notif_ranking: "true", tema: "dark" });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!session?.token) return;
    fetchWithAuth<Record<string, string>>("/staff/configuracion", session.token).then((data) => {
      if (data && Object.keys(data).length) setSettings((prev) => ({ ...prev, ...data }));
    }).catch(() => {});
  }, [session?.token]);

  const save = async () => {
    if (!session?.token) return;
    setSaving(true);
    try {
      await fetchWithAuth("/staff/configuracion", session.token, { method: "PUT", body: JSON.stringify({ data: settings }) });
      setMessage("Guardado");
      setTimeout(() => setMessage(""), 3000);
    } catch { setMessage("Error"); }
    finally { setSaving(false); }
  };

  const toggle = (key: string) => setSettings((prev) => ({ ...prev, [key]: prev[key] === "true" ? "false" : "true" }));

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', settings.tema);
    document.documentElement.classList.toggle('dark', settings.tema === 'dark');
  }, [settings.tema]);

  const tabs = [
    { id: "notificaciones" as const, label: "Notificaciones", icon: "notifications" },
    { id: "apariencia" as const, label: "Apariencia", icon: "palette" },
  ];

  return (
    <main className="pt-24 lg:pt-20 p-4 lg:p-10 min-h-screen bg-pop-black">
      <header className="mb-8">
        <h1 className="text-4xl lg:text-5xl font-black tracking-tighter text-white font-epilogue uppercase flex items-center gap-3">
          <span className="material-symbols-outlined text-pop-gold text-5xl">settings</span>Configuración
        </h1>
        <p className="text-gray-400 mt-2 text-base font-manrope">Ajustes de tu portal de staff</p>
      </header>

      {message && <div className="mb-6 p-4 rounded-xl text-sm font-bold bg-green-500/10 text-green-400">{message}</div>}

      <section className="flex gap-2 mb-8 lg:bg-pop-cardGreen lg:rounded-xl lg:p-1.5 lg:border lg:border-white/5 lg:w-fit">
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-5 py-3 text-sm font-bold uppercase tracking-wider rounded-lg whitespace-nowrap transition-all ${activeTab === tab.id ? "bg-pop-gold text-pop-black" : "text-gray-400 hover:text-white hover:bg-white/5"}`}>
            <span className="material-symbols-outlined text-lg">{tab.icon}</span>{tab.label}
          </button>
        ))}
      </section>

      {activeTab === "notificaciones" && (
        <div className="bg-pop-cardGreen rounded-xl border border-white/5 divide-y divide-gray-800/50">
          {[
            { key: "notif_pedidos", title: "Pedidos listos", desc: "Alerta cuando un pedido está listo para servir" },
            { key: "notif_reservas", title: "Nuevas reservas", desc: "Notificar cuando se asigne una nueva reserva" },
            { key: "notif_ranking", title: "Cambios en ranking", desc: "Aviso cuando cambies de posición" },
          ].map((n) => (
            <div key={n.key} className="p-6 flex items-center justify-between">
              <div><p className="text-sm font-semibold text-white">{n.title}</p><p className="text-xs text-gray-500 mt-1">{n.desc}</p></div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={settings[n.key] === "true"} onChange={() => toggle(n.key)} className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pop-gold"></div>
              </label>
            </div>
          ))}
        </div>
      )}

      {activeTab === "apariencia" && (
        <div className="bg-pop-cardGreen rounded-xl border border-white/5 p-6">
          <label className="text-[10px] uppercase font-bold text-gray-500 block mb-4">Tema</label>
          <div className="flex gap-3">
            {["dark", "light"].map((t) => (
              <label key={t} className={`cursor-pointer rounded-lg border px-5 py-3 text-sm font-bold transition-all ${settings.tema === t ? "border-pop-gold bg-pop-gold/5 text-pop-gold" : "border-gray-700 text-gray-400"}`} onClick={() => setSettings({ ...settings, tema: t })}>{t === "dark" ? "Oscuro" : "Claro"}</label>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-end mt-8">
        <button onClick={save} disabled={saving} className="px-8 py-3 text-sm font-semibold text-pop-black bg-pop-gold rounded-lg hover:bg-pop-light-gold transition-all flex items-center gap-2 disabled:opacity-50">
          <span className="material-symbols-outlined text-lg">save</span>{saving ? "Guardando..." : "Guardar"}
        </button>
      </div>
    </main>
  );
}
