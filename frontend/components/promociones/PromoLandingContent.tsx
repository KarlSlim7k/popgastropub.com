import Image from 'next/image';
import {
  PromoLeadForm,
  PromoTrackedLink,
  PromoViewTracker,
  type PromoFormField,
} from '@/components/promociones/PromoLandingInteractions';

export interface PromoLandingData {
  slug?: string | null;
  titulo: string;
  descripcion?: string | null;
  descuento?: string | null;
  imagen?: string | null;
  dia_inicio?: string | null;
  dia_fin?: string | null;
  dias_activos?: string[];
  indefinida?: boolean;
  disponible_hoy?: boolean;
  landing_title?: string | null;
  landing_subtitle?: string | null;
  landing_content?: string | null;
  landing_template?: string | null;
  cta_primary_text?: string | null;
  cta_primary_url?: string | null;
  cta_secondary_text?: string | null;
  cta_secondary_url?: string | null;
  form_enabled?: boolean;
  form_fields?: PromoFormField[] | null;
}

const IMAGE_HOSTS = new Set([
  'popgastropub.com',
  'api.popgastropub.com',
  'lh3.googleusercontent.com',
  'images.unsplash.com',
]);

function getSupportedImageUrl(value?: string | null): string | null {
  if (!value) return null;
  if (value.startsWith('/')) return value;

  try {
    const url = new URL(value);
    return url.protocol === 'https:' && IMAGE_HOSTS.has(url.hostname) ? value : null;
  } catch {
    return null;
  }
}

function formatSchedule(promo: PromoLandingData): string {
  if (promo.indefinida) return 'Promoción recurrente sin fecha límite';
  if (promo.dia_inicio && promo.dia_fin) return `Vigencia: ${promo.dia_inicio} al ${promo.dia_fin}`;
  return 'Consulta disponibilidad en sucursal';
}

function isExternalUrl(value: string): boolean {
  return value.startsWith('https://');
}

export default function PromoLandingContent({ promo, preview = false }: { promo: PromoLandingData; preview?: boolean }) {
  const imageUrl = getSupportedImageUrl(promo.imagen);
  const title = promo.landing_title || promo.titulo;
  const subtitle = promo.landing_subtitle || promo.descripcion;
  const content = promo.landing_content || promo.descripcion;
  const isClassic = promo.landing_template === 'clasica';
  const primaryCta = {
    text: promo.cta_primary_text || 'Ordenar ahora',
    url: promo.cta_primary_url || '/orden',
  };
  const secondaryCta = {
    text: promo.cta_secondary_text || 'Ver ubicación',
    url: promo.cta_secondary_url || '/ubicacion',
  };
  const formFields = promo.form_fields || [];

  const ctaLink = (
    cta: { text: string; url: string },
    eventType: 'cta_primary_click' | 'cta_secondary_click',
    className: string,
  ) => {
    const linkProps = {
      href: preview ? '#' : cta.url,
      target: !preview && isExternalUrl(cta.url) ? '_blank' : undefined,
      rel: !preview && isExternalUrl(cta.url) ? 'noopener noreferrer' : undefined,
      className,
    };

    return !preview && promo.slug ? (
      <PromoTrackedLink {...linkProps} slug={promo.slug} eventType={eventType}>{cta.text}</PromoTrackedLink>
    ) : (
      <a {...linkProps}>{cta.text}</a>
    );
  };

  return (
    <section className={`mx-auto grid max-w-7xl gap-10 px-6 py-12 lg:items-start lg:px-8 lg:py-20 ${
      isClassic ? 'lg:grid-cols-[0.92fr_1.08fr]' : 'lg:grid-cols-[1.08fr_0.92fr]'
    }`}>
      {!preview && promo.slug && <PromoViewTracker slug={promo.slug} />}
      <div className={`relative min-h-[340px] overflow-hidden rounded-2xl border border-[#F2C777]/20 bg-[#732817] sm:min-h-[480px] ${
        isClassic ? 'lg:order-2' : ''
      }`}>
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={title}
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

      <div className={isClassic ? 'lg:order-1' : ''}>
        <p className="mb-4 text-xs font-black uppercase tracking-[0.28em] text-[#D96725]">
          POP Perote presenta
        </p>
        <h1 className="font-epilogue text-5xl font-black uppercase leading-[0.94] tracking-tighter text-[#F2C777] sm:text-6xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-6 max-w-xl text-xl font-bold leading-relaxed text-[#F2C894]">
            {subtitle}
          </p>
        )}
        {content && content !== subtitle && (
          <p className="mt-5 max-w-xl whitespace-pre-line text-base leading-relaxed text-white/80">
            {content}
          </p>
        )}

        <div className="mt-8 border-y border-[#F2C777]/20 py-5 text-sm text-[#F2C894]">
          <p className="font-bold text-white">{formatSchedule(promo)}</p>
          {(promo.dias_activos?.length ?? 0) > 0 && (
            <p className="mt-2 capitalize">Días aplicables: {promo.dias_activos?.join(', ')}</p>
          )}
          <p className={`mt-2 font-black uppercase tracking-widest ${promo.disponible_hoy ? 'text-[#F2C777]' : 'text-[#D96725]'}`}>
            {promo.disponible_hoy ? 'Disponible hoy' : 'Consulta el próximo día aplicable'}
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          {ctaLink(primaryCta, 'cta_primary_click', 'bg-[#D96725] px-7 py-4 text-center text-sm font-black uppercase tracking-widest text-white transition-colors hover:bg-[#F2C777] hover:text-[#0D0D0D]')}
          {ctaLink(secondaryCta, 'cta_secondary_click', 'border border-[#F2C777] px-7 py-4 text-center text-sm font-black uppercase tracking-widest text-[#F2C777] transition-colors hover:bg-[#F2C777] hover:text-[#0D0D0D]')}
        </div>

        {promo.form_enabled && formFields.length > 0 && (
          <PromoLeadForm slug={promo.slug || undefined} fields={formFields} preview={preview} />
        )}

        <a href={preview ? '#' : '/promociones'} className="mt-8 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#F2C894] transition-colors hover:text-[#F2C777]">
          <span aria-hidden="true">←</span>
          Todas las promociones
        </a>
      </div>
    </section>
  );
}
