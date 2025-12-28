import { NextResponse } from "next/server"
import { cookies } from "next/headers"


export async function POST(request) {
    try {
        const cookieStore = await cookies()
        const tokenVerify = cookieStore.get("tokenVerify")?.value
        const email = cookieStore.get("email")?.value
        const BACKEND_URL = process.env.BACKEND_URL

        if (!tokenVerify) {
            return NextResponse.json({"message": "Token de verificação não encontrado"}, {status: 404})
        }

        if (!BACKEND_URL) {
            return NextResponse.json({"message": "URL do backend não encontrada"}, {status: 404})
        }

        if (!email) {
            return NextResponse.json({"message": "Email não encontrado"}, {status: 404})
        }

        const res = await fetch(`${BACKEND_URL}/auth/resend-code`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": tokenVerify
            },
            body: JSON.stringify({email})
        })

        const data = await res.json()

        if (!res.ok) {
            return NextResponse.json(data, {status: res.status})
        }

        return NextResponse.json({"message": "Código reenviado com sucesso"}, {status: 200})

    } catch (error) {
        console.log(error)
        return NextResponse.json({"message": `Erro ao reenviar o código: ${error}`}, {status: 500})
    }
}