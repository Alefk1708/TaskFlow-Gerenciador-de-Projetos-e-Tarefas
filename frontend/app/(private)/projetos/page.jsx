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
    <div className="w-full h-full flex flex-col pt-[2vh]">
      {/* HEADER */}
      <header className="w-full h-[9vh] flex justify-between items-center px-[2vw]">
        <h1 className="text-[2vw] text-slate-600 font-semibold">Projetos</h1>
        <button
          className="w-[11vw] h-[6vh] bg-blue-600 text-white rounded-[0.8vh] text-[1.4vw] font-medium hover:bg-blue-700 transition-colors"
          onClick={() => router.push("/projetos/novo")}
        >
          Novo projeto
        </button>
      </header>

      {/* LISTA */}
      <main className="h-[91vh] px-[2vw] pt-[2vh]">
        <div className="flex flex-row flex-wrap gap-[1vw]">
          {list.map((item) => (
            <div
              key={item.id}

              onClick={() => router.push(`/projetos/${item.id}`)}
              className="
                w-[18vw] h-[25vh]
                flex flex-col justify-between
                border-[0.1vw] border-slate-300
                rounded-[1vw]
                p-[1.5vh]
                hover:shadow-md transition-shadow
                cursor-pointer bg-white
                group relative
              "
            >
              {/* TÍTULO */}
              <h2 className={`text-[1.4vw] font-semibold text-slate-700 truncate ${item.done? "line-through" : ""}`}>
                {item.title}
              </h2>

              {/* DESCRIÇÃO */}
              <p className={`text-[1vw] text-slate-500 ${item.done? "line-through" : ""}`}>
                {item.descricao?.length > 60
                  ? item.descricao.substring(0, 60) + "..."
                  : item.descricao}
              </p>

              {/* PRIORIDADE */}
              <span
                className={`
                  px-[0.8vw] py-[0.3vh] rounded-[0.6vh] text-[0.9vw] text-white w-fit
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
                onClick={(e) => e.stopPropagation()} // Impede clique no card
              >
                {/* Lado Esquerdo: Checkbox */}
                <label className="flex items-center gap-[0.5vw] text-[1vw] text-slate-600 cursor-pointer hover:text-slate-800">
                  <input
                    type="checkbox"
                    checked={item.done}
                    onChange={(e) => updateTask(e.target.checked, item.id)}
                    className="w-[1.2vw] h-[1.2vw] cursor-pointer accent-blue-600"
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
                    p-[0.5vh] 
                    text-slate-400 
                    hover:text-red-600 
                    hover:bg-red-50 
                    rounded-[0.5vh] 
                    transition-colors
                  "
                  title="Excluir projeto"
                >
                  <Trash2 className="w-[1.5vw] h-[1.5vw]" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
