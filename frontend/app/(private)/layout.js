import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import SideBar from "@/components/SideBar";
import TopBar from "@/components/TopBar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "TaskFlow",
  description: "...",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body
        className={`
          ${geistSans.variable} ${geistMono.variable}
          antialiased
          w-[100vw] h-[100vh]
          overflow-hidden
        `}
      >
        {/* TopBar */}
        <TopBar />

        {/* Main area (Sidebar + Content) */}
        <div className="flex w-[100vw] h-[90vh]">
          
          {/* Sidebar */}
          <SideBar />

          {/* Content */}
          <main
            className="
              w-[82vw] h-[90vh]
              bg-white
              overflow-y-auto
              
            "
          >
            {children}
          </main>

        </div>
      </body>
    </html>
  );
}
