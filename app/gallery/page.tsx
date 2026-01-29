import ParallaxScrollGallery from '@/components/ui/ParallaxScrollGallery';
import Image from 'next/image';
export default function GalleryPage() {
  const trailImages = [
    "/images/event1.JPG",
    "/images/event2.JPG",
    "/images/inaugration.JPG",
    "/images/paperpresentation.JPG",
    "/images/plotathon.JPG",
    "/images/promptopia.jpeg",
    "/images/workshop1.JPG",
    "/images/nontech1.JPG",
    "/images/students.JPG",
    "/images/students1.JPG",
    "/images/crew.JPG",
    "/images/partha1.JPG",
    "/images/partha2.JPG",
    "/images/guest.JPG",
    "/images/promptopia2.jpeg"
  ];

  const staticImages = [
    "/images/Chairman.JPG",
    "/images/head.JPG",
    "/images/HOD.JPG",
    "/images/pongal.jpeg"
  ];

  return (
    <div className='min-h-screen pt-32 pb-12 bg-black relative z-10'>

      <div className="max-w-7xl mx-auto px-4 mb-12 text-center">
        <h1 className="text-3xl md:text-5xl text-white tracking-tighter uppercase bbh-bartle-regular">
          TALOS <span className="text-[#dc2626]">MEMORIES</span>
        </h1>
      </div>

      {/* Top Grid Section - Exact Half-Half Split */}
      <div className="w-full max-w-7xl mx-auto mb-12 px-4 grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch">

        {/* Left Half: Video Section */}
        <div className="relative bg-black border border-white/10 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(220,38,38,0.2)] group min-h-[500px]">
          <iframe
            src="https://www.youtube.com/embed/tXlZK30j_ao?autoplay=1&mute=1&loop=1&playlist=tXlZK30j_ao&controls=1&modestbranding=1&rel=0&showinfo=0"
            className="w-full h-full min-h-[500px]"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        {/* Right Half: 4 Static Pictures (2x2 Grid) */}
        <div className="grid grid-cols-2 gap-4 h-full">
          {staticImages.map((src, i) => (
            <div key={i} className="relative rounded-xl overflow-hidden border border-white/10 group bg-black">
              <div className="absolute inset-0 bg-red-900/10 group-hover:bg-transparent transition-colors duration-300 z-10 pointer-events-none" />
              <Image
                src={src}
                alt={`Gallery Static ${i + 1}`}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>
          ))}
        </div>

      </div>

      {/* Gallery Animation Section */}
      <div className="w-full mb-12">
        <div className="max-w-7xl mx-auto px-4 mb-10">
          <h2 className="text-2xl md:text-4xl font-black text-white tracking-tighter uppercase">
            Experience <span className="text-red-600">Talos</span>
          </h2>
          <div className="mt-3 h-1 w-16 bg-red-600 rounded-full" />
        </div>
        <ParallaxScrollGallery images={trailImages} />
      </div>
    </div>
  );
}