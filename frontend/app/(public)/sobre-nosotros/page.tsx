import type { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Sobre Nosotros | POP Perote',
  description: 'Conoce el espacio de POP Perote. Sushi, alitas, mixología y ambiente en el corazón de Perote, Veracruz.',
};

export default function SobreNosotros() {
  return (
    <main className="pt-20">
      {/* Photo Gallery (Masonry Grid) */}
      <section className="py-24 bg-[#0D0D0D]">
        <div className="max-w-[1400px] mx-auto px-8">
          <h2 className="text-4xl md:text-6xl font-black font-headline text-white tracking-tighter mb-16 text-center">Nuestro Espacio</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[300px]">
            <div className="md:col-span-2 md:row-span-2 relative group overflow-hidden rounded-lg">
              <Image alt="Interior POP Perote - decoración" src="/images/decoracion_pop_4.webp" fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
            </div>
            <div className="relative group overflow-hidden rounded-lg">
              <Image alt="Vista lateral del restaurante" src="/images/vista_lateral_2.webp" fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
            </div>
            <div className="relative group overflow-hidden rounded-lg">
              <Image alt="Sushi POP Perote" src="/images/sushi_1.webp" fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
            </div>
            <div className="md:col-span-2 relative group overflow-hidden rounded-lg">
              <Image alt="Mixología POP Perote" src="/images/mixologia_1.webp" fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <div className="relative h-[250px] group overflow-hidden rounded-lg">
              <Image alt="Decoración POP" src="/images/decoracion_pop.webp" fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
            </div>
            <div className="relative h-[250px] group overflow-hidden rounded-lg">
              <Image alt="Mesa grande POP" src="/images/mesa_grande_1.webp" fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
            </div>
            <div className="relative h-[250px] group overflow-hidden rounded-lg">
              <Image alt="Mixer POP" src="/images/mixer_1.webp" fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
            </div>
            <div className="relative h-[250px] group overflow-hidden rounded-lg">
              <Image alt="Decoración interior" src="/images/decoracion_pop_5.webp" fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
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
