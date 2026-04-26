import type { Metadata } from 'next';
import MenuExperience from '../../../components/menu/MenuExperience';

export const metadata: Metadata = {
  title: 'Menú | POP Perote',
  description: 'Explora nuestro menú completo: sushi, alitas, boneless, crepas, snacks y bebidas.',
};

export default function MenuPage() {
  return <MenuExperience />;
}
