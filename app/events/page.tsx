import PageSection from "@/components/_core/layout/PageSection";
import Link from "next/link";
import { FlipCard } from "@/components/ui/FlipCard";
import type { Event } from "@/lib/api";
import eventsData from "@/events.json";

export default function EventsPage() {
  const events: Event[] = eventsData as Event[];

  const techEvents = events.filter(event => event.category === "Technical");
  const nonTechEvents = events.filter(event => event.category === "Non-Technical");
  const onlineEvents = events.filter(event => event.category === "Online");

  // Sort tech events to place "Stranger Codes" first
  const sortedTechEvents = techEvents.sort((a, b) => {
    if (a.event_id === "strangercodes") return -1;
    if (b.event_id === "strangercodes") return 1;
    return 0;
  });

  console.log('All events:', events);
  console.log('Online events:', onlineEvents);
  console.log('Tech events:', techEvents);
  console.log('Non-tech events:', nonTechEvents);

  const renderEventCard = (event: Event) => (
    <FlipCard
      key={event.event_id}
      backContent={
        <div className="flex h-full flex-col gap-2">
          <h1 className="text-2xl font-bold text-red-600 zen-dots-regular flex-shrink-0">{event.title}</h1>
          <p className="border-t border-t-gray-200/20 pt-3 pb-2 text-sm leading-relaxed ibm-plex-mono-semibold text-gray-300 line-clamp-3 flex-grow overflow-hidden">
            {event.description}
          </p>
          <div className="flex flex-col gap-3 flex-shrink-0 mt-auto pt-2">
            <span className="w-fit text-xs font-mono text-red-500 bg-red-500/10 px-2 py-1 rounded">
              {event.date}, {event.time}
            </span>
            <Link 
              href={`/events/${event.event_id}`} 
              className="w-full text-center px-4 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors zen-dots-regular text-lg"
            >
              View Details
            </Link>
          </div>
        </div>
      }
    >
      <div className="relative h-full w-full">
        <img
          src={event.image_url}
          alt={event.title}
          className="size-full rounded-2xl object-cover shadow-2xl shadow-black/40"
        />
        <div className="absolute inset-0 bg-black/30 rounded-2xl" />
        <div className="absolute bottom-4 left-4 text-3xl font-bold text-white drop-shadow-md zen-dots-regular">
          {event.title}
        </div>
        <div className="absolute top-4 right-4">
          <span className="text-xs font-bold bg-black/50 backdrop-blur-md text-white px-2 py-1 rounded border border-white/10">
            {event.category}
          </span>
        </div>
        {event.is_team_event && (
          <div className="absolute top-4 left-4">
            <span className="text-xs font-bold bg-red-600/80 backdrop-blur-md text-white px-2 py-1 rounded">
              Team Event
            </span>
          </div>
        )}
      </div>
    </FlipCard>
  );

  return (
    <PageSection title="Events" className="min-h-screen">
      {events.length === 0 ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-400">No events available at the moment.</p>
        </div>
      ) : (
        <div className="space-y-12">
          {sortedTechEvents.length > 0 && (
            <div>
              <div className="mb-6">
                <h2 className="text-3xl font-bold text-red-600 zen-dots-regular">Tech Events</h2>
                <div className="mt-2 h-1 w-20 bg-gradient-to-r from-red-600 to-red-400 rounded-full" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedTechEvents.map(renderEventCard)}
              </div>
            </div>
          )}
          {nonTechEvents.length > 0 && (
            <div>
              <div className="mb-6">
                <h2 className="text-3xl font-bold text-red-600 zen-dots-regular">Vibe Zone</h2>
                <div className="mt-2 h-1 w-20 bg-gradient-to-r from-red-600 to-red-400 rounded-full" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {nonTechEvents.map(renderEventCard)}
              </div>
            </div>
          )}
          {onlineEvents.length > 0 && (
            <div>
              <div className="mb-6">
                <h2 className="text-3xl font-bold text-red-600 zen-dots-regular">Online Events</h2>
                <div className="mt-2 h-1 w-20 bg-gradient-to-r from-red-600 to-red-400 rounded-full" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {onlineEvents.map(renderEventCard)}
              </div>
            </div>
          )}
        </div>
      )}
    </PageSection>
  );
}
