"use client";

import {
  Layers,
  ClipboardList,
  CheckSquare,
} from "lucide-react";

export default function DashboardPage() {
  const stats = [
    {
      label: "Projetos",
      value: 3,
      icon: Layers,
    },
    {
      label: "Tarefas pendentes",
      value: 7,
      icon: ClipboardList,
    },
    {
      label: "Concluídas",
      value: 12,
      icon: CheckSquare,
    },
  ];

  const tasks = [
    {
      title: "Desenvolver página inicial",
      date: "Hoje",
      priority: "Alta",
      color: "bg-red-500",
    },
    {
      title: "Criar API para autenticação",
      date: "Amanhã",
      priority: "Média",
      color: "bg-orange-400",
    },
    {
      title: "Design do logotipo TaskFlow",
      date: "Ontem",
      priority: "Baixa",
      color: "bg-green-500",
      done: true,
    },
    {
      title: "Reunião de alinhamento com equipe",
      date: "15 Dez",
      priority: "Média",
      color: "bg-orange-400",
    },
    {
      title: "Implementar dashboard de estatísticas",
      date: "18 Dez",
      priority: "Alta",
      color: "bg-red-500",
    },
  ];

  return (
    <section className="w-full h-full flex flex-col gap-[3vh]">

      {/* Cards */}
      <div className="flex gap-[2vw]">
        {stats.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.label}
              className="
                w-[22vw] h-[12vh]
                bg-slate-100
                rounded-[1vh]
                flex items-center gap-[1.5vw]
                px-[1.5vw]
                shadow-sm
              "
            >
              <Icon
                style={{ width: "3vh", height: "3vh" }}
                className="text-slate-500"
              />

              <div>
                <p className="text-[1.5vh] text-slate-500">
                  {item.label}
                </p>
                <strong className="text-[3vh]">
                  {item.value}
                </strong>
              </div>
            </div>
          );
        })}
      </div>

      {/* Novo projeto */}
      <button
        className="
          w-[14vw] h-[5vh]
          bg-blue-600
          text-white
          rounded-[0.8vh]
          text-[1.6vh]
          font-medium
          hover:bg-blue-700
          transition-colors
        "
      >
        Novo projeto
      </button>

      {/* Tarefas recentes */}
      <div className="flex flex-col gap-[1.2vh]">
        <h2 className="text-[2.2vh] font-semibold">
          Tarefas recentes
        </h2>

        {tasks.map((task, index) => (
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
                defaultChecked={task.done}
                className="w-[2vh] h-[2vh]"
              />

              <span
                className={`
                  text-[1.6vh]
                  ${task.done ? "line-through text-slate-400" : ""}
                `}
              >
                {task.title}
              </span>
            </div>

            <div className="flex items-center gap-[2vw]">
              <span className="text-[1.4vh] text-slate-500">
                {task.date}
              </span>

              <div className="flex items-center gap-[0.6vw]">
                <span
                  className={`w-[1vh] h-[1vh] rounded-full ${task.color}`}
                />
                <span className="text-[1.4vh]">
                  {task.priority}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
