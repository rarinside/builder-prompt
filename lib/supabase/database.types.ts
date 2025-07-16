export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

// ⚠️ MUDANÇA: Tipos atualizados para nova arquitetura
export interface HostedDatabase {
  public: {
    Tables: {
      planos: {
        Row: {
          id: string
          nome: string
          limite_prompts: number | null
          preco: number
          descricao: string | null
          ativo: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          nome: string
          limite_prompts?: number | null
          preco?: number
          descricao?: string | null
          ativo?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          nome?: string
          limite_prompts?: number | null
          preco?: number
          descricao?: string | null
          ativo?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      usuarios: {
        Row: {
          id: string
          auth_id: string | null
          nome: string
          email: string
          plano_id: string
          email_verificado: boolean
          ativo: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          auth_id?: string | null
          nome: string
          email: string
          plano_id: string
          email_verificado?: boolean
          ativo?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          auth_id?: string | null
          nome?: string
          email?: string
          plano_id?: string
          email_verificado?: boolean
          ativo?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}

export interface SelfHostedDatabase {
  public: {
    Tables: {
      prompts: {
        Row: {
          id: string
          user_id: string // ⚠️ MUDANÇA: Referência ao usuário do hospedado
          prompt_original: string
          prompt_sugerido: string
          ativo: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          prompt_original: string
          prompt_sugerido: string
          ativo?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          prompt_original?: string
          prompt_sugerido?: string
          ativo?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      assinaturas: {
        Row: {
          id: string
          user_id: string // ⚠️ MUDANÇA: Referência ao usuário do hospedado
          plano_id: string // ⚠️ MUDANÇA: Referência ao plano do hospedado
          data_inicio: string
          data_vencimento: string
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          plano_id: string
          data_inicio?: string
          data_vencimento: string
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          plano_id?: string
          data_inicio?: string
          data_vencimento?: string
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}

export interface Database {
  promptbuilder: {
    Tables: {
      planos: {
        Row: {
          id: string
          nome: string
          limite_prompts: number | null
          preco: number
          descricao: string | null
          ativo: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          nome: string
          limite_prompts?: number | null
          preco?: number
          descricao?: string | null
          ativo?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          nome?: string
          limite_prompts?: number | null
          preco?: number
          descricao?: string | null
          ativo?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      usuarios: {
        Row: {
          id: string
          auth_id: string | null
          nome: string
          email: string
          plano_id: string
          email_verificado: boolean
          ativo: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          auth_id?: string | null
          nome: string
          email: string
          plano_id: string
          email_verificado?: boolean
          ativo?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          auth_id?: string | null
          nome?: string
          email?: string
          plano_id?: string
          email_verificado?: boolean
          ativo?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      prompts: {
        Row: {
          id: string
          user_id: string
          prompt_original: string
          prompt_sugerido: string
          ativo: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          prompt_original: string
          prompt_sugerido: string
          ativo?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          prompt_original?: string
          prompt_sugerido?: string
          ativo?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      assinaturas: {
        Row: {
          id: string
          user_id: string
          plano_id: string
          data_inicio: string
          data_vencimento: string
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          plano_id: string
          data_inicio?: string
          data_vencimento: string
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          plano_id?: string
          data_inicio?: string
          data_vencimento?: string
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      usuarios_completos: {
        Row: {
          id: string
          auth_id: string | null
          nome: string
          email: string
          email_verificado: boolean
          ativo: boolean
          created_at: string
          updated_at: string
          plano_nome: string
          limite_prompts: number | null
          plano_preco: number
          tem_assinatura_ativa: boolean
          prompts_utilizados: number
        }
      }
      dashboard_usuario: {
        Row: {
          user_id: string
          nome: string
          email: string
          plano_nome: string
          limite_prompts: number | null
          total_prompts: number
          prompts_hoje: number
          prompts_semana: number
          prompts_mes: number
          ultimo_prompt_criado: string | null
          uso_limite: string
          percentual_usado: number | null
          status_assinatura: string
          vencimento_assinatura: string | null
        }
      }
    }
    Functions: {
      has_active_subscription: {
        Args: { user_uuid: string }
        Returns: boolean
      }
      buscar_prompts_usuario: {
        Args: {
          user_uuid: string
          busca_texto?: string
          limite?: number
          offset_valor?: number
          ordenar_por?: string
          ordem?: string
        }
        Returns: {
          id: string
          prompt_original: string
          prompt_sugerido: string
          created_at: string
          updated_at: string
          data_criacao_formatada: string
          caracteres_original: number
          caracteres_sugerido: number
          total_registros: number
        }[]
      }
    }
  }
  public: {
    Tables: {
      planos: {
        Row: {
          id: string
          nome: string
          limite_prompts: number | null
          preco: number
          descricao: string | null
          ativo: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          nome: string
          limite_prompts?: number | null
          preco?: number
          descricao?: string | null
          ativo?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          nome?: string
          limite_prompts?: number | null
          preco?: number
          descricao?: string | null
          ativo?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      usuarios: {
        Row: {
          id: string
          auth_id: string | null
          nome: string
          email: string
          plano_id: string
          email_verificado: boolean
          ativo: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          auth_id?: string | null
          nome: string
          email: string
          plano_id: string
          email_verificado?: boolean
          ativo?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          auth_id?: string | null
          nome?: string
          email?: string
          plano_id?: string
          email_verificado?: boolean
          ativo?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      prompts: {
        Row: {
          id: string
          user_id: string // Referência ao ID do usuário no Supabase hospedado
          prompt_original: string
          prompt_sugerido: string
          ativo: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          prompt_original: string
          prompt_sugerido: string
          ativo?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          prompt_original?: string
          prompt_sugerido?: string
          ativo?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      assinaturas: {
        Row: {
          id: string
          user_id: string // Referência ao ID do usuário no Supabase hospedado
          plano_id: string // Referência ao plano do hospedado
          data_inicio: string
          data_vencimento: string
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          plano_id: string
          data_inicio?: string
          data_vencimento: string
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          plano_id?: string
          data_inicio?: string
          data_vencimento?: string
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
