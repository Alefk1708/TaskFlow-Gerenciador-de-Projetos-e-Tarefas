import { NextResponse } from "next/server"

export async function POST(request) {
    try {
        const BACKEND_URL = process.env.BACKEND_URL
        const body = await request.json()
        const { email, password } = body

        if (!email || !password) {
            return NextResponse.json(
                { message: "Email e senha são obrigatórios" },
                { status: 400 }
            )
        }

        const res = await fetch(`${BACKEND_URL}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        })

        const data = await res.json()

        if (!res.ok) {
            return NextResponse.json(data, { status: res.status })
        }

        const tokenVerify = data.data

        if (!tokenVerify) {
            return NextResponse.json(
                { message: "Token de verificação não encontrado" },
                { status: 404 }
            )
        }

        const response = NextResponse.json(
            { message: "Login realizado com sucesso" },
            { status: 200 }
        )

        response.cookies.set("tokenVerify", tokenVerify, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 5,
        })

        response.cookies.set("email", email, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 10,
        })

        return response
    } catch (error) {
        return NextResponse.json(
            { message: "Erro ao fazer login" },
            { status: 500 }
        )
    }
}
