import { createServerClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient()

    // Verificar autenticação
    const {
      data: { session },
      error: authError,
    } = await supabase.auth.getSession()

    if (authError || !session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    // Buscar dados do usuário
    const { data: usuario, error: userError } = await supabase
      .from("usuarios")
      .select("id")
      .eq("auth_id", session.user.id)
      .single()

    if (userError || !usuario) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 })
    }

    // Buscar dados do dashboard
    const { data: dashboardData, error: dashboardError } = await supabase
      .from("dashboard_usuario")
      .select("*")
      .eq("user_id", usuario.id)
      .single()

    if (dashboardError) {
      console.error("Dashboard error:", dashboardError)
      return NextResponse.json({ error: "Erro ao buscar dados do dashboard" }, { status: 500 })
    }

    return NextResponse.json({
      dashboard: dashboardData,
    })
  } catch (error) {
    console.error("Dashboard API error:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
