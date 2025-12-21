"use client"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"

export default function RegisterPage() {
  const router = useRouter()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [passwordConfirm, setPasswordConfirm] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!name || !email || !password || !passwordConfirm) {
      setErrorMessage("Preencha todos os campos.")
      return
    }

    if (password !== passwordConfirm) {
      setErrorMessage("As senhas não conferem.")
      return
    }

    try {
      setLoading(true)
      setErrorMessage("")
      setSuccessMessage("")

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        setErrorMessage(data?.message || "Erro ao criar conta.")
        return
      }

      setSuccessMessage("Conta criada com sucesso!")

      setTimeout(() => {
        router.push("/login")
      }, 500)

    } catch (error) {
      console.error(error)
      setErrorMessage("Erro inesperado ao criar conta.")
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

      <form
        onSubmit={(e) => {
          e.preventDefault()
          handleSubmit()
        }}
        className="w-[27vw] h-[67vh] shadow-2xl border border-slate-300 rounded-[1vw] flex flex-col justify-center items-center gap-[2vh]"
      >
        <h1 className="text-center text-[2vw] mb-[2vh] mt-[4vh]">
          Criar conta
        </h1>

        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nome"
          className="w-[85%] h-[6vh] text-[1.2vw] rounded-[0.5vw] border border-slate-300 px-[0.5vw]"
        />

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

        <input
          type="password"
          value={passwordConfirm}
          onChange={(e) => setPasswordConfirm(e.target.value)}
          placeholder="Confirmar senha"
          className="w-[85%] h-[6vh] text-[1.2vw] rounded-[0.5vw] border border-slate-300 px-[0.5vw]"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-[80%] h-[5vh] text-[1.2vw] bg-blue-600 text-white rounded-[0.5vw] mt-[4vh] disabled:opacity-50"
        >
          {loading ? "Criando..." : "Criar conta"}
        </button>

        <div className="flex justify-center items-center gap-[0.5vw] h-[7vh] text-[1.2vw]">
          <p>Já tem uma conta?</p>
          <a href="/login" className="text-blue-600">
            Entrar
          </a>
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
  )
}
  ''