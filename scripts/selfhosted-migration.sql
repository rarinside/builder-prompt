-- =============================================
-- PARTE 2: EXECUTE NO SELF-HOSTED
-- =============================================

-- Migrar dados do schema promptbuilder para public
-- Manter apenas Prompts + Assinaturas

-- Habilitar extensão uuid-ossp
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- MIGRAR PROMPTS PARA PUBLIC
-- =============================================
CREATE TABLE IF NOT EXISTS public.prompts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL, -- ⚠️ MUDANÇA: Agora referencia usuário do hospedado
    prompt_original TEXT NOT NULL,
    prompt_sugerido TEXT NOT NULL,
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL
);

-- Migrar dados existentes se existirem
INSERT INTO public.prompts (id, user_id, prompt_original, prompt_sugerido, ativo, created_at, updated_at)
SELECT id, user_id, prompt_original, prompt_sugerido, ativo, created_at, updated_at
FROM promptbuilder.prompts
WHERE NOT EXISTS (SELECT 1 FROM public.prompts WHERE public.prompts.id = promptbuilder.prompts.id)
ON CONFLICT (id) DO NOTHING;

-- =============================================
-- MIGRAR ASSINATURAS PARA PUBLIC
-- =============================================
CREATE TABLE IF NOT EXISTS public.assinaturas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL, -- ⚠️ MUDANÇA: Agora referencia usuário do hospedado
    plano_id UUID NOT NULL, -- ⚠️ MUDANÇA: Agora referencia plano do hospedado
    data_inicio DATE NOT NULL DEFAULT CURRENT_DATE,
    data_vencimento DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'ativa' CHECK (status IN ('ativa','cancelada','expirada','pendente')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL
);

-- Migrar dados existentes se existirem
INSERT INTO public.assinaturas (id, user_id, plano_id, data_inicio, data_vencimento, status, created_at, updated_at)
SELECT id, user_id, plano_id, data_inicio, data_vencimento, status, created_at, updated_at
FROM promptbuilder.assinaturas
WHERE NOT EXISTS (SELECT 1 FROM public.assinaturas WHERE public.assinaturas.id = promptbuilder.assinaturas.id)
ON CONFLICT (id) DO NOTHING;

-- =============================================
-- POLÍTICAS RLS SIMPLIFICADAS (SELF-HOSTED)
-- =============================================
ALTER TABLE public.prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assinaturas ENABLE ROW LEVEL SECURITY;

-- ⚠️ MUDANÇA: Políticas mais permissivas (controle via aplicação)
CREATE POLICY "Acesso controlado por aplicação - prompts"
  ON public.prompts
  FOR ALL USING (true);

CREATE POLICY "Acesso controlado por aplicação - assinaturas"
  ON public.assinaturas
  FOR ALL USING (true);

-- =============================================
-- ÍNDICES (SELF-HOSTED)
-- =============================================
CREATE INDEX IF NOT EXISTS idx_prompts_user_id ON public.prompts(user_id);
CREATE INDEX IF NOT EXISTS idx_prompts_created_at ON public.prompts(created_at);
CREATE INDEX IF NOT EXISTS idx_assinaturas_user_id ON public.assinaturas(user_id);
CREATE INDEX IF NOT EXISTS idx_assinaturas_status ON public.assinaturas(status);
CREATE INDEX IF NOT EXISTS idx_assinaturas_vencimento ON public.assinaturas(data_vencimento);

-- =============================================
-- FUNÇÃO PARA ATUALIZAR UPDATED_AT (SELF-HOSTED)
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
-- TRIGGERS (SELF-HOSTED)
-- =============================================
CREATE TRIGGER update_prompts_updated_at
    BEFORE UPDATE ON public.prompts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_assinaturas_updated_at
    BEFORE UPDATE ON public.assinaturas
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- FUNÇÃO PARA ATUALIZAR ASSINATURAS EXPIRADAS
-- =============================================
CREATE OR REPLACE FUNCTION update_expired_subscriptions()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE public.assinaturas
    SET status = 'expirada'
    WHERE status = 'ativa'
      AND data_vencimento < CURRENT_DATE;
END;
$$;

SELECT 'Self-hosted migrado!' as status;
