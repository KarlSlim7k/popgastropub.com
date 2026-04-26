import type { Metadata } from 'next';
import PageClient from './PageClient';

export const metadata: Metadata = {
  title: 'POP Perote | Sushi, Wings & Más en Perote, Veracruz',
  description: 'El mejor sushi de Perote. Justo Sierra No. 11. Ordena sushi, alitas, boneless y más.',
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Restaurant',
            name: 'POP Perote',
            image: 'https://popgastropub.com/images/logopop.png',
            address: {
              '@type': 'PostalAddress',
              streetAddress: 'Justo Sierra No. 11, Col. Amado Nervo',
              addressLocality: 'Perote',
              addressRegion: 'Veracruz',
              postalCode: '91270',
              addressCountry: 'MX',
            },
            telephone: '+522828253243',
            url: 'https://popgastropub.com',
            openingHoursSpecification: [
              {
                '@type': 'OpeningHoursSpecification',
                dayOfWeek: ['Monday', 'Wednesday', 'Thursday'],
                opens: '14:00',
                closes: '21:30',
              },
              {
                '@type': 'OpeningHoursSpecification',
                dayOfWeek: ['Friday', 'Saturday'],
                opens: '14:00',
                closes: '22:00',
              },
              {
                '@type': 'OpeningHoursSpecification',
                dayOfWeek: 'Sunday',
                opens: '14:00',
                closes: '21:00',
              },
            ],
            priceRange: '$',
            servesCuisine: ['Sushi', 'Alitas', 'Boneless', 'Snacks'],
          }),
        }}
      />
      <PageClient />
    </>
  );
}
