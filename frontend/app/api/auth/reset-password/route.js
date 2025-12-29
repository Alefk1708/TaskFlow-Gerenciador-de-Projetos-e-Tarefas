import { NextResponse } from "next/server"

export async function POST(request) {
    try {
        const body = await request.json()
        const {new_password, token} = body;
        const BACKEND_URL = process.env.BACKEND_URL

        if(!new_password && !token){
            return NextResponse.json({"messge": "Dados incompletos"}, {status: 400})
        }
        
        if(!BACKEND_URL) {
            return NextResponse.json({"message": "URL do backend não definida"}, {status: 500})
        }

        const res = await fetch(`${BACKEND_URL}/auth/reset-password`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({new_password, token})
        })
        
        const data = await res.json()

        if (!res.ok) return NextResponse.json(data, {status: res.status})
            
        return NextResponse.json(data)
    } catch (error) {
        console.log(error)
        return NextResponse.json({"message": "Erro ao comunicar com a api"})
    }
}