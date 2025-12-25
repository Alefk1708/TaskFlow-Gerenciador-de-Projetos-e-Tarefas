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

  if (loading) return <div className="p-[2vw] text-[1.2vw]">Carregando...</div>;

  return (
    <div className="w-full h-full flex flex-col p-[2vw]">
      
      {/* CABEÇALHO */}
      <div className="w-full h-[8vh] flex items-center gap-[1vw] mb-[1vh]">
        <button 
          onClick={() => router.back()}
          className="text-slate-400 hover:text-slate-600 transition-colors"
        >
          <ArrowLeft className="w-[1.8vw] h-[1.8vw]" />
        </button>
        <h1 className="text-[2vw] text-slate-600 font-semibold">
          Editar Projeto
        </h1>
      </div>

      {/* FORMULÁRIO */}
      <form
        onSubmit={handleUpdate}
        className="
          w-full h-full 
          flex flex-col gap-[1.5vh] 
          bg-white rounded-[1vh] p-[2vw] shadow-sm
        "
      >
        {/* Título */}
        <div className="flex flex-col gap-[0.5vh]">
          <label className="text-[1.1vw] text-slate-600 font-medium">Título do Projeto</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="
              w-full h-[6vh] 
              text-[1.1vw] 
              border-[0.2vh] border-slate-300 rounded-[0.8vh] 
              px-[1vw] outline-none focus:border-blue-500
            "
          />
        </div>

        {/* Descrição (Flex-1 para ocupar espaço) */}
        <div className="flex flex-col gap-[0.5vh] flex-1">
          <label className="text-[1.1vw] text-slate-600 font-medium">Descrição</label>
          <textarea
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            className="
              w-full flex-1 
              text-[1.1vw] 
              border-[0.2vh] border-slate-300 rounded-[0.8vh] 
              p-[1vw] outline-none resize-none focus:border-blue-500
            "
          />
        </div>

        {/* Prioridade (Botões de Seleção Única) */}
        <div className="flex flex-col gap-[0.5vh]">
          <label className="text-[1.1vw] text-slate-600 font-medium">Prioridade</label>
          <div className="flex gap-[1vw] h-[6vh]">
            {priorityOptions.map((option) => {
              const isSelected = priority === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setPriority(option.value)}
                  className={`
                    flex-1 rounded-[0.8vh] text-[1.1vw] font-semibold 
                    flex items-center justify-center gap-[0.5vw]
                    border-[0.2vh] transition-all
                    ${isSelected 
                      ? `${option.color} border-transparent text-white shadow-md` 
                      : "bg-white border-slate-300 text-slate-500 hover:bg-slate-50"
                    }
                  `}
                >
                  <div className={`w-[0.8vw] h-[0.8vw] rounded-full ${isSelected ? "bg-white" : option.color}`} />
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Feedback e Botão Salvar */}
        <div className="flex flex-col items-center gap-[1vh] mt-[1vh]">
          {msg.text && (
            <p className={`text-[1vw] ${msg.type === "error" ? "text-red-600" : "text-green-600"}`}>
              {msg.text}
            </p>
          )}

          <button
            type="submit"
            disabled={saving}
            className="
              w-full h-[7vh] 
              bg-blue-600 text-white rounded-[0.8vh] 
              text-[1.3vw] font-medium 
              hover:bg-blue-700 transition-colors
              disabled:opacity-50
            "
          >
            {saving ? "Salvando..." : "Salvar Alterações"}
          </button>
        </div>
      </form>
    </div>
  );
}