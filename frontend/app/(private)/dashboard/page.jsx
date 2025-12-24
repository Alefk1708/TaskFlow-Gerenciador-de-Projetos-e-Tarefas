"use client";

import { Layers, ClipboardList, CheckSquare } from "lucide-react";
import { useEffect, useState } from "react";

export default function DashboardPage() {
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
    <section className="w-full h-full flex flex-col gap-[3vh] p-[4vw]">
      {/* Cards */}
      <div className="flex gap-[3vw]">
        {stats.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.label}
              className="
                w-[20vw] h-[12vh]
                bg-slate-100
                rounded-[1vh]
                flex items-center gap-[2vw]
                px-[1.5vw]
                shadow-sm
              "
            >
              <Icon
                style={{ width: "5vh", height: "5vh" }}
                className="text-slate-500"
              />

              <div>
                <p className="text-[1.2vw] text-slate-500">{item.label}</p>
                <strong className="text-[1.8vw]">{item.value}</strong>
              </div>
            </div>
          );
        })}
      </div>

      {/* Novo projeto */}
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
      >
        Novo projeto
      </button>

      {/* Tarefas recentes */}
      <div className="flex flex-col gap-[1.2vh]">
        <h2 className="text-[1.7vw]">Tarefas recentes</h2>

        {list?.map((task, index) => (
          <div
            key={index}
            className="
              w-full h-[6vh]
              bg-slate-100
              rounded-[1vh]
              flex items-center justify-between
              px-[1.5vw]
            "
          >
            <div className="flex items-center gap-[1vw]">
              <input
                type="checkbox"
                checked={task.done}
                onChange={() => updateTaks(!task.done, task.id)}
                className="size-[1.2vw]"
              />

              <span
                className={`
                  text-[1vw]
                  ${task.done ? "line-through text-slate-400" : ""}
                `}
              >
                {task.title}
              </span>
            </div>

            <div className="flex items-center gap-[3vw]">
              <span className="text-[1.1vw] text-slate-500">
                {task.date.slice(0, 10)}
              </span>

              <div className="flex items-center gap-[0.6vw]">
                <span
                  className={`w-[1vh] h-[1vh] rounded-full ${
                    task.priority === "baixa"
                      ? "bg-green-600"
                      : task.priority === "media"
                      ? "bg-yellow-600"
                      : "bg-red-600"
                  }`}
                />
                <span className="text-[1.2vw]">
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
