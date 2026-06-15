"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

const NAV_LINKS = [
  { href: "/", label: "Inicio" },
  { href: "/menu", label: "Menú" },
  { href: "/promociones", label: "Promos" },
  { href: "/pop-points", label: "POP Points" },
  { href: "/ubicacion", label: "Ubicación" },
];

export default function LandingNav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname?.startsWith(href);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 h-16 px-6 lg:px-8 flex items-center justify-between transition-all duration-300 ${
          scrolled
            ? "bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-[#F2C777]/15"
            : "bg-[#0a0a0a]/80 backdrop-blur-md border-b border-transparent"
        }`}
      >
        <Link
          href="/"
          className="font-epilogue font-black text-xl tracking-[0.2em] text-[#F2C777] hover:text-white transition-colors"
        >
          POP
        </Link>

        <div className="hidden md:flex items-center gap-7">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-[11px] font-black uppercase tracking-[0.18em] transition-colors ${
                isActive(link.href)
                  ? "text-[#F2C777]"
                  : "text-white/80 hover:text-[#F2C777]"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/login?tab=register"
            className="hidden md:inline-flex items-center bg-[#D96E30] hover:bg-[#F2C777] text-white hover:text-[#0D0D0D] font-black uppercase tracking-widest text-[11px] px-4 py-2 rounded transition-all duration-200"
          >
            Únete gratis
          </Link>
          <button
            type="button"
            className="md:hidden text-[#F2C777] p-2"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            <span className="material-symbols-outlined text-2xl">
              {mobileOpen ? "close" : "menu"}
            </span>
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-[#0a0a0a]/95 backdrop-blur-xl pt-20 px-6 pb-12 overflow-y-auto">
          <div className="flex flex-col gap-5">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`font-epilogue font-black text-2xl uppercase tracking-widest transition-colors ${
                  isActive(link.href)
                    ? "text-[#F2C777]"
                    : "text-white hover:text-[#D96E30]"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/login?tab=register"
              className="mt-4 border border-[#F2C777]/30 text-[#F2C777] font-black uppercase tracking-widest text-sm px-6 py-3 text-center"
            >
              Únete gratis
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
