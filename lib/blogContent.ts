/**
 * Limpia y normaliza el HTML del editor para una lectura más clara.
 * No cambia el sentido del contenido; solo estructura y formato.
 */
export function enhanceBlogHtml(html: string): string {
  if (!html || typeof html !== 'string') return '';

  let content = html.trim();

  // Quitar scripts / eventos peligrosos
  content = content
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
    .replace(/\son\w+="[^"]*"/gi, '')
    .replace(/\son\w+='[^']*'/gi, '')
    .replace(/javascript:/gi, '');

  // Normalizar nbsp y espacios raros
  content = content
    .replace(/&nbsp;/gi, ' ')
    .replace(/\u00a0/g, ' ')
    .replace(/[ \t]{2,}/g, ' ');

  // Quitar párrafos vacíos típicos de Quill
  content = content
    .replace(/<p>\s*<br\s*\/?>\s*<\/p>/gi, '')
    .replace(/<p>\s*<\/p>/gi, '')
    .replace(/(<br\s*\/?>\s*){3,}/gi, '<br><br>');

  // Envolver texto suelto al inicio si no hay etiquetas de bloque
  if (content && !/^<(p|h[1-6]|ul|ol|blockquote|div|pre)/i.test(content)) {
    content = `<p>${content}</p>`;
  }

  // Convertir divs simples de Quill a párrafos cuando solo contienen texto
  content = content.replace(/<div>([\s\S]*?)<\/div>/gi, (_m, inner: string) => {
    const trimmed = String(inner).trim();
    if (!trimmed) return '';
    if (/<(p|h[1-6]|ul|ol|blockquote|div)/i.test(trimmed)) return `<div>${trimmed}</div>`;
    return `<p>${trimmed}</p>`;
  });

  // Asegurar que imágenes tengan estilo seguro
  content = content.replace(/<img([^>]*?)>/gi, (_m, attrs: string) => {
    let a = attrs;
    if (!/style=/i.test(a)) {
      a += ' style="max-width:100%;height:auto;border-radius:12px;"';
    }
    if (!/alt=/i.test(a)) {
      a += ' alt=""';
    }
    return `<img${a}>`;
  });

  // Limpiar espacios entre etiquetas de bloque
  content = content
    .replace(/>\s+</g, '><')
    .replace(/(<\/p>)(<p>)/gi, '$1\n$2')
    .replace(/(<\/h[1-6]>)(<p>)/gi, '$1\n$2');

  return content.trim();
}

export function enhanceBlogTitle(title: string): string {
  return title
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/^./, (c) => c.toUpperCase());
}
