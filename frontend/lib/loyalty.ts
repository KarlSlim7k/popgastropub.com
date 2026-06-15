import { fetchAPI } from './api';

export interface Tier {
  id: number;
  name: string;
  slug: string;
  range: string;
  min_points: number;
  max_points: number | null;
  color: string;
  bg_color: string;
  border_color: string;
  icon: string;
  benefits: string[];
  investment_text: string | null;
  is_featured: boolean;
  sort_order: number;
}

export interface PointAction {
  id: number;
  action: string;
  slug: string;
  points: number;
  points_type: 'fixed' | 'per_amount' | 'multiplier';
  icon: string;
  color: string;
  description: string | null;
  is_active: boolean;
  sort_order: number;
}

export const TIER_LABEL: Record<string, string> = {
  fan: 'Desde Fan',
  lover: 'Lover+',
  vip: 'VIP+',
  elite: 'Elite',
};

export async function fetchPublicTiers(): Promise<Tier[]> {
  return fetchAPI<Tier[]>('/loyalty/tiers');
}

export async function fetchPublicPointActions(): Promise<PointAction[]> {
  return fetchAPI<PointAction[]>('/loyalty/point-actions');
}

export function formatPointsDisplay(action: PointAction): string {
  switch (action.points_type) {
    case 'multiplier':
      return `${action.points}x pts`;
    case 'per_amount':
      return `${action.points} pt`;
    default:
      return `${action.points} pts`;
  }
}
