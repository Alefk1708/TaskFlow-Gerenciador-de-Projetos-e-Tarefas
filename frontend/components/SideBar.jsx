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
    <aside className="w-[18vw] h-[90vh] bg-slate-50 border-r-[0.15vh] border-slate-200">
      <nav className="p-[2vh]">
        <ul className="flex flex-col gap-[0.8vh]">
          {links.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;

            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`
                    flex items-center gap-[1vw]
                    px-[1vw] py-[1.2vh]
                    rounded-[0.8vh]
                    transition-colors
                    ${
                      isActive
                        ? "bg-blue-100 text-blue-600"
                        : "text-slate-600 hover:bg-slate-100"
                    }
                  `}
                >
                  <Icon
                    
                    className={`${isActive ? "text-blue-600" : "text-slate-400"} size-[2vw]`}
                  />
                  <span className="text-[2.6vh] font-medium">
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
