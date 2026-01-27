"use client";

import { motion } from "motion/react";
import Image from "next/image";

interface FadeInGridProps {
  images: string[];
  className?: string;
}

export default function FadeInGrid({ images, className = "" }: FadeInGridProps) {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 ${className}`}>
      {images.map((src, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ 
            duration: 0.5, 
            delay: i * 0.1,
            ease: "easeOut" 
          }}
          whileHover={{ 
            scale: 1.05, 
            boxShadow: "0 20px 40px -5px rgba(220, 38, 38, 0.4)" // Soft red shadow
          }}
          className="relative aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer bg-muted/20 border border-white/5"
        >
          <Image
            src={src}
            alt={`Gallery image ${i + 1}`}
            fill
            className="object-cover transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          
          {/* Subtle gradient overlay for better depth */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </motion.div>
      ))}
    </div>
  );
}
