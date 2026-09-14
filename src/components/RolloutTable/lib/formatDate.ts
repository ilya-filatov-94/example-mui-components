import type { DateLike, IsoDateArray } from '../types';

const pad = (n: number) => String(n).padStart(2, '0');

function toDate(value: number | IsoDateArray): Date | null {
  if (typeof value === 'number') {
    const ms = value < 1e12 ? value * 1000 : value;
    const d = new Date(ms);
    return Number.isNaN(d.getTime()) ? null : d;
  }
  const [year, month, day, hour = 0, minute = 0, second = 0] = value;
  const d = new Date(year, month - 1, day, hour, minute, second);
  return Number.isNaN(d.getTime()) ? null : d;
}

export function formatDateTime(value: DateLike): string {
  if (value == null) return '—';
  const d = toDate(value);
  if (!d) return '—';
  return `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
