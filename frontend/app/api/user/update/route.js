import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function PUT(request) {
  try {
    const BACKEND_URL = process.env.BACKEND_URL;
    const cookieStore = await cookies();
    const token = cookieStore?.get("token").value;
    const body = await request.json();
    const {name, email, password} = body;

    console.log(BACKEND_URL, token, body)

    if (!BACKEND_URL) {
      return NextResponse.json(
        { message: "URL do backend não encontrada" },
        { status: 500 }
      );
    }

    if (!token) {
      return NextResponse.json(
        { message: "Token não encontrado" },
        { status: 401 }
      );
    }

    const respose = await fetch(`${BACKEND_URL}/user/update`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({
        name,
        email,
        password,
      }),
    });

    if (!respose.ok) {
        return NextResponse.json(
          { message: "Erro com a api" },
          { status: 500 }
        )
    }

    const data = await respose.json();

    return NextResponse.json(data);

  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Erro ao atualizar usuário" },
      { status: 500 }
    );
  }
}
