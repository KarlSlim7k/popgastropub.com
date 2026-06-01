'use client';

import Image from 'next/image';
import React, { useCallback, useEffect, useState } from 'react';
import { fetchAPI } from '@/lib/api';

interface Promo {
  id: number;
  titulo: string;
  descripcion: string;
  dias_activos: string[];
}

interface Producto {
  id: number;
  nombre: string;
  descripcion: string | null;
  precio: number;
  imagen: string | null;
  destacado: boolean;
}

const DIAS_SEMANA = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];

const HERO_SLIDES = [
  {
    src: '/images/entrada_pop_horizontal.jpg',
    alt: 'Entrada del restaurante POP Perote, fachada iluminada con letras doradas',
  },
  {
    src: '/images/vista_general.jpg',
    alt: 'Vista general del interior de POP Perote, ambiente cálido y elegante',
  },
];

const WHATSAPP_PHONE = '522821278014';

function getOpenStatus(): { isOpen: boolean; label: string; colorClass: string; dotClass: string } {
  const now = new Date();
  const day = now.getDay();
  const hour = now.getHours();
  const minute = now.getMinutes();
  const time = hour + minute / 60;

  let openTime: number;
  let closeTime: number;

  if (day === 2) {
    return { isOpen: false, label: 'CERRADO', colorClass: 'text-red-500', dotClass: 'bg-red-500' };
  } else if (day === 1 || day === 3 || day === 4) {
    openTime = 14;
    closeTime = 21.5;
  } else if (day === 5 || day === 6) {
    openTime = 14;
    closeTime = 22;
  } else {
    // Sunday
    openTime = 14;
    closeTime = 21;
  }

  const isOpen = time >= openTime && time < closeTime;
  return {
    isOpen,
    label: isOpen ? 'ABIERTO AHORA' : 'CERRADO',
    colorClass: isOpen ? 'text-[#4CAF50]' : 'text-red-500',
    dotClass: isOpen ? 'bg-[#4CAF50]' : 'bg-red-500',
  };
}

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [openStatus, setOpenStatus] = useState<{ isOpen: boolean; label: string; colorClass: string; dotClass: string } | null>(null);
  const [promoHoy, setPromoHoy] = useState<Promo | null>(null);
  const [promoLoading, setPromoLoading] = useState(true);
  const [destacados, setDestacados] = useState<Producto[]>([]);
  const [destacadosLoading, setDestacadosLoading] = useState(true);
  const [destacadosError, setDestacadosError] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    setOpenStatus(getOpenStatus());
  }, []);

  useEffect(() => {
    const diaHoy = DIAS_SEMANA[new Date().getDay()];
    fetchAPI<{ data: Promo[] }>('/promociones')
      .then(({ data }) => {
        const activa = data.find((p) => p.dias_activos?.includes(diaHoy));
        setPromoHoy(activa || null);
      })
      .catch(() => setPromoHoy(null))
      .finally(() => setPromoLoading(false));
  }, []);

  useEffect(() => {
    fetchAPI<{ data: Producto[] }>('/menu')
      .then(({ data }) => {
        setDestacados(data.filter((p) => p.destacado).slice(0, 6));
      })
      .catch(() => setDestacadosError(true))
      .finally(() => setDestacadosLoading(false));
  }, []);

  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index);
  }, []);

  return (
    <>

      {/*  Navigation Shell (TopNavBar)  */}
      
      {/*  1.1 Hero Section  */}
      <header className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          {HERO_SLIDES.map((slide, index) => (
            <Image
              key={slide.src}
              alt={slide.alt}
              fill
              priority={index === 0}
              className={`object-cover transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
              src={slide.src}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-t from-[#732B1A]/70 via-[#234032]/50 to-[#234032]/30"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#234032]/40 to-transparent"></div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3">
          {HERO_SLIDES.map((_, index) => (
            <button
              key={index}
              aria-label={`Ir a imagen ${index + 1}`}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentSlide ? 'bg-[#F2C166] scale-110' : 'bg-white/30 hover:bg-white/60'}`}
              onClick={() => goToSlide(index)}
              type="button"
            />
          ))}
        </div>

        <div className="relative z-10 text-center px-4 max-w-5xl">
          <div className="mb-6 opacity-0 animate-[fade-in_1s_ease-out_forwards]">
            <span className="text-[#F2C166] font-black text-6xl md:text-9xl font-headline tracking-tighter block scale-110">POP</span>
          </div>
          <h1 className="text-on-surface font-headline font-black text-4xl md:text-7xl mb-4 tracking-tight leading-none uppercase">
            Pop Perote está <span className="text-[#F2C166]">riquísimo</span>
          </h1>
          <p className="text-on-surface font-body text-lg md:text-2xl font-light tracking-[0.3em] uppercase mb-10">
            Sushi · Alitas · Boneless · Crepas · Snacks
          </p>
          <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
            <a
              className="bg-[#D96E30] hover:shadow-[0_0_30px_rgba(217,103,37,0.4)] transition-all duration-300 transform hover:scale-105 text-white font-black py-4 px-10 text-lg rounded-sm flex items-center gap-3"
              href={`https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent('Hola POP Perote, quiero hacer un pedido')}`}
              rel="noreferrer"
              target="_blank"
            >
              🔥 HAZ TU PEDIDO AHORA
            </a>
            <a className="border-2 border-[#F2C166] text-[#F2C166] hover:bg-[#F2C166] hover:text-black transition-all duration-300 font-black py-4 px-10 text-lg rounded-sm" href="/menu">
              📍 VER MENÚ
            </a>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span className="text-[10px] tracking-widest font-bold text-[#F2C166]/60 uppercase">Discover</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-[#F2C166] to-transparent animate-pulse"></div>
        </div>
      </header>

      {/*  1.2 Featured Promo  */}
      <section className="relative py-8">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="bg-gradient-to-r from-[#732B1A] to-surface-container-low p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 group">
            {promoLoading ? (
              <div className="space-y-4 w-full animate-pulse">
                <div className="h-6 w-40 bg-white/10 rounded"></div>
                <div className="h-10 w-3/4 bg-white/10 rounded"></div>
                <div className="h-4 w-1/2 bg-white/10 rounded"></div>
              </div>
            ) : promoHoy ? (
              <>
                <div className="space-y-4 text-center md:text-left">
                  <span className="bg-[#F2C166] text-surface font-black text-[10px] px-3 py-1 inline-block animate-pulse tracking-widest">🔥 PROMO ACTIVA HOY</span>
                  <h2 className="text-secondary font-headline text-3xl md:text-5xl font-black">{promoHoy.titulo}</h2>
                  <p className="text-on-surface/70 font-body max-w-xl">{promoHoy.descripcion}</p>
                </div>
                <a className="bg-primary-container text-on-surface font-black px-10 py-5 group-hover:translate-x-2 transition-transform duration-500 flex items-center gap-3 whitespace-nowrap" href="/promociones">
                  VER ESTA PROMO <span className="material-symbols-outlined">arrow_forward</span>
                </a>
              </>
            ) : (
              <>
                <div className="space-y-4 text-center md:text-left">
                  <h2 className="text-secondary font-headline text-3xl md:text-5xl font-black">Siempre hay algo especial en POP</h2>
                  <p className="text-on-surface/70 font-body max-w-xl">Descubre todas nuestras promociones y ofertas exclusivas.</p>
                </div>
                <a className="bg-primary-container text-on-surface font-black px-10 py-5 group-hover:translate-x-2 transition-transform duration-500 flex items-center gap-3 whitespace-nowrap" href="/promociones">
                  VER PROMOCIONES <span className="material-symbols-outlined">arrow_forward</span>
                </a>
              </>
            )}
          </div>
        </div>
      </section>

      {/*  1.3 Visual Menu Categories  */}
      <section className="py-24 bg-surface">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <h3 className="text-[#F2C166] font-headline text-5xl font-black tracking-tighter uppercase mb-4">Nuestro Menú</h3>
            <div className="w-24 h-1 bg-[#D96E30] mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <a className="group relative aspect-[4/5] overflow-hidden bg-surface-container-low block" href="/menu">
              <Image fill className="object-cover transition-transform duration-700 group-hover:scale-110" alt="Sushi rollsPOP Perote" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD9kTHDsuiCabDHLAfJabzfToXl0cT3kjxv6nQEX_-4emjl_Kux7cXp8cLkrZFnUMtOEhe0G8ka-ZzS2hLukUzIv6PBjS5q866TQAQjoEGB9c2c4lDsi2RLCy46svcotEjwaEPVRrUYs_O3u3pqE1GPLZxSXxkhI67_VrWLVDzgUE4bho9aPUzM-jcOiqfTcHJp_GnTLfnlpcQ8lgnr87LZPx_D33ug3FUpYoUB7yn3jKRFnzaqQRIrMOMi3w6Mn-atgDSWBb7AVdY0" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
              <div className="absolute top-6 left-6">
                <span className="bg-primary text-on-primary font-black text-[10px] px-3 py-1">+40 ROLLOS</span>
              </div>
              <div className="absolute bottom-8 left-8 right-8">
                <h4 className="text-4xl font-headline font-black text-on-surface mb-2 tracking-tighter">🍣 SUSHI</h4>
                <div className="md:h-0 md:opacity-0 md:group-hover:h-auto md:group-hover:opacity-100 transition-all duration-500 overflow-hidden h-auto opacity-100">
                  <p className="text-on-surface/70 text-sm mb-4">Desde los clásicos hasta nuestras creaciones de autor más atrevidas.</p>
                  <span className="text-[#F2C166] font-black text-sm flex items-center gap-2">EXPLORAR <span className="material-symbols-outlined text-sm">add</span></span>
                </div>
              </div>
            </a>
            <a className="group relative aspect-[4/5] overflow-hidden bg-surface-container-low block" href="/menu">
              <Image fill className="object-cover transition-transform duration-700 group-hover:scale-110" alt="AlitasPOP Perote" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAmphbDn-VT8VJNw_NPHrq7A3Mzru80oPQhvGoPpdqOuXHx4daVcENbnRr4unk1Yva7rOy8nYgQs0K1k5cSdIndhdDrHlUZJRVNpi50vwledv5qtYAmF3kcimqsK82UMvkp9-uUhb_IY5gbSIxUGYNZnUKZHPzFOzyb7pGHOgxvjfEiY7XV-zo1vj88d7g113O3X0Tk2z-CRy5hWnuaG5fBnmO3kuXkKvQtTy4mlhbPUEkD-gii-uS-VHTJ33AhZZzPmGhks7vRdwTT" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
              <div className="absolute bottom-8 left-8 right-8">
                <h4 className="text-4xl font-headline font-black text-on-surface mb-2 tracking-tighter">🍗 ALITAS</h4>
                <div className="md:h-0 md:opacity-0 md:group-hover:h-auto md:group-hover:opacity-100 transition-all duration-500 overflow-hidden h-auto opacity-100">
                  <p className="text-on-surface/70 text-sm mb-4">El toque crujiente perfecto con nuestras salsas secretas.</p>
                  <span className="text-[#F2C166] font-black text-sm flex items-center gap-2">EXPLORAR <span className="material-symbols-outlined text-sm">add</span></span>
                </div>
              </div>
            </a>
            <a className="group relative aspect-[4/5] overflow-hidden bg-surface-container-low block" href="/menu">
              <Image fill className="object-cover transition-transform duration-700 group-hover:scale-110" alt="BonelessPOP Perote" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA6pmnnEyH_-sg9my2JV8Q1Irm2H-v8kJXmEk5v0SXTx5D11Mz3eVhu5ZhgPJ5_g5fcc-hVvkSpsDGDw9yFSgs0dtp0O5_JV1LeR0x5-l4pNTYJsif15JkrAyGIPI8vPCISf75wQh47q9YT6LvoSVUfePkuk3yicSph-7rOb78Coj4Re1J85HG5QbmYACkivpX5r8ihTH8Z67ZP28blo7PCuTyUt4v9xev1fhv5BolsBS6NEpdHmNFM8GtZQ6JlOaj4egzOHrhI0co8" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
              <div className="absolute bottom-8 left-8 right-8">
                <h4 className="text-4xl font-headline font-black text-on-surface mb-2 tracking-tighter">🔥 BONELESS</h4>
                <div className="md:h-0 md:opacity-0 md:group-hover:h-auto md:group-hover:opacity-100 transition-all duration-500 overflow-hidden h-auto opacity-100">
                  <p className="text-on-surface/70 text-sm mb-4">Pechuga de pollo seleccionada, empanizada al momento.</p>
                  <span className="text-[#F2C166] font-black text-sm flex items-center gap-2">EXPLORAR <span className="material-symbols-outlined text-sm">add</span></span>
                </div>
              </div>
            </a>
            <a className="group relative aspect-[4/5] overflow-hidden bg-surface-container-low block" href="/menu">
              <Image fill className="object-cover transition-transform duration-700 group-hover:scale-110" alt="CrepasPOP Perote" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAeJVETMzeX-9hOA-VDkzF8FOz7Hboj2-tY-vK2y9GaDY0_EB4dnwMJUGrMo6_Y3B9806TrqAx22FMN02BAGx5bbw2-_ag4KpuqBxWRGom9CYXECMzk9BSv9c9YpMBVSh4bXZ3JpXZ1ZbQYyNrW-fbTXN257VpNVHRObxY5ndmzYiQ4shaJDZjLhKPrEgVqKGhJiziCjrJlyloIfn_35wivdjygDOujHaec01868RI8QIBo0Kqv1D-pdfjqW8DEcGum_QYg5j2SPs2f" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
              <div className="absolute bottom-8 left-8 right-8">
                <h4 className="text-4xl font-headline font-black text-on-surface mb-2 tracking-tighter">🥞 CREPAS</h4>
                <div className="md:h-0 md:opacity-0 md:group-hover:h-auto md:group-hover:opacity-100 transition-all duration-500 overflow-hidden h-auto opacity-100">
                  <p className="text-on-surface/70 text-sm mb-4">Dulces o saladas, preparadas con nuestra receta tradicional.</p>
                  <span className="text-[#F2C166] font-black text-sm flex items-center gap-2">EXPLORAR <span className="material-symbols-outlined text-sm">add</span></span>
                </div>
              </div>
            </a>
            <a className="group relative aspect-[4/5] overflow-hidden bg-surface-container-low block" href="/menu">
              <Image fill className="object-cover transition-transform duration-700 group-hover:scale-110" alt="BebidasPOP Perote" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDhB15iQu03HIIqavgiNf-9AJv6EThSEyo_x7ctcEr7GuGU6qYABqtCnv5QOnr0MtG0ZjxCd5oImdefRYszY_OdKjfyj2_uSriKpe8V7a1mgYTO0nBZ-ALmwKxf83IJmFslkaRWKNN6K2U6_l8eGgbXMlULCjL5CoFTN5xn-LRB_f3tm3Lt6amoKoeWN_2JW2byO8Z6koivqzUuw5pXjWu99k61LyA_za_i7rStW_qFL8oX2GJkMdBekuJbhY5xzPBv40ozfr1TIsG2" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
              <div className="absolute bottom-8 left-8 right-8">
                <h4 className="text-4xl font-headline font-black text-on-surface mb-2 tracking-tighter">🍹 BEBIDAS</h4>
                <div className="md:h-0 md:opacity-0 md:group-hover:h-auto md:group-hover:opacity-100 transition-all duration-500 overflow-hidden h-auto opacity-100">
                  <p className="text-on-surface/70 text-sm mb-4">Coctelería, refrescos y nuestras mezclas especiales.</p>
                  <span className="text-[#F2C166] font-black text-sm flex items-center gap-2">EXPLORAR <span className="material-symbols-outlined text-sm">add</span></span>
                </div>
              </div>
            </a>
            <a className="group relative aspect-[4/5] overflow-hidden bg-surface-container-low block" href="/menu">
              <Image fill className="object-cover transition-transform duration-700 group-hover:scale-110" alt="SnacksPOP Perote" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCczlIB9qBBqo6f4pv2oprZrObXWF1SjYO8ucdsCJAk_UHGSAZm76b3BIGT2PDLPvZT8O9YntXBNUNL9mWtGBOGRbTuJnNjC6fWlAjnNugoBZim2BfjJRp58NSe4YcL4PscvoFwBHRCgPLz65q7GlwNd1-aaC7fdGDm9OfCDkwpBHhft9zzhBkaWsoAQNFV1z7B3Y9mz7rAvRcAVSZ4BYNLCMc0m2B71yx-ecAHV54nr6BNNC4SjI70kR7ylGA3cvv1tCSinL5G9roK" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
              <div className="absolute bottom-8 left-8 right-8">
                <h4 className="text-4xl font-headline font-black text-on-surface mb-2 tracking-tighter">🍿 SNACKS</h4>
                <div className="md:h-0 md:opacity-0 md:group-hover:h-auto md:group-hover:opacity-100 transition-all duration-500 overflow-hidden h-auto opacity-100">
                  <p className="text-on-surface/70 text-sm mb-4">Para picar y compartir con amigos.</p>
                  <span className="text-[#F2C166] font-black text-sm flex items-center gap-2">EXPLORAR <span className="material-symbols-outlined text-sm">add</span></span>
                </div>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/*  1.3b Productos Destacados  */}
      {!destacadosError && (destacadosLoading || destacados.length > 0) && (
        <section className="py-24 bg-surface">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="text-center mb-16">
              <h3 className="text-[#F2C166] font-headline text-5xl font-black tracking-tighter uppercase mb-4">Lo más pedido</h3>
              <div className="w-24 h-1 bg-[#D96E30] mx-auto"></div>
            </div>
            {destacadosLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-surface-container-low animate-pulse rounded-sm overflow-hidden">
                    <div className="aspect-square bg-white/5"></div>
                    <div className="p-4 space-y-3">
                      <div className="h-4 w-3/4 bg-white/10 rounded"></div>
                      <div className="h-3 w-full bg-white/10 rounded"></div>
                      <div className="h-5 w-1/3 bg-white/10 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex md:grid md:grid-cols-3 gap-6 overflow-x-auto pb-4 md:pb-0 snap-x snap-mandatory">
                {destacados.map((producto) => (
                  <div key={producto.id} className="min-w-[260px] md:min-w-0 snap-start bg-surface-container-low rounded-sm overflow-hidden border border-outline-variant/10">
                    <div className="relative aspect-square">
                      <img
                        src={producto.imagen || '/images/logopop.png'}
                        alt={producto.nombre}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-3 left-3 bg-[#F2C166] text-[#234032] font-black text-[10px] px-2 py-1 tracking-widest">DESTACADO</span>
                    </div>
                    <div className="p-4">
                      <h4 className="text-on-surface font-headline font-bold text-sm uppercase mb-1">{producto.nombre}</h4>
                      {producto.descripcion && (
                        <p className="text-on-surface/60 text-xs line-clamp-2 mb-2">{producto.descripcion}</p>
                      )}
                      <p className="text-[#F2C166] font-black text-lg">${producto.precio.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/*  1.4 POP Points Teaser  */}
      <section className="py-24 tonal-shift relative overflow-hidden">
        <div className="absolute inset-0 opacity-0 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
          <div className="text-center mb-16">
            <h3 className="text-[#F2C166] font-headline text-4xl md:text-6xl font-black tracking-tighter uppercase leading-none">Acumula Puntos.<br />Canjea Premios.</h3>
            <p className="text-on-surface/60 mt-6 max-w-2xl mx-auto font-body">Únete a nuestra comunidad y haz que cada bocado cuente. Sube de nivel y desbloquea beneficios exclusivos.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            <a className="glass p-6 text-center transform hover:-translate-y-2 transition-transform duration-500" href="/pop-points">
              <span className="material-symbols-outlined text-[#FFB693] text-5xl mb-4" style={{ fontVariationSettings: "'FILL' 1" }}>military_tech</span>
              <h5 className="text-on-surface font-headline font-bold text-xl mb-1 uppercase">Fan</h5>
              <p className="text-[10px] text-[#F2C166] tracking-widest font-black uppercase">Nivel 01</p>
            </a>
            <a className="glass p-6 text-center transform hover:-translate-y-2 transition-transform duration-500" href="/pop-points">
              <span className="material-symbols-outlined text-[#FFB693] text-5xl mb-4" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
              <h5 className="text-on-surface font-headline font-bold text-xl mb-1 uppercase">Lover</h5>
              <p className="text-[10px] text-[#F2C166] tracking-widest font-black uppercase">Nivel 02</p>
            </a>
            <a className="glass p-6 text-center border-2 border-[#F2C166]/40 transform hover:-translate-y-2 transition-transform duration-500" href="/pop-points">
              <span className="material-symbols-outlined text-[#F2C166] text-5xl mb-4" style={{ fontVariationSettings: "'FILL' 1" }}>workspace_premium</span>
              <h5 className="text-on-surface font-headline font-bold text-xl mb-1 uppercase">VIP</h5>
              <p className="text-[10px] text-[#F2C166] tracking-widest font-black uppercase">Nivel 03</p>
            </a>
            <a className="glass p-6 text-center transform hover:-translate-y-2 transition-transform duration-500" href="/pop-points">
              <span className="material-symbols-outlined text-[#D96E30] text-5xl mb-4" style={{ fontVariationSettings: "'FILL' 1" }}>diamond</span>
              <h5 className="text-on-surface font-headline font-bold text-xl mb-1 uppercase">Elite</h5>
              <p className="text-[10px] text-[#F2C166] tracking-widest font-black uppercase">Nivel 04</p>
            </a>
          </div>
          <div className="mt-16 text-center">
            <a className="bg-[#D96E30] text-white font-black px-12 py-5 rounded-sm hover:shadow-[0_10px_40px_rgba(217,103,37,0.3)] transition-all flex items-center gap-3 mx-auto" href="/registro">
              REGÍSTRATE GRATIS Y OBTÉN 50 PTS <span className="material-symbols-outlined">arrow_forward</span>
            </a>
          </div>
        </div>
      </section>

      {/*  1.5 Testimonials  */}
      <section className="py-24 bg-surface">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="mb-16">
            <h3 className="text-[#F2C166] font-headline text-4xl font-black uppercase tracking-tighter">Lo que dicen nuestros clientes</h3>
          </div>

          {/* Elfsight Google Reviews Widget */}
          <div className="elfsight-app-9d213329-3cfd-4047-ab84-2790abd5a5cd" data-elfsight-app-lazy />

          <div className="text-center mt-12">
            <a href="https://maps.app.goo.gl/DHXbVv4zebSWr4uS9" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-[#F2C166] font-black text-sm uppercase tracking-widest hover:underline">
              Deja tu reseña en Google <span className="material-symbols-outlined">open_in_new</span>
            </a>
          </div>
        </div>
      </section>

      {/*  1.6 Location & Hours  */}
      <section className="flex flex-col md:flex-row h-auto md:h-[600px] bg-surface-container-low border-t border-[#F2C166]/10">
        <div className="w-full md:w-1/2 h-[400px] md:h-full overflow-hidden relative">
          <Image fill className="object-cover" alt="Entrada del restaurante POP Perote" src="/images/entrada_vertical.jpg" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#234032]/30 hidden md:block"></div>
        </div>
        <div className="w-full md:w-1/2 p-12 md:p-24 flex flex-col justify-center">
          {openStatus && (
            <div className={`inline-flex items-center gap-2 mb-6 ${openStatus.colorClass}`}>
              <div className={`w-2 h-2 rounded-full ${openStatus.dotClass} ${openStatus.isOpen ? 'animate-ping' : ''}`}></div>
              <span className="text-[10px] font-black tracking-widest uppercase">{openStatus.label}</span>
            </div>
          )}
          <h3 className="text-[#F2C166] font-headline text-4xl md:text-5xl font-black uppercase mb-8">Encuéntranos</h3>
          <div className="space-y-8 mb-12">
            <div className="flex items-start gap-4">
              <span className="material-symbols-outlined text-[#F2C166]">location_on</span>
              <div>
                <p className="text-on-surface font-bold text-lg mb-1">Justo Sierra No. 11</p>
                <p className="text-on-surface/50">Col. Amado Nervo, Perote, Veracruz</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <span className="material-symbols-outlined text-[#F2C166]">schedule</span>
              <div>
                <p className="text-on-surface font-bold text-lg mb-1">Horarios</p>
                <p className="text-on-surface/50">Lun, Mié-Jue: 14:00 - 21:30</p>
                <p className="text-on-surface/50">Vie-Sáb: 14:00 - 22:00</p>
                <p className="text-on-surface/50">Dom: 14:00 - 21:00</p>
                <p className="text-on-surface/50">Mar: Cerrado</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <a href="/ubicacion" className="bg-primary text-on-primary font-black px-8 py-4 text-sm flex items-center justify-center gap-3 w-max">
              📍 CÓMO LLEGAR
            </a>
            <a
              className="border border-[#F2C166]/30 text-[#F2C166] font-black px-8 py-4 text-sm flex items-center justify-center gap-3 hover:bg-[#F2C166]/10 transition-colors"
              href={`https://wa.me/${WHATSAPP_PHONE}`}
              rel="noreferrer"
              target="_blank"
            >
              💬 WHATSAPP
            </a>
          </div>
        </div>
      </section>
      {/*  Footer  */}
      
      {/*  Mobile Navigation Shell (BottomNavBar)  */}
      

    </>
  );
}