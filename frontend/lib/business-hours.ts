/**
 * POP Perote business hours utility.
 * Hours: Mon/Wed-Thu 14:00-21:30, Fri-Sat 14:00-22:00, Sun 14:00-21:00, Tuesday CLOSED
 */

export const DIAS_SEMANA = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
export const RESTAURANT_TIME_ZONE = 'America/Mexico_City';

const WEEKDAY_INDEX: Record<string, number> = {
  Sunday: 0,
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
};

export function getRestaurantDateParts(date = new Date()): { date: string; dayOfWeek: number; hour: number; minute: number } {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: RESTAURANT_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    weekday: 'long',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date);
  const get = (type: Intl.DateTimeFormatPartTypes) => parts.find((part) => part.type === type)?.value ?? '';

  return {
    date: `${get('year')}-${get('month')}-${get('day')}`,
    dayOfWeek: WEEKDAY_INDEX[get('weekday')] ?? 0,
    hour: Number(get('hour')),
    minute: Number(get('minute')),
  };
}

export function getRestaurantDateString(date = new Date()): string {
  return getRestaurantDateParts(date).date;
}

export function getRestaurantDayOfWeek(date = new Date()): number {
  return getRestaurantDateParts(date).dayOfWeek;
}

export function getDayOfWeekFromDateString(date: string): number {
  const [year, month, day] = date.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day)).getUTCDay();
}

export const SCHEDULE = [
  { day: 'Domingo', short: 'Dom', open: '14:00', close: '21:00' },
  { day: 'Lunes', short: 'Lun', open: '14:00', close: '21:30' },
  { day: 'Martes', short: 'Mar', open: null, close: null }, // CLOSED
  { day: 'Miércoles', short: 'Mié', open: '14:00', close: '21:30' },
  { day: 'Jueves', short: 'Jue', open: '14:00', close: '21:30' },
  { day: 'Viernes', short: 'Vie', open: '14:00', close: '22:00' },
  { day: 'Sábado', short: 'Sáb', open: '14:00', close: '22:00' },
];

export function getCloseTime(dayOfWeek: number): string | null {
  // dayOfWeek: 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat
  if (dayOfWeek === 2) return null; // Closed
  if (dayOfWeek === 5 || dayOfWeek === 6) return '22:00';
  if (dayOfWeek === 0) return '21:00';
  return '21:30';
}

export function isClosed(dayOfWeek: number): boolean {
  return dayOfWeek === 2;
}

export function isWithinHours(hora: string, dayOfWeek: number): boolean {
  const close = getCloseTime(dayOfWeek);
  if (!close) return false;
  return hora >= '14:00' && hora < close;
}

export function getOpenStatus(): { isOpen: boolean; label: string } {
  const now = getRestaurantDateParts();
  const day = now.dayOfWeek;
  const hour = now.hour + now.minute / 60;

  if (isClosed(day)) return { isOpen: false, label: 'Cerrado hoy (Martes)' };

  const close = getCloseTime(day);
  if (!close) return { isOpen: false, label: 'Cerrado' };

  const closeHour = parseInt(close.split(':')[0]) + parseInt(close.split(':')[1]) / 60;

  if (hour >= 14 && hour < closeHour) {
    return { isOpen: true, label: `Abierto hasta ${close}` };
  }

  if (hour < 14) return { isOpen: false, label: 'Abre a las 14:00' };
  return { isOpen: false, label: 'Cerrado' };
}

export const SCHEDULE_TEXT = 'Lun/Mié-Jue 14:00-21:30 · Vie-Sáb 14:00-22:00 · Dom 14:00-21:00 · Martes cerrado';
