import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    console.log("Register API: Starting registration process...")

    const { email, password, nome, plano = "free" } = await request.json()

    console.log("Register API: Registration data:", { email, nome, plano })

    if (!email || !password || !nome) {
      console.error("Register API: Missing required fields")
      return NextResponse.json({ error: "Dados obrigatórios não fornecidos" }, { status: 400 })
    }

    const supabase = await createClient()

    // 1. Criar usuário no Supabase Auth
    console.log("Register API: Creating auth user...")
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    })

    if (authError) {
      console.error("Register API: Auth error:", authError)
      return NextResponse.json({ error: authError.message }, { status: 400 })
    }

    if (!authData.user) {
      console.error("Register API: No user returned from auth")
      return NextResponse.json({ error: "Erro ao criar usuário" }, { status: 400 })
    }

    console.log("Register API: Auth user created:", authData.user.email)

    // 2. Buscar plano
    console.log("Register API: Fetching plan...")
    const { data: planoData, error: planoError } = await supabase.from("planos").select("id").eq("nome", plano).single()

    if (planoError || !planoData) {
      console.error("Register API: Plan error:", planoError)
      return NextResponse.json({ error: "Plano não encontrado" }, { status: 400 })
    }

    console.log("Register API: Plan found:", planoData.id)

    // 3. Criar usuário na tabela usuarios
    console.log("Register API: Creating user profile...")
    const { data: userData, error: userError } = await supabase
      .from("usuarios")
      .insert({
        auth_id: authData.user.id,
        nome,
        email,
        plano_id: planoData.id,
      })
      .select()
      .single()

    if (userError) {
      console.error("Register API: User profile error:", userError)
      return NextResponse.json({ error: "Erro ao criar perfil do usuário" }, { status: 400 })
    }

    console.log("Register API: User profile created:", userData.id)

    return NextResponse.json({
      success: true,
      message: "Usuário criado com sucesso",
      user: userData,
    })
  } catch (error) {
    console.error("Register API: Unexpected error:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
