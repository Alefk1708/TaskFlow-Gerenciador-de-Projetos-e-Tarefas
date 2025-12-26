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
        <div className="
          flex 
          w-[100vw] h-[90vh]
          
          /* MOBILE: Coluna (embora a sidebar seja fixed, isso organiza o fluxo) */
          flex-col 
          
          /* PC: Linha (Sidebar na esquerda, conteúdo na direita) */
          lg:flex-row
        ">
          
          {/* Sidebar */}
          <SideBar />

          {/* Content */}
          <main
            className="
              bg-white
              overflow-y-auto
              h-full
              
              /* MOBILE: Ocupa a largura toda (já que a sidebar tá embaixo) */
              w-full
              
              /* PC: Mantém sua medida exata de 82vw */
              lg:w-[82vw]
            "
          >
            {children}
          </main>

        </div>
      </body>
    </html>
  );
}