"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const FAQ_ITEMS = [
  {
    q: "¿Cómo registro mis puntos después de cada visita?",
    a: "La hostess de POP genera un QR personalizado con tu perfil al final de tu visita. Escanéalo con tu teléfono y los puntos se acreditan automáticamente en tu cuenta. También puedes hacer check-in desde la app web popgastropub.com con tu cuenta registrada.",
  },
  {
    q: "¿Los puntos tienen fecha de vencimiento?",
    a: "Sí. Cada lote de puntos que acumulas tiene una vigencia de 2 meses (60 días) contados a partir de la fecha en que los obtuviste. Si no los usas dentro de ese periodo, se vencen automáticamente. Por eso te recomendamos visitarnos con frecuencia y revisar tu saldo seguido para que no se te pierda nada.",
  },
  {
    q: "¿Los pedidos a domicilio también generan puntos?",
    a: "Sí. Tus compras generan 1 punto por cada $10 MXN. Para acreditarlos, conserva el ticket y escanea el QR generado por el personal en el restaurante.",
  },
  {
    q: "¿Puedo bajar de nivel si dejo de visitar POP?",
    a: "Los niveles se mantienen durante el periodo activo. Mientras sigas generando actividad en tu cuenta, tu nivel permanece. Consulta los términos y condiciones completos para más detalles sobre periodos de evaluación.",
  },
  {
    q: "¿Cómo canjeo mis puntos?",
    a: "Inicia sesión en popgastropub.com, entra a tu perfil y selecciona la recompensa que quieras canjear. Presenta el código generado al personal durante tu próxima visita.",
  },
  {
    q: "¿El bono de bienvenida se acredita automáticamente?",
    a: "Sí. En cuanto completas tu registro en popgastropub.com los puntos aparecen de inmediato en tu saldo. No necesitas hacer ninguna compra para recibirlos.",
  },
];

const EASE = [0.23, 1, 0.32, 1] as [number, number, number, number];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="preguntas" className="bg-[#0d0d0d] py-24 px-6">
      <div className="max-w-3xl mx-auto">
        <p className="text-[11px] font-black uppercase tracking-[0.4em] text-[#D96E30] mb-3">
          Resolvemos tus dudas
        </p>
        <h2 className="font-epilogue font-black text-white text-4xl md:text-5xl tracking-tight mb-10">
          Preguntas <span className="text-[#F2C777]">frecuentes</span>
        </h2>

        <div className="flex flex-col gap-3">
          {FAQ_ITEMS.map((item, i) => {
            const isOpen = open === i;
            return (
              <div
                key={item.q}
                className="border border-white/5 rounded-lg overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full p-4 bg-[#111] hover:bg-[#141414] transition-colors flex items-center justify-between text-left"
                  aria-expanded={isOpen}
                >
                  <span className="font-semibold text-[15px] pr-4">
                    {item.q}
                  </span>
                  <span
                    className={`material-symbols-outlined text-[#F2C777] text-lg flex-shrink-0 transition-transform duration-300 ${
                      isOpen ? "rotate-45" : ""
                    }`}
                  >
                    add
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: EASE }}
                      className="overflow-hidden"
                    >
                      <p className="px-5 py-4 text-white/60 text-sm leading-relaxed">
                        {item.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
