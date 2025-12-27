"use client"

import Image from "next/image"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!email || !password) {
      setErrorMessage("Preencha email e senha.")
      return
    }

    try {
      setLoading(true)
      setErrorMessage("")
      setSuccessMessage("")

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        setErrorMessage(data?.message || "Falha ao fazer login")
        return
      }

      setSuccessMessage("Código de verificação enviado para seu e-mail.")

      // pequeno delay garante que cookies sejam persistidos
      setTimeout(() => {
        router.push("/verify")
      }, 300)

    } catch (err) {
      console.error(err)
      setErrorMessage("Erro inesperado ao fazer login.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-screen min-h-screen flex flex-col justify-center items-center bg-gray-50 lg:bg-white">
      {/* LOGO: No celular ocupa 50% da largura, no PC volta para 19% */}
      <Image
        src="/logo.png"
        width={200}
        height={200}
        alt="logo"
        className="w-[50vw] m-[2vh] lg:w-[19vw] lg:m-[1vw]"
      />

      {/* CARD: No celular ocupa 90% da tela e 65% da altura. No PC volta para 27vw/60vh */}
      <div className="w-[90vw] h-[65vh] lg:w-[27vw] lg:h-[60vh] shadow-2xl border border-slate-300 rounded-[4vw] lg:rounded-[1vw] bg-white">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSubmit()
          }}
          className="w-full h-full flex flex-col justify-center items-center gap-[3vh] lg:gap-[2vh]"
        >
          {/* Título: Texto grande no celular (8vw), pequeno no PC (2vw) */}
          <h1 className="text-center text-[8vw] lg:text-[2vw] mb-[1vh] lg:mb-[2vh] font-bold text-gray-700">
            Login
          </h1>

          {/* Input Email: Mais alto e fonte maior no celular para o dedo acertar */}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="E-mail"
            className="w-[90%] lg:w-[85%] h-[7vh] lg:h-[6vh] text-[4.5vw] lg:text-[1.2vw] rounded-[2vw] lg:rounded-[0.5vw] border border-slate-300 px-[3vw] lg:px-[0.5vw]"
          />

          {/* Input Senha */}
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Senha"
            className="w-[90%] lg:w-[85%] h-[7vh] lg:h-[6vh] text-[4.5vw] lg:text-[1.2vw] rounded-[2vw] lg:rounded-[0.5vw] border border-slate-300 px-[3vw] lg:px-[0.5vw]"
          />

          {/* Link Esqueci a senha */}
          <div className="w-full h-[5vh] text-[3.5vw] lg:text-[1vw] flex justify-center gap-[1.5vw] lg:gap-[0.5vw]">
            <p>Esqueceu a senha?</p>
            <a href="/recuperar" className="text-blue-600 font-semibold">
              (Clique aqui!)
            </a>
          </div>

          {/* Botão Entrar: Maior área de toque no celular */}
          <button
            type="submit"
            disabled={loading}
            className="w-[90%] lg:w-[80%] h-[7vh] lg:h-[5vh] text-[5vw] lg:text-[1.2vw] bg-blue-600 text-white rounded-[2vw] lg:rounded-[0.5vw] disabled:opacity-50 font-medium hover:bg-blue-700 transition-colors"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>

          {/* Criar conta */}
          <div className="text-blue-600 text-[4vw] lg:text-[1.2vw] font-medium">
            <a href="/register">Criar conta</a>
          </div>

          {/* Mensagens de Erro/Sucesso */}
          <div className="w-full h-[3vh] text-center">
            {errorMessage && (
              <p className="text-[3.5vw] lg:text-[1vw] text-red-600 font-medium">{errorMessage}</p>
            )}
            {successMessage && (
              <p className="text-[3.5vw] lg:text-[1vw] text-green-600 font-medium">{successMessage}</p>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}