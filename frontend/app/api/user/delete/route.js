import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function DELETE(request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token").value;
    const BACKEND_URL = process.env.BACKEND_URL;

    if (!token) {
      return NextResponse.json(
        { message: "Token não encontrado" },
        { status: 401 }
      );
    }

    if (!BACKEND_URL) {
      return NextResponse.json(
        { message: "URL não encontrada" },
        { status: 401 }
      );
    }

    const respose = await fetch(`${BACKEND_URL}/user/delete`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });

    if (!respose.ok) {
      return NextResponse.json({"message": "Erro ao comunicar com a api"}, {status: 500})
    }

    const data = await respose.json();

    cookieStore.delete("token", { path: "/" });

    return NextResponse.json(data);

  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Erro ao iniciar sessão" });
  }
}
