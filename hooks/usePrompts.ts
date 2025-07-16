"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/hooks/useAuth"

interface Prompt {
  id: string
  titulo: string
  conteudo: string
  created_at: string
  updated_at: string
}

export function usePrompts() {
  const [prompts, setPrompts] = useState<Prompt[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()
  const supabase = createClient()

  useEffect(() => {
    if (!user) {
      setPrompts([])
      setLoading(false)
      return
    }

    fetchPrompts()
  }, [user])

  const fetchPrompts = async () => {
    try {
      setLoading(true)
      setError(null)

      // Primeiro, buscar o usuário na tabela usuarios
      const { data: userData, error: userError } = await supabase
        .from("usuarios")
        .select("id")
        .eq("auth_id", user?.id)
        .single()

      if (userError || !userData) {
        console.error("Error fetching user:", userError)
        setError("Erro ao buscar dados do usuário")
        return
      }

      // Buscar prompts do usuário
      const { data, error } = await supabase
        .from("prompts")
        .select("*")
        .eq("usuario_id", userData.id)
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching prompts:", error)
        setError("Erro ao carregar prompts")
        return
      }

      setPrompts(data || [])
    } catch (error) {
      console.error("Unexpected error:", error)
      setError("Erro inesperado")
    } finally {
      setLoading(false)
    }
  }

  return {
    prompts,
    loading,
    error,
    refetch: fetchPrompts,
  }
}
