import type { Metadata } from 'next';
import PageClient from './PageClient';

export const metadata: Metadata = {
  title: 'Facturación CFDI | POP Perote',
  description: 'Solicita tu factura electrónica. Sube tu ticket y proporciona tus datos fiscales.',
};

export default function FacturacionPage() {
  return <PageClient />;
}
