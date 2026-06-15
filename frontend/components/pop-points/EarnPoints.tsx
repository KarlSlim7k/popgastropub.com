"use client";

import { motion } from "framer-motion";
import { PointAction, formatPointsDisplay } from "@/lib/loyalty";

interface Props {
  actions: PointAction[];
  welcomePoints: number;
}

const EASE = [0.23, 1, 0.32, 1] as [number, number, number, number];

export default function EarnPoints({ actions, welcomePoints }: Props) {
  if (actions.length === 0) return null;

  return (
    <section id="ganar-puntos" className="bg-[#0d0d0d] py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <p className="text-[11px] font-black uppercase tracking-[0.4em] text-[#D96E30] mb-3">
          Acumula más rápido
        </p>
        <h2 className="font-epilogue font-black text-white text-4xl md:text-5xl tracking-tight mb-4">
          Más formas de <span className="text-[#F2C777]">ganar puntos</span>
        </h2>
        <p className="text-white/60 max-w-lg leading-relaxed">
          No solo por lo que consumes — hay múltiples caminos para subir de
          nivel más rápido de lo que crees.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-12">
          {actions.map((action, i) => {
            const color = action.color || "#F2C777";
            return (
              <motion.div
                key={action.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.04, ease: EASE }}
                whileHover={{ y: -3 }}
                className="relative bg-[#111] border border-white/5 rounded-lg p-6 overflow-hidden hover:border-white/15 transition-colors"
                style={{ ["--accent" as string]: color }}
              >
                <span
                  className="absolute top-0 left-0 right-0 h-0.5"
                  style={{ backgroundColor: color }}
                />
                <span
                  className="material-symbols-outlined text-3xl mb-3 block"
                  style={{ color }}
                >
                  {action.icon}
                </span>
                <div
                  className="font-epilogue font-black text-2xl leading-none"
                  style={{ color }}
                >
                  {formatPointsDisplay(action)}
                </div>
                <div className="text-white/90 font-bold text-sm mt-2">
                  {action.action}
                </div>
                {action.description && (
                  <p className="text-white/40 text-xs mt-2 leading-relaxed">
                    {action.description}
                  </p>
                )}
              </motion.div>
            );
          })}
        </div>

        {welcomePoints > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: EASE }}
            className="mt-6 bg-[#D96E30]/5 border border-[#D96E30]/20 rounded-lg p-5 flex flex-wrap items-center gap-4"
          >
            <span className="text-3xl">🎁</span>
            <div className="flex-1 min-w-0">
              <strong className="text-[#D96E30] text-base block mb-0.5">
                Bono de bienvenida — solo por registrarte
              </strong>
              <span className="text-white/60 text-sm">
                Crea tu cuenta gratis hoy y empieza con ventaja desde el primer
                día.
              </span>
            </div>
            <div className="font-epilogue font-black text-3xl text-[#D96E30]">
              {welcomePoints} pts
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
