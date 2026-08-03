export const NEW_CONTENT_DAYS = 5;

export function isWithinLastDays(dateValue: unknown, days = NEW_CONTENT_DAYS): boolean {
  if (!dateValue) return false;
  const date = new Date(dateValue as string | number | Date);
  if (Number.isNaN(date.getTime())) return false;
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
  return date.getTime() >= cutoff;
}

export function filterRecentByCreatedAt<T extends { createdAt?: unknown }>(
  items: T[],
  days = NEW_CONTENT_DAYS
): T[] {
  return items.filter((item) => isWithinLastDays(item.createdAt, days));
}
