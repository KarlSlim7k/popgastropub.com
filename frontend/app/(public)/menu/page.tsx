import type { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Menú | POP Perote',
  description: 'Explora nuestro menú completo: sushi, alitas, boneless, crepas, snacks y bebidas.',
};

const FOODBOOKING_URL =
  'https://www.foodbooking.com/ordering/restaurant/menu?company_uid=04f4d10b-2c07-4411-895d-4437eb890919&restaurant_uid=499ca112-e4ea-46f4-8990-47d5b58748ae&facebook=true';

const CATEGORIES = [
  { icon: '🍣', name: 'Sushi Rolls', desc: '40+ rolls de autor' },
  { icon: '🍗', name: 'Alitas', desc: '10 salsas únicas' },
  { icon: '🔥', name: 'Boneless', desc: 'Crujientes y adictivos' },
  { icon: '🥞', name: 'Crepas', desc: 'Dulces y saladas' },
  { icon: '🍟', name: 'Snacks', desc: 'Para compartir' },
  { icon: '🍹', name: 'Mixología', desc: 'Cócteles de autor' },
];

export default function MenuPage() {
  return (
    <main className="min-h-screen bg-[#0D0D0D] pt-20 pb-32">
      {/* Hero */}
      <section className="relative h-[500px] flex items-center justify-center overflow-hidden">
        <Image
          alt="Sushi POP Perote"
          src="/images/sushi_1.jpg"
          fill
          className="object-cover brightness-[0.25]"
          priority
        />
        <div className="relative z-10 text-center px-4 space-y-6">
          <h1 className="text-6xl md:text-9xl font-black tracking-tighter text-white uppercase leading-none">
            Nuestro <span className="text-[#F2C777]">Menú</span>
          </h1>
          <p className="text-white/60 text-lg md:text-xl max-w-lg mx-auto">
            Más de 100 platillos esperándote. Sushi, alitas, boneless, crepas y mucho más.
          </p>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-5xl mx-auto px-6 -mt-16 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {CATEGORIES.map((cat) => (
            <div key={cat.name} className="bg-[#1C1C1C] border border-white/5 rounded-xl p-5 text-center hover:border-[#F2C777]/30 transition-all duration-300 hover:-translate-y-1">
              <span className="text-3xl block mb-2">{cat.icon}</span>
              <h3 className="text-white font-bold text-sm">{cat.name}</h3>
              <p className="text-white/40 text-[11px] mt-1">{cat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-3xl mx-auto px-6 mt-20 text-center space-y-8">
        <div className="bg-[#1C1C1C] border border-white/5 rounded-2xl p-12 md:p-16 space-y-8">
          <div className="w-20 h-20 mx-auto bg-[#D96725]/10 rounded-full flex items-center justify-center">
            <span className="material-symbols-outlined text-[#D96725] text-4xl">restaurant_menu</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">
            Ordena directo desde tu celular
          </h2>
          <p className="text-white/50 max-w-md mx-auto">
            Explora todos nuestros platillos, personaliza tu orden y recógela en el restaurante o pide a domicilio.
          </p>
          <a
            href={FOODBOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-[#D96725] hover:bg-[#F2C777] hover:text-[#0D0D0D] text-white font-black uppercase tracking-widest text-sm px-12 py-5 rounded-sm transition-all duration-300 hover:shadow-[0_0_40px_rgba(217,103,37,0.3)] hover:scale-105"
          >
            <span className="material-symbols-outlined">shopping_bag</span>
            Ver Menú y Ordenar
            <span className="material-symbols-outlined text-sm">open_in_new</span>
          </a>
          <p className="text-white/30 text-xs uppercase tracking-widest">
            Plataforma segura de pedidos · FoodBooking
          </p>
        </div>

        {/* WhatsApp alternative */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
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
