'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { menuSections, orderMoments, suggestedPairings } from './order-data';
import { type OrderCartState, useOrderCart } from './use-order-cart';

type OrderPanelProps = {
  cart?: OrderCartState;
  isOpen?: boolean;
  mode: 'modal' | 'page';
  onClose?: () => void;
};

type FulfillmentType = 'pickup' | 'delivery';

const WHATSAPP_PHONE = '522828253243';

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

function buildWhatsappLink(
  items: { name: string; quantity: number }[],
  fulfillment: FulfillmentType,
  notes: string,
  total: number,
) {
  const summary = items.length
    ? items.map((item) => `${item.quantity}x ${item.name}`).join(', ')
    : 'Aun no he elegido productos';
  const message = [
    'Hola POP Perote, quiero continuar este pedido:',
    summary,
    `Modalidad: ${fulfillment === 'delivery' ? 'Envio en Perote' : 'Recoger en sucursal'}`,
    `Total estimado: ${formatPrice(total)}`,
    notes ? `Notas: ${notes}` : null,
  ]
    .filter(Boolean)
    .join('\n');

  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
}

function Header({
  mode,
  onClose,
}: {
  mode: 'modal' | 'page';
  onClose?: () => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-[#F2C777]/10 pb-5">
      <div>
        <p className="text-[11px] font-black uppercase tracking-[0.35em] text-[#F2C777]/70">
          Pedido POP
        </p>
        <h1 className="mt-2 font-epilogue text-3xl font-black uppercase tracking-tight text-[#F2C894] md:text-4xl">
          {mode === 'page' ? 'Confirma Tu Orden' : 'Tu Pedido'}
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-6 text-white/65">
          Revisa tus favoritos, elige como quieres recibirlos y finaliza por WhatsApp con el equipo de POP.
        </p>
      </div>
      {mode === 'modal' ? (
        <button
          aria-label="Cerrar pedido"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-[#F2C777]/15 text-[#F2C894] transition-colors hover:border-[#F2C777]/40 hover:bg-[#F2C777]/10"
          onClick={onClose}
          type="button"
        >
          <span className="material-symbols-outlined">close</span>
        </button>
      ) : null}
    </div>
  );
}

function EmptyState({
  mode,
  onClose,
}: {
  mode: 'modal' | 'page';
  onClose?: () => void;
}) {
  const featuredItems = menuSections.flatMap((section) => section.items).slice(0, 3);

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <section className="rounded-[2rem] border border-[#F2C777]/12 bg-[#161312] p-8">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#D96725]/15 text-[#F2C777]">
          <span className="material-symbols-outlined text-4xl">shopping_cart</span>
        </div>
        <h2 className="mt-6 font-epilogue text-2xl font-black uppercase tracking-tight text-white">
          Tu carrito aun esta vacio
        </h2>
        <p className="mt-3 max-w-lg text-sm leading-6 text-white/65">
          Agrega algunos de nuestros consentidos y aqui veras el resumen, tiempos estimados, puntos POP y el acceso directo para terminar por WhatsApp.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            className="inline-flex items-center gap-2 rounded-full bg-[#D96725] px-5 py-3 text-sm font-black uppercase tracking-[0.2em] text-white transition-transform hover:-translate-y-0.5"
            href="/menu"
            onClick={onClose}
          >
            Ir al menu
            <span className="material-symbols-outlined text-base">arrow_forward</span>
          </Link>
          {mode === 'modal' ? (
            <button
              className="inline-flex items-center gap-2 rounded-full border border-[#F2C777]/20 px-5 py-3 text-sm font-black uppercase tracking-[0.2em] text-[#F2C894] transition-colors hover:border-[#F2C777]/40 hover:bg-[#F2C777]/10"
              onClick={onClose}
              type="button"
            >
              Seguir explorando
            </button>
          ) : null}
        </div>
      </section>

      <aside className="rounded-[2rem] border border-[#F2C777]/12 bg-[#110f0f] p-6">
        <p className="text-[11px] font-black uppercase tracking-[0.35em] text-[#F2C777]/70">
          Recomendados
        </p>
        <div className="mt-5 space-y-4">
          {featuredItems.map((item) => (
            <div
              className="rounded-2xl border border-[#F2C777]/10 bg-[#1a1716] p-4"
              key={item.id}
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-epilogue text-lg font-black uppercase tracking-tight text-white">
                    {item.name}
                  </p>
                  <p className="mt-1 text-xs uppercase tracking-[0.2em] text-[#F2C777]/60">
                    {item.category}
                  </p>
                </div>
                <span className="font-epilogue text-lg font-black text-[#F2C777]">
                  {renderPrice(item.price, item.priceLabel)}
                </span>
              </div>
              <p className="mt-3 text-sm leading-6 text-white/60">{item.description}</p>
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
}

export default function OrderPanel({
  cart: externalCart,
  isOpen = true,
  mode,
  onClose,
}: OrderPanelProps) {
  const standaloneCart = useOrderCart();
  const { clearCart, decrementItem, hydrated, incrementItem, itemCount, items, points, removeItem, subtotal } =
    externalCart ?? standaloneCart;
  const [fulfillment, setFulfillment] = useState<FulfillmentType>('pickup');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (mode !== 'modal' || !isOpen) {
      return;
    }

    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = overflow;
    };
  }, [isOpen, mode]);

  if (mode === 'modal' && !isOpen) {
    return null;
  }

  const deliveryFee = fulfillment === 'delivery' && items.length > 0 ? 35 : 0;
  const total = subtotal + deliveryFee;
  const whatsappLink = buildWhatsappLink(items, fulfillment, notes, total);

  const content = (
    <div className="flex h-full flex-col rounded-[2rem] border border-[#F2C777]/12 bg-[#0D0D0D] p-6 text-white shadow-[0_25px_80px_rgba(0,0,0,0.45)] md:p-8">
      <Header mode={mode} onClose={onClose} />

      <div className="mt-6 flex-1 overflow-y-auto">
        {!hydrated ? (
          <div className="rounded-[1.75rem] border border-[#F2C777]/10 bg-[#151111] p-8 text-sm text-white/60">
            Cargando tu pedido...
          </div>
        ) : items.length === 0 ? (
          <EmptyState mode={mode} onClose={onClose} />
        ) : (
          <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <section className="space-y-5">
              <div className="rounded-[1.75rem] border border-[#F2C777]/10 bg-[#151111] p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[11px] font-black uppercase tracking-[0.35em] text-[#F2C777]/70">
                      Elegidos
                    </p>
                    <p className="mt-2 text-sm text-white/60">
                      {itemCount} {itemCount === 1 ? 'producto' : 'productos'} listos para cerrar.
                    </p>
                  </div>
                  <button
                    className="rounded-full border border-[#F2C777]/15 px-4 py-2 text-[11px] font-black uppercase tracking-[0.2em] text-[#F2C894] transition-colors hover:border-[#F2C777]/40 hover:bg-[#F2C777]/10"
                    onClick={clearCart}
                    type="button"
                  >
                    Vaciar
                  </button>
                </div>

                <div className="mt-5 space-y-4">
                  {items.map((item) => (
                    <article
                      className="rounded-[1.5rem] border border-[#F2C777]/10 bg-[#1b1716] p-4"
                      key={item.id}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-epilogue text-lg font-black uppercase tracking-tight text-white">
                            {item.name}
                          </p>
                          <p className="mt-1 text-xs uppercase tracking-[0.2em] text-[#F2C777]/65">
                            {item.category}
                          </p>
                        </div>
                        <button
                          className="text-sm font-bold uppercase tracking-[0.2em] text-white/35 transition-colors hover:text-[#F2C894]"
                          onClick={() => removeItem(item.id)}
                          type="button"
                        >
                          Quitar
                        </button>
                      </div>

                      <div className="mt-4 flex items-center justify-between gap-3">
                        <div className="inline-flex items-center rounded-full border border-[#F2C777]/15 bg-[#0F0D0D] p-1">
                          <button
                            aria-label={`Quitar una unidad de ${item.name}`}
                            className="flex h-9 w-9 items-center justify-center rounded-full text-[#F2C894] transition-colors hover:bg-[#F2C777]/10"
                            onClick={() => decrementItem(item.id)}
                            type="button"
                          >
                            <span className="material-symbols-outlined text-base">remove</span>
                          </button>
                          <span className="min-w-10 text-center text-sm font-black text-white">
                            {item.quantity}
                          </span>
                          <button
                            aria-label={`Agregar una unidad de ${item.name}`}
                            className="flex h-9 w-9 items-center justify-center rounded-full text-[#F2C894] transition-colors hover:bg-[#F2C777]/10"
                            onClick={() => incrementItem(item.id)}
                            type="button"
                          >
                            <span className="material-symbols-outlined text-base">add</span>
                          </button>
                        </div>
                        <span className="font-epilogue text-xl font-black text-[#F2C777]">
                          {item.priceLabel && item.quantity === 1
                            ? item.priceLabel
                            : formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    </article>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                {orderMoments.map((moment) => (
                  <div
                    className="rounded-[1.5rem] border border-[#F2C777]/10 bg-[#151111] p-4"
                    key={moment}
                  >
                    <p className="text-sm leading-6 text-white/68">{moment}</p>
                  </div>
                ))}
              </div>

              <div className="rounded-[1.75rem] border border-[#F2C777]/10 bg-[#151111] p-5">
                <p className="text-[11px] font-black uppercase tracking-[0.35em] text-[#F2C777]/70">
                  Notas para cocina
                </p>
                <textarea
                  className="mt-4 min-h-28 w-full rounded-[1.25rem] border border-[#F2C777]/10 bg-[#0F0D0D] px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-white/30 focus:border-[#F2C777]/40"
                  onChange={(event) => setNotes(event.target.value)}
                  placeholder="Ej. sin ajonjoli, salsa aparte, llevar palillos extras..."
                  value={notes}
                />
              </div>
            </section>

            <aside className="space-y-5">
              <div className="rounded-[1.75rem] border border-[#F2C777]/10 bg-[#151111] p-5">
                <p className="text-[11px] font-black uppercase tracking-[0.35em] text-[#F2C777]/70">
                  Como quieres recibirlo
                </p>
                <div className="mt-4 grid gap-3">
                  <button
                    className={`rounded-[1.5rem] border px-4 py-4 text-left transition-colors ${
                      fulfillment === 'pickup'
                        ? 'border-[#F2C777]/40 bg-[#F2C777]/10'
                        : 'border-[#F2C777]/10 bg-[#0F0D0D]'
                    }`}
                    onClick={() => setFulfillment('pickup')}
                    type="button"
                  >
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-[#F2C777]">storefront</span>
                      <div>
                        <p className="font-epilogue text-lg font-black uppercase tracking-tight text-white">
                          Recoger en sucursal
                        </p>
                        <p className="mt-1 text-sm text-white/60">
                          Justo Sierra No. 11, Col. Amado Nervo
                        </p>
                      </div>
                    </div>
                  </button>
                  <button
                    className={`rounded-[1.5rem] border px-4 py-4 text-left transition-colors ${
                      fulfillment === 'delivery'
                        ? 'border-[#F2C777]/40 bg-[#F2C777]/10'
                        : 'border-[#F2C777]/10 bg-[#0F0D0D]'
                    }`}
                    onClick={() => setFulfillment('delivery')}
                    type="button"
                  >
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-[#F2C777]">delivery_dining</span>
                      <div>
                        <p className="font-epilogue text-lg font-black uppercase tracking-tight text-white">
                          Envio en Perote
                        </p>
                        <p className="mt-1 text-sm text-white/60">
                          Agregamos una cuota estimada de {formatPrice(35)}
                        </p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              <div className="rounded-[1.75rem] border border-[#F2C777]/10 bg-[#151111] p-5">
                <p className="text-[11px] font-black uppercase tracking-[0.35em] text-[#F2C777]/70">
                  Resumen final
                </p>
                <div className="mt-5 space-y-3 text-sm">
                  <div className="flex items-center justify-between text-white/65">
                    <span>Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex items-center justify-between text-white/65">
                    <span>{fulfillment === 'delivery' ? 'Envio estimado' : 'Recoger en sucursal'}</span>
                    <span>{deliveryFee > 0 ? formatPrice(deliveryFee) : 'Sin costo extra'}</span>
                  </div>
                  <div className="flex items-center justify-between border-t border-[#F2C777]/10 pt-3 font-epilogue text-lg font-black uppercase tracking-tight text-white">
                    <span>Total</span>
                    <span className="text-[#F2C777]">{formatPrice(total)}</span>
                  </div>
                </div>

                <div className="mt-5 rounded-[1.25rem] bg-[#D96725]/12 p-4">
                  <p className="text-[11px] font-black uppercase tracking-[0.3em] text-[#F2C777]/75">
                    Puntos POP
                  </p>
                  <p className="mt-2 text-2xl font-black text-white">+{points} pts</p>
                  <p className="mt-1 text-sm text-white/60">
                    Este pedido te acerca a tu siguiente recompensa.
                  </p>
                </div>

                <div className="mt-5 space-y-3">
                  <a
                    className="flex w-full items-center justify-center gap-2 rounded-full bg-[#D96725] px-5 py-4 text-sm font-black uppercase tracking-[0.25em] text-white transition-transform hover:-translate-y-0.5"
                    href={whatsappLink}
                    rel="noreferrer"
                    target="_blank"
                  >
                    Cerrar por WhatsApp
                    <span className="material-symbols-outlined text-base">north_east</span>
                  </a>
                  <Link
                    className="flex w-full items-center justify-center gap-2 rounded-full border border-[#F2C777]/20 px-5 py-4 text-sm font-black uppercase tracking-[0.25em] text-[#F2C894] transition-colors hover:border-[#F2C777]/40 hover:bg-[#F2C777]/10"
                    href="/menu"
                    onClick={onClose}
                  >
                    Seguir agregando
                    <span className="material-symbols-outlined text-base">add</span>
                  </Link>
                </div>
              </div>

              <div className="rounded-[1.75rem] border border-[#F2C777]/10 bg-[#151111] p-5">
                <p className="text-[11px] font-black uppercase tracking-[0.35em] text-[#F2C777]/70">
                  Antes de enviarlo
                </p>
                <ul className="mt-4 space-y-3 text-sm leading-6 text-white/65">
                  {suggestedPairings.map((pairing) => (
                    <li className="flex gap-3" key={pairing}>
                      <span className="mt-1 h-2 w-2 rounded-full bg-[#D96725]" />
                      <span>{pairing}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );

  if (mode === 'page') {
    return (
      <main className="min-h-screen bg-[#0D0D0D] px-6 pb-28 pt-32 md:px-12">
        <div className="mx-auto max-w-7xl">{content}</div>
      </main>
    );
  }

  return (
    <div className="fixed inset-0 z-[120] bg-black/70 backdrop-blur-sm">
      <button
        aria-label="Cerrar ventana de pedido"
        className="absolute inset-0 cursor-default"
        onClick={onClose}
        type="button"
      />
      <div className="relative ml-auto h-full w-full max-w-2xl p-3 md:p-6">{content}</div>
    </div>
  );
}
