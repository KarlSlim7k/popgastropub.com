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
    a: "Tus puntos no vencen mientras mantengas actividad en tu cuenta al menos una vez cada 6 meses. Una visita, un pedido en línea o cualquier acción que genere puntos restablece el contador.",
  },
  {
    q: "¿Los pedidos a domicilio también generan puntos?",
    a: "Sí. Todos los pedidos realizados a través de FoodBooking o por WhatsApp generan 1 punto por cada $10 MXN de consumo. El check-in de 25 puntos aplica exclusivamente para visitas presenciales al restaurante.",
  },
  {
    q: "¿Puedo bajar de nivel si dejo de visitar POP?",
    a: "Los niveles se mantienen durante el periodo activo. Mientras sigas generando actividad en tu cuenta, tu nivel permanece. Consulta los términos y condiciones completos para más detalles sobre periodos de evaluación.",
  },
  {
    q: "¿Cómo canjeo mis puntos?",
    a: "Inicia sesión en popgastropub.com, entra a tu perfil y selecciona la recompensa que quieras canjear. Se genera un código o QR que presentas al mesero o a la hostess en tu próxima visita. Para pedidos a domicilio, aplica al momento del pedido por WhatsApp.",
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
