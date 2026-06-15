import { fetchAPI } from './api';

export type TierSlug = 'fan' | 'lover' | 'vip' | 'elite';

export interface Recompensa {
  id: number;
  nombre: string;
  descripcion: string | null;
  puntos_requeridos: number;
  imagen: string | null;
  disponible: boolean;
  categoria: string;
  tier: TierSlug;
}

export async function fetchPublicRecompensas(): Promise<Recompensa[]> {
  return fetchAPI<Recompensa[]>('/recompensas');
}
