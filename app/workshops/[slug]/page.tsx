"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import type { User as FirebaseUser } from "firebase/auth";
import PageSection from "@/components/_core/layout/PageSection";
import Link from "next/link";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import type { Workshop } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import workshopsData from "@/workshops.json";

declare global {
  interface Window {
    Razorpay?: {
      new (options: Record<string, unknown>): { open: () => void };
    };
  }
}

export default function WorkshopDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth() as { user: FirebaseUser | null; loading: boolean };
  const workshopId = params.slug as string;

  // Find workshop from static JSON data
  const workshop: Workshop | null = (workshopsData as Workshop[]).find(w => w.workshop_id === workshopId) || null;
  const processing = false;

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleRegister = async () => {
    if (!user) {
      router.push("/login");
      return;
    }

    if (!workshop) return;

    // Redirect to workshop registration page
    router.push(`/workshops/${workshopId}/register`);
  };

  if (!workshop) {
    return (
      <PageSection title="Workshop Details" className="min-h-screen">
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <p className="text-red-500 mb-4">Workshop not found</p>
          <Link
            href="/workshops"
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Back to Workshops
          </Link>
        </div>
      </PageSection>
    );
  }

  return (
    <PageSection title="Workshop Details" className="min-h-screen">
      <div className="max-w-4xl mx-auto">
        <CardContainer className="w-full py-10">
          <CardBody className="w-full h-auto">
            <CardItem translateZ="100" className="w-full">
              <div
                className="h-64 bg-gradient-to-r from-red-900 to-black rounded-xl flex items-end p-8 border border-white/10 shadow-2xl shadow-red-500/10 relative overflow-hidden"
                style={{
                  backgroundImage: `linear-gradient(to right, rgba(127, 29, 29, 0.9), rgba(0, 0, 0, 0.9)), url(${workshop.image_url})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter font-zen-dots">
                  {workshop.title}
                </h1>
              </div>
            </CardItem>
          </CardBody>
        </CardContainer>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            <div className="prose prose-invert max-w-none">
              <h3 className="text-3xl md:text-4xl font-bold font-zen-dots text-[#dc2626] mb-4">
                Overview
              </h3>
              <p className="text-muted-foreground leading-relaxed font-ibm-plex-mono text-lg font-bold whitespace-pre-line">
                {workshop.main_description || workshop.description}
              </p>
            </div>

            {workshop.rules && (
              <div className="bg-muted/20 p-6 rounded-xl border border-white/5">
                <h3 className="text-3xl md:text-4xl font-bold font-zen-dots text-[#dc2626] mb-4">
                  Rules
                </h3>
                <p className="text-gray-400 font-ibm-plex-mono font-bold text-base whitespace-pre-line">
                  {workshop.rules}
                </p>
              </div>
            )}

            <div className="bg-muted/20 p-6 rounded-xl border border-white/5">
              <h3 className="text-3xl md:text-4xl font-bold font-zen-dots text-[#dc2626] mb-4">
                Instructor
              </h3>
              <p className="text-gray-400 font-ibm-plex-mono font-bold text-lg">
                {workshop.instructor}
              </p>
            </div>

            {workshop.organisers && workshop.organisers.length > 0 && (
              <div className="bg-muted/20 p-6 rounded-xl border border-white/5">
                <h3 className="text-3xl md:text-4xl font-bold font-zen-dots text-[#dc2626] mb-4">
                  Organisers
                </h3>
                <div className="space-y-3">
                  {workshop.organisers.map((organiser, index) => (
                    <div key={index} className="text-gray-400 font-ibm-plex-mono font-bold">
                      <p className="text-white text-lg">{organiser.name}</p>
                      <p className="text-sm">{organiser.phone}</p>
                      {organiser.role && <p className="text-sm text-gray-500">{organiser.role}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-muted/20 p-6 rounded-xl border border-white/5">
              <h4 className="text-xl font-bold font-zen-dots text-[#dc2626] mb-4">
                Details
              </h4>
              <div className="space-y-4 text-base font-bold font-ibm-plex-mono">
                <div className="flex justify-between">
                  <span className="text-gray-500">Date</span>
                  <span className="text-white">{workshop.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Time</span>
                  <span className="text-white">{workshop.time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Duration</span>
                  <span className="text-white">{workshop.duration}</span>
                </div>
                {workshop.venue && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Venue</span>
                    <span className="text-white">{workshop.venue}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-500">Fee</span>
                  <span className="text-white text-lg">
                    ₹{workshop.registration_fee}
                  </span>
                </div>
              </div>

              <button
                onClick={handleRegister}
                disabled={processing || workshop.status !== "open"}
                className="block w-full text-center bg-red-600 text-white py-3 rounded-lg font-bold text-sm mt-6 hover:bg-red-700 transition-all shadow-[0_0_15px_rgba(220,38,38,0.5)] hover:shadow-[0_0_25px_rgba(220,38,38,0.8)] disabled:opacity-50 disabled:cursor-not-allowed font-zen-dots"
              >
                {processing
                  ? "Processing..."
                  : workshop.status !== "open"
                  ? "Registration Closed"
                  : user
                  ? `Pay ₹${workshop.registration_fee} & Register`
                  : "Login to Register"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </PageSection>
  );
}
