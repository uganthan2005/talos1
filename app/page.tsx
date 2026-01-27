'use client';

import dynamic from 'next/dynamic';
import HeroSection from "./(landing)/hero/HeroSection";

// Lazy load below-fold sections for faster initial load
const CountdownSection = dynamic(() => import("./(landing)/countdown/CountdownSection"), {
  loading: () => <div className="h-[280px] bg-neutral-950" />,
});

const MascotSection = dynamic(() => import("./(landing)/mascot/MascotSection"), {
  loading: () => <div className="h-[600px] bg-black" />,
});

const HighlightsSection = dynamic(() => import("./(landing)/highlights/HighlightsSection"), {
  loading: () => <div className="h-[200px] bg-black" />,
});

const ScrollVelocity = dynamic(() => import("@/components/ui/ScrollVelocity"), {
  ssr: false,
  loading: () => <div className="h-[100px]" />,
});

const PreviewSection = dynamic(() => import("./(landing)/events-preview/PreviewSection"), {
  loading: () => <div className="h-[400px] bg-black" />,
});

export default function Home() {
  return (
    <>
      <HeroSection />
      <CountdownSection />
      <MascotSection />
      <HighlightsSection />
      <ScrollVelocity 
        texts={['TALOS 5.0', 'REGISTER NOW']} 
        velocity={50} 
        className="font-['Press_Start_2P'] text-red-600"
      />
      <PreviewSection />
    </>
  );
}
