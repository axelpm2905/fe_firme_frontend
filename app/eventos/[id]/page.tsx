import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { EventDetailContent } from '@/components/pages/EventDetailContent';
import { getEvent, getEvents } from '@/lib/events';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

export const dynamicParams = true;

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const event = await getEvent(params.id);
  if (!event) {
    return { title: 'Evento no encontrado' };
  }

  return {
    title: `${event.title} | Fe Firme`,
    description: event.description?.substring(0, 160) || event.title,
  };
}

export async function generateStaticParams() {
  try {
    const events = await getEvents();
    return events.map((event) => ({ id: event.id }));
  } catch {
    return [];
  }
}

export default async function EventDetailPage({ params }: { params: { id: string } }) {
  const event = await getEvent(params.id);

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
