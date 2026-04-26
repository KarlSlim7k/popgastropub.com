/* eslint-disable @next/next/no-img-element */
import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Promociones | POP Perote',
  description: 'Descubre nuestras promociones activas: Sushiércoles 2x1, Cocktail Night y más.',
};

export default function Promociones() {
  return (
    <>
      
{/*  TopNavBar (Large)  */}

<main className="pt-24 pb-32">
{/*  Hero Section  */}
<section className="px-8 mb-20 max-w-7xl mx-auto">
<div className="mb-12">
<h1 className="text-6xl md:text-8xl font-black font-headline text-secondary tracking-tighter uppercase leading-[0.9]">
                    PROMOCIONES <span className="text-primary-container">🔥</span>
</h1>
<p className="text-xl md:text-2xl mt-4 text-on-surface-variant font-medium max-w-2xl">
                    Porque en POP siempre hay algo especial para ti.
                </p>
</div>
{/*  Main Hero Promo  */}
<div className="relative group overflow-hidden rounded-xl bg-surface-container-low min-h-[500px] flex flex-col md:flex-row editorial-shadow">
<div className="w-full md:w-3/5 relative overflow-hidden">
<img alt="Sushiércoles Main Promo" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" data-alt="Abundant gourmet sushi table with various colorful rolls, nigiri, and sashimi in a dark moody restaurant setting with dramatic spotlighting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBXBY731v-7Nn7MHlgXa4u8MBAsHUulWTp618HBXt70BfNhEH0ge0Ti8iRfwyD1OiFR9IIqzj3CfSt1PIqD8J3MubwQJnB8B4TYScekt6K9Q_ro83dVVoFnMynRR6Ug2JLgLATTKvgnfc4Tj7s4eAaxRZ1bJmTfI8p7Gqjg4IfdPR_i6oo5ktImWtoR4zavA3hfujDADeJyZrC8ZzjZ1vhdv5X0RvwPSAj4NFyxIMdqfQv4-Ep_K4E6LKvjVLpze7J8XCtSNrKng6_g"/>
<div className="absolute inset-0 bg-gradient-to-r from-surface-container-low via-transparent to-transparent"></div>
</div>
<div className="w-full md:w-2/5 p-12 flex flex-col justify-center relative z-10">
<div className="inline-flex items-center px-3 py-1 bg-primary-container/20 border border-primary-container/30 text-primary-container text-xs font-bold tracking-widest uppercase mb-6 w-fit">
<span className="material-symbols-outlined text-[14px] mr-2" data-icon="timer">timer</span> Disponible hoy
                    </div>
<h2 className="text-5xl md:text-6xl font-black font-headline text-on-surface leading-none mb-4">SUSHIÉRCOLES</h2>
<p className="text-lg text-on-surface-variant mb-8 leading-relaxed">
                        2x1 en rollos seleccionados todos los miércoles. Disfruta de la mejor calidad premium en un ambiente inigualable.
                    </p>
<button className="bg-[#D96725] text-on-primary font-headline font-bold py-5 px-10 rounded-sm tracking-widest text-sm transition-all duration-500 cubic-bezier(0.23, 1, 0.32, 1) hover:bg-primary-container hover:shadow-[0_0_30px_rgba(217,103,37,0.4)] hover:scale-[1.02] uppercase w-full md:w-fit">
                        APROVECHAR AHORA →
                    </button>
</div>
</div>
</section>
{/*  Weekly Calendar View  */}
<section className="px-8 mb-24 max-w-7xl mx-auto">
<h3 className="font-headline font-bold text-2xl mb-8 flex items-center uppercase tracking-widest">
<span className="w-8 h-[2px] bg-secondary mr-4"></span> Agenda Semanal
            </h3>
<div className="grid grid-cols-2 md:grid-cols-7 gap-4">
{/*  Day Card (Repeat 7 times with context)  */}
<div className="p-6 bg-surface-container rounded-lg transition-colors border border-transparent hover:border-outline-variant/30">
<span className="block text-xs font-bold text-on-surface-variant/60 uppercase tracking-tighter mb-1">Lun</span>
<span className="block text-2xl font-black font-headline text-on-surface-variant mb-3">12</span>
<div className="text-[10px] uppercase font-bold text-tertiary opacity-40">Sin Eventos</div>
</div>
<div className="p-6 bg-surface-container rounded-lg border border-transparent hover:border-outline-variant/30">
<span className="block text-xs font-bold text-on-surface-variant/60 uppercase tracking-tighter mb-1">Mar</span>
<span className="block text-2xl font-black font-headline text-on-surface-variant mb-3">13</span>
<div className="h-1.5 w-full bg-secondary-container/30 rounded-full"></div>
</div>
{/*  Today Highlighted  */}
<div className="p-6 bg-surface-container-high rounded-lg border-2 border-secondary shadow-[0_0_20px_rgba(235,192,113,0.15)] relative overflow-hidden">
<span className="block text-xs font-bold text-secondary uppercase tracking-tighter mb-1">Mié</span>
<span className="block text-2xl font-black font-headline text-secondary mb-3">14</span>
<div className="inline-flex items-center px-2 py-0.5 bg-secondary text-surface text-[9px] font-black uppercase rounded-[2px]">
                        Sushi 2x1
                    </div>
<div className="absolute top-0 right-0 p-2">
<div className="w-1.5 h-1.5 bg-secondary rounded-full animate-pulse"></div>
</div>
</div>
<div className="p-6 bg-surface-container rounded-lg border border-transparent hover:border-outline-variant/30">
<span className="block text-xs font-bold text-on-surface-variant/60 uppercase tracking-tighter mb-1">Jue</span>
<span className="block text-2xl font-black font-headline text-on-surface-variant mb-3">15</span>
<div className="h-1.5 w-full bg-primary-container/20 rounded-full"></div>
</div>
<div className="p-6 bg-surface-container rounded-lg border border-transparent hover:border-outline-variant/30">
<span className="block text-xs font-bold text-on-surface-variant/60 uppercase tracking-tighter mb-1">Vie</span>
<span className="block text-2xl font-black font-headline text-on-surface-variant mb-3">16</span>
<div className="inline-flex items-center px-2 py-0.5 bg-primary-container text-surface text-[9px] font-black uppercase rounded-[2px]">
                        Cocktail Night
                    </div>
</div>
<div className="p-6 bg-surface-container rounded-lg border border-transparent hover:border-outline-variant/30">
<span className="block text-xs font-bold text-on-surface-variant/60 uppercase tracking-tighter mb-1">Sáb</span>
<span className="block text-2xl font-black font-headline text-on-surface-variant mb-3">17</span>
<div className="h-1.5 w-full bg-primary-container/20 rounded-full"></div>
</div>
<div className="p-6 bg-surface-container rounded-lg border border-transparent hover:border-outline-variant/30">
<span className="block text-xs font-bold text-on-surface-variant/60 uppercase tracking-tighter mb-1">Dom</span>
<span className="block text-2xl font-black font-headline text-on-surface-variant mb-3">18</span>
<div className="inline-flex items-center px-2 py-0.5 bg-tertiary-container text-on-tertiary-container text-[9px] font-black uppercase rounded-[2px]">
                        Family Brunch
                    </div>
</div>
</div>
</section>
{/*  Active Promos Grid  */}
<section className="px-8 mb-24 max-w-7xl mx-auto">
<div className="flex justify-between items-end mb-10">
<h3 className="font-headline font-bold text-4xl uppercase tracking-tighter">Más Promociones</h3>
<div className="flex gap-2">
<button className="p-2 border border-outline-variant/30 hover:bg-surface-container-high transition-colors"><span className="material-symbols-outlined" data-icon="grid_view">grid_view</span></button>
<button className="p-2 border border-outline-variant/30 hover:bg-surface-container-high transition-colors opacity-50"><span className="material-symbols-outlined" data-icon="view_list">view_list</span></button>
</div>
</div>
<div className="grid grid-cols-1 md:grid-cols-3 gap-10">
{/*  Promo Card 1  */}
<div className="group flex flex-col bg-surface-container-low rounded-sm overflow-hidden border-b border-transparent hover:border-secondary transition-all duration-500">
<div className="relative h-64 overflow-hidden">
<img alt="Cocktail Night" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" data-alt="Sleek modern cocktails with vapor and garnish on a dark stone bar counter, moody lighting, magenta and blue highlights" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBRktN9JVqqgvwsZQtQ7i0tVhDAALFbQ1hEAe69z2P1ecpjJXGqNDrLxXHC2TK0_Cpo2_Dl0uD58TlzR2eGE72HLK8_eMxpSVG-Imd8ysD8h25ornEqyWeAYlURWi-YA7lqyitVKopBDSVu-GlXL5a13zenbNZxAShRrvMMK1DOyQGveRWLvgapXrun1lpm4cDw0Do9VaT_EX61zDydCg6n0mWuaGwuOyvXEPThelIJ6Mq74Z5kLpFc5mcLjJsfpM4kafPLaSCyaB5N"/>
<div className="absolute top-4 left-4">
<span className="bg-green-600 text-white text-[10px] font-black px-3 py-1 uppercase tracking-widest rounded-sm">ACTIVA</span>
</div>
</div>
<div className="p-8 flex-grow flex flex-col">
<h4 className="font-headline font-bold text-2xl mb-2 text-on-surface">COCKTAIL NIGHT</h4>
<p className="text-on-surface-variant text-sm mb-6 leading-relaxed">Todos los viernes de 19:00 a 22:00. Mixología de autor al 50% de descuento en la segunda unidad.</p>
<div className="mt-auto flex justify-between items-center pt-6 border-t border-outline-variant/20">
<div className="text-[10px] uppercase font-bold text-on-surface-variant/60 tracking-widest">Válido hasta: 31 Dic</div>
<button className="text-secondary font-headline font-bold text-xs uppercase tracking-widest hover:underline transition-all">VER DETALLES</button>
</div>
</div>
</div>
{/*  Promo Card 2  */}
<div className="group flex flex-col bg-surface-container-low rounded-sm overflow-hidden border-b border-transparent hover:border-secondary transition-all duration-500">
<div className="relative h-64 overflow-hidden">
<img alt="Family Brunch" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" data-alt="Elegant avocado toast and gourmet coffee on a marble table with soft morning sunlight casting long shadows" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCNPVlDnHLABtue1Y8vfqGy-6X1r7e3nxtjWqFct45jsImOSRSJy9E25O_kGdKPdTAfjtHBgbnYWWGCSZGBTQ6L8jYE-gMeuGftGIPeR3afnT393gihDX4FOQhwINcVn1ArVl7gFvWBvvBhMBnHwLjwI8YYT4AMwUPY3pWisbOptlp2LvWHeTU3eAS4hjdORy5gts9qGRU4IQnwG1NtqH1d-H1ZzFz060w5nRdoqd_TvDes1nb000BbBIelKqelT5e7prXD0LWQ9cuX"/>
<div className="absolute top-4 left-4">
<span className="bg-yellow-600 text-white text-[10px] font-black px-3 py-1 uppercase tracking-widest rounded-sm">PRÓXIMA</span>
</div>
</div>
<div className="p-8 flex-grow flex flex-col">
<h4 className="font-headline font-bold text-2xl mb-2 text-on-surface">FAMILY BRUNCH</h4>
<p className="text-on-surface-variant text-sm mb-6 leading-relaxed">Domingos de 10:00 a 14:00. Un menú degustación diseñado para compartir en familia con música en vivo.</p>
<div className="mt-auto flex justify-between items-center pt-6 border-t border-outline-variant/20">
<div className="text-[10px] uppercase font-bold text-on-surface-variant/60 tracking-widest">Inicia: 24 Nov</div>
<button className="text-secondary font-headline font-bold text-xs uppercase tracking-widest hover:underline transition-all">VER DETALLES</button>
</div>
</div>
</div>
{/*  Promo Card 3  */}
<div className="group flex flex-col bg-surface-container-low rounded-sm overflow-hidden border-b border-transparent hover:border-secondary transition-all duration-500">
<div className="relative h-64 overflow-hidden opacity-60">
<img alt="Burger Fest" className="w-full h-full object-cover grayscale" data-alt="Gourmet wagyu burger with melted cheese and artisanal toppings, studio lighting, dark background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAZWsYqjZLDBYbEU4jkpcGipSGNbauEV0xjVTG1lTpctil-8uReCu0lxhZYinKEt5lTNiOAAvNC1PSB8a5ZUHuVtHI9vJ0AJY8QxewxmXU07LumHf8k4E1xp4aKeUUqZ3GETZvF9aVMQYXF8-5P0QHm16_7ho7kTrBp_4qf-M1CDLqFZoRYW86AaESwfZl1MfU59lEGO8Hf7TmuRnlxda2bjGssOWsFjZ8QgOsVl-xzRZhbLcrM0EgUOEAZmN9OX5WFU7BG0l5NCCk8"/>
<div className="absolute top-4 left-4">
<span className="bg-gray-600 text-white text-[10px] font-black px-3 py-1 uppercase tracking-widest rounded-sm">EXPIRADA</span>
</div>
</div>
<div className="p-8 flex-grow flex flex-col grayscale">
<h4 className="font-headline font-bold text-2xl mb-2 text-on-surface">BURGER FEST</h4>
<p className="text-on-surface-variant text-sm mb-6 leading-relaxed">Nuestras hamburguesas de autor a un precio especial por tiempo limitado. Ediciones especiales.</p>
<div className="mt-auto flex justify-between items-center pt-6 border-t border-outline-variant/20">
<div className="text-[10px] uppercase font-bold text-on-surface-variant/60 tracking-widest">Finalizó: 10 Nov</div>
<button className="text-secondary font-headline font-bold text-xs uppercase tracking-widest hover:underline transition-all">VER DETALLES</button>
</div>
</div>
</div>
</div>
</section>
{/*  FOMO Section  */}
<section className="bg-surface-container-lowest py-24 overflow-hidden">
<div className="px-8 max-w-7xl mx-auto mb-12">
<h3 className="font-headline font-black text-4xl md:text-5xl uppercase tracking-tighter leading-none text-on-surface">
                    TE LO PERDISTE... <br/>
<span className="text-on-surface-variant/30">PERO VUELVE PRONTO</span>
</h3>
</div>
<div className="flex gap-8 overflow-x-auto px-8 pb-8 no-scrollbar">
{/*  Grayscale Carousel Item 1  */}
<div className="min-w-[300px] md:min-w-[450px] aspect-[4/5] relative rounded-sm overflow-hidden grayscale opacity-40 hover:opacity-100 hover:grayscale-0 transition-all duration-700 cursor-pointer group">
<img alt="Pizza Night" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" data-alt="Close up of artisan wood-fired pizza with bubbling cheese and fresh basil, high contrast editorial food photography" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD9webrhrSrtPOyK-thDnpZpX6q-oDgWw9M1ayC64Xu7-JxeqJpD5PyjtESV1HPYr0FfGugVy9eGPk9F5noozW9dldpc5ylTjt7SOp2y23HvY8nEtYIu0FZ3TF90XukoBoAfKF6yRCBfB86eUFhZPxXVi0u7mzHLBHpCCwPH8D3CMtw18czSQdSVL0VJwnzxDTCwhofl0se4rudXU7dAF0rdG0rUBIoOWAz1gkh6k5mZgIYg8b-1uOFOii9PAiV9Kx_kbB3gItdEy6V"/>
<div className="absolute inset-0 bg-gradient-to-t from-black to-transparent flex flex-col justify-end p-8">
<h5 className="text-2xl font-headline font-bold text-white uppercase tracking-widest">Noches de Pizza</h5>
<p className="text-sm text-gray-300 font-medium">Evento finalizado en Octubre</p>
</div>
</div>
{/*  Grayscale Carousel Item 2  */}
<div className="min-w-[300px] md:min-w-[450px] aspect-[4/5] relative rounded-sm overflow-hidden grayscale opacity-40 hover:opacity-100 hover:grayscale-0 transition-all duration-700 cursor-pointer group">
<img alt="Beer Tasting" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" data-alt="Craft beer flight in small glasses on a rustic wooden plank, dramatic overhead shot, warm earthy tones" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAU5vaymUtsMXpykBE-3DLe2BkTnmSH-LJ_vTO3JBkwAYp3h1iThlua5KQQtKihgFedhu7F7_wS7CgXMSTjdJXF20JufhhRahg5LfuQzyhrriH9PTxeS7VP6NEZwbw464aKzYHA2_J5mAFMISJd57OIilDWZdxbZFMZ0CffSYGh93hC7NH9z5b-t0yZ73LzZ_VPig0hdxlQxpZbEydnRTL6vy8Wzkasa-TB0uhVLxeGvgUN6hyCUg3Hjauf0GCkMal09PrmcQARyD7T"/>
<div className="absolute inset-0 bg-gradient-to-t from-black to-transparent flex flex-col justify-end p-8">
<h5 className="text-2xl font-headline font-bold text-white uppercase tracking-widest">Cata de Artesanales</h5>
<p className="text-sm text-gray-300 font-medium">Evento finalizado en Septiembre</p>
</div>
</div>
{/*  Grayscale Carousel Item 3  */}
<div className="min-w-[300px] md:min-w-[450px] aspect-[4/5] relative rounded-sm overflow-hidden grayscale opacity-40 hover:opacity-100 hover:grayscale-0 transition-all duration-700 cursor-pointer group">
<img alt="Dessert Week" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" data-alt="Gourmet dessert with spun sugar and artistic plating on a dark plate, macro photography" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAAzysnz7lHX7J2KPZaoL0VgrYZ_gQ_7YkafKsP33VfggUAzhJI-kciCVfmJvJbHSMT5R-H9gTT1o5zzfOAZn-FP72WFki8GpjCiGzYIHXOG3dbjx9VkWvdEEZx8dVUl_ry1nvrqyLlGhxAWYt5W0EjHOvSx5JxqM4R5GQAX0BPviLcykpXIeef1fv63JWuWIOxv85eXDMOZkEiqXeBIa_gbI_y7dwd4g7NVwTot-ploCWGyOrEsrHz5-RU7wurQfiLer2P6Cy18qFz"/>
<div className="absolute inset-0 bg-gradient-to-t from-black to-transparent flex flex-col justify-end p-8">
<h5 className="text-2xl font-headline font-bold text-white uppercase tracking-widest">Semana Dulce</h5>
<p className="text-sm text-gray-300 font-medium">Evento finalizado en Agosto</p>
</div>
</div>
</div>
</section>
</main>
{/*  BottomNavBar (Mobile)  */}

{/*  Footer  */}


    </>
  );
}
