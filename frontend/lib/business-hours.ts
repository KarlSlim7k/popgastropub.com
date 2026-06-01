/**
 * POP Perote business hours utility.
 * Hours: Mon/Wed-Thu 14:00-21:30, Fri-Sat 14:00-22:00, Sun 14:00-21:00, Tuesday CLOSED
 */

export const DIAS_SEMANA = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];

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
  return hora >= '14:00' && hora <= close;
}

export function getOpenStatus(): { isOpen: boolean; label: string } {
  const now = new Date();
  const day = now.getDay();
  const hour = now.getHours() + now.getMinutes() / 60;

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
