import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'POP Points | Programa de Lealtad | POP Perote',
  description: 'Gana puntos con cada visita y canjéalos por recompensas exclusivas. Únete al programa POP Points.',
};

export default function PopPointsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
