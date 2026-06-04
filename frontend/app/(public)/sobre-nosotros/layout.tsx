import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sobre Nosotros | POP Perote',
  description: 'Conoce el espacio de POP Perote. Sushi, alitas, mixología y ambiente en el corazón de Perote, Veracruz.',
};

export default function SobreNosotrosLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
