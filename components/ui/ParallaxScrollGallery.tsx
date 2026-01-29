"use client";

import { useRef, useEffect, useState } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionValue,
  useVelocity,
  useAnimationFrame
} from "motion/react";
import Image from "next/image";

interface ParallaxScrollGalleryProps {
  images: string[];
  className?: string;
}

// Helper to wrap the position for infinite loop
// We use percentages for smoother responsive wrapping
const wrap = (min: number, max: number, v: number) => {
  const range = max - min;
  const mod = ((((v - min) % range) + range) % range) + min;
  return mod;
};

function ParallaxRow({ images, baseVelocity = 100, className = "" }: { images: string[], baseVelocity: number, className?: string }) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 80,
    stiffness: 200
  });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 2], {
    clamp: false
  });

  const x = useTransform(baseX, (v) => `${wrap(-20, -45, v)}%`);

  const directionFactor = useRef<number>(1);
  useAnimationFrame((t, delta) => {
    let moveBy = directionFactor.current * baseVelocity * (delta / 1000);

    // Dynamic velocity based on scroll speed
    if (velocityFactor.get() < 0) {
      directionFactor.current = -1;
    } else if (velocityFactor.get() > 0) {
      directionFactor.current = 1;
    }

    moveBy += directionFactor.current * moveBy * velocityFactor.get();
    baseX.set(baseX.get() + moveBy);
  });

  return (
    <div className="overflow-hidden whitespace-nowrap flex flex-nowrap mb-8">
      <motion.div className="flex flex-nowrap gap-4" style={{ x }}>
        {[...images, ...images].map((src, i) => (
          <motion.div
            key={i}
            whileHover={{
              scale: 1.05,
              zIndex: 50
            }}
            transition={{ duration: 0.2 }}
            className="relative w-[300px] h-[200px] sm:w-[400px] sm:h-[250px] shrink-0 rounded-xl overflow-hidden transition-all duration-500 border border-white/10 cursor-pointer"
          >
            <Image
              src={src}
              alt={`Gallery Image ${i}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

export default function ParallaxScrollGallery({ images, className = "" }: ParallaxScrollGalleryProps) {
  const [shuffledImages, setShuffledImages] = useState<string[]>(images);

  useEffect(() => {
    setShuffledImages([...images].sort(() => Math.random() - 0.5));
  }, [images]);

  // Split images into rows
  const half = Math.ceil(images.length / 2);
  const row1 = images.slice(0, half);
  const row2 = images.slice(half);
  const row3 = shuffledImages;

  return (
    <div className={`w-full py-12 overflow-hidden ${className}`}>
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-red-900/40 via-transparent to-transparent" />

      <ParallaxRow images={row1} baseVelocity={-1} />
      <ParallaxRow images={row2} baseVelocity={1} />
      <ParallaxRow images={row3} baseVelocity={-0.8} />
    </div>
  );
}
