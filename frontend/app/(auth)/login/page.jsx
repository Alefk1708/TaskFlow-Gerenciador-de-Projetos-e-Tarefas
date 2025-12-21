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
    <div className="w-screen min-h-screen flex flex-col justify-center items-center">
      <Image
        src="/logo.png"
        width={200}
        height={200}
        alt="logo"
        className="w-[19vw] m-[1vw]"
      />

      <div className="w-[27vw] h-[60vh] shadow-2xl border border-slate-300 rounded-[1vw]">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSubmit()
          }}
          className="w-full h-full flex flex-col justify-center items-center gap-[2vh]"
        >
          <h1 className="text-center text-[2vw] mb-[2vh]">Login</h1>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="E-mail"
            className="w-[85%] h-[6vh] text-[1.2vw] rounded-[0.5vw] border border-slate-300 px-[0.5vw]"
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Senha"
            className="w-[85%] h-[6vh] text-[1.2vw] rounded-[0.5vw] border border-slate-300 px-[0.5vw]"
          />

          <div className="w-full h-[5vh] text-[1vw] flex justify-center gap-[0.5vw]">
            <p>Esqueceu a senha?</p>
            <a href="/recuperar" className="text-blue-600">
              (Clique aqui!)
            </a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-[80%] h-[5vh] text-[1.2vw] bg-blue-600 text-white rounded-[0.5vw] disabled:opacity-50"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>

          <div className="text-blue-600 text-[1.2vw]">
            <a href="/register">Criar conta</a>
          </div>

          <div className="w-full h-[3vh] text-center">
            {errorMessage && (
              <p className="text-[1vw] text-red-600">{errorMessage}</p>
            )}
            {successMessage && (
              <p className="text-[1vw] text-green-600">{successMessage}</p>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
