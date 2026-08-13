import type { Metadata } from 'next';
import MenuExperience from '@/components/menu/MenuExperience';
import { menuSections } from '@/components/order/order-data';

export const metadata: Metadata = {
  title: 'Menú | Sushi, Wings y Boneless en Perote — POP Perote',
  description: 'Explora el menú completo de POP Perote: rolls de sushi, alitas, boneless, charolas para compartir, postres, cocteles y más. Ordena en línea o visítanos en Perote, Veracruz.',
  keywords: 'menu, carta, sushi, alitas, boneless, perote, veracruz, pop perote, cocteles, precios',
  openGraph: {
    title: 'Menú | POP Perote',
    description: 'Rolls de sushi, alitas, boneless, charolas para compartir, postres y cocteles. Ordena en línea o visítanos en Perote.',
    type: 'website',
    locale: 'es_MX',
  },
};

const MENU_SCHEMA_SECTIONS = menuSections.filter((section) => section.id !== 'juegos');

export default function MenuPage() {
  const menuJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Menu',
    name: 'Menú POP Perote',
    inLanguage: 'es-MX',
    hasMenuSection: MENU_SCHEMA_SECTIONS.map((section) => ({
      '@type': 'MenuSection',
      name: section.title,
      hasMenuItem: section.items.map((item) => ({
        '@type': 'MenuItem',
        name: item.name,
        description: item.description || undefined,
        offers: {
          '@type': 'Offer',
          price: item.price,
          priceCurrency: 'MXN',
        },
      })),
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(menuJsonLd) }}
      />
      <MenuExperience />
    </>
  );
}
