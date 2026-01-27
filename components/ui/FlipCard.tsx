"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";

interface FlipCardProps extends React.HTMLAttributes<HTMLDivElement> {
  backContent: React.ReactNode;
}

export function FlipCard({
  children,
  backContent,
  className,
  onClick,
  ...props
}: FlipCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleInteraction = (e: React.MouseEvent<HTMLDivElement>) => {
    if (onClick) {
      onClick(e);
    }
    
    // Prevent flip if clicking a link or button
    const target = e.target as HTMLElement;
    if (target.closest('a') || target.closest('button')) {
      return;
    }
    
    setIsFlipped(!isFlipped);
  };

  return (
    <div
      className={cn(
        "group h-96 w-full [perspective:1000px]",
        className
      )}
      onClick={handleInteraction}
      {...props}
    >
      <div
        className={cn(
          "relative h-full w-full transition-all duration-500 [transform-style:preserve-3d]",
          isFlipped ? "[transform:rotateY(180deg)]" : "",
          "[@media(hover:hover)]:group-hover:[transform:rotateY(180deg)]"
        )}
      >
        {/* Front */}
        <div className="absolute inset-0 h-full w-full [backface-visibility:hidden] rounded-2xl overflow-hidden">
          {children}
        </div>

        {/* Back */}
        <div className="absolute inset-0 h-full w-full [transform:rotateY(180deg)] [backface-visibility:hidden] rounded-2xl overflow-hidden bg-black/90 border border-white/10 p-6">
          {backContent}
        </div>
      </div>
    </div>
  );
}
