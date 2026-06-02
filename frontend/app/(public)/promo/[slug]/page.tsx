import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import PromoLandingContent, { type PromoLandingData } from '@/components/promociones/PromoLandingContent';
import { API_URL } from '@/lib/api';

interface PromoResponse {
  data: PromoLandingData;
}

const SITE_URL = 'https://popgastropub.com';

function absoluteUrl(value?: string | null): string | undefined {
  if (!value) return undefined;

  return value.startsWith('/') ? new URL(value, SITE_URL).toString() : value;
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

  const title = promo.seo_title || promo.landing_title || promo.titulo;
  const description = promo.seo_description || promo.landing_subtitle || promo.descripcion || `Conoce la promoción ${promo.titulo} de POP Perote.`;
  const landingUrl = `${SITE_URL}/promo/${encodeURIComponent(slug)}`;
  const image = absoluteUrl(promo.og_image || promo.imagen);

  return {
    title: `${title} | POP Perote`,
    description,
    alternates: {
      canonical: landingUrl,
    },
    openGraph: {
      type: 'website',
      locale: 'es_MX',
      siteName: 'POP Perote',
      title,
      description,
      url: landingUrl,
      images: image ? [{ url: image, alt: title }] : undefined,
    },
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
