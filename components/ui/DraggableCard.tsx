"use client";
import { cn } from "../../lib/utils";
import React, { useRef, useState, useEffect, useMemo, useCallback, memo } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  animate,
  useVelocity,
  useAnimationControls,
} from "motion/react";

// Simplified spring config for better performance
const SPRING_CONFIG = {
  stiffness: 80,
  damping: 20,
  mass: 0.3,
};

export const DraggableCardBody = memo(function DraggableCardBody({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const cardRef = useRef<HTMLDivElement>(null);
  const controls = useAnimationControls();
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [constraints, setConstraints] = useState({
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  });
  const velocityX = useVelocity(mouseX);
  const velocityY = useVelocity(mouseY);

  // Reduced rotation range for subtler effect
  const rotateX = useSpring(
    useTransform(mouseY, [-300, 300], [15, -15]),
    SPRING_CONFIG
  );
  const rotateY = useSpring(
    useTransform(mouseX, [-300, 300], [-15, 15]),
    SPRING_CONFIG
  );

  const opacity = useSpring(
    useTransform(mouseX, [-300, 0, 300], [0.85, 1, 0.85]),
    SPRING_CONFIG
  );

  useEffect(() => {
    // Detect touch device
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);

    const updateConstraints = () => {
      if (typeof window !== "undefined") {
        setConstraints({
          top: -window.innerHeight / 2,
          left: -window.innerWidth / 2,
          right: window.innerWidth / 2,
          bottom: window.innerHeight / 2,
        });
      }
    };

    updateConstraints();
    window.addEventListener("resize", updateConstraints, { passive: true });
    return () => window.removeEventListener("resize", updateConstraints);
  }, []);

  // Throttle mouse move handler
  const lastMoveTime = useRef(0);
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const now = performance.now();
    if (now - lastMoveTime.current < 16) return; // ~60fps throttle
    lastMoveTime.current = now;
    
    const { clientX, clientY } = e;
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set(clientX - centerX);
    mouseY.set(clientY - centerY);
  }, [mouseX, mouseY]);

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
  }, [mouseX, mouseY]);

  return (
    <motion.div
      ref={cardRef}
      drag={!isTouchDevice}
      dragConstraints={constraints}
      onDragStart={() => {
        if (!isTouchDevice) {
          document.body.style.cursor = "grabbing";
        }
      }}
      onDragEnd={(event, info) => {
        document.body.style.cursor = "default";

        controls.start({
          rotateX: 0,
          rotateY: 0,
          transition: {
            type: "spring",
            ...SPRING_CONFIG,
          },
        });
        
        // Simplified physics - just reset position smoothly
        const currentVelocityX = velocityX.get();
        const currentVelocityY = velocityY.get();

        if (Math.abs(currentVelocityX) > 100 || Math.abs(currentVelocityY) > 100) {
          animate(info.point.x, info.point.x + currentVelocityX * 0.2, {
            duration: 0.5,
            type: "spring",
            stiffness: 60,
            damping: 20,
          });
        }
      }}
      style={{
        rotateX,
        rotateY,
        opacity,
        willChange: "transform",
        contain: "layout style paint",
      }}
      animate={controls}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "relative min-h-96 w-80 overflow-hidden rounded-md bg-black p-6 shadow-[0_0_30px_rgba(220,38,38,0.6)] transform-3d",
        className
      )}
    >
      {children}
    </motion.div>
  );
});

export const DraggableCardContainer = memo(function DraggableCardContainer({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className={cn("[perspective:3000px]", className)}>{children}</div>
  );
});