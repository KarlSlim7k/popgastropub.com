"use client";

import { motion } from "framer-motion";

const STEPS = [
  {
    n: "1",
    title: "Regístrate gratis",
    desc: "Crea tu cuenta en popgastropub.com en menos de 30 segundos. Recibes puntos de bienvenida al instante — sin costo, sin trampa.",
    icon: "person_add",
  },
  {
    n: "2",
    title: "Acumula con cada visita",
    desc: "Gana puntos por tu consumo, por hacer check-in en el local, por traer amigos nuevos o por dejar tu reseña en Google. Cada interacción con POP suma.",
    icon: "trending_up",
  },
  {
    n: "3",
    title: "Canjea lo que quieras",
    desc: "Rolls gratis, bebidas de cortesía, descuentos en tu cuenta, combos especiales y más. Tú decides cuándo y qué canjear.",
    icon: "redeem",
  },
];

const EASE = [0.23, 1, 0.32, 1] as [number, number, number, number];

export default function HowItWorks() {
  return (
    <section
      id="como-funciona"
      className="bg-gradient-to-b from-[#080808] to-[#0d1a0d] py-24 px-6"
    >
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-[11px] font-black uppercase tracking-[0.4em] text-[#D96E30] mb-3">
            El proceso
          </p>
          <h2 className="font-epilogue font-black text-white text-4xl md:text-5xl tracking-tight mb-4">
            Así de <span className="text-[#F2C777]">simple</span>
          </h2>
          <p className="text-white/60 max-w-md mx-auto leading-relaxed">
            Tres pasos. Sin apps, sin tarjetas físicas, sin complicaciones.
            Solo tú, tu comida favorita y los puntos acumulándose.
          </p>
        </div>

        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="hidden md:block absolute top-7 left-[calc(16.6%+1rem)] right-[calc(16.6%+1rem)] h-px bg-gradient-to-r from-[#1a3d20] via-[#2d5c35] to-[#1a3d20]" />

          {STEPS.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: EASE }}
              className="relative text-center"
            >
              <div className="relative mx-auto w-14 h-14 rounded-full bg-[#1a3d20] border-2 border-[#2d5c35] flex items-center justify-center mb-5 z-10">
                <span className="font-epilogue font-black text-xl text-[#F2C777]">
                  {s.n}
                </span>
              </div>
              <span className="material-symbols-outlined text-[#F2C777] text-2xl mb-2 block">
                {s.icon}
              </span>
              <h3 className="font-epilogue font-bold text-white text-base mb-2">
                {s.title}
              </h3>
              <p className="text-white/55 text-sm leading-relaxed">
                {s.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
