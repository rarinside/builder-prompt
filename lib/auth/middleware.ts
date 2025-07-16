import { createServerClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function authMiddleware(request: NextRequest) {
  try {
    const supabase = createServerClient()

    // Verificar se o usuário está autenticado
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession()

    if (error) {
      console.error("Auth middleware error:", error)
      return NextResponse.redirect(new URL("/auth/login", request.url))
    }

    if (!session) {
      return NextResponse.redirect(new URL("/auth/login", request.url))
    }

    // Verificar se o usuário existe no banco
    const { data: usuario, error: userError } = await supabase
      .from("usuarios")
      .select("*")
      .eq("auth_id", session.user.id)
      .single()

    if (userError || !usuario) {
      console.error("User not found in database:", userError)
      return NextResponse.redirect(new URL("/auth/setup", request.url))
    }

    // Adicionar headers com informações do usuário
    const response = NextResponse.next()
    response.headers.set("x-user-id", usuario.id)
    response.headers.set("x-user-email", usuario.email)
    response.headers.set("x-user-plan", usuario.plano_id)

    return response
  } catch (error) {
    console.error("Auth middleware error:", error)
    return NextResponse.redirect(new URL("/auth/login", request.url))
  }
}
