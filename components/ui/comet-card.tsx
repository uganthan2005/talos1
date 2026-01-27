"use client";

import React, { useEffect, useRef, useState } from "react";

export function CometCard({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  // ✅ Ensure client-only rendering
  useEffect(() => {
    setTimeout(() => setMounted(true), 0);
  }, []);

  function handleMouseMove(e: React.MouseEvent) {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const rotateX = -(y - rect.height / 2) / 15;
    const rotateY = (x - rect.width / 2) / 15;

    ref.current.style.transform = `
      perspective(1000px)
      rotateX(${rotateX}deg)
      rotateY(${rotateY}deg)
      scale(1.04)
    `;
  }

  function handleMouseLeave() {
    if (!ref.current) return;

    ref.current.style.transform = `
      perspective(1000px)
      rotateX(0deg)
      rotateY(0deg)
      scale(1)
    `;
  }

  // 🔑 Prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="relative transition-transform duration-200">
        {children}
      </div>
    );
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative transition-transform duration-200 ease-out will-change-transform"
      style={{ transformStyle: "preserve-3d" }}
    >
      {children}
    </div>
  );
}
