"use client";
import React, { useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "motion/react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import Image from "next/image";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";

export const FloatingNav = ({
  navItems,
  className,
}: {
  navItems: {
    name: string;
    link: string;
    icon?: React.ReactNode;
  }[];
  className?: string;
}) => {
  const { scrollY } = useScroll();
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      if (auth) {
        await signOut(auth);
        router.push('/');
      }
    } catch (error) {
      console.error("Logout error", error);
    }
  };

  useMotionValueEvent(scrollY, "change", (current) => {
    if (typeof current === "number") {
      if (current > 100) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    }
  });

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{
          opacity: 0,
          y: -100,
        }}
        animate={{
          y: visible ? 0 : -100,
          opacity: visible ? 1 : 0,
        }}
        transition={{
          duration: 0.3,
          ease: "easeInOut",
        }}
        className={cn(
          "flex w-full fixed top-0 inset-x-0 border-b border-red-600/30 bg-black/90 backdrop-blur-md shadow-[0px_2px_15px_-1px_rgba(220,38,38,0.2)] z-[5000] px-4 sm:px-6 md:px-8 lg:px-10 py-3 sm:py-4 md:py-5 items-center justify-between",
          className
        )}
      >
        <Link href="/" className="font-black text-base sm:text-lg md:text-xl tracking-tighter text-white hover:text-red-600 transition-colors flex items-center gap-1.5 sm:gap-2">
          <Image 
            src="/Logo.png" 
            alt="TALOS Logo" 
            width={28} 
            height={28} 
            className="object-contain sm:w-[32px] sm:h-[32px] md:w-[36px] md:h-[36px]"
          />
          <span className="hidden sm:inline">TALOS</span>
          <span className="text-red-600 zen-dots-regular neon-text-red">5.0</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center justify-center space-x-3 lg:space-x-6">
          {navItems.map((navItem, idx: number) => {
            const isActive = pathname === navItem.link || (pathname.startsWith(navItem.link) && navItem.link !== '/');
            return (
              <Link
                key={`link=${idx}`}
                href={navItem.link}
                className={cn(
                  "relative items-center flex space-x-1 transition-colors font-bold zen-dots-regular",
                  isActive ? "text-red-500" : "text-neutral-200 hover:text-red-500"
                )}
              >
                <span className="text-sm lg:text-base xl:text-lg">{navItem.name}</span>
              </Link>
            );
          })}
        </div>

        {/* Right Side: Login + Mobile Toggle */}
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
          {user ? (
            <div className="flex items-center gap-2 sm:gap-3">
              <Link href="/profile" className="flex items-center gap-2 sm:gap-3 hover:opacity-80 transition-opacity">
                <span className="hidden md:block text-xs lg:text-sm font-bold text-white zen-dots-regular">
                    {user.displayName?.split(' ')[0]}
                </span>
                <div className="relative w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full border-2 border-red-600 overflow-hidden shadow-[0_0_10px_rgba(220,38,38,0.5)]">
                  {user.photoURL ? (
                    <Image 
                      src={user.photoURL} 
                      alt="Profile" 
                      fill 
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-red-600 flex items-center justify-center text-white font-bold text-sm">
                      {user.displayName?.charAt(0) || 'U'}
                    </div>
                  )}
                </div>
              </Link>
              <button 
                onClick={handleLogout}
                className="p-1.5 sm:p-2 text-gray-400 hover:text-red-500 transition-colors"
                title="Logout"
              >
                <LogOut size={18} className="sm:w-5 sm:h-5" />
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="border text-xs sm:text-sm md:text-base font-bold relative border-red-600/50 text-white px-3 py-1.5 sm:px-4 sm:py-2 md:px-6 rounded-full hover:bg-red-600 hover:text-white transition-all duration-300 shadow-[0_0_10px_rgba(220,38,38,0.3)] hover:shadow-[0_0_20px_rgba(220,38,38,0.6)]"
            >
              <span>Login</span>
              <span className="absolute inset-x-0 w-1/2 mx-auto -bottom-px bg-gradient-to-r from-transparent via-red-500 to-transparent h-px" />
            </Link>
          )}

          <button
            onClick={() => setOpen(!open)}
            className="text-neutral-200 hover:text-red-500 transition-colors md:hidden"
          >
            {open ? <X size={22} className="sm:w-6 sm:h-6" /> : <Menu size={22} className="sm:w-6 sm:h-6" />}
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="absolute top-full left-0 w-full bg-black/95 border-b border-red-600/30 overflow-hidden md:hidden"
            >
              <div className="flex flex-col items-center py-4 sm:py-6 space-y-4 sm:space-y-6">
                {navItems.map((navItem, idx: number) => {
                  const isActive = pathname === navItem.link || (pathname.startsWith(navItem.link) && navItem.link !== '/');
                  return (
                    <Link
                      key={`mobile-link=${idx}`}
                      href={navItem.link}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "text-base sm:text-lg font-bold zen-dots-regular transition-colors",
                        isActive ? "text-red-500" : "text-neutral-200 hover:text-red-500"
                      )}
                    >
                      {navItem.name}
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
};