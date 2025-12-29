"use client"

import Image from "next/image"
import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"

function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [new_password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  
  const [errorMessage, setErrorMessage] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [token, setToken] = useState("")

  useEffect(() => {
    const tokenFromUrl = searchParams.get("token")
    if (tokenFromUrl) {
      setToken(tokenFromUrl)
    } else {
      setErrorMessage("Token inválido ou não encontrado.")
    }
  }, [searchParams])

  const handleSubmit = async () => {
    if (!new_password || !confirmPassword) {
      setErrorMessage("Preencha ambos os campos de senha.")
      return
    }

    if (new_password !== confirmPassword) {
      setErrorMessage("As senhas não coincidem.")
      return
    }

    if (!token) {
      setErrorMessage("Token de verificação ausente.")
      return
    }

    try {
      setLoading(true)
      setErrorMessage("")
      setSuccessMessage("")

      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ new_password, token }),
      })

      const data = await response.json()

      if (!response.ok) {
        setErrorMessage(data?.message || "Falha ao redefinir senha")
        return
      }

      setSuccessMessage("Senha alterada com sucesso!")

      setTimeout(() => {
        router.push("/login")
      }, 2000)

    } catch (err) {
      console.error(err)
      setErrorMessage("Erro inesperado ao redefinir senha.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-[90vw] h-[65vh] lg:w-[27vw] lg:h-[60vh] shadow-2xl border border-slate-300 rounded-[4vw] lg:rounded-[1vw] bg-white">
      <form
        onSubmit={(e) => {
          e.preventDefault()
          handleSubmit()
        }}
        className="w-full h-full flex flex-col justify-center items-center gap-[3vh] lg:gap-[2vh]"
      >
        <h1 className="text-center text-[8vw] lg:text-[2vw] mb-[1vh] lg:mb-[2vh] font-bold text-gray-700">
          Nova Senha
        </h1>
        
        <p className="text-gray-500 text-[3.5vw] lg:text-[0.9vw] mb-2 text-center w-[80%]">
          Digite sua nova senha abaixo.
        </p>

        <input
          type="password"
          value={new_password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Nova Senha"
          className="w-[90%] lg:w-[85%] h-[7vh] lg:h-[6vh] text-[4.5vw] lg:text-[1.2vw] rounded-[2vw] lg:rounded-[0.5vw] border border-slate-300 px-[3vw] lg:px-[0.5vw]"
        />

        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirme a Senha"
          className={`w-[90%] lg:w-[85%] h-[7vh] lg:h-[6vh] text-[4.5vw] lg:text-[1.2vw] rounded-[2vw] lg:rounded-[0.5vw] border px-[3vw] lg:px-[0.5vw] ${
            confirmPassword && new_password !== confirmPassword 
              ? "border-red-500 focus:outline-red-500" 
              : "border-slate-300"
          }`}
        />

        <button
          type="submit"
          disabled={loading}
          className="w-[90%] lg:w-[80%] h-[7vh] lg:h-[5vh] text-[5vw] lg:text-[1.2vw] bg-blue-600 text-white rounded-[2vw] lg:rounded-[0.5vw] disabled:opacity-50 font-medium hover:bg-blue-700 transition-colors mt-[2vh]"
        >
          {loading ? "Salvando..." : "Redefinir Senha"}
        </button>

        <div className="text-gray-500 text-[3.5vw] lg:text-[1vw]">
          <a href="/login" className="hover:text-blue-600 transition-colors">
            Voltar ao Login
          </a>
        </div>

        <div className="w-full h-[3vh] text-center">
          {errorMessage && (
            <p className="text-[3.5vw] lg:text-[1vw] text-red-600 font-medium px-4 truncate">
              {errorMessage}
            </p>
          )}
          {successMessage && (
            <p className="text-[3.5vw] lg:text-[1vw] text-green-600 font-medium px-4 truncate">
              {successMessage}
            </p>
          )}
        </div>
      </form>
    </div>
  )
}

export default function ResetarSenhaPage() {
  return (
    <div className="w-screen min-h-screen flex flex-col justify-center items-center bg-gray-50 lg:bg-white">
      <Image
        src="/logo.png"
        width={200}
        height={200}
        alt="logo"
        className="w-[50vw] m-[2vh] lg:w-[19vw] lg:m-[1vw]"
      />

      {/* O Suspense é obrigatório para componentes que usam useSearchParams no Next.js App Router */}
      <Suspense fallback={<div className="text-gray-500">Carregando formulário...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  )
}