"use client";

import { LogOut } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function TopBar() {
  const router = useRouter();

  async function logOut() {
    const res = await fetch("/api/auth/logout", {
      method: "POST",
      cache: "no-store",
    });

    if (res.ok) {
      router.push("/login");
    }
  }

  return (
    <header
      className="
        w-[100vw] h-[10vh]
        flex items-center justify-between
        bg-[#F8FAFC]
        border-b-[0.15vh] border-slate-200
        px-[2vw]
      "
    >
      {/* Logo */}
      <div className="h-[6vh] w-[12vw] relative">
        <Image
          src="/logo.png"
          alt="Logo"
          fill
          priority
          className="object-contain"
        />
      </div>

      {/* User Area */}
      <div className="flex items-center gap-[2vw]">
        {/* User Info */}
        <div className="flex items-center gap-[0.5vw]">
          <span
            className="
              w-[7vh] h-[7vh]
              rounded-full
              border-[0.2vh] border-slate-500
              flex items-center justify-center
              text-[4vh] font-semibold
            "
          >
            U
          </span>

          <p className="text-[1.4vw] font-medium text-slate-700">User</p>
        </div>

        {/* Logout */}
        <button
          onClick={logOut}
          className="
            flex items-center gap-[0.6vw]
            px-[1vw] py-[0.8vh]
            border-[0.15vh] border-slate-400
            rounded-[0.8vh]
            hover:bg-slate-300
            transition-colors
          "
        >
          <span className="text-[1.3vw] font-medium">Sair</span>

          <LogOut
            style={{
              width: "1.4vw",
              height: "1.4vw",
            }}
          />
        </button>
      </div>
    </header>
  );
}
