"use client";
import { useState } from "react";

export default function NovoProjetoPage() {
  const [title, setTitle] = useState("");
  const [descricao, setDescricao] = useState("");
  const [priority, setPriority] = useState("");
  const [erro, setErro] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit() {
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
        setSuccess("");
        console.log(data);
      } else {
        setSuccess("Projeto criado com sucesso!");
        setErro("");
        setTitle("");
        setDescricao("");
        setPriority("");
      }

      return data;
    } catch (error) {
      console.log(error);
      setErro("Erro ao comunicar com a api");
      setSuccess("");
    }
  }

  return (
    <div className="w-full h-full">
      <div className=" w-full h-[9vh]  flex flex-row justify-between items-center px-[2vw] ">
        <h1 className="text-[2vw] text-slate-600 font-semibold ">
          Novo projeto
        </h1>
      </div>
      <form
        action="/POST"
        className="w-[77%] h-[90%] px-[2vw] flex flex-col gap-[1.5vh]"
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
        <p className="text-[1.4vw] ">Titulo</p>
        <input
          type="text"
          name="titulo"
          placeholder="Digite o titulo do projeto..."
          className="w-full h-[5vh] text-[1.2vw] border-[0.2vh] border-slate-400 rounded-[0.8vh] px-[0.5vw] outline-none "
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <p>Descrição</p>
        <textarea
          type="text"
          name="titulo"
          placeholder="Digite a descrição do projeto..."
          className="w-full h-[18vh] text-[1.2vw] border-[0.2vh] border-slate-400 rounded-[0.8vh] px-[0.5vw] outline-none resize-none "
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          required
        />
        <p>Prioridade</p>
        <select
          name="priority"
          className="w-full h-[5vh] text-[1.2vw] border-[0.2vh] border-slate-400 rounded-[0.8vh] px-[0.5vw] outline-none"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          required
        >
          <option disabled selected></option>
          <option value={"baixa"}>Baixa</option>
          <option value="media">Média</option>
          <option value="alta">Alta</option>
        </select>

        <button
          className="
          w-[10vw] h-[6vh] bg-blue-600 text-white rounded-[0.8vh] text-[1.2vw] font-medium hover:bg-blue-700 transition-colors ml-auto mr-auto
        "
        >
          Criar Projeto
        </button>
        <div className="text-[1.1vw] w-full h-[5vh] text-center ">
          <p className="text-red-600">{erro}</p>
          <p className="text-green-600">{success}</p>
        </div>
      </form>
    </div>
  );
}
