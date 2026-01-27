"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { DraggableCardBody, DraggableCardContainer } from "./DraggableCard";

interface CarouselItem {
  title: string;
  desc: string;
  image: string;
  tag?: string;
  slug: string;
}

interface DraggableEventsCarouselProps {
  items: CarouselItem[];
}

export default function DraggableEventsCarousel({ items }: DraggableEventsCarouselProps) {
  return (
    <div className="relative w-full py-20">
      <div className="flex flex-wrap justify-center gap-8 px-4">
        {items.map((item, index) => (
          <DraggableCardContainer key={index}>
            <Link href={`/events/${item.slug}`} className="block h-full w-full">
              <DraggableCardBody className="w-80 h-96 bg-black hover:border-white transition-colors duration-300 p-0 shadow-[0_0_5px_rgba(220,38,38,0.6)]">
                <div className="relative w-full h-full">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                    sizes="320px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />

                  <div className="absolute bottom-0 left-0 right-0 p-6 space-y-3">
                    {item.tag && (
                      <span className="inline-block px-3 py-1 text-xs font-bold text-white bg-red-600 rounded-full uppercase tracking-wider font-[family-name:var(--font-zen-dots)]">
                        {item.tag}
                      </span>
                    )}

                    <h3 className="text-xl font-bold text-white uppercase tracking-tight line-clamp-2 font-[family-name:var(--font-zen-dots)]">
                      {item.title}
                    </h3>

                    <div className="h-0.5 bg-gradient-to-r from-red-600 to-transparent" />
                  </div>
                </div>
              </DraggableCardBody>
            </Link>
          </DraggableCardContainer>
        ))}
      </div>

      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_red_1px,_transparent_1px)] bg-[length:50px_50px]" />
      </div>
    </div>
  );
}