'use client';

import React, { useEffect, useRef, memo, useState } from 'react';
import { useSystemCapabilities } from '@/hooks/useSystemCapabilities';

const CustomCursor = memo(function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const posRef = useRef({ x: -100, y: -100 });
  const { supportsCustomCursor, isLowEndDevice, isMobile } = useSystemCapabilities();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Use default cursor for low-end devices or mobile
    if (isLowEndDevice || isMobile || !supportsCustomCursor) {
      document.body.classList.add('use-default-cursor');
      document.body.style.cursor = 'auto';
      return;
    }

    // Enhanced cursor for high-performance devices
    document.body.classList.remove('use-default-cursor');
    document.body.style.cursor = 'none';
    
    let needsUpdate = false;
    
    const updateCursor = () => {
      if (cursorRef.current && needsUpdate) {
        cursorRef.current.style.transform = `translate3d(${posRef.current.x - 6}px, ${posRef.current.y - 6}px, 0)`;
        needsUpdate = false;
      }
      rafRef.current = requestAnimationFrame(updateCursor);
    };
    
    const handleMouseMove = (e: MouseEvent) => {
      posRef.current.x = e.clientX;
      posRef.current.y = e.clientY;
      needsUpdate = true;
      if (!isVisible) {
        setIsVisible(true);
      }
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
      document.body.classList.remove('use-default-cursor');
      document.body.style.cursor = 'none';
    };
    
    const handleMouseLeave = () => {
      setIsVisible(false);
      document.body.classList.add('use-default-cursor');
      document.body.style.cursor = 'auto';
    };

    // Enhanced visibility check
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsVisible(false);
      }
    };

    rafRef.current = requestAnimationFrame(updateCursor);
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.body.addEventListener('mouseenter', handleMouseEnter);
    document.body.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('mousemove', handleMouseMove);
      document.body.removeEventListener('mouseenter', handleMouseEnter);
      document.body.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.body.classList.add('use-default-cursor');
      document.body.style.cursor = 'auto';
    };
  }, [supportsCustomCursor, isLowEndDevice, isMobile]);

  // Don't render custom cursor on unsupported devices
  if (!supportsCustomCursor || isLowEndDevice || isMobile) return null;

  return (
    <div
      ref={cursorRef}
      className="hidden md:block"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '12px', 
        height: '12px',
        borderRadius: '50%',
        backgroundColor: '#ff0000',
        boxShadow: '0 0 15px #ff0000, 0 0 30px #ff0000, 0 0 45px #ff000080',
        transform: 'translate3d(-100px, -100px, 0)',
        pointerEvents: 'none',
        zIndex: 9999,
        mixBlendMode: 'screen', 
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.15s ease-out',
        willChange: 'transform',
        contain: 'layout style paint',
        filter: 'brightness(1.2) contrast(1.1)'
      }}
    />
  );
});

export default CustomCursor;
