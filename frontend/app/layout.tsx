import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import CustomCursor from '../components/ui/CustomCursor'
import ToasterProvider from '@/components/ui/ToasterProvider'
import { AuthProvider } from '@/lib/auth-provider'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://popgastropub.com'),
  title: 'POP Perote | Sushi, Wings & Más',
  description: 'El mejor sushi en Perote, Veracruz. Justo Sierra No. 11, Col. Amado Nervo. Ordena ahora.',
  keywords: 'sushi, perote, veracruz, wings, restaurante, pop perote',
  icons: {
    icon: '/images/logopop.png',
    shortcut: '/images/logopop.png',
    apple: '/images/logopop.png',
  },
  openGraph: {
    type: 'website',
    locale: 'es_MX',
    siteName: 'POP Perote',
    title: 'POP Perote | Sushi, Wings & Más',
    description: 'El mejor sushi en Perote, Veracruz. Justo Sierra No. 11, Col. Amado Nervo. Ordena ahora.',
    images: [{ url: '/images/entrada_pop_horizontal.webp', width: 1600, height: 1066, alt: 'Entrada del restaurante POP Perote' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'POP Perote | Sushi, Wings & Más',
    description: 'El mejor sushi en Perote, Veracruz. Justo Sierra No. 11, Col. Amado Nervo. Ordena ahora.',
    images: ['/images/entrada_pop_horizontal.webp'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Epilogue:wght@400;500;600;700;800;900&family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=optional"
        />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <CustomCursor />
          <ToasterProvider />
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
