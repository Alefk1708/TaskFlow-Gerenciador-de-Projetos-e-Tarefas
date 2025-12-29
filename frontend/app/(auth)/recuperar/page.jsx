"use client"

import Image from "next/image"
import { useState } from "react"
import Link from "next/link" // Melhor que <a> para navegação interna no Next.js

export default function RecuperarSenha() {
  const [email, setEmail] = useState("")
  // Estado para armazenar a mensagem e o tipo (sucesso ou erro) para definir a cor
  const [message, setMessage] = useState({ text: "", type: "" })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!email) {
      setMessage({ text: "Por favor, digite seu e-mail.", type: "error" })
      return
    }

    try {
      setLoading(true)
      setMessage({ text: "", type: "" })

      const res = await fetch("/api/auth/recover", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()

      if (!res.ok) {
        setMessage({ text: data.message, type: "error" })
        throw new Error(data.message)
      }

      await new Promise((resolve) => setTimeout(resolve, 1500))

      setMessage({ 
        text: "E-mail de recuperação enviado!", 
        type: "success" 
      })
      setEmail("") // Limpa o campo após sucesso

    } catch (err) {
      console.error(err)
      setMessage({ text: "Erro ao tentar enviar o e-mail.", type: "error" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-screen min-h-screen flex flex-col justify-center items-center bg-gray-50 lg:bg-white">
      {/* LOGO: Mesma responsividade do Login */}
      <Image
        src="/logo.png"
        width={200}
        height={200}
        alt="logo"
        className="w-[50vw] m-[2vh] lg:w-[19vw] lg:m-[1vw]"
      />

      {/* CARD: Altura levemente reduzida pois tem menos campos, mas largura igual */}
      <div className="w-[90vw] h-[50vh] lg:w-[27vw] lg:h-[45vh] shadow-2xl border border-slate-300 rounded-[4vw] lg:rounded-[1vw] bg-white">
        <form
          onSubmit={handleSubmit}
          className="w-full h-full flex flex-col justify-center items-center gap-[3vh] lg:gap-[2vh]"
        >
          {/* Título */}
          <h1 className="text-center text-[7vw] lg:text-[1.8vw] mb-[1vh] lg:mb-[1vh] font-bold text-gray-700">
            Recuperar Senha
          </h1>

          {/* Texto explicativo simples */}
          <p className="w-[85%] text-center text-gray-500 text-[3.5vw] lg:text-[1vw]">
            Digite seu e-mail para receber o link de redefinição.
          </p>

          {/* Input Email */}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Seu e-mail cadastrado"
            className="w-[90%] lg:w-[85%] h-[7vh] lg:h-[6vh] text-[4.5vw] lg:text-[1.2vw] rounded-[2vw] lg:rounded-[0.5vw] border border-slate-300 px-[3vw] lg:px-[0.5vw]"
          />

          {/* Botão Enviar */}
          <button
            type="submit"
            disabled={loading}
            className="w-[90%] lg:w-[80%] h-[7vh] lg:h-[5vh] text-[5vw] lg:text-[1.2vw] bg-blue-600 text-white rounded-[2vw] lg:rounded-[0.5vw] disabled:opacity-50 font-medium hover:bg-blue-700 transition-colors mt-[1vh]"
          >
            {loading ? "Enviando..." : "Enviar E-mail"}
          </button>

          {/* Link Voltar */}
          <div className="text-blue-600 text-[4vw] lg:text-[1vw] font-medium">
            <Link href="/login">Voltar para Login</Link>
          </div>

          {/* Mensagem de Feedback (Backend) */}
          <div className="w-full h-[3vh] text-center px-[2vw]">
            {message.text && (
              <p
                className={`text-[3.5vw] lg:text-[1vw] font-medium ${
                  message.type === "error" ? "text-red-600" : "text-green-600"
                }`}
              >
                {message.text}
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}