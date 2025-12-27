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
    <div className="
      w-full h-full flex flex-col 
      /* MOBILE: Padding maior e espaço no fundo para o menu */
      p-[5vw] pb-[12vh]
      /* PC: Valores originais */
      lg:p-[2vw] lg:pb-[2vw]
    ">
      
      {/* 4. CABEÇALHO COM BOTÃO DE VOLTAR */}
      <div className="
        w-full flex items-center 
        /* MOBILE: Altura e gap maiores */
        h-[8vh] mb-[2vh] gap-[3vw]
        /* PC: Valores originais */
        lg:h-[8vh] lg:mb-[1vh] lg:gap-[1vw]
      ">
        <button 
          onClick={() => router.back()} 
          className="text-slate-400 hover:text-slate-600 transition-colors"
          title="Voltar"
        >
          <ArrowLeft className="
            /* MOBILE: Ícone grande */
            w-[8vw] h-[8vw]
            /* PC: Ícone original */
            lg:w-[2vw] lg:h-[2vw]
          " />
        </button>

        <h1 className="
          text-slate-600 font-semibold
          /* MOBILE: Texto grande */
          text-[6vw]
          /* PC: Texto original */
          lg:text-[2vw]
        ">
          Novo projeto
        </h1>
      </div>

      <form
        className="
          w-full h-full flex flex-col bg-white shadow-sm
          /* MOBILE: Padding, gap e borda arredondada maiores */
          p-[5vw] gap-[2vh] rounded-[3vh]
          /* PC: Valores originais */
          lg:p-[2vw] lg:gap-[1.5vh] lg:rounded-[1vh]
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
          <p className="
            text-slate-600 font-medium
            /* MOBILE: Texto label legível */
            text-[4vw]
            /* PC: Texto original */
            lg:text-[1.1vw]
          ">Título</p>
          <input
            type="text"
            placeholder="Digite o titulo do projeto..."
            className="
              w-full outline-none focus:border-blue-500 transition-colors border-slate-300
              
              /* MOBILE: Input alto, texto grande, padding lateral maior */
              h-[7vh] text-[4vw] border-[0.3vh] rounded-[2vh] px-[3vw]
              
              /* PC: Valores originais */
              lg:h-[6vh] lg:text-[1.1vw] lg:border-[0.2vh] lg:rounded-[0.8vh] lg:px-[1vw]
            "
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        {/* Textarea Descrição */}
        <div className="flex flex-col gap-[0.5vh] flex-1">
          <p className="
            text-slate-600 font-medium
            /* MOBILE: Texto label legível */
            text-[4vw]
            /* PC: Texto original */
            lg:text-[1.1vw]
          ">Descrição</p>
          <textarea
            placeholder="Digite a descrição do projeto..."
            className="
              w-full flex-1 outline-none resize-none focus:border-blue-500 transition-colors border-slate-300
              
              /* MOBILE: Texto grande, padding maior */
              text-[4vw] border-[0.3vh] rounded-[2vh] p-[3vw]
              
              /* PC: Valores originais */
              lg:text-[1.1vw] lg:border-[0.2vh] lg:rounded-[0.8vh] lg:p-[1vw]
            "
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            required
          />
        </div>

        {/* Seleção de Prioridade */}
        <div className="flex flex-col gap-[0.5vh]">
          <p className="
            text-slate-600 font-medium
            /* MOBILE: Texto label legível */
            text-[4vw]
            /* PC: Texto original */
            lg:text-[1.1vw]
          ">Prioridade</p>
          
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
                    flex-1 transition-all flex items-center justify-center
                    
                    /* MOBILE: Texto grande, borda arredondada maior */
                    rounded-[2vh] text-[3.5vw] gap-[2vw] border-[0.3vh]
                    /* PC: Valores originais */
                    lg:rounded-[0.8vh] lg:text-[1.1vw] lg:gap-[0.5vw] lg:border-[0.2vh]
                    
                    font-semibold 
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

        {/* Botão Salvar */}
        <div className="
          flex flex-col items-center 
          /* MOBILE: Margin top maior */
          gap-[1vh] mt-[2vh]
          /* PC: Original */
          lg:mt-[1vh]
        ">
          <div className="
            h-[3vh] font-medium
            /* MOBILE: Texto erro/sucesso maior */
            text-[3.5vw]
            /* PC: Original */
            lg:text-[1vw]
          ">
             {erro && <p className="text-red-600">{erro}</p>}
             {success && <p className="text-green-600">{success}</p>}
          </div>

          <button
            disabled={loading}
            className="
              w-full bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed
              
              /* MOBILE: Botão alto, texto grande */
              h-[8vh] rounded-[2vh] text-[5vw]
              /* PC: Valores originais */
              lg:h-[7vh] lg:rounded-[0.8vh] lg:text-[1.3vw]
            "
          >
            {loading ? "Criando..." : "Criar Projeto"}
          </button>
        </div>

      </form>
    </div>
  );
}