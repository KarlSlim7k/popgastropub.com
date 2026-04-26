import type { Metadata } from 'next';
import PageClient from './PageClient';

export const metadata: Metadata = {
  title: 'Ubicación y Horarios | POP Perote',
  description: 'Encuéntranos en Justo Sierra No. 11, Col. Amado Nervo, Perote. Ver horarios y reserva.',
};

export default function UbicacionPage() {
  return <PageClient />;
}
