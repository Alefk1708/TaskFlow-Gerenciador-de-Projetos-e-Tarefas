"use client";
import { useState } from "react";
import { useRouter } from "next/navigation"; 
import { ArrowLeft } from "lucide-react";  

export default function NovoProjetoPage() {
  const router = useRouter(); 
  
  const [title, setTitle] = useState("");
  const [descricao, setDescricao] = useState("");
  const [priority, setPriority] = useState("");
  const [erro, setErro] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const priorityOptions = [
    { value: "baixa", label: "Baixa", color: "bg-green-600" },
    { value: "media", label: "Média", color: "bg-yellow-500" },
    { value: "alta", label: "Alta", color: "bg-red-600" },
  ];

  async function handleSubmit() {
    setLoading(true);
    setErro("");
    setSuccess("");

    try {
      const response = await fetch("/api/task/create", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          descricao,
          priority,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErro("Erro ao criar projeto");
        console.log(data);
      } else {
        setSuccess("Projeto criado com sucesso!");
        setTitle("");
        setDescricao("");
        setPriority("");
      }
    } catch (error) {
      console.log(error);
      setErro("Erro ao comunicar com a api");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full h-full flex flex-col p-[2vw]">
      
      {/* 4. CABEÇALHO COM BOTÃO DE VOLTAR */}
      <div className="w-full h-[8vh] flex items-center gap-[1vw] mb-[1vh]">
        <button 
          onClick={() => router.back()} 
          className="text-slate-400 hover:text-slate-600 transition-colors"
          title="Voltar"
        >
          <ArrowLeft className="w-[2vw] h-[2vw]" />
        </button>

        <h1 className="text-[2vw] text-slate-600 font-semibold">
          Novo projeto
        </h1>
      </div>

      <form
        className="
          w-full h-full 
          flex flex-col gap-[1.5vh] 
          bg-white rounded-[1vh] p-[2vw] shadow-sm
        "
        onSubmit={(e) => {
          e.preventDefault();
          if (!title || !descricao || !priority) {
            setErro("Preencha todos os campos");
            setSuccess("");
            return;
          }
          handleSubmit();
        }}
      >
        {/* Input Título */}
        <div className="flex flex-col gap-[0.5vh]">
          <p className="text-[1.1vw] text-slate-600 font-medium">Título</p>
          <input
            type="text"
            placeholder="Digite o titulo do projeto..."
            className="
              w-full h-[6vh] 
              text-[1.1vw] 
              border-[0.2vh] border-slate-300 
              rounded-[0.8vh] 
              px-[1vw] 
              outline-none focus:border-blue-500 transition-colors
            "
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        {/* Textarea Descrição */}
        <div className="flex flex-col gap-[0.5vh] flex-1">
          <p className="text-[1.1vw] text-slate-600 font-medium">Descrição</p>
          <textarea
            placeholder="Digite a descrição do projeto..."
            className="
              w-full flex-1 
              text-[1.1vw] 
              border-[0.2vh] border-slate-300 
              rounded-[0.8vh] 
              p-[1vw] 
              outline-none resize-none focus:border-blue-500 transition-colors
            "
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            required
          />
        </div>

        {/* Seleção de Prioridade */}
        <div className="flex flex-col gap-[0.5vh]">
          <p className="text-[1.1vw] text-slate-600 font-medium">Prioridade</p>
          
          <div className="flex gap-[1vw] w-full h-[6vh]">
            {priorityOptions.map((option) => {
              const isSelected = priority === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setPriority(option.value)}
                  className={`
                    flex-1 
                    rounded-[0.8vh] 
                    text-[1.1vw] font-semibold 
                    transition-all 
                    flex items-center justify-center gap-[0.5vw]
                    border-[0.2vh]
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

        {/* Botão Salvar */}
        <div className="flex flex-col items-center gap-[1vh] mt-[1vh]">
          <div className="h-[3vh] text-[1vw] font-medium">
             {erro && <p className="text-red-600">{erro}</p>}
             {success && <p className="text-green-600">{success}</p>}
          </div>

          <button
            disabled={loading}
            className="
              w-full h-[7vh] 
              bg-blue-600 text-white 
              rounded-[0.8vh] 
              text-[1.3vw] font-medium 
              hover:bg-blue-700 transition-colors
              disabled:opacity-50 disabled:cursor-not-allowed
            "
          >
            {loading ? "Criando..." : "Criar Projeto"}
          </button>
        </div>

      </form>
    </div>
  );
}