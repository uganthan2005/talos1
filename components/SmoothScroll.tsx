'use client'
import { useEffect, memo } from 'react'

const SmoothScroll = memo(function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Skip smooth scroll on low-end devices or preference for reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    let lenis: { raf?: (time: number) => void; destroy?: () => void; stop?: () => void; start?: () => void } | null = null
    let reqId: number = 0
    let isTabVisible = true

    const initLenis = async () => {
      const Lenis = (await import('@studio-freight/lenis')).default

      lenis = new Lenis({
        duration: 1.2, // Slightly faster for better perceived performance
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        wheelMultiplier: 0.8,
        touchMultiplier: 1.5,
      })

      function raf(time: number) {
        if (isTabVisible && lenis) {
          lenis.raf?.(time)
        }
        reqId = requestAnimationFrame(raf)
      }

      // Handle tab visibility
      const handleVisibility = () => {
        isTabVisible = document.visibilityState === 'visible'
        if (isTabVisible) {
          lenis?.start?.()
        } else {
          lenis?.stop?.()
        }
      }
      document.addEventListener('visibilitychange', handleVisibility)

      reqId = requestAnimationFrame(raf)
    }

    // Delay initialization to not block initial render
    const timeoutId = setTimeout(initLenis, 100)

    return () => {
      clearTimeout(timeoutId)
      if (reqId) cancelAnimationFrame(reqId)
      lenis?.destroy?.()
    }
  }, [])

  return <>{children}</>
})

export default SmoothScroll