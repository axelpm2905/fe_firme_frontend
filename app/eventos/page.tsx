import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { EventosContent } from '@/components/pages/EventosContent';
import { getEvents } from '@/lib/events';

export default async function EventosPage() {
  const events = await getEvents();

  return (
    <>
      <Header />
      <EventosContent events={events} />
      <Footer />
    </>
  );
}
