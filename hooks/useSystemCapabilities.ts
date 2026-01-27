'use client';

import { useState, useEffect } from 'react';

interface SystemCapabilities {
  cpuCores: number;
  isMobile: boolean;
  isLowEndDevice: boolean;
  supportsCustomCursor: boolean;
}

export function useSystemCapabilities(): SystemCapabilities {
  const [capabilities, setCapabilities] = useState<SystemCapabilities>({
    cpuCores: 4,
    isMobile: true,
    isLowEndDevice: true,
    supportsCustomCursor: false,
  });

  useEffect(() => {
    const detectCapabilities = () => {
      // Detect CPU cores
      const cpuCores = navigator.hardwareConcurrency || 4;
      
      // Check if mobile/touch device
      const isMobile = 
        'ontouchstart' in window || 
        navigator.maxTouchPoints > 0 || 
        window.innerWidth <= 768;
      
      // Determine if device is low-end
      const isLowEndDevice = cpuCores <= 2 || isMobile;
      
      // Check if custom cursor should be supported
      const supportsCustomCursor = !isLowEndDevice && 
        !isMobile && 
        cpuCores > 2 &&
        window.innerWidth > 768;

      setCapabilities({
        cpuCores,
        isMobile,
        isLowEndDevice,
        supportsCustomCursor,
      });
    };

    detectCapabilities();
    
    // Re-check on resize
    const handleResize = () => detectCapabilities();
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return capabilities;
}