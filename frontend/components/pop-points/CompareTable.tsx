"use client";

import { motion } from "framer-motion";
import { Tier } from "@/lib/loyalty";

interface Props {
  tiers: Tier[];
}

const EASE = [0.23, 1, 0.32, 1] as [number, number, number, number];

type Cell = boolean | string;

interface Row {
  label: string;
  cells: Cell[];
}

const BASE_ROWS: Row[] = [
  { label: "1 pt por cada $X MXN", cells: ["check", "check", "check", "check"] },
  { label: "25 pts por check-in", cells: ["check", "check", "check", "check"] },
];

function buildRows(tiers: Tier[]): Row[] {
  if (tiers.length < 4) {
    return BASE_ROWS;
  }
  return [
    { label: "1 pt por cada $X MXN", cells: ["check", "check", "check", "check"] },
    { label: "25 pts por check-in", cells: ["check", "check", "check", "check"] },
    { label: "Puntos extra por compra", cells: ["dash", "+10%", "+25%", "+50%"] },
    { label: "Promo mensual exclusiva", cells: ["dash", "check", "check", "check"] },
    { label: "Bebida gratis en cumpleaños", cells: ["dash", "check", "check", "check"] },
    { label: "Roll gratis cada 5 visitas", cells: ["dash", "dash", "check", "check"] },
    { label: "Acceso anticipado a promos", cells: ["dash", "dash", "check", "check"] },
    { label: "Reservación prioritaria", cells: ["dash", "dash", "dash", "check"] },
    { label: "1 buffet gratis por mes", cells: ["dash", "dash", "dash", "check"] },
    { label: "Invitación a eventos VIP", cells: ["dash", "dash", "check", "check"] },
  ];
}

export default function CompareTable({ tiers }: Props) {
  if (tiers.length === 0) return null;
  const rows = buildRows(tiers);

  return (
    <section id="comparar" className="bg-[#080808] py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <p className="text-[11px] font-black uppercase tracking-[0.4em] text-[#D96E30] mb-3">
          Todos los beneficios
        </p>
        <h2 className="font-epilogue font-black text-white text-4xl md:text-5xl tracking-tight mb-10">
          ¿Qué incluye <span className="text-[#F2C777]">cada nivel?</span>
        </h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: EASE }}
          className="overflow-x-auto"
        >
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>
                <th className="p-4 text-left font-epilogue font-black text-[11px] tracking-[0.2em] uppercase border-b-2 border-white/5">
                  Beneficio
                </th>
                {tiers.map((t) => (
                  <th
                    key={t.id}
                    className={`p-4 text-center font-epilogue font-black text-[11px] tracking-[0.2em] uppercase border-b-2 border-white/5 ${
                      t.is_featured ? "bg-[#F2C777]/[0.04]" : ""
                    }`}
                    style={{ color: t.color }}
                  >
                    {t.slug.toUpperCase()}
                    {t.is_featured ? " ★" : ""}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr
                  key={row.label}
                  className="hover:bg-white/[0.015] transition-colors"
                >
                  <td className="p-3.5 text-left text-white font-medium border-b border-white/[0.04]">
                    {row.label}
                  </td>
                  {row.cells.map((cell, i) => {
                    const tier = tiers[i];
                    const isFeatured = tier?.is_featured;
                    return (
                      <td
                        key={i}
                        className={`p-3.5 text-center border-b border-white/[0.04] ${
                          isFeatured ? "bg-[#F2C777]/[0.04]" : ""
                        }`}
                      >
                        {cell === "check" ? (
                          <span className="text-[#4caf82] text-lg">✓</span>
                        ) : cell === "dash" ? (
                          <span className="text-white/20">—</span>
                        ) : (
                          <span className="text-white/65">{cell}</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </div>
    </section>
  );
}
