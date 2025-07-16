import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("user_id")

    if (!userId) {
      return NextResponse.json({ error: "User ID é obrigatório" }, { status: 400 })
    }

    const supabase = await createClient()

    const { count, error } = await supabase
      .from("prompts")
      .select("*", { count: "exact", head: true })
      .eq("usuario_id", userId)

    if (error) {
      console.error("Error counting prompts:", error)
      return NextResponse.json({ error: "Erro ao contar prompts" }, { status: 500 })
    }

    return NextResponse.json({ count: count || 0 })
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
