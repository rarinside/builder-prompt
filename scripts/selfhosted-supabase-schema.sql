-- =============================================
-- SCHEMA PARA SUPABASE SELF-HOSTED
-- (Prompts + Assinaturas)
-- =============================================

-- Habilitar extensão uuid-ossp se não estiver habilitada
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- TABELA PROMPTS
-- =============================================
CREATE TABLE IF NOT EXISTS public.prompts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL, -- Referência ao ID do usuário no Supabase hospedado
    prompt_original TEXT NOT NULL,
    prompt_sugerido TEXT NOT NULL,
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL
);

-- =============================================
-- TABELA ASSINATURAS
-- =============================================
CREATE TABLE IF NOT EXISTS public.assinaturas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL, -- Referência ao ID do usuário no Supabase hospedado
    plano_id UUID NOT NULL, -- Referência ao ID do plano no Supabase hospedado
    data_inicio DATE NOT NULL DEFAULT CURRENT_DATE,
    data_vencimento DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'ativa' CHECK (status IN ('ativa','cancelada','expirada','pendente')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL
);

-- =============================================
-- POLÍTICAS RLS
-- =============================================
ALTER TABLE public.prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assinaturas ENABLE ROW LEVEL SECURITY;

-- Remover políticas existentes se existirem
DROP POLICY IF EXISTS "Usuarios podem ver apenas seus próprios prompts" ON public.prompts;
DROP POLICY IF EXISTS "Usuarios podem ver apenas suas próprias assinaturas" ON public.assinaturas;

-- Criar políticas (usando user_id diretamente)
CREATE POLICY "Usuarios podem ver apenas seus próprios prompts"
  ON public.prompts
  FOR ALL USING (true); -- Controle será feito na aplicação

CREATE POLICY "Usuarios podem ver apenas suas próprias assinaturas"
  ON public.assinaturas
  FOR ALL USING (true); -- Controle será feito na aplicação

-- =============================================
-- ÍNDICES PARA PERFORMANCE
-- =============================================
CREATE INDEX IF NOT EXISTS idx_prompts_user_id ON public.prompts(user_id);
CREATE INDEX IF NOT EXISTS idx_prompts_created_at ON public.prompts(created_at);
CREATE INDEX IF NOT EXISTS idx_assinaturas_user_id ON public.assinaturas(user_id);
CREATE INDEX IF NOT EXISTS idx_assinaturas_status ON public.assinaturas(status);
CREATE INDEX IF NOT EXISTS idx_assinaturas_vencimento ON public.assinaturas(data_vencimento);

-- =============================================
-- FUNÇÃO PARA ATUALIZAR UPDATED_AT
-- =============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at := timezone('utc', now());
    RETURN NEW;
END;
$$;

-- =============================================
-- TRIGGERS PARA UPDATED_AT
-- =============================================
CREATE TRIGGER update_prompts_updated_at
    BEFORE UPDATE ON public.prompts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_assinaturas_updated_at
    BEFORE UPDATE ON public.assinaturas
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

SELECT 'Schema self-hosted criado com sucesso!' as status;
