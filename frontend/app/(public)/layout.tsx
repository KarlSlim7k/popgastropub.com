import React from 'react';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Top Navigation Bar */}
      <nav className="fixed top-0 w-full z-50 bg-transparent backdrop-blur-md dark:bg-[#0D0D0D]/80 flex justify-between items-center px-8 py-4 max-w-full no-line">
        <div className="text-2xl font-black text-[#EBC071] tracking-tighter uppercase font-headline">POP PEROTE</div>
        <div className="hidden md:flex items-center space-x-8 font-epilogue font-bold tracking-tight uppercase">
          <a className="text-[#E5E2E1] hover:text-[#FFB693] transition-all duration-300 ease-in-out" href="/">Inicio</a>
          <a className="text-[#E5E2E1] hover:text-[#FFB693] transition-all duration-300 ease-in-out" href="/menu">Menu</a>
          <a className="text-[#E5E2E1] hover:text-[#FFB693] transition-all duration-300 ease-in-out" href="/sobre-nosotros">Nosotros</a>
          <a className="text-[#E5E2E1] hover:text-[#FFB693] transition-all duration-300 ease-in-out" href="/promociones">Promos</a>
          <a className="text-[#E5E2E1] hover:text-[#FFB693] transition-all duration-300 ease-in-out" href="/ubicacion">Ubicación</a>
          <a className="text-[#E5E2E1] hover:text-[#FFB693] transition-all duration-300 ease-in-out" href="/login">Cuenta</a>
        </div>
        <div className="flex items-center space-x-4">
          <a href="/login" className="hidden md:block border border-[#EBC071]/20 px-4 py-2 text-[#EBC071] font-bold text-sm transition-all duration-300 active:scale-95">LOGIN</a>
          <button className="bg-[#D96725] px-6 py-2 text-on-surface font-black text-sm transition-all duration-500 cubic-bezier(0.23, 1, 0.32, 1) active:scale-95 flex items-center gap-2">
                          WHATSAPP <span className="material-symbols-outlined text-lg">chat</span>
          </button>
        </div>
      </nav>

      {/* Main Content */}
      {children}

      {/* Footer */}
      <footer className="bg-[#732817] text-on-surface py-20 px-8 flex-shrink-0 relative z-40">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-1">
            <span className="text-[#EBC071] font-headline font-black text-4xl mb-6 block tracking-tighter">POP</span>
            <p className="text-on-surface/80 font-body text-sm leading-relaxed mb-8">Gastronomic Editorial &amp; Luxury Snacks. Redefiniendo el sabor en el corazón de Perote.</p>
            <div className="flex gap-4">
              <a className="w-10 h-10 border border-[#EBC071]/20 flex items-center justify-center hover:bg-[#EBC071] hover:text-black transition-all duration-300" href="#">
                <span className="material-symbols-outlined text-sm">social_leaderboard</span>
              </a>
              <a className="w-10 h-10 border border-[#EBC071]/20 flex items-center justify-center hover:bg-[#EBC071] hover:text-black transition-all duration-300" href="#">
                <span className="material-symbols-outlined text-sm">group</span>
              </a>
              <a className="w-10 h-10 border border-[#EBC071]/20 flex items-center justify-center hover:bg-[#EBC071] hover:text-black transition-all duration-300" href="#">
                <span className="material-symbols-outlined text-sm">play_circle</span>
              </a>
            </div>
          </div>
          <div>
            <h5 className="text-[#EBC071] font-headline font-bold uppercase tracking-widest text-sm mb-6">Explora</h5>
            <ul className="space-y-4 text-on-surface/70 text-sm">
              <li><a className="hover:text-[#EBC071] transition-colors" href="/">Inicio</a></li>
              <li><a className="hover:text-[#EBC071] transition-colors" href="/menu">Nuestro Menú</a></li>
              <li><a className="hover:text-[#EBC071] transition-colors" href="/sobre-nosotros">Nosotros</a></li>
              <li><a className="hover:text-[#EBC071] transition-colors" href="/promociones">Promociones</a></li>
              <li><a className="hover:text-[#EBC071] transition-colors" href="/ubicacion">Ubicación</a></li>
            </ul>
          </div>
          <div>
            <h5 className="text-[#EBC071] font-headline font-bold uppercase tracking-widest text-sm mb-6">Legal</h5>
            <ul className="space-y-4 text-on-surface/70 text-sm">
              <li><a className="hover:text-[#EBC071] transition-colors" href="#">Privacy Policy</a></li>
              <li><a className="hover:text-[#EBC071] transition-colors" href="#">Terminos y Condiciones</a></li>
              <li><a className="hover:text-[#EBC071] transition-colors" href="/login">Cuenta</a></li>
            </ul>
          </div>
          <div>
            <h5 className="text-[#EBC071] font-headline font-bold uppercase tracking-widest text-sm mb-6">Newsletter</h5>
            <p className="text-on-surface/70 text-xs mb-4">Suscríbete para recibir ofertas secretas.</p>
            <div className="relative">
              <input className="w-full bg-black/20 border-b border-[#EBC071]/40 py-3 px-0 focus:border-[#EBC071] focus:ring-0 transition-colors text-sm" placeholder="E-mail address" type="email"/>
              <button className="absolute right-0 top-1/2 -translate-y-1/2 text-[#EBC071] hover:scale-110 transition-transform">
              <span className="material-symbols-outlined">east</span>
              </button>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto border-t border-[#EBC071]/10 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-on-surface/40 text-[10px] font-bold uppercase tracking-widest">© 2026 POP PEROTE Gastronomic Editorial. All Rights Reserved.</p>
          <p className="text-on-surface/40 text-[10px] font-bold uppercase tracking-widest">MADE WITH 🔥 IN PEROTE</p>
        </div>
      </footer>

      {/* Mobile Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 py-3 pb-safe bg-[#0D0D0D]/95 backdrop-blur-xl border-t border-[#F2C777]/10 shadow-[0_-10px_30px_rgba(217,103,37,0.08)]">
        <a className="flex flex-col items-center justify-center text-[#E5E2E1]/60 hover:text-[#FFB693] transition-transform duration-300" href="/">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>home</span>
          <span className="font-manrope text-[10px] font-bold uppercase tracking-widest mt-1">Inicio</span>
        </a>
        <a className="flex flex-col items-center justify-center text-[#E5E2E1]/60 hover:text-[#FFB693] transition-transform duration-300" href="/menu">
          <span className="material-symbols-outlined">menu_book</span>
          <span className="font-manrope text-[10px] font-bold uppercase tracking-widest mt-1">Menu</span>
        </a>
        <a className="flex flex-col items-center justify-center text-[#E5E2E1]/60 hover:text-[#FFB693] transition-transform duration-300" href="/login">
          <span className="material-symbols-outlined">person</span>
          <span className="font-manrope text-[10px] font-bold uppercase tracking-widest mt-1">Cuenta</span>
        </a>
        <a className="flex flex-col items-center justify-center text-[#E5E2E1]/60 hover:text-[#FFB693] transition-transform duration-300" href="/ubicacion">
          <span className="material-symbols-outlined">location_on</span>
          <span className="font-manrope text-[10px] font-bold uppercase tracking-widest mt-1">Ubicacion</span>
        </a>
        <a className="flex flex-col items-center justify-center text-[#E5E2E1]/60 hover:text-[#FFB693] transition-transform duration-300" href="/orden">
          <span className="material-symbols-outlined">shopping_cart</span>
          <span className="font-manrope text-[10px] font-bold uppercase tracking-widest mt-1">Orden</span>
        </a>
      </nav>
    </>
  );
}
