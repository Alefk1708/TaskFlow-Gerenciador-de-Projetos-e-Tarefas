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

  // --- FUNÇÃO DE VALIDAÇÃO DE SENHA ---
  const validatePasswordRules = (pwd) => {
    if (pwd.length < 8) {
      return "A senha deve ter no mínimo 8 caracteres."
    }
    if (!/[A-Z]/.test(pwd)) {
      return "A senha deve conter pelo menos uma letra maiúscula."
    }
    if (!/[a-z]/.test(pwd)) {
      return "A senha deve conter pelo menos uma letra minúscula."
    }
    // Verifica caracteres especiais
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd)) {
      return "A senha deve conter pelo menos um caractere especial."
    }
    return null
  }

  const handleSubmit = async () => {
    setErrorMessage("")
    setSuccessMessage("")

    // 1. Verifica campos vazios
    if (!name || !email || !password || !passwordConfirm) {
      setErrorMessage("Preencha todos os campos.")
      return
    }

    // 2. Verifica se senhas conferem
    if (password !== passwordConfirm) {
      setErrorMessage("As senhas não conferem.")
      return
    }

    // 3. Valida força da senha (Nova lógica)
    const passwordError = validatePasswordRules(password)
    if (passwordError) {
      setErrorMessage(passwordError)
      return
    }

    try {
      setLoading(true)

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
      
      {/* LOGO */}
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
        // CARD
        className="w-[90vw] h-[80vh] lg:w-[27vw] lg:h-[67vh] shadow-2xl border border-slate-300 rounded-[4vw] lg:rounded-[1vw] flex flex-col justify-center items-center gap-[2.5vh] lg:gap-[2vh] bg-white"
      >
        {/* TÍTULO */}
        <h1 className="text-center text-[8vw] lg:text-[2vw] mt-[2vh] lg:mt-[4vh] font-bold text-gray-700">
          Criar conta
        </h1>
        
        {/* INSTRUÇÃO DE SENHA (Adicionado para UX) */}
        <p className="w-[85%] text-center text-gray-400 text-[3vw] lg:text-[0.8vw] -mt-2 mb-2 leading-tight">
          Senha forte: 8 dígitos, maiúscula, minúscula e especial.
        </p>

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
          className={`w-[90%] lg:w-[85%] h-[7vh] lg:h-[6vh] text-[4.5vw] lg:text-[1.2vw] rounded-[2vw] lg:rounded-[0.5vw] border px-[3vw] lg:px-[0.5vw] ${
            passwordConfirm && password !== passwordConfirm 
              ? "border-red-500 focus:outline-red-500" 
              : "border-slate-300"
          }`}
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
        <div className="w-full h-[3vh] text-center px-4">
          {errorMessage && (
            <p className="text-[3vw] lg:text-[0.9vw] text-red-600 font-medium truncate">{errorMessage}</p>
          )}
          {successMessage && (
            <p className="text-[3vw] lg:text-[0.9vw] text-green-600 font-medium truncate">{successMessage}</p>
          )}
        </div>
      </form>
    </div>
  )
}