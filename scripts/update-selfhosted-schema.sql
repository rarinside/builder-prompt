-- =============================================
-- ATUALIZAR SCHEMA SELF-HOSTED
-- Execute no SEU SUPABASE SELF-HOSTED
-- =============================================

-- ⚠️ MUDANÇA: Remover tabelas que agora estão no hospedado
-- (Mantenha os dados de prompts e assinaturas)

-- 1. Atualizar referências para usar user_id diretamente
-- (Os prompts já devem ter user_id, só precisamos garantir que está correto)

-- 2. Remover schema promptbuilder se existir (migrar para public)
-- Primeiro, mover dados se necessário:

-- Migrar prompts se estiverem no schema promptbuilder
INSERT INTO public.prompts (id, user_id, prompt_original, prompt_sugerido, ativo, created_at, updated_at)
SELECT id, user_id, prompt_original, prompt_sugerido, ativo, created_at, updated_at
FROM promptbuilder.prompts
WHERE NOT EXISTS (SELECT 1 FROM public.prompts WHERE public.prompts.id = promptbuilder.prompts.id);

-- Migrar assinaturas se estiverem no schema promptbuilder
INSERT INTO public.assinaturas (id, user_id, plano_id, data_inicio, data_vencimento, status, created_at, updated_at)
SELECT id, user_id, plano_id, data_inicio, data_vencimento, status, created_at, updated_at
FROM promptbuilder.assinaturas
WHERE NOT EXISTS (SELECT 1 FROM public.assinaturas WHERE public.assinaturas.id = promptbuilder.assinaturas.id);

-- 3. Garantir que as tabelas existem no schema public
CREATE TABLE IF NOT EXISTS public.prompts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL, -- Referência ao ID do usuário no Supabase hospedado
    prompt_original TEXT NOT NULL,
    prompt_sugerido TEXT NOT NULL,
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL
);

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

-- 4. Atualizar políticas RLS
ALTER TABLE public.prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assinaturas ENABLE ROW LEVEL SECURITY;

-- Políticas mais permissivas (controle será feito na aplicação)
DROP POLICY IF EXISTS "Usuarios podem ver apenas seus próprios prompts" ON public.prompts;
DROP POLICY IF EXISTS "Usuarios podem ver apenas suas próprias assinaturas" ON public.assinaturas;

CREATE POLICY "Acesso controlado por aplicação - prompts"
  ON public.prompts
  FOR ALL USING (true);

CREATE POLICY "Acesso controlado por aplicação - assinaturas"
  ON public.assinaturas
  FOR ALL USING (true);

-- 5. Índices para performance
CREATE INDEX IF NOT EXISTS idx_prompts_user_id ON public.prompts(user_id);
CREATE INDEX IF NOT EXISTS idx_prompts_created_at ON public.prompts(created_at);
CREATE INDEX IF NOT EXISTS idx_assinaturas_user_id ON public.assinaturas(user_id);
CREATE INDEX IF NOT EXISTS idx_assinaturas_status ON public.assinaturas(status);

SELECT 'Schema self-hosted atualizado!' as status;
