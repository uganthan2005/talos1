"use client";

import { memo } from "react";

interface HudBackgroundProps {
  opacity?: number;
  showMap?: boolean;
}

const HudBackground = memo(function HudBackground({ opacity = 1, showMap = true }: HudBackgroundProps) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ opacity }}>
      <div className="absolute inset-0 bg-[#050000]" />
      
      {/* Grid Layer */}
      <div 
        className="absolute inset-0 opacity-100"
        style={{
          backgroundImage: `linear-gradient(rgba(255, 0, 0, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 0, 0, 0.3) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
          boxShadow: 'inset 0 0 100px rgba(0,0,0,0.9)'
        }}
      />

      {/* Map Layer */}
      {showMap && (
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4/5 h-3/5 opacity-70"
          style={{
            backgroundImage: 'url("/images/map-image.png")',
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            maskImage: 'radial-gradient(circle, black 40%, transparent 80%)'
          }}
        />
      )}

      {/* Radar Targets */}
      <div className="radar-target absolute top-[20%] right-[20%] w-[150px] h-[150px] border border-dashed border-red-600/60 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(255,0,0,0.2)]">
        <div className="absolute w-[70%] h-[70%] border border-red-600/40 rounded-full border-t-transparent animate-[spin_4s_linear_infinite]" />
        <div className="absolute w-[10px] h-[10px] bg-red-600 rounded-full shadow-[0_0_10px_#ff0000] animate-[pulse_2s_ease-in-out_infinite]" />
      </div>
      
      <div className="radar-target absolute bottom-[15%] left-[10%] w-[100px] h-[100px] border border-dashed border-red-600/60 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(255,0,0,0.2)]">
        <div className="absolute w-[70%] h-[70%] border border-red-600/40 rounded-full border-t-transparent animate-[spin_4s_linear_infinite]" />
        <div className="absolute w-[10px] h-[10px] bg-red-600 rounded-full shadow-[0_0_10px_#ff0000] animate-[pulse_2s_ease-in-out_infinite]" />
      </div>
      
      <div className="radar-target absolute top-[60%] left-[50%] w-[80px] h-[80px] border border-dashed border-red-600/60 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(255,0,0,0.2)]">
        <div className="absolute w-[70%] h-[70%] border border-red-600/40 rounded-full border-t-transparent animate-[spin_4s_linear_infinite]" />
        <div className="absolute w-[10px] h-[10px] bg-red-600 rounded-full shadow-[0_0_10px_#ff0000] animate-[pulse_2s_ease-in-out_infinite]" />
      </div>

      {/* Data Blocks */}
      <div className="absolute bottom-[50px] left-[50px] text-red-600/70 text-xs leading-relaxed hidden md:block font-mono">
        COORD: 45.912.11<br />
        SEC: A-9<br />
        STATUS: ACTIVE<br />
        ||||||||||||||||||
      </div>
      
      <div className="absolute top-[50px] right-[50px] text-red-600/70 text-xs leading-relaxed text-right hidden md:block font-mono">
        SYS.MONITORING<br />
        NET.TRAFFIC: HIGH<br />
        ENCRYPTION: ON<br />
        [ LOADING... ]
      </div>

      {/* Scanline Effect */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to bottom, transparent 50%, rgba(255, 0, 0, 0.05) 51%)',
          backgroundSize: '100% 4px'
        }}
      />
      
      {/* Scanner Beam */}
      <div 
        className="absolute left-0 w-full h-[10px] opacity-30 animate-[scan_5s_linear_infinite]"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(255,0,0,0.5), transparent)'
        }}
      />
    </div>
  );
});

export default HudBackground;
