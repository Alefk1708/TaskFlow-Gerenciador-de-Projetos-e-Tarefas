import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getUserFromToken } from "@/lib/auth/user";

export async function GET(Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;
        const BACKEND_URL = process.env.BACKEND_URL;
        const user = await getUserFromToken(token);

        if (!user) {
            return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
        }

        if (!token) {
            return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
        }

        if (!BACKEND_URL) {
            return NextResponse.json({ error: "Url do backend não encontrada" }, { status: 500 })
        }

        const res = await fetch(`${BACKEND_URL}/task/list/${user.id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `${token}`,
            },
        })

        const data = await res.json();

        return NextResponse.json(data);
    } catch (error) {
        console.log(error);
        return NextResponse.json("Erro ao conectar a api")
    }
}