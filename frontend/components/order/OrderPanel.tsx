'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { type OrderCartState, useOrderCart } from './use-order-cart';

type OrderPanelProps = {
  cart?: OrderCartState;
  isOpen?: boolean;
  mode: 'modal' | 'page';
  onClose?: () => void;
};

const FOODBOOKING_URL =
  'https://www.foodbooking.com/ordering/restaurant/menu?company_uid=04f4d10b-2c07-4411-895d-4437eb890919&restaurant_uid=499ca112-e4ea-46f4-8990-47d5b58748ae&facebook=true';

function formatPrice(value: number) {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    maximumFractionDigits: 0,
  }).format(value);
}

export default function OrderPanel({
  cart: externalCart,
  isOpen = true,
  mode,
  onClose,
}: OrderPanelProps) {
  const standaloneCart = useOrderCart();
  const { clearCart, decrementItem, hydrated, incrementItem, itemCount, items, removeItem, subtotal } =
    externalCart ?? standaloneCart;

  useEffect(() => {
    if (mode !== 'modal' || !isOpen) return;
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = overflow;
    };
  }, [isOpen, mode]);

  if (mode === 'modal' && !isOpen) return null;

  const content = (
    <div className="flex h-full flex-col rounded-[2rem] border border-[#F2C777]/12 bg-[#0D0D0D] p-6 text-white shadow-[0_25px_80px_rgba(0,0,0,0.45)] md:p-8">
      <header className="flex items-start justify-between gap-4 border-b border-[#F2C777]/10 pb-5">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.35em] text-[#F2C777]/70">Selección informativa</p>
          <h2 className="mt-2 font-epilogue text-3xl font-black uppercase tracking-tight text-[#F2C894] md:text-4xl">Tus favoritos</h2>
          <p className="mt-3 max-w-xl text-sm leading-6 text-white/65">
            Revisa tu selección y continúa en FoodBooking para confirmar disponibilidad, entrega y total final.
          </p>
        </div>
        {mode === 'modal' && (
          <button aria-label="Cerrar selección" className="flex h-11 w-11 items-center justify-center rounded-full border border-[#F2C777]/15 text-[#F2C894] hover:bg-[#F2C777]/10" onClick={onClose} type="button">
            <span className="material-symbols-outlined">close</span>
          </button>
        )}
      </header>

      <div className="mt-6 flex-1 overflow-y-auto">
        {!hydrated ? (
          <p className="rounded-2xl bg-white/5 p-8 text-sm text-white/60">Cargando selección...</p>
        ) : items.length === 0 ? (
          <section className="rounded-[2rem] border border-dashed border-[#F2C777]/15 bg-[#161312] p-8 text-center">
            <span className="material-symbols-outlined text-5xl text-[#F2C777]">restaurant_menu</span>
            <h3 className="mt-5 font-epilogue text-2xl font-black uppercase">Aún no has elegido productos</h3>
            <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-white/60">Explora el menú, guarda tus favoritos y usa FoodBooking para realizar el pedido.</p>
            <Link className="mt-6 inline-flex rounded-full bg-[#D96725] px-6 py-3 text-sm font-black uppercase tracking-widest" href="/menu" onClick={onClose}>Explorar menú</Link>
          </section>
        ) : (
          <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs font-black uppercase tracking-widest text-white/50">{itemCount} productos seleccionados</p>
                <button className="text-xs font-black uppercase tracking-widest text-[#F2C894]" onClick={clearCart} type="button">Vaciar</button>
              </div>
              {items.map((item) => (
                <article className="rounded-[1.5rem] border border-[#F2C777]/10 bg-[#1b1716] p-5" key={item.id}>
                  <div className="flex items-start justify-between gap-4">
                    <div><h3 className="font-epilogue text-lg font-black uppercase">{item.name}</h3><p className="mt-1 text-xs uppercase tracking-widest text-[#F2C777]/60">{item.category}</p></div>
                    <button className="text-xs uppercase text-white/40 hover:text-white" onClick={() => removeItem(item.id)} type="button">Quitar</button>
                  </div>
                  <div className="mt-5 flex items-center justify-between">
                    <div className="flex items-center gap-3 rounded-full border border-white/10 p-1">
                      <button aria-label={`Quitar una unidad de ${item.name}`} className="h-9 w-9 rounded-full text-[#F2C894] hover:bg-white/5" onClick={() => decrementItem(item.id)} type="button">−</button>
                      <span className="min-w-6 text-center font-black">{item.quantity}</span>
                      <button aria-label={`Agregar una unidad de ${item.name}`} className="h-9 w-9 rounded-full text-[#F2C894] hover:bg-white/5" onClick={() => incrementItem(item.id)} type="button">+</button>
                    </div>
                    <span className="font-epilogue text-lg font-black text-[#F2C777]">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                </article>
              ))}
            </section>

            <aside className="h-fit rounded-[1.75rem] border border-[#F2C777]/10 bg-[#151111] p-6">
              <p className="text-[11px] font-black uppercase tracking-[0.35em] text-[#F2C777]/70">Referencia</p>
              <div className="mt-5 flex items-center justify-between border-b border-white/10 pb-5 font-epilogue text-xl font-black uppercase"><span>Subtotal estimado</span><span className="text-[#F2C777]">{formatPrice(subtotal)}</span></div>
              <p className="mt-5 text-sm leading-6 text-white/60">Esta selección no es una orden ni reserva productos. Los precios, disponibilidad y costos de entrega se confirman exclusivamente en FoodBooking.</p>
              <a className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-[#D96725] px-5 py-4 text-sm font-black uppercase tracking-[0.2em]" href={FOODBOOKING_URL} rel="noreferrer" target="_blank">Continuar en FoodBooking<span className="material-symbols-outlined text-base">north_east</span></a>
              <Link className="mt-3 flex w-full items-center justify-center rounded-full border border-[#F2C777]/20 px-5 py-4 text-sm font-black uppercase tracking-[0.2em] text-[#F2C894]" href="/menu" onClick={onClose}>Seguir explorando</Link>
            </aside>
          </div>
        )}
      </div>
    </div>
  );

  if (mode === 'page') return <main className="min-h-screen bg-[#0D0D0D] px-4 pb-20 pt-28 md:px-8">{content}</main>;

  return <div aria-modal="true" className="fixed inset-0 z-[80] bg-black/75 p-3 backdrop-blur-sm md:p-8" role="dialog"><div className="mx-auto h-full max-w-6xl">{content}</div></div>;
}
