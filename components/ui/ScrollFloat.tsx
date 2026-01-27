"use client"
import React, { useEffect, useMemo, useRef, ReactNode, RefObject, memo } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import './ScrollFloat.css';

gsap.registerPlugin(ScrollTrigger);

interface ScrollFloatProps {
  children: ReactNode;
  scrollContainerRef?: RefObject<HTMLElement>;
  containerClassName?: string;
  textClassName?: string;
  animationDuration?: number;
  ease?: string;
  scrollStart?: string;
  scrollEnd?: string;
  stagger?: number;
  as?: React.ElementType;
}

const ScrollFloat: React.FC<ScrollFloatProps> = memo(function ScrollFloat({
  children,
  scrollContainerRef,
  containerClassName = '',
  textClassName = '',
  animationDuration = 1,
  ease = 'back.inOut(2)',
  scrollStart = 'center bottom+=50%',
  scrollEnd = 'bottom bottom-=40%',
  stagger = 0.03,
  as: Tag = 'h2'
}) {
  const containerRef = useRef<HTMLHeadingElement>(null);

  // Memoize split text to prevent re-computation - wrap by words to prevent mid-word breaks
  const splitText = useMemo(() => {
    const text = typeof children === 'string' ? children : '';
    const words = text.split(' ');
    
    return words.map((word, wordIndex) => (
      <span key={wordIndex} className="word" style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>
        {word.split('').map((char, charIndex) => (
          <span className="char" key={charIndex}>
            {char}
          </span>
        ))}
        {wordIndex < words.length - 1 && <span className="char">&nbsp;</span>}
      </span>
    ));
  }, [children]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const scroller = scrollContainerRef?.current || window;
    const charElements = el.querySelectorAll('.char');
    
    if (charElements.length === 0) return;

    // Use simpler animation for many characters
    const useSimpleAnimation = charElements.length > 30;
    
    const tween = gsap.fromTo(
      charElements,
      {
        opacity: 0,
        yPercent: useSimpleAnimation ? 50 : 120,
        scaleY: useSimpleAnimation ? 1.2 : 2.3,
        scaleX: useSimpleAnimation ? 0.9 : 0.7,
        transformOrigin: '50% 0%'
      },
      {
        duration: useSimpleAnimation ? 0.6 : animationDuration,
        ease: useSimpleAnimation ? 'power2.out' : ease,
        opacity: 1,
        yPercent: 0,
        scaleY: 1,
        scaleX: 1,
        stagger: useSimpleAnimation ? 0.01 : stagger,
        scrollTrigger: {
          trigger: el,
          scroller,
          start: scrollStart,
          end: scrollEnd,
          scrub: true,
        }
      }
    );

    return () => {
      tween.kill();
    };
  }, [scrollContainerRef, animationDuration, ease, scrollStart, scrollEnd, stagger]);

  return (
    <Tag ref={containerRef} className={`scroll-float ${containerClassName}`}>
      <span className={`scroll-float-text ${textClassName}`}>{splitText}</span>
    </Tag>
  );
});

export default ScrollFloat;
