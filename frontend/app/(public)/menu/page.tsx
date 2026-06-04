"use client";

const FOODBOOKING_URL =
  "https://www.foodbooking.com/ordering/restaurant/menu?company_uid=04f4d10b-2c07-4411-895d-4437eb890919&restaurant_uid=499ca112-e4ea-46f4-8990-47d5b58748ae&facebook=true";

export default function MenuPage() {
  return (
    <main className="min-h-screen bg-[#0D0D0D] pt-28 md:pt-36 pb-32">
      {/* Hero */}
      <section className="relative h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#732817] via-[#0D0D0D] to-[#0D0D0D]" />
        <div className="relative z-10 text-center px-4 space-y-4">
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white uppercase leading-none">
            Nuestro <span className="text-[#F2C777]">Menú</span>
          </h1>
          <p className="text-white/60 text-lg max-w-lg mx-auto">
            Más de 100 platillos esperándote. Sushi, alitas, boneless, crepas y mucho más.
          </p>
        </div>
      </section>

      {/* CTA - FoodBooking */}
      <section className="max-w-3xl mx-auto px-6 mt-20 text-center space-y-8">
        <div className="bg-[#1C1C1C] border border-white/5 rounded-2xl p-12 space-y-6">
          <h2 className="text-3xl font-black text-white tracking-tight">Ordena directo desde tu celular</h2>
          <p className="text-white/50 max-w-md mx-auto text-sm">
            Personaliza tu orden y recógela en el restaurante o pide a domicilio.
          </p>
          <a
            href={FOODBOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-[#D96725] hover:bg-[#F2C777] hover:text-[#0D0D0D] text-white font-black uppercase tracking-widest text-sm px-10 py-4 rounded-sm transition-all duration-300"
          >
            <span className="material-symbols-outlined">shopping_bag</span>
            Ordenar Ahora
          </a>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <span className="text-white/40 text-sm">¿Prefieres ordenar por WhatsApp?</span>
          <a
            href="https://wa.me/522821278014?text=Hola%20POP%20Perote%2C%20quiero%20hacer%20un%20pedido"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 border border-[#F2C777]/20 text-[#F2C777] font-bold text-sm px-6 py-3 rounded-sm hover:bg-[#F2C777]/10 transition-all"
          >
            <span className="material-symbols-outlined text-base">chat</span>
            Ordenar por WhatsApp
          </a>
        </div>
      </section>
    </main>
  );
}
