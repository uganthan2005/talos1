"use client";

import { useEffect, useState, useRef, useMemo, memo } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

type TimeLeft = {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
};

const getTimeLeft = (targetDate: number): TimeLeft => {
    const now = Date.now();
    const diff = Math.max(targetDate - now, 0);
    return {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
    };
};

// Memoize FlipUnit to prevent unnecessary re-renders
const FlipUnit = memo(function FlipUnit({ value, label, opacityLabel, bgOpacity }: { value: number; label: string; opacityLabel?: number | import('framer-motion').MotionValue<number>; bgOpacity?: import('framer-motion').MotionValue<number> }) {
    const padded = String(value).padStart(2, "0");
    const ghost = "~~";

    return (
        <div className="flex flex-col items-center group relative">
            {/* Black background that appears after shrinking */}
            {bgOpacity && (
                <motion.div
                    style={{ opacity: bgOpacity }}
                    className="absolute -inset-1 bg-black rounded-lg border border-red-900/50"
                />
            )}
            <div className="w-12 h-16 md:w-24 md:h-32 relative bg-black border-4 border-[#1a1a1a] rounded-sm shadow-[inset_0_0_20px_rgba(0,0,0,0.8)] overflow-hidden z-10">
                <div className="absolute inset-0 pointer-events-none z-20 bg-[linear-gradient(180deg,rgba(255,255,255,0.03)_0%,transparent_50%,rgba(0,0,0,0.2)_100%)]"></div>
                <div className="w-full h-full relative flex items-center justify-center transform -skew-x-6 scale-90">
                    <span className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 italic text-lg md:text-4xl tracking-widest leading-none font-dseg text-[#2a0a0a] z-0 select-none opacity-100">
                        {ghost}
                    </span>
                    <span className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 italic text-lg md:text-4xl tracking-widest leading-none font-dseg text-[#ff0000] drop-shadow-[0_0_15px_rgba(255,0,0,0.9)] z-10">
                        {padded}
                    </span>
                </div>
            </div>
            <motion.span
                style={{ opacity: opacityLabel }}
                className="mt-2 text-[8px] md:text-base uppercase text-red-500 font-bold tracking-[0.2em] font-orbitron drop-shadow-md z-10"
            >
                {label}
            </motion.span>
        </div>
    );
});

export default function CountdownSection() {
    const targetDate = new Date("2026-02-04T08:00:00").getTime();
    const [isMounted, setIsMounted] = useState(false);
    const [time, setTime] = useState<TimeLeft>(() => getTimeLeft(targetDate));

    // Animation Refs & State
    const triggerRef = useRef<HTMLDivElement>(null);
    const { scrollY } = useScroll();
    const [originY, setOriginY] = useState(0);
    const [sectionHeight, setSectionHeight] = useState(0);
    const [navHeight, setNavHeight] = useState(0);
    const [targetScale, setTargetScale] = useState(0.4);

    useEffect(() => {
        setTimeout(() => setIsMounted(true), 0);

        const updatePosition = () => {
            if (triggerRef.current) {
                const rect = triggerRef.current.getBoundingClientRect();
                const navbar = document.getElementById("floating-navbar");
                const navbarHeight = navbar ? navbar.offsetHeight : 0;
                // Use a fallback height of 90 if navbarHeight is 0 or surprisingly small
                const safeNavHeight = Math.max(navbarHeight, 90);

                setOriginY(rect.top + window.scrollY);
                setSectionHeight(rect.height);
                // Reduce navHeight for mobile to move it higher up
                const mobileNavHeight = window.innerWidth < 768 ? 45 : safeNavHeight;
                setNavHeight(mobileNavHeight);
                setTargetScale(window.innerWidth < 768 ? 1.0 : 0.4);
            }
        };

        updatePosition();
        window.addEventListener("resize", updatePosition);

        const interval = setInterval(() => setTime(getTimeLeft(targetDate)), 1000);
        return () => {
            clearInterval(interval);
            window.removeEventListener("resize", updatePosition);
        };
    }, [targetDate]);

    const labelMap = Object.entries(time);

    // Animation Transforms
    // Animation Transforms
    // Trigger animation when the section is about to leave the viewport (scrolled past)
    // Adjust offset to control when it moves. originY is element's page top.
    const triggerStart = Math.max(0, originY - 400);
    const triggerEnd = triggerStart + 400;

    // [0, triggerStart, triggerEnd]
    // 0 -> triggerStart: "Sticky" phase (simulated by top decreasing)
    // triggerStart -> triggerEnd: Animation phase (moves to top-right)

    const scrollRange = [0, triggerStart, triggerEnd];

    // Center Y position
    const centerY = originY + sectionHeight / 2;

    // Top position: 
    // At 0 scroll: centerY (absolute pos)
    // At triggerStart: centerY - triggerStart (visually same place)
    // At triggerEnd: navHeight + 5 (new fixed pos)
    const topPos = useTransform(scrollY, scrollRange, [centerY, centerY - triggerStart, navHeight + 5]);

    const right = useTransform(scrollY, scrollRange, ["50%", "50%", "0%"]);
    const translateX = useTransform(scrollY, scrollRange, ["50%", "50%", "0%"]);
    const y = useTransform(scrollY, scrollRange, ["-50%", "-50%", "0%"]);
    const scale = useTransform(scrollY, scrollRange, [1, 1, targetScale]);

    // Fade out label earlier in the transition
    const opacityLabel = useTransform(scrollY, [triggerStart, triggerStart + 150], [1, 0]);

    // Background opacity for shrunk state
    const bgOpacity = useTransform(scrollY, [triggerStart, triggerEnd], [0, 1]);

    return (
        <>
            {/* Placeholder to reserve space and measure position */}
            <div ref={triggerRef} className="w-full h-[180px] md:h-[280px] relative bg-neutral-950 border-y border-red-900/30 overflow-hidden">
                <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_600px_at_50%_50%,#00000000,#000000)]"></div>
            </div>

            <motion.div
                style={{
                    position: "fixed",
                    top: isMounted ? topPos : undefined,
                    right,
                    translateX,
                    y,
                    scale,
                    zIndex: 50,
                    transformOrigin: "right top",
                    opacity: isMounted ? 1 : 0
                }}
                className="flex flex-col items-center pointer-events-none w-auto"
            >
                <motion.p
                    style={{ opacity: opacityLabel }}
                    className="text-primary tracking-widest uppercase text-xs md:text-sm font-semibold mb-6 text-red-500 whitespace-nowrap"
                >
                    The Countdown Begins
                </motion.p>

                <div className="flex justify-center items-center gap-0.5 md:gap-4 px-2 w-full">
                    {labelMap.map(([label, value], index) => (
                        <div key={label} className="flex items-center">
                            <FlipUnit
                                value={isMounted ? (value as number) : 0}
                                label={label}
                                bgOpacity={bgOpacity}
                            />
                            {/* Add blinking colon if not the last item */}
                            {index < labelMap.length - 1 && (
                                <div className="text-red-500 text-sm md:text-3xl font-dseg animate-pulse mb-6 md:mb-8 mx-0.5 md:mx-2 drop-shadow-[0_0_10px_rgba(255,0,0,0.8)]">
                                    :
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </motion.div>
        </>
    );
}
