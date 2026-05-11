import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Image from "next/image";
import ChatBot from "./components/ChatBot";
import AmbientParticles from "./components/AmbientParticles";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Eirene Salon - Premium Unisex Salon",
  description: "Experience the pinnacle of hair and beauty care at Eirene Salon.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}>
      <body className="min-h-full flex flex-col bg-[#020202] text-white relative">
        {/* Global Fixed Background for Immersion */}
        <div className="fixed inset-0 z-0 opacity-20 pointer-events-none">
          <Image 
            src="/eirene-brand.png" 
            alt="Background Texture" 
            fill 
            className="object-cover animate-slow-zoom contrast-125 saturate-150"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#020202] via-transparent to-[#020202]"></div>
        </div>
        <div className="relative z-10 flex-1 flex flex-col">
          {children}
          <AmbientParticles />
          <ChatBot />
        </div>
      </body>
    </html>
  );
}
