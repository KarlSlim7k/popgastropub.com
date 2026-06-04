"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const FOODBOOKING_URL =
  "https://www.foodbooking.com/ordering/restaurant/menu?company_uid=04f4d10b-2c07-4411-895d-4437eb890919&restaurant_uid=499ca112-e4ea-46f4-8990-47d5b58748ae&facebook=true";

export default function MenuPage() {
  return (
    <main className="min-h-screen bg-[#0D0D0D] pt-28 md:pt-36 pb-32">
      {/* Hero */}
      <section className="relative h-[420px] md:h-[500px] flex items-center justify-center overflow-hidden">
        <Image
          alt="Sushi POP Perote"
          src="/images/sushi_1.webp"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-[#0D0D0D]/70 to-[#0D0D0D]/30" />
        <div className="absolute inset-0 bg-[#732817]/20" />

        <div className="relative z-10 text-center px-4 space-y-5">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
            className="text-6xl md:text-8xl font-black tracking-tighter text-white uppercase leading-none"
          >
            Nuestro <span className="text-[#F2C777]">Menú</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.23, 1, 0.32, 1] }}
            className="text-white/70 text-lg md:text-xl max-w-lg mx-auto leading-relaxed"
          >
            Más de 100 platillos esperándote. Sushi, alitas, boneless, crepas y mucho más.
          </motion.p>
        </div>
      </section>

      {/* CTA - FoodBooking */}
      <section className="max-w-3xl mx-auto px-6 mt-16 md:mt-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
          className="bg-[#1C1C1C] border border-[#F2C777]/10 rounded-2xl p-10 md:p-14 space-y-6 hover:border-[#F2C777]/25 transition-colors duration-500"
        >
          <div className="w-14 h-14 mx-auto rounded-full bg-[#D96725]/10 flex items-center justify-center border border-[#D96725]/20">
            <span className="material-symbols-outlined text-[#D96725] text-2xl">smartphone</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">
            Ordena directo desde tu celular
          </h2>
          <p className="text-white/50 max-w-md mx-auto text-sm md:text-base leading-relaxed">
            Personaliza tu orden y recógela en el restaurante o pide a domicilio.
          </p>
          <a
            href={FOODBOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-[#D96725] hover:bg-[#F2C777] hover:text-[#0D0D0D] text-white font-black uppercase tracking-widest text-sm px-10 py-4 rounded-lg transition-all duration-300 hover:shadow-[0_0_30px_rgba(217,103,37,0.35)] hover:scale-[1.02]"
          >
            <span className="material-symbols-outlined">shopping_bag</span>
            Ordenar Ahora
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.23, 1, 0.32, 1] }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10"
        >
          <span className="text-white/40 text-sm">¿Prefieres ordenar por WhatsApp?</span>
          <a
            href="https://wa.me/522821278014?text=Hola%20POP%20Perote%2C%20quiero%20hacer%20un%20pedido"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 border border-[#F2C777]/20 text-[#F2C777] font-bold text-sm px-6 py-3 rounded-lg hover:bg-[#F2C777]/10 transition-all"
          >
            <span className="material-symbols-outlined text-base">chat</span>
            Ordenar por WhatsApp
          </a>
        </motion.div>
      </section>
    </main>
  );
}
