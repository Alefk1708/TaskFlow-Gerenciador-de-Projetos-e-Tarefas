import { NextResponse } from "next/server";


export async function POST(request) {
    try {
        const BACKEND_URL = process.env.BACKEND_URL;
        const body = await request.json();
        const email = body.email;

        if (!BACKEND_URL) {
            return NextResponse.json({"message": "URL do back-end não encontrada"}, {status: 500})
        }

        if (!email) {
            return NextResponse.json({"message": "Email não encontrado"}, {status: 400})
        }

        const res = await fetch(`${BACKEND_URL}/auth/forgot-password`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({email})
        })

        const data = await res.json();

        return NextResponse.json(data);
        
    } catch (error) {

    }
}