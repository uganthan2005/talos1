"use client";

import { useEffect, useRef, memo } from "react";

const HolographicWave = memo(function HolographicWave() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Use lower quality context for better performance
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    // Use lower resolution for performance (0.5x pixel ratio)
    const dpr = Math.min(window.devicePixelRatio || 1, 1);
    let width: number;
    let height: number;
    let frameId: number = 0;
    let time = 0;
    let frameCount = 0;
    
    // Performance: Pause when not in view or tab hidden
    let isVisible = true;
    let isTabVisible = true;
    
    const observer = new IntersectionObserver((entries) => {
      isVisible = entries[0].isIntersecting;
      if (isVisible && isTabVisible && !frameId) {
        frameId = requestAnimationFrame(draw);
      }
    }, { threshold: 0.1 });
    observer.observe(canvas);
    
    const handleVisibility = () => {
      isTabVisible = document.visibilityState === 'visible';
      if (isVisible && isTabVisible && !frameId) {
        frameId = requestAnimationFrame(draw);
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width * dpr;
      height = rect.height * dpr;
      canvas.width = width;
      canvas.height = height;
    };
    
    // Debounce resize
    let resizeTimeout: ReturnType<typeof setTimeout>;
    const debouncedResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(resize, 150);
    };
    window.addEventListener("resize", debouncedResize, { passive: true });
    resize();

    // Configuration - reduced for performance
    const lines = 20; // Reduced from 40
    const colorBase = "220, 38, 38";
    const STEP = 10; // Increased from 5 for fewer points
    const FRAME_SKIP = 2; // Only draw every 2nd frame (30fps)
    
    const draw = () => {
      if (!isVisible || !isTabVisible) {
        frameId = 0;
        return;
      }
      
      frameId = requestAnimationFrame(draw);
      
      // Skip frames for performance
      frameCount++;
      if (frameCount % FRAME_SKIP !== 0) return;

      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, width, height);

      ctx.globalCompositeOperation = "screen";
      
      const yOffset = height / 2;
      const amplitude = height / 4;
      const frequency = 0.002;
      const speed = time * 0.001;
      
      for (let i = 0; i < lines; i++) {
        const perspective = 1 - (i / lines);
        const yBase = yOffset + (i - lines / 2) * 15 * perspective;
        
        ctx.beginPath();
        ctx.lineWidth = 1 + perspective * 2;
        ctx.strokeStyle = `rgba(${colorBase}, ${0.1 + perspective * 0.3})`;
        
        for (let x = 0; x <= width; x += STEP) {
          const y = yBase 
            + Math.sin(x * frequency + speed + i * 0.2) * amplitude * perspective
            + Math.cos(x * frequency * 2 - speed) * (amplitude * 0.5) * perspective;
          
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        
        ctx.stroke();
      }

      ctx.globalCompositeOperation = "source-over";
      
      // Simplified vignette - just darker edges
      ctx.fillStyle = "rgba(0,0,0,0.3)";
      ctx.fillRect(0, 0, 50, height);
      ctx.fillRect(width - 50, 0, 50, height);

      time += 3;
    };

    // Delay initial draw slightly to not block main thread
    setTimeout(() => {
      if (isVisible && isTabVisible) {
        frameId = requestAnimationFrame(draw);
      }
    }, 100);

    return () => {
      window.removeEventListener("resize", debouncedResize);
      document.removeEventListener('visibilitychange', handleVisibility);
      observer.disconnect();
      clearTimeout(resizeTimeout);
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 w-full h-full -z-10 pointer-events-none"
      style={{ imageRendering: 'auto' }}
    />
  );
});

export default HolographicWave;
