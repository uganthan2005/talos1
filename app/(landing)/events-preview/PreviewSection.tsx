import Link from "next/link";
import Container from "@/components/_core/layout/Container";
import DraggableEventsCarousel from "@/components/ui/DraggableEventsCarousel";
import type { Event } from "@/lib/api";
import eventsData from "@/events.json";

export default function PreviewSection() {
  type PreviewItem = { title: string; desc: string; tag: string; image: string; slug: string };

  // Map events from static JSON data
  const items: PreviewItem[] = (eventsData as Event[]).map((e: Event) => ({
    title: e.title,
    desc: e.description,
    tag: e.category,
    image: e.image_url,
    slug: e.event_id,
  }));

  const hasItems = items.length > 0;

  return (
    <section className="relative py-28 bg-black overflow-hidden">
      {/* HEADER */}
      <Container>
        <div className="mb-12 flex items-end justify-between">
          <div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-[family-name:var(--font-zen-dots)] tracking-tight text-white uppercase">
              Events<span className="text-red-600"> and </span>
              <span className="text-red-0">Workshops</span>
            </h2>
            <div className="mt-2 h-1 w-20 bg-gradient-to-r from-red-600 to-red-400 rounded-full" />
          </div>

          <Link
            href="/events"
            className="text-sm font-semibold text-red-500 hover:text-white transition-colors uppercase tracking-widest"
          >
            View All →
          </Link>
        </div>
      </Container>

      {hasItems ? (
        <DraggableEventsCarousel items={items} />
      ) : (
        <div className="flex h-64 items-center justify-center text-gray-500">
          <p>No events available at the moment.</p>
        </div>
      )}
    </section>
  );
}
