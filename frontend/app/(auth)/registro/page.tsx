import { redirect } from 'next/navigation';

export default function RegistroPage() {
  redirect('/login?tab=register');
}
