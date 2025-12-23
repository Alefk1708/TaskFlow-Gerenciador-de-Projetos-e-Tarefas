'use client'

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"

export default function ProjetosPage() {
     const [list, setList] = useState([])
     const router = useRouter();
      
    
      useEffect(() => {
      async function fetchTasks() {
        try {
          const response = await fetch('/api/task/list');
          const data = await response.json();
          setList(data);
          console.log(data)
        } catch (error) {
          console.log(error);
        }
      }
    
      fetchTasks();
    }, []);
    
  return (
    <div className="w-full h-full">
      <div className=" w-full h-[9vh]  flex flex-row justify-between items-center px-[2vw] ">
        <h1 className="text-[2vw] text-slate-600 font-semibold ">Projetos</h1>
        <button
          className="
          w-[11vw] h-[6vh]
          bg-blue-600
          text-white
          rounded-[0.8vh]
          text-[1.4vw]
          font-medium
          hover:bg-blue-700
          transition-colors
        "
          onClick={() => router.push("/projetos/novo")}
        >
          Novo projeto
        </button>
      </div>
    </div>
  );
}
