"use client"
import { useState, useCallback } from 'react';
import { motion } from 'motion/react';
import Image from 'next/image';
import Container from '@/components/_core/layout/Container';
import DecryptedText from '@/components/ui/DecryptedText';
import HolographicWave from '@/components/ui/HolographicWave';
import HudBackground from '@/components/ui/HudBackground';

export default function HeroSection() {
  const [isAnimationComplete, setIsAnimationComplete] = useState(false);

  const handleAnimationComplete = useCallback(() => {
    setIsAnimationComplete(true);
  }, []);

  return (
    <section className='relative h-screen flex items-center justify-center overflow-hidden'>
      <HudBackground opacity={0.6} showMap={true} />
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black/50" />
      <div 
        className="absolute right-1/3 top-1/2 -translate-y-1/2 w-[300px] md:w-[650px] h-[300px] md:h-[650px] bg-red-700/25 blur-[100px] md:blur-[180px] rounded-full pointer-events-none" 
      />
      <HolographicWave />
      
      <Container className='text-center z-10'>
        
        <div className="relative inline-block mb-6">
          <span 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[10rem] md:text-[16rem] text-[#ff0000]/60 -z-10 whitespace-nowrap select-none pointer-events-none drop-shadow-[0_0_30px_rgba(255,0,0,0.8)]"
            style={{ fontFamily: '"Zen Dots", sans-serif' }}
          >
            5.0
          </span>
          <h1 className='text-6xl md:text-8xl font-extrabold tracking-tighter text-white relative z-10'>
            <DecryptedText
              text="TALOS"
              animateOn="view"
              revealDirection="center"
              speed={100}
              maxIterations={20}
              style={{ fontFamily: "'BBH Bartle', cursive" }}
              onAnimationComplete={handleAnimationComplete}
            />
          </h1>
        </div>

        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={isAnimationComplete ? { opacity: 1, y: 0 } : {}}
           transition={{ duration: 0.8, ease: "easeOut" }}
           className="mt-8 flex flex-col items-center gap-6"
        >
           <p className="text-3xl md:text-4xl text-[#ff0000]/90 font-bold tracking-wider" style={{ fontFamily: '"Zen Dots", sans-serif' }}>Feb <span className='text-3xl md:text-4xl text-[#ffffff]/90 font-bold tracking-wider'>4</span> 2026</p>
        </motion.div>
      </Container>

      <motion.div 
          initial={{ opacity: 0 }}
          animate={isAnimationComplete ? { opacity: 1 } : {}}
          transition={{ delay: 0.5, duration: 1 }}
          className="absolute bottom-8 left-0 right-0 flex flex-col items-center gap-4 z-10 pointer-events-none"
      >
          <motion.div 
             animate={{ y: [0, 10, 0] }}
             transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
           >
             <Image 
               src="https://img.icons8.com/?size=100&id=41202&format=png&color=FFFFFF" 
               alt="Scroll down" 
               width={40} 
               height={40} 
               className="opacity-90"
             />
           </motion.div>
          <div className="space-y-2 text-center">
            <p className="text-white/80 text-lg md:text-xl font-medium tracking-wide">Dept of Artificial Intelligence and Data Science</p>
            <p className="text-white/60 text-sm md:text-base">Chennai Institute Of Technology</p>
          </div>
      </motion.div>
    </section>
  );
}