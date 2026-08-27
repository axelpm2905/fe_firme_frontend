import { api } from './api';
import type { Event } from '@/types';
import { uploadBlogImage } from './blogs';
import { dateOnlyInManagua, formatInManagua } from './timezone';

const toEvent = (e: Record<string, unknown>): Event => ({
  id: String(e.id),
  title: e.title as string,
  slug: (e.slug as string) || String(e.id),
  date: normalizeEventDate(e.date),
  time: (e.time as string) || '',
  location: (e.location as string) || '',
  description: (e.description as string) || '',
  image: (e.image as string) || '',
  createdAt: e.createdAt as string,
  updatedAt: e.updatedAt as string | undefined,
});

/** Normaliza a YYYY-MM-DD (sin hora/zona). */
export function normalizeEventDate(value: unknown): string {
  if (value == null) return '';
  const raw = String(value);
  const match = raw.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (match) return `${match[1]}-${match[2]}-${match[3]}`;
  return raw;
}

/** Fecha de evento interpretada en zona de Nicaragua. */
export function parseEventDate(date: string): Date {
  return dateOnlyInManagua(normalizeEventDate(date)) ?? new Date(date);
}

/** Formatea la fecha del evento siempre en America/Managua. */
export function formatEventDate(
  date: string,
  style: 'short' | 'long' = 'short',
  lang: 'es' | 'en' = 'es'
): string {
  const parsed = parseEventDate(date);
  if (Number.isNaN(parsed.getTime())) return date;

  if (style === 'long') {
    return formatInManagua(
      parsed,
      { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' },
      lang
    );
  }

  return formatInManagua(
    parsed,
    { day: '2-digit', month: 'long', year: 'numeric' },
    lang
  );
}

export const getEvents = async (): Promise<Event[]> => {
  try {
    const data = await api<Record<string, unknown>[]>('/api/events');
    return data.map(toEvent);
  } catch {
    return [];
  }
};

export const getEvent = async (id: string): Promise<Event | null> => {
  try {
    const data = await api<Record<string, unknown>>(`/api/events/${id}`);
    return toEvent(data);
  } catch {
    return null;
  }
};

export const getEventBySlug = async (slug: string): Promise<Event | null> => {
  try {
    const data = await api<Record<string, unknown>>(
      `/api/events/slug/${encodeURIComponent(slug)}`
    );
    return toEvent(data);
  } catch {
    return null;
  }
};

export const createEvent = async (
  event: Omit<Event, 'id' | 'createdAt' | 'slug'>
): Promise<string> => {
  const res = await api<{ id: string }>('/api/events', {
    method: 'POST',
    body: JSON.stringify({
      title: event.title,
      date: event.date,
      time: event.time || null,
      location: event.location || null,
      description: event.description || null,
      image: event.image || null,
    }),
  });
  return res.id;
};

export const updateEvent = async (
  id: string,
  updates: Partial<Event>
): Promise<void> => {
  await api(`/api/events/${id}`, {
    method: 'PUT',
    body: JSON.stringify({
      title: updates.title,
      date: updates.date,
      time: updates.time,
      location: updates.location,
      description: updates.description,
      image: updates.image ?? null,
    }),
  });
};

export const deleteEvent = async (id: string): Promise<void> => {
  await api(`/api/events/${id}`, { method: 'DELETE' });
};

export const uploadEventImage = uploadBlogImage;

/**
 * Convierte "HH:mm" (24h) a 12 horas.
 * La hora del evento se trata como hora local de Nicaragua.
 */
export function formatEventTime(time: string, lang: 'es' | 'en' = 'es'): string {
  const match = time.trim().match(/^(\d{1,2}):(\d{2})/);
  if (!match) return time;

  const hour24 = Number(match[1]);
  const minutes = match[2];
  if (Number.isNaN(hour24) || hour24 < 0 || hour24 > 23) return time;

  const hour12 = hour24 % 12 || 12;
  const isPm = hour24 >= 12;
  const suffix =
    lang === 'en' ? (isPm ? 'PM' : 'AM') : isPm ? 'p. m.' : 'a. m.';

  return `${hour12}:${minutes} ${suffix}`;
}
