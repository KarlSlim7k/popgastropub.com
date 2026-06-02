import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { API_URL } from '@/lib/api';

interface Promo {
  titulo: string;
  descripcion: string | null;
  descuento: string | null;
  imagen: string | null;
  dia_inicio: string | null;
  dia_fin: string | null;
  dias_activos: string[];
  indefinida: boolean;
  disponible_hoy: boolean;
}

interface PromoResponse {
  data: Promo;
}

const IMAGE_HOSTS = new Set([
  'popgastropub.com',
  'api.popgastropub.com',
]);

async function getPromo(slug: string): Promise<Promo | null> {
  const response = await fetch(`${API_URL}/promociones/${encodeURIComponent(slug)}`, {
    cache: 'no-store',
    headers: { Accept: 'application/json' },
  });

  if (response.status === 404) return null;
  if (!response.ok) throw new Error('No fue posible cargar la promoción.');

  const body = await response.json() as PromoResponse;
  return body.data;
}

function getSupportedImageUrl(value: string | null): string | null {
  if (!value) return null;
  if (value.startsWith('/')) return value;

  try {
    const url = new URL(value);
    return url.protocol === 'https:' && IMAGE_HOSTS.has(url.hostname) ? value : null;
  } catch {
    return null;
  }
}

function formatSchedule(promo: Promo): string {
  if (promo.indefinida) return 'Promoción recurrente sin fecha límite';
  if (promo.dia_inicio && promo.dia_fin) return `Vigencia: ${promo.dia_inicio} al ${promo.dia_fin}`;
  return 'Consulta disponibilidad en sucursal';
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const promo = await getPromo(slug);

  if (!promo) return {};

  return {
    title: `${promo.titulo} | POP Perote`,
    description: promo.descripcion || `Conoce la promoción ${promo.titulo} de POP Perote.`,
  };
}

export default async function PromoLandingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const promo = await getPromo(slug);

  if (!promo) notFound();

  const imageUrl = getSupportedImageUrl(promo.imagen);

  return (
    <main className="min-h-screen bg-[#0D0D0D] pt-24 pb-24 text-white">
      <section className="mx-auto grid max-w-7xl gap-10 px-6 py-12 lg:grid-cols-[1.08fr_0.92fr] lg:items-center lg:px-8 lg:py-20">
        <div className="relative min-h-[340px] overflow-hidden rounded-2xl border border-[#F2C777]/20 bg-[#732817] sm:min-h-[480px]">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={promo.titulo}
              fill
              sizes="(min-width: 1024px) 54vw, 100vw"
              className="object-cover"
              priority
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[#732817] via-[#D96725] to-[#F2C777]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D]/70 via-transparent to-transparent" />
          {promo.descuento && (
            <span className="absolute left-6 top-6 rounded-full bg-[#F2C777] px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-[#0D0D0D]">
              {promo.descuento}
            </span>
          )}
        </div>

        <div>
          <p className="mb-4 text-xs font-black uppercase tracking-[0.28em] text-[#D96725]">
            POP Perote presenta
          </p>
          <h1 className="font-epilogue text-5xl font-black uppercase leading-[0.94] tracking-tighter text-[#F2C777] sm:text-6xl">
            {promo.titulo}
          </h1>
          {promo.descripcion && (
            <p className="mt-7 max-w-xl text-lg leading-relaxed text-[#F2C894]">
              {promo.descripcion}
            </p>
          )}

          <div className="mt-8 border-y border-[#F2C777]/20 py-5 text-sm text-[#F2C894]">
            <p className="font-bold text-white">{formatSchedule(promo)}</p>
            {promo.dias_activos.length > 0 && (
              <p className="mt-2 capitalize">Días aplicables: {promo.dias_activos.join(', ')}</p>
            )}
            <p className={`mt-2 font-black uppercase tracking-widest ${promo.disponible_hoy ? 'text-[#F2C777]' : 'text-[#D96725]'}`}>
              {promo.disponible_hoy ? 'Disponible hoy' : 'Consulta el próximo día aplicable'}
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/orden" className="bg-[#D96725] px-7 py-4 text-center text-sm font-black uppercase tracking-widest text-white transition-colors hover:bg-[#F2C777] hover:text-[#0D0D0D]">
              Ordenar ahora
            </Link>
            <Link href="/ubicacion" className="border border-[#F2C777] px-7 py-4 text-center text-sm font-black uppercase tracking-widest text-[#F2C777] transition-colors hover:bg-[#F2C777] hover:text-[#0D0D0D]">
              Ver ubicación
            </Link>
          </div>

          <Link href="/promociones" className="mt-8 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#F2C894] transition-colors hover:text-[#F2C777]">
            <span aria-hidden="true">←</span>
            Todas las promociones
          </Link>
        </div>
      </section>
    </main>
  );
}
