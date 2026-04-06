/* eslint-disable @next/next/no-img-element */
import React from 'react';

export default function Menu() {
  return (
    <>
      
{/*  Custom Cursor  */}
<div className="custom-cursor hidden md:block"></div>
{/*  Top Navigation (JSON: TopNavBar large)  */}

<main className="pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto">
{/*  Header Section  */}
<header className="mb-16 relative">
<div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
<div className="max-w-2xl">
<h1 className="font-headline text-5xl md:text-7xl font-black text-secondary tracking-tighter mb-4 leading-[0.9]">NUESTRO MENÚ</h1>
<p className="font-body text-xl text-on-surface-variant max-w-md">Más de 40 rollos, 10 salsas de alitas y mucho más de nuestra cocina editorial.</p>
</div>
<div className="w-full md:w-96">
<div className="relative group">
<span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-secondary group-focus-within:text-primary transition-colors">search</span>
<input className="w-full bg-surface-container-low border-none border-b border-outline-variant focus:border-secondary focus:ring-0 text-on-surface py-4 pl-12 pr-4 transition-all" placeholder="Buscar platillo..." type="text"/>
</div>
</div>
</div>
{/*  Fast Filters  */}
<div className="flex flex-wrap gap-3 mt-10">
<button className="px-5 py-1.5 rounded-full border border-secondary text-secondary font-headline font-bold text-xs uppercase tracking-widest hover:bg-secondary/10 transition-all">Todo</button>
<button className="px-5 py-1.5 rounded-full border border-outline-variant text-on-surface-variant font-headline font-bold text-xs uppercase tracking-widest hover:border-secondary transition-all">Más Vendidos</button>
<button className="px-5 py-1.5 rounded-full border border-outline-variant text-on-surface-variant font-headline font-bold text-xs uppercase tracking-widest hover:border-secondary transition-all">Nuevos</button>
<button className="px-5 py-1.5 rounded-full border border-outline-variant text-on-surface-variant font-headline font-bold text-xs uppercase tracking-widest hover:border-secondary transition-all">Vegano</button>
<button className="px-5 py-1.5 rounded-full border border-outline-variant text-on-surface-variant font-headline font-bold text-xs uppercase tracking-widest hover:border-secondary transition-all">Picante</button>
<button className="px-5 py-1.5 rounded-full border border-outline-variant text-on-surface-variant font-headline font-bold text-xs uppercase tracking-widest hover:border-secondary transition-all">Promociones</button>
</div>
</header>
{/*  Category Navigation (Sticky)  */}
<div className="sticky top-[88px] z-40 bg-surface/80 backdrop-blur-md -mx-6 md:-mx-12 px-6 md:px-12 py-4 mb-12 border-b border-outline-variant/10">
<div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
<a className="flex-shrink-0 bg-primary-container text-white px-8 py-3 font-headline font-black uppercase text-sm tracking-widest" href="#sushi">Sushi</a>
<a className="flex-shrink-0 border border-secondary text-secondary px-8 py-3 font-headline font-black uppercase text-sm tracking-widest hover:bg-secondary/5" href="#alitas">Alitas</a>
<a className="flex-shrink-0 border border-secondary text-secondary px-8 py-3 font-headline font-black uppercase text-sm tracking-widest hover:bg-secondary/5" href="#boneless">Boneless</a>
<a className="flex-shrink-0 border border-secondary text-secondary px-8 py-3 font-headline font-black uppercase text-sm tracking-widest hover:bg-secondary/5" href="#crepas">Crepas</a>
<a className="flex-shrink-0 border border-secondary text-secondary px-8 py-3 font-headline font-black uppercase text-sm tracking-widest hover:bg-secondary/5" href="#bebidas">Bebidas</a>
<a className="flex-shrink-0 border border-secondary text-secondary px-8 py-3 font-headline font-black uppercase text-sm tracking-widest hover:bg-secondary/5" href="#snacks">Snacks</a>
</div>
</div>
{/*  Product Grid: Sushi Section  */}
<section className="mb-24" id="sushi">
<div className="flex items-center gap-4 mb-10">
<h2 className="font-headline text-3xl font-black text-on-surface uppercase tracking-tighter">Sushi Selection</h2>
<div className="h-[1px] flex-grow bg-outline-variant/30"></div>
</div>
<div className="grid grid-cols-3 md:grid-cols-5 gap-4 md:gap-6">
{/*  Card 1  */}
<div className="group relative bg-surface-container-low overflow-hidden transition-all duration-500 hover:-translate-y-2">
<div className="aspect-[4/3] overflow-hidden relative">
<img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" data-alt="Close-up of premium dragon sushi roll with avocado slices and eel sauce on a dark ceramic plate with soft lighting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAw99bPGjenPMgJE54EGOTsqB0kHQp7M0KNhDsaQzzOqrqgdksUdKIIr7_RfYxlY5Li8hq6G8OIqy_48yIyus8yVtoNIjoSoocy0cmN1UWmIqyt6_U_UU0BeBLdcTdLbXbbmDk3jHWpUbkqo1E9nG8JrDSvuJ3XVAWCe4Q9rwaV5Et1MSi1DgLr6l2mPHE-iY9C1mntdARE7SdKTjspOR35r37bVqPmUivPehtdmeP4HtIC-iq-B1nP_oH3gft_fLO6NwTOOwNXv3yi"/>
<div className="absolute top-4 left-4 bg-primary-container text-white text-[10px] font-black px-3 py-1 tracking-widest uppercase">⭐ MÁS VENDIDO</div>
{/*  Description Overlay  */}
<div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-center px-8 text-center">
<p className="text-on-surface font-body text-sm leading-relaxed">Combinación perfecta de camarón tempura, queso crema y tope de aguacate fresco.</p>
</div>
</div>
<div className="p-6">
<div className="flex justify-between items-start mb-2">
<h3 className="font-headline font-bold text-lg text-on-surface uppercase leading-tight">Dragon Roll Especial</h3>
<div className="flex text-secondary scale-75 origin-right">
<span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
<span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
<span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
<span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
<span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
</div>
</div>
<div className="flex justify-between items-center mt-6">
<span className="font-headline font-black text-2xl text-secondary tabular-nums">$185.00</span>
<button className="bg-primary-container hover:bg-secondary text-white px-5 py-2 font-headline font-black text-xs uppercase tracking-widest transition-all active:scale-95">AGREGAR</button>
</div>
</div>
</div>
{/*  Card 2  */}
<div className="group relative bg-surface-container-low overflow-hidden transition-all duration-500 hover:-translate-y-2">
<div className="aspect-[4/3] overflow-hidden relative">
<img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" data-alt="Artistic arrangement of salmon nigiri on black stone plate with microgreens and soy sauce droplet" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCj-M-WflJSH5JzNa11ftmutnSrmcxC5LG0FatztkCD6yS4D1cf8CeKTH01Nzqlv4q3e3ALTT-EauL18I4L3CnyQdTNxxaX9BkqTbEDIXyzACanONrDDlozOexg9W8TmVVTLpfG50Uo1trhEi680sIMqXg25StDsrme6YyxuH-25FcrggDbH94FMhZ9I19aqs8bVUaAJ6vYGeCd7K35tMZZo3zhtsUv0Nh-xFo-d_1R5A5jGR2B1OpeKX0FuE0-ArSL33xwwu-elUsY"/>
<div className="absolute top-4 left-4 bg-primary-container text-white text-[10px] font-black px-3 py-1 tracking-widest uppercase">🆕 NUEVO</div>
<div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-center px-8 text-center">
<p className="text-on-surface font-body text-sm leading-relaxed">Salmón fresco de grado sashimi con un toque de aceite de trufa blanca.</p>
</div>
</div>
<div className="p-6">
<div className="flex justify-between items-start mb-2">
<h3 className="font-headline font-bold text-lg text-on-surface uppercase leading-tight">Salmon Truffle</h3>
<div className="flex text-secondary scale-75 origin-right">
<span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
<span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
<span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
<span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
<span className="material-symbols-outlined">star</span>
</div>
</div>
<div className="flex justify-between items-center mt-6">
<span className="font-headline font-black text-2xl text-secondary tabular-nums">$210.00</span>
<button className="bg-primary-container hover:bg-secondary text-white px-5 py-2 font-headline font-black text-xs uppercase tracking-widest transition-all active:scale-95">AGREGAR</button>
</div>
</div>
</div>
{/*  Card 3  */}
<div className="group relative bg-surface-container-low overflow-hidden transition-all duration-500 hover:-translate-y-2">
<div className="aspect-[4/3] overflow-hidden relative">
<img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" data-alt="Crispy tempura rolls drizzled with spicy mayo and topped with crispy onions on a wooden board" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBc929czbNNYOepQ756qcdeBycJUw-E_Lb0bWspcp4i58z1b2aoeP00MAsrwHZioWgROABNrO3edkzxWAKQE4PfkjlWBUtGz6BBICvlkYA_CuJ6aaKDfH6YlSXQxSK-o2uV1XjJTlD9Q2U01ihFqKjEcyRxc-gQR_Pdg2IHCpLKgiAocx8sEvxukbgvwwCh-Odi8BRnAxXtB_PgNPvPqYsxYimXBmxLyIJ3Bnm--rbdJqe5o0Tnt-bcq_6IOCPBbrUcBPitgdgFjJYU"/>
<div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-center px-8 text-center">
<p className="text-on-surface font-body text-sm leading-relaxed">Crunchy tempura shrimp mixed with spicy tuna and sriracha emulsion.</p>
</div>
</div>
<div className="p-6">
<div className="flex justify-between items-start mb-2">
<h3 className="font-headline font-bold text-lg text-on-surface uppercase leading-tight">Spicy Crunchy</h3>
<div className="flex text-secondary scale-75 origin-right">
<span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
<span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
<span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
<span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
<span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
</div>
</div>
<div className="flex justify-between items-center mt-6">
<span className="font-headline font-black text-2xl text-secondary tabular-nums">$175.00</span>
<button className="bg-primary-container hover:bg-secondary text-white px-5 py-2 font-headline font-black text-xs uppercase tracking-widest transition-all active:scale-95">AGREGAR</button>
</div>
</div>
</div>
{/*  Card 4  */}
<div className="group relative bg-surface-container-low overflow-hidden transition-all duration-500 hover:-translate-y-2">
<div className="aspect-[4/3] overflow-hidden relative">
<img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" data-alt="California roll with fresh crab and cucumber topped with sesame seeds on a dark textured background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBqbhb59WqUoZCO4TEijkEk2wx5EysV23-ZYdS9JeR1jjJKZhHxO3M436eKRmKMmTwkJky5YxOcFdoT5X7Elo8WrcN_4p7iHQHrzwiepBeAhGqIP1P4qODfDyGQomBSZdYG9l51cBSx2NgmnFLecGyB6VE8E1nuG-kSSbx1_Ucuf1EB4JocR99276GMBxShw8WY1jhGKvzXIfpTyl0-nYuJ9ZER9OY15nlvPuken5BzWnV7ZLFm1LBYnrSkAXMnQUb3lvoz79Av7Zxt"/>
<div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-center px-8 text-center">
<p className="text-on-surface font-body text-sm leading-relaxed">Un clásico reinventado con cangrejo real, pepino y masago de alta calidad.</p>
</div>
</div>
<div className="p-6">
<div className="flex justify-between items-start mb-2">
<h3 className="font-headline font-bold text-lg text-on-surface uppercase leading-tight">Cali Premium</h3>
<div className="flex text-secondary scale-75 origin-right">
<span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
<span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
<span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
<span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
<span className="material-symbols-outlined">star</span>
</div>
</div>
<div className="flex justify-between items-center mt-6">
<span className="font-headline font-black text-2xl text-secondary tabular-nums">$140.00</span>
<button className="bg-primary-container hover:bg-secondary text-white px-5 py-2 font-headline font-black text-xs uppercase tracking-widest transition-all active:scale-95">AGREGAR</button>
</div>
</div>
</div>
</div>
</section>
{/*  Product Grid: Alitas Section  */}
<section className="mb-24" id="alitas">
<div className="flex items-center gap-4 mb-10">
<h2 className="font-headline text-3xl font-black text-on-surface uppercase tracking-tighter">Wings &amp; Flavors</h2>
<div className="h-[1px] flex-grow bg-outline-variant/30"></div>
</div>
<div className="grid grid-cols-3 md:grid-cols-5 gap-4 md:gap-6">
{/*  Card 5  */}
<div className="group relative bg-surface-container-low overflow-hidden transition-all duration-500 hover:-translate-y-2">
<div className="aspect-[4/3] overflow-hidden relative">
<img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" data-alt="Glazed buffalo chicken wings on a rustic metal tray with blue cheese dip and celery sticks" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCA1kt-acSuZCmGgwfSor7Mo9vbLzg1g1U67rBPysr6fC3APZABWcHDa9M5dtp5HPys2GpIXQUzbeJJkk5fRu4HZfouHPRnjqxeli9kl5_EE2IXyG6ggDozR3s-9T7ddY-OGnEq3MdtwfRx-dvlLLOL0axPGZZQLuCscHReByYXNp_Y5ZHmj9Xf2wEz3NZ1_iDMAXcq9z4-Ym-wonb2xxgtMe6pQcqXUf03WGwoCkG9z6B4A8H_4Qs-PB1fXZHmsdr6V2zYzAPHy6-x"/>
<div className="absolute top-4 left-4 bg-primary-container text-white text-[10px] font-black px-3 py-1 tracking-widest uppercase">🔥 PICANTE</div>
<div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-center px-8 text-center">
<p className="text-on-surface font-body text-sm leading-relaxed">Nuestra salsa secreta extra picante con habanero tatemado y cítricos.</p>
</div>
</div>
<div className="p-6">
<div className="flex justify-between items-start mb-2">
<h3 className="font-headline font-bold text-lg text-on-surface uppercase leading-tight">Atomic Habanero</h3>
<div className="flex text-secondary scale-75 origin-right">
<span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
<span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
<span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
<span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
<span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
</div>
</div>
<div className="flex justify-between items-center mt-6">
<span className="font-headline font-black text-2xl text-secondary tabular-nums">$165.00</span>
<button className="bg-primary-container hover:bg-secondary text-white px-5 py-2 font-headline font-black text-xs uppercase tracking-widest transition-all active:scale-95">AGREGAR</button>
</div>
</div>
</div>
{/*  Card 6  */}
<div className="group relative bg-surface-container-low overflow-hidden transition-all duration-500 hover:-translate-y-2">
<div className="aspect-[4/3] overflow-hidden relative">
<img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" data-alt="Sticky honey garlic chicken wings sprinkled with sesame seeds on a black plate" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCHnHMU83s0anu5KcwhChuVo1l714z6sJCORBRiYBttW3CA_kJFtVZtNtFiiZS4rSTy6sQmpb3C1LlsdHakTV9wQ5zLSDyzmKWMPbDtFppbFAM7CgsSDhV5M-jLzkuz0B-pM9ho78tTiJR8f0IaOW0x9yoKreCdOrRJs-fqJezjTeilCTJPsJq7jT4w1uXeYWfaSbu4EsbOsAKvCDV6QM8ulVdDND-EEm9VTIZBcJoIYYEbZsnMLN2k4QNkwh7uxOtn4wHPeE93jtjh"/>
<div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-center px-8 text-center">
<p className="text-on-surface font-body text-sm leading-relaxed">Glaseado dulce de miel orgánica y ajo rostizado lentamente.</p>
</div>
</div>
<div className="p-6">
<div className="flex justify-between items-start mb-2">
<h3 className="font-headline font-bold text-lg text-on-surface uppercase leading-tight">Honey Roasted Garlic</h3>
<div className="flex text-secondary scale-75 origin-right">
<span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
<span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
<span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
<span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
<span className="material-symbols-outlined">star</span>
</div>
</div>
<div className="flex justify-between items-center mt-6">
<span className="font-headline font-black text-2xl text-secondary tabular-nums">$155.00</span>
<button className="bg-primary-container hover:bg-secondary text-white px-5 py-2 font-headline font-black text-xs uppercase tracking-widest transition-all active:scale-95">AGREGAR</button>
</div>
</div>
</div>
</div>
</section>
</main>
{/*  Floating Order Button  */}
<div className="fixed bottom-8 right-8 z-[60]">
<button className="bg-primary-container text-white p-6 rounded-full shadow-[0_0_40px_rgba(217,103,37,0.3)] hover:bg-secondary transition-all flex items-center gap-4 group">
<div className="relative">
<span className="material-symbols-outlined text-3xl">shopping_cart</span>
<span className="absolute -top-2 -right-2 bg-white text-primary-container font-black text-[10px] w-5 h-5 flex items-center justify-center rounded-full">3</span>
</div>
<div className="flex flex-col items-start pr-2">
<span className="font-headline font-black text-sm tracking-widest leading-none">PEDIDO</span>
<span className="font-headline font-bold text-xs opacity-80 tabular-nums">$550.00</span>
</div>
</button>
</div>
{/*  Bottom Nav (Mobile Only)  */}

{/*  Footer (JSON: Footer)  */}


    </>
  );
}
