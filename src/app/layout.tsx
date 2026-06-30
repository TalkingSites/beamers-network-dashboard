import type { Metadata } from "next";
import { Geist, Dancing_Script, Cinzel, Cormorant_Garamond } from "next/font/google";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./globals.css";
import { Starfield } from "@/components/Starfield";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });
const dancingScript = Dancing_Script({ subsets: ["latin"], variable: "--font-dancing-script" });
const cinzel = Cinzel({ subsets: ["latin"], weight: "600", variable: "--font-cinzel" });
const cormorant = Cormorant_Garamond({ subsets: ["latin"], weight: ["600", "700"], variable: "--font-cormorant" });

export const metadata: Metadata = {
  title: "Beamers Network",
  description: "Wizard dashboard",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} ${dancingScript.variable} ${cinzel.variable} ${cormorant.variable}`}>
      <body>
        <Starfield />
        {children}
      </body>
    </html>
  );
}
