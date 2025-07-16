import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { prompt_original, prompt_sugerido } = await request.json()

    if (!prompt_original || !prompt_sugerido) {
      return NextResponse.json({ error: "Prompt original e sugerido são obrigatórios" }, { status: 400 })
    }

    const supabase = await createClient()

    // Verificar se o usuário está autenticado
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession()

    if (sessionError || !session) {
      return NextResponse.json({ error: "Usuário não autenticado" }, { status: 401 })
    }

    // Criar o prompt
    const { data, error } = await supabase
      .from("prompts")
      .insert({
        usuario_id: session.user.id,
        prompt_original,
        prompt_sugerido,
        ativo: true,
      })
      .select()
      .single()

    if (error) {
      console.error("Create prompt error:", error)
      return NextResponse.json({ error: "Erro ao criar prompt" }, { status: 500 })
    }

    return NextResponse.json({ prompt: data })
  } catch (error) {
    console.error("Create prompt internal error:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
