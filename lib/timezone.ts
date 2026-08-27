/** Zona horaria oficial del sitio: Nicaragua (sin horario de verano). */
export const APP_TIMEZONE = 'America/Managua';

export function localeForLang(lang: 'es' | 'en'): string {
  return lang === 'es' ? 'es-NI' : 'en-US';
}

/**
 * Interpreta YYYY-MM-DD como día civil en Nicaragua
 * (mediodía Managua para evitar bordes de día).
 */
export function dateOnlyInManagua(date: string): Date | null {
  const match = String(date).trim().match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return null;
  // America/Managua = UTC-6 todo el año
  return new Date(`${match[1]}-${match[2]}-${match[3]}T12:00:00-06:00`);
}

export function formatInManagua(
  date: Date,
  options: Intl.DateTimeFormatOptions,
  lang: 'es' | 'en' = 'es'
): string {
  return new Intl.DateTimeFormat(localeForLang(lang), {
    timeZone: APP_TIMEZONE,
    ...options,
  }).format(date);
}
