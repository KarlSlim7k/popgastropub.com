/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useEffect, useRef } from 'react';

export default function Home() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    const move = (e: MouseEvent) => {
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;
    };

    const grow = () => {
      cursor.style.transform = 'translate(-50%, -50%) scale(1.8)';
      cursor.style.borderColor = '#D96725';
      cursor.style.background = 'rgba(217,103,37,0.08)';
    };

    const shrink = () => {
      cursor.style.transform = 'translate(-50%, -50%) scale(1)';
      cursor.style.borderColor = '#EBC071';
      cursor.style.background = 'transparent';
    };

    window.addEventListener('mousemove', move);

    const hoverTargets = document.querySelectorAll('a, button, [role="button"], input, .group');
    hoverTargets.forEach((el) => {
      el.addEventListener('mouseenter', grow);
      el.addEventListener('mouseleave', shrink);
    });

    return () => {
      window.removeEventListener('mousemove', move);
      hoverTargets.forEach((el) => {
        el.removeEventListener('mouseenter', grow);
        el.removeEventListener('mouseleave', shrink);
      });
    };
  }, []);

  return (
    <>

      {/*  Custom Cursor  */}
      <div className="custom-cursor hidden md:block" ref={cursorRef}></div>

      {/*  Navigation Shell (TopNavBar)  */}
      
      {/*  1.1 Hero Section  */}
      <header className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        {/*  Background Video Placeholder  */}
        <div className="absolute inset-0 z-0">
          <img className="w-full h-full object-cover grayscale-[0.2]" data-alt="cinematic close-up of a chef rolling sushi with precision, warm ambient lighting, steam rising, high-end restaurant atmosphere" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBi5RzM8ZCWVFKRIiczwPBuO9rvPuPDOcHs3JIMpgWkW1moRLz4My-m35wzBTf771GnWqKruSPuI1ODDyGqiGjQi9mEFsHY5maB1ASpQc_n_oozDcCvGB3dCxQq4QGDoPajM2p-AdVY1_Ose7P-o4iYNtWc0AsTyyrJiuEuFCsv0z81Yf82q5MQMofFohYTnBlePMl3RMABEZJtNSC3x1BMAPk87n6uRWHWA-C11RRz-q67d1TCuBtzmxqHiNLRNhquPIPjGJrPPOtv" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#732817]/60 via-surface/40 to-transparent"></div>
        </div>
        <div className="relative z-10 text-center px-4 max-w-5xl">
          <div className="mb-6 opacity-0 animate-[fade-in_1s_ease-out_forwards]">
            <span className="text-[#EBC071] font-black text-6xl md:text-9xl font-headline tracking-tighter block scale-110">POP</span>
          </div>
          <h1 className="text-on-surface font-headline font-black text-4xl md:text-7xl mb-4 tracking-tight leading-none uppercase">
            Pop Perote está <span className="text-[#EBC071]">riquísimo</span>
          </h1>
          <p className="text-on-surface font-body text-lg md:text-2xl font-light tracking-[0.3em] uppercase mb-10">
            Sushi · Alitas · Boneless · Crepas · Snacks
          </p>
          <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
            <button className="bg-[#D96725] hover:shadow-[0_0_30px_rgba(217,103,37,0.4)] transition-all duration-300 transform hover:scale-105 text-white font-black py-4 px-10 text-lg rounded-sm flex items-center gap-3">
              🔥 HAZ TU PEDIDO AHORA
            </button>
            <button className="border-2 border-[#EBC071] text-[#EBC071] hover:bg-[#EBC071] hover:text-black transition-all duration-300 font-black py-4 px-10 text-lg rounded-sm">
              📍 VER MENÚ
            </button>
          </div>
        </div>
        {/*  Scroll Indicator  */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span className="text-[10px] tracking-widest font-bold text-[#EBC071]/60 uppercase">Discover</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-[#EBC071] to-transparent animate-pulse"></div>
        </div>
      </header>
      {/*  1.2 Featured Promo  */}
      <section className="relative py-8">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="bg-gradient-to-r from-[#732817] to-surface-container-low p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 group">
            <div className="space-y-4 text-center md:text-left">
              <span className="bg-[#EBC071] text-surface font-black text-[10px] px-3 py-1 inline-block animate-pulse tracking-widest">🔥 PROMO ACTIVA</span>
              <h2 className="text-secondary font-headline text-3xl md:text-5xl font-black">Sushiércoles - 2x1 en Rollos Seleccionados</h2>
              <p className="text-on-surface/70 font-body max-w-xl">Aprovecha todos los miércoles nuestra promoción estrella. El mejor sushi de Perote al doble de sabor.</p>
            </div>
            <a className="bg-primary-container text-on-surface font-black px-10 py-5 group-hover:translate-x-2 transition-transform duration-500 flex items-center gap-3 whitespace-nowrap" href="#">
              VER ESTA PROMO <span className="material-symbols-outlined">arrow_forward</span>
            </a>
          </div>
        </div>
      </section>
      {/*  1.3 Visual Menu Categories  */}
      <section className="py-24 bg-surface">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <h3 className="text-[#EBC071] font-headline text-5xl font-black tracking-tighter uppercase mb-4">Nuestro Menú</h3>
            <div className="w-24 h-1 bg-[#D96725] mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/*  Card 1: Sushi  */}
            <div className="group relative aspect-[4/5] overflow-hidden bg-surface-container-low">
              <img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" data-alt="luxury platter of assorted sushi rolls, nigiri, and sashimi, dark slate background, dramatic lighting, gold flakes" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD9kTHDsuiCabDHLAfJabzfToXl0cT3kjxv6nQEX_-4emjl_Kux7cXp8cLkrZFnUMtOEhe0G8ka-ZzS2hLukUzIv6PBjS5q866TQAQjoEGB9c2c4lDsi2RLCy46svcotEjwaEPVRrUYs_O3u3pqE1GPLZxSXxkhI67_VrWLVDzgUE4bho9aPUzM-jcOiqfTcHJp_GnTLfnlpcQ8lgnr87LZPx_D33ug3FUpYoUB7yn3jKRFnzaqQRIrMOMi3w6Mn-atgDSWBb7AVdY0" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
              <div className="absolute top-6 left-6">
                <span className="bg-primary text-on-primary font-black text-[10px] px-3 py-1">+40 ROLLOS</span>
              </div>
              <div className="absolute bottom-8 left-8 right-8">
                <h4 className="text-4xl font-headline font-black text-on-surface mb-2 tracking-tighter">🍣 SUSHI</h4>
                <div className="h-0 opacity-0 group-hover:h-auto group-hover:opacity-100 transition-all duration-500 overflow-hidden">
                  <p className="text-on-surface/70 text-sm mb-4">Desde los clásicos hasta nuestras creaciones de autor más atrevidas.</p>
                  <button className="text-[#EBC071] font-black text-sm flex items-center gap-2">EXPLORAR <span className="material-symbols-outlined text-sm">add</span></button>
                </div>
              </div>
            </div>
            {/*  Card 2: Alitas  */}
            <div className="group relative aspect-[4/5] overflow-hidden bg-surface-container-low">
              <img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" data-alt="crispy golden chicken wings tossed in spicy buffalo sauce, blue cheese dip on the side, dark background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAmphbDn-VT8VJNw_NPHrq7A3Mzru80oPQhvGoPpdqOuXHx4daVcENbnRr4unk1Yva7rOy8nYgQs0K1k5cSdIndhdDrHlUZJRVNpi50vwledv5qtYAmF3kcimqsK82UMvkp9-uUhb_IY5gbSIxUGYNZnUKZHPzFOzyb7pGHOgxvjfEiY7XV-zo1vj88d7g113O3X0Tk2z-CRy5hWnuaG5fBnmO3kuXkKvQtTy4mlhbPUEkD-gii-uS-VHTJ33AhZZzPmGhks7vRdwTT" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
              <div className="absolute bottom-8 left-8 right-8">
                <h4 className="text-4xl font-headline font-black text-on-surface mb-2 tracking-tighter">🍗 ALITAS</h4>
                <div className="h-0 opacity-0 group-hover:h-auto group-hover:opacity-100 transition-all duration-500 overflow-hidden">
                  <p className="text-on-surface/70 text-sm mb-4">El toque crujiente perfecto con nuestras salsas secretas.</p>
                  <button className="text-[#EBC071] font-black text-sm flex items-center gap-2">EXPLORAR <span className="material-symbols-outlined text-sm">add</span></button>
                </div>
              </div>
            </div>
            {/*  Card 3: Boneless  */}
            <div className="group relative aspect-[4/5] overflow-hidden bg-surface-container-low">
              <img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" data-alt="tender chicken boneless bites glazed in barbecue sauce, garnished with sesame seeds, elegant presentation" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA6pmnnEyH_-sg9my2JV8Q1Irm2H-v8kJXmEk5v0SXTx5D11Mz3eVhu5ZhgPJ5_g5fcc-hVvkSpsDGDw9yFSgs0dtp0O5_JV1LeR0x5-l4pNTYJsif15JkrAyGIPI8vPCISf75wQh47q9YT6LvoSVUfePkuk3yicSph-7rOb78Coj4Re1J85HG5QbmYACkivpX5r8ihTH8Z67ZP28blo7PCuTyUt4v9xev1fhv5BolsBS6NEpdHmNFM8GtZQ6JlOaj4egzOHrhI0co8" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
              <div className="absolute bottom-8 left-8 right-8">
                <h4 className="text-4xl font-headline font-black text-on-surface mb-2 tracking-tighter">🔥 BONELESS</h4>
                <div className="h-0 opacity-0 group-hover:h-auto group-hover:opacity-100 transition-all duration-500 overflow-hidden">
                  <p className="text-on-surface/70 text-sm mb-4">Pechuga de pollo seleccionada, empanizada al momento.</p>
                  <button className="text-[#EBC071] font-black text-sm flex items-center gap-2">EXPLORAR <span className="material-symbols-outlined text-sm">add</span></button>
                </div>
              </div>
            </div>
            {/*  Card 4: Crepas  */}
            <div className="group relative aspect-[4/5] overflow-hidden bg-surface-container-low">
              <img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" data-alt="delicate sweet crepes filled with chocolate and strawberries, dusted with powdered sugar, dark mood" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAeJVETMzeX-9hOA-VDkzF8FOz7Hboj2-tY-vK2y9GaDY0_EB4dnwMJUGrMo6_Y3B9806TrqAx22FMN02BAGx5bbw2-_ag4KpuqBxWRGom9CYXECMzk9BSv9c9YpMBVSh4bXZ3JpXZ1ZbQYyNrW-fbTXN257VpNVHRObxY5ndmzYiQ4shaJDZjLhKPrEgVqKGhJiziCjrJlyloIfn_35wivdjygDOujHaec01868RI8QIBo0Kqv1D-pdfjqW8DEcGum_QYg5j2SPs2f" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
              <div className="absolute bottom-8 left-8 right-8">
                <h4 className="text-4xl font-headline font-black text-on-surface mb-2 tracking-tighter">🥞 CREPAS</h4>
                <div className="h-0 opacity-0 group-hover:h-auto group-hover:opacity-100 transition-all duration-500 overflow-hidden">
                  <p className="text-on-surface/70 text-sm mb-4">Dulces o saladas, preparadas con nuestra receta tradicional.</p>
                  <button className="text-[#EBC071] font-black text-sm flex items-center gap-2">EXPLORAR <span className="material-symbols-outlined text-sm">add</span></button>
                </div>
              </div>
            </div>
            {/*  Card 5: Bebidas  */}
            <div className="group relative aspect-[4/5] overflow-hidden bg-surface-container-low">
              <img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" data-alt="colorful craft cocktails with garnishes, ice cubes sparkling under spotlight, dark bar background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDhB15iQu03HIIqavgiNf-9AJv6EThSEyo_x7ctcEr7GuGU6qYABqtCnv5QOnr0MtG0ZjxCd5oImdefRYszY_OdKjfyj2_uSriKpe8V7a1mgYTO0nBZ-ALmwKxf83IJmFslkaRWKNN6K2U6_l8eGgbXMlULCjL5CoFTN5xn-LRB_f3tm3Lt6amoKoeWN_2JW2byO8Z6koivqzUuw5pXjWu99k61LyA_za_i7rStW_qFL8oX2GJkMdBekuJbhY5xzPBv40ozfr1TIsG2" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
              <div className="absolute bottom-8 left-8 right-8">
                <h4 className="text-4xl font-headline font-black text-on-surface mb-2 tracking-tighter">🍹 BEBIDAS</h4>
                <div className="h-0 opacity-0 group-hover:h-auto group-hover:opacity-100 transition-all duration-500 overflow-hidden">
                  <p className="text-on-surface/70 text-sm mb-4">Coctelería, refrescos y nuestras mezclas especiales.</p>
                  <button className="text-[#EBC071] font-black text-sm flex items-center gap-2">EXPLORAR <span className="material-symbols-outlined text-sm">add</span></button>
                </div>
              </div>
            </div>
            {/*  Card 6: Snacks  */}
            <div className="group relative aspect-[4/5] overflow-hidden bg-surface-container-low">
              <img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" data-alt="platter of assorted snacks including nachos, fries, and jalapeño poppers, dramatic food photography" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCczlIB9qBBqo6f4pv2oprZrObXWF1SjYO8ucdsCJAk_UHGSAZm76b3BIGT2PDLPvZT8O9YntXBNUNL9mWtGBOGRbTuJnNjC6fWlAjnNugoBZim2BfjJRp58NSe4YcL4PscvoFwBHRCgPLz65q7GlwNd1-aaC7fdGDm9OfCDkwpBHhft9zzhBkaWsoAQNFV1z7B3Y9mz7rAvRcAVSZ4BYNLCMc0m2B71yx-ecAHV54nr6BNNC4SjI70kR7ylGA3cvv1tCSinL5G9roK" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
              <div className="absolute bottom-8 left-8 right-8">
                <h4 className="text-4xl font-headline font-black text-on-surface mb-2 tracking-tighter">🍿 SNACKS</h4>
                <div className="h-0 opacity-0 group-hover:h-auto group-hover:opacity-100 transition-all duration-500 overflow-hidden">
                  <p className="text-on-surface/70 text-sm mb-4">Para picar y compartir con amigos.</p>
                  <button className="text-[#EBC071] font-black text-sm flex items-center gap-2">EXPLORAR <span className="material-symbols-outlined text-sm">add</span></button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/*  1.4 POP Points Teaser  */}
      <section className="py-24 tonal-shift relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuD2hmeimk38LN89FIqqBtxoAgiBvqUhE9sgEQE_CaEurxuIp6NipabWfwvGA1BOMiBrzQlU1WvnkAGzPkV7JBBYwT1_Y2lbhswGFiBr_V5L9AXxdKaRHFTQLCZSVSox8qltaQ3tDjQGQ1EO-kJ6wPb33fq14JhZzWtJFkFKTfIMa4oapD2mB5JRNj9S8eMPARWNmHRK5hFAxs50u_qmlH-zpm8TMCEFCnD1OQEiF3WLlxMFKKDbBI5RYLCtH5_nF_BH4QLC5_3iKLqc')" }}></div>
        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
          <div className="text-center mb-16">
            <h3 className="text-[#EBC071] font-headline text-4xl md:text-6xl font-black tracking-tighter uppercase leading-none">Acumula Puntos.<br />Canjea Premios.</h3>
            <p className="text-on-surface/60 mt-6 max-w-2xl mx-auto font-body">Únete a nuestra comunidad y haz que cada bocado cuente. Sube de nivel y desbloquea beneficios exclusivos.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {/*  Level Cards  */}
            <div className="glass p-6 text-center transform hover:-translate-y-2 transition-transform duration-500">
              <span className="material-symbols-outlined text-[#FFB693] text-5xl mb-4" style={{ fontVariationSettings: "'FILL' 1" }}>military_tech</span>
              <h5 className="text-on-surface font-headline font-bold text-xl mb-1 uppercase">Fan</h5>
              <p className="text-[10px] text-[#EBC071] tracking-widest font-black uppercase">Nivel 01</p>
            </div>
            <div className="glass p-6 text-center transform hover:-translate-y-2 transition-transform duration-500">
              <span className="material-symbols-outlined text-[#FFB693] text-5xl mb-4" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
              <h5 className="text-on-surface font-headline font-bold text-xl mb-1 uppercase">Lover</h5>
              <p className="text-[10px] text-[#EBC071] tracking-widest font-black uppercase">Nivel 02</p>
            </div>
            <div className="glass p-6 text-center border-2 border-[#EBC071]/40 transform hover:-translate-y-2 transition-transform duration-500">
              <span className="material-symbols-outlined text-[#EBC071] text-5xl mb-4" style={{ fontVariationSettings: "'FILL' 1" }}>workspace_premium</span>
              <h5 className="text-on-surface font-headline font-bold text-xl mb-1 uppercase">VIP</h5>
              <p className="text-[10px] text-[#EBC071] tracking-widest font-black uppercase">Nivel 03</p>
            </div>
            <div className="glass p-6 text-center transform hover:-translate-y-2 transition-transform duration-500">
              <span className="material-symbols-outlined text-[#D96725] text-5xl mb-4" style={{ fontVariationSettings: "'FILL' 1" }}>diamond</span>
              <h5 className="text-on-surface font-headline font-bold text-xl mb-1 uppercase">Elite</h5>
              <p className="text-[10px] text-[#EBC071] tracking-widest font-black uppercase">Nivel 04</p>
            </div>
          </div>
          <div className="mt-16 text-center">
            <button className="bg-[#D96725] text-white font-black px-12 py-5 rounded-sm hover:shadow-[0_10px_40px_rgba(217,103,37,0.3)] transition-all flex items-center gap-3 mx-auto">
              REGÍSTRATE GRATIS Y OBTÉN 50 PTS <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </div>
        </div>
      </section>
      {/*  1.5 Testimonials  */}
      <section className="py-24 bg-surface">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div>
              <h3 className="text-[#EBC071] font-headline text-4xl font-black uppercase tracking-tighter mb-2">Lo que dicen nuestros clientes</h3>
              <p className="text-on-surface/50 font-body">Basado en más de 1,200 reseñas reales.</p>
            </div>
            <div className="flex items-center gap-4 bg-surface-container-high px-6 py-3 rounded-sm border border-outline-variant/10">
              <img alt="Google Logo" className="w-6 h-6" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB_M7ZLydxa1eruvCDljLoqVBQ0t7xlUq0In9gp1Z_Z9TKr_ITzUvWXXWC5nTtVCOz-kLmaQL-qxWKM79gjHtzGf5vb-1OWwbrZAXvcdsp8OWeiBcECg7At6NAQPrx20Vf_kR7QCVvZur6P-b08Xpiiyehy2JhqYo9-0FELyjpYB2xx4qlVgbcT53jYIKwcQsvT96ki0AULJUdzUpRnb3AIyji4YO21g9Y5ZI0DTWv-IeLyAIgnUsvYTqb5-OM8YbtHA8J_l91x0sKx" />
              <div className="text-left">
                <p className="text-[10px] font-black tracking-widest text-[#EBC071]">EXCELENTE</p>
                <div className="flex text-[#EBC071] text-xs">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/*  Testimonial 1  */}
            <div className="surface-container p-8 relative">
              <span className="absolute top-4 right-8 text-6xl text-primary/10 font-black">“</span>
              <div className="flex items-center gap-4 mb-6">
                <img className="w-12 h-12 rounded-full object-cover grayscale" data-alt="portrait of a young woman smiling, editorial lifestyle photography" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBc6nI0OS5XX5sTvv7yr7Tn9PXzA_8moLQ4gD52so-5uHLIKCTtSccKBJvSwRzZaHC-OFvkxzwYUuz9KsVR7S_iti0SF6OouH7iIQr-Oz4ETpnCUaEJZ9lKjdaqURYwMZFTwS4dNKF3UeG0VRX625CJ0VlHx35JIgy0YpeXhUxzp_BAN3ZlUWsxll2R7AOwTbgARbxoYjiiueBtBSh7YZfIhobwLQdEdVMLnM4qbRU4ghJWM0EReUG8jTADcxgULx4LQ1ifv55AVZzE" />
                <div>
                  <p className="text-on-surface font-bold">Sofía Martínez</p>
                  <div className="flex text-[#EBC071] text-[10px]">
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  </div>
                </div>
              </div>
              <p className="text-on-surface/70 italic font-body text-sm leading-relaxed">"El mejor sushi que he probado en Perote. La frescura de los ingredientes se nota en cada bocado. ¡El ambiente es increíble!"</p>
            </div>
            {/*  Testimonial 2  */}
            <div className="surface-container p-8 relative">
              <span className="absolute top-4 right-8 text-6xl text-primary/10 font-black">“</span>
              <div className="flex items-center gap-4 mb-6">
                <img className="w-12 h-12 rounded-full object-cover grayscale" data-alt="portrait of a man with beard, cinematic lighting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBSxJFpqeMXI_-crak6XYBsj-MbSwDX7_smH9Xz84BoJoVkawHvy_ErmmitpKkDINIXcyLQWaP8GqxRi8RPlhMT_Xde25mcXzgszFFid6dQkOoFWKTMclqMGhHPM_yYcGqXxEXCXr1G16abnBerLA5HASDDTPT9grJPTAYEMF9D2lfp-plYCZN9c1zrUqzuEHyeKCQsaBz4D9V8ThYnEu5dxnwjQrh1usydvJwvpu5AqCRMg_HiuwDaxGUtYAqPg3BlCj4FQFeR3Jtq" />
                <div>
                  <p className="text-on-surface font-bold">Ricardo Luna</p>
                  <div className="flex text-[#EBC071] text-[10px]">
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  </div>
                </div>
              </div>
              <p className="text-on-surface/70 italic font-body text-sm leading-relaxed">"Las alitas tienen el punto exacto de picante. Un lugar perfecto para venir con amigos y disfrutar de buena música y comida."</p>
            </div>
            {/*  Testimonial 3  */}
            <div className="surface-container p-8 relative">
              <span className="absolute top-4 right-8 text-6xl text-primary/10 font-black">“</span>
              <div className="flex items-center gap-4 mb-6">
                <img className="w-12 h-12 rounded-full object-cover grayscale" data-alt="portrait of a woman, professional look, soft focus" src="https://lh3.googleusercontent.com/aida-public/AB6AXuATp7oVnPQXk-3eSC077-9XvaLRguhkjRnZ9g3lAmiJf_8ZNATdl4WMGV3eerRNZgUPHapOJmGRK-ULXqIMfTXsyz50Bpm7eL8cQ-htdnZH6IjBzBlZsoGEbOfnuYWN6PquwAy2cz36MHmTo-d5zW9Dl8SWH2NGFQfQV427vrPKRdRX_6RPxPvEOsOa8zCnPi_PbePAuzg1xE9ZvKJ8i2p_isS4IOlm6pqeBlaJckC1fbLDnSYoSkq5PBe5gziOpUQWolFLXEyFvdga" />
                <div>
                  <p className="text-on-surface font-bold">Elena Ruiz</p>
                  <div className="flex text-[#EBC071] text-[10px]">
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  </div>
                </div>
              </div>
              <p className="text-on-surface/70 italic font-body text-sm leading-relaxed">"¡Las crepas dulces son mi debilidad! Pop Perote nunca decepciona, la atención al detalle es impecable."</p>
            </div>
          </div>
        </div>
      </section>
      {/*  1.6 Location & Hours  */}
      <section className="flex flex-col md:flex-row h-auto md:h-[600px] bg-surface-container-low border-t border-[#F2C777]/10">
        <div className="w-full md:w-1/2 h-[400px] md:h-full grayscale contrast-125 opacity-80 hover:grayscale-0 transition-all duration-1000">
          <img className="w-full h-full object-cover" data-alt="stylized map showing the city of Perote with a luxury marker at the restaurant location, minimalist dark theme" data-location="Perote, Veracruz" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC7OWO8j8C1ufpAfLwwWfHFsqRNkrXvq5BmOwKR7yHHhLp__beEDcryG7BiI5AAK9q1JYSSlUbcPooZkuvCm9dtuNr9TVIT-T2oPQbB8gBK4dxIs--sYwljqGaaI24YGMI6NXGO_2YlcS5_8fx2RFfi4z90DP7oe4xKJ30N7iCobciTJ4kVhVrftMvQWVKUWkz-ZjaEySXphYUkD4tyUTqi2A6YQIIuRCwDIVidKr4GqK1AYKZ3bdVa0expOmC3zm_GZt2MIDGy-z9K" />
        </div>
        <div className="w-full md:w-1/2 p-12 md:p-24 flex flex-col justify-center">
          <div className="inline-flex items-center gap-2 mb-6 text-[#4CAF50]">
            <div className="w-2 h-2 rounded-full bg-[#4CAF50] animate-ping"></div>
            <span className="text-[10px] font-black tracking-widest uppercase">ABIERTO AHORA</span>
          </div>
          <h3 className="text-[#EBC071] font-headline text-4xl md:text-5xl font-black uppercase mb-8">Encuéntranos</h3>
          <div className="space-y-8 mb-12">
            <div className="flex items-start gap-4">
              <span className="material-symbols-outlined text-[#EBC071]">location_on</span>
              <div>
                <p className="text-on-surface font-bold text-lg mb-1">Justo Sierra No. 11</p>
                <p className="text-on-surface/50">Col. Amado Nervo, Perote, Veracruz</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <span className="material-symbols-outlined text-[#EBC071]">schedule</span>
              <div>
                <p className="text-on-surface font-bold text-lg mb-1">Lunes a Domingo</p>
                <p className="text-on-surface/50">13:00 PM - 22:30 PM</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <a href="/ubicacion" className="bg-primary text-on-primary font-black px-8 py-4 text-sm flex items-center justify-center gap-3 w-max">
              📍 CÓMO LLEGAR
            </a>
            <button className="border border-[#EBC071]/30 text-[#EBC071] font-black px-8 py-4 text-sm flex items-center justify-center gap-3 hover:bg-[#EBC071]/10 transition-colors">
              💬 WHATSAPP
            </button>
          </div>
        </div>
      </section>
      {/*  Footer  */}
      
      {/*  Mobile Navigation Shell (BottomNavBar)  */}
      

    </>
  );
}
