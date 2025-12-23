import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST(request) {
  const cookiesStore = await cookies()

  try {
    const { code } = await request.json()
    const email = cookiesStore.get("email")?.value
    const BACKEND_URL = process.env.BACKEND_URL

    console.log(email)

    // Validações claras
    if (!email) {
      return NextResponse.json(
        { message: "Cookie de email não encontrado" },
        { status: 401 }
      )
    }

    if (!code) {
      return NextResponse.json(
        { message: "Código não enviado" },
        { status: 400 }
      )
    }

    // Chamada ao backend
    const res = await fetch(`${BACKEND_URL}/auth/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, code }),
    })

    // Garante leitura segura do retorno
    const data = await res.json()

    if (!res.ok) {
      return NextResponse.json(
        { message: data?.message || "Falha na verificação" },
        { status: res.status }
      )
    }

    const token = data.token

    if (!token) {
      return NextResponse.json(
        { message: "Token não retornado pelo backend" },
        { status: 500 }
      )
    }

    // Resposta final
    const response = NextResponse.json(
      { message: "Email verificado com sucesso" },
      { status: 200 }
    )

    // Limpa cookies temporários
    cookiesStore.delete("tokenVerify")
    cookiesStore.delete("email")

    // Salva token definitivo
    response.cookies.set("token", `Bearer ${token}`, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24, // 1 dia
    })

    return response

  } catch (error) {
    console.error("VERIFY ROUTE ERROR:", error)

    return NextResponse.json(
      { message: "Erro interno ao verificar email" },
      { status: 500 }
    )
  }
}
