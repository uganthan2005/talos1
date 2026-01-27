"use client";

import React, { useState, useRef } from "react";
import { CometCard } from "@/components/ui/comet-card";
import { useInView } from "motion/react";

type CardItem = {
  title: string;
  desc: string;
  tag?: string;
  image: string;
};

export function InfiniteCometCards({
  items,
  direction = "left",
}: {
  items: CardItem[];
  direction?: "left" | "right";
}) {
  const [paused, setPaused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef);

  // Duplicate twice → required for gapless motion
  const loopItems = [...items, ...items, ...items];

  const shouldAnimate = !paused && isInView;

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden py-16"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* 🌌 Star background */}
      <div className="pointer-events-none absolute inset-0 opacity-15 bg-[radial-gradient(1px_1px_at_20%_30%,white,transparent),radial-gradient(1px_1px_at_80%_40%,white,transparent),radial-gradient(1px_1px_at_50%_70%,white,transparent)]" />

      <div className="overflow-hidden w-full">
        <div
          className="flex w-max gap-14 will-change-transform"
          style={{
            animationName: direction === "left" ? "marquee-left" : "marquee-right",
            animationDuration: "45s",
            animationTimingFunction: "linear",
            animationIterationCount: "infinite",
            animationPlayState: shouldAnimate ? "running" : "paused",
          }}
        >
          {loopItems.map((item, idx) => (
            <CometCard key={idx}>
              <div className="w-[460px] rounded-2xl overflow-hidden border border-white/10 bg-black/85 backdrop-blur-xl">
                
                {/* Image */}
                <div className="h-[180px] w-full overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-full w-full object-cover opacity-90"
                  />
                </div>

                {/* Content */}
                <div className="p-8">
                  {item.tag && (
                    <span className="inline-block mb-4 rounded bg-red-600 px-3 py-1 text-xs font-semibold">
                      {item.tag}
                    </span>
                  )}

                  <h3 className="text-3xl text-white mb-3 righteous-regular">
                    {item.title}
                  </h3>

                  <p className="text-base text-white/65 leading-relaxed ibm-plex-mono-semibold">
                    {item.desc}
                  </p>
                </div>
              </div>
            </CometCard>
          ))}
        </div>
      </div>
    </div>
  );
}
