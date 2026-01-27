import type { Metadata } from "next";
import { Zen_Dots, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/_core/navbar/Navbar";
import Footer from "@/components/_core/footer/Footer";
import SmoothScroll from "@/components/SmoothScroll";
import Ribbons from "@/components/ui/Ribbons";
import CustomCursor from "@/components/ui/CustomCursor";

// Only load most essential fonts - reduced from 5 to 2
const zenDots = Zen_Dots({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-zen-dots",
  display: "swap", // Ensure text is visible while font loads
});

const ibmPlexMono = IBM_Plex_Mono({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-ibm-plex-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Talos 5.0",
  description: "Official website for Department of Artificial Intelligence and Data Science Symposium 2026",
  icons: {
    icon: [
      { url: '/Logo.png', sizes: '32x32', type: 'image/png' },
      { url: '/Logo.png', sizes: '192x192', type: 'image/png' },
      { url: '/Logo.png', sizes: '512x512', type: 'image/png' },
    ],
    shortcut: '/Logo.png',
    apple: [
      { url: '/Logo.png', sizes: '180x180', type: 'image/png' },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/Logo.png" type="image/png" sizes="32x32" />
        <link rel="icon" href="/Logo.png" type="image/png" sizes="192x192" />
        <link rel="apple-touch-icon" href="/Logo.png" sizes="180x180" />
      </head>
      <body className={`min-h-screen flex flex-col ${zenDots.variable} ${ibmPlexMono.variable}`}>
        <CustomCursor />
        {/* Ribbons temporarily disabled due to Turbopack compatibility issues */}
        {/* <Ribbons
          baseThickness={10}
          colors={['#ff0000']}
          speedMultiplier={1.0}
          maxAge={400}
          pointCount={25}
          enableFade={false}
          enableShaderEffect={false}
        /> */}
        <SmoothScroll>
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  );
}