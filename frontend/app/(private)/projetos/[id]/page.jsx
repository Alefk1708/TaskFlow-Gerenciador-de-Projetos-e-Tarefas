"use client";
import * as React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function PutTaskPage({ params }) {
  const { id } = React.use(params);
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [descricao, setDescricao] = useState("");
  const [priority, setPriority] = useState("");
  
  const [loading, setLoading] = useState(true); 
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState({ text: "", type: "" });

  const priorityOptions = [
    { value: "baixa", label: "Baixa", color: "bg-green-600" },
    { value: "media", label: "Média", color: "bg-yellow-500" },
    { value: "alta", label: "Alta", color: "bg-red-600" },
  ];

 
  useEffect(() => {
    async function fetchProject() {
      try {
        const response = await fetch(`/api/task/list`); 
        const data = await response.json();
        
        const currentTask = data.find((item) => item.id === id);

        if (currentTask) {
          setTitle(currentTask.title);
          setDescricao(currentTask.descricao); 
          setPriority(currentTask.priority);
        } else {
          setMsg({ text: "Projeto não encontrado", type: "error" });
        }
      } catch (error) {
        console.error(error);
        setMsg({ text: "Erro ao carregar dados", type: "error" });
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchProject();
  }, [id]);


  async function handleUpdate(e) {
    e.preventDefault();
    setSaving(true);
    setMsg({ text: "", type: "" });

    try {
      const response = await fetch("/api/task/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id, 
          title,
          descricao,
          priority,
        }),
      });

      if (response.ok) {
        setMsg({ text: "Atualizado com sucesso!", type: "success" });
        
        setTimeout(() => router.push("/projetos"), 1000);
      } else {
        setMsg({ text: "Erro ao atualizar.", type: "error" });
      }
    } catch (error) {
      setMsg({ text: "Erro de conexão.", type: "error" });
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="p-[5vw] text-[4vw] lg:p-[2vw] lg:text-[1.2vw]">Carregando...</div>;

  return (
    <div className="
      w-full h-full flex flex-col 
      /* MOBILE: Padding e espaço no rodapé */
      p-[5vw] pb-[12vh]
      /* PC: Valores originais */
      lg:p-[2vw] lg:pb-[2vw]
    ">
      
      {/* CABEÇALHO */}
      <div className="
        w-full flex items-center 
        /* MOBILE: Altura e gap maiores */
        h-[8vh] gap-[3vw] mb-[2vh]
        /* PC: Valores originais */
        lg:h-[8vh] lg:gap-[1vw] lg:mb-[1vh]
      ">
        <button 
          onClick={() => router.back()}
          className="text-slate-400 hover:text-slate-600 transition-colors"
        >
          <ArrowLeft className="
            /* MOBILE: Ícone grande */
            w-[8vw] h-[8vw]
            /* PC: Ícone original */
            lg:w-[1.8vw] lg:h-[1.8vw]
          " />
        </button>
        <h1 className="
          text-slate-600 font-semibold
          /* MOBILE: Texto grande */
          text-[6vw]
          /* PC: Texto original */
          lg:text-[2vw]
        ">
          Editar Projeto
        </h1>
      </div>

      {/* FORMULÁRIO */}
      <form
        onSubmit={handleUpdate}
        className="
          w-full h-full flex flex-col bg-white shadow-sm
          /* MOBILE: Padding, gap e borda arredondada maiores */
          gap-[2vh] rounded-[3vh] p-[5vw]
          /* PC: Valores originais */
          lg:gap-[1.5vh] lg:rounded-[1vh] lg:p-[2vw]
        "
      >
        {/* Título */}
        <div className="flex flex-col gap-[0.5vh]">
          <label className="
            text-slate-600 font-medium
            /* MOBILE: Texto label legível */
            text-[4vw]
            /* PC: Texto original */
            lg:text-[1.1vw]
          ">Título do Projeto</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="
              w-full outline-none focus:border-blue-500 border-slate-300
              /* MOBILE: Input alto, texto grande */
              h-[7vh] text-[4vw] border-[0.3vh] rounded-[2vh] px-[3vw]
              /* PC: Valores originais */
              lg:h-[6vh] lg:text-[1.1vw] lg:border-[0.2vh] lg:rounded-[0.8vh] lg:px-[1vw]
            "
          />
        </div>

        {/* Descrição */}
        <div className="flex flex-col gap-[0.5vh] flex-1">
          <label className="
            text-slate-600 font-medium
            /* MOBILE: Texto label legível */
            text-[4vw]
            /* PC: Texto original */
            lg:text-[1.1vw]
          ">Descrição</label>
          <textarea
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            className="
              w-full flex-1 outline-none resize-none focus:border-blue-500 border-slate-300
              /* MOBILE: Texto grande, padding maior */
              text-[4vw] border-[0.3vh] rounded-[2vh] p-[3vw]
              /* PC: Valores originais */
              lg:text-[1.1vw] lg:border-[0.2vh] lg:rounded-[0.8vh] lg:p-[1vw]
            "
          />
        </div>

        {/* Prioridade */}
        <div className="flex flex-col gap-[0.5vh]">
          <label className="
            text-slate-600 font-medium
            /* MOBILE: Texto label legível */
            text-[4vw]
            /* PC: Texto original */
            lg:text-[1.1vw]
          ">Prioridade</label>
          <div className="
            flex w-full
            /* MOBILE: Gap e altura maiores */
            gap-[2vw] h-[7vh]
            /* PC: Valores originais */
            lg:gap-[1vw] lg:h-[6vh]
          ">
            {priorityOptions.map((option) => {
              const isSelected = priority === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setPriority(option.value)}
                  className={`
                    flex-1 font-semibold flex items-center justify-center transition-all
                    
                    /* MOBILE: Arredondamento e texto maiores */
                    rounded-[2vh] text-[3.5vw] gap-[2vw] border-[0.3vh]
                    /* PC: Valores originais */
                    lg:rounded-[0.8vh] lg:text-[1.1vw] lg:gap-[0.5vw] lg:border-[0.2vh]

                    ${isSelected 
                      ? `${option.color} border-transparent text-white shadow-md` 
                      : "bg-white border-slate-300 text-slate-500 hover:bg-slate-50"
                    }
                  `}
                >
                  <div className={`
                    rounded-full 
                    /* MOBILE: Bolinha maior */
                    w-[3vw] h-[3vw]
                    /* PC: Bolinha original */
                    lg:w-[0.8vw] lg:h-[0.8vw]
                    ${isSelected ? "bg-white" : option.color}
                  `} />
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Feedback e Botão Salvar */}
        <div className="
          flex flex-col items-center 
          /* MOBILE: Margin top maior */
          gap-[1vh] mt-[2vh]
          /* PC: Original */
          lg:mt-[1vh]
        ">
          {msg.text && (
            <p className={`
              /* MOBILE: Texto msg maior */
              text-[3.5vw]
              /* PC: Texto original */
              lg:text-[1vw]
              ${msg.type === "error" ? "text-red-600" : "text-green-600"}
            `}>
              {msg.text}
            </p>
          )}

          <button
            type="submit"
            disabled={saving}
            className="
              w-full bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors disabled:opacity-50
              /* MOBILE: Botão alto, texto grande */
              h-[8vh] rounded-[2vh] text-[5vw]
              /* PC: Valores originais */
              lg:h-[7vh] lg:rounded-[0.8vh] lg:text-[1.3vw]
            "
          >
            {saving ? "Salvando..." : "Salvar Alterações"}
          </button>
        </div>
      </form>
    </div>
  );
}