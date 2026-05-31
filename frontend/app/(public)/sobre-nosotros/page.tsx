import type { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Sobre Nosotros | POP Perote',
  description: 'Conoce la historia de POP Perote. Más de una década de sabor en el corazón de Perote, Veracruz.',
};

export default function SobreNosotros() {
  return (
    <main className="pt-20">
      {/* Hero Section */}
      <section className="relative h-[819px] flex items-center overflow-hidden">
        <Image
          alt="Entrada del restaurante POP Perote"
          src="/images/entrada_vertical.jpg"
          fill
          className="object-cover brightness-[0.4]"
          priority
        />
        <div className="relative z-10 px-8 md:px-24 max-w-5xl">
          <h1 className="text-6xl md:text-8xl font-black font-headline text-[#F2C166] tracking-tighter leading-none mb-6">SOBRE POP 🍣</h1>
          <p className="text-xl md:text-3xl font-body font-light text-white/80 max-w-2xl leading-relaxed">
            Desde el 2014 satisfaciendo tu antojo... Elevando la experiencia gastronómica en Perote.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="bg-[#0D0D0D] py-24 px-8 md:px-24">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-16 items-start">
          <div className="md:col-span-7">
            <span className="text-[#D96725] font-headline font-bold tracking-[0.2em] uppercase text-sm block mb-4">Nuestra Historia</span>
            <h2 className="text-4xl md:text-6xl font-black font-headline text-white mb-8 tracking-tighter">Una Década de Sabor Revolucionario.</h2>
            <div className="space-y-6 text-lg font-body text-white/70 leading-relaxed">
              <p>Nacimos de una obsesión por la frescura. Lo que comenzó como un pequeño rincón para amantes del sushi se transformó en el epicentro gastronómico de la región, fusionando la precisión técnica japonesa con la audacia de las mejores alitas craft.</p>
              <p>En POP PEROTE, cada platillo es una pieza editorial. No solo servimos comida; curamos experiencias sensoriales donde el fuego de nuestras salsas y la sutileza del pescado fresco cuentan una historia de compromiso inquebrantable con la calidad.</p>
            </div>
          </div>
          {/* Visual Timeline */}
          <div className="md:col-span-5 space-y-12 border-l border-white/10 pl-8 py-4">
            <div className="relative">
              <div className="absolute -left-[37px] top-0 w-4 h-4 rounded-full bg-[#F2C777] shadow-[0_0_15px_rgba(242,199,119,0.5)]"></div>
              <span className="text-[#F2C777] font-headline font-bold text-2xl">2014</span>
              <h3 className="text-white font-bold text-lg mt-1">El Comienzo</h3>
              <p className="text-white/60 text-sm mt-2">Apertura del primer local enfocado en sushi tradicional y técnicas artesanales.</p>
            </div>
            <div className="relative">
              <div className="absolute -left-[37px] top-0 w-4 h-4 rounded-full bg-[#D96725] shadow-[0_0_15px_rgba(217,103,37,0.5)]"></div>
              <span className="text-[#D96725] font-headline font-bold text-2xl">2018</span>
              <h3 className="text-white font-bold text-lg mt-1">La Evolución Wing</h3>
              <p className="text-white/60 text-sm mt-2">Incorporamos nuestra línea &apos;Fire &amp; Flavor&apos; de alitas con salsas de autor secretas.</p>
            </div>
            <div className="relative">
              <div className="absolute -left-[37px] top-0 w-4 h-4 rounded-full bg-[#F2C894] shadow-[0_0_15px_rgba(242,200,148,0.5)]"></div>
              <span className="text-[#F2C894] font-headline font-bold text-2xl">2024</span>
              <h3 className="text-white font-bold text-lg mt-1">Era Gastronómica</h3>
              <p className="text-white/60 text-sm mt-2">Renovación total a concepto Editorial Premium y expansión de nuestra Mixología.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-[#0D0D0D] px-8 md:px-24 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-12 bg-white/[0.03] backdrop-blur-md border border-white/5 rounded-lg hover:border-[#F2C777]/20 transition-colors duration-500">
              <span className="material-symbols-outlined text-[#F2C777] text-5xl mb-6">workspace_premium</span>
              <h3 className="text-2xl font-black font-headline text-white mb-4 tracking-tight">Calidad Premium</h3>
              <p className="text-white/60 font-body leading-relaxed">Ingredientes seleccionados diariamente para garantizar una frescura que salta al paladar en cada bocado.</p>
            </div>
            <div className="p-12 bg-white/[0.03] backdrop-blur-md border border-white/5 rounded-lg hover:border-[#D96725]/20 transition-colors duration-500">
              <span className="material-symbols-outlined text-[#D96725] text-5xl mb-6">family_restroom</span>
              <h3 className="text-2xl font-black font-headline text-white mb-4 tracking-tight">Ambiente Familiar</h3>
              <p className="text-white/60 font-body leading-relaxed">Un espacio diseñado para crear memorias, donde cada generación encuentra su rincón de confort y sabor.</p>
            </div>
            <div className="p-12 bg-white/[0.03] backdrop-blur-md border border-white/5 rounded-lg hover:border-[#F2C894]/20 transition-colors duration-500">
              <span className="material-symbols-outlined text-[#F2C894] text-5xl mb-6">local_fire_department</span>
              <h3 className="text-2xl font-black font-headline text-white mb-4 tracking-tight">Sabor Inigualable</h3>
              <p className="text-white/60 font-body leading-relaxed">Recetas propias que desafían lo convencional, fusionando tradición y vanguardia culinaria.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Photo Gallery (Masonry Grid) */}
      <section className="py-24 bg-[#0D0D0D]">
        <div className="max-w-[1400px] mx-auto px-8">
          <h2 className="text-4xl md:text-6xl font-black font-headline text-white tracking-tighter mb-16 text-center">Nuestro Espacio</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[300px]">
            <div className="md:col-span-2 md:row-span-2 relative group overflow-hidden rounded-lg">
              <Image alt="Interior POP Perote - decoración" src="/images/decoracion_pop_4.jpg" fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
            </div>
            <div className="relative group overflow-hidden rounded-lg">
              <Image alt="Vista lateral del restaurante" src="/images/vista_lateral_2.jpg" fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
            </div>
            <div className="relative group overflow-hidden rounded-lg">
              <Image alt="Sushi POP Perote" src="/images/sushi_1.jpg" fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
            </div>
            <div className="md:col-span-2 relative group overflow-hidden rounded-lg">
              <Image alt="Mixología POP Perote" src="/images/mixologia_1.jpg" fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <div className="relative h-[250px] group overflow-hidden rounded-lg">
              <Image alt="Decoración POP" src="/images/decoracion_pop.jpg" fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
            </div>
            <div className="relative h-[250px] group overflow-hidden rounded-lg">
              <Image alt="Mesa grande POP" src="/images/mesa_grande_1.jpg" fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
            </div>
            <div className="relative h-[250px] group overflow-hidden rounded-lg">
              <Image alt="Mixer POP" src="/images/mixer_1.jpg" fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
            </div>
            <div className="relative h-[250px] group overflow-hidden rounded-lg">
              <Image alt="Decoración interior" src="/images/decoracion_pop_5.jpg" fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
            </div>
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="py-40 text-center relative overflow-hidden px-8 bg-[#0D0D0D]">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#D96725]/10 blur-[120px] rounded-full"></div>
        <div className="relative z-10">
          <h2 className="text-5xl md:text-7xl font-black font-headline text-white mb-12 tracking-tighter">¿Listo para probar?</h2>
          <a className="inline-flex items-center gap-4 bg-[#D96725] text-white px-12 py-6 text-2xl font-black font-headline rounded-lg hover:bg-[#F2C777] hover:text-[#0D0D0D] transition-all duration-500 active:scale-95 group" href="/menu">
            VER MENÚ
            <span className="material-symbols-outlined transition-transform duration-300 group-hover:translate-x-2">arrow_forward</span>
          </a>
        </div>
      </section>
    </main>
  );
}
