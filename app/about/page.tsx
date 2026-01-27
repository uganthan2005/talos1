"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";

const timelineEvents = [
  {
    year: "4.0",
    title: "NEURAL NEXUS",
    description: "TALOS 4.0 explored the power of interconnected thinking. Inspired by neural systems, this edition emphasized collaboration, adaptability, and intelligent problem-solving. Every event reflected how modern technology thrives on connections—between people, data, and ideas.",
    image: "/images/promptopia2.jpeg"
  },
  {
    year: "3.0",
    title: "The Shift",
    description: "TALOS 3.0 changed the game. The focus moved from just learning to doing. Participants were pushed to apply logic, strategy, and teamwork under pressure—mirroring real-world tech environments.",
    image: "/v3.png"
  },
  {
    year: "2.0",
    title: "The Rise",
    description: "With growing participation and ambition, TALOS 2.0 elevated the experience. Events became sharper, challenges more competitive, and ideas more fearless. This edition marked TALOS stepping into its identity as a serious technical platform.",
    image: "/v2.png"
  },
  {
    year: "1.0",
    title: "The Spark",
    description: "TALOS 1.0 was where everything began. A bold attempt to bring technical curiosity to life, it introduced students to the thrill of innovation, competition, and creative problem-solving. This edition planted the seed for a culture that would grow stronger with every year.",
    image: "/v1.jpeg"
  }
];

const fadeIn = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8 }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3
    }
  }
};

const imageVariant = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.8 }
  }
};

const TimelineDot = () => {
  const dotRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: dotRef,
    offset: ["start 0.55", "start 0.45"]
  });

  const backgroundColor = useTransform(scrollYProgress, [0, 1], ["#ffffff", "#dc2626"]);

  return (
    <motion.div
      ref={dotRef}
      style={{ backgroundColor }}
      className="absolute left-[41px] md:left-1/2 top-10 md:top-1/2 w-5 h-5 md:w-6 md:h-6 rounded-full border-4 border-black z-10 shadow-[0_0_10px_rgba(255,255,255,0.5)] -translate-x-1/2 md:-translate-y-1/2"
    />
  );
};

export default function AboutPage() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  return (
    <div className="min-h-screen bg-black text-white pt-32 pb-20 px-4 md:px-12 overflow-x-hidden">
      <div className="max-w-6xl mx-auto">

        {/* Header Section */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          className="mb-24 text-center md:text-left"
        >
          <h1 className="text-4xl md:text-6xl text-red-600 mb-8 zen-dots-regular">ABOUT US</h1>
          <p className="text-sm md:text-lg leading-relaxed max-w-3xl ibm-plex-mono-semibold uppercase text-gray-300">
            TALOS is your friendly neighborhood technical symposium. We share daily learning tips, organize cultural events, and build a community where everyone learns together — one line of code at a time.
          </p>
        </motion.div>

        {/* Timeline Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          className="mb-16"
        >
          <h2 className="text-3xl md:text-5xl text-red-600 zen-dots-regular">CHANGELOG FOR TALOS</h2>
          <p className="mt-4 text-sm md:text-md ibm-plex-mono-semibold text-gray-400 max-w-2xl uppercase">
            We&apos;ve been working on TALOS for the past decade. Here&apos;s a timeline of our journey.
          </p>
        </motion.div>

        {/* Timeline Section */}
        <motion.div
          ref={containerRef}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="relative space-y-24"
        >
          {/* Centered Vertical Line - Desktop Only */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-zinc-800 -translate-x-1/2">
            <motion.div
              style={{ scaleY: scrollYProgress }}
              className="absolute top-0 left-0 w-full h-full bg-red-600 origin-top"
            />
          </div>

          {/* Left Vertical Line - Mobile Only */}
          <div className="md:hidden absolute left-[41px] top-0 bottom-0 w-0.5 bg-zinc-800">
            <motion.div
              style={{ scaleY: scrollYProgress }}
              className="absolute top-0 left-0 w-full h-full bg-red-600 origin-top"
            />
          </div>

          {timelineEvents.map((event, index) => (
            <motion.div
              key={index}
              variants={fadeIn}
              className="relative"
            >
              {/* Timeline Dot */}
              <TimelineDot />

              <div className={`flex flex-col gap-8 md:gap-0 items-center justify-between pl-[80px] md:pl-0 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>

                {/* Image Block */}
                <motion.div
                  variants={imageVariant}
                  className="w-full md:w-[42%] relative aspect-video rounded-xl overflow-hidden border border-zinc-800 shadow-2xl group"
                >
                  <Image
                    src={event.image}
                    alt={`Talos ${event.year}`}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-60" />
                </motion.div>

                {/* Text Block */}
                <div className="w-full md:w-[42%] flex flex-col gap-4 text-left">
                  <div>
                    <h3 className="text-4xl md:text-6xl text-red-600 zen-dots-regular mb-2 leading-none">
                      {event.year}
                    </h3>
                    <h3 className="text-2xl md:text-3xl text-white zen-dots-regular neon-text-red leading-tight">
                      {event.title}
                    </h3>
                  </div>
                  <p className="text-sm md:text-lg leading-relaxed text-gray-300 ibm-plex-mono-semibold uppercase">
                    {event.description}
                  </p>
                </div>

              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </div>
  );
}