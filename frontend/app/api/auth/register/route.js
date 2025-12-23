import { NextResponse } from "next/server"

export async function POST(request) {
    try {
        const BACKEND_URL = process.env.BACKEND_URL;
        const body = await request.json()
        const {name, email, password} = body;

        if (!name || !email || !password) {
            return NextResponse.json({"message": "Email e senha são obrigatoris"})
        }

        const res = await fetch(`${BACKEND_URL}/auth/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        })

        const data = await res.json()

        if (!res.ok) {
            return NextResponse.json(data, {status: 400})
        }

        return NextResponse.json(data)
    } catch (error) {
        console.log("Erro ao comunicar com o FastAPI", error)

        return NextResponse.json({"message": "Erro ao comunicar com o FastAPI"}, {status: 500})    
    }
}