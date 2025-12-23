import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getUserFromToken } from "@/lib/auth/user";

export async function GET(required) {
    try {
        const cookiesStore = await cookies();
        const token = cookiesStore.get("token");

        if (!token) {
            return NextResponse.json({ "erro": "token não encontrado" }, { status: 401 })
        }

        const user = getUserFromToken(token.value);

        if (!user) {
            return NextResponse.json({ "erro": "token inválido" }, { status: 401 })
        }

        return NextResponse.json(user);


    } catch (error) {
        console.log(error);
        return NextResponse.json({ "erro": error })
    }
}