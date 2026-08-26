/**
 * Limpia solo lo peligroso. Conserva la estructura/formato de Quill
 * para que la vista pública se vea como en el editor.
 */
export function enhanceBlogHtml(html: string): string {
  if (!html || typeof html !== 'string') return '';

  return html
    .trim()
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
    .replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    .replace(/javascript:/gi, '');
}

export function enhanceBlogTitle(title: string): string {
  return title.replace(/\s+/g, ' ').trim();
}
