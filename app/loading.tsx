import React from 'react';

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black">
      <div className="relative flex items-center justify-center">
        {/* Holographic Glow Background */}
        <div className="absolute h-24 w-24 rounded-full bg-red-600/10 blur-2xl animate-pulse"></div>
        
        {/* Minimal Spinner */}
        <div className="h-16 w-16 rounded-full border-[3px] border-white/5 border-t-red-500 shadow-[0_0_20px_rgba(220,38,38,0.5)] animate-[spin_1.2s_ease-in-out_infinite]"></div>
        
        {/* Subtle Shimmer/Reflection */}
        <div className="absolute h-16 w-16 rounded-full border-[3px] border-transparent border-t-white/20 animate-[spin_1.2s_ease-in-out_infinite_reverse]"></div>
      </div>
    </div>
  );
}
