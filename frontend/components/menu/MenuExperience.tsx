'use client';

/* eslint-disable @next/next/no-img-element */
import { useMemo, useState } from 'react';
import OrderPanel from '../order/OrderPanel';
import { menuSections } from '../order/order-data';
import { useOrderCart } from '../order/use-order-cart';

function formatPrice(value: number) {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    maximumFractionDigits: 0,
  }).format(value);
}

function renderPrice(price: number, priceLabel?: string) {
  return priceLabel ?? formatPrice(price);
}

function badgeClasses(badge?: string) {
  if (!badge) {
    return 'hidden';
  }

  const normalized = badge.toLowerCase();
  if (normalized.includes('nuevo')) {
    return 'bg-[#F2C777] text-[#0D0D0D]';
  }

  if (normalized.includes('picante')) {
    return 'bg-[#D96725] text-white';
  }

  return 'bg-[#732817] text-[#F2C894]';
}

export default function MenuExperience() {
  const cart = useOrderCart();
  const { addItem, itemCount, subtotal } = cart;
  const [isOrderOpen, setIsOrderOpen] = useState(false);

  const totalProducts = useMemo(
    () => menuSections.reduce((total, section) => total + section.items.length, 0),
    [],
  );

  return (
    <>
      <main className="mx-auto max-w-7xl px-3 pb-24 pt-28 md:px-12 md:pt-32">
        <header className="mb-16 relative">
          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <p className="text-[11px] font-black uppercase tracking-[0.35em] text-[#F2C777]/65">
                Menu POP
              </p>
              <h1 className="mt-4 font-epilogue text-5xl font-black leading-[0.9] tracking-tighter text-[#F2C894] md:text-7xl">
                NUESTRO MENU
              </h1>
              <p className="mt-5 max-w-xl text-xl text-white/70">
                Deleitate con nuestra explosión de sabores: sushi, boneless, snacks y más, preparados al momento con ingredientes frescos y auténticos. ¡Cada bocado es una fiesta para tu paladar!
              </p>
            </div>
            <div className="w-full md:w-96">
              <div className="group relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#F2C777] transition-colors group-focus-within:text-[#D96725]">
                  search
                </span>
                <input
                  className="w-full border-b border-[#F2C777]/15 bg-[#1B1716] py-4 pl-12 pr-4 text-white/80 outline-none transition-all placeholder:text-white/30 focus:border-[#F2C777]/35"
                  placeholder="Buscar platillo..."
                  type="text"
                />
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            {['Todo', 'Más Vendidos', 'Nuevos', 'Picante', 'Vegetariano', 'Para Compartir'].map((filter) => (
              <button
                className="rounded-full border border-[#F2C777]/20 px-5 py-2 text-xs font-black uppercase tracking-[0.25em] text-[#F2C894] transition-colors hover:border-[#F2C777]/45 hover:bg-[#F2C777]/10"
                key={filter}
                type="button"
              >
                {filter}
              </button>
            ))}
          </div>
        </header>

        <div className="sticky top-[72px] md:top-[88px] z-40 -mx-3 mb-8 md:mb-12 border-b border-[#F2C777]/10 bg-[#0D0D0D]/90 px-3 py-2 md:py-4 backdrop-blur-md md:-mx-12 md:px-12">
          <div className="flex gap-2 md:gap-4 overflow-x-auto pb-1 md:pb-2 scrollbar-none">
            {menuSections.map((section, index) => (
              <a
                className={`flex-shrink-0 px-3 py-2 md:px-5 md:py-3 font-epilogue text-base md:text-sm font-black uppercase tracking-[0.1em] md:tracking-[0.2em] transition-colors flex items-center gap-1 md:gap-2 ${
                  index === 0
                    ? 'bg-[#D96725] text-white'
                    : 'border border-[#F2C777]/35 text-[#F2C894] hover:bg-[#F2C777]/10'
                }`}
                href={`#${section.id}`}
                key={section.id}
              >
                <span>{section.emoji}</span>
                <span className="hidden md:inline">{section.title}</span>
              </a>
            ))}
          </div>
        </div>

        {menuSections.map((section) => (
          <section className="mb-24" id={section.id} key={section.id}>
            <div className="mb-10 flex items-center gap-4">
              <h2 className="font-epilogue text-3xl font-black uppercase tracking-tight text-white flex items-center gap-3">
                <span className="text-4xl">{section.emoji}</span>
                {section.title}
              </h2>
              <div className="h-px flex-grow bg-[#F2C777]/18" />
            </div>

            <div className="grid grid-cols-3 gap-2 md:gap-4 md:grid-cols-2 xl:grid-cols-3">
              {section.items.map((item) => (
                <article
                  className="group overflow-hidden bg-[#181413] transition-transform duration-500 hover:-translate-y-2 flex flex-col"
                  key={item.id}
                >
                  {/* ── Imagen ───────────────────────────────── */}
                  <div className="relative aspect-square md:aspect-[4/3] overflow-hidden flex-shrink-0">
                    <img
                      alt={item.name}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                      src={item.image}
                    />
                    {item.badge ? (
                      <div
                        className={`absolute left-2 top-2 md:left-4 md:top-4 px-1.5 py-0.5 md:px-3 md:py-1 text-[8px] md:text-[10px] font-black uppercase tracking-[0.15em] md:tracking-[0.25em] ${badgeClasses(item.badge)}`}
                      >
                        {item.badge}
                      </div>
                    ) : null}
                    {/* Descripción al hover — solo visible en desktop */}
                    <div className="hidden md:flex absolute inset-0 items-center justify-center bg-black/80 px-8 text-center opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                      <p className="text-sm leading-6 text-white/80">{item.description}</p>
                    </div>
                  </div>

                  {/* ── Info + Botón ─────────────────────────── */}
                  <div className="flex flex-col flex-1 p-2 md:p-6">
                    {/* Categoría (oculta en móvil para ahorrar espacio) */}
                    <p className="hidden md:block text-[11px] font-black uppercase tracking-[0.25em] text-[#F2C777]/60">
                      {item.category}
                    </p>

                    {/* Nombre */}
                    <h3 className="mt-0 md:mt-2 font-epilogue text-[10px] leading-tight md:text-2xl font-black uppercase tracking-tight text-white line-clamp-2">
                      {item.name}
                    </h3>

                    {/* Estrellas — solo desktop */}
                    <div className="hidden md:flex text-[#F2C777] mt-2">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <span className="material-symbols-outlined text-[18px]" key={`${item.id}-${index}`}>
                          {index < item.rating ? 'star' : 'star_half'}
                        </span>
                      ))}
                    </div>

                    {/* Precio + Botón */}
                    <div className="mt-auto pt-2 md:mt-6 md:pt-0">
                      {/* Precio */}
                      <span className="block font-epilogue text-xs md:text-2xl font-black text-[#F2C777] mb-1.5 md:mb-0">
                        {renderPrice(item.price, item.priceLabel)}
                      </span>

                      {/* Botón — full width en móvil, auto en desktop */}
                      <button
                        className="w-full md:w-auto inline-flex items-center justify-center gap-1 md:gap-2 bg-[#D96725] px-2 py-2 md:px-5 md:py-3 text-[9px] md:text-sm font-black uppercase tracking-[0.15em] md:tracking-[0.25em] text-white transition-all hover:bg-[#F2C777] hover:text-[#0D0D0D]"
                        onClick={() => addItem(item)}
                        type="button"
                      >
                        <span className="md:hidden">+</span>
                        <span className="hidden md:inline">Agregar</span>
                        <span className="material-symbols-outlined text-[12px] md:text-base">add</span>
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))}
      </main>

      <div className="fixed right-4 bottom-[calc(env(safe-area-inset-bottom)+5.5rem)] z-[60] md:right-8 md:bottom-8">
        <button
          className="group flex items-center gap-3 rounded-full bg-[#D96725] px-4 py-3 text-white shadow-[0_0_40px_rgba(217,103,37,0.3)] transition-all hover:bg-[#F2C777] hover:text-[#0D0D0D] md:gap-4 md:p-6"
          onClick={() => setIsOrderOpen(true)}
          type="button"
        >
          <div className="relative">
            <span className="material-symbols-outlined text-2xl md:text-3xl">shopping_cart</span>
            <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-white text-[10px] font-black text-[#D96725]">
              {itemCount}
            </span>
          </div>
          <div className="flex flex-col items-start pr-1 md:pr-2">
            <span className="font-epilogue text-xs font-black leading-none tracking-[0.25em] md:text-sm">
              PEDIDO
            </span>
            <span className="text-[11px] font-bold opacity-80 md:text-xs">
              {itemCount > 0 ? formatPrice(subtotal) : 'Abrir carrito'}
            </span>
          </div>
        </button>
      </div>

      <OrderPanel
        cart={cart}
        isOpen={isOrderOpen}
        mode="modal"
        onClose={() => setIsOrderOpen(false)}
      />
    </>
  );
}
