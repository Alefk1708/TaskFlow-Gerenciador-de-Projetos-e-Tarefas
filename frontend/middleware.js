import { NextResponse } from "next/server"
import { jwtDecode } from "jwt-decode"
import { cookies } from "next/headers"

export async function middleware(request) {
  const { pathname } = request.nextUrl
  const cookiesStore = await cookies()

  const PUBLIC_ROUTES = ["/login", "/register"]
  const isPublicRoute = PUBLIC_ROUTES.includes(pathname)

  const token = request.cookies.get("token")?.value
  const tokenVerify = request.cookies.get("tokenVerify")?.value

  /**
   * 🔹 FLUXO DE VERIFICAÇÃO DE EMAIL
   */
  if (tokenVerify) {
    if (pathname !== "/verify") {
      return NextResponse.redirect(new URL("/verify", request.url))
    }
    return NextResponse.next()
  }

  /**
   * 🔹 USUÁRIO LOGADO
   */
  if (token) {
    // Usuário logado NÃO pode acessar login/register
    if (isPublicRoute) {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }

    // Valida JWT
    if (!token.startsWith("Bearer ")) {
      return NextResponse.redirect(new URL("/login", request.url))
    }

    try {
      const jwt = token.replace("Bearer ", "")
      const decoded = jwtDecode(jwt)

      if (decoded.exp * 1000 < Date.now()) {
        cookiesStore.delete("token")
        cookiesStore.delete("email")
        return NextResponse.redirect(new URL("/login", request.url))
      }

      return NextResponse.next()
    } catch {
      return NextResponse.redirect(new URL("/login", request.url))
    }
  }

  if (!token && !isPublicRoute) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!api|_next|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|webp|gif|ico|css|js|woff|woff2|ttf)).*)",
  ],
}
