"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react"; 

export default function ProjetosPage() {
  const [list, setList] = useState([]);
  const router = useRouter();

  async function updateTask(done, id) {
  
    setList((prevList) =>
      prevList.map((task) => (task.id === id ? { ...task, done: done } : task))
    );

    try {
      await fetch("/api/task/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ done, id }),
      });
    } catch (error) {
      console.error("Erro ao sincronizar:", error);
    }
  }

  async function deleteTask(id) {
    
    setList((prevList) => prevList.filter((task) => task.id !== id));

    try {
      await fetch(`/api/task/delete/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Erro ao deletar:", error);
    }
  }

  useEffect(() => {
    async function fetchTasks() {
      try {
        const response = await fetch("/api/task/list");
        const data = await response.json();
        setList(data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchTasks();
  }, []);

  return (
    <div className="
      w-full h-full flex flex-col pt-[2vh]
      /* MOBILE: Padding bottom extra para não esconder conteúdo atrás do menu */
      pb-[12vh]
      /* PC: Remove padding bottom extra */
      lg:pb-0
    ">
      {/* HEADER */}
      <header className="
        w-full h-[9vh] flex justify-between items-center 
        /* MOBILE: Padding maior */
        px-[5vw]
        /* PC: Padding original */
        lg:px-[2vw]
      ">
        <h1 className="
          text-slate-600 font-semibold
          /* MOBILE: Texto grande */
          text-[6vw]
          /* PC: Texto original */
          lg:text-[2vw]
        ">
          Projetos
        </h1>
        <button
          className="
            bg-blue-600 text-white rounded-[0.8vh] font-medium hover:bg-blue-700 transition-colors
            /* MOBILE: Botão maior */
            w-[35vw] h-[6vh] text-[4vw]
            /* PC: Botão original */
            lg:w-[11vw] lg:text-[1.4vw]
          "
          onClick={() => router.push("/projetos/novo")}
        >
          Novo projeto
        </button>
      </header>

      {/* LISTA */}
      <main className="
        h-full lg:h-[91vh] pt-[2vh] overflow-y-auto
        /* MOBILE: Padding lateral maior */
        px-[5vw]
        /* PC: Padding original */
        lg:px-[2vw]
      ">
        <div className="
          flex 
          /* MOBILE: Coluna (um embaixo do outro) e gap maior */
          flex-col gap-[2vh]
          /* PC: Linha (Grid) e gap original */
          lg:flex-row lg:flex-wrap lg:gap-[1vw]
        ">
          {list.map((item) => (
            <div
              key={item.id}
              onClick={() => router.push(`/projetos/${item.id}`)}
              className="
                flex flex-col justify-between
                border-[0.1vw] border-slate-300
                hover:shadow-md transition-shadow
                cursor-pointer bg-white
                group relative
                
                /* MOBILE: Largura total, altura automática (cresce com texto), padding maior, borda arredondada maior */
                w-full h-auto min-h-[20vh] rounded-[3vw] p-[4vw]
                
                /* PC: Medidas originais */
                lg:w-[18vw] lg:h-[25vh] lg:rounded-[1vw] lg:p-[1.5vh]
              "
            >
              {/* TÍTULO */}
              <h2 className={`
                font-semibold text-slate-700 truncate
                /* MOBILE: Texto grande */
                text-[5vw]
                /* PC: Texto original */
                lg:text-[1.4vw]
                ${item.done? "line-through" : ""}
              `}>
                {item.title}
              </h2>

              {/* DESCRIÇÃO */}
              <p className={`
                text-slate-500
                /* MOBILE: Texto legível */
                text-[3.5vw]
                /* PC: Texto original */
                lg:text-[1vw]
                ${item.done? "line-through" : ""}
              `}>
                {item.descricao?.length > 60
                  ? item.descricao.substring(0, 60) + "..."
                  : item.descricao}
              </p>

              {/* PRIORIDADE */}
              <span
                className={`
                  rounded-[0.6vh] text-white w-fit
                  
                  /* MOBILE: Badge maior */
                  px-[2vw] py-[0.5vh] text-[3vw]
                  /* PC: Badge original */
                  lg:px-[0.8vw] lg:py-[0.3vh] lg:text-[0.9vw]

                  ${
                    item.priority === "baixa"
                      ? "bg-green-600"
                      : item.priority === "media"
                      ? "bg-yellow-600"
                      : "bg-red-600"
                  }
                `}
              >
                {item.priority}
              </span>

              {/* FOOTER DO CARD: Checkbox e Delete */}
              <div
                className="flex items-center justify-between mt-[1vh]"
                onClick={(e) => e.stopPropagation()} 
              >
                {/* Lado Esquerdo: Checkbox */}
                <label className="
                  flex items-center text-slate-600 cursor-pointer hover:text-slate-800
                  /* MOBILE: Gap e texto maiores */
                  gap-[2vw] text-[3.5vw]
                  /* PC: Gap e texto originais */
                  lg:gap-[0.5vw] lg:text-[1vw]
                ">
                  <input
                    type="checkbox"
                    checked={item.done}
                    onChange={(e) => updateTask(e.target.checked, item.id)}
                    className="
                      cursor-pointer accent-blue-600
                      /* MOBILE: Checkbox grande */
                      w-[5vw] h-[5vw]
                      /* PC: Checkbox original */
                      lg:w-[1.2vw] lg:h-[1.2vw]
                    "
                  />
                  <span>{item.done ? "Concluído" : "Pendente"}</span>
                </label>

                {/* Lado Direito: Botão Delete (Lixeira) */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteTask(item.id);
                  }}
                  className="
                    text-slate-400 
                    hover:text-red-600 
                    hover:bg-red-50 
                    transition-colors
                    
                    /* MOBILE: Área de toque maior */
                    p-[1vh] rounded-[1vh]
                    /* PC: Área original */
                    lg:p-[0.5vh] lg:rounded-[0.5vh]
                  "
                  title="Excluir projeto"
                >
                  <Trash2 className="
                    /* MOBILE: Ícone grande */
                    w-[6vw] h-[6vw]
                    /* PC: Ícone original */
                    lg:w-[1.5vw] lg:h-[1.5vw]
                  " />
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}