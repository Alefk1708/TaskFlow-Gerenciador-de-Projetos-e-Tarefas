import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getUserFromToken } from "@/lib/auth/user";

export async function PUT(request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const body = await request.json();
    const {title, descricao, priority, done, id} = body;
    const user = await getUserFromToken(token);


    if (!token) {
        return NextResponse.json({"message": "Token não encontrado"}, {status: 401})
    }

    const BACKEND_URL = process.env.BACKEND_URL;

    if (!BACKEND_URL) {
        return NextResponse.json({"message": "URL não encontrada"}, {status: 500})
    }

    if (!user) {
        return NextResponse.json({"message": "Usuário não encontrado"}, {status: 401})
    }

    if (!id) {
        return NextResponse.json({"message": "ID não encontrado"}, {status: 400})
    }


    const res = await fetch(`${BACKEND_URL}/task/update/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": token
        },
        body: JSON.stringify({
            title,
            descricao,
            priority,
            done
        })

    })

    const data = await res.json();

    return NextResponse.json({"message": data}, {status: 200});
 
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { erro: "Erro ao comunicar com api", error },
      { status: 500 }
    );
  }
}
