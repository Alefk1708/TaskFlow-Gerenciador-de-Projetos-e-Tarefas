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
    <div className="w-screen min-h-screen flex flex-col justify-center items-center bg-gray-50 lg:bg-white">
      
      {/* LOGO: 50vw no celular / 19vw no PC */}
      <Image
        src="/logo.png"
        width={200}
        height={200}
        alt="logo"
        className="w-[50vw] m-[2vh] lg:w-[19vw] lg:m-[1vw]"
      />

      <form
        onSubmit={(e) => {
          e.preventDefault()
          handleSubmit()
        }}
        // CARD: 90vw largura e 80vh altura no celular / 27vw e 67vh no PC
        className="w-[90vw] h-[80vh] lg:w-[27vw] lg:h-[67vh] shadow-2xl border border-slate-300 rounded-[4vw] lg:rounded-[1vw] flex flex-col justify-center items-center gap-[2.5vh] lg:gap-[2vh] bg-white"
      >
        {/* TÍTULO: Grande no celular */}
        <h1 className="text-center text-[8vw] lg:text-[2vw] mb-[1vh] lg:mb-[2vh] mt-[2vh] lg:mt-[4vh] font-bold text-gray-700">
          Criar conta
        </h1>

        {/* INPUT NOME */}
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nome"
          className="w-[90%] lg:w-[85%] h-[7vh] lg:h-[6vh] text-[4.5vw] lg:text-[1.2vw] rounded-[2vw] lg:rounded-[0.5vw] border border-slate-300 px-[3vw] lg:px-[0.5vw]"
        />

        {/* INPUT EMAIL */}
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="E-mail"
          className="w-[90%] lg:w-[85%] h-[7vh] lg:h-[6vh] text-[4.5vw] lg:text-[1.2vw] rounded-[2vw] lg:rounded-[0.5vw] border border-slate-300 px-[3vw] lg:px-[0.5vw]"
        />

        {/* INPUT SENHA */}
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Senha"
          className="w-[90%] lg:w-[85%] h-[7vh] lg:h-[6vh] text-[4.5vw] lg:text-[1.2vw] rounded-[2vw] lg:rounded-[0.5vw] border border-slate-300 px-[3vw] lg:px-[0.5vw]"
        />

        {/* INPUT CONFIRMAR SENHA */}
        <input
          type="password"
          value={passwordConfirm}
          onChange={(e) => setPasswordConfirm(e.target.value)}
          placeholder="Confirmar senha"
          className="w-[90%] lg:w-[85%] h-[7vh] lg:h-[6vh] text-[4.5vw] lg:text-[1.2vw] rounded-[2vw] lg:rounded-[0.5vw] border border-slate-300 px-[3vw] lg:px-[0.5vw]"
        />

        {/* BOTÃO */}
        <button
          type="submit"
          disabled={loading}
          className="w-[90%] lg:w-[80%] h-[7vh] lg:h-[5vh] text-[5vw] lg:text-[1.2vw] bg-blue-600 text-white rounded-[2vw] lg:rounded-[0.5vw] mt-[2vh] lg:mt-[4vh] disabled:opacity-50 font-medium hover:bg-blue-700 transition-colors"
        >
          {loading ? "Criando..." : "Criar conta"}
        </button>

        {/* LINK LOGIN */}
        <div className="flex justify-center items-center gap-[1.5vw] lg:gap-[0.5vw] h-[5vh] lg:h-[7vh] text-[4vw] lg:text-[1.2vw]">
          <p>Já tem uma conta?</p>
          <a href="/login" className="text-blue-600 font-semibold">
            Entrar
          </a>
        </div>

        {/* MENSAGENS ERRO/SUCESSO */}
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
  )
}