'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import NewsletterForm from '@/components/NewsletterForm';

const navLinks = [
  { href: '/', label: 'Inicio' },
  { href: '/menu', label: 'Menú' },
  { href: '/sobre-nosotros', label: 'Nosotros' },
  { href: '/promociones', label: 'Promos' },
  { href: '/ubicacion', label: 'Ubicación' },
  { href: '/login', label: 'Cuenta' },
];

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Top Navigation Bar */}
      <nav className="fixed top-0 w-full z-50 bg-transparent backdrop-blur-md dark:bg-[#0D0D0D]/80 flex justify-between items-center px-8 py-4 max-w-full no-line">
        <div className="flex items-center justify-center">
          <Image src="/images/logopop.png" alt="POP PEROTE Logo" width={80} height={40} className="w-auto h-8 md:h-10 object-contain" priority />
        </div>
        <div className="hidden md:flex items-center space-x-8 font-epilogue font-bold tracking-tight uppercase">
          {navLinks.map((link) => (
            <a key={link.href} className="text-[#E5E2E1] hover:text-[#FFB693] transition-all duration-300 ease-in-out" href={link.href}>{link.label}</a>
          ))}
        </div>
        <div className="flex items-center space-x-4">
          <a href="/login" className="hidden md:block border border-[#F2C777]/20 px-4 py-2 text-[#F2C777] font-bold text-sm transition-all duration-300 active:scale-95">LOGIN</a>
          <button
            className="md:hidden text-[#F2C777] p-2"
            onClick={() => setMobileMenuOpen((v) => !v)}
            aria-label="Toggle menu"
            type="button"
          >
            <span className="material-symbols-outlined text-2xl">{mobileMenuOpen ? 'close' : 'menu'}</span>
          </button>
          <a href="https://wa.me/522828253243" target="_blank" rel="noopener noreferrer" className="bg-[#D96725] px-6 py-2 text-on-surface font-black text-sm transition-all duration-500 cubic-bezier(0.23, 1, 0.32, 1) active:scale-95 flex items-center gap-2">
            <span className="hidden md:inline">WHATSAPP</span>
            <span className="material-symbols-outlined text-lg">chat</span>
          </a>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-[#0D0D0D]/95 backdrop-blur-xl pt-20 px-8 pb-24 overflow-y-auto">
          <div className="flex flex-col gap-6 mt-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-[#F2C777] font-headline font-black text-2xl uppercase tracking-widest hover:text-[#D96725] transition-colors"
              >
                {link.label}
              </a>
            ))}
            <a
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="border border-[#F2C777]/30 text-[#F2C777] font-bold text-sm px-6 py-3 text-center uppercase tracking-widest mt-4"
            >
              Login
            </a>
          </div>
        </div>
      )}

      {/* Main Content */}
      {children}

      {/* Footer */}
      <footer className="bg-[#732817] text-on-surface py-20 px-8 flex-shrink-0 relative z-40">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-1">
            <span className="text-[#F2C777] font-headline font-black text-4xl mb-6 block tracking-tighter">POP</span>
            <p className="text-on-surface/80 font-body text-sm leading-relaxed mb-8">Gastronomic Editorial &amp; Luxury Snacks. Redefiniendo el sabor en el corazón de Perote.</p>
            <div className="flex gap-4">
              <a className="w-10 h-10 border border-[#F2C777]/20 flex items-center justify-center hover:bg-[#F2C777] hover:text-black transition-all duration-300" href="https://www.facebook.com/pop.perote" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a className="w-10 h-10 border border-[#F2C777]/20 flex items-center justify-center hover:bg-[#F2C777] hover:text-black transition-all duration-300" href="https://www.instagram.com/pop_perote" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </a>
              <a className="w-10 h-10 border border-[#F2C777]/20 flex items-center justify-center hover:bg-[#F2C777] hover:text-black transition-all duration-300" href="https://www.tiktok.com/@pop_perote" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>
              </a>
            </div>
          </div>
          <div>
            <h5 className="text-[#F2C777] font-headline font-bold uppercase tracking-widest text-sm mb-6">Explora</h5>
            <ul className="space-y-4 text-on-surface/70 text-sm">
              <li><a className="hover:text-[#F2C777] transition-colors" href="/">Inicio</a></li>
              <li><a className="hover:text-[#F2C777] transition-colors" href="/menu">Nuestro Menú</a></li>
              <li><a className="hover:text-[#F2C777] transition-colors" href="/sobre-nosotros">Nosotros</a></li>
              <li><a className="hover:text-[#F2C777] transition-colors" href="/promociones">Promociones</a></li>
              <li><a className="hover:text-[#F2C777] transition-colors" href="/ubicacion">Ubicación</a></li>
            </ul>
          </div>
          <div>
            <h5 className="text-[#F2C777] font-headline font-bold uppercase tracking-widest text-sm mb-6">Legal</h5>
            <ul className="space-y-4 text-on-surface/70 text-sm">
              <li><a className="hover:text-[#F2C777] transition-colors" href="#">Privacy Policy</a></li>
              <li><a className="hover:text-[#F2C777] transition-colors" href="#">Terminos y Condiciones</a></li>
              <li><a className="hover:text-[#F2C777] transition-colors" href="/login">Cuenta</a></li>
            </ul>
          </div>
          <div>
            <h5 className="text-[#F2C777] font-headline font-bold uppercase tracking-widest text-sm mb-6">Newsletter</h5>
            <p className="text-on-surface/70 text-xs mb-4">Suscríbete para recibir ofertas secretas.</p>
            <NewsletterForm />
          </div>
        </div>
        <div className="max-w-7xl mx-auto border-t border-[#F2C777]/10 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-on-surface/40 text-[10px] font-bold uppercase tracking-widest">© 2026 POP PEROTE Gastronomic Editorial. All Rights Reserved.</p>
          <p className="text-on-surface/40 text-[10px] font-bold uppercase tracking-widest">MADE WITH 🔥 IN PEROTE</p>
        </div>
      </footer>

      {/* Mobile Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 grid grid-cols-5 items-center py-3 pb-safe bg-[#0D0D0D]/95 backdrop-blur-xl border-t border-[#F2C777]/10 shadow-[0_-10px_30px_rgba(217,103,37,0.08)]">
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
