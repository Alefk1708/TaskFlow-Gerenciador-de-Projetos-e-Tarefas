"use client"

import Image from "next/image"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"

export default function ResetarSenhaPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [new_password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  
  const [errorMessage, setErrorMessage] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [token, setToken] = useState("")

  // Captura o token da URL assim que a página carrega
  useEffect(() => {
    const tokenFromUrl = searchParams.get("token")
    if (tokenFromUrl) {
      setToken(tokenFromUrl)
    } else {
      setErrorMessage("Token inválido ou não encontrado.")
    }
  }, [searchParams])

  const handleSubmit = async () => {
    // 1. Validações básicas no Front-end
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

      // 2. Envia para a API (ajuste a rota conforme seu backend)
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // Envia a nova senha e o token para validação no back
        body: JSON.stringify({ new_password, token }),
      })

      const data = await response.json()

      if (!response.ok) {
        setErrorMessage(data?.message || "Falha ao redefinir senha")
        return
      }

      setSuccessMessage("Senha alterada com sucesso!")

      // 3. Redireciona para o login após sucesso
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
    <div className="w-screen min-h-screen flex flex-col justify-center items-center bg-gray-50 lg:bg-white">
      {/* LOGO: Mantido o estilo original */}
      <Image
        src="/logo.png"
        width={200}
        height={200}
        alt="logo"
        className="w-[50vw] m-[2vh] lg:w-[19vw] lg:m-[1vw]"
      />

      {/* CARD: Mantido o estilo original */}
      <div className="w-[90vw] h-[65vh] lg:w-[27vw] lg:h-[60vh] shadow-2xl border border-slate-300 rounded-[4vw] lg:rounded-[1vw] bg-white">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSubmit()
          }}
          className="w-full h-full flex flex-col justify-center items-center gap-[3vh] lg:gap-[2vh]"
        >
          {/* Título */}
          <h1 className="text-center text-[8vw] lg:text-[2vw] mb-[1vh] lg:mb-[2vh] font-bold text-gray-700">
            Nova Senha
          </h1>
          
          <p className="text-gray-500 text-[3.5vw] lg:text-[0.9vw] mb-2 text-center w-[80%]">
            Digite sua nova senha abaixo.
          </p>

          {/* Input Nova Senha */}
          <input
            type="password"
            value={new_password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Nova Senha"
            className="w-[90%] lg:w-[85%] h-[7vh] lg:h-[6vh] text-[4.5vw] lg:text-[1.2vw] rounded-[2vw] lg:rounded-[0.5vw] border border-slate-300 px-[3vw] lg:px-[0.5vw]"
          />

          {/* Input Confirmar Senha */}
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirme a Senha"
            className={`w-[90%] lg:w-[85%] h-[7vh] lg:h-[6vh] text-[4.5vw] lg:text-[1.2vw] rounded-[2vw] lg:rounded-[0.5vw] border px-[3vw] lg:px-[0.5vw] ${
              // Adiciona uma borda vermelha se as senhas forem diferentes e o usuário já tiver digitado algo
              confirmPassword && new_password !== confirmPassword 
                ? "border-red-500 focus:outline-red-500" 
                : "border-slate-300"
            }`}
          />

          {/* Botão Redefinir */}
          <button
            type="submit"
            disabled={loading}
            className="w-[90%] lg:w-[80%] h-[7vh] lg:h-[5vh] text-[5vw] lg:text-[1.2vw] bg-blue-600 text-white rounded-[2vw] lg:rounded-[0.5vw] disabled:opacity-50 font-medium hover:bg-blue-700 transition-colors mt-[2vh]"
          >
            {loading ? "Salvando..." : "Redefinir Senha"}
          </button>

          {/* Botão Voltar (Opcional, mas boa prática) */}
          <div className="text-gray-500 text-[3.5vw] lg:text-[1vw]">
            <a href="/login" className="hover:text-blue-600 transition-colors">
              Voltar ao Login
            </a>
          </div>

          {/* Mensagens de Erro/Sucesso */}
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
    </div>
  )
}