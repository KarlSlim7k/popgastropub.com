import type { Metadata } from 'next';
import OrderPanel from '../../../components/order/OrderPanel';

export const metadata: Metadata = {
  title: 'Tu Pedido | POP Perote',
  description: 'Revisa tu carrito y confirma tu orden por WhatsApp.',
};

export default function OrderPage() {
  return <OrderPanel mode="page" />;
}
