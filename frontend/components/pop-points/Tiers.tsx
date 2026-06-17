"use client";

import { motion } from "framer-motion";
import { Tier } from "@/lib/loyalty";

interface Props {
  tiers: Tier[];
}

const EASE = [0.23, 1, 0.32, 1] as [number, number, number, number];

export default function Tiers({ tiers }: Props) {
  if (tiers.length === 0) return null;

  return (
    <section id="niveles" className="bg-[#080808] py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <p className="text-[11px] font-black uppercase tracking-[0.4em] text-[#D96E30] mb-3">
            Mientras más vengas, mejor te va
          </p>
          <h2 className="font-epilogue font-black text-white text-4xl md:text-5xl tracking-tight mb-4">
            Cuatro niveles.
            <br />
            <span className="text-[#F2C777]">Beneficios que crecen.</span>
          </h2>
          <p className="text-white/60 leading-relaxed">
            El programa POP Points no es una tarjeta de sellos — es una
            membresía que evoluciona contigo. Entre más nos visitas, más
            exclusivos se vuelven tus privilegios.
          </p>
          <a
            href="/login?tab=register"
            className="mt-6 inline-flex items-center gap-2 bg-[#D96E30] hover:bg-[#F2C777] text-white hover:text-[#0D0D0D] font-black uppercase tracking-widest text-sm px-7 py-3.5 rounded transition-all"
          >
            Empieza como {tiers[0]?.name ?? "POP Fan"} hoy
            <span className="material-symbols-outlined text-lg">arrow_forward</span>
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {tiers.map((tier, i) => (
            <motion.article
              key={tier.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: EASE }}
              whileHover={{ y: -4 }}
              className={`relative bg-[#0f0f0f] border rounded-xl p-7 overflow-hidden ${
                tier.is_featured
                  ? "border-[#F2C777]/40 bg-[#111]"
                  : "border-white/5"
              }`}
              style={{ borderTopColor: tier.border_color, borderTopWidth: 3 }}
            >
              {tier.is_featured && (
                <span className="absolute top-3 right-3 bg-[#F2C777] text-[#0D0D0D] text-[9px] font-black tracking-[0.2em] px-2 py-0.5 rounded-sm">
                  MÁS POPULAR
                </span>
              )}
              <div className="mb-5">
                <span
                  className="text-[10px] font-black tracking-[0.3em] uppercase block mb-2"
                  style={{ color: tier.color }}
                >
                  Nivel {String(i + 1).padStart(2, "0")}
                </span>
                <h3
                  className="font-epilogue font-black text-2xl leading-none mb-1"
                  style={{ color: tier.color }}
                >
                  {tier.name}
                </h3>
                <p
                  className="text-xs font-semibold tracking-wider opacity-60"
                  style={{ color: tier.color }}
                >
                  {tier.range}
                </p>
              </div>
              <div className="h-px bg-white/5 my-4" />
              {tier.benefits.length > 0 && (
                <ul className="flex flex-col gap-2">
                  {tier.benefits.map((b) => (
                    <li
                      key={b}
                      className="flex items-start gap-2 text-white/75 text-[13px]"
                    >
                      <span
                        className="material-symbols-outlined text-xs font-bold mt-0.5 flex-shrink-0"
                        style={{ color: tier.color }}
                      >
                        check
                      </span>
                      {b}
                    </li>
                  ))}
                </ul>
              )}
              {tier.investment_text && (
                <div className="mt-5 p-3 bg-[#050505] border border-white/5 rounded text-[11px] text-white/40">
                  <strong className="text-white/70 block mb-0.5">
                    ¿Cuándo llegas aquí?
                  </strong>
                  {tier.investment_text}
                </div>
              )}
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
