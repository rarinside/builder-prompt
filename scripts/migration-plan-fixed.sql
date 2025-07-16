-- =============================================
-- MIGRAÇÃO CORRIGIDA PARA SUPABASE HOSPEDADO
-- (Pode ser executado múltiplas vezes sem erro)
-- =============================================

-- Habilitar extensão uuid-ossp
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- TABELA PLANOS (HOSPEDADO)
-- =============================================
CREATE TABLE IF NOT EXISTS public.planos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome VARCHAR(50) NOT NULL UNIQUE,
    limite_prompts INTEGER, -- NULL significa ilimitado
    preco DECIMAL(10,2) DEFAULT 0.00,
    descricao TEXT,
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL
);

-- =============================================
-- TABELA USUARIOS (HOSPEDADO)
-- =============================================
CREATE TABLE IF NOT EXISTS public.usuarios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    auth_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    plano_id UUID REFERENCES public.planos(id) NOT NULL,
    email_verificado BOOLEAN DEFAULT false,
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL
);

-- =============================================
-- INSERIR PLANOS PADRÃO (HOSPEDADO)
-- =============================================
INSERT INTO public.planos (nome, limite_prompts, preco, descricao) 
SELECT 'Free', 3, 0.00, 'Plano gratuito com limite de 3 prompts'
WHERE NOT EXISTS (SELECT 1 FROM public.planos WHERE nome = 'Free');

INSERT INTO public.planos (nome, limite_prompts, preco, descricao) 
SELECT 'Pro', NULL, 199.00, 'Plano profissional com prompts ilimitados'
WHERE NOT EXISTS (SELECT 1 FROM public.planos WHERE nome = 'Pro');

INSERT INTO public.planos (nome, limite_prompts, preco, descricao) 
SELECT 'Alunos', NULL, 0.00, 'Plano para alunos com acesso completo'
WHERE NOT EXISTS (SELECT 1 FROM public.planos WHERE nome = 'Alunos');

-- =============================================
-- POLÍTICAS RLS (HOSPEDADO) - REMOVER EXISTENTES PRIMEIRO
-- =============================================
ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.planos ENABLE ROW LEVEL SECURITY;

-- Remover políticas existentes se existirem
DROP POLICY IF EXISTS "Usuarios podem ver apenas seus próprios dados" ON public.usuarios;
DROP POLICY IF EXISTS "Todos podem ler os planos" ON public.planos;

-- Criar políticas
CREATE POLICY "Usuarios podem ver apenas seus próprios dados"
  ON public.usuarios
  FOR ALL USING (auth.uid() = auth_id);

CREATE POLICY "Todos podem ler os planos"
  ON public.planos
  FOR SELECT USING (true);

-- =============================================
-- ÍNDICES (HOSPEDADO)
-- =============================================
CREATE INDEX IF NOT EXISTS idx_usuarios_auth_id ON public.usuarios(auth_id);
CREATE INDEX IF NOT EXISTS idx_usuarios_email ON public.usuarios(email);
CREATE INDEX IF NOT EXISTS idx_usuarios_plano_id ON public.usuarios(plano_id);

-- =============================================
-- FUNÇÃO PARA ATUALIZAR UPDATED_AT (HOSPEDADO)
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
-- TRIGGERS (HOSPEDADO) - REMOVER EXISTENTES PRIMEIRO
-- =============================================
DROP TRIGGER IF EXISTS update_planos_updated_at ON public.planos;
DROP TRIGGER IF EXISTS update_usuarios_updated_at ON public.usuarios;

CREATE TRIGGER update_planos_updated_at
    BEFORE UPDATE ON public.planos
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_usuarios_updated_at
    BEFORE UPDATE ON public.usuarios
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- VERIFICAÇÃO FINAL
-- =============================================
SELECT 'Supabase hospedado configurado com sucesso!' as status;

-- Mostrar planos criados
SELECT 
    nome as "Plano",
    CASE 
        WHEN limite_prompts IS NULL THEN 'Ilimitado'
        ELSE limite_prompts::text
    END as "Limite Prompts",
    CONCAT('R$ ', preco) as "Preço"
FROM public.planos 
ORDER BY preco;

-- Verificar tabelas criadas
SELECT 
    table_name as "Tabela Criada"
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('planos', 'usuarios')
ORDER BY table_name;

-- Verificar políticas RLS
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies 
WHERE schemaname = 'public' 
  AND tablename IN ('planos', 'usuarios');
