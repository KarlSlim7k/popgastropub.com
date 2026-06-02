import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import PromoLandingContent, { type PromoLandingData } from '@/components/promociones/PromoLandingContent';
import { API_URL } from '@/lib/api';

interface PromoResponse {
  data: PromoLandingData;
}

async function getPromo(slug: string): Promise<PromoLandingData | null> {
  const response = await fetch(`${API_URL}/promociones/${encodeURIComponent(slug)}`, {
    cache: 'no-store',
    headers: { Accept: 'application/json' },
  });

  if (response.status === 404) return null;
  if (!response.ok) throw new Error('No fue posible cargar la promoción.');

  const body = await response.json() as PromoResponse;
  return body.data;
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
    title: `${promo.landing_title || promo.titulo} | POP Perote`,
    description: promo.landing_subtitle || promo.descripcion || `Conoce la promoción ${promo.titulo} de POP Perote.`,
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

  return (
    <main className="min-h-screen bg-[#0D0D0D] pt-24 pb-24 text-white">
      <PromoLandingContent promo={promo} />
    </main>
  );
}
