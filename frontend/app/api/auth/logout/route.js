import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  try {
    const cookieStore = await cookies();

    cookieStore.delete("token", { path: "/" });

    return NextResponse.json(
      { message: "Logout realizado com sucesso" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Erro ao realizar logout" },
      { status: 500 }
    );
  }
}
