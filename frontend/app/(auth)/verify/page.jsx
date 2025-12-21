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
    <div className="w-screen min-h-screen flex flex-col justify-center items-center">
      <Image
        src="/logo.png"
        width={200}
        height={200}
        alt="Logo"
        className="w-[19vw] m-[1vw]"
      />

      <div className="w-[27vw] h-[45vh] shadow-2xl border border-slate-300 rounded-[1vw]">
        <form
          onSubmit={handleSubmit}
          className="w-full h-full flex flex-col justify-center items-center gap-[2vh]"
        >
          <h1 className="text-center text-[2vw]">
            Verifique seu email
          </h1>

          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Código de verificação"
            className="w-[85%] h-[6vh] rounded-[0.5vw] border-[0.2vw] border-slate-300 px-[0.5vw] text-[1.2vw]"
          />

          <p className="text-[1vw] text-slate-500 text-center">
            O código de verificação foi enviado para seu email.
          </p>

          <button
            type="submit"
            disabled={loading}
            className={`w-[80%] h-[5vh] text-[1.2vw] text-white rounded-[0.5vw]
              ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}
            `}
          >
            {loading ? "Verificando..." : "Confirmar"}
          </button>

          <button
            type="button"
            className="text-[1.1vw] text-blue-600 hover:underline"
            onClick={() => {
              alert("Implementar reenvio de código");
            }}
          >
            Reenviar código
          </button>

          <div className="h-[3vh] text-center">
            {errorMessage && (
              <p className="text-[1vw] text-red-600">
                {errorMessage}
              </p>
            )}

            {successMessage && (
              <p className="text-[1vw] text-green-600">
                {successMessage}
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
