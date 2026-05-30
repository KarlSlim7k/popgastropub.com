import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Menú | POP Perote',
  description: 'Explora nuestro menú completo: sushi, alitas, boneless, crepas, snacks y bebidas.',
};

const FOODBOOKING_URL =
  'https://www.foodbooking.com/ordering/restaurant/menu?company_uid=04f4d10b-2c07-4411-895d-4437eb890919&restaurant_uid=499ca112-e4ea-46f4-8990-47d5b58748ae&facebook=true';

export default function MenuPage() {
  return (
    <main className="min-h-screen bg-[#0D0D0D] flex flex-col items-center justify-center px-4 text-center gap-8">
      <div className="space-y-4">
        <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-white uppercase leading-none">
          Nuestro <span className="text-[#F2C777]">Menú</span>
        </h1>
        <p className="text-gray-400 text-lg max-w-md mx-auto">
          Explora todos nuestros platillos y realiza tu pedido directamente en nuestra plataforma.
        </p>
      </div>

      <a
        href={FOODBOOKING_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-3 bg-[#D96725] hover:bg-[#F2C777] hover:text-[#0D0D0D] text-white font-black uppercase tracking-widest text-sm px-12 py-5 rounded-sm transition-all duration-300 hover:shadow-[0_0_40px_rgba(217,103,37,0.4)] hover:scale-105"
      >
        <span className="material-symbols-outlined">restaurant_menu</span>
        Ver Menú Completo
        <span className="material-symbols-outlined text-sm">open_in_new</span>
      </a>

      <p className="text-gray-600 text-xs uppercase tracking-widest">
        Serás redirigido a FoodBooking · Plataforma segura de pedidos
      </p>
    </main>
  );
}
