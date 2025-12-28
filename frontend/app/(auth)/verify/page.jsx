"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function VerifyPage() {
  const [code, setCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleResend = async () => {
    try {
      setLoading(true)

      const res = await fetch("/api/auth/resend-code", {
        method: "POST",
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.message);
        setSuccessMessage("");
        setLoading(false);
        return;
      } else {
        setSuccessMessage("Código de verificação reenviado com sucesso");
        setErrorMessage("");
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!code) {
      setErrorMessage("Informe o código de verificação");
      setSuccessMessage("");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/auth/verify", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccessMessage("Email verificado com sucesso");
        setErrorMessage("");
        router.push("/dashboard");
        return;
      }

      setErrorMessage(data.message || "Código de verificação inválido");
      setSuccessMessage("");
    } catch (error) {
      setErrorMessage("Erro ao enviar o código de verificação");
      setSuccessMessage("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-screen min-h-screen flex flex-col justify-center items-center bg-gray-50 lg:bg-white">
      
      {/* LOGO: Grande no mobile (50vw), normal no PC (19vw) */}
      <Image
        src="/logo.png"
        width={200}
        height={200}
        alt="Logo"
        className="w-[50vw] m-[2vh] lg:w-[19vw] lg:m-[1vw]"
      />

      {/* CARD: 90vw largura e 60vh altura no mobile / 27vw e 45vh no PC */}
      <div className="w-[90vw] h-[60vh] lg:w-[27vw] lg:h-[45vh] shadow-2xl border border-slate-300 rounded-[4vw] lg:rounded-[1vw] bg-white">
        <form
          onSubmit={handleSubmit}
          className="w-full h-full flex flex-col justify-center items-center gap-[3vh] lg:gap-[2vh]"
        >
          {/* TÍTULO */}
          <h1 className="text-center text-[7vw] lg:text-[2vw] font-bold text-gray-700">
            Verifique seu email
          </h1>

          {/* INPUT CÓDIGO */}
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Código de verificação"
            className="w-[90%] lg:w-[85%] h-[8vh] lg:h-[6vh] rounded-[2vw] lg:rounded-[0.5vw] border border-slate-300 px-[3vw] lg:px-[0.5vw] text-[5vw] lg:text-[1.2vw]"
          />

          {/* TEXTO DE AJUDA */}
          <p className="text-[3.5vw] lg:text-[1vw] text-slate-500 text-center w-[90%]">
            O código de verificação foi enviado para seu email.
          </p>

          {/* BOTÃO CONFIRMAR */}
          <button
            type="submit"
            disabled={loading}
            className={`w-[90%] lg:w-[80%] h-[7vh] lg:h-[5vh] text-[5vw] lg:text-[1.2vw] text-white rounded-[2vw] lg:rounded-[0.5vw] font-medium transition-colors
              ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}
            `}
          >
            {loading ? "Verificando..." : "Confirmar"}
          </button>

          {/* BOTÃO REENVIAR */}
          <button
            type="button"
            className="text-[4vw] lg:text-[1.1vw] text-blue-600 hover:underline font-medium"
            onClick={handleResend}
          >
            Reenviar código
          </button>

          {/* MENSAGENS ERRO/SUCESSO */}
          <div className="h-[3vh] text-center w-full px-[2vw]">
            {errorMessage && (
              <p className="text-[3.5vw] lg:text-[1vw] text-red-600 font-medium">
                {errorMessage}
              </p>
            )}

            {successMessage && (
              <p className="text-[3.5vw] lg:text-[1vw] text-green-600 font-medium">
                {successMessage}
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}