"use client";

import { useParams, useRouter } from "next/navigation";
import type { User as FirebaseUser } from "firebase/auth";
import PageSection from "@/components/_core/layout/PageSection";
import Link from "next/link";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import type { Event } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import eventsData from "@/events.json";

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth() as { user: FirebaseUser | null; loading: boolean };
  const eventId = params.slug as string;

  // Find event from static JSON data
  const event: Event | null = (eventsData as Event[]).find(e => e.event_id === eventId) || null;
  const registering = false;

  const handleRegister = async () => {
    if (!user) {
      router.push("/login");
      return;
    }

    if (!event) return;

    // All events are team-based, redirect to registration page
    router.push(`/register/${eventId}`);
  };

  if (!event) {
    return (
      <PageSection title="Event Details" className="min-h-screen">
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <p className="text-red-500 mb-4">Event not found</p>
          <Link
            href="/events"
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Back to Events
          </Link>
        </div>
      </PageSection>
    );
  }

  return (
    <PageSection title="Event Details" className="min-h-screen">
      <div className="max-w-4xl mx-auto">
        <CardContainer className="w-full py-10">
          <CardBody className="w-full h-auto">
            <CardItem translateZ="100" className="w-full">
              <div 
                className="h-64 bg-gradient-to-r from-red-900 to-black rounded-xl flex items-end p-8 border border-white/10 shadow-2xl shadow-red-500/10 relative overflow-hidden"
                style={{
                  backgroundImage: `linear-gradient(to right, rgba(127, 29, 29, 0.9), rgba(0, 0, 0, 0.9)), url(${event.image_url})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <div>
                  <span className="text-xs font-bold bg-red-600/80 text-white px-2 py-1 rounded mb-2 inline-block font-ibm-plex-mono">
                    {event.category}
                  </span>
                  <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter font-zen-dots">
                    {event.title}
                  </h1>
                </div>
              </div>
            </CardItem>
          </CardBody>
        </CardContainer>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            <div className="prose prose-invert max-w-none">
              <h3 className="text-3xl md:text-4xl font-bold font-zen-dots text-[#dc2626] mb-4">
                Description
              </h3>
              <p className="text-muted-foreground leading-relaxed font-ibm-plex-mono text-lg font-bold whitespace-pre-line">
                {event.main_description || event.description}
              </p>
            </div>

            {event.rules && (
              <div className="bg-muted/20 p-6 rounded-xl border border-white/5">
                <h3 className="text-3xl md:text-4xl font-bold font-zen-dots text-[#dc2626] mb-4">
                  Rules
                </h3>
                <p className="text-gray-400 font-ibm-plex-mono font-bold text-base whitespace-pre-line">
                  {event.rules}
                </p>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-muted/20 p-6 rounded-xl border border-white/5">
              <h4 className="text-xl font-bold font-zen-dots text-[#dc2626] mb-4">
                Event Info
              </h4>
              <div className="space-y-4 text-base font-bold font-ibm-plex-mono">
                <div className="flex justify-between">
                  <span className="text-gray-500">Date</span>
                  <span className="text-white">{event.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Time</span>
                  <span className="text-white">{event.time}</span>
                </div>
                {event.venue && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Venue</span>
                    <span className="text-white">{event.venue}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-500">Fee</span>
                  {(event.registration_fee ?? 0) > 0 ? (
                    <span className="text-red-400">₹{event.registration_fee}</span>
                  ) : (
                    <span className="text-green-400">Free</span>
                  )}
                </div>
                {event.max_participants && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Capacity</span>
                    <span className="text-white">{event.max_participants}</span>
                  </div>
                )}
              </div>

              {/* Organiser Details Box */}
              {event.organiser && event.organiser.name && (
                <div className="mt-6 pt-6 border-t border-white/10">
                  <h5 className="text-lg font-bold font-zen-dots text-[#dc2626] mb-3">
                    Organiser Details
                  </h5>
                  <div className="space-y-3 text-base font-bold font-ibm-plex-mono">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Name</span>
                      <span className="text-white">{event.organiser.name}</span>
                    </div>
                    {event.organiser.contact && event.organiser.contact.length > 0 && (
                      <div>
                        <span className="text-gray-500 block mb-1">Contact No</span>
                        <div className="space-y-1 text-right">
                          {event.organiser.contact.map((contact, index) => (
                            <a
                              key={index}
                              href={`tel:${contact}`}
                              className="text-white hover:text-red-500 transition-colors block"
                            >
                              {contact}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <button
                onClick={handleRegister}
                disabled={registering || event.status !== "open"}
                className="block w-full text-center bg-red-600 text-white py-3 rounded-lg font-bold text-sm mt-6 hover:bg-red-700 transition-all shadow-[0_0_15px_rgba(220,38,38,0.5)] hover:shadow-[0_0_25px_rgba(220,38,38,0.8)] disabled:opacity-50 disabled:cursor-not-allowed font-zen-dots"
              >
                {registering
                  ? "Registering..."
                  : event.status !== "open"
                  ? "Registration Closed"
                  : user
                  ? "Register Now"
                  : "Login to Register"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </PageSection>
  );
}
