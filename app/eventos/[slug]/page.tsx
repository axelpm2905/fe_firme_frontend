import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { EventDetailContent } from '@/components/pages/EventDetailContent';
import { getEventBySlug, getEvents } from '@/lib/events';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

export const dynamicParams = true;

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const event = await getEventBySlug(params.slug);
  if (!event) {
    return { title: 'Evento no encontrado' };
  }

  return {
    title: `${event.title} | Fe Firme`,
    description: event.description?.substring(0, 160) || event.title,
    openGraph: {
      title: event.title,
      description: event.description?.substring(0, 160) || event.title,
      images: event.image ? [event.image] : [],
    },
  };
}

export async function generateStaticParams() {
  try {
    const events = await getEvents();
    return events.map((event) => ({ slug: event.slug }));
  } catch {
    return [];
  }
}

export default async function EventDetailPage({ params }: { params: { slug: string } }) {
  const event = await getEventBySlug(params.slug);

  if (!event) {
    notFound();
  }

  return (
    <>
      <Header />
      <EventDetailContent event={event} />
      <Footer />
    </>
  );
}
