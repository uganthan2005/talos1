"use client";

import { motion } from "framer-motion";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8 }
  }
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-black text-white pt-32 pb-20 px-4 md:px-12 overflow-x-hidden">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="space-y-8"
        >
          {/* Header */}
          <div className="border-b border-red-900/30 pb-8">
            <h1 className="text-3xl md:text-5xl text-red-600 mb-4 zen-dots-regular">CONTACT US</h1>
            <p className="text-sm md:text-base ibm-plex-mono-semibold text-gray-400">
              Last updated on 15-01-2026 17:07:51
            </p>
          </div>

          {/* Content */}
          <div className="space-y-6 text-sm md:text-base ibm-plex-mono text-gray-300 leading-relaxed">
            <p>
              You may contact us using the information below:
            </p>

            <div className="grid gap-6 md:grid-cols-1 bg-zinc-900/30 p-6 rounded-lg border border-red-900/20">
              <div className="space-y-4">
                
                <div className="flex flex-col md:flex-row md:gap-4">
                  <span className="text-red-500 font-bold min-w-[240px]">Merchant Legal entity name:</span>
                  <span>taloscit</span>
                </div>

                <div className="flex flex-col md:flex-row md:gap-4">
                  <span className="text-red-500 font-bold min-w-[240px]">Registered Address:</span>
                  <span>Sarathy nagar, Kundrathur, Chennai, Tamil Nadu, PIN: 600069</span>
                </div>

                <div className="flex flex-col md:flex-row md:gap-4">
                  <span className="text-red-500 font-bold min-w-[240px]">Operational Address:</span>
                  <span>Sarathy nagar, Kundrathur, Chennai, Tamil Nadu, PIN: 600069</span>
                </div>

                <div className="flex flex-col md:flex-row md:gap-4">
                  <span className="text-red-500 font-bold min-w-[240px]">Telephone No:</span>
                  <a href="tel:7305401558" className="hover:text-red-400 transition-colors">7305401558</a>
                </div>

                <div className="flex flex-col md:flex-row md:gap-4">
                  <span className="text-red-500 font-bold min-w-[240px]">E-Mail ID:</span>
                  <a href="mailto:taloscit72@gmail.com" className="hover:text-red-400 transition-colors">taloscit72@gmail.com</a>
                </div>

              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
