import PageSection from "@/components/_core/layout/PageSection";
import Link from "next/link";
import { FlipCard } from "@/components/ui/FlipCard";
import type { Workshop } from "@/lib/api";
import workshopsData from "@/workshops.json";

const WORKSHOP_IMAGES: Record<string, string> = {
  "byog-workshop": "/images/workshop-images/Build Your own Game.jpg",
  "cybersecurity-ai-workshop": "/images/workshop-images/Cyber Security an AI.jpg",
  "blockchain-workshop": "/images/workshop-images/Inside a block chain.jpg",
  "snn-workshop": "/images/workshop-images/Spiking Neural Network.jpg",
  "mcp-ai-workshop": "/images/workshop-images/MCP and AI.png",
};

export default function WorkshopsPage() {
  const workshops: Workshop[] = workshopsData as Workshop[];

  return (
    <PageSection title="Workshops" className="min-h-screen">
      {workshops.length === 0 ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-400">No workshops available at the moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workshops.map((workshop) => (
            <FlipCard
              key={workshop.workshop_id}
              backContent={
                <div className="flex h-full flex-col gap-2">
                  <h1 className="text-2xl font-bold text-red-600 zen-dots-regular flex-shrink-0">
                    {workshop.title}
                  </h1>
                  <p className="border-t border-t-gray-200/20 pt-3 pb-2 text-sm leading-relaxed ibm-plex-mono-semibold text-gray-300 line-clamp-3 flex-grow overflow-hidden">
                    {workshop.description}
                  </p>
                  <div className="flex flex-col gap-3 flex-shrink-0 mt-auto pt-2">
                    <div className="flex justify-between items-center text-xs font-mono text-gray-400">
                      <span>{workshop.instructor}</span>
                      <span>{workshop.duration}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="w-fit text-xs font-mono text-red-500 bg-red-500/10 px-2 py-1 rounded">
                        {workshop.date}, {workshop.time}
                      </span>
                      <span className="text-xs font-mono text-green-500 bg-green-500/10 px-2 py-1 rounded">
                        Rs.{workshop.registration_fee}
                      </span>
                    </div>
                    <Link
                      href={`/workshops/${workshop.workshop_id}`}
                      className="w-full text-center px-4 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors zen-dots-regular text-lg"
                    >
                      Register Now
                    </Link>
                  </div>
                </div>
              }
            >
              <div className="relative h-full w-full">
                <img
                  src={WORKSHOP_IMAGES[workshop.workshop_id] || workshop.image_url}
                  alt={workshop.title}
                  className="size-full rounded-2xl object-cover shadow-2xl shadow-black/40"
                />
                <div className="absolute inset-0 bg-black/30 rounded-2xl" />
                <div className="absolute bottom-4 left-4 text-3xl font-bold text-white drop-shadow-md zen-dots-regular">
                  {workshop.title}
                </div>
                <div className="absolute top-4 right-4">
                  <span className="text-xs font-bold bg-black/50 backdrop-blur-md text-white px-2 py-1 rounded border border-white/10">
                    {workshop.instructor}
                  </span>
                </div>
              </div>
            </FlipCard>
          ))}
        </div>
      )}
    </PageSection>
  );
}
