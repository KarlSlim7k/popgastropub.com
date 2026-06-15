"use client";

import { motion } from "framer-motion";
import { Recompensa, TierSlug } from "@/lib/recompensas";
import { TIER_LABEL } from "@/lib/loyalty";

interface Props {
  recompensas: Recompensa[];
}

const EASE = [0.23, 1, 0.32, 1] as [number, number, number, number];

const TIER_COLOR: Record<TierSlug, string> = {
  fan: "#9CA3AF",
  lover: "#F2D194",
  vip: "#D96E30",
  elite: "#F2C777",
};

export default function Rewards({ recompensas }: Props) {
  if (recompensas.length === 0) return null;

  return (
    <section id="recompensas" className="bg-[#0d0d0d] py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <p className="text-[11px] font-black uppercase tracking-[0.4em] text-[#D96E30] mb-3">
          Canjea tus puntos
        </p>
        <h2 className="font-epilogue font-black text-white text-4xl md:text-5xl tracking-tight mb-4">
          Lo que te <span className="text-[#F2C777]">espera</span>
        </h2>
        <p className="text-white/60 max-w-lg leading-relaxed">
          Cada punto que acumulas es un paso hacia algo concreto. Aquí lo que
          puedes canjear:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-12">
          {recompensas.map((r, i) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.03, ease: EASE }}
              className="bg-[#111] border border-white/5 rounded-lg p-5 flex items-center gap-4 hover:border-white/15 transition-colors"
            >
              <div
                className="font-epilogue font-black text-xl min-w-[72px] text-center leading-none"
                style={{ color: "#F2C777" }}
              >
                {r.puntos_requeridos.toLocaleString("es-MX")}
                <span className="block text-[9px] text-white/40 font-medium tracking-[0.15em] mt-1">
                  PTS
                </span>
              </div>
              <div className="w-px h-9 bg-white/5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-white font-semibold text-sm mb-0.5 truncate">
                  {r.nombre}
                </div>
                <div
                  className="text-[10px] tracking-wider font-bold uppercase"
                  style={{ color: TIER_COLOR[r.tier] }}
                >
                  {TIER_LABEL[r.tier]}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
