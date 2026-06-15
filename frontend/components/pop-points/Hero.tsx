"use client";

import { motion } from "framer-motion";
import { Tier } from "@/lib/loyalty";

interface Props {
  welcomePoints: number;
  tiers: Tier[];
}

const EASE = [0.23, 1, 0.32, 1] as [number, number, number, number];

export default function Hero({ welcomePoints, tiers }: Props) {
  return (
    <section className="relative min-h-[88vh] flex items-center justify-center text-center px-6 py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a1a0d] via-[#0f0f0f] to-[#1a1a0a] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_40%,rgba(242,193,103,0.08),transparent_70%)] pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
          className="font-epilogue text-[11px] font-black uppercase tracking-[0.4em] text-[#D96E30] mb-6 inline-flex items-center gap-3"
        >
          <span className="block w-8 h-px bg-[#D96E30]/50" />
          Ser cliente de POP tiene premio
          <span className="block w-8 h-px bg-[#D96E30]/50" />
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: EASE }}
          className="inline-flex items-center gap-2 bg-[#F2C777]/10 border border-[#F2C777]/25 rounded-full px-5 py-2 mb-8"
        >
          <span className="material-symbols-outlined text-sm text-[#F2C777]">star</span>
          <span className="text-[#F2C777] font-bold text-sm">
            {welcomePoints} puntos gratis al registrarte hoy
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: EASE }}
          className="font-epilogue font-black text-white text-5xl md:text-7xl lg:text-8xl leading-[0.95] tracking-tight mb-6"
        >
          Cada visita
          <br />
          <span className="text-[#F2C777]">tiene su recompensa.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25, ease: EASE }}
          className="text-white/70 text-base md:text-lg max-w-xl mx-auto mb-10 leading-relaxed"
        >
          En POP Gastropub, comer bien ya no solo sacia el antojo — también te
          acerca a rolls gratis, bebidas de cortesía y experiencias que solo
          los que más nos visitan se merecen.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35, ease: EASE }}
          className="flex flex-col sm:flex-row gap-3 justify-center"
        >
          <a
            href="/login?tab=register"
            className="inline-flex items-center justify-center gap-2 bg-[#D96E30] hover:bg-[#F2C777] text-white hover:text-[#0D0D0D] font-black uppercase tracking-widest text-sm px-8 py-4 rounded transition-all duration-200 hover:shadow-[0_8px_24px_rgba(217,110,48,0.35)] hover:-translate-y-0.5"
          >
            <span className="material-symbols-outlined text-lg">person_add</span>
            Regístrate gratis
          </a>
          <a
            href="#como-funciona"
            className="inline-flex items-center justify-center gap-2 border border-white/30 hover:border-[#F2C777] text-white hover:text-[#F2C777] font-bold uppercase tracking-widest text-sm px-7 py-4 rounded transition-all"
          >
            ¿Cómo funciona?
            <span className="material-symbols-outlined text-lg">arrow_downward</span>
          </a>
        </motion.div>

        {tiers.length > 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5, ease: EASE }}
            className="mt-12 text-white/40 text-xs uppercase tracking-[0.3em] font-bold"
          >
            {tiers.length} niveles · hasta 50% más puntos
          </motion.p>
        )}
      </div>
    </section>
  );
}
