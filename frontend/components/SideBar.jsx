"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Folder,
  CircleUserRound,
} from "lucide-react";

export default function SideBar() {
  const pathname = usePathname();

  const links = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Projetos", href: "/projetos", icon: Folder },
    { name: "Perfil", href: "/perfil", icon: CircleUserRound },
  ];

  return (
    <aside className="
      /* --- MOBILE (Padrão) --- */
      /* Fixa no rodapé, largura total, borda em cima */
      fixed bottom-0 left-0 w-full h-[10vh] bg-slate-50 border-t border-slate-200 z-50

      /* --- PC (Prefixo lg:) --- */
      /* Restaura EXATAMENTE as suas medidas originais */
      lg:static lg:w-[18vw] lg:h-[90vh] lg:border-t-0 lg:border-r-[0.15vh] lg:border-slate-200
    ">
      <nav className="
        h-full
        /* PC: Padding original */
        lg:h-auto lg:p-[2vh]
      ">
        <ul className="
          /* MOBILE: Lista horizontal (lado a lado) */
          flex flex-row justify-around items-center h-full
          
          /* PC: Lista vertical (gap original) */
          lg:flex-col lg:justify-start lg:h-auto lg:gap-[0.8vh]
        ">
          {links.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;

            return (
              <li key={link.href} className="w-full">
                <Link
                  href={link.href}
                  className={`
                    transition-colors
                    
                    /* MOBILE: Coluna (ícone em cima, texto embaixo) e centralizado */
                    flex flex-col items-center justify-center h-full gap-[0.5vh]
                    
                    /* PC: Linha (ícone ao lado) e medidas originais */
                    lg:flex-row lg:justify-start lg:gap-[1vw] lg:px-[1vw] lg:py-[1.2vh] lg:rounded-[0.8vh]

                    ${
                      isActive
                        ? "text-blue-600 lg:bg-blue-100" // No mobile só pinta o texto, no PC tem o fundo azul
                        : "text-slate-600 hover:bg-slate-100"
                    }
                  `}
                >
                  <Icon
                    className={`
                      ${isActive ? "text-blue-600" : "text-slate-400"} 
                      
                      /* MOBILE: Ícone maior para toque */
                      size-[6vw] 
                      
                      /* PC: Tamanho original */
                      lg:size-[2vw]
                    `}
                  />
                  <span className={`
                    font-medium
                    
                    /* MOBILE: Texto menor */
                    text-[3vw]
                    
                    /* PC: Tamanho original */
                    lg:text-[2.6vh]
                  `}>
                    {link.name}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}