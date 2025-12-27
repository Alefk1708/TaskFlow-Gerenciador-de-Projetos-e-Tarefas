"use client";

import { LogOut } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function TopBar() {
  const router = useRouter();
  const [user, setUser] = useState([])

  async function logOut() {
    const res = await fetch("/api/auth/logout", {
      method: "POST",
      cache: "no-store",
    });

    if (res.ok) {
      router.push("/login");
    }
  }

  useEffect(() => {
    async function pegarUsuario() {
      try {
        const res = await fetch('/api/auth/me', {
          cache: 'no-store'
        })
        const data = await res.json()
        setUser(data)
      } catch {
        return null
      }
    }
    pegarUsuario()
  }, [])

  return (
    <header
      className="
        w-[100vw] h-[10vh]
        flex items-center justify-between
        bg-[#F8FAFC]
        border-b-[0.15vh] border-slate-200
        
        /* MOBILE: Padding lateral maior */
        px-[5vw]
        /* PC: Seu padding original */
        lg:px-[2vw]
      "
    >
      {/* Logo Container */}
      <div className="
        relative h-[6vh]
        
        /* MOBILE: Logo maior */
        w-[30vw]
        /* PC: Tamanho original */
        lg:w-[12vw]
      ">
        <Image
          src="/logo.png"
          alt="Logo"
          fill
          priority
          className="object-contain"
        />
      </div>

      {/* User Area */}
      <div className="
        flex items-center 
        /* MOBILE: Gap maior entre avatar e botão */
        gap-[4vw] 
        /* PC: Gap original */
        lg:gap-[2vw]
      ">
        {/* User Info */}
        <div className="
          flex items-center 
          gap-[2vw] lg:gap-[0.5vw]
        ">
          <span
            className="
              w-[7vh] h-[7vh]
              rounded-full
              border-[0.2vh] border-slate-500
              flex items-center justify-center
              font-semibold
              
              /* MOBILE: Texto do avatar um pouco menor para caber no circulo */
              text-[3vh]
              /* PC: Texto original */
              lg:text-[4vh]
            "
          >
            {user?.name ? user?.name?.charAt(0).toUpperCase() : "U"}
          </span>

          <p className="
            font-medium text-slate-700
            
            /* MOBILE: Ocultar nome em telas muito pequenas ou deixar texto maior */
            hidden sm:block sm:text-[3.5vw]
            /* PC: Texto original */
            lg:block lg:text-[1.4vw]
          ">
            {user.name ? user?.name : "Usuário"}
          </p>
        </div>

        {/* Logout Button */}
        <button
          onClick={logOut}
          className="
            flex items-center 
            border-[0.15vh] border-slate-400
            rounded-[0.8vh]
            hover:bg-slate-300
            transition-colors
            
            /* MOBILE: Padding e gap maiores */
            px-[3vw] py-[1vh] gap-[2vw]
            /* PC: Medidas originais */
            lg:px-[1vw] lg:py-[0.8vh] lg:gap-[0.6vw]
          "
        >
          <span className="
            font-medium
            /* MOBILE: Texto maior */
            text-[3.5vw]
            /* PC: Texto original */
            lg:text-[1.3vw]
          ">
            Sair
          </span>

          <LogOut
            className="
              /* MOBILE: Ícone maior */
              w-[4vw] h-[4vw]
              /* PC: Ícone original */
              lg:w-[1.4vw] lg:h-[1.4vw]
            "
          />
        </button>
      </div>
    </header>
  );
}