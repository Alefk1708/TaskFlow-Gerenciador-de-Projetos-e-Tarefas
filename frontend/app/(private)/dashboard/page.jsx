"use client";

import { Layers, ClipboardList, CheckSquare } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const router = useRouter();
  const [list, setList] = useState([]);

  async function updateTaks(done, id) {
    setList((prevList) =>
      prevList.map((task) =>
        task.id === id ? { ...task, done: done } : task
      )
    );

    try {
      const response = await fetch("/api/task/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          done: done,
          id: id,
        }),
      });
      
      const data = await response.json();
      console.log("Sucesso:", data);
      
    } catch (error) {
      console.log("Erro ao atualizar:", error);
    }
  }

  useEffect(() => {
    async function fetchTasks() {
      try {
        const response = await fetch("/api/task/list");
        const data = await response.json();
        setList(data);
        console.log(data);
      } catch (error) {
        console.log(error);
      }
    }

    fetchTasks();
  }, []);

  const stats = [
    {
      label: "Projetos",
      value: list?.length,
      icon: Layers,
    },
    {
      label: "Tarefas pendentes",
      value: list.filter((item) => !item.done).length,
      icon: ClipboardList,
    },
    {
      label: "Concluídas",
      value: list.filter((item) => item.done).length,
      icon: CheckSquare,
    },
  ];

  return (
    <section className="
      w-full h-full flex flex-col 
      
      /* --- MOBILE --- */
      gap-[5vh] 
      p-[5vw]
      /* ADICIONADO: Padding Bottom extra de 12vh para o conteúdo não ficar atrás do Menu Fixo (que tem 10vh) */
      mb-[12vh]

      /* --- PC (lg) --- */
      /* Restaura os paddings originais e remove o padding bottom extra */
      lg:gap-[3vh] 
      lg:p-[4vw]
      lg:pb-[4vw]
    ">
      
      {/* Cards Container */}
      <div className="
        flex 
        flex-col gap-[2vh]
        lg:flex-row lg:gap-[3vw]
      ">
        {stats.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.label}
              className="
                bg-slate-100 shadow-sm flex items-center
                w-full h-[14vh] rounded-[2vh] px-[5vw] gap-[4vw]
                lg:w-[25vw] lg:h-[12vh] lg:rounded-[1vh] lg:px-[1.5vw] lg:gap-[2vw]
              "
            >
              <Icon
                className="
                  text-slate-500
                  w-[8vh] h-[8vh]
                  lg:w-[5vh] lg:h-[5vh]
                "
              />

              <div>
                <p className="
                  text-slate-500
                  text-[4vw]
                  lg:text-[1.2vw]
                ">
                  {item.label}
                </p>
                <strong className="
                  text-[8vw]
                  lg:text-[1.8vw]
                ">
                  {item.value}
                </strong>
              </div>
            </div>
          );
        })}
      </div>

      {/* Novo projeto Button */}
      <button
        className="
          bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors
          w-full h-[8vh] rounded-[2vh] text-[5vw] mt-[1vh]
          lg:w-[11vw] lg:h-[6vh] lg:rounded-[0.8vh] lg:text-[1.4vw] lg:mt-0
        "
        onClick={() => router.push("/projetos/novo")}
      >
        Novo projeto
      </button>

      {/* Tarefas recentes */}
      <div className="flex flex-col gap-[1.2vh]">
        <h2 className="
          text-[6vw] mb-[1vh]
          lg:text-[1.7vw] lg:mb-0
        ">
          Tarefas recentes
        </h2>

        {list?.map((task, index) => (
          <div
            key={index}
            className="
              bg-slate-100 shadow-sm
              w-full h-auto py-[2vh] px-[4vw] rounded-[2vh] flex flex-col gap-[2vh]
              lg:h-[6vh] lg:py-0 lg:px-[1.5vw] lg:rounded-[1vh] lg:flex-row lg:items-center lg:justify-between lg:gap-0
            "
          >
            
            {/* Bloco Esquerdo: Checkbox e Título */}
            <div className="flex items-center gap-[3vw] lg:gap-[1vw]">
              <input
                type="checkbox"
                checked={task.done}
                onChange={() => updateTaks(!task.done, task.id)}
                className="
                  size-[6vw]
                  lg:size-[1.2vw]
                "
              />

              <span
                className={`
                  font-medium
                  text-[4.5vw]
                  lg:text-[1vw]
                  ${task.done ? "line-through text-slate-400" : ""}
                `}
              >
                {task.title}
              </span>
            </div>

            {/* Bloco Meio: Descrição */}
            <div className="flex items-center lg:gap-[3vw]">
              <span className={`
                  text-slate-700
                  text-[3.5vw]
                  lg:text-[1.1vw]
                  ${task.done ? "line-through" : ""}
                `}>
                  {task.descricao.substring(0, 50) + "..."}
              </span>
            </div>

            {/* Bloco Direito: Data e Prioridade */}
            <div className="
              flex items-center 
              justify-between w-full
              lg:justify-start lg:w-auto lg:gap-[3vw]
            ">
              <span className={`
                text-slate-500
                text-[3.5vw]
                lg:text-[1.1vw]
                ${task.done ? "line-through" : ""}
              `}>
                {task.date.slice(0, 10)}
              </span>

              <div className="flex items-center gap-[2vw] lg:gap-[0.6vw]">
                <span
                  className={`
                    rounded-full
                    w-[3vw] h-[3vw]
                    lg:w-[1vh] lg:h-[1vh]
                    ${
                      task.priority === "baixa"
                        ? "bg-green-600"
                        : task.priority === "media"
                        ? "bg-yellow-600"
                        : "bg-red-600"
                    }`}
                />
                <span className="
                  text-[3.5vw]
                  lg:text-[1.2vw]
                ">
                  {task.priority.charAt(0).toUpperCase() +
                    task.priority.slice(1)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}