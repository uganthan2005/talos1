import React from 'react';
import Link from 'next/link';
import Container from '../layout/Container';

export default function Footer() {
  return (
    <footer className="bg-black pt-12 pb-6 font-[family-name:var(--font-zen-dots)] text-sm">
      <div className="w-full px-4 md:px-8">
        {/* Terminal Window */}
        <div className="w-full overflow-hidden rounded-lg border border-red-900/30 bg-black shadow-xl ring-1 ring-red-500/20">

          {/* Terminal Header */}
          <div className="flex items-center justify-between bg-[#0a0a0a] px-4 py-2 border-b border-red-900/30">
            <div className="flex gap-2">
              <div className="h-3 w-3 rounded-full bg-red-600 hover:bg-red-500 transition-colors shadow-[0_0_8px_rgba(220,38,38,0.6)]" />
              <div className="h-3 w-3 rounded-full bg-red-800 hover:bg-red-700 transition-colors" />
              <div className="h-3 w-3 rounded-full bg-red-950 hover:bg-red-900 transition-colors" />
            </div>
            <div className="text-xs text-[#ff0000] font-semibold select-none tracking-wider">
              user@talos-5.0-2026
            </div>
            <div className="w-14">{/* Spacer for centering title */}</div>
          </div>

          {/* Terminal Body */}
          <div className="p-6 md:p-8 bg-black/95 relative">
            {/* Subtle red grid background */}
            <div className="absolute inset-0 pointer-events-none opacity-5" style={{ backgroundImage: 'linear-gradient(#330000 1px, transparent 1px), linear-gradient(90deg, #330000 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

            <div className="relative grid grid-cols-1 gap-12 lg:grid-cols-2">

              {/* Left Column: Identity & Location */}
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-red-500 mb-2">
                    <span className="text-red-500">root@host</span>
                    <span className="text-red-500">:</span>
                    <span className="text-red-500">~$</span> TALOS-5.0
                  </h2>
                  <p className="text-[#FFFFFF] max-w-md mt-4 leading-relaxed">
                    Initializing <span className="text-red-600">red chip...</span><br />
                    <span className="text-[#FFFFFF]">
                      &gt; Loading crimson modules...<span className="text-green-500"> Done.</span><br />
                      &gt; Establishing connection to database... <span className="text-green-500">Success</span>
                    </span>
                  </p>
                </div>

                <div className="space-y-3">
                  {/* Map with filters */}
                  <div className="relative h-48 w-full overflow-hidden rounded border border-red-900/40 group">
                    <div className="absolute inset-0 z-10 pointer-events-none border border-red-500/10 mix-blend-overlay"></div>
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.0045129864275!2d80.04307899999999!3d12.971562799999997!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a52f4d07355bab5%3A0xbb6063169c4ed4d9!2sChennai%20Institute%20of%20Technology!5e0!3m2!1sen!2sin!4v1767802258558!5m2!1sen!2sin"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      className="h-full w-full grayscale invert hover:invert-0 transition-all duration-500 ease-in-out"
                    ></iframe>
                  </div>
                  <div className="text-[#FFFFFF] text-sm">
                    <span className="text-[#FFFFFF] inline-block mr-2">{'//'}</span>
                    Sarathy nagar, Kundrathur, Chennai, Tamil Nadu, PIN: 600069
                  </div>
                </div>
              </div>

              {/* Right Column: Links Grid */}
              <div className="grid grid-cols-2 gap-8 gap-y-12 content-start">

                {/* Navigation */}
                <div className="space-y-4">
                  <h3 className="text-red-500 font-bold border-b border-red-900/30 pb-2 inline-block">
                    ./Navigation
                  </h3>
                  <ul className="space-y-2 text-[#FFFFFF]">
                    <li><Link href="/" className="hover:text-red-600 transition-colors hover:before:content-['>_'] hover:before:mr-2 hover:before:text-red-600">Home</Link></li>
                    <li><Link href="/events" className="hover:text-red-600 transition-colors hover:before:content-['>_'] hover:before:mr-2 hover:before:text-red-600">Events</Link></li>
                    <li><Link href="/workshops" className="hover:text-red-600 transition-colors hover:before:content-['>_'] hover:before:mr-2 hover:before:text-red-600">Workshops</Link></li>
                    <li><Link href="/gallery" className="hover:text-red-600 transition-colors hover:before:content-['>_'] hover:before:mr-2 hover:before:text-red-600">Gallery</Link></li>
                    <li><Link href="/about" className="hover:text-red-600 transition-colors hover:before:content-['>_'] hover:before:mr-2 hover:before:text-red-600">About</Link></li>
                  </ul>
                </div>

                {/* Socials */}
                <div className="space-y-4">
                  <h3 className="text-red-500 font-bold border-b border-red-900/30 pb-2 inline-block">
                    ./Social_Handles
                  </h3>
                  <ul className="space-y-2 text-[#FFFFFF]">
                    <li>
                      <a href="https://www.instagram.com/talos_cit/" className="flex items-center gap-2 hover:text-red-400 transition-colors group">
                        <span className="text-red-900 group-hover:text-red-500">@</span>Instagram
                      </a>
                    </li>
                    <li>
                      <a href="https://www.youtube.com/watch?v=nT8EWTbimRs" className="flex items-center gap-2 hover:text-red-400 transition-colors group">
                        <span className="text-red-900 group-hover:text-red-500">@</span>YouTube
                      </a>
                    </li>
                  </ul>
                </div>

                {/* System Info */}
                <div className="space-y-4">
                  <h3 className="text-red-500 font-bold border-b border-red-900/30 pb-2 inline-block">
                    ./System_Info
                  </h3>
                  <div className="text-[#FFFFFF] space-y-2 text-sm">
                    <p><span className="text-red-500">SYMPOSIUM:</span> TALOS 5.0</p>
                    <p><span className="text-red-500">DEPT:</span> Artificial Intelligence and Data Science</p>
                    <p><span className="text-red-500">COLLEGE:</span> Chennai Institute of Technology</p>
                    <p><span className="text-red-500">STATUS:</span> <span className="text-[#00ff04] animate-pulse">● Online</span></p>
                  </div>
                </div>

                {/* Event Coordinators */}
                <div className="space-y-4">
                  <h3 className="text-red-500 font-bold border-b border-red-900/30 pb-2 inline-block">
                    ./Event_Coordinators
                  </h3>
                  <ul className="space-y-2 text-[#FFFFFF] text-sm">
                    <li className="flex flex-col">
                      <span className="text-red-600">Muzammil</span>
                      <a href="tel:73054 01558" className="hover:text-red-600 transition-colors">73054 01558</a>
                    </li>
                    <li className="flex flex-col">
                      <span className="text-red-600">Madhan</span>
                      <a href="tel:63820 29023" className="hover:text-red-600 transition-colors">63820 29023</a>
                    </li>
                  </ul>
                  <h4 className="text-red-400 font-semibold text-xs mt-4">Staff Coordinator</h4>
                  <div className="text-[#FFFFFF] text-xs space-y-1">
                    <p className="text-red-600 text-sm font-bold">Pratham Verma</p>
                    <p><a href="tel:9760162803" className="hover:text-red-600 transition-colors">97601 62803</a></p>
                    <p>Assistant Professor</p>
                    <p>Dept of AI&DS, CIT Chennai</p>
                  </div>
                </div>

                {/* Legal */}
                <div className="space-y-4">
                  <h3 className="text-red-500 font-bold border-b border-red-900/30 pb-2 inline-block">
                    ./Legal
                  </h3>
                  <ul className="space-y-2 text-[#FFFFFF] text-sm">
                    <li><Link href="/terms" className="hover:text-red-600 transition-colors decoration-dashed underline underline-offset-4 decoration-red-900/40">Terms_&_Conditions</Link></li>
                    <li><Link href="/privacy-policy" className="hover:text-red-600 transition-colors decoration-dashed underline underline-offset-4 decoration-red-900/40">Privacy_Policy</Link></li>
                    <li><Link href="/refund-policy" className="hover:text-red-600 transition-colors decoration-dashed underline underline-offset-4 decoration-red-900/40">Refund_Policy</Link></li>
                  </ul>
                </div>

                {/* Contact Us */}
                <div className="space-y-4">
                  <h3 className="text-red-500 font-bold border-b border-red-900/30 pb-2 inline-block">
                    ./Contact_Us
                  </h3>
                  <ul className="space-y-2 text-[#FFFFFF] text-sm">
                    <li><Link href="/contact" className="hover:text-red-600 transition-colors decoration-dashed underline underline-offset-4 decoration-red-900/40">Contact_Information</Link></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Terminal Footer Status Bar */}
          <div className="bg-[#0a0a0a] px-4 py-2 border-t border-red-900/30 flex justify-between items-center text-xs">
            <div className="flex items-center gap-4">
              <span className="text-red-600 font-bold">NORMAL</span>
              <span className="text-red-900/40">|</span>
              <span className="text-red-400">master*</span>
              <span className="text-red-900/40">|</span>
              <span className="text-gray-500">utf-8</span>
            </div>
            <div className="text-red-500/60 flex items-center gap-2">
              <span>System Ready</span>
              <span className="animate-pulse font-bold text-red-500">_</span>
            </div>
          </div>
        </div>

        <div className="text-center mt-8 text-[#b6b6b6] text-xs">
           /* DESIGNED & DEVELOPED BY DEVELOPER TEAM */
        </div>
      </div>
    </footer>
  );
}