"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring, MotionValue, useMotionValueEvent } from "motion/react";
import Image from "next/image";

interface CarouselItem {
  title: string;
  desc: string;
  image: string;
  tag?: string;
}

interface PerspectiveCarouselProps {
  items: CarouselItem[];
}

const CARD_WIDTH = 240;
const CARD_GAP = 20;

export default function PerspectiveCarousel({ items }: PerspectiveCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollX } = useScroll({ container: containerRef });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let animationFrameId: number;
    let scrollPos = container.scrollLeft;
    const speed = 1.4; // Slightly slower speed

    let isVisible = false;
    // Performance: Pause when not in view
    const observer = new IntersectionObserver((entries) => {
        isVisible = entries[0].isIntersecting;
        if (isVisible) {
             // Restart loop if needed, though we check isVisible inside animate
             if (!animationFrameId) animationFrameId = requestAnimationFrame(animate);
        }
    });
    observer.observe(container);

    const animate = () => {
      if (!isVisible) {
         // Stop the loop, observer will restart it
         animationFrameId = 0;
         return; 
      }
      
      scrollPos += speed;
      if (scrollPos >= (items.length * (CARD_WIDTH + CARD_GAP))) {
          scrollPos = 0;
          container.scrollLeft = 0;
      } else {
          container.scrollLeft = scrollPos;
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => {
        cancelAnimationFrame(animationFrameId);
        observer.disconnect();
    };
  }, [items.length]);

  // Triple items for infinite scroll illusion
  const loopedItems = [...items, ...items, ...items];

  return (
    <div className="relative w-full py-20 perspective-1000">
      <div 
        ref={containerRef}
        className="flex overflow-x-hidden px-[50vw] gap-[20px] pb-12 pt-8 scrollbar-hide"
        style={{ perspective: "1000px" }}
      >
        {loopedItems.map((item, index) => (
          <PerspectiveCard 
            key={index} 
            item={item} 
            index={index} 
            scrollX={scrollX} 
          />
        ))}
      </div>
      
      {/* Edges Fade */}
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-black to-transparent pointer-events-none z-10" />
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-black to-transparent pointer-events-none z-10" />
    </div>
  );
}

function PerspectiveCard({ 
  item, 
  index, 
  scrollX 
}: { 
  item: CarouselItem; 
  index: number; 
  scrollX: MotionValue<number>;
}) {
  // Center position of this card in the scrollable area
  // We need to account for the initial padding (50vw) approximately or relative to container center
  // Actually, calculating relative distance is easier if we consider card's offsetLeft vs scrollX + viewportCenter
  
  // Since we use a ref-less approach for simplicity with infinite scroll, 
  // we can map scrollX to rotation based on index.
  // Each card is at index * (WIDTH + GAP).
  // Center of viewport is scrollX + windowWidth/2.
  
  // Let's rely on a transform relative to scrollX.
  const position = index * (CARD_WIDTH + CARD_GAP);
  
  // We transform scrollX such that when scrollX == position, output is 0.
  // When scrollX < position (card is to the right), output > 0.
  // When scrollX > position (card is to the left), output < 0.
  const diff = useTransform(scrollX, (val) => val - position);
  
  // Rotation: 0 when centered.
  // Rotate Y positive when card is on left (moving out), negative when on right?
  // Actually, to face inward:
  // Left side cards should rotate Y positive (face right).
  // Right side cards should rotate Y negative (face left).
  const rotateY = useTransform(diff, [-400, 0, 400], [-35, 0, 35]);
  const scale = useTransform(diff, [-400, 0, 400], [0.85, 1.1, 0.85]);
  const opacity = useTransform(diff, [-500, 0, 500], [0.6, 1, 0.6]);
  const zIndex = useTransform(diff, [-400, 0, 400], [0, 50, 0]); // Use z-index number, not string
  
  return (
    <motion.div
      style={{
        rotateY,
        scale,
        opacity,
        zIndex,
        transformStyle: "preserve-3d",
      }}
      className="relative flex-shrink-0 w-[240px] h-[360px] rounded-xl overflow-hidden border border-white/10 bg-black/60 shadow-2xl cursor-pointer group"
    >
      <Image
        src={item.image}
        alt={item.title}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-110 opacity-80 group-hover:opacity-100"
        sizes="240px"
      />
      
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
      
      <div className="absolute bottom-0 inset-x-0 p-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
         {item.tag && (
           <span className="text-[10px] font-bold text-red-500 tracking-widest uppercase mb-2 block">
             {item.tag}
           </span>
         )}
         <h3 className="text-2xl font-bold text-white mb-1 uppercase tracking-tight">
           {item.title}
         </h3>
         <p className="text-xs text-gray-400 line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
           {item.desc}
         </p>
      </div>

      {/* Shine Effect */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none mix-blend-overlay" />
    </motion.div>
  );
}
