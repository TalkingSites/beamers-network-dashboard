import type { Metadata } from "next";
import { Geist, Dancing_Script } from "next/font/google";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./globals.css";
import { Starfield } from "@/components/Starfield";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });
const dancingScript = Dancing_Script({ subsets: ["latin"], variable: "--font-dancing-script" });

export const metadata: Metadata = {
  title: "Beamers Network",
  description: "Wizard dashboard",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} ${dancingScript.variable}`}>
      <body>
        <Starfield />
        {children}
      </body>
    </html>
  );
}
