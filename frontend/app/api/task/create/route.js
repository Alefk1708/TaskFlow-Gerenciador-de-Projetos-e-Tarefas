import { NextResponse } from "next/server";
import { getUserFromToken } from "@/lib/auth/user";
import { cookies } from "next/headers";

export async function POST(request) {
    try {
        const cookieStore = await cookies();
        const body = await request.json();
        const { title, descricao, priority } = body;

        if (!title || !descricao || !priority) {
            return NextResponse.json({ error: "Dados incompletos" }, { status: 400 });
        }

        const BACKEND_URL = process.env.BACKEND_URL;

        if (!BACKEND_URL) {
            return NextResponse.json({ error: "URL do backend não definida" }, { status: 500 });
        }

        const token = cookieStore.get("token")?.value;

        if (!token) {
            return NextResponse.json({ error: "Token não encontrado" }, { status: 401 });
        }

        const user = await getUserFromToken(token);
       
        if (!user?.id) {
            return NextResponse.json({ error: "Usuário não encontrado" }, { status: 401 });
        }

        const res = await fetch(`${BACKEND_URL}/task/create/${user.id}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": token
                },
                body: JSON.stringify({ title, descricao, priority })
            }
        )

        const data = await res.json();

        return NextResponse.json(data, { status: res.status });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}