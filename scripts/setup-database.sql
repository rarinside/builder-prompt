-- ⚠️ EXECUTE ESTE SCRIPT PRIMEIRO NO SUPABASE SQL EDITOR ⚠️
-- 
-- 1. Acesse o Supabase Dashboard
-- 2. Vá em "SQL Editor" 
-- 3. Cole este código completo
-- 4. Clique em "Run" para executar
-- 5. Verifique se aparece "Schema e tabelas criados com sucesso!"

-- Schema PromptBuilder para Supabase
-- Criação do esquema
CREATE SCHEMA IF NOT EXISTS promptbuilder;

-- Habilitar extensão uuid-ossp se não estiver habilitada
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- TABELA PLANOS
-- =============================================
CREATE TABLE IF NOT EXISTS promptbuilder.planos (
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
-- TABELA USUARIOS
-- =============================================
CREATE TABLE IF NOT EXISTS promptbuilder.usuarios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    auth_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    plano_id UUID REFERENCES promptbuilder.planos(id) NOT NULL,
    email_verificado BOOLEAN DEFAULT false,
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL
);

-- =============================================
-- TABELA ASSINATURAS
-- =============================================
CREATE TABLE IF NOT EXISTS promptbuilder.assinaturas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES promptbuilder.usuarios(id) ON DELETE CASCADE NOT NULL,
    plano_id UUID REFERENCES promptbuilder.planos(id) NOT NULL,
    data_inicio DATE NOT NULL DEFAULT CURRENT_DATE,
    data_vencimento DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'ativa' CHECK (status IN ('ativa','cancelada','expirada','pendente')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL
);

-- =============================================
-- TABELA PROMPTS
-- =============================================
CREATE TABLE IF NOT EXISTS promptbuilder.prompts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES promptbuilder.usuarios(id) ON DELETE CASCADE NOT NULL,
    prompt_original TEXT NOT NULL,
    prompt_sugerido TEXT NOT NULL,
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL
);

-- =============================================
-- INSERIR PLANOS PADRÃO (apenas se não existirem)
-- =============================================
INSERT INTO promptbuilder.planos (nome, limite_prompts, preco, descricao) 
SELECT 'Free', 3, 0.00, 'Plano gratuito com limite de 3 prompts'
WHERE NOT EXISTS (SELECT 1 FROM promptbuilder.planos WHERE nome = 'Free');

INSERT INTO promptbuilder.planos (nome, limite_prompts, preco, descricao) 
SELECT 'Pro', NULL, 199.00, 'Plano profissional com prompts ilimitados'
WHERE NOT EXISTS (SELECT 1 FROM promptbuilder.planos WHERE nome = 'Pro');

INSERT INTO promptbuilder.planos (nome, limite_prompts, preco, descricao) 
SELECT 'Alunos', NULL, 0.00, 'Plano para alunos com acesso completo'
WHERE NOT EXISTS (SELECT 1 FROM promptbuilder.planos WHERE nome = 'Alunos');

-- =============================================
-- POLÍTICAS RLS
-- =============================================
ALTER TABLE promptbuilder.usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE promptbuilder.prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE promptbuilder.assinaturas ENABLE ROW LEVEL SECURITY;
ALTER TABLE promptbuilder.planos ENABLE ROW LEVEL SECURITY;

-- Remover políticas existentes se existirem
DROP POLICY IF EXISTS "Usuarios podem ver apenas seus próprios dados" ON promptbuilder.usuarios;
DROP POLICY IF EXISTS "Usuarios podem ver apenas seus próprios prompts" ON promptbuilder.prompts;
DROP POLICY IF EXISTS "Usuarios podem ver apenas suas próprias assinaturas" ON promptbuilder.assinaturas;
DROP POLICY IF EXISTS "Todos podem ler os planos" ON promptbuilder.planos;

-- Criar políticas
CREATE POLICY "Usuarios podem ver apenas seus próprios dados"
  ON promptbuilder.usuarios
  FOR ALL USING (auth.uid() = auth_id);

CREATE POLICY "Usuarios podem ver apenas seus próprios prompts"
  ON promptbuilder.prompts
  FOR ALL USING (
    user_id IN (
      SELECT id FROM promptbuilder.usuarios WHERE auth_id = auth.uid()
    )
  );

CREATE POLICY "Usuarios podem ver apenas suas próprias assinaturas"
  ON promptbuilder.assinaturas
  FOR ALL USING (
    user_id IN (
      SELECT id FROM promptbuilder.usuarios WHERE auth_id = auth.uid()
    )
  );

CREATE POLICY "Todos podem ler os planos"
  ON promptbuilder.planos
  FOR SELECT USING (true);

-- =============================================
-- VERIFICAÇÃO FINAL
-- =============================================
-- Verificar se tudo foi criado corretamente
SELECT 'Schema e tabelas criados com sucesso!' as status;

-- Mostrar planos criados
SELECT 
    nome as "Plano",
    CASE 
        WHEN limite_prompts IS NULL THEN 'Ilimitado'
        ELSE limite_prompts::text
    END as "Limite Prompts",
    CONCAT('R$ ', preco) as "Preço"
FROM promptbuilder.planos 
ORDER BY preco;

-- Verificar tabelas criadas
SELECT 
    table_name as "Tabela Criada"
FROM information_schema.tables 
WHERE table_schema = 'promptbuilder'
ORDER BY table_name;
