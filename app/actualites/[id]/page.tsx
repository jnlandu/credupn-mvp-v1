import { notFound } from 'next/navigation';
import { events } from '@/lib/events';
import EventView from './EventView';
import type { Event } from '@/types/event';

// Generate static paths
export function generateStaticParams(): Array<{ id: string }> {
  return events.map((event) => ({
    id: event.id,
  }));
}

// Simplified page props
type PageProps = {
  params: { id: string };
  searchParams?: Record<string, string | string[] | undefined>;
};

export default function Page({ params }: PageProps) {
  const { id } = params as { id: string };
  console.log('params', params);
  console.log('id', id);

  const event = events.find((e) => e.id === id);

  if (!event) {
    notFound();
  }

  return <EventView event={event} />;
}
