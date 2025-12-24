import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function DELETE(request, {params}) {
    try {
        const { id } = await params;
        const cookieStore = await cookies();
        const token = cookieStore.get("token").value;
        const BACKEND_URL = process.env.BACKEND_URL;

        if (!token) {
            return NextResponse.json({"message": "Token não encontrado"}, {status: 401})
        }

        console.log(token)

        if (!id) {
            return NextResponse.json({"message": "ID não encontrado"}, {status: 400})
        }

        if(!BACKEND_URL) {
            return NextResponse.json({"message": "URL não encontrada"}, {status: 400})
        }

        const res = await fetch(`${BACKEND_URL}/task/delete/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            }
        })

        const data = await res.json();
        return NextResponse.json(data);

    } catch (error) {
        console.log(error);
        return NextResponse.json({"message": "Erro ao deletar tarefa"}, {status: 500})
    }
}