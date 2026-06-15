"use client";

import { motion } from "framer-motion";

interface Props {
  welcomePoints: number;
}

const EASE = [0.23, 1, 0.32, 1] as [number, number, number, number];

export default function FinalCTA({ welcomePoints }: Props) {
  return (
    <section className="relative bg-gradient-to-br from-[#0d1a0d] via-[#0a0a0a] to-[#1a1000] text-center py-28 px-6 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(217,110,48,0.06),transparent_70%)] pointer-events-none" />

      <div className="relative z-10 max-w-3xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: EASE }}
          className="text-[11px] font-black uppercase tracking-[0.4em] text-[#D96E30] mb-4"
        >
          Ya sabes lo que se viene
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
          className="font-epilogue font-black text-white text-4xl md:text-6xl tracking-tight leading-[1.05] mb-6"
        >
          Las buenas noches
          <br />
          <span className="text-[#F2C777]">no se planean.</span>
          <br />
          Pero sí se acumulan.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
          className="text-white/60 text-lg max-w-md mx-auto leading-relaxed mb-10"
        >
          Cada vez que eliges POP, eliges algo más que comida. Regístrate hoy y
          empieza a convertir cada visita en una recompensa que de verdad vale
          la pena.
        </motion.p>

        <motion.a
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3, ease: EASE }}
          href="/login?tab=register"
          className="inline-flex items-center gap-2 bg-[#D96E30] hover:bg-[#F2C777] text-white hover:text-[#0D0D0D] font-black uppercase tracking-widest text-base px-10 py-5 rounded transition-all duration-200 hover:shadow-[0_8px_32px_rgba(217,110,48,0.35)] hover:-translate-y-0.5"
        >
          <span className="material-symbols-outlined">star</span>
          Únete gratis — recibe {welcomePoints} pts al instante
        </motion.a>

        <p className="mt-6 text-white/30 text-xs tracking-wider">
          Sin costo · Sin tarjeta · Sin complicaciones
        </p>
      </div>
    </section>
  );
}
