'use client'

import { LogOut } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function TopBar() {

    const router = useRouter()

    async function logOut() {
        const res = await fetch("/api/auth/logout", {
            method: "POST",
            cache: "no-store"
        })
        if (res.ok) {
            router.push("/login")
        }
    }

  return (
    <header className="w-full h-[10vh] flex items-center justify-between bg-slate-200 border-b-[0.15vh] border-slate-400 px-[2vw]">
      
      {/* Logo */}
      <Image
        src="/logo.png"
        width={200}
        height={80}
        alt="Logo"
        className="h-[8vh] w-auto"
        priority
      />

      {/* User Area */}
      <div className="flex items-center gap-[2vw]">
        
        {/* User Info */}
        <div className="flex items-center gap-[0.8vw]">
          <span className="w-[6vh] h-[6vh] rounded-full border-[0.2vh] border-gray-500 flex items-center justify-center text-[1.7vw] font-semibold">
            U
          </span>
          <p className="text-[1.3vw] font-medium">User</p>
        </div>

        {/* Logout */}
        <button
          className="flex items-center gap-[0.6vw] px-[0.7vw] py-[0.7vh]
                     border-[0.15vh] border-slate-400 rounded-[0.8vw]
                     hover:bg-slate-300 transition-colors" 
                     onClick={() => logOut()}
        >
          <span className="text-[1.3vw] font-medium">Sair</span>
          <LogOut className="size-[1.6vw]" />
        </button>
      </div>
    </header>
  );
}
