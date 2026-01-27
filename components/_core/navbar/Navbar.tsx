import { FloatingNav } from "@/components/ui/floating-navbar";
import { Home, CalendarDays, Wrench, Images, Info } from "lucide-react";

export default function Navbar() {
  const navItems = [
    { 
      name: "Home", 
      link: "/", 
      icon: <Home className="h-4 w-4" /> 
    },
    { 
      name: "Events", 
      link: "/events", 
      icon: <CalendarDays className="h-4 w-4" /> 
    },
    { 
      name: "Workshops", 
      link: "/workshops", 
      icon: <Wrench className="h-4 w-4" /> 
    },
    { 
      name: "Gallery", 
      link: "/gallery", 
      icon: <Images className="h-4 w-4" /> 
    },
    { 
      name: "About", 
      link: "/about", 
      icon: <Info className="h-4 w-4" /> 
    },
  ];

  return (
    <div className="relative w-full">
      <FloatingNav navItems={navItems} />
    </div>
  );
}
