"use client";

import { useState } from "react";

const ICONS = [
  "person", "favorite", "star", "workspace_premium", "military_tech",
  "emoji_events", "card_giftcard", "loyalty", "redeem", "token",
  "add_circle", "shopping_cart", "location_on", "group_add", "calendar_today",
  "cake", "share", "person_add", "local_bar", "local_cafe",
  "wine_bar", "sports_bar", "restaurant", "local_drink", "trending_up",
  "verified", "diamond", "bolt", "celebration", "volunteer_activism",
  "savings", "payments", "account_balance", "notifications_active", "campaign",
  "thumb_up", "emoji_events", "flag", "whatshot", "auto_awesome",
  "grade", "stars", "rocket_launch", "bolt", "shield",
  "local_fire_department", "water_drop", "palette", "music_note", "photo_camera",
];

const UNIQUE_ICONS = [...new Set(ICONS)];

interface IconPickerProps {
  value: string;
  onChange: (icon: string) => void;
  color?: string;
}

export function IconPicker({ value, onChange, color = "#F2C777" }: IconPickerProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = search
    ? UNIQUE_ICONS.filter((i) => i.toLowerCase().includes(search.toLowerCase()))
    : UNIQUE_ICONS;

  const displayed = filtered.slice(0, 25);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full bg-gray-800/50 border border-white/10 rounded-lg px-4 py-3 text-sm text-white flex items-center justify-between hover:border-pop-gold/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-2xl" style={{ color }}>{value || "token"}</span>
          <span className="text-xs text-gray-400 font-mono">{value || "Seleccionar icono"}</span>
        </div>
        <span className="material-symbols-outlined text-gray-500 text-lg">{open ? "expand_less" : "expand_more"}</span>
      </button>

      {open && (
        <div className="absolute z-50 top-full mt-2 left-0 right-0 bg-pop-cardGreen border border-white/10 rounded-xl shadow-2xl p-4">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar icono..."
            className="w-full bg-gray-800/50 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-pop-gold/50 mb-3"
          />
          <div className="grid grid-cols-5 gap-2">
            {displayed.map((icon) => (
              <button
                key={icon}
                type="button"
                onClick={() => { onChange(icon); setOpen(false); setSearch(""); }}
                className={`flex items-center justify-center p-3 rounded-lg border transition-all hover:scale-110 ${
                  value === icon
                    ? "bg-pop-gold/20 border-pop-gold"
                    : "bg-gray-800/30 border-gray-700/30 hover:border-pop-gold/30"
                }`}
                title={icon}
              >
                <span className="material-symbols-outlined text-xl" style={{ color: value === icon ? color : "#9CA3AF" }}>
                  {icon}
                </span>
              </button>
            ))}
          </div>
          {filtered.length > 25 && (
            <p className="text-[9px] text-gray-500 text-center mt-2 uppercase tracking-widest">
              Mostrando 25 de {filtered.length} · Refina la búsqueda
            </p>
          )}
          {filtered.length === 0 && (
            <p className="text-[9px] text-gray-500 text-center mt-2 uppercase tracking-widest">
              Sin resultados
            </p>
          )}
        </div>
      )}
    </div>
  );
}