'use client';

import { linkifyTextNodes } from '@/lib/linkify';

type LinkifiedTextProps = {
  text: string;
  className?: string;
  linkClassName?: string;
  as?: 'p' | 'span' | 'div';
};

export function LinkifiedText({
  text,
  className,
  linkClassName,
  as: Tag = 'p',
}: LinkifiedTextProps) {
  if (!text) return null;

  return <Tag className={className}>{linkifyTextNodes(text, linkClassName)}</Tag>;
}
