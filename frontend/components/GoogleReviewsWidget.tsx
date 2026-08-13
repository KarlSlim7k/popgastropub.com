export default function GoogleReviewsWidget() {
  return (
    <div className="mx-auto max-w-2xl rounded-3xl border border-[#F2C777]/25 bg-white/5 px-6 py-8 text-center">
      <p className="text-sm font-black uppercase tracking-[0.28em] text-[#F2C777]">Google Reviews</p>
      <p className="mt-4 text-5xl font-black text-white">4.4 <span className="text-[#F2C777]" aria-hidden="true">★</span></p>
      <p className="mt-3 text-sm text-white/65">Conoce lo que nuestros clientes dicen de POP Perote directamente en Google.</p>
      <a
        href="https://www.google.com/maps/search/?api=1&query=POP+Perote+Justo+Sierra+11"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 inline-flex rounded-full bg-[#F2C777] px-6 py-3 text-xs font-black uppercase tracking-widest text-[#0D0D0D] transition-colors hover:bg-[#F2C894]"
      >
        Ver reseñas verificadas
      </a>
    </div>
  );
}
