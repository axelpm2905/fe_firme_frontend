import type { ReactNode } from 'react';

const URL_PATTERN = /(https?:\/\/[^\s<>"']+|www\.[^\s<>"']+)/gi;

function splitTrailingPunctuation(raw: string): { url: string; trailing: string } {
  let url = raw;
  let trailing = '';
  while (url.length > 0 && /[.,;:!?)\]}'"]$/.test(url)) {
    trailing = url.slice(-1) + trailing;
    url = url.slice(0, -1);
  }
  return { url, trailing };
}

function toHref(url: string): string {
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
}

/**
 * Convierte URLs en texto plano a nodos React con <a>.
 */
export function linkifyTextNodes(text: string, linkClassName?: string): ReactNode[] {
  if (!text) return [];

  const nodes: ReactNode[] = [];
  const re = new RegExp(URL_PATTERN.source, 'gi');
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = re.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }

    const { url, trailing } = splitTrailingPunctuation(match[0]);
    if (url) {
      nodes.push(
        <a
          key={`link-${key++}`}
          href={toHref(url)}
          target="_blank"
          rel="noopener noreferrer"
          className={
            linkClassName ||
            'text-navy font-medium underline underline-offset-2 break-all hover:text-navy-dark'
          }
          onClick={(e) => e.stopPropagation()}
        >
          {url}
        </a>
      );
    }
    if (trailing) nodes.push(trailing);
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes.length > 0 ? nodes : [text];
}

/**
 * En HTML, convierte URLs sueltas (no dentro de etiquetas ni de <a>) en enlaces.
 */
export function linkifyHtml(html: string): string {
  if (!html) return '';

  const parts = html.split(/(<a\b[^>]*>[\s\S]*?<\/a>)/gi);

  return parts
    .map((part) => {
      if (/^<a\b/i.test(part)) return part;

      return part.replace(/(^|>)([^<]+)(?=<|$)/g, (_full, prefix: string, text: string) => {
        const linked = text.replace(URL_PATTERN, (raw) => {
          const { url, trailing } = splitTrailingPunctuation(raw);
          if (!url) return raw;
          const href = toHref(url);
          return `<a href="${href}" target="_blank" rel="noopener noreferrer">${url}</a>${trailing}`;
        });
        return `${prefix}${linked}`;
      });
    })
    .join('');
}
