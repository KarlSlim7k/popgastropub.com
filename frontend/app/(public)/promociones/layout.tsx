import React from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Promociones | POP Perote',
  description: 'Descubre las promociones activas de POP Perote. Sushi, wings, boneless y más con descuentos especiales. ¡Aprovecha nuestras ofertas!',
  keywords: 'promociones, sushi, perote, veracruz, descuentos, ofertas, pop perote, alitas, wings',
  openGraph: {
    title: 'Promociones | POP Perote',
    description: 'Descubre las promociones activas de POP Perote. ¡Aprovecha nuestras ofertas!',
    type: 'website',
    locale: 'es_MX',
  },
}

export default function PromocionesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
